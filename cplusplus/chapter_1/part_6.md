# C++ Object-Oriented Programming Study Material (Continued)

---

## TOPIC: Destructors and Virtual Destructors - Advanced Concepts

### THEORY_SECTION: Virtual Destructors in Polymorphic Hierarchies

#### Why Virtual Destructors Matter

When deleting a derived class object through a base class pointer, the **destructor must be virtual** to ensure proper cleanup of the entire object hierarchy.

**Without virtual destructor:**
- Only the base class destructor is called
- Derived class resources are leaked
- Results in undefined behavior

**With virtual destructor:**
- Full destructor chain executes (derived to base)
- All resources properly cleaned up
- Safe polymorphic deletion

#### Pure Virtual Destructors

A **pure virtual destructor** makes a class abstract while still requiring a destructor body to be defined.

```cpp
class AbstractBase {
public:
    virtual ~AbstractBase() = 0;  // Declaration
};

AbstractBase::~AbstractBase() {}  // ✅ Definition required
```

**Critical rule:** Even though pure virtual, the destructor **must have a definition** because base destructors are always called during object destruction.

#### Destructor Execution Order

Destructors execute in **reverse order** of construction:
1. Derived class destructor body
2. Member destructors (reverse declaration order)
3. Base class destructor body

### EDGE_CASES: Destructor and Virtual Destructor Pitfalls

#### Deleting Derived Object Without Virtual Destructor

```cpp
struct Base {
    ~Base() { std::cout << "Base\n"; }  // ❌ Not virtual
};

struct Derived : public Base {
    int* data;
    ~Derived() { 
        delete data;  // Never called!
        std::cout << "Derived\n"; 
    }
};

int main() {
    Base* b = new Derived;
    delete b;  // ❌ Only Base::~Base() runs - memory leak!
}
```

**Undefined behavior:** Derived destructor never runs, causing resource leaks and potential memory corruption.

#### Virtual Destructor Adds vptr Overhead

```cpp
struct WithoutVirtual {
    ~WithoutVirtual() = default;
};

struct WithVirtual {
    virtual ~WithVirtual() = default;
};

// sizeof(WithoutVirtual) = 1 (empty class optimization)
// sizeof(WithVirtual) = 8 (includes vptr on 64-bit systems)
```

Virtual destructors introduce vtable overhead even if the class has no other virtual functions.

#### Pure Virtual Destructor Without Definition

```cpp
class Abstract {
public:
    virtual ~Abstract() = 0;  // Declaration
};

// ❌ Missing definition causes linker error
// Abstract::~Abstract() {}  // Must provide this

class Concrete : public Abstract {
    // Even if Concrete is instantiated, linker fails
};
```

**Linker error:** The base class destructor is always called, so it must have a definition even if pure virtual.

#### Smart Pointers and Non-Virtual Destructors

```cpp
struct Base {
    ~Base() { std::cout << "Base\n"; }  // Not virtual
};

struct Derived : public Base {
    ~Derived() { std::cout << "Derived\n"; }
};

int main() {
    std::shared_ptr<Base> ptr = std::make_shared<Derived>();
    // ❌ When ptr goes out of scope, only Base::~Base() called
}
```

Even with smart pointers, non-virtual destructors in polymorphic hierarchies cause undefined behavior.

#### Deleted or Private Destructors for Lifetime Control

```cpp
class HeapOnly {
    ~HeapOnly() = delete;  // Prevent destruction
public:
    static HeapOnly* create() { return new HeapOnly(); }
    void destroy() { delete this; }
private:
    HeapOnly() = default;
};

// HeapOnly obj;  // ❌ Error: cannot create on stack
HeapOnly* obj = HeapOnly::create();  // ✅ OK
obj->destroy();  // ✅ Controlled destruction
```

Deleted destructors enforce heap-only allocation and controlled lifetime management.

#### Trivial vs Non-Trivial Destructors

```cpp
struct Trivial {
    int x;
    // Compiler-generated destructor is trivial
};

struct NonTrivial {
    int* p;
    ~NonTrivial() { delete p; }  // User-defined = non-trivial
};
```

