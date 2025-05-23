import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  // Table to track user subscription status
  userSubscriptions: defineTable({
    userId: v.id("users"),
    status: v.string(), // "active", "inactive", "canceled", "trial"
    subscriptionId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  // Create a payments table to track Stripe payments
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

  numbers: defineTable({
    value: v.number(),
  }),
});
