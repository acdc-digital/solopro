"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// Initialize Stripe with dynamic import to avoid module resolution issues
async function getStripe() {
  const Stripe = (await import("stripe")).default;
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-04-30.basil" as any,
  });
}

// Webhook secret from environment variable
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Handle webhook events from Stripe
 */
export const handleWebhookEvent = internalAction({
  args: { 
    signature: v.string(),
    payload: v.string()
  },
  handler: async (ctx, { signature, payload }) => {
    if (!endpointSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
      return { success: false, error: "Webhook secret not configured" };
    }

    try {
      // Verify the event came from Stripe
      const stripe = await getStripe();
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );

      console.log(`Received Stripe event: ${event.type}`);

      // Handle different event types
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(ctx, event.data.object);
          break;
        case "invoice.payment_succeeded":
          await handleInvoicePaymentSucceeded(ctx, event.data.object);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
          await handleSubscriptionUpdated(ctx, event.data.object);
          break;
        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(ctx, event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error processing webhook:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }
});

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(ctx: any, session: any) {
  console.log("Processing checkout.session.completed event");
  console.log("Session object:", JSON.stringify(session, null, 2));
  
  try {
    // Extract customer information
    const customerId = session.customer;
    const customerEmail = session.customer_details?.email;
    
    // Extract the auth user ID from client_reference_id
    const authUserId = session.client_reference_id;
    
    console.log("Extracted data:");
    console.log("- customerId:", customerId);
    console.log("- customerEmail:", customerEmail);
    console.log("- authUserId:", authUserId);
    console.log("- session.mode:", session.mode);
    
    if (!authUserId) {
      console.error("No auth user ID in session client_reference_id");
      console.log("Available session metadata:", session.metadata);
      return;
    }
    
    console.log("Looking for user with authId:", authUserId);
    
    // Find the Convex user ID using the auth ID
    // Don't create a new user - the user should already exist
    const existingUser = await ctx.runQuery(internal.users.getUserByAuthId, {
      authId: authUserId
    });
    
    if (!existingUser) {
      console.error("User not found for auth ID:", authUserId);
      
      // Try to find users with partial matches
      const baseAuthId = authUserId.split('|')[0];
      console.log("Trying to find user with base auth ID:", baseAuthId);
      
      const userWithBaseId = await ctx.runQuery(internal.users.getUserByAuthId, {
        authId: baseAuthId
      });
      
      if (userWithBaseId) {
        console.log("Found user with base auth ID:", userWithBaseId._id);
        // Use this user
        const convexUserId = userWithBaseId._id;
        
        console.log("Found existing Convex user ID:", convexUserId);
        
        console.log("Updating payment status for session:", session.id);
        // Update payment record in database
        await ctx.runMutation(internal.payments.updatePaymentStatus, {
          sessionId: session.id,
          status: "complete",
          customerId
        });
        
        // Continue with subscription creation...
        if (session.mode === "subscription") {
          const subscriptionId = session.subscription;
          
          console.log("Found subscription ID:", subscriptionId);
          
          if (subscriptionId) {
            console.log("Fetching subscription details from Stripe...");
            // Fetch full subscription details from Stripe
            const stripe = await getStripe();
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            
            console.log("Subscription details:", {
              id: subscription.id,
              status: subscription.status,
              current_period_end: (subscription as any).current_period_end
            });
            
            console.log("Creating/updating user subscription in database...");
            // Update user subscription status - use the base auth ID
            await ctx.runMutation(internal.userSubscriptions.createOrUpdate, {
              userId: baseAuthId, // Use the base auth ID that matches the user
              subscriptionId,
              status: subscription.status,
              currentPeriodEnd: (subscription as any).current_period_end * 1000 // Convert to milliseconds
            });
            
            console.log("Successfully created/updated subscription for user:", baseAuthId);
          } else {
            console.log("No subscription ID found in session");
          }
        }
        return;
      } else {
        console.error("No user found with base auth ID either:", baseAuthId);
        return;
      }
    }
    
    const convexUserId = existingUser._id;
    console.log("Found existing Convex user ID:", convexUserId);
    
    console.log("Updating payment status for session:", session.id);
    // Update payment record in database
    await ctx.runMutation(internal.payments.updatePaymentStatus, {
      sessionId: session.id,
      status: "complete",
      customerId
    });
    
    // For subscription mode, handle subscription data
    if (session.mode === "subscription") {
      const subscriptionId = session.subscription;
      
      console.log("Found subscription ID:", subscriptionId);
      
      if (subscriptionId) {
        console.log("Fetching subscription details from Stripe...");
        // Fetch full subscription details from Stripe
        const stripe = await getStripe();
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        console.log("Subscription details:", {
          id: subscription.id,
          status: subscription.status,
          current_period_end: (subscription as any).current_period_end
        });
        
        console.log("Creating/updating user subscription in database...");
        // Update user subscription status - use auth user ID as function expects it
        await ctx.runMutation(internal.userSubscriptions.createOrUpdate, {
          userId: authUserId, // Use the auth user ID as the function expects it
          subscriptionId,
          status: subscription.status,
          currentPeriodEnd: (subscription as any).current_period_end * 1000 // Convert to milliseconds
        });
        
        console.log("Successfully created/updated subscription for user:", authUserId);
      } else {
        console.log("No subscription ID found in session");
      }
    }
  } catch (error) {
    console.error("Error processing checkout session:", error);
    throw error;
  }
}

/**
 * Handle invoice.payment_succeeded event
 */
async function handleInvoicePaymentSucceeded(ctx: any, invoice: any) {
  // Only process subscription invoices
  if (invoice.subscription) {
    const subscriptionId = invoice.subscription;
    const stripe = await getStripe();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Find the user ID from our database
    const userId = await ctx.runQuery(internal.userSubscriptions.getUserIdBySubscriptionId, {
      subscriptionId
    });
    
    if (userId) {
      // Update subscription period end
      await ctx.runMutation(internal.userSubscriptions.createOrUpdate, {
        userId,
        subscriptionId,
        status: subscription.status,
        currentPeriodEnd: (subscription as any).current_period_end
      });
    }
  }
}

/**
 * Handle subscription updated event
 */
async function handleSubscriptionUpdated(ctx: any, subscription: any) {
  // Find the user ID from our database
  const userId = await ctx.runQuery(internal.userSubscriptions.getUserIdBySubscriptionId, {
    subscriptionId: subscription.id
  });
  
  if (userId) {
    await ctx.runMutation(internal.userSubscriptions.createOrUpdate, {
      userId,
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: (subscription as any).current_period_end
    });
  }
}

/**
 * Handle subscription deleted event
 */
async function handleSubscriptionDeleted(ctx: any, subscription: any) {
  // Find the user ID from our database
  const userId = await ctx.runQuery(internal.userSubscriptions.getUserIdBySubscriptionId, {
    subscriptionId: subscription.id
  });
  
  if (userId) {
    await ctx.runMutation(internal.userSubscriptions.createOrUpdate, {
      userId,
      subscriptionId: subscription.id,
      status: "canceled",
      currentPeriodEnd: (subscription as any).current_period_end
    });
  }
}

/**
 * Create a payment record when initiating checkout
 */
export const createPaymentRecord = action({
  args: { 
    priceId: v.string(),
    productName: v.string(),
    paymentMode: v.string(),
    sessionId: v.string()
  },
  handler: async (ctx, { priceId, productName, paymentMode, sessionId }) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const userId = identity.subject;
    
    // Create payment record
    await ctx.runMutation(internal.payments.create, {
      userId: userId as any,
      stripeSessionId: sessionId,
      priceId,
      status: "pending",
      productName,
      paymentMode,
      createdAt: Date.now()
    });
    
    return { success: true };
  }
}); 

/**
 * Test function to simulate a successful checkout - FOR DEVELOPMENT ONLY
 * This simulates what would happen when a webhook is received
 */
export const simulateSuccessfulCheckout = action({
  args: { 
    sessionId: v.string()
  },
  handler: async (ctx, { sessionId }) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const userId = identity.subject;
    
    try {
      // First, update the payment status
      await ctx.runMutation(internal.payments.updatePaymentStatus, {
        sessionId,
        status: "complete",
        customerId: "test_customer"
      });
      
      // Then create a subscription record
      await ctx.runMutation(internal.userSubscriptions.createOrUpdate, {
        userId,
        subscriptionId: `sub_test_${Date.now()}`,
        status: "active",
        currentPeriodEnd: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now
      });
      
      console.log("Successfully simulated checkout completion for user:", userId);
      return { success: true };
    } catch (error) {
      console.error("Error simulating checkout:", error);
      throw error;
    }
  }
});