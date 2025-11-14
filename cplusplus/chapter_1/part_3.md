# C++ Object-Oriented Programming Study Material (Continued)

---

## TOPIC: Pure Virtual Functions and Abstract Base Classes

### THEORY_SECTION: Foundational Concepts

#### What is a Pure Virtual Function?

A **pure virtual function** is a virtual function with **no implementation in the base class**:

```cpp
class Shape {
public:
    virtual void draw() = 0; // pure virtual
};
```

The `= 0` syntax makes the function pure virtual, meaning derived classes **must** provide an implementation.

#### What is an Abstract Base Class (ABC)?

Any class **with at least one pure virtual function** becomes an **Abstract Base Class**, meaning:

- You **cannot instantiate** it directly
- It serves as a **contract/interface** for derived classes to implement
- It can have constructors, data members, and other non-pure virtual functions

#### Why It Matters in Interviews

Interviewers assess:
- **Polymorphism** understanding
- **Interface vs implementation** separation
- Design patterns (Strategy, Factory, Template Method)
- Tricky behavior around destructors, constructors, and partial overrides

### EDGE_CASES: Deep Internals and Tricky Scenarios

#### Can Abstract Classes Have Constructors or Destructors?

✅ **Yes** — constructors are **still called** in derived class construction.

```cpp
class Base {
public:
    Base() { std::cout << "Base()\n"; }
    virtual void f() = 0;
};
```

**Key Points:**
- Abstract classes can have **constructors**, **data members**, and **destructors**
- Constructors are called when derived objects are constructed
- You cannot directly instantiate the abstract class itself

#### Can a Pure Virtual Function Have a Body?

✅ **Yes.** You can define it outside the class:

```cpp
class A {
public:
    virtual void foo() = 0;
};

void A::foo() {
    std::cout << "Pure virtual with definition!\n";
}
```

**Use cases:**
- Providing default behavior that derived classes can optionally call
- Base class cleanup or partial behavior
- Shared logic across implementations

#### Pure Virtual Destructors

If you want a polymorphic base class, the destructor should be **virtual**. It **can also be pure**:

```cpp
class A {
public:
    virtual ~A() = 0;
};

A::~A() {
    std::cout << "Pure virtual destructor body\n";
}
```

**Critical:** Even though it's pure, you **must define it**, or linker error occurs.

#### Partial Override in Inheritance Chain

If a derived class does **not override all pure virtual functions**, it remains an **abstract class** itself:

```cpp
class A {
public:
    virtual void foo() = 0;
};

class B : public A {
    // forgets to override foo
};

int main() {
    B b; // ❌ compile error: B is still abstract
}
```

**However:**
```cpp
class A {
public:
    virtual void f() = 0;
};

class B : public A {};  // B is abstract

class C : public B {
public:
    void f() override {}  // C is NOT abstract
};

int main() {
    C c;  // ✅ Valid: C overrides f()
}
```

Intermediate classes **don't need** to override pure virtual functions if a further derived class does.

#### Can You Create Pointers or References of ABC Type?

✅ **Yes** — this is fundamental to polymorphism.

```cpp
Shape* s = new Circle(); // ✅ Allowed
Shape& ref = circle;     // ✅ Allowed
Shape s;                 // ❌ Not allowed
```

### CODE_EXAMPLES: Practical Demonstrations

#### Example 1: Basic Abstract Base Class

```cpp
class Shape {
public:
    virtual void draw() = 0;
    virtual double area() = 0;
    virtual ~Shape() {}
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    
    void draw() override {
        std::cout << "Drawing Circle\n";
    }
    
    double area() override {
        return 3.14159 * radius * radius;
    }
};
```

**Explanation:** `Shape` defines the interface, `Circle` provides concrete implementation.

#### Example 2: Interface Pattern with Strategy

