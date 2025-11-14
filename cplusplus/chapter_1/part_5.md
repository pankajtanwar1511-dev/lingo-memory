# C++ Object-Oriented Programming Study Material (Continued)

---

## TOPIC: Copy Constructor vs Assignment Operator, Rule of 3/5/0

### THEORY_SECTION: Core Concepts and Definitions

#### Copy Constructor

A **copy constructor** creates a new object as a copy of an existing object.

**Signature:**
```cpp
ClassName(const ClassName& other);
```

**Called when:**
- Object is **initialized** from another (`ClassName b = a;`)
- Passed **by value** to a function
- Returned **by value** from a function
- Creates a **new object**

#### Copy Assignment Operator

A **copy assignment operator** assigns the value of one existing object to another existing object.

**Signature:**
```cpp
ClassName& operator=(const ClassName& other);
```

**Called when:**
- An **already existing object** is assigned another (`a = b;`)
- Must guard against **self-assignment**
- **Overwrites** an existing object

#### Key Differences

| Feature                 | Copy Constructor                | Copy Assignment Operator           |
|------------------------|----------------------------------|------------------------------------|
| Object lifecycle       | Construction                    | Assignment after construction      |
| When called            | Initialization                  | Reassignment                       |
| Typical form           | `ClassName(const ClassName&)`   | `ClassName& operator=(const ClassName&)` |
| Return type            | None                             | `ClassName&` (usually returns `*this`) |
| Default provided by C++| Yes (if conditions met)         | Yes (if conditions met)           |
| Self-assignment safe?  | Not applicable                   | Must handle manually        |

#### Rule of Three

If your class **manages resources** (raw pointers, file handles), and you define **any one** of the following, you **must define all three**:

1. **Copy Constructor**
2. **Copy Assignment Operator**
3. **Destructor**

```cpp
class RuleOfThree {
    int* data;
public:
    RuleOfThree(const RuleOfThree&);              // deep copy
    RuleOfThree& operator=(const RuleOfThree&);   // deep copy assign
    ~RuleOfThree();                               // cleanup
};
```

**Why it matters:** Without all three, you risk memory leaks, double deletion, or shallow copies.

#### Rule of Five (C++11+)

If you implement any of the Rule of Three, **consider also** implementing:

4. **Move Constructor**
5. **Move Assignment Operator**

```cpp
class RuleOfFive {
    int* data;
public:
    RuleOfFive(const RuleOfFive&);                 // copy constructor
    RuleOfFive& operator=(const RuleOfFive&);      // copy assignment
    RuleOfFive(RuleOfFive&&) noexcept;             // move constructor
    RuleOfFive& operator=(RuleOfFive&&) noexcept;  // move assignment
    ~RuleOfFive();                                 // destructor
};
```

**Benefits:** Avoids unnecessary copies and improves performance for resource-heavy classes.

#### Rule of Zero

If you don't manage resources directly, **prefer not to implement** any of the 5 special member functions. Rely on STL containers and RAII.

```cpp
struct Point {
    int x, y;  // Rule of 0: All members handle their own lifetimes
};
```

**Best practice:** Use standard library containers (vector, unique_ptr, string) instead of raw pointers.

### THEORY_SECTION: Special Member Function Generation Rules

#### Compiler-Generated Special Members

The compiler automatically generates certain special member functions based on what you define. Understanding these rules is critical for preventing bugs.

**Key principles:**
- Defining certain special members suppresses automatic generation of others
- Deleting a special member prevents its use
- The presence of user-defined special members affects what else is generated

#### When Default Generation Occurs

| Member Function | Generated When | Suppressed By |
|----------------|----------------|---------------|
| **Default Constructor** | No constructors defined | Any user-declared constructor |
| **Destructor** | Always (unless user-declared) | User-declared destructor |
| **Copy Constructor** | No move operations declared | Move constructor/assignment or destructor declared |
| **Copy Assignment** | No move operations declared | Move constructor/assignment or destructor declared |
| **Move Constructor** | No copy/move/destructor declared | Any of: copy constructor, copy assignment, move assignment, or destructor |
| **Move Assignment** | No copy/move/destructor declared | Any of: copy constructor, copy assignment, move constructor, or destructor |

### EDGE_CASES: Tricky Scenarios and Gotchas

#### Self-Assignment Issue

Without proper self-assignment check, assignment operators can cause bugs:

