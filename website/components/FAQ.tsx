// FAQ COMPONENT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/FAQ.tsx

"use client";

import React, { useState } from "react";
import { ChevronRight, Search, MessageCircle, Sparkles, Shield, Clock, Zap } from "lucide-react";

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
  const [activeCategory, setActiveCategory] = useState("all");

  // Enhanced FAQ data with shadcn styling
  const faqData = [
    {
      question: "How accurate are the mood forecasts?",
      category: "features",
      featured: true,
      answer: (
        <div className="space-y-3">
          <p>Our AI-powered forecasting achieves <strong>85-92% accuracy</strong> after just 7 days of consistent logging. The more you use SoloPro, the more personalized and accurate your predictions become.</p>
          <div className="bg-muted p-4 rounded-lg border border-border">
            <p className="text-card-foreground text-sm">💡 <strong>Pro tip:</strong> Users who log daily for their first week see the most dramatic improvements in forecast accuracy.</p>
          </div>
          <button className="text-primary font-medium hover:text-primary/80 transition-colors">
            Start your 7-day accuracy challenge →
          </button>
        </div>
      )
    },
    {
      question: "Is my personal data safe and private?",
      category: "privacy",
      featured: true,
      answer: (
        <div className="space-y-3">
          <p><strong>Absolutely.</strong> Your emotional data is encrypted end-to-end and never shared or sold. We're GDPR compliant and store data on secure, audited servers.</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>256-bit encryption for all data</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>GDPR & CCPA compliant</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>You own your data - export or delete anytime</span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">Read our full <a href="#" className="text-primary hover:underline">Privacy Policy</a></p>
        </div>
      )
    },
    {
      question: "Can I try it free before subscribing?",
      category: "getting-started",
      featured: true,
      answer: (
        <div className="space-y-3">
          <p><strong>Yes!</strong> Start with our completely free plan - no credit card required. Track your mood for 30 days and see the patterns emerge.</p>
          <div className="bg-muted p-4 rounded-lg border border-border">
            <p className="text-card-foreground text-sm"><strong>Free forever includes:</strong> Daily mood tracking, basic heatmap view, and 7-day trends.</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
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
              <span><strong>Week 1:</strong> See your first weekly patterns and triggers</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <span><strong>Week 2:</strong> Get your first mood forecasts</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <span><strong>Month 1:</strong> Discover deeper emotional rhythms</span>
            </div>
          </div>
        </div>
      )
    },
    {
      question: "What makes SoloPro different from other mood trackers?",
      category: "features",
      answer: (
        <div className="space-y-3">
          <p>Unlike basic mood trackers, SoloPro uses <strong>predictive AI</strong> to forecast your emotional patterns and provides actionable insights.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-muted p-3 rounded-lg border border-border">
              <p className="font-medium text-card-foreground">❌ Other apps</p>
              <p className="text-muted-foreground">Basic logging and simple charts</p>
            </div>
            <div className="bg-card p-3 rounded-lg border border-primary/20">
              <p className="font-medium text-card-foreground">✅ SoloPro</p>
              <p className="text-primary">AI forecasting + pattern recognition</p>
            </div>
          </div>
          <p className="text-sm">Plus: Beautiful visualizations, desktop app, and deep weekly insights that actually help you plan better days.</p>
        </div>
      )
    },
    {
      question: "Does it work on mobile devices?",
      category: "getting-started",
      answer: (
        <div className="space-y-3">
          <p><strong>Currently desktop-focused</strong> for the best experience, but our responsive web app works great on tablets and mobile browsers.</p>
          <div className="bg-muted p-4 rounded-lg border border-border">
            <p className="text-card-foreground text-sm">📱 <strong>Mobile app coming 2025:</strong> Native iOS & Android apps are in development with offline sync!</p>
          </div>
          <p className="text-sm">For now, bookmark our web app on your phone's home screen for quick access.</p>
        </div>
      )
    },
    {
      question: "What if I forget to log some days?",
      category: "getting-started",
      answer: (
        <div className="space-y-3">
          <p>No worries! SoloPro works with <strong>imperfect data</strong>. Even logging 4-5 days per week provides valuable insights.</p>
          <p>We'll send gentle reminders (if you want them) and our AI can interpolate missing days to maintain your forecast accuracy.</p>
          <p className="text-sm text-muted-foreground">💡 Most successful users set a daily phone reminder for their preferred logging time.</p>
        </div>
      )
    },
    {
      question: "Can I export my data?",
      category: "privacy",
      answer: (
        <div className="space-y-3">
          <p><strong>Yes, absolutely.</strong> Your data belongs to you. Export everything as CSV, JSON, or PDF reports anytime.</p>
          <p>This is perfect for sharing insights with therapists, coaches, or just keeping your own records.</p>
          <button className="text-primary font-medium hover:text-primary/80 transition-colors text-sm">
            Learn about data exports →
          </button>
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
              <span>Community forum for tips and tricks</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span>Comprehensive help documentation</span>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors text-sm">
            Contact support
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Separate featured and regular FAQs
  const featuredFAQs = filteredFAQs.filter(faq => faq.featured);
  const regularFAQs = filteredFAQs.filter(faq => !faq.featured);

  return (
    <section id="faq" className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-sm font-medium text-white mb-4">
            <MessageCircle className="h-3 w-3" />
            Questions & Answers
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to know
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get answers to common questions about mood tracking, privacy, and getting the most from SoloPro.
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
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground border border-border hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            All Questions
          </button>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
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
              <p className="text-muted-foreground mb-6">Try adjusting your search or browse by category.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("all");
                }}
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Show all questions →
              </button>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
            <h3 className="text-xl font-bold text-card-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our team is here to help you get started.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
                <MessageCircle className="h-4 w-4" />
                Contact Support
              </button>
              <button className="inline-flex items-center gap-2 bg-card text-card-foreground px-6 py-3 rounded-md font-medium border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                Join Community
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 