```cpp
class IFormatter {
public:
    virtual std::string format(const std::string&) = 0;
    virtual ~IFormatter() {}
};

class UpperCaseFormatter : public IFormatter {
public:
    std::string format(const std::string& s) override {
        std::string res = s;
        std::transform(res.begin(), res.end(), res.begin(), ::toupper);
        return res;
    }
};

class LowerCaseFormatter : public IFormatter {
public:
    std::string format(const std::string& s) override {
        std::string res = s;
        std::transform(res.begin(), res.end(), res.begin(), ::tolower);
        return res;
    }
};

void printFormatted(IFormatter* f, const std::string& text) {
    std::cout << f->format(text) << "\n";
}
```

**Explanation:** Strategy pattern using abstract interface for pluggable formatting behavior.

#### Example 3: Pure Virtual Function with Body

```cpp
class Logger {
public:
    virtual void log(const std::string& msg) = 0;
    virtual ~Logger() = default;
};

void Logger::log(const std::string& msg) {
    std::cout << "[DEFAULT] " << msg << "\n";
}

class FileLogger : public Logger {
public:
    void log(const std::string& msg) override {
        Logger::log(msg);  // Call base implementation
        std::cout << "[FILE] Writing to file...\n";
    }
};
```

**Explanation:** Base class provides default behavior that derived classes can optionally use.

### INTERVIEW_QA: Comprehensive Q&A

#### Q1: What is a pure virtual function and how do you declare it?
**Difficulty:** #beginner  
**Category:** #syntax #design_pattern #interview_favorite  
**Concepts:** #pure_virtual #abstract_class #interface

**Answer:**
A pure virtual function is declared using `= 0` syntax:

```cpp
virtual void functionName() = 0;
```

It has no implementation in the base class and forces derived classes to provide an implementation. Any class with at least one pure virtual function becomes an abstract class.

---

#### Q2: Can you instantiate an abstract class?
**Difficulty:** #beginner  
**Category:** #syntax #interview_favorite  
**Concepts:** #abstract_class #instantiation

**Answer:**
❌ **No**, you cannot directly instantiate an abstract class:

```cpp
class A {
public:
    virtual void f() = 0;
};

int main() {
    A a;  // ❌ Error: cannot instantiate abstract class
    A* ptr = new B();  // ✅ OK: pointer to abstract class
}
```

However, you **can** create pointers and references to abstract class types.

---

#### Q3: Can abstract classes have constructors and data members?
**Difficulty:** #intermediate  
**Category:** #syntax #design_pattern  
**Concepts:** #abstract_class #constructors #data_members

**Answer:**
✅ **Yes**, abstract classes can have:
- Constructors (called during derived object construction)
- Data members
- Non-pure virtual functions
- Regular member functions
- Destructors (should be virtual)

```cpp
class AbstractBase {
protected:
    int data;
public:
    AbstractBase(int d) : data(d) {
        std::cout << "AbstractBase constructor\n";
    }
    virtual void pureFunc() = 0;
    void regularFunc() { std::cout << "Regular function\n"; }
};
```

---

#### Q4: What happens if you define a pure virtual destructor and don't provide a definition?
**Difficulty:** #advanced  
**Category:** #syntax #memory #interview_favorite  
**Concepts:** #pure_virtual #destructors #linker_error

**Answer:**
**Linker error** occurs. Even though the destructor is pure virtual, you **must** provide a definition:

```cpp
class A {
public:
    virtual ~A() = 0;  // Declaration
};

A::~A() {  // ✅ MUST provide definition
    std::cout << "A::~A\n";
}
```

**Why?** Base class destructors are always called during object destruction, so they need a body.

---

#### Q5: Can you call a pure virtual function from a base class constructor?
**Difficulty:** #advanced  
**Category:** #memory #design_pattern #interview_favorite  
**Concepts:** #pure_virtual #constructors #undefined_behavior #vtable

**Answer:**
❌ **Undefined behavior** or **crash**. During base class construction, the vtable isn't fully constructed yet:

```cpp
class A {
public:
    A() { f(); }  // ❌ Dangerous!
    virtual void f() = 0;
};

class B : public A {
public:
    void f() override { std::cout << "B\n"; }
};

int main() {
    B b;  // Undefined behavior or crash
}
```

**Why?** During `A()` constructor execution, the object's dynamic type is still `A`, not `B`, and `A::f()` is pure virtual.

