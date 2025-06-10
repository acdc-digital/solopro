// ROADMAP COMPONENT
// /Users/matthewsimon/Documents/Github/solopro/website/components/Roadmap.tsx

"use client";

import React, { useState } from "react";
import { MapPin, CheckCircle2, Circle, Brain, Smartphone, Globe, Zap, LineChart, Users } from "lucide-react";

type RoadmapPhase = "shipped" | "in-progress" | "planned";

type RoadmapItem = {
  title: string;
  description: string;
  phase: RoadmapPhase;
  quarter: string;
  features: string[];
  icon: React.ElementType;
};

export function Roadmap() {
  const [activePhase, setActivePhase] = useState<RoadmapPhase>("planned");

  const roadmapData: RoadmapItem[] = [
    {
      title: "Core Foundation",
      description: "Essential mood tracking with AI insights",
      phase: "shipped",
      quarter: "Q4 2024",
      icon: Zap,
      features: [
        "Daily mood logging",
        "Interactive heatmap",
        "AI scoring (0-100)",
        "Desktop app"
      ]
    },
    {
      title: "Predictive Intelligence",
      description: "Solomon AI learns and forecasts patterns",
      phase: "shipped",
      quarter: "Q1 2025",
      icon: Brain,
      features: [
        "Mood forecasting",
        "Weekly insights",
        "Trigger identification",
        "Data export"
      ]
    },
    {
      title: "Advanced Analytics",
      description: "Deeper insights and custom metrics",
      phase: "in-progress",
      quarter: "Q2 2025",
      icon: LineChart,
      features: [
        "Multi-factor analysis",
        "Custom metrics",
        "Yearly trends",
        "Advanced filters"
      ]
    },
    {
      title: "Mobile Experience",
      description: "Native iOS and Android apps",
      phase: "planned",
      quarter: "Q3 2025",
      icon: Smartphone,
      features: [
        "Native apps",
        "Offline mode",
        "Push notifications",
        "Widget support"
      ]
    },
    {
      title: "Social & Collaboration",
      description: "Share with trusted circles",
      phase: "planned",
      quarter: "Q4 2025",
      icon: Users,
      features: [
        "Therapist sharing",
        "Family tracking",
        "Community insights",
        "Accountability"
      ]
    },
    {
      title: "Enterprise & API",
      description: "Integrate into wellness ecosystems",
      phase: "planned",
      quarter: "Q1 2026",
      icon: Globe,
      features: [
        "Public API",
        "Team plans",
        "HIPAA compliance",
        "White-label"
      ]
    }
  ];

  const phaseConfig = {
    shipped: {
      label: "Shipped",
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
      icon: CheckCircle2
    },
    "in-progress": {
      label: "In Progress",
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: Circle
    },
    planned: {
      label: "Planned",
      color: "text-gray-700",
      bg: "bg-gray-50",
      border: "border-gray-200",
      icon: Circle
    }
  };

  const filteredItems = roadmapData.filter(item => item.phase === activePhase);

  return (
    <section id="roadmap" className="py-12 md:py-18">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-black mb-4 border border-black">
            <MapPin className="h-3 w-3" />
            Product Roadmap
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Where we're headed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Building the future of mood intelligence, one feature at a time.
          </p>
        </div>

        {/* Phase Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(["planned", "in-progress", "shipped"] as const).map((phase) => {
            const config = phaseConfig[phase];
            const Icon = config.icon;
            return (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activePhase === phase
                    ? "bg-white border border-black text-black"
                    : "bg-card text-card-foreground border border-border hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-3 w-3" />
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Compact Timeline Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {filteredItems.map((item, index) => {
              const config = phaseConfig[item.phase];
              const Icon = item.icon;
              const StatusIcon = config.icon;

              return (
                <div
                  key={index}
                  className="bg-card rounded-lg border border-border p-4 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${config.bg} ${config.border} border flex-shrink-0`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-card-foreground">
                          {item.title}
                        </h3>
                        <div className={`inline-flex items-center gap-1 text-xs ${config.color} flex-shrink-0`}>
                          <StatusIcon className="h-3 w-3" />
                          <span className="hidden sm:inline">{item.quarter}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>

                      {/* Compact Features */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.features.map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${
                              item.phase === "shipped" 
                                ? "bg-green-100 text-green-700" 
                                : item.phase === "in-progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

