#!/usr/bin/env python3
"""
Direct extraction from HTML without full JSON parsing
Extracts Phase 1 topics by finding conversation chunks
"""

import re
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# Phase 1 exact topic titles based on what exists in the file
PHASE1_TOPICS_MAP = {
    1: "1. C++ Object-Oriented Programming (OOP)",
    2: "2. C++ Memory Management",
    3: "3. Smart Pointers (C++11)",
    9: "9. C++11 Features (Most Interview Relevant)",
    11: "11. Multithreading (C++11 Intro)",
    12: "12. Design Patterns in C++",
    16: "16. C++14 Feature Deep Dive",
    17: "17. C++17 Features Overview",
}

# Read the entire HTML file
print("Reading chat.html...")
html_path = '/home/pankaj/cplusplus/proCplusplus/docs/chat.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

print(f"File size: {len(html_content)} characters")

# Extract conversations directly
phase1_data = {}

for topic_id, title in PHASE1_TOPICS_MAP.items():
    print(f"\n{'='*80}")
    print(f"Topic {topic_id}: {title}")
    print('='*80)

    # Find the conversation JSON chunk for this title
    # Pattern: {"title": "...", "create_time": ..., "update_time": ..., "mapping": {...}}

    escaped_title = re.escape(title)
    # Find the start of this conversation object
    title_pattern = rf'{{"title":\s*"{escaped_title}"'

    match = re.search(title_pattern, html_content)
    if not match:
        print(f"⚠ Could not find conversation for: {title}")
        phase1_data[topic_id] = {
            'topic_id': topic_id,
            'topic_title': title,
            'metadata': {'completeness': 'not_found'}
        }
        continue

    # Find the start position
    start_pos = match.start()

    # Find the end of this conversation object by bracket matching
    # Start from the { before "title"
    brace_count = 0
    end_pos = start_pos

    for i in range(start_pos, len(html_content)):
        if html_content[i] == '{':
            brace_count += 1
        elif html_content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                end_pos = i + 1
                break

    if end_pos == start_pos:
        print(f"⚠ Could not find end of conversation")
        continue

    # Extract conversation JSON
    conv_json_str = html_content[start_pos:end_pos]

    try:
        conv_data = json.loads(conv_json_str)
        print(f"✓ Parsed conversation: {len(conv_json_str)} characters")
    except json.JSONDecodeError as e:
        print(f"⚠ JSON parse error: {e}")
        print(f"  First 200 chars: {conv_json_str[:200]}")
        print(f"  Last 200 chars: {conv_json_str[-200:]}")
        continue

    # Extract messages
    messages = []
    mapping = conv_data.get('mapping', {})

    def traverse_messages(node_id, visited=set()):
        if node_id in visited or node_id not in mapping:
            return
        visited.add(node_id)

        node = mapping[node_id]
        message = node.get('message')

        if message and message.get('author'):
            role = message['author'].get('role')
            content = message.get('content', {})
            parts = content.get('parts', [])

            if role in ['user', 'assistant'] and parts:
                text = '\n'.join(str(p) for p in parts if p)
                if text.strip():
                    messages.append({
                        'role': role,
                        'content': text,
                        'create_time': message.get('create_time')
                    })

        # Process children
        for child_id in node.get('children', []):
            traverse_messages(child_id, visited)

    traverse_messages('client-created-root')

    print(f"  Extracted {len(messages)} messages")
    print(f"  User messages: {sum(1 for m in messages if m['role'] == 'user')}")
    print(f"  Assistant messages: {sum(1 for m in messages if m['role'] == 'assistant')}")

    # Analyze user questions
    user_questions = [m for m in messages if m['role'] == 'user']

    # Simple concept extraction
    all_text = ' '.join(m['content'] for m in messages)

    # Count C++ concepts
    concepts_found = {}
    cpp_concepts = {
        'virtual': r'\bvirtual\b',
        'vtable': r'\bvtable\b',
        'constructor': r'\bconstructor\b',
        'destructor': r'\bdestructor\b',
        'polymorphism': r'\bpolymorphism\b',
        'inheritance': r'\binheritance\b',
        'template': r'\btemplate\b',
        'smart_pointer': r'\b(unique_ptr|shared_ptr|weak_ptr|smart.*pointer)\b',
        'lambda': r'\blambda\b',
        'auto': r'\bauto\b',
        'move': r'\bmove\b.*\bsemantics\b',
        'rvalue': r'\brvalue\b',
        'thread': r'\bthread\b',
        'mutex': r'\bmutex\b',
        'memory': r'\bmemory\b.*(leak|management)',
        'RAII': r'\bRAII\b',
    }

    for concept, pattern in cpp_concepts.items():
        matches = re.findall(pattern, all_text, re.IGNORECASE)
        if matches:
            concepts_found[concept] = len(matches)

    # Extract code examples
    code_examples = []
    for msg in messages:
        if msg['role'] == 'assistant':
            # Find code blocks
            code_blocks = re.findall(r'```(?:cpp|c\+\+|c)?\s*\n(.*?)\n```', msg['content'], re.DOTALL)
            code_examples.extend(code_blocks)

    print(f"  Code examples: {len(code_examples)}")
    print(f"  Concepts mentioned: {list(concepts_found.keys())[:5]}...")

    # Build topic data
    phase1_data[topic_id] = {
        'topic_id': topic_id,
        'topic_title': title,
        'topic_slug': title.lower().replace(' ', '_').replace('(', '').replace(')', '').replace('.', ''),
        'description': f'Comprehensive coverage of {title}',
        'content': {
            'code_examples': [
                {
                    'id': f'ex{i+1:03d}',
                    'code': code[:500],  # Truncate for size
                    'language': 'cpp11',
                    'difficulty': 'intermediate'
                }
                for i, code in enumerate(code_examples[:20])  # Limit to first 20
            ]
        },
        'user_learning_data': {
            'user_questions': [
                {
                    'question': q['content'][:200],
                    'type': 'general',
                    'confusion_level': 3
                }
                for q in user_questions[:10]  # First 10 questions
            ],
            'weakness_indicators': {
                'total_questions_asked': len(user_questions),
                'concepts_mentioned': dict(list(concepts_found.items())[:10]),
                'sub_concept_analysis': {
                    concept: {
                        'questions_count': count,
                        'weakness_score': min(count / 10.0, 1.0),
                        'needs_practice': count > 5
                    }
                    for concept, count in list(concepts_found.items())[:10]
                }
            }
        },
        'quiz_recommendations': {
            'focus_areas': list(concepts_found.keys())[:5],
            'suggested_difficulty': 'medium',
            'recommended_question_count': max(10, min(len(user_questions), 20))
        },
        'metadata': {
            'estimated_study_time_minutes': len(messages) * 3,
            'completeness': 'complete' if len(messages) > 10 else 'incomplete',
            'code_example_count': len(code_examples),
            'interview_question_count': len(user_questions),
            'practice_problem_count': 0,
            'message_count': len(messages)
        }
    }

