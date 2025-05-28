"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Heart,
  Smile,
  Coffee,
  Moon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";

interface DemoModalProps {
  children: React.ReactNode;
}

// Mock data for the demo
const mockHeatmapData = [
  { date: "2025-01-01", score: 85, color: "bg-green-500" },
  { date: "2025-01-02", score: 72, color: "bg-green-400" },
  { date: "2025-01-03", score: 45, color: "bg-yellow-500" },
  { date: "2025-01-04", score: 88, color: "bg-green-500" },
  { date: "2025-01-05", score: 91, color: "bg-blue-500" },
  { date: "2025-01-06", score: 67, color: "bg-green-400" },
  { date: "2025-01-07", score: 34, color: "bg-orange-500" },
  { date: "2025-01-08", score: 78, color: "bg-green-400" },
  { date: "2025-01-09", score: 82, color: "bg-green-500" },
  { date: "2025-01-10", score: 55, color: "bg-yellow-500" },
  { date: "2025-01-11", score: 93, color: "bg-blue-500" },
  { date: "2025-01-12", score: 76, color: "bg-green-400" },
  { date: "2025-01-13", score: 41, color: "bg-yellow-500" },
  { date: "2025-01-14", score: 87, color: "bg-green-500" },
  { date: "2025-01-15", score: 95, color: "bg-blue-500" },
  { date: "2025-01-16", score: 79, color: "bg-green-400" },
  { date: "2025-01-17", score: 63, color: "bg-green-400" },
  { date: "2025-01-18", score: 89, color: "bg-green-500" },
  { date: "2025-01-19", score: 92, color: "bg-blue-500" },
  { date: "2025-01-20", score: 58, color: "bg-yellow-500" },
  { date: "2025-01-21", score: 74, color: "bg-green-400" },
  { date: "2025-01-22", score: 86, color: "bg-green-500" },
  { date: "2025-01-23", score: 39, color: "bg-orange-500" },
  { date: "2025-01-24", score: 81, color: "bg-green-500" },
  { date: "2025-01-25", score: 94, color: "bg-blue-500" },
  { date: "2025-01-26", score: 77, color: "bg-green-400" },
  { date: "2025-01-27", score: 65, color: "bg-green-400" },
  { date: "2025-01-28", score: 90, color: "bg-green-500" },
  { date: "2025-01-29", score: 52, color: "bg-yellow-500" },
  { date: "2025-01-30", score: 83, color: "bg-green-500" },
  { date: "2025-01-31", score: 96, color: "bg-blue-500" },
];

const mockFeedDataMap: Record<string, any> = {
  "2025-01-15": {
    date: "January 15, 2025",
    score: 95,
    mood: "Excellent",
    activities: ["Exercise", "Reading", "Meditation"],
    sleep: "8.5 hours",
    workLife: "Balanced",
    reflection: "Had a fantastic day! Morning workout gave me energy, finished a great book, and felt very productive at work. Evening meditation helped me wind down perfectly."
  },
  "2025-01-07": {
    date: "January 7, 2025",
    score: 34,
    mood: "Struggling",
    activities: ["Work", "Netflix"],
    sleep: "5.2 hours",
    workLife: "Overwhelmed",
    reflection: "Tough day at work with multiple deadlines. Didn't sleep well last night and felt exhausted all day. Need to focus on better work-life balance."
  },
  "2025-01-11": {
    date: "January 11, 2025",
    score: 93,
    mood: "Fantastic",
    activities: ["Hiking", "Cooking", "Friends"],
    sleep: "8.0 hours",
    workLife: "Great",
    reflection: "Amazing weekend hike with friends! Cooked a delicious dinner and felt completely recharged. These outdoor activities always boost my mood significantly."
  },
  "2025-01-03": {
    date: "January 3, 2025",
    score: 45,
    mood: "Okay",
    activities: ["Work", "TV", "Snacks"],
    sleep: "6.5 hours",
    workLife: "Neutral",
    reflection: "Average day, nothing particularly exciting. Felt a bit sluggish and unmotivated. Maybe I need to plan some more engaging activities for the weekend."
  }
};

const defaultFeedData = {
  date: "Selected Day",
  score: 75,
  mood: "Good",
  activities: ["Daily Log", "Reflection"],
  sleep: "7.5 hours",
  workLife: "Balanced",
  reflection: "This is a sample day entry. Click on different colored days in the heatmap to see how your mood and activities vary throughout the month."
};

export function DemoModal({ children }: DemoModalProps) {
  console.log("DemoModal component mounted");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"heatmap" | "feed">("heatmap");

  const handleDateClick = (date: string) => {
    console.log("Date clicked:", date);
    setSelectedDate(date);
    setCurrentView("feed");
  };

  const handleBackToHeatmap = () => {
    console.log("Back to heatmap");
    setCurrentView("heatmap");
    setSelectedDate(null);
  };

  // Get the current feed data based on selected date
  const currentFeedData = selectedDate && mockFeedDataMap[selectedDate] 
    ? mockFeedDataMap[selectedDate] 
    : defaultFeedData;

  console.log("DemoModal rendering, currentView:", currentView);

  return (
    <Dialog onOpenChange={(open) => console.log("Dialog open state changed:", open)}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-none w-[90vw] max-h-[85vh] p-0" style={{ maxWidth: '90vw', width: '90vw' }}>
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-primary" />
            <DialogTitle className="text-2xl font-bold">SoloPro Demo</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Interactive preview of the SoloPro mood tracking interface
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex h-[70vh] bg-zinc-50 dark:bg-zinc-900">
          {/* Authentic SoloPro Sidebar */}
          <div className="w-64 border-r border-zinc-300/30 bg-white dark:border-zinc-700/30 dark:bg-zinc-950/40 backdrop-blur-xl">
            <div className="flex flex-col justify-between h-full">
              {/* TOP SECTION */}
              <div className="relative">
                {/* Toggle Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-md hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 m-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="mt-1 space-y-3">
                  {/* SEARCH */}
                  <div>
                    <p className="px-1 pl-3 pr-2 p-2 mb-0 text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Search
                    </p>
                    <div className="relative pl-2 pr-4">
                      <div className="h-9 pl-8 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-300/60 dark:border-zinc-700/60 rounded-md flex items-center">
                        <span className="text-zinc-400 text-sm">Search</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-px bg-zinc-300/40 dark:bg-zinc-700/40 mx-2" />
                  
                  {/* ACTIONS */}
                  <div>
                    <p className="px-2 pl-3 p-2 mb-0 text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Actions
                    </p>
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentView("heatmap")}
                      className={`w-[90%] h-9 justify-start px-3 text-sm font-normal hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg ml-2 mb-1 ${
                        currentView === "heatmap" ? "bg-zinc-200/80 dark:bg-zinc-800/80" : ""
                      }`}
                    >
                      <Calendar className="mr-3 h-4 w-4 text-zinc-600 dark:text-zinc-400 flex-shrink-0" />
                      Calendar
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-[90%] h-9 justify-start px-3 text-sm font-normal hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg ml-2 mb-1"
                      disabled
                    >
                      <BarChart3 className="mr-3 h-4 w-4 text-zinc-600 dark:text-zinc-400 flex-shrink-0" />
                      Soloist
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-[90%] h-9 justify-start px-3 text-sm font-normal hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg ml-2 mb-1"
                      disabled
                    >
                      <TrendingUp className="mr-3 h-4 w-4 text-zinc-600 dark:text-zinc-400 flex-shrink-0" />
                      Playground
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* BOTTOM SECTION */}
              <div className="relative">
                <div className="h-px bg-zinc-300/40 dark:bg-zinc-700/40 mt-3" />
                <div className="mt-3 mb-2 pb-2">
                  <p className="px-2 mb-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Account
                  </p>
                  <div className="w-[90%] ml-3 py-1.5 px-2 flex items-center text-left rounded-lg">
                    <div className="h-7 w-7 flex-shrink-0 ring-1 ring-offset-1 ring-offset-zinc-50/60 dark:ring-offset-zinc-950/60 ring-zinc-300/50 dark:ring-zinc-700/50 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                      <span className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300">DU</span>
                    </div>
                    <div className="ml-2.5 overflow-hidden">
                      <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        Demo User
                      </p>
                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        demo@solopro.app
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-10"></div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {currentView === "heatmap" ? (
              <>
                {/* Authentic Heatmap Header */}
                <div className="flex-shrink-0 flex items-center justify-between mb-2 px-3 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="border-zinc-700 text-zinc-600 dark:text-zinc-300">
                      31 Logs
                    </Badge>
                    <Badge variant="outline" className="border-zinc-700 text-zinc-600 dark:text-zinc-300">
                      Avg: 74.2
                    </Badge>
                  </div>
                  <div className="cursor-help">
                    <Info className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  </div>
                </div>

                {/* Authentic Heatmap Calendar */}
                <div className="flex-1 min-h-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-900/50 rounded-md mx-3">
                  <ScrollArea className="h-full">
                    <div className="flex flex-wrap gap-1 p-3">
                      {mockHeatmapData.map((day) => {
                        const date = new Date(day.date);
                        const isSelected = selectedDate === day.date;
                        const isToday = day.date === "2025-01-15"; // Mock today
                        
                        // Authentic SoloPro color mapping
                        const getAuthenticColor = (score: number) => {
                          if (score >= 90) return "bg-indigo-400/90 hover:bg-indigo-400";
                          if (score >= 80) return "bg-blue-400/90 hover:bg-blue-400";
                          if (score >= 70) return "bg-sky-400/80 hover:bg-sky-400";
                          if (score >= 60) return "bg-teal-400/80 hover:bg-teal-400";
                          if (score >= 50) return "bg-green-400/80 hover:bg-green-400";
                          if (score >= 40) return "bg-lime-400/80 hover:bg-lime-400";
                          if (score >= 30) return "bg-yellow-400/80 hover:bg-yellow-400";
                          if (score >= 20) return "bg-amber-500/80 hover:bg-amber-500";
                          if (score >= 10) return "bg-orange-500/80 hover:bg-orange-500";
                          return "bg-rose-600/80 hover:bg-rose-600";
                        };

                        return (
                          <div
                            key={day.date}
                            onClick={() => handleDateClick(day.date)}
                            className={`
                              flex items-center justify-center cursor-pointer
                              w-6 h-6 rounded-sm text-[10px] font-medium transition-all duration-150
                              ${getAuthenticColor(day.score)}
                              ${isSelected ? "ring-1 ring-blue-600" : isToday ? "ring-1 ring-red-600 dark:ring-zinc-300" : ""}
                              text-zinc-800/90 dark:text-zinc-100/90
                            `}
                            style={{ outline: "0.5px solid rgba(0,0,0,0.1)" }}
                            title={`${date.getDate()} - Score: ${day.score}`}
                          >
                            {date.getDate()}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Authentic Legend */}
                <div className="flex-shrink-0 mt-2 mb-2 px-4 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="mb-2">Score legend:</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "90-100", color: "bg-indigo-400" },
                      { label: "80-89", color: "bg-blue-400" },
                      { label: "70-79", color: "bg-sky-400" },
                      { label: "60-69", color: "bg-teal-400" },
                      { label: "50-59", color: "bg-green-400" },
                      { label: "40-49", color: "bg-lime-400" },
                      { label: "30-39", color: "bg-yellow-400" },
                      { label: "20-29", color: "bg-amber-500" },
                      { label: "10-19", color: "bg-orange-500" },
                      { label: "0-9", color: "bg-rose-600" },
                    ].map((l) => (
                      <div
                        key={l.label}
                        className="flex items-center gap-1.5 text-xs cursor-pointer transition-opacity duration-200 px-1 py-0.5 rounded-sm hover:bg-zinc-800/30"
                      >
                        <div className={`w-3 h-3 rounded-sm ${l.color}`} />
                        <span className="text-zinc-600 dark:text-zinc-400">{l.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    💡 <strong>Demo Tip:</strong> Click any day to view detailed logs and AI insights
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Feed Header */}
                <div className="p-4 bg-white dark:bg-zinc-800 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleBackToHeatmap}>
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <h2 className="text-lg font-semibold">{currentFeedData.date}</h2>
                  </div>
                </div>

                {/* Feed Content */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6 max-w-2xl">
                    {/* Score Card */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Daily Score</CardTitle>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {currentFeedData.score}
                            </div>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {currentFeedData.mood}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Activities */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Smile className="h-5 w-5" />
                          Activities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {currentFeedData.activities.map((activity: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sleep & Work-Life */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Moon className="h-4 w-4" />
                            Sleep
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-semibold">{currentFeedData.sleep}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Briefcase className="h-4 w-4" />
                            Work-Life
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-semibold">{currentFeedData.workLife}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Reflection */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Coffee className="h-5 w-5" />
                          Daily Reflection
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {currentFeedData.reflection}
                        </p>
                      </CardContent>
                    </Card>

                    {/* AI Insights */}
                    <Card className="border-primary/20 bg-primary/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                          <Brain className="h-5 w-5" />
                          AI Insights by Solomon
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="p-3 bg-white dark:bg-zinc-800 rounded-lg">
                            <p className="text-sm">
                              <strong>Pattern Recognition:</strong> Your highest scores consistently occur on days with morning exercise and evening meditation.
                            </p>
                          </div>
                          <div className="p-3 bg-white dark:bg-zinc-800 rounded-lg">
                            <p className="text-sm">
                              <strong>Forecast:</strong> Based on your patterns, tomorrow has a 87% likelihood of being a high-scoring day.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </>
            )}
          </div>
        </div>

        {/* Demo Footer */}
        <div className="p-4 bg-muted/50 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            This is a demo preview. The actual SoloPro app includes real-time data sync, advanced analytics, and personalized AI forecasting.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 