```cpp
class A {
    int* data;
public:
    A& operator=(const A& other) {
        delete data;           // ❌ Deletes own data if this == &other
        data = new int(*other.data);  // Accessing deleted memory!
        return *this;
    }
};
```

**Correct approach:**

```cpp
A& operator=(const A& other) {
    if (this != &other) {      // ✅ Self-assignment check
        delete data;
        data = new int(*other.data);
    }
    return *this;
}
```

#### Copy Elision and Return Value Optimization (RVO)

**Copy elision** is a compiler optimization that eliminates unnecessary copy/move operations, even if they have side effects.

```cpp
class A {
public:
    A() { std::cout << "Constructor\n"; }
    A(const A&) { std::cout << "Copy\n"; }
};

A create() {
    return A();  // May elide copy
}

A obj = create();  // C++17+: guaranteed elision
```

**Critical facts:**
- **Before C++17:** Optimization is optional
- **C++17+:** Mandatory in certain cases (prvalue contexts)
- Works even if copy/move constructors are deleted
- RVO can apply even when copy/move is not available

#### Object Slicing with Copy Operations

```cpp
class Base {
public:
    int x;
};

class Derived : public Base {
public:
    int y;
};

void func(Base b) {  // Pass by value
    // Only Base part is copied, y is lost
}

Derived d;
func(d);  // Slicing occurs
```

**Solution:** Pass by reference or pointer for polymorphic types.

#### Shallow vs Deep Copy

**Shallow copy** (default behavior for raw pointers):

```cpp
class A {
    int* data;
public:
    A(const A& other) {
        data = other.data;  // ❌ Both objects point to same memory
    }
};
```

**Deep copy** (correct for resource management):

```cpp
class A {
    int* data;
public:
    A(const A& other) {
        data = new int(*other.data);  // ✅ Separate memory allocation
    }
};
```

#### Rule of Three Violation

```cpp
class A {
    int* p;
public:
    A() { p = new int(5); }
    ~A() { delete p; }
    // ❌ Missing copy constructor and assignment operator
};

A a1;
A a2 = a1;  // Shallow copy - both point to same memory
// When destructors run: double free!
```

#### Move Operations Suppress Copy Generation

```cpp
class A {
public:
    A(A&&) { std::cout << "Move\n"; }  // User-defined move
    // Copy constructor NOT generated automatically
};

A a1;
A a2 = a1;  // ❌ Error: no copy constructor
```

#### Deleted Copy Prevents Move Generation

```cpp
class A {
public:
    A(const A&) = delete;
    // Move constructor also NOT generated
};

A create() {
    return A();  // Only works with copy elision
}
```

### CODE_EXAMPLES: Practical Demonstrations

#### Example 1: Copy Constructor vs Assignment Operator

```cpp
#include <iostream>

class A {
public:
    A() { std::cout << "Default\n"; }
    A(const A&) { std::cout << "Copy Constructor\n"; }
    A& operator=(const A&) {
        std::cout << "Copy Assignment\n";
        return *this;
    }
};

int main() {
    A a1;           // Default
    A a2 = a1;      // Copy Constructor (initialization)
    A a3;           // Default
    a3 = a1;        // Copy Assignment (already exists)
}
```

**Key distinction:** `A a2 = a1` is initialization (copy constructor), while `a3 = a1` is assignment (assignment operator).

#### Example 2: Correct Rule of Three Implementation

```cpp
class DynamicArray {
    int* data;
    size_t size;
    
public:
    // Constructor
    DynamicArray(size_t s) : size(s), data(new int[s]) {}
    
    // Copy Constructor (deep copy)
    DynamicArray(const DynamicArray& other) 
        : size(other.size), data(new int[other.size]) {
        std::copy(other.data, other.data + size, data);
    }
    
    // Copy Assignment Operator (deep copy)
    DynamicArray& operator=(const DynamicArray& other) {
        if (this != &other) {  // Self-assignment check
            delete[] data;
            size = other.size;
            data = new int[size];
            std::copy(other.data, other.data + size, data);
        }
        return *this;
    }
    
    // Destructor
    ~DynamicArray() {
        delete[] data;
    }
};
```

Follows Rule of Three: destructor, copy constructor, and copy assignment all properly manage the dynamic memory.

#### Example 3: Rule of Five with Move Semantics

