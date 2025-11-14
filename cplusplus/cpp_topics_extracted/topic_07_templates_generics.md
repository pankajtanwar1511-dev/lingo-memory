I have C++ study material to format. Please organize it with the following structure:

═══════════════════════════════════════════════════════════════
SECTION MARKERS (use in EXACT order):
═══════════════════════════════════════════════════════════════

1. TOPIC: Main topic titles (one topic per section)
2. THEORY_SECTION: Explanations, definitions, "why it matters"
3. EDGE_CASES: Tricky scenarios, gotchas, deep internals, undefined behavior
4. CODE_EXAMPLES: Code demonstrations with inline explanations
5. INTERVIEW_QA: Questions and detailed answers
6. PRACTICE_TASKS: Exercises, challenges, output prediction questions
7. QUICK_REFERENCE: Tables, cheatsheets, comparison charts, answer keys

═══════════════════════════════════════════════════════════════
SECTION HEADER FORMAT (MANDATORY):
═══════════════════════════════════════════════════════════════

### SECTION_NAME: [Descriptive Subtitle]

Examples:
- ### INTERVIEW_QA: Core Concepts
- ### PRACTICE_TASKS: Output Prediction Questions
- ### QUICK_REFERENCE: Answer Key and Summary Tables

ALWAYS include a descriptive subtitle after the colon.

═══════════════════════════════════════════════════════════════
QUESTION NUMBERING RULES:
═══════════════════════════════════════════════════════════════

- Format: #### Q1: [Question text]
- INTERVIEW_QA: Use continuous numbering (Q1, Q2, Q3... Q50)
- PRACTICE_TASKS: Restart numbering (Q1, Q2, Q3... Q20)
- Never restart numbering within the same section type
- Each question ID format: #### Q15: What is object slicing?

═══════════════════════════════════════════════════════════════
INTERVIEW_QA FORMAT (MANDATORY FOR EVERY QUESTION):
═══════════════════════════════════════════════════════════════

#### Q1: [Question text]
**Difficulty:** #beginner OR #intermediate OR #advanced
**Category:** [1-3 tags]: #memory #syntax #design_pattern #performance #interview_favorite
**Concepts:** [2-5 tags]: #polymorphism #vtable #inheritance #virtual_functions #const_correctness #pure_virtual #constructors #destructors #override #abstract_class #object_slicing #undefined_behavior #move_semantics #copy_constructor #rule_of_five #raii #smart_pointers

**Answer:**
[1-2 sentence direct answer]

**Code example:** (if relevant)
```cpp
// Example code
```

**Explanation:**
[Detailed reasoning - 2-4 sentences]

**Key takeaway:** [One sentence summary of best practice]

---

TAG RULES:
- All multi-word tags MUST use underscores: #interview_favorite NOT #interview favorite
- Use lowercase only
- No spaces in tags

═══════════════════════════════════════════════════════════════
PRACTICE_TASKS FORMAT:
═══════════════════════════════════════════════════════════════

### PRACTICE_TASKS: [Descriptive Title]

#### Q1
```cpp
// Question code here
```

#### Q2
```cpp
// Question code here
```

RULES:
- Present questions numbered Q1, Q2, etc.
- Do NOT include answers inline
- ALL answers go in QUICK_REFERENCE section at the end

═══════════════════════════════════════════════════════════════
QUICK_REFERENCE ANSWER KEY FORMAT:
═══════════════════════════════════════════════════════════════

### QUICK_REFERENCE: Answer Key for Practice Questions

| Q# | Answer | Explanation | Key Concept |
|----|--------|-------------|-------------|
| 1 | [Answer] | [Brief explanation] | [Concept tag] |
| 2 | [Answer] | [Brief explanation] | [Concept tag] |

TABLE RULES:
- Use <br> for multi-line content in cells ONLY
- Keep consistent column alignment
- Always include header separator row

═══════════════════════════════════════════════════════════════
CODE BLOCK STANDARDS:
═══════════════════════════════════════════════════════════════

ALL code blocks MUST:
1. Specify language: ```cpp
2. Use emoji markers consistently:
   - // ✅ Correct pattern
   - // ❌ Incorrect/Error
3. Include explanatory comments
4. Have explanation paragraph immediately after closing ```

Example:
```cpp
class Good {
    int* data;
public:
    Good(const Good& other) : data(new int(*other.data)) {}  // ✅ Deep copy
};
```
This performs deep copy, allocating new memory for independent ownership.

═══════════════════════════════════════════════════════════════
CONTENT ORGANIZATION FLOW:
═══════════════════════════════════════════════════════════════

1. THEORY_SECTION: Core concepts and definitions (2-3 paragraphs)
2. EDGE_CASES: Deep dives, gotchas, memory details (3-5 subsections)
3. CODE_EXAMPLES: Practical demonstrations (5-8 examples with explanations)
4. INTERVIEW_QA: Comprehensive Q&A (20-30 questions with full format)
5. PRACTICE_TASKS: Challenge questions only (10-20 questions)
6. QUICK_REFERENCE: Answer keys + summary tables (all answers in tables)

═══════════════════════════════════════════════════════════════
FORMATTING RULES:
═══════════════════════════════════════════════════════════════

1. Keep ALL original content - don't summarize or condense
2. Fix technical errors silently
3. Use clean markdown:
   - ### for main sections
   - #### for subsections/questions