**Impact:**
- Trivial destructors enable optimizations (memcpy, POD types)
- Non-trivial destructors affect move semantics and compiler optimizations
- Affects `std::is_trivially_destructible` trait

---

## TOPIC: Object Slicing - Advanced Concepts

### THEORY_SECTION: Object Slicing Fundamentals

#### What is Object Slicing?

**Object slicing** occurs when a derived class object is assigned or passed by value to a base class object, resulting in the loss of derived class members and virtual function overrides.

**When slicing occurs:**
- Pass by value to base class
- Assignment of derived to base
- Returning derived by value as base
- Inserting derived objects into base class containers

**Consequences:**
- Derived class members are lost
- Virtual function dispatch is disabled
- Polymorphism is defeated
- Often leads to subtle bugs

### EDGE_CASES: Object Slicing Pitfalls

#### Slicing During Function Parameter Passing

```cpp
struct Base {
    int x = 1;
    virtual void show() { std::cout << "Base\n"; }
};

struct Derived : public Base {
    int y = 2;
    void show() override { std::cout << "Derived\n"; }
};

void process(Base b) {  // ❌ Pass by value causes slicing
    b.show();  // Prints "Base", not "Derived"
    // y member is lost
}

int main() {
    Derived d;
    process(d);  // Slicing occurs here
}
```

**Fix:** Pass by reference or pointer: `void process(Base& b)` or `void process(Base* b)`

#### Slicing in Assignment Operations

```cpp
Base base;
Derived derived;
base = derived;  // ❌ Slicing: only Base part is copied

base.show();  // Calls Base::show(), not Derived::show()
```

Assignment operators only copy the base class portion, losing derived class data and virtual function overrides.

#### Slicing in Container Operations

```cpp
std::vector<Base> vec;
Derived d;
vec.push_back(d);  // ❌ Slicing occurs

vec[0].show();  // Calls Base::show()
```

**Correct approach:** Use containers of pointers or smart pointers:

```cpp
std::vector<std::unique_ptr<Base>> vec;
vec.push_back(std::make_unique<Derived>());  // ✅ No slicing
vec[0]->show();  // Correctly calls Derived::show()
```

#### Slicing with Return Values

```cpp
Base returnDerived() {
    Derived d;
    return d;  // ❌ Slicing on return
}

Base obj = returnDerived();  // Only Base part returned
```

**Prevention:** Return by pointer or smart pointer for polymorphic types.

#### Hidden Member Loss

```cpp
struct Base {
    virtual void f() { std::cout << "Base\n"; }
};

struct Derived : public Base {
    int important_data = 42;
    void f() override { std::cout << "Derived: " << important_data << "\n"; }
};

void process(Base b) {
    b.f();  // "Base" - sliced, important_data lost
}
```

Derived class members are completely discarded during slicing, potentially causing logic errors.

### CODE_EXAMPLES: Preventing Object Slicing

#### Example 1: Pass by Reference

```cpp
void correct_process(Base& b) {  // ✅ Reference preserves polymorphism
    b.show();  // Correctly calls derived implementation
}

Derived d;
correct_process(d);  // No slicing, polymorphism works
```

Using references maintains the complete object and enables virtual dispatch.

#### Example 2: Smart Pointer Containers

```cpp
std::vector<std::unique_ptr<Base>> animals;
animals.push_back(std::make_unique<Dog>());
animals.push_back(std::make_unique<Cat>());

for (auto& animal : animals) {
    animal->makeSound();  // ✅ Polymorphism preserved
}
```

Smart pointer containers maintain polymorphic behavior without slicing.

#### Example 3: Protected Copy Constructor to Prevent Slicing

```cpp
class Base {
protected:
    Base(const Base&) = default;  // Prevent external copying
public:
    virtual ~Base() = default;
    virtual void show() = 0;
};

class Derived : public Base {
public:
    void show() override { std::cout << "Derived\n"; }
};

void func(Base b);  // ❌ Compilation error - cannot access protected constructor
```

