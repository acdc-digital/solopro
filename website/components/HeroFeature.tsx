// HERO FEATURE
// /Users/matthewsimon/Documents/Github/solopro/website/components/HeroFeature.tsx

"use client";

import React, { useState } from "react";
import { Calendar, Sliders, MessageSquare, Users, Send, X, ArrowLeft, TrendingUp } from "lucide-react";

export function HeroFeature() {
  const [selectedDay, setSelectedDay] = useState(21);
  const [workLifeBalance, setWorkLifeBalance] = useState(5);
  const [showFeed, setShowFeed] = useState(false);

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

  const handleSubmit = () => {
    setShowFeed(true);
  };

  const handleBackToForm = () => {
    setShowFeed(false);
  };

  // Feed mockup data
  const feedMockupData = [
    {
      date: "Yesterday", 
      score: 62,
      color: "bg-yellow-500",
      summary: "Steady progress with some challenges",
      insights: ["Good sleep quality", "Work deadlines caused stress", "Evening exercise helped"],
      tags: ["Productive", "Stressful", "Active"]
    },
    {
      date: "2 days ago",
      score: 58,
      color: "bg-lime-500", 
      summary: "Balanced day with mixed emotions",
      insights: ["Morning routine worked well", "Afternoon energy dip", "Social evening lifted mood"],
      tags: ["Routine", "Social", "Mixed"]
    }
  ];

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
                <div className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-md text-center">
                  Soloist.
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form or Feed */}
          <div className="bg-card text-card-foreground p-6 border-l border-border h-[500px]">
            {!showFeed ? (
              /* Daily Log Form - Match Left Structure */
              <div className="text-left mb-8">
                {/* Header - matches left tagline */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Daily Check-in</h2>
                  <p className="text-sm text-muted-foreground">How are you feeling today?</p>
                </div>

                {/* Work-Life Balance */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Work-Life Balance</span>
                    <span className="text-lg font-bold text-primary">{workLifeBalance}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={workLifeBalance}
                    onChange={(e) => setWorkLifeBalance(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted border border-input rounded-lg appearance-none cursor-pointer"
                    aria-label="Work-life balance level"
                  />
                </div>

                {/* Form Fields - equivalent to calendar grid */}
                <div className="space-y-2 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Sleep Quality</label>
                    <select 
                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      aria-label="Sleep quality"
                    >
                      <option>Great (8+ hrs)</option>
                      <option>Good (6-7 hrs)</option>
                      <option>Poor (&lt;6 hrs)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Today's Highlight</label>
                    <textarea
                      placeholder="What made today special?"
                      rows={2}
                      className="w-full bg-background border border-input rounded-md px-3 py-5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button - matches left button with mt-8 */}
                <div className="mt-8">
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-md transition-colors"
                  >
                    Submit Entry
                  </button>
                </div>
              </div>
            ) : (
              /* Feed Mockup - Simplified */
              <>
                {/* Feed Header */}
                <div className="mb-4 flex items-center justify-between pb-3 border-b">
                  <h2 className="text-lg font-semibold">Your Insights</h2>
                  <button
                    onClick={handleBackToForm}
                    className="p-1 hover:bg-muted rounded transition-colors"
                    aria-label="Back to form"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Feed Content - Contained */}
                <div className="flex-grow overflow-y-auto space-y-3" style={{ maxHeight: '320px' }}>
                  {feedMockupData.map((entry, index) => (
                    <div key={index} className="bg-muted/20 rounded-md p-3 border border-border/30">
                      {/* Entry Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">{entry.date}</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${entry.color}`}></div>
                          <span className="text-sm font-bold">{entry.score}</span>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-sm text-foreground mb-2">{entry.summary}</p>

                      {/* Tags Only */}
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Back to Form Button */}
                <div className="mt-4 pt-3 border-t">
                  <button
                    onClick={handleBackToForm}
                    className="w-full bg-muted text-foreground font-medium py-2 px-4 rounded-md transition-colors hover:bg-muted/80 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Form
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 