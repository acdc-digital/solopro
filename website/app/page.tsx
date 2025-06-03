// APP PAGE
// /Users/matthewsimon/Documents/Github/solopro/website/app/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  Download,
  ChevronRight,
  CheckCircle,
  XCircle,
  X,
  Loader2,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexUser } from "@/lib/hooks/useConvexUser";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { OpenSource } from "@/components/OpenSource";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { Roadmap } from "@/components/Roadmap";
import Pricing from "@/components/Pricing";
import { CTABanner } from "@/components/CTABanner";
import { Footer } from "@/components/Footer";
import { getCheckoutSession } from "@/lib/services/PaymentService";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
};

// Button component with styling
const Button = ({ children, className, variant = "default" }: ButtonProps) => {
  const baseStyles = "font-medium rounded-full transition-colors px-4 py-2";
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
    >
      {children}
    </button>
  );
};

export default function LandingPage() {
  const [paymentStatus, setPaymentStatus] = useState<{
    type: "success" | "canceled" | null;
    message: string;
  } | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(false);

  // Authentication and subscription state
  const { isAuthenticated, isLoading: authLoading, userId } = useConvexUser();
  const hasActiveSubscription = useQuery(
    api.userSubscriptions.hasActiveSubscription,
    isAuthenticated && userId ? {} : "skip"
  );

  // Determine if downloads should be enabled
  const downloadsEnabled = isAuthenticated && hasActiveSubscription === true;
  const showAuthMessage = !authLoading && !isAuthenticated;
  const showSubscriptionMessage = isAuthenticated && hasActiveSubscription === false;

  // Check for payment status in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const success = queryParams.get("success");
    const canceled = queryParams.get("canceled");
    const sessionId = queryParams.get("session_id");

    if (success === "true") {
      setPaymentStatus({
        type: "success",
        message: "Payment successful! Your subscription is now active.",
      });

      // Clear the query parameters from the URL without page reload
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled === "true") {
      setPaymentStatus({
        type: "canceled",
        message:
          "Payment was canceled. You can try again whenever you&apos;re ready.",
      });

      // Clear the query parameters from the URL without page reload
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (sessionId) {
      // Check the session status from the API
      setIsCheckingSession(true);

      getCheckoutSession(sessionId)
        .then((session) => {
          console.log("Session details:", session);

          if (
            session.paymentStatus === "paid" ||
            session.status === "complete"
          ) {
            setPaymentStatus({
              type: "success",
              message: "Payment successful! Your subscription is now active.",
            });
          } else if (session.status === "open") {
            setPaymentStatus({
              type: "success",
              message:
                "Your payment is processing. Your subscription will be active shortly.",
            });
          } else {
            setPaymentStatus({
              type: "canceled",
              message:
                "The checkout was not completed. You can try again whenever you&apos;re ready.",
            });
          }
        })
        .catch((error) => {
          console.error("Failed to check session status:", error);
          setPaymentStatus({
            type: "canceled",
            message:
              "We couldn&apos;t verify your payment status. Please contact support if you completed a payment.",
          });
        })
        .finally(() => {
          setIsCheckingSession(false);
          // Clear the query parameters from the URL without page reload
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Add EnvDebug component
      <EnvDebug /> */}

      {/* Navigation Bar with Theme Toggle */}
      <Navbar />

      {/* Payment Status Notification */}
      {isCheckingSession ? (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Verifying your payment status...
              </p>
            </div>
          </div>
        </div>
      ) : (
        paymentStatus && (
          <div
            className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
              paymentStatus.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {paymentStatus.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-amber-400" />
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    paymentStatus.type === "success"
                      ? "text-green-800 dark:text-green-200"
                      : "text-amber-800 dark:text-amber-200"
                  }`}
                >
                  {paymentStatus.message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setPaymentStatus(null)}
                  className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    paymentStatus.type === "success"
                      ? "text-green-500 hover:bg-green-100 dark:hover:bg-green-800 focus:ring-green-600"
                      : "text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-800 focus:ring-amber-600"
                  }`}
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )
      )}

      <main className="flex-1">
        {/* Download Buttons */}
        <div className="bg-stone-50">
          <div className="container mx-auto px-4 py-2 mt-4">
            <div className="flex justify-left gap-4">
              <button 
                disabled={!downloadsEnabled}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  downloadsEnabled
                    ? "bg-white border border-border text-[#323232] hover:text-foreground hover:border-foreground cursor-pointer"
                    : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                title={
                  showSubscriptionMessage 
                    ? "Active subscription required" 
                    : ""
                }
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download .dmg for macOS
              </button>
              
              <button 
                disabled={!downloadsEnabled}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  downloadsEnabled
                    ? "bg-white border border-border text-[#323232] hover:text-foreground hover:border-foreground cursor-pointer"
                    : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                title={
                  showSubscriptionMessage 
                    ? "Active subscription required" 
                    : ""
                }
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75V22.1L0 20.699M10.949 12.6H24V24l-13.051-1.4"/>
                </svg>
                Download .exe for Windows
              </button>
            </div>
            
            {/* Status message below buttons */}
            {!authLoading && !downloadsEnabled && (
              <div className="flex justify-left mt-4">
                <p className="text-sm text-gray-500">
                  {showSubscriptionMessage && "Active subscription required to download"}
                  {authLoading && "Checking access..."}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Hero Section */}
        <Hero />

        {/* Open Source Community Section */}
        <OpenSource />

        {/* Features Section */}
        <Features />

        {/* Pricing Section */}
        <Pricing />

        {/* FAQ Section */}
        <FAQ />

        {/* Roadmap Section */}
        <Roadmap />

        {/* Final CTA */}
        <CTABanner />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
