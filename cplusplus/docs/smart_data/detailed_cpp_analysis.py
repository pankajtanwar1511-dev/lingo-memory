#!/usr/bin/env python3
"""
Detailed C++ Topic Analysis
Focuses specifically on C++ learning patterns and weaknesses
"""

import json
from pathlib import Path
from collections import defaultdict

# Load all data
data_dir = Path('/home/pankaj/cplusplus/proCplusplus/docs/smart_data')

with open(data_dir / 'smart_data.json', 'r') as f:
    smart_data = json.load(f)

with open(data_dir / 'analytics.json', 'r') as f:
    analytics = json.load(f)

# Identify C++ topics (topics 1-17 based on the structured curriculum)
cpp_curriculum_topics = {}
other_cpp_topics = {}

for topic_id, data in smart_data.items():
    title = data['title']
    # Check if it's part of the 17-topic C++ curriculum
    if any(marker in title for marker in ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.',
                                            '9.', '10.', '11.', '12.', '13.', '14.', '15.',
                                            '16.', '17.', 'C++ Object-Oriented', 'OOP']):
        cpp_curriculum_topics[topic_id] = data
    elif 'C++' in title or 'interview' in title.lower():
        other_cpp_topics[topic_id] = data

print("=" * 100)
print("DETAILED C++ LEARNING ANALYSIS")
print("=" * 100)

print(f"\nCURRICULUM TOPICS IDENTIFIED: {len(cpp_curriculum_topics)}")
print(f"OTHER C++ TOPICS: {len(other_cpp_topics)}")

# Analyze curriculum topics in detail
print("\n" + "=" * 100)
print("C++ CURRICULUM TOPICS (1-17) - DETAILED BREAKDOWN")
print("=" * 100)

curriculum_details = []
for topic_id, data in cpp_curriculum_topics.items():
    title = data['title']
    questions = data['user_questions']
    weakness = data.get('weakness_indicators', {})

    if weakness:
        curriculum_details.append({
            'id': topic_id,
            'title': title,
            'total_questions': weakness.get('total_questions', 0),
            'confusion_signals': weakness.get('confusion_signals', 0),
            'follow_up_rate': weakness.get('follow_up_rate', 0),
            'avg_confusion': weakness.get('avg_confusion_level', 0),
            'difficulty': weakness.get('difficulty_rating', 0),
            'top_concepts': list(weakness.get('sub_concepts', {}).keys())[:5]
        })

# Sort by total questions (most struggled topics first)
curriculum_details.sort(key=lambda x: x['total_questions'], reverse=True)

print(f"\n{'Rank':<4} {'Topic':<55} {'Questions':<10} {'Confusion':<10} {'Difficulty':<10}")
print("-" * 100)
for i, topic in enumerate(curriculum_details, 1):
    print(f"{i:<4} {topic['title'][:54]:<55} {topic['total_questions']:<10} {topic['confusion_signals']:<10} {topic['difficulty']:<10.1f}")

# Detailed analysis for each topic
print("\n" + "=" * 100)
print("INDIVIDUAL TOPIC DEEP DIVE")
print("=" * 100)

for topic in curriculum_details:
    print(f"\n{'-' * 100}")
    print(f"TOPIC: {topic['title']}")
    print(f"{'-' * 100}")
    print(f"Total Questions: {topic['total_questions']}")
    print(f"Confusion Signals: {topic['confusion_signals']} ({topic['confusion_signals']/topic['total_questions']*100:.1f}%)")
    print(f"Follow-up Rate: {topic['follow_up_rate']:.2%}")
    print(f"Average Confusion Level: {topic['avg_confusion']:.2f}/5")
    print(f"Difficulty Rating: {topic['difficulty']:.1f}/5")
    print(f"\nTop Confused Concepts:")

    # Get detailed sub-concept data
    full_data = smart_data[topic['id']]
    if full_data.get('weakness_indicators') and full_data['weakness_indicators'].get('sub_concepts'):
        sub_concepts = full_data['weakness_indicators']['sub_concepts']
        sorted_concepts = sorted(sub_concepts.items(), key=lambda x: x[1]['weakness_score'], reverse=True)

        for i, (concept, cdata) in enumerate(sorted_concepts[:10], 1):
            print(f"  {i:2d}. {concept:<20} | Weakness: {cdata['weakness_score']:.2f} | Asked {cdata['questions_asked']} times | Avg Confusion: {cdata['avg_confusion']:.1f}/5")

    # Sample questions showing confusion
    if full_data.get('user_questions'):
        confused_questions = [q for q in full_data['user_questions'] if q.get('confusion_level', 0) >= 3]
        if confused_questions:
            print(f"\nSample High-Confusion Questions ({len(confused_questions)} total):")
            for i, q in enumerate(confused_questions[:3], 1):
                question_text = q['question'][:150] + '...' if len(q['question']) > 150 else q['question']
                print(f"  {i}. (Confusion {q['confusion_level']}/5) {question_text}")

