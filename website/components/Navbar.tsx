// NAVBAR
// /Users/matthewsimon/Documents/Github/solopro/website/components/Navbar.tsx

'use client'

import { useConvexAuth, useQuery } from "convex/react";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { SignInModal } from "../modals/SignInModal";
import { DocsModal } from "./Docs";
import { DownloadModal } from "./DownloadModal";
import { Loader2, Menu, X } from "lucide-react";
import Image from "next/image";
import { api } from "../convex/_generated/api";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInFlow, setSignInFlow] = useState<"signIn" | "signUp">("signIn");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if current user is admin
  const isAdmin = useQuery(api.admin.isCurrentUserAdmin);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleOpenSignIn = () => {
    setSignInFlow("signIn");
    setIsSignInModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleOpenSignUp = () => {
    setSignInFlow("signUp");
    setIsSignInModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut().then(() => router.refresh());
    setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  };

  // Callback for after successful auth
  const handleAuthSuccess = useCallback(() => {
    setIsSignInModalOpen(false);
    router.refresh();
  }, [router]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md supports-[backdrop-filter]:bg-white/65">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
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
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
            </Link>
            <span className="text-2xl sm:text-3xl font-bold text-foreground">
              Soloist.
            </span>
          </div>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              href="#features"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: '"Nunito", "Quicksand", "Comfortaa", system-ui, sans-serif' }}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: '"Nunito", "Quicksand", "Comfortaa", system-ui, sans-serif' }}
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: '"Nunito", "Quicksand", "Comfortaa", system-ui, sans-serif' }}
            >
              FAQ
            </Link>
            <Link
              href="#roadmap"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: '"Nunito", "Quicksand", "Comfortaa", system-ui, sans-serif' }}
            >
              Roadmap
            </Link>
            <DocsModal>
              <button 
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: '"Nunito", "Quicksand", "Comfortaa", system-ui, sans-serif' }}
              >
                Docs
              </button>
            </DocsModal>
          </nav>

          {/* Desktop Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
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
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center justify-center rounded-xl border border-red-600 bg-red-50 px-5 py-2.5 text-base font-medium text-red-600 hover:bg-red-100 hover:border-red-700 transition-all duration-200"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href={process.env.NEXT_PUBLIC_APP_URL || "https://app.acdc.digital"}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 border border-blue-600 px-5 py-2.5 text-base font-bold text-white hover:bg-blue-700 hover:border-blue-700 transition-all duration-200"
                >
                  Soloist.
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center rounded-3xl border border-black bg-white px-5 py-2.5 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground hover:border-foreground transition-all duration-200"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleOpenSignIn}
                  className="inline-flex items-center justify-center rounded-3xl border border-input bg-background px-7 py-2.5 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleOpenSignUp}
                  className="inline-flex items-center justify-center rounded-3xl bg-[#323232] px-5 py-2.5 text-base font-medium text-primary-foreground hover:opacity-80 transition-opacity shadow-sm"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden fixed inset-x-0 top-16 bg-white border-b border-border/40 shadow-lg transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}>
          <nav className="container mx-auto px-4 py-6">
            {/* Mobile nav links */}
            <div className="space-y-4 mb-6">
              <Link
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: '"Nunito", "Quicksand", "Comfortaa", system-ui, sans-serif' }}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: '"Nunito", "Quicksand", "Comfortaa", system-ui, sans-serif' }}
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: '"Nunito", "Quicksand", "Comfortaa", system-ui, sans-serif' }}
              >
                FAQ
              </Link>
              <Link
                href="#roadmap"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: '"Nunito", "Quicksand", "Comfortaa", system-ui, sans-serif' }}
              >
                Roadmap
              </Link>
              <DocsModal>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                  style={{ fontFamily: '"Nunito", "Quicksand", "Comfortaa", system-ui, sans-serif' }}
                >
                  Docs
                </button>
              </DocsModal>
            </div>

            {/* Mobile auth buttons */}
            <div className="space-y-3 pt-4 border-t border-border/40">
              {isLoading ? (
                <button
                  disabled
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-muted px-5 py-2.5 text-base font-medium text-muted-foreground cursor-not-allowed"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading
                </button>
              ) : isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full inline-flex items-center justify-center rounded-3xl border border-red-600 bg-red-50 px-5 py-2.5 text-base font-medium text-red-600 hover:bg-red-100 hover:border-red-700 transition-all duration-200"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href={process.env.NEXT_PUBLIC_APP_URL || "https://app.acdc.digital"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 border border-blue-600 px-5 py-2.5 text-base font-bold text-white hover:bg-blue-700 hover:border-blue-700 transition-all duration-200"
                  >
                    Go to Soloist
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full inline-flex items-center justify-center rounded-3xl border border-black bg-white px-5 py-2.5 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground hover:border-foreground transition-all duration-200"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleOpenSignIn}
                    className="w-full inline-flex items-center justify-center rounded-3xl border border-input bg-background px-7 py-2.5 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleOpenSignUp}
                    className="w-full inline-flex items-center justify-center rounded-3xl bg-[#323232] px-5 py-2.5 text-base font-medium text-primary-foreground hover:opacity-80 transition-opacity shadow-sm"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </nav>
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