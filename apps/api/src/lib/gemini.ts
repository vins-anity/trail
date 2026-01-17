/**
 * Gemini AI Service
 *
 * AI-powered summarization for Proof Packets.
 * Transforms technical commit logs into client-friendly narratives.
 *
 * @see Section 5.4.5 in thesis: "Gemini AI Integration"
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// ============================================
// Configuration
// ============================================

const GEMINI_MODEL = "gemini-1.5-flash";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not configured");
        }
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
}

// ============================================
// Types
// ============================================

export interface ProofSummaryInput {
    taskKey: string;
    taskSummary: string;
    commits?: { message: string; author: string }[];
    prDescription?: string;
    approvers?: string[];
    ciStatus?: "passed" | "failed";
}

export interface SummaryOptions {
    tone?: "professional" | "casual" | "technical";
    includeCommits?: boolean;
    includePrDescription?: boolean;
}

// ============================================
// Service Functions
// ============================================

/**
 * Generate a client-friendly summary for a Proof Packet
 */
export async function generateProofSummary(
    input: ProofSummaryInput,
    options: SummaryOptions = {},
): Promise<{ summary: string; model: string }> {
    const { tone = "professional", includeCommits = true, includePrDescription = true } = options;

    const ai = getGenAI();
    const model = ai.getGenerativeModel({ model: GEMINI_MODEL });

    // Build commit section
    let commitsSection = "";
    if (includeCommits && input.commits && input.commits.length > 0) {
        const commitMessages = input.commits.slice(0, 10).map((c) => `- ${c.message}`);
        commitsSection = `\n\nCommit History:\n${commitMessages.join("\n")}`;
    }

    // Build PR section
    let prSection = "";
    if (includePrDescription && input.prDescription) {
        prSection = `\n\nPull Request Description:\n${input.prDescription.slice(0, 500)}`;
    }

    // Build approvers section
    let approversSection = "";
    if (input.approvers && input.approvers.length > 0) {
        approversSection = `\n\nApproved by: ${input.approvers.join(", ")}`;
    }

    // Build CI section
    let ciSection = "";
    if (input.ciStatus) {
        ciSection = `\nCI Status: ${input.ciStatus === "passed" ? "All tests passed ✓" : "Tests failed"}`;
    }

    const toneInstructions = {
        professional:
            "Write in a professional, concise tone suitable for client billing reports and executive summaries.",
        casual: "Write in a friendly, conversational tone while remaining informative.",
        technical: "Include technical details while remaining accessible to stakeholders.",
    };

    const prompt = `You are a professional software delivery reporter helping agencies communicate with their clients.

Task: ${input.taskKey} - ${input.taskSummary}
${commitsSection}${prSection}${approversSection}${ciSection}

${toneInstructions[tone]}

Generate a 2-3 sentence summary of what was delivered. Focus on:
- What value was delivered to the client
- Key changes or improvements made
- Confirmation of quality (approvals, testing)

Do NOT include:
- Technical jargon without context
- Specific code details
- Internal process information

Summary:`;

    try {
        const result = await model.generateContent(prompt);
        const summary = result.response.text().trim();

        return {
            summary,
            model: GEMINI_MODEL,
        };
    } catch (error) {
        // Fallback summary if AI fails
        const fallbackSummary = `${input.taskKey}: ${input.taskSummary}. This task has been reviewed and approved for delivery.`;
        return {
            summary: fallbackSummary,
            model: "fallback",
        };
    }
}

/**
 * Check if Gemini AI is configured
 */
export function isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY);
}