# Aggregate concept analysis across all C++ topics
print("\n" + "=" * 100)
print("AGGREGATE CONCEPT WEAKNESS ANALYSIS (Across All C++ Topics)")
print("=" * 100)

concept_aggregation = defaultdict(lambda: {
    'total_questions': 0,
    'total_confusion': 0,
    'topics_mentioned': set(),
    'max_weakness_score': 0
})

for topic_id, data in cpp_curriculum_topics.items():
    if data.get('weakness_indicators') and data['weakness_indicators'].get('sub_concepts'):
        sub_concepts = data['weakness_indicators']['sub_concepts']
        for concept, cdata in sub_concepts.items():
            concept_aggregation[concept]['total_questions'] += cdata['questions_asked']
            concept_aggregation[concept]['total_confusion'] += cdata['avg_confusion'] * cdata['questions_asked']
            concept_aggregation[concept]['topics_mentioned'].add(data['title'])
            concept_aggregation[concept]['max_weakness_score'] = max(
                concept_aggregation[concept]['max_weakness_score'],
                cdata['weakness_score']
            )

# Calculate aggregate scores
concept_scores = []
for concept, agg_data in concept_aggregation.items():
    if agg_data['total_questions'] > 0:
        avg_confusion = agg_data['total_confusion'] / agg_data['total_questions']
        concept_scores.append({
            'concept': concept,
            'total_questions': agg_data['total_questions'],
            'avg_confusion': avg_confusion,
            'topic_count': len(agg_data['topics_mentioned']),
            'max_weakness': agg_data['max_weakness_score'],
            'combined_score': (agg_data['total_questions'] * 0.4 + avg_confusion * 10 * 0.3 +
                             len(agg_data['topics_mentioned']) * 5 * 0.3)
        })

concept_scores.sort(key=lambda x: x['combined_score'], reverse=True)

print(f"\n{'Rank':<4} {'Concept':<25} {'Total Qs':<10} {'Avg Confusion':<15} {'Topic Count':<12} {'Max Weakness':<12} {'Score':<10}")
print("-" * 100)
for i, cs in enumerate(concept_scores[:30], 1):
    print(f"{i:<4} {cs['concept']:<25} {cs['total_questions']:<10} {cs['avg_confusion']:<15.2f} {cs['topic_count']:<12} {cs['max_weakness']:<12.2f} {cs['combined_score']:<10.1f}")

# Learning progression analysis
print("\n" + "=" * 100)
print("LEARNING PROGRESSION ANALYSIS")
print("=" * 100)

# Try to order topics by their numbers
ordered_topics = []
for topic in curriculum_details:
    title = topic['title']
    # Extract number if present
    import re
    match = re.match(r'^(\d+)\.', title)
    if match:
        topic_num = int(match.group(1))
        ordered_topics.append((topic_num, topic))

ordered_topics.sort(key=lambda x: x[0])

if ordered_topics:
    print("\nQuestion Volume Over Topic Progression:")
    for topic_num, topic in ordered_topics:
        bar_length = int(topic['total_questions'] / 2)
        bar = '█' * bar_length
        print(f"Topic {topic_num:2d}: {bar} ({topic['total_questions']} questions)")

    print("\nDifficulty Perception Over Topic Progression:")
    for topic_num, topic in ordered_topics:
        bar_length = int(topic['difficulty'] * 5)
        bar = '█' * bar_length
        print(f"Topic {topic_num:2d}: {bar} ({topic['difficulty']:.1f}/5 difficulty)")

# Question type distribution
print("\n" + "=" * 100)
print("QUESTION TYPE DISTRIBUTION ANALYSIS")
print("=" * 100)

type_aggregation = defaultdict(int)
for topic_id, data in cpp_curriculum_topics.items():
    if data.get('weakness_indicators') and data['weakness_indicators'].get('question_type_distribution'):
        for qtype, count in data['weakness_indicators']['question_type_distribution'].items():
            type_aggregation[qtype] += count

