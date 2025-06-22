import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { ResendOTP } from "./ResendOTP";

// Configure auth with Password provider and email verification
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    // Temporarily disable email verification while debugging Resend issues
    Password({ verify: ResendOTP })
    // Password({ verify: ResendOTP })  // Uncomment this line once Resend is working
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { existingUserId, userId }) {
      if (!existingUserId) {
        // Set default role to "user" for new users only
        await ctx.runMutation(internal.admin.setDefaultRole, { userId });
      }
    },
  },
});

/**
 * Get the authenticated user's ID
 */
export const getUserId = query({
  args: {},
  handler: async (ctx) => {
    // Get the actual database user ID, not the identity subject
    const userId = await getAuthUserId(ctx);
    console.log("getUserId query called, returning:", userId);
    return userId;
  },
});

/**
 * Debug query to check authentication state
 */
export const debugAuth = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = await getAuthUserId(ctx);

    console.log("Debug auth info:", {
      identity: identity ? {
        subject: identity.subject,
        tokenIdentifier: identity.tokenIdentifier,
      } : null,
      userId,
    });

    return {
      hasIdentity: !!identity,
      identitySubject: identity?.subject,
      userId,
    };
  },
});
