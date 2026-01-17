import { hc } from "hono/client";
import type { AppType } from "../../../api";
import { supabase } from "./supabase";

// Connect to the API (proxied via Vite in dev)
// Inject Authorization header from Supabase session
const client = hc<AppType>("/", {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        const headers = new Headers(init?.headers);

        if (session?.access_token) {
            headers.set("Authorization", `Bearer ${session.access_token}`);
        }

        return fetch(input, {
            ...init,
            headers,
        });
    },
});

export const api = client;
