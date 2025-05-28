// FOOTER COMPONENT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/Footer.tsx

"use client";

import React from "react";
import { 
  Github, 
  Twitter, 
  Mail
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PrivacyPolicyModal } from "./privacyPolicy";
import { TermsOfServiceModal } from "./termsOfService";
import { NewsletterSignup } from "./NewsletterSignup";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground mb-2">Soloist.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Simple mood tracking and insights for better emotional well-being.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <Link 
                href="https://github.com/solopro" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="https://twitter.com/solopro" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <PrivacyPolicyModal>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                    Privacy Policy
                  </button>
                </PrivacyPolicyModal>
              </li>
              <li>
                <TermsOfServiceModal>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                    Terms of Service
                  </button>
                </TermsOfServiceModal>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get notified about new features and updates.
            </p>
            <div className="mb-6">
              <NewsletterSignup 
                source="footer"
                placeholder="Enter your email"
                buttonText="Subscribe"
              />
            </div>
            
            {/* Company Details */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="/solologo.svg"
                  alt="ACDC.digital Logo"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="text-sm font-semibold text-foreground">ACDC.digital</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Halifax, Nova Scotia, Canada</p>
                <p>msimon@acdc.digital</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
              <p>© {currentYear} ACDC.digital All rights reserved.</p>
              <Link 
                href="mailto:msimon@acdc.digital"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                msimon@acdc.digital
              </Link>
            </div>
            
            <div className="text-sm">
              <Link 
                href="https://github.com/acdc-digital/solopro" 
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Github className="h-3 w-3" />
                Open Source
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
