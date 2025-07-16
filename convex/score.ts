import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { SCORING_PROMPT } from "./prompts";

/**
 * Action: scoreDailyLog
 * Calculates an AI-generated score for a daily log entry
 */
export const scoreDailyLog = action({
  args: {
    userId: v.string(),
    date: v.string(),
  },
  handler: async (ctx, { userId, date }) => {
    console.log("🔍 Starting scoreDailyLog for user:", userId, "date:", date);
    
    // Debug: Check if imports are working
    console.log("📋 SCORING_PROMPT exists:", typeof SCORING_PROMPT !== 'undefined');
    console.log("📋 SCORING_PROMPT length:", SCORING_PROMPT?.length || 0);
    
    // Get the daily log from the database
    const dailyLog = await ctx.runQuery(api.dailyLogs.getDailyLog, {
      userId,
      date,
    });

    if (!dailyLog) {
      throw new Error(`No daily log found for userId=${userId}, date=${date}`);
    }

    console.log("✅ Found daily log:", dailyLog._id);

    // Prepare the content for OpenAI
    const userContent = JSON.stringify(dailyLog.answers, null, 2);

    // Get the OpenAI API key from environment variables
    const openAiApiKey = process.env.OPENAI_API_KEY;
    console.log("🔑 OpenAI API key check:", typeof openAiApiKey, openAiApiKey ? "exists" : "missing");
    
    if (!openAiApiKey) {
      console.error("❌ Missing OPENAI_API_KEY in environment variables");
      throw new Error("Missing OPENAI_API_KEY in environment!");
    }

    console.log("🔑 OpenAI API key found");

    // Debug: Check SCORING_PROMPT before using
    console.log("📋 About to use SCORING_PROMPT:", typeof SCORING_PROMPT, SCORING_PROMPT ? "exists" : "missing");
    
    // Prepare the request body for OpenAI API
    console.log("📝 Creating requestBody object...");
    
    const requestBody = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SCORING_PROMPT },
        {
          role: "user",
          content: `Here is the user's daily log in JSON:\n${userContent}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    };
    
    console.log("✅ RequestBody created successfully");

    console.log("📝 Request body prepared, making API call to OpenAI...");

    // Call OpenAI API with error handling
    let response;
    try {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiApiKey}`,
        },
        body: JSON.stringify(requestBody),
      });
    } catch (fetchError) {
      console.error("❌ Network error calling OpenAI API:", fetchError);
      throw new Error(`Network error: ${fetchError}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ OpenAI API error response:", response.status, errorText);
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    let completion;
    try {
      completion = await response.json();
    } catch (parseError) {
      console.error("❌ Failed to parse OpenAI response as JSON:", parseError);
      throw new Error(`Failed to parse OpenAI response: ${parseError}`);
    }

    console.log("📊 OpenAI response received");

    // Extract the score from the response
    let assistantMessage = completion.choices?.[0]?.message?.content?.trim() || "";
    let finalScore = parseInt(assistantMessage, 10);
    
    if (isNaN(finalScore) || finalScore < 0 || finalScore > 100) {
      console.warn("⚠️ Invalid score from OpenAI, using default:", assistantMessage);
      finalScore = 50; // default to 50 if invalid
    }

    console.log("🎯 Calculated score:", finalScore);

    // Track usage if available
    if (completion.usage) {
      try {
        await ctx.runMutation(api.openai.trackUsage, {
          userId,
          feature: "scoring",
          model: "gpt-4o-mini",
          promptTokens: completion.usage.prompt_tokens || 0,
          completionTokens: completion.usage.completion_tokens || 0,
          metadata: { date, score: finalScore }
        });
      } catch (trackingError) {
        console.error("[scoreDailyLog] Failed to track usage:", trackingError);
      }
    }

    // Update the score in the database
    await ctx.runMutation(api.score.updateLogScore, {
      logId: dailyLog._id,
      newScore: finalScore,
    });

    console.log("✅ Score updated successfully");

    return { score: finalScore };
  },
});

/**
 * Mutation: updateLogScore
 * Updates the score for a specific log entry
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