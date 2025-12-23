import React, { useState, useRef } from 'react';
import GuessHex from './Guess_Hex';

type Props = {
    onSubmit?: (word: string) => void;
    guessLetters?: string[];
    keyLetter?: string;
};

export default function GuessingDisplay({ onSubmit, guessLetters, keyLetter }: Props) {
    const [currentWord, setCurrentWord] = useState('');
    const hexRef = useRef<{ shuffleHexes: () => void }>(null);

    function handleSubmit(e?: React.FormEvent) {
        e && e.preventDefault();
        if (onSubmit) onSubmit(currentWord);
        // simple UX: clear after submit
        setCurrentWord('');
    }

    function handleShuffle() {
        hexRef.current?.shuffleHexes();
    }

    function handleHexClick(letter: string) {
        setCurrentWord((prev) => prev + letter);
    }

    return (
        <div className="mt-3 d-flex flex-column align-items-stretch">
            <input
                type="text"
                value={currentWord}
                onChange={(e) => setCurrentWord(e.target.value)}
                placeholder="Your Guess"
                className="form-control form-control-lg border-0 bg-transparent w-100 text-center"
            />
            <GuessHex
                guessLetters={guessLetters}
                keyLetter={keyLetter}
                shuffleRef={hexRef}
                onSubmit={handleHexClick}
            />
            <div className="d-flex justify-content-between mt-2">
                <button
                    className="btn btn-outline-secondary"
                    onClick={handleShuffle}
                >
                    Shuffle
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => handleSubmit()}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
