// DAILY LOG FORM
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/dashboard/_components/dailyLogForm.tsx

"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useTemplates } from "@/hooks/useTemplates";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2, Zap, X, Check, Plus, Minus, Settings } from "lucide-react";
import { useFeedStore } from "@/store/feedStore";
import { addDays, format, subDays } from "date-fns";
import { useConvex } from "convex/react";
import { useBrowserEnvironment } from "@/utils/environment";
import { TemplateField } from "./Templates";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  [key: string]: any; // Allow for dynamic fields from templates
}

interface DailyLogFormProps {
  onClose: () => void; // still used for cancel button
  date?: string;
  hasActiveSubscription?: boolean; // Add subscription status prop
}

/**
 * Client‑side form for creating/updating a daily log.
 * Server logic lives in `convex/dailyLogs.ts`.
 * Now supports customizable templates (managed from main page)!
 */
export default function DailyLogForm({ onClose, date, hasActiveSubscription }: DailyLogFormProps) {
  console.log("DailyLogForm mounted");
  const { isAuthenticated, isLoading: userLoading, userId } = useConvexUser();
  const isBrowser = useBrowserEnvironment();

  // Templates integration
  const {
    currentFormFields,
    isLoading: templatesLoading,
  } = useTemplates({ userId: userId || undefined });

  // Check user settings for generator prerequisites
  const userAttributes = useQuery(
    api.userAttributes.getAttributes,
    userId ? { userId } : "skip"
  );
  
  const userInstructions = useQuery(
    api.randomizer.getInstructions,
    userId ? { userId } : "skip"
  );

  // Check if user has completed required settings
  const settingsComplete = useMemo(() => {
    if (!userAttributes?.attributes || userInstructions === undefined) {
      return false;
    }
    
    const { name, goals, objectives } = userAttributes.attributes;
    const hasInstructions = userInstructions && userInstructions.trim().length > 0;
    
    return !!(name?.trim() && goals?.trim() && objectives?.trim() && hasInstructions);
  }, [userAttributes, userInstructions]);

  const missingSettings = useMemo(() => {
    const missing = [];
    
    if (!userAttributes?.attributes?.name?.trim()) {
      missing.push("Name");
    }
    if (!userAttributes?.attributes?.goals?.trim()) {
      missing.push("Goals");
    }
    if (!userAttributes?.attributes?.objectives?.trim()) {
      missing.push("Objectives");
    }
    if (!userInstructions?.trim()) {
      missing.push("Custom Instructions");
    }
    
    return missing;
  }, [userAttributes, userInstructions]);

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

  // Create dynamic form data based on current template fields
  const createFormDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    currentFormFields.forEach(field => {
      defaults[field.id] = field.defaultValue;
    });
    return defaults;
  }, [currentFormFields]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DailyLogFormData>({
    defaultValues: createFormDefaults,
  });

  /* ────────────────────────────────────────── */
  /* Populate defaults when a log already exists */
  /* ────────────────────────────────────────── */
  useEffect(() => {
    if (existingLog?.answers) {
      const resetData: Record<string, any> = {};
      currentFormFields.forEach(field => {
        resetData[field.id] = existingLog.answers[field.id] ?? field.defaultValue;
      });
      reset(resetData);
    }
  }, [existingLog, currentFormFields, reset]);

  /* ────────────────────────────────────────── */
  /* Local state                               */
  /* ────────────────────────────────────────── */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ────────────────────────────────────────── */
  /*  User ID validation                        */
  /* ────────────────────────────────────────── */
  if (userLoading || !isAuthenticated || !userId || templatesLoading) {
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
        
        // Validate generated data against current form fields
        currentFormFields.forEach(field => {
          const value = generatedData[field.id];
          
          switch (field.type) {
            case "slider":
            case "number":
              if (typeof value === 'number') {
                const min = field.min || 0;
                const max = field.max || 10;
                validatedData[field.id] = Math.max(min, Math.min(max, Math.round(value)));
              } else {
                validatedData[field.id] = field.defaultValue;
              }
              break;
            case "checkbox":
              validatedData[field.id] = typeof value === 'boolean' ? value : field.defaultValue;
              break;
            case "textarea":
            case "text":
              validatedData[field.id] = typeof value === 'string' ? value : field.defaultValue || "";
              break;
            default:
              validatedData[field.id] = value || field.defaultValue;
          }
        });

        // Reset the form with the generated data
        reset(validatedData);
        
        // AUTO-SUBMIT: After generating and filling the form, submit it automatically
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

  // Render field based on template field type
  const renderTemplateField = (field: TemplateField) => {
    const watchValue = watch(field.id);

    switch (field.type) {
      case "slider":
        return (
          <div key={field.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.id} className="text-sm">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                {watchValue}/{field.max || 10}
              </span>
            </div>
            <Input
              id={field.id}
              type="range"
              min={field.min || 1}
              max={field.max || 10}
              step={field.step || 1}
              className="accent-sky-600"
              {...register(field.id, {
                required: field.required,
                valueAsNumber: true,
              })}
            />
          </div>
        );

      case "number":
        return (
          <div key={field.id} className="flex items-center space-x-4">
            <Label htmlFor={field.id} className="w-28 text-sm">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              step={field.step || 1}
              min={field.min}
              max={field.max}
              placeholder={field.placeholder}
              className="max-w-[120px]"
              {...register(field.id, {
                required: field.required,
                valueAsNumber: true,
              })}
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <input
              id={field.id}
              type="checkbox"
              className="rounded bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-700 focus:ring-emerald-500 text-emerald-600"
              {...register(field.id)}
            />
            <Label htmlFor={field.id} className="text-sm">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="space-y-1.5">
            <Label htmlFor={field.id} className="text-sm">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 placeholder:text-zinc-400 focus:ring-emerald-500"
              {...register(field.id, { required: field.required })}
            />
          </div>
        );

      case "text":
        return (
          <div key={field.id} className="space-y-1.5">
            <Label htmlFor={field.id} className="text-sm">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="text"
              placeholder={field.placeholder}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 placeholder:text-zinc-400 focus:ring-emerald-500"
              {...register(field.id, { required: field.required })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Group template fields by category
  const groupedFields = currentFormFields.reduce((acc, field) => {
    const category = field.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(field);
    return acc;
  }, {} as Record<string, TemplateField[]>);

  const categoryNames: Record<string, string> = {
    ratings: "Rate Your Day",
    wellness: "Basic Wellness", 
    reflections: "Quick Reflections",
    custom: "Custom Fields",
    other: "Other Fields",
  };

  /* ────────────────────────────────────────── */
  /* UI                                        */
  /* ────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 overflow-x-hidden">
        {/* Generator Button - Show for Electron subscribers OR authenticated browser users */}
        {((isBrowser !== true && hasActiveSubscription) || (isBrowser === true && isAuthenticated)) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-3 ml-3 mr-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateRandom}
                    disabled={isSubmitting || isGenerating || !settingsComplete}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:focus:ring-offset-zinc-900 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
              </TooltipTrigger>
              {!settingsComplete && (
                <TooltipContent side="bottom" className="max-w-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span className="font-medium">Complete Settings Required</span>
                    </div>
                    <p className="text-sm">To use the generator, please complete these settings:</p>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      {missingSettings.map((setting) => (
                        <li key={setting}>{setting}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">
                      Access settings via the sidebar → Settings button
                    </p>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}

      {/* Dynamic Form Fields based on Template */}
      <div className="relative flex-1 overflow-hidden">
        <ScrollArea className="h-full overflow-x-hidden px-3 py-2 pt-2 pl-4 pr-4">
          <form
            id="daily-log-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 w-full max-w-full pt-2"
          >
            {Object.entries(groupedFields).map(([category, fields]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
                  {categoryNames[category] || category}
                  {category === "ratings" && fields.length > 0 && (
                    <span className="text-xs ml-2">(1‑{fields[0]?.max || 10})</span>
                  )}
                </h3>
                <div className="space-y-3">
                  {fields.map(renderTemplateField)}
                </div>
              </div>
            ))}
          </form>
        </ScrollArea>
        
        {/* Fade effect at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none" />
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 w-full border-t border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 pb-2 pt-2">
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