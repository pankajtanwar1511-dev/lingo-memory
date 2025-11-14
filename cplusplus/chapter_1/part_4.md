# C++ Object-Oriented Programming Study Material (Continued)

---

## TOPIC: Constructor Types - Default, Parameterized, Copy, Move

### THEORY_SECTION: Core Concepts and Definitions

#### Default Constructor

A **default constructor** is a constructor that takes **no arguments**.

```cpp
class A {
public:
    A() { std::cout << "Default constructor\n"; }
};
```

**When is it generated?**
- If **no constructors** are defined by the user, the compiler automatically provides a default constructor
- If **any constructor** is defined, you must define the default one explicitly if needed

#### Parameterized Constructor

A **parameterized constructor** is a constructor that takes one or more arguments.

```cpp
class A {
public:
    A(int x) { std::cout << "Parameterized: " << x << "\n"; }
};
```

**Important:** The compiler will NOT generate a default constructor if any parameterized constructor is defined.

#### Copy Constructor

A **copy constructor** creates a new object as a copy of an existing object.

**Syntax:**
```cpp
A(const A& other);
```

**Used when:**
- An object is initialized from another object of the same type
- Passing objects by value
- Returning objects by value

```cpp
A a1;
A a2 = a1; // Copy constructor
```

#### Move Constructor (C++11)

A **move constructor** transfers resources from a temporary (rvalue) object to a new object.

**Syntax:**
```cpp
A(A&& other);
```

**Used for rvalue references:**
```cpp
A temp();
A a = std::move(temp); // Move constructor
```

**Benefits:**
- Avoids **deep copying** large resources like heap memory, vectors, etc.
- **Steals resources** (e.g., pointers) from temporary object
- Significantly improves performance for resource-heavy classes

**Important:** If you define a move constructor, also define a copy constructor (Rule of 5).

#### Compiler-Generated Constructors

| Constructor Type     | Automatically Generated When?               |
|----------------------|---------------------------------------------|
| Default              | Only if no other constructor is defined     |
| Copy Constructor     | If no move/copy/assignment defined          |
| Move Constructor     | Only if no copy constructor or destructor   |

### THEORY_SECTION: Member Initialization

#### Default Values of Data Members

**For Built-In Types (int, float, char, pointers):**

| Case | Example | Value |
|------|---------|-------|
| Stack-allocated object | `int x;` in class | ❌ **Garbage (uninitialized)** |
| Static/global object | `static int x;` | ✅ Zero-initialized (0, nullptr) |

**For Class-Type Members:**
- Default constructor is **called automatically** if not initialized explicitly

```cpp
class X {
public:
    X() { std::cout << "X()\n"; }
};

class A {
    X x; // ✅ X's default constructor is called
};
```

#### Ways to Initialize Members in Constructor

**1. Assignment inside constructor body** (❌ Not ideal)

```cpp
class A {
    int x;
public:
    A(int val) {
        x = val; // not recommended
    }
};
```

This involves **default-initialization + reassignment**, not direct construction. Worse performance for **non-trivial types** (like std::string, vector).

**2. Member Initializer List** (✅ Preferred)

```cpp
class A {
    int x;
public:
    A(int val) : x(val) {}
};
```

✅ Efficient — constructs `x` **directly with `val`**

**Mandatory for:**
- `const` members
- Reference members (`int&`)
- Base classes or other objects with no default constructor

**3. In-Class Member Initializers** (C++11+)

```cpp
class A {
    int x = 10; // ✅ default value if not overridden by ctor
public:
    A() {}           // x = 10
    A(int val) : x(val) {} // x = val
};
```

Good for **default values** that can be **overridden by initializer list**.

**4. Delegating Constructors** (C++11)

Let one constructor call another:

```cpp
class A {
    int x;
public:
    A() : A(0) {}         // delegates to parameterized constructor
    A(int val) : x(val) {}
};
```

**5. Aggregate Initialization** (C++20)

For aggregate types (structs with no user-defined constructors):

```cpp
struct A {
    int x;
    double y;
};

A a{10, 3.14}; // ✅ Aggregate init
```

### EDGE_CASES: Tricky Scenarios and Gotchas

#### User-Defined Constructor Disables Default

```cpp
class A {
public:
    A(int) {}
};

int main() {
    A a; // ❌ Error: no default constructor!
}
```

Once you define **any** constructor, the compiler stops generating the default constructor.

#### Copy Constructor Signature Requirements

