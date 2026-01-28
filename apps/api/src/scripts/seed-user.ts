import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";

/**
 * Seed Script: Create Demo User & Workspace
 *
 * Creates a default user and ensures they have a workspace.
 * User: demo@trail.ai
 * Pass: password123
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function seedUser() {
    console.log("🌱 Seeding Demo User...");

    const email = process.env.SEED_EMAIL || "demo@trail.ai";
    const password = process.env.SEED_PASSWORD || "password123";

    if (!process.env.SEED_EMAIL || !process.env.SEED_PASSWORD) {
        console.warn(
            "⚠️  Using default demo credentials. Set SEED_EMAIL and SEED_PASSWORD in .env to override.",
        );
    }

    // Check if user exists
    const {
        data: { users },
        error: listError,
    } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error("❌ Failed to list users:", listError.message);
        process.exit(1);
    }

    let userId: string;
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
        console.log(`ℹ️  User ${email} already exists. Updating password...`);
        const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
            password: password,
            email_confirm: true,
            user_metadata: { full_name: "Demo User" },
        });

        if (updateError) {
            console.error("❌ Failed to update user:", updateError.message);
            process.exit(1);
        }
        userId = existingUser.id;
        console.log("✅ User updated successfully!");
    } else {
        const { data, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: "Demo User",
            },
        });

        if (createError) {
            console.error("❌ Failed to create user:", createError.message);
            process.exit(1);
        }
        if (!data.user) {
            console.error("❌ Failed to create user: No user data returned");
            process.exit(1);
        }
        userId = data.user.id;
        console.log("✅ User created successfully!");
    }

    console.log(`   Email: ${email}`);
    console.log(`   Pass : ${password}`);

    // ============================================
    // Seed Workspace
    // ============================================
    console.log("\n🌱 Checking Workspace...");

    const [existingMember] = await db
        .select()
        .from(schema.workspaceMembers)
        .where(eq(schema.workspaceMembers.userId, userId))
        .limit(1);

    if (existingMember) {
        console.log(`ℹ️  User already has a workspace (ID: ${existingMember.workspaceId})`);
    } else {
        console.log("🌱 Creating Demo Workspace...");
        const [workspace] = await db
            .insert(schema.workspaces)
            .values({
                name: "Demo Workspace",
                defaultPolicyTier: "standard",
            })
            .returning();

        if (!workspace) {
            console.error("❌ Failed to create workspace");
            process.exit(1);
        }

        await db.insert(schema.workspaceMembers).values({
            workspaceId: workspace.id,
            userId: userId,
            role: "owner",
        });

        console.log(`✅ Demo Workspace created! (ID: ${workspace.id})`);
    }

    // ============================================
    // Seed Sample Proof Packet
    // ============================================
    console.log("\n🌱 Checking Proof Packets...");

    // Get workspace ID again safely
    const [member] = await db
        .select()
        .from(schema.workspaceMembers)
        .where(eq(schema.workspaceMembers.userId, userId))
        .limit(1);

    const workspaceId = member.workspaceId;

    const [existingPacket] = await db
        .select()
        .from(schema.proofPackets)
        .where(eq(schema.proofPackets.workspaceId, workspaceId))
        .limit(1);

    if (existingPacket) {
        console.log(`ℹ️  Proof Packets already exist. (ID: ${existingPacket.id})`);
    } else {
        console.log("🌱 Creating Sample Proof Packet...");

        // 1. Create a "Handshake" Event
        const [handshakeEvent] = await db
            .insert(schema.events)
            .values({
                workspaceId: workspaceId,
                eventType: "handshake",
                eventHash: "hash_handshake_" + Date.now(),
                payload: { description: "Task Handshake Initiated" },
                taskId: "PROJ-123",
            })
            .returning();

        if (!handshakeEvent) throw new Error("Failed to create handshake event");

        // 2. Create the Proof Packet
        const [packet] = await db
            .insert(schema.proofPackets)
            .values({
                workspaceId: workspaceId,
                taskId: "PROJ-123",
                status: "pending", // or "pending"
                handshakeEventId: handshakeEvent.id,
            })
            .returning();

        if (!packet) throw new Error("Failed to create proof packet");

        console.log(`✅ Sample Proof Packet created! (ID: ${packet.id})`);
    }

    console.log("\n✨ Seeding & Verification complete!");
    process.exit(0);
}

seedUser();