4. Code blocks: Always use ```cpp with language specified
5. Use ✅ for correct patterns, ❌ for incorrect/errors
6. **Bold** key terms on first mention
7. Use tables for comparisons, answer keys, and reference material
8. Add explanatory paragraph under each code example
9. Use horizontal rules (---) between major sections
10. NO meta-commentary like "let's continue" or "ready for next topic"

═══════════════════════════════════════════════════════════════
SECTION HIERARCHY TEMPLATE:
═══════════════════════════════════════════════════════════════

## TOPIC: Main Topic Title

### THEORY_SECTION: Core Concepts
[Content with 2-3 paragraphs]

#### What is [Concept]
[Explanation]

#### Why It Matters
[Explanation]

### EDGE_CASES: Tricky Scenarios
[Content with subsections]

#### Edge Case 1: [Title]
[Explanation + code]

#### Edge Case 2: [Title]
[Explanation + code]

### CODE_EXAMPLES: Practical Demonstrations

#### Example 1: [Descriptive Title]
```cpp
// Code
```
[Explanation paragraph]

#### Example 2: [Descriptive Title]
```cpp
// Code
```
[Explanation paragraph]

### INTERVIEW_QA: Comprehensive Questions

#### Q1: [Question]
**Difficulty:** #level
**Category:** #tags
**Concepts:** #tags

**Answer:**
[Direct answer]

**Explanation:**
[Reasoning]

**Key takeaway:** [Summary]

---

#### Q2: [Question]
[Same format]

### PRACTICE_TASKS: Challenge Questions

#### Q1
```cpp
// Code
```

#### Q2
```cpp
// Code
```

### QUICK_REFERENCE: Summary Tables

#### Answer Key

| Q# | Answer | Explanation | Key Concept |
|----|--------|-------------|-------------|
| 1 | ... | ... | ... |

#### Comparison Tables
[Other reference tables]

═══════════════════════════════════════════════════════════════
OUTPUT STYLE:
═══════════════════════════════════════════════════════════════

- Professional, tutorial tone
- Assume reader has C++ fundamentals
- Focus on interview-relevant details
- Clear, scannable formatting
- Consistent header hierarchy
- Every INTERVIEW_QA question MUST have: tags, Answer, Explanation, Key takeaway
- Every PRACTICE_TASKS question MUST have answer in QUICK_REFERENCE table

═══════════════════════════════════════════════════════════════
QUALITY CHECKLIST (verify before output):
═══════════════════════════════════════════════════════════════

- [ ] All INTERVIEW_QA questions numbered continuously (Q1, Q2, Q3...)
- [ ] All INTERVIEW_QA have Difficulty/Category/Concepts tags
- [ ] All INTERVIEW_QA answers have Answer/Explanation/Key takeaway structure
- [ ] All code blocks have ```cpp language identifier
- [ ] All PRACTICE_TASKS have answers in QUICK_REFERENCE table
- [ ] All section headers have descriptive subtitles after colon
- [ ] All multi-word tags use underscores (e.g., #interview_favorite)
- [ ] Tables use consistent markdown format
- [ ] No meta-commentary or prompting language
- [ ] Explanatory paragraph under each code example
- [ ] NO DUPLICATE QUESTIONS in PRACTICE_TASKS (all Q1-Q20 are unique)
- [ ] Answer key is ONE continuous table (not split)
- [ ] Answer key row count matches PRACTICE_TASKS question count


═══════════════════════════════════════════════════════════════
CRITICAL VERIFICATION STEPS (must perform before output):
═══════════════════════════════════════════════════════════════

### Duplicate Prevention
- BEFORE outputting, verify NO duplicate questions exist in PRACTICE_TASKS
- Check each code block - no two questions should have identical or near-identical code
- If creating 20 questions, ensure all 20 test DIFFERENT concepts/scenarios

### Answer Key Completeness
- QUICK_REFERENCE answer key MUST be ONE continuous table
- If PRACTICE_TASKS has Q1-Q20, answer key MUST have rows 1-20 in ONE table
- DO NOT split answer keys into multiple tables (e.g., Q1-Q12, then Q13-Q20)
- Exception: Separate tables are OK for different types (e.g., "Answer Key" vs "Comparison Tables")

### Question Numbering Verification
- INTERVIEW_QA: Verify continuous numbering with no gaps (Q1, Q2, Q3... Q30)
- PRACTICE_TASKS: Verify continuous numbering with no gaps (Q1, Q2, Q3... Q20)
- Cross-check: Total answer key rows MUST equal total PRACTICE_TASKS questions

### Content Preservation (when original material provided)
- If user provides existing questions/code, preserve the exact code unless explicitly asked to create new variations
- If creating new variations, ensure they cover ALL concepts from original PLUS additional edge cases
- Never lose technical content from the original material

═══════════════════════════════════════════════════════════════
SELF-AUDIT CHECKLIST (final verification):
═══════════════════════════════════════════════════════════════

Before submitting output, verify:
- [ ] No duplicate questions in PRACTICE_TASKS (check Q1 vs Q2 vs Q3... all unique)
- [ ] Answer key is ONE continuous table covering ALL practice questions
- [ ] Answer key row count = PRACTICE_TASKS question count
- [ ] All INTERVIEW_QA questions have unique content (no duplicates)
- [ ] All code blocks have ```cpp and explanatory paragraphs
- [ ] All tables have proper markdown format with header separators
- [ ] Section headers have descriptive subtitles after colons
- [ ] No meta-commentary or conversational prompts in output

═══════════════════════════════════════════════════════════════

Important Note: Don't miss any details
If you feel more details and topics can be added then go ahead
Keep this in mind: If you feel that more formatted md documents you should create than go ahead but follow the instructions as mentioned above...THis means if you feel this below data have multiple topics which can be easily separated with good range of data then go ahead. If you want to create more topics out of it then create different documents for each not in one.

Now format the following C++ study material according to these rules:

# 7. Templates and Generics

---

## User Question

Let's move to these topics 

7. Templates and Generics
Function Templates and Class Templates

Specialization and Partial Specialization

Default Template Arguments

SFINAE (C++11 flavor)

CRTP (Curiously Recurring Template Pattern)


Please explain these in details with example and cover the trickiest cases then later we will move to quiz section. Take them one by one if they are time taking.

I mostly want to know till C++11 but a little bit above version is okay to explain

## Assistant Response

Great! Let's start with a structured deep dive into **Templates and Generics** in C++ — focusing on modern C++ features (up to C++11, and a touch beyond where needed for clarity).

---

## **1. Function Templates and Class Templates**

### 🔹 Function Templates

Function templates allow writing generic functions where the type is a parameter.

### ✅ Syntax:

```cpp
template<typename T>
T add(T a, T b) {
    return a + b;
}
```

### ✅ Usage:

```cpp
int main() {
    std::cout << add(3, 4) << "\n";         // int
    std::cout << add(2.5, 3.7) << "\n";     // double
}
```

### ✅ Type Deduction:

The compiler deduces the type from arguments. You can also specify explicitly:

```cpp
add<int>(3, 4); // Explicit
```

---

### 🔹 Class Templates

Used to define generic data structures or components.

### ✅ Syntax:

```cpp
template<typename T>
class Box {
    T value;
public:
    Box(T val) : value(val) {}
    T get() const { return value; }
};
```

### ✅ Usage:

```cpp
Box<int> b1(10);
Box<std::string> b2("hello");
```

---

### 🔍 Tricky Edge Cases

#### 1. Function Template Overloading

Templates can be overloaded with regular functions:

```cpp
void print(int) {
    std::cout << "int\n";
}

template<typename T>
void print(T) {
    std::cout << "template\n";
}

print(5);         // int (non-template preferred)
print("test");    // template
```

#### 2. Ambiguity with Conversion

```cpp
template<typename T>
void fun(T) {}

void fun(int) {}

fun(3.0);  // Calls template version, as no exact match
```

---

### 🔍 Interview Trick: Template instantiation is **lazy**.

This compiles:

```cpp
template<typename T>
void onlyForInt(T x) {
    static_assert(std::is_same<T, int>::value, "Only for int");
}

onlyForInt(5);     // OK
// onlyForInt("abc"); // Compilation error only when instantiated
```

---

Shall I now move to **Specialization and Partial Specialization**, or would you like a quick quiz or coding task on function/class templates before that?


---

## User Question

Yes move to the next part

## Assistant Response

Perfect. Let's move on to:

---

## **2. Specialization and Partial Specialization**

Templates are flexible, but sometimes we want to treat specific types differently. That’s where **template specialization** comes in.

---

### 🔹 Full Specialization

You provide a **completely customized implementation** of a template for a specific type.

### ✅ Example:

```cpp
template<typename T>
struct Printer {
    void print() {
        std::cout << "Generic Printer\n";
    }
};

// Full specialization for int
template<>
struct Printer<int> {
    void print() {
        std::cout << "Int Printer\n";
    }
};
```

### ✅ Usage:

```cpp
Printer<double>().print();   // Generic Printer
Printer<int>().print();      // Int Printer
```

---

### 🔍 Notes:
- Must match the **exact template parameters**.
- `template<>` is mandatory for specialization.

---

### 🔹 Partial Specialization

You specialize **some** template parameters but not all.

### ✅ Example:

```cpp
template<typename T, typename U>
struct Pair {
    void print() {
        std::cout << "Generic Pair\n";
    }
};

// Specialization when second is int
template<typename T>
struct Pair<T, int> {
    void print() {
        std::cout << "Pair with int\n";
    }
};
```

### ✅ Usage:

```cpp
Pair<double, char>().print();  // Generic Pair
Pair<float, int>().print();    // Pair with int
```

---

### 🔍 Trickiest Interview Variants

#### 🔸 1. Specialization priority

```cpp
template<typename T>
struct Traits {
    static void foo() { std::cout << "Generic\n"; }
};

template<>
struct Traits<int> {
    static void foo() { std::cout << "int\n"; }
};

template<>
struct Traits<const int> {
    static void foo() { std::cout << "const int\n"; }
};

Traits<int>::foo();           // int
Traits<const int>::foo();     // const int
```

#### 🔸 2. Specialize pointers only

```cpp
template<typename T>
struct IsPointer {
    static const bool value = false;
};

template<typename T>
struct IsPointer<T*> {
    static const bool value = true;
};
```

---

### 🔍 C++11 Addition: `std::enable_if` + specialization

We'll see this more in SFINAE, but here's a teaser:

```cpp
template<typename T>
typename std::enable_if<std::is_integral<T>::value>::type
process(T val) {
    std::cout << "Integral\n";
}

template<typename T>
typename std::enable_if<!std::is_integral<T>::value>::type
process(T val) {
    std::cout << "Non-integral\n";
}
```

---

Would you like to go to **Default Template Arguments**, or want to explore a couple of edge case questions/examples on this part first?


---

## User Question

Yes move to the next

## Assistant Response

Great! Now we move to:

---

## **3. Default Template Arguments**

Default template arguments let you simplify template usage when a good fallback value is known.

---

### ✅ Syntax:

```cpp
template<typename T = int, typename U = double>
struct Pair {
    T first;
    U second;
};
```

### ✅ Usage:

```cpp
Pair<> p1;                  // Pair<int, double>
Pair<float> p2;             // Pair<float, double>
Pair<char, bool> p3;        // Pair<char, bool>
```

---

### 🔍 Rules and Edge Cases

#### 🔸 1. Default arguments must go from **right to left**

✅ Valid:
```cpp
template<typename T, typename U = int>
struct X {};
```

❌ Invalid:
```cpp
template<typename T = int, typename U>
struct X {};  // Error: U has no default but follows T with default
```

#### 🔸 2. Defaults apply **per specialization context**

```cpp
template<typename T = int>
class A {};

// Specialization must use same or more restrictive defaults:
template<>
class A<> {   // OK
    // specialized version for A<int>
};
```

---

### 🔍 Real-World Use Case: `std::allocator`

```cpp
template<
    typename T,
    typename Alloc = std::allocator<T>
>
class MyVector {
    // Uses Alloc as allocator type by default
};
```

---

### 🔍 Mix with Inheritance

```cpp
template<typename T = int>
class Base {
public:
    void print() { std::cout << typeid(T).name() << "\n"; }
};

class Derived : public Base<> {};  // Inherits Base<int>
```

---

Would you like to move to **SFINAE (C++11 flavor)** next, or want a few quick interview-style tricky problems on this topic before that?

## Assistant Response

Great! Let's continue with:

---

## **3. Default Template Arguments**

Default template arguments allow you to specify a fallback type if the user doesn't provide one.

---

### 🔹 Function Template with Default Argument ❌ (Not allowed)

> ❗ **Function templates cannot have default template arguments directly in the function definition.**  
Use overloads or class templates instead.

---

### 🔹 Class Template with Default Argument ✅

```cpp
template<typename T = int>
class Box {
public:
    T value;
    Box(T val = T()) : value(val) {}
    void print() { std::cout << value << "\n"; }
};
```

### ✅ Usage:

```cpp
Box<> b1;         // Uses int as default
Box<double> b2(3.14);

b1.print();       // 0
b2.print();       // 3.14
```

---

### 🔹 Combined with Multiple Parameters

```cpp
template<typename T, typename U = double>
class Pair {
public:
    T first;
    U second;
};
```

```cpp
Pair<int> p;          // T = int, U = double
Pair<int, char> q;    // T = int, U = char
```

---

### 🔍 Tricky Edge Case: Default + Specialization

```cpp
template<typename T, typename U = int>
struct Sample {
    static void print() { std::cout << "Generic\n"; }
};

template<>
struct Sample<float, int> {
    static void print() { std::cout << "Specialized float, int\n"; }
};

Sample<float>::print();  // Specialized float, int
Sample<double>::print(); // Generic
```

---

### 🔍 Order Rule

Default arguments must go **from right to left**, i.e., once a default is provided, all the following ones must also have defaults.

```cpp
template<typename T = int, typename U> // ❌ error: default argument missing for U
class X;
```

✅ Correct:

```cpp
template<typename T, typename U = int>
class X;
```

---

### Summary Table

| Template Type         | Default Arg Allowed? |
|-----------------------|----------------------|
| Class Template        | ✅ Yes               |
| Function Template     | ❌ No (only via overload) |
| Alias Template (C++11)| ✅ Yes               |

---

We’re now set to jump into **SFINAE (C++11 flavor)** next — the most fun (and confusing) part of templates 😊

Shall I go ahead with **SFINAE**?


---

## User Question

Please describe this case more with example

Function Template with Default Argument ❌ (Not allowed)
❗ Function templates cannot have default template arguments directly in the function definition.
Use overloads or class templates instead.


Also I think we are missing on non-type parameter

## Assistant Response

Excellent catch! You're right — we’ll clarify both points now:

---

## **📌 1. Why Function Templates Can't Have Default Template Arguments in Definitions**

This can be confusing because **class templates** allow default template arguments, but **function templates** do *not* allow **template default arguments in the function definition** (outside the declaration).

---

### ✅ This is allowed (declaration):

```cpp
template<typename T = int>
void func(T val);
```

### ❌ This is *not* allowed:

```cpp
// ❌ Error: default template argument not allowed here
template<typename T>
void func(T val) {  // No default template arg in definition
    std::cout << val << "\n";
}
```

---

### ✅ Correct way (default in declaration only):

```cpp
template<typename T = int>
void func(T val); // Declaration with default

template<typename T>
void func(T val) { // Definition without default
    std::cout << val << "\n";
}

int main() {
    func(5);     // T deduced as int
    func<double>(3.14); // Explicit
}
```

🧠 **Rule of Thumb**:  
> Function template default arguments can appear **only in the declaration**, not in the definition (unless inline).

---

### ✅ Inline version (works because it’s declaration + definition in one place):

```cpp
template<typename T = int>
void func(T val) {
    std::cout << val << "\n";
}
```

---

## **📌 2. Non-Type Template Parameters**

These are template parameters that are values, not types.

---

### 🔹 Syntax:

```cpp
template<int N>
void printNTimes(const std::string& msg) {
    for (int i = 0; i < N; ++i)
        std::cout << msg << "\n";
}
```

### ✅ Usage:

```cpp
printNTimes<3>("Hello");
// Output:
// Hello
// Hello
// Hello
```

---

### 🔹 Can be used in classes:

```cpp
template<typename T, size_t Size>
class FixedArray {
    T data[Size];
public:
    size_t size() const { return Size; }
};
```

```cpp
FixedArray<int, 5> arr;   // array of 5 ints
std::cout << arr.size();  // prints 5
```

---

### 🔍 C++11 and beyond: Non-type parameters can also be `constexpr` or pointers (with restrictions).

```cpp
template<const char* msg>
void logMsg() {
    std::cout << msg << "\n";
}
```

You need the string to have external linkage:

```cpp
extern const char hello[] = "Hello";
logMsg<hello>(); // OK
```

---

### 🧠 Edge Case:

```cpp
template<int N>
struct Factorial {
    static constexpr int value = N * Factorial<N - 1>::value;
};

template<>
struct Factorial<0> {
    static constexpr int value = 1;
};

std::cout << Factorial<5>::value; // 120
```

> Used in template metaprogramming.

---

Would you like a quick quiz/example on non-type parameters or move directly to the next big topic: **SFINAE (Substitution Failure Is Not An Error)**?


---

## User Question

yes go to next

## Assistant Response

Alright, now diving into one of the trickiest and most powerful template features:

---

## **4. SFINAE (Substitution Failure Is Not An Error)** — C++11 Flavor

---

### What is SFINAE?

When the compiler tries to instantiate a template, if **substituting the template parameters fails**, this failure is **not an error** but causes the compiler to discard that overload from the candidate set.

---

### Why is this useful?

It allows **selective enabling or disabling** of template functions or classes based on properties of the template arguments — basically compile-time conditional compilation for templates.

---

### Basic Example with `enable_if`

`std::enable_if` (introduced in C++11) is the common tool to implement SFINAE.

```cpp
#include <type_traits>
#include <iostream>

// Enabled only for integral types
template<typename T>
typename std::enable_if<std::is_integral<T>::value>::type
foo(T val) {
    std::cout << val << " is integral\n";
}

// Enabled only for floating-point types
template<typename T>
typename std::enable_if<std::is_floating_point<T>::value>::type
foo(T val) {
    std::cout << val << " is floating point\n";
}
```

---

### Usage:

```cpp
foo(10);      // 10 is integral
foo(3.14);    // 3.14 is floating point
// foo("abc"); // error: no matching function (disabled)
```

---

### How does it work?

- `enable_if<condition>::type` is defined only if `condition` is true.
- If `condition` is false, substitution fails → that function template is removed from overload resolution.
- Compiler picks the other viable function.

---

### Important points:

- Return type can be replaced by `typename std::enable_if<cond, ReturnType>::type` for other return types.
- Alternatively, you can use `enable_if` in a template parameter list.

---

### Variant: Enable as a template parameter

```cpp
template<typename T, typename = typename std::enable_if<std::is_integral<T>::value>::type>
void bar(T val) {
    std::cout << val << " integral\n";
}
```

---

### 🔍 Tricky Case: Ambiguity and SFINAE

```cpp
template<typename T>
typename std::enable_if<std::is_integral<T>::value>::type foo(T) {
    std::cout << "Integral\n";
}

template<typename T>
typename std::enable_if<std::is_floating_point<T>::value>::type foo(T) {
    std::cout << "Floating point\n";
}

foo(42);      // Integral
foo(3.14);    // Floating point
```

If you call `foo("abc")`, no function matches because neither condition is true → substitution failure for both → compilation error.

---

### Practical use cases:

- Restrict template functions or classes to specific types.
- Overload resolution based on type traits.
- Emulating concepts (before C++20 concepts).

---

### Bonus: SFINAE with member functions (class templates)

```cpp
template<typename T>
class Test {
public:
    template<typename U = T>
    typename std::enable_if<std::is_integral<U>::value>::type
    process() {
        std::cout << "Integral process\n";
    }

    template<typename U = T>
    typename std::enable_if<std::is_floating_point<U>::value>::type
    process() {
        std::cout << "Floating-point process\n";
    }
};

int main() {
    Test<int> t1; t1.process();       // Integral process
    Test<double> t2; t2.process();    // Floating-point process
}
```

---

Would you like to explore **more advanced SFINAE tricks**, or should I continue to the **Curiously Recurring Template Pattern (CRTP)** next?


---

## User Question

Yah go a little bit advance then move to CRTP

## Assistant Response

Awesome! Let’s step up the SFINAE game a bit with some advanced patterns, then we’ll jump into CRTP.

---

## Advanced SFINAE Techniques

### 1. **SFINAE in the template parameter list (instead of return type)**

Using a default template parameter with `enable_if`:

```cpp
#include <type_traits>
#include <iostream>

template<typename T, typename = typename std::enable_if<std::is_integral<T>::value>::type>
void func(T val) {
    std::cout << val << " is integral\n";
}

// This disables func for non-integral types (like double)
```

Usage:

```cpp
func(10);     // OK: integral
// func(3.14);  // Error: no matching function
```

---

### 2. **SFINAE with `decltype` and expressions**

You can detect if a type supports certain operations:

```cpp
template<typename T>
auto has_to_string(int) -> decltype(std::declval<T>().to_string(), std::true_type{}) {
    return std::true_type{};
}

template<typename T>
std::false_type has_to_string(...) {
    return std::false_type{};
}

struct A {
    std::string to_string() { return "A"; }
};

struct B {};

int main() {
    std::cout << has_to_string<A>(0).value << "\n"; // 1 (true)
    std::cout << has_to_string<B>(0).value << "\n"; // 0 (false)
}
```

---

### 3. **Enable/disable member functions based on template parameters**

```cpp
template<typename T>
struct Foo {
    // Enabled only if T has a nested type 'type'
    template<typename U = T>
    typename std::enable_if<!std::is_void<typename U::type>::value>::type
    bar() {
        std::cout << "Has nested type\n";
    }

    // Fallback overload
    template<typename U = T>
    typename std::enable_if<std::is_void<typename U::type>::value>::type
    bar() {
        std::cout << "No nested type\n";
    }
};

struct X { using type = int; };
struct Y {};

int main() {
    Foo<X> foo1; foo1.bar();  // Has nested type
    Foo<Y> foo2; foo2.bar();  // No nested type
}
```

---

### 4. **Combining SFINAE with `std::true_type` and `std::false_type`**

Instead of `enable_if` directly in signatures, dispatch to helper functions:

```cpp
template<typename T>
void func(T val) {
    func_impl(val, std::is_integral<T>{});
}

template<typename T>
void func_impl(T val, std::true_type) {
    std::cout << val << " integral\n";
}

template<typename T>
void func_impl(T val, std::false_type) {
    std::cout << val << " not integral\n";
}

func(10);     // 10 integral
func(3.14);   // 3.14 not integral
```

---

# Now, moving on to...

---

# **5. CRTP (Curiously Recurring Template Pattern)**

---

### What is CRTP?

A pattern where a class template derives from itself instantiated with the derived class.

---

### Syntax:

```cpp
template<typename Derived>
class Base {
public:
    void interface() {
        static_cast<Derived*>(this)->implementation();
    }
};

class Derived : public Base<Derived> {
public:
    void implementation() {
        std::cout << "Derived implementation\n";
    }
};

int main() {
    Derived d;
    d.interface(); // calls Derived::implementation()
}
```

---

### Why use CRTP?

- Achieve **static polymorphism** (compile-time polymorphism without virtual calls).
- Share functionality in base but call derived implementations.
- Avoid runtime overhead of virtual functions.
- Implement **static interfaces** or **compile-time polymorphic algorithms**.

---

### Practical use cases

- Static polymorphic interfaces
- Mixins
- Compile-time checks
- Curiously recurring template with policy classes

---

### 🧠 Trickiest parts

- Downcasting with `static_cast<Derived*>(this)`
- Ensuring `Derived` has the required member functions
- CRTP with multiple inheritance and mixins
- Recursive CRTP chains

---

### Example with mixin:

```cpp
template<typename Derived>
class LoggerMixin {
public:
    void log(const std::string& msg) {
        std::cout << "LOG: " << msg << "\n";
        static_cast<Derived*>(this)->additional_log();
    }
    
    void additional_log() {} // optional hook
};

class MyClass : public LoggerMixin<MyClass> {
public:
    void additional_log() {
        std::cout << "MyClass specific log\n";
    }
};

int main() {
    MyClass obj;
    obj.log("Hello");
}
```

---

### Summary

| Feature          | CRTP Role                                  |
|------------------|--------------------------------------------|
| Static Polymorphism | Call derived implementation without virtual calls |
| Code Reuse        | Base template provides generic code, derived class customizes behavior |
| Performance       | Compile-time dispatch → no vtable overhead |
| Compile-time Checks | Force derived classes to implement methods (via SFINAE or concepts) |

---

Would you like me to go deeper with CRTP examples, pitfalls, or a small project to demonstrate? Or proceed to quiz questions on templates and SFINAE/CRTP?


---

## User Question

No don't go much deeper now let's go to quiz section. Please ask trickiest questions on these all sections which we covered here i.e. 

7. Templates and Generics
Function Templates and Class Templates

Specialization and Partial Specialization

Default Template Arguments

SFINAE (C++11 flavor)

CRTP (Curiously Recurring Template Pattern)

## Assistant Response

Got it! Here’s a quiz with tricky, interview-style questions covering all those template topics we discussed. I’ll pose each question and then after you try, I can provide detailed explanations and solutions.

---

## Quiz: Advanced Templates & SFINAE & CRTP

---

### 1. Function vs Class Template Defaults

```cpp
template<typename T = int>
void foo(T val) {
    std::cout << val << "\n";
}

int main() {
    foo<>(10);
}
```

**Question:**  
Will this code compile? Why or why not? How to fix it?

---

### 2. Specialization and Partial Specialization

Given:

```cpp
template<typename T1, typename T2>
struct Pair {
    static void print() { std::cout << "Generic\n"; }
};

template<typename T>
struct Pair<T, T> {
    static void print() { std::cout << "Specialized same types\n"; }
};

template<>
struct Pair<int, double> {
    static void print() { std::cout << "Fully specialized int-double\n"; }
};
```

**Question:**  
What will the following print?

```cpp
Pair<int, int>::print();
Pair<int, double>::print();
Pair<double, int>::print();
```

---

### 3. Default Template Arguments

```cpp
template<typename T = int, typename U>
struct Sample {
    static void print() { std::cout << "Sample\n"; }
};
```

**Question:**  
Is this code valid? Why or why not?

---

### 4. SFINAE Basics

Given:

```cpp
template<typename T>
typename std::enable_if<std::is_integral<T>::value>::type
foo(T val) {
    std::cout << "Integral\n";
}

template<typename T>
typename std::enable_if<std::is_floating_point<T>::value>::type
foo(T val) {
    std::cout << "Floating point\n";
}
```

**Question:**  
What happens if you call `foo("abc")`? Explain the compilation behavior.

---

### 5. Advanced SFINAE Detection

Implement a template function `has_to_string` that returns `true` if a type `T` has a member function `to_string()` returning a `std::string`, otherwise returns `false`.  
Outline your approach using SFINAE.

---

### 6. CRTP Static Polymorphism

```cpp
template<typename Derived>
class Base {
public:
    void interface() {
        static_cast<Derived*>(this)->implementation();
    }
};

class Derived : public Base<Derived> {
public:
    void implementation() {
        std::cout << "Derived Impl\n";
    }
};

int main() {
    Base<Derived>* base = new Derived();
    base->interface();
}
```

**Question:**  
Will this compile? What will it print? Any pitfalls?

---

### 7. CRTP & Multiple Inheritance

Explain the potential pitfalls of combining CRTP with multiple inheritance. What happens if two base classes use CRTP with the same derived class?

---

### 8. Non-Type Template Parameter Metaprogramming

```cpp
template<int N>
struct Factorial {
    static constexpr int value = N * Factorial<N - 1>::value;
};

template<>
struct Factorial<0> {
    static constexpr int value = 1;
};
```

**Question:**  
What is `Factorial<5>::value`? How does this work at compile time?

---

### 9. Partial Specialization for Pointers

```cpp
template<typename T>
struct Traits {
    static void print() { std::cout << "General\n"; }
};

template<typename T>
struct Traits<T*> {
    static void print() { std::cout << "Pointer\n"; }
};
```

What does this print?

```cpp
Traits<int>::print();
Traits<int*>::print();
```

---

### 10. Default Template Argument & Overload Resolution

```cpp
template<typename T, typename U = int>
void func(T val, U u = 10) {
    std::cout << val << " and " << u << "\n";
}

int main() {
    func(5);      // What are T and U deduced as here?
    func(5, 20);  // And here?
}
```

---

If you want, I can also provide detailed solutions or explanations for each one. Which question would you like to start with?


---

## User Question

1) This will give an error as default template is not applicable to function templates in definition. We can add a declration with default template and then used in normally in the definition
2) Specialized same type

## Assistant Response

Excellent start! Let's review your answers one by one and dig into the fine points:

---

### ✅ **1. Function Template with Default Template Argument**

You wrote:

> This will give an error as default template is not applicable to function templates in definition. We can add a declaration with default template and then used in normally in the definition.

**Verdict: ✅ Correct.**

✔️ Function templates **can only have default template arguments in the declaration**, not in the definition if they are separated.

To fix:

```


---

## User Question

1) This will give an error as default template is not applicable to function templates in definition. We can add a declration with default template and then used in normally in the definition
2) Specialized same type
Fully specialized
Generic
3) Not allowed as default template should be on the right most sides
4) It will go to both the templated function and try to check but in both the cases SFINAE will give you that both are not applicable at compile time and as no other generic and specialized is not available. It will give compile time error

