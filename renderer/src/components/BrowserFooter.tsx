// BROWSER FOOTER
// /Users/matthewsimon/Documents/Github/solopro/renderer/src/components/BrowserFooter.tsx

"use client";

import React, { useState } from "react";
import { Github, ExternalLink, MessageSquare } from "lucide-react";
import { PrivacyPolicyModal } from "./privacyPolicy";
import { TermsOfServiceModal } from "./termsOfService";
import { FeedbackModal } from "./FeedbackModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText, Mail, Calendar } from "lucide-react";

export function BrowserFooter() {
  const currentYear = new Date().getFullYear();
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const lastUpdated = "January 2025";

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <footer className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-200/60 dark:border-zinc-700/60 py-1 pl-6 md:pl-6 pr-1 md:pr-10">
        <div className="w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left: ACDC.digital branding */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  ACDC.digital
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  © {currentYear}
                </span>
              </div>
            </div>

            {/* Right: Navigation Links */}
            <nav className="flex items-center">
              <div className="flex items-center gap-1 pr-4">
                <button
                  onClick={() => setFeedbackModalOpen(true)}
                  className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 rounded-md transition-all duration-200 font-medium flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Feedback</span>
                </button>
                
                <button
                  onClick={() => handleLinkClick((process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.acdc.digital") + "/#pricing")}
                  className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 rounded-md transition-all duration-200 font-medium"
                >
                  Pricing
                </button>
                
                <button 
                  onClick={() => setPrivacyModalOpen(true)}
                  className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 rounded-md transition-all duration-200 font-medium"
                >
                  Privacy
                </button>
                
                <button 
                  onClick={() => setTermsModalOpen(true)}
                  className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 rounded-md transition-all duration-200 font-medium"
                >
                  Terms
                </button>
                
                <button
                  onClick={() => handleLinkClick("https://github.com/acdc-digital/solopro")}
                  className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 rounded-md transition-all duration-200 font-medium flex items-center gap-1.5"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">GitHub</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Mobile: Additional info - more subtle */}
          <div className="md:hidden mt-3 pt-3 border-t border-zinc-200/50 dark:border-zinc-700/50">
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Simple mood tracking with AI-powered insights for better well-being
            </p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <Dialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 border-0 shadow-2xl">
          <DialogHeader className="p-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Privacy Policy
                </DialogTitle>
                <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Last updated: {lastUpdated} • Effective Date: {lastUpdated}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="px-6 pb-6 max-h-[65vh]">
            <div className="space-y-8 text-sm leading-relaxed">
              
              {/* Introduction */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  Introduction
                </h3>
                <div className="space-y-3 text-zinc-600 dark:text-zinc-300">
                  <p>
                    Welcome to SoloPro ("we," "our," or "us"). This Privacy Policy explains how ACDC.digital 
                    collects, uses, discloses, and safeguards your information when you use our mood tracking 
                    and AI-powered forecasting application and related services.
                  </p>
                  <p>
                    SoloPro is designed to help you track your daily well-being through personalized logs, 
                    AI-powered scoring (0-100), and visual heatmaps. We are committed to protecting your 
                    privacy and ensuring the security of your personal and emotional data.
                  </p>
                </div>
              </section>

              {/* Information We Collect */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Information We Collect
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-zinc-800 dark:text-zinc-200">Personal Information</h4>
                    <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-300 space-y-1">
                      <li>Account information (email address, username)</li>
                      <li>Profile information you choose to provide</li>
                      <li>Communication preferences and settings</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-zinc-800 dark:text-zinc-200">Daily Log Data</h4>
                    <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-300 space-y-1">
                      <li>Daily mood entries and personal reflections</li>
                      <li>Custom objectives and personal goals you set</li>
                      <li>Daily experiences and activities you record</li>
                      <li>AI-generated scores (0-100) based on your entries</li>
                      <li>Timestamps and frequency of app usage</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-zinc-800 dark:text-zinc-200">Technical Information</h4>
                    <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-300 space-y-1">
                      <li>Device information and operating system</li>
                      <li>Browser type and version</li>
                      <li>IP address and general location data</li>
                      <li>App performance and error logs</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Contact Us</h3>
                <p className="text-zinc-600 dark:text-zinc-300">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-3 border border-zinc-200/50 dark:border-zinc-700/50">
                  <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                    <div className="p-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-md">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="font-medium">msimon@acdc.digital</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                    <div className="p-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-md">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span>ACDC.digital, Halifax, Nova Scotia, Canada</span>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <section className="pt-6 border-t border-zinc-200/50 dark:border-zinc-700/50">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                  © 2025 ACDC.digital. All rights reserved. SoloPro is a trademark of ACDC.digital.
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog open={termsModalOpen} onOpenChange={setTermsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 border-0 shadow-2xl">
          <DialogHeader className="p-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Terms of Service
                </DialogTitle>
                <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Last updated: {lastUpdated} • Effective Date: {lastUpdated}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="px-6 pb-6 max-h-[65vh]">
            <div className="space-y-8 text-sm leading-relaxed">
              
              {/* Introduction */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Agreement to Terms
                </h3>
                <div className="space-y-3 text-zinc-600 dark:text-zinc-300">
                  <p>
                    Welcome to SoloPro, operated by ACDC.digital ("we," "our," or "us"). These Terms of Service 
                    ("Terms") govern your use of our mood tracking and AI-powered forecasting application and 
                    related services (collectively, the "Service").
                  </p>
                  <p>
                    By accessing or using SoloPro, you agree to be bound by these Terms. If you disagree with 
                    any part of these terms, then you may not access the Service.
                  </p>
                </div>
              </section>

              {/* Service Description */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Service Description
                </h3>
                <div className="space-y-3 text-zinc-600 dark:text-zinc-300">
                  <p>SoloPro is a personal well-being application that provides:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Daily mood and wellness tracking through customizable logs</li>
                    <li>AI-powered scoring system (0-100) via our "Solomon" algorithm</li>
                    <li>Visual heatmaps and analytics of your emotional patterns</li>
                    <li>Predictive insights and forecasting for personal well-being</li>
                    <li>Personalized goal setting and progress tracking</li>
                  </ul>
                </div>
              </section>

              {/* Contact Information */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Contact Us</h3>
                <p className="text-zinc-600 dark:text-zinc-300">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-3 border border-zinc-200/50 dark:border-zinc-700/50">
                  <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                    <div className="p-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-md">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="font-medium">msimon@acdc.digital</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                    <div className="p-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-md">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span>ACDC.digital, Halifax, Nova Scotia, Canada</span>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <section className="pt-6 border-t border-zinc-200/50 dark:border-zinc-700/50">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                  © 2025 ACDC.digital. All rights reserved. SoloPro is a trademark of ACDC.digital.
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Feedback Modal */}
      <FeedbackModal
        open={feedbackModalOpen}
        onOpenChange={setFeedbackModalOpen}
      />
    </>
  );
} 