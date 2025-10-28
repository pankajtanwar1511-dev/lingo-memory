#!/usr/bin/env python3
"""
LLM-Based Example Generator for Missing Vocabulary Examples

Generates beginner-friendly Japanese example sentences for vocabulary cards
that have 0 examples. Uses Claude/OpenAI to create natural sentences.

All generated examples are marked with:
- source.type = "generated"
- needsReview = true
- source.model = "claude-3-5-sonnet-20241022" (or specified model)
- source.date = generation timestamp

Usage:
    python3 scripts/generate-missing-examples.py \\
        --input public/seed-data/n5-comprehensive.json \\
        --output data/n5-with-generated-examples.json \\
        --max-per-card 2 \\
        --model claude

Requirements:
    - anthropic library (pip install anthropic)
    - ANTHROPIC_API_KEY environment variable
    OR
    - openai library (pip install openai)
    - OPENAI_API_KEY environment variable
"""

import json
import os
import sys
import argparse
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any

# Try to import API libraries
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


class ExampleGenerator:
    """Generate example sentences using LLM"""

    def __init__(self, model_provider: str = "claude", model_name: str = None):
        self.provider = model_provider
        self.generated_count = 0
        self.failed_count = 0

        if model_provider == "claude":
            if not ANTHROPIC_AVAILABLE:
                raise ImportError("anthropic library not installed. Run: pip install anthropic")
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                raise ValueError("ANTHROPIC_API_KEY environment variable not set")
            self.client = anthropic.Anthropic(api_key=api_key)
            self.model_name = model_name or "claude-3-5-sonnet-20241022"

        elif model_provider == "openai":
            if not OPENAI_AVAILABLE:
                raise ImportError("openai library not installed. Run: pip install openai")
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OPENAI_API_KEY environment variable not set")
            self.client = openai.OpenAI(api_key=api_key)
            self.model_name = model_name or "gpt-4-turbo-preview"

        else:
            raise ValueError(f"Unknown provider: {model_provider}")

    def generate_examples(self, card: Dict[str, Any], max_examples: int = 2) -> List[Dict[str, Any]]:
        """Generate example sentences for a vocabulary card"""
        jlpt_level = card.get("jlptLevel", "N5")
        kanji = card.get("kanji", "")
        kana = card.get("kana", "")
        meaning = card.get("meaning")

        # Handle meaning as array or string
        if isinstance(meaning, list):
            meaning_str = ", ".join(meaning)
        else:
            meaning_str = meaning

        # Create prompt
        prompt = self._create_prompt(kanji, kana, meaning_str, jlpt_level, max_examples)

        try:
            # Call LLM
            if self.provider == "claude":
                response = self._call_claude(prompt)
            else:
                response = self._call_openai(prompt)

            # Parse response
            examples = self._parse_response(response, card)
            self.generated_count += len(examples)
            return examples

        except Exception as e:
            print(f"  ⚠️  Error generating examples for {card.get('id')}: {e}")
            self.failed_count += 1
            return []

    def _create_prompt(self, kanji: str, kana: str, meaning: str, level: str, max_examples: int) -> str:
        """Create prompt for LLM"""
        word_display = f"{kanji} ({kana})" if kanji else kana

        # Grammar constraints based on JLPT level
        grammar_guide = {
            "N5": "Use only basic grammar: です/ます form, simple particles (は、を、に、で), present tense preferred",
            "N4": "Use N5-N4 grammar: past tense OK, て-form OK, basic conjunctions (から、けど)",
            "N3": "Use N5-N3 grammar: conditionals OK, casual form acceptable",
        }.get(level, "Use beginner-friendly grammar")

        # Length limit based on level
        length_limit = {
            "N5": "6-10 words",
            "N4": "8-12 words",
            "N3": "10-15 words",
        }.get(level, "8-12 words")

        prompt = f"""Generate {max_examples} simple, natural Japanese example sentences for this vocabulary word:

Word: {word_display}
Meaning: {meaning}
JLPT Level: {level}

Requirements:
1. Each sentence must contain the target word ({kana} or {kanji if kanji else kana})
2. Sentence length: {length_limit} ({level} level)
3. Grammar: {grammar_guide}
4. Natural, conversational Japanese that a beginner would actually use
5. Provide English translation for each sentence

Return ONLY a JSON array with this exact format (no additional text):
[
  {{
    "japanese": "Japanese sentence here",
    "english": "English translation here"
  }},
  ...
]

Example format:
[
  {{"japanese": "今日は暑いです。", "english": "It's hot today."}}
]

Now generate {max_examples} examples for {word_display}:"""

        return prompt

    def _call_claude(self, prompt: str) -> str:
        """Call Claude API"""
        message = self.client.messages.create(
            model=self.model_name,
            max_tokens=1024,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text

    def _call_openai(self, prompt: str) -> str:
        """Call OpenAI API"""
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=[
                {"role": "system", "content": "You are a Japanese language expert creating beginner-friendly example sentences."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content

    def _parse_response(self, response: str, card: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parse LLM response and add metadata"""
        # Try to extract JSON from response
        response = response.strip()

        # Remove markdown code blocks if present
        if response.startswith("```"):
            lines = response.split("\n")
            response = "\n".join(lines[1:-1]) if len(lines) > 2 else response
            if response.startswith("json"):
                response = response[4:]

        # Parse JSON
        try:
            examples_raw = json.loads(response)
        except json.JSONDecodeError:
            # Try to find JSON array in text
            start = response.find("[")
            end = response.rfind("]")
            if start != -1 and end != -1:
                examples_raw = json.loads(response[start:end+1])
            else:
                raise ValueError("Could not parse JSON from response")

        # Add metadata to each example
        examples = []
        for ex in examples_raw:
            example = {
                "japanese": ex["japanese"],
                "english": ex["english"],
                "needsReview": True,
                "source": {
                    "type": "generated",
                    "model": self.model_name,
                    "provider": self.provider,
                    "date": datetime.now().isoformat()
                }
            }
            examples.append(example)

        return examples


def main():
    parser = argparse.ArgumentParser(description="Generate missing example sentences using LLM")
    parser.add_argument("--input", required=True, help="Input JSON file path")
    parser.add_argument("--output", required=True, help="Output JSON file path")
    parser.add_argument("--max-per-card", type=int, default=2, help="Max examples to generate per card")
    parser.add_argument("--model", choices=["claude", "openai"], default="claude", help="LLM provider")
    parser.add_argument("--dry-run", action="store_true", help="Print what would be generated without calling API")
    parser.add_argument("--limit", type=int, help="Limit number of cards to process (for testing)")

    args = parser.parse_args()

    print("🤖 LLM-Based Example Generator")
    print("=" * 60)
    print()

    # Load dataset
    print(f"📥 Loading dataset: {args.input}")
    with open(args.input, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data.get("vocabulary", [])
    print(f"✅ Loaded {len(cards)} cards")
    print()

    # Find cards without examples
    cards_without_examples = [
        card for card in cards
        if not card.get("examples") or len(card.get("examples", [])) == 0
    ]

    print(f"📊 Cards without examples: {len(cards_without_examples)}")

    if args.limit:
        cards_without_examples = cards_without_examples[:args.limit]
        print(f"   (Limited to {args.limit} for testing)")

    print()

    if args.dry_run:
        print("🔍 DRY RUN - Would generate examples for:")
        for card in cards_without_examples[:10]:
            print(f"   - {card.get('id')}: {card.get('kana')} ({card.get('meaning')})")
        if len(cards_without_examples) > 10:
            print(f"   ... and {len(cards_without_examples) - 10} more")
        return

    # Initialize generator
    print(f"🚀 Initializing {args.model} generator...")
    generator = ExampleGenerator(model_provider=args.model)
    print()

    # Generate examples
    print(f"✨ Generating examples ({args.max_per_card} per card)...")
    print()

    cards_updated = 0
    for idx, card in enumerate(cards_without_examples, 1):
        card_id = card.get("id", "unknown")
        kana = card.get("kana", "")

        print(f"  [{idx}/{len(cards_without_examples)}] {card_id}: {kana}...", end=" ", flush=True)

        examples = generator.generate_examples(card, args.max_per_card)

        if examples:
            # Add examples to card
            if "examples" not in card:
                card["examples"] = []
            card["examples"].extend(examples)
            cards_updated += 1
            print(f"✓ ({len(examples)} examples)")
        else:
            print("✗ failed")

        # Small delay to avoid rate limits
        import time
        time.sleep(0.5)

    print()
    print("=" * 60)
    print("📊 GENERATION SUMMARY")
    print("=" * 60)
    print(f"Cards processed:      {len(cards_without_examples)}")
    print(f"Cards updated:        {cards_updated}")
    print(f"Examples generated:   {generator.generated_count}")
    print(f"Failed:               {generator.failed_count}")
    print()

    # Save output
    print(f"💾 Saving to: {args.output}")
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("✅ Done!")
    print()
    print("⚠️  IMPORTANT: All generated examples are marked needsReview=true")
    print("   Please review them before using in production.")
    print()


if __name__ == "__main__":
    main()
