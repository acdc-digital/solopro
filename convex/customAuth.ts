import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const customSignIn = action({
  args: {
    email: v.string(),
    password: v.string(),
    flow: v.literal("signIn"),
  },
  handler: async (ctx, { email, password, flow }) => {
    try {
      // First check if user exists
      const existingUser = await ctx.runQuery(internal.users.getUserByEmail, { email });
      
      if (!existingUser) {
        throw new ConvexError("No account found with this email address. Please sign up first.");
      }
      
      // If user exists, proceed with normal sign-in using the auth action
      return await ctx.runAction(internal.auth.signIn, {
        provider: "password",
        email,
        password,
        flow,
      });
    } catch (error) {
      // Handle specific Convex Auth errors
      if (error instanceof Error) {
        if (error.message.includes("InvalidAccountId")) {
          throw new ConvexError("No account found with this email address. Please sign up first.");
        }
        if (error.message.includes("Incorrect password")) {
          throw new ConvexError("Incorrect password. Please check your password and try again.");
        }
      }
      
      // Re-throw ConvexErrors as-is
      if (error instanceof ConvexError) {
        throw error;
      }
      
      // For any other error, provide a generic message
      throw new ConvexError("Authentication failed. Please try again.");
    }
  },
});

export const customSignUp = action({
  args: {
    email: v.string(),
    password: v.string(),
    flow: v.literal("signUp"),
  },
  handler: async (ctx, { email, password, flow }) => {
    try {
      // Check if user already exists
      const existingUser = await ctx.runQuery(internal.users.getUserByEmail, { email });
      
      if (existingUser) {
        throw new ConvexError("An account with this email already exists. Please sign in instead.");
      }
      
      // If user doesn't exist, proceed with normal sign-up using the auth action
      return await ctx.runAction(internal.auth.signIn, {
        provider: "password",
        email,
        password,
        flow,
      });
    } catch (error) {
      // Re-throw ConvexErrors as-is
      if (error instanceof ConvexError) {
        throw error;
      }
      
      // For any other error, provide a generic message
      console.error("Sign-up error:", error);
      throw new ConvexError("Account creation failed. Please try again.");
    }
  },
});