---

#### Q6: Can a pure virtual function have a body/implementation?
**Difficulty:** #intermediate  
**Category:** #syntax #design_pattern #interview_favorite  
**Concepts:** #pure_virtual #function_body

**Answer:**
✅ **Yes**, pure virtual functions can have implementations:

```cpp
class A {
public:
    virtual void foo() = 0;
};

void A::foo() {
    std::cout << "Pure virtual with body\n";
}

class B : public A {
public:
    void foo() override {
        A::foo();  // Call base implementation
        std::cout << "B's implementation\n";
    }
};
```

**Use cases:**
- Providing default/shared behavior
- Base class cleanup logic
- Optional functionality derived classes can use

---

#### Q7: What happens if a derived class doesn't override all pure virtual functions?
**Difficulty:** #intermediate  
**Category:** #syntax #interview_favorite  
**Concepts:** #pure_virtual #abstract_class #inheritance

**Answer:**
The derived class remains **abstract** and cannot be instantiated:

```cpp
class A {
public:
    virtual void f() = 0;
    virtual void g() = 0;
};

class B : public A {
public:
    void f() override {}  // Only overrides f()
    // g() not overridden
};

int main() {
    B b;  // ❌ Error: B is still abstract
}
```

---

#### Q8: Can you create pointers or references to abstract class types?
**Difficulty:** #beginner  
**Category:** #syntax #interview_favorite  
**Concepts:** #abstract_class #pointers #references #polymorphism

**Answer:**
✅ **Yes**, this is fundamental to polymorphism:

```cpp
class AbstractBase {
public:
    virtual void func() = 0;
};

class Derived : public AbstractBase {
public:
    void func() override {}
};

int main() {
    AbstractBase* ptr = new Derived();  // ✅ OK
    AbstractBase& ref = *ptr;           // ✅ OK
    AbstractBase obj;                   // ❌ Error
}
```

---

#### Q9: Do intermediate classes in an inheritance chain need to override pure virtual functions?
**Difficulty:** #advanced  
**Category:** #syntax #design_pattern #interview_favorite  
**Concepts:** #pure_virtual #inheritance #abstract_class

**Answer:**
❌ **No**, intermediate classes don't need to override pure virtual functions:

```cpp
class A {
public:
    virtual void f() = 0;
};

class B : public A {};  // B is abstract (doesn't override)

class C : public B {
public:
    void f() override {}  // C overrides, so C is NOT abstract
};

int main() {
    C c;  // ✅ Valid
    B b;  // ❌ Error: B is abstract
}
```

**Key insight:** As long as **some derived class** provides the implementation before instantiation, intermediate classes can remain abstract.

---

#### Q10: Can pure virtual functions be called through a base pointer?
**Difficulty:** #intermediate  
**Category:** #syntax #polymorphism  
**Concepts:** #pure_virtual #virtual_dispatch #vtable

**Answer:**
✅ **Yes**, if called on a fully-constructed derived object with proper override:

```cpp
class A {
public:
    virtual void foo() = 0;
};

class B : public A {
public:
    void foo() override { std::cout << "B::foo\n"; }
};

int main() {
    A* a = new B();
    a->foo();  // ✅ Valid: calls B::foo
}
```

The call works because `a` points to a `B` object which has implemented `foo()`.

---

#### Q11: Can private virtual functions be pure virtual?
**Difficulty:** #advanced  
**Category:** #syntax #design_pattern  
**Concepts:** #pure_virtual #access_specifiers #override

**Answer:**
✅ **Yes**, and they can still be overridden:

```cpp
class A {
private:
    virtual void secret() = 0;
public:
    void callSecret() { secret(); }
};

class B : public A {
private:
    void secret() override { std::cout << "B::secret\n"; }
};

int main() {
    B b;
    b.callSecret();  // Output: B::secret
}
```

**Key point:** Access specifiers affect visibility, not override capability or virtual dispatch.

---

#### Q12: What's the difference between an abstract class and an interface in C++?
**Difficulty:** #intermediate  
**Category:** #design_pattern #interview_favorite  
**Concepts:** #abstract_class #interface #pure_virtual

