import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DayTemplateState {
  // Map of date string to template ID
  dayTemplateMap: Record<string, string>;
  
  // Set template for a specific day
  setDayTemplate: (date: string, templateId: string) => void;
  
  // Get template for a specific day
  getDayTemplate: (date: string) => string | undefined;
  
  // Clear template for a specific day
  clearDayTemplate: (date: string) => void;
  
  // Clear all day templates (for cleanup)
  clearAllDayTemplates: () => void;
}

export const useTemplateStore = create<DayTemplateState>()(
  persist(
    (set, get) => ({
      dayTemplateMap: {},
      
      setDayTemplate: (date: string, templateId: string) => {
        set((state) => ({
          dayTemplateMap: {
            ...state.dayTemplateMap,
            [date]: templateId
          }
        }));
      },
      
      getDayTemplate: (date: string) => {
        const state = get();
        return state.dayTemplateMap[date];
      },
      
      clearDayTemplate: (date: string) => {
        set((state) => {
          const newMap = { ...state.dayTemplateMap };
          delete newMap[date];
          return { dayTemplateMap: newMap };
        });
      },
      
      clearAllDayTemplates: () => {
        set({ dayTemplateMap: {} });
      },
    }),
    {
      name: 'template-day-state',
      version: 1,
    }
  )
);
