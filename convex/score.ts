import { action, mutation } from "./_generated/server";
import { v } from "convex/values";

// Import your generated API so we can call runQuery(api.dailyLogs.getDailyLog,...)
import { api } from "./_generated/api";
import { SCORING_PROMPT, AI_CONFIG } from "./prompts";

/**
 * Action: scoreDailyLog
 * 1) Run a query to get the daily log from DB
 * 2) Call OpenAI to compute a 0-100 score
 * 3) Run a mutation to update that log's score
 */
export const scoreDailyLog = action({
  args: {
    userId: v.string(),
    date: v.string(),
  },
  handler: async (ctx, { userId, date }) => {
    // 1) Retrieve the daily log by calling your existing getDailyLog query
    const dailyLog = await ctx.runQuery(api.dailyLogs.getDailyLog, {
      userId,
      date,
    });

    if (!dailyLog) {
      throw new Error(`No daily log found for userId=${userId}, date=${date}`);
    }

    // 2) Use the standardized scoring prompt

    // JSONify the daily log's answers
    const userContent = JSON.stringify(dailyLog.answers, null, 2);

    // 3) Access your OpenAI API key from process.env
    // Make sure you set it with: npx convex secrets set OPENAI_API_KEY "..."
    const openAiApiKey = process.env.OPENAI_API_KEY;
    if (!openAiApiKey) {
      throw new Error("Missing OPENAI_API_KEY in environment!");
    }

    // Prepare the request body for OpenAI using optimized config
    const config = AI_CONFIG.SCORING;
    const body = {
      model: config.model,
      messages: [
        { role: "system", content: SCORING_PROMPT },
        {
          role: "user",
          content: `Here is the user's daily log in JSON:\n${userContent}`,
        },
      ],
      temperature: config.temperature,
      max_tokens: config.max_tokens,
    };

    // 4) Make the external HTTP request (only allowed in an action)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const completion = await response.json();
    let assistantMessage = completion.choices?.[0]?.message?.content?.trim() || "";
    let finalScore = parseInt(assistantMessage, 10);
    if (isNaN(finalScore)) {
      finalScore = 50; // default to 50 if invalid
    }

    // Track OpenAI usage for cost monitoring
    if (completion.usage) {
      try {
        await ctx.runMutation(api.openai.trackUsage, {
          userId,
          feature: "scoring",
          model: config.model,
          promptTokens: completion.usage.prompt_tokens || 0,
          completionTokens: completion.usage.completion_tokens || 0,
          metadata: { date, score: finalScore }
        });
      } catch (trackingError) {
        console.error("[scoreDailyLog] Failed to track usage:", trackingError);
        // Don't fail the main operation if tracking fails
      }
    }

    // 5) Update the daily log's score via a mutation
    await ctx.runMutation(api.score.updateLogScore, {
      logId: dailyLog._id,
      newScore: finalScore,
    });

    return { score: finalScore };
  },
});

/**
 * Mutation: updateLogScore
 * - Directly patches the given log doc's `score`.
 */
export const updateLogScore = mutation({
  args: {
    logId: v.id("logs"),
    newScore: v.number(),
  },
  handler: async ({ db }, { logId, newScore }) => {
    await db.patch(logId, {
      score: newScore,
      updatedAt: Date.now(),
    });
    return db.get(logId);
  },
});