import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Template, TemplateField } from "@/app/dashboard/_components/Templates";
import { useEffect, useState } from "react";
import { useTemplateStore } from "@/store/templateStore";

interface UseTemplatesProps {
  userId?: string;
  selectedDate?: string; // Add selectedDate to track per-day state
}

export function useTemplates({ userId, selectedDate }: UseTemplatesProps) {
  // Zustand store for per-day template state
  const { getDayTemplate, setDayTemplate } = useTemplateStore();
  
  // Local state to track if we've ensured default template exists
  const [hasEnsuredDefault, setHasEnsuredDefault] = useState(false);

  // Queries
  const templates = useQuery(
    api.dailyLogTemplates.getUserDailyLogTemplates,
    userId ? { userId } : "skip"
  );

  const activeTemplate = useQuery(
    api.dailyLogTemplates.getActiveDailyLogTemplate,
    userId ? { userId } : "skip"
  );

  // Debug logging
  console.log("🔍 useTemplates Debug:", {
    userId,
    selectedDate,
    templates: templates?.length,
    activeTemplate: activeTemplate?.name,
    hasEnsuredDefault
  });

  // Mutations
  const saveTemplateMutation = useMutation(api.dailyLogTemplates.saveDailyLogTemplate);
  const setActiveTemplateMutation = useMutation(api.dailyLogTemplates.setTemplateActive);
  const deleteTemplateMutation = useMutation(api.dailyLogTemplates.deleteDailyLogTemplate);
  const duplicateTemplateMutation = useMutation(api.dailyLogTemplates.duplicateDailyLogTemplate);

  // Ensure default template exists
  useEffect(() => {
    if (userId && templates !== undefined && !hasEnsuredDefault) {
      console.log("🔍 Ensuring default template exists for user:", userId);
      const hasDefaultTemplate = templates.some((t: any) => t.name === "Default Template");
      
      if (!hasDefaultTemplate) {
        console.log("🔍 No default template found, creating manually");
        const defaultTemplate: Template = {
          id: "template_default", 
          name: "Default Template",
          fields: getDefaultFields(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveTemplate(defaultTemplate, true);
      }
      setHasEnsuredDefault(true);
    }
  }, [userId, templates, hasEnsuredDefault]);

  // Get the effective active template for the current day
  const getEffectiveActiveTemplate = () => {
    console.log("🔍 getEffectiveActiveTemplate called:", { selectedDate, templatesLength: templates?.length, activeTemplate: activeTemplate?.name });
    
    if (!selectedDate || !templates) {
      console.log("🔍 Returning activeTemplate:", activeTemplate?.name);
      return activeTemplate;
    }
    
    // Check if there's a stored template for this specific day
    const dayTemplateId = getDayTemplate(selectedDate);
    console.log("🔍 Day template ID for", selectedDate, ":", dayTemplateId);
    
    if (dayTemplateId) {
      const dayTemplate = templates.find((t: any) => t._id === dayTemplateId);
      if (dayTemplate) {
        console.log("🔍 Found day template:", dayTemplate.name);
        return dayTemplate;
      }
    }
    
    // Check if there's a daily log for this date to determine what template was used
    // For now, fall back to default template if no day-specific template is set
    const defaultTemplate = templates.find((t: any) => t.name === "Default Template");
    console.log("🔍 Default template found:", defaultTemplate?.name);
    console.log("🔍 Returning:", (defaultTemplate || activeTemplate)?.name);
    return defaultTemplate || activeTemplate;
  };

  // Helper functions
  const saveTemplate = async (template: Template, setAsActive?: boolean) => {
    if (!userId) throw new Error("User ID is required");
    
    const templateId = template.id.startsWith("template_") ? undefined : template.id as Id<"dailyLogTemplates">;
    
    const result = await saveTemplateMutation({
      id: templateId,
      name: template.name,
      userId,
      fields: template.fields,
      isActive: setAsActive,
    });
    
    // If this is being saved for a specific day, store the association
    if (selectedDate && result) {
      setDayTemplate(selectedDate, result);
    }
    
    return result;
  };

  const setActiveTemplate = async (templateId: Id<"dailyLogTemplates">) => {
    if (!userId) throw new Error("User ID is required");
    
    const result = await setActiveTemplateMutation({
      templateId,
      userId,
    });
    
    // Store this template choice for the current day
    if (selectedDate) {
      setDayTemplate(selectedDate, templateId);
    }
    
    return result;
  };

  const deleteTemplate = async (templateId: Id<"dailyLogTemplates">) => {
    if (!userId) throw new Error("User ID is required");
    
    return await deleteTemplateMutation({
      templateId,
      userId,
    });
  };

  const duplicateTemplate = async (templateId: Id<"dailyLogTemplates">, newName?: string) => {
    if (!userId) throw new Error("User ID is required");
    
    return await duplicateTemplateMutation({
      templateId,
      userId,
      newName,
    });
  };

  // Convert Convex template to our Template interface
  const convertToTemplate = (convexTemplate: any): Template => {
    return {
      id: convexTemplate._id,
      name: convexTemplate.name,
      fields: convexTemplate.fields,
      createdAt: convexTemplate.createdAt,
      updatedAt: convexTemplate.updatedAt,
    };
  };

  // Get default template fields if no active template
  const getDefaultFields = (): TemplateField[] => {
    return [
      {
        id: "overallMood",
        type: "slider",
        label: "Overall Mood",
        min: 1,
        max: 10,
        defaultValue: 5,
        category: "ratings",
        required: true,
      },
      {
        id: "workSatisfaction",
        type: "slider",
        label: "Work Satisfaction",
        min: 1,
        max: 10,
        defaultValue: 5,
        category: "ratings",
        required: true,
      },
      {
        id: "personalLifeSatisfaction",
        type: "slider",
        label: "Personal Life",
        min: 1,
        max: 10,
        defaultValue: 5,
        category: "ratings",
        required: true,
      },
      {
        id: "balanceRating",
        type: "slider",
        label: "Work-Life Balance",
        min: 1,
        max: 10,
        defaultValue: 5,
        category: "ratings",
        required: true,
      },
      {
        id: "sleep",
        type: "number",
        label: "Hours of sleep",
        min: 0,
        max: 24,
        step: 0.5,
        defaultValue: 7,
        category: "wellness",
        required: true,
      },
      {
        id: "exercise",
        type: "checkbox",
        label: "Exercise today?",
        defaultValue: false,
        category: "wellness",
      },
      {
        id: "highlights",
        type: "textarea",
        label: "Today's highlight",
        placeholder: "What was the best part of your day?",
        category: "reflections",
      },
      {
        id: "challenges",
        type: "textarea",
        label: "Today's challenge",
        placeholder: "What was challenging?",
        category: "reflections",
      },
      {
        id: "tomorrowGoal",
        type: "textarea",
        label: "Tomorrow's focus",
        placeholder: "What's your main focus for tomorrow?",
        category: "reflections",
      },
    ];
  };

  // Get current form fields (from effective active template or default)
  const getCurrentFormFields = (): TemplateField[] => {
    const effectiveTemplate = getEffectiveActiveTemplate();
    console.log("🔍 getCurrentFormFields - effectiveTemplate:", effectiveTemplate?.name, "fields:", effectiveTemplate?.fields?.length);
    
    if (effectiveTemplate) {
      return effectiveTemplate.fields;
    }
    
    const defaultFields = getDefaultFields();
    console.log("🔍 getCurrentFormFields - using default fields:", defaultFields.length);
    return defaultFields;
  };

  return {
    // Data
    templates: templates?.map(convertToTemplate) || [],
    activeTemplate: getEffectiveActiveTemplate() ? convertToTemplate(getEffectiveActiveTemplate()) : null,
    currentFormFields: getCurrentFormFields(),
    
    // Loading states
    isLoading: templates === undefined,
    
    // Actions
    saveTemplate,
    setActiveTemplate,
    deleteTemplate,
    duplicateTemplate,
    
    // Helpers
    getDefaultFields,
    getEffectiveActiveTemplate,
  };
} 