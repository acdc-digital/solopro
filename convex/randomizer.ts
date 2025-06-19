import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { RANDOM_LOG_PROMPT, AI_CONFIG } from "./prompts";

// Define the expected structure of the LLM's output for type safety
interface GeneratedLogData {
  overallMood: number;
  workSatisfaction: number;
  personalLifeSatisfaction: number;
  balanceRating: number;
  sleep: number;
  exercise: boolean;
  highlights: string;
  challenges: string;
  tomorrowGoal: string;
}

/**
 * The shape of data returned by the LLM's chat completion API.
 */
interface OpenAIChatCompletion {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

/**
 * Save user instructions for random log generation
 */
export const saveInstructions = mutation({
  args: {
    userId: v.string(),
    instructions: v.string(),
  },
  handler: async (ctx, { userId, instructions }) => {
    const existingInstructions = await ctx.db
      .query("randomizer")
      .withIndex("byUserId", q => q.eq("userId", userId))
      .first();

    const now = Date.now();
    
    if (existingInstructions) {
      // Update existing instructions
      return await ctx.db.patch(existingInstructions._id, {
        instructions,
        updatedAt: now,
      });
    } else {
      // Insert new instructions
      return await ctx.db.insert("randomizer", {
        userId,
        instructions,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

/**
 * Get user instructions for random log generation
 */
export const getInstructions = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    const userInstructions = await ctx.db
      .query("randomizer")
      .withIndex("byUserId", q => q.eq("userId", userId))
      .first();
    
    return userInstructions?.instructions || null;
  },
});

export const generateRandomLog = action({
  args: {
    date: v.string(), // Expecting YYYY-MM-DD
    userId: v.optional(v.string()), // Optional userId to fetch custom instructions
  },
  handler: async (ctx, { date, userId }): Promise<GeneratedLogData> => {
    console.log("Executing generateRandomLog in new randomizer.ts file");
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY is not set. Random log generation will not work.");
      throw new Error("OpenAI API key is not configured in environment variables.");
    }

    // Get user's custom instructions if userId is provided
    let userInstructions = null;
    if (userId) {
      userInstructions = await ctx.runQuery(api.randomizer.getInstructions, { userId });
      console.log("Using custom instructions:", !!userInstructions);
    }

    // Use the standardized random log prompt
    const systemPrompt = RANDOM_LOG_PROMPT(date, userInstructions || undefined);

    // Use optimized AI configuration
    const config = AI_CONFIG.RANDOM_LOG;
    const requestBody = {
      model: config.model,
      response_format: config.response_format,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a daily log for ${date}.` },
      ],
      temperature: config.temperature,
      max_tokens: config.max_tokens,
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API Error details:", errorText);
        throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }

      const completion = await response.json() as OpenAIChatCompletion;
      const responseContent = completion.choices?.[0]?.message?.content;

      if (!responseContent) {
        console.error("OpenAI response content is empty for date:", date, completion);
        throw new Error("OpenAI returned an empty or malformed response.");
      }

      // The model with json_object response_format should return valid JSON string.
      const generatedData = JSON.parse(responseContent) as GeneratedLogData;
      return generatedData;

    } catch (error) {
      console.error(`Error in generateRandomLog for date ${date}:`, error);
      // Ensure we throw an error that the client can handle
      if (error instanceof Error) {
        throw error; // Re-throw if it's already an Error object
      }
      throw new Error("Failed to generate random log content due to an unexpected internal error.");
    }
  },
}); 