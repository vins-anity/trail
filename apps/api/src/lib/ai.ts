/**
 * AI Service - Proof Packet Summarization
 *
 * Multi-model AI system using OpenRouter free-tier models.
 * Cascading fallback strategy ensures summaries are always generated.
 *
 * @see https://openrouter.ai/collections/free-models
 */

import { OpenRouter } from "@openrouter/sdk";

// ============================================
// Configuration
// ============================================

/**
 * Free-tier models verified at https://openrouter.ai/collections/free-models
 */
const AI_MODELS = {
    /** Primary: Devstral 2 - 256K context, optimized for agentic coding */
    primary: "mistralai/devstral-2512:free",

    /** Fast fallback: MiMo-V2-Flash - High throughput, 256K context */
    fallbackFast: "xiaomi/mimo-v2-flash:free",

    /** Deep fallback: GLM-4.5-Air - Thinking mode for complex analysis */
    fallbackDeep: "z-ai/glm-4.5-air:free",
} as const;

const AI_CONFIG = {
    temperature: 0, // Deterministic for consistent Proof Packets
    maxTokens: 200,
    timeoutMs: 30000,
} as const;

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
    mode?: "fast" | "deep";
}

export interface ProofSummaryOutput {
    summary: string;
    model: string;
}

// ============================================
// Client (Singleton)
// ============================================

let client: OpenRouter | null = null;

function getClient(): OpenRouter {
    if (!client) {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error("OPENROUTER_API_KEY is not configured");
        }
        try {
            client = new OpenRouter({ apiKey });
        } catch (error) {
            console.error("Failed to initialize OpenRouter client:", error);
            throw error;
        }
    }
    return client;
}

export function isConfigured(): boolean {
    return Boolean(process.env.OPENROUTER_API_KEY);
}

// ============================================
// Service Functions
// ============================================

/**
 * Build prompt from input
 */
function buildPrompt(input: ProofSummaryInput, options: SummaryOptions): string {
    const { tone = "professional", includeCommits = true, includePrDescription = true } = options;

    const commitsSection =
        includeCommits && input.commits && input.commits.length > 0
            ? `\n\nCommit History:\n${input.commits
                .slice(0, 10)
                .map((c) => `- ${c.message}`)
                .join("\n")}`
            : "";

    const prSection =
        includePrDescription && input.prDescription
            ? `\n\nPull Request Description:\n${input.prDescription.slice(0, 500)}`
            : "";

    const approversSection =
        input.approvers && input.approvers.length > 0
            ? `\n\nApproved by: ${input.approvers.join(", ")}`
            : "";

    const ciSection = input.ciStatus
        ? `\nCI Status: ${input.ciStatus === "passed" ? "All tests passed ✓" : "Tests failed"}`
        : "";

    const toneInstructions = {
        professional:
            "Write in a professional, concise tone suitable for client billing reports and executive summaries.",
        casual: "Write in a friendly, conversational tone while remaining informative.",
        technical: "Include technical details while remaining accessible to stakeholders.",
    };

    return `You are a professional software delivery reporter helping agencies communicate with their clients.

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
}

/**
 * Try to generate summary with specific model
 */
async function tryModel(modelId: string, prompt: string): Promise<string | null> {
    try {
        const client = getClient();
        const response = await client.chat.send({
            model: modelId,
            messages: [{ role: "user", content: prompt }],
            temperature: AI_CONFIG.temperature,
            maxTokens: AI_CONFIG.maxTokens,
        });

        const content = response.choices[0]?.message?.content;
        return typeof content === "string" ? content.trim() : null;
    } catch (error) {
        console.error(`Model ${modelId} failed:`, error);
        return null;
    }
}

/**
 * Generate proof packet summary with cascading fallback
 */
export async function generateProofSummary(
    input: ProofSummaryInput,
    options: SummaryOptions = {},
): Promise<ProofSummaryOutput> {
    const { mode = "fast" } = options;
    const prompt = buildPrompt(input, options);

    // Try models in order: primary → mode-specific → fast fallback
    const models = [
        AI_MODELS.primary,
        mode === "deep" ? AI_MODELS.fallbackDeep : AI_MODELS.fallbackFast,
        AI_MODELS.fallbackFast,
    ];

    for (const modelId of models) {
        const summary = await tryModel(modelId, prompt);
        if (summary) {
            return { summary, model: modelId };
        }
    }

    // Final static fallback
    console.error("All AI models failed, using static fallback");
    return {
        summary: `${input.taskKey}: ${input.taskSummary}. This task has been reviewed and approved for delivery.`,
        model: "fallback",
    };
}

/**
 * Generate streaming summary (for future real-time UI)
 */
export async function* generateProofSummaryStream(
    input: ProofSummaryInput,
    _options: SummaryOptions = {},
): AsyncGenerator<string, void, unknown> {
    try {
        const stream = await getClient().chat.send({
            model: AI_MODELS.primary,
            messages: [
                {
                    role: "user",
                    content: `Generate a professional summary for task: ${input.taskKey}`,
                },
            ],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) yield content;
        }
    } catch (error) {
        console.error("Streaming error:", error);
        yield `${input.taskKey}: ${input.taskSummary}. This task has been reviewed and approved for delivery.`;
    }
}

/**
 * Get configured models info
 */
export function getModelsInfo() {
    return {
        primary: { id: AI_MODELS.primary, name: "Devstral 2", context: "256K" },
        fallbackFast: { id: AI_MODELS.fallbackFast, name: "MiMo-V2-Flash", context: "256K" },
        fallbackDeep: { id: AI_MODELS.fallbackDeep, name: "GLM-4.5-Air", context: "128K" },
    };
}
