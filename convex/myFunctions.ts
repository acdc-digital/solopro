import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:
export const listNumbers = query({
  // Validators for arguments.
  args: {
    count: v.number(),
  },

  // Query implementation.
  handler: async (ctx, args) => {
    //// Read the database as many times as you need here.
    //// See https://docs.convex.dev/database/reading-data.
    const numbers = await ctx.db
      .query("numbers")
      // Ordered by _creationTime, return most recent
      .order("desc")
      .take(args.count);
    const userId = await getAuthUserId(ctx);
    const user = userId === null ? null : await ctx.db.get(userId);
    return {
      viewer: user?.email ?? null,
      numbers: numbers.reverse().map((number) => number.value),
    };
  },
});

// You can write data to the database via a mutation:
export const addNumber = mutation({
  // Validators for arguments.
  args: {
    value: v.number(),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    //// Insert or modify documents in the database here.
    //// Mutations can also read from the database like queries.
    //// See https://docs.convex.dev/database/writing-data.

    const id = await ctx.db.insert("numbers", { value: args.value });

    console.log("Added new document with id:", id);
    // Optionally, return a value from your mutation.
    // return id;
  },
});

// You can fetch data from and send data to third-party APIs via an action:
export const myAction = action({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Action implementation.
  handler: async (ctx, args) => {
    //// Use the browser-like `fetch` API to send HTTP requests.
    //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
    // const response = await ctx.fetch("https://api.thirdpartyservice.com");
    // const data = await response.json();

    //// Query data by running Convex queries.
    const data = await ctx.runQuery(api.myFunctions.listNumbers, {
      count: 10,
    });
    console.log(data);

    //// Write data by running Convex mutations.
    await ctx.runMutation(api.myFunctions.addNumber, {
      value: args.first,
    });
  },
});

export const testRecordPayment = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      // Test user ID - make sure this exists in your database
      const users = await ctx.db.query("users").collect();
      
      if (users.length === 0) {
        // Create a test user if none exists
        const userId = await ctx.db.insert("users", { 
          email: "test@example.com",
          name: "Test User"
        });
        
        // Call the recordPayment function with test data
        const paymentId = await ctx.db.insert("payments", {
          userId,
          stripeSessionId: "test_session_" + Date.now(),
          status: "complete",
          amount: 2000,
          currency: "usd",
          paymentMode: "payment",
          productName: "Test Product",
          customerId: "test_customer",
          customerEmail: "test@example.com",
          createdAt: Date.now()
        });
        
        return { success: true, paymentId, userId };
      } else {
        const userId = users[0]._id;
        
        // Call the recordPayment function with test data
        const paymentId = await ctx.db.insert("payments", {
          userId,
          stripeSessionId: "test_session_" + Date.now(),
          status: "complete",
          amount: 2000,
          currency: "usd",
          paymentMode: "payment",
          productName: "Test Product",
          customerId: "test_customer",
          customerEmail: "test@example.com",
          createdAt: Date.now()
        });
        
        return { success: true, paymentId, userId };
      }
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
});

