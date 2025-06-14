import { v } from "convex/values";
import { internalMutation, query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Create a new payment record
 */
export const create = internalMutation({
  args: { 
    userId: v.id("users"),
    stripeSessionId: v.string(),
    priceId: v.string(),
    status: v.string(),
    productName: v.string(),
    paymentMode: v.string(),
    createdAt: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("payments", args);
  },
});

/**
 * Record a payment from Stripe webhook
 * This is called from the webhook endpoint when a checkout.session.completed event is received
 */
export const recordStripePayment = internalMutation({
  args: {
    stripeSessionId: v.string(),
    userIdOrEmail: v.string(), // Can be either the user ID or email
    priceId: v.optional(v.string()),
    productName: v.string(),
    paymentMode: v.string(),
    amount: v.number(),
    currency: v.string(),
    customerId: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let userId: Id<"users"> | null = null;
    
    // First try to find user by the userIdOrEmail string in the users table
    const userByAuthId = await ctx.db
      .query("users")
      .withIndex("byAuthId", q => q.eq("authId", args.userIdOrEmail))
      .first();
    
    if (userByAuthId) {
      userId = userByAuthId._id;
      console.log(`Found user by auth ID: ${userId}`);
    }
    
    // If not found by auth ID, try to find by email
    if (!userId && args.customerEmail) {
      const userByEmail = await ctx.db
        .query("users")
        .filter(q => q.eq(q.field("email"), args.customerEmail))
        .first();
      
      if (userByEmail) {
        userId = userByEmail._id;
        console.log(`Found user by email: ${userId}`);
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
        console.log(`Found user by userIdOrEmail as email: ${userId}`);
      }
    }
    
    // Fallback: try interpreting userIdOrEmail as a Convex document ID
    if (!userId) {
      try {
        const userById = await ctx.db.get(args.userIdOrEmail as Id<"users">);
        if (userById) {
          userId = userById._id;
          console.log(`Found user by Convex document ID: ${userId}`);
        }
      } catch (e) {
        // Ignore invalid ID format errors
      }
    }
    
    if (!userId) {
      throw new Error(`Could not find user for identifier: ${args.userIdOrEmail}`);
    }
    
    // Check if payment already exists (idempotency)
    const existingPayment = await ctx.db
      .query("payments")
      .withIndex("by_stripeSessionId", q => q.eq("stripeSessionId", args.stripeSessionId))
      .first();
    
    if (existingPayment) {
      console.log(`Payment already recorded for session: ${args.stripeSessionId}`);
      return existingPayment._id;
    }
    
    // Record the payment
    const paymentData: any = {
      userId,
      stripeSessionId: args.stripeSessionId,
      status: "complete",
      productName: args.productName,
      paymentMode: args.paymentMode,
      amount: args.amount,
      currency: args.currency,
      createdAt: Date.now(),
    };

    // Only include optional fields if they have values
    if (args.priceId) {
      paymentData.priceId = args.priceId;
    }
    
    if (args.customerId) {
      paymentData.customerId = args.customerId;
    }
    
    if (args.customerEmail) {
      paymentData.customerEmail = args.customerEmail;
    }
    
    if (args.subscriptionId) {
      paymentData.subscriptionId = args.subscriptionId;
    }
    
    if (args.subscriptionStatus) {
      paymentData.subscriptionStatus = args.subscriptionStatus;
    }

    console.log("Final payment data being inserted:", JSON.stringify(paymentData, null, 2));
    console.log("Args received:", JSON.stringify(args, null, 2));

    const paymentId = await ctx.db.insert("payments", paymentData);
    
    console.log(`Payment recorded successfully: ${paymentId}`);
    return paymentId;
  },
});

/**
 * Update payment status after checkout completion
 */
export const updatePaymentStatus = internalMutation({
  args: { 
    sessionId: v.string(),
    status: v.string(),
    customerId: v.optional(v.string()),
    subscriptionId: v.optional(v.string())
  },
  handler: async (ctx, { sessionId, status, customerId, subscriptionId }) => {
    // Find the payment record by session ID
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_stripeSessionId", (q) => q.eq("stripeSessionId", sessionId))
      .first();
    
    if (!payment) {
      throw new Error(`Payment record not found for session ${sessionId}`);
    }
    
    // Update the payment status
    const updates: any = { 
      status, 
      updatedAt: Date.now() 
    };
    
    if (customerId) {
      updates.customerId = customerId;
    }
    
    if (subscriptionId) {
      updates.subscriptionId = subscriptionId;
    }
    
    await ctx.db.patch(payment._id, updates);
    
    return payment._id;
  },
});

/**
 * Get all payments for a user
 */
export const getUserPayments = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return [];
    }
    
    const userId = identity.subject;
    
    return await ctx.db
      .query("payments")
      .withIndex("by_userId", (q) => q.eq("userId", userId as Id<"users">))
      .order("desc")
      .collect();
  },
});

/**
 * Get payment details by ID
 */
export const getPaymentById = query({
  args: { paymentId: v.id("payments") },
  handler: async (ctx, { paymentId }) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return null;
    }
    
    const payment = await ctx.db.get(paymentId);
    
    if (!payment) {
      return null;
    }
    
    // Security check: ensure the user can only access their own payments
    if (payment.userId !== identity.subject) {
      return null;
    }
    
    return payment;
  },
}); 