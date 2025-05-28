// CTABANNER COMPONENT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/CTABanner.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Users, TrendingUp } from "lucide-react";

export function CTABanner() {
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('cta-banner');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Social proof numbers
  const stats = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "92%", label: "Accuracy Rate", icon: TrendingUp },
    { number: "4.9/5", label: "User Rating", icon: Sparkles },
  ];

  return (
    <section 
      id="cta-banner"
      className="pt-8 pb-16 bg-stone-50"
    >
      <div className="container mx-auto px-4">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
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

          {/* Get Started Button */}
          <div className="mt-8">
            <button
              onClick={() => window.location.href = '/#pricing'}
              className="inline-flex h-12 pl-12  pr-12 items-center justify-center rounded-md bg-emerald-600 px-8 py-3 text-lg font-bold text-white shadow-lg hover:bg-emerald-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
