import { convexAuth } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { CustomPassword } from "./CustomPassword";
import { ResendOTPPasswordReset } from "./ResendOTPPasswordReset";

// Configure auth with CustomPassword provider including email verification and password reset
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    CustomPassword
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
