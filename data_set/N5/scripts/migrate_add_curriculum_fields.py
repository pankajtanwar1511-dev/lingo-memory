#!/usr/bin/env python3
"""
Database Migration: Add Curriculum/Progressive Learning Fields
Based on Claude AI + ChatGPT consensus recommendations

This script adds curriculum-related fields to n5_sentences_ultra_pure.db
to support progressive learning sequence and stage-based teaching.

New fields added:
- learning_stage: int (1-5)
- eligible_stages: JSON array
- prerequisite_stage: int
- primary_grammar_target: str
- secondary_grammar_targets: JSON array
- new_vocab_introduced: JSON array
- review_vocab: JSON array
- cognitive_load: float (0-1)
- review_weight: float (1-5)
- formality_relation: int (optional - links paired sentences)
- is_demo_sentence: boolean
- max_new_concepts: int
- pattern_confidence: float (0-1)
- manual_flag: boolean
- teaching_notes: text (optional)
"""

import sqlite3
import json
from pathlib import Path

# Database path
DB_PATH = Path(__file__).parent.parent / "n5_sentences_ultra_pure.db"

def check_current_schema(conn):
    """Check and display current schema."""
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(n5_sentences)")
    columns = cursor.fetchall()

    print("\n=== Current Schema ===")
    print(f"Total columns: {len(columns)}")
    for col in columns:
        print(f"  - {col[1]} ({col[2]})")

    return [col[1] for col in columns]  # Return column names

def add_curriculum_fields(conn):
    """Add all curriculum-related fields to the database."""
    cursor = conn.cursor()

    # List of new fields to add
    # Format: (column_name, type, default_value, description)
    new_fields = [
        ("learning_stage", "INTEGER", "NULL", "Primary learning stage (1-5)"),
        ("eligible_stages", "TEXT", "NULL", "JSON array of eligible stages [1,2,3]"),
        ("prerequisite_stage", "INTEGER", "NULL", "Minimum stage based on grammar dependencies"),
        ("primary_grammar_target", "TEXT", "NULL", "Main grammar pattern this sentence teaches"),
        ("secondary_grammar_targets", "TEXT", "NULL", "JSON array of reinforced patterns"),
        ("new_vocab_introduced", "TEXT", "NULL", "JSON array of new vocabulary (lemmas)"),
        ("review_vocab", "TEXT", "NULL", "JSON array of previously taught vocabulary"),
        ("cognitive_load", "REAL", "NULL", "Cognitive load 0.0-1.0 (new concepts ratio)"),
        ("review_weight", "REAL", "NULL", "SRS importance weight 1.0-5.0"),
        ("formality_relation", "INTEGER", "NULL", "ID of paired formal/casual sentence"),
        ("is_demo_sentence", "INTEGER DEFAULT 0", "", "Boolean: used in lesson explanation"),
        ("max_new_concepts", "INTEGER", "NULL", "Count of new grammar + new vocab"),
        ("pattern_confidence", "REAL", "NULL", "Auto-detection confidence 0.0-1.0"),
        ("manual_flag", "INTEGER DEFAULT 0", "", "Boolean: needs manual review"),
        ("teaching_notes", "TEXT", "NULL", "Optional manual curation notes"),
    ]

    # Get existing columns
    existing_columns = check_current_schema(conn)

    print("\n=== Adding Curriculum Fields ===")

    added_count = 0
    skipped_count = 0

    for column_name, col_type, default, description in new_fields:
        if column_name in existing_columns:
            print(f"  ⏭️  SKIP: {column_name} already exists")
            skipped_count += 1
        else:
            # Construct ALTER TABLE statement
            if default:
                sql = f"ALTER TABLE n5_sentences ADD COLUMN {column_name} {col_type} {default}"
            else:
                sql = f"ALTER TABLE n5_sentences ADD COLUMN {column_name} {col_type}"

            try:
                cursor.execute(sql)
                print(f"  ✅ ADDED: {column_name} ({col_type}) - {description}")
                added_count += 1
            except sqlite3.Error as e:
                print(f"  ❌ ERROR adding {column_name}: {e}")

    conn.commit()

    print(f"\n=== Migration Summary ===")
    print(f"  Fields added: {added_count}")
    print(f"  Fields skipped (already exist): {skipped_count}")
    print(f"  Total new fields: {len(new_fields)}")

    return added_count

def create_indices(conn):
    """Create indices for performance on frequently queried fields."""
    cursor = conn.cursor()

    indices = [
        ("idx_learning_stage", "n5_sentences", "learning_stage"),
        ("idx_prerequisite_stage", "n5_sentences", "prerequisite_stage"),
        ("idx_primary_grammar", "n5_sentences", "primary_grammar_target"),
        ("idx_is_demo", "n5_sentences", "is_demo_sentence"),
        ("idx_manual_flag", "n5_sentences", "manual_flag"),
    ]

    print("\n=== Creating Indices ===")

    for index_name, table_name, column_name in indices:
        try:
            sql = f"CREATE INDEX IF NOT EXISTS {index_name} ON {table_name}({column_name})"
            cursor.execute(sql)
            print(f"  ✅ Index: {index_name} on {column_name}")
        except sqlite3.Error as e:
            print(f"  ❌ ERROR creating {index_name}: {e}")

    conn.commit()

def verify_migration(conn):
    """Verify the migration was successful."""
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(n5_sentences)")
    columns = cursor.fetchall()

    print("\n=== Final Schema ===")
    print(f"Total columns: {len(columns)}")

    # Check for curriculum fields
    curriculum_fields = {
        "learning_stage", "eligible_stages", "prerequisite_stage",
        "primary_grammar_target", "secondary_grammar_targets",
        "new_vocab_introduced", "review_vocab", "cognitive_load",
        "review_weight", "formality_relation", "is_demo_sentence",
        "max_new_concepts", "pattern_confidence", "manual_flag",
        "teaching_notes"
    }

    existing_field_names = {col[1] for col in columns}
    found_curriculum_fields = curriculum_fields & existing_field_names

    print(f"\nCurriculum fields found: {len(found_curriculum_fields)}/{len(curriculum_fields)}")

    if len(found_curriculum_fields) == len(curriculum_fields):
        print("  ✅ All curriculum fields successfully added!")
    else:
        missing = curriculum_fields - found_curriculum_fields
        print(f"  ⚠️  Missing fields: {missing}")

    # Get row count
    cursor.execute("SELECT COUNT(*) FROM n5_sentences")
    row_count = cursor.fetchone()[0]
    print(f"\nTotal sentences in database: {row_count}")

    return len(found_curriculum_fields) == len(curriculum_fields)

def backup_database():
    """Create a backup before migration."""
    import shutil
    from datetime import datetime

    if not DB_PATH.exists():
        print(f"⚠️  Database not found: {DB_PATH}")
        return False

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = DB_PATH.parent / f"n5_sentences_ultra_pure_backup_{timestamp}.db"

    print(f"\n=== Creating Backup ===")
    print(f"  Original: {DB_PATH}")
    print(f"  Backup:   {backup_path}")

    try:
        shutil.copy2(DB_PATH, backup_path)
        print(f"  ✅ Backup created successfully")
        return True
    except Exception as e:
        print(f"  ❌ Backup failed: {e}")
        return False

def main():
    """Main migration function."""
    print("="*60)
    print("   N5 Database Migration: Add Curriculum Fields")
    print("="*60)
    print("\nBased on: Claude AI + ChatGPT consensus")
    print("Purpose: Enable progressive learning sequence tagging")

    # Step 1: Backup
    if not backup_database():
        print("\n❌ Backup failed. Aborting migration for safety.")
        return 1

    # Step 2: Connect to database
    if not DB_PATH.exists():
        print(f"\n❌ Database not found: {DB_PATH}")
        return 1

    print(f"\n📂 Opening database: {DB_PATH}")

    try:
        conn = sqlite3.connect(DB_PATH)

        # Step 3: Add curriculum fields
        added_count = add_curriculum_fields(conn)

        # Step 4: Create indices
        create_indices(conn)

        # Step 5: Verify migration
        success = verify_migration(conn)

        conn.close()

        if success:
            print("\n" + "="*60)
            print("   ✅ Migration completed successfully!")
            print("="*60)
            print("\nNext steps:")
            print("  1. Run auto-tagging script to populate curriculum fields")
            print("  2. Review and manually curate flagged sentences")
            print("  3. Validate with curriculum validation suite")
            return 0
        else:
            print("\n" + "="*60)
            print("   ⚠️  Migration completed with warnings")
            print("="*60)
            return 1

    except sqlite3.Error as e:
        print(f"\n❌ Database error: {e}")
        return 1
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    exit(main())
