import React, { useState, useEffect } from 'react';
import GuessingDisplay from './Guessing_Display';
import './Spelling_Bee.css';

type Props = {};

interface GameData {
    key_letter: string;
    other_letters: string[];
    words: string[];
    total_words: number;
}

export default function SpellingBee(_: Props) {
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [loading, setLoading] = useState(true);

    // Load random game data on initialization
    useEffect(() => {
        async function loadRandomGameData() {
            try {
                // Get all available game files with the new play data format
                const gameFiles = [
                    'abcdefk_a.json'
                ];
                
                // Randomly select a game file
                const randomIndex = Math.floor(Math.random() * gameFiles.length);
                const selectedFile = gameFiles[randomIndex];
                
                // Load the game data
                const response = await fetch(`/src/Game Data/${selectedFile}`);
                const data: GameData = await response.json();
                
                console.log('Loaded game data:', selectedFile, data);
                setGameData(data);
                
                var totalLetters = 0
                for( var word in data.words) {
                    totalLetters += word.length
                }
                setMaxScore(totalLetters);
            } catch (error) {
                console.error('Failed to load game data:', error);
                // Fallback to hardcoded data with new format
                setGameData({
                    key_letter: 'fail',
                    other_letters: ['', '', '', '', '', ''],
                    words: ['fail'],
                    total_words: 3
                });
            } finally {
                setLoading(false);
            }
        }

        loadRandomGameData();
    }, []);

    function handleGuessSubmit(word: string) {
        word = word.toLocaleLowerCase();
        
        if (!word || word.length < 4) {
            console.log('Word too short');
            return;
        }
        if(!word.includes(gameData?.key_letter || '')) {
            console.log('Missing key letter');
            return;
        }
        if (gameData) {
            // Check if the word is in the valid words list
            if (gameData.words.includes(word)) {
                console.log('Valid word!');
                setScore((s) => s + word.length);
            } else {
                console.log('Invalid word');
            }
        }
    }

    if (loading) {
        return <div className="loading">Loading game...</div>;
    }

    if (!gameData) {
        return <div className="error">Failed to load game data</div>;
    }

    // Extract the center letter (key letter) and outer letters from the new format
    const centerLetter = gameData.key_letter;
    const outerLetters = gameData.other_letters;

    // Calculate progress percentage
    const progressPercentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    
    // Determine progress level for CSS class
    const getProgressClass = () => {
        if (progressPercentage < 30) return 'low';
        if (progressPercentage < 60) return 'medium';
        if (progressPercentage < 90) return 'high';
        return 'max';
    };

    return (
        <div className="spelling-bee-root">
            {/* Progress Bar Container */}
            <div className="progress-bar-container">
                {/* Progress Bar Fill */}
                <div 
                    className={`progress-bar-fill ${getProgressClass()}`}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
            <GuessingDisplay 
                onSubmit={handleGuessSubmit}
                guessLetters={outerLetters.map(l => l.toUpperCase())}
                keyLetter={centerLetter.toUpperCase()}
            />
        </div>
    );
}
