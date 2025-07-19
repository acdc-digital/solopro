// NAVCAL
// /Users/matthewsimon/Projects/solopro/renderer/src/app/dashboard/testing/_components/navCalendar.tsx

// /Users/matthewsimon/Projects/solopro/renderer/src/app/dashboard/testing/_components/navCalendar.tsx

"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, RefreshCcw } from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";

interface NavCalendarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  onSelect: (range: { from?: Date; to?: Date } | undefined) => void;
  onReset: () => void;
  triggerText: string;
  disabled?: boolean;
  className?: string;
  defaultMonth?: Date; // Add defaultMonth prop
}

export function NavCalendar({
  isOpen,
  onOpenChange,
  selectedRange,
  onSelect,
  onReset,
  triggerText,
  disabled = false,
  className,
  defaultMonth
}: NavCalendarProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      {/* This PopoverTrigger is the button that is visible on the page. It was missing before. */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-11 justify-between text-left font-normal transition-all duration-200",
            "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",
            "hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm",
            "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
            !selectedRange.from && "text-zinc-500 dark:text-zinc-400",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800">
              <CalendarIcon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            </div>
            <span className="text-sm font-medium">{triggerText}</span>
          </div>
          <div className="text-xs text-zinc-400 dark:text-zinc-500">
            Click to change
          </div>
        </Button>
      </PopoverTrigger>

      {/* This PopoverContent is the calendar that appears when you click the trigger button. */}
      <PopoverContent
        className="w-auto p-0"
        align="start"
        sideOffset={8}
      >
        <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg">
          {/* Header Section */}
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Select Analysis Period
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Choose 4 consecutive days
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 h-8 px-2 text-xs"
                disabled={!selectedRange.from}
              >
                <RefreshCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
          
          {/* Calendar Container */}
          <div className="p-0">
            <Calendar
              mode="range"
              numberOfMonths={1}
              selected={selectedRange}
              onSelect={onSelect}
              disabled={(date) => {
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                if (date > today) return true;
                
                if (selectedRange.from && !selectedRange.to) {
                  const diff = differenceInCalendarDays(date, selectedRange.from);
                  return Math.abs(diff) > 3; 
                }
                
                if (!selectedRange.from && selectedRange.to) {
                  const diff = differenceInCalendarDays(date, selectedRange.to);
                  return Math.abs(diff) > 3;
                }
                
                return false;
              }}
              defaultMonth={defaultMonth || selectedRange.from || new Date()}
              captionLayout="dropdown"
              fromYear={2020}
              toYear={2030}
              showOutsideDays={false}
              className="rounded-none border-none"
            />
          </div>
          
          {/* Footer Section */}
          <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50/30 dark:bg-zinc-800/30">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">Tip:</span> Select start date, then end date
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}