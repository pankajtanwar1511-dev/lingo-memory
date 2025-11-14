# C++ Object-Oriented Programming Study Material (Continued)

---

## TOPIC: Encapsulation, Inheritance, Polymorphism

### THEORY_SECTION: High-Level Overview

#### Encapsulation
- **Definition**: Binding data and methods that operate on that data into a single unit (class)
- **Goal**: Restrict direct access to object internals via `private`, `protected`, `public`
- **Why it matters**: Enables **data hiding**, **interface-based programming**, and **maintainability**

#### Inheritance
- **Definition**: Mechanism for a class (derived) to acquire properties and behaviors from another (base)
- **Why it matters**: Promotes **code reuse**, enables **hierarchies**, and is essential for **polymorphism**

#### Polymorphism
- **Definition**: Ability of objects to be treated as instances of their base class, but exhibit behavior of derived class
- **Types**:
  - **Compile-time**: Function overloading, templates
  - **Run-time**: Via **virtual functions**
- **Why it matters**: Central to **design patterns**, **interface-based programming**, and **runtime flexibility**

### THEORY_SECTION: Deep Internals

#### Encapsulation Internals
- Encapsulation is enforced by the **compiler**, not by the binary layout
- Even `private` members exist in memory, and access can be broken with hacks
- `friend` is the legal escape hatch

#### Inheritance Internal Mechanism

**Object Layout:**
1. Derived class object includes a **base class subobject**
2. Data members are laid out **from base to derived**

**Function Resolution:**
1. Non-virtual functions are **statically bound**
2. Virtual functions use **vtable lookup** at runtime

#### Polymorphism Internal Working

When a class has **virtual functions**, the compiler:
- Adds a **vptr** (virtual pointer) to each object instance
- Points to a **vtable** (virtual table) at runtime
- If a derived class overrides the function, the **vptr is updated** to point to derived's version

### CODE_EXAMPLES: Encapsulation

```cpp
class BankAccount {
private:
    double balance;

public:
    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    double getBalance() const { return balance; }
};
```

The class hides the balance from the user while exposing controlled interaction via `deposit()` and `getBalance()`.

### EDGE_CASES: Function Hiding in Inheritance

```cpp
class Base {
public:
    void func(int) { std::cout << "Base::func(int)\n"; }
};

class Derived : public Base {
public:
    void func(double) { std::cout << "Derived::func(double)\n"; }
};

int main() {
    Derived d;
    d.func(10); // Calls Derived::func(double) due to hiding
}
```

Even though `func(int)` exists in base, it is **hidden** by name-matching `func(double)` in derived.

**Solution:** Use `using Base::func;` to bring base class overloads into scope.

### EDGE_CASES: Inheritance and Access

```cpp
class A {
protected:
    void protectedFunc() {}
};

class B : private A {
public:
    void call() {
        protectedFunc(); // ✅ Still accessible within B
    }
};

class C : public B {
public:
    void test() {
        // protectedFunc(); ❌ Error: A::protectedFunc is now private in B
    }
};
```

The **access modifier in inheritance (private/public)** changes what derived classes can see.

### EDGE_CASES: Object Slicing

```cpp
class Animal {
public:
    virtual void speak() const { std::cout << "Animal speaks\n"; }
};

class Dog : public Animal {
public:
    void speak() const override { std::cout << "Dog barks\n"; }
};

void printAnimal(Animal a) { // ❌ Slicing: Dog part is lost
    a.speak();               // prints "Animal speaks"
}

int main() {
    Dog d;
    printAnimal(d);
}
```

Object slicing cuts off the derived part when **passing by value**.

**Solution:** Always pass polymorphic objects **by reference or pointer**.

### EDGE_CASES: Virtual Destructor Requirement

```cpp
class Base {
public:
    ~Base() { std::cout << "Base dtor\n"; }
};

class Derived : public Base {
public:
    ~Derived() { std::cout << "Derived dtor\n"; }
};

void destroy(Base* b) {
    delete b; // ❌ Only Base dtor called, Derived is leaked
}
```

**Solution:** Use **`virtual ~Base()`** in polymorphic bases to ensure correct destruction chain.

### EDGE_CASES: Calling Virtual Functions in Constructor