Making the base copy constructor protected prevents accidental slicing through function parameters.

---

## INTERVIEW_QA: Destructors and Virtual Destructors

#### Q1: Why must destructors be virtual in polymorphic base classes?
**Difficulty:** #intermediate  
**Category:** #memory #design_pattern #interview_favorite  
**Concepts:** #destructors #virtual_functions #polymorphism #undefined_behavior

**Answer:**
Virtual destructors ensure proper cleanup when deleting derived objects through base class pointers.

```cpp
class Base {
public:
    virtual ~Base() { /* cleanup */ }  // ✅ Virtual
};

class Derived : public Base {
    int* data;
public:
    ~Derived() { delete data; }  // Called correctly
};

Base* ptr = new Derived();
delete ptr;  // Both destructors run: Derived, then Base
```

**Explanation:**
Without a virtual destructor, only the base class destructor runs when deleting through a base pointer, causing:
- Resource leaks in derived class
- Undefined behavior
- Potential memory corruption

**Key takeaway:** Always make destructors virtual in classes intended for polymorphic use.

---

#### Q2: Can a destructor be pure virtual? What are the implications?
**Difficulty:** #advanced  
**Category:** #syntax #design_pattern  
**Concepts:** #destructors #virtual_functions #pure_virtual #abstract_class

**Answer:**
Yes, destructors can be pure virtual, but they **must have a definition** because base destructors are always called.

```cpp
class Abstract {
public:
    virtual ~Abstract() = 0;  // Makes class abstract
};

Abstract::~Abstract() {}  // ✅ Definition required

class Concrete : public Abstract {
    ~Concrete() override {}
};
```

**Explanation:**
Unlike other pure virtual functions, the destructor is always invoked during object destruction. The base destructor runs after the derived destructor, so it needs a body even if pure virtual. Omitting the definition causes a linker error.

**Key takeaway:** Pure virtual destructors make a class abstract but always require an out-of-class definition.

---

#### Q3: What happens if you delete a nullptr?
**Difficulty:** #beginner  
**Category:** #syntax #memory  
**Concepts:** #destructors #undefined_behavior #pointers

**Answer:**
Deleting a `nullptr` is completely safe and is a no-op.

```cpp
Base* ptr = nullptr;
delete ptr;  // ✅ Safe - does nothing
```

**Explanation:**
The C++ standard explicitly defines `delete nullptr` as having no effect. The check `if (ptr != nullptr)` before delete is unnecessary and redundant.

**Key takeaway:** Always safe to delete nullptr; no need for explicit null checks.

---

#### Q4: How does destructor execution order work in inheritance?
**Difficulty:** #intermediate  
**Category:** #memory #syntax  
**Concepts:** #destructors #inheritance #initialization_order

**Answer:**
Destructors execute in reverse order of construction: derived to base, with members destroyed in reverse declaration order.

```cpp
class Base {
public:
    ~Base() { std::cout << "Base\n"; }
};

class Derived : public Base {
    std::string name;
public:
    ~Derived() { std::cout << "Derived\n"; }
    // Output order: Derived → ~name → Base
};
```

**Explanation:**
1. Derived destructor body executes
2. Member destructors run (reverse declaration order)
3. Base destructor body executes

This ensures derived class has access to base class resources during its cleanup.

**Key takeaway:** Destruction is always the reverse of construction to maintain proper resource cleanup order.

---

#### Q5: Why do virtual destructors prevent automatic move generation?
**Difficulty:** #advanced  
**Category:** #performance #syntax  
**Concepts:** #destructors #move_semantics #compiler_generated #rule_of_five

**Answer:**
Declaring a destructor (virtual or not) suppresses automatic move constructor and move assignment generation.

```cpp
class Base {
public:
    virtual ~Base() = default;
    // Move constructor NOT generated
    // Move assignment NOT generated
};
```

**Explanation:**
The compiler assumes that if you need a custom destructor, you likely manage resources requiring custom move semantics. You must explicitly define or default move operations if needed.