```cpp
class A {
public:
    A(A& other); // ❌ Wrong! Should be const A&
};

A a1;
A a2 = a1; // ❌ No suitable copy constructor
```

The copy constructor should take **const reference** to allow copying from const objects.

#### Default Arguments Can Act as Default Constructor

```cpp
class A {
public:
    A(int x = 0) { std::cout << "Param\n"; }
};

int main() {
    A a; // ✅ OK — default argument allows default construction
}
```

#### Copy vs Assignment Operator

```cpp
A a1;
A a2 = a1;  // Copy Constructor
a2 = a1;    // Assignment Operator (not copy constructor)
```

These are different operations with different implementations.

#### Move Constructor Disabled by Custom Copy Constructor

```cpp
class A {
public:
    A(const A&);  // Custom copy constructor
    // A(A&&);    // Compiler will NOT auto-generate move!
};
```

Defining a copy constructor prevents automatic move constructor generation.

#### Reference Members Require Initialization

```cpp
class A {
    int& ref;
public:
    A() {} // ❌ Error: ref must be initialized
};
```

Reference members **must** be initialized in the member initializer list.

#### Const Members Require Initialization

```cpp
class A {
    const int val;
public:
    A() {
        // val = 5; // ❌ Error: cannot assign to const
    }
};
```

Const members must be initialized in the member initializer list, not assigned.

#### Member Initialization Order

**CRITICAL:** Order of initialization is based on **member declaration order**, **not initializer list order**.

```cpp
class A {
    int x;
    int y;
public:
    A(int val) : y(val), x(y) {} // ❌ x is initialized before y!
};
```

This can lead to undefined behavior because `x` is initialized using uninitialized `y`.

#### explicit Keyword with Constructors

```cpp
class A {
public:
    explicit A(int x);
};

A a = 10; // ❌ Error: implicit conversion disallowed
A a(10);  // ✅ OK: explicit construction
```

The `explicit` keyword prevents implicit conversions.

#### Uninitialized Built-In Members

```cpp
class A {
    int x;  // uninitialized
public:
    void print() { std::cout << x << "\n"; }
};

int main() {
    A a;
    a.print(); // ⚠️ Undefined behavior!
}
```

Built-in types have **garbage values** if not explicitly initialized.

#### Base Class Initialization

```cpp
class Base {
public:
    Base(int) {}
};

class Derived : public Base {
public:
    Derived() : Base(10) {} // ✅ Base must be initialized this way
};
```

Base class constructors must be called in the initializer list.

### CODE_EXAMPLES: Practical Demonstrations

#### Example 1: Default Constructor Behavior

```cpp
class A {
public:
    A() { std::cout << "Default constructor\n"; }
};

class B {
public:
    B(int) { std::cout << "Parameterized constructor\n"; }
};

int main() {
    A a;  // ✅ OK: calls default constructor
    B b;  // ❌ Error: no default constructor
}
```

Class `A` can be default-constructed, but `B` cannot because defining a parameterized constructor disables the default.

#### Example 2: Member Initializer List vs Assignment

```cpp
class String {
    std::string data;
public:
    // ❌ Less efficient: default constructs data, then assigns
    String(const std::string& s) {
        data = s;
    }
    
    // ✅ More efficient: directly constructs data with s
    String(const std::string& s) : data(s) {}
};
```

Member initializer lists are more efficient because they directly construct members rather than default-constructing then assigning.

#### Example 3: In-Class Initializers with Overrides

```cpp
class Point {
    int x = 0;  // default value
    int y = 0;  // default value
public:
    Point() {}                    // x=0, y=0
    Point(int x_, int y_) : x(x_), y(y_) {}  // overrides defaults
};
```

In-class initializers provide default values that can be overridden by constructor initializer lists.

#### Example 4: Delegating Constructors

```cpp
class Rectangle {
    int width, height;
public:
    Rectangle() : Rectangle(0, 0) {}  // delegates
    Rectangle(int w) : Rectangle(w, w) {}  // delegates
    Rectangle(int w, int h) : width(w), height(h) {}  // master constructor
};
```

Delegating constructors reduce code duplication by having one constructor call another.

#### Example 5: Copy vs Move Constructor

```cpp
class Resource {
    int* data;
public:
    Resource(int size) : data(new int[size]) {}
    
    // Copy constructor: deep copy
    Resource(const Resource& other) {
        // allocate new memory and copy
        data = new int[other.size];
        std::copy(other.data, other.data + size, data);
    }
    
    // Move constructor: steal resources
    Resource(Resource&& other) noexcept : data(other.data) {
        other.data = nullptr;  // leave other in valid state
    }
    
    ~Resource() { delete[] data; }
};
```