```cpp
class Base {
public:
    Base() { speak(); } // ❌ Never call virtuals in constructor
    virtual void speak() { std::cout << "Base speaks\n"; }
};

class Derived : public Base {
public:
    void speak() override { std::cout << "Derived speaks\n"; }
};

int main() {
    Derived d; // Prints "Base speaks"
}
```

During base constructor, **dynamic type is still Base**, so virtual dispatch resolves to Base version.

### QUICK_REFERENCE: Summary Table

| Concept          | Deep Insight or Pitfall                              |
|------------------|------------------------------------------------------|
| Encapsulation    | Compiler-enforced, can be hacked via pointer casts   |
| Inheritance      | Default access and visibility can confuse behavior   |
| Function hiding  | Happens when derived class defines a same-name func  |
| Object slicing   | Passing by value cuts off derived parts              |
| Virtual dispatch | Requires vtable, vptr; access modifiers don't block  |
| Virtual in ctor  | Never calls derived class virtuals during construction |
| Destruction      | Always use virtual destructors in base               |

### INTERVIEW_QA: Core Concepts

#### Q1: What is Encapsulation in C++? How is it implemented?
**Difficulty:** #beginner  
**Category:** #design_pattern #interview_favorite  
**Concepts:** #encapsulation #access_specifiers #abstraction

**Answer:**
Encapsulation is the concept of binding data and methods that manipulate it within a class, restricting direct access to internal details.

- Enforced using **access specifiers**: `private`, `protected`, `public`
- Supports **abstraction** and **modularity**
- **friend** keyword can break encapsulation when needed

---

#### Q2: Is C++'s encapsulation strict? Can private members be accessed?
**Difficulty:** #intermediate  
**Category:** #memory #syntax  
**Concepts:** #encapsulation #undefined_behavior #type_safety

**Answer:**
Encapsulation in C++ is **enforced at compile time** only. You can access private members using:
- `friend` functions/classes
- Pointer casting with knowledge of object layout (UB)
- Offset hacks (unsafe and undefined behavior)

**But this breaks safety and maintainability.**

---

#### Q3: What's the difference between public, protected, and private inheritance?
**Difficulty:** #intermediate  
**Category:** #inheritance #design_pattern #interview_favorite  
**Concepts:** #inheritance #access_specifiers

**Answer:**

| Inheritance Type | Base Class Members Accessible in Derived? | External View |
|------------------|-------------------------------------------|----------------|
| `public`         | Public & Protected remain same            | IS-A          |
| `protected`      | Public becomes Protected                  | IS-A (internally) |
| `private`        | Public & Protected become Private         | HAS-A (like composition) |

**Use Case:**
- `public`: To enable polymorphism
- `private`: To implement in terms of another class
- `protected`: Rare; used for internal extension

---

#### Q4: How does function hiding work in inheritance?
**Difficulty:** #intermediate  
**Category:** #syntax #interview_favorite  
**Concepts:** #inheritance #name_hiding #function_overloading

**Answer:**
If a derived class declares a function with the **same name** as in base (regardless of signature), it hides all base overloads.

```cpp
class Base { public: void func(int); };
class Derived : public Base { public: void func(double); };
```

`Derived::func` hides `Base::func(int)`

**Fix:** `using Base::func;` to bring base overloads into scope.

---

#### Q5: What is polymorphism? How is it achieved in C++?
**Difficulty:** #beginner  
**Category:** #design_pattern #interview_favorite  
**Concepts:** #polymorphism #virtual_functions #inheritance

**Answer:**
Polymorphism = ability to call derived behavior via base pointer or reference.

In C++, **runtime polymorphism** is achieved via:
- **Virtual functions**
- Inheritance
- Base class pointer/reference

---

#### Q6: What is object slicing? How to prevent it?
**Difficulty:** #intermediate  
**Category:** #memory #interview_favorite  
**Concepts:** #object_slicing #polymorphism #value_semantics

**Answer:**
Occurs when a derived object is assigned or passed **by value** to a base class object. The derived part is "sliced off."

```cpp
class Base { ... };
class Derived : public Base { int extra; };
Base b = Derived(); // slicing
```

**Prevention:**
- Use **reference/pointer**
- Make base class's copy/move constructors **protected or deleted**

---

#### Q7: Can private/protected virtual functions be overridden?
**Difficulty:** #advanced  
**Category:** #syntax #design_pattern #interview_favorite  
**Concepts:** #virtual_functions #access_specifiers #override