**Key takeaway:** Follow Rule of Five when defining destructors in resource-managing classes.

---

#### Q6: What's the purpose of a deleted destructor?
**Difficulty:** #advanced  
**Category:** #design_pattern #syntax  
**Concepts:** #destructors #deleted_functions #lifetime_management

**Answer:**
Deleted destructors prevent object destruction, enforcing heap-only allocation and controlled lifetime management.

```cpp
class HeapOnly {
    ~HeapOnly() = delete;
public:
    static HeapOnly* create() { return new HeapOnly(); }
    void destroy() { delete this; }
private:
    HeapOnly() = default;
};

// HeapOnly obj;  // ❌ Error: cannot create on stack
```

**Explanation:**
Objects cannot be created on the stack because that requires automatic destruction at scope end. Deletion must occur through a member function that has access to the private/deleted destructor.

**Use cases:**
- Singleton patterns
- Factory-controlled object lifetimes
- RAII wrappers with managed destruction

**Key takeaway:** Deleted destructors enforce controlled object lifetime through specific destruction paths.

---

#### Q7: How do trivial vs non-trivial destructors affect performance?
**Difficulty:** #advanced  
**Category:** #performance #memory  
**Concepts:** #destructors #optimization #trivial_types

**Answer:**
Trivial destructors enable compiler optimizations like memcpy and POD treatment, while non-trivial destructors require explicit calls.

```cpp
struct Trivial {
    int x;
    // Compiler-generated destructor is trivial
};

struct NonTrivial {
    ~NonTrivial() {}  // User-defined = non-trivial
};

// Trivial enables: memcpy, realloc, faster container operations
// NonTrivial requires: explicit destructor calls, slower moves
```

**Explanation:**
Trivial destructors allow containers and algorithms to optimize away destructor calls, use faster memory operations, and treat objects as POD (Plain Old Data) types.

**Key takeaway:** Avoid defining empty destructors; let the compiler generate trivial ones when possible.

---

## INTERVIEW_QA: Object Slicing

#### Q8: What is object slicing and when does it occur?
**Difficulty:** #intermediate  
**Category:** #memory #syntax #interview_favorite  
**Concepts:** #object_slicing #inheritance #polymorphism #copy_constructor

**Answer:**
Object slicing occurs when a derived object is copied into a base object, losing derived class members and polymorphic behavior.

```cpp
class Base { int x; };
class Derived : public Base { int y; };

void func(Base b) {  // ❌ Pass by value
    // y is sliced off
}

Derived d;
func(d);  // Slicing happens here
```

**Explanation:**
Pass-by-value uses the copy constructor to create a new base object from the derived object. Only the base portion is copied, losing:
- Derived class data members
- Virtual function overrides
- Type information

**Key takeaway:** Always pass polymorphic types by reference or pointer to preserve full object information.

---

#### Q9: How does object slicing affect virtual function dispatch?
**Difficulty:** #intermediate  
**Category:** #performance #design_pattern  
**Concepts:** #object_slicing #virtual_functions #polymorphism #vtable

**Answer:**
Slicing converts a derived object to a base object, disabling virtual dispatch and calling base implementations.

```cpp
struct Base {
    virtual void show() { std::cout << "Base\n"; }
};

struct Derived : public Base {
    void show() override { std::cout << "Derived\n"; }
};

Base b = Derived();  // Slicing
b.show();  // Prints "Base", not "Derived"
```

**Explanation:**
The sliced object is a true base type object with its own vtable pointer pointing to the base class vtable. Virtual function calls resolve to base implementations because the derived type information is lost.

**Key takeaway:** Slicing defeats polymorphism by converting derived objects to actual base objects.

---

#### Q10: How do you prevent object slicing in function parameters?
**Difficulty:** #beginner  
**Category:** #syntax #design_pattern #interview_favorite  
**Concepts:** #object_slicing #references #pointers #best_practices

**Answer:**
Use references or pointers instead of pass-by-value for polymorphic types.

