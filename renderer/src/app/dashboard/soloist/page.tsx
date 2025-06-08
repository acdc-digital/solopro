// SOLOIST (FORECAST)
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/dashboard/soloist/page.tsx

"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { 
  Loader2, 
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  Sparkles,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Info,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useFeedStore } from "@/store/feedStore";
import WeeklyPatterns from "./_components/WeeklyPatterns";
import { format, subDays } from 'date-fns';

// Helper component for Loading State
const LoadingState = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex-1 h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900">
    <Loader2 className="h-8 w-8 animate-spin text-zinc-500 dark:text-zinc-400 mb-4" />
    <div className="text-zinc-600 dark:text-zinc-400">{message}</div>
  </div>
);

// Helper component for Empty/Error State
const EmptyState = ({ title, description, onGenerate, isGenerating, error }: {
  title: string;
  description: string;
  onGenerate?: () => void;
  isGenerating?: boolean;
  error?: string | null;
}) => (
  <div className="flex-1 h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-center px-4">
    <div className="text-zinc-600 dark:text-zinc-400 mb-4">{title}</div>
    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{description}</p>
    {onGenerate && (
      <Button
        variant="outline"
        size="sm"
        onClick={onGenerate}
        disabled={isGenerating}
        className="h-8 text-xs"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Forecast
          </>
        )}
      </Button>
    )}
    {error && (
      <div className="mt-4 p-2 w-full max-w-md bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm rounded-md">
        Error: {error}
      </div>
    )}
  </div>
);

// Helper functions
function getColorClass(score: number | null | undefined): string {
  if (score == null) return "bg-zinc-800/20 border border-zinc-700/30";
  if (score >= 90) return "bg-indigo-400/80 hover:bg-indigo-400";
  if (score >= 80) return "bg-blue-400/80 hover:bg-blue-400";
  if (score >= 70) return "bg-sky-400/80 hover:bg-sky-400";
  if (score >= 60) return "bg-teal-400/80 hover:bg-teal-400";
  if (score >= 50) return "bg-green-400/80 hover:bg-green-400";
  if (score >= 40) return "bg-lime-400/80 hover:bg-lime-400";
  if (score >= 30) return "bg-yellow-400/80 hover:bg-yellow-400";
  if (score >= 20) return "bg-amber-500/80 hover:bg-amber-500";
  if (score >= 10) return "bg-orange-500/80 hover:bg-orange-500";
  return "bg-rose-600/80 hover:bg-rose-600";
}

function getBorderColorClass(score: number | null | undefined): string {
  if (score == null) return "border-zinc-700/50";
  if (score >= 90) return "border-indigo-500";
  if (score >= 80) return "border-blue-500";
  if (score >= 70) return "border-sky-500";
  if (score >= 60) return "border-teal-500";
  if (score >= 50) return "border-green-500";
  if (score >= 40) return "border-lime-500";
  if (score >= 30) return "border-yellow-500";
  if (score >= 20) return "border-amber-600";
  if (score >= 10) return "border-orange-600";
  return "border-rose-700";
}

function getTextColorClass(score: number | null | undefined): string {
  if (score == null) return "text-zinc-400";
  if (score >= 60) return "text-zinc-900"; // Dark text for lighter backgrounds
  return "text-zinc-100"; // Light text for darker backgrounds
}

const TrendIcon = ({ trend }: { trend?: string | null }) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-rose-500" />;
  return <Sparkles className="h-4 w-4 text-blue-400 opacity-70" />;
};

const mockInsights = [
  "Your emotional state tends to peak midweek (Wednesday) and on weekends",
  "Thursday consistently shows lower emotional scores - consider additional self-care",
  "Evening periods generally show higher wellbeing than mornings",
  "Your recovery pattern is strong, with quick rebounds after challenging days"
];

