import GitHub from "@auth/core/providers/github";
// import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub,
    // Password
  ],
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
