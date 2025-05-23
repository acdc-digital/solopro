"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import Stripe from "stripe";
import { internal } from "./_generated/api";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

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
  
  try {
    // Extract customer information
    const customerId = session.customer;
    const customerEmail = session.customer_details?.email;
    
    // Extract metadata from the session - we can set this in the client
    const userId = session.client_reference_id;
    
    if (!userId) {
      console.error("No user ID in session metadata");
      return;
    }
    
    // Update payment record in database
    await ctx.runMutation(internal.payments.updatePaymentStatus, {
      sessionId: session.id,
      status: "complete",
      customerId
    });
    
    // For subscription mode, handle subscription data
    if (session.mode === "subscription") {
      const subscriptionId = session.subscription;
      
      if (subscriptionId) {
        // Fetch full subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        // Update user subscription status
        await ctx.runMutation(internal.userSubscriptions.createOrUpdate, {
          userId,
          subscriptionId,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end
        });
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
        currentPeriodEnd: subscription.current_period_end
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
      currentPeriodEnd: subscription.current_period_end
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
      currentPeriodEnd: subscription.current_period_end
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