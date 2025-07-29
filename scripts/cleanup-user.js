#!/usr/bin/env node

// Simple script to clean user data from Turso database
// Usage: node scripts/cleanup-user.js

const { drizzle } = require('drizzle-orm/libsql');
const { createClient } = require('@libsql/client');
const { eq } = require('drizzle-orm');

// Import schema
const schema = require('../lib/db/schema');

// Database connection
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const db = drizzle(client, { schema });

async function cleanupUser(email) {
  try {
    console.log(`🗑️ Starting cleanup for user: ${email}`);

    // Step 1: Find the user by email
    const users = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    
    if (users.length === 0) {
      console.log(`❌ User with email ${email} not found in database`);
      return;
    }

    const user = users[0];
    const userId = user.id;
    console.log(`👤 Found user: ${user.firstName || 'Unknown'} ${user.lastName || ''} (ID: ${userId})`);

    // Step 2: Get all companies for this user
    const userCompanies = await db.select().from(schema.companies).where(eq(schema.companies.userId, userId));
    const companyIds = userCompanies.map(c => c.id);

    console.log(`🏢 Found ${userCompanies.length} companies for user`);

    // Step 3: Count all child records before deletion for reporting
    let totalInsights = 0;
    let totalMessages = 0;
    let totalPhases = 0;
    let totalQuestionnaires = 0;
    let totalResults = 0;

    for (const companyId of companyIds) {
      const insights = await db.select().from(schema.aiInsights).where(eq(schema.aiInsights.companyId, companyId));
      const messages = await db.select().from(schema.chatMessages).where(eq(schema.chatMessages.companyId, companyId));
      const phases = await db.select().from(schema.workflowPhases).where(eq(schema.workflowPhases.companyId, companyId));
      const questionnaires = await db.select().from(schema.questionnaires).where(eq(schema.questionnaires.companyId, companyId));
      const results = await db.select().from(schema.analysisResults).where(eq(schema.analysisResults.companyId, companyId));

      totalInsights += insights.length;
      totalMessages += messages.length;
      totalPhases += phases.length;
      totalQuestionnaires += questionnaires.length;
      totalResults += results.length;
    }

    // Count user sessions
    const sessions = await db.select().from(schema.userSessions).where(eq(schema.userSessions.userId, userId));
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
      await db.delete(schema.aiInsights).where(eq(schema.aiInsights.companyId, companyId));

      // Delete Chat Messages
      await db.delete(schema.chatMessages).where(eq(schema.chatMessages.companyId, companyId));

      // Delete Workflow Phases
      await db.delete(schema.workflowPhases).where(eq(schema.workflowPhases.companyId, companyId));

      // Delete Questionnaires
      await db.delete(schema.questionnaires).where(eq(schema.questionnaires.companyId, companyId));

      // Delete Analysis Results
      await db.delete(schema.analysisResults).where(eq(schema.analysisResults.companyId, companyId));
    }

    // Step 5: Delete User Sessions
    await db.delete(schema.userSessions).where(eq(schema.userSessions.userId, userId));

    // Step 6: Delete Companies
    await db.delete(schema.companies).where(eq(schema.companies.userId, userId));

    // Step 7: Delete User
    await db.delete(schema.users).where(eq(schema.users.id, userId));

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