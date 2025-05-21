"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import Image from "next/image";

export function Features() {
  return (
    <section id="features" className="py-16 container mx-auto px-4 mt-8">
      {/* Feature 1 */}
      <div className="flex flex-col md:flex-row gap-8 mb-24">
        <div className="md:w-1/2 space-y-4">
          <h3 className="text-2xl font-bold">
            Your Daily Well-Being at a Glance.
          </h3>
          <p className="text-muted-foreground">
            The color-coded heatmap turns 365 scattered journal entries into one
            elegant, scrollable canvas. Instantly spot winning streaks, analyze
            looming slumps, and forecast your mood for tomorrow.
          </p>
          <div className="pt-4">
            <button className="flex items-center gap-2 p-0 font-medium text-primary hover:underline">
              Learn more <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex items-center justify-center">
          <div className="relative w-full aspect-video max-w-xl overflow-hidden">
            <Image
              src="/Feature1.png"
              alt="Daily well-being dashboard visualization"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover object-center"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>

      {/* Feature 2 & 3 (Side by side) */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Feature 2 */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">
            Review the Past, Ready the Future.
          </h3>
          <p className="text-muted-foreground">
            SoloPro&apos;s Playground lets you look back to learn—and gear up
            for what&apos;s coming next.
          </p>
          <div className="pt-4 mb-6"></div>
          <div className="relative w-full aspect-video max-w-xl mx-auto overflow-hidden">
            <Image
              src="/Feature2.png"
              alt="Analysis dashboard showing past trends"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Feature 3 */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">
            See the Patterns. Shape the Progress.
          </h3>
          <p className="text-muted-foreground">
            Pinpoint why today felt different, watch real-time charts reveal
            emerging trends, and tag moments before they fade.
          </p>
          <div className="pt-4 mb-6"></div>
          <div className="relative w-full aspect-video max-w-xl mx-auto overflow-hidden">
            <Image
              src="/Feature6.png"
              alt="Pattern visualization and analytics dashboard"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
