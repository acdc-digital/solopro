"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFlow?: "signIn" | "signUp";
  onAuthSuccess?: () => void;
}

export function SignInModal({ 
  isOpen, 
  onClose, 
  initialFlow = "signIn",
  onAuthSuccess 
}: SignInModalProps) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">(initialFlow);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Helper function to provide user-friendly error messages
  const getErrorMessage = (error: any, currentFlow: "signIn" | "signUp") => {
    const errorMessage = error?.message || error?.toString() || "An error occurred";
    
    // Check for common "user not found" patterns
    const userNotFoundPatterns = [
      'user not found',
      'user does not exist',
      'invalid credentials',
      'account not found',
      'no user found',
      'authentication failed',
      'server error' // Common when user doesn't exist
    ];
    
    const isUserNotFound = userNotFoundPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern)
    );
    
    if (isUserNotFound && currentFlow === "signIn") {
      return {
        message: "Account not found. Would you like to create an account instead?",
        suggestionAction: "switch-to-signup",
        showSwitchButton: true
      };
    }
    
    // Check for "user already exists" patterns
    const userExistsPatterns = [
      'user already exists',
      'account already exists',
      'email already registered',
      'user already registered'
    ];
    
    const isUserExists = userExistsPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern)
    );
    
    if (isUserExists && currentFlow === "signUp") {
      return {
        message: "Account already exists. Would you like to sign in instead?",
        suggestionAction: "switch-to-signin",
        showSwitchButton: true
      };
    }
    
    // Default error message
    return {
      message: errorMessage,
      suggestionAction: null,
      showSwitchButton: false
    };
  };

  // State for enhanced error handling
  const [errorInfo, setErrorInfo] = useState<{
    message: string;
    suggestionAction: string | null;
    showSwitchButton: boolean;
  } | null>(null);

  // Reset flow when modal opens and check localStorage for flow preference
  useEffect(() => {
    if (isOpen) {
      // First check localStorage for preferred flow (this matches the behavior of the old sign-in page)
      const savedFlow = localStorage.getItem('authFlow');
      if (savedFlow === 'signUp') {
        setFlow('signUp');
        localStorage.removeItem('authFlow');
      } else {
        // If no saved flow, use the provided initialFlow
        setFlow(initialFlow);
      }
      setError(null);
      setErrorInfo(null);
    }
  }, [isOpen, initialFlow]);

  // Handle successful authentication
  const handleAuthSuccess = () => {
    // Close the modal
    onClose();
    
    // Call the success callback if provided
    if (onAuthSuccess) {
      onAuthSuccess();
      // Don't refresh the page if we're handling success with a callback
    } else {
      // Otherwise, just refresh the router
      router.refresh();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close sign in modal"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          {flow === "signIn" ? "Sign in to your account" : "Create an account"}
        </h2>
        
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setIsSubmitting(true);
            setError(null);
            setErrorInfo(null);
            
            const formData = new FormData(e.target as HTMLFormElement);
            formData.set("flow", flow);
            void signIn("password", formData)
              .then(handleAuthSuccess)
              .catch((error) => {
                const errorDetails = getErrorMessage(error, flow);
                setError(errorDetails.message);
                setErrorInfo(errorDetails);
              })
              .finally(() => {
                setIsSubmitting(false);
              });
          }}
        >
          <div>
            <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="modal-email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="modal-password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              name="password"
              placeholder={flow === "signUp" ? "Create a password" : "Enter your password"}
              required
            />
          </div>
          
          <button
            className="w-full py-2 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium rounded-full shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {flow === "signIn" ? "Signing in..." : "Creating account..."}
              </span>
            ) : (
              flow === "signIn" ? "Sign in" : "Sign up"
            )}
          </button>
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              {errorInfo?.showSwitchButton && (
                <button
                  type="button"
                  onClick={() => {
                    if (errorInfo.suggestionAction === "switch-to-signup") {
                      setFlow("signUp");
                    } else if (errorInfo.suggestionAction === "switch-to-signin") {
                      setFlow("signIn");
                    }
                    setError(null);
                    setErrorInfo(null);
                  }}
                  className="mt-2 px-3 py-1 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-200 text-xs font-medium rounded border border-red-300 dark:border-red-600 transition-colors"
                >
                  {errorInfo.suggestionAction === "switch-to-signup" ? "Create Account" : "Sign In Instead"}
                </button>
              )}
            </div>
          )}
          
          <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            {flow === "signIn" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="text-primary dark:text-primary hover:underline font-medium"
              onClick={() => {
                setFlow(flow === "signIn" ? "signUp" : "signIn");
                setError(null);
                setErrorInfo(null);
              }}
            >
              {flow === "signIn" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => {
                setError(null);
                setErrorInfo(null);
                signIn("github", {})
                  .then(handleAuthSuccess)
                  .catch((error) => {
                    const errorDetails = getErrorMessage(error, flow);
                    setError(errorDetails.message);
                    setErrorInfo(errorDetails);
                  });
              }}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z" clipRule="evenodd"></path>
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 