```cpp
// ❌ Slicing occurs
void bad(Base b) { b.show(); }

// ✅ No slicing
void good(Base& b) { b.show(); }
void good(Base* b) { b->show(); }
void good(const Base& b) { b.show(); }
```

**Explanation:**
References and pointers maintain the complete object identity, preserving:
- All derived class members
- Virtual function overrides
- Polymorphic behavior

**Key takeaway:** For polymorphic types, always use references or pointers as function parameters.

---

#### Q11: How does object slicing affect containers?
**Difficulty:** #intermediate  
**Category:** #memory #design_pattern #interview_favorite  
**Concepts:** #object_slicing #containers #polymorphism #smart_pointers

**Answer:**
Storing derived objects directly in base class containers causes slicing. Use containers of pointers or smart pointers instead.

```cpp
// ❌ Slicing
std::vector<Base> vec;
vec.push_back(Derived());  // Sliced

// ✅ No slicing
std::vector<std::unique_ptr<Base>> vec;
vec.push_back(std::make_unique<Derived>());
```

**Explanation:**
Container elements are stored by value. Inserting a derived object copies only the base portion. Using pointer containers maintains the complete object with its derived type.

**Key takeaway:** Use containers of smart pointers (unique_ptr or shared_ptr) for polymorphic objects.

---

#### Q12: Can you prevent slicing at compile time?
**Difficulty:** #advanced  
**Category:** #design_pattern #syntax  
**Concepts:** #object_slicing #deleted_functions #copy_constructor #protected_members

**Answer:**
Make the base class copy constructor protected or deleted to prevent slicing.

```cpp
class Base {
protected:
    Base(const Base&) = default;  // Prevent external copying
public:
    virtual ~Base() = default;
};

void func(Base b);  // ❌ Compilation error

class Derived : public Base {
    // Can still use protected constructor internally
};
```

**Explanation:**
Making the copy constructor protected prevents external code from copying base objects while allowing derived classes to implement proper copy semantics. This catches slicing bugs at compile time.

**Key takeaway:** Protected copy constructors prevent accidental slicing in polymorphic hierarchies.

---

#### Q13: What happens to sliced objects during assignment?
**Difficulty:** #intermediate  
**Category:** #memory #syntax  
**Concepts:** #object_slicing #assignment_operator #polymorphism

**Answer:**
Assignment operators only copy the base portion, leaving the derived object's members unchanged.

```cpp
Derived d1, d2;
d1.derived_member = 10;

Base& base_ref = d1;
base_ref = d2;  // Only base portion assigned

// d1.derived_member still equals 10 (unchanged)
```

**Explanation:**
The assignment operator for the base class only knows about base members. Derived class members are ignored during the assignment, potentially creating inconsistent object states.

**Key takeaway:** Be cautious with assignments through base references; they don't affect derived portions.

---

## INTERVIEW_QA: Rule of Five - Theoretical and Design Questions

#### Q14: What is the Rule of Five and why was it introduced?
**Difficulty:** #intermediate  
**Category:** #design_pattern #memory #interview_favorite  
**Concepts:** #rule_of_five #move_semantics #copy_constructor #destructors

**Answer:**
The Rule of Five states that if a class defines any of destructor, copy constructor, copy assignment, move constructor, or move assignment, it should define all five.

**Explanation:**
Introduced with C++11 move semantics, the Rule of Five extends the Rule of Three to include:
1. Destructor
2. Copy constructor
3. Copy assignment operator
4. Move constructor
5. Move assignment operator

Classes managing resources benefit from move operations, which transfer ownership efficiently without copying. Defining one operation often indicates custom resource management requiring all five.

**Key takeaway:** Follow Rule of Five for resource-managing classes to enable both safe copying and efficient moving.

---

#### Q15: If you declare a move constructor, what happens to the copy constructor?
**Difficulty:** #advanced  
**Category:** #syntax #performance  
**Concepts:** #move_constructor #copy_constructor #compiler_generated #rule_of_five

**Answer:**
Declaring a move constructor suppresses automatic generation of the copy constructor and copy assignment operator.

