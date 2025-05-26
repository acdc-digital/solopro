// HERO FEATURE
// /Users/matthewsimon/Documents/Github/solopro/website/components/HeroFeature.tsx

"use client";

import React, { useState } from "react";
import { Calendar, Sliders, MessageSquare, Users } from "lucide-react";

export function HeroFeature() {
  const [selectedDay, setSelectedDay] = useState(21);
  const [workLifeBalance, setWorkLifeBalance] = useState(5);

  // Generate calendar data matching the hero image
  const calendarData = [
    // Week 1
    [null, null, null, null, 1, 5, 3],
    // Week 2  
    [8, 6, 8, 11, 12, 13, 14],
    // Week 3
    [13, 13, 16, 17, 21, 22, 23],
    // Week 4
    [22, 20, 24, 21, 28, 29, 27],
    // Week 5
    [29, 30, null, null, null, null, null]
  ];

  // Use consistent color scheme from the app
  const getCalendarColor = (score: number | null, day: number) => {
    if (score === null) return "bg-muted border border-border text-muted-foreground";
    
    // Use the same color mapping as the main app
    if (score >= 20) return "bg-amber-500 hover:bg-amber-600 text-white border border-amber-600";
    if (score >= 15) return "bg-yellow-500 hover:bg-yellow-600 text-white border border-yellow-600";
    if (score >= 10) return "bg-lime-500 hover:bg-lime-600 text-white border border-lime-600";
    if (score >= 5) return "bg-green-500 hover:bg-green-600 text-white border border-green-600";
    if (score >= 3) return "bg-teal-500 hover:bg-teal-600 text-white border border-teal-600";
    if (score >= 1) return "bg-sky-500 hover:bg-sky-600 text-white border border-sky-600";
    
    return "bg-muted border border-border text-muted-foreground";
  };

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left Side - Calendar Interface */}
          <div className="p-6 bg-muted/30">
            {/* Browser Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>

            {/* SoloPro Header */}
            <div className="text-left mb-8">
              <div className="flex gap-2 mb-6">
                <Calendar className="mt-1 mr-1 h-5 w-5 text-primary" />
                <h1 className="text-md text-muted-foreground">
                  Take control of tomorrow, today.
                </h1>
              </div>
              
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map((day, index) => (
                  <div key={index} className="text-sm font-medium text-muted-foreground text-center py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="space-y-2">
                {calendarData.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-2">
                    {week.map((score, dayIndex) => {
                      const dayNumber = score || (weekIndex * 7 + dayIndex + 1);
                      const isSelected = dayNumber === selectedDay;
                      
                      return (
                        <div
                          key={dayIndex}
                          className={`
                            aspect-square rounded-md flex items-center justify-center text-sm font-semibold
                            cursor-pointer transition-all duration-200 hover:scale-105
                            ${getCalendarColor(score, dayNumber)}
                            ${isSelected ? 'ring-2 ring-ring ring-offset-2' : ''}
                          `}
                          onClick={() => setSelectedDay(dayNumber)}
                        >
                          {score !== null ? dayNumber : ''}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-md transition-colors">
                  Soloist.
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Daily Log Form */}
          <div className="bg-card text-card-foreground p-4 flex flex-col border-l border-border">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Daily Log Form</h2>
              <p className="text-sm text-muted-foreground">Track your daily wellness metrics</p>
            </div>

            {/* Work-Life Balance Section */}
            <div className="mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">Work-Life Balance</h3>
              </div>
              
              {/* Slider */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Balance Level</span>
                  <span className="text-lg font-bold text-primary">{workLifeBalance}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={workLifeBalance}
                    onChange={(e) => setWorkLifeBalance(parseInt(e.target.value))}
                    className="w-full h-4 bg-muted border border-input rounded-lg appearance-none cursor-pointer"
                    aria-label="Work-life balance level"
                  />
                </div>
              </div>
            </div>

            {/* Basic Wellness Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Basic Wellness</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Hours of sleep?</label>
                  <input
                    type="text"
                    placeholder="Enter hours..."
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            {/* Quick Reflections Section */}
            <div className="mb-0">
              <div className="flex items-center gap-2 mb-0">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">Quick Reflections</h3>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">What was the best part of your day?</label>
                <textarea
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 