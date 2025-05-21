'use client'

import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { SignInModal } from "../modals/SignInModal";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInFlow, setSignInFlow] = useState<"signIn" | "signUp">("signIn");

  // Auth button styles matching the older version
  const authButtonClasses = 
    "font-medium rounded-full transition-colors px-4 py-2 bg-white text-black hover:bg-gray-100 border border-black dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-600";

  const handleOpenSignIn = () => {
    setSignInFlow("signIn");
    setIsSignInModalOpen(true);
  };

  const handleOpenSignUp = () => {
    setSignInFlow("signUp");
    setIsSignInModalOpen(true);
  };

  const handleSignOut = () => {
    signOut().then(() => router.refresh());
  };

  // Callback for after successful auth
  const handleAuthSuccess = useCallback(() => {
    setIsSignInModalOpen(false);
    router.refresh();
  }, [router]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur">
        <div className="container mx-auto px-4 flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="text-4xl font-bold">
            SoloPro.
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex space-x-6">
            <Link href="#features" className="text-lg font-medium text-black transition-colors hover:text-zinc-400">
              Features
            </Link>
            <Link href="#pricing" className="text-lg font-medium text-black transition-colors hover:text-zinc-400">
              Pricing
            </Link>
            <Link href="#faq" className="text-lg font-medium text-black transition-colors hover:text-zinc-400">
              FAQ
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <button disabled className={`${authButtonClasses} animate-pulse`}>
                Loading…
              </button>
            ) : isAuthenticated ? (
              <>
                {/* Dashboard button temporarily disabled
                <Link href="/dashboard" className={authButtonClasses}>
                  Dashboard
                </Link>
                */}
                <button onClick={handleSignOut} className={authButtonClasses}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button onClick={handleOpenSignIn} className={authButtonClasses}>
                  Login
                </button>
                <button
                  onClick={handleOpenSignUp}
                  className={`${authButtonClasses} bg-primary border-primary hover:bg-primary/90`}
                >
                  Sign-up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        initialFlow={signInFlow}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
} 