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

Now format the following C++ study material according to these rules:


# 2. C++ Memory Management

---

## User Question

Okay let's move to these topics one by one

2. Memory Management
Stack vs Heap

new/delete, malloc/free

Manual resource management pitfalls

Memory leaks and tools (valgrind basics)

Memory Pools / Object Pools (to be implemented later)

## Assistant Response

Perfect — let's break this topic down step-by-step for solid understanding and practical skill-building. Here's how we’ll approach it:

---

### ✅ **2. Memory Management** — Part 1: Stack vs Heap

#### 🔹 **Stack Memory:**
- **Lifespan**: Automatically managed; exists only within scope.
- **Performance**: Very fast due to LIFO (Last In First Out) nature.
- **Use Case**: Small, short-lived data (e.g., local variables, function calls).
- **Size Limit**: Limited (usually a few MBs).

```cpp
void foo() {
    int x = 10;  // Stack allocation
}
```

#### 🔹 **Heap Memory:**
- **Lifespan**: Manual control; persists until explicitly deallocated.
- **Performance**: Slower due to dynamic allocation.
- **Use Case**: Large data, data with unknown size at compile time, lifetime beyond scope.
- **Size Limit**: Much larger than stack.

```cpp
void bar() {
    int* p = new int(20);  // Heap allocation
    delete p;
}
```

---

### ✅ Part 2: `new/delete` vs `malloc/free`

| Feature              | `new` / `delete`        | `malloc` / `free`        |
|----------------------|-------------------------|---------------------------|
| Language             | C++                     | C                         |
| Constructs objects   | Yes (calls constructors)| No                        |
| Type safety          | Yes                     | No                        |
| Returns              | Typed pointer           | `void*`                   |
| Usage                | `int* p = new int;`     | `int* p = (int*)malloc(sizeof(int));` |
| Deallocation         | `delete p;`             | `free(p);`                |

**Avoid mixing them** — using `malloc` with `delete`, or `new` with `free` is **undefined behavior**.

---

### ✅ Part 3: Manual Resource Management Pitfalls

1. **Memory leaks** – forgetting to `delete` allocated memory.
2. **Dangling pointers** – using memory after `delete`.
3. **Double delete** – deleting memory twice.
4. **Exceptions** – if exception occurs before delete, memory is leaked.

```cpp
void bad() {
    int* p = new int(5);
    throw std::runtime_error("oops");  // p is never deleted!
}
```

---

### ✅ Part 4: Memory Leaks & Tools

#### 🔹 **Valgrind Basics** (Linux):
Install:  
```bash
sudo apt install valgrind
```

Run:
```bash
valgrind --leak-check=full ./your_program
```

Output Example:
```
==12345== 4 bytes in 1 blocks are definitely lost in loss record 1 of 1
==12345==    at 0x........: malloc (vg_replace_malloc.c:...)
==12345==    by 0x........: main (in your_program)
```

---

Would you like to try a few small C++ examples to identify and fix memory issues (e.g., leaks, double deletes)?  
Or should we move to **Memory Pools / Object Pools** next?


---

## User Question

Yes give me some trickiest question about these topics. We will cover Memory pools and object pools later in the course

## Assistant Response

Great — here are some **tricky and interview-style C++ memory management questions** that test deep understanding of stack vs heap, `new`/`delete`, leaks, and pitfalls.

---

### 🔥 **1. What’s the issue in this code?**
```cpp
int* func() {
    int x = 42;
    return &x;
}
```

> ❓ What happens when this function is used? Why is it dangerous?

---

### 🔥 **2. What’s wrong here?**
```cpp
void foo() {
    int* arr = new int[10];
    // ... use arr ...
    delete arr;
}
```

> ❓ Is the memory correctly deallocated? If not, what’s the bug?

---

### 🔥 **3. Predict the output or behavior**
```cpp
void bar() {
    int* a = new int(10);
    delete a;
    std::cout << *a << std::endl;  // UB or valid?
}
```

> ❓ Will this crash? What is the technical term for this issue?

---

### 🔥 **4. Mixing allocation/deallocation styles**
```cpp
void test() {
    int* p = (int*)malloc(sizeof(int));
    delete p;
}
```

