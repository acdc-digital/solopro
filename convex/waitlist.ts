// CONVEX WAITLIST
// /Users/matthewsimon/Documents/Github/solopro/convex/waitlist.ts

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Join the waitlist for a specific feature
 */
export const joinWaitlist = mutation({
  args: {
    feature: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be signed in to join the waitlist");
    }

    // Get user details
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is already on the waitlist for this feature
    const existingEntry = await ctx.db
      .query("waitlist")
      .withIndex("byUserIdAndFeature", (q) => 
        q.eq("userId", userId).eq("feature", args.feature)
      )
      .first();

    if (existingEntry) {
      throw new Error("You're already on the waitlist for this feature!");
    }

    // Add user to waitlist
    const waitlistId = await ctx.db.insert("waitlist", {
      userId,
      userName: user.name,
      userEmail: user.email,
      feature: args.feature,
      createdAt: Date.now(),
      notified: false,
    });

    return {
      success: true,
      message: `Successfully joined the ${args.feature} waitlist!`,
      waitlistId,
    };
  },
});

/**
 * Check if current user is on waitlist for a specific feature
 */
export const isOnWaitlist = query({
  args: {
    feature: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const entry = await ctx.db
      .query("waitlist")
      .withIndex("byUserIdAndFeature", (q) => 
        q.eq("userId", userId).eq("feature", args.feature)
      )
      .first();

    return !!entry;
  },
});

/**
 * Get waitlist stats for a specific feature
 */
export const getWaitlistStats = query({
  args: {
    feature: v.string(),
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("waitlist")
      .withIndex("byFeature", (q) => q.eq("feature", args.feature))
      .collect();

    return {
      totalCount: entries.length,
      recentSignups: entries.filter(entry => 
        Date.now() - entry.createdAt < 7 * 24 * 60 * 60 * 1000 // Last 7 days
      ).length,
    };
  },
});

/**
 * Remove user from waitlist (in case they want to leave)
 */
export const leaveWaitlist = mutation({
  args: {
    feature: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be signed in to leave the waitlist");
    }

    const entry = await ctx.db
      .query("waitlist")
      .withIndex("byUserIdAndFeature", (q) => 
        q.eq("userId", userId).eq("feature", args.feature)
      )
      .first();

    if (!entry) {
      throw new Error("You're not on the waitlist for this feature");
    }

    await ctx.db.delete(entry._id);

    return {
      success: true,
      message: `Successfully left the ${args.feature} waitlist`,
    };
  },
});

/**
 * Get all waitlist entries for admin purposes
 */
export const getAllWaitlistEntries = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    return await ctx.db.query("waitlist").collect();
  },
});

