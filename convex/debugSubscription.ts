import { query } from "./_generated/server";
import { v } from "convex/values";

export const checkSubscriptionDetails = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Get subscription by user ID
    const subscription = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId as any))
      .first();
      
    if (!subscription) {
      return { found: false };
    }
    
    const currentTime = Date.now();
    const currentTimeSeconds = Math.floor(currentTime / 1000);
    
    return {
      found: true,
      subscription,
      currentTime,
      currentTimeSeconds,
      periodEnd: subscription.currentPeriodEnd,
      isNotExpired: !subscription.currentPeriodEnd || subscription.currentPeriodEnd > currentTimeSeconds,
      isActive: subscription.status === "active" || subscription.status === "trialing",
    };
  }
});