5) We will create a templated function and with the help of decltype and declval we try to find out whether this is string type or not and also specialized one which is having false type

6) Yes this will compile and print Derived Impl. Actually when we create derived object it will add base layout also which is templated with derived type. Hence when we try to assign the derived object to the base having same derived. It works well and call derived function implementation as it will static_cast correctly. This all happen statically 

7) I don't know much but I think they will work as the top base will resolve the 2nd base which will resolve derived

8) This will resolve the factorial of 5 at compile time as everything can be evaluated at compile time due to mix of non tye param and constexpr

9) General
Pointer

10) 5 10
error as no matching function, existing is expecting the type not value

## Assistant Response

Fantastic work! You’ve answered most of these really well. Let me go over each one with detailed analysis and explanation, highlighting where you nailed it and clarifying a few trickier parts.

---

### ✅ **1. Function Template with Default Template Argument**

**Your Answer:**  
> Error as default template is not allowed in the definition directly.

**Correct Explanation:**  
✔️ You’re absolutely right. Default template arguments in function templates must appear in the **declaration**, not in the definition. If you're defining directly, the compiler won’t accept it.

✅ **Verdict: Correct**

---

### ✅ **2. Specialization and Partial Specialization Output**

```cpp
Pair<int, int>::print();      // Partial specialization (T, T)
Pair<int, double>::print();   // Full specialization
Pair<double, int>::print();   // Generic
```

