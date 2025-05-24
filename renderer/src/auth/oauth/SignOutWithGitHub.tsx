"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * SignOutWithGitHub component for GitHub OAuth sign out
 * 
 * Following authentication rules:
 * - Uses useAuthActions from @convex-dev/auth/react
 * - Handles sign out success/failure properly
 * - Provides consistent UI with loading states
 */
export function SignOutWithGitHub() {
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGitHubSignOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await signOut();
      
      // After successful sign-out, refresh the router to update the UI
      router.refresh();
    } catch (err) {
      console.error("GitHub sign-out failed:", err);
      setError("Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleGitHubSignOut}
        disabled={isLoading}
        className="w-full flex items-center justify-center py-2 px-3 border border-red-300 dark:border-red-600 rounded-lg shadow-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
            Signing out...
          </div>
        ) : (
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </div>
        )}
      </button>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
} 