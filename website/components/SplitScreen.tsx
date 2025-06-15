// SPLIT SCREEN
// /Users/matthewsimon/Documents/Github/solopro/website/components/SplitScreen.tsx

"use client";

import React, { useState } from "react";
import { ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";

export function SplitScreen() {
  const [selectedInsight, setSelectedInsight] = useState(0);

  // Simplified insights
  const insights = [
    "Gradual decline in emotional scores from 78 to 58 over 5 days, indicating potential need for self-care.",
    "Forecasted scores show stable trend 58-64, suggesting emotional balance ahead.",
    "Consider incorporating positive influences from past week into daily routine."
  ];

  // Simple chart data
  const chartPoints = [
    { day: 'Tue', score: 65 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 74 },
    { day: 'Fri', score: 65 },
    { day: 'Sat', score: 68 },
    { day: 'Sun', score: 64 },
    { day: 'Mon', score: 58 }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 h-80">
          {/* Left Side - Insights & Chart */}
          <div className="p-4 space-y-4 border-r border-gray-100">
            {/* Key Insights */}
            <div className="bg-white rounded-lg border border-gray-100 p-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Insights</h3>
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-2 text-xs cursor-pointer p-1 rounded hover:bg-gray-50"
                    onClick={() => setSelectedInsight(index)}
                  >
                    <ArrowRight className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Chart */}
            <div className="bg-white rounded-lg border border-gray-100 p-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Weekly Pattern</h3>
              <div className="h-20">
                <svg viewBox="0 0 200 60" className="w-full h-full">
                  {/* Simple line chart */}
                  {chartPoints.map((point, index) => {
                    const x = 20 + index * 25;
                    const y = 50 - (point.score * 0.4);
                    
                    return (
                      <g key={index}>
                        <text x={x} y="58" textAnchor="middle" className="text-xs fill-gray-500">
                          {point.day}
                        </text>
                        <circle cx={x} cy={y} r="2" fill="#4f46e5" />
                        {index > 0 && (
                          <line 
                            x1={20 + (index - 1) * 25} 
                            y1={50 - (chartPoints[index - 1].score * 0.4)}
                            x2={x} 
                            y2={y}
                            stroke="#4f46e5" 
                            strokeWidth="1.5"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Right Side - Feed */}
          <div className="bg-black text-white flex flex-col">
            {/* Header */}
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Feed</span>
                <span className="text-xs text-gray-400">Jan 18, 2024</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-3 border-b border-gray-700">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 21 }, (_, i) => {
                  const day = i + 15;
                  const isSelected = day === 18;
                  const hasData = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].includes(day);
                  
                  return (
                    <div
                      key={i}
                      className={`
                        w-6 h-6 rounded text-center flex items-center justify-center text-xs
                        ${isSelected ? 'bg-blue-600' : ''}
                        ${hasData && !isSelected ? 'bg-teal-500' : ''}
                        ${!hasData && !isSelected ? 'text-gray-500' : ''}
                      `}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Message */}
            <div className="flex-1 p-3">
              <div className="bg-[#323232] rounded-lg p-3 mb-3">
                <p className="text-sm leading-relaxed mb-2">
                  Hello there! It sounds like you had a day filled with both challenges and achievements. 
                  Consider setting boundaries around work hours to prioritize family time.
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>Was this helpful?</span>
                    <ThumbsUp className="h-3 w-3 text-green-400" />
                    <ThumbsDown className="h-3 w-3" />
                  </div>
                  <span>1h ago</span>
                </div>
              </div>

              {/* User Comment */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs">M</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400">Matthew • 2m ago</div>
                  <div className="text-sm">I had a big presentation today!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
