// HERO COMPONENT
// /Users/matthewsimon/Documents/Github/solopro/website/components/Hero.tsx

'use client'

import React from "react";
import Link from "next/link";
import { Download, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexUser } from "@/lib/hooks/useConvexUser";
import { HeroFeature } from "./HeroFeature";
import { DemoModal } from "./(demo)/DemoModal";
import { DocsModal } from "./Docs";
import { DownloadModal } from "./DownloadModal";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'emerald' | 'light-emerald';
  onClick?: () => void;
  disabled?: boolean;
}

// Button component with styling
const Button = ({ children, className, variant = "default", onClick, disabled = false }: ButtonProps) => {
  const baseStyles = "font-medium rounded-full transition-colors px-4 py-2";
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-gray-200 hover:bg-gray-50",
    emerald: disabled
      ? "bg-emerald-400 text-emerald-800"
      : "bg-emerald-700 text-white hover:bg-emerald-600",
    "light-emerald": "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Hero = () => {
  // Authentication and subscription state
  const { isAuthenticated, isLoading: authLoading, userId } = useConvexUser();
  const hasActiveSubscription = useQuery(
    api.userSubscriptions.hasActiveSubscription,
    isAuthenticated && userId ? {} : "skip"
  );

  // Determine if downloads should be enabled
  const downloadsEnabled = isAuthenticated && hasActiveSubscription === true;

  return (
    <section className="py-12 md:py-8 container mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side - Text Content */}
        <div className="space-y-6 lg:w-1/2">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">
              #MoodForecasting
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-[78px] font-bold tracking-tight mb-4">
              Track. Predict. Forecast.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
            Turn everyday moments into powerful predictions. See patterns in your life before they happen and take control of your future.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <DownloadModal>
                <Button variant="emerald" className="h-12 flex items-center gap-2" disabled={!downloadsEnabled}>
                  <Download size={18} aria-hidden="true" />
                  Download App
                </Button>
              </DownloadModal>
              <DocsModal>
                <Button 
                  variant="light-emerald" 
                  className="h-12 flex items-center gap-2"
                >
                  Learn More <ChevronRight size={16} aria-hidden="true" />
                </Button>
              </DocsModal>
              {/* <DemoModal>
                <Button 
                  variant="light-emerald" 
                  className="h-12 flex items-center gap-2"
                  // onClick={() => console.log("Demo button clicked!")}
                >
                  Get Started <ChevronRight size={16} aria-hidden="true" />
                </Button>
              </DemoModal> */}
            </div>
            
            <p className="text-sm text-gray-500 pt-4">
              Emotional heatmaps visualize your mood and predict tomorrow&apos;s.
            </p>
          </div>
        </div>
        
        {/* Right Side - Interactive Feature */}
        <div className="lg:w-1/2 w-full">
          <HeroFeature />
        </div>
      </div>
    </section>
  );
};

