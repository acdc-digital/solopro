// HEADER COMPONENT
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/dashboard/_components/DraggableHeader.tsx

import React, { useState } from "react";
import { Crown } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useBrowserEnvironment } from "@/utils/environment";
import { PricingModal } from "@/components/PricingModal";
import { Button } from "@/components/ui/button";

const DraggableHeader: React.FC = () => {
  const isBrowser = useBrowserEnvironment();
  const { isAuthenticated, userId } = useConvexUser();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  
  // Check subscription status for browser users
  const hasActiveSubscription = useQuery(
    api.userSubscriptions.hasActiveSubscription,
    isBrowser && isAuthenticated && userId ? {} : "skip"
  );

  // Window control functions
  const handleMinimize = () => {
    if (typeof window !== 'undefined' && (window as any).electron?.ipcRenderer) {
      (window as any).electron.ipcRenderer.send('window-minimize');
    }
  };

  const handleMaximize = () => {
    if (typeof window !== 'undefined' && (window as any).electron?.ipcRenderer) {
      (window as any).electron.ipcRenderer.send('window-maximize');
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && (window as any).electron?.ipcRenderer) {
      (window as any).electron.ipcRenderer.send('window-close');
    }
  };

  const handleSubscribeClick = () => {
    setIsPricingModalOpen(true);
  };

  return (
    <>
      <div
        className="flex h-9 items-center justify-between px-3 bg-zinc-50 dark:bg-zinc-800 select-none border-b border-zinc-200 dark:border-zinc-700"
        style={{
          WebkitAppRegion: 'drag',
          userSelect: 'none'
        } as React.CSSProperties & { WebkitAppRegion: string }}
      >
        {/* Left side - macOS window controls */}
        <div
          className="flex space-x-2"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
        >
          {/* Close button (red) */}
          <button
            onClick={handleClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
            title="Close"
          >
            <span className="text-red-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</span>
          </button>

          {/* Minimize button (yellow) */}
          <button
            onClick={handleMinimize}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center group"
            title="Minimize"
          >
            <span className="text-yellow-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity">−</span>
          </button>

          {/* Maximize button (green) */}
          <button
            onClick={handleMaximize}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group"
            title="Maximize"
          >
            <span className="text-green-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity">+</span>
          </button>
        </div>

        {/* Center - title text */}
        <div className="flex-1 flex justify-center">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Soloist. | Take control of tomorrow, today.
          </span>
        </div>

        {/* Right side - subscription button for non-subscribers in browser mode */}
        <div
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
        >
          {isBrowser && isAuthenticated && hasActiveSubscription === false && (
            <Button
              onClick={handleSubscribeClick}
              size="sm"
              className="h-6 px-3 text-xs bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-[0_2px_8px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_12px_rgba(16,185,129,0.35)] transition-all duration-200"
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          )}
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal
        open={isPricingModalOpen}
        onOpenChange={setIsPricingModalOpen}
      />
    </>
  );
};

export default DraggableHeader;