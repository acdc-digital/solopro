// /convex/generator.ts
import { v } from "convex/values";
import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { FORECASTING_PROMPT, DAILY_CONSULTATION_PROMPT, WEEKLY_INSIGHTS_PROMPT, AI_CONFIG, getColorCategory } from "./prompts";
import { api } from "./_generated/api";

// Define the expected structure from OpenAI response choices
interface OpenAIChatCompletion {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Define types for our forecast
interface PastLog {
  date: string;
  score: number;
  activities?: string[];
  notes?: string;
}

interface GeneratedForecast {
  date: string;
  emotionScore: number;
  description: string;
  trend: "up" | "down" | "stable";
  details: string;
  recommendation: string;
  confidence: number;
}

// Helper function (optional, can be kept here or moved)
const getISODateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// --- Action to Generate Forecast using AI (made public for retrospective analysis) ---
export const generateForecastWithAI = action({
  args: {
    userId: v.string(),
    pastLogs: v.array(v.object({
      date: v.string(),
      score: v.number(),
      activities: v.optional(v.array(v.string())),
      notes: v.optional(v.string())
    })),
    targetDates: v.array(v.string())
  },
  handler: async (ctx, args) => {
    const { userId, pastLogs, targetDates } = args;
    
    console.log(`[Action generateForecastWithAI] Generating forecasts for user ${userId} for dates:`, targetDates);
    console.log(`[Action generateForecastWithAI] Using ${pastLogs.length} past logs as training data`);

    // Get OpenAI API key
    const openAiApiKey = process.env.OPENAI_API_KEY;
    if (!openAiApiKey) {
      throw new Error("Missing OPENAI_API_KEY in environment!");
    }
    
    try {
      // Prepare the context data for the AI
      const pastLogsContext = pastLogs.map(log =>
        `Date: ${log.date}, Score: ${log.score}, Activities: ${log.activities?.join(', ') || 'None'}, Notes: ${log.notes || 'None'}`
      ).join('\n');

      const userContent = `Recent Logs (Last ${pastLogs.length} days):
${pastLogsContext}

Target forecast dates: ${targetDates.join(', ')}`;

      // Use optimized AI configuration for forecasting
      const config = AI_CONFIG.FORECASTING;
      const body = {
        model: config.model,
        messages: [
          { role: "system", content: FORECASTING_PROMPT },
          { role: "user", content: userContent },
        ],
        temperature: config.temperature,
        max_tokens: config.max_tokens,
        response_format: config.response_format,
      };

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
      const content = completion.choices?.[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }

      // Track OpenAI usage for cost monitoring
      if (completion.usage) {
        try {
          await ctx.runMutation(api.openai.trackUsage, {
            userId,
            feature: "forecast_generation",
            model: config.model,
            promptTokens: completion.usage.prompt_tokens || 0,
            completionTokens: completion.usage.completion_tokens || 0,
            metadata: { targetDates, logsCount: pastLogs.length }
          });
        } catch (trackingError) {
          console.error("[generateForecastWithAI] Failed to track usage:", trackingError);
          // Don't fail the main operation if tracking fails
        }
      }

      // Parse the JSON response
      let forecasts: GeneratedForecast[];
      try {
        forecasts = JSON.parse(content);
      } catch (parseError) {
        console.error("Failed to parse AI response:", content);
        throw new Error("Invalid JSON response from AI");
      }

      // Validate and enhance the forecasts
      const validatedForecasts = forecasts.map((forecast, index) => {
        const category = getColorCategory(forecast.emotionScore);
        return {
          ...forecast,
          description: category?.name || getDescriptionFromScore(forecast.emotionScore),
          // Ensure all required fields are present
          trend: forecast.trend || "stable",
          confidence: forecast.confidence || Math.max(50, 85 - (index * 15)),
        };
      });

      console.log(`[Action generateForecastWithAI] Successfully generated ${validatedForecasts.length} AI forecasts`);
      return validatedForecasts;

    } catch (error: any) {
      console.error("[Action generateForecastWithAI] Error generating forecasts:", error);

      // Fallback to simple forecast generation if AI fails
      console.log("[Action generateForecastWithAI] Falling back to simple forecast generation");
      const fallbackForecasts: GeneratedForecast[] = targetDates.map((date, index) => {
        const sortedLogs = [...pastLogs].sort((a, b) => a.date.localeCompare(b.date));
        const lastLog = sortedLogs[sortedLogs.length - 1];
        const lastScore = lastLog?.score || 50;
        
        const variation = (Math.random() * 10 - 5) * (index + 1) * 0.3;
        let predictedScore = Math.round(Math.max(0, Math.min(100, lastScore + variation)));
        
        let trend: "up" | "down" | "stable"; 
        if (predictedScore > lastScore + 3) trend = "up";
        else if (predictedScore < lastScore - 3) trend = "down";
        else trend = "stable";
        
        const confidence = Math.round(85 - (index * 15));
        const category = getColorCategory(predictedScore);
        
        return {
          date,
          emotionScore: predictedScore,
          description: category?.name || getDescriptionFromScore(predictedScore),
          trend,
          details: generateDetails(predictedScore, trend, index),
          recommendation: generateRecommendation(predictedScore),
          confidence
        };
      });
      
      return fallbackForecasts;
    }
  }
});

// --- Helper Functions ---
function getDescriptionFromScore(score: number): string {
  if (score >= 90) return "Exceptional Day";
  if (score >= 80) return "Excellent Day";
  if (score >= 70) return "Very Good Day";
  if (score >= 60) return "Good Day";
  if (score >= 50) return "Balanced Day";
  if (score >= 40) return "Mild Challenges";
  if (score >= 30) return "Challenging Day";
  if (score >= 20) return "Difficult Day";
  if (score >= 10) return "Very Challenging";
  return "Extremely Difficult";
}

function generateDetails(score: number, trend: string, dayIndex: number): string {
  const dayTerms = ["tomorrow", "the day after tomorrow", "in two days"];
  const dayTerm = dayTerms[dayIndex] || "in the coming days";
  
  if (score >= 80) {
    return `Based on your patterns, you're likely to have an excellent day ${dayTerm}. Your recent positive momentum suggests high emotional wellbeing will continue.`;
  } else if (score >= 60) {
    return `Your forecast shows a good day ${dayTerm}. You tend to maintain positive emotions in similar circumstances, which should continue.`;
  } else if (score >= 40) {
    return `Expecting a balanced day ${dayTerm}. Your emotional patterns suggest you'll experience both challenges and rewards in moderate amounts.`;
  } else if (score >= 20) {
    return `You may face some challenges ${dayTerm}. Your patterns suggest this could be a somewhat difficult period, but temporary.`;
  } else {
    return `Your forecast indicates significant challenges ${dayTerm}. Based on your patterns, this may be a difficult day emotionally, but remember that these periods are temporary.`;
  }
}

function generateRecommendation(score: number): string {
  if (score >= 80) {
    return "Continue your current activities and consider ways to share your positive energy with others.";
  } else if (score >= 60) {
    return "Maintain your healthy routines and consider planning something enjoyable to further boost your wellbeing.";
  } else if (score >= 40) {
    return "Focus on balanced self-care and set reasonable expectations for your tasks and interactions.";
  } else if (score >= 20) {
    return "Prioritize rest and self-compassion. Consider reducing commitments if possible and focus on activities that have improved your mood in the past.";
  } else {
    return "This is a time to be especially gentle with yourself. Reach out to supportive people, minimize stressors, and focus on basic self-care like rest and nourishment.";
  }
}

// --- Action: Generate Daily Consultation using fetch ---
export const generateDailyConsultation = action({
  args: {
    userId: v.string(),
    selectedDayData: v.object({
      date: v.string(),
      dayName: v.string(),
      emotionScore: v.optional(v.number()),
      notesForSelectedDay: v.optional(v.string()),
      isFuture: v.optional(v.boolean()),
    }),
    sevenDayContextData: v.array(
      v.object({
        date: v.string(),
        score: v.optional(v.number()),
        notes: v.optional(v.string()),
        isFuture: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { userId, selectedDayData, sevenDayContextData } = args;

    console.log(
      `[Action generateDailyConsultation] User: ${userId}, Day: ${selectedDayData.date} (${selectedDayData.dayName}), isFuture: ${selectedDayData.isFuture}`
    );
    
    // --- Get OpenAI API Key ---
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error("[Action generateDailyConsultation] OPENAI_API_KEY environment variable not set.");
        return { success: false, error: "AI service configuration error. Please contact support."};
    }

    // --- Construct the Context ---
    const contextString = sevenDayContextData
      .map(day =>
        `Date: ${day.date}, Score: ${day.score ?? 'N/A'}, Type: ${day.isFuture ? 'Forecast' : 'Log'}, Notes: ${day.notes ?? 'None'}`
      )
      .join('\n');

    const userContent = `Selected Day: ${selectedDayData.dayName}, ${selectedDayData.date}
Status: ${selectedDayData.isFuture ? 'Future forecast' : 'Past/Current log'}
Score: ${selectedDayData.emotionScore ?? 'Not recorded'}
Notes: ${selectedDayData.notesForSelectedDay ?? 'None'}

7-Day Context:
${contextString}`;

    console.log("[Action generateDailyConsultation] Sending prompt to OpenAI via fetch.");

    // --- Call OpenAI API using optimized config ---
    try {
      const config = AI_CONFIG.CONSULTATION;
      const requestBody = {
        model: config.model,
        messages: [
          { role: "system", content: DAILY_CONSULTATION_PROMPT },
          { role: "user", content: userContent }
        ],
        max_tokens: config.max_tokens,
        temperature: config.temperature,
      };

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Action generateDailyConsultation] OpenAI fetch error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`AI service request failed: ${response.statusText} - ${errorText}`);
      }

      const completion: OpenAIChatCompletion = await response.json();
      const consultationText = completion.choices?.[0]?.message?.content?.trim();

      if (!consultationText) {
        console.error("[Action generateDailyConsultation] OpenAI fetch response content is empty.", completion);
        return { success: false, error: "AI service returned an empty response." };
      }

      // Track OpenAI usage for cost monitoring
      if (completion.usage) {
        try {
          await ctx.runMutation(api.openai.trackUsage, {
            userId,
            feature: "daily_consultation",
            model: config.model,
            promptTokens: completion.usage.prompt_tokens || 0,
            completionTokens: completion.usage.completion_tokens || 0,
            metadata: { selectedDate: selectedDayData.date, contextDays: sevenDayContextData.length }
          });
        } catch (trackingError) {
          console.error("[generateDailyConsultation] Failed to track usage:", trackingError);
          // Don't fail the main operation if tracking fails
        }
      }

      console.log("[Action generateDailyConsultation] Received consultation via fetch:", consultationText);
      return { success: true, consultationText };

    } catch (error: any) {
      console.error("[Action generateDailyConsultation] Error calling OpenAI API via fetch:", error);
      let errorMessage = "Failed to generate details due to an AI service error.";
      // Include the specific error message if available
      if (error instanceof Error && error.message) {
         errorMessage += ` Details: ${error.message}`;
      }
      return { success: false, error: errorMessage };
    }
  },
});

