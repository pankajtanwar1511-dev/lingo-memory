# Quick Start Examples - Using the C++ Learning Data

This guide shows practical examples of how to use the extracted data in your learning application.

---

## Example 1: Load All Topics

```python
import json

# Load all Phase 1 topics
with open('phase1_data/topics.json') as f:
    topics = json.load(f)

# Display topic list
for topic in topics:
    print(f"{topic['topic_id']}: {topic['topic_title']}")
    print(f"  Questions: {topic['metadata']['total_questions']}")
    print(f"  Completeness: {topic['metadata']['completeness']}")
    print()
```

**Output:**
```
phase1_01: C++ Object-Oriented Programming (OOP)
  Questions: 39
  Completeness: complete

phase1_02: C++ Memory Management
  Questions: 4
  Completeness: incomplete
...
```

---

## Example 2: Get User's Weak Topics

```python
import json

# Load weakness profile
with open('phase1_data/weakness_profile.json') as f:
    weakness = json.load(f)

# Get topics where user struggled
weak_topics = []
for topic_id, data in weakness['topic_weaknesses'].items():
    if data['weakness_score'] >= 1.3:  # Threshold for "needs practice"
        weak_topics.append({
            'title': data['title'],
            'score': data['weakness_score'],
            'questions': data['question_count']
        })

# Sort by weakness score
weak_topics.sort(key=lambda x: x['score'], reverse=True)

print("Topics needing more practice:")
for i, topic in enumerate(weak_topics, 1):
    print(f"{i}. {topic['title']}")
    print(f"   Weakness Score: {topic['score']}")
    print(f"   Questions Asked: {topic['questions']}")
```

**Output:**
```
Topics needing more practice:
1. RAII and Resource Management
   Weakness Score: 1.5
   Questions Asked: 4
2. Compile-Time Magic
   Weakness Score: 1.43
   Questions Asked: 7
...
```

---

## Example 3: Generate Adaptive Quiz

```python
import json
import random

def generate_quiz(topic_id, user_weakness_score=1.0):
    """Generate quiz based on topic and user's weakness level."""

    # Load quiz blueprint
    with open('phase1_data/quiz_blueprint.json') as f:
        blueprint = json.load(f)

    # Find topic specification
    topic_spec = next((t for t in blueprint['topics'] if t['topic_id'] == topic_id), None)

    if not topic_spec:
        return None

    # Adjust difficulty based on weakness
    if user_weakness_score >= 1.4:
        difficulty = 'hard'
        q_count = topic_spec['recommended_question_count'] + 5
    elif user_weakness_score >= 1.2:
        difficulty = 'medium'
        q_count = topic_spec['recommended_question_count']
    else:
        difficulty = 'easy'
        q_count = max(10, topic_spec['recommended_question_count'] - 5)

    # Generate quiz specification
    quiz = {
        'topic_id': topic_id,
        'topic_title': topic_spec['title'],
        'difficulty': difficulty,
        'total_questions': q_count,
        'focus_areas': topic_spec['focus_areas'],
        'question_distribution': topic_spec['question_type_distribution']
    }

    return quiz

# Example usage
quiz = generate_quiz('phase1_10', user_weakness_score=1.5)  # RAII (weak area)

print("Generated Quiz:")
print(f"Topic: {quiz['topic_title']}")
print(f"Difficulty: {quiz['difficulty']}")
print(f"Questions: {quiz['total_questions']}")
print(f"Focus Areas: {', '.join(quiz['focus_areas'][:3])}")
```

**Output:**
```
Generated Quiz:
Topic: RAII and Resource Management
Difficulty: hard
Questions: 15
Focus Areas: RAII principle, Scope guards, Resource cleanup
```

---

## Example 4: Get Learning Path for Beginner

```python
import json

# Load learning paths
with open('phase1_data/learning_path.json') as f:
    paths = json.load(f)

# Get beginner path
beginner = paths['learning_paths']['beginner']

print(f"Beginner Learning Path ({beginner['estimated_time_weeks']} weeks)")
print(f"Total Hours: {beginner['total_hours']}")
print("\nSequence:")

for step in beginner['sequence']:
    print(f"\n{step['order']}. {step['title']}")
    print(f"   Why: {step['why']}")
    print(f"   Hours: {step['estimated_hours']}")
    if step['prerequisites']:
        print(f"   Prerequisites: {', '.join(step['prerequisites'])}")
```

**Output:**
```
Beginner Learning Path (8 weeks)
Total Hours: 54

Sequence:

1. C++ Object-Oriented Programming (OOP)
   Why: Foundation of C++ - understand classes, objects, and basic OOP
   Hours: 12

2. C++ Memory Management
   Why: Critical for understanding how C++ manages resources
   Hours: 6
   Prerequisites: phase1_01
...
```

