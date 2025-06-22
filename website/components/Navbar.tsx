// NAVBAR
// /Users/matthewsimon/Documents/Github/solopro/website/components/Navbar.tsx

'use client'

import { useQuery } from "convex/react";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback, useEffect, useMemo } from "react";
import { SignInModal } from "../modals/SignInModal";
import { DocsModal } from "./Docs";
import { Loader2, Menu, X, Shield, ShieldUserIcon, User, FileDown, LogOut } from "lucide-react";
import Image from "next/image";
import { api } from "../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useConvexUser } from "../lib/hooks/useConvexUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { ProfileModal } from "../modals/ProfileModal";
import { ExportDataModal } from "./ExportDataModal";

export function Navbar() {
  const { isAuthenticated, isLoading, userId } = useConvexUser();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInFlow, setSignInFlow] = useState<"signIn" | "signUp" | "forgotPassword">("signIn");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [detectedOS, setDetectedOS] = useState<'Windows' | 'macOS' | 'Other'>('Other');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Check if current user is admin
  const isAdmin = useQuery(api.admin.isCurrentUserAdmin);

  // Get user details
  const user = useQuery(
    api.users.viewer,
    isAuthenticated && userId ? {} : "skip"
  );

  // Get user initials for avatar fallback
  const userInitials = useMemo(() => {
    if (!user?.name) return "U";
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].substring(0, 1).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }, [user?.name]);

  // Detect user's operating system
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) {
      setDetectedOS('Windows');
    } else if (userAgent.includes('mac')) {
      setDetectedOS('macOS');
    } else {
      setDetectedOS('Other');
    }
  }, []);

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

  const handleDirectDownload = () => {
    let downloadUrl = '';

    // Default to the user's OS, but fallback to macOS if unknown
    if (detectedOS === 'Windows') {
      downloadUrl = 'https://github.com/acdc-digital/solopro/releases/download/v1.6.5/Soloist.Pro-Setup-1.6.5.exe';
    } else if (detectedOS === 'macOS') {
      downloadUrl = 'https://github.com/acdc-digital/solopro/releases/download/v1.6.5/Soloist.Pro-1.6.5-x64.dmg';
    } else {
      // Default to macOS x64 for other OS
      downloadUrl = 'https://github.com/acdc-digital/solopro/releases/download/v1.6.5/Soloist.Pro-1.6.5-x64.dmg';
    }

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <div className="flex items-start gap-1 relative">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">
                Soloist.
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 -mt-1 ml-0.5 shadow-sm">
                v1.6.5
              </span>
            </div>
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
                    className="inline-flex items-center justify-center rounded-full border border-red-600 bg-red-50 h-10 w-10 text-red-600 hover:bg-red-100 hover:border-red-700 transition-all duration-200"
                    title="Admin Dashboard"
                  >
                    <ShieldUserIcon className="h- w-6" strokeWidth={1.5} />
                  </Link>
                )}
                {/* User Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                        <AvatarFallback className="text-sm bg-white border border-black hover:bg-zinc-200 text-zinc-700">{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsProfileModalOpen(true)}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link
                  href={process.env.NEXT_PUBLIC_APP_URL || "https://app.acdc.digital"}
                  className="inline-flex items-center justify-center rounded-full bg-blue-500 border border-blue-900 px-5 py-1.5 text-base font-bold text-white hover:bg-blue-700 hover:border-blue-700 transition-all duration-200"
                >
                  Soloist.
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center rounded-3xl border border-black bg-white px-5 py-1.5 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground hover:border-foreground transition-all duration-200"
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
                  {/* User info in mobile */}
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                      <AvatarFallback className="text-sm bg-zinc-200 text-zinc-700">{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name || "User"}</span>
                      <span className="text-xs text-muted-foreground">{user?.email || ""}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-3xl border border-red-600 bg-red-50 px-5 py-2.5 text-base font-medium text-red-600 hover:bg-red-100 hover:border-red-700 transition-all duration-200"
                    >
                      <Shield className="h-5 w-5" />
                      Admin Dashboard
                    </Link>
                  )}
                  <ExportDataModal>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-3xl border border-input bg-background px-5 py-2.5 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                    >
                      <FileDown className="h-5 w-5" />
                      Export Data
                    </button>
                  </ExportDataModal>
                  <button
                    onClick={handleDirectDownload}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-3xl border border-input bg-background px-5 py-2.5 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  >
                    <Download className="h-5 w-5" />
                    Download Desktop App
                  </button>
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

      {/* Profile Modal */}
      <ProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
    </>
  );
}