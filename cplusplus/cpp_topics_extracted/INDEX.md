# C++ Learning Topics - Complete Index

Quick navigation to all extracted C++ learning topics.

---

## 📚 Complete C++ Learning Path (17 Topics)

### ✅ Topic 1: C++ Object-Oriented Programming (OOP)
**Status**: ✅ Fully structured (7 part files)
**Location**: `/home/pankaj/cplusplus/chapter_1/`
**Format**: Structured with THEORY_SECTION, INTERVIEW_QA, CODE_EXAMPLES, etc.

**Coverage**:
- Classes, Structs, Access Specifiers
- Encapsulation, Inheritance, Polymorphism
- Virtual Functions, vtable/vptr
- Pure Virtual, Abstract Base Classes
- Constructors: Default, Parameterized, Copy, Move
- Copy Constructor vs Assignment Operator
- Rule of 3 / Rule of 5 / Rule of 0
- Destructors and Virtual Destructors
- Object Slicing

---

### ✅ Topic 2: C++ Memory Management
**File**: [`topic_02_memory_management/topic_02_memory_management.md`](topic_02_memory_management/topic_02_memory_management.md)
**Size**: 16KB | 621 lines | 9 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- Stack vs Heap
- new/delete, malloc/free
- Manual resource management pitfalls
- Memory leaks and tools (valgrind basics)
- Memory Pools / Object Pools

---

### ✅ Topic 3: Smart Pointers (C++11)
**File**: [`topic_03_smart_pointers/topic_03_smart_pointers.md`](topic_03_smart_pointers/topic_03_smart_pointers.md)
**Size**: 39KB | 1,493 lines | 23 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- std::unique_ptr
- std::shared_ptr
- std::weak_ptr
- Cyclic references and weak_ptr resolution
- Custom Deleters
- Smart pointer with arrays
- When not to use smart pointers

---

### ✅ Topic 4: References, Copying, and Moving
**File**: [`topic_04_references_copying_moving/topic_04_references_copying_moving.md`](topic_04_references_copying_moving/topic_04_references_copying_moving.md)
**Size**: 56KB | 2,324 lines | 27 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- Lvalue vs Rvalue references
- Copy elision and RVO
- Move semantics: std::move, move constructor, move assignment
- Perfect forwarding (std::forward)
- Reference collapsing rules

---

### ✅ Topic 5: Operator Overloading
**File**: [`topic_05_operator_overloading/topic_05_operator_overloading.md`](topic_05_operator_overloading/topic_05_operator_overloading.md)
**Size**: 32KB | 1,396 lines | 18 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- Overloadable vs Non-overloadable
- Member vs Friend overload
- Pre-increment vs Post-increment
- Overloading new/delete
- operator() and Functors

---

### ✅ Topic 6: Type System and Casting
**File**: [`topic_06_type_system_casting/topic_06_type_system_casting.md`](topic_06_type_system_casting/topic_06_type_system_casting.md)
**Size**: 36KB | 1,529 lines | 24 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- static_cast, reinterpret_cast, const_cast, dynamic_cast
- Implicit vs Explicit conversions
- Promotion, Demotion, Conversion constructors
- explicit keyword
- Type deduction with auto, decltype

---

### ✅ Topic 7: Templates and Generics
**File**: [`topic_07_templates_generics/topic_07_templates_generics.md`](topic_07_templates_generics/topic_07_templates_generics.md)
**Size**: 38KB | 1,762 lines | 20 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- Function Templates and Class Templates
- Specialization and Partial Specialization
- Default Template Arguments
- SFINAE (C++11 flavor)
- CRTP (Curiously Recurring Template Pattern)

---

### ✅ Topic 8: STL Containers and Algorithms
**File**: [`topic_08_stl_containers_algorithms/topic_08_stl_containers_algorithms.md`](topic_08_stl_containers_algorithms/topic_08_stl_containers_algorithms.md)
**Size**: 54KB | 1,976 lines | 30 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- Vector, List, Map, Set, Unordered_Map
- Iterator types, invalidation rules
- Allocators (basics + use in memory pools)
- Algorithms: std::sort, std::accumulate, std::find, etc.
- Lambda with STL

---

### ✅ Topic 9: C++11 Features (Most Interview Relevant)
**File**: [`topic_09_cpp11_features/topic_09_cpp11_features.md`](topic_09_cpp11_features/topic_09_cpp11_features.md)
**Size**: 72KB | 3,560 lines | 46 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- auto, decltype
- Range-based for loop
- nullptr
- Strongly typed enums
- override, final
- Lambda expressions (capture by value/reference, mutable lambdas)
- std::function, std::bind
- Uniform Initialization {} and initializer_list
- Variadic templates (intro only)
- constexpr (C++11 version)

---

### ✅ Topic 10: RAII and Resource Management
**File**: [`topic_10_raii_resource_management/topic_10_raii_resource_management.md`](topic_10_raii_resource_management/topic_10_raii_resource_management.md)
**Size**: 23KB | 732 lines | 10 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- RAII Principle
- Custom RAII wrappers
- Exception-safe code
- Smart pointers as RAII

