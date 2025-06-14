// NAVIGATION SIDEBAR
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/dashboard/_components/sidebar.tsx

"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { useSidebarStore } from "@/store/sidebarStore";
import {
  Search,
  Plus,
  Settings,
  ArrowRightToLine,
  ArrowLeftFromLine,
  PersonStanding,
  Activity,
  CircleHelpIcon,
  ChevronUp,
  ChevronDown,
  User,
  Calendar,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Import Stores & Modals
import { SettingsDialog } from "@/app/settings/SettingsDialog";
import { HelpModal } from "@/components/HelpModal";
import { useFeedStore } from "@/store/feedStore";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useBrowserEnvironment } from "@/utils/environment";
// Import SignOut component
import { SignOutWithGitHub } from "@/auth/oauth/SignOutWithGitHub";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const isBrowser = useBrowserEnvironment();
  
  // Get authenticated user following authentication rules (skip for browser mode)
  const { isAuthenticated, isLoading: authLoading, userId } = useConvexUser();
  
  // Get user details from Convex when authenticated (skip for browser mode)
  const user = useQuery(
    api.users.viewer,
    isBrowser === false && isAuthenticated && userId ? {} : "skip"
  );
  
  // Check subscription status (now works for both browser and desktop mode)
  const hasActiveSubscription = useQuery(
    api.userSubscriptions.hasActiveSubscription,
    isAuthenticated && userId ? {} : "skip"
  );
  
  // For browser mode, provide default user data
  const effectiveUser = isBrowser === true ? {
    name: "Web User",
    email: "web@soloist.app",
    image: null
  } : user;
  
  // Use actual subscription status for both browser and desktop mode
  const effectiveSubscription = hasActiveSubscription;
  
  // State for accordion
  const [accountMenuOpen, setAccountMenuOpen] = React.useState(false);
  
  const { 
    collapsed, 
    toggleCollapsed, 
    searchQuery, 
    setSearchQuery,
    currentView,
    setView
  } = useSidebarStore();
  
  // State to control the SettingsDialog
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  
  // State to control the HelpModal
  const [isHelpOpen, setIsHelpOpen] = React.useState(false);
  
  // Handlers
  const handleGoToSettings = () => {
    setIsSettingsOpen(true);
  };
  
  const handleCreateNewLog = () => {
    const {
      sidebarOpen,
      activeTab,
      resetFeed,
      setSidebarOpen,
      setSelectedDate,
      setActiveTab,
    } = useFeedStore.getState();
    
    console.log("Create New Log clicked - Current state:", { sidebarOpen, activeTab });
    
    // Set view to dashboard when creating a new log
    setView("dashboard");
    
    // If it's already open on "log", close it (TOGGLE OFF)
    if (sidebarOpen && activeTab === "log") {
      console.log("Toggling sidebar OFF - closing sidebar");
      setSidebarOpen(false);
      return;
    }
    
    // Otherwise, open and set up the "log" tab (TOGGLE ON)
    console.log("Toggling sidebar ON - opening log tab");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateKey = `${yyyy}-${mm}-${dd}`;
    
    resetFeed();
    setSelectedDate(dateKey);
    setActiveTab("log");
    setSidebarOpen(true);
  };
  
  const handleSoloist = () => {
    // Switch to Soloist view
    setView("soloist");
    
    // Close the right sidebar if it's open
    const { setSidebarOpen } = useFeedStore.getState();
    setSidebarOpen(false);
    
    console.log("Soloist action clicked");
  };

  const handleTesting = () => {
    // Switch to Testing view
    setView("testing");
    
    // Close the right sidebar if it's open
    const { setSidebarOpen } = useFeedStore.getState();
    setSidebarOpen(false);
    
    console.log("Testing action clicked");
  };

  const handleCalendar = () => {
    // Switch to Dashboard/Calendar view
    setView("dashboard");
    
    // Close the right sidebar if it's open
    const { setSidebarOpen } = useFeedStore.getState();
    setSidebarOpen(false);
    
    console.log("Calendar action clicked");
  };
  
  const handleGoTohelp = () => {
    // Open the help modal
    setIsHelpOpen(true);
    
    console.log("Help modal opened");
  };
  
  const handleDownload = () => {
    // Open the main website in a new tab/window for downloads
    window.open(process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.acdc.digital", "_blank");
  };
  
  const handleProfileClick = () => {
    console.log("Profile clicked");
    setAccountMenuOpen(false);
  };
  
  const handleSettingsClick = () => {
    handleGoToSettings();
    setAccountMenuOpen(false);
  };
  
  // Items that show only if expanded
  const mainActions = [
    { id: "soloist",  label: "Soloist",        icon: PersonStanding,  action: handleSoloist, active: currentView === "soloist", disabled: false },
    // For browser users: always show playground but disabled if no subscription
    // For desktop users: only show if they have subscription
    ...(isBrowser === true ? [{
      id: "testing", 
      label: "Playground", 
      icon: Activity, 
      action: effectiveSubscription ? handleTesting : () => {}, 
      active: currentView === "testing",
      disabled: !effectiveSubscription
    }] : effectiveSubscription ? [{
      id: "testing", 
      label: "Playground", 
      icon: Activity, 
      action: handleTesting, 
      active: currentView === "testing",
      disabled: false
    }] : []),
    { id: "calendar", label: "Calendar",       icon: Calendar,        action: handleCalendar, active: currentView === "dashboard", disabled: false },
    { id: "new-log",  label: "Create New Log", icon: Plus,            action: handleCreateNewLog, active: false, disabled: false },
    { id: "settings", label: "Settings",       icon: Settings,        action: handleGoToSettings, disabled: false },
    { id: "help",     label: "Help",           icon: CircleHelpIcon,  action: handleGoTohelp, disabled: false },
  ];
  
  // Get user initials for avatar fallback
  const userInitials = React.useMemo(() => {
    if (!effectiveUser?.name) return "U";
    const names = effectiveUser.name.split(' ');
    if (names.length === 1) return names[0].substring(0, 1).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }, [effectiveUser?.name]);
  
  return (
    <div className={cn("relative h-screen", className)}>
      <div
        className={cn(
          "flex flex-col justify-between h-full border-r border-zinc-300/30 bg-white dark:border-zinc-700/30 dark:bg-zinc-950/40",
          "backdrop-blur-xl overflow-hidden transition-[width] duration-300 ease-in-out",
          collapsed ? "w-13" : "w-64"
        )}
      >
        {/* TOP SECTION */}
        <div className="relative">
          {/* Toggle Sidebar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="rounded-md hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 m-2"
          >
            {collapsed ? (
              <ArrowRightToLine className="h-4 w-4" />
            ) : (
              <ArrowLeftFromLine className="h-4 w-4" />
            )}
          </Button>
          {/* Everything below is hidden if collapsed */}
          {!collapsed && (
            <div className="mt-1 space-y-3">
              {/* APPLICATION - Only show for browser mode users */}
              {isBrowser === true && (
                <div>
                  <p className="px-1 pl-3 pr-2 p-2 mb-0 text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Application
                  </p>
                  <div className="relative pl-2 pr-4">
                    <Button
                      onClick={handleDownload}
                      className="w-full h-9 justify-start px-3 text-sm font-normal bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-600 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-800/30 text-emerald-700 dark:text-emerald-300"
                      variant="outline"
                    >
                      <Download className="mr-3 h-4 w-4 flex-shrink-0" />
                      Download Desktop App
                    </Button>
                  </div>
                </div>
              )}
              {isBrowser === true && <Separator className="bg-zinc-300/40 dark:bg-zinc-700/40" />}
              
              {/* SUBSCRIPTION STATUS (for non-subscribers) */}
              {effectiveSubscription === false && (
                <>
                <div>
                  <p className="px-1 pl-3 pr-2 p-2 mb-0 text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Access
                  </p>
                    <div className="px-3 py-2 ml-2 mr-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
                        Limited Access
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Subscribe for full features including the desktop app and Playground.
                      </p>
                    </div>
                  </div>
                  <Separator className="bg-zinc-300/40 dark:bg-zinc-700/40" />
                </>
              )}
              
              {/* ACTIONS */}
              <div>
                <p className="px-2 pl-3 p-2 mb-0 text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Actions
                </p>
                {mainActions.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={item.disabled ? undefined : item.action}
                    disabled={item.disabled}
                    className={cn(
                      "w-[90%] h-9 justify-start px-3 text-sm font-normal hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg ml-2 mb-1",
                      item.active && !item.disabled && "bg-zinc-200/80 dark:bg-zinc-800/80",
                      item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent"
                    )}
                  >
                    <item.icon className={cn(
                      "mr-3 h-4 w-4 flex-shrink-0",
                      item.disabled 
                        ? "text-zinc-400 dark:text-zinc-600" 
                        : "text-zinc-600 dark:text-zinc-400"
                    )} />
                    <span className={item.disabled ? "text-zinc-400 dark:text-zinc-600" : ""}>
                      {item.label}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* BOTTOM SECTION */}
        <div className="relative">
          {/* Additional padding at bottom */}
          <div className="h-10"></div>
        </div>
      </div>
      {/* Our SettingsDialog component, controlled by local state */}
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      
      {/* Our HelpModal component, controlled by local state */}
      <HelpModal open={isHelpOpen} onOpenChange={setIsHelpOpen} />
    </div>
  );
}