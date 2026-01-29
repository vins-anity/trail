"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
    value: string;
    title: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onToggle?: () => void;
}

export function AccordionItem({ value, title, children, isOpen, onToggle }: AccordionItemProps) {
    return (
        <div className="border border-brand-gray-light rounded-2xl bg-white overflow-hidden transition-colors hover:border-brand-dark/10">
            <button
                onClick={onToggle}
                className={cn(
                    "w-full flex items-center justify-between p-6 text-left transition-all",
                    isOpen ? "bg-brand-light" : "bg-white hover:bg-brand-light/50",
                )}
            >
                <span className="text-lg font-bold font-heading text-brand-dark">{title}</span>
                <ChevronDown
                    className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform duration-300",
                        isOpen && "transform rotate-180",
                    )}
                />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 pt-2 text-muted-foreground leading-relaxed border-t border-brand-gray-light/50 bg-brand-light/30">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function Accordion({ children }: { children: React.ReactNode }) {
    return <div className="space-y-4">{children}</div>;
}
