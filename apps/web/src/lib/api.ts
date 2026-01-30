/**
 * ShipDocket API Client
 *
 * Type-safe API client for the ShipDocket backend.
 * Handles Auth Headers & Error redirection automatically.
 */

import type {
    CreateProofPacket,
    EvaluateClosure,
    EvaluationResult,
    Event,
    EventList,
    Policy,
    ProofPacket,
} from "shared";
import { supabase } from "@/lib/supabase";

// Sanitize API_URL to remove trailing slash if present
const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = RAW_API_URL.replace(/\/$/, "");

/**
 * Enhanced Fetch Wrapper
 * - Injects 'Authorization: Bearer <token>'
 * - Handles 401 Unauthorized -> Redirects to Login
 * - Parses JSON responses automatically
 */
async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // 1. Get Session Token
    const {
        data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    // 2. Prepare Headers
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    // 3. Execute Request
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // 4. Handle Errors
    if (!response.ok) {
        // Handle 401 (Unauthenticated) -> Redirect
        if (response.status === 401) {
            console.warn("Unauthorized access. Clearing session and redirecting...");

            // 🛑 STOP THE LOOP: Clear the session so /login doesn't bounce us back
            await supabase.auth.signOut();

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
            throw new Error("Unauthorized");
        }

        const error = await response.json().catch(() => ({ message: "Request failed" }));
        throw new Error(error.message || error.error || `Request failed: ${response.status}`);
    }

    // 5. Parse Success
    return response.json();
}

export const api = {
    // ============================================
    // Generic
    // ============================================
    get: <T>(endpoint: string) => fetchWithAuth<T>(endpoint),
    post: <T>(endpoint: string, body?: unknown) =>
        fetchWithAuth<T>(endpoint, {
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        }),

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

            return fetchWithAuth<EventList>(`/events?${searchParams}`);
        },

        get: (id: string) => fetchWithAuth<Event>(`/events/${id}`),

        getByTask: (taskId: string) =>
            fetchWithAuth<{ taskId: string; events: Event[]; summary: Record<string, unknown> }>(
                `/events/task/${taskId}`,
            ),

        verifyChain: (workspaceId: string) =>
            fetchWithAuth<{ valid: boolean; verifiedCount: number; errors: unknown[] }>(
                `/events/verify/${workspaceId}`,
            ),

        stats: (workspaceId: string) =>
            fetchWithAuth<{
                activeTasks: number;
                pendingProofs: number;
                completedProofs: number;
                vetoed: number;
            }>(`/events/stats?workspaceId=${workspaceId}`),
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

            return fetchWithAuth(`/proofs?${searchParams}`);
        },

        get: (id: string) => fetchWithAuth<ProofPacket>(`/proofs/${id}`),

        create: (data: CreateProofPacket) =>
            fetchWithAuth<ProofPacket>("/proofs", {
                method: "POST",
                body: JSON.stringify(data),
            }),

        summarize: (id: string, options?: { includeCommits?: boolean; tone?: string }) =>
            fetchWithAuth<{ success: boolean; summary: string; model: string }>(
                `/proofs/${id}/summarize`,
                {
                    method: "POST",
                    body: JSON.stringify(options || {}),
                },
            ),

        exportPdf: (id: string) =>
            fetchWithAuth<{ success: boolean; url: string; expiresAt: string }>(
                `/proofs/${id}/pdf`,
            ),

        share: (id: string) =>
            fetchWithAuth<{ success: boolean; shareUrl: string; expiresAt: string }>(
                `/proofs/${id}/share`,
                { method: "POST" },
            ),
    },

    // ============================================
    // Policies API
    // ============================================
    policies: {
        list: (workspaceId?: string) => {
            const endpoint = workspaceId ? `/policies?workspaceId=${workspaceId}` : "/policies";
            return fetchWithAuth<{ policies: Policy[] }>(endpoint);
        },

        get: (id: string) => fetchWithAuth<Policy>(`/policies/${id}`),

        getPresets: () => fetchWithAuth<{ presets: Record<string, unknown> }>("/policies/presets"),

        evaluate: (data: EvaluateClosure) =>
            fetchWithAuth<EvaluationResult>("/policies/evaluate", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    },

    // ============================================
    // Workspaces API (Missing Before?)
    // ============================================
    workspaces: {
        current: () => fetchWithAuth<{ id: string; name: string }>("/workspaces/current"),
        create: (name: string) =>
            fetchWithAuth<{ id: string; name: string }>("/workspaces", {
                method: "POST",
                body: JSON.stringify({ name }),
            }),

        update: (id: string, data: Record<string, unknown>) =>
            fetchWithAuth<{ id: string }>(`/workspaces/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
    },

    // ============================================
    // Health Check
    // ============================================
    health: () => fetchWithAuth<{ status: string }>("/health"),
};