**Answer:**
✅ **Yes**, access specifier does **not affect overriding**, only how it can be called.

```cpp
class Base {
protected:
    virtual void func(); // can be overridden
};
class Derived : public Base {
public:
    void func() override; // overrides, makes it public
};
```

---

#### Q8: What is a vtable? What is a vptr?
**Difficulty:** #advanced  
**Category:** #memory #performance #interview_favorite  
**Concepts:** #vtable #vptr #virtual_functions #polymorphism

**Answer:**
- **vtable**: A lookup table per class storing function pointers for virtual functions
- **vptr**: A hidden pointer inside each object pointing to the class's vtable

Allows runtime dispatch of overridden functions.

---

#### Q9: Can a constructor be virtual? Why or why not?
**Difficulty:** #intermediate  
**Category:** #syntax #design_pattern #interview_favorite  
**Concepts:** #constructors #virtual_functions #vtable

**Answer:**
❌ No. Virtual mechanism requires an object and its vptr — and that doesn't exist during construction.

However, **destructors should be virtual** in polymorphic base classes to ensure proper cleanup.

---

#### Q10: Why is it dangerous to call virtual functions in constructors/destructors?
**Difficulty:** #advanced  
**Category:** #memory #design_pattern #interview_favorite  
**Concepts:** #virtual_functions #constructors #destructors #vptr

**Answer:**
During construction:
- Only the **base part** is constructed, so virtual calls are dispatched to **base implementation**

During destruction:
- Derived part is already destroyed, so again, **base version** is called

---

#### Q11: Why must the base class destructor be virtual in polymorphic hierarchies?
**Difficulty:** #intermediate  
**Category:** #memory #design_pattern #interview_favorite  
**Concepts:** #destructors #virtual_functions #polymorphism #resource_management

**Answer:**
To ensure the derived destructor runs when deleting via base pointer:

```cpp
Base* b = new Derived();
delete b; // Only safe if Base::~Base() is virtual
```

If not virtual → derived part isn't destroyed → **resource leak or UB**.

---

#### Q12: Can virtual functions be private? How do you override them?
**Difficulty:** #advanced  
**Category:** #syntax #design_pattern  
**Concepts:** #virtual_functions #access_specifiers #override

**Answer:**
✅ Yes, private virtual functions can be overridden in derived classes.
But can only be **called from within the base class** (even if overridden).

---

#### Q13: What is the difference between override, final, and virtual?
**Difficulty:** #intermediate  
**Category:** #syntax #interview_favorite  
**Concepts:** #virtual_functions #override #final

**Answer:**

| Keyword   | Meaning |
|-----------|---------|
| `virtual` | Marks function for dynamic dispatch |
| `override` | Ensures function is **actually overriding** something |
| `final` | Prevents further overriding of a function/class |

---

#### Q14: What happens if you delete a base pointer without a virtual destructor?
**Difficulty:** #intermediate  
**Category:** #memory #interview_favorite  
**Concepts:** #destructors #virtual_functions #undefined_behavior #memory_leak

**Answer:**
Only the base class's destructor runs → derived class resources are **not cleaned** → memory/resource **leak**.

---

#### Q15: Does the vtable exist per object or per class?
**Difficulty:** #intermediate  
**Category:** #memory #performance  
**Concepts:** #vtable #vptr #memory_layout

**Answer:**
The **vtable exists per class** (shared by all objects).
Each object has its own **vptr** pointing to the class's vtable.

---

### INTERVIEW_QA: Advanced Questions

#### Q16: Can `const` be part of overriding functions?
**Difficulty:** #advanced  
**Category:** #syntax #interview_favorite  
**Concepts:** #virtual_functions #const_correctness #override #function_signature

**Answer:**
Yes, `const` is part of the function signature for **member functions**, and it **must match** during overriding.

```cpp
class Base {
public:
    virtual void show() const {
        std::cout << "Base::show()\n";
    }
};

class Derived : public Base {
public:
    // Correct override
    void show() const override {
        std::cout << "Derived::show()\n";
    }

    // Incorrect — missing `const` will cause compiler error
    // void show() override; ❌
};
```

**Why this matters:**
- `void func() const;` and `void func();` are different functions
- Forgetting `const` in override → **no overriding**, just hiding → **polymorphism breaks**

---

