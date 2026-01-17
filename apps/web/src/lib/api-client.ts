import { hc } from "hono/client";
import type { AppType } from "../../../api";

// Connect to the API (proxied via Vite in dev)
const client = hc<AppType>("/");

export const api = client;
