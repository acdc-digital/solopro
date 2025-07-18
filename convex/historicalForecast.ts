import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Action to generate and store individual forecasts for historical data
export const generateAndStoreIndividualForecast = action({
  args: {
    userId: v.id("users"),
    targetDate: v.string(),
    pastLogs: v.array(v.object({
      date: v.string(),
      score: v.number(),
      activities: v.array(v.string()),
      notes: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const { userId, targetDate, pastLogs } = args;
    
    console.log(`[generateAndStoreIndividualForecast] Generating forecast for ${targetDate} based on ${pastLogs.length} logs`);
    
    try {
      // Generate forecast using AI
      const forecasts = await ctx.runAction(internal.generator.generateForecastWithAI, {
        userId,
        pastLogs,
        targetDates: [targetDate],
      });
      
      if (!forecasts || forecasts.length === 0) {
        throw new Error("No forecast generated");
      }
      
      const forecast = forecasts[0];
      console.log(`[generateAndStoreIndividualForecast] Generated forecast for ${targetDate}: score ${forecast.emotionScore}/100, confidence ${forecast.confidence}%`);
      
      // Delete any existing forecast for this date
      await ctx.runMutation(internal.forecast.deleteExistingForecast, {
        userId,
        date: targetDate,
      });
      
      // Insert the new forecast
      const forecastId = await ctx.runMutation(internal.forecast.insertForecast, {
        userId,
        date: forecast.date,
        emotionScore: forecast.emotionScore,
        description: forecast.description || "Historical forecast",
        trend: forecast.trend || "stable",
        details: typeof forecast.details === 'string' ? forecast.details : `Forecast for ${targetDate}`,
        recommendation: forecast.recommendation || "",
        confidence: forecast.confidence || 0,
        basedOnDays: pastLogs.map(log => log.date),
      });
      
      return {
        success: true,
        forecastId,
        date: targetDate,
        emotionScore: forecast.emotionScore,
        confidence: forecast.confidence,
      };
      
    } catch (error) {
      console.error(`[generateAndStoreIndividualForecast] Error for ${targetDate}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        date: targetDate,
      };
    }
  },
});
