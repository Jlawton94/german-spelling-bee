import json
import os
from pathlib import Path

def get_unique_letters(word):
    """Get the set of unique letters in a word (case-insensitive)."""
    return set(word.lower())

def find_words_with_exactly_7_letters(words):
    """Find words that have exactly 7 unique letters."""
    valid_words = []
    for word in words:
        unique_letters = get_unique_letters(word)
        if len(unique_letters) == 7:
            valid_words.append(word)
    return valid_words

def can_spell_word(word, available_letters):
    """Check if a word can be spelled using the available letters."""
    word_letters = word.lower()
    available_set = set(available_letters)
    
    # Check if all letters in the word are in the available letters
    for letter in word_letters:
        if letter not in available_set:
            return False
    return True

def find_words_with_letters(all_words, letters):
    """Find all words that can be spelled with the given letters."""
    matching_words = []
    for word in all_words:
        if can_spell_word(word, letters):
            matching_words.append(word)
    return matching_words

def create_game_data_files(words, all_words, output_dir):
    """Create a JSON file for each word with exactly 7 unique letters."""
    # Create the game_data directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    created_files = []
    for i, word in enumerate(words):
        # Create a safe filename from the word
        safe_filename = word.replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue').replace('ß', 'ss')
        safe_filename = ''.join(c for c in safe_filename if c.isalnum() or c == '_')
        
        file_path = os.path.join(output_dir, f"{safe_filename}.json")
        
        # Get unique letters for this word
        unique_letters = sorted(list(get_unique_letters(word)))
        
        # Find all words that can be spelled with these letters
        matching_words = find_words_with_letters(all_words, unique_letters)
        
        game_data = {
            "word": word,
            "letters": unique_letters,
            "possible_words": matching_words
        }
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(game_data, f, ensure_ascii=False, indent=2)
        
        created_files.append(file_path)
        
        # Progress indicator
        if (i + 1) % 1000 == 0:
            print(f"  Processed {i + 1}/{len(words)} files...")
    
    return created_files

def process_game_data_files(output_dir):
    """Read each game data file and verify the letters."""
    game_data_files = list(Path(output_dir).glob("*.json"))
    
    print(f"\nProcessed {len(game_data_files)} game data files:")
    for i, file_path in enumerate(game_data_files[:5]):  # Show first 5 as examples
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"  {data['word']}: {', '.join(data['letters'])} ({len(data['possible_words'])} possible words)")
    
    if len(game_data_files) > 5:
        print(f"  ... and {len(game_data_files) - 5} more files")

if __name__ == "__main__":
    input_file = "German-words-7-diff-letters.json"
    output_dir = "game_data"
    
    print(f"Loading words from {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        all_words = json.load(f)
    
    print(f"Total words loaded: {len(all_words)}")
    
    # Find words with exactly 7 unique letters
    print("\nFinding words with exactly 7 unique letters...")
    valid_words = find_words_with_exactly_7_letters(all_words)
    print(f"Found {len(valid_words)} words with exactly 7 unique letters")
    
    # Create game data files
    print(f"\nCreating game data files in '{output_dir}/' directory...")
    created_files = create_game_data_files(valid_words, all_words, output_dir)
    print(f"Created {len(created_files)} game data files")
    
    # Process and display the game data files
    process_game_data_files(output_dir)
    
    print(f"\nDone! Game data files are in '{output_dir}/' directory")
    