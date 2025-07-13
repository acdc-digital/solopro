import { v } from "convex/values";
import { internalMutation, internalQuery, query, mutation, action } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get payment by Stripe session ID (internal)
 */
export const getBySessionId = internalQuery({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("stripeSessionId"), sessionId))
      .first();
  },
});

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

/**
 * Create a Stripe checkout session for the authenticated user
 */
export const createCheckoutSession = action({
  args: {
    priceId: v.string(),
    paymentMode: v.optional(v.string()),
    embeddedCheckout: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Authentication required");
    }

    // Get the Convex user ID using the auth service
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found in database");
    }

    const authId = identity.subject;
    // Use the Convex deployment URL for internal API calls
    const convexDeploymentUrl = 'https://sleek-swordfish-420.convex.site';
    const apiUrl = `${convexDeploymentUrl}/api/create-checkout-session`;

    try {
      console.log("Creating checkout session for user:", userId);
      console.log("API URL:", apiUrl);
      console.log("Request payload:", {
        priceId: args.priceId,
        paymentMode: args.paymentMode || 'subscription',
        embeddedCheckout: args.embeddedCheckout !== false,
        userId: userId,
      });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: args.priceId,
          paymentMode: args.paymentMode || 'subscription',
          embeddedCheckout: args.embeddedCheckout !== false, // Default to true
          userId: authId, // Pass the auth ID for webhook metadata
          convexUserId: userId, // Pass the Convex user ID for database operations
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response content-type:", response.headers.get('content-type'));

      if (!response.ok) {
        const responseText = await response.text();
        console.error("Error response text:", responseText);
        
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`HTTP ${response.status}: ${responseText || 'Unknown error'}`);
        }
        
        throw new Error(`Failed to create checkout session: ${errorData.error || 'Unknown error'}`);
      }

      const responseText = await response.text();
      console.log("Response text:", responseText);
      console.log("Response text length:", responseText.length);
      
      if (!responseText) {
        throw new Error("Empty response from checkout session API");
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Parsed result:", result);
        console.log("Client secret from result:", result.clientSecret);
        console.log("Client secret length:", result.clientSecret?.length);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      console.log("Checkout session created successfully:", result);
      
      return result;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to create checkout session");
    }
  },
}); 