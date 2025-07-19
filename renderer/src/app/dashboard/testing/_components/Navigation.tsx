// NAVIGATION COMPONENT
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/dashboard/testing/_components/Navigation.tsx

"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { NavCalendar } from "./navCalendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { format, addDays, differenceInCalendarDays, isBefore, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { useTestingStore } from "../../../../store/Testingstore";

interface NavigationProps {
  onGenerateForecast: () => Promise<void>;
}

export default function Navigation({ onGenerateForecast }: NavigationProps) {
  const {
    selectedDateRange,
    setSelectedDateRange,
    isGeneratingForecast,
    forecastGenerated,
    resetState,
    clearDailyDetailsCache,
    clearWeeklyInsightsCache
  } = useTestingStore();

  const [isOpen, setIsOpen] = useState(false);

  /** Temporary range the user is choosing in the calendar */
  const [tempRange, setTempRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: selectedDateRange.start || undefined,
    to: selectedDateRange.end || undefined,
  });

  // When the popover opens, initialize the temp range with current selection
  useEffect(() => {
    if (isOpen) {
      setTempRange({ 
        from: selectedDateRange.start || undefined, 
        to: selectedDateRange.end || undefined 
      });
    }
  }, [isOpen, selectedDateRange.start, selectedDateRange.end]);

  // Commit a range only when it's exactly four consecutive days
  const handleRangeSelect = useCallback((range: { from?: Date; to?: Date } | undefined) => {
    if (!range) {
      setTempRange({ from: undefined, to: undefined });
      return;
    }

    const from = range.from;
    const to = range.to;

    setTempRange({ from, to });

    if (from && to) {
      const start = isBefore(from, to) ? from : to;
      const end = isAfter(to, from) ? to : from;
      const diff = differenceInCalendarDays(end, start);

      if (diff <= 3) {
        const finalEnd = diff < 3 ? addDays(start, 3) : end;

        clearDailyDetailsCache();
        clearWeeklyInsightsCache();
        setSelectedDateRange({
          start: start,
          end: finalEnd
        });
        setIsOpen(false);
      }
    }
  }, [setSelectedDateRange, clearDailyDetailsCache, clearWeeklyInsightsCache]);

  const handleReset = useCallback(() => {
    clearDailyDetailsCache();
    clearWeeklyInsightsCache();
    resetState();
    setTempRange({ from: undefined, to: undefined });

    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 3);

    setSelectedDateRange({
      start: start,
      end: today
    });

    setIsOpen(false);
  }, [resetState, setSelectedDateRange, clearDailyDetailsCache, clearWeeklyInsightsCache]);

  // Format the range for display
  const formatRange = useCallback(() => {
    if (selectedDateRange.start && selectedDateRange.end) {
      const sameMonth = format(selectedDateRange.start, 'MMM') === format(selectedDateRange.end, 'MMM');
      const sameYear = format(selectedDateRange.start, 'yyyy') === format(selectedDateRange.end, 'yyyy');

      if (sameMonth && sameYear) {
        return `${format(selectedDateRange.start, 'MMM d')} - ${format(selectedDateRange.end, 'd, yyyy')}`;
      } else if (sameYear) {
        return `${format(selectedDateRange.start, 'MMM d')} - ${format(selectedDateRange.end, 'MMM d, yyyy')}`;
      } else {
        return `${format(selectedDateRange.start, 'MMM d, yyyy')} - ${format(selectedDateRange.end, 'MMM d, yyyy')}`;
      }
    }
    return "Select a date range";
  }, [selectedDateRange.start, selectedDateRange.end]);

  // Calculate forecast dates
  const forecastDates = useMemo(() => {
    if (!selectedDateRange.end) return null;

    const forecastStart = addDays(selectedDateRange.end, 1);
    const forecastEnd = addDays(forecastStart, 2); // Changed from 3 to 2 to match 3-day forecast
    return { forecastStart, forecastEnd };
  }, [selectedDateRange.end]);

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-black flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
            Date Range Selection
          </h3>
          <p className="text-sm text-black/70 mt-1">
            Select historical data range for AI-powered forecast analysis
          </p>
        </div>
        <Button
          onClick={onGenerateForecast}
          disabled={
            !selectedDateRange.start ||
            !selectedDateRange.end ||
            isGeneratingForecast ||
            forecastGenerated
          }
          variant="outline"
          className={cn(
            "transition-all duration-200 h-9 px-4 bg-white border-black text-black hover:bg-gray-50",
            forecastGenerated && "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
          )}
          size="sm"
        >
          {isGeneratingForecast
            ? "Generating..."
            : forecastGenerated
              ? "✓ Generated"
              : "Generate Forecast"}
        </Button>
      </div>

      {/* Date picker using NavCalendar component */}
      <NavCalendar
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedRange={tempRange}
        onSelect={handleRangeSelect}
        onReset={handleReset}
        triggerText={formatRange()}
        disabled={false}
        defaultMonth={selectedDateRange.start || undefined}
      />

      {/* Range display */}
      {selectedDateRange.start && selectedDateRange.end && (
        <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-gradient-to-b from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-800/50 transition-all duration-500 animate-in slide-in-from-bottom-2 fade-in-50">
          <div className="p-4 space-y-3">
            {/* Historical Period */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 transition-transform group-hover:scale-110">
                  <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Historical Period
                  </span>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {format(selectedDateRange.start, 'MMM d')} → {format(selectedDateRange.end, 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
              >
                4 days
              </Badge>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white dark:bg-zinc-900 text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" />
                  then
                </span>
              </div>
            </div>

            {/* Forecast Period */}
            {forecastDates && (
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 transition-transform group-hover:scale-110">
                    <div className="w-2.5 h-2.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"></div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Forecast Period
                    </span>
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {format(forecastDates.forecastStart, 'MMM d')} → {format(forecastDates.forecastEnd, 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs px-2.5 py-1 border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-900/20"
                >
                  3 days
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}