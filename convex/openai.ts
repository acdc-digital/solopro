import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Model pricing in cents per 1K tokens (as of 2024)
const PRICING = {
  "gpt-4": {
    prompt: 3.0, // $0.03 per 1K tokens
    completion: 6.0, // $0.06 per 1K tokens
  },
  "gpt-4-turbo": {
    prompt: 1.0, // $0.01 per 1K tokens
    completion: 3.0, // $0.03 per 1K tokens
  },
  "gpt-4-turbo-preview": {
    prompt: 1.0, // $0.01 per 1K tokens
    completion: 3.0, // $0.03 per 1K tokens
  },
  "gpt-3.5-turbo": {
    prompt: 0.05, // $0.0005 per 1K tokens
    completion: 0.15, // $0.0015 per 1K tokens
  },
  "gpt-3.5-turbo-16k": {
    prompt: 0.3, // $0.003 per 1K tokens
    completion: 0.4, // $0.004 per 1K tokens
  },
};

/**
 * Track OpenAI API usage and calculate costs
 */
export const trackUsage = mutation({
  args: {
    userId: v.string(), // Changed from v.id("users") to v.string() to match auth ID format
    feature: v.string(),
    model: v.string(),
    promptTokens: v.number(),
    completionTokens: v.number(),
    requestId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const pricing = PRICING[args.model as keyof typeof PRICING] || PRICING["gpt-3.5-turbo"];
    
    // Calculate cost in cents
    const promptCost = (args.promptTokens / 1000) * pricing.prompt;
    const completionCost = (args.completionTokens / 1000) * pricing.completion;
    const totalCost = Math.round((promptCost + completionCost) * 100); // Store as cents
    
    const usage = await ctx.db.insert("openaiUsage", {
      userId: args.userId,
      feature: args.feature,
      model: args.model,
      promptTokens: args.promptTokens,
      completionTokens: args.completionTokens,
      totalTokens: args.promptTokens + args.completionTokens,
      cost: totalCost,
      requestId: args.requestId,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
    
    console.log(`💰 OpenAI Usage tracked: ${args.feature} - $${(totalCost / 100).toFixed(3)} (${args.promptTokens + args.completionTokens} tokens)`);
    
    return usage;
  },
});

/**
 * Get comprehensive usage statistics for admin dashboard
 */
export const getUsageStats = query({
  args: {
    timeRange: v.optional(v.number()), // Days to look back (default 30)
  },
  handler: async (ctx, args) => {
    const timeRange = args.timeRange || 30;
    const startDate = Date.now() - (timeRange * 24 * 60 * 60 * 1000);
    
    // Get all usage records in time range
    const usage = await ctx.db
      .query("openaiUsage")
      .withIndex("by_user_and_date")
      .filter((q) => q.gte(q.field("createdAt"), startDate))
      .collect();
    
    // Calculate aggregated stats
    const totalCost = usage.reduce((sum, record) => sum + record.cost, 0) / 100; // Convert to dollars
    const totalTokens = usage.reduce((sum, record) => sum + record.totalTokens, 0);
    const totalRequests = usage.length;
    
    // Group by feature
    const byFeature = usage.reduce((acc, record) => {
      if (!acc[record.feature]) {
        acc[record.feature] = { cost: 0, tokens: 0, requests: 0 };
      }
      acc[record.feature].cost += record.cost / 100;
      acc[record.feature].tokens += record.totalTokens;
      acc[record.feature].requests += 1;
      return acc;
    }, {} as Record<string, { cost: number; tokens: number; requests: number }>);
    
    // Group by model
    const byModel = usage.reduce((acc, record) => {
      if (!acc[record.model]) {
        acc[record.model] = { cost: 0, tokens: 0, requests: 0 };
      }
      acc[record.model].cost += record.cost / 100;
      acc[record.model].tokens += record.totalTokens;
      acc[record.model].requests += 1;
      return acc;
    }, {} as Record<string, { cost: number; tokens: number; requests: number }>);
    
    // Daily breakdown for chart
    const dailyUsage = usage.reduce((acc, record) => {
      const date = new Date(record.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { cost: 0, tokens: 0, requests: 0 };
      }
      acc[date].cost += record.cost / 100;
      acc[date].tokens += record.totalTokens;
      acc[date].requests += 1;
      return acc;
    }, {} as Record<string, { cost: number; tokens: number; requests: number }>);
    
    // User breakdown (top spenders)
    const byUser = usage.reduce((acc, record) => {
      const userId = record.userId;
      if (!acc[userId]) {
        acc[userId] = { cost: 0, tokens: 0, requests: 0 };
      }
      acc[userId].cost += record.cost / 100;
      acc[userId].tokens += record.totalTokens;
      acc[userId].requests += 1;
      return acc;
    }, {} as Record<string, { cost: number; tokens: number; requests: number }>);
    
    return {
      totalCost,
      totalTokens,
      totalRequests,
      byFeature,
      byModel,
      dailyUsage,
      byUser,
      timeRange,
      averageCostPerRequest: totalRequests > 0 ? totalCost / totalRequests : 0,
    };
  },
});

/**
 * Get recent usage records with user information
 */
export const getRecentUsage = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    const usage = await ctx.db
      .query("openaiUsage")
      .order("desc")
      .take(limit);
    
    // Enrich with user information by looking up via authId
    const enrichedUsage = await Promise.all(
      usage.map(async (record) => {
        const user = await ctx.db
          .query("users")
          .withIndex("byAuthId", (q) => q.eq("authId", record.userId))
          .first();
        return {
          ...record,
          user: user ? {
            name: user.name || "Anonymous",
            email: user.email || "No email",
          } : null,
        };
      })
    );
    
    return enrichedUsage;
  },
});