```cpp
class Buffer {
    char* data;
    size_t size;
    
public:
    // Constructor
    Buffer(size_t s) : size(s), data(new char[s]) {}
    
    // Copy Constructor
    Buffer(const Buffer& other) 
        : size(other.size), data(new char[other.size]) {
        std::memcpy(data, other.data, size);
    }
    
    // Copy Assignment
    Buffer& operator=(const Buffer& other) {
        if (this != &other) {
            delete[] data;
            size = other.size;
            data = new char[size];
            std::memcpy(data, other.data, size);
        }
        return *this;
    }
    
    // Move Constructor
    Buffer(Buffer&& other) noexcept 
        : size(other.size), data(other.data) {
        other.data = nullptr;  // Leave source in valid state
        other.size = 0;
    }
    
    // Move Assignment
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data;
            size = other.size;
            data = other.data;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
    
    // Destructor
    ~Buffer() {
        delete[] data;
    }
};
```

Move operations transfer ownership without copying, providing significant performance benefits.

#### Example 4: Self-Assignment Safety

```cpp
class SafeAssignment {
    int* data;
public:
    SafeAssignment& operator=(const SafeAssignment& other) {
        if (this == &other) {  // ✅ Guard against self-assignment
            return *this;
        }
        
        delete data;
        data = new int(*other.data);
        return *this;
    }
};

int main() {
    SafeAssignment a;
    a = a;  // Safe: check prevents deletion of own data
}
```

Self-assignment check prevents deleting memory that's still needed.

#### Example 5: Copy Elision Example

```cpp
class A {
public:
    A() { std::cout << "Constructor\n"; }
    A(const A&) { std::cout << "Copy\n"; }
    A(A&&) { std::cout << "Move\n"; }
};

A create() {
    return A();  // RVO: likely no copy/move
}

int main() {
    A obj = create();  // C++17+: guaranteed elision
}
```

**Output (C++17+):** `Constructor` only - no copy or move occurs due to mandatory copy elision.

#### Example 6: Rule of Zero Example

```cpp
#include <vector>
#include <string>
#include <memory>

class GoodDesign {
    std::vector<int> data;
    std::string name;
    std::unique_ptr<int> ptr;
    // No need to define any special member functions!
    // All members manage themselves
};
```

Using standard library containers eliminates the need for custom special member functions.

### INTERVIEW_QA: Comprehensive Questions and Answers

#### Q1: What's the difference between copy constructor and copy assignment operator?
**Difficulty:** #beginner  
**Category:** #syntax #interview_favorite  
**Concepts:** #copy_constructor #assignment_operator #constructors

**Answer:**
Copy constructor creates a new object from an existing one, while copy assignment modifies an existing object.

```cpp
A a1;
A a2 = a1;  // Copy constructor: creates new object a2
a2 = a1;    // Assignment operator: modifies existing a2
```

**Explanation:**
- Copy constructor is called during initialization (object creation)
- Assignment operator is called for already-constructed objects
- Copy constructor signature: `A(const A&)`
- Assignment operator signature: `A& operator=(const A&)`

**Key takeaway:** The presence of `=` doesn't always mean assignment - in declarations, it's initialization using the copy constructor.

---

#### Q2: What is the Rule of Three?
**Difficulty:** #intermediate  
**Category:** #design_pattern #memory #interview_favorite  
**Concepts:** #rule_of_three #copy_constructor #assignment_operator #destructors #resource_management

**Answer:**
If a class defines any of destructor, copy constructor, or copy assignment operator, it should define all three.

```cpp
class Resource {
    int* data;
public:
    ~Resource() { delete data; }                    // 1. Destructor
    Resource(const Resource& r);                    // 2. Copy constructor
    Resource& operator=(const Resource& r);         // 3. Copy assignment
};
```

**Explanation:**
Classes that manage resources need custom implementations for all three to ensure:
- Proper resource cleanup (destructor)
- Deep copying instead of shallow copying (copy constructor)
- Safe assignment with self-assignment check (assignment operator)

**Key takeaway:** Managing any resource (memory, file handles, network connections) triggers the need for all three special members.

---

#### Q3: What is the Rule of Five and why was it introduced?
**Difficulty:** #advanced  
**Category:** #design_pattern #performance #interview_favorite  
**Concepts:** #rule_of_five #move_semantics #move_constructor #move_assignment #resource_management

**Answer:**
Rule of Five extends Rule of Three to include move constructor and move assignment operator for performance optimization with C++11 move semantics.