#### Q17: How are virtual function tables implemented behind the scenes?
**Difficulty:** #advanced  
**Category:** #memory #performance #interview_favorite  
**Concepts:** #vtable #vptr #virtual_functions #compiler_internals

**Answer:**
- Every class with virtual functions gets a **vtable** (a static table of function pointers)
- Each object of such a class has a hidden **vptr** pointing to the class's vtable
- At runtime, calling a virtual function dereferences vptr and calls the correct function

**Memory Layout Example:**

```
Derived obj;

[ obj ]:
+-----------------+
| vptr ---------->+--> vtable (Derived)
| data members    |
+-----------------+

vtable (Derived):
+-------------------------+
| &Derived::foo           |
| &Derived::bar           |
+-------------------------+
```

**Key Facts:**
- vtable is **per class**, not per object
- `vptr` is a hidden pointer in each object, initialized at **construction time**
- If no virtual functions → no vptr/vtable
- Constructors don't call virtual functions via vtable

---

#### Q18: Can you override a non-virtual function?
**Difficulty:** #beginner  
**Category:** #syntax  
**Concepts:** #inheritance #virtual_functions #static_binding

**Answer:**
❌ No — you can **redefine** it in derived, but it won't behave polymorphically.

---

#### Q19: Can you access a private base class's members in a derived class?
**Difficulty:** #beginner  
**Category:** #syntax  
**Concepts:** #inheritance #access_specifiers

**Answer:**
❌ No — even though the base is part of the derived object, private members are inaccessible directly.

---

#### Q20: Can you override a virtual function and make it non-virtual?
**Difficulty:** #intermediate  
**Category:** #syntax  
**Concepts:** #virtual_functions #inheritance

**Answer:**
❌ No — once declared `virtual` in base, it's always virtual down the chain.

---

#### Q21: Can virtual functions be static?
**Difficulty:** #beginner  
**Category:** #syntax  
**Concepts:** #virtual_functions #static_members

**Answer:**
❌ No — static functions are not bound to object instances and thus cannot be virtual.

---

#### Q22: What is the size of an object with only a virtual function? Why?
**Difficulty:** #intermediate  
**Category:** #memory #performance  
**Concepts:** #vtable #vptr #memory_layout #object_size

**Answer:**

```cpp
class A {
public:
    virtual void foo() {}
};
```

Usually, the size is **equal to the size of a pointer** (`sizeof(void*)`), due to the hidden **vptr**.

But it could vary with multiple inheritance, alignment, compiler, or padding rules.

---

#### Q23: What happens if you forget to mark an override with `override` keyword?
**Difficulty:** #intermediate  
**Category:** #syntax #interview_favorite  
**Concepts:** #override #virtual_functions #compiler_checks

**Answer:**
- The function is still overridden **if the signature exactly matches**, due to the base class declaration
- But **lack of `override`** means **no compiler check** — if you mistype the function signature, it silently becomes a **new method** (function hiding), and **vtable dispatch fails**

```cpp
class Base {
public:
    virtual void show() const;
};

class Derived : public Base {
public:
    void show();  // no const: not override, it's hiding
};
```

---

#### Q24: Can two functions with same name but different `const` qualifiers coexist in a class?
**Difficulty:** #intermediate  
**Category:** #syntax  
**Concepts:** #const_correctness #function_overloading

**Answer:**
Yes — `const` is part of the signature for member functions.

```cpp
class Test {
public:
    void show();        // non-const version
    void show() const;  // const version
};
```

Overload resolution will choose based on the **constness of the object**:

```cpp
Test t1;
t1.show();          // non-const

const Test t2;
t2.show();          // const
```

---

#### Q25: How does private virtual function inheritance work?
**Difficulty:** #advanced  
**Category:** #syntax #design_pattern #interview_favorite  
**Concepts:** #virtual_functions #access_specifiers #override #vtable

**Answer:**
**Private virtual functions can be overridden**, even though they're **not visible** in the derived class.

```cpp
class Base {
private:
    virtual void secret() {
        std::cout << "Base::secret()\n";
    }

public:
    virtual void callSecret() {
        secret();  // calls Base::secret unless overridden
    }
};

class Derived : public Base {
private:
    void secret() override {
        std::cout << "Derived::secret()\n";
    }
};
```

**Output:**
```cpp
Derived d;
d.callSecret();  // Output: Derived::secret()
```

