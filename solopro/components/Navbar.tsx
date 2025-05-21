'use client'

import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  // Auth button styles matching the older version
  const authButtonClasses = 
    "font-medium rounded-full transition-colors px-4 py-2 bg-white text-black hover:bg-gray-100 border border-black dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-600";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur">
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="text-4xl font-bold">
          SoloPro.
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex space-x-6">
          <Link 
            href="#features" 
            className="text-md font-medium text-zinc-700 transition-colors hover:text-primary"
          >
            Features
          </Link>
          <Link 
            href="#pricing" 
            className="text-md font-medium text-zinc-700 transition-colors hover:text-primary"
          >
            Pricing
          </Link>
          <Link 
            href="#faq" 
            className="text-md font-medium text-zinc-700 transition-colors hover:text-primary"
          >
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
              <Link 
                href="/dashboard" 
                className={authButtonClasses}
              >
                Dashboard
              </Link>
              <button
                onClick={() => void signOut().then(() => router.push("/"))}
                className={authButtonClasses}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/signin")}
                className={authButtonClasses}
              >
                Login / Signup
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 