import React, { useState, useRef } from 'react';
import GuessHex from './Guess_Hex';

type Props = {
    onSubmit?: (word: string) => void;
};

export default function GuessingDisplay({ onSubmit }: Props) {
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
                guessLetters={['T', 'A', 'B', 'C', 'D', 'E']}
                keyLetter="G"
                shuffleRef={hexRef}
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