**Your Answer:**  
> Specialized same type  
> Fully specialized  
> Generic

✅ **Verdict: Perfect**

---

### ✅ **3. Default Template Arguments Rule**

```cpp
template<typename T = int, typename U>
```

**Your Answer:**  
> Not allowed, as default args must be on the rightmost side.

✔️ Spot on. C++ requires default template arguments to trail all non-defaulted ones. That’s because the compiler needs to know what’s what when fewer template arguments are provided.

✅ **Verdict: Correct**

---

### ✅ **4. SFINAE — No Matching Overload**

```cpp
foo("abc");  // neither is_integral nor is_floating_point
```

**Your Answer:**  
> Both will be rejected due to substitution failure, and no other match is available, so a compile-time error.

✔️ Exactly. This is the heart of SFINAE — the compiler silently discards templates that can’t be instantiated, but if **none match**, you get a **hard error**.

✅ **Verdict: Correct**

---

### ✅ **5. `has_to_string` Detection Using SFINAE**

**Your Answer:**  
> Use `decltype` + `declval` in two overloads: one to detect presence and return `true_type`, the other fallback to `false_type`.

Absolutely right. That’s the idiomatic SFINAE detection pattern.

✔️ Here’s a quick sketch of what you meant:

```cpp
template<typename T>
auto has_to_string_impl(int) -> decltype(std::declval<T>().to_string(), std::true_type{});

template<typename T>
std::false_type has_to_string_impl(...);

template<typename T>
constexpr bool has_to_string = decltype(has_to_string_impl<T>(0))::value;
```

