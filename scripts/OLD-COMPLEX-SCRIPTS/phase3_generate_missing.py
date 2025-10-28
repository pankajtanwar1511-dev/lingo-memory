#!/usr/bin/env python3
"""
Phase 3: Generate Missing Examples with LLM Fallback

For words that had no Tatoeba matches in Phase 2, use Claude (Anthropic)
or GPT-4 to generate JLPT N5-appropriate example sentences.

All generated examples are marked with:
- needsReview: true
- source.type: "generated"
- source metadata: model, provider, date

Features:
- JLPT N5-specific prompts (basic grammar, short sentences)
- Generates 2 examples per word by default
- Rate limiting (1 request/second to avoid API limits)
- Resume support (skip already generated)
- Cost estimation before running

Input: data/n5-phase2/n5_with_examples_auto.json
Output: data/n5-phase3/n5_with_generated.json

Usage:
    export ANTHROPIC_API_KEY="sk-ant-..."
    python3 scripts/phase3_generate_missing.py \
        --input data/n5-phase2/n5_with_examples_auto.json \
        --output data/n5-phase3/n5_with_generated.json \
        --max-per-card 2 \
        --model claude
"""

import json
import sys
import argparse
import time
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

# LLM provider support
PROVIDER = None

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


class LLMExampleGenerator:
    """Generate JLPT N5 example sentences using LLM"""

    def __init__(self, provider: str = "claude", model: Optional[str] = None, max_per_card: int = 2):
        self.provider = provider
        self.max_per_card = max_per_card
        self.stats = {
            'words_needing_examples': 0,
            'examples_generated': 0,
            'api_calls': 0,
            'errors': 0,
            'skipped': 0
        }

        # Initialize LLM client
        if provider == "claude":
            if not ANTHROPIC_AVAILABLE:
                raise ImportError("anthropic library not installed. Run: pip install anthropic")
            self.client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY env var
            self.model = model or "claude-3-5-sonnet-20241022"
            self.provider_name = "anthropic"

        elif provider == "gpt4":
            if not OPENAI_AVAILABLE:
                raise ImportError("openai library not installed. Run: pip install openai")
            self.client = openai.OpenAI()  # Uses OPENAI_API_KEY env var
            self.model = model or "gpt-4-turbo-preview"
            self.provider_name = "openai"

        else:
            raise ValueError(f"Unknown provider: {provider}. Choose 'claude' or 'gpt4'")

    def create_n5_prompt(self, kanji: str, kana: str, meanings: List[str]) -> str:
        """Create JLPT N5-appropriate prompt for example generation"""

        meaning_str = ", ".join(meanings[:3])  # Use first 3 meanings

        word_display = f"{kanji} ({kana})" if kanji else kana

        prompt = f"""You are a Japanese language teacher creating example sentences for JLPT N5 beginners.

**Word**: {word_display}
**Meaning**: {meaning_str}
**JLPT Level**: N5 (absolute beginner)

**Task**: Generate {self.max_per_card} SHORT, SIMPLE example sentences using this word.

**Requirements**:
1. **Grammar**: Use ONLY N5-level grammar:
   - です/ます form (polite present tense)
   - Basic particles: は、が、を、に、で、と
   - Simple present/past tense
   - NO complex grammar (no conditionals, passive, causative, etc.)

2. **Length**: 6-10 words per sentence (very short!)
   - Target: ≤40 Japanese characters
   - Shorter is better for beginners

3. **Vocabulary**: Use ONLY common N5 words
   - Daily life topics: food, family, school, weather, time
   - Avoid advanced vocabulary

4. **Naturalness**: Must sound natural to native speakers
   - Common everyday expressions
   - Not textbook-sounding or artificial

**Output Format** (JSON array):
```json
[
  {{
    "japanese": "Japanese sentence here.",
    "english": "English translation here."
  }},
  {{
    "japanese": "Second sentence here.",
    "english": "Second translation here."
  }}
]
```

**Examples of GOOD N5 sentences**:
- "毎朝コーヒーを飲みます。" (I drink coffee every morning.)
- "今日は暑いです。" (It's hot today.)
- "友達と映画を見ました。" (I watched a movie with a friend.)

**Examples of BAD sentences (too complex for N5)**:
- "もし時間があれば、行きたいです。" (Too complex - uses conditional)
- "この本は読まれています。" (Too complex - uses passive voice)

Generate {self.max_per_card} examples now. Return ONLY the JSON array, no explanation."""

        return prompt

    def generate_examples_claude(self, prompt: str) -> List[Dict[str, str]]:
        """Generate examples using Claude (Anthropic)"""
        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                temperature=0.7,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            response_text = message.content[0].text

            # Extract JSON from response (might have markdown code blocks)
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_str = response_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = response_text.strip()

            examples = json.loads(json_str)
            return examples

        except Exception as e:
            print(f"   ❌ Claude API error: {e}")
            self.stats['errors'] += 1
            return []

    def generate_examples_gpt4(self, prompt: str) -> List[Dict[str, str]]:
        """Generate examples using GPT-4 (OpenAI)"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a Japanese language teacher creating beginner-level example sentences."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1024
            )

            response_text = response.choices[0].message.content

            # Extract JSON
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_str = response_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = response_text.strip()

            examples = json.loads(json_str)
            return examples

        except Exception as e:
            print(f"   ❌ GPT-4 API error: {e}")
            self.stats['errors'] += 1
            return []

    def generate_for_word(self, card: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate examples for a single word"""

        kanji = card.get('kanji', '')
        kana = card.get('kana', '')
        meanings = card.get('meaning', [])

        if isinstance(meanings, str):
            meanings = [meanings]

        # Create prompt
        prompt = self.create_n5_prompt(kanji, kana, meanings)

        # Call appropriate LLM
        if self.provider == "claude":
            raw_examples = self.generate_examples_claude(prompt)
        elif self.provider == "gpt4":
            raw_examples = self.generate_examples_gpt4(prompt)
        else:
            return []

        if not raw_examples:
            return []

        self.stats['api_calls'] += 1

        # Convert to schema format with metadata
        formatted_examples = []
        for raw_ex in raw_examples:
            example = {
                "japanese": raw_ex.get('japanese', ''),
                "kana": raw_ex.get('japanese', ''),  # LLM generates japanese, kana same for now
                "english": raw_ex.get('english', ''),
                "needsReview": True,  # CRITICAL: Mark for human review
                "source": {
                    "type": "generated",
                    "model": self.model,
                    "provider": self.provider_name,
                    "date": datetime.now(timezone.utc).isoformat()
                },
                "license": {
                    "text": "CC BY-SA 4.0",
                    "url": "https://creativecommons.org/licenses/by-sa/4.0/"
                }
            }
            formatted_examples.append(example)

        self.stats['examples_generated'] += len(formatted_examples)
        return formatted_examples

    def process_cards(self, cards: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process all cards, generating examples for those marked needsGeneration"""

        print("\n🤖 Generating missing examples with LLM...")

        # Count words needing generation
        words_to_generate = [c for c in cards if c.get('needsGeneration', False)]
        self.stats['words_needing_examples'] = len(words_to_generate)

        print(f"   Found {len(words_to_generate)} words needing examples")
        print(f"   Estimated API calls: {len(words_to_generate)}")
        print(f"   Rate limit: 1 request/second")
        print(f"   Estimated time: {len(words_to_generate)} seconds (~{len(words_to_generate)//60} min)")
        print()

        processed_cards = []

        for idx, card in enumerate(cards):
            # Skip if already has examples
            if not card.get('needsGeneration', False):
                processed_cards.append(card)
                continue

            # Generate examples
            word_display = card.get('kanji', '') or card.get('kana', '')
            print(f"   [{idx+1}/{len(cards)}] Generating for: {word_display}")

            generated_examples = self.generate_for_word(card)

            if generated_examples:
                # Merge with existing examples (should be empty, but just in case)
                existing = card.get('examples', [])
                card['examples'] = existing + generated_examples
                del card['needsGeneration']  # Remove flag
            else:
                # Keep needsGeneration flag if generation failed
                self.stats['errors'] += 1

            processed_cards.append(card)

            # Rate limiting (1 request/second)
            time.sleep(1)

        return processed_cards

    def print_stats(self) -> None:
        """Print generation statistics"""
        print("\n" + "=" * 60)
        print("📊 GENERATION STATISTICS")
        print("=" * 60)
        print(f"Words needing examples:   {self.stats['words_needing_examples']}")
        print(f"API calls made:           {self.stats['api_calls']}")
        print(f"Examples generated:       {self.stats['examples_generated']}")
        print(f"Errors:                   {self.stats['errors']}")
        print("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="Phase 3: Generate missing examples with LLM")
    parser.add_argument("--input", required=True, help="Input enriched JSON (from Phase 2)")
    parser.add_argument("--output", default="data/n5-phase3/n5_with_generated.json",
                       help="Output JSON with generated examples")
    parser.add_argument("--max-per-card", type=int, default=2, help="Max examples to generate per word")
    parser.add_argument("--model", choices=["claude", "gpt4"], default="claude",
                       help="LLM provider (default: claude)")
    parser.add_argument("--model-name", help="Specific model name (optional)")

    args = parser.parse_args()

    print("🚀 Phase 3: Generating Missing Examples with LLM")
    print("=" * 60)
    print(f"Input:          {args.input}")
    print(f"Output:         {args.output}")
    print(f"Provider:       {args.model}")
    print(f"Max per word:   {args.max_per_card}")
    print()

    # Load enriched dataset
    print("📥 Loading enriched dataset...")
    with open(args.input, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data.get('vocabulary', [])
    print(f"   Loaded {len(cards)} words")

    # Initialize generator
    try:
        generator = LLMExampleGenerator(
            provider=args.model,
            model=args.model_name,
            max_per_card=args.max_per_card
        )
    except (ImportError, ValueError) as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

    # Process cards
    processed_cards = generator.process_cards(cards)

    # Save output
    print("\n💾 Saving dataset with generated examples...")

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    output_data = {
        'version': '1.0.0-phase3',
        'metadata': {
            'phase': 'Phase 3: LLM Fallback Generation',
            'createdAt': '2025-01-01',
            'description': 'N5 vocabulary with Tatoeba + AI-generated examples',
            'license': 'CC BY-SA 4.0 (vocab + AI) + CC BY 2.0 FR (Tatoeba)',
            'totalCards': len(processed_cards),
            'generationSettings': {
                'provider': args.model,
                'model': generator.model,
                'maxExamplesPerWord': args.max_per_card
            }
        },
        'vocabulary': processed_cards
    }

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"   ✅ Saved: {output_path}")

    # Print statistics
    generator.print_stats()

    print("\n✅ Phase 3 Complete!")
    print(f"   Dataset with generated examples: {args.output}")
    print(f"   Total examples generated: {generator.stats['examples_generated']}")
    print()
    print("📝 Next step: Validate dataset and create review tasks")
    print(f"   python3 scripts/phase4_validate_n5.py \\")
    print(f"     --input {args.output} \\")
    print(f"     --output-dir reports/n5-phase4")


if __name__ == "__main__":
    main()
