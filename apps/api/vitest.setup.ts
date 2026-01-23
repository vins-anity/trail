import type { Context, Next } from "hono";
import { beforeEach, vi } from "vitest";

// Mock globals
global.fetch = vi.fn() as any;

// Set dummy env vars
process.env.SUPABASE_URL = "https://mock.supabase.co";
process.env.SUPABASE_ANON_KEY = "mock-key";
process.env.DATABASE_URL = "postgresql://mock:mock@localhost:5432/mock";
process.env.ENCRYPTION_KEY = "0000000000000000000000000000000000000000000000000000000000000000";

// Shared state
const { mockDbState } = vi.hoisted(() => ({
    mockDbState: {} as Record<string, any[]>,
}));

// Reset state
beforeEach(() => {
    for (const key in mockDbState) delete mockDbState[key];
});

// Mock Database
vi.mock("./src/db", async (importActual) => {
    const actual = await importActual<typeof import("./src/db")>();
    const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);

    const getTableName = (table: any): string => {
        if (!table) return "generic";
        if (typeof table === 'string') return toSnakeCase(table);
        const name = table[Symbol.for('drizzle:Name')] || table.config?.name || table.name || (table._ && table._.name);
        return name && typeof name === 'string' ? toSnakeCase(name) : "generic";
    };

    // Exhaustive structural search
    const findValues = (obj: any, values: Set<string | number> = new Set(), depth = 0): Set<string | number> => {
        if (!obj || depth > 10) return values;

        if (typeof obj === 'string' || typeof obj === 'number') {
            const s = String(obj);
            if (s.length > 3 && !s.includes(' ') && !s.includes('{')) values.add(obj);
            return values;
        }

        if (typeof obj !== 'object' || Array.isArray(obj)) {
            if (Array.isArray(obj)) for (const item of obj) findValues(item, values, depth + 1);
            return values;
        }

        for (const k in obj) {
            // Skip huge metadata/circular keys
            if (k === 'table' || k === 'column' || k === '_') continue;
            const v = (obj as any)[k];
            if (v !== undefined && v !== null) {
                if (typeof v === 'string' || typeof v === 'number') {
                    const s = String(v);
                    if (s.length > 3 && !s.includes(' ') && !s.includes('{')) values.add(v);
                } else if (typeof v === 'object') {
                    findValues(v, values, depth + 1);
                }
            }
        }
        return values;
    };

    const withDefaults = (item: any) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return item;
        return { id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date(), isActive: true, isDefault: false, ...item };
    };

    const createMockChain = (tableName?: string, queryData?: any, isAggregation = false) => {
        const chain: any = {
            select: vi.fn((f) => createMockChain(tableName, queryData, f && typeof f === "object" && "count" in f)),
            selectDistinct: vi.fn(() => chain),
            insert: vi.fn((t) => createMockChain(getTableName(t))),
            update: vi.fn((t) => createMockChain(getTableName(t))),
            delete: vi.fn((t) => createMockChain(getTableName(t))),
            from: vi.fn((t) => {
                const name = getTableName(t);
                return createMockChain(name, mockDbState[name] || []);
            }),
            values: vi.fn((vals) => {
                const results = (Array.isArray(vals) ? vals : [vals]).map(withDefaults);
                if (tableName && tableName !== "generic") {
                    mockDbState[tableName] = [...(mockDbState[tableName] || []), ...results];
                }
                return createMockChain(tableName, results);
            }),
            returning: vi.fn(() => chain),
            set: vi.fn((vals) => createMockChain(tableName, (Array.isArray(vals) ? vals : [vals]).map(withDefaults))),
            where: vi.fn((condition) => {
                if (!queryData || !Array.isArray(queryData)) return chain;
                if (!condition) return chain;

                const vals = Array.from(findValues(condition));
                if (vals.length > 0) {
                    const filtered = queryData.filter(item => {
                        const itemValues = Object.values(item).map(v => String(v).toLowerCase());
                        return vals.some(v => itemValues.includes(String(v).toLowerCase()));
                    });
                    return createMockChain(tableName, filtered);
                }
                // Strict: if parsing failed but condition exists, return nothing to avoid leak
                return createMockChain(tableName, []);
            }),
            limit: vi.fn((n) => createMockChain(tableName, Array.isArray(queryData) ? queryData.slice(0, n) : queryData)),
            offset: vi.fn(() => chain),
            orderBy: vi.fn(() => chain),
            innerJoin: vi.fn(() => chain),
            leftJoin: vi.fn(() => chain),
            execute: vi.fn().mockImplementation(() => {
                const res = isAggregation ? [{ count: queryData?.length || 0 }] : (queryData || []);
                return Promise.resolve(res);
            }),
            then: (cb: any) => chain.execute().then(cb),
        };
        return chain;
    };

    const mockDb = createMockChain();

    mockDb.query = new Proxy({}, {
        get: (_, tableKey) => {
            const name = toSnakeCase(String(tableKey));
            return {
                findFirst: vi.fn().mockImplementation(async (opts) => {
                    const data = mockDbState[name] || [];
                    if (!opts?.where) return data[0] || null;
                    const vals = Array.from(findValues(opts.where));
                    const result = vals.length > 0 ? data.find(item => {
                        const itemValues = Object.values(item).map(v => String(v).toLowerCase());
                        return vals.some(v => itemValues.includes(String(v).toLowerCase()));
                    }) : data[0];

                    if (!result && (name === 'workspace_members' || name === 'workspaces' || name === 'users')) {
                        const payload: any = { role: "owner", email: "test@example.com" };
                        if (vals[0]) payload.id = String(vals[0]);
                        return withDefaults(payload);
                    }
                    return result ? withDefaults(result) : null;
                }),
                findMany: vi.fn().mockImplementation(async (opts) => {
                    const data = mockDbState[name] || [];
                    if (!opts?.where) return data.map(withDefaults);
                    const vals = Array.from(findValues(opts.where));
                    const filtered = vals.length > 0 ? data.filter(item => {
                        const itemValues = Object.values(item).map(v => String(v).toLowerCase());
                        return vals.some(v => itemValues.includes(String(v).toLowerCase()));
                    }) : data;
                    return filtered.map(withDefaults);
                })
            };
        }
    });

    mockDb.transaction = vi.fn(async (cb) => await cb(createMockChain()));
    return { ...actual, db: mockDb, pgClient: { options: {}, close: vi.fn(), end: vi.fn() } };
});

// Mock Supabase Auth
vi.mock("./src/middleware/supabase-auth", () => ({
    supabaseAuth: async (c: Context, next: Next) => {
        c.set("user", { id: "00000000-0000-0000-0000-000000000000", email: "test@example.com" });
        c.set("userId", "00000000-0000-0000-0000-000000000000");
        await next();
    },
    optionalAuth: async (c: Context, next: Next) => {
        c.set("user", { id: "00000000-0000-0000-0000-000000000000", email: "test@example.com" });
        c.set("userId", "00000000-0000-0000-0000-000000000000");
        await next();
    },
}));
