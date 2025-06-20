import { ConvexError, v } from "convex/values";
import { internalMutation, query, QueryCtx, mutation } from "./_generated/server";
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

/**
 * Get user by ID (public function)
 */
export const getUser = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the authenticated user ID first
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) {
      return null;
    }
    
    // If the requested ID matches the authenticated user, return their data
    if (args.id === authUserId) {
      return await getUserById(ctx, authUserId);
    }
    
    // Otherwise, return null (users can only access their own data)
    return null;
  },
});

/**
 * Upsert user (public function)
 */
export const upsertUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the authenticated user ID
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) {
      throw new ConvexError("Not authenticated");
    }
    
    // Update the authenticated user's profile information
    const updates = Object.fromEntries(
      Object.entries({
        name: args.name,
        email: args.email,
        image: args.image,
      }).filter(([, value]) => value !== undefined)
    );
    
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(authUserId, updates);
    }
    
    return authUserId;
  },
});

/**
 * Create a user from auth data
 */
export const createUserFromAuth = internalMutation({
  args: {
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    authId: v.string(),
  },
  handler: async (ctx, args) => {
    // Create the user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      authId: args.authId,
      isAnonymous: false,
    });
    return userId;
  },
});

/**
 * Ensure a user exists from auth data
 */
export const ensureUserFromAuth = internalMutation({
  args: {
    email: v.optional(v.string()),
    authId: v.string(),
  },
  handler: async (ctx, args) => {
    // First try to find by authId
    const existingUser = await ctx.db
      .query("users")
      .withIndex("byAuthId", q => q.eq("authId", args.authId))
      .first();

    if (existingUser) {
      // Update email if it changed
      if (args.email && existingUser.email !== args.email) {
        await ctx.db.patch(existingUser._id, { email: args.email });
      }
      return existingUser._id;
    }

    // If not found by authId, try by email
    if (args.email) {
      const userByEmail = await ctx.db
        .query("users")
        .withIndex("email", q => q.eq("email", args.email))
        .first();

      if (userByEmail) {
        // Update authId if found by email
        await ctx.db.patch(userByEmail._id, { authId: args.authId });
        return userByEmail._id;
      }
    }

    // If no user found, create a new one
    return await ctx.db.insert("users", {
      email: args.email,
      authId: args.authId,
      isAnonymous: false,
    });
  },
});

/**
 * Fix user auth ID
 */
export const fixUserAuthId = internalMutation({
  args: {
    email: v.string(),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the user by email
    const user = await ctx.db
      .query("users")
      .withIndex("email", q => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user with the correct authId
    await ctx.db.patch(user._id, {
      authId: `${args.provider}:${args.email}`
    });

    return user._id;
  },
});

/**
 * Update user's auth ID
 */
export const updateUserAuthId = internalMutation({
  args: {
    userId: v.id("users"),
    authId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      authId: args.authId
    });
  },
});

/**
 * Update user profile (public mutation for authenticated users)
 */
export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    // Remove undefined values and empty strings
    const updates = Object.fromEntries(
      Object.entries(args).filter(([, value]) => value !== undefined && value !== "")
    );

    if (Object.keys(updates).length === 0) {
      return;
    }

    await ctx.db.patch(userId, updates);

    // Return updated user
    return await getUserById(ctx, userId);
  },
});

// Export user data function
export const exportUserData = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get user profile using the userId directly (getAuthUserId returns the user document ID)
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Convert user._id to string for logs and userAttributes tables
    const userIdString = user._id.toString();

    // Get all daily logs using the user's ID as string
    const dailyLogs = await ctx.db
      .query("logs")
      .withIndex("byUserDate", (q) => q.eq("userId", userIdString))
      .collect();

    // Get user attributes using string userId
    const userAttributes = await ctx.db
      .query("userAttributes")
      .withIndex("byUserId", (q) => q.eq("userId", userIdString))
      .first();

    // Get user subscription info using Id<"users">
    const subscription = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    return {
      profile: user,
      dailyLogs,
      userAttributes,
      subscription,
      exportedAt: new Date().toISOString(),
      totalLogs: dailyLogs.length,
    };
  },
});
