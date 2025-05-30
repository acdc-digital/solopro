// NAVBAR
// /Users/matthewsimon/Documents/Github/solopro/website/components/Navbar.tsx

'use client'

import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { SignInModal } from "../modals/SignInModal";
import { DocsModal } from "./Docs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInFlow, setSignInFlow] = useState<"signIn" | "signUp">("signIn");

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

  const handleLogoClick = (e: React.MouseEvent) => {
    // If we're on the home page, smooth scroll to top instead of navigating
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    // Otherwise, let the Link handle navigation normally
  };

  // Callback for after successful auth
  const handleAuthSuccess = useCallback(() => {
    setIsSignInModalOpen(false);
    router.refresh();
  }, [router]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md supports-[backdrop-filter]:bg-white/20">
        <div className="container mx-auto px-4 flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            >
              <Image
                src="/solologo.svg"
                alt="SoloPro Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </Link>
            <span className="text-3xl font-bold text-foreground">
              Soloist.
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              href="#features"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            <DocsModal>
              <button className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </button>
            </DocsModal>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <button
                disabled
                className="inline-flex items-center justify-center gap-2 rounded-md bg-muted px-5 py-2.5 text-base font-medium text-muted-foreground cursor-not-allowed"
              >
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading
              </button>
            ) : isAuthenticated ? (
              <>
                {/* Dashboard button temporarily disabled
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  Dashboard
                </Link>
                */}
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleOpenSignIn}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleOpenSignUp}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-base font-medium text-primary-foreground hover:opacity-80 transition-opacity shadow-sm"
                >
                  Sign up
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