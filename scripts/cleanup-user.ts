#!/usr/bin/env tsx

// Simple script to clean user data from Turso database
// Usage: npx tsx scripts/cleanup-user.ts

import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { users, companies, aiInsights, chatMessages, workflowPhases, questionnaires, analysisResults, userSessions } from "../lib/db/schema";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Database connection
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
const db = drizzle(client);

async function cleanupUser(email: string) {
  try {
    console.log(`🗑️ Starting cleanup for user: ${email}`);

    // Step 1: Find the user by email
    const userRecords = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userRecords.length === 0) {
      console.log(`❌ User with email ${email} not found in database`);
      return;
    }

    const user = userRecords[0];
    const userId = user.id;
    console.log(`👤 Found user: ${user.firstName || "Unknown"} ${user.lastName || ""} (ID: ${userId})`);

    // Step 2: Get all companies for this user
    const userCompanies = await db.select().from(companies).where(eq(companies.userId, userId));
    const companyIds = userCompanies.map(c => c.id);

    console.log(`🏢 Found ${userCompanies.length} companies for user`);

    // Step 3: Count all child records before deletion for reporting
    let totalInsights = 0;
    let totalMessages = 0;
    let totalPhases = 0;
    let totalQuestionnaires = 0;
    let totalResults = 0;

    for (const companyId of companyIds) {
      const insights = await db.select().from(aiInsights).where(eq(aiInsights.companyId, companyId));
      const messages = await db.select().from(chatMessages).where(eq(chatMessages.companyId, companyId));
      const phases = await db.select().from(workflowPhases).where(eq(workflowPhases.companyId, companyId));
      const questionnairesData = await db.select().from(questionnaires).where(eq(questionnaires.companyId, companyId));
      const results = await db.select().from(analysisResults).where(eq(analysisResults.companyId, companyId));

      totalInsights += insights.length;
      totalMessages += messages.length;
      totalPhases += phases.length;
      totalQuestionnaires += questionnairesData.length;
      totalResults += results.length;
    }

    // Count user sessions
    const sessions = await db.select().from(userSessions).where(eq(userSessions.userId, userId));
    const totalSessions = sessions.length;

    console.log(`📊 Data to be deleted:`);
    console.log(`   - Companies: ${userCompanies.length}`);
    console.log(`   - AI Insights: ${totalInsights}`);
    console.log(`   - Chat Messages: ${totalMessages}`);
    console.log(`   - Workflow Phases: ${totalPhases}`);
    console.log(`   - Questionnaires: ${totalQuestionnaires}`);
    console.log(`   - Analysis Results: ${totalResults}`);
    console.log(`   - User Sessions: ${totalSessions}`);

    // Step 4: Delete child records for each company
    for (const companyId of companyIds) {
      console.log(`🧹 Cleaning data for company: ${companyId}`);

      // Delete AI Insights
      await db.delete(aiInsights).where(eq(aiInsights.companyId, companyId));

      // Delete Chat Messages
      await db.delete(chatMessages).where(eq(chatMessages.companyId, companyId));

      // Delete Workflow Phases
      await db.delete(workflowPhases).where(eq(workflowPhases.companyId, companyId));

      // Delete Questionnaires
      await db.delete(questionnaires).where(eq(questionnaires.companyId, companyId));

      // Delete Analysis Results
      await db.delete(analysisResults).where(eq(analysisResults.companyId, companyId));
    }

    // Step 5: Delete User Sessions
    await db.delete(userSessions).where(eq(userSessions.userId, userId));

    // Step 6: Delete Companies
    await db.delete(companies).where(eq(companies.userId, userId));

    // Step 7: Delete User
    await db.delete(users).where(eq(users.id, userId));

    console.log(`✅ Successfully cleaned all data for user: ${email}`);
    console.log(`🎉 User can now start fresh with a clean database!`);
  } catch (error) {
    console.error("❌ Error during user cleanup:", error);
  } finally {
    process.exit(0);
  }
}

// Run cleanup for the specified user
const userEmail = "dlineiro@thehackettgroup.com";
cleanupUser(userEmail);
