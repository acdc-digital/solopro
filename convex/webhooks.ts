import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Process Stripe webhook events
 * This is called from the Next.js webhook route when Stripe sends events
 */
export const processStripeWebhook = mutation({
  args: {
    eventType: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const { eventType, data } = args;
    console.log(`Processing Stripe webhook event: ${eventType}`);
    
    try {
      switch (eventType) {
        case "checkout.session.completed": {
          // Extract relevant data from the checkout session
          const {
            id: sessionId,
            client_reference_id,
            customer,
            customer_details,
            subscription,
            mode,
            amount_total,
            currency,
            line_items,
            metadata
          } = data;
          
          // Get user identifier - prioritize client_reference_id (user ID) then email
          const userIdentifier = client_reference_id || 
                               metadata?.userId || 
                               customer_details?.email;
          
          if (!userIdentifier) {
            console.error("No user identifier found in checkout session");
            return { success: false, error: "No user identifier found" };
          }
          
          console.log(`Processing payment for user: ${userIdentifier}`);
          
          // Get product info from line items if available
          let productName = "SoloPro Subscription";
          let priceId: string | undefined;
          
          if (line_items?.data && line_items.data.length > 0) {
            const firstItem = line_items.data[0];
            productName = firstItem.description || productName;
            priceId = firstItem.price?.id;
          }
          
          // Record the payment
          try {
            // Build payment data, only including non-null values
            const paymentData: any = {
              stripeSessionId: sessionId,
              userIdOrEmail: userIdentifier,
              productName,
              paymentMode: mode || "payment",
              amount: amount_total || 0,
              currency: currency || "usd",
            };

            // Only include optional fields if they have values
            if (priceId) {
              paymentData.priceId = priceId;
            }
            
            if (customer) {
              paymentData.customerId = customer;
            }
            
            if (customer_details?.email) {
              paymentData.customerEmail = customer_details.email;
            }
            
            if (subscription) {
              paymentData.subscriptionId = subscription;
            }
            
            if (mode === "subscription") {
              paymentData.subscriptionStatus = "active";
            }

            await ctx.runMutation(internal.payments.recordStripePayment, paymentData);
            
            console.log(`Payment recorded for session: ${sessionId}`);
            
            // Create/update subscription record for any successful payment
            // This gives the user access regardless of whether it's a one-time payment or subscription
            try {
              let subscriptionData: any = {
                userIdOrEmail: userIdentifier,
                subscriptionId: subscription || sessionId, // Use Stripe subscription ID or session ID as fallback
                status: "active",
              };

              // If it's an actual subscription, include the customer email
              if (customer_details?.email) {
                subscriptionData.customerEmail = customer_details.email;
              }

              // For one-time payments, set a far future expiry (e.g., 10 years from now)
              // For actual subscriptions, we'll get the period end from the subscription webhook
              if (mode === "subscription" && subscription) {
                // This is a real subscription - set a temporary period end
                // The actual period end will be updated when we receive the subscription.created webhook
                const oneMonthFromNow = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
                subscriptionData.currentPeriodEnd = oneMonthFromNow;
                console.log("Creating subscription record with temporary period end, will be updated by subscription webhook");
              } else {
                // This is a one-time payment - give them long-term access
                const tenYearsFromNow = Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60);
                subscriptionData.currentPeriodEnd = tenYearsFromNow;
                console.log("Creating subscription record for one-time payment with 10-year access");
              }

              await ctx.runMutation(internal.userSubscriptions.createOrUpdateFromStripe, subscriptionData);
              
              console.log(`Subscription record created/updated for user: ${userIdentifier}`);
            } catch (subscriptionError) {
              console.error("Error creating subscription record:", subscriptionError);
              // Don't fail the whole webhook if subscription creation fails
            }
            
            return { success: true, sessionId };
          } catch (error) {
            console.error("Error recording payment:", error);
            return { success: false, error: String(error) };
          }
        }
        
        case "customer.subscription.updated":
        case "customer.subscription.created": {
          console.log("Full subscription event data:", JSON.stringify(data, null, 2));
          
          const { id, status, current_period_end, metadata, customer, customer_email } = data;
          
          console.log("Subscription event data:", { id, status, metadata, customer, customer_email });
          
          // Get user identifier from multiple sources in order of preference
          let userIdentifier = metadata?.userId ||
                              metadata?.user_id ||
                              customer_email;
          
          // If we have a customer ID but no user identifier yet, we'll need to get it from the customer
          // For now, let's try to get it from the customer email
          if (!userIdentifier && customer) {
            // The customer field should contain the customer ID, we might need customer_email
            console.log("No user identifier in metadata, trying customer email");
            userIdentifier = customer_email;
          }
          
          if (!userIdentifier) {
            console.error("No user identifier found in subscription event", {
              metadata,
              customer,
              customer_email,
              available_fields: Object.keys(data),
              full_data: data
            });
            
            // For now, let's continue and not fail the webhook
            // The subscription should have been created by the checkout.session.completed event
            console.log("Allowing subscription event to pass without processing");
            return { success: true, message: "Subscription event acknowledged but not processed due to missing user identifier" };
          }
          
          console.log(`Processing subscription ${id} for user: ${userIdentifier}`);
          
          try {
            await ctx.runMutation(internal.userSubscriptions.createOrUpdateFromStripe, {
              userIdOrEmail: userIdentifier,
              subscriptionId: id,
              status,
              currentPeriodEnd: current_period_end,
              customerEmail: customer_email,
            });
            
            console.log(`Subscription updated: ${id}`);
            return { success: true, subscriptionId: id };
          } catch (error) {
            console.error("Error updating subscription:", error);
            return { success: false, error: String(error) };
          }
        }
        
        case "customer.subscription.deleted": {
          const { id, status, current_period_end } = data;
          
          try {
            // Find and update the subscription by Stripe subscription ID
            await ctx.runMutation(internal.userSubscriptions.cancelByStripeId, {
              stripeSubscriptionId: id,
              currentPeriodEnd: current_period_end,
            });
            
            console.log(`Subscription cancelled: ${id}`);
            return { success: true, subscriptionId: id };
          } catch (error) {
            console.error("Error cancelling subscription:", error);
            return { success: false, error: String(error) };
          }
        }
        
        case "payment_intent.succeeded": {
          // Handle successful payments (for one-time payments)
          console.log("Payment intent succeeded:", data.id);
          return { success: true, message: "Payment intent processed" };
        }
        
        case "payment_intent.payment_failed": {
          // Handle failed payments
          console.log("Payment intent failed:", data.id);
          return { success: true, message: "Payment failure noted" };
        }
        
        default:
          console.log(`Unhandled event type: ${eventType}`);
          return { success: true, message: `Event type ${eventType} acknowledged` };
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return { success: false, error: String(error) };
    }
  },
}); 