> ❓ What will happen here? Compile error, runtime error, or undefined behavior?

---

### 🔥 **5. Hidden memory leak**
```cpp
void leak() {
    int* a = new int(5);
    a = new int(10);
    // No delete
}
```

> ❓ What happens to the first `new int(5)`?

---

### 🔥 **6. Exception safety**
```cpp
void process() {
    int* p = new int[1000];
    riskyOperation();  // May throw exception
    delete[] p;
}
```

> ❓ What's the bug? How do you fix this idiomatically in C++?

---

### 🔥 **7. Double delete?**
```cpp
void dup() {
    int* p = new int(3);
    int* q = p;
    delete p;
    delete q;
}
```

> ❓ Is this code valid? What’s the issue?

---

### 🔥 **8. Stack or Heap?**
```cpp
struct Large {
    int data[1000000];
};

void foo() {
    Large l1;               // ?
    Large* l2 = new Large;  // ?
}
```

> ❓ What are the trade-offs here? What can go wrong?

---

Would you like to go through these one-by-one with detailed analysis and debugging strategies (e.g. how Valgrind or sanitizers catch them)?  
Or would you prefer a quiz-style challenge where you answer and I give feedback?


---

## User Question

1) We are returning the addrress of x to use it beyond this function which is problematic as x is going to delete at the end of this function.
2) It should be array delete delete[] arr;
3) This is basically trying to access a dangling pointer, an undefined value or crash may occur.
4) Undefined behaviour at runtime
5) Memory leak as we reasigning new memory from heap and lost the access of old memory
6) Memory leak will happen if riskyOperation throws an error in between
7) Program crash as it is trying to delete the memory which is already deleted and given back to heap.
8) l1 on stack and l2 on heap. As stack is limited and we are assigning a very large memory to l1, It certainly may crash.

## Assistant Response

🔥 **Excellent job!** Your answers are mostly spot-on and show a strong grasp of core memory management pitfalls. Let’s walk through each one with nuance and deep insights.

---

### ✅ **1. Returning address of local variable**

> Your answer: ✔️ Correct

🧠 `x` is allocated on the **stack**. After `func()` returns, `x` goes out of scope — its memory is reclaimed.  
Returning `&x` leads to **undefined behavior (UB)**: the pointer points to invalid memory.

🛠 **Fix**: Return a `static int` (limited use), or use heap allocation: `return new int(x);`

---

### ✅ **2. Mismatched `delete` for array**

> Your answer: ✔️ Correct

🔴 `delete arr;` only deletes one element — not the whole array allocated with `new[]`.

🧠 This causes **partial deallocation**, often leading to memory leaks or heap corruption.

✅ **Correct**: `delete[] arr;`

---

### ✅ **3. Accessing a dangling pointer**

> Your answer: ✔️ Correct

🧠 After `delete a;`, the memory may be reused or unmapped — `*a` is a **dangling pointer**. Dereferencing it causes **undefined behavior** (may crash, corrupt memory, or print garbage).

💡 Tip: Always set pointer to `nullptr` after `delete`.

---

### ✅ **4. Mixing `malloc` and `delete`**

> Your answer: ✔️ Correct

🔴 Allocating with `malloc()` and deallocating with `delete` leads to **undefined behavior**. The internal allocators (`new/delete` vs `malloc/free`) are different.

✅ Must use `free(p);` if you use `malloc`.

---

### ✅ **5. Memory leak from reassignment**

> Your answer: ✔️ Correct

🧠 `a = new int(10);` overwrites the pointer to the first allocation (`new int(5)`) without deleting it. That memory is now **lost** — a classic **memory leak**.

🛠 Use `delete a;` before reassigning.

---

### ✅ **6. Exception safety issue**

> Your answer: ✔️ Correct

🧠 If `riskyOperation()` throws an exception, `delete[] p` is never reached — **leak**.

✅ Modern C++ fix:
```cpp
std::unique_ptr<int[]> p(new int[1000]);
riskyOperation();  // No manual delete needed!
```

Use **RAII** for exception-safe code.

---

### ✅ **7. Double delete**

> Your answer: ✔️ Correct

