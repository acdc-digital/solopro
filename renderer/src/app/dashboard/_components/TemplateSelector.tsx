// TEMPLATE SELECTOR COMPONENT
// Shows dropdown of available templates and allows switching between them

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Plus } from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import { Template } from "./Templates";

interface TemplateSelectorProps {
  userId?: string;
  selectedDate?: Date | null;
  onCreateNew?: () => void;
}

export default function TemplateSelector({ userId, selectedDate, onCreateNew }: TemplateSelectorProps) {
  const {
    templates,
    activeTemplate,
    setActiveTemplate,
    isLoading,
  } = useTemplates({ 
    userId, 
    selectedDate: selectedDate ? selectedDate.toISOString().split('T')[0] : undefined 
  });

  // Deduplicate templates by name, keeping the most recent one
  const uniqueTemplates = templates.reduce((acc: Template[], current: Template) => {
    const existingIndex = acc.findIndex(t => t.name === current.name);
    if (existingIndex === -1) {
      // Template name doesn't exist, add it
      acc.push(current);
    } else {
      // Template name exists, keep the more recent one
      const existing = acc[existingIndex];
      if (new Date(current.updatedAt) > new Date(existing.updatedAt)) {
        acc[existingIndex] = current;
      }
    }
    return acc;
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading templates...</span>
      </div>
    );
  }

  const handleTemplateChange = async (value: string) => {
    if (value === "create-new") {
      // Handle creating a new template
      onCreateNew?.();
      return;
    }

    try {
      await setActiveTemplate(value as any);
    } catch (error) {
      console.error("Failed to set active template:", error);
    }
  };

  return (
    <div className="w-full">
      {/* Template Selector - full width */}
      <Select
        value={activeTemplate?.id || ""}
        onValueChange={handleTemplateChange}
      >
        <SelectTrigger className="h-8 w-full text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Select Template">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 flex-shrink-0">Template:</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate">
                {activeTemplate?.name || "Default Template"}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {/* Existing Templates */}
          {uniqueTemplates.map((template: Template) => (
            <SelectItem key={template.id} value={template.id}>
              <div className="flex items-center gap-2">
                <span>{template.name}</span>
                {template.name === "Default Template" && (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">(Default)</span>
                )}
              </div>
            </SelectItem>
          ))}

          {/* Separator */}
          {uniqueTemplates.length > 0 && (
            <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />
          )}

          {/* Create New Template Option */}
          <SelectItem value="create-new" className="text-emerald-600 dark:text-emerald-400 font-medium">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create New Template</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 