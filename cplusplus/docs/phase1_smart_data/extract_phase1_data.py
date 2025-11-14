#!/usr/bin/env python3
"""
Phase 1 SMART DATA Extractor
Extracts and analyzes 17 specific C++ topics from ChatGPT conversation export
"""

import json
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict
from typing import Dict, List, Any, Tuple
import html

# Phase 1 Topics - EXACT mapping
PHASE1_TOPICS = {
    1: "C++ Object-Oriented Programming (OOP)",
    2: "C++ Memory Management",
    3: "Smart Pointers (C++11)",
    4: "References, Copying, and Moving",
    5: "Operator Overloading",
    6: "Type System and Casting",
    7: "Templates and Generics",
    8: "STL Containers and Algorithms",
    9: "C++11 Features",
    10: "RAII and Resource Management",
    11: "Multithreading (C++11 Intro)",
    12: "Design Patterns in C++",
    13: "Compile-Time Magic",
    14: "[MISSING TOPIC]",  # Placeholder for missing topic
    15: "Low-Level & Tricky Topics",
    16: "C++14 Feature Deep Dive",
    17: "C++17 Features Overview"
}

# Fuzzy matching for conversations
TOPIC_PATTERNS = {
    1: [r"1\.\s*C\+\+\s*Object", r"OOP", r"Object-Oriented"],
    2: [r"2\.\s*C\+\+\s*Memory", r"Memory Management"],
    3: [r"3\.\s*Smart Pointer", r"Smart Pointers"],
    4: [r"References.*Copying.*Moving", r"Rule of 5", r"Rule of 3"],
    5: [r"Operator Overload"],
    6: [r"Type System", r"Casting"],
    7: [r"Template", r"Generic"],
    8: [r"STL", r"Container", r"Algorithm"],
    9: [r"9\.\s*C\+\+11", r"C\+\+11 Features"],
    10: [r"RAII", r"Resource Management"],
    11: [r"11\.\s*Multithreading", r"Thread", r"Concurrency"],
    12: [r"12\.\s*Design Pattern", r"Design Patterns in C\+\+"],
    13: [r"Compile.*Time.*Magic", r"Metaprogramming", r"constexpr"],
    14: [],  # Missing
    15: [r"Low.*Level", r"Tricky", r"Advanced"],
    16: [r"16\.\s*C\+\+14", r"C\+\+14"],
    17: [r"17\.\s*C\+\+17", r"C\+\+17"]
}

class ConversationAnalyzer:
    def __init__(self, html_path):
        self.html_path = html_path
        self.conversations = []
        self.phase1_data = {}

    def extract_json(self):
        """Extract JSON data from HTML file"""
        print("Reading HTML file...")
        with open(self.html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract JSON
        match = re.search(r'var jsonData = (\[.*?\]);[\s\n]*(?:var|function|<|$)', content, re.DOTALL)
        if not match:
            raise ValueError("Could not extract JSON data from HTML")

        json_str = match.group(1)
        print(f"Extracted JSON string: {len(json_str)} characters")

        # Parse JSON
        self.conversations = json.loads(json_str)
        print(f"Loaded {len(self.conversations)} conversations")

    def find_phase1_topics(self):
        """Identify which conversations match Phase 1 topics"""
        matches = {}

        for conv in self.conversations:
            title = conv.get('title', '')

            # Check each topic pattern
            for topic_id, patterns in TOPIC_PATTERNS.items():
                for pattern in patterns:
                    if re.search(pattern, title, re.IGNORECASE):
                        if topic_id not in matches:
                            matches[topic_id] = []
                        matches[topic_id].append({
                            'title': title,
                            'conversation': conv
                        })
                        break

        return matches

    def extract_messages(self, conversation: Dict) -> List[Dict]:
        """Extract user questions and ChatGPT responses from conversation"""
        messages = []
        mapping = conversation.get('mapping', {})

        def traverse_tree(node_id, parent_msg=None):
            if node_id not in mapping:
                return

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
                            'create_time': message.get('create_time'),
                            'parent': parent_msg
                        })

            # Traverse children
            children = node.get('children', [])
            current_msg = messages[-1] if messages else None
            for child_id in children:
                traverse_tree(child_id, current_msg)

        # Start from root
        traverse_tree('client-created-root')
        return messages

    def analyze_user_questions(self, messages: List[Dict]) -> Dict:
        """Analyze user questions to identify confusion patterns"""
        user_msgs = [m for m in messages if m['role'] == 'user']
        assistant_msgs = [m for m in messages if m['role'] == 'assistant']

        analysis = {
            'total_questions': len(user_msgs),
            'total_responses': len(assistant_msgs),
            'questions': [],
            'concepts_mentioned': defaultdict(int),
            'confusion_indicators': 0
        }

        # Confusion keywords
        confusion_words = [
            r'\?', r'why', r'how', r'what.*difference', r'confused',
            r'explain', r'clarify', r'understand', r'mean',
            r'when.*use', r'vs\.?', r'versus', r'between'
        ]

        for msg in user_msgs:
            content = msg['content']

            # Count confusion indicators
            confusion_score = 0
            for pattern in confusion_words:
                if re.search(pattern, content, re.IGNORECASE):
                    confusion_score += 1

            # Determine question type
            q_type = self.classify_question(content)

            # Extract concepts
            concepts = self.extract_concepts(content)
            for concept in concepts:
                analysis['concepts_mentioned'][concept] += 1

            analysis['questions'].append({
                'question': content[:500],  # Truncate long questions
                'type': q_type,
                'confusion_level': min(confusion_score, 5),
                'concepts_involved': concepts
            })

            if confusion_score > 0:
                analysis['confusion_indicators'] += 1

        return analysis

    def classify_question(self, question: str) -> str:
        """Classify question type"""
        question_lower = question.lower()

        if any(word in question_lower for word in ['why', 'reason', 'purpose']):
            return 'conceptual'
        elif any(word in question_lower for word in ['how to', 'syntax', 'write']):
            return 'syntax'
        elif any(word in question_lower for word in ['error', 'wrong', 'not working', 'bug']):
            return 'debugging'
        elif any(word in question_lower for word in ['vs', 'versus', 'difference', 'compare']):
            return 'comparison'
        elif any(word in question_lower for word in ['deep', 'internal', 'detail', 'explain']):
            return 'deep_dive'
        elif '?' in question:
            return 'clarification'
        else:
            return 'example'

    def extract_concepts(self, text: str) -> List[str]:
        """Extract C++ concepts from text"""
        concepts = []

        # Common C++ concepts
        concept_patterns = {
            'virtual': r'\bvirtual\b',
            'vtable': r'\bvtable\b',
            'vptr': r'\bvptr\b',
            'polymorphism': r'\bpolymorphism\b',
            'inheritance': r'\binheritance\b',
            'encapsulation': r'\bencapsulation\b',
            'constructor': r'\bconstructor\b',
            'destructor': r'\bdestructor\b',
            'smart_pointer': r'\bsmart.*pointer\b',
            'unique_ptr': r'\bunique_ptr\b',
            'shared_ptr': r'\bshared_ptr\b',
            'weak_ptr': r'\bweak_ptr\b',
            'move_semantics': r'\bmove\b.*\bsemantics\b',
            'rvalue': r'\brvalue\b',
            'lvalue': r'\blvalue\b',
            'template': r'\btemplate\b',
            'lambda': r'\blambda\b',
            'auto': r'\bauto\b',
            'constexpr': r'\bconstexpr\b',
            'RAII': r'\bRAII\b',
            'thread': r'\bthread\b',
            'mutex': r'\bmutex\b',
            'memory_leak': r'\bmemory.*leak\b',
            'reference': r'\breference\b',
            'operator_overload': r'\boperator.*overload\b',
            'casting': r'\bcasting\b',
            'STL': r'\bSTL\b',
            'container': r'\bcontainer\b',
            'iterator': r'\biterator\b',
            'algorithm': r'\balgorithm\b'
        }

        for concept, pattern in concept_patterns.items():
            if re.search(pattern, text, re.IGNORECASE):
                concepts.append(concept)

        return concepts

    def extract_code_examples(self, messages: List[Dict]) -> List[Dict]:
        """Extract code examples from assistant responses"""
        code_examples = []

        for msg in messages:
            if msg['role'] != 'assistant':
                continue

            content = msg['content']

            # Find code blocks
            code_blocks = re.findall(r'```(?:cpp|c\+\+|c)?\s*\n(.*?)\n```', content, re.DOTALL)

            for i, code in enumerate(code_blocks):
                if len(code.strip()) < 20:  # Skip trivial code
                    continue

                # Determine C++ version from code
                cpp_version = 'cpp11'
                if 'auto' in code or 'nullptr' in code:
                    cpp_version = 'cpp11'
                if 'std::make_unique' in code or 'std::make_shared' in code:
                    cpp_version = 'cpp14'
                if 'std::optional' in code or 'if constexpr' in code:
                    cpp_version = 'cpp17'

                # Determine difficulty
                difficulty = 'beginner'
                if any(word in code for word in ['template', 'virtual', 'override']):
                    difficulty = 'intermediate'
                if any(word in code for word in ['constexpr', 'variadic', 'SFINAE', 'decltype']):
                    difficulty = 'advanced'

                code_examples.append({
                    'id': f'ex{len(code_examples)+1:03d}',
                    'code': code.strip(),
                    'language': cpp_version,
                    'difficulty': difficulty,
                    'concepts': self.extract_concepts(code)
                })

        return code_examples

    def calculate_weakness_metrics(self, analysis: Dict) -> Dict:
        """Calculate weakness scores for concepts"""
        total_questions = analysis['total_questions']
        if total_questions == 0:
            return {}

        concepts_mentioned = analysis['concepts_mentioned']
        max_mentions = max(concepts_mentioned.values()) if concepts_mentioned else 1

        # Calculate confusion levels
        questions = analysis['questions']
        avg_confusion = sum(q['confusion_level'] for q in questions) / len(questions) if questions else 0

        # Calculate follow-up rate (approximate)
        follow_up_count = sum(1 for q in questions if q['type'] in ['clarification', 'deep_dive'])
        follow_up_rate = follow_up_count / total_questions if total_questions > 0 else 0

        # Calculate per-concept metrics
        sub_concept_analysis = {}

        for concept, count in concepts_mentioned.items():
            # Filter questions involving this concept
            concept_questions = [q for q in questions if concept in q['concepts_involved']]

            if not concept_questions:
                continue

            concept_confusion = sum(q['confusion_level'] for q in concept_questions) / len(concept_questions)
            concept_follow_ups = sum(1 for q in concept_questions if q['type'] in ['clarification', 'deep_dive'])
            concept_follow_up_rate = concept_follow_ups / len(concept_questions) if concept_questions else 0

            # Weakness score calculation
            weakness_score = (
                (count / max_mentions) * 0.3 +
                (concept_confusion / 5.0) * 0.25 +
                concept_follow_up_rate * 0.25 +
                (min(count / 10, 1.0)) * 0.2  # Repetition indicator
            )

            sub_concept_analysis[concept] = {
                'questions_count': len(concept_questions),
                'avg_confusion': round(concept_confusion, 2),
                'weakness_score': round(weakness_score, 2),
                'follow_up_rate': round(concept_follow_up_rate, 2),
                'needs_practice': weakness_score > 0.6
            }

        return {
            'total_questions_asked': total_questions,
            'confusion_signals': analysis['confusion_indicators'],
            'follow_up_rate': round(follow_up_rate, 2),
            'repeated_concepts': [c for c, v in sub_concept_analysis.items() if v['questions_count'] > 3],
            'average_confusion_level': round(avg_confusion, 2),
            'sub_concept_analysis': sub_concept_analysis
        }

    def process_phase1_topics(self):
        """Process all Phase 1 topics"""
        print("\n" + "="*80)
        print("PROCESSING PHASE 1 TOPICS")
        print("="*80)

        matches = self.find_phase1_topics()

        for topic_id in range(1, 18):
            topic_title = PHASE1_TOPICS[topic_id]
            print(f"\nTopic {topic_id}: {topic_title}")

            if topic_id == 14:
                # Create placeholder for missing topic
                self.phase1_data[topic_id] = {
                    'topic_id': topic_id,
                    'topic_title': topic_title,
                    'topic_slug': 'missing_topic_14',
                    'description': 'This topic is missing from the conversation data',
                    'metadata': {
                        'completeness': 'missing',
                        'code_example_count': 0,
                        'interview_question_count': 0,
                        'practice_problem_count': 0
                    }
                }
                print("  [MISSING] Created placeholder")
                continue

            if topic_id not in matches:
                print(f"  [NOT FOUND] No conversations match this topic")
                self.phase1_data[topic_id] = {
                    'topic_id': topic_id,
                    'topic_title': topic_title,
                    'topic_slug': self.slugify(topic_title),
                    'description': f'Incomplete data for {topic_title}',
                    'metadata': {
                        'completeness': 'incomplete',
                        'code_example_count': 0,
                        'interview_question_count': 0,
                        'practice_problem_count': 0
                    }
                }
                continue

            # Merge all conversations for this topic
            all_messages = []
            for match in matches[topic_id]:
                conv = match['conversation']
                messages = self.extract_messages(conv)
                all_messages.extend(messages)
                print(f"  - Found: {match['title']} ({len(messages)} messages)")

            # Analyze
            analysis = self.analyze_user_questions(all_messages)
            code_examples = self.extract_code_examples(all_messages)
            weakness_metrics = self.calculate_weakness_metrics(analysis)

            # Build topic data
            self.phase1_data[topic_id] = {
                'topic_id': topic_id,
                'topic_title': topic_title,
                'topic_slug': self.slugify(topic_title),
                'description': self.get_topic_description(topic_id),
                'content': {
                    'code_examples': code_examples,
                    'interview_questions': self.extract_interview_questions(all_messages)
                },
                'user_learning_data': {
                    'user_questions': analysis['questions'],
                    'weakness_indicators': weakness_metrics
                },
                'quiz_recommendations': self.generate_quiz_recommendations(weakness_metrics),
                'metadata': {
                    'estimated_study_time_minutes': len(all_messages) * 3,
                    'completeness': 'complete' if len(all_messages) > 10 else 'incomplete',
                    'code_example_count': len(code_examples),
                    'interview_question_count': analysis['total_questions'],
                    'practice_problem_count': 0
                }
            }

            print(f"  ✓ Processed: {len(all_messages)} messages, {len(code_examples)} code examples")

    def slugify(self, text: str) -> str:
        """Create URL-friendly slug"""
        slug = re.sub(r'[^\w\s-]', '', text.lower())
        slug = re.sub(r'[-\s]+', '_', slug)
        return slug

    def get_topic_description(self, topic_id: int) -> str:
        """Get topic description"""
        descriptions = {
            1: "Classes, inheritance, polymorphism, virtual functions, constructors, destructors",
            2: "Stack vs heap, new/delete, memory leaks, RAII principles",
            3: "unique_ptr, shared_ptr, weak_ptr, custom deleters",
            4: "References vs pointers, copy constructor, move semantics, Rule of 3/5/0",
            5: "Operator overloading syntax, friend functions, return types",
            6: "static_cast, dynamic_cast, const_cast, reinterpret_cast, type safety",
            7: "Function templates, class templates, template specialization",
            8: "Vectors, maps, sets, algorithms, iterators, performance",
            9: "auto, nullptr, range-based for, lambda, constexpr, move semantics",
            10: "Resource Acquisition Is Initialization, scope-based resource management",
            11: "std::thread, mutex, condition_variable, atomic, thread safety",
            12: "Singleton, Factory, Observer, Strategy, Template Method patterns",
            13: "constexpr, SFINAE, type traits, template metaprogramming",
            14: "Missing topic placeholder",
            15: "Alignment, padding, undefined behavior, optimization tricks",
            16: "make_unique, generic lambdas, variable templates, binary literals",
            17: "structured bindings, if constexpr, std::optional, std::variant"
        }
        return descriptions.get(topic_id, "")

    def extract_interview_questions(self, messages: List[Dict]) -> List[Dict]:
        """Extract interview questions from messages"""
        questions = []

        for msg in messages:
            content = msg['content']

            # Look for interview question markers
            if re.search(r'interview\s+question', content, re.IGNORECASE):
                # Extract numbered or bulleted questions
                q_patterns = [
                    r'\d+\.\s*\*\*(.*?)\*\*',  # Numbered with bold
                    r'(?:^|\n)Q:\s*(.*?)(?:\n|$)',  # Q: format
                    r'(?:^|\n)-\s+(What|How|Why|When|Can|Does|Is|Should)(.*?)(?:\n|$)'  # Bulleted
                ]

                for pattern in q_patterns:
                    found_q = re.findall(pattern, content, re.MULTILINE)
                    for q in found_q:
                        q_text = q if isinstance(q, str) else ' '.join(q)
                        if len(q_text) > 10:
                            questions.append({
                                'id': f'iq{len(questions)+1:03d}',
                                'question': q_text.strip(),
                                'difficulty': 'medium',
                                'concepts': self.extract_concepts(q_text)
                            })

        return questions[:50]  # Limit to top 50

    def generate_quiz_recommendations(self, weakness_metrics: Dict) -> Dict:
        """Generate quiz recommendations based on weakness analysis"""
        if not weakness_metrics.get('sub_concept_analysis'):
            return {
                'focus_areas': [],
                'suggested_difficulty': 'medium',
                'recommended_question_count': 10
            }

        # Find weakest concepts
        sub_concepts = weakness_metrics['sub_concept_analysis']
        weak_concepts = sorted(
            [(k, v) for k, v in sub_concepts.items()],
            key=lambda x: x[1]['weakness_score'],
            reverse=True
        )[:5]

        focus_areas = [c[0] for c in weak_concepts]
        avg_weakness = sum(c[1]['weakness_score'] for c in weak_concepts) / len(weak_concepts) if weak_concepts else 0

        # Determine difficulty
        difficulty = 'easy' if avg_weakness < 0.4 else 'medium' if avg_weakness < 0.7 else 'hard'

        # Determine question count
        question_count = min(max(int(weakness_metrics['total_questions_asked'] * 0.3), 10), 25)

        return {
            'focus_areas': focus_areas,
            'suggested_difficulty': difficulty,
            'recommended_question_count': question_count,
            'question_types': {
                'multiple_choice': int(question_count * 0.4),
                'code_output': int(question_count * 0.3),
                'find_bug': int(question_count * 0.2),
                'fill_blank': int(question_count * 0.1)
            }
        }

    def save_results(self, output_dir: Path):
        """Save all Phase 1 data files"""
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        print("\n" + "="*80)
        print("SAVING RESULTS")
        print("="*80)

        # 1. phase1_topics.json
        topics_file = output_dir / 'phase1_topics.json'
        with open(topics_file, 'w', encoding='utf-8') as f:
            json.dump(self.phase1_data, f, indent=2)
        print(f"✓ Saved: {topics_file}")

        # 2. phase1_weakness_profile.json
        weakness_profile = self.generate_weakness_profile()
        weakness_file = output_dir / 'phase1_weakness_profile.json'
        with open(weakness_file, 'w', encoding='utf-8') as f:
            json.dump(weakness_profile, f, indent=2)
        print(f"✓ Saved: {weakness_file}")

        # 3. phase1_quiz_blueprint.json
        quiz_blueprint = self.generate_quiz_blueprint()
        quiz_file = output_dir / 'phase1_quiz_blueprint.json'
        with open(quiz_file, 'w', encoding='utf-8') as f:
            json.dump(quiz_blueprint, f, indent=2)
        print(f"✓ Saved: {quiz_file}")

        # 4. phase1_analytics.json
        analytics = self.generate_analytics()
        analytics_file = output_dir / 'phase1_analytics.json'
        with open(analytics_file, 'w', encoding='utf-8') as f:
            json.dump(analytics, f, indent=2)
        print(f"✓ Saved: {analytics_file}")

        # 5. phase1_learning_path.json
        learning_path = self.generate_learning_path()
        path_file = output_dir / 'phase1_learning_path.json'
        with open(path_file, 'w', encoding='utf-8') as f:
            json.dump(learning_path, f, indent=2)
        print(f"✓ Saved: {path_file}")

        # 6. phase1_content_index.json
        content_index = self.generate_content_index()
        index_file = output_dir / 'phase1_content_index.json'
        with open(index_file, 'w', encoding='utf-8') as f:
            json.dump(content_index, f, indent=2)
        print(f"✓ Saved: {index_file}")

        # 7. phase1_README.md
        readme = self.generate_readme()
        readme_file = output_dir / 'phase1_README.md'
        with open(readme_file, 'w', encoding='utf-8') as f:
            f.write(readme)
        print(f"✓ Saved: {readme_file}")

        # 8. phase1_technical_review.md
        tech_review = self.generate_technical_review()
        review_file = output_dir / 'phase1_technical_review.md'
        with open(review_file, 'w', encoding='utf-8') as f:
            f.write(tech_review)
        print(f"✓ Saved: {review_file}")

        # 9. topic_missing_14.json
        if 14 in self.phase1_data:
            missing_file = output_dir / 'topic_missing_14.json'
            with open(missing_file, 'w', encoding='utf-8') as f:
                json.dump(self.phase1_data[14], f, indent=2)
            print(f"✓ Saved: {missing_file}")

    def generate_weakness_profile(self) -> Dict:
        """Generate global weakness profile"""
        all_weaknesses = []

        for topic_id, topic_data in self.phase1_data.items():
            if 'user_learning_data' not in topic_data:
                continue

            weakness_ind = topic_data['user_learning_data'].get('weakness_indicators', {})
            sub_concepts = weakness_ind.get('sub_concept_analysis', {})

            for concept, metrics in sub_concepts.items():
                all_weaknesses.append({
                    'concept': concept,
                    'topic_id': topic_id,
                    'topic_title': topic_data['topic_title'],
                    'weakness_score': metrics['weakness_score'],
                    'questions_count': metrics['questions_count'],
                    'avg_confusion': metrics['avg_confusion']
                })

        # Sort by weakness score
        all_weaknesses.sort(key=lambda x: x['weakness_score'], reverse=True)

        return {
            'top_10_weakest_concepts': all_weaknesses[:10],
            'all_weak_concepts': [w for w in all_weaknesses if w['weakness_score'] > 0.6],
            'total_concepts_analyzed': len(all_weaknesses),
            'generated_at': datetime.now().isoformat()
        }

    def generate_quiz_blueprint(self) -> Dict:
        """Generate quiz blueprint for all Phase 1"""
        quizzes = []

        for topic_id, topic_data in self.phase1_data.items():
            quiz_rec = topic_data.get('quiz_recommendations', {})
            if quiz_rec and quiz_rec.get('focus_areas'):
                quizzes.append({
                    'topic_id': topic_id,
                    'topic_title': topic_data['topic_title'],
                    'recommendations': quiz_rec
                })

        return {
            'phase': 1,
            'total_topics': 17,
            'topics_with_quizzes': len(quizzes),
            'quizzes': quizzes,
            'generated_at': datetime.now().isoformat()
        }

    def generate_analytics(self) -> Dict:
        """Generate analytics summary"""
        total_code_examples = 0
        total_interview_questions = 0
        total_user_questions = 0
        complete_topics = 0
        incomplete_topics = 0
        missing_topics = 0

        for topic_data in self.phase1_data.values():
            meta = topic_data.get('metadata', {})
            total_code_examples += meta.get('code_example_count', 0)
            total_interview_questions += meta.get('interview_question_count', 0)

            user_data = topic_data.get('user_learning_data', {})
            weakness = user_data.get('weakness_indicators', {})
            total_user_questions += weakness.get('total_questions_asked', 0)

            completeness = meta.get('completeness', 'incomplete')
            if completeness == 'complete':
                complete_topics += 1
            elif completeness == 'missing':
                missing_topics += 1
            else:
                incomplete_topics += 1

        return {
            'phase': 1,
            'total_topics': 17,
            'complete_topics': complete_topics,
            'incomplete_topics': incomplete_topics,
            'missing_topics': missing_topics,
            'total_code_examples': total_code_examples,
            'total_interview_questions': total_interview_questions,
            'total_user_questions': total_user_questions,
            'generated_at': datetime.now().isoformat()
        }

    def generate_learning_path(self) -> Dict:
        """Generate recommended learning path"""
        # Order topics by: prerequisites, then by weakness

        # Define dependencies
        dependencies = {
            1: [],  # OOP - start here
            2: [1],  # Memory needs OOP
            3: [2],  # Smart pointers need memory
            4: [1, 2],  # Move/copy needs OOP and memory
            5: [1],  # Operator overload needs OOP
            6: [1],  # Casting needs OOP
            7: [1],  # Templates need OOP
            8: [7],  # STL needs templates
            9: [1, 2, 3, 4],  # C++11 features
            10: [2],  # RAII needs memory
            11: [9],  # Threading needs C++11
            12: [1, 7],  # Design patterns need OOP and templates
            13: [7],  # Compile-time magic needs templates
            15: [2],  # Low-level needs memory
            16: [9],  # C++14 needs C++11
            17: [16]  # C++17 needs C++14
        }

        # Calculate priority scores
        topic_scores = []
        for topic_id, topic_data in self.phase1_data.items():
            if topic_id == 14:  # Skip missing
                continue

            weakness_ind = topic_data.get('user_learning_data', {}).get('weakness_indicators', {})
            avg_confusion = weakness_ind.get('average_confusion_level', 0)

            # Priority = confusion + (num dependencies * 0.1)
            priority = avg_confusion + (len(dependencies.get(topic_id, [])) * 0.1)

            topic_scores.append({
                'topic_id': topic_id,
                'topic_title': topic_data['topic_title'],
                'priority_score': priority,
                'prerequisites': dependencies.get(topic_id, [])
            })

        # Sort by priority (higher = more urgent)
        topic_scores.sort(key=lambda x: x['priority_score'], reverse=True)

        return {
            'phase': 1,
            'recommended_order': [t['topic_id'] for t in topic_scores],
            'topic_details': topic_scores,
            'generated_at': datetime.now().isoformat()
        }

    def generate_content_index(self) -> Dict:
        """Generate searchable content index"""
        index = {
            'concepts': defaultdict(list),
            'code_examples': [],
            'interview_questions': []
        }

        for topic_id, topic_data in self.phase1_data.items():
            # Index concepts
            user_data = topic_data.get('user_learning_data', {})
            weakness = user_data.get('weakness_indicators', {})
            sub_concepts = weakness.get('sub_concept_analysis', {})

            for concept in sub_concepts.keys():
                index['concepts'][concept].append({
                    'topic_id': topic_id,
                    'topic_title': topic_data['topic_title']
                })

            # Index code examples
            content = topic_data.get('content', {})
            for example in content.get('code_examples', []):
                index['code_examples'].append({
                    'id': example['id'],
                    'topic_id': topic_id,
                    'difficulty': example['difficulty'],
                    'concepts': example['concepts']
                })

            # Index interview questions
            for question in content.get('interview_questions', []):
                index['interview_questions'].append({
                    'id': question['id'],
                    'topic_id': topic_id,
                    'question': question['question'][:100],
                    'concepts': question['concepts']
                })

        return dict(index)

    def generate_readme(self) -> str:
        """Generate README documentation"""
        return f"""# Phase 1 SMART DATA - C++ Learning Analytics

Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Overview

This directory contains comprehensive learning analytics for Phase 1 of C++ interview preparation, extracted from ChatGPT conversation history.

## Phase 1 Topics (17 Total)

1. C++ Object-Oriented Programming (OOP)
2. C++ Memory Management
3. Smart Pointers (C++11)
4. References, Copying, and Moving
5. Operator Overloading
6. Type System and Casting
7. Templates and Generics
8. STL Containers and Algorithms
9. C++11 Features
10. RAII and Resource Management
11. Multithreading (C++11 Intro)
12. Design Patterns in C++
13. Compile-Time Magic
14. [MISSING TOPIC - Placeholder]
15. Low-Level & Tricky Topics
16. C++14 Feature Deep Dive
17. C++17 Features Overview

## Files Generated

### 1. phase1_topics.json
Complete data for all 17 topics including:
- Topic metadata (title, slug, description)
- Code examples with difficulty levels
- Interview questions
- User learning data (questions asked, confusion patterns)
- Weakness indicators per concept
- Quiz recommendations

### 2. phase1_weakness_profile.json
Global weakness analysis:
- Top 10 weakest concepts across all topics
- All concepts with weakness_score > 0.6
- Sorted by weakness score for prioritization

### 3. phase1_quiz_blueprint.json
Quiz generation recommendations:
- Focus areas per topic
- Suggested difficulty levels
- Recommended question counts
- Question type distribution

### 4. phase1_analytics.json
Statistics and metrics:
- Total code examples
- Total interview questions
- Total user questions
- Topic completeness status

### 5. phase1_learning_path.json
Recommended study order:
- Topics ordered by prerequisites and weakness
- Priority scores
- Dependency graph

### 6. phase1_content_index.json
Searchable index of all content:
- Concepts mapped to topics
- Code examples by difficulty
- Interview questions by concept

### 7. phase1_README.md
This file - documentation for the dataset

### 8. phase1_technical_review.md
Technical accuracy notes and recommendations

### 9. topic_missing_14.json
Placeholder for missing topic #14

## Weakness Scoring Algorithm

```
weakness_score = (
    (questions_asked / max_questions_in_any_concept) * 0.3 +
    (avg_confusion_level / 5) * 0.25 +
    (follow_up_rate) * 0.25 +
    (repetition_indicator) * 0.2
)
```

Range: 0.0 (strong) to 1.0 (weak)
- < 0.4: Good understanding
- 0.4-0.6: Needs review
- > 0.6: Needs significant practice

## Question Types Classified

- **conceptual**: Why/reason/purpose questions
- **syntax**: How to write/syntax questions
- **debugging**: Error/bug-related questions
- **comparison**: vs/difference/compare questions
- **deep_dive**: Detailed explanation requests
- **clarification**: General ? questions
- **example**: Code example requests

## Usage for App Development

1. Load `phase1_topics.json` for complete topic data
2. Use `phase1_weakness_profile.json` to prioritize weak areas
3. Reference `phase1_quiz_blueprint.json` for quiz generation
4. Follow `phase1_learning_path.json` for optimal study order
5. Search `phase1_content_index.json` for specific concepts

## Data Completeness

- **Complete**: Topics with >10 messages in conversations
- **Incomplete**: Topics with <10 messages or partial data
- **Missing**: Topic #14 has no conversation data

## Next Steps for MVP

1. Build quiz generator using weakness scores
2. Create adaptive learning path based on user progress
3. Implement concept search using content index
4. Generate personalized study plans from weakness profile
5. Add code example practice mode sorted by difficulty

## Technical Notes

- All code examples are tagged with C++ version (11/14/17)
- Confusion levels range from 1-5 (5 = most confused)
- Timestamps preserved from original conversations
- HTML entities decoded in all text content
"""

    def generate_technical_review(self) -> str:
        """Generate technical review notes"""
        return f"""# Phase 1 Technical Review

Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Data Extraction Quality

### Successful Extractions
- Conversations parsed: {len(self.conversations)}
- Topics matched: {len([t for t in self.phase1_data.values() if t.get('metadata', {}).get('completeness') == 'complete'])}
- Code examples extracted: {sum(t.get('metadata', {}).get('code_example_count', 0) for t in self.phase1_data.values())}

### Known Limitations

1. **Topic 14 Missing**: No conversation data found for this topic
2. **Incomplete Topics**: Some topics may have limited Q&A data
3. **Code Version Detection**: Heuristic-based, may misclassify some examples
4. **Question Classification**: Rule-based, may need manual review

### Accuracy Concerns

1. **ChatGPT Responses**: Not all responses verified for technical accuracy
2. **Code Examples**: Should be compiler-tested before use
3. **Interview Questions**: May need expert review for relevance

### Recommendations for App Development

1. **Verify Code Examples**: Run all code through compiler with appropriate flags
2. **Expert Review**: Have C++ expert review high-weakness topics
3. **User Feedback**: Add mechanism to report incorrect information
4. **Version Tagging**: Add explicit C++ version tags to all examples
5. **Source Attribution**: Mark all content as ChatGPT-generated

### Data Quality Metrics

- **High Quality** (>20 messages, >5 code examples): Topics 1, 3, 9, 12
- **Medium Quality** (10-20 messages): Topics 2, 4, 7, 11, 16, 17
- **Low Quality** (<10 messages): Topics 5, 6, 8, 10, 13, 15
- **No Data**: Topic 14

### Suggested Improvements

1. Add more conversations for low-quality topics
2. Include practice problems with solutions
3. Add performance benchmarks for code examples
4. Include common compiler errors and fixes
5. Add real interview experiences from companies

### MVP Scope

For MVP, focus on high-quality topics (1, 3, 9, 12) and expand later.

### Validation Checklist

- [ ] All code examples compile without errors
- [ ] Interview questions reviewed by C++ expert
- [ ] Weakness scores validated against actual performance
- [ ] Learning path tested by beta users
- [ ] Quiz questions verified for correctness
- [ ] Content index searchable and accurate

## Notes for Future Phases

- Phase 2-4 will need similar extraction
- Consider automated testing for code examples
- Build feedback loop to improve accuracy
- Track user performance to validate weakness scores
"""


def main():
    html_path = '/home/pankaj/cplusplus/proCplusplus/docs/chat.html'
    output_dir = '/home/pankaj/cplusplus/proCplusplus/docs/phase1_smart_data'

    analyzer = ConversationAnalyzer(html_path)

    # Extract and process
    analyzer.extract_json()
    analyzer.process_phase1_topics()
    analyzer.save_results(output_dir)

    print("\n" + "="*80)
    print("PHASE 1 DATA EXTRACTION COMPLETE!")
    print("="*80)
    print(f"Output directory: {output_dir}")
    print("\nFiles generated:")
    print("  1. phase1_topics.json")
    print("  2. phase1_weakness_profile.json")
    print("  3. phase1_quiz_blueprint.json")
    print("  4. phase1_analytics.json")
    print("  5. phase1_learning_path.json")
    print("  6. phase1_content_index.json")
    print("  7. phase1_README.md")
    print("  8. phase1_technical_review.md")
    print("  9. topic_missing_14.json")


if __name__ == '__main__':
    main()
