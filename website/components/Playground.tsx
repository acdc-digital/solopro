// PLAYGROUND DEMO
// /Users/matthewsimon/Documents/Github/solopro/website/components/Playground.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Calendar, TrendingUp, TrendingDown, Sparkles, ChevronLeft, ChevronRight, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";

interface PlaygroundDay {
  date: string;
  dayName: string;
  shortDay: string;
  formattedDate: string;
  emotionScore: number | null;
  isFuture: boolean;
  isPast: boolean;
  isToday: boolean;
  description: string;
  details: string;
  trend?: "up" | "down" | null;
  confidence?: number;
}

// Generate 7 days of realistic forecast data
const generatePlaygroundData = (): PlaygroundDay[] => {
  const data: PlaygroundDay[] = [];
  const today = new Date();
  
  // Generate 4 past days + today + 3 future days
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayOfWeek = date.getDay();
    const isToday = i === 0;
    const isFuture = i > 0;
    const isPast = i < 0;
    
    // Create realistic scores
    let baseScore = 70;
    
    // Weekend boost
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseScore += 12;
    }
    
    // Monday dip
    if (dayOfWeek === 1) {
      baseScore -= 8;
    }
    
    // Friday boost
    if (dayOfWeek === 5) {
      baseScore += 8;
    }
    
    // Add some variation
    baseScore += (Math.random() - 0.5) * 20;
    
    // Future days get forecast scores
    if (isFuture) {
      baseScore += (Math.random() - 0.3) * 15; // Slight optimistic bias
    }
    
    const score = Math.max(30, Math.min(95, Math.round(baseScore)));
    
    data.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      shortDay: date.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      emotionScore: score,
      isFuture,
      isPast,
      isToday,
      description: isFuture 
        ? `Forecasted ${score >= 80 ? 'Great' : score >= 60 ? 'Good' : 'Challenging'} Day`
        : isPast 
        ? `Historical ${score >= 80 ? 'Great' : score >= 60 ? 'Good' : 'Tough'} Day`
        : `Today's Mood Score`,
      details: isFuture
        ? `AI predicts a ${score >= 80 ? 'positive and energetic' : score >= 60 ? 'balanced and steady' : 'more challenging but manageable'} day based on your patterns.`
        : isPast
        ? `You logged feeling ${score >= 80 ? 'excellent with high energy' : score >= 60 ? 'balanced and content' : 'challenged but resilient'} on this day.`
        : `Your current mood and energy levels for today.`,
      trend: Math.random() > 0.5 ? "up" : "down",
      confidence: isFuture ? Math.round(75 + Math.random() * 20) : undefined
    });
  }
  
  return data;
};

// Use the same fall color palette from LandingHeatmap
const getColorClass = (score: number | null): string => {
  if (score === null) return "bg-gray-100 border border-gray-200";
  if (score >= 90) return "bg-emerald-500 hover:bg-emerald-600 border border-emerald-600";
  if (score >= 80) return "bg-teal-500 hover:bg-teal-600 border border-teal-600";
  if (score >= 70) return "bg-green-500 hover:bg-green-600 border border-green-600";
  if (score >= 60) return "bg-amber-500 hover:bg-amber-600 border border-amber-600";
  if (score >= 50) return "bg-orange-500 hover:bg-orange-600 border border-orange-600";
  if (score >= 40) return "bg-red-500 hover:bg-red-600 border border-red-600";
  if (score >= 30) return "bg-rose-500 hover:bg-rose-600 border border-rose-600";
  return "bg-slate-500 hover:bg-slate-600 border border-slate-600";
};

const getTextColorClass = (score: number | null): string => {
  if (score === null) return "text-gray-500";
  return "text-white";
};

const TrendIcon = ({ trend }: { trend?: "up" | "down" | null }) => {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-green-200" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-red-200" />;
  return <Sparkles className="h-3 w-3 text-blue-200 opacity-70" />;
};

export function PlaygroundDemo() {
  const [playgroundData, setPlaygroundData] = useState<PlaygroundDay[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(3); // Default to today (index 3)

  useEffect(() => {
    setPlaygroundData(generatePlaygroundData());
  }, []);

  // Navigation handlers
  const navigatePrevDay = () => setSelectedDayIndex(prev => Math.max(0, prev - 1));
  const navigateNextDay = () => setSelectedDayIndex(prev => Math.min(6, prev + 1));

  if (playgroundData.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 text-center text-gray-500">
            Loading demo...
          </div>
        </div>
      </div>
    );
  }

  const selectedDay = playgroundData[selectedDayIndex];
  const averageScore = playgroundData.reduce((sum, day) => sum + (day.emotionScore || 0), 0) / playgroundData.length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  7-Day Mood Forecast
                </h3>
                <p className="text-xs text-gray-600">Interactive prediction demo</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Avg Score</div>
              <div className="text-lg font-bold text-gray-900">{averageScore.toFixed(0)}</div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast Grid */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {playgroundData.map((day, index) => {
              const isSelected = selectedDayIndex === index;
              const colorClass = getColorClass(day.emotionScore);
              const textColorClass = getTextColorClass(day.emotionScore);
              
              return (
                <div
                  key={day.date}
                  className={`
                    aspect-square rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                    flex flex-col items-center justify-center p-2 text-xs font-medium
                    ${colorClass}
                    ${isSelected ? 'scale-105' : 'hover:scale-105'}
                    ${day.isFuture ? 'shadow-lg' : ''}
                    transform hover:z-10
                  `}
                  onClick={() => setSelectedDayIndex(index)}
                  title={`${day.formattedDate}: ${day.emotionScore}/100`}
                >
                  <div className={`text-[10px] ${textColorClass} opacity-90 font-medium`}>
                    {day.shortDay}
                  </div>
                  <div className={`text-sm font-bold ${textColorClass} flex items-center gap-1`}>
                    <span>{day.emotionScore}</span>
                    {day.isFuture && day.trend && (
                      <TrendIcon trend={day.trend} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Day Details */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-4 border border-gray-100">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button 
                onClick={navigatePrevDay}
                disabled={selectedDayIndex === 0}
                className="p-1 rounded-md hover:bg-white/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous day"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <h4 className="text-sm font-semibold text-gray-900">
                {selectedDay.dayName} - {selectedDay.formattedDate}
              </h4>
              <button 
                onClick={navigateNextDay}
                disabled={selectedDayIndex === 6}
                className="p-1 rounded-md hover:bg-white/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next day"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Details */}
            <div className="flex items-start gap-4">
              {/* Score Display */}
              <div className={`
                w-16 h-16 rounded-lg flex items-center justify-center
                ${getColorClass(selectedDay.emotionScore)}
              `}>
                <span className="text-xl font-bold text-white">
                  {selectedDay.emotionScore}
                </span>
              </div>

              {/* Text Details */}
              <div className="flex-1">
                <h5 className="text-sm font-medium text-gray-900 mb-1">
                  {selectedDay.description}
                </h5>
                <p className="text-xs text-gray-600 mb-2">
                  {selectedDay.details}
                </p>
                {selectedDay.isFuture && selectedDay.confidence && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Sparkles className="h-3 w-3" />
                    <span>Forecast confidence: {selectedDay.confidence}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}