total_typed_questions = sum(type_aggregation.values())
print(f"\nTotal Categorized Questions: {total_typed_questions}")
print(f"\n{'Question Type':<20} {'Count':<10} {'Percentage':<15}")
print("-" * 50)
for qtype in sorted(type_aggregation.keys(), key=lambda x: type_aggregation[x], reverse=True):
    count = type_aggregation[qtype]
    pct = count / total_typed_questions * 100
    bar = '█' * int(pct / 2)
    print(f"{qtype:<20} {count:<10} {pct:>5.1f}% {bar}")

print("\n" + "=" * 100)
print("KEY INSIGHTS")
print("=" * 100)

# Calculate insights
most_questioned = curriculum_details[0] if curriculum_details else None
most_confused = max(curriculum_details, key=lambda x: x['avg_confusion']) if curriculum_details else None
most_difficult = max(curriculum_details, key=lambda x: x['difficulty']) if curriculum_details else None
highest_followup = max(curriculum_details, key=lambda x: x['follow_up_rate']) if curriculum_details else None

print(f"\n1. MOST QUESTIONED TOPIC:")
if most_questioned:
    print(f"   {most_questioned['title']} ({most_questioned['total_questions']} questions)")
    print(f"   → User spent most time on this topic, indicating high complexity or importance")

print(f"\n2. HIGHEST CONFUSION LEVEL:")
if most_confused:
    print(f"   {most_confused['title']} (Avg confusion: {most_confused['avg_confusion']:.2f}/5)")
    print(f"   → User struggled to understand concepts in this topic")

print(f"\n3. PERCEIVED MOST DIFFICULT:")
if most_difficult:
    print(f"   {most_difficult['title']} (Difficulty: {most_difficult['difficulty']:.1f}/5)")
    print(f"   → Based on deep-dive questions and confusion patterns")

print(f"\n4. HIGHEST FOLLOW-UP RATE:")
if highest_followup:
    print(f"   {highest_followup['title']} (Follow-up rate: {highest_followup['follow_up_rate']:.1%})")
    print(f"   → User needed repeated explanations or clarifications")

print(f"\n5. MOST PROBLEMATIC CONCEPTS (Top 10):")
for i, cs in enumerate(concept_scores[:10], 1):
    print(f"   {i:2d}. {cs['concept']:<25} (Asked in {cs['topic_count']} topics, {cs['total_questions']} times)")

print(f"\n6. LEARNING PATTERN:")
conceptual_pct = type_aggregation.get('conceptual', 0) / total_typed_questions * 100 if total_typed_questions > 0 else 0
deep_dive_pct = type_aggregation.get('deep_dive', 0) / total_typed_questions * 100 if total_typed_questions > 0 else 0
example_pct = type_aggregation.get('example', 0) / total_typed_questions * 100 if total_typed_questions > 0 else 0

print(f"   Conceptual questions: {conceptual_pct:.1f}%")
print(f"   Deep-dive questions: {deep_dive_pct:.1f}%")
print(f"   Example requests: {example_pct:.1f}%")

if conceptual_pct > 40:
    print("   → User prefers understanding 'why' before 'how'")
if deep_dive_pct > 20:
    print("   → User goes deep into implementation details")
if example_pct > 30:
    print("   → User learns best through concrete examples")

# Save detailed report
output = {
    'curriculum_topics_count': len(cpp_curriculum_topics),
    'total_cpp_questions': sum(t['total_questions'] for t in curriculum_details),
    'average_confusion_level': sum(t['avg_confusion'] for t in curriculum_details) / len(curriculum_details) if curriculum_details else 0,
    'topics_ranked_by_difficulty': curriculum_details,
    'top_confused_concepts': concept_scores[:30],
    'question_type_distribution': dict(type_aggregation),
    'key_insights': {
        'most_questioned': most_questioned,
        'most_confused': most_confused,
        'most_difficult': most_difficult,
        'highest_followup': highest_followup
    }
}

with open(data_dir / 'cpp_detailed_analysis.json', 'w') as f:
    # Convert sets to lists for JSON serialization
    def convert_sets(obj):
        if isinstance(obj, set):
            return list(obj)
        return obj

    json.dump(output, f, indent=2, default=convert_sets)

print(f"\n{'='*100}")
print("REPORT SAVED TO: cpp_detailed_analysis.json")
print("=" * 100)