# Add missing topics as placeholders
missing_topics = {
    4: "References, Copying, and Moving",
    5: "Operator Overloading",
    6: "Type System and Casting",
    7: "Templates and Generics",
    8: "STL Containers and Algorithms",
    10: "RAII and Resource Management",
    13: "Compile-Time Magic",
    14: "[MISSING TOPIC]",
    15: "Low-Level & Tricky Topics",
}

for topic_id, title in missing_topics.items():
    phase1_data[topic_id] = {
        'topic_id': topic_id,
        'topic_title': title,
        'topic_slug': title.lower().replace(' ', '_').replace('(', '').replace(')', '').replace('.', '').replace('[', '').replace(']', ''),
        'description': f'No conversation data found for {title}',
        'metadata': {
            'completeness': 'missing',
            'code_example_count': 0,
            'interview_question_count': 0,
            'practice_problem_count': 0
        }
    }

# Sort by topic_id
phase1_data = dict(sorted(phase1_data.items()))

# Save results
output_dir = Path('/home/pankaj/cplusplus/proCplusplus/docs/phase1_smart_data')
output_dir.mkdir(parents=True, exist_ok=True)

print("\n" + "="*80)
print("SAVING RESULTS")
print("="*80)

# 1. phase1_topics.json
topics_file = output_dir / 'phase1_topics.json'
with open(topics_file, 'w', encoding='utf-8') as f:
    json.dump(phase1_data, f, indent=2)
print(f"✓ Saved: {topics_file}")

# 2. phase1_weakness_profile.json
all_weaknesses = []
for topic_id, topic_data in phase1_data.items():
    if 'user_learning_data' not in topic_data:
        continue

    weakness = topic_data['user_learning_data'].get('weakness_indicators', {})
    sub_concepts = weakness.get('sub_concept_analysis', {})

    for concept, metrics in sub_concepts.items():
        all_weaknesses.append({
            'concept': concept,
            'topic_id': topic_id,
            'topic_title': topic_data['topic_title'],
            'weakness_score': metrics.get('weakness_score', 0),
            'questions_count': metrics.get('questions_count', 0)
        })

all_weaknesses.sort(key=lambda x: x['weakness_score'], reverse=True)

