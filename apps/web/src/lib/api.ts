/**
 * Trail AI API Client
 *
 * Type-safe API client for the Trail AI backend.
 */

import type {
    ProofPacket,
    CreateProofPacket,
    Policy,
    Event,
    EventList,
    EvaluateClosure,
    EvaluationResult,
} from "shared";

const API_URL = "/api"; // Proxied by Vite

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Request failed" }));
        throw new Error(error.message || error.error || "Request failed");
    }
    return res.json();
}

export const api = {
    // ============================================
    // Events API
    // ============================================
    events: {
        list: async (params?: {
            workspaceId?: string;
            taskId?: string;
            page?: number;
            pageSize?: number;
        }): Promise<EventList> => {
            const searchParams = new URLSearchParams();
            if (params?.workspaceId) searchParams.set("workspaceId", params.workspaceId);
            if (params?.taskId) searchParams.set("taskId", params.taskId);
            if (params?.page) searchParams.set("page", String(params.page));
            if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));

            const res = await fetch(`${API_URL}/events?${searchParams}`);
            return handleResponse<EventList>(res);
        },

        get: async (id: string): Promise<Event> => {
            const res = await fetch(`${API_URL}/events/${id}`);
            return handleResponse<Event>(res);
        },

        getByTask: async (
            taskId: string
        ): Promise<{ taskId: string; events: Event[]; summary: Record<string, unknown> }> => {
            const res = await fetch(`${API_URL}/events/task/${taskId}`);
            return handleResponse(res);
        },

        verifyChain: async (
            workspaceId: string
        ): Promise<{ valid: boolean; verifiedCount: number; errors: unknown[] }> => {
            const res = await fetch(`${API_URL}/events/verify/${workspaceId}`);
            return handleResponse(res);
        },
    },

    // ============================================
    // Proofs API
    // ============================================
    proofs: {
        list: async (params?: {
            workspaceId?: string;
            status?: string;
            page?: number;
        }): Promise<{ packets: ProofPacket[]; total: number }> => {
            const searchParams = new URLSearchParams();
            if (params?.workspaceId) searchParams.set("workspaceId", params.workspaceId);
            if (params?.status) searchParams.set("status", params.status);
            if (params?.page) searchParams.set("page", String(params.page));

            const res = await fetch(`${API_URL}/proofs?${searchParams}`);
            return handleResponse(res);
        },

        get: async (id: string): Promise<ProofPacket> => {
            const res = await fetch(`${API_URL}/proofs/${id}`);
            return handleResponse<ProofPacket>(res);
        },

        create: async (data: CreateProofPacket): Promise<ProofPacket> => {
            const res = await fetch(`${API_URL}/proofs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            return handleResponse<ProofPacket>(res);
        },

        summarize: async (
            id: string,
            options?: { includeCommits?: boolean; tone?: string }
        ): Promise<{ success: boolean; summary: string; model: string }> => {
            const res = await fetch(`${API_URL}/proofs/${id}/summarize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(options || {}),
            });
            return handleResponse(res);
        },

        exportPdf: async (
            id: string
        ): Promise<{ success: boolean; url: string; expiresAt: string }> => {
            const res = await fetch(`${API_URL}/proofs/${id}/pdf`);
            return handleResponse(res);
        },

        share: async (
            id: string
        ): Promise<{ success: boolean; shareUrl: string; expiresAt: string }> => {
            const res = await fetch(`${API_URL}/proofs/${id}/share`, { method: "POST" });
            return handleResponse(res);
        },
    },

    // ============================================
    // Policies API
    // ============================================
    policies: {
        list: async (workspaceId?: string): Promise<{ policies: Policy[] }> => {
            const url = workspaceId
                ? `${API_URL}/policies?workspaceId=${workspaceId}`
                : `${API_URL}/policies`;
            const res = await fetch(url);
            return handleResponse(res);
        },

        get: async (id: string): Promise<Policy> => {
            const res = await fetch(`${API_URL}/policies/${id}`);
            return handleResponse<Policy>(res);
        },

        getPresets: async (): Promise<{ presets: Record<string, unknown> }> => {
            const res = await fetch(`${API_URL}/policies/presets`);
            return handleResponse(res);
        },

        evaluate: async (data: EvaluateClosure): Promise<EvaluationResult> => {
            const res = await fetch(`${API_URL}/policies/evaluate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            return handleResponse<EvaluationResult>(res);
        },
    },

    // ============================================
    // Health Check
    // ============================================
    health: async (): Promise<{ status: string }> => {
        const res = await fetch(`${API_URL}/health`);
        return handleResponse(res);
    },
};