**Answer:**
C++ doesn't have a formal "interface" keyword. Instead:

**Abstract Class:**
- Can have pure and non-pure virtual functions
- Can have data members
- Can have constructors
- Can mix interface and implementation

**Interface (by convention):**
- All functions are pure virtual
- No data members (except static const)
- Virtual destructor
- Purely defines behavior contract

```cpp
// Interface style
class ILogger {
public:
    virtual void log(const std::string&) = 0;
    virtual ~ILogger() {}
};

// Abstract class with mixed behavior
class Logger {
protected:
    std::string prefix;
public:
    Logger(const std::string& p) : prefix(p) {}
    virtual void log(const std::string&) = 0;
    void logWithPrefix(const std::string& msg) {
        log(prefix + msg);
    }
};
```

---

#### Q13: Can you have a pure virtual function in a class that's not meant to be abstract?
**Difficulty:** #beginner  
**Category:** #syntax  
**Concepts:** #pure_virtual #abstract_class

**Answer:**
❌ **No**, by definition, any class with at least one pure virtual function is abstract. You cannot "intend" for a class not to be abstract while having pure virtual functions. If you want all functions implemented, don't use `= 0`.

---

#### Q14: What happens if you forget the `override` keyword when implementing a pure virtual function?
**Difficulty:** #intermediate  
**Category:** #syntax #interview_favorite  
**Concepts:** #pure_virtual #override #function_hiding

**Answer:**
The function is still overridden **if signatures match exactly**, but without `override`, the compiler won't catch signature mismatches:

```cpp
class A {
public:
    virtual void foo() const = 0;
};

class B : public A {
public:
    void foo() {}  // Missing const - NOT an override!
};

int main() {
    B b;  // ❌ Error: B is still abstract
}
```

✅ **Best practice:** Always use `override` to catch such errors.

---

#### Q15: Can you have non-virtual member functions in an abstract class?
**Difficulty:** #beginner  
**Category:** #syntax  
**Concepts:** #abstract_class #virtual_functions

**Answer:**
✅ **Yes**, abstract classes can have regular (non-virtual) member functions:

```cpp
class AbstractBase {
public:
    virtual void mustImplement() = 0;
    
    void regularFunction() {
        std::cout << "Non-virtual function\n";
    }
    
    static void staticFunction() {
        std::cout << "Static function\n";
    }
};
```

---

### PRACTICE_TASKS: 15 Tricky Quiz Questions

#### Q1: Can you instantiate this?
```cpp
class A {
public:
    virtual void foo() = 0;
};

class B : public A {
    // no override
};

int main() {
    B b;
}
```

#### Q2: What's the output?
```cpp
class A {
public:
    A() { f(); }
    virtual void f() = 0;
};

class B : public A {
public:
    void f() override { std::cout << "B::f()\n"; }
};

int main() {
    B b;
}
```

#### Q3: What happens here?
```cpp
class A {
public:
    virtual ~A() = 0;
};

int main() {
    A* a;
}
```

#### Q4: Which lines cause errors?
```cpp
class A {
public:
    virtual void f() = 0;
};

class B : public A {};

class C : public B {
public:
    void f() override {}
};

int main() {
    C c;
}
```

#### Q5: Output?
```cpp
class A {
public:
    virtual void foo() = 0;
    virtual ~A() {}
};

class B : public A {
public:
    void foo() override { std::cout << "B::foo\n"; }
    ~B() { std::cout << "B::~B\n"; }
};

int main() {
    A* a = new B();
    a->foo();
    delete a;
}
```

#### Q6: Output?
```cpp
class A {
public:
    A() { std::cout << "A()\n"; }
    virtual void f() = 0;
};

class B : public A {
public:
    void f() override { std::cout << "B::f()\n"; }
};

int main() {
    B b;
}
```

#### Q7: Is this allowed?
```cpp
class A {
public:
    virtual void foo() = 0;
    void bar() {}
};
```

