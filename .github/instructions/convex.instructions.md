---
applyTo: "**/*.{ts,tsx,js,jsx}"
---

# Convex Development Instructions

When working with Convex applications, follow these guidelines and best practices:

## Database Schema
- Use the `defineSchema` function to define your database schema in `convex/schema.ts`
- Define tables with `defineTable` and specify field types using Convex validators
- Use `v.object()`, `v.string()`, `v.number()`, `v.boolean()`, `v.array()`, etc. for validation
- Add indexes using `.index()` for efficient queries
- Use `.searchIndex()` for full-text search capabilities

## Functions
- **Queries**: Use `query()` for read-only operations that can be cached and subscribed to
- **Mutations**: Use `mutation()` for operations that modify data
- **Actions**: Use `action()` for operations that need external API calls or side effects
- **HTTP Actions**: Use `httpAction()` for webhook endpoints

## Function Structure
```typescript
export const myQuery = query({
  args: { id: v.id("tableName") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const myMutation = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tableName", { name: args.name });
  },
});
```

## Database Operations
- Use `ctx.db.query("tableName")` to start queries
- Chain `.filter()`, `.order()`, `.take()`, `.first()`, `.unique()` as needed
- Use `ctx.db.get(id)` to fetch by ID
- Use `ctx.db.insert()`, `ctx.db.patch()`, `ctx.db.replace()`, `ctx.db.delete()` for mutations
- Always handle null/undefined cases when documents might not exist

## Authentication
- Use `ctx.auth.getUserIdentity()` to get the current user
- Check authentication status before performing sensitive operations
- Use custom auth or integrate with providers like Clerk, Auth0, etc.

## Error Handling
- Throw `ConvexError` for user-facing errors
- Use appropriate error messages and codes
- Validate inputs using the args schema

## Performance
- Add indexes for frequently queried fields
- Use pagination with `.paginate()` for large result sets
- Consider using `.collect()` vs `.take()` based on your needs
- Minimize data fetching by selecting only needed fields

## File Structure
- Put database functions in `convex/` directory
- Use clear, descriptive function names
- Group related functions in the same file
- Export functions that will be called from the frontend

## Frontend Integration
- Use `useQuery()` for reactive data fetching
- Use `useMutation()` for data modifications
- Use `useAction()` for actions
- Handle loading and error states appropriately
- Use `usePaginatedQuery()` for paginated data

## TypeScript
- Import types from `convex/_generated/api`
- Use `api.fileName.functionName` for function references
- Leverage auto-generated types for type safety

## Testing
- Write unit tests for your Convex functions
- Use `convex dev` for local development
- Test with real data scenarios
- Validate error cases

Remember to always validate inputs, handle edge cases, and follow Convex's reactive patterns for optimal performance.
