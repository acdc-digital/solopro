import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

/**
 * Create or update a user subscription
 */
export const createOrUpdate = internalMutation({
  args: {
    userId: v.string(), // This will be the auth user ID
    subscriptionId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { userId: authUserId, subscriptionId, status, currentPeriodEnd } = args;
    
    // Find the Convex user by auth ID with fallback logic
    let convexUser = await ctx.db
      .query("users")
      .withIndex("byAuthId", (q) => q.eq("authId", authUserId))
      .first();
    
    // If not found and authId contains pipe, try with just the first part
    if (!convexUser && authUserId.includes('|')) {
      const baseAuthId = authUserId.split('|')[0];
      convexUser = await ctx.db
        .query("users")
        .withIndex("byAuthId", (q) => q.eq("authId", baseAuthId))
        .first();
      
      if (convexUser) {
        // Update the user's authId to the full format for future lookups
        await ctx.db.patch(convexUser._id, { authId: authUserId });
      }
    }
    
    // If still not found, try to find by user ID (in case authUserId is actually a document ID)
    if (!convexUser) {
      try {
        const userById = await ctx.db.get(authUserId as Id<"users">);
        if (userById) {
          convexUser = userById;
          // Set the authId if it's missing
          if (!userById.authId) {
            await ctx.db.patch(userById._id, { authId: authUserId });
          }
        }
      } catch (e) {
        // Ignore invalid ID format errors
      }
    }
    
    if (!convexUser) {
      throw new Error(`User not found for auth ID: ${authUserId}`);
    }
    
    const convexUserId = convexUser._id;
    
    // Check if a subscription record already exists
    const existing = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", convexUserId))
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
        userId: convexUserId,
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
    
    console.log("Looking for user with identifier:", args.userIdOrEmail);
    
    // First try to find user by exact auth ID match
    const userByAuthId = await ctx.db
      .query("users")
      .withIndex("byAuthId", q => q.eq("authId", args.userIdOrEmail))
      .first();
    
    if (userByAuthId) {
      userId = userByAuthId._id;
      console.log("Found user by exact auth ID:", userId);
    }
    
    // If not found, try interpreting the identifier as a Convex document ID
    // (this handles the case where the auth ID is just the user ID)
    if (!userId) {
      try {
        const userById = await ctx.db.get(args.userIdOrEmail as Id<"users">);
        if (userById) {
          userId = userById._id;
          console.log("Found user by Convex document ID:", userId);
          // Update the user's authId to match for future lookups
          if (userById.authId !== args.userIdOrEmail) {
            await ctx.db.patch(userById._id, { authId: args.userIdOrEmail });
            console.log("Updated user's authId to:", args.userIdOrEmail);
          }
        }
      } catch (e) {
        // Ignore invalid ID format errors
        console.log("Not a valid Convex document ID");
      }
    }
    
    // If still not found and identifier contains pipe, try with just the first part
    // (for backwards compatibility with old auth ID format)
    if (!userId && args.userIdOrEmail.includes('|')) {
      const baseAuthId = args.userIdOrEmail.split('|')[0];
      console.log("Trying base auth ID:", baseAuthId);
      
      const userByBaseAuthId = await ctx.db
        .query("users")
        .withIndex("byAuthId", q => q.eq("authId", baseAuthId))
        .first();
      
      if (userByBaseAuthId) {
        userId = userByBaseAuthId._id;
        console.log("Found user by base auth ID:", userId);
        // Update the user's authId to the current format for future lookups
        await ctx.db.patch(userByBaseAuthId._id, { authId: args.userIdOrEmail });
        console.log("Updated user's authId from base to full format");
      }
    }
    
    // Only as last resort, if identifier looks like an email, try email lookup
    if (!userId && args.userIdOrEmail.includes('@')) {
      console.log("Falling back to email lookup for:", args.userIdOrEmail);
      const userByEmail = await ctx.db
        .query("users")
        .withIndex("email", q => q.eq("email", args.userIdOrEmail))
        .first();
      
      if (userByEmail) {
        userId = userByEmail._id;
        console.log("Found user by email fallback:", userId);
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
      console.log("Updated existing subscription:", existing._id);
      return existing._id;
    } else {
      // Create new subscription record
      const newId = await ctx.db.insert("userSubscriptions", {
        userId,
        subscriptionId: args.subscriptionId,
        status: args.status,
        currentPeriodEnd: args.currentPeriodEnd,
        createdAt: now,
        updatedAt: now
      });
      console.log("Created new subscription:", newId);
      return newId;
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
    // Use getAuthUserId to get the Convex user ID
    const convexUserId = await getAuthUserId(ctx);

    console.log("hasActiveSubscription - convexUserId from getAuthUserId:", convexUserId);

    if (!convexUserId) {
      console.log("hasActiveSubscription - No convexUserId, returning false");
      return false;
    }

    // First, let's find subscriptions using the Convex user ID
    let subscription = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", convexUserId))
      .first();

    console.log("hasActiveSubscription - subscription found by convex user ID:", subscription);

    // If no subscription found by Convex user ID, try to find by auth user ID
    // by looking up the user's auth ID first
    if (!subscription) {
      const user = await ctx.db.get(convexUserId);
      if (user?.authId) {
        console.log("hasActiveSubscription - trying to find subscription by auth ID:", user.authId);
        
        // Look for subscription records that might have been stored with auth ID
        subscription = await ctx.db
          .query("userSubscriptions")
          .filter((q) => q.eq(q.field("userId"), user.authId as any))
          .first();
        
        console.log("hasActiveSubscription - subscription found by auth ID:", subscription);
      }
      
      if (!subscription) {
        console.log("hasActiveSubscription - No subscription found anywhere, returning false");
        return false;
      }
    }

    return checkSubscriptionActive(subscription);
  }
});

// Helper function to check if subscription is active
function checkSubscriptionActive(subscription: any) {
  // Check if status is active
  const isActive = subscription.status === "active" ||
                  subscription.status === "trialing";

  // Check if subscription is not expired (if there's an end date)
  // Note: currentPeriodEnd is stored in seconds, but Date.now() returns milliseconds
  const currentTimeSeconds = Math.floor(Date.now() / 1000);
  const isNotExpired = !subscription.currentPeriodEnd ||
                      subscription.currentPeriodEnd > currentTimeSeconds;

  console.log("checkSubscriptionActive - isActive:", isActive, "isNotExpired:", isNotExpired);
  console.log("checkSubscriptionActive - currentTimeSeconds:", currentTimeSeconds, "currentPeriodEnd:", subscription.currentPeriodEnd);

  const result = isActive && isNotExpired;
  console.log("checkSubscriptionActive - final result:", result);

  return result;
}

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