# C++ Object-Oriented Programming Study Material

---

## TOPIC: Classes, Structs, Access Specifiers

### THEORY_SECTION: High-Level Overview

**Class vs Struct:**
- Both are user-defined types
- **Default access specifier:**
  - `struct`: public
  - `class`: private
- Otherwise, they're functionally identical

**Access Specifiers:**
- `public`: Accessible from anywhere
- `protected`: Accessible in the class and derived classes
- `private`: Accessible only in the class itself

**Why it matters in interviews:**
- Understanding this lays the foundation for OOP principles like encapsulation
- Confusions about `struct` vs `class`, especially in systems code, are common
- Access control often comes up in system design/code reviews

### EDGE_CASES: Deep Internals

- You can **inherit** from a `struct` or `class`. The type doesn't affect inheritance semantics; **only the default access** does
- Members are laid out in memory in the order they're declared unless optimized (which compilers rarely do across access boundaries)
- Access specifiers affect *interface design*, but not binary layout in most compilers

### CODE_EXAMPLES: Basic Usage

```cpp
#include <iostream>
using namespace std;

struct MyStruct {
    int x;         // public by default
    void show() { cout << "x = " << x << endl; }
};

class MyClass {
    int y;         // private by default
public:
    void setY(int val) { y = val; }
    void show() { cout << "y = " << y << endl; }
};

int main() {
    MyStruct s;
    s.x = 10;
    s.show();

    MyClass c;
    // c.y = 5;         // ❌ Error: 'y' is private
    c.setY(20);
    c.show();
}
```

### EDGE_CASES: Inheritance with Access Specifiers

```cpp
struct Base {
    void foo() {}
};

struct Derived : Base {
    void bar() {
        foo(); // Allowed: inherited as public
    }
};

class Base2 {
    void foo() {}
};

class Derived2 : public Base2 {
    void bar() {
        // foo(); ❌ Not accessible: foo is private in Base2
    }
};
```

### INTERVIEW_QA: Frequently Asked Questions

#### Q1: What is the difference between class and struct in C++?
**Difficulty:** #beginner  
**Category:** #syntax #interview_favorite  
**Concepts:** #classes #structs #access_specifiers

**Answer:** The only differences are the default access specifiers:
- `struct` members are `public` by default
- `class` members are `private` by default
- `struct` inheritance is `public` by default
- `class` inheritance is `private` by default

Otherwise, they are functionally identical and can do everything the other can do.

---

#### Q2: How does access control work with inheritance?
**Difficulty:** #intermediate  
**Category:** #inheritance #design_pattern #interview_favorite  
**Concepts:** #inheritance #access_specifiers #encapsulation

**Answer:** Inherited access is governed by both:
1. **The member's access level in the base class**
2. **The inheritance specifier (public, protected, private)**

**Example:**

```cpp
class Base {
protected:
    int prot_member;
private:
    int priv_member;
public:
    int pub_member;
};

class Derived1 : public Base {
    void f() {
        prot_member = 1;   // ✅ Accessible (protected remains protected)
        pub_member = 2;    // ✅ Accessible (public remains public)
        // priv_member = 3; // ❌ Not accessible
    }
};

class Derived2 : protected Base {
    void f() {
        prot_member = 1;   // ✅ Accessible (becomes protected)
        pub_member = 2;    // ✅ Accessible (becomes protected)
    }
};

class Derived3 : private Base {
    void f() {
        prot_member = 1;   // ✅ Accessible (becomes private)
        pub_member = 2;    // ✅ Accessible (becomes private)
    }
};
```

**Key Point:** Private members are never inherited in an accessible way. They exist in the object layout, but are **not visible to the derived class**.

---

#### Q3: Can private members be accessed via pointers or hacks?
**Difficulty:** #advanced  
**Category:** #memory #syntax #interview_favorite  
**Concepts:** #encapsulation #memory_layout #type_safety

**Answer:** Yes—but **only through non-standard, unsafe hacks** (used in reverse engineering, or security exploits).

**Example (unsafe):**

```cpp
class Secret {
private:
    int secretVal = 42;
};

int main() {
    Secret s;
    int* p = (int*)&s; // Dangerous cast
    std::cout << *p << std::endl; // Might print 42 (implementation-dependent)
}
```

