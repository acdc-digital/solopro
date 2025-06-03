// CTABANNER COMPONENT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/CTABanner.tsx

"use client";

import React from "react";
import { Sparkles, Users, TrendingUp, Github } from "lucide-react";

export function CTABanner() {
  // Social proof numbers
  const stats = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "92%", label: "Accuracy Rate", icon: TrendingUp },
    { number: "4.9/5", label: "User Rating", icon: Sparkles },
  ];

  return (
    <section 
      id="cta-banner"
      className="pt-20 pb-20 bg-stone-50"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-sm font-medium text-white mb-6">
            <Sparkles className="h-3 w-3" />
            <span>Join the mood tracking revolution</span>
          </div>

          {/* Main headline */}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Soloist.   |   Take control of tomorrow, today.
          </h2>

          {/* Subheadline */}
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join a community of users who believe in transforming their emotional awareness with 
            <span className="text-primary font-semibold"> mood forecasting</span>
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.location.href = '/#pricing'}
              className="inline-flex h-12 items-center justify-center rounded-full bg-white border border-border px-12 py-3 text-lg font-bold text-[#323232] hover:text-foreground hover:border-foreground transition-all duration-200"
            >
              Get Started
            </button>
            
            <button
              onClick={() => window.location.href = '/#faq'}
              className="inline-flex h-12 items-center justify-center rounded-full bg-white border border-border px-12 py-3 text-lg font-bold text-[#323232] hover:text-foreground hover:border-foreground transition-all duration-200"
            >
              Questions?
            </button>
            
            <button
              onClick={() => window.open('https://github.com/acdc-digital/solopro', '_blank')}
              className="inline-flex h-12 items-center gap-2 justify-center rounded-full bg-white border border-border px-12 py-3 text-lg font-bold text-[#323232] hover:text-foreground hover:border-foreground transition-all duration-200"
            >
              <Github className="h-5 w-5" />
              Contribute
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