/**
 * Get usage statistics for a specific user
 */
export const getUserUsageStats = query({
  args: {
    userId: v.string(), // Changed to match authId format
    timeRange: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const timeRange = args.timeRange || 30;
    const startDate = Date.now() - (timeRange * 24 * 60 * 60 * 1000);
    
    const usage = await ctx.db
      .query("openaiUsage")
      .withIndex("by_user_and_date", (q) => 
        q.eq("userId", args.userId).gte("createdAt", startDate)
      )
      .collect();
    
    const totalCost = usage.reduce((sum, record) => sum + record.cost, 0) / 100;
    const totalTokens = usage.reduce((sum, record) => sum + record.totalTokens, 0);
    const totalRequests = usage.length;
    
    // Group by feature for this user
    const byFeature = usage.reduce((acc, record) => {
      if (!acc[record.feature]) {
        acc[record.feature] = { cost: 0, tokens: 0, requests: 0 };
      }
      acc[record.feature].cost += record.cost / 100;
      acc[record.feature].tokens += record.totalTokens;
      acc[record.feature].requests += 1;
      return acc;
    }, {} as Record<string, { cost: number; tokens: number; requests: number }>);
    
    return {
      totalCost,
      totalTokens,
      totalRequests,
      byFeature,
      timeRange,
    };
  },
});

/**
 * Get cost trends over time for analytics
 */
export const getCostTrends = query({
  args: {
    timeRange: v.optional(v.number()),
    interval: v.optional(v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly"))),
  },
  handler: async (ctx, args) => {
    const timeRange = args.timeRange || 30;
    const interval = args.interval || "daily";
    const startDate = Date.now() - (timeRange * 24 * 60 * 60 * 1000);
    
    const usage = await ctx.db
      .query("openaiUsage")
      .withIndex("by_user_and_date")
      .filter((q) => q.gte(q.field("createdAt"), startDate))
      .collect();
    
    // Group by time interval
    const trends = usage.reduce((acc, record) => {
      let dateKey: string;
      const date = new Date(record.createdAt);
      
      switch (interval) {
        case "weekly":
          // Get Monday of the week
          const monday = new Date(date);
          monday.setDate(date.getDate() - date.getDay() + 1);
          dateKey = monday.toISOString().split('T')[0];
          break;
        case "monthly":
          dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default: // daily
          dateKey = date.toISOString().split('T')[0];
      }
      
      if (!acc[dateKey]) {
        acc[dateKey] = { cost: 0, tokens: 0, requests: 0 };
      }
      acc[dateKey].cost += record.cost / 100;
      acc[dateKey].tokens += record.totalTokens;
      acc[dateKey].requests += 1;
      return acc;
    }, {} as Record<string, { cost: number; tokens: number; requests: number }>);
    
    // Convert to array and sort by date
    const trendArray = Object.entries(trends)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return trendArray;
  },
});

/**
 * Get top features by cost
 */
export const getTopFeatures = query({
  args: {
    timeRange: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const timeRange = args.timeRange || 30;
    const limit = args.limit || 10;
    const startDate = Date.now() - (timeRange * 24 * 60 * 60 * 1000);
    
    const usage = await ctx.db
      .query("openaiUsage")
      .withIndex("by_user_and_date")
      .filter((q) => q.gte(q.field("createdAt"), startDate))
      .collect();
    
    // Group by feature and calculate totals
    const featureStats = usage.reduce((acc, record) => {
      if (!acc[record.feature]) {
        acc[record.feature] = { 
          feature: record.feature,
          cost: 0, 
          tokens: 0, 
          requests: 0,
          avgCostPerRequest: 0,
        };
      }
      acc[record.feature].cost += record.cost / 100;
      acc[record.feature].tokens += record.totalTokens;
      acc[record.feature].requests += 1;
      return acc;
    }, {} as Record<string, { 
      feature: string;
      cost: number; 
      tokens: number; 
      requests: number;
      avgCostPerRequest: number;
    }>);
    
    // Calculate average cost per request and sort by cost
    const sortedFeatures = Object.values(featureStats)
      .map(feature => ({
        ...feature,
        avgCostPerRequest: feature.requests > 0 ? feature.cost / feature.requests : 0,
      }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, limit);
    
    return sortedFeatures;
  },
});

/**
 * Delete old usage records (for cleanup/privacy)
 */
export const cleanupOldUsage = mutation({
  args: {
    olderThanDays: v.number(),
  },
  handler: async (ctx, args) => {
    const cutoffDate = Date.now() - (args.olderThanDays * 24 * 60 * 60 * 1000);
    
    const oldRecords = await ctx.db
      .query("openaiUsage")
      .withIndex("by_user_and_date")
      .filter((q) => q.lt(q.field("createdAt"), cutoffDate))
      .collect();
    
    let deletedCount = 0;
    for (const record of oldRecords) {
      await ctx.db.delete(record._id);
      deletedCount++;
    }
    
    console.log(`🧹 Cleaned up ${deletedCount} old OpenAI usage records`);
    return deletedCount;
  },
}); 