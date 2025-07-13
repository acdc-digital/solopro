// NAVIGATION SIDEBAR
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/dashboard/_components/sidebar.tsx

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
import { ProfileModal } from "@/components/ProfileModal";
import { useFeedStore } from "@/store/feedStore";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useBrowserEnvironment } from "@/utils/environment";
// Import SignOut component
import { SignOutWithGitHub } from "@/auth/oauth/SignOutWithGitHub";
// Import auth actions for sign out
import { useAuthActions } from "@convex-dev/auth/react";
// Import dropdown menu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // State to control the ProfileModal
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

  // State to track dropdown open state for chevron direction
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  // Auth actions for sign out
  const { signOut } = useAuthActions();
  
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
    // Direct download for the desktop application
    const downloadUrl = 'https://github.com/acdc-digital/solopro/releases/download/v1.6.6/Soloist.Pro-1.6.6-x64.dmg';

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Soloist.Pro-1.6.6-x64.dmg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
    console.log("Profile modal opened");
  };
  
  const handleSettingsClick = () => {
    handleGoToSettings();
  };

  const handleSignOut = () => {
    signOut();
    console.log("User signed out");
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
          "flex flex-col justify-between h-full",
          // Glass morphism effect with stronger blur and transparency
          "bg-zinc-50 dark:bg-gray-900/5 backdrop-blur-xl",
          // Very subtle border for definition
          "border-r border-white/10 dark:border-white/5",
          "overflow-hidden transition-[width] duration-300 ease-in-out",
          collapsed ? "w-12" : "w-52"
        )}
      >
        {/* TOP SECTION */}
        <div className="relative">
          {/* Toggle Sidebar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="rounded-md hover:bg-white/10 dark:hover:bg-white/5 m-2"
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
                  <p className="px-1 pl-3 pr-2 p-2 mb-0 text-[10px] font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Application
                  </p>
                  <div className="relative pl-2 pr-4">
                    <Button
                      onClick={effectiveSubscription ? handleDownload : undefined}
                      disabled={!effectiveSubscription}
                      className={cn(
                        "w-full h-9 justify-start px-3 text-sm font-normal backdrop-blur-sm",
                        effectiveSubscription
                          ? "bg-emerald-600/10 dark:bg-emerald-600/10 border border-emerald-600/20 dark:border-emerald-700/20 hover:bg-emerald-600/15 dark:hover:bg-emerald-600/15 text-emerald-700 dark:text-emerald-300"
                          : "bg-zinc-400/15 dark:bg-zinc-700/20 border border-zinc-400/40 dark:border-zinc-600/50 text-zinc-500 dark:text-zinc-400 cursor-not-allowed opacity-70"
                      )}
                      variant="outline"
                    >
                      <Download className="mr-3 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Download App</span>
                    </Button>
                    {!effectiveSubscription && (
                      <div className="mt-1 ml-1">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-red-600/90 text-white rounded-full">
                          Subscribe to download
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {isBrowser === true && <Separator className="bg-white/10 dark:bg-white/5" />}
              
              {/* SUBSCRIPTION STATUS (for non-subscribers) */}
              {effectiveSubscription === false && (
                <>
                <div>
                  <p className="px-1 pl-3 pr-2 p-2 mb-0 text-[10px] font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Access
                  </p>
                    <div className="px-3 py-2 ml-2 mr-3 bg-amber-600/10 dark:bg-amber-600/10 border border-amber-600/20 dark:border-amber-600/20 rounded-md backdrop-blur-sm">
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
                        Limited Access
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Subscribe for full features including the desktop app and Playground.
                      </p>
                    </div>
                  </div>
                  <Separator className="bg-white/10 dark:bg-white/5" />
                </>
              )}
              
              {/* ACTIONS */}
              <div>
                <p className="px-2 pl-3 p-2 mb-0 text-[10px] font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Actions
                </p>
                {mainActions.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={item.disabled ? undefined : item.action}
                    disabled={item.disabled}
                    className={cn(
                      "w-[90%] h-9 justify-start px-3 text-sm font-normal rounded-lg ml-2 mb-1",
                      // Border and transparent background
                      "border border-transparent bg-transparent",
                      // Hover states with blue border only (no background)
                      "hover:border-blue-500/60 dark:hover:border-blue-50/50 hover:bg-transparent",
                      // Active states - blue border to show selected state
                      item.active && !item.disabled && "border-blue-500/70 dark:border-blue-400/60 bg-transparent",
                      // Disabled states
                      item.disabled && "opacity-50 cursor-not-allowed hover:border-transparent hover:bg-transparent"
                    )}
                  >
                    <item.icon className={cn(
                      "mr-3 h-4 w-4 flex-shrink-0",
                      item.disabled 
                        ? "text-zinc-400 dark:text-zinc-600" 
                        : "text-zinc-700 dark:text-zinc-300"
                    )} />
                    <span className={cn(
                      item.disabled ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-700 dark:text-zinc-300"
                    )}>
                      {item.label}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER SECTION */}
        <div className="relative">
          {!collapsed && isAuthenticated && effectiveUser && (
            <div className="border-t border-white/10 dark:border-white/5 p-3 mb-5">
              <DropdownMenu onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="footer"
                    className="w-full h-auto p-2 justify-start hover:bg-white/10 dark:hover:bg-white/5"
                  >
                    <div className="flex items-center gap-1 w-full">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={effectiveUser.image || undefined} alt={effectiveUser.name || "User"} />
                        <AvatarFallback className="text-xs bg-white/20 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start min-w-0 flex-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors pt-2 pb-2 pr-2">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate text-left px-2 py-0">
                          {effectiveUser.name || "User"}
                        </span>
                        <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate text-left px-2 py-0">
                          {effectiveUser.email || ""}
                        </span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2 ml-2" align="start" side="top">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{effectiveUser.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {effectiveUser.email || "user@example.com"}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleProfileClick}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSettingsClick}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <ArrowRightToLine className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {collapsed && isAuthenticated && effectiveUser && (
            <div className="border-t border-white/10 dark:border-white/5 p-2 flex justify-center">
              <DropdownMenu onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="footer"
                    size="icon"
                    className="h-10 w-10 rounded-full mb-9 pb-1 pl-4 hover:bg-white/10 dark:hover:bg-white/5"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={effectiveUser.image || undefined} alt={effectiveUser.name || "User"} />
                      <AvatarFallback className="text-xs bg-white/20 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2 ml-12" align="start" side="top">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{effectiveUser.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {effectiveUser.email || "user@example.com"}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleProfileClick}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSettingsClick}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <ArrowRightToLine className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {/* Additional padding at bottom */}
          <div className="h-4"></div>
        </div>
      </div>
      {/* Our SettingsDialog component, controlled by local state */}
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      
      {/* Our HelpModal component, controlled by local state */}
      <HelpModal open={isHelpOpen} onOpenChange={setIsHelpOpen} />

      {/* Our ProfileModal component, controlled by local state */}
      <ProfileModal open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} />
    </div>
  );
}