Copy constructor performs deep copy; move constructor transfers ownership without copying.

#### Example 6: Object Composition Initialization

```cpp
class Engine {
public:
    Engine() { std::cout << "Engine constructed\n"; }
};

class Car {
    Engine engine;  // member object
public:
    Car() { std::cout << "Car constructed\n"; }
};

int main() {
    Car c;
    // Output:
    // Engine constructed
    // Car constructed
}
```

Member objects are constructed before the containing class constructor body executes.

### INTERVIEW_QA: Comprehensive Questions and Answers

#### Q1: What is a default constructor and when is it automatically generated?
**Difficulty:** #beginner  
**Category:** #syntax #interview_favorite  
**Concepts:** #constructors #default_constructor #compiler_generated

**Answer:**
A default constructor is a constructor that takes no arguments. It is automatically generated by the compiler **only if** no other constructors are defined in the class.

```cpp
class A {
    // Compiler generates: A() {}
};

class B {
public:
    B(int x) {}  // User-defined constructor
    // No default constructor generated!
};
```

**Key takeaway:** Defining any constructor disables automatic default constructor generation.

---

#### Q2: What's the difference between copy constructor and assignment operator?
**Difficulty:** #intermediate  
**Category:** #syntax #interview_favorite  
**Concepts:** #copy_constructor #assignment_operator #constructors

**Answer:**
Copy constructor **creates a new object** from an existing one, while assignment operator **modifies an existing object**.

```cpp
A a1;
A a2 = a1;  // Copy constructor: creates new object a2
a2 = a1;    // Assignment operator: modifies existing a2
```

**Copy constructor signature:** `A(const A& other)`  
**Assignment operator signature:** `A& operator=(const A& other)`

**Key takeaway:** Copy constructor is for initialization; assignment is for modification.

---

#### Q3: Why should member initialization use initializer lists instead of assignment in constructor body?
**Difficulty:** #intermediate  
**Category:** #performance #design_pattern #interview_favorite  
**Concepts:** #constructors #member_initialization #performance

**Answer:**
Initializer lists directly construct members, while assignment in constructor body involves default construction followed by assignment, which is less efficient.

```cpp
class A {
    std::string name;
public:
    // ❌ Less efficient: default constructs name, then assigns
    A(const std::string& n) { name = n; }
    
    // ✅ More efficient: directly constructs name with n
    A(const std::string& n) : name(n) {}
};
```

**Additionally required for:**
- const members
- Reference members
- Members with no default constructor

**Key takeaway:** Always use initializer lists for better performance and to avoid compilation errors.

---

#### Q4: What is the Rule of 5?
**Difficulty:** #advanced  
**Category:** #design_pattern #memory #interview_favorite  
**Concepts:** #rule_of_five #constructors #destructors #copy_constructor #move_constructor #resource_management

**Answer:**
If a class manages resources and defines any of the five special member functions, it should define all five:

1. Destructor
2. Copy constructor
3. Copy assignment operator
4. Move constructor
5. Move assignment operator

```cpp
class Resource {
    int* data;
public:
    ~Resource() { delete[] data; }
    Resource(const Resource&);  // copy constructor
    Resource& operator=(const Resource&);  // copy assignment
    Resource(Resource&&) noexcept;  // move constructor
    Resource& operator=(Resource&&) noexcept;  // move assignment
};
```

**Key takeaway:** Managing resources requires careful control of all copy/move operations to prevent memory leaks and undefined behavior.

---

#### Q5: When does the compiler generate a move constructor?
**Difficulty:** #advanced  
**Category:** #syntax #performance  
**Concepts:** #move_constructor #compiler_generated #constructors

**Answer:**
The compiler generates a move constructor only if:
- No user-declared copy constructor exists
- No user-declared copy assignment operator exists
- No user-declared move assignment operator exists
- No user-declared destructor exists

```cpp
class A {
    // Compiler generates move constructor
};

class B {
public:
    B(const B&);  // User-defined copy constructor
    // Compiler does NOT generate move constructor
};
```

**Key takeaway:** Defining any copy/move operation or destructor prevents automatic move constructor generation.

---

