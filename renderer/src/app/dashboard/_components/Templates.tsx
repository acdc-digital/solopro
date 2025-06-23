// TEMPLATES COMPONENT
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/dashboard/_components/Templates.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Save,
  Trash2,
  Edit3,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types for template fields
export type FieldType = "slider" | "number" | "checkbox" | "textarea" | "text";

export interface TemplateField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
  required?: boolean;
  category?: string;
}

export interface Template {
  id: string;
  name: string;
  fields: TemplateField[];
  createdAt: string;
  updatedAt: string;
}

interface TemplatesProps {
  onClose: () => void;
  onSaveTemplate?: (template: Template) => void;
  currentTemplate?: Template;
  templates?: Template[];
}

const defaultFields: TemplateField[] = [
  // Rating fields
  {
    id: "overallMood",
    type: "slider",
    label: "Overall Mood",
    min: 1,
    max: 10,
    defaultValue: 5,
    category: "Daily Ratings",
    required: true,
  },
  {
    id: "workSatisfaction",
    type: "slider",
    label: "Work Satisfaction",
    min: 1,
    max: 10,
    defaultValue: 5,
    category: "Daily Ratings",
    required: true,
  },
  {
    id: "personalLifeSatisfaction",
    type: "slider",
    label: "Personal Life",
    min: 1,
    max: 10,
    defaultValue: 5,
    category: "Daily Ratings",
    required: true,
  },
  {
    id: "balanceRating",
    type: "slider",
    label: "Work-Life Balance",
    min: 1,
    max: 10,
    defaultValue: 5,
    category: "Daily Ratings",
    required: true,
  },
  // Wellness fields
  {
    id: "sleep",
    type: "number",
    label: "Hours of sleep",
    min: 0,
    max: 24,
    step: 0.5,
    defaultValue: 7,
    category: "Basic Wellness",
    required: true,
  },
  {
    id: "exercise",
    type: "checkbox",
    label: "Exercise today?",
    defaultValue: false,
    category: "Basic Wellness",
  },
  // Reflection fields
  {
    id: "highlights",
    type: "textarea",
    label: "Today's highlight",
    placeholder: "What was the best part of your day?",
    category: "Quick Reflections",
  },
  {
    id: "challenges",
    type: "textarea",
    label: "Today's challenge",
    placeholder: "What was challenging?",
    category: "Quick Reflections",
  },
  {
    id: "tomorrowGoal",
    type: "textarea",
    label: "Tomorrow's focus",
    placeholder: "What's your main focus for tomorrow?",
    category: "Quick Reflections",
  },
];

const fieldTypeOptions = [
  { value: "slider", label: "Rating Slider (1-10)" },
  { value: "number", label: "Number Input" },
  { value: "checkbox", label: "Yes/No Checkbox" },
  { value: "textarea", label: "Text Area" },
  { value: "text", label: "Short Text" },
];