---

## Example 5: Search Topics by Keyword

```python
import json

# Load content index
with open('phase1_data/content_index.json') as f:
    index = json.load(f)

def search_by_keyword(keyword):
    """Find topics containing a specific keyword."""
    results = []

    for topic in index['topics']:
        if keyword.lower() in [k.lower() for k in topic.get('keywords', [])]:
            results.append({
                'id': topic['id'],
                'title': topic['title'],
                'completeness': topic['completeness'],
                'questions': topic['stats']['questions']
            })

    return results

# Search for 'lambda'
results = search_by_keyword('lambda')

print("Topics covering 'lambda':")
for r in results:
    print(f"- {r['title']} ({r['questions']} questions, {r['completeness']})")
```

**Output:**
```
Topics covering 'lambda':
- C++11 Features (22 questions, complete)
```

---

## Example 6: Display Topic Content

```python
import json

# Load topics
with open('phase1_data/topics.json') as f:
    topics = json.load(f)

# Get OOP topic (index 0)
oop = topics[0]

print(f"Topic: {oop['topic_title']}")
print(f"Slug: {oop['topic_slug']}")
print(f"\nStatistics:")
print(f"- Questions: {oop['metadata']['total_questions']}")
print(f"- Code Examples: {oop['metadata']['code_example_count']}")
print(f"- Avg Confusion: {oop['user_learning_data']['weakness_indicators']['avg_confusion_level']}")

print(f"\nFirst 3 User Questions:")
for i, q in enumerate(oop['user_learning_data']['user_questions'][:3], 1):
    print(f"\n{i}. Confusion Level: {q['confusion_level']}/5")
    print(f"   Question: {q['question'][:100]}...")

print(f"\nFirst Code Example:")
code = oop['content']['code_examples'][0]
print(f"ID: {code['id']}")
print(f"Code:\n{code['code'][:200]}...")
```

**Output:**
```
Topic: C++ Object-Oriented Programming (OOP)
Slug: c++_object-oriented_programming_oop

Statistics:
- Questions: 39
- Code Examples: 20
- Avg Confusion: 1.36

First 3 User Questions:

1. Confusion Level: 2/5
   Question: We will be foolowing this approach
 Suggested Flow per Topic:
High-level overview (Quick theo...

First Code Example:
ID: phase1_01_code_00
Code:
class BankAccount {
private:
    double balance;

public:
    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
...
```

---

## Example 7: Track User Progress

```python
import json

class ProgressTracker:
    def __init__(self):
        self.user_scores = {}  # {topic_id: score}

    def load_topics(self):
        with open('phase1_data/topics.json') as f:
            return json.load(f)

    def record_quiz_result(self, topic_id, score):
        """Record quiz score for a topic (0-100)."""
        self.user_scores[topic_id] = score

    def get_recommended_topics(self):
        """Get topics user should focus on next."""
        topics = self.load_topics()
        recommendations = []

        for topic in topics:
            tid = topic['topic_id']

            # Skip if already mastered (score >= 80)
            if tid in self.user_scores and self.user_scores[tid] >= 80:
                continue

            # Prioritize topics with low scores or not attempted
            if tid not in self.user_scores:
                priority = 1  # Not attempted
            elif self.user_scores[tid] < 60:
                priority = 3  # Needs work
            else:
                priority = 2  # Review

            recommendations.append({
                'topic': topic['topic_title'],
                'topic_id': tid,
                'priority': priority,
                'last_score': self.user_scores.get(tid, 0),
                'recommended_questions': topic['quiz_recommendations']['recommended_question_count']
            })

        # Sort by priority (highest first)
        recommendations.sort(key=lambda x: (-x['priority'], -x['last_score']))

        return recommendations[:5]  # Top 5

# Usage
tracker = ProgressTracker()
tracker.record_quiz_result('phase1_01', 75)  # OOP: 75%
tracker.record_quiz_result('phase1_03', 85)  # Smart Pointers: 85% (mastered)
tracker.record_quiz_result('phase1_10', 45)  # RAII: 45% (needs work)

recommendations = tracker.get_recommended_topics()

print("Recommended Topics to Study:")
for i, rec in enumerate(recommendations, 1):
    priority_label = ['', 'New', 'Review', 'Needs Work'][rec['priority']]
    print(f"{i}. {rec['topic']} ({priority_label})")
    print(f"   Last Score: {rec['last_score']}%")
    print(f"   Recommended Questions: {rec['recommended_questions']}")
```

**Output:**
```
Recommended Topics to Study:
1. RAII and Resource Management (Needs Work)
   Last Score: 45%
   Recommended Questions: 10
2. C++ Object-Oriented Programming (OOP) (Review)
   Last Score: 75%
   Recommended Questions: 20
3. C++ Memory Management (New)
   Last Score: 0%
   Recommended Questions: 10
...
```