#### Q6: What are in-class member initializers and when should you use them?
**Difficulty:** #intermediate  
**Category:** #syntax #design_pattern  
**Concepts:** #constructors #member_initialization #default_values

**Answer:**
In-class member initializers (C++11) provide default values for data members at declaration.

```cpp
class Point {
    int x = 0;  // in-class initializer
    int y = 0;
public:
    Point() {}  // uses default values
    Point(int x_, int y_) : x(x_), y(y_) {}  // overrides defaults
};
```

**Use when:**
- You want consistent default values across multiple constructors
- Most objects use the same initial value
- You want to document expected initial state

**Key takeaway:** In-class initializers reduce code duplication and can be overridden by constructor initializer lists.

---

#### Q7: What is a delegating constructor and why is it useful?
**Difficulty:** #intermediate  
**Category:** #syntax #design_pattern  
**Concepts:** #constructors #delegating_constructor #code_reuse

**Answer:**
A delegating constructor (C++11) calls another constructor in the same class, reducing code duplication.

```cpp
class Rectangle {
    int width, height;
public:
    Rectangle() : Rectangle(0, 0) {}  // delegates to main constructor
    Rectangle(int size) : Rectangle(size, size) {}  // square
    Rectangle(int w, int h) : width(w), height(h) {}  // main constructor
};
```

**Benefits:**
- Reduces code duplication
- Centralizes initialization logic
- Easier maintenance

**Key takeaway:** Use delegating constructors to avoid repeating initialization logic across multiple constructors.

---

#### Q8: Why must const and reference members be initialized in the initializer list?
**Difficulty:** #intermediate  
**Category:** #syntax #interview_favorite  
**Concepts:** #constructors #const_correctness #references #member_initialization

**Answer:**
Const and reference members cannot be assigned to after construction; they must be initialized.

```cpp
class A {
    const int value;
    int& ref;
public:
    A(int v, int& r) : value(v), ref(r) {}  // ✅ Must use initializer list
    
    A(int v, int& r) {
        value = v;  // ❌ Error: cannot assign to const
        ref = r;    // ❌ Error: reference must be initialized
    }
};
```

**Key takeaway:** Const and reference members require initialization, not assignment.

---

#### Q9: What is the order of member initialization?
**Difficulty:** #advanced  
**Category:** #syntax #memory #interview_favorite  
**Concepts:** #constructors #member_initialization #initialization_order #undefined_behavior

**Answer:**
Members are initialized in the **order they are declared in the class**, not the order in the initializer list.

```cpp
class A {
    int x;
    int y;
public:
    A(int val) : y(val), x(y) {}  // ❌ x initialized first, using uninitialized y!
};
```

**Correct approach:**

```cpp
class A {
    int x;
    int y;
public:
    A(int val) : x(val), y(val) {}  // ✅ Initialize in declaration order
};
```

**Key takeaway:** Always initialize members in the same order they are declared to avoid undefined behavior.

---

#### Q10: What is the explicit keyword and when should you use it?
**Difficulty:** #intermediate  
**Category:** #syntax #design_pattern #interview_favorite  
**Concepts:** #constructors #explicit #implicit_conversion #type_safety

**Answer:**
The `explicit` keyword prevents implicit conversions and copy-initialization with single-argument constructors.

```cpp
class String {
public:
    String(int size);  // implicit conversion allowed
};

String s = 10;  // ✅ Implicitly converts 10 to String

class SafeString {
public:
    explicit SafeString(int size);  // prevents implicit conversion
};

SafeString s = 10;  // ❌ Error: explicit constructor
SafeString s(10);   // ✅ OK: explicit construction
```

**Use when:**
- Constructor arguments shouldn't allow implicit conversions
- You want to prevent accidental type conversions

**Key takeaway:** Use `explicit` for single-argument constructors to prevent unintended implicit conversions.

---

#### Q11: Can a constructor be virtual?
**Difficulty:** #intermediate  
**Category:** #syntax #design_pattern  
**Concepts:** #constructors #virtual_functions #vtable

**Answer:**
No, constructors cannot be virtual. The vtable pointer (vptr) is set up during construction, so virtual dispatch isn't available yet.

```cpp
class Base {
public:
    virtual Base() {}  // ❌ Error: constructors cannot be virtual
};
```

**Alternative pattern:** Use a virtual factory method:

```cpp
class Base {
public:
    virtual Base* create() const = 0;
};
```

**Key takeaway:** Constructors cannot be virtual; use factory patterns for polymorphic construction.

---