Even though `secret()` is private in `Base`, it's still **part of vtable**, so `Derived::secret()` overrides it.

**Key Takeaways:**

| Behavior                            | Answer |
|-------------------------------------|--------|
| Can you override private virtual?   | ✅ Yes |
| Can you directly call it in derived?| ❌ No (not accessible directly) |
| Will vtable call override correctly?| ✅ Yes (runtime dispatch works) |

**Access specifier applies to calling, not overriding.**

---

#### Q26: Can a private virtual function in base class be overridden and made public in derived?
**Difficulty:** #advanced  
**Category:** #syntax #design_pattern  
**Concepts:** #virtual_functions #access_specifiers #override

**Answer:**
✅ Yes, you can change its **access level** in derived:

```cpp
class Base {
private:
    virtual void display() { std::cout << "Base\n"; }
};

class Derived : public Base {
public:
    void display() override { std::cout << "Derived\n"; }
};
```

Now `Derived::display()` is public, even though `Base::display()` was private.

---

#### Q27: Do default arguments work with virtual functions?
**Difficulty:** #advanced  
**Category:** #syntax #interview_favorite  
**Concepts:** #virtual_functions #default_arguments #static_binding

**Answer:**
Default arguments are **resolved statically** (at compile-time), based on the **type of the pointer**, not the object.

```cpp
class A {
public:
    virtual void print(int x = 10) { std::cout << x << "\n"; }
};

class B : public A {
public:
    void print(int x = 20) override { std::cout << x << "\n"; }
};

int main() {
    A* a = new B();
    a->print();  // Output: 10 (uses A's default, but calls B's implementation)
}
```

**Key Rule:** **Default arguments are bound statically**, even if the function is virtual.

---

### CODE_EXAMPLES: Comprehensive Practice Examples

#### Example 1: Private Virtual Function & Access in Derived

```cpp
#include <iostream>

class Base {
private:
    virtual void secret() const {
        std::cout << "Base secret\n";
    }

public:
    void callSecret() const {
        secret();
    }
};

class Derived : public Base {
private:
    void secret() const override {  // Allowed!
        std::cout << "Derived secret\n";
    }
};

int main() {
    Derived d;
    d.callSecret();  // Output: Derived secret
}
```

Access specifier does not affect vtable behavior! It only restricts **external access**, not **overriding** or virtual dispatch.

---

#### Example 2: Virtual Call Inside Constructor

```cpp
#include <iostream>

class Base {
public:
    Base() {
        who();  // BAD: Calls Base::who
    }

    virtual void who() const {
        std::cout << "Base\n";
    }
};

class Derived : public Base {
public:
    void who() const override {
        std::cout << "Derived\n";
    }
};

int main() {
    Derived d;  // Output: Base
}
```

Virtual calls inside constructors/destructors resolve to the current construction phase — **never override** during base construction.

---

#### Example 3: Slicing Example with Polymorphic Class

```cpp
#include <iostream>

class Base {
public:
    int a = 1;
    virtual void print() const { std::cout << "Base: " << a << "\n"; }
};

class Derived : public Base {
public:
    int b = 2;
    void print() const override { std::cout << "Derived: " << a << ", " << b << "\n"; }
};

void show(Base b) {  // Slicing!
    b.print();       // Calls Base::print
}

int main() {
    Derived d;
    show(d);  // Output: Base: 1
}
```

Avoid **pass-by-value** for polymorphic types! Always use references/pointers.

---

#### Example 4: Object Size with Virtual Function

```cpp
#include <iostream>

class A {
    virtual void foo() {}
};

class B {
    int x;
    virtual void foo() {}
};

int main() {
    std::cout << sizeof(A) << "\n";  // Usually 8 (only vptr)
    std::cout << sizeof(B) << "\n";  // Usually 12 or 16 (int + vptr + padding)
}
```

Useful to understand memory layout and why `vptr` adds hidden overhead.

---

#### Example 5: Pure Virtual Function with Implementation

```cpp
#include <iostream>

class Base {
public:
    virtual void show() = 0;
};

void Base::show() {
    std::cout << "Base implementation\n";
}

class Derived : public Base {
public:
    void show() override {
        Base::show();  // Legal!
        std::cout << "Derived show\n";
    }
};

int main() {
    Derived d;
    d.show();
}
```

A pure virtual function **can have a body**, useful for shared default behavior.

---