---

### ✅ Topic 11: Multithreading (C++11 Intro)
**File**: [`topic_11_multithreading/topic_11_multithreading.md`](topic_11_multithreading/topic_11_multithreading.md)
**Size**: 62KB | 2,651 lines | 24 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- std::thread, std::mutex, std::lock_guard
- Deadlock, race conditions
- Condition variables
- std::atomic, memory ordering basics

---

### ✅ Topic 12: Design Patterns in C++ (Part 1)
**File**: [`topic_12_design_patterns_part1/topic_12_design_patterns_part1.md`](topic_12_design_patterns_part1/topic_12_design_patterns_part1.md)
**Size**: 181KB | 7,811 lines | 96 messages
**Status**: 📝 Raw conversation format
**Note**: Largest topic file

**Coverage**:
- Singleton (thread-safe, Meyers version)
- Factory, Abstract Factory
- Object Pool
- RAII Wrapper
- CRTP-based patterns (Static Polymorphism)

---

### ✅ Topic 12: Design Patterns in C++ (Part 2)
**File**: [`topic_12_design_patterns_part2/topic_12_design_patterns_part2.md`](topic_12_design_patterns_part2/topic_12_design_patterns_part2.md)
**Size**: 52KB | 2,066 lines | 32 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- Memory Pool / Object Pool implementation
- STL-like Vector Class
- Copy-on-Write String
- Asynchronous Logger
- Lock-Free Queue (Intro)

---

### ✅ Topic 12: Design Patterns in C++ (Part 3)
**File**: [`topic_12_design_patterns_part3/topic_12_design_patterns_part3.md`](topic_12_design_patterns_part3/topic_12_design_patterns_part3.md)
**Size**: 73KB | 2,919 lines | 32 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- Advanced pattern implementations
- Real-world design scenarios
- Performance considerations
- Thread-safe patterns

---

### ✅ Topic 13: Compile-Time Magic (Intro Only)
**File**: [`topic_13_compile_time_magic/topic_13_compile_time_magic.md`](topic_13_compile_time_magic/topic_13_compile_time_magic.md)
**Size**: 22KB | 748 lines | 13 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- constexpr, static_assert
- type_traits (e.g., std::is_same)
- Metaprogramming via templates (basic intro)

---

### ❌ Topic 14: [MISSING]
**Status**: Not in original data
**Note**: Intentionally skipped in the learning roadmap

---

### ✅ Topic 15: Low-Level & Tricky Topics
**File**: [`topic_15_low_level_tricky/topic_15_low_level_tricky.md`](topic_15_low_level_tricky/topic_15_low_level_tricky.md)
**Size**: 27KB | 906 lines | 15 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- Object memory layout (base class, derived class, virtual table)
- Alignment & padding (alignof, alignas)
- Lifetime issues (dangling refs, temporaries)
- Const correctness
- Undefined Behavior in C++
- Shallow vs Deep copy with pointers
- Virtual inheritance

---

### ✅ Topic 16: C++14 Feature Deep Dive
**File**: [`topic_16_cpp14_features/topic_16_cpp14_features.md`](topic_16_cpp14_features/topic_16_cpp14_features.md)
**Size**: 46KB | 1,988 lines | 17 messages
**Status**: 📝 Raw conversation format

**Coverage**:
- Generic lambdas
- Variable templates
- Binary literals
- Return type deduction
- Relaxed constexpr
- std::make_unique

---

### ✅ Topic 17: C++17 Features Overview
**File**: [`topic_17_cpp17_features/topic_17_cpp17_features.md`](topic_17_cpp17_features/topic_17_cpp17_features.md)
**Size**: 131KB | 5,887 lines | 73 messages
**Status**: 📝 Raw conversation format
**Note**: Second largest topic file

**Coverage**:
- Structured bindings
- if constexpr
- std::optional, std::variant, std::any
- Inline variables
- Fold expressions
- std::string_view
- Parallel algorithms
- Filesystem library

---

## 📊 Summary Statistics

- **Total Topics**: 17 (16 extracted + 1 pre-processed)
- **Extracted Files**: 16 markdown files
- **Total Content**: ~1.1MB
- **Total Lines**: ~39,000 lines
- **Message Exchanges**: 509 Q&A pairs
- **Status**: Phase 1 (Extraction) Complete

---

## 🗂️ File Legend

- ✅ **Fully structured** - Processed with THEORY_SECTION, INTERVIEW_QA, etc. (Topic 1 only)
- 📝 **Raw conversation** - Extracted Q&A format, needs structuring (Topics 2-17)
- ❌ **Missing** - Not in source data (Topic 14)

---

## 📁 Quick Links

- [README](README.md) - Overview and usage guide
- [EXTRACTION_SUMMARY](EXTRACTION_SUMMARY.md) - Detailed extraction report
- [TASK_COMPLETION_REPORT](TASK_COMPLETION_REPORT.md) - What was accomplished
- [Topic 1 Reference](../chapter_1/) - Example of structured format

---

**Last Updated**: 2025-11-11
**Base Directory**: `/home/pankaj/cplusplus/cpp_topics_extracted/`
