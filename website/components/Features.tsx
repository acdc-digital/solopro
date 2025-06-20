// FEATURES
// /Users/matthewsimon/Documents/Github/solopro/website/components/Features.tsx

"use client";

import { Sparkles, TrendingUp, BarChart3 } from "lucide-react";
import React from "react";
import { LandingHeatmap } from "./LandingHeatmap";
import { PlaygroundDemo } from "./Playground";
import { SplitScreen } from "./SplitScreen";

export function Features() {
  return (
    <section id="features" className="py-14 md:py-18 bg-stone-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black mb-4 border border-black">
            <Sparkles className="h-4 w-4" />
            Core Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to understand yourself
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get to know yourself better. Stop letting bad days surprise you—see them coming and take control.
          </p>
        </div>

        {/* Feature 1 - Interactive Heatmap Demo */}
        <div className="mb-12 md:mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col mt-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-4 w-fit">
                  <BarChart3 className="h-3 w-3" />
                  Interactive Heatmap
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  The Map to Your Best Self.
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Your entire year of moods in one spot. Spot the signs, take control of the rhythm, and see the big picture in order to make the best decisions. 
                </p>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Daily Feed Summary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Customizable Log Templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Quick Log for 1-Click Entries</span>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12 flex items-center justify-center">
                <LandingHeatmap />
              </div>
            </div>
          </div>
        </div>

        {/* Features 2 & 3 - Side by Side */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Feature 2 */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 h-full flex flex-col">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 mb-4 w-fit">
                <TrendingUp className="h-3 w-3" />
                Weekly Playground
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                Review the Past, Ready the Future
              </h3>
              <p className="text-gray-600 mb-0 flex-grow leading-relaxed">
                Fast daily-logs with customizable Daily templates to help you get the most out of each day.
              </p>
              <div className="mb-8">
                <PlaygroundDemo />
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 h-full flex flex-col">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 mb-4 w-fit">
                <Sparkles className="h-3 w-3" />
                Live Dashboards
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                See the Patterns, Shape the Progress
              </h3>
              <p className="text-gray-600 mb-0 flex-grow leading-relaxed">
                Pinpoint why today felt different, watch real-time charts reveal
                emerging trends, and tag meaningful moments before they fade.
              </p>
              <div className="mb-8 flex items-center justify-center">
                <SplitScreen />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