#### Q12: What happens to built-in type members if not explicitly initialized?
**Difficulty:** #intermediate  
**Category:** #memory #interview_favorite  
**Concepts:** #constructors #undefined_behavior #initialization #built_in_types

**Answer:**
Built-in types (int, float, pointers) have **undefined values** (garbage) if not explicitly initialized.

```cpp
class A {
    int x;  // uninitialized!
public:
    A() {}
    void print() { std::cout << x; }  // ⚠️ Undefined behavior
};
```

**Correct approach:**

```cpp
class A {
    int x = 0;  // in-class initializer
public:
    A() {}
    // or: A() : x(0) {}
};
```

**Key takeaway:** Always initialize built-in type members to avoid undefined behavior.

---

#### Q13: How do base class constructors get called?
**Difficulty:** #intermediate  
**Category:** #syntax #inheritance  
**Concepts:** #constructors #inheritance #base_class #initialization

**Answer:**
Base class constructors are called in the initializer list before the derived class constructor body executes.

```cpp
class Base {
public:
    Base(int x) { std::cout << "Base: " << x << "\n"; }
};

class Derived : public Base {
public:
    Derived() : Base(42) {  // Must initialize base
        std::cout << "Derived\n";
    }
};

// Output:
// Base: 42
// Derived
```

**Key takeaway:** Base class constructors must be called in the derived class initializer list.

---

#### Q14: What is copy elision and return value optimization (RVO)?
**Difficulty:** #advanced  
**Category:** #performance #interview_favorite  
**Concepts:** #copy_constructor #move_constructor #optimization #copy_elision

**Answer:**
Copy elision is a compiler optimization that eliminates unnecessary copy/move operations. RVO specifically applies to return values.

```cpp
class A {
public:
    A() { std::cout << "Constructor\n"; }
    A(const A&) { std::cout << "Copy\n"; }
};

A create() {
    return A();  // RVO: copy/move may be elided
}

A obj = create();  // C++17: guaranteed elision
```

**Before C++17:** Optimization, may or may not happen  
**C++17+:** Guaranteed in certain cases

**Key takeaway:** Modern compilers eliminate unnecessary copies; always implement move semantics for efficiency when elision doesn't apply.

---

#### Q15: What is the difference between initialization and assignment?
**Difficulty:** #beginner  
**Category:** #syntax  
**Concepts:** #constructors #initialization #assignment

**Answer:**
Initialization creates and initializes an object in one step. Assignment modifies an existing object.

```cpp
A a = b;   // Initialization: calls copy constructor
A a;
a = b;     // Assignment: calls assignment operator
```

**Key distinction:**
- Initialization: `A(const A&)` - copy constructor
- Assignment: `A& operator=(const A&)` - assignment operator

**Key takeaway:** Initialization and assignment are distinct operations with different implementations.

---

### PRACTICE_TASKS: 15 Tricky Output Prediction Questions

#### Q1: Initialization Order
```cpp
class A {
public:
    A() { std::cout << "A\n"; }
};

class B {
    A a;
public:
    B() : a() { std::cout << "B\n"; }
};

int main() {
    B b;
}
```

#### Q2: Constructor Body vs Initializer List
```cpp
class A {
    int x;
public:
    A(int val) { x = val; std::cout << "A: " << x << "\n"; }
};

int main() {
    A a(5);
}
```

#### Q3: In-Class Initializer
```cpp
class A {
    int x = 10;
public:
    A() { std::cout << x << "\n"; }
};

int main() {
    A a;
}
```

#### Q4: In-Class Init Overridden
```cpp
class A {
    int x = 10;
public:
    A(int v) : x(v) { std::cout << x << "\n"; }
};

int main() {
    A a(20);
}
```

#### Q5: Reference Member
```cpp
class A {
    int& ref;
public:
    A(int& r) : ref(r) {
        std::cout << ref << "\n";
    }
};

int main() {
    int x = 100;
    A a(x);
}
```

#### Q6: Const Member Without Init
```cpp
class A {
    const int val;
public:
    A() {
        // val = 5;
    }
};

int main() {
    A a;
}
```

#### Q7: Order of Declaration vs Init List
```cpp
class A {
    int x = 1;
    int y = 2;
public:
    A() : y(10), x(20) {
        std::cout << x << " " << y << "\n";
    }
};

int main() {
    A a;
}
```