✅ **Verdict: Correct and elegant**

---

### ✅ **6. CRTP + Base Pointer**

```cpp
Base<Derived>* base = new Derived();
base->interface(); // What happens?
```

**Your Answer:**  
> This will compile and print "Derived Impl". It works due to static dispatch via CRTP.

✔️ Exactly! `Base<Derived>` contains `interface()` which uses a `static_cast` to `Derived*`, and since `base` is pointing to a `Derived` object, it works perfectly.

✅ **Verdict: Perfect understanding**

---

### ❗ **7. CRTP + Multiple Inheritance Pitfall**

**Your Answer:**  
> Not sure, but I think it works as top base resolves next base, and so on.

Let’s expand a bit here. It **can** work, but you must be **very careful** with diamond inheritance and repeated CRTP instantiations.

Here’s the risk:

```cpp
template<typename Derived>
struct A {
    void a() { static_cast<Derived*>(this)->impl(); }
};

template<typename Derived>
struct B {
    void b() { static_cast<Derived*>(this)->impl(); }
};

struct D : public A<D>, public B<D> {
    void impl() { std::cout << "D::impl\n"; }
};
```

This works.

❗ **However**, if you accidentally instantiate the same CRTP base multiple times with different types or use multiple levels of CRTP nesting — you'll create a mess of casts and inheritance issues.