🧠 `p` and `q` point to the same memory. `delete p;` deallocates it. `delete q;` causes **double free**, leading to **crash or heap corruption**.

🛠 Best practice: Set pointer to `nullptr` after deletion.

---

### ✅ **8. Stack vs Heap – large object**

> Your answer: ✔️ Correct

🧠 `Large l1;` is allocated on stack. It occupies ~4MB — can **overflow the stack** (stack overflow error).
✅ `Large* l2 = new Large;` is on heap — no such risk (but you must `delete` it).

📌 This is a **real interview trap** — stack overflow issues are hard to detect without tools.

---

## 🎯 Summary Score: **8/8 — Excellent!**
You demonstrated strong understanding and real-world thinking. Next, I can:
- Give a few **Valgrind-style debugging tasks**,
- Or dive deeper into **Smart Pointers vs Manual Management pitfalls**,
- Or proceed to **real-world patterns** like RAII + custom deleters.

Which direction would you like to go in next?

## Assistant Response

Excellent work — your understanding is strong across the board. Let’s review each of your answers with nuance and deeper insights where helpful:

---

### ✅ **1) Returning address of local stack variable**
> **Your Answer:** Correct — accessing `&x` outside the function is **undefined behavior** because `x` is destroyed once the function returns.

🧠 **Deeper Insight**: Some compilers may warn you, but many won’t. Sometimes this seems to "work" (especially in simple test programs) due to leftover stack values — but it’s fragile and unsafe.

---

### ✅ **2) Using `delete` instead of `delete[]`**
> **Your Answer:** Correct — must use `delete[] arr`.

🧠 **Why It Matters**: Using `delete` on array memory may:
- Not call destructors for array elements (important for classes).
- Cause heap corruption depending on implementation.
Use `delete[]` **whenever you used `new[]`**.

---

### ✅ **3) Access after `delete`**
> **Your Answer:** Correct — this is a **dangling pointer** access.

🧠 **Deeper Insight**: Dereferencing `*a` after `delete a` is undefined behavior. It **may work** sometimes (especially for simple types), which makes it extra dangerous in large projects.

---

### ✅ **4) Mixing `malloc` and `delete`**
> **Your Answer:** Correct — this is **undefined behavior**.

🧠 **Rule of Thumb**:  
- `malloc → free`  
- `new → delete`  
- `new[] → delete[]`  
Mixing them violates the memory model and may cause subtle crashes or leaks.

---

### ✅ **5) Reassigning pointer without freeing**
> **Your Answer:** Spot on — **first allocation is leaked**.

🧠 **How to catch**: Valgrind or AddressSanitizer will show a leak:
```bash
==12345== 4 bytes in 1 blocks are definitely lost
```

---

### ✅ **6) Exception safety issue**
> **Your Answer:** Correct — `delete[] p` never runs if `riskyOperation()` throws.

🛡️ **Fix (RAII-style)**:
```cpp
std::vector<int> p(1000);  // handles cleanup automatically
```
Or:
```cpp
std::unique_ptr<int[]> p(new int[1000]);
```

---

### ✅ **7) Double delete**
> **Your Answer:** Correct — both `p` and `q` point to the same memory. `delete`ing it twice = **UB**.

🧠 **Best Practices**:
- Set pointer to `nullptr` after delete.
- Use `std::unique_ptr` to enforce single ownership.

---

### ✅ **8) Stack vs Heap**
> **Your Answer:** Perfect. `l1` may cause a **stack overflow** due to its size.

🧠 **Rule of Thumb**:
- Stack sizes are ~1MB by default (on Linux).
- Large structures or buffers should be `new`’ed or better — use dynamic containers (e.g., `std::vector`).

---

### 🎯 Summary

You nailed all of them. That’s rare and impressive.

---

Would you like:
1. A new batch of harder questions (involving class destructors, smart pointers, or memory corruption)?
2. Or move toward **Object Pools / Memory Pools** introduction and practical implementation soon?


---

## User Question

I think in explanation of these topics you missed what's to follow to avoid such situations like using RAII->  vectors, unique pointers etcs

## Assistant Response