// --- Action: Generate Weekly Insights using fetch ---
export const generateWeeklyInsights = action({
  args: {
    userId: v.string(),
    sevenDayContextData: v.array(
      v.object({
        date: v.string(),
        score: v.optional(v.number()),
        isFuture: v.optional(v.boolean()),
        description: v.optional(v.string()),
        details: v.optional(v.string()),
        trend: v.optional(v.string()),
        // any other fields from DayDataItem that might be useful for context
      })
    ),
  },
  handler: async (ctx, args) => {
    const { userId, sevenDayContextData } = args;

    console.log(
      `[Action generateWeeklyInsights] User: ${userId}, generating insights for a 7-day period.`
    );

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[Action generateWeeklyInsights] OPENAI_API_KEY environment variable not set.");
      return { success: false, error: "AI service configuration error. Please contact support." };
    }

    const formattedSevenDayData = sevenDayContextData
      .map(day => {
        let daySummary = `  - Date: ${day.date}, Emotion Score: ${day.score ?? 'N/A'}`;
        daySummary += `, Type: ${day.isFuture ? 'Forecast' : 'Log'}`;
        if (day.description) daySummary += `, Description: ${day.description}`;
        if (day.details && !day.isFuture) daySummary += `, Details: ${day.details}`;
        if (day.trend) daySummary += `, Trend: ${day.trend}`;
        return daySummary;
      })
      .join('\n');

    const userContent = `7-Day Emotional Data:
${formattedSevenDayData}`;

    console.log("[Action generateWeeklyInsights] Sending prompt to OpenAI via fetch.");

    // --- Call OpenAI API using optimized config ---
    try {
      const config = AI_CONFIG.INSIGHTS;
      const requestBody = {
        model: config.model,
        messages: [
          { role: "system", content: WEEKLY_INSIGHTS_PROMPT },
          { role: "user", content: userContent }
        ],
        temperature: config.temperature,
        max_tokens: config.max_tokens,
      };

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[Action generateWeeklyInsights] OpenAI API error: ${response.status} ${response.statusText}`, errorBody);
        return { success: false, error: `AI service error: ${response.statusText}. Details: ${errorBody}` };
      }

      const jsonResponse = await response.json() as OpenAIChatCompletion; // Using existing OpenAIChatCompletion type

      if (jsonResponse.choices && jsonResponse.choices[0] && jsonResponse.choices[0].message && jsonResponse.choices[0].message.content) {
        const content = jsonResponse.choices[0].message.content;
        console.log("[Action generateWeeklyInsights] Raw AI response content:", content);
        
        // Track OpenAI usage for cost monitoring
        if (jsonResponse.usage) {
          try {
            await ctx.runMutation(api.openai.trackUsage, {
              userId,
              feature: "weekly_insights",
              model: config.model,
              promptTokens: jsonResponse.usage.prompt_tokens || 0,
              completionTokens: jsonResponse.usage.completion_tokens || 0,
              metadata: { contextDays: sevenDayContextData.length }
            });
          } catch (trackingError) {
            console.error("[generateWeeklyInsights] Failed to track usage:", trackingError);
            // Don't fail the main operation if tracking fails
          }
        }
        
        try {
          const parsedContent = JSON.parse(content);
          if (parsedContent && Array.isArray(parsedContent.insights)) {
            const insightsArray = parsedContent.insights.filter((item: any) => typeof item === 'string');
            console.log("[Action generateWeeklyInsights] Successfully parsed insights:", insightsArray);
            return { success: true, insights: insightsArray };
          } else {
            console.error("[Action generateWeeklyInsights] Parsed content is not in the expected format (missing 'insights' array):", parsedContent);
            return { success: false, error: "AI response format error. Insights array not found." };
          }
        } catch (e: any) {
          console.error("[Action generateWeeklyInsights] Error parsing AI response content:", e.message, "Raw content:", content);
          
          // Fallback: try to extract insights from plain text response
          try {
            // Split by newlines and filter out empty lines, then take the meaningful ones
            const fallbackInsights = content
              .split('\n')
              .map((line: string) => line.trim())
              .filter((line: string) => line.length > 0 && !line.startsWith('{') && !line.startsWith('}'))
              .filter((line: string) => line.length > 20) // Filter out very short lines
              .slice(0, 5); // Take max 5 insights
            
            if (fallbackInsights.length > 0) {
              console.log("[Action generateWeeklyInsights] Fallback parsing successful:", fallbackInsights);
              return { success: true, insights: fallbackInsights };
            }
          } catch (fallbackError) {
            console.error("[Action generateWeeklyInsights] Fallback parsing also failed:", fallbackError);
          }
          
          return { success: false, error: "AI response format error. Could not parse insights." };
        }
      } else {
        console.error("[Action generateWeeklyInsights] Unexpected OpenAI response structure:", jsonResponse);
        return { success: false, error: "AI service returned an unexpected response structure." };
      }
    } catch (e: any) {
      console.error(`[Action generateWeeklyInsights] Error calling OpenAI: ${e.message}`);
      return { success: false, error: `Failed to generate insights: ${e.message}` };
    }
  }
});