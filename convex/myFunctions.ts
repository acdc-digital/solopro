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

export const createTestUserOnly = mutation({
  args: {
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const timestamp = Date.now();
      const email = args.email || `testuser_${timestamp}@example.com`;
      const name = args.name || `Test User ${timestamp}`;
      
      // Create a test user directly in the users table with minimal fields
      const userId = await ctx.db.insert("users", {
        email,
        name,
        isAnonymous: false,
      });
      
      console.log(`Created test user with ID: ${userId}, email: ${email}, name: ${name}`);
      
      // Fetch the created user to return full details
      const createdUser = await ctx.db.get(userId);
      
      return {
        success: true,
        userId,
        user: createdUser,
        message: `Test user created successfully with email: ${email}`
      };
    } catch (error) {
      console.error("Error creating test user:", error);
      return {
        success: false,
        error: String(error)
      };
    }
  },
});