```cpp
class Resource {
    int* data;
public:
    ~Resource();
    Resource(const Resource&);                    // copy
    Resource& operator=(const Resource&);         // copy assign
    Resource(Resource&&) noexcept;                // move
    Resource& operator=(Resource&&) noexcept;     // move assign
};
```

**Explanation:**
Move operations enable efficient transfer of resources from temporary objects, avoiding expensive deep copies. Without explicit move operations, the class falls back to copying, losing performance benefits.

**Key takeaway:** Always implement move semantics when managing resources to enable performance optimizations.

---

#### Q4: What is the Rule of Zero?
**Difficulty:** #intermediate  
**Category:** #design_pattern #interview_favorite  
**Concepts:** #rule_of_zero #raii #resource_management #smart_pointers

**Answer:**
Rule of Zero states that if you use standard library containers and smart pointers, you shouldn't need to define any special member functions.

```cpp
class Good {
    std::vector<int> data;
    std::unique_ptr<Resource> resource;
    std::string name;
    // No special members needed - all members self-manage
};
```

**Explanation:**
Modern C++ encourages resource management through RAII types rather than raw pointers. Standard containers handle their own copying, moving, and destruction correctly.

**Key takeaway:** Prefer composition with standard library types over manual resource management.

---

#### Q5: Why must you check for self-assignment in the assignment operator?
**Difficulty:** #intermediate  
**Category:** #memory #interview_favorite  
**Concepts:** #assignment_operator #self_assignment #undefined_behavior

**Answer:**
Without self-assignment check, assigning an object to itself can delete its resources before trying to copy from them.

```cpp
A& operator=(const A& other) {
    if (this == &other) return *this;  // ✅ Prevent self-destruction
    
    delete data;                       // Without check: deletes own data
    data = new int(*other.data);       // Then tries to copy from deleted data!
    return *this;
}
```

**Explanation:**
Self-assignment like `a = a` would delete the object's data, then attempt to copy from the now-deleted memory, causing undefined behavior.

**Key takeaway:** Always include `if (this != &other)` check in assignment operators.

---

#### Q6: How does defining a copy constructor affect move constructor generation?
**Difficulty:** #advanced  
**Category:** #syntax #performance  
**Concepts:** #copy_constructor #move_constructor #compiler_generated

**Answer:**
Defining a copy constructor suppresses automatic generation of the move constructor.

```cpp
class A {
public:
    A(const A&) {}  // User-defined copy constructor
    // Move constructor NOT generated by compiler
};

A a1;
A a2 = std::move(a1);  // Uses copy constructor, not move
```

**Explanation:**
The compiler assumes that if you needed a custom copy constructor, you likely need custom move semantics too. To get move operations, you must explicitly define them.

**Key takeaway:** Defining any copy/move operation requires defining all that you need.

---

#### Q7: What is copy elision and when is it guaranteed?
**Difficulty:** #advanced  
**Category:** #performance #interview_favorite  
**Concepts:** #copy_elision #rvo #optimization #move_semantics

**Answer:**
Copy elision is a compiler optimization that eliminates copy/move operations. Since C++17, it's mandatory in certain scenarios.

```cpp
A create() {
    return A();  // C++17+: guaranteed elision
}

A obj = create();  // No copy or move, constructed directly
```

**Explanation:**
- **Before C++17:** Optional optimization
- **C++17+:** Mandatory for prvalue expressions
- Works even if copy/move constructors are deleted
- Can apply to function returns and initialization

**Key takeaway:** Don't rely on copy/move constructors being called for return values in modern C++.

---

#### Q8: Can copy elision occur if copy/move constructors are deleted?
**Difficulty:** #advanced  
**Category:** #syntax #performance  
**Concepts:** #copy_elision #deleted_functions #rvo

**Answer:**
Yes, in C++17+ mandatory copy elision scenarios, objects can be returned even with deleted copy/move constructors.

```cpp
class NoCopy {
public:
    NoCopy() = default;
    NoCopy(const NoCopy&) = delete;
    NoCopy(NoCopy&&) = delete;
};

NoCopy create() {
    return NoCopy();  // ✅ OK in C++17+: guaranteed elision
}

NoCopy obj = create();  // ✅ Works despite deleted constructors
```

**Explanation:**
Mandatory copy elision means the object is constructed directly in its final location, so copy/move operations are never actually performed.

**Key takeaway:** C++17 guaranteed copy elision enables move-only and copy-only types to be returned by value.

---

