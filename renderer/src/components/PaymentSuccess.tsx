"use client";

import React, { useEffect, useState } from "react";
import { Check, RefreshCw, X } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

interface PaymentSuccessProps {
  sessionId: string;
  onComplete: () => void;
}

export function PaymentSuccess({ sessionId, onComplete }: PaymentSuccessProps) {
  const [status, setStatus] = useState<"processing" | "complete" | "error">("processing");
  const [progress, setProgress] = useState(0);
  const simulateCheckout = useAction(api.stripe.simulateSuccessfulCheckout);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let completionTimer: NodeJS.Timeout;

    const processPayment = async () => {
      try {
        // Start progress animation
        progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) return prev;
            return prev + Math.random() * 10;
          });
        }, 200);

        // Simulate the webhook processing
        // Only call the webhook simulation if we have a real session ID
        if (sessionId && sessionId !== 'success') {
          await simulateCheckout({ sessionId });
        } else {
          // For immediate success cases, just wait a moment to show the animation
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        // Complete the progress
        setProgress(100);
        setStatus("complete");

        // Clear progress interval
        clearInterval(progressInterval);

        // Auto-close modal after showing success for a moment
        completionTimer = setTimeout(() => {
          onComplete();
        }, 2000);

      } catch (error) {
        console.error('Error processing payment:', error);
        setStatus("error");
        clearInterval(progressInterval);
      }
    };

    processPayment();

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (completionTimer) clearTimeout(completionTimer);
    };
  }, [sessionId, simulateCheckout, onComplete]);

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Processing Error
        </h2>
        <p className="text-gray-600 mb-4">
          Your payment was successful, but there was an issue activating your subscription.
        </p>
        <p className="text-sm text-gray-500">
          Please contact support for assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      {/* Success Icon */}
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        {status === "complete" ? (
          <Check className="w-8 h-8 text-green-600" />
        ) : (
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        )}
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        {status === "complete" ? "Payment Successful!" : "Processing Payment..."}
      </h2>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md">
        {status === "complete" 
          ? "Your subscription has been activated! The application will now refresh with your new features."
          : "Please wait while we activate your subscription and prepare your new features."
        }
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-sm mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Activating subscription...</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status Messages */}
      <div className="text-sm text-gray-500 space-y-1">
        {progress > 0 && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Payment confirmed</span>
          </div>
        )}
        {progress > 30 && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Subscription activated</span>
          </div>
        )}
        {progress > 60 && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Updating application features</span>
          </div>
        )}
        {status === "complete" && (
          <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
            <Check className="w-4 h-4" />
            <span>Ready to use!</span>
          </div>
        )}
      </div>

      {/* Auto-close message */}
      {status === "complete" && (
        <p className="text-xs text-gray-400 mt-4">
          This dialog will close automatically...
        </p>
      )}
    </div>
  );
}
