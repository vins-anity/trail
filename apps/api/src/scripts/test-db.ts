import { db, schema } from "../db";
import { eq } from "drizzle-orm";

async function testDbConnection() {
    console.log("Testing database connection...");

    try {
        // Test 1: Simple query
        console.log("\n1. Testing simple query...");
        const workspaces = await db.select().from(schema.workspaces).limit(1);
        console.log("✅ Simple query works! Found", workspaces.length, "workspaces");

        // Test 2: Test workspace members query
        console.log("\n2. Testing workspace members query...");
        const members = await db.select().from(schema.workspaceMembers).limit(1);
        console.log("✅ Workspace members query works! Found", members.length, "members");

        // Test 3: Test the join query used in getWorkspacesForUser
        console.log("\n3. Testing join query (like getWorkspacesForUser)...");
        const testUserId = "d2f7b8bb-d676-4544-ab2a-81eca748aaf9"; // From the error logs
        const result = await db
            .select({
                workspace: schema.workspaces,
            })
            .from(schema.workspaceMembers)
            .innerJoin(
                schema.workspaces,
                eq(schema.workspaces.id, schema.workspaceMembers.workspaceId),
            )
            .where(eq(schema.workspaceMembers.userId, testUserId));
        console.log("✅ Join query works! Found", result.length, "workspaces for user");

        console.log("\n✅ All database tests passed!");
    } catch (error) {
        console.error("\n❌ Database test failed:", error);
    }

    process.exit(0);
}

testDbConnection();
