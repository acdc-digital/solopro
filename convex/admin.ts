// CONVEX ADMIN
// /Users/matthewsimon/Documents/Github/solopro/convex/admin.ts

import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

/**
 * Check if the current user is an admin
 */
export const isCurrentUserAdmin = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }
    
    const user = await ctx.db.get(userId);
    return user?.role === "admin";
  },
});

/**
 * Get current user's role
 */
export const getCurrentUserRole = query({
  args: {},
  returns: v.union(v.literal("user"), v.literal("admin"), v.null()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    
    const user = await ctx.db.get(userId);
    return user?.role || "user";
  },
});

/**
 * Get all user subscriptions with payment info (admin only)
 */
export const getAllUserSubscriptions = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("userSubscriptions"),
    _creationTime: v.number(),
    userId: v.id("users"),
    userName: v.optional(v.string()),
    userEmail: v.optional(v.string()),
    status: v.string(),
    subscriptionId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    // Payment information
    paymentAmount: v.optional(v.number()),
    paymentCurrency: v.optional(v.string()),
    priceId: v.optional(v.string()),
    latestPaymentDate: v.optional(v.number()),
  })),
  handler: async (ctx) => {
    // Check if user is admin
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new ConvexError("Unauthorized: admin access required");
    }
    
    // Get all subscriptions with user and payment info
    const subscriptions = await ctx.db.query("userSubscriptions").collect();
    
    const subscriptionsWithInfo = await Promise.all(
      subscriptions.map(async (subscription) => {
        const user = await ctx.db.get(subscription.userId);
        
        // Get latest payment for this subscription
        let latestPayment = null;
        if (subscription.subscriptionId) {
          latestPayment = await ctx.db
            .query("payments")
            .filter((q) => q.eq(q.field("subscriptionId"), subscription.subscriptionId))
            .order("desc")
            .first();
        }
        
        // If no payment found by subscriptionId, try to find by userId
        if (!latestPayment) {
          latestPayment = await ctx.db
            .query("payments")
            .withIndex("by_userId", (q) => q.eq("userId", subscription.userId))
            .order("desc")
            .first();
        }
        
        return {
          ...subscription,
          userName: user?.name,
          userEmail: user?.email,
          paymentAmount: latestPayment?.amount,
          paymentCurrency: latestPayment?.currency,
          priceId: latestPayment?.priceId,
          latestPaymentDate: latestPayment?.createdAt,
        };
      })
    );
    
    return subscriptionsWithInfo;
  },
});

/**
 * Get all users (admin only)
 */
export const getAllUsers = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    isAnonymous: v.optional(v.boolean()),
    _creationTime: v.number(),
  })),
  handler: async (ctx) => {
    // Check if user is admin
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new ConvexError("Unauthorized: admin access required");
    }
    
    // Get all users
    const users = await ctx.db.query("users").collect();
    
    return users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
      isAnonymous: user.isAnonymous,
      _creationTime: user._creationTime,
    }));
  },
});

/**
 * Promote user to admin (admin only)
 */
export const promoteToAdmin = mutation({
  args: {
    targetUserId: v.id("users"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Check if current user is admin
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    
    const currentUser = await ctx.db.get(userId);
    if (currentUser?.role !== "admin") {
      throw new ConvexError("Unauthorized: admin access required");
    }
    
    // Update target user's role
    await ctx.db.patch(args.targetUserId, {
      role: "admin",
    });
    
    return null;
  },
});

/**
 * Set default role for new users (internal function)
 */
export const setDefaultRole = internalMutation({
  args: {
    userId: v.id("users"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Set default role to "user" for new users
    await ctx.db.patch(args.userId, {
      role: "user",
    });
    
    return null;
  },
});

/**
 * Development helper: Promote first user to admin (remove in production)
 */
export const promoteFirstUserToAdmin = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Find the first user and make them admin
    const firstUser = await ctx.db.query("users").first();
    
    if (firstUser) {
      await ctx.db.patch(firstUser._id, {
        role: "admin",
      });
      console.log(`Promoted user ${firstUser._id} to admin`);
    } else {
      console.log("No users found to promote");
    }
    
    return null;
  },
});

/**
 * Migration helper: Set default role for existing users without a role
 */
export const migrateExistingUsers = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Find all users without a role and set them to "user"
    const allUsers = await ctx.db.query("users").collect();
    
    for (const user of allUsers) {
      if (!user.role) {
        await ctx.db.patch(user._id, {
          role: "user",
        });
        console.log(`Set default role for user ${user._id}`);
      }
    }
    
    console.log("Migration completed");
    return null;
  },
});