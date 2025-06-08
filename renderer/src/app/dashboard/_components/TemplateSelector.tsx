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
import { ChevronDown, Settings2, X } from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import { Template } from "./Templates";

interface TemplateSelectorProps {
  userId?: string;
  onCustomize: () => void;
  showTemplates?: boolean;
}

export default function TemplateSelector({ userId, onCustomize, showTemplates }: TemplateSelectorProps) {
  const {
    templates,
    activeTemplate,
    setActiveTemplate,
    isLoading,
  } = useTemplates({ userId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading templates...</span>
      </div>
    );
  }

  const handleTemplateChange = async (templateId: string) => {
    try {
      await setActiveTemplate(templateId as any);
    } catch (error) {
      console.error("Failed to set active template:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-start gap-2">
        {/* Template Selector - takes available space */}
        <div className="flex-1 min-w-[180px]">
          <Select
            value={activeTemplate?.id || ""}
            onValueChange={handleTemplateChange}
          >
            <SelectTrigger className="h-8 w-full text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select Template">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 flex-shrink-0">Template:</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate">
                    {activeTemplate?.name || "Default"}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {templates.length === 0 ? (
                <SelectItem value="default" disabled>
                  Default Template
                </SelectItem>
              ) : (
                templates.map((template: Template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Customize Button - fixed width, wraps to new line when needed */}
        <Button
          variant="outline"
          size="sm"
          onClick={onCustomize}
          className="h-8 px-3 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-0 focus:ring-offset-0 flex-shrink-0"
        >
          {showTemplates ? (
            <X className="h-4 w-4 mr-2" />
          ) : (
            <Settings2 className="h-4 w-4 mr-2" />
          )}
          Customize
        </Button>
      </div>
    </div>
  );
} 