#### Q9: What happens if you only define a destructor?
**Difficulty:** #intermediate  
**Category:** #syntax #memory  
**Concepts:** #destructors #compiler_generated #rule_of_three

**Answer:**
Defining only a destructor allows compiler-generated copy operations but suppresses move operations.

```cpp
class A {
public:
    ~A() { /* cleanup */ }
    // Copy constructor: generated
    // Copy assignment: generated
    // Move constructor: NOT generated
    // Move assignment: NOT generated
};
```

**Explanation:**
The compiler assumes a custom destructor indicates resource management, so it disables move operations (which could leave moved-from objects in an invalid state) but allows copies for backward compatibility.

**Key takeaway:** If you define a destructor, consider defining all Rule of Five members.

---

#### Q10: What's the difference between shallow copy and deep copy?
**Difficulty:** #beginner  
**Category:** #memory #interview_favorite  
**Concepts:** #copy_constructor #shallow_copy #deep_copy #pointers

**Answer:**
Shallow copy copies pointer values; deep copy allocates new memory and copies the actual data.

```cpp
// Shallow copy (default)
A(const A& other) {
    ptr = other.ptr;  // ❌ Both point to same memory
}

// Deep copy (correct for resource management)
A(const A& other) {
    ptr = new int(*other.ptr);  // ✅ Separate memory
}
```

**Explanation:**
Shallow copies lead to double-deletion when both objects' destructors run. Deep copies ensure each object owns independent resources.

**Key takeaway:** Always use deep copy for classes managing dynamic memory.

---

#### Q11: Why should move constructors be marked noexcept?
**Difficulty:** #advanced  
**Category:** #performance #design_pattern  
**Concepts:** #move_constructor #noexcept #exception_safety #performance

**Answer:**
`noexcept` move constructors enable optimizations in standard containers and prevent container operations from falling back to copying.

```cpp
class A {
public:
    A(A&&) noexcept {  // ✅ Enables optimizations
        // Move without throwing
    }
};
```

**Explanation:**
Standard library containers (like `std::vector`) use move operations only if they're guaranteed not to throw. Otherwise, they copy for strong exception safety guarantee. Marking moves as `noexcept` allows containers to use them during reallocation.

**Key takeaway:** Always mark move constructors and move assignment as `noexcept` unless they truly can throw.

---

#### Q12: What is object slicing and how does it relate to copy operations?
**Difficulty:** #intermediate  
**Category:** #memory #inheritance #interview_favorite  
**Concepts:** #object_slicing #copy_constructor #inheritance #polymorphism

**Answer:**
Object slicing occurs when a derived class object is copied to a base class object, losing the derived portion.

```cpp
class Base { int x; };
class Derived : public Base { int y; };

void func(Base b) {  // Pass by value
    // Only Base part copied, y is lost
}

Derived d;
func(d);  // Slicing occurs
```

**Explanation:**
Pass-by-value uses the copy constructor, which only copies the base class portion. The derived class members are "sliced off."

**Key takeaway:** Use references or pointers for polymorphic types to avoid slicing.

---

#### Q13: How do you prevent copying of a class?
**Difficulty:** #beginner  
**Category:** #syntax #design_pattern  
**Concepts:** #deleted_functions #copy_constructor #assignment_operator

**Answer:**
Delete the copy constructor and copy assignment operator.

```cpp
class NoCopy {
public:
    NoCopy() = default;
    NoCopy(const NoCopy&) = delete;
    NoCopy& operator=(const NoCopy&) = delete;
};
```

**Explanation:**
Deleted functions cause compilation errors when used. This is useful for move-only types or singleton patterns.

**Key takeaway:** Use `= delete` to explicitly prevent copying rather than making them private.

---

#### Q14: What's the copy-and-swap idiom?
**Difficulty:** #advanced  
**Category:** #design_pattern #interview_favorite  
**Concepts:** #assignment_operator #exception_safety #copy_and_swap

**Answer:**
Copy-and-swap is a technique for implementing exception-safe assignment operators using a swap function.

```cpp
class A {
    int* data;
public:
    A& operator=(A other) {  // Pass by value (copies)
        swap(*this, other);  // Swap with temporary
        return *this;
    }  // old data destroyed when 'other' goes out of scope
    
    friend void swap(A& a, A& b) noexcept {
        using std::swap;
        swap(a.data, b.data);
    }
};
```

**Explanation:**
By passing by value, the copy is made before entering the function. If copying throws, the original object is unchanged. Swapping is typically non-throwing, providing strong exception safety.

