import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Create or update a user subscription
 */
export const createOrUpdate = internalMutation({
  args: {
    userId: v.string(),
    subscriptionId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { userId, subscriptionId, status, currentPeriodEnd } = args;
    
    // Check if a subscription record already exists
    const existing = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId as Id<"users">))
      .first();
    
    const now = Date.now();
    
    if (existing) {
      // Update existing subscription
      await ctx.db.patch(existing._id, {
        subscriptionId,
        status,
        currentPeriodEnd,
        updatedAt: now
      });
      return existing._id;
    } else {
      // Create new subscription record
      return await ctx.db.insert("userSubscriptions", {
        userId: userId as Id<"users">,
        subscriptionId,
        status,
        currentPeriodEnd,
        createdAt: now,
        updatedAt: now
      });
    }
  }
});

/**
 * Create or update a subscription from Stripe webhook data
 * Handles user lookup by ID or email
 */
export const createOrUpdateFromStripe = internalMutation({
  args: {
    userIdOrEmail: v.string(),
    subscriptionId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.optional(v.number()),
    customerEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let userId: Id<"users"> | null = null;
    
    // First try to use the userIdOrEmail as a direct user ID
    try {
      const user = await ctx.db.get(args.userIdOrEmail as Id<"users">);
      if (user) {
        userId = user._id;
      }
    } catch (e) {
      // Not a valid ID, try email lookup
    }
    
    // If not found by ID, try to find by email
    if (!userId && args.customerEmail) {
      const userByEmail = await ctx.db
        .query("users")
        .filter(q => q.eq(q.field("email"), args.customerEmail))
        .first();
      
      if (userByEmail) {
        userId = userByEmail._id;
      }
    }
    
    // If still not found, try the userIdOrEmail as email
    if (!userId) {
      const userByEmail = await ctx.db
        .query("users")
        .filter(q => q.eq(q.field("email"), args.userIdOrEmail))
        .first();
      
      if (userByEmail) {
        userId = userByEmail._id;
      }
    }
    
    if (!userId) {
      throw new Error(`User not found for identifier: ${args.userIdOrEmail}`);
    }
    
    // Check if a subscription record already exists for this user
    const existing = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    
    const now = Date.now();
    
    if (existing) {
      // Update existing subscription
      await ctx.db.patch(existing._id, {
        subscriptionId: args.subscriptionId,
        status: args.status,
        currentPeriodEnd: args.currentPeriodEnd,
        updatedAt: now
      });
      return existing._id;
    } else {
      // Create new subscription record
      return await ctx.db.insert("userSubscriptions", {
        userId,
        subscriptionId: args.subscriptionId,
        status: args.status,
        currentPeriodEnd: args.currentPeriodEnd,
        createdAt: now,
        updatedAt: now
      });
    }
  }
});

/**
 * Cancel a subscription by Stripe subscription ID
 */
export const cancelByStripeId = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Find the subscription by Stripe ID
    const subscription = await ctx.db
      .query("userSubscriptions")
      .filter(q => q.eq(q.field("subscriptionId"), args.stripeSubscriptionId))
      .first();
    
    if (!subscription) {
      throw new Error(`Subscription not found for Stripe ID: ${args.stripeSubscriptionId}`);
    }
    
    // Update the subscription to cancelled status
    await ctx.db.patch(subscription._id, {
      status: "canceled",
      currentPeriodEnd: args.currentPeriodEnd,
      updatedAt: Date.now()
    });
    
    return subscription._id;
  }
});

/**
 * Update subscription from Stripe webhook
 */
export const updateSubscription = internalMutation({
  args: {
    userId: v.string(),
    subscriptionId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.number(),
    metadata: v.object({
      plan: v.optional(v.string()),
      interval: v.optional(v.string()),
      canceledAt: v.optional(v.number())
    })
  },
  handler: async (ctx, args) => {
    const { userId, subscriptionId, status, currentPeriodEnd, metadata } = args;
    
    // Check if a subscription record already exists
    const existing = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId as Id<"users">))
      .first();
    
    const now = Date.now();
    
    if (existing) {
      // Update existing subscription
      await ctx.db.patch(existing._id, {
        subscriptionId,
        status,
        currentPeriodEnd,
        updatedAt: now
      });
      return existing._id;
    } else {
      // Create new subscription record
      return await ctx.db.insert("userSubscriptions", {
        userId: userId as Id<"users">,
        subscriptionId,
        status,
        currentPeriodEnd,
        createdAt: now,
        updatedAt: now
      });
    }
  }
});

/**
 * Get a user ID by subscription ID
 */
export const getUserIdBySubscriptionId = internalQuery({
  args: { subscriptionId: v.string() },
  handler: async (ctx, { subscriptionId }) => {
    const subscription = await ctx.db
      .query("userSubscriptions")
      .filter((q) => q.eq(q.field("subscriptionId"), subscriptionId))
      .first();
    
    return subscription?.userId;
  }
});

/**
 * Check if current user has an active subscription
 */
export const hasActiveSubscription = query({
  args: {},
  handler: async (ctx) => {
    // Use getAuthUserId to get the correct user ID format
    const userId = await getAuthUserId(ctx);

    console.log("hasActiveSubscription - userId from getAuthUserId:", userId);

    if (!userId) {
      console.log("hasActiveSubscription - No userId, returning false");
      return false;
    }

    const subscription = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId as Id<"users">))
      .first();

    console.log("hasActiveSubscription - subscription found:", subscription);

    if (!subscription) {
      console.log("hasActiveSubscription - No subscription found, returning false");
      return false;
    }

    // Check if status is active
    const isActive = subscription.status === "active" ||
                    subscription.status === "trialing";

    // Check if subscription is not expired (if there's an end date)
    const currentTime = Date.now() / 1000;
    const isNotExpired = !subscription.currentPeriodEnd ||
                        subscription.currentPeriodEnd > currentTime;

    console.log("hasActiveSubscription - isActive:", isActive, "isNotExpired:", isNotExpired);
    console.log("hasActiveSubscription - currentTime:", currentTime, "currentPeriodEnd:", subscription.currentPeriodEnd);

    const result = isActive && isNotExpired;
    console.log("hasActiveSubscription - final result:", result);

    return result;
  }
});

/**
 * Get current user's subscription details
 */
export const getCurrentSubscription = query({
  args: {},
  handler: async (ctx) => {
    // Use getAuthUserId to get the correct user ID format
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId as Id<"users">))
      .first();
  }
}); 