export default function SoloistPage() {
  const { isAuthenticated, isLoading: userLoading, userId } = useConvexUser();
  const [selectedDayIndex, setSelectedDayIndex] = useState(3);
  const [isGeneratingForecast, setIsGeneratingForecast] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);
  const [lastForecastDate, setLastForecastDate] = useState<string | null>(null);

  // Feed store for opening daily log form
  const { setSelectedDate, setActiveTab, setSidebarOpen } = useFeedStore();
  
  // Get user's local today string
  const localToday = format(new Date(), 'yyyy-MM-dd');

  // Fetch forecast data - will run even with empty userId
  const forecastData = useQuery(
    api.forecast.getSevenDayForecast,
    userId
      ? {
          userId,
          today: localToday,
        }
      : "skip"
  );

  // Generate forecast mutation
  const generateForecast = useAction(api.forecast.generateForecast);

  // Calculate average score safely
  const averageScore = (Array.isArray(forecastData) && forecastData.length > 0)
    ? ((forecastData.reduce((sum, day) => sum + (day.emotionScore ?? 0), 0)) /
       (forecastData.filter(day => day.emotionScore !== null && day.emotionScore > 0).length || 1)).toFixed(1)
    : "N/A";

  // Effect to set default selected day (today is always at index 3)
  useEffect(() => {
    setSelectedDayIndex(3); // Today is always at index 3 in our 7-day structure
  }, []); // Only run once on mount

  // Navigation handlers
  const navigatePrevDay = () => setSelectedDayIndex(prev => Math.max(0, prev - 1));
  const navigateNextDay = () => {
    setSelectedDayIndex(prev => Math.min(6, prev + 1)); // Always 7 days (indices 0-6)
  };

  // Check if forecast was already generated today
  const forecastGeneratedToday = lastForecastDate === localToday;
  
  // Ensure we always have a consistent 7-day view: 3 past + today + 3 future
  const processedForecastData = useMemo(() => {
    const today = new Date();
    const sevenDayStructure = [];
    
    // Generate the 7-day structure (3 past, today, 3 future)
    for (let i = -3; i <= 3; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      const dateString = format(targetDate, 'yyyy-MM-dd');
      
      // Try to find existing data for this date
      const existingData = Array.isArray(forecastData) 
        ? forecastData.find(day => day.date === dateString)
        : null;
      
      // Determine day type
      const isPast = i < 0;
      const isToday = i === 0;
      const isFuture = i > 0;
      
      // Create day object with existing data or placeholder
      const dayObject = existingData || {
        date: dateString,
        day: isToday ? 'Today' : format(targetDate, 'EEEE'),
        shortDay: format(targetDate, 'EEE'),
        formattedDate: format(targetDate, 'MMM d'),
        emotionScore: null,
        description: isPast 
          ? 'No log recorded' 
          : isToday 
            ? 'No log for today' 
            : 'Forecast needed',
        trend: null,
        details: isPast
          ? `No entry recorded for ${format(targetDate, 'EEEE, MMMM d')}. Past logs help improve future forecasts.`
          : isToday
            ? 'No entry for today. Log your day to see your real score.'
            : 'Generate forecast for predictions about this day.',
        recommendation: isPast
          ? 'Consider logging past experiences when possible for better insights.'
          : isToday
            ? 'Log your day to update your forecast.'
            : 'Complete recent logs to generate forecasts.',
        isPast,
        isToday,
        isFuture,
        canGenerateForecast: false,
        confidence: existingData?.confidence || 0,
      };
      
      sevenDayStructure.push(dayObject);
    }
    
    return sevenDayStructure;
  }, [forecastData, localToday]);

  // Check if we need forecasts (based on our consistent 7-day structure)
  const needsForecasts = processedForecastData.some(day =>
    day.isFuture &&
    (day.emotionScore === 0 || day.emotionScore === null || 
     day.description === "Forecast needed" || day.description?.toLowerCase().includes('forecast needed'))
  );

  // Check if user needs to submit logs (has no data for past days or today)
  const needsLogs = processedForecastData.some(day =>
    !day.isFuture &&
    (day.emotionScore === 0 || day.emotionScore === null)
  );

  // Forecast generation handler
  const handleGenerateForecast = () => {
    setForecastError(null);
    setIsGeneratingForecast(true);
    const today = new Date();
    const endDate = format(today, 'yyyy-MM-dd');
    const startDate = format(subDays(today, 3), 'yyyy-MM-dd');
    generateForecast({ userId, startDate, endDate })
      .then(result => {
        console.log("[SoloistPage] Generation result:", result);
        if (result && !result.success) {
          setForecastError(result.error || "Failed to generate forecast");
        } else {
          // Update last forecast date on successful generation
          setLastForecastDate(localToday);
        }
      })
      .catch(error => {
        console.error("[SoloistPage] Error during forecast generation:", error);
        setForecastError(error.message || "An error occurred during forecast generation");
      })
      .finally(() => {
        setIsGeneratingForecast(false);
      });
  };

  // Loading guard for user
  if (userLoading || !userId) {
    return <LoadingState message="Loading user…" />;
  }

  // Wait for forecast data
  if (forecastData === undefined) {
    return <LoadingState message="Loading forecast data..." />;
  }

  // Handle empty data case - but don't block on authentication
  if (forecastData === null) {
    return <EmptyState
            title="Forecast Not Available"
            description="Error retrieving forecast data."
            onGenerate={handleGenerateForecast}
            isGenerating={isGeneratingForecast}
            error={forecastError} />;
  }

  if (Array.isArray(forecastData) && forecastData.length === 0) {
    return <EmptyState
            title="No Forecast Data Available"
            description="You need to generate a forecast."
            onGenerate={handleGenerateForecast}
            isGenerating={isGeneratingForecast}
            error={forecastError} />;
  }

  // --- Main Render - Only proceeds if userId exists and forecastData is a non-empty array ---
  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900">
      <div className="flex-1 overflow-auto">
        <div className="w-full py-4 px-4 flex flex-col h-full">
          <Card className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">7-Day Emotional Forecast</CardTitle>
                  <CardDescription className="text-zinc-500 dark:text-zinc-400">Predictions based on your past log patterns</CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className="border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                    7 Days
                  </Badge>
                  <Badge variant="outline" className="border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                    Avg: {averageScore}
                  </Badge>
                   <TooltipProvider>
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <div className="cursor-help">
                           <Info className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                         </div>
                       </TooltipTrigger>
                       <TooltipContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                         Forecasts are now generated automatically when you log 4 consecutive days.
                       </TooltipContent>
                     </Tooltip>
                   </TooltipProvider>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Display any forecast generation errors */}
              {forecastError && (
                <div className="mb-3 p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm rounded-md">
                  Error: {forecastError}
                </div>
              )}

              {/* Generate Forecast Button */}
              <div className="mb-3 flex justify-between items-center">
                {needsLogs ? (
                  <div className="text-sm text-zinc-400 whitespace-nowrap">Submit a log to start your forecast.</div>
                ) : <div />}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateForecast}
                          disabled={isGeneratingForecast || forecastGeneratedToday || !needsForecasts}
                          className="text-xs border border-black"
                        >
                          {isGeneratingForecast ? "Generating..." : "Generate Forecast"}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {(isGeneratingForecast || forecastGeneratedToday || !needsForecasts) && (
                      <TooltipContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                        Forecast has already been generated
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* 7-Day Forecast Strip */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-1 mb-2">
                {processedForecastData.map((day, idx) => {
                  // Ensure day object exists before destructuring/accessing
                  if (!day) return <div key={idx} className="bg-zinc-800/10 rounded-md aspect-square"></div>; // Placeholder for bad data

                  const score = day.emotionScore;
                  const colorClass = getColorClass(score);
                  const borderColorClass = getBorderColorClass(score);
                  const textColorClass = getTextColorClass(score);

                  const isFutureDay = day.isFuture;
                  const needsGen = isFutureDay && (score === 0 || score === null || day.description === "Forecast Needed");
                  const isSelected = selectedDayIndex === idx;
                  
                  // Check if this day can be clicked to open log form
                  const canOpenLogForm = (!day.isFuture && (day.emotionScore === null || day.emotionScore === 0)) || 
                                        (day.isToday && (day.emotionScore === null || day.emotionScore === 0));

                  return (
                    <div
                      key={day.date || idx} // Use date if available, otherwise index
                      title={`Date: ${day.date}, Score: ${score ?? 'N/A'}${canOpenLogForm ? ' - Click to log this day' : ''}`} // Add tooltip for debugging
                      className={`
                        flex flex-col items-center justify-between p-1 sm:p-1.5 rounded-md border aspect-square
                        ${colorClass} ${borderColorClass}
                        ${isSelected ? 'ring-2 ring-offset-1 ring-offset-zinc-900 dark:ring-offset-black ring-indigo-400' : ''}
                        ${day.isPast ? 'opacity-80 hover:opacity-100' : ''}
                        ${day.isToday ? 'relative ring-1 ring-inset ring-white/50' : ''}
                        ${isFutureDay && !needsGen ? 'opacity-85 hover:opacity-100' : ''}
                        ${needsGen ? 'border-dashed border-zinc-500 bg-zinc-800/30 hover:bg-zinc-700/40' : ''}
                        ${canOpenLogForm ? 'cursor-pointer hover:ring-1 hover:ring-emerald-500 hover:border-emerald-500' : 'cursor-pointer'}
                        transition-all duration-150 ease-in-out
                      `}
                      onClick={() => {
                        // Just select the day to show details below
                        setSelectedDayIndex(idx);
                      }}
                    >
                      <div className="text-xs font-medium text-center">
                        <div className={`${needsGen ? 'text-zinc-400' : textColorClass} text-[10px] sm:text-xs font-semibold`}>{day.shortDay}</div>
                        <div className={`text-[10px] ${needsGen ? 'text-zinc-500' : textColorClass} opacity-80 hidden sm:block`}>{day.formattedDate}</div>
                      </div>

                      <div className="flex items-center gap-1 mt-auto">
                        <span className={`text-lg sm:text-2xl font-bold ${needsGen ? 'text-zinc-400' : textColorClass}`}>
                          {score !== null ? (needsGen ? '?' : score) : '—'}
                        </span>
                        {score !== null && score > 0 && !needsGen && day.trend &&
                          <TrendIcon trend={day.trend} />
                        }
                      </div>
                       {/* Today indicator dot */}
                       {day.isToday && <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-white/80"></div>}
                    </div>
                  );
                })}
              </div>

              {/* Separator, Navigation, and Details only if selected day is valid */}
              {selectedDayIndex >= 0 && selectedDayIndex <= 6 && processedForecastData[selectedDayIndex] && (
                <>
                  <Separator className="my-3 bg-zinc-200 dark:bg-zinc-800" />

                  {/* Selected Day Navigation */}
                  <div className="flex items-center justify-between mb-2">
                    <Button variant="ghost" size="sm" disabled={selectedDayIndex === 0} onClick={navigatePrevDay} className="h-8 px-2 text-zinc-600 dark:text-zinc-300">
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <h3 className="text-base font-medium text-center text-zinc-900 dark:text-zinc-50">
                      {processedForecastData[selectedDayIndex]?.day || "Selected Day"} - {processedForecastData[selectedDayIndex]?.formattedDate || ""}
                    </h3>
                    <Button variant="ghost" size="sm" disabled={selectedDayIndex >= 6} onClick={navigateNextDay} className="h-8 px-2 text-zinc-600 dark:text-zinc-300">
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  {/* Selected Day Details */}
                  {(() => { // Immediately invoked function expression for easier variable access
                    const selectedDay = processedForecastData[selectedDayIndex];
                    if (!selectedDay) return null; // Should not happen due to outer check, but safe

                    const score = selectedDay.emotionScore;
                    const isFutureDay = selectedDay.isFuture;
                    const needsGen = isFutureDay && (score === 0 || score === null || selectedDay.description === "Forecast Needed");
                    
                    // Check if this is a day without logs (past or today with no data)
                    const needsLog = !isFutureDay && (score === null || score === 0);

                    return (
                      <div className="flex flex-col sm:flex-row gap-4 p-3 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white/30 dark:bg-zinc-900/30">
                        {/* Score Box */}
                        <div className={`
                          flex-shrink-0 w-full sm:w-28 h-28 rounded-md flex flex-col items-center justify-center border
                          ${getColorClass(score)}
                          ${getBorderColorClass(score)}
                          ${(needsGen || needsLog) ? 'border-dashed border-zinc-500' : ''}
                         `}>
                          <span className={`text-4xl font-bold ${(needsGen || needsLog) ? 'text-zinc-400' : getTextColorClass(score)}`}>
                            {score !== null && score > 0 ? score : needsGen ? '?' : '—'}
                          </span>
                          <div className="flex items-center mt-1">
                             {/* Only show trend icon if score exists, it's not needing generation/log, and trend is present */}
                            {score !== null && score > 0 && !needsGen && !needsLog && selectedDay.trend && (
                               <>
                                <TrendIcon trend={selectedDay.trend} />
                                <span className={`text-xs ml-1 ${getTextColorClass(score)} opacity-90`}>
                                  {selectedDay.trend === "up" ? "Rising" : selectedDay.trend === "down" ? "Falling" : "Stable"}
                                </span>
                               </>
                            )}
                             {/* Placeholder if no trend and no special states */}
                             {!(score !== null && score > 0 && !needsGen && !needsLog && selectedDay.trend) && !needsGen && !needsLog && (
                                <span className={`text-xs ml-1 ${getTextColorClass(score)} opacity-70`}>-</span>
                             )}
                             {/* Special state labels */}
                             {needsGen && (
                                <span className={`text-xs ml-1 text-zinc-400 opacity-70`}>Forecast</span>
                             )}
                             {needsLog && (
                                <span className={`text-xs ml-1 text-zinc-400 opacity-70`}>No Log</span>
                             )}
                          </div>
                        </div>
                        {/* Text Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                            {selectedDay.description || "No description"}
                          </h3>
                          <div className="text-sm text-zinc-700 dark:text-zinc-300 mb-3 min-h-[3em]">
                            {selectedDay.details || (needsGen ? "Generate forecast for details." : needsLog ? "No log entry found for this day." : "No details available.")}
                            {needsGen && (
                              <div className="mt-1 text-blue-500 dark:text-blue-400">
                                Click {needsForecasts ? '"Generate Forecast"' : '"Update Forecast"'} above to create predictions.
                              </div>
                            )}
                            {needsLog && (
                              <div className="mt-1 text-emerald-500 dark:text-emerald-400">
                                {selectedDay.isToday ? 'Click to log your day and see your emotional score.' : 'Consider logging this day to improve future forecasts.'}
                              </div>
                            )}
                          </div>
                          {/* Recommendation */}
                          {(selectedDay.recommendation && selectedDay.recommendation !== "Check back later for recommendations") && (
                            <div className="bg-zinc-100 dark:bg-zinc-800/70 p-2 rounded-md">
                              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1 flex items-center">
                                <Sparkles className="h-4 w-4 mr-1.5 text-blue-500" />
                                Recommendation:
                              </h4>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {selectedDay.recommendation}
                              </p>
                            </div>
                          )}
                          {/* Confidence */}
                          {isFutureDay && selectedDay.confidence != null && selectedDay.confidence > 0 && (
                            <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 flex items-center">
                              <Info className="h-3 w-3 mr-1 inline-block" />
                              Forecast confidence: {selectedDay.confidence}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()} {/* End IIFE */}
                </>
              )} {/* End conditional render for details */}

            </CardContent>
          </Card>

          {/* Weekly Pattern and Key Insights Cards (Using Mock Data for now) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            <Card className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-zinc-900 dark:text-zinc-50">Weekly Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyPatterns data={processedForecastData} />
              </CardContent>
            </Card>
            <Card className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-zinc-900 dark:text-zinc-50">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mockInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

        </div> {/* End container */}
      </div> {/* End scrollable area */}
    </div> // End main wrapper
  );
}