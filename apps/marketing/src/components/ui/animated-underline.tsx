"use client";

import { useEffect, useState } from "react";

interface AnimatedUnderlineProps {
    children: React.ReactNode;
    className?: string;
}

export function AnimatedUnderline({ children, className = "" }: AnimatedUnderlineProps) {
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        // Always animate (looping with pause)
        setIsAnimating(true);
    }, []);

    return (
        <span className={`relative inline-block ${className}`}>
            {children}
            {/* Animated Pencil Underline */}
            <svg
                className="absolute -bottom-2 left-0 w-full h-6 pointer-events-none overflow-visible"
                viewBox="0 0 300 16"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Rough, curvy underline path (hand-drawn style) */}
                <path
                    d="M5 10 Q 30 7, 55 9 T 95 8 Q 120 10, 145 7 T 185 9 Q 220 6, 250 10 T 295 8"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isAnimating ? "animate-draw-line" : ""}
                    style={{
                        strokeDasharray: "350",
                        strokeDashoffset: "350",
                    }}
                />

                {/* Pencil tip that follows the path */}
                {isAnimating && (
                    <g className="animate-pencil-move">
                        <circle cx="0" cy="0" r="2.5" fill="currentColor" opacity="0.9" />
                    </g>
                )}
            </svg>
        </span>
    );
}