✅ **Verdict: Acceptable reasoning, but watch for multiple instantiations & ambiguity**

---

### ✅ **8. Compile-time Factorial using Non-type Template Params**

**Your Answer:**  
> Factorial<5>::value will compute at compile time using recursion and constexpr.

✔️ Exactly! This is classic template metaprogramming using **non-type parameters** (`int N`) and **specialization** to stop the recursion.

✅ **Verdict: Correct**

---

### ✅ **9. Pointer Partial Specialization**

```cpp
Traits<int>::print();    // General
Traits<int*>::print();   // Pointer
```

**Your Answer:**  
> General  
> Pointer

✔️ Correct, specialization for pointer types triggers the second one.

✅ **Verdict: Spot on**

---

### ⚠️ **10. Default Template Argument and Function Overload Resolution**

```cpp
template<typename T, typename U = int>
void func(T val, U u = 10);
```

**Your Answer:**  
> `func(5);` → 5 10  
> `func(5, 20);` → error, as existing expects type not value

🛑 Let’s clarify:

- `func(5);` → `T = int`, `U = int` (defaulted), so call is valid → `5 10`
- `func(5, 20);` → `T = int`, `U = int` (explicitly passed), also valid → `5 20`

✅ So **both calls work fine**.

🟨 **Verdict: First part correct, second part wrong (not an error)**