export const processWebhookEvent = mutation({
  args: {
    eventType: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const { eventType, data } = args;
    console.log(`Processing webhook event: ${eventType}`);
    
    try {
      // Handle different event types
      switch (eventType) {
        case "checkout.session.completed": {
          // Extract data from the checkout session
          const { client_reference_id, customer, subscription, mode, amount_total, currency } = data;
          const userId = client_reference_id || data.metadata?.userId;
          
          if (!userId) {
            console.error("No user ID found in session metadata");
            return { success: false, error: "No user ID found" };
          }
          
          console.log(`Processing checkout.session.completed for user: ${userId}`);
          
          // First, record the payment
          try {
            // Find the user in our database
            const users = await ctx.db.query("users").collect();
            
            if (users.length === 0) {
              console.error("No users found in database");
              return { success: false, error: "No users found" };
            }
            
            // For simplicity, use the first user if userId doesn't match any user
            let userRecord = users.find(u => u._id === userId) || users[0];
            
            // Record the payment
            const paymentId = await ctx.db.insert("payments", {
              userId: userRecord._id,
              stripeSessionId: data.id,
              status: "complete",
              amount: amount_total || 0,
              currency: currency || "usd",
              paymentMode: mode || "payment",
              productName: "SoloPro Subscription",
              customerId: customer,
              customerEmail: data.customer_details?.email,
              createdAt: Date.now()
            });
            
            console.log(`Payment record created with ID: ${paymentId}`);
            
            // If this is a subscription, record the subscription too
            if (mode === "subscription" && subscription) {
              await ctx.db.insert("userSubscriptions", {
                userId: userRecord._id,
                subscriptionId: subscription,
                status: "active",
                currentPeriodEnd: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
                createdAt: Date.now(),
                updatedAt: Date.now()
              });
              
              console.log(`Subscription record created for subscription: ${subscription}`);
            }
            
            return { success: true, paymentId };
          } catch (error) {
            console.error("Error recording payment:", error);
            return { success: false, error: String(error) };
          }
        }
        
        case "customer.subscription.updated":
        case "customer.subscription.created": {
          // Extract data from the subscription
          const { id, status, current_period_end, metadata } = data;
          const userId = metadata?.userId;
          
          if (!userId) {
            console.error("No user ID found in subscription metadata");
            return { success: false, error: "No user ID found" };
          }
          
          console.log(`Processing subscription event for user: ${userId}`);
          
          try {
            // Find the user in our database
            const users = await ctx.db.query("users").collect();
            
            if (users.length === 0) {
              console.error("No users found in database");
              return { success: false, error: "No users found" };
            }
            
            // For simplicity, use the first user if userId doesn't match any user
            let userRecord = users.find(u => u._id === userId) || users[0];
            
            // Find existing subscription
            const existingSubscription = await ctx.db
              .query("userSubscriptions")
              .withIndex("by_userId", q => q.eq("userId", userRecord._id))
              .first();
            
            if (existingSubscription) {
              // Update existing subscription
              await ctx.db.patch(existingSubscription._id, {
                status,
                currentPeriodEnd: current_period_end,
                updatedAt: Date.now()
              });
              
              console.log(`Subscription updated: ${existingSubscription._id}`);
              return { success: true, subscriptionId: existingSubscription._id };
            } else {
              // Create new subscription
              const subscriptionId = await ctx.db.insert("userSubscriptions", {
                userId: userRecord._id,
                subscriptionId: id,
                status,
                currentPeriodEnd: current_period_end,
                createdAt: Date.now(),
                updatedAt: Date.now()
              });
              
              console.log(`New subscription created: ${subscriptionId}`);
              return { success: true, subscriptionId };
            }
          } catch (error) {
            console.error("Error updating subscription:", error);
            return { success: false, error: String(error) };
          }
        }
        
        case "customer.subscription.deleted": {
          // Extract data from the subscription
          const { id, current_period_end, metadata } = data;
          const userId = metadata?.userId;
          
          if (!userId) {
            console.error("No user ID found in subscription metadata");
            return { success: false, error: "No user ID found" };
          }
          
          console.log(`Processing subscription cancellation for user: ${userId}`);
          
          try {
            // Find existing subscription
            const existingSubscription = await ctx.db
              .query("userSubscriptions")
              .filter(q => q.eq(q.field("subscriptionId"), id))
              .first();
            
            if (existingSubscription) {
              // Update subscription to cancelled
              await ctx.db.patch(existingSubscription._id, {
                status: "canceled",
                currentPeriodEnd: current_period_end,
                updatedAt: Date.now()
              });
              
              console.log(`Subscription cancelled: ${existingSubscription._id}`);
              return { success: true, subscriptionId: existingSubscription._id };
            } else {
              console.warn(`No subscription found for ID: ${id}`);
              return { success: false, error: "Subscription not found" };
            }
          } catch (error) {
            console.error("Error cancelling subscription:", error);
            return { success: false, error: String(error) };
          }
        }
        
        default:
          console.log(`Unhandled event type: ${eventType}`);
          return { success: false, error: "Unhandled event type" };
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return { success: false, error: String(error) };
    }
  }
});