---

## Example 8: Get Interview Prep Path

```python
import json

# Load learning paths
with open('phase1_data/learning_path.json') as f:
    paths = json.load(f)

# Get interview-focused path
interview = paths['learning_paths']['interview_focused']

print(f"Interview Preparation Path")
print(f"Estimated: {interview['estimated_time_weeks']} weeks")
print(f"Total: {interview['total_hours']} hours")
print("\nPriority Topics:")

for topic in interview['priority_topics']:
    print(f"\n📌 {topic['title']}")
    print(f"   Why: {topic['reason']}")
    print(f"   Time: {topic['estimated_hours']} hours")
    print(f"   Focus:")
    for area in topic['focus_areas']:
        print(f"     • {area}")
```

**Output:**
```
Interview Preparation Path
Estimated: 6 weeks
Total: 54 hours

Priority Topics:

📌 C++ Object-Oriented Programming (OOP)
   Why: Most commonly asked in interviews
   Time: 10 hours
   Focus:
     • Virtual functions
     • Polymorphism
     • Object slicing
     • Constructor/destructor order

📌 Design Patterns in C++
   Why: System design and architecture questions
   Time: 15 hours
   Focus:
     • Singleton
     • Factory
     • Observer
     • SOLID principles
...
```

---

## Example 9: Filter Topics by C++ Version

```python
import json

# Load content index
with open('phase1_data/content_index.json') as f:
    index = json.load(f)

# Get C++17 topics
cpp17_topics = index['search_index']['by_cpp_version'].get('cpp17', [])

print("C++17 Topics:")
for topic_id in cpp17_topics:
    # Find full topic info
    topic = next((t for t in index['topics'] if t['id'] == topic_id), None)
    if topic:
        print(f"- {topic['title']}")
        print(f"  Questions: {topic['stats']['questions']}")
        print(f"  Keywords: {', '.join(topic['keywords'][:5])}")
```

**Output:**
```
C++17 Topics:
- C++17 Features Overview
  Questions: 36
  Keywords: C++17, structured bindings, if constexpr, std::optional, std::variant
```

---

## Example 10: Generate Study Plan

```python
import json
from datetime import datetime, timedelta

def generate_study_plan(path_name='beginner', start_date=None):
    """Generate a week-by-week study plan."""

    with open('phase1_data/learning_path.json') as f:
        paths = json.load(f)

    path = paths['learning_paths'][path_name]

    if start_date is None:
        start_date = datetime.now()

    print(f"{path['description']}")
    print(f"Duration: {path['estimated_time_weeks']} weeks")
    print(f"Total Hours: {path['total_hours']}\n")

    current_date = start_date

    for step in path['sequence']:
        days_needed = (step['estimated_hours'] // 2) + 1  # 2 hours/day

        print(f"Week {(step['order']-1)//2 + 1}:")
        print(f"  📅 {current_date.strftime('%Y-%m-%d')} to {(current_date + timedelta(days=days_needed)).strftime('%Y-%m-%d')}")
        print(f"  📚 {step['title']}")
        print(f"  ⏱️  {step['estimated_hours']} hours")
        print(f"  💡 {step['why']}\n")

        current_date += timedelta(days=days_needed + 1)

generate_study_plan('beginner')
```

**Output:**
```
For those new to C++ or refreshing basics
Duration: 8 weeks
Total Hours: 54

Week 1:
  📅 2025-11-09 to 2025-11-16
  📚 C++ Object-Oriented Programming (OOP)
  ⏱️  12 hours
  💡 Foundation of C++ - understand classes, objects, and basic OOP

Week 2:
  📅 2025-11-17 to 2025-11-20
  📚 C++ Memory Management
  ⏱️  6 hours
  💡 Critical for understanding how C++ manages resources
...
```

---

## Summary

These examples show how to:

1. ✅ Load and display topics
2. ✅ Identify weak areas
3. ✅ Generate adaptive quizzes
4. ✅ Navigate learning paths
5. ✅ Search by keywords
6. ✅ Display content
7. ✅ Track progress
8. ✅ Prepare for interviews
9. ✅ Filter by C++ version
10. ✅ Create study plans

All data is in simple JSON format and can be easily integrated into any programming language or framework.

---

## File References

- `phase1_data/topics.json` - All topic content
- `phase1_data/weakness_profile.json` - Weakness analysis
- `phase1_data/quiz_blueprint.json` - Quiz specifications
- `phase1_data/learning_path.json` - Learning sequences
- `phase1_data/content_index.json` - Searchable index

For complete documentation, see:
- `phase1_data/README.md`
- `master_README.md`
- `DATA_EXTRACTION_REPORT.md`