#### Q8: Delegating Constructor
```cpp
class A {
    int x;
public:
    A() : A(42) { std::cout << "Default\n"; }
    A(int val) : x(val) { std::cout << "Param: " << x << "\n"; }
};

int main() {
    A a;
}
```

#### Q9: Object Composition Init
```cpp
class A {
public:
    A() { std::cout << "A\n"; }
};

class B {
    A a;
public:
    B() { std::cout << "B\n"; }
};

int main() {
    B b;
}
```

#### Q10: Copy Constructor Called?
```cpp
class A {
public:
    A() { std::cout << "Default\n"; }
    A(const A&) { std::cout << "Copy\n"; }
};

A create() {
    A a;
    return a;
}

int main() {
    A x = create();
}
```

#### Q11: Move Constructor Presence
```cpp
class A {
public:
    A() { std::cout << "Default\n"; }
    A(const A&) { std::cout << "Copy\n"; }
    A(A&&) { std::cout << "Move\n"; }
};

A create() {
    return A();
}

int main() {
    A x = create();
}
```

#### Q12: Object Slicing?
```cpp
class Base {
public:
    Base() { std::cout << "Base\n"; }
};

class Derived : public Base {
public:
    Derived() { std::cout << "Derived\n"; }
};

void func(Base b) {}

int main() {
    Derived d;
    func(d);
}
```

#### Q13: Multiple Constructors
```cpp
class A {
public:
    A() { std::cout << "A()\n"; }
    A(int) { std::cout << "A(int)\n"; }
};

int main() {
    A a1;
    A a2(10);
}
```

#### Q14: Temporary Lifetime
```cpp
class A {
public:
    A() { std::cout << "A\n"; }
    ~A() { std::cout << "~A\n"; }
};

int main() {
    A();
    std::cout << "End\n";
}
```

#### Q15: Object with Member Object Initialization
```cpp
class X {
public:
    X() { std::cout << "X()\n"; }
};

class Y {
    X x;
public:
    Y() { std::cout << "Y()\n"; }
};

int main() {
    Y y;
}
```

### QUICK_REFERENCE: Best Practices Summary

| Use Case | Best Practice |
|----------|---------------|
| Basic members (int, float) | Use initializer list or in-class initializer |
| Const / references | Must use initializer list |
| Class members | Prefer initializer list |
| Provide default values | Use in-class initializer (C++11+) |
| Avoid duplication | Use delegating constructors |
| Complex init logic | Use static factory functions or helper methods |
| Single-argument constructors | Mark as `explicit` to prevent implicit conversions |
| Resource management | Follow Rule of 5 |
| Member initialization order | Follow declaration order in initializer list |

### QUICK_REFERENCE: Constructor Types Summary

| Constructor    | When Used                            | Key Signature             |
|----------------|--------------------------------------|---------------------------|
| Default        | No args                              | `A()`                     |
| Parameterized  | Args supplied                        | `A(int)`                  |
| Copy           | `A a2 = a1;`                         | `A(const A&)`             |
| Move           | `A a = std::move(temp);`             | `A(A&&)`                  |

### QUICK_REFERENCE: Answer Key for Practice Questions

| Q# | Answer | Explanation | Key Concept |
|----|--------|-------------|-------------|
| 1  | A<br>B | Member `A a` initialized before `B()` body | Member initialization order |
| 2  | A: 5 | Assignment in constructor body works but less efficient | Constructor body assignment |
| 3  | 10 | In-class initializer provides default value | In-class initializer |
| 4  | 20 | Initializer list overrides in-class default | Initializer list priority |
| 5  | 100 | Reference member correctly initialized in list | Reference initialization |
| 6  | ❌ Compilation Error | Const member must be initialized in list | Const member requirement |
| 7  | 20 10 | Members initialized in declaration order (x then y) | Declaration order vs list order |
| 8  | Param: 42<br>Default | Delegating constructor calls parameterized first | Delegating constructor |
| 9  | A<br>B | Member object constructed before containing class | Object composition |
| 10 | Default<br>(Copy may be elided) | RVO may eliminate copy; otherwise copy called | Copy elision/RVO |
| 11 | Default<br>Move | Temporary moved into x | Move constructor |
| 12 | Base<br>Derived | Object slicing occurs in func, but construction shows both | Object slicing |
| 13 | A()<br>A(int) | Two different constructors called | Constructor overloading |
| 14 | A<br>~A<br>End | Temporary destroyed immediately after expression | Temporary lifetime |
| 15 | X()<br>Y() | Member object constructed before containing class | Member construction order |

---