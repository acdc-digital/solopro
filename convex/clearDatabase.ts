import { internalMutation, action } from "./_generated/server";
import { internal } from "./_generated/api";

export const clearAllTables = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting database clear...");
    
    // Get all table names from the schema
    const tablesToClear = [
      "users",
      "feed", 
      "feedTags",
      "userSubscriptions",
      "payments",
      "forecast",
      "userAttributes",
      "dailyLogTemplates",
      "userFeedback",
      "newsletter",
      "templates",
      "forecastFeedback",
      "waitlist",
      "logs",
      "numbers",
      "randomizer",
      "openaiUsage",
      // Auth tables
      "authAccounts",
      "authSessions", 
      "authVerifiers",
      "authVerificationCodes",
      "authRefreshTokens",
      "authRateLimits"
    ];

    let totalDeleted = 0;
    
    for (const tableName of tablesToClear) {
      try {
        console.log(`Clearing table: ${tableName}`);
        
        // Get all documents in the table
        const docs = await ctx.db.query(tableName as any).collect();
        console.log(`Found ${docs.length} documents in ${tableName}`);
        
        // Delete all documents
        for (const doc of docs) {
          await ctx.db.delete(doc._id);
          totalDeleted++;
        }
        
        console.log(`Cleared ${docs.length} documents from ${tableName}`);
      } catch (error) {
        console.log(`Warning: Could not clear table ${tableName}:`, error);
        // Continue with other tables even if one fails
      }
    }
    
    console.log(`Database clear completed. Total documents deleted: ${totalDeleted}`);
    return { success: true, totalDeleted };
  },
});

export const clearDatabase = action({
  args: {},
  handler: async (ctx) => {
    return await ctx.runMutation(internal.clearDatabase.clearAllTables, {});
  },
});
