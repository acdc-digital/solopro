// SETTINGS
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/settings/SettingsDialog.tsx

"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Attributes from "./_components/Attributes";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import { Loader2, CheckCircle2, X, Palette, User, Zap, Settings, Download, AlertCircle, RefreshCw, Smartphone } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignOutWithGitHub } from "@/auth/oauth/SignOutWithGitHub";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppVersion } from "@/hooks/useAppVersion";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, isLoading: authLoading, userId } = useConvexUser();
  const [instructions, setInstructions] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // App version checking
  const versionInfo = useAppVersion();

  // Get user details from Convex when authenticated
  const user = useQuery(
    api.users.viewer,
    isAuthenticated && userId ? {} : "skip"
  );

  // Fetch existing instructions
  const existingInstructions = useQuery(
    api.randomizer.getInstructions,
    userId ? { userId } : "skip"
  );

  // Save instructions mutation
  const saveInstructionsMutation = useMutation(api.randomizer.saveInstructions);

  // Update the local state when we get existing instructions
  useEffect(() => {
    if (existingInstructions) {
      setInstructions(existingInstructions || "");
    }
  }, [existingInstructions]);

  const handleSaveInstructions = async () => {
    if (!userId) return;

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await saveInstructionsMutation({
        userId,
        instructions: instructions.trim()
      });
      setSaveSuccess(true);
      // Reset success indicator after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save instructions:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-200 dark:border-zinc-700">
          <div className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Settings className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              User Preferences
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
              Customize your appearance and personalize your experience
            </DialogDescription>
          </div>
        </div>

        <ScrollArea className="flex-1 max-h-[70vh] p-6">
          <div className="space-y-6">
            {/* Theme Section */}
            <Card className="border-zinc-200 dark:border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Palette className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                  Theme
                </CardTitle>
                <CardDescription className="text-sm">
                  Choose your preferred appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">Current theme:</span>
                    <Badge variant="outline" className="text-xs">
                      {theme === "dark" ? "Dark" : "Light"}
                    </Badge>
                  </div>
                  <Button 
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    size="sm"
                    variant="outline"
                    className="h-8"
                  >
                    Switch to {theme === "dark" ? "light" : "dark"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* App Version Section */}
            <Card className="border-zinc-200 dark:border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Smartphone className="h-4 w-4 text-indigo-600 dark:text-indigo-500" />
                  App Version
                </CardTitle>
                <CardDescription className="text-sm">
                  Keep your app up to date with the latest features and improvements
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">Current version:</span>
                    <Badge variant="outline" className="text-xs font-mono">
                      v{versionInfo.current}
                    </Badge>
                  </div>
                  <Button 
                    onClick={versionInfo.refresh}
                    size="sm"
                    variant="ghost"
                    disabled={versionInfo.isChecking}
                    className="h-8"
                  >
                    {versionInfo.isChecking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Update Status */}
                {versionInfo.isChecking ? (
                  <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Checking for updates...</span>
                  </div>
                ) : versionInfo.error ? (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-700 dark:text-red-300">
                      Error checking for updates: {versionInfo.error}
                    </span>
                  </div>
                ) : versionInfo.updateAvailable ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md">
                      <Download className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          Update available: v{versionInfo.latest}
                        </span>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          A new version is ready to install
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={versionInfo.handleUpdate}
                        size="sm"
                        className="h-8 bg-blue-600 hover:bg-blue-700"
                      >
                        Update Now
                      </Button>
                      {versionInfo.releaseNotes && (
                        <Button 
                          onClick={() => window.open(versionInfo.releaseNotes, '_blank')}
                          size="sm"
                          variant="outline"
                          className="h-8"
                        >
                          View Release Notes
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      You&apos;re running the latest version!
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personal Attributes Section */}
            <Card className="border-zinc-200 dark:border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-sm">
                  Help personalize your experience with AI-generated content
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Attributes />
              </CardContent>
            </Card>

            {/* AI Generator Settings Section */}
            <Card className="border-zinc-200 dark:border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                  Generator Settings
                </CardTitle>
                <CardDescription className="text-sm">
                  Customize how random daily logs are generated with personalized instructions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instructions" className="text-sm font-medium">
                    Custom Instructions
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Example: I'm a software developer working on a mobile app. I usually have standups at 10am, and I try to exercise 3 times a week. I'm learning Spanish in my free time."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={4}
                    className="resize-none text-sm leading-relaxed"
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Provide context about yourself, schedule, activities, or interests for more personalized random logs.
                  </p>
                </div>
                
                <Button 
                  onClick={handleSaveInstructions} 
                  disabled={isSaving}
                  size="sm"
                  variant="outline"
                  className="w-full h-9"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving Instructions...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                      Instructions Saved!
                    </>
                  ) : (
                    "Save Instructions"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}