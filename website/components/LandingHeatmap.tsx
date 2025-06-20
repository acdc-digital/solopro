// LANDING HEATMAP
// /Users/matthewsimon/Documents/Github/solopro/website/components/LandingHeatmap.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Calendar, TrendingUp } from "lucide-react";

interface MockDayData {
  date: string;
  score: number | null;
  dayName: string;
  formattedDate: string;
}

// Generate realistic mock data for the last 21 days (3 weeks)
const generateMockData = (): MockDayData[] => {
  const data: MockDayData[] = [];
  const today = new Date();
  
  // Predefined realistic score patterns to showcase all color ranges
  const scorePatterns = [
    // Week 1: Mixed week with some challenges
    [32, 52, 67, 73, 81, 88, 92], // yellow, green, teal, sky, blue, blue, indigo
    // Week 2: Tough week with recovery
    [68, null, 35, 41, 58, 22, 79], // amber, orange, yellow, lime, green, teal, sky
    // Week 3: Recent good streak with some setbacks
    [88, 38, 76, 68, 55, 83, null], // amber, yellow, sky, teal, green, blue, no log
  ];
  
  const flatScores = scorePatterns.flat();
  
  for (let i = 20; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const scoreIndex = 20 - i;
    const score = flatScores[scoreIndex];
    
    data.push({
      date: date.toISOString().split('T')[0],
      score: score,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

// Use the exact 10-category color system matching the main app heatmap
const getColorClass = (score: number | null): string => {
  if (score === null) return "bg-zinc-200/60 border border-zinc-300/50 opacity-90";
  if (score >= 90) return "bg-indigo-400 hover:bg-indigo-500 border border-indigo-500 opacity-90";
  if (score >= 80) return "bg-blue-400 hover:bg-blue-500 border border-blue-500 opacity-90";
  if (score >= 70) return "bg-sky-400 hover:bg-sky-500 border border-sky-500 opacity-90";
  if (score >= 60) return "bg-teal-400 hover:bg-teal-500 border border-teal-500 opacity-90";
  if (score >= 50) return "bg-green-400 hover:bg-green-500 border border-green-500 opacity-90";
  if (score >= 40) return "bg-lime-400 hover:bg-lime-500 border border-lime-500 opacity-90";
  if (score >= 30) return "bg-yellow-400 hover:bg-yellow-500 border border-yellow-500 opacity-90";
  if (score >= 20) return "bg-amber-500 hover:bg-amber-600 border border-amber-600 opacity-90";
  if (score >= 10) return "bg-orange-500 hover:bg-orange-600 border border-orange-600 opacity-90";
  return "bg-rose-600 hover:bg-rose-700 border border-rose-700 opacity-90";
};

const getTextColorClass = (score: number | null): string => {
  if (score === null) return "text-zinc-500";
  // Light text for darker colors, dark text for lighter colors
  if (score >= 50) return "text-zinc-900"; // Lighter colors: green, lime, yellow
  return "text-zinc-100"; // Darker colors: indigo, blue, sky, teal, amber, orange, rose
};

export function LandingHeatmap() {
  const [mockData, setMockData] = useState<MockDayData[]>([]);

  useEffect(() => {
    setMockData(generateMockData());
  }, []);

  // Calculate simple stats
  const validScores = mockData.filter(d => d.score !== null).map(d => d.score!);
  const averageScore = validScores.length > 0 
    ? (validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(1)
    : "0";
  const currentStreak = mockData.slice(-7).filter(d => d.score !== null).length;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-card rounded-lg border border-border shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-card-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              3-Week Pattern
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Avg: {averageScore}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{currentStreak}/7 days this week</span>
            <span>21 day view</span>
          </div>
        </div>

        {/* 21-Day Grid (3 weeks) */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {mockData.map((day, index) => {
              const isToday = index === mockData.length - 1;
              const colorClass = getColorClass(day.score);
              const textColorClass = getTextColorClass(day.score);
              
              return (
                <div
                  key={`${day.date}-${index}`}
                  className={`
                    aspect-square rounded-md cursor-pointer transition-all duration-150 ease-in-out
                    flex flex-col items-center justify-center p-1 text-xs font-medium
                    ${colorClass}
                    ${isToday ? 'ring-2 ring-ring ring-offset-1' : ''}
                    hover:scale-105
                  `}
                  title={`${day.formattedDate}: ${day.score ? `${day.score}/100` : 'No log'}`}
                >
                  <div className={`text-[10px] ${textColorClass} opacity-80`}>
                    {day.dayName}
                  </div>
                  <div className={`text-sm font-bold ${textColorClass}`}>
                    {day.score !== null ? day.score : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with color legend */}
        <div className="px-4 pb-4">
          <div className="text-xs text-muted-foreground mb-2">Score Legend:</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-indigo-400"></div>
              <span className="text-zinc-600">90-100</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
              <span className="text-zinc-600">80-89</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-sky-400"></div>
              <span className="text-zinc-600">70-79</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-teal-400"></div>
              <span className="text-zinc-600">60-69</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-green-400"></div>
              <span className="text-zinc-600">50-59</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-lime-400"></div>
              <span className="text-zinc-600">40-49</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-yellow-400"></div>
              <span className="text-zinc-600">30-39</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
              <span className="text-zinc-600">20-29</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-zinc-200/60 border border-zinc-300/50"></div>
              <span className="text-zinc-600">No log</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