```cpp
class A {
public:
    A(A&&) {}  // User-defined move constructor
    // Copy constructor NOT generated
    // Copy assignment NOT generated
};

A a1;
A a2 = a1;  // ❌ Error: no copy constructor
```

**Explanation:**
The compiler assumes that defining move operations indicates custom resource handling that likely requires custom copy semantics too. You must explicitly define or default the copy operations if needed.

**Key takeaway:** Defining move operations requires explicitly handling copy operations per Rule of Five.

---

#### Q16: Why should move constructors be marked noexcept?
**Difficulty:** #advanced  
**Category:** #performance #design_pattern #interview_favorite  
**Concepts:** #move_constructor #noexcept #exception_safety #optimization

**Answer:**
`noexcept` move constructors enable optimizations in standard containers and ensure strong exception safety during container operations.

```cpp
class A {
public:
    A(A&&) noexcept {  // ✅ Enables optimizations
        // Move implementation
    }
};
```

**Explanation:**
Standard library containers like `std::vector` use move operations only if they're `noexcept`. Otherwise, they copy for strong exception safety. Without `noexcept`:
- Container reallocations use expensive copies
- Move operations are bypassed for safety
- Performance suffers significantly

**Key takeaway:** Always mark move constructors and move assignment as `noexcept` unless they truly can throw.

---

#### Q17: How does defining a destructor affect move operations?
**Difficulty:** #advanced  
**Category:** #syntax #performance  
**Concepts:** #destructors #move_constructor #compiler_generated #rule_of_five

**Answer:**
Defining a destructor suppresses automatic generation of move constructor and move assignment operator.

```cpp
class Resource {
public:
    ~Resource() { /* cleanup */ }
    // Move constructor NOT generated
    // Move assignment NOT generated
};
```

**Explanation:**
The compiler assumes custom destructors indicate resource management requiring custom move semantics. This prevents potentially incorrect default move operations from being generated.

**Key takeaway:** When defining destructors, explicitly define or default move operations per Rule of Five.

---

#### Q18: What is a move-only type and when should you use it?
**Difficulty:** #intermediate  
**Category:** #design_pattern #performance  
**Concepts:** #move_semantics #deleted_functions #unique_ownership

**Answer:**
Move-only types delete copy operations but provide move operations, enforcing unique ownership semantics.

```cpp
class MoveOnly {
public:
    MoveOnly() = default;
    MoveOnly(const MoveOnly&) = delete;
    MoveOnly& operator=(const MoveOnly&) = delete;
    MoveOnly(MoveOnly&&) noexcept = default;
    MoveOnly& operator=(MoveOnly&&) noexcept = default;
};
```

**Explanation:**
Use move-only types for resources with unique ownership:
- File handles
- Network sockets
- Unique pointers
- Thread objects

This prevents accidental copying of exclusive resources.

**Key takeaway:** Move-only types enforce exclusive ownership through the type system.

---

#### Q19: How does the Pimpl idiom interact with Rule of Five?
**Difficulty:** #advanced  
**Category:** #design_pattern #performance  
**Concepts:** #pimpl #rule_of_five #forward_declaration #incomplete_types

**Answer:**
Pimpl requires explicit definitions of all five special members in the implementation file where the impl type is complete.

```cpp
// Header
class Widget {
    struct Impl;
    std::unique_ptr<Impl> pImpl;
public:
    Widget();
    ~Widget();  // Must define in .cpp
    Widget(Widget&&) noexcept;  // Must define in .cpp
    Widget& operator=(Widget&&) noexcept;  // Must define in .cpp
    Widget(const Widget&);  // Must define in .cpp
    Widget& operator=(const Widget&);  // Must define in .cpp
};

// Implementation
Widget::~Widget() = default;  // Impl is complete here
Widget::Widget(Widget&&) noexcept = default;
// ... other members
```

**Explanation:**
The impl type is incomplete in the header, so default implementations that need to delete/copy/move it must be in the implementation file where the type is complete.