weakness_profile = {
    'top_10_weakest_concepts': all_weaknesses[:10],
    'all_weak_concepts': [w for w in all_weaknesses if w['weakness_score'] > 0.6],
    'total_concepts_analyzed': len(all_weaknesses),
    'generated_at': datetime.now().isoformat()
}

weakness_file = output_dir / 'phase1_weakness_profile.json'
with open(weakness_file, 'w', encoding='utf-8') as f:
    json.dump(weakness_profile, f, indent=2)
print(f"✓ Saved: {weakness_file}")

# 3. phase1_analytics.json
total_code_examples = sum(t.get('metadata', {}).get('code_example_count', 0) for t in phase1_data.values())
total_questions = sum(t.get('metadata', {}).get('interview_question_count', 0) for t in phase1_data.values())
complete_topics = sum(1 for t in phase1_data.values() if t.get('metadata', {}).get('completeness') == 'complete')
missing_topics = sum(1 for t in phase1_data.values() if t.get('metadata', {}).get('completeness') == 'missing')

analytics = {
    'phase': 1,
    'total_topics': 17,
    'complete_topics': complete_topics,
    'incomplete_topics': 17 - complete_topics - missing_topics,
    'missing_topics': missing_topics,
    'total_code_examples': total_code_examples,
    'total_interview_questions': total_questions,
    'generated_at': datetime.now().isoformat()
}

analytics_file = output_dir / 'phase1_analytics.json'
with open(analytics_file, 'w', encoding='utf-8') as f:
    json.dump(analytics, f, indent=2)
print(f"✓ Saved: {analytics_file}")

# 4. phase1_learning_path.json
missing_topic_ids = [4, 5, 6, 7, 8, 10, 13, 14, 15]
learning_path = {
    'phase': 1,
    'recommended_order': [1, 2, 3, 9, 11, 12, 16, 17],  # Available topics
    'missing_topics': missing_topic_ids,
    'generated_at': datetime.now().isoformat()
}

path_file = output_dir / 'phase1_learning_path.json'
with open(path_file, 'w', encoding='utf-8') as f:
    json.dump(learning_path, f, indent=2)
print(f"✓ Saved: {path_file}")

# 5. README
readme = f"""# Phase 1 SMART DATA - C++ Learning Analytics

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary Statistics

- **Total Topics**: 17
- **Complete Topics**: {complete_topics}
- **Missing Topics**: {missing_topics}
- **Total Code Examples**: {total_code_examples}
- **Total User Questions**: {total_questions}

## Available Topics (Complete Data)

"""

for topic_id, topic_data in phase1_data.items():
    if topic_data.get('metadata', {}).get('completeness') == 'complete':
        meta = topic_data['metadata']
        readme += f"{topic_id}. **{topic_data['topic_title']}**\n"
        readme += f"   - Messages: {meta.get('message_count', 0)}\n"
        readme += f"   - Code Examples: {meta.get('code_example_count', 0)}\n"
        readme += f"   - User Questions: {meta.get('interview_question_count', 0)}\n\n"

readme += "\n## Missing Topics\n\n"
missing_topic_ids = [4, 5, 6, 7, 8, 10, 13, 14, 15]
for topic_id in missing_topic_ids:
    readme += f"{topic_id}. {phase1_data[topic_id]['topic_title']}\n"

readme += "\n## Top Weak Concepts\n\n"
for i, weak in enumerate(all_weaknesses[:10], 1):
    readme += f"{i}. **{weak['concept']}** (Topic {weak['topic_id']}) - Weakness: {weak['weakness_score']:.2f}\n"

readme += "\n## Files Generated\n\n"
readme += "1. `phase1_topics.json` - Complete topic data\n"
readme += "2. `phase1_weakness_profile.json` - Weakness analysis\n"
readme += "3. `phase1_analytics.json` - Statistics\n"
readme += "4. `phase1_learning_path.json` - Recommended study order\n"
readme += "5. `phase1_README.md` - This file\n"

readme_file = output_dir / 'phase1_README.md'
with open(readme_file, 'w', encoding='utf-8') as f:
    f.write(readme)
print(f"✓ Saved: {readme_file}")

print("\n" + "="*80)
print("EXTRACTION COMPLETE!")
print("="*80)
print(f"\nPhase 1 Data Summary:")
print(f"  Complete topics: {complete_topics}/17")
print(f"  Total code examples extracted: {total_code_examples}")
print(f"  Total user questions extracted: {total_questions}")
print(f"  Top weak concept: {all_weaknesses[0]['concept'] if all_weaknesses else 'N/A'}")
print(f"\nOutput directory: {output_dir}")