#### Example 6: Polymorphic Destruction Without Virtual Destructor

```cpp
#include <iostream>

class Base {
public:
    ~Base() { std::cout << "Base destructor\n"; }
};

class Derived : public Base {
public:
    ~Derived() { std::cout << "Derived destructor\n"; }
};

int main() {
    Base* b = new Derived;
    delete b;  // ⚠️ Only Base destructor called — UB!
}
```

This is **undefined behavior** — **always use virtual destructors** in base classes.

---

#### Example 7: Virtual Function Hiding Due to Signature Mismatch

```cpp
#include <iostream>

class Base {
public:
    virtual void func(int x) { std::cout << "Base\n"; }
};

class Derived : public Base {
public:
    void func(double x) { std::cout << "Derived\n"; }  // Hides base, not override
};

int main() {
    Derived d;
    d.func(5);  // Calls Derived::func(double), not virtual dispatch!
}
```

Use `using Base::func;` in `Derived` to bring base overloads back into scope.

---

#### Example 8: Virtual + Const Overload Conflict

```cpp
#include <iostream>

class Base {
public:
    virtual void log() const { std::cout << "Base const\n"; }
};

class Derived : public Base {
public:
    void log() override { std::cout << "Derived non-const\n"; }  // ERROR
};
```

This is **not a valid override** due to signature mismatch. Use `override` to catch this early.

---

#### Example 9: Multiple Levels of Inheritance with vtable chain

```cpp
#include <iostream>

class A {
public:
    virtual void foo() { std::cout << "A\n"; }
};

class B : public A {
public:
    void foo() override { std::cout << "B\n"; }
};

class C : public B {
public:
    void foo() override { std::cout << "C\n"; }
};

int main() {
    A* obj = new C;
    obj->foo();  // Output: C
}
```

Virtual dispatch works **all the way up the chain**, regardless of pointer type.

---

### PRACTICE_TASKS: Challenge Questions

#### Challenge Set: 20 Tricky Output Prediction Questions

**Q1:** What is the output?
```cpp
class Base {
public:
    virtual void say() { std::cout << "Base\n"; }
};

class Derived : public Base {
public:
    void say() override { std::cout << "Derived\n"; }
};

int main() {
    Base b;
    Derived d;
    Base* ptr = &d;
    b.say();
    ptr->say();
}
```

**Q2:** Which constructor/destructor is called?
```cpp
class A {
public:
    A() { std::cout << "A\n"; }
    virtual ~A() { std::cout << "~A\n"; }
};

class B : public A {
public:
    B() { std::cout << "B\n"; }
    ~B() { std::cout << "~B\n"; }
};

int main() {
    A* p = new B();
    delete p;
}
```

**Q3:** Will this compile? If yes, what's the output?
```cpp
class A {
private:
    virtual void foo() { std::cout << "A\n"; }
public:
    void call() { foo(); }
};

class B : public A {
private:
    void foo() override { std::cout << "B\n"; }
};

int main() {
    B b;
    b.call();
}
```

**Q4:** What will be printed?
```cpp
class A {
public:
    virtual void show() { std::cout << "A\n"; }
};

class B : public A {
public:
    void show() { std::cout << "B\n"; }
};

void func(A a) {
    a.show();
}

int main() {
    B b;
    func(b);
}
```

**Q5:** Will this compile?
```cpp
class A {
public:
    virtual void foo() = 0;
};

void A::foo() {
    std::cout << "A's impl\n";
}
```

**Q6:** Will this cause slicing? If yes, what's the impact?
```cpp
class A {
public:
    int x = 10;
    virtual void show() { std::cout << x << "\n"; }
};

class B : public A {
public:
    int y = 20;
    void show() override { std::cout << x << ", " << y << "\n"; }
};

void f(A a) {
    a.show();
}

int main() {
    B b;
    f(b);
}
```

**Q7:** Output?
```cpp
class Base {
public:
    virtual void fun() { std::cout << "Base\n"; }
};

class Derived : public Base {
public:
    void fun() override { std::cout << "Derived\n"; }
};

int main() {
    Derived d;
    Base& ref = d;
    ref.fun();
}
```

**Q8:** Which member is called here?
```cpp
class Base {
public:
    virtual void fun() const { std::cout << "Base const\n"; }
};

class Derived : public Base {
public:
    void fun() { std::cout << "Derived non-const\n"; }
};

int main() {
    Derived d;
    d.fun();
}
```

