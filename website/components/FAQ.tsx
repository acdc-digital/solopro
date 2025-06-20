// FAQ COMPONENT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/FAQ.tsx

"use client";

import React, { useState } from "react";
import { ChevronRight, MessageCircle, Sparkles, Shield, Clock, Zap } from "lucide-react";
import { PrivacyPolicyModal } from "./privacyPolicy";
import { ExportDataModal } from "./ExportDataModal";
import { DocsModal } from "./Docs";

type AccordionItemProps = {
  question: string;
  children: React.ReactNode;
  category?: string;
  featured?: boolean;
};

// Enhanced Accordion component with shadcn styling
const AccordionItem = ({ question, children, featured = false }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card rounded-lg border border-border p-1 mb-4 transition-all duration-200 hover:shadow-md">
      <button
        className="flex justify-between items-center w-full text-left px-6 py-4 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium transition-colors text-card-foreground group-hover:text-primary">
          {question}
        </span>
        <ChevronRight
          className={`w-5 h-5 transition-all duration-200 flex-shrink-0 ml-4 text-muted-foreground group-hover:text-primary ${
            isOpen ? "rotate-90" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

// FAQ categories with icons
const categories = [
  { id: 'getting-started', name: 'Getting Started', icon: Zap },
  { id: 'privacy', name: 'Privacy & Security', icon: Shield },
  { id: 'features', name: 'Features & Pricing', icon: Sparkles },
  { id: 'support', name: 'Support', icon: MessageCircle }
];

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");

  // Enhanced FAQ data with shadcn styling
  const faqData = [
    {
      question: "How accurate are the mood forecasts?",
      category: "features",
      featured: true,
      answer: (
        <div className="space-y-3">
          <p>Our data-driven forecasting achieves <strong>85-92% accuracy</strong> after just 7 days of consistent logging. The more you use Soloist, the more personalized and accurate your predictions become.</p>
          <div className="bg-muted p-4 rounded-lg border border-border">
            <p className="text-card-foreground text-sm">💡 <strong>Pro tip:</strong> Users who log daily for their first week see the most dramatic improvements in forecast accuracy. After 4 consecutive days, our system can identify strong patterns that suggest likely future moods and behaviours.</p>
          </div>
        </div>
      )
    },
    {
      question: "Is my personal data safe and private?",
      category: "privacy",
      featured: true,
      answer: (
        <div className="space-y-3">
          <p><strong>Absolutely.</strong> Your emotional data is encrypted end-to-end and never shared or sold. We use Convex DB, a trusted database solution with enterprise-grade security.</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>256-bit encryption for all data</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>SOC 2 Type 1 Compliant</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>HIPAA Compliant</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>GDPR Verified</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>You own your data - export or delete anytime</span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Read our full{" "}
            <PrivacyPolicyModal>
              <button className="text-primary hover:underline font-medium">
                Privacy Policy
              </button>
            </PrivacyPolicyModal>
          </p>
        </div>
      )
    },
    {
      question: "Can I try it free before subscribing?",
      category: "getting-started",
      featured: true,
      answer: (
        <div className="space-y-3">
          <p><strong>Yes!</strong> Start with our completely free plan - no credit card required. Track your mood weekly and see the patterns emerge. Auto-Generate logs based on your personality details. Get feedback on your Day and tips for the future.</p>
          <div className="bg-muted p-4 rounded-lg border border-border">
            <p className="text-card-foreground text-sm"><strong>Free forever includes:</strong> Daily mood tracking, basic heatmap view, and 7-day trends.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
            onClick={() => window.location.href = 'https://app.acdc.digital/'}
          >
            Start free tracking
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )
    },
    {
      question: "How long before I see meaningful insights?",
      category: "getting-started",
      answer: (
        <div className="space-y-3">
          <p>You'll start seeing patterns within <strong>3-5 days</strong>, but the real magic happens after 2 weeks of consistent logging.</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <span><strong>Day 1:</strong> Begin building your emotional baseline</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <span><strong>Day 2:</strong> See your first weekly patterns and triggers</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <span><strong>Day 4:</strong> Begin generating forecasts based on your daily history</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <span><strong>Month 1:</strong> Discover deeper emotional rhythms and key insights about yourself</span>
            </div>
          </div>
        </div>
      )
    },
    {
      question: "What makes Soloist different from other mood trackers?",
      category: "features",
      answer: (
        <div className="space-y-3">
          <p>Unlike basic mood trackers, Soloist uses <strong>advanced pattern analysis</strong> to forecast your emotional patterns and provides actionable insights.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-muted p-3 rounded-lg border border-border">
              <p className="font-medium text-card-foreground">❌ Other apps</p>
              <p className="text-muted-foreground">Basic logging and simple charts</p>
            </div>
            <div className="bg-card p-3 rounded-lg border border-primary/20">
              <p className="font-medium text-card-foreground">✅ Soloist</p>
              <p className="text-primary">Data enabled forecasting & pattern recognition</p>
            </div>
          </div>
          <p className="text-sm">Plus: Beautiful visualizations, desktop app, and deep weekly insights that actually help you plan for better days.</p>
        </div>
      )
    },
    {
      question: "Does it work on mobile devices?",
      category: "getting-started",
      answer: (
        <div className="space-y-3">
          <p><strong>No, Soloist is designed for desktop use only.</strong> We don't support mobile devices as the app requires a full desktop experience for optimal mood tracking and analysis.</p>
          <div className="bg-muted p-4 rounded-lg border border-border">
            <p className="text-card-foreground text-sm">💻 <strong>Desktop Options:</strong> Download our native desktop app for the best experience, or use the web browser version on your computer.</p>
          </div>
          <p className="text-sm">The desktop-focused design allows for better data visualization, detailed insights, and a more comprehensive mood tracking experience. A mobile app is currently in development with no date for release at this time.</p>
        </div>
      )
    },
    {
      question: "What if I forget to log some days?",
      category: "getting-started",
      answer: (
        <div className="space-y-3">
          <p>No problem! <strong>Key insights and patterns</strong> will still be generated based on whatever information you have available.</p>
          <div className="bg-muted p-4 rounded-lg border border-border">
            <p className="text-card-foreground text-sm">📊 <strong>Forecast Requirements:</strong> You need 4 consecutive days logged to generate mood forecasts. Without this, you'll still get valuable insights and pattern analysis but without future predictions.</p>
          </div>
          <p>If you forget to log some days, you can quickly catch up using the <strong>'Generate' feature</strong> which fills in the blanks based on your history and personal information from your settings.</p>
          <p className="text-sm text-muted-foreground">💡 The Generate feature uses your past patterns and profile details to create realistic entries for missed days or quickly generate a log for the current day.</p>
        </div>
      )
    },
    {
      question: "Can I export my data?",
      category: "privacy",
      answer: (
        <div className="space-y-3">
          <p><strong>Yes, absolutely.</strong> Your data belongs to you. Export now in JSON, with .CSV and PDF report capabilities coming soon. If you need a specific format now, simply reach out to support.</p>
          <p>This is perfect for sharing insights with therapists, coaches, or just keeping your own records.</p>
          <ExportDataModal>
            <button className="text-primary font-medium hover:text-primary/80 transition-colors text-sm">
              Export Your Data →
            </button>
          </ExportDataModal>
        </div>
      )
    },
    {
      question: "How do I get help if I'm stuck?",
      category: "support",
      answer: (
        <div className="space-y-3">
          <p>We're here to help! Contact us through:</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span>Email support (response within 24 hours)</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span>
                <a 
                  href="https://acdcdigital.slack.com/archives/C0919GRUWB0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 hover:underline font-medium"
                >
                  Community forum for tips and tricks
                </a>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span>
                <DocsModal>
                  <button className="text-primary hover:text-primary/80 hover:underline font-medium">
                    Comprehensive help documentation
                  </button>
                </DocsModal>
              </span>
            </div>
          </div>
          <a 
            href="mailto:msimon@acdc.digital" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            Contact support
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      )
    }
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Separate featured and regular FAQs
  const featuredFAQs = filteredFAQs.filter(faq => faq.featured);
  const regularFAQs = filteredFAQs.filter(faq => !faq.featured);

  return (
    <section id="faq" className="py-10 md:py-18 mt-4">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-black mb-4 border border-black">
            <MessageCircle className="h-3 w-3" />
            Questions & Answers
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to know
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get answers to common questions about mood tracking, privacy, and getting the most from Soloist.
          </p>
        </div>

        {/* Search Bar */}
        {/* <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>
        </div> */}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-white border border-black text-black"
                    : "bg-card text-card-foreground border border-border hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Featured Questions */}
          {featuredFAQs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Most Asked Questions
              </h3>
              <div className="space-y-4">
                {featuredFAQs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    question={faq.question}
                    featured={true}
                  >
                    {faq.answer}
                  </AccordionItem>
                ))}
              </div>
            </div>
          )}

          {/* Regular Questions */}
          {regularFAQs.length > 0 && (
            <div className="space-y-3">
              {regularFAQs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  question={faq.question}
                >
                  {faq.answer}
                </AccordionItem>
              ))}
            </div>
          )}

          {/* No results */}
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-6">Try browsing a different category.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("getting-started");
                }}
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Back to Getting Started →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 