---

## 📊 Final Scorecard

| Question | Verdict        |
|----------|----------------|
| 1        | ✅ Correct     |
| 2        | ✅ Correct     |
| 3        | ✅ Correct     |
| 4        | ✅ Correct     |
| 5        | ✅ Correct     |
| 6        | ✅ Correct     |
| 7        | ⚠️ Partial     |
| 8        | ✅ Correct     |
| 9        | ✅ Correct     |
| 10       | ⚠️ Partial     |

---

Would you like a **second round** of even **harder & more subtle** template-related questions, or should we move to a different C++ topic next (e.g., `Type Traits`, `constexpr`, `template metaprogramming constructs`, or `template dispatch`)?

## Assistant Response

Excellent effort! You’ve got most of them correct and you're clearly understanding deep template mechanics. Let’s now go over each answer thoroughly, pointing out any refinements or caveats that could come up in interviews or real-world trick scenarios.

---

### ✅ **1. Function Template Default Argument in Definition**

**Your Answer:**  
> Error. Declared with default arg in declaration, not definition.

✔️ **Absolutely right.** Default template args for functions must be given in the declaration.

✅ **Correct Fix Example:**

```cpp
template<typename T = int>
void foo(T val);  // declaration

template<typename T>
void foo(T val) { // definition
    std::cout << val << "\n";
}
```