**Key takeaway:** Copy-and-swap provides exception safety and handles self-assignment automatically.

---

#### Q15: When does the compiler generate a default move constructor?
**Difficulty:** #advanced  
**Category:** #syntax #performance  
**Concepts:** #move_constructor #compiler_generated #rule_of_five

**Answer:**
The compiler generates a move constructor only if no copy operations, move assignment, or destructor are user-declared.

```cpp
class A {
    // No user-declared special members
    // Compiler generates: copy ctor, copy assign, move ctor, move assign
};

class B {
    ~B() {}  // User-declared destructor
    // Move constructor NOT generated
};
```

**Explanation:**
Declaring any of these indicates special resource handling, so the compiler won't generate potentially incorrect move operations.

**Key takeaway:** Define all five special members explicitly when managing resources.

---

### PRACTICE_TASKS: 15 Tricky Output Prediction Questions - Set 1

#### Q1: Copy Constructor vs Assignment
```cpp
#include <iostream>
class A {
public:
    A() { std::cout << "Default\n"; }
    A(const A&) { std::cout << "Copy\n"; }
    A& operator=(const A&) { std::cout << "Assign\n"; return *this; }
};

int main() {
    A a1;
    A a2 = a1;
    A a3;
    a3 = a1;
}
```

#### Q2: Self Assignment
```cpp
class A {
public:
    A& operator=(const A& other) {
        if (this == &other)
            std::cout << "Self-assignment\n";
        return *this;
    }
};

int main() {
    A a;
    a = a;
}
```

#### Q3: Copy Elision
```cpp
class A {
public:
    A() { std::cout << "Default\n"; }
    A(const A&) { std::cout << "Copy\n"; }
};

A get() {
    return A();
}

int main() {
    A a = get();
}
```

#### Q4: Object Slicing
```cpp
class A {
public:
    A() {}
    virtual void show() { std::cout << "A\n"; }
};

class B : public A {
public:
    void show() override { std::cout << "B\n"; }
};

int main() {
    B b;
    A a = b;
    a.show();
}
```

#### Q5: Deleted Copy Constructor
```cpp
class A {
public:
    A() = default;
    A(const A&) = delete;
};

int main() {
    A a1;
    A a2 = a1;
}
```

#### Q6: Deleted Move Constructor
```cpp
class A {
public:
    A() = default;
    A(A&&) = delete;
};

A get() {
    return A();
}

int main() {
    A a = get();
}
```

#### Q7: Custom Move Constructor
```cpp
class A {
public:
    A() {}
    A(A&&) { std::cout << "Moved\n"; }
};

int main() {
    A a = A();
}
```

#### Q8: Move Assignment
```cpp
class A {
public:
    A& operator=(A&&) {
        std::cout << "Move Assign\n";
        return *this;
    }
};

int main() {
    A a;
    a = A();
}
```

#### Q9: Missing Destructor
```cpp
class A {
    int* p;
public:
    A() { p = new int[10]; }
    A(const A& other) { p = new int[10]; }
};

int main() {
    A a1;
    A a2 = a1;
}
```

#### Q10: Rule of 3 Violation
```cpp
class A {
    int* p;
public:
    A() { p = new int(5); }
    ~A() { delete p; }
};

int main() {
    A a1;
    A a2 = a1;
}
```

#### Q11: Correct Rule of 3
```cpp
class A {
    int* p;
public:
    A() { p = new int(5); }
    A(const A& other) { p = new int(*other.p); }
    A& operator=(const A& other) {
        if (this != &other) {
            delete p;
            p = new int(*other.p);
        }
        return *this;
    }
    ~A() { delete p; }
};

int main() {
    A a1;
    A a2 = a1;
    A a3;
    a3 = a2;
}
```

#### Q12: Move Prevents Copy
```cpp
class A {
public:
    A() {}
    A(const A&) { std::cout << "Copy\n"; }
    A(A&&) { std::cout << "Move\n"; }
};

A create() {
    A a;
    return std::move(a);
}

int main() {
    A a = create();
}
```

#### Q13: Copy in Function Parameter
```cpp
class A {
public:
    A() {}
    A(const A&) { std::cout << "Copy\n"; }
};

void take(A a) {}

int main() {
    A a;
    take(a);
}
```

#### Q14: Multiple Copy Elisions
```cpp
class A {
public:
    A() {}
    A(const A&) { std::cout << "Copy\n"; }
};

int main() {
    A a1 = A(A(A()));
}
```

