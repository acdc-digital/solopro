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
            
            // If this is a subscription, also create/update subscription record
            if (mode === "subscription" && subscription) {
              await ctx.runMutation(internal.userSubscriptions.createOrUpdateFromStripe, {
                userIdOrEmail: userIdentifier,
                subscriptionId: subscription,
                status: "active",
                customerEmail: customer_details?.email,
              });
              
              console.log(`Subscription record created/updated: ${subscription}`);
            }
            
            return { success: true, sessionId };
          } catch (error) {
            console.error("Error recording payment:", error);
            return { success: false, error: String(error) };
          }
        }
        
        case "customer.subscription.updated":
        case "customer.subscription.created": {
          const { id, status, current_period_end, metadata, customer_email } = data;
          
          // Get user identifier from metadata or customer email
          const userIdentifier = metadata?.userId || customer_email;
          
          if (!userIdentifier) {
            console.error("No user identifier found in subscription event");
            return { success: false, error: "No user identifier found" };
          }
          
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