You're absolutely right — and great catch. ✅  
While the root issues were identified, **best practices to avoid them — especially via RAII (Resource Acquisition Is Initialization)** — should be emphasized as core principles in modern C++.

Let’s fix that and **recap each of the pitfalls along with modern C++ best practices to avoid them**, especially RAII-based solutions:

---

## 🛡️ **Modern C++ Techniques to Avoid Memory Management Bugs**

### 🔁 1. **Returning Address of Stack Variable**
❌ Bad:
```cpp
int* func() {
    int x = 10;
    return &x;  // UB
}
```

✅ **Better**:
- Return by value (`int` gets copied).
```cpp
int func() { return 10; }
```

- Use smart pointers for heap-managed objects:
```cpp
std::unique_ptr<int> func() {
    return std::make_unique<int>(10);
}
```

---

### 🧹 2. **Using `delete` instead of `delete[]`**
❌ Manual management:
```cpp
int* arr = new int[10];
// ...
delete arr;  // UB
```

✅ **Use containers**:
```cpp
std::vector<int> arr(10);  // No need for delete[]
```

Or:
```cpp
std::unique_ptr<int[]> arr(new int[10]);  // Calls delete[] automatically
```

---

### ☠️ 3. **Dangling Pointer After `delete`**
❌ Dangerous:
```cpp
int* p = new int(5);
delete p;
std::cout << *p;  // UB
```

✅ **Use smart pointers** (auto-null after deletion):
```cpp
auto p = std::make_unique<int>(5);  // Safe
```

---

### ❌ 4. **Mixing `malloc` and `delete`**
Avoid **crossing allocation/deallocation families**.

✅ Stick to one:
- `malloc` + `free` (C-style)
- `new` + `delete` (C++-style)
- **Recommended**: avoid both → use `std::make_unique`, `std::vector`, `std::string`, etc.

---

### 🕳️ 5. **Memory Leak from Overwriting Pointer**
❌ Leak:
```cpp
int* a = new int(5);
a = new int(10);  // leak: lost first allocation
```

✅ **Use `unique_ptr`**:
```cpp
std::unique_ptr<int> a = std::make_unique<int>(5);
a = std::make_unique<int>(10);  // automatic cleanup of old
```

---

### 💥 6. **Exception Safety**
❌ Manual cleanup:
```cpp
int* p = new int[1000];
risky();  // throws?
delete[] p;  // never reached
```

✅ **RAII-based management**:
```cpp
std::vector<int> p(1000);  // auto cleanup on exception
```

Or:
```cpp
std::unique_ptr<int[]> p(new int[1000]);
```

---

### ❌ 7. **Double Delete**
❌ Shared raw pointer:
```cpp
int* p = new int;
int* q = p;
delete p;
delete q;  // UB
```

✅ **Enforce single ownership**:
```cpp
std::unique_ptr<int> p = std::make_unique<int>(10);
```

✅ Or shared ownership (carefully):
```cpp
std::shared_ptr<int> p = std::make_shared<int>(10);
auto q = p;  // reference counted
```

---

### ⚠️ 8. **Stack Overflow with Large Objects**
❌ Large object on stack:
```cpp
Large l1;  // 4MB on stack? Danger!
```

✅ **Heap allocation**:
```cpp
auto l2 = std::make_unique<Large>();
```

✅ Or split large data into `std::vector`s:
```cpp
struct Large { std::vector<int> data; };
```

---

## ✨ Summary: **How to Avoid Manual Memory Pitfalls**

| Pitfall | RAII-based Solution |
|--------|----------------------|
| Manual `new/delete` | `std::unique_ptr`, `std::make_unique` |
| Arrays | `std::vector`, `std::array`, or `std::unique_ptr<T[]>` |
| Ownership confusion | `std::unique_ptr` (exclusive), `std::shared_ptr` (shared) |
| Exception leaks | RAII: stack-allocated objects with destructors |
| Dangling pointers | Avoid raw pointers; reset/nullify if needed |
| Memory leaks | Use smart pointers or STL containers |

---

Would you like:
- A short challenge to rewrite raw-pointer code using RAII?
- Or move to smart pointer internals next (like how `unique_ptr` or `shared_ptr` work under the hood)?
