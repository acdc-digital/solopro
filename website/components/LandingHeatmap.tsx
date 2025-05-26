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
  
  for (let i = 20; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayOfWeek = date.getDay();
    
    // Base score with realistic patterns
    let baseScore = 65; // Average around 65
    
    // Weekend boost
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseScore += 10;
    }
    
    // Monday blues
    if (dayOfWeek === 1) {
      baseScore -= 8;
    }
    
    // Friday energy
    if (dayOfWeek === 5) {
      baseScore += 5;
    }
    
    // Random variation
    baseScore += (Math.random() - 0.5) * 30;
    
    // Some missing days (realistic) - about 10%
    const hasMissingDay = Math.random() < 0.1;
    
    data.push({
      date: date.toISOString().split('T')[0],
      score: hasMissingDay ? null : Math.max(0, Math.min(100, Math.round(baseScore))),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

// Use consistent color scheme matching the main app
const getColorClass = (score: number | null): string => {
  if (score === null) return "bg-muted border border-border";
  if (score >= 90) return "bg-indigo-500 hover:bg-indigo-600 border border-indigo-600";
  if (score >= 80) return "bg-blue-500 hover:bg-blue-600 border border-blue-600";
  if (score >= 70) return "bg-sky-500 hover:bg-sky-600 border border-sky-600";
  if (score >= 60) return "bg-teal-500 hover:bg-teal-600 border border-teal-600";
  if (score >= 50) return "bg-green-500 hover:bg-green-600 border border-green-600";
  if (score >= 40) return "bg-lime-500 hover:bg-lime-600 border border-lime-600";
  if (score >= 30) return "bg-yellow-500 hover:bg-yellow-600 border border-yellow-600";
  if (score >= 20) return "bg-amber-500 hover:bg-amber-600 border border-amber-600";
  if (score >= 10) return "bg-orange-500 hover:bg-orange-600 border border-orange-600";
  return "bg-rose-600 hover:bg-rose-700 border border-rose-700";
};

const getTextColorClass = (score: number | null): string => {
  if (score === null) return "text-muted-foreground";
  return "text-white";
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

        {/* Footer with legend hint */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Higher scores = warmer colors</span>
            <span>Click any day to view details</span>
          </div>
        </div>
      </div>
    </div>
  );
}
