// HELP MODAL
// /Users/matthewsimon/Documents/Github/solopro/renderer/src/components/HelpModal.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Calendar, Brain, BarChart3, Target, Zap, Heart, TrendingUp, X } from "lucide-react";

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpModal({ open, onOpenChange }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-[85vw] max-h-[90vh] p-0" style={{ maxWidth: '85vw', width: '85vw' }}>
        <DialogHeader className="pl-6 pt-8 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <DialogTitle className="text-2xl font-bold">Soloist User Guide</DialogTitle>
            </div>
          </div>
          <Badge variant="outline" className="w-fit mb-2 border-blue-500 text-blue-600 font-medium">
            Complete User Manual & Getting Started Guide
          </Badge>
        </DialogHeader>
        
        <ScrollArea className="px-6 pb-8 max-h-[75vh] w-full">
          <div className="space-y-10 text-sm leading-relaxed">
            
            {/* What is Soloist */}
            <section className="space-y-6">
              <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed">
                Soloist is a mood tracking and forecasting application that helps you understand 
                your emotional patterns and predict future well-being. By logging your daily experiences, 
                Soloist creates personalized insights that empower you to take control of your mental health.
              </p>
              
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6">
                <h4 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Key Benefits:</h4>
                <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2">
                  <li>Track daily mood patterns with visual heatmaps</li>
                  <li>Get predictions about future emotional states</li>
                  <li>Identify triggers and patterns in your well-being</li>
                  <li>Make data-driven decisions about your mental health</li>
                </ul>
              </div>
            </section>

            {/* How It Works */}
            <section className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">How Soloist Works</h3>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed">
                  Soloist transforms your daily experiences into actionable insights through a simple four-step process. 
                  From quick daily logs to AI-powered predictions, here's how we help you understand and improve your well-being.
                </p>
              </div>

              {/* Daily Logging Workflow */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Daily Logging Workflow</h4>
                <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <p>
                    <strong>1. Create Daily Logs:</strong> Access "Create New Log" from the sidebar. 
                    Capture mood, activities, sleep, and reflections instantly.
                  </p>
                  <p>
                    <strong>2. Personalized Daily Insights:</strong> Solomon analyzes your entries and generates 
                    personalized feed summaries with recommendations and mood scores (0-100).
                  </p>
                  <p>
                    <strong>3. Organization & Memory:</strong> Tag entries and add comments for context. 
                    Complete historical tracking enables pattern recognition and trend analysis.
                  </p>
                </div>
              </div>

              {/* Advanced Analytics */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Advanced Analytics & Forecasting</h4>
                <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <p>
                    <strong>1. Soloist View:</strong> Access 7-day emotional forecasting to predict your mood patterns 
                    and plan ahead for better days.
                  </p>
                  <p>
                    <strong>2. Interactive Calendar:</strong> View your entire year with color-coded daily scores. 
                    Click any day for detailed insights and track long-term trends.
                  </p>
                  <p>
                    <strong>3. Pattern Recognition:</strong> Discover hidden connections in your data with 
                    advanced analytics and behavioral correlations.
                  </p>
                </div>
              </div>

              {/* Personalization & Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Personalization & Settings</h4>
                <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <p>
                    <strong>1. Personal Attributes:</strong> Configure your profile with name, goals, and objectives 
                    to enable more personalized AI-generated insights and recommendations.
                  </p>
                  <p>
                    <strong>2. Generator Assistant Setup:</strong> Customize how random daily logs are generated 
                    with personalized instructions that reflect your lifestyle and preferences.
                  </p>
                  <p>
                    <strong>3. Enhanced AI Context:</strong> Provide detailed background information to help Solomon 
                    deliver more accurate mood analysis and contextually relevant suggestions.
                  </p>
                </div>
              </div>
            </section>

            {/* Getting Started */}
            <section className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Getting Started</h3>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed">
                  Transform your mental health journey in four simple steps. Start tracking today and see meaningful insights within your first week.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Set Up Your Profile</h4>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      Access Settings from the sidebar to configure your name, goals, and objectives. This personalizes your AI insights.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Log Your First Day</h4>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      Spend 2-3 minutes capturing your mood, sleep, activities, and reflections. Solomon immediately generates your first insights.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Build Your Pattern</h4>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      Continue daily logging for one week. Watch your personal heatmap emerge and discover patterns you never noticed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Unlock Predictions</h4>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      Access AI-powered forecasting in the Soloist view, advanced analytics, and personalized recommendations to optimize your well-being.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Features */}
            <section className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Core Features</h3>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed">
                  Powerful tools designed to help you understand, predict, and improve your emotional well-being.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-lg p-6 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Interactive Heatmap</h4>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Visualize your entire year with color-coded daily scores. Click any day for detailed insights and track long-term trends.
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-lg p-6 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Advanced Analytics</h4>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Deep-dive into patterns with charts, correlations, and statistical insights that reveal hidden connections in your data.
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-lg p-6 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">AI Mood Forecasting</h4>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Predict future emotional states with 85% accuracy. Plan ahead and take proactive steps for better days.
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-lg p-6 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Smart Recommendations</h4>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Receive personalized suggestions based on your patterns to maintain good days and improve challenging ones.
                  </p>
                </div>
              </div>
            </section>

            {/* Understanding Your Scores */}
            <section className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Understanding Your Scores</h3>
                </div>
              </div>
              
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6">
                <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mb-6">
                  Solomon evaluates your daily logs and assigns a score from 0-100, mapping to ten distinct color categories that represent your overall well-being:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50">
                    <div className="w-5 h-5 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">90-100 • INDIGO</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Exceptional day with strong positive emotions, high energy, and significant achievements</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">80-89 • BLUE</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Very good day, predominantly positive experiences and successful coping</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50">
                    <div className="w-5 h-5 bg-sky-400 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">70-79 • SKY</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Good day, more positive than negative, manageable challenges</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50">
                    <div className="w-5 h-5 bg-teal-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">60-69 • TEAL</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Fairly positive, some moderate challenges with adequate coping</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">50-59 • GREEN</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Balanced day, mix of ups and downs but generally steady</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50">
                    <div className="w-5 h-5 bg-lime-400 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">40-49 • LIME</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Slightly below average, more challenges than successes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50">
                    <div className="w-5 h-5 bg-yellow-400 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">30-39 • YELLOW</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Difficult day with noticeable setbacks and stress</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50">
                    <div className="w-5 h-5 bg-amber-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">20-29 • AMBER</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Very challenging day with significant negative emotions</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50">
                    <div className="w-5 h-5 bg-rose-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">0-9 • ROSE</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Crisis level, severe distress and inability to function</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                    <strong>How it works:</strong> Solomon analyzes your mood ratings, sleep patterns, activities, and reflections to generate these scores. 
                    The color-coded system helps you quickly identify patterns and trends in your emotional well-being over time.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy & Security */}
            <section className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Privacy & Security</h3>
                </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6">
                <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-3 leading-relaxed">
                  <li><strong>Your data is private:</strong> Only you can see your personal logs and insights</li>
                  <li><strong>Encrypted storage:</strong> All data is encrypted both in transit and at rest</li>
                  <li><strong>No data selling:</strong> We never sell or share your personal information</li>
                  <li><strong>Open source:</strong> Our code is transparent and auditable</li>
                  <li><strong>Data ownership:</strong> You can export or delete your data at any time</li>
                </ul>
              </div>
            </section>

            {/* Tips for Success */}
            <section className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Tips for Success</h3>
                </div>
              </div>
              <div className="space-y-4 ml-4">
                <div className="flex gap-4 items-start">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <strong>Be consistent:</strong> Log daily, even on busy days. Consistency improves accuracy.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <strong>Be honest:</strong> Accurate logs lead to better insights and predictions.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <strong>Review regularly:</strong> Check your heatmap and analytics weekly to spot trends.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <strong>Use forecasts:</strong> Plan ahead based on predicted mood patterns in the Soloist view.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <strong>Set goals:</strong> Use custom objectives in Settings to work toward specific well-being targets.
                  </p>
                </div>
              </div>
            </section>

            {/* Support */}
            <section className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Need Help?</h3>
                </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6">
                <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mb-4">
                  If you have questions or need support, we're here to help:
                </p>
                <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 leading-relaxed">
                  <li>Email us at: <strong>msimon@acdc.digital</strong></li>
                  <li>Join our community on GitHub</li>
                  <li>Check out our FAQ section on the website</li>
                </ul>
              </div>
            </section>

            {/* Footer */}
            <section className="pt-8 border-t border-zinc-200 dark:border-zinc-700">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 text-center leading-relaxed">
                Soloist. | Take control of tomorrow, today.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 