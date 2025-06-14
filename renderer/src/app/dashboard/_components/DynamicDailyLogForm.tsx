// DYNAMIC DAILY LOG FORM EXAMPLE
// This shows how to integrate the Templates system into your existing dailyLogForm.tsx

"use client";

import React, { useEffect, useState } from "react";
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
import { AlertCircle, Loader2, Zap, X, Check, Plus, Minus, Settings2 } from "lucide-react";
import { useFeedStore } from "@/store/feedStore";
import { addDays, format, subDays } from "date-fns";
import { useConvex } from "convex/react";
import { useBrowserEnvironment } from "@/utils/environment";
import Templates, { TemplateField, Template } from "./Templates";

interface DynamicDailyLogFormProps {
  onClose: () => void;
  date?: string;
  hasActiveSubscription?: boolean;
}

export default function DynamicDailyLogForm({ 
  onClose, 
  date, 
  hasActiveSubscription 
}: DynamicDailyLogFormProps) {
  const { isAuthenticated, isLoading: userLoading, userId } = useConvexUser();
  const isBrowser = useBrowserEnvironment();
  
  // Templates hook
  const {
    currentFormFields,
    activeTemplate,
    saveTemplate,
    isLoading: templatesLoading,
  } = useTemplates({ userId: userId || undefined });

  // State for showing templates
  const [showTemplates, setShowTemplates] = useState(false);

  /* ────────────────────────────────────────── */
  /* Feed store hooks                           */
  /* ────────────────────────────────────────── */
  const activeTab = useFeedStore((s) => s.activeTab);
  const setActiveTab = useFeedStore((s) => s.setActiveTab);
  const setSidebarOpen = useFeedStore((s) => s.setSidebarOpen);
  const setSelectedDate = useFeedStore((s) => s.setSelectedDate);

  const effectiveDate = date ?? new Date().toISOString().split("T")[0];

  // Mutations (same as your original)
  const dailyLogMutation = useMutation(api.dailyLogs.dailyLog);
  const scoreDailyLog = useAction(api.score.scoreDailyLog);
  const generateFeed = useAction(api.feed.generateFeedForDailyLog);
  const generateForecast = useAction(api.forecast.generateForecast);
  const generateRandomLog = useAction(api.randomizer.generateRandomLog);
  const convex = useConvex();

  // Create form data type based on current fields
  const createFormData = () => {
    const formData: Record<string, any> = {};
    currentFormFields.forEach(field => {
      formData[field.id] = field.defaultValue;
    });
    return formData;
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: createFormData(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing log for the day
  const existingLog = useQuery(
    api.dailyLogs.getDailyLog,
    userId ? { date: effectiveDate, userId } : "skip"
  );

  // Update form when existing log is loaded
  useEffect(() => {
    if (existingLog?.answers) {
      const resetData: Record<string, any> = {};
      currentFormFields.forEach(field => {
        resetData[field.id] = existingLog.answers[field.id] ?? field.defaultValue;
      });
      reset(resetData);
    }
  }, [existingLog, reset, currentFormFields]);

  // Close templates view when switching away from log tab
  useEffect(() => {
    if (activeTab !== "log" && showTemplates) {
      setShowTemplates(false);
    }
  }, [activeTab, showTemplates]);

  // Validation and loading
  if (userLoading || !isAuthenticated || !userId || templatesLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm text-zinc-500">Loading...</span>
      </div>
    );
  }

  // Show templates component
  if (showTemplates) {
    return (
      <Templates
        onClose={() => setShowTemplates(false)}
        onSaveTemplate={(template: Template) => {
          saveTemplate(template, true); // Set as active when saved
          setShowTemplates(false);
        }}
        currentTemplate={activeTemplate || undefined}
      />
    );
  }

  // Form submit handler (same as your original)
  const onSubmit = async (data: Record<string, any>) => {
    console.log("DynamicDailyLogForm onSubmit called", { effectiveDate, userId, data });
    setError(null);
    setIsSubmitting(true);

    try {
      await dailyLogMutation({ date: effectiveDate, userId, answers: data });
      await scoreDailyLog({ date: effectiveDate, userId });
      await generateFeed({ date: effectiveDate, userId });

      // Check for forecast generation (same logic as original)
      const today = new Date(effectiveDate);
      const startDate = format(subDays(today, 3), 'yyyy-MM-dd');
      const endDate = format(today, 'yyyy-MM-dd');
      const logs = await convex.query(api.forecast.getLogsForUserInRangeSimple, {
        userId,
        startDate,
        endDate,
      });
      
      const logDates = logs.map((log: { date: string }) => log.date);
      const expectedDates = Array.from({ length: 4 }, (_, i) => format(subDays(today, 3 - i), 'yyyy-MM-dd'));
      const allPresent = expectedDates.every(date => logDates.includes(date));
      
      if (allPresent) {
        await generateForecast({ userId, startDate, endDate });
      }

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

  // Render field based on type
  const renderField = (field: TemplateField) => {
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

  // Group fields by category
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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 overflow-x-hidden">
      {/* Header with Templates button */}
      <div className="px-3 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Daily Log</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplates(true)}
            className="h-8 text-xs"
          >
            <Settings2 className="h-4 w-4 mr-1" />
            Customize
          </Button>
        </div>
        
        {/* Show active template name */}
        {activeTemplate && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Using template: <span className="font-medium">{activeTemplate.name}</span>
          </p>
        )}

        {/* Generator button - Show for subscribers (both browser and desktop) */}
        {hasActiveSubscription && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {/* your generateRandom handler */}}
            disabled={isSubmitting || isGenerating}
            className="w-full text-sm mt-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:focus:ring-offset-zinc-900 flex items-center justify-center"
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
        )}
      </div>

      {/* Dynamic Form Fields */}
      <ScrollArea className="flex-1 overflow-x-hidden px-3 py-2">
        <form
          id="dynamic-daily-log-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-full pt-2"
        >
          {Object.entries(groupedFields).map(([category, fields]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
                {categoryNames[category] || category}
                {category === "ratings" && (
                  <span className="text-xs ml-2">(1‑{fields[0]?.max || 10})</span>
                )}
              </h3>
              <div className="space-y-3">
                {fields.map(renderField)}
              </div>
            </div>
          ))}
        </form>
      </ScrollArea>

      {/* Footer (same as original) */}
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
            form="dynamic-daily-log-form"
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