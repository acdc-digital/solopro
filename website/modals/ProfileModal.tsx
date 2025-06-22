// PROFILE MODAL
// /Users/matthewsimon/Projects/solopro/website/components/ProfileModal.tsx

"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useConvexUser } from "../lib/hooks/useConvexUser";
import { Loader2, CheckCircle2, User, Phone, Camera, Upload, X, Shield, ArrowLeft } from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useAuthActions } from "@convex-dev/auth/react";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { isAuthenticated, userId } = useConvexUser();
  const { signIn } = useAuthActions();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Password reset state
  const [passwordResetStep, setPasswordResetStep] = useState<"idle" | "email" | "verification">("idle");
  const [resetEmail, setResetEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Get user details from Convex when authenticated
  const user = useQuery(
    api.users.viewer,
    isAuthenticated && userId ? {} : "skip"
  );

  // Update profile mutation
  const updateProfileMutation = useMutation(api.users.updateUserProfile);

  // Update local state when user data loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setImageUrl(user.image || "");
      setPreviewImage(null);
      setResetEmail(user.email || "");
    }
  }, [user]);

  // Reset password flow state when modal closes
  useEffect(() => {
    if (!open) {
      setPasswordResetStep("idle");
      setVerificationCode("");
      setNewPassword("");
      setResetError(null);
      setResetSuccess(false);
      setIsSubmittingReset(false);
    }
  }, [open]);

  // Get user initials for avatar fallback
  const userInitials = React.useMemo(() => {
    const displayName = name || user?.name || "User";
    const names = displayName.split(' ');
    if (names.length === 1) return names[0].substring(0, 1).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }, [name, user?.name]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Convert to base64 for storage (in a real app, you'd upload to a service like Cloudinary)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert('Failed to upload image');
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userId) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateProfileMutation({
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        image: imageUrl || undefined,
      });

      setSaveSuccess(true);
      // Reset success indicator after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setPreviewImage(null);
  };

  const handleStartPasswordReset = () => {
    setPasswordResetStep("email");
    setResetError(null);
  };

  const handleSendResetCode = async () => {
    if (!resetEmail.trim()) {
      setResetError("Please enter your email address");
      return;
    }

    setIsSubmittingReset(true);
    setResetError(null);

    try {
      const formData = new FormData();
      formData.set("flow", "reset");
      formData.set("email", resetEmail);

      await signIn("password", formData);
      setPasswordResetStep("verification");
    } catch (error) {
      setResetError(error instanceof Error ? error.message : "Failed to send reset code");
    } finally {
      setIsSubmittingReset(false);
    }
  };

  const handleResetPassword = async () => {
    if (!verificationCode.trim()) {
      setResetError("Please enter the verification code");
      return;
    }

    if (!newPassword.trim()) {
      setResetError("Please enter a new password");
      return;
    }

    setIsSubmittingReset(true);
    setResetError(null);

    try {
      const formData = new FormData();
      formData.set("flow", "reset-verification");
      formData.set("email", resetEmail);
      formData.set("code", verificationCode);
      formData.set("password", newPassword);

      await signIn("password", formData);
      setResetSuccess(true);

      // Reset form after successful password change
      setTimeout(() => {
        setPasswordResetStep("idle");
        setVerificationCode("");
        setNewPassword("");
        setResetSuccess(false);
      }, 2000);
    } catch (error) {
      setResetError(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setIsSubmittingReset(false);
    }
  };

  const handleCancelPasswordReset = () => {
    setPasswordResetStep("idle");
    setVerificationCode("");
    setNewPassword("");
    setResetError(null);
    setResetSuccess(false);
  };

  const displayImage = previewImage || imageUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-200 dark:border-zinc-700">
          <div className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <User className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              Profile Settings
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
              Update your profile information and avatar
            </DialogDescription>
          </div>
        </div>

        <ScrollArea className="flex-1 max-h-[70vh] p-6">
          <div className="space-y-6">
            {/* Avatar Section */}
            <Card className="border-zinc-200 dark:border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Camera className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                  Profile Picture
                </CardTitle>
                <CardDescription className="text-sm">
                  Upload a profile picture to personalize your account
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={displayImage || undefined} alt={name || "User"} />
                      <AvatarFallback className="text-lg bg-zinc-100 dark:bg-zinc-800">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    {displayImage && (
                      <Button
                        onClick={handleRemoveImage}
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploading}
                        className="w-fit"
                        asChild
                      >
                        <span>
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                      aria-label="Upload profile picture"
                    />
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      JPG, PNG or GIF. Max 5MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information Section */}
            <Card className="border-zinc-200 dark:border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-sm">
                  Update your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Optional. Used for account recovery and notifications.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 rounded-md text-zinc-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="border-zinc-200 dark:border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4 text-red-600 dark:text-red-500" />
                  Security
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {passwordResetStep === "idle" && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Password</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Update your password to keep your account secure
                      </p>
                    </div>
                    <Button
                      onClick={handleStartPasswordReset}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                )}

                {passwordResetStep === "email" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={handleCancelPasswordReset}
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                          <p className="text-sm font-medium">Reset Password</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Enter your email to receive a reset code
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="reset-email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        placeholder="Enter your email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {resetError && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-800 dark:text-red-200">{resetError}</p>
                      </div>
                    )}

                    <Button
                      onClick={handleSendResetCode}
                      disabled={isSubmittingReset}
                      className="w-full"
                    >
                      {isSubmittingReset ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Sending Code...
                        </>
                      ) : (
                        "Send Reset Code"
                      )}
                    </Button>
                  </div>
                )}

                {passwordResetStep === "verification" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setPasswordResetStep("email")}
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                          <p className="text-sm font-medium">Verify & Set New Password</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Check your email for the verification code
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="verification-code" className="text-sm font-medium">
                        Verification Code
                      </label>
                      <input
                        id="verification-code"
                        type="text"
                        placeholder="Enter verification code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={8}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="new-password" className="text-sm font-medium">
                        New Password
                      </label>
                      <input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Must contain 8+ characters with uppercase, lowercase, number, and special character
                      </p>
                    </div>

                    {resetError && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-800 dark:text-red-200">{resetError}</p>
                      </div>
                    )}

                    {resetSuccess && (
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Password updated successfully!
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={handleResetPassword}
                      disabled={isSubmittingReset || resetSuccess}
                      className="w-full"
                    >
                      {isSubmittingReset ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Updating Password...
                        </>
                      ) : resetSuccess ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Password Updated!
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Footer with Save Button */}
        <div className="flex justify-end gap-3 p-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            disabled={isSaving}
            size="sm"
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 