"use client";

import { useEffect, useState } from "react";

interface WordPair {
    from: string;
    to: string;
}

interface WordFlipProps {
    pairs: WordPair[];
    className?: string;
    interval?: number;
    position: "from" | "to";
}

export function WordFlip({ pairs, className = "", interval = 3500, position }: WordFlipProps) {
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [hasIntroPlayed, setHasIntroPlayed] = useState(false);
    const [shuffledPairs, setShuffledPairs] = useState<WordPair[]>([]);

    // Shuffle pairs on mount
    useEffect(() => {
        const shuffled = [...pairs].sort(() => Math.random() - 0.5);
        setShuffledPairs(shuffled);

        // Intro animation delay
        setTimeout(() => setHasIntroPlayed(true), 1000);
    }, [pairs]);

    useEffect(() => {
        if (!hasIntroPlayed || shuffledPairs.length === 0) return;

        const flipInterval = setInterval(() => {
            setIsFlipping(true);

            setTimeout(() => {
                setCurrentPairIndex((prev) => (prev + 1) % shuffledPairs.length);
                setIsFlipping(false);
            }, 400);
        }, interval);

        return () => clearInterval(flipInterval);
    }, [shuffledPairs.length, interval, hasIntroPlayed]);

    if (shuffledPairs.length === 0) return null;

    const currentWord =
        position === "from"
            ? shuffledPairs[currentPairIndex].from
            : shuffledPairs[currentPairIndex].to;

    return (
        <span className={`inline-block ${className}`}>
            <span
                className={`inline-block transition-all duration-400 ${
                    !hasIntroPlayed
                        ? "opacity-0 scale-90"
                        : isFlipping
                          ? "animate-flip-out"
                          : "animate-flip-in"
                }`}
                style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                }}
            >
                {currentWord}
            </span>
        </span>
    );
}
