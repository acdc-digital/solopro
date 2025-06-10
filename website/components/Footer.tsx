// FOOTER COMPONENT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/Footer.tsx

"use client";

import React from "react";
import { 
  Github, 
  Linkedin, 
  Mail,
  MapPin
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PrivacyPolicyModal } from "./privacyPolicy";
import { TermsOfServiceModal } from "./termsOfService";
import { NewsletterSignup } from "./NewsletterSignup";
import { FeedbackModal } from "./Feedback";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border">
      <div className="container mx-auto px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info - stays on far left */}
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/solologo.svg"
                    alt="Soloist Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <h3 className="text-2xl font-bold text-black">Soloist.</h3>
                </div>
                <p className="text-sm text-black leading-relaxed max-w-xs">
                Soloist is a for-profit, open-source wellness platform by ACDC.digital. Contributions are welcome—take what you need.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                <Link 
                  href="https://github.com/acdc-digital/solopro" 
                  className="group p-2.5 rounded-full bg-white border border-border text-black hover:text-black hover:border-foreground transition-all duration-200"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </Link>
                <Link 
                  href="https://linkedin.com/company/acdc-digital" 
                  className="group p-2.5 rounded-full bg-white border border-border text-black hover:text-black hover:border-foreground transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
                <Link 
                  href="mailto:msimon@acdc.digital" 
                  className="group p-2.5 rounded-full bg-white border border-border text-black hover:text-black hover:border-foreground transition-all duration-200"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Quick Links - middle left */}
            <div className="md:justify-self-center">
              <h4 className="font-semibold text-black mb-6 text-base">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#features" className="text-sm text-black hover:text-black transition-colors inline-flex items-center gap-1 group">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-black hover:text-black transition-colors inline-flex items-center gap-1 group">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#roadmap" className="text-sm text-black hover:text-black transition-colors inline-flex items-center gap-1 group">
                    Roadmap
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-sm text-black hover:text-black transition-colors inline-flex items-center gap-1 group">
                    FAQ
                  </Link>
                </li>
                <li>
                  <PrivacyPolicyModal>
                    <button className="text-sm text-black hover:text-black transition-colors text-left">
                      Privacy Policy
                    </button>
                  </PrivacyPolicyModal>
                </li>
                <li>
                  <TermsOfServiceModal>
                    <button className="text-sm text-black hover:text-black transition-colors text-left">
                      Terms of Service
                    </button>
                  </TermsOfServiceModal>
                </li>
              </ul>
            </div>

            {/* Feedback - middle right */}
            <div className="md:justify-self-center md:-ml-32">
              <h4 className="font-semibold text-black mb-6 text-base">Feedback</h4>
              <ul className="space-y-3">
                <li>
                  <FeedbackModal>
                    <button className="text-sm text-black hover:text-black transition-colors text-left">
                      Tell us what you think
                    </button>
                  </FeedbackModal>
                </li>
              </ul>
            </div>

            {/* Newsletter Signup - stays on far right */}
            <div>
              <h4 className="font-semibold text-black mb-6 text-base">Stay Updated</h4>
              <p className="text-sm text-black mb-6">
                Get notified about new features and updates.
              </p>
              <div className="mb-8">
                <NewsletterSignup 
                  source="footer"
                  placeholder="Enter your email"
                  buttonText="Subscribe"
                />
              </div>
              
              {/* Company Details */}
              <div className="pt-6 border-t border-border/30">
                <div className="space-y-2 text-sm text-black">
                  <p className="font-medium text-black">ACDC.digital</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <p>Halifax, Nova Scotia, Canada</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <a href="mailto:msimon@acdc.digital" className="hover:text-black transition-colors">
                      msimon@acdc.digital
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-black">
              © {currentYear} ACDC.digital. All rights reserved.
            </div>
            
            <div className="text-sm">
              <Link 
                href="https://github.com/acdc-digital/solopro" 
                className="text-black hover:text-black transition-colors inline-flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                Open Source Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