#### Q8: What's the output?
```cpp
class A {
public:
    virtual void f() = 0;
    void g() { std::cout << "A::g\n"; }
};

class B : public A {
public:
    void f() override { std::cout << "B::f\n"; }
};

int main() {
    A* a = new B();
    a->g();
}
```

#### Q9: Output?
```cpp
class A {
public:
    virtual void f() = 0;
    virtual ~A() = 0;
};

A::~A() {
    std::cout << "A::~A\n";
}

class B : public A {
public:
    void f() override { std::cout << "B::f\n"; }
    ~B() { std::cout << "B::~B\n"; }
};

int main() {
    A* a = new B();
    delete a;
}
```

#### Q10: Compile error?
```cpp
class A {
public:
    virtual void foo() = 0;
};

class B : public A {
public:
    void foo() override final {}
};

class C : public B {
public:
    void foo() override {}
};
```

#### Q11: Can you define a body for a pure virtual function?
```cpp
class A {
public:
    virtual void foo() = 0;
};

void A::foo() {
    std::cout << "defined body\n";
}
```

#### Q12: Is this legal?
```cpp
class A {
public:
    virtual void foo() = 0;
};

class B : public A {
    void foo() {}  // private
};
```

#### Q13: Abstract or not?
```cpp
class A {
public:
    virtual void foo() = 0;
};

class B : public A {
public:
    void foo() override {}
};

class C : public B {
    // no new pure functions
};

int main() {
    C c;
}
```

#### Q14: What does this print?
```cpp
class A {
public:
    virtual void f() = 0;
};

class B : public A {
public:
    void f() override { std::cout << "B\n"; }
};

class C : public B {
public:
    void f() override { std::cout << "C\n"; }
};

int main() {
    A* a = new C();
    a->f();
}
```

#### Q15: Is this instantiable?
```cpp
class A {
public:
    virtual void f() = 0;
};

class B : public A {
public:
    // hiding the base version
    void f(int) {}
};

int main() {
    B b;
}
```

### QUICK_REFERENCE: Answer Key for Practice Questions

| Q# | Answer | Explanation | Key Concept |
|----|--------|-------------|-------------|
| 1  | ❌ Error | B doesn't override `foo()`, remains abstract | Partial override |
| 2  | Undefined behavior/Crash | Calling pure virtual from constructor | Constructor vtable |
| 3  | ❌ Linker error | Pure virtual destructor must have definition | Pure virtual destructor |
| 4  | ✅ No error | C overrides `f()`, intermediate B can remain abstract | Inheritance chain |
| 5  | `B::foo`<br>`B::~B` | Normal virtual dispatch and destruction | Virtual functions |
| 6  | `A()` | Constructor executes normally, B constructs after | Constructor order |
| 7  | ✅ Yes | Mix of pure virtual and regular functions is allowed | Abstract class definition |
| 8  | `A::g` | Non-virtual functions use static binding | Non-virtual dispatch |
| 9  | `B::~B`<br>`A::~A` | Virtual destructor chain works correctly | Pure virtual destructor |
| 10 | ✅ Error | Cannot override `final` function | Final keyword |
| 11 | ✅ Yes | Pure virtual can have implementation | Pure virtual body |
| 12 | ✅ Yes | Private override is legal | Access specifiers |
| 13 | Not abstract | B overrides `foo()`, C inherits it | Inherited override |
| 14 | `C` | Virtual dispatch to most derived | Multi-level inheritance |
| 15 | ❌ Not instantiable | `f(int)` doesn't override `f()`, B still abstract | Function hiding |

### QUICK_REFERENCE: Summary Table

| Concept | Key Point |
|---------|-----------|
| Pure virtual | `= 0` suffix, must override in derived class |
| Abstract class | At least one pure virtual function |
| Instantiation | Cannot instantiate abstract classes |
| Pointers/References | Can point to abstract types |
| Constructors | Abstract classes can have constructors |
| Destructors | Can be pure, but must be defined |
| Function body | Pure virtual can still have implementation |
| Intermediate classes | Don't need to override if further derived class does |
| vtable use | Not fully constructed in base constructor |
| Override requirement | All pure virtuals must be overridden before instantiation |

---