---

### ✅ **2. Specialization and Partial Specialization**

**Given:**

```cpp
Pair<int, int>::print();     // Same T => Partial specialization
Pair<int, double>::print();  // Exact match => Full specialization
Pair<double, int>::print();  // No match => Primary template
```

**Your Answer:**
> Specialized same type  
> Fully specialized  
> Generic

✔️ **Spot-on!**

✅ Output:
```
Specialized same types
Fully specialized int-double
Generic
```

---

### ✅ **3. Default Template Arg Not Rightmost**

**Code:**
```cpp
template<typename T = int, typename U>
struct Sample { ... };
```

**Your Answer:**  
> Not allowed as default template should be on the rightmost side

✔️ Correct.  
Compiler won’t know how to match the template parameters unless the default is at the rightmost position.

✅ Fix:
```cpp
template<typename T, typename U = int> // ✅ Default is at end
struct Sample { ... };
```

---

### ✅ **4. SFINAE Failure Case**

**Code:** Calls `foo("abc")` with:
```cpp
enable_if<is_integral<T>>
enable_if<is_floating_point<T>>
```

**Your Answer:**  
> Both SFINAE fail. No matching overload. Compile-time error.

✔️ Perfect answer.

✅ Explanation: `const char*` or `"abc"` is neither integral nor floating-point → both overloads get **SFINAE’d out** → compiler errors out.

---

### ✅ **5. Detecting `to_string()` using SFINAE**

**Your Answer:**
> Use `decltype` + `declval`, use two overloads, one fallback.

✔️ You’re describing the **expression SFINAE** pattern perfectly.

✅ Reference solution:

```cpp
template<typename T>
auto has_to_string(int) -> decltype(std::declval<T>().to_string(), std::true_type{});

template<typename T>
std::false_type has_to_string(...);
```

---

### ✅ **6. CRTP with `Base<Derived>* base = new Derived();`**

**Your Answer:**
> Works. Static_cast to Derived*, Derived object layout has Base<Derived>, so all fine.

✔️ 100% correct.

✅ Output:
```
Derived Impl
```

This is **static dispatch**, not dynamic polymorphism — and it’s valid as long as the inheritance hierarchy is correct (`Derived : Base<Derived>`).

---

### 🟡 **7. CRTP + Multiple Inheritance**

**Your Answer:**
> Unsure, but thought maybe first base resolves second, then derived.

You’re close. Here’s a better breakdown:

✅ **Key issue**: If both base classes use CRTP with the same `Derived`, they can interfere — especially with things like `static_cast<Derived*>` or method name conflicts.

**Example Pitfall:**

```cpp
template<typename T> struct A { void foo() { static_cast<T*>(this)->implA(); } };
template<typename T> struct B { void bar() { static_cast<T*>(this)->implB(); } };

struct Derived : A<Derived>, B<Derived> {
    void implA() {}
    void implB() {}
};
```

🟢 This **does work**, but gets hairy fast with name lookup, ambiguous base calls, or shared base classes. CRTP with mixins needs clear design.

---

### ✅ **8. Compile-Time Factorial with Non-Type Param**

**Your Answer:**  
> Factorial<5>::value = compile-time 120 via recursion and constexpr

✔️ Perfect.

✅ Yes, thanks to template recursion and `constexpr`, `Factorial<5>::value` is computed entirely at compile time.

---

### ✅ **9. Pointer Specialization**

```cpp
Traits<int>::print();   // General
Traits<int*>::print();  // Pointer
```

**Your Answer:**  
> General  
> Pointer

✔️ 100% correct.

✅ Output:
```
General
Pointer
```

---

### 🟡 **10. Default Template + Default Value Arg**

```cpp
template<typename T, typename U = int>
void func(T val, U u = 10);
```

**Your Answer:**
> `func(5)` → OK  
> `func(5, 20)` → Error due to conflict of types

🚫 **Second part slightly incorrect.**

✅ What really happens:

```cpp
func(5);      // T = int, U = int (default value used) → OK
func(5, 20);  // T = int, U = int → still OK, U deduced from argument
```

**No error** — because `U` is deduced from the second argument (`20`) overriding the default.  
**Error only occurs** if you do **both**: 
- omit second parameter, and
- omit template parameters in a way that forces deduction ambiguity.

✅ So both lines are valid.

---

## 🔚 Summary of Your Performance:

| Question | Verdict       | Notes                                        |
|----------|----------------|----------------------------------------------|
| 1        | ✅ Correct      | Good understanding of function template rules |
| 2        | ✅ Correct      | Nailed the specialization logic              |
| 3        | ✅ Correct      | Good catch on default arg positioning        |
| 4        | ✅ Correct      | Precise on SFINAE failure behavior           |
| 5        | ✅ Correct      | You knew the idiom well                      |
| 6        | ✅ Correct      | Nailed CRTP layout and static dispatch       |
| 7        | 🟡 Partial      | Conceptual guess good, but needs polish      |
| 8        | ✅ Correct      | Understood template metaprogramming          |
| 9        | ✅ Correct      | Correct use of partial specialization        |
| 10       | 🟡 Partial      | Missed that both overloads are valid         |

---

Would you like:
- More quiz questions on these topics?
- Move to next C++ topic (e.g., Type Traits, constexpr, or Concepts)?
- Try a mixed mini project using CRTP + SFINAE?
