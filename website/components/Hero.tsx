// HERO COMPONENT
// /Users/matthewsimon/Documents/Github/solopro/website/components/Hero.tsx

'use client'

import React, { useState } from "react";
import Link from "next/link";
import { Download, ChevronRight, Sparkles } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexUser } from "@/lib/hooks/useConvexUser";
import { HeroFeature } from "./HeroFeature";
import { DocsModal } from "./Docs";
import { DownloadModal } from "./DownloadModal";
import { StripeCheckoutModal } from "@/modals/StripeCheckoutModal";
import { SignInModal } from "@/modals/SignInModal";

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

  // Modal states
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Determine button behavior based on auth and subscription status
  const isSignedInAndSubscribed = isAuthenticated && hasActiveSubscription === true;
  const shouldShowStartNow = !isSignedInAndSubscribed;

  // Pro tier configuration (matching Pricing component)
  const proTierConfig = {
    name: "Pro",
    priceId: "price_1RYaXeD4wGLfhDePZlRBINbJ",
    paymentMode: "subscription" as const
  };

  const handleStartNowClick = () => {
    if (!isAuthenticated) {
      // Show sign-in modal for unauthenticated users
      setIsSignInModalOpen(true);
    } else if (hasActiveSubscription === false) {
      // Show checkout modal for authenticated users without subscription
      setIsCheckoutModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    // Hide sign-in modal and show checkout modal after successful sign-in
    setIsSignInModalOpen(false);
    // Small delay to ensure UI state is updated
    setTimeout(() => {
      setIsCheckoutModalOpen(true);
    }, 100);
  };

  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };

  const handleCloseSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  return (
    <section className="py-4 md:py-6 container mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side - Text Content */}
        <div className="space-y-6 lg:w-1/2">
          <div>
            <p className="text-md font-medium text-gray-500 mb-2">
              #MoodForecasting
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-[78px] font-bold tracking-tight mb-4">
              Track. Predict. Forecast.
            </h1>
            <p className="text-lg text-gray-900 mb-8">
            Turn everyday moments into powerful predictions. See patterns in your life before they happen and take control of your future.
            </p>
            
            <div className="flex flex-wrap gap-4">
              {shouldShowStartNow ? (
                // Show "Start Now" for non-subscribers
                <Button
                  variant="emerald"
                  className="h-12 flex items-center gap-2 opacity-95 pr-8 pl-6"
                  onClick={handleStartNowClick}
                >
                  <Sparkles size={18} aria-hidden="true" />
                  Start Now
                </Button>
              ) : (
                // Show "Download App" for subscribed users
                <DownloadModal>
                  <Button variant="emerald" className="h-12 flex items-center gap-2 opacity-95">
                    <Download size={18} aria-hidden="true" />
                    Download App
                  </Button>
                </DownloadModal>
              )}
              
              <DocsModal>
                <Button 
                  variant="light-emerald" 
                  className="h-12 flex items-center gap-2"
                >
                  Learn More <ChevronRight size={18} aria-hidden="true" />
                </Button>
              </DocsModal>
            </div>
            
            <p className="text-sm text-gray-900 pt-4">
              Emotional heatmaps that visualize your mood and predict tomorrow&apos;s.
            </p>
            <p className="text-xs text-gray-800 pt-1">
              Powered by © ACDC.digital
            </p>
          </div>
        </div>
        
        {/* Right Side - Interactive Feature */}
        <div className="lg:w-1/2 w-full">
          <HeroFeature />
        </div>
      </div>

      {/* Stripe Checkout Modal */}
      <StripeCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={handleCloseCheckoutModal}
        priceId={proTierConfig.priceId}
        productName={proTierConfig.name}
        paymentMode={proTierConfig.paymentMode}
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={handleCloseSignInModal}
        onAuthSuccess={handleAuthSuccess}
        initialFlow="signIn"
      />
    </section>
  );
};

