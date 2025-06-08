import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Template, TemplateField } from "@/app/dashboard/_components/Templates";

interface UseTemplatesProps {
  userId?: string;
}

export function useTemplates({ userId }: UseTemplatesProps) {
  // Queries
  const templates = useQuery(
    api.dailyLogTemplates.getUserDailyLogTemplates,
    userId ? { userId } : "skip"
  );

  const activeTemplate = useQuery(
    api.dailyLogTemplates.getActiveDailyLogTemplate,
    userId ? { userId } : "skip"
  );

  // Mutations
  const saveTemplateMutation = useMutation(api.dailyLogTemplates.saveDailyLogTemplate);
  const setActiveTemplateMutation = useMutation(api.dailyLogTemplates.setTemplateActive);
  const deleteTemplateMutation = useMutation(api.dailyLogTemplates.deleteDailyLogTemplate);
  const duplicateTemplateMutation = useMutation(api.dailyLogTemplates.duplicateDailyLogTemplate);

  // Helper functions
  const saveTemplate = async (template: Template, setAsActive?: boolean) => {
    if (!userId) throw new Error("User ID is required");
    
    const templateId = template.id.startsWith("template_") ? undefined : template.id as Id<"dailyLogTemplates">;
    
    return await saveTemplateMutation({
      id: templateId,
      name: template.name,
      userId,
      fields: template.fields,
      isActive: setAsActive,
    });
  };

  const setActiveTemplate = async (templateId: Id<"dailyLogTemplates">) => {
    if (!userId) throw new Error("User ID is required");
    
    return await setActiveTemplateMutation({
      templateId,
      userId,
    });
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

  // Get current form fields (from active template or default)
  const getCurrentFormFields = (): TemplateField[] => {
    if (activeTemplate) {
      return activeTemplate.fields;
    }
    return getDefaultFields();
  };

  return {
    // Data
    templates: templates?.map(convertToTemplate) || [],
    activeTemplate: activeTemplate ? convertToTemplate(activeTemplate) : null,
    currentFormFields: getCurrentFormFields(),
    
    // Loading states
    isLoading: templates === undefined || activeTemplate === undefined,
    
    // Actions
    saveTemplate,
    setActiveTemplate,
    deleteTemplate,
    duplicateTemplate,
    
    // Helpers
    getDefaultFields,
  };
} 