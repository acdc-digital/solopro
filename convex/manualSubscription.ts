import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

/**
 * Manually create a subscription for testing (simulates webhook)
 */
export const manuallyCreateSubscription = mutation({
  args: {},
  handler: async (ctx) => {
    // This is the current user making payments based on the logs
    const userEmail = "smatty662@gmail.com"; 
    const userId = "jx7edzh9f2ewxv0gv4sh4sfgqh7kh1xy"; // The user ID from the logs
    const subscriptionId = `manual_sub_${Date.now()}`;
    
    try {
      // Create subscription using the same logic as webhook
      const result = await ctx.runMutation(internal.userSubscriptions.createOrUpdateFromStripe, {
        userIdOrEmail: userId, // Use the user ID directly since we know it
        subscriptionId,
        status: "active",
        currentPeriodEnd: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
      });
      
      console.log("Manually created subscription for current user:", result);
      return { success: true, subscriptionId: result, userId, userEmail };
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }
});
