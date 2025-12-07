import React, { useState } from 'react';
import GuessingDisplay from './Guessing_Display';

type Props = {};

export default function SpellingBee(_: Props) {
    const [score, setScore] = useState(0);

    function handleGuessSubmit(word: string) {
        // For now, treat any submission as a correct guess and award a point.
        // Later we can validate the word.
        console.log('submitted guess:', word);
        setScore((s) => s + 1);
    }

    return (
        <div className="spelling-bee-root" style={{ padding: 20 }}>
            <GuessingDisplay onSubmit={handleGuessSubmit} />
        </div>
    );
}
