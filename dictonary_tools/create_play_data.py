#!/usr/bin/env python3
"""
Create final play data files from combined game files.
For each letter combination, create separate game files where each letter 
serves as the key letter, with only words that contain that key letter.
"""

import json
import os
from pathlib import Path

def letter_in_word(letter, word):
    """Check if a letter appears in a word (case insensitive)."""
    return letter.lower() in word.lower()

def create_play_data_for_key_letter(letters, words, key_letter):
    """Create play data with a specific key letter."""
    # Filter words to only include those containing the key letter and convert to lowercase
    valid_words = [word.lower() for word in words if letter_in_word(key_letter, word)]
    
    # Arrange letters so key letter is first, others follow
    other_letters = [l for l in letters if l.lower() != key_letter.lower()]
    arranged_letters = [key_letter] + other_letters
    
    return {
        'key_letter': key_letter,
        'other_letters': other_letters,
        'words': valid_words,
        'total_words': len(valid_words)
    }

def process_combined_files(input_dir, output_dir):
    """Process all combined files to create final play data."""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    
    # Create output directory
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Get all combined game files
    combined_files = list(input_path.glob("*.json"))
    print(f"Found {len(combined_files)} combined game files")
    
    total_games_created = 0
    
    for file_path in combined_files:
        print(f"\nProcessing: {file_path.name}")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            letters = data['letters']
            words = data['words']
            base_name = file_path.stem  # filename without extension
            
            print(f"  Letters: {letters}")
            print(f"  Total words: {len(words)}")
            
            # Create a game file for each letter as key letter
            for key_letter in letters:
                play_data = create_play_data_for_key_letter(letters, words, key_letter)
                
                if play_data['total_words'] > 0:  # Only create files with valid words
                    # Create filename: original_name + key_letter
                    output_filename = f"{base_name}_{key_letter.lower()}.json"
                    output_file_path = output_path / output_filename
                    
                    with open(output_file_path, 'w', encoding='utf-8') as f:
                        json.dump(play_data, f, indent=2, ensure_ascii=False)
                    
                    print(f"    Created: {output_filename} ({play_data['total_words']} words with '{key_letter}')")
                    total_games_created += 1
                else:
                    print(f"    Skipped: {key_letter} (no words contain this letter)")
        
        except Exception as e:
            print(f"  Error processing {file_path.name}: {e}")
    
    print(f"\nCompleted! Created {total_games_created} play data files in '{output_dir}'")

def main():
    # Directories
    combined_dir = "combined_games"
    play_data_dir = "final_play_data"
    
    print("Creating final play data from combined game files...")
    print(f"Input directory: {combined_dir}")
    print(f"Output directory: {play_data_dir}")
    
    if not Path(combined_dir).exists():
        print(f"Error: Input directory '{combined_dir}' does not exist!")
        return
    
    process_combined_files(combined_dir, play_data_dir)

if __name__ == "__main__":
    main()