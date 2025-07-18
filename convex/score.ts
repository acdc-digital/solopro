import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { SCORING_PROMPT } from "./prompts";

/**
 * Action: scoreDailyLogNew
 * Calculates an AI-generated score for a daily log entry
 */
export const scoreDailyLogNew = action({
  args: {
    userId: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, date } = args;
    console.log("🔍 Starting scoreDailyLogNew for user:", userId, "date:", date);
    
    try {
      // Get the daily log from the database
      const dailyLog = await ctx.runQuery(api.dailyLogs.getDailyLog, {
        userId,
        date,
      });

      if (!dailyLog) {
        throw new Error(`No daily log found for userId=${userId}, date=${date}`);
      }

      console.log("✅ Found daily log:", dailyLog._id);

      // For now, let's just return a simple calculated score without OpenAI
      // to test if the basic function works
      const answers = dailyLog.answers;
      
      // Simple scoring algorithm
      let score = 5; // base score
      
      if (answers.overallMood) {
        score = answers.overallMood;
      }
      
      // Add some basic adjustments
      if (answers.exercise) {
        score += 0.5;
      }
      
      if (answers.workSatisfaction && answers.workSatisfaction > 7) {
        score += 0.3;
      }
      
      // Ensure score is between 1-10
      score = Math.max(1, Math.min(10, score));
      
      console.log("🎯 Calculated simple score:", score);

      // Update the score in the database
      await ctx.runMutation(api.score.updateLogScore, {
        logId: dailyLog._id,
        newScore: score,
      });

      console.log("✅ Score updated successfully");

      // Trigger feed generation for this scored log
      try {
        console.log("🔄 Generating feed entry for scored log...");
        const feedResult = await ctx.runAction(api.feed.generateFeedForDailyLog, {
          userId,
          date,
        });
        console.log("✅ Feed entry generated successfully");
      } catch (feedError) {
        console.error("⚠️ Failed to generate feed entry:", feedError);
        // Don't throw here - scoring was successful, feed generation is secondary
      }

      return { score: score };
      
    } catch (error) {
      console.error("❌ Error in scoreDailyLogNew:", error);
      throw error;
    }
  },
});

/**
 * Action: scoreDailyLog
 * Calculates an AI-generated score for a daily log entry using OpenAI
 */
export const scoreDailyLog = action({
  args: {
    userId: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, date } = args;
    console.log("🔍 Starting AI-powered scoreDailyLog for user:", userId, "date:", date);
    
    try {
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
      const apiKey = (process as any).env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing OPENAI_API_KEY in environment!");
      }

      console.log("🔑 OpenAI API key found");

      // Check SCORING_PROMPT
      if (!SCORING_PROMPT) {
        throw new Error("SCORING_PROMPT is not available");
      }
      
      console.log("📋 SCORING_PROMPT available");
      
      // Create request body for OpenAI
      const openAIRequest = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: SCORING_PROMPT
          },
          {
            role: "user",
            content: `Here is the user's daily log in JSON:\n${userContent}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      };
      
      console.log("✅ OpenAI request body created");

      // Call OpenAI API
      const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(openAIRequest),
      });

      if (!openAIResponse.ok) {
        const errorText = await openAIResponse.text();
        console.error("❌ OpenAI API error:", openAIResponse.status, errorText);
        throw new Error(`OpenAI API error (${openAIResponse.status}): ${errorText}`);
      }

      const completion = await openAIResponse.json();
      console.log("📊 OpenAI response received");

      // Extract the score from the response
      const assistantMessage = completion.choices?.[0]?.message?.content?.trim() || "";
      let aiScore = parseInt(assistantMessage, 10);
      
      if (isNaN(aiScore) || aiScore < 1 || aiScore > 10) {
        console.warn("⚠️ Invalid score from OpenAI, using default:", assistantMessage);
        aiScore = 5; // default to 5 (middle score) if invalid
      }

      // Convert from 1-10 scale to 1-100 scale for the heatmap
      const finalScore = Math.round(aiScore * 10);

      console.log(`🎯 AI-calculated score: ${aiScore}/10 -> converted to ${finalScore}/100`);

      // Track usage if available
      if (completion.usage) {
        try {
          await ctx.runMutation(api.openai.trackUsage, {
            userId,
            feature: "scoring",
            model: "gpt-4o-mini",
            promptTokens: completion.usage.prompt_tokens || 0,
            completionTokens: completion.usage.completion_tokens || 0,
            metadata: { date, score: finalScore, aiScore }
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

      console.log("✅ AI score updated successfully");

      // Trigger feed generation for this scored log
      try {
        console.log("🔄 Generating feed entry for scored log...");
        const feedResult = await ctx.runAction(api.feed.generateFeedForDailyLog, {
          userId,
          date,
        });
        console.log("✅ Feed entry generated successfully");
      } catch (feedError) {
        console.error("⚠️ Failed to generate feed entry:", feedError);
        // Don't throw here - scoring was successful, feed generation is secondary
      }

      return { score: finalScore };
      
    } catch (error) {
      console.error("❌ Error in AI scoreDailyLog:", error);
      throw error;
    }
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