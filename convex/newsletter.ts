import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add email to newsletter
export const addEmail = mutation({
  args: { 
    email: v.string(),
    source: v.optional(v.string())
  },
  handler: async (ctx, { email, source = "unknown" }) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Check for existing email to avoid duplicates
    const existing = await ctx.db
      .query("newsletter")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
    
    if (existing) {
      throw new Error("Email already signed up");
    }

    // Insert new email
    const newsletterId = await ctx.db.insert("newsletter", {
      email,
      source,
      createdAt: Date.now(),
    });

    return { success: true, id: newsletterId };
  },
});

// Get all newsletter emails (admin function)
export const getAllEmails = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("newsletter")
      .order("desc")
      .collect();
  },
});

// Get newsletter count
export const getEmailCount = query({
  handler: async (ctx) => {
    const emails = await ctx.db.query("newsletter").collect();
    return emails.length;
  },
});

// Remove email from newsletter
export const removeEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const existing = await ctx.db
      .query("newsletter")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
    
    if (!existing) {
      throw new Error("Email not found");
    }

    await ctx.db.delete(existing._id);
    return { success: true };
  },
}); 