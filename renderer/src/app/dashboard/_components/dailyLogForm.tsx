// DAILY LOG FORM
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/dashboard/_components/dailyLogForm.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2, Zap, X, Check, Plus, Minus } from "lucide-react";
import { useFeedStore } from "@/store/feedStore";
import { addDays, format, subDays } from "date-fns";
import { useConvex } from "convex/react";

interface DailyLogFormData {
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

interface DailyLogFormProps {
  onClose: () => void; // still used for cancel button
  date?: string;
}

/**
 * Client‑side form for creating/updating a daily log.
 * Server logic lives in `convex/dailyLogs.ts`.
 */
export default function DailyLogForm({ onClose, date }: DailyLogFormProps) {
  console.log("DailyLogForm mounted");
  const { isAuthenticated, isLoading: userLoading, userId } = useConvexUser();

  /* ────────────────────────────────────────── */
  /* Feed store hooks                           */
  /* ────────────────────────────────────────── */
  const setActiveTab     = useFeedStore((s) => s.setActiveTab);
  const setSidebarOpen   = useFeedStore((s) => s.setSidebarOpen);
  const setSelectedDate  = useFeedStore((s) => s.setSelectedDate);

  const effectiveDate = date ?? new Date().toISOString().split("T")[0];

  // Fetch existing log for the day
  const existingLog = useQuery(
    api.dailyLogs.getDailyLog,
    userId ? { date: effectiveDate, userId } : "skip"
  );

  const dailyLogMutation = useMutation(api.dailyLogs.dailyLog);
  const scoreDailyLog    = useAction(api.score.scoreDailyLog);
  const generateFeed     = useAction(api.feed.generateFeedForDailyLog);
  const generateForecast = useAction(api.forecast.generateForecast);
  const generateRandomLog = useAction(api.randomizer.generateRandomLog);
  const convex = useConvex();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DailyLogFormData>({
    defaultValues: {
      overallMood: 5,
      workSatisfaction: 5,
      personalLifeSatisfaction: 5,
      balanceRating: 5,
      sleep: 7,
      exercise: false,
      highlights: "",
      challenges: "",
      tomorrowGoal: "",
    },
  });

  /* ────────────────────────────────────────── */
  /* Populate defaults when a log already exists */
  /* ────────────────────────────────────────── */
  useEffect(() => {
    if (existingLog?.answers) {
      reset({
        overallMood: existingLog.answers.overallMood ?? 5,
        workSatisfaction: existingLog.answers.workSatisfaction ?? 5,
        personalLifeSatisfaction: existingLog.answers.personalLifeSatisfaction ?? 5,
        balanceRating: existingLog.answers.balanceRating ?? 5,
        sleep: existingLog.answers.sleep ?? 7,
        exercise: existingLog.answers.exercise ?? false,
        highlights: existingLog.answers.highlights ?? "",
        challenges: existingLog.answers.challenges ?? "",
        tomorrowGoal: existingLog.answers.tomorrowGoal ?? "",
      });
    }
  }, [existingLog, reset]);

  /* ────────────────────────────────────────── */
  /* Local state                               */
  /* ────────────────────────────────────────── */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ────────────────────────────────────────── */
  /*  User ID validation                        */
  /* ────────────────────────────────────────── */
  if (userLoading || !isAuthenticated || !userId) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm text-zinc-500">Loading...</span>
      </div>
    );
  }

  /* ────────────────────────────────────────── */
  /* Form submit handler                       */
  /* ────────────────────────────────────────── */
  const onSubmit = async (data: DailyLogFormData) => {
    console.log("DailyLogForm onSubmit called", { effectiveDate, userId, data });
    setError(null);
    setIsSubmitting(true);

    try {
      await dailyLogMutation({ date: effectiveDate, userId, answers: data });
      await scoreDailyLog({ date: effectiveDate, userId });
      await generateFeed({ date: effectiveDate, userId });

      // --- Check if last 4 days (today + previous 3) all have logs ---
      const today = new Date(effectiveDate);
      const startDate = format(subDays(today, 3), 'yyyy-MM-dd');
      const endDate = format(today, 'yyyy-MM-dd');
      const logs = await convex.query(api.forecast.getLogsForUserInRangeSimple, {
        userId,
        startDate,
        endDate,
      });
      console.log("Fetched logs for last 4 days:", logs);
      const logDates = logs.map((log: { date: string }) => log.date);
      const expectedDates = Array.from({ length: 4 }, (_, i) => format(subDays(today, 3 - i), 'yyyy-MM-dd'));
      console.log("Expected dates:", expectedDates);
      const allPresent = expectedDates.every(date => logDates.includes(date));
      console.log("All present?", allPresent);
      if (allPresent) {
        const result = await generateForecast({ userId, startDate, endDate });
        console.log("generateForecast result:", result);
      }

      /* ───── Switch the sidebar to Feed view ───── */
      setSelectedDate(effectiveDate);
      setActiveTab("feed");
      setSidebarOpen(true);
    } catch (err) {
      console.error("Failed to save daily log:", err);
      setError(err instanceof Error ? err.message : "Failed to save log");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ────────────────────────────────────────── */
  /* Random generation handler                 */
  /* ────────────────────────────────────────── */
  const handleGenerateRandom = async () => {
    setError(null);
    setIsGenerating(true);
    try {
      if (!generateRandomLog) {
        throw new Error("Random generation feature is not available.");
      }
      const generatedData = await generateRandomLog({ 
        date: effectiveDate,
        userId
      });

      if (generatedData && typeof generatedData === 'object') {
        const validatedData: Partial<DailyLogFormData> = {};
        validatedData.overallMood = typeof generatedData.overallMood === 'number' ? Math.max(1, Math.min(10, Math.round(generatedData.overallMood))) : 5;
        validatedData.workSatisfaction = typeof generatedData.workSatisfaction === 'number' ? Math.max(1, Math.min(10, Math.round(generatedData.workSatisfaction))) : 5;
        validatedData.personalLifeSatisfaction = typeof generatedData.personalLifeSatisfaction === 'number' ? Math.max(1, Math.min(10, Math.round(generatedData.personalLifeSatisfaction))) : 5;
        validatedData.balanceRating = typeof generatedData.balanceRating === 'number' ? Math.max(1, Math.min(10, Math.round(generatedData.balanceRating))) : 5;
        // Ensure sleep is rounded to nearest 0.5
        validatedData.sleep = typeof generatedData.sleep === 'number' ? Math.max(0, Math.min(24, Math.round(generatedData.sleep * 2) / 2)) : 7;
        validatedData.exercise = typeof generatedData.exercise === 'boolean' ? generatedData.exercise : false;
        validatedData.highlights = typeof generatedData.highlights === 'string' ? generatedData.highlights : "";
        validatedData.challenges = typeof generatedData.challenges === 'string' ? generatedData.challenges : "";
        validatedData.tomorrowGoal = typeof generatedData.tomorrowGoal === 'string' ? generatedData.tomorrowGoal : "";

        // Reset the form with the generated data
        reset(validatedData);
        
        // AUTO-SUBMIT: After generating and filling the form, submit it automatically
        // This triggers the same flow as clicking "Save Log" button (coloring the heatmap, generating feed, etc.)
        console.log("Auto-submitting the generated log data");
        await onSubmit(validatedData as DailyLogFormData);
      } else {
        throw new Error("Generated data is not in the expected format or is null.");
      }
    } catch (err) {
      console.error("Failed to generate random log:", err);
      setError(err instanceof Error ? err.message : "Failed to generate random log content.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ────────────────────────────────────────── */
  /* UI                                        */
  /* ────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 overflow-x-hidden">
      {/* Fixed Top Section with Generate Random Button */}
      <div className="px-3 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <Button
          type="button"
          variant="outline"
          onClick={handleGenerateRandom}
          disabled={isSubmitting || isGenerating}
          className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:focus:ring-offset-zinc-900 flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generator
            </>
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 overflow-x-hidden px-3 py-2">
        <form
          id="daily-log-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-full pt-2"
        >
          {/* Ratings Section */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
              Rate Your Day <span className="text-xs">(1‑10)</span>
            </h3>
            {[
              ["overallMood", "Overall Mood"],
              ["workSatisfaction", "Work Satisfaction"],
              ["personalLifeSatisfaction", "Personal Life"],
              ["balanceRating", "Work‑Life Balance"],
            ].map(([field, label]) => (
              <div key={field} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field} className="text-sm">
                    {label}
                  </Label>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    {watch(field as any)}/10
                  </span>
                </div>
                <Input
                  id={field}
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  className="accent-sky-600"
                  {...register(field as any, {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>
            ))}
          </div>

          {/* Basic Wellness */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
              Basic Wellness
            </h3>
            <div className="flex items-center space-x-4">
              <Label htmlFor="sleep" className="w-28 text-sm">
                Hours of sleep
              </Label>
              <Input
                id="sleep"
                type="number"
                step="0.5"
                min="0"
                max="24"
                className="max-w-[80px]"
                {...register("sleep", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="exercise"
                type="checkbox"
                className="rounded bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-700 focus:ring-emerald-500 text-emerald-600"
                {...register("exercise")}
              />
              <Label htmlFor="exercise" className="text-sm">
                Exercise today?
              </Label>
            </div>
          </div>

          {/* Quick Reflections */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
              Quick Reflections
            </h3>
            {[
              [
                "highlights",
                "Today's highlight",
                "What was the best part of your day?",
              ],
              ["challenges", "Today's challenge", "What was challenging?"],
              [
                "tomorrowGoal",
                "Tomorrow's focus",
                "What's your main focus for tomorrow?",
              ],
            ].map(([field, label, placeholder]) => (
              <div key={field} className="space-y-1.5">
                <Label htmlFor={field} className="text-sm">
                  {label}
                </Label>
                <Textarea
                  id={field}
                  placeholder={placeholder as string}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 placeholder:text-zinc-400 focus:ring-emerald-500"
                  {...register(field as any)}
                />
              </div>
            ))}
          </div>
        </form>
      </ScrollArea>

      {/* Footer */}
      <div className="sticky bottom-0 w-full border-t border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 pb-6 pt-6">
        {error && (
          <div className="flex items-center space-x-2 mb-2 text-red-600">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Button
            type="submit"
            form="daily-log-form"
            disabled={isSubmitting || isGenerating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm ml-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : existingLog ? (
              "Update Log"
            ) : (
              "Save Log"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting || isGenerating}
            className="border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}