**Q9:** Output or error?
```cpp
class A {
public:
    virtual void foo() { std::cout << "A\n"; }
};

class B : public A {
public:
    void foo(int) { std::cout << "B\n"; }
};

int main() {
    B b;
    b.foo(10);
}
```

**Q10:** How many vtables/vptrs in this case?
```cpp
class A {
    virtual void a() {}
};

class B {
    virtual void b() {}
};

class C : public A, public B {
};
```

**Q11:** Output?
```cpp
class A {
public:
    A() { show(); }
    virtual void show() { std::cout << "A\n"; }
};

class B : public A {
public:
    void show() override { std::cout << "B\n"; }
};

int main() {
    B b;
}
```

**Q12:** Which destructor is called?
```cpp
class A {
public:
    ~A() { std::cout << "~A\n"; }
};

class B : public A {
public:
    ~B() { std::cout << "~B\n"; }
};

int main() {
    A* ptr = new B;
    delete ptr;
}
```

**Q13:** What's wrong with this?
```cpp
class A {
    virtual void foo() = 0;
    ~A() {}
};
```

**Q14:** Access or override issue?
```cpp
class A {
private:
    virtual void f() {}
};

class B : public A {
private:
    void f() override {}
};
```

**Q15:** Object Slicing & Polymorphism
```cpp
class A {
public:
    virtual void show() const { std::cout << "A\n"; }
};

class B : public A {
public:
    void show() const override { std::cout << "B\n"; }
};

int main() {
    B b;
    A a = b;
    a.show();
}
```

**Q16:** When does vptr get updated in constructors?
```cpp
class A {
public:
    A() { who(); }
    virtual void who() { std::cout << "A\n"; }
};

class B : public A {
public:
    void who() override { std::cout << "B\n"; }
};

int main() {
    B b;
}
```

**Q17:** Will this compile? What's the output?
```cpp
class A {
public:
    virtual void print(int x = 10) { std::cout << x << "\n"; }
};

class B : public A {
public:
    void print(int x = 20) override { std::cout << x << "\n"; }
};

int main() {
    A* a = new B;
    a->print();
}
```

**Q18:** Output?
```cpp
class A {
public:
    virtual void foo() { std::cout << "A\n"; }
};

class B : public A {
public:
    void foo() override { std::cout << "B\n"; }
};

class C : public B {
public:
    void foo() override { std::cout << "C\n"; }
};

int main() {
    A* a = new C;
    a->foo();
}
```

**Q19:** Which constructors are called?
```cpp
class A {
public:
    A() { std::cout << "A\n"; }
};

class B : public A {
public:
    B() { std::cout << "B\n"; }
};

class C : public B {
public:
    C() { std::cout << "C\n"; }
};

int main() {
    C obj;
}
```

**Q20:** Which ones are legal Rule of 5 implementations?
```cpp
class A {
    A(const A&) = delete;
    A& operator=(const A&) = delete;
    A(A&&) = delete;
    A& operator=(A&&) = delete;
};
```

### QUICK_REFERENCE: Answer Key for Practice Questions

| Q# | Answer | Key Concept |
|----|--------|-------------|
| 1  | Base<br>Derived | Virtual dispatch through pointer |
| 2  | A<br>B<br>~B<br>~A | Virtual destructor ensures proper cleanup |
| 3  | Yes, B | Private virtual can be overridden |
| 4  | A | Object slicing |
| 5  | Yes | Pure virtual can have implementation |
| 6  | Yes, 10 | Slicing loses derived part |
| 7  | Derived | Virtual dispatch through reference |
| 8  | Derived non-const | Not an override, different signature |
| 9  | B | Overload, not override |
| 10 | C has 2 vptrs | Multiple inheritance creates multiple vptrs |
| 11 | A | vptr not set to derived during base construction |
| 12 | ~A | No virtual destructor = only base called |
| 13 | Destructor should be virtual | Good practice for polymorphic classes |
| 14 | Allowed | Can override private virtual |
| 15 | A | Object slicing |
| 16 | A | vptr updates after base constructor |
| 17 | 10 | Default args bound statically |
| 18 | C | Multi-level virtual dispatch works |
| 19 | A<br>B<br>C | Constructor order: base to derived |
| 20 | Legal if no resources managed | Destructor implicitly defined |

---