**Key takeaway:** Pimpl classes require out-of-line definitions of all special members in the implementation file.

---

#### Q20: Can you mix defaulted and custom special member functions?
**Difficulty:** #intermediate  
**Category:** #syntax #design_pattern  
**Concepts:** #rule_of_five #defaulted_functions #custom_implementation

**Answer:**
Yes, you can default some special members while providing custom implementations for others.

```cpp
class Mixed {
    int* data;
public:
    Mixed() : data(new int(0)) {}
    ~Mixed() { delete data; }
    
    Mixed(const Mixed& other) : data(new int(*other.data)) {}
    Mixed& operator=(const Mixed&) = default;  // ❌ Unsafe!
    
    Mixed(Mixed&&) noexcept = default;  // ❌ Unsafe!
    Mixed& operator=(Mixed&&) noexcept = default;  // ❌ Unsafe!
};
```

**Explanation:**
While syntactically allowed, mixing requires careful consideration. Default implementations may not work correctly with custom resource management. In the example above, defaulted operations would perform shallow copies, causing double-deletion bugs.

**Key takeaway:** When providing custom implementations for some members, carefully evaluate whether defaulted versions are correct for others.

---

### QUICK_REFERENCE: Destructor and Slicing Summary

#### Virtual Destructor Rules

| Scenario | Requires Virtual Destructor | Risk Without Virtual |
|----------|----------------------------|---------------------|
| Polymorphic base class | ✅ Yes | Resource leak, UB |
| Non-polymorphic base | ❌ No | None if no polymorphic use |
| Abstract base class | ✅ Yes | Derived resources leaked |
| With virtual functions | ✅ Yes | Incomplete destruction |
| Pure interface | ✅ Yes (can be pure) | Linker error or leak |

#### Object Slicing Prevention

| Technique | Use Case | Effectiveness |
|-----------|----------|---------------|
| Pass by reference | Function parameters | ✅ Complete |
| Pass by pointer | Function parameters | ✅ Complete |
| Smart pointer containers | Collections | ✅ Complete |
| Protected copy constructor | Compile-time prevention | ✅ Complete |
| Deleted copy constructor | Compile-time prevention | ✅ Complete |
| Abstract base class | Design-level prevention | ⚠️ Partial |

#### Rule of Five Decision Tree

| If You Define... | Must Also Define... | Reason |
|-----------------|---------------------|--------|
| Destructor | All 5 members | Indicates resource management |
| Copy constructor | All 5 members | Indicates custom copy semantics |
| Copy assignment | All 5 members | Indicates custom copy semantics |
| Move constructor | All 5 members | Suppresses copy generation |
| Move assignment | All 5 members | Suppresses copy generation |
| Nothing | Nothing (Rule of 0) | Let compiler handle all |

#### Special Member Generation Rules

| User Declares | Default Ctor | Destructor | Copy Ctor | Copy Assign | Move Ctor | Move Assign |
|---------------|--------------|------------|-----------|-------------|-----------|-------------|
| Nothing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Destructor | ✅ | User | ✅ | ✅ | ❌ | ❌ |
| Copy Ctor | ✅ | ✅ | User | ✅ | ❌ | ❌ |
| Copy Assign | ✅ | ✅ | ✅ | User | ❌ | ❌ |
| Move Ctor | ✅ | ✅ | ❌ | ❌ | User | ✅ |
| Move Assign | ✅ | ✅ | ❌ | ❌ | ✅ | User |

#### Common Pitfalls Summary

| Pitfall | Symptom | Solution |
|---------|---------|----------|
| Non-virtual destructor in polymorphic class | Memory leak, UB | Make destructor virtual |
| Pure virtual destructor without definition | Linker error | Provide out-of-class definition |
| Pass polymorphic by value | Object slicing | Pass by reference/pointer |
| Store derived in base container | Slicing | Use container of smart pointers |
| Define destructor only | No move operations | Define all Rule of Five |
| Default move with raw pointers | Shallow move | Custom move implementation |
| Forget noexcept on moves | No container optimization | Mark moves noexcept |

---