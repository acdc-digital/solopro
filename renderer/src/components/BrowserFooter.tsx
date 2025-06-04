// BROWSER FOOTER
// /Users/matthewsimon/Documents/Github/solopro/renderer/src/components/BrowserFooter.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Github, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrivacyPolicyModal } from "./privacyPolicy";
import { TermsOfServiceModal } from "./termsOfService";
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
  const lastUpdated = "January 2025";

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <footer className="bg-stone-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-6 px-4">
        <div className="w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Branding */}
            <div className="flex items-center gap-3">
              <Image
                src="/solologo.svg"
                alt="Soloist Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Soloist.
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                © {currentYear}
              </span>
            </div>

            {/* Center: Quick Links */}
            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() => handleLinkClick("http://localhost:3004")}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1"
              >
                Main Website
                <ExternalLink className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleLinkClick("http://localhost:3004/#pricing")}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Pricing
              </button>
              
              {/* Privacy Policy Modal */}
              <button 
                onClick={() => setPrivacyModalOpen(true)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              
              {/* Terms of Service Modal */}
              <button 
                onClick={() => setTermsModalOpen(true)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              
              <button
                onClick={() => handleLinkClick("https://github.com/acdc-digital/solopro")}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                GitHub
              </button>
            </div>

            {/* Right: Download App */}
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLinkClick("http://localhost:3004")}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Desktop App
              </Button>
            </div>
          </div>

          {/* Mobile: Stacked layout adjustments */}
          <div className="md:hidden mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              Simple mood tracking and AI-powered insights for better emotional well-being.
            </p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <Dialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground">
              Last updated: {lastUpdated} • Effective Date: {lastUpdated}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="px-6 pb-6 max-h-[60vh]">
            <div className="space-y-6 text-sm leading-relaxed">
              
              {/* Introduction */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Introduction</h3>
                <p className="text-muted-foreground mb-4">
                  Welcome to SoloPro ("we," "our," or "us"). This Privacy Policy explains how ACDC.digital 
                  collects, uses, discloses, and safeguards your information when you use our mood tracking 
                  and AI-powered forecasting application and related services.
                </p>
                <p className="text-muted-foreground">
                  SoloPro is designed to help you track your daily well-being through personalized logs, 
                  AI-powered scoring (0-100), and visual heatmaps. We are committed to protecting your 
                  privacy and ensuring the security of your personal and emotional data.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Information We Collect</h3>
                
                <h4 className="font-medium mb-2 text-foreground">Personal Information</h4>
                <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
                  <li>Account information (email address, username)</li>
                  <li>Profile information you choose to provide</li>
                  <li>Communication preferences and settings</li>
                </ul>

                <h4 className="font-medium mb-2 text-foreground">Daily Log Data</h4>
                <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
                  <li>Daily mood entries and personal reflections</li>
                  <li>Custom objectives and personal goals you set</li>
                  <li>Daily experiences and activities you record</li>
                  <li>AI-generated scores (0-100) based on your entries</li>
                  <li>Timestamps and frequency of app usage</li>
                </ul>

                <h4 className="font-medium mb-2 text-foreground">Technical Information</h4>
                <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
                  <li>Device information and operating system</li>
                  <li>Browser type and version</li>
                  <li>IP address and general location data</li>
                  <li>App performance and error logs</li>
                </ul>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Contact Us</h3>
                <p className="text-muted-foreground mb-3">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>Email: msimon@acdc.digital</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>ACDC.digital, Halifax, Nova Scotia, Canada</span>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <section className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  © 2025 ACDC.digital. All rights reserved. SoloPro is a trademark of ACDC.digital.
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog open={termsModalOpen} onOpenChange={setTermsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <DialogTitle className="text-2xl font-bold">Terms of Service</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground">
              Last updated: {lastUpdated} • Effective Date: {lastUpdated}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="px-6 pb-6 max-h-[60vh]">
            <div className="space-y-6 text-sm leading-relaxed">
              
              {/* Introduction */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Agreement to Terms</h3>
                <p className="text-muted-foreground mb-4">
                  Welcome to SoloPro, operated by ACDC.digital ("we," "our," or "us"). These Terms of Service 
                  ("Terms") govern your use of our mood tracking and AI-powered forecasting application and 
                  related services (collectively, the "Service").
                </p>
                <p className="text-muted-foreground">
                  By accessing or using SoloPro, you agree to be bound by these Terms. If you disagree with 
                  any part of these terms, then you may not access the Service.
                </p>
              </section>

              {/* Service Description */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Service Description</h3>
                <p className="text-muted-foreground mb-3">
                  SoloPro is a personal well-being application that provides:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Daily mood and wellness tracking through customizable logs</li>
                  <li>AI-powered scoring system (0-100) via our "Solomon" algorithm</li>
                  <li>Visual heatmaps and analytics of your emotional patterns</li>
                  <li>Predictive insights and forecasting for personal well-being</li>
                  <li>Personalized goal setting and progress tracking</li>
                </ul>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Contact Us</h3>
                <p className="text-muted-foreground mb-3">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>Email: msimon@acdc.digital</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>ACDC.digital, Halifax, Nova Scotia, Canada</span>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <section className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  © 2025 ACDC.digital. All rights reserved. SoloPro is a trademark of ACDC.digital.
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
} 