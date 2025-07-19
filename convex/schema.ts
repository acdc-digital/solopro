// CONVEX SCHEMA
// /Users/matthewsimon/Documents/Github/solopro/convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  // Extend the authTables with additional indexes for users
  ...authTables,
  
  // Override the users table from authTables to add our custom fields and indexes
  users: defineTable({
    // Include all standard Convex Auth fields
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.float64()),
    isAnonymous: v.optional(v.boolean()),
    
    // Custom fields for your app
    authId: v.optional(v.string()),
    githubId: v.optional(v.number()),
    role: v.optional(v.union(v.literal("user"), v.literal("admin"))),
  })
  .index("email", ["email"])
  .index("byAuthId", ["authId"])
  .index("byRole", ["role"]),

   feedTags: defineTable({
    userId: v.string(), // Use string to match the actual usage in the codebase
    feedId: v.id("feed"),
    tagId: v.string(),
    tagName: v.string(),
    tagColor: v.string(),
    createdAt: v.number(),
  })
  .index("byFeedId", ["feedId"])
  .index("byUserId", ["userId"])
  .index("byUserIdAndTagId", ["userId", "tagId"]),

  feed: defineTable({
    userId: v.string(), // Use string to match the actual usage in the codebase
    date: v.string(),
    message: v.string(),
    createdAt: v.number(),
    comments: v.optional(v.array(v.object({
      userId: v.string(), // Use string to match the actual usage
      userName: v.string(),
      userImage: v.optional(v.string()),
      content: v.string(),
      createdAt: v.number(),
    }))),
    feedback: v.optional(v.array(v.object({
      userId: v.string(), // Use string to match the actual usage
      isLiked: v.boolean(),
      createdAt: v.number(),
    }))),
  }),

  logs: defineTable({
    userId: v.id("users"), // Use v.id("users") for consistency
    date: v.string(),
    answers: v.any(),
    score: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("byUserDate", ["userId", "date"]),

  userSubscriptions: defineTable({
    userId: v.id("users"),
    status: v.string(), // "active", "inactive", "canceled", "trial"
    subscriptionId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  userAttributes: defineTable({
    userId: v.id("users"), // Use v.id("users") for consistency
    attributes: v.any(),
    updatedAt: v.number(),
  })
  .index("byUserId", ["userId"]),

  payments: defineTable({
    userId: v.id("users"),
    stripeSessionId: v.string(),
    priceId: v.optional(v.string()),
    status: v.string(), // "pending", "complete", "failed"
    productName: v.string(),
    paymentMode: v.string(), // "payment" or "subscription"
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
    customerId: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_stripeSessionId", ["stripeSessionId"])
    .index("by_userId", ["userId"]),

  forecast: defineTable({
    userId: v.id("users"), // Use v.id("users") for consistency
    date: v.string(),
    emotionScore: v.number(),
    trend: v.string(),
    details: v.string(),
    description: v.string(),
    recommendation: v.string(),
    createdAt: v.number(),
    confidence: v.number(),
    basedOnDays: v.array(v.string()),
  })
  .index("byUserDate", ["userId", "date"]),

  forecastFeedback: defineTable({
    userId: v.id("users"), // Use v.id("users") for consistency
    forecastDate: v.string(),
    feedback: v.union(v.literal("up"), v.literal("down")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("byUserDate", ["userId", "forecastDate"]),

  randomizer: defineTable({
    userId: v.id("users"), // Use v.id("users") for consistency
    instructions: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("byUserId", ["userId"]),

  numbers: defineTable({
    value: v.number(),
  }),

  newsletter: defineTable({
    email: v.string(),
    createdAt: v.number(),
    source: v.optional(v.string()), // Track where the signup came from (e.g., "footer", "hero", "pricing")
  })
  .index("email", ["email"]),

  templates: defineTable({
    name: v.string(),
    userId: v.id("users"), // Use v.id("users") for consistency
    questions: v.array(
      v.object({
        id: v.string(),
        question: v.string(),
        type: v.union(v.literal("text"), v.literal("scale"), v.literal("yesno")),
        answer: v.optional(v.string())
      })
    ),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
  .index("by_name_and_user", ["name", "userId"])
  .index("by_user", ["userId"]),

  // New daily log templates for customizable forms
  dailyLogTemplates: defineTable({
    name: v.string(),
    userId: v.id("users"), // Use v.id("users") for consistency
    fields: v.array(
      v.object({
        id: v.string(),
        type: v.union(
          v.literal("slider"),
          v.literal("number"),
          v.literal("checkbox"),
          v.literal("textarea"),
          v.literal("text")
        ),
        label: v.string(),
        placeholder: v.optional(v.string()),
        min: v.optional(v.number()),
        max: v.optional(v.number()),
        step: v.optional(v.number()),
        defaultValue: v.optional(v.any()),
        required: v.optional(v.boolean()),
        category: v.optional(v.string()),
      })
    ),
    isActive: v.optional(v.boolean()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
  .index("by_user_id", ["userId"])
  .index("by_user_id_and_active", ["userId", "isActive"]),

  userFeedback: defineTable({
    userId: v.optional(v.id("users")), // Use v.id("users") for consistency, keep optional for anonymous
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
  })
  .index("byUserId", ["userId"])
  .index("byCreatedAt", ["createdAt"]),

  waitlist: defineTable({
    userId: v.id("users"),
    userName: v.optional(v.string()),
    userEmail: v.optional(v.string()),
    feature: v.string(), // e.g., "teams", "enterprise", etc.
    createdAt: v.number(),
    notified: v.optional(v.boolean()), // Track if user has been notified when feature is available
  })
  .index("byUserId", ["userId"])
  .index("byFeature", ["feature"])
  .index("byUserIdAndFeature", ["userId", "feature"]),

  openaiUsage: defineTable({
    userId: v.string(), // Use authId string instead of v.id("users") for consistency with AI functions
    feature: v.string(), // "forecast", "consultation", "weekly_analysis", etc.
    model: v.string(), // "gpt-4", "gpt-3.5-turbo", etc.
    promptTokens: v.number(),
    completionTokens: v.number(),
    totalTokens: v.number(),
    cost: v.number(), // Cost in USD cents (multiply by 100 for storage)
    requestId: v.optional(v.string()), // OpenAI request ID for reference
    metadata: v.optional(v.any()), // Additional data if needed
    createdAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_user_and_date", ["userId", "createdAt"])
  .index("by_feature", ["feature"])
  .index("by_model", ["model"]),
});