**Why it works:**
- The object layout is contiguous in memory
- `secretVal` is stored at a predictable offset
- This violates C++'s type system and breaks encapsulation

**Important:** These hacks are **not allowed in standard-compliant, safe code**, and they're only used in **low-level tooling, debugging, or hacking** scenarios.

---

#### Q4: How does access specifier impact virtual functions or vtables?
**Difficulty:** #advanced  
**Category:** #memory #design_pattern #performance #interview_favorite  
**Concepts:** #virtual_functions #vtable #polymorphism #access_specifiers

**Answer:** 

**Summary:**
- **Access specifiers do *not* affect vtable layout**
- **Even private virtual functions go into the vtable**
- The access modifier only controls **who can *call* the function**, not whether it exists virtually

**Example:**

```cpp
class Base {
private:
    virtual void secret() { std::cout << "Base::secret\n"; }
public:
    virtual void show() { std::cout << "Base::show\n"; }
};

class Derived : public Base {
public:
    void show() override { std::cout << "Derived::show\n"; }
};
```

Even though `secret()` is private, it's in the vtable and will be overridden if a derived class provides an override.

**Why?** Virtual dispatch relies on the **vtable**, not access control. The vtable is a compiler-generated mechanism to look up the correct function at runtime. Access control is a **compile-time** feature.

---

#### Q5: Can a private virtual function be overridden?
**Difficulty:** #advanced  
**Category:** #syntax #design_pattern  
**Concepts:** #virtual_functions #inheritance #access_specifiers

**Answer:** Yes, technically—but only if the derived class has access (e.g., it's a `friend`, or through template instantiation).

In general practice:

```cpp
class A {
private:
    virtual void foo() { std::cout << "A::foo\n"; }
public:
    virtual ~A() = default;
};

class B : public A {
    // void foo() override; // ❌ Compiler Error: 'A::foo' is private
};
```

The derived class cannot see the private virtual function to override it, even though it's in the vtable.

---

#### Q6: Does access specifier affect object size or layout?
**Difficulty:** #intermediate  
**Category:** #memory #performance  
**Concepts:** #memory_layout #access_specifiers

**Answer:** **No**, access specifiers have **no impact on memory layout**. They're purely for **compiler-enforced visibility**.

```cpp
struct S {
private:   int a;
public:    int b;
protected: int c;
};
```

The size of `S` includes all three integers regardless of their access. The layout order follows declaration order.

---

#### Q7: Can `friend` functions/classes break access control?
**Difficulty:** #intermediate  
**Category:** #syntax #design_pattern  
**Concepts:** #friend #encapsulation #access_specifiers

**Answer:** Yes. A `friend` can access private/protected members.

```cpp
class Box {
private:
    int secret = 42;
    friend void reveal(Box&);
};

void reveal(Box& b) {
    std::cout << b.secret << "\n"; // ✅ Allowed
}
```

**Use cases:**
- Operator overloading (e.g., `operator<<`)
- Factory patterns
- Testing frameworks
- Tightly coupled classes

---

#### Q8: When should I use `struct` vs `class`?
**Difficulty:** #beginner  
**Category:** #design_pattern #interview_favorite  
**Concepts:** #structs #classes #best_practices

**Answer:**

- Use `struct` for **plain data structures** (PODs, like `Point`, `RGB`)
- Use `class` when enforcing **encapsulation, abstraction, or behaviors**

**In interviews, prefer `class` when:**
- Designing APIs
- Modeling real-world objects
- Implementing OOP principles

---

### PRACTICE_TASKS: Mini Exercises

1. Define a `struct` `Person` with `name` and `age`. Make `age` private and provide getters/setters.
2. Convert it into a `class` and use inheritance to make `Employee` derive from `Person`.
3. Try to access private members in various ways and observe compiler errors.

### QUICK_REFERENCE: Comparison Table

| Feature            | `struct`          | `class`           |
|--------------------|-------------------|-------------------|
| Default Access      | `public`          | `private`         |
| Inheritance Default | `public`          | `private`         |
| Function Members    | Yes               | Yes               |
| Friend Classes      | Yes               | Yes               |
| Used Commonly For   | PODs/Data structs | Encapsulation/OOP |

---