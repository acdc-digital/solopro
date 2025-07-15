import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, query, QueryCtx, mutation } from "./_generated/server";
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
 * Get user by email (internal function)
 */
export const getUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
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
      phone: user.phone,
      isAnonymous: user.isAnonymous,
    };
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
 * Check if user exists by email (public query)
 */
export const getUserByEmailPublic = query({
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
 * Internal query to get user by auth ID
 */
export const getUserByAuthId = internalQuery({
  args: { authId: v.string() },
  handler: async (ctx, { authId }) => {
    // First try exact match
    let user = await ctx.db
      .query("users")
      .withIndex("byAuthId", q => q.eq("authId", authId))
      .first();
    
    if (user) {
      return user;
    }
    
    // If no exact match and authId contains pipe, try with just the first part
    if (authId.includes('|')) {
      const baseAuthId = authId.split('|')[0];
      user = await ctx.db
        .query("users")
        .withIndex("byAuthId", q => q.eq("authId", baseAuthId))
        .first();
      
      if (user) {
        // Don't update here in query context - return the user as-is
        return user;
      }
    }
    
    return null;
  }
});

/**
 * Internal mutation to update a user's auth ID for webhook processing
 */
export const updateUserAuthIdForWebhook = internalMutation({
  args: { 
    userId: v.id("users"),
    authId: v.string()
  },
  handler: async (ctx, { userId, authId }) => {
    await ctx.db.patch(userId, { authId });
    return { success: true };
  }
});

/**
 * Internal mutation to clear all authentication data for an email
 * This helps when authentication is cached but user data is deleted
 */
export const clearAuthenticationData = internalMutation({
  args: { 
    email: v.string()
  },
  handler: async (ctx, { email }) => {
    console.log(`Clearing authentication data for email: ${email}`);
    
    // Check if there are any remaining auth-related records
    // Note: Convex Auth manages internal tables we can't directly access
    
    // Check for any remaining user records with this email
    const users = await ctx.db
      .query("users")
      .withIndex("email", q => q.eq("email", email))
      .collect();
    
    console.log(`Found ${users.length} remaining user records`);
    
    // Also check for users that might have different case variations
    const allUsers = await ctx.db.query("users").collect();
    const emailVariations = allUsers.filter(user => 
      user.email && user.email.toLowerCase() === email.toLowerCase()
    );
    
    console.log(`Found ${emailVariations.length} users with email variations`);
    
    // Delete any remaining user records
    for (const user of emailVariations) {
      console.log(`Deleting user: ${user._id}, email: ${user.email}, authId: ${user.authId}`);
      await ctx.db.delete(user._id);
    }
    
    return {
      deletedUsers: emailVariations.length,
      message: "Cleared remaining user data. For complete auth cleanup, user should clear browser storage and cookies."
    };
  }
});

/**
 * Internal query to debug authentication issues
 */
export const debugAuthenticationData = internalQuery({
  args: { 
    email: v.string()
  },
  handler: async (ctx, { email }) => {
    // Get all users to check for any matches
    const allUsers = await ctx.db.query("users").collect();
    
    const exactMatches = allUsers.filter(user => user.email === email);
    const caseInsensitiveMatches = allUsers.filter(user => 
      user.email && user.email.toLowerCase() === email.toLowerCase()
    );
    const authIdMatches = allUsers.filter(user => 
      user.authId && user.authId.includes(email)
    );
    
    return {
      searchEmail: email,
      exactMatches: exactMatches.map(u => ({ _id: u._id, email: u.email, authId: u.authId })),
      caseInsensitiveMatches: caseInsensitiveMatches.map(u => ({ _id: u._id, email: u.email, authId: u.authId })),
      authIdMatches: authIdMatches.map(u => ({ _id: u._id, email: u.email, authId: u.authId })),
      totalUsers: allUsers.length,
      hint: "If no matches found but auth still recognizes user, clear browser storage and cookies"
    };
  }
});

/**
 * Internal mutation to completely delete a user and all associated data
 */
export const completeUserDeletion = internalMutation({
  args: { 
    email: v.string()
  },
  handler: async (ctx, { email }) => {
    console.log(`Starting complete deletion for email: ${email}`);
    
    // Find all users with this email
    const users = await ctx.db
      .query("users")
      .withIndex("email", q => q.eq("email", email))
      .collect();
    
    console.log(`Found ${users.length} user(s) with email ${email}`);
    
    let deletionSummary = {
      usersDeleted: 0,
      subscriptionsDeleted: 0,
      paymentsDeleted: 0,
      logsDeleted: 0,
      forecastsDeleted: 0,
      feedDeleted: 0,
      attributesDeleted: 0,
      randomizerDeleted: 0,
      feedTagsDeleted: 0
    };
    
    for (const user of users) {
      console.log(`Deleting data for user: ${user._id}, authId: ${user.authId}`);
      
      // Delete subscriptions
      const subscriptions = await ctx.db
        .query("userSubscriptions")
        .withIndex("by_userId", q => q.eq("userId", user._id))
        .collect();
      
      for (const subscription of subscriptions) {
        await ctx.db.delete(subscription._id);
        deletionSummary.subscriptionsDeleted++;
      }
      
      // Delete payments
      const payments = await ctx.db
        .query("payments")
        .withIndex("by_userId", q => q.eq("userId", user._id))
        .collect();
      
      for (const payment of payments) {
        await ctx.db.delete(payment._id);
        deletionSummary.paymentsDeleted++;
      }
      
      // Delete logs
      const logs = await ctx.db
        .query("logs")
        .withIndex("byUserDate", q => q.eq("userId", user._id))
        .collect();
      
      for (const log of logs) {
        await ctx.db.delete(log._id);
        deletionSummary.logsDeleted++;
      }
      
      // Delete forecasts
      const forecasts = await ctx.db
        .query("forecast")
        .withIndex("byUserDate", q => q.eq("userId", user._id))
        .collect();
      
      for (const forecast of forecasts) {
        await ctx.db.delete(forecast._id);
        deletionSummary.forecastsDeleted++;
      }
      
      // Delete feed entries
      const feedEntries = await ctx.db
        .query("feed")
        .filter(q => q.eq(q.field("userId"), user._id))
        .collect();
      
      for (const feedEntry of feedEntries) {
        await ctx.db.delete(feedEntry._id);
        deletionSummary.feedDeleted++;
      }
      
      // Delete user attributes
      const attributes = await ctx.db
        .query("userAttributes")
        .withIndex("byUserId", q => q.eq("userId", user._id))
        .collect();
      
      for (const attribute of attributes) {
        await ctx.db.delete(attribute._id);
        deletionSummary.attributesDeleted++;
      }
      
      // Delete randomizer entries
      const randomizers = await ctx.db
        .query("randomizer")
        .withIndex("byUserId", q => q.eq("userId", user._id))
        .collect();
      
      for (const randomizer of randomizers) {
        await ctx.db.delete(randomizer._id);
        deletionSummary.randomizerDeleted++;
      }
      
      // Delete feed tags
      const feedTags = await ctx.db
        .query("feedTags")
        .withIndex("byUserId", q => q.eq("userId", user._id))
        .collect();
      
      for (const feedTag of feedTags) {
        await ctx.db.delete(feedTag._id);
        deletionSummary.feedTagsDeleted++;
      }
      
      // Finally, delete the user
      await ctx.db.delete(user._id);
      deletionSummary.usersDeleted++;
    }
    
    // Also check for auth session records in auth tables
    // Note: Convex Auth manages these internally, but let's log what we find
    console.log(`Deletion summary:`, deletionSummary);
    
    return deletionSummary;
  }
});

/**
 * Internal query to find all data associated with an email
 */
export const findAllUserData = internalQuery({
  args: { 
    email: v.string()
  },
  handler: async (ctx, { email }) => {
    // Find all users with this email
    const users = await ctx.db
      .query("users")
      .withIndex("email", q => q.eq("email", email))
      .collect();
    
    let summary = {
      users: users.length,
      subscriptions: 0,
      payments: 0,
      logs: 0,
      forecasts: 0,
      feed: 0,
      attributes: 0,
      randomizer: 0,
      feedTags: 0,
      userDetails: users.map(u => ({
        _id: u._id,
        email: u.email,
        authId: u.authId,
        _creationTime: u._creationTime
      }))
    };
    
    for (const user of users) {
      // Count subscriptions
      const subscriptions = await ctx.db
        .query("userSubscriptions")
        .withIndex("by_userId", q => q.eq("userId", user._id))
        .collect();
      summary.subscriptions += subscriptions.length;
      
      // Count payments
      const payments = await ctx.db
        .query("payments")
        .withIndex("by_userId", q => q.eq("userId", user._id))
        .collect();
      summary.payments += payments.length;
      
      // Count logs
      const logs = await ctx.db
        .query("logs")
        .withIndex("byUserDate", q => q.eq("userId", user._id))
        .collect();
      summary.logs += logs.length;
      
      // Count forecasts
      const forecasts = await ctx.db
        .query("forecast")
        .withIndex("byUserDate", q => q.eq("userId", user._id))
        .collect();
      summary.forecasts += forecasts.length;
      
      // Count feed entries
      const feedEntries = await ctx.db
        .query("feed")
        .filter(q => q.eq(q.field("userId"), user._id))
        .collect();
      summary.feed += feedEntries.length;
      
      // Count attributes
      const attributes = await ctx.db
        .query("userAttributes")
        .withIndex("byUserId", q => q.eq("userId", user._id))
        .collect();
      summary.attributes += attributes.length;
      
      // Count randomizer
      const randomizers = await ctx.db
        .query("randomizer")
        .withIndex("byUserId", q => q.eq("userId", user._id))
        .collect();
      summary.randomizer += randomizers.length;
      
      // Count feed tags
      const feedTags = await ctx.db
        .query("feedTags")
        .withIndex("byUserId", q => q.eq("userId", user._id))
        .collect();
      summary.feedTags += feedTags.length;
    }
    
    return summary;
  }
});

/**
 * Internal query to find duplicate users created during payment
 */
export const findDuplicateUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();
    
    // Find users with authId containing pipe character (indicating duplicate)
    const duplicateUsers = allUsers.filter(user => 
      user.authId && user.authId.includes('|') && user.authId.split('|').length > 2
    );
    
    return duplicateUsers.map(user => ({
      _id: user._id,
      authId: user.authId,
      email: user.email,
      _creationTime: user._creationTime
    }));
  }
});

/**
 * Internal mutation to clean up duplicate users
 */
export const cleanupDuplicateUser = internalMutation({
  args: { 
    duplicateUserId: v.id("users"),
    originalAuthId: v.string()
  },
  handler: async (ctx, { duplicateUserId, originalAuthId }) => {
    // Find the original user
    const originalUser = await ctx.db
      .query("users")
      .withIndex("byAuthId", q => q.eq("authId", originalAuthId))
      .first();
    
    if (!originalUser) {
      throw new Error(`Original user not found for auth ID: ${originalAuthId}`);
    }
    
    // Move any subscriptions from duplicate user to original user
    const subscriptions = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", q => q.eq("userId", duplicateUserId))
      .collect();
    
    for (const subscription of subscriptions) {
      // Check if original user already has a subscription
      const existingSubscription = await ctx.db
        .query("userSubscriptions")
        .withIndex("by_userId", q => q.eq("userId", originalUser._id))
        .first();
      
      if (existingSubscription) {
        // Update existing subscription with newer data
        await ctx.db.patch(existingSubscription._id, {
          subscriptionId: subscription.subscriptionId,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          updatedAt: Date.now()
        });
        
        // Delete the duplicate subscription
        await ctx.db.delete(subscription._id);
      } else {
        // Move subscription to original user
        await ctx.db.patch(subscription._id, {
          userId: originalUser._id
        });
      }
    }
    
    // Move any payments from duplicate user to original user
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_userId", q => q.eq("userId", duplicateUserId))
      .collect();
    
    for (const payment of payments) {
      await ctx.db.patch(payment._id, {
        userId: originalUser._id
      });
    }
    
    // Delete the duplicate user
    await ctx.db.delete(duplicateUserId);
    
    return { success: true, movedSubscriptions: subscriptions.length, movedPayments: payments.length };
  }
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

/**
 * Internal query to find subscription data for debugging
 */
export const debugSubscriptionData = internalQuery({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, { userId }) => {
    // Get subscription for this user
    const subscription = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", q => q.eq("userId", userId))
      .first();
    
    return {
      userId,
      subscription,
      hasSubscription: !!subscription,
      subscriptionStatus: subscription?.status || null
    };
  }
});

/**
 * Internal mutation to set user's auth ID when created
 */
export const setUserAuthId = internalMutation({
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
