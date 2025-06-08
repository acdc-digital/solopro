// BROWSER NAVBAR
// /Users/matthewsimon/Documents/Github/solopro/renderer/src/components/BrowserNavbar.tsx

"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  User, 
  Settings, 
  HelpCircle, 
  Download,
  Menu,
  X,
  HomeIcon
} from "lucide-react";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useSidebarStore } from "@/store/sidebarStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BrowserNavbar() {
  const { isAuthenticated, userId } = useConvexUser();
  const { signOut } = useAuthActions();
  const { currentView, setView } = useSidebarStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Get user details
  const user = useQuery(
    api.users.viewer,
    isAuthenticated && userId ? {} : "skip"
  );

  // Check subscription status
  const hasActiveSubscription = useQuery(
    api.userSubscriptions.hasActiveSubscription,
    isAuthenticated && userId ? {} : "skip"
  );

  // Get user initials for avatar fallback
  const userInitials = React.useMemo(() => {
    if (!user?.name) return "U";
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].substring(0, 1).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }, [user?.name]);

  // Navigation items
  const navItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: Home, 
      action: () => setView("dashboard"),
      active: currentView === "dashboard"
    },
    { 
      id: "soloist", 
      label: "Soloist", 
      icon: User, 
      action: () => setView("soloist"),
      active: currentView === "soloist"
    },
    ...(hasActiveSubscription ? [{
      id: "testing", 
      label: "Playground", 
      icon: Settings, 
      action: () => setView("testing"),
      active: currentView === "testing"
    }] : []),
  ];

  const handleDownloadApp = () => {
    // Open the main website's download page
    window.open(process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.acdc.digital", "_blank");
  };

  if (!isAuthenticated) {
    return null; // Don't show navbar if not authenticated
  }

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pl-5 pr-12 py-3">
      <div className="flex items-center justify-between w-full">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.href = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.acdc.digital"}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/solologo.svg"
              alt="Soloist Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <div className="flex flex-row text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Soloist.
            </div>
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full pr-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                  <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
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
              <DropdownMenuItem onClick={handleDownloadApp}>
                <Download className="mr-2 h-4 w-4" />
                Download Desktop App
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={item.active ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  item.action();
                  setMobileMenuOpen(false);
                }}
                className="justify-start gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
} 