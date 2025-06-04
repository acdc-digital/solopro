// FEEDBACK
// /Users/matthewsimon/Documents/Github/solopro/convex/feedback.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Submit feedback (thumbs up/down) for a feed item
 */
export const submitFeedback = mutation({
  args: {
    feedId: v.id("feed"),
    userId: v.string(),
    isLiked: v.boolean(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const { feedId, userId, isLiked } = args;
    
    // Get the feed document
    const feed = await ctx.db.get(feedId);
    
    // If feed doesn't exist, throw error
    if (!feed) {
      throw new Error("Feed not found");
    }
    
    // Create new feedback object
    const newFeedback = {
      userId,
      isLiked,
      createdAt: Date.now(),
    };
    
    // Get existing feedback array or initialize empty
    const feedback = feed.feedback || [];
    
    // Check if user has already provided feedback
    const existingFeedbackIndex = feedback.findIndex(f => f.userId === userId);
    
    // Update or add feedback
    if (existingFeedbackIndex >= 0) {
      // Replace existing feedback from this user
      feedback[existingFeedbackIndex] = newFeedback;
      await ctx.db.patch(feedId, { feedback });
    } else {
      // Add new feedback
      await ctx.db.patch(feedId, { 
        feedback: [...feedback, newFeedback] 
      });
    }
    
    return true;
  },
});

/**
 * Get feedback for a specific feed item
 */
export const getFeedback = query({
  args: {
    feedId: v.id("feed"),
  },
  returns: v.array(v.object({
    userId: v.string(),
    isLiked: v.boolean(),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const feed = await ctx.db.get(args.feedId);
    
    if (!feed || !feed.feedback) {
      return [];
    }
    
    return feed.feedback;
  },
});

/**
 * Get feedback for a specific feed item filtered by user
 */
export const getUserFeedback = query({
  args: {
    feedId: v.id("feed"),
    userId: v.string(),
  },
  returns: v.union(
    v.object({
      userId: v.string(),
      isLiked: v.boolean(),
      createdAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const { feedId, userId } = args;
    const feed = await ctx.db.get(feedId);
    
    if (!feed || !feed.feedback) {
      return null;
    }
    
    // Find feedback from this specific user
    const userFeedback = feed.feedback.find(f => f.userId === userId);
    return userFeedback || null;
  },
});

/**
 * Submit comprehensive user feedback from the feedback modal
 */
export const submitUserFeedback = mutation({
  args: {
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    overallRating: v.number(),
    mostValuableFeature: v.optional(v.string()),
    leastValuableFeature: v.optional(v.string()),
    easeOfUse: v.number(),
    dataAccuracy: v.number(),
    helpfulnessLevel: v.number(),
    improvementSuggestions: v.optional(v.string()),
    featureRequests: v.optional(v.string()),
    privacyConcerns: v.optional(v.string()),
    recommendToFriend: v.number(),
    additionalComments: v.optional(v.string()),
  },
  returns: v.id("userFeedback"),
  handler: async (ctx, args) => {
    // Validate required ratings are between 1-5
    const requiredRatings = [
      args.overallRating,
      args.easeOfUse,
      args.dataAccuracy,
      args.helpfulnessLevel,
      args.recommendToFriend,
    ];

    for (const rating of requiredRatings) {
      if (rating < 1 || rating > 5) {
        throw new Error("Ratings must be between 1 and 5");
      }
    }

    // Determine if this is anonymous feedback
    const isAnonymous = !args.userId;

    // Insert feedback into database
    const feedbackId = await ctx.db.insert("userFeedback", {
      userId: args.userId || undefined,
      email: args.email || undefined,
      overallRating: args.overallRating,
      mostValuableFeature: args.mostValuableFeature || undefined,
      leastValuableFeature: args.leastValuableFeature || undefined,
      easeOfUse: args.easeOfUse,
      dataAccuracy: args.dataAccuracy,
      helpfulnessLevel: args.helpfulnessLevel,
      improvementSuggestions: args.improvementSuggestions || undefined,
      featureRequests: args.featureRequests || undefined,
      privacyConcerns: args.privacyConcerns || undefined,
      recommendToFriend: args.recommendToFriend,
      additionalComments: args.additionalComments || undefined,
      isAnonymous,
      createdAt: Date.now(),
    });

    return feedbackId;
  },
});

/**
 * Get all user feedback (admin function)
 */
export const getAllUserFeedback = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("userFeedback"),
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    overallRating: v.number(),
    mostValuableFeature: v.optional(v.string()),
    leastValuableFeature: v.optional(v.string()),
    easeOfUse: v.number(),
    dataAccuracy: v.number(),
    helpfulnessLevel: v.number(),
    improvementSuggestions: v.optional(v.string()),
    featureRequests: v.optional(v.string()),
    privacyConcerns: v.optional(v.string()),
    recommendToFriend: v.number(),
    additionalComments: v.optional(v.string()),
    isAnonymous: v.boolean(),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    
    const feedback = await ctx.db
      .query("userFeedback")
      .withIndex("byCreatedAt")
      .order("desc")
      .take(limit);
    
    return feedback;
  },
});

/**
 * Get user feedback for a specific user
 */
export const getUserFeedbackHistory = query({
  args: {
    userId: v.string(),
  },
  returns: v.array(v.object({
    _id: v.id("userFeedback"),
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    overallRating: v.number(),
    mostValuableFeature: v.optional(v.string()),
    leastValuableFeature: v.optional(v.string()),
    easeOfUse: v.number(),
    dataAccuracy: v.number(),
    helpfulnessLevel: v.number(),
    improvementSuggestions: v.optional(v.string()),
    featureRequests: v.optional(v.string()),
    privacyConcerns: v.optional(v.string()),
    recommendToFriend: v.number(),
    additionalComments: v.optional(v.string()),
    isAnonymous: v.boolean(),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const feedback = await ctx.db
      .query("userFeedback")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    
    return feedback;
  },
});

/**
 * Get feedback statistics (admin function)
 */
export const getFeedbackStats = query({
  args: {},
  returns: v.object({
    totalFeedback: v.number(),
    averageOverallRating: v.number(),
    averageEaseOfUse: v.number(),
    averageDataAccuracy: v.number(),
    averageHelpfulness: v.number(),
    averageRecommendation: v.number(),
    anonymousFeedbackCount: v.number(),
    registeredUserFeedbackCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const allFeedback = await ctx.db
      .query("userFeedback")
      .collect();
    
    if (allFeedback.length === 0) {
      return {
        totalFeedback: 0,
        averageOverallRating: 0,
        averageEaseOfUse: 0,
        averageDataAccuracy: 0,
        averageHelpfulness: 0,
        averageRecommendation: 0,
        anonymousFeedbackCount: 0,
        registeredUserFeedbackCount: 0,
      };
    }
    
    const total = allFeedback.length;
    const anonymousCount = allFeedback.filter(f => f.isAnonymous).length;
    
    const averageOverallRating = allFeedback.reduce((sum, f) => sum + f.overallRating, 0) / total;
    const averageEaseOfUse = allFeedback.reduce((sum, f) => sum + f.easeOfUse, 0) / total;
    const averageDataAccuracy = allFeedback.reduce((sum, f) => sum + f.dataAccuracy, 0) / total;
    const averageHelpfulness = allFeedback.reduce((sum, f) => sum + f.helpfulnessLevel, 0) / total;
    const averageRecommendation = allFeedback.reduce((sum, f) => sum + f.recommendToFriend, 0) / total;
    
    return {
      totalFeedback: total,
      averageOverallRating: Math.round(averageOverallRating * 100) / 100,
      averageEaseOfUse: Math.round(averageEaseOfUse * 100) / 100,
      averageDataAccuracy: Math.round(averageDataAccuracy * 100) / 100,
      averageHelpfulness: Math.round(averageHelpfulness * 100) / 100,
      averageRecommendation: Math.round(averageRecommendation * 100) / 100,
      anonymousFeedbackCount: anonymousCount,
      registeredUserFeedbackCount: total - anonymousCount,
    };
  },
});