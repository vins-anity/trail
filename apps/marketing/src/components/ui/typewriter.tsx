"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
    text: string;
    delay?: number;
    speed?: number;
    className?: string;
    onComplete?: () => void;
}

export function Typewriter({
    text,
    delay = 0,
    speed = 20,
    className = "",
    onComplete,
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLSpanElement>(null);

    // Intersection Observer to detect when element enters/exits viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Reset and start animation when entering viewport
                    setDisplayedText("");
                    setIsVisible(true);
                } else {
                    // Stop animation when leaving viewport
                    setIsVisible(false);
                }
            },
            { threshold: 0.3 },
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    // Typewriter effect
    useEffect(() => {
        if (!isVisible) return;

        const timeout = setTimeout(() => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex <= text.length) {
                    setDisplayedText(text.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                    if (onComplete) onComplete();
                }
            }, speed);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [isVisible, text, delay, speed, onComplete]);

    return (
        <span ref={elementRef} className={className}>
            {displayedText}
            {isVisible && displayedText.length < text.length && (
                <span className="animate-pulse">|</span>
            )}
        </span>
    );
}