#### Q15: Destructor Calls
```cpp
class A {
public:
    ~A() { std::cout << "Destroyed\n"; }
};

int main() {
    A a1;
    A a2 = a1;
}
```

### PRACTICE_TASKS: 10 Follow-Up Variations - Set 2

#### Q16
```cpp
class A {
public:
    A() = default;
    A(const A&) { std::cout << "Copy\n"; }
};

A make() {
    return A();
}

int main() {
    A a = make();
}
```

#### Q17
```cpp
class A {
public:
    A() = default;
    A(const A&) = delete;
};

A get() {
    return A();
}

int main() {
    A a = get();
}
```

#### Q18
```cpp
class A {
public:
    A() = default;
    A(A&&) { std::cout << "Move\n"; }
};

A get() {
    A a;
    return a;
}

int main() {
    A a = get();
}
```

#### Q19
```cpp
class A {
public:
    A() {}
    A(A&&) = delete;
    A(const A&) = delete;
};

A get() {
    return A();
}

int main() {
    A a = get();
}
```

#### Q20
```cpp
class A {
public:
    A() = default;
    A(const A&) = delete;
    A(A&&) = default;
};

A f() {
    A a;
    return a;
}

int main() {
    A a = f();
}
```

#### Q21
```cpp
class A {
    int* data;
public:
    A() { data = new int(5); }
    A(const A& rhs) { data = new int(*rhs.data); std::cout << "Deep Copy\n"; }
    ~A() { delete data; }
};

int main() {
    A a1;
    A a2 = a1;
}
```

#### Q22
```cpp
class A {
public:
    A() = default;
    ~A() = default;
};

class B {
    A a;
public:
    B(const B&) { std::cout << "Copy\n"; }
};

int main() {
    B b1;
    B b2 = b1;
}
```

#### Q23
```cpp
class A {
public:
    A() {}
    A(const A&) { std::cout << "Copy\n"; }
    A(A&&) { std::cout << "Move\n"; }
};

A create() {
    A a;
    return std::move(a);
}

int main() {
    A a = create();
}
```

#### Q24
```cpp
class A {
public:
    A() = default;
    A(const A&) = default;
    A& operator=(const A&) = delete;
};

int main() {
    A a1;
    A a2 = a1;
    a2 = a1;
}
```

#### Q25
```cpp
class A {
public:
    A() = default;
    ~A() = default;
    A(const A&) = delete;
};

void take(A a) {}

int main() {
    A a;
    take(a);
}
```

### QUICK_REFERENCE: Special Member Function Generation Dependencies

#### Comprehensive Generation Rules Table

| **User Defines/Deletes** | **Default Ctor** | **Destructor** | **Copy Ctor** | **Copy Assignment** | **Move Ctor** | **Move Assignment** |
|--------------------------|------------------|----------------|---------------|---------------------|---------------|---------------------|
| **Nothing (Rule of 0)** | ✅ Generated | ✅ Generated | ✅ Generated | ✅ Generated | ✅ Generated | ✅ Generated |
| **Default Constructor** | User-defined | ✅ Generated | ✅ Generated | ✅ Generated | ✅ Generated | ✅ Generated |
| **Destructor** | ✅ Generated | User-defined | ✅ Generated | ✅ Generated | ❌ Suppressed | ❌ Suppressed |
| **Copy Constructor** | ✅ Generated | ✅ Generated | User-defined | ✅ Generated | ❌ Suppressed | ❌ Suppressed |
| **Copy Assignment** | ✅ Generated | ✅ Generated | ✅ Generated | User-defined | ❌ Suppressed | ❌ Suppressed |
| **Move Constructor** | ✅ Generated | ✅ Generated | ❌ Suppressed | ❌ Suppressed | User-defined | ✅ Generated |
| **Move Assignment** | ✅ Generated | ✅ Generated | ❌ Suppressed | ❌ Suppressed | ✅ Generated | User-defined |
| **Copy Ctor = delete** | ✅ Generated | ✅ Generated | Deleted | ❌ Suppressed | ❌ Suppressed | ❌ Suppressed |
| **Move Ctor = delete** | ✅ Generated | ✅ Generated | ✅ Generated | ✅ Generated | Deleted | ❌ Suppressed |

**Key Points:**
- ✅ = Implicitly generated by compiler
- ❌ = Not generated (suppressed)
- User-defined = You explicitly provided implementation
- Deleted = Marked with `= delete`

