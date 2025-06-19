// FEED
// /Users/matthewsimon/Documents/Github/solopro/convex/feed.ts

import { query, action, mutation } from "./_generated/server";
import { v } from "convex/values"; // Fixed import for v
import { api } from "./_generated/api";
import { Id, Doc } from "./_generated/dataModel";
import { FEED_SUMMARY_PROMPT, AI_CONFIG } from "./prompts";

/**
 * The shape of data returned by the LLM's chat completion API.
 * We define a minimal type for TypeScript.
 */
interface OpenAIChatCompletion {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

/**
 * 1) listFeedMessages query:
 *    Fetch all feed messages for a given user.
 *    (Optionally, you could also filter by date or do ordering here.)
 */
export const listFeedMessages = query({
  args: {
    userId: v.optional(v.string()), // Must match the string stored in `feed.userId`
  },
  // Return type is an array of feed docs
  handler: async ({ db }, { userId }): Promise<Doc<"feed">[]> => {
    // We assume your `feed` table has fields: userId, date, message, createdAt
    return await db
      .query("feed")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc") // or "asc", whichever you prefer
      .collect();
  },
});

/**
 * 2) generateFeedForDailyLog action:
 *    - Calls getDailyLog to fetch the user's daily log
 *    - Calls OpenAI to get a short summary or encouragement text
 *    - Inserts that text into the "feed" table
 *
 *    Returns { reply: string }
 */
export const generateFeedForDailyLog = action({
  args: {
    userId: v.string(), // The doc ID or authId for logs
    date: v.string(),   // "YYYY-MM-DD"
  },
  handler: async (ctx, { userId, date }): Promise<{ reply: string }> => {
    // 1) Fetch the daily log from DB by calling your dailyLogs.getDailyLog query
    const dailyLog = await ctx.runQuery(api.dailyLogs.getDailyLog, {
      userId,
      date,
    });
    if (!dailyLog) {
      throw new Error(`No daily log found for userId=${userId}, date=${date}`);
    }

    // 2) Use the standardized feed summary prompt

    // Convert dailyLog.answers to JSON for the LLM
    const userContent = JSON.stringify(dailyLog.answers, null, 2);

    // 3) Make sure your OpenAI key is available
    const openAiApiKey = process.env.OPENAI_API_KEY;
    if (!openAiApiKey) {
      throw new Error("Missing OPENAI_API_KEY in environment!");
    }

    // 4) Call OpenAI's Chat Completion with optimized config
    const config = AI_CONFIG.FEED;
    const body = {
      model: config.model,
      messages: [
        { role: "system", content: FEED_SUMMARY_PROMPT },
        {
          role: "user",
          content: `Here is the user's daily log in JSON:\n${userContent}`,
        },
      ],
      temperature: config.temperature,
      max_tokens: config.max_tokens,
    };

    const response: Response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI error: ${text}`);
    }

    const completion: OpenAIChatCompletion = await response.json();
    const assistantReply: string =
      completion.choices?.[0]?.message?.content?.trim() || "(No response)";

    // 5) Store the LLM response in the "feed" table
    await ctx.runMutation(api.feed.storeFeedMessage, {
      userId,
      date,
      message: assistantReply,
    });

    return { reply: assistantReply };
  },
});

/**
 * 3) storeFeedMessage mutation:
 *    Saves a single feed "message" in your "feed" table.
 */
export const storeFeedMessage = mutation({
  args: {
    userId: v.string(),
    date: v.string(),
    message: v.string(),
  },
  handler: async ({ db }, { userId, date, message }) => {
    // Insert into "feed" table (defined in your schema)
    return db.insert("feed", {
      userId,
      date,
      message,
      createdAt: Date.now(),
    });
  },
});

/**
 * Add a comment directly to a feed document
 */
export const addComment = mutation({
  args: {
    feedId: v.id("feed"),
    userId: v.string(),
    userName: v.string(),
    userImage: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { feedId, userId, userName, userImage, content } = args;
    
    // Get the feed document
    const feed = await ctx.db.get(feedId);
    
    // If feed doesn't exist, throw error
    if (!feed) {
      throw new Error("Feed not found");
    }
    
    // Create the new comment object
    const newComment = {
      userId,
      userName,
      userImage,
      content,
      createdAt: Date.now(),
    };
    
    // Append to existing comments array or create a new array
    const comments = feed.comments || [];
    
    // Update the feed document with the new comment
    await ctx.db.patch(feedId, {
      comments: [...comments, newComment],
    });
    
    return true;
  },
});

/**
 * Get all comments for a specific feed document
 */
export const getComments = query({
  args: {
    feedId: v.id("feed"),
  },
  handler: async (ctx, args) => {
    const feed = await ctx.db.get(args.feedId);
    
    if (!feed || !feed.comments) {
      return [];
    }
    
    return feed.comments;
  },
});

/**
 * Add a tag to a feed item
 */
export const addTag = mutation({
  args: {
    feedId: v.id("feed"),
    userId: v.string(),
    tagId: v.string(),
    tagName: v.string(),
    tagColor: v.string(),
  },
  handler: async (ctx, args) => {
    const { feedId, userId, tagId, tagName, tagColor } = args;
    
    // Verify the feed exists and belongs to this user
    const feed = await ctx.db.get(feedId);
    if (!feed) {
      throw new Error("Feed not found");
    }
    
    if (feed.userId !== userId) {
      throw new Error("Cannot add tag to another user's feed");
    }
    
    // Check if this tag already exists for this feed
    const existingTag = await ctx.db
      .query("feedTags")
      .filter((q) => 
        q.and(
          q.eq(q.field("feedId"), feedId),
          q.eq(q.field("tagId"), tagId)
        )
      )
      .first();
    
    // If the tag already exists, don't create a duplicate
    if (existingTag) {
      return existingTag._id;
    }
    
    // Create a new tag
    return await ctx.db.insert("feedTags", {
      userId,
      feedId,
      tagId,
      tagName,
      tagColor,
      createdAt: Date.now(),
    });
  },
});

/**
 * Remove a tag from a feed item
 */
export const removeTag = mutation({
  args: {
    feedId: v.id("feed"),
    userId: v.string(),
    tagId: v.string(),
  },
  handler: async (ctx, args) => {
    const { feedId, userId, tagId } = args;
    
    // Find the tag
    const tag = await ctx.db
      .query("feedTags")
      .filter((q) => 
        q.and(
          q.eq(q.field("feedId"), feedId),
          q.eq(q.field("tagId"), tagId),
          q.eq(q.field("userId"), userId)
        )
      )
      .first();
    
    if (!tag) {
      throw new Error("Tag not found");
    }
    
    // Delete the tag
    await ctx.db.delete(tag._id);
    
    return true;
  },
});

/**
 * Get all tags for a user's feed items
 */
export const getFeedTags = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    
    return await ctx.db
      .query("feedTags")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});