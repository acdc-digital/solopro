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
  const router = useRouter();

  // Reset flow when modal opens and check localStorage for flow preference
  useEffect(() => {
    if (isOpen) {
      // First check localStorage for preferred flow
      const savedFlow = localStorage.getItem('authFlow');
      if (savedFlow === 'signUp') {
        setFlow('signUp');
        localStorage.removeItem('authFlow');
      } else {
        // If no saved flow, use the provided initialFlow
        setFlow(initialFlow);
      }
      setError(null);
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
            const formData = new FormData(e.target as HTMLFormElement);
            formData.set("flow", flow);
            void signIn("password", formData)
              .then(handleAuthSuccess)
              .catch((error) => {
                setError(error.message);
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
            className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            type="submit"
          >
            {flow === "signIn" ? "Sign in" : "Sign up"}
          </button>
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            {flow === "signIn" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="text-primary dark:text-primary hover:underline font-medium"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
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
              onClick={() => signIn("github", {}).then(handleAuthSuccess)}
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