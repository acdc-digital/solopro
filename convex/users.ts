import { ConvexError, v } from "convex/values";
import { internalMutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

/**
 * Get the current authenticated user (viewer)
 */
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await getUserById(ctx, userId);
  },
});

/**
 * Get the current authenticated user
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await getUserById(ctx, userId);
  },
});

/**
 * Get user by ID
 */
export const getUserById = async (ctx: QueryCtx, userId: Id<"users">) => {
  const user = await ctx.db.get(userId);
  if (!user) {
    return null;
  }
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    emailVerificationTime: user.emailVerificationTime,
    phone: user.phone,
    isAnonymous: user.isAnonymous,
  };
};

/**
 * Get user profile information
 */
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUserById(ctx, userId);
    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  },
});

/**
 * Update user profile
 */
export const updateProfile = internalMutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(cleanUpdates).length === 0) {
      return;
    }

    await ctx.db.patch(userId, cleanUpdates);
  },
});

/**
 * Get all users (admin function)
 */
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    // Note: In a real app, you'd want to check if the user is an admin
    const users = await ctx.db.query("users").collect();
    return users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerificationTime: user.emailVerificationTime,
      isAnonymous: user.isAnonymous,
    }));
  },
});

/**
 * Delete user account
 */
export const deleteAccount = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Delete user's data first
    const userSubscriptions = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    for (const subscription of userSubscriptions) {
      await ctx.db.delete(subscription._id);
    }

    // Delete the user
    await ctx.db.delete(args.userId);
  },
});

/**
 * Check if user exists by email
 */
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerificationTime: user.emailVerificationTime,
      isAnonymous: user.isAnonymous,
    };
  },
});

/**
 * Get user's subscription status
 */
export const getUserSubscriptionStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { hasActiveSubscription: false, subscriptionType: null };
    }

    const subscription = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    return {
      hasActiveSubscription: !!subscription,
      subscriptionType: subscription?.status || null,
      subscription: subscription,
    };
  },
});
