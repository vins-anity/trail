/**
 * Database Seed Script
 *
 * Populates the database with sample data for development.
 *
 * Usage:
 *   bun run seed
 *
 * Make sure:
 * 1. Database is running
 * 2. Migrations have been applied: bun run db:migrate
 * 3. DATABASE_URL is set in .env
 */

import { db } from "../db";
import { posts, todos } from "../db/schema";

async function seed() {
    console.log("🌱 Seeding database...\n");

    // Clear existing data (in dev only!)
    console.log("Clearing existing data...");
    await db.delete(todos);
    await db.delete(posts);

    // Seed todos
    console.log("Creating sample todos...");
    const sampleTodos = [
        {
            title: "Set up development environment",
            description: "Install Bun, configure IDE, clone repo",
            completed: true,
        },
        {
            title: "Read Honolulu documentation",
            description: "Understand the project structure and patterns",
            completed: true,
        },
        {
            title: "Build a new feature",
            description: "Start working on your first real feature",
            completed: false,
        },
        {
            title: "Write tests",
            description: "Add unit and integration tests for your code",
            completed: false,
        },
        {
            title: "Deploy to production",
            description: "Ship it! 🚀",
            completed: false,
        },
    ];

    for (const todo of sampleTodos) {
        await db.insert(todos).values(todo);
    }

    // Seed posts
    console.log("Creating sample posts...");
    const samplePosts = [
        {
            title: "Welcome to Honolulu",
            content: "This is your first post. Delete it and start creating!",
        },
        {
            title: "Getting Started Guide",
            content: "Learn how to build your app with Bun, Hono, and React.",
        },
    ];

    for (const post of samplePosts) {
        await db.insert(posts).values(post);
    }

    console.log("\n✅ Seeding complete!");
    console.log("   - Created 5 todos");
    console.log("   - Created 2 posts");
    console.log("\nRun 'bun dev' to start developing!");

    process.exit(0);
}

seed().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
});
