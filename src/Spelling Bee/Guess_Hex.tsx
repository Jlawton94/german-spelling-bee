import React, { useState, useImperativeHandle, forwardRef } from 'react';
import HexIcon from './HexIcon';
import './Guess_Hex.css'; // import the CSS file

type Props = {
    onSubmit?: (word: string) => void;
    guessLetters?: string[];
    keyLetter?: string;
    shuffleRef?: React.Ref<{ shuffleHexes: () => void }>;
};

const HEX_COUNT = 6;

function shuffleArray<T>(arr: T[]): T[] {
    // Fisher-Yates shuffle
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const GuessHex = forwardRef(function GuessHex(
    { onSubmit, guessLetters, keyLetter, shuffleRef }: Props,
    _ref
) {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const [labels, setLabels] = useState<string[]>(guessLetters ?? ['A', 'B', 'C', 'D', 'E', 'F']);
    const [animating, setAnimating] = useState(false);

    const hexSize = 35; // percent
    const radius = 30; // percent from center

    function shuffleHexes() {
        setAnimating(true);
        setTimeout(() => {
            setLabels((prev) => shuffleArray(prev));
            setTimeout(() => setAnimating(false), 200); // grow back
        }, 200); // shrink duration
    }

    useImperativeHandle(shuffleRef, () => ({
        shuffleHexes,
    }));

    return (
        <div className="guess-hex-container">
            <div className="guess-hex-inner">
                {/* Outer hex buttons */}
                {labels.map((label, i) => {
                    const angle = (360 / HEX_COUNT) * i - 90;
                    const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
                    const y = 50 + Math.sin((angle * Math.PI) / 180) * radius;
                    const isActive = activeIdx === i;
                    return (
                        <button
                            key={i}
                            type="button"
                            className={`guess-hex-btn p-1${animating ? ' guess-hex-anim' : ''}`}
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                width: `${hexSize}%`,
                                height: `${hexSize}%`,
                                transition: 'transform 0.2s, width 0.2s, height 0.2s',
                                transform: animating
                                    ? 'translate(-50%, -50%) scale(0.1)'
                                    : 'translate(-50%, -50%) scale(1)',
                            }}
                            onMouseDown={() => setActiveIdx(i)}
                            onMouseUp={() => {
                                setActiveIdx(null);
                                if (onSubmit) onSubmit(`hex-${i}`);
                            }}
                            aria-label={`hex-${i}`}
                        >
                            <HexIcon
                                stroke={isActive ? "#0d6efd" : "#000000"}
                                width="100%"
                                height="100%"
                                label={label}
                            />
                        </button>
                    );
                })}
                {/* Center hex button */}
                <button
                    type="button"
                    className={`guess-hex-btn p-1${animating ? ' guess-hex-anim' : ''}`}
                    style={{
                        left: '50%',
                        top: '50%',
                        width: `${hexSize}%`,
                        height: `${hexSize}%`,
                        transition: 'transform 0.2s, width 0.2s, height 0.2s',
                        transform: animating
                            ? 'translate(-50%, -50%) scale(0.1)'
                            : 'translate(-50%, -50%) scale(1)',
                    }}
                    onMouseDown={() => setActiveIdx('center')}
                    onMouseUp={() => {
                        setActiveIdx(null);
                        if (onSubmit) onSubmit('hex-center');
                    }}
                    aria-label="hex-center"
                >
                    <HexIcon
                        stroke={activeIdx === 'center' ? "#0d6efd" : "#00ff40ff"}
                        width="100%"
                        height="100%"
                        label={keyLetter ? keyLetter : undefined}
                    />
                </button>
            </div>
        </div>
    );
});

export default GuessHex;