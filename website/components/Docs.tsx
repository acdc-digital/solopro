// DOCS
// /Users/matthewsimon/Documents/Github/solopro/website/components/Docs.tsx

"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Calendar, Brain, BarChart3, Target, Zap, Heart, TrendingUp } from "lucide-react";

interface DocsModalProps {
  children: React.ReactNode;
}

export function DocsModal({ children }: DocsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-none w-[75vw] max-h-[80vh] p-0" style={{ maxWidth: '75vw', width: '75vw' }}>
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <DialogTitle className="text-2xl font-bold">SoloPro User Guide</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Everything you need to know about tracking your mood and forecasting your future
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="px-6 pb-6 max-h-[60vh] w-full">
          <div className="space-y-8 text-sm leading-relaxed">
            
            {/* What is SoloPro */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">What is SoloPro?</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                SoloPro is an AI-powered mood tracking and forecasting application that helps you understand 
                your emotional patterns and predict future well-being. By logging your daily experiences, 
                SoloPro creates personalized insights that empower you to take control of your mental health.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-foreground">Key Benefits:</h4>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Track daily mood patterns with visual heatmaps</li>
                  <li>Get AI-powered predictions about future emotional states</li>
                  <li>Identify triggers and patterns in your well-being</li>
                  <li>Make data-driven decisions about your mental health</li>
                </ul>
              </div>
            </section>

            {/* How It Works */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">How SoloPro Works</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Daily Logging</h4>
                    <p className="text-muted-foreground">
                      Each day, you fill out a personalized log with questions about your mood, activities, 
                      sleep, work-life balance, and reflections. This takes just 2-3 minutes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">AI Analysis</h4>
                    <p className="text-muted-foreground">
                      Our AI system "Solomon" analyzes your entries and generates a daily score from 0-100, 
                      representing your overall well-being for that day.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Visual Insights</h4>
                    <p className="text-muted-foreground">
                      Your scores are displayed as a colorful heatmap calendar, making it easy to spot 
                      patterns, trends, and correlations in your emotional journey.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-medium mb-2 text-foreground">Predictive Forecasting</h4>
                    <p className="text-muted-foreground">
                      Based on your historical data, SoloPro predicts future mood trends and provides 
                      recommendations to help you maintain or improve your well-being.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Features */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Core Features</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-foreground">Interactive Heatmap</h4>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Visualize your entire year at a glance with color-coded daily scores. 
                    Click any day to view detailed logs and insights.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-foreground">Analytics Dashboard</h4>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Deep dive into your patterns with charts, trends, and statistical insights 
                    about your emotional well-being.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-foreground">Mood Forecasting</h4>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Get AI-powered predictions about your future emotional states based 
                    on historical patterns and current trends.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-foreground">Custom Goals</h4>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Set personalized objectives and track your progress toward 
                    better mental health and well-being.
                  </p>
                </div>
              </div>
            </section>

            {/* Getting Started */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Getting Started</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-foreground">1. Create Your Account</h4>
                  <p className="text-muted-foreground">
                    Sign up with your email or GitHub account. Your data is encrypted and private.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-foreground">2. Complete Your First Log</h4>
                  <p className="text-muted-foreground">
                    Fill out the daily log form with information about your mood, activities, and reflections. 
                    Be honest and consistent for the best results.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-foreground">3. Build Your Pattern</h4>
                  <p className="text-muted-foreground">
                    Log daily for at least a week to start seeing patterns. The more data you provide, 
                    the more accurate your insights become.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-foreground">4. Explore Your Insights</h4>
                  <p className="text-muted-foreground">
                    Use the heatmap, analytics, and forecasting features to understand your emotional 
                    patterns and make informed decisions about your well-being.
                  </p>
                </div>
              </div>
            </section>

            {/* Understanding Your Scores */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Understanding Your Scores</h3>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground mb-4">
                  SoloPro uses a 0-100 scoring system where higher scores indicate better overall well-being:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div className="bg-red-500 text-white p-2 rounded text-center">
                    <div className="font-bold">0-20</div>
                    <div>Very Low</div>
                  </div>
                  <div className="bg-orange-500 text-white p-2 rounded text-center">
                    <div className="font-bold">21-40</div>
                    <div>Low</div>
                  </div>
                  <div className="bg-yellow-500 text-white p-2 rounded text-center">
                    <div className="font-bold">41-60</div>
                    <div>Moderate</div>
                  </div>
                  <div className="bg-green-500 text-white p-2 rounded text-center">
                    <div className="font-bold">61-80</div>
                    <div>Good</div>
                  </div>
                  <div className="bg-blue-500 text-white p-2 rounded text-center">
                    <div className="font-bold">81-100</div>
                    <div>Excellent</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy & Security */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Privacy & Security</h3>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Your data is private:</strong> Only you can see your personal logs and insights</li>
                  <li><strong>Encrypted storage:</strong> All data is encrypted both in transit and at rest</li>
                  <li><strong>No data selling:</strong> We never sell or share your personal information</li>
                  <li><strong>Open source:</strong> Our code is transparent and auditable</li>
                  <li><strong>Data ownership:</strong> You can export or delete your data at any time</li>
                </ul>
              </div>
            </section>

            {/* Tips for Success */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Tips for Success</h3>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>Be consistent:</strong> Log daily, even on busy days. Consistency improves accuracy.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>Be honest:</strong> Accurate logs lead to better insights and predictions.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>Review regularly:</strong> Check your heatmap and analytics weekly to spot trends.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>Use forecasts:</strong> Plan ahead based on predicted mood patterns.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>Set goals:</strong> Use custom objectives to work toward specific well-being targets.
                  </p>
                </div>
              </div>
            </section>

            {/* Support */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Need Help?</h3>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground mb-3">
                  If you have questions or need support, we're here to help:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Email us at: <strong>msimon@acdc.digital</strong></li>
                  <li>Join our community on GitHub</li>
                  <li>Check out our FAQ section below</li>
                </ul>
              </div>
            </section>

            {/* Footer */}
            <section className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                SoloPro - Take control of tomorrow, today. Built with ❤️ by ACDC.digital
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
