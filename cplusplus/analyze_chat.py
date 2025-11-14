#!/usr/bin/env python3
"""
Smart Data Extraction from ChatGPT Conversations
Analyzes user questions to identify learning weaknesses and confusion patterns
"""

import json
import re
from pathlib import Path
from collections import defaultdict
from datetime import datetime
import html

# Question type patterns
QUESTION_PATTERNS = {
    'conceptual': r'\b(why|how does|what is|what\'s|explain|difference between|concept of)\b',
    'syntax': r'\b(syntax|write|code for|declaration|define how)\b',
    'debugging': r'\b(error|bug|not working|wrong|fix|issue|problem)\b',
    'comparison': r'\b(difference|compare|vs|versus|better|which one)\b',
    'deep_dive': r'\b(internally|under the hood|memory layout|vtable|implementation|works inside)\b',
    'clarification': r'\b(again|more|elaborate|confused|don\'t understand|not clear|can you explain)\b',
    'example': r'\b(example|show me|demonstrate|sample|code for)\b'
}

# Confusion indicators
CONFUSION_WORDS = [
    'confused', 'don\'t understand', 'not clear', 'why', 'how',
    'elaborate', 'more detail', 'explain again', 'still confused',
    'doesn\'t make sense', 'unclear', 'can you clarify'
]

class ChatAnalyzer:
    def __init__(self, html_file):
        self.html_file = Path(html_file)
        self.conversations = []
        self.topics_data = {}
        self.weakness_profile = defaultdict(lambda: {
            'total_questions': 0,
            'confusion_signals': 0,
            'follow_ups': 0,
            'question_types': defaultdict(int),
            'sub_concepts': defaultdict(lambda: {
                'questions': [],
                'confusion_level': 0,
                'repetitions': 0
            })
        })

    def extract_json_from_html(self):
        """Extract JSON data from HTML file"""
        # First try to load pre-extracted JSON
        json_file = Path('/home/pankaj/cplusplus/proCplusplus/docs/conversations.json')

        if json_file.exists():
            print(f"Reading pre-extracted JSON: {json_file}...")
            with open(json_file, 'r', encoding='utf-8') as f:
                self.conversations = json.load(f)
        else:
            print(f"Reading {self.html_file}...")
            with open(self.html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find JSON data in script tag
            match = re.search(r'var jsonData = (\[.*?\]);', content, re.DOTALL)
            if not match:
                raise ValueError("Could not find JSON data in HTML file")

            json_str = match.group(1)
            self.conversations = json.loads(json_str)

        print(f"Found {len(self.conversations)} conversations")
        return self.conversations

    def clean_text(self, text):
        """Clean HTML entities and extra whitespace"""
        if not text:
            return ""
        text = html.unescape(text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def extract_messages(self, conversation):
        """Extract user and assistant messages from conversation mapping"""
        messages = []
        mapping = conversation.get('mapping', {})

        # Traverse the message tree
        for msg_id, msg_data in mapping.items():
            if msg_data.get('message'):
                msg = msg_data['message']
                author = msg.get('author', {}).get('role')
                content = msg.get('content', {})

                if content.get('content_type') == 'text':
                    parts = content.get('parts', [])
                    if parts and parts[0]:
                        text = self.clean_text(parts[0])
                        if text and author in ['user', 'assistant']:
                            messages.append({
                                'author': author,
                                'text': text,
                                'create_time': msg.get('create_time'),
                                'msg_id': msg_id
                            })

        # Sort by creation time
        messages.sort(key=lambda x: x['create_time'] or 0)
        return messages

    def identify_question_type(self, text):
        """Identify the type of question"""
        text_lower = text.lower()
        types = []

        for qtype, pattern in QUESTION_PATTERNS.items():
            if re.search(pattern, text_lower):
                types.append(qtype)

        return types if types else ['general']

    def calculate_confusion_level(self, text):
        """Calculate confusion level (1-5) based on text"""
        text_lower = text.lower()
        confusion_count = 0

        for word in CONFUSION_WORDS:
            confusion_count += len(re.findall(r'\b' + re.escape(word) + r'\b', text_lower))

        # Also check for question marks (multiple = more confusion)
        question_marks = text.count('?')

        # Calculate score
        score = min(5, 1 + confusion_count + (question_marks // 2))
        return score

    def extract_keywords(self, text):
        """Extract technical keywords from text"""
        # Common C++ keywords and concepts
        cpp_keywords = [
            'virtual', 'override', 'vtable', 'vptr', 'polymorphism',
            'inheritance', 'encapsulation', 'constructor', 'destructor',
            'rvalue', 'lvalue', 'move', 'copy', 'reference', 'pointer',
            'template', 'class', 'struct', 'const', 'static',
            'unique_ptr', 'shared_ptr', 'weak_ptr', 'smart pointer',
            'RAII', 'rule of three', 'rule of five', 'slicing',
            'lambda', 'constexpr', 'noexcept', 'auto', 'decltype'
        ]

        found_keywords = []
        text_lower = text.lower()

        for keyword in cpp_keywords:
            if keyword in text_lower:
                found_keywords.append(keyword)

        return found_keywords

    def is_follow_up(self, current_msg, previous_msgs):
        """Check if current message is a follow-up to previous question"""
        if not previous_msgs:
            return False

        text_lower = current_msg['text'].lower()
        follow_up_patterns = [
            r'\b(but|however|still|also|what about|and)\b',
            r'\b(more|again|elaborate|explain further)\b',
            r'\b(another question|one more|follow[- ]?up)\b'
        ]

        for pattern in follow_up_patterns:
            if re.search(pattern, text_lower):
                return True

        return False

    def analyze_conversation(self, conversation):
        """Analyze a single conversation"""
        title = conversation.get('title', 'Unknown Topic')
        messages = self.extract_messages(conversation)

        print(f"\nAnalyzing: {title}")
        print(f"  Messages: {len(messages)}")

        topic_data = {
            'title': title,
            'user_questions': [],
            'total_messages': len(messages),
            'user_messages': 0,
            'assistant_messages': 0
        }

        previous_user_msgs = []

        for i, msg in enumerate(messages):
            if msg['author'] == 'user':
                topic_data['user_messages'] += 1

                # Check if it's a question
                text = msg['text']
                if '?' in text or len(text) > 20:  # Likely a question or substantial input
                    question_types = self.identify_question_type(text)
                    confusion_level = self.calculate_confusion_level(text)
                    keywords = self.extract_keywords(text)
                    is_followup = self.is_follow_up(msg, previous_user_msgs)

                    question_data = {
                        'question': text[:500],  # Limit length
                        'types': question_types,
                        'confusion_level': confusion_level,
                        'timestamp': msg['create_time'],
                        'position': i,
                        'keywords': keywords,
                        'is_follow_up': is_followup
                    }

                    topic_data['user_questions'].append(question_data)
                    previous_user_msgs.append(msg)

            elif msg['author'] == 'assistant':
                topic_data['assistant_messages'] += 1

        print(f"  User questions extracted: {len(topic_data['user_questions'])}")
        return topic_data

    def calculate_weakness_metrics(self, topic_data):
        """Calculate weakness indicators for a topic"""
        questions = topic_data['user_questions']

        if not questions:
            return None

        total_questions = len(questions)
        confusion_signals = sum(1 for q in questions if q['confusion_level'] >= 3)
        follow_ups = sum(1 for q in questions if q.get('is_follow_up'))

        # Count question types
        type_counts = defaultdict(int)
        for q in questions:
            for qtype in q['types']:
                type_counts[qtype] += 1

        # Extract sub-concepts from keywords
        sub_concepts = defaultdict(lambda: {
            'questions_asked': 0,
            'confusion_levels': [],
            'question_texts': []
        })

        for q in questions:
            for keyword in q['keywords']:
                sub_concepts[keyword]['questions_asked'] += 1
                sub_concepts[keyword]['confusion_levels'].append(q['confusion_level'])
                sub_concepts[keyword]['question_texts'].append(q['question'][:200])

        # Calculate average confusion for each sub-concept
        for concept, data in sub_concepts.items():
            if data['confusion_levels']:
                data['avg_confusion'] = sum(data['confusion_levels']) / len(data['confusion_levels'])
                # Calculate weakness score (0.0 - 1.0)
                question_score = min(1.0, data['questions_asked'] / 10) * 0.3
                confusion_score = (data['avg_confusion'] / 5) * 0.4
                repetition_score = min(1.0, data['questions_asked'] / 5) * 0.3
                data['weakness_score'] = question_score + confusion_score + repetition_score
            else:
                data['avg_confusion'] = 0
                data['weakness_score'] = 0

        weakness_data = {
            'total_questions': total_questions,
            'confusion_signals': confusion_signals,
            'follow_up_count': follow_ups,
            'follow_up_rate': follow_ups / total_questions if total_questions > 0 else 0,
            'question_type_distribution': dict(type_counts),
            'sub_concepts': {k: {
                'questions_asked': v['questions_asked'],
                'avg_confusion': round(v['avg_confusion'], 2),
                'weakness_score': round(v['weakness_score'], 2),
                'sample_questions': v['question_texts'][:3]
            } for k, v in sub_concepts.items()},
            'avg_confusion_level': round(sum(q['confusion_level'] for q in questions) / total_questions, 2),
            'difficulty_rating': self.calculate_difficulty_rating(questions, type_counts)
        }

        return weakness_data

    def calculate_difficulty_rating(self, questions, type_counts):
        """Calculate overall difficulty rating (1-5)"""
        # Based on question types and confusion levels
        deep_dive_ratio = type_counts.get('deep_dive', 0) / len(questions) if questions else 0
        avg_confusion = sum(q['confusion_level'] for q in questions) / len(questions) if questions else 0

        rating = (avg_confusion * 0.6) + (deep_dive_ratio * 10 * 0.4)
        return round(min(5, max(1, rating)), 1)

    def generate_quiz_blueprint(self, topic_data, weakness_data):
        """Generate quiz generation blueprint"""
        if not weakness_data:
            return None

        # Get top weakness areas
        sub_concepts = weakness_data['sub_concepts']
        sorted_concepts = sorted(
            sub_concepts.items(),
            key=lambda x: x[1]['weakness_score'],
            reverse=True
        )

        focus_areas = [concept for concept, _ in sorted_concepts[:5]]

        difficulty_map = {
            (1, 2): 'beginner',
            (2, 3): 'intermediate',
            (3, 4): 'medium-hard',
            (4, 5): 'advanced'
        }

        difficulty_rating = weakness_data['difficulty_rating']
        suggested_difficulty = 'intermediate'
        for (low, high), diff in difficulty_map.items():
            if low <= difficulty_rating < high:
                suggested_difficulty = diff
                break

        practice_count = min(20, max(5, weakness_data['total_questions'] // 2))

        return {
            'focus_areas': focus_areas,
            'suggested_difficulty': suggested_difficulty,
            'recommended_practice_count': practice_count,
            'emphasis_on_confusion_areas': [
                concept for concept, data in sorted_concepts
                if data['avg_confusion'] >= 3
            ][:3]
        }

    def analyze_all(self):
        """Analyze all conversations"""
        self.extract_json_from_html()

        smart_data = {}
        weakness_profile = {}
        quiz_blueprints = {}

        for i, conv in enumerate(self.conversations):
            topic_id = f"topic_{i+1:02d}"

            # Analyze conversation
            topic_data = self.analyze_conversation(conv)

            # Calculate weakness metrics
            weakness_data = self.calculate_weakness_metrics(topic_data)

            # Generate quiz blueprint
            quiz_blueprint = self.generate_quiz_blueprint(topic_data, weakness_data)

            # Combine into smart data
            smart_data[topic_id] = {
                'title': topic_data['title'],
                'user_questions': topic_data['user_questions'],
                'weakness_indicators': weakness_data,
                'quiz_generation_data': quiz_blueprint
            }

            if weakness_data:
                weakness_profile[topic_id] = {
                    'title': topic_data['title'],
                    'weakness_score': weakness_data.get('difficulty_rating', 0),
                    'total_questions': weakness_data['total_questions'],
                    'confusion_rate': weakness_data['confusion_signals'] / weakness_data['total_questions'] if weakness_data['total_questions'] > 0 else 0
                }

            if quiz_blueprint:
                quiz_blueprints[topic_id] = {
                    'title': topic_data['title'],
                    **quiz_blueprint
                }

        return smart_data, weakness_profile, quiz_blueprints

    def generate_analytics(self, smart_data):
        """Generate overall analytics"""
        analytics = {
            'total_topics': len(smart_data),
            'total_questions': sum(
                len(data['user_questions'])
                for data in smart_data.values()
            ),
            'topics_by_question_density': [],
            'most_confused_concepts': [],
            'learning_progression': []
        }

        # Topics by question density
        topic_densities = []
        for topic_id, data in smart_data.items():
            if data.get('weakness_indicators'):
                topic_densities.append({
                    'topic_id': topic_id,
                    'title': data['title'],
                    'question_count': data['weakness_indicators']['total_questions'],
                    'difficulty_rating': data['weakness_indicators']['difficulty_rating']
                })

        topic_densities.sort(key=lambda x: x['question_count'], reverse=True)
        analytics['topics_by_question_density'] = topic_densities

        # Most confused concepts across all topics
        all_concepts = []
        for topic_id, data in smart_data.items():
            if data.get('weakness_indicators') and data['weakness_indicators'].get('sub_concepts'):
                for concept, cdata in data['weakness_indicators']['sub_concepts'].items():
                    all_concepts.append({
                        'concept': concept,
                        'topic': data['title'],
                        'weakness_score': cdata['weakness_score'],
                        'questions_asked': cdata['questions_asked']
                    })

        all_concepts.sort(key=lambda x: x['weakness_score'], reverse=True)
        analytics['most_confused_concepts'] = all_concepts[:20]

        return analytics

def main():
    html_file = '/home/pankaj/cplusplus/proCplusplus/docs/chat.html'
    output_dir = Path('/home/pankaj/cplusplus/proCplusplus/docs/smart_data')
    output_dir.mkdir(exist_ok=True)

    print("=" * 80)
    print("SMART DATA EXTRACTION - ChatGPT Conversation Analysis")
    print("=" * 80)

    analyzer = ChatAnalyzer(html_file)

    # Analyze all conversations
    smart_data, weakness_profile, quiz_blueprints = analyzer.analyze_all()

    # Generate analytics
    analytics = analyzer.generate_analytics(smart_data)

    # Save files
    print("\n" + "=" * 80)
    print("SAVING OUTPUT FILES")
    print("=" * 80)

    files = {
        'smart_data.json': smart_data,
        'weakness_profile.json': weakness_profile,
        'quiz_blueprint.json': quiz_blueprints,
        'analytics.json': analytics
    }

    for filename, data in files.items():
        filepath = output_dir / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✓ Saved: {filepath}")
        print(f"  Size: {filepath.stat().st_size / 1024:.1f} KB")

    # Print summary
    print("\n" + "=" * 80)
    print("ANALYSIS SUMMARY")
    print("=" * 80)
    print(f"Total Topics Analyzed: {analytics['total_topics']}")
    print(f"Total Questions Extracted: {analytics['total_questions']}")

    print(f"\nTop 5 Most Questioned Topics:")
    for i, topic in enumerate(analytics['topics_by_question_density'][:5], 1):
        print(f"  {i}. {topic['title']}: {topic['question_count']} questions (difficulty: {topic['difficulty_rating']}/5)")

    print(f"\nTop 10 Most Confused Concepts:")
    for i, concept in enumerate(analytics['most_confused_concepts'][:10], 1):
        print(f"  {i}. {concept['concept']}: weakness score {concept['weakness_score']:.2f} ({concept['questions_asked']} questions)")

    print("\n" + "=" * 80)
    print("COMPLETE!")
    print("=" * 80)

if __name__ == '__main__':
    main()
