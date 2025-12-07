import json

def count_different_letters(word):
    """Count the number of unique letters in a word."""
    return len(set(word.lower()))

def filter_words_by_unique_letters(input_file, output_file, max_unique_letters=7):
    """Filter words that have at most max_unique_letters different letters."""
    
    # Load the JSON file
    with open(input_file, 'r', encoding='utf-8') as f:
        words = json.load(f)
    
    # Filter words
    filtered_words = [
        word for word in words 
        if count_different_letters(word) <= max_unique_letters and len(word) >= 4
    ]
    
    # Write to new file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(filtered_words, f, ensure_ascii=False, indent=2)
    
    print(f"Original word count: {len(words)}")
    print(f"Filtered word count: {len(filtered_words)}")
    print(f"Words removed: {len(words) - len(filtered_words)}")

if __name__ == "__main__":
    input_file = "German-words-1600000-words-multilines.json"
    output_file = "German-words-7-diff-letters.json"
    
    filter_words_by_unique_letters(input_file, output_file, max_unique_letters=7)
