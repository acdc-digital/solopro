import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ConvexError } from "convex/values";

// Field type definition to match the Templates component
export const fieldValidator = v.object({
  id: v.string(),
  type: v.union(
    v.literal("slider"),
    v.literal("number"),
    v.literal("checkbox"),
    v.literal("textarea"),
    v.literal("text")
  ),
  label: v.string(),
  placeholder: v.optional(v.string()),
  min: v.optional(v.number()),
  max: v.optional(v.number()),
  step: v.optional(v.number()),
  defaultValue: v.optional(v.any()),
  required: v.optional(v.boolean()),
  category: v.optional(v.string()),
});

/**
 * Save or update a daily log template
 */
export const saveDailyLogTemplate = mutation({
  args: {
    id: v.optional(v.id("dailyLogTemplates")),
    name: v.string(),
    userId: v.string(),
    fields: v.array(fieldValidator),
    isActive: v.optional(v.boolean()),
  },
  returns: v.id("dailyLogTemplates"),
  handler: async (ctx, args) => {
    // Validate template name
    if (!args.name.trim()) {
      throw new ConvexError("Template name cannot be empty");
    }

    // Validate fields
    if (args.fields.length === 0) {
      throw new ConvexError("Template must have at least one field");
    }

    const now = new Date().toISOString();

    if (args.id) {
      // Update existing template
      const existingTemplate = await ctx.db.get(args.id);
      
      if (!existingTemplate) {
        throw new ConvexError("Template not found");
      }
      
      if (existingTemplate.userId !== args.userId as any) {
        throw new ConvexError("You don't have permission to update this template");
      }

      await ctx.db.patch(args.id, {
        name: args.name,
        fields: args.fields,
        isActive: args.isActive,
        updatedAt: now,
      });

      return args.id;
    } else {
      // Create new template
      
      // If this is being set as active, deactivate other templates
      if (args.isActive) {
        const activeTemplates = await ctx.db
          .query("dailyLogTemplates")
          .withIndex("by_user_id_and_active", (q) => 
            q.eq("userId", args.userId as any).eq("isActive", true)
          )
          .collect();

        for (const template of activeTemplates) {
          await ctx.db.patch(template._id, { isActive: false });
        }
      }

      return await ctx.db.insert("dailyLogTemplates", {
        name: args.name,
        userId: args.userId as any,
        fields: args.fields,
        isActive: args.isActive ?? false,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

/**
 * Get all templates for a user
 */
export const getUserDailyLogTemplates = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dailyLogTemplates")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId as any))
      .order("desc")
      .collect();
  },
});

/**
 * Get the active template for a user
 */
export const getActiveDailyLogTemplate = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dailyLogTemplates")
      .withIndex("by_user_id_and_active", (q) => 
        q.eq("userId", args.userId as any).eq("isActive", true)
      )
      .first();
  },
});

/**
 * Get a specific template by ID
 */
export const getDailyLogTemplate = query({
  args: {
    templateId: v.id("dailyLogTemplates"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.templateId);
  },
});

/**
 * Set a template as active (and deactivate others)
 */
export const setTemplateActive = mutation({
  args: {
    templateId: v.id("dailyLogTemplates"),
    userId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    
    if (!template) {
      throw new ConvexError("Template not found");
    }
    
    if (template.userId !== args.userId as any) {
      throw new ConvexError("You don't have permission to modify this template");
    }

    // Deactivate all other templates for this user
    const activeTemplates = await ctx.db
      .query("dailyLogTemplates")
      .withIndex("by_user_id_and_active", (q) => 
        q.eq("userId", args.userId as any).eq("isActive", true)
      )
      .collect();

    for (const activeTemplate of activeTemplates) {
      await ctx.db.patch(activeTemplate._id, { isActive: false });
    }

    // Activate the selected template
    await ctx.db.patch(args.templateId, { 
      isActive: true,
      updatedAt: new Date().toISOString(),
    });

    return null;
  },
});

/**
 * Delete a template
 */
export const deleteDailyLogTemplate = mutation({
  args: {
    templateId: v.id("dailyLogTemplates"),
    userId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    
    if (!template) {
      throw new ConvexError("Template not found");
    }
    
    if (template.userId !== args.userId as any) {
      throw new ConvexError("You don't have permission to delete this template");
    }

    await ctx.db.delete(args.templateId);
    return null;
  },
});

/**
 * Duplicate a template
 */
export const duplicateDailyLogTemplate = mutation({
  args: {
    templateId: v.id("dailyLogTemplates"),
    userId: v.string(),
    newName: v.optional(v.string()),
  },
  returns: v.id("dailyLogTemplates"),
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    
    if (!template) {
      throw new ConvexError("Template not found");
    }
    
    if (template.userId !== args.userId as any) {
      throw new ConvexError("You don't have permission to duplicate this template");
    }

    const now = new Date().toISOString();
    const newName = args.newName || `${template.name} (Copy)`;

    return await ctx.db.insert("dailyLogTemplates", {
      name: newName,
      userId: args.userId as any,
      fields: template.fields,
      isActive: false, // Duplicated templates are not active by default
      createdAt: now,
      updatedAt: now,
    });
  },
});

