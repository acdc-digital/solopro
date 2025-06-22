"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFlow?: "signIn" | "signUp" | "forgotPassword";
  onAuthSuccess?: () => void;
}

export function SignInModal({ 
  isOpen, 
  onClose, 
  initialFlow = "signIn",
  onAuthSuccess 
}: SignInModalProps) {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | "signUp" | "forgotPassword" | { email: string } | { resetEmail: string }>(initialFlow);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Debug: Check if auth context is working
  console.log("🔴 SignInModal: useAuthActions result:", { signIn });
  console.log("🔴 SignInModal: signIn type:", typeof signIn);

  // Reset step when modal opens and check localStorage for step preference
  useEffect(() => {
    if (isOpen) {
      // First check localStorage for preferred step
      const savedStep = localStorage.getItem('authStep');
      if (savedStep === 'signUp') {
        setStep('signUp');
        localStorage.removeItem('authStep');
      } else {
        // If no saved step, use the provided initialFlow
        setStep(initialFlow);
      }
      setError(null);
      setErrorInfo(null);
    }
  }, [isOpen, initialFlow]);

  // Clear any form values when entering verification step
  useEffect(() => {
    if (typeof step === "object") {
      // We're in verification step - force clear any cached form values
      const codeInput = document.getElementById('modal-code') as HTMLInputElement;
      if (codeInput) {
        codeInput.value = '';
      }
    }
  }, [step]);

  // Helper function to provide user-friendly error messages
  const getErrorMessage = (error: any, currentStep: "signIn" | "signUp" | "forgotPassword" | { email: string } | { resetEmail: string }): {
    message: string;
    suggestionAction: string | null;
    showSwitchButton: boolean;
    type: "verification" | "auth" | "general";
  } => {
    const errorMessage = error?.message || error?.toString() || "An error occurred";

    // Check for verification code specific errors
    const verificationCodePatterns = [
      'could not verify code',
      'invalid verification code',
      'verification code expired',
      'verification failed',
      'code is invalid',
      'incorrect code'
    ];
    
    const isVerificationError = verificationCodePatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern)
    );
    
    if (isVerificationError && typeof currentStep === "object") {
      return {
        message: "The verification code is incorrect or has expired. Please check your email and try again.",
        suggestionAction: "resend-code",
        showSwitchButton: false,
        type: "verification"
      };
    }
    
    // Check for common "user not found" patterns
    const userNotFoundPatterns = [
      'user not found',
      'user does not exist',
      'invalid credentials',
      'account not found',
      'no user found',
      'authentication failed',
      'server error' // Common when user doesn't exist
    ];
    
    const isUserNotFound = userNotFoundPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern)
    );
    
    if (isUserNotFound && currentStep === "signIn") {
      return {
        message: "Account not found. Would you like to create an account instead?",
        suggestionAction: "switch-to-signup",
        showSwitchButton: true,
        type: "auth"
      };
    }
    
    // Check for "user already exists" patterns
    const userExistsPatterns = [
      'user already exists',
      'account already exists',
      'email already registered',
      'user already registered'
    ];
    
    const isUserExists = userExistsPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern)
    );
    
    if (isUserExists && currentStep === "signUp") {
      return {
        message: "Account already exists. Would you like to sign in instead?",
        suggestionAction: "switch-to-signin",
        showSwitchButton: true,
        type: "auth"
      };
    }
    
    // Default error message
    return {
      message: errorMessage,
      suggestionAction: null,
      showSwitchButton: false,
      type: "general"
    };
  };

  // State for enhanced error handling
  const [errorInfo, setErrorInfo] = useState<{
    message: string;
    suggestionAction: string | null;
    showSwitchButton: boolean;
    type: "verification" | "auth" | "general";
  } | null>(null);

  // Handle successful authentication
  const handleAuthSuccess = () => {
    // Close the modal
    onClose();
    
    // Call the success callback if provided
    if (onAuthSuccess) {
      onAuthSuccess();
      // Don't refresh the page if we're handling success with a callback
    } else {
      // Otherwise, just refresh the router
      router.refresh();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close sign in modal"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === "signIn" ? "Sign in to your account" : 
           step === "signUp" ? "Create an account" : 
           step === "forgotPassword" ? "Reset your password" :
           typeof step === "object" && "resetEmail" in step ? "Enter new password" :
           "Verify your email"}
        </h2>
        
        {step === "signIn" || step === "signUp" ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsSubmitting(true);
              setError(null);
              setErrorInfo(null);
              
              console.log("🔴 Form submitted for step:", step);
              const formData = new FormData(e.target as HTMLFormElement);
              formData.set("flow", step);
              
              void signIn("password", formData)
                .then((result) => {
                  console.log("🔴 Password sign-in result:", result);
                  // If result exists but no redirect, it means we need email verification
                  if (result && !result.redirect) {
                    console.log("🔴 Email verification required");
                    setStep({ email: formData.get("email") as string });
                  } else {
                    console.log("🔴 Password sign-in successful");
                    handleAuthSuccess();
                  }
                })
                .catch((error) => {
                  console.error("🔴 Password sign-in error:", error);
                  const errorDetails = getErrorMessage(error, step);
                  setError(errorDetails.message);
                  setErrorInfo(errorDetails);
                })
                .finally(() => {
                  setIsSubmitting(false);
                });
            }}
          >
            <div>
              <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="modal-email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="modal-password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                name="password"
                placeholder={step === "signUp" ? "Create a password" : "Enter your password"}
                required
              />
              {step === "signUp" && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Must contain 8+ characters with uppercase, lowercase, number, and special character
                </p>
              )}
            </div>
            
            <button
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium rounded-full shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {step === "signIn" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                step === "signIn" ? "Sign in" : "Sign up"
              )}
            </button>
            
            {error && (
              <div className={`p-4 rounded-lg border ${
                errorInfo?.type === "verification" 
                  ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" 
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}>
                <div className="flex items-start">
                  <div className={`flex-shrink-0 mr-3 mt-0.5 ${
                    errorInfo?.type === "verification" ? "text-amber-600" : "text-red-600"
                  }`}>
                    {errorInfo?.type === "verification" ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      errorInfo?.type === "verification" 
                        ? "text-amber-800 dark:text-amber-200" 
                        : "text-red-800 dark:text-red-300"
                    }`}>
                      {error}
                    </p>
                    {errorInfo?.showSwitchButton && (
                      <button
                        type="button"
                        onClick={() => {
                          if (errorInfo.suggestionAction === "switch-to-signup") {
                            setStep("signUp");
                          } else if (errorInfo.suggestionAction === "switch-to-signin") {
                            setStep("signIn");
                          }
                          setError(null);
                          setErrorInfo(null);
                        }}
                        className={`mt-2 px-3 py-1 text-xs font-medium rounded border transition-colors ${
                          errorInfo?.type === "verification"
                            ? "bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-600"
                            : "bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-200 border-red-300 dark:border-red-600"
                        }`}
                      >
                        {errorInfo.suggestionAction === "switch-to-signup" ? "Create Account" : "Sign In Instead"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
              {step === "signIn" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="text-primary dark:text-primary hover:underline font-medium"
                onClick={() => {
                  setStep(step === "signIn" ? "signUp" : "signIn");
                  setError(null);
                  setErrorInfo(null);
                }}
              >
                {step === "signIn" ? "Sign up" : "Sign in"}
              </button>
              
              {step === "signIn" && (
                <>
                  {" • "}
                  <button
                    type="button"
                    className="text-primary dark:text-primary hover:underline font-medium"
                    onClick={() => {
                      setStep("forgotPassword");
                      setError(null);
                      setErrorInfo(null);
                    }}
                  >
                    Forgot password?
                  </button>
                </>
              )}
            </div>
          </form>
        ) : step === "forgotPassword" ? (
          // Forgot password form
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsSubmitting(true);
              setError(null);
              setErrorInfo(null);
              
              const formData = new FormData(e.target as HTMLFormElement);
              formData.set("flow", "reset");
              
              void signIn("password", formData)
                .then(() => {
                  setStep({ resetEmail: formData.get("email") as string });
                })
                .catch((error) => {
                  const errorDetails = getErrorMessage(error, step);
                  setError(errorDetails.message);
                  setErrorInfo(errorDetails);
                })
                .finally(() => {
                  setIsSubmitting(false);
                });
            }}
          >
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your email address and we'll send you a code to reset your password.
              </p>
            </div>
            
            <div>
              <label htmlFor="modal-reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="modal-reset-email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <button
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium rounded-full shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending code...
                </span>
              ) : (
                "Send reset code"
              )}
            </button>
            
            {error && (
              <div className={`p-4 rounded-lg border ${
                errorInfo?.type === "verification" 
                  ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" 
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}>
                <div className="flex items-start">
                  <div className={`flex-shrink-0 mr-3 mt-0.5 ${
                    errorInfo?.type === "verification" ? "text-amber-600" : "text-red-600"
                  }`}>
                    {errorInfo?.type === "verification" ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      errorInfo?.type === "verification" 
                        ? "text-amber-800 dark:text-amber-200" 
                        : "text-red-800 dark:text-red-300"
                    }`}>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
              <button
                type="button"
                className="text-primary dark:text-primary hover:underline font-medium"
                onClick={() => {
                  setStep("forgotPassword");
                  setError(null);
                  setErrorInfo(null);
                }}
              >
                Back to email entry
              </button>
            </div>
          </form>
        ) : typeof step === "object" && "resetEmail" in step ? (
          // Password reset verification form
          <form
            key={`reset-verification-${step.resetEmail}`}
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsSubmitting(true);
              setError(null);
              setErrorInfo(null);
              
              const formData = new FormData(e.target as HTMLFormElement);
              formData.set("flow", "reset-verification");
              formData.set("email", step.resetEmail);
              
              void signIn("password", formData)
                .then(() => {
                  handleAuthSuccess();
                })
                .catch((error) => {
                  const errorDetails = getErrorMessage(error, step);
                  setError(errorDetails.message);
                  setErrorInfo(errorDetails);
                })
                .finally(() => {
                  setIsSubmitting(false);
                });
            }}
          >
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We've sent a reset code to <strong>{step.resetEmail}</strong>
              </p>
            </div>
            
            <div>
              <label htmlFor="modal-reset-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reset Code
              </label>
              <input
                key={`reset-code-input-${step.resetEmail}`}
                id="modal-reset-code"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono text-lg tracking-wider placeholder:text-gray-400 placeholder:font-sans"
                type="text"
                name="code"
                placeholder="Enter your code..."
                maxLength={8}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                data-form-type="other"
                required
              />
            </div>
            
            <div>
              <label htmlFor="modal-new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="modal-new-password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                name="newPassword"
                placeholder="Create a new password"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must contain 8+ characters with uppercase, lowercase, number, and special character
              </p>
            </div>
            
            <button
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium rounded-full shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 814 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting password...
                </span>
              ) : (
                "Reset password"
              )}
            </button>
            
            {error && (
              <div className={`p-4 rounded-lg border ${
                errorInfo?.type === "verification" 
                  ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" 
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}>
                <div className="flex items-start">
                  <div className={`flex-shrink-0 mr-3 mt-0.5 ${
                    errorInfo?.type === "verification" ? "text-amber-600" : "text-red-600"
                  }`}>
                    {errorInfo?.type === "verification" ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      errorInfo?.type === "verification" 
                        ? "text-amber-800 dark:text-amber-200" 
                        : "text-red-800 dark:text-red-300"
                    }`}>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
              <button
                type="button"
                className="text-primary dark:text-primary hover:underline font-medium"
                onClick={() => {
                  setStep("forgotPassword");
                  setError(null);
                  setErrorInfo(null);
                }}
              >
                Back to email entry
              </button>
            </div>
          </form>
        ) : (
          // Email verification form
          <form
            key={`verification-${step.email}`}
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsSubmitting(true);
              setError(null);
              setErrorInfo(null);
              
              console.log("🔴 Verification form submitted");
              const formData = new FormData(e.target as HTMLFormElement);
              formData.set("flow", "email-verification");
              formData.set("email", step.email);
              
              void signIn("password", formData)
                .then(() => {
                  console.log("🔴 Email verification successful");
                  handleAuthSuccess();
                })
                .catch((error) => {
                  console.error("🔴 Email verification error:", error);
                  const errorDetails = getErrorMessage(error, step);
                  setError(errorDetails.message);
                  setErrorInfo(errorDetails);
                })
                .finally(() => {
                  setIsSubmitting(false);
                });
            }}
          >
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We've sent a verification code to <strong>{step.email}</strong>
              </p>
            </div>
            
            <div>
              <label htmlFor="modal-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Verification Code
              </label>
              <input
                key={`code-input-${step.email}`}
                id="modal-code"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono text-lg tracking-wider placeholder:text-gray-400 placeholder:font-sans"
                type="text"
                name="code"
                placeholder="Enter your code..."
                maxLength={8}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                data-form-type="other"
                required
              />
            </div>
            
            <button
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium rounded-full shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Email"
              )}
            </button>
            
            {error && (
              <div className={`p-4 rounded-lg border ${
                errorInfo?.type === "verification" 
                  ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" 
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}>
                <div className="flex items-start">
                  <div className={`flex-shrink-0 mr-3 mt-0.5 ${
                    errorInfo?.type === "verification" ? "text-amber-600" : "text-red-600"
                  }`}>
                    {errorInfo?.type === "verification" ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      errorInfo?.type === "verification" 
                        ? "text-amber-800 dark:text-amber-200" 
                        : "text-red-800 dark:text-red-300"
                    }`}>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
              <button
                type="button"
                className="text-primary dark:text-primary hover:underline font-medium"
                onClick={() => {
                  setStep("signIn");
                  setError(null);
                  setErrorInfo(null);
                }}
              >
                Back to sign in
              </button>
            </div>
          </form>
        )}
        
        {(step === "signIn" || step === "signUp") && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={async (e) => {
                  e.preventDefault(); // Prevent any default behavior
                  setError(null);
                  setErrorInfo(null);
                  
                  console.log("🔴 GitHub button clicked!"); // Basic click detection
                  console.log("🔴 signIn function:", typeof signIn, signIn); // Check if signIn exists
                  
                  try {
                    console.log("🔴 Attempting GitHub sign-in...");
                    // Let Convex Auth handle redirects automatically
                    const result = await signIn("github");
                    console.log("🔴 GitHub sign-in result:", result);
                    console.log("🔴 GitHub sign-in successful");
                    handleAuthSuccess();
                  } catch (error) {
                    console.error("🔴 GitHub sign-in error:", error);
                    const errorDetails = getErrorMessage(error, step);
                    setError(errorDetails.message);
                    setErrorInfo(errorDetails);
                  }
                }}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z" clipRule="evenodd"></path>
                </svg>
                GitHub
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 