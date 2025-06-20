// SPLIT SCREEN
// /Users/matthewsimon/Documents/Github/solopro/website/components/SplitScreen.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, ThumbsUp, ThumbsDown, Calendar, TrendingUp, MessageCircle } from "lucide-react";

export function SplitScreen() {
  const [selectedInsight, setSelectedInsight] = useState(0);

  // Enhanced insights with more realistic content
  const insights = [
    "Your scores show a strong recovery pattern after challenging days, indicating excellent resilience.",
    "Weekend scores consistently higher (avg 82) - consider incorporating weekend activities into weekdays.",
    "Mood stability improved 23% this month compared to previous period."
  ];

  // Realistic chart data with varied scores
  const chartPoints = [
    { day: 'Mon', score: 45 },
    { day: 'Tue', score: 62 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 74 },
    { day: 'Fri', score: 85 },
    { day: 'Sat', score: 91 },
    { day: 'Sun', score: 88 }
  ];

  // Heatmap color function matching the 10-category system
  const getHeatmapColor = (score: number | null): string => {
    if (score === null) return "bg-zinc-200/60 border border-zinc-300/50";
    if (score >= 90) return "bg-indigo-400";
    if (score >= 80) return "bg-blue-400";
    if (score >= 70) return "bg-sky-400";
    if (score >= 60) return "bg-teal-400";
    if (score >= 50) return "bg-green-400";
    if (score >= 40) return "bg-lime-400";
    if (score >= 30) return "bg-yellow-400";
    if (score >= 20) return "bg-amber-500";
    if (score >= 10) return "bg-orange-500";
    return "bg-rose-600";
  };

  const getTextColor = (score: number | null): string => {
    if (score === null) return "text-zinc-500";
    if (score >= 50) return "text-zinc-900";
    return "text-zinc-100";
  };

  // Sample heatmap data for the calendar
  const heatmapData = [
    { day: 15, score: null },
    { day: 16, score: 67 },
    { day: 17, score: 73 },
    { day: 18, score: 78 }, // Selected day
    { day: 19, score: 85 },
    { day: 20, score: 91 },
    { day: 21, score: 88 },
    { day: 22, score: 45 },
    { day: 23, score: 62 },
    { day: 24, score: 74 },
    { day: 25, score: 82 },
    { day: 26, score: 76 },
    { day: 27, score: 89 },
    { day: 28, score: 93 },
    { day: 29, score: null },
    { day: 30, score: 58 },
    { day: 31, score: 66 },
    { day: 1, score: 71 },
    { day: 2, score: 79 },
    { day: 3, score: 84 },
    { day: 4, score: 87 }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 h-96">
          {/* Left Side - Enhanced Analytics */}
          <div className="p-6 space-y-4 border-r border-gray-100 bg-gray-50/50">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
            </div>

            {/* Key Insights */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500" />
                Key Insights
              </h3>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div 
                    key={index}
                    className={`text-xs p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedInsight === index 
                        ? 'bg-blue-50 border-blue-200 text-blue-900' 
                        : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedInsight(index)}
                  >
                    {insight}
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Weekly Trend</h3>
              <div className="h-24">
                <svg viewBox="0 0 280 80" className="w-full h-full">
                   {/* Grid lines */}
                   {[20, 40, 60].map(y => (
                     <line key={y} x1="30" y1={y} x2="250" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
                   ))}

                   {/* Chart line and points */}
                   {chartPoints.map((point, index) => {
                     const x = 40 + index * 32;
                     const y = 70 - (point.score * 0.5);
                     const color = point.score >= 80 ? '#3b82f6' : point.score >= 60 ? '#10b981' : '#f59e0b';

                     return (
                       <g key={index}>
                         <text x={x} y="78" textAnchor="middle" className="text-xs fill-gray-500 font-medium">
                           {point.day}
                         </text>
                         <circle cx={x} cy={y} r="3" fill={color} stroke="white" strokeWidth="2" />
                         <text x={x} y={y - 8} textAnchor="middle" className="text-xs fill-gray-700 font-medium">
                           {point.score}
                         </text>
                         {index > 0 && (
                           <line
                             x1={40 + (index - 1) * 32}
                             y1={70 - (chartPoints[index - 1].score * 0.5)}
                             x2={x}
                             y2={y}
                             stroke={color}
                             strokeWidth="2"
                           />
                         )}
                       </g>
                     );
                   })}
                 </svg>
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Feed */}
          <div className="bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
            {/* Feed Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold text-gray-900">Feed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Jan 18, 2024</span>
                  <div className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-medium">
                    78
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Calendar Grid */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="grid grid-cols-7 gap-1">
                {heatmapData.map((item, i) => {
                  const isSelected = item.day === 18;
                  const colorClass = getHeatmapColor(item.score);
                  const textColor = getTextColor(item.score);

                  return (
                    <div
                      key={i}
                      className={`
                        w-6 h-6 rounded-sm flex items-center justify-center text-xs font-medium
                        transition-all duration-150 cursor-pointer hover:scale-105
                        ${colorClass} ${textColor}
                        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                      `}
                      title={`${item.day}: ${item.score ? `${item.score}/100` : 'No log'}`}
                    >
                      {item.day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced AI Message */}
            <div className="flex-1 p-4 space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center mt-1">
                    <Image 
                      src="/solologo.svg" 
                      alt="Soloist AI" 
                      width={32} 
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 leading-relaxed mb-3">
                      Great progress today! Your score of 78 shows strong emotional balance. 
                      I noticed you mentioned feeling accomplished after your presentation - 
                      that confidence boost is reflected in your improved mood pattern.
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">Was this helpful?</span>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-green-500 cursor-pointer hover:text-green-600" />
                          <span className="text-green-500">12</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsDown className="h-3 w-3 text-gray-400 cursor-pointer hover:text-gray-500" />
                          <span className="text-gray-400">1</span>
                        </div>
                      </div>
                      <span className="text-gray-400">2h ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced User Comments */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">M</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span className="font-medium text-gray-700">Matthew</span>
                      <span>•</span>
                      <span>3m ago</span>
                    </div>
                    <div className="text-sm text-gray-900">
                      The presentation went amazing! Feeling confident and energized. 💪
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">S</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span className="font-medium text-gray-700">Sarah</span>
                      <span>•</span>
                      <span>1h ago</span>
                    </div>
                    <div className="text-sm text-gray-900">
                      Congratulations! 🎉 Your hard work is paying off.
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment Input */}
              <div className="flex items-center gap-2 mt-4">
                <MessageCircle className="h-4 w-4 text-gray-400" />
                <div className="flex-1 text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-2">
                  Add a comment...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
