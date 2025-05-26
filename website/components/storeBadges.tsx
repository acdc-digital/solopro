// STORE BADGES COMPONENT
// /Users/matthewsimon/Documents/Github/solopro/website/components/storeBadges.tsx

"use client";

import React from "react";
import Image from "next/image";

interface StoreBadgesProps {
  className?: string;
  showText?: boolean;
}

export function StoreBadges({ className = "", showText = true }: StoreBadgesProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <div className="flex flex-wrap gap-3">
        {/* Apple App Store Badge */}
        <a
          href="#"
          className="transition-transform hover:scale-105 rounded-lg"
          aria-label="Download on the App Store"
        >
          <div className="bg-[#323232] text-white rounded-md px-3 py-1.5 flex items-center gap-2 min-w-[120px] hover:opacity-80 transition-opacity">
            {/* Apple Logo */}
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] leading-tight">Download on the</span>
              <span className="text-xs font-semibold leading-tight">App Store</span>
            </div>
          </div>
        </a>

        {/* Microsoft Store Badge */}
        <a
          href="#"
          className="transition-transform hover:scale-105 rounded-lg"
          aria-label="Get it from Microsoft"
        >
          <div className="bg-[#323232] text-white rounded-md px-3 py-1.5 flex items-center gap-2 min-w-[120px] hover:opacity-80 transition-opacity">
            {/* Microsoft Logo */}
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] leading-tight">Get it from</span>
              <span className="text-xs font-semibold leading-tight">Microsoft</span>
            </div>
          </div>
        </a>

        {/* Google Play Badge (Optional - commented out) */}
        {/* 
        <a
          href="#"
          className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
          aria-label="Get it on Google Play"
        >
          <div className="bg-black text-white rounded-lg px-4 py-2 flex items-center gap-3 min-w-[140px] hover:bg-gray-800 transition-colors">
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-xs leading-tight">Get it on</span>
              <span className="text-sm font-semibold leading-tight">Google Play</span>
            </div>
          </div>
        </a>
        */}
      </div>
    </div>
  );
} 