#### Copy Elision Rules

| Scenario | Pre-C++17 | C++17+ |
|----------|-----------|---------|
| Return prvalue | Optional | Mandatory |
| Pass prvalue | Optional | Mandatory |
| Named return value | Optional | Optional (NRVO) |
| With deleted copy/move | May fail | Works with mandatory elision |

### QUICK_REFERENCE: Answer Key for Practice Questions Set 1

| Q# | Answer | Explanation | Key Concept |
|----|--------|-------------|-------------|
| 1 | Default<br>Copy<br>Default<br>Assign | `a2 = a1` is initialization (copy ctor); `a3 = a1` is assignment | Copy ctor vs assignment |
| 2 | Self-assignment | Self-assignment check triggers message | Self-assignment safety |
| 3 | Default (typically) | RVO likely eliminates copy | Copy elision |
| 4 | A | Object slicing: only base part copied | Object slicing |
| 5 | ❌ Compilation Error | Copy constructor deleted, copying not allowed | Deleted functions |
| 6 | ❌ Compilation Error (Pre-C++17)<br>✅ OK (C++17+) | RVO mandatory in C++17+ allows return despite deleted move | Copy elision guarantees |
| 7 | Moved (or nothing with elision) | Move constructor called or elided | Move semantics |
| 8 | Move Assign | Temporary triggers move assignment | Move assignment |
| 9 | ⚠️ Memory Leak | No destructor, allocated memory never freed | Rule of 3 violation |
| 10 | ❌ Runtime Error: Double free | Default copy makes shallow copy; both destructors delete same memory | Shallow copy problem |
| 11 | No output but correct | Proper Rule of 3 implementation with deep copies | Correct Rule of 3 |
| 12 | Move | Explicit `std::move` triggers move constructor | Move semantics |
| 13 | Copy | Pass-by-value copies the argument | Function parameter copying |
| 14 | 0-3 times "Copy" | Depends on compiler and optimization level | Multiple elisions |
| 15 | Destroyed<br>Destroyed | Two destructors called for two objects | Destructor calls |

### QUICK_REFERENCE: Answer Key for Practice Questions Set 2

| Q# | Answer | Explanation | Key Concept |
|----|--------|-------------|-------------|
| 16 | Copy or nothing | RVO may eliminate copy; otherwise copy ctor called | Copy elision |
| 17 | ✅ OK (C++17+)<br>❌ Error (Pre-C++17) | Mandatory elision in C++17+ allows despite deleted copy | Copy elision guarantees |
| 18 | Move or nothing | NRVO may apply; otherwise move from local | Move semantics |
| 19 | ❌ Compilation Error | Both copy and move deleted; even with RVO, compiler checks validity | Deleted operations |
| 20 | Move or nothing | Copy deleted, move available; NRVO or move occurs | Move with deleted copy |
| 21 | Deep Copy | Correct Rule of 3 implementation | Deep copy |
| 22 | Copy | Custom copy constructor called | Copy constructor |
| 23 | Move | Explicit `std::move` invokes move constructor | Move semantics |
| 24 | ❌ Error at `a2 = a1` | Copy construction OK, but assignment deleted | Deleted assignment |
| 25 | ❌ Compilation Error | Pass-by-value requires copy, which is deleted | Deleted copy ctor |

### QUICK_REFERENCE: Rule of 3/5/0 Summary

| Rule | When to Apply | Members to Define | Purpose |
|------|---------------|-------------------|---------|
| **Rule of 0** | No resource management | None | Let compiler handle everything |
| **Rule of 3** | C++98/03 resource management | Destructor, Copy ctor, Copy assignment | Safe resource management |
| **Rule of 5** | C++11+ resource management | Destructor, Copy ctor/assign, Move ctor/assign | Safe + efficient resource management |

### QUICK_REFERENCE: Best Practices

| Scenario | Recommendation |
|----------|----------------|
| Standard containers only | Follow Rule of 0 |
| Managing raw pointers | Follow Rule of 5 |
| Single-ownership semantics | Use `std::unique_ptr` |
| Shared ownership | Use `std::shared_ptr` |
| Move-only types | Delete copy, define move |
| Immutable types | Delete assignment operators |
| Assignment operators | Always check self-assignment |
| Move operations | Mark `noexcept` when possible |
| Copy elision | Don't rely on copy/move being called |

---