export default function Templates({ onClose, onSaveTemplate, currentTemplate, templates }: TemplatesProps) {
  // Check if this is a new template creation (no currentTemplate provided)
  const isCreatingNew = !currentTemplate;

  const [fields, setFields] = useState<TemplateField[]>(
    currentTemplate?.fields || [] // Empty array for new templates, existing fields for editing
  );
  const [templateName, setTemplateName] = useState(
    currentTemplate?.name || "" // Empty string for new templates, existing name for editing
  );
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});

  // Initialize category names from fields
  useEffect(() => {
    const names: Record<string, string> = {};
    fields.forEach(field => {
      if (field.category && !names[field.category]) {
        names[field.category] = field.category;
      }
    });
    setCategoryNames(names);
  }, [fields]);

  // Group fields by category
  const groupedFields = fields.reduce((acc, field) => {
    const category = field.category || "Custom Fields";
    if (!acc[category]) acc[category] = [];
    acc[category].push(field);
    return acc;
  }, {} as Record<string, TemplateField[]>);

  const handleUpdateField = (id: string, updates: Partial<TemplateField>) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, ...updates } : field))
    );
  };

  const handleAddField = (category: string) => {
    const newField: TemplateField = {
      id: `field_${Date.now()}`,
      type: "text",
      label: "",
      placeholder: "",
      category,
      required: false,
    };
    setFields([...fields, newField]);
  };

  const handleRemoveField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleCategoryNameChange = (oldName: string, newName: string) => {
    // Update category names state
    setCategoryNames(prev => ({
      ...prev,
      [oldName]: newName
    }));

    // Update all fields with this category
    setFields(prev => prev.map(field =>
      field.category === oldName
        ? { ...field, category: newName }
        : field
    ));
  };

  const handleSave = () => {
    // Validation for new templates
    if (!templateName.trim()) {
      alert("Please enter a template name before saving.");
      return;
    }

    if (fields.length === 0) {
      alert("Please add at least one field to your template before saving.");
      return;
    }

    // Check if this is a new template name or updating existing
    const existingTemplateWithSameName = templates?.find(t => t.name === templateName && t.id !== currentTemplate?.id);
    const isNewTemplate = !currentTemplate || currentTemplate.name !== templateName;

    const templateToSave: Template = {
      id: isNewTemplate ? `template_${Date.now()}` : (currentTemplate?.id || `template_${Date.now()}`),
      name: templateName,
      fields,
      createdAt: currentTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Don't allow duplicate names for different templates
    if (existingTemplateWithSameName) {
      alert(`A template named "${templateName}" already exists. Please choose a different name.`);
      return;
    }

    onSaveTemplate?.(templateToSave);
    onClose();
  };

  // Simple Switch component using checkbox styling
  const Switch = ({ checked, onCheckedChange, id }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    id?: string;
  }) => (
    <div className="relative inline-flex h-4 w-7 items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="peer sr-only"
        aria-label="Toggle switch"
      />
      <label
        htmlFor={id}
        className={cn(
          "block h-4 w-7 rounded-full border transition-colors cursor-pointer",
          checked
            ? "bg-emerald-600 border-emerald-600"
            : "bg-zinc-200 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600"
        )}
      >
        <span
          className={cn(
            "block h-3 w-3 rounded-full bg-white transition-transform mt-0.5 ml-0.5",
            checked ? "translate-x-3" : "translate-x-0"
          )}
        />
      </label>
    </div>
  );

  const FieldRow = ({ field }: { field: TemplateField }) => {
    return (
      <Card className="border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* Field Label and Type Row */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  value={field.label}
                  onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                  placeholder="Enter question label"
                  className="text-sm border-0 shadow-none p-0 h-auto bg-transparent focus-visible:ring-0"
                />
              </div>
              <div className="w-40">
                <Select
                  value={field.type}
                  onValueChange={(value: FieldType) =>
                    handleUpdateField(field.id, { type: value })
                  }
                >
                  <SelectTrigger className="h-7 text-xs border-zinc-300 dark:border-zinc-600 focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={field.required || false}
                  onCheckedChange={(checked) =>
                    handleUpdateField(field.id, { required: checked })
                  }
                  id={`required-${field.id}`}
                />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Required</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveField(field.id)}
                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {/* Additional Controls Row */}
            <div className="flex items-center gap-3 text-xs">
              {(field.type === "textarea" || field.type === "text") && (
                <div className="flex-1">
                  <Input
                    value={field.placeholder || ""}
                    onChange={(e) =>
                      handleUpdateField(field.id, { placeholder: e.target.value })
                    }
                    placeholder="Placeholder text (optional)"
                    className="h-7 text-xs border-zinc-300 dark:border-zinc-600 focus:ring-0"
                  />
                </div>
              )}

              {(field.type === "slider" || field.type === "number") && (
                <div className="flex gap-2">
                  <div className="w-16">
                    <Input
                      type="number"
                      value={field.min || 0}
                      onChange={(e) =>
                        handleUpdateField(field.id, { min: Number(e.target.value) })
                      }
                      placeholder="Min"
                      className="h-7 text-xs border-zinc-300 dark:border-zinc-600 focus:ring-0"
                    />
                  </div>
                  <div className="w-16">
                    <Input
                      type="number"
                      value={field.max || 10}
                      onChange={(e) =>
                        handleUpdateField(field.id, { max: Number(e.target.value) })
                      }
                      placeholder="Max"
                      className="h-7 text-xs border-zinc-300 dark:border-zinc-600 focus:ring-0"
                    />
                  </div>
                  {field.type === "number" && (
                    <div className="w-16">
                      <Input
                        type="number"
                        value={field.step || 1}
                        onChange={(e) =>
                          handleUpdateField(field.id, { step: Number(e.target.value) })
                        }
                        placeholder="Step"
                        className="h-7 text-xs border-zinc-300 dark:border-zinc-600 focus:ring-0"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2">
          <Label htmlFor="template-name" className="text-sm font-medium">
            Template Name
          </Label>
          <Input
            id="template-name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder={isCreatingNew ? "Template name here..." : "Enter template name"}
            className={cn(
              "text-sm focus:ring-0",
              isCreatingNew && !templateName && "text-zinc-400 dark:text-zinc-500"
            )}
          />
        </div>
      </div>

      {/* Fields Editor */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {fields.length === 0 ? (
            /* Empty state for new templates */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-6 p-4 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
                <Plus className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Start Building Your Template
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 max-w-sm">
                Create custom fields to capture exactly what matters in your daily logs. Add rating scales, text areas, checkboxes, and more.
              </p>
              <Button
                onClick={() => handleAddField("Custom Fields")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Field
              </Button>
            </div>
          ) : (
            /* Existing fields display */
            <>
              {Object.entries(groupedFields).map(([category, categoryFields]) => (
                <div key={category} className="space-y-2">
                  {/* Editable Category Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {editingCategoryId === category ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={categoryNames[category] || category}
                            onChange={(e) => handleCategoryNameChange(category, e.target.value)}
                            className="h-7 text-sm font-medium border-zinc-300 dark:border-zinc-600 focus:ring-0"
                            onBlur={() => setEditingCategoryId(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setEditingCategoryId(null);
                              }
                            }}
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCategoryId(null)}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="h-3 w-3 text-emerald-600" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {categoryNames[category] || category}
                            <span className="text-xs text-zinc-500 ml-2">
                              ({categoryFields.length} field{categoryFields.length !== 1 ? 's' : ''})
                            </span>
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCategoryId(category)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddField(category)}
                      className="h-7 text-xs focus:ring-0"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Field
                    </Button>
                  </div>

                  {/* Fields */}
                  <div className="space-y-2">
                    {categoryFields.map((field) => (
                      <FieldRow key={field.id} field={field} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Add new category - only show when there are existing fields */}
              <Card className="border-dashed border-2 border-zinc-300 dark:border-zinc-700">
                <CardContent className="p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddField("Custom Fields")}
                    className="w-full h-10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 focus:ring-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Custom Field
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-0"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
          <Button variant="outline" onClick={onClose} className="focus:ring-0">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
