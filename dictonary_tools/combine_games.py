import json
import os
from pathlib import Path
from collections import defaultdict

def get_letter_key(letters):
    """Create a unique key from a list of letters."""
    return ''.join(sorted(letters))

def combine_game_files(input_dir, output_dir):
    """Combine game files that share the same 7 letters."""
    # Dictionary to group words by their letter combination
    letter_groups = defaultdict(lambda: {
        'letters': [],
        'words': []
    })
    
    # Read all game data files
    print(f"Reading game data files from '{input_dir}/'...")
    game_files = list(Path(input_dir).glob("*.json"))
    
    for i, file_path in enumerate(game_files):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
            # Create a unique key for this letter combination
            letter_key = get_letter_key(data['letters'])
            
            # Store the letters if not already stored
            if not letter_groups[letter_key]['letters']:
                letter_groups[letter_key]['letters'] = data['letters']
            
            # Add all possible words to this group
            if 'possible_words' in data:
                for word in data['possible_words']:
                    if word not in letter_groups[letter_key]['words']:
                        letter_groups[letter_key]['words'].append(word)
        
        # Progress indicator
        if (i + 1) % 10000 == 0:
            print(f"  Processed {i + 1}/{len(game_files)} files...")
    
    print(f"\nFound {len(letter_groups)} unique letter combinations")
    
    # Create the output directory
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Write combined files
    print(f"\nCreating combined game files in '{output_dir}/'...")
    for letter_key, data in letter_groups.items():
        # Sort words alphabetically
        data['words'].sort()
        
        # Create filename from the letter combination
        filename = f"{letter_key}.json"
        file_path = os.path.join(output_dir, filename)
        
        game_data = {
            "letters": data['letters'],
            "words": data['words'],
            "total_words": len(data['words'])
        }
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(game_data, f, ensure_ascii=False, indent=2)
    
    print(f"Created {len(letter_groups)} combined game files")
    
    return letter_groups

def show_statistics(letter_groups):
    """Show statistics about the combined games."""
    word_counts = [len(data['words']) for data in letter_groups.values()]
    
    print("\nStatistics:")
    print(f"  Total unique letter combinations: {len(letter_groups)}")
    print(f"  Average words per game: {sum(word_counts) / len(word_counts):.1f}")
    print(f"  Min words in a game: {min(word_counts)}")
    print(f"  Max words in a game: {max(word_counts)}")
    
    # Show some examples
    print("\nExample games:")
    for i, (letter_key, data) in enumerate(list(letter_groups.items())[:5]):
        print(f"  {letter_key}: {', '.join(data['letters'])} ({len(data['words'])} words)")

if __name__ == "__main__":
    input_dir = "game_data"
    output_dir = "combined_games"
    
    print("Combining game files with matching letters...")
    letter_groups = combine_game_files(input_dir, output_dir)
    
    show_statistics(letter_groups)
    
    print(f"\nDone! Combined game files are in '{output_dir}/' directory")
    print("\nNote: At runtime, you can:")
    print("  1. Pick a random letter from the 7 letters as the 'central letter'")
    print("  2. Filter the words to only include those containing the central letter")
    print("  3. Present the puzzle to the player")
