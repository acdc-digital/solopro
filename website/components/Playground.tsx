// DAILY LOG FORM DEMO
// /Users/matthewsimon/Documents/Github/solopro/website/components/Playground.tsx

"use client";

import React, { useState } from "react";
import { Calendar, Sparkles, Heart, Zap } from "lucide-react";



export function PlaygroundDemo() {
  const [activeTab, setActiveTab] = useState("form");
  const [mood, setMood] = useState(7);
  const [exercise, setExercise] = useState(true);
  const [highlight, setHighlight] = useState("");
  const [aiScore, setAiScore] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateScore = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const moodPoints = mood * 8;
      const exercisePoints = exercise ? 20 : 0;
      const highlightPoints = highlight.length > 0 ? 15 : 0;
      const total = moodPoints + exercisePoints + highlightPoints;
      const score = Math.min(95, Math.max(45, total));
      
      setAiScore(score);
      setIsCalculating(false);
      setActiveTab("result");
    }, 800);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 65) return "text-green-600";
    return "text-amber-600";
  };

  return (
    <div className="w-full max-w-xl mx-left">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">Daily Log</h3>
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">Demo</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "form" ? (
            <div className="space-y-4">
              {/* Mood Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    Mood
                  </label>
                  <span className="text-sm font-bold text-gray-900">{mood}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(mood - 1) * 11.11}%, #e5e7eb ${(mood - 1) * 11.11}%, #e5e7eb 100%)`
                  }}
                  aria-label="Mood rating"
                />
              </div>

              {/* Exercise Checkbox */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exercise}
                    onChange={(e) => setExercise(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Exercise today
                  </span>
                </label>
              </div>

              {/* Highlight */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Today's highlight
                </label>
                <textarea
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  placeholder="What made your day great?"
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={calculateScore}
                disabled={isCalculating}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCalculating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Get AI Score
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
                <Sparkles className="h-3 w-3" />
                Analysis Complete
              </div>
              
              <div className={`text-5xl font-bold ${getScoreColor(aiScore)}`}>
                {aiScore}
              </div>
              
              <p className="text-sm text-gray-600 max-w-xs mx-auto">
                {aiScore >= 80 ? "Great day! Keep it up." : aiScore >= 65 ? "Good day overall." : "Room to improve tomorrow."}
              </p>

              <button
                onClick={() => setActiveTab("form")}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}