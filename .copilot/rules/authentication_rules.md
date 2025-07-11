# Authentication Implementation Rules for New Modules

## Overview
This document provides rules for implementing authentication consistently across new modules in the SoloPro application. The system uses Convex Auth with a specific pattern for user identification and correlation.

## Core Authentication Patterns

### 1. Backend User ID Retrieval
**Rule**: Always use `getAuthUserId(ctx)` for secure user identification in Convex functions.

```typescript
import { getAuthUserId } from "@convex-dev/auth/server";

// ✅ CORRECT - Use this pattern for all authenticated queries/mutations
export const myQuery = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    
    if (!userId) {
      return null; // or throw error depending on requirements
    }
    
    // Use userId for filtering and security
    return await ctx.db
      .query("myTable")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});
```

**Never use**: `ctx.auth.getUserIdentity().subject` - this returns identity subject, not the actual user ID.

### 2. Frontend User ID Retrieval
**Rule**: Use the custom `useConvexUser()` hook for consistent user identification in React components.

```typescript
import { useConvexUser } from "@/lib/hooks/useConvexUser";

// ✅ CORRECT - Use this pattern in all components needing user info
export function MyComponent() {
  const { isAuthenticated, isLoading, userId } = useConvexUser();
  
  // Check authentication state properly
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated || !userId) return <AuthRequired />;
  
  // Use userId for API calls and data fetching
  return <UserSpecificContent userId={userId} />;
}
```

### 3. User Correlation in External Services
**Rule**: Always pass the Convex user ID as the primary identifier to external services.

```typescript
// ✅ CORRECT - Pass userId as client_reference_id for Stripe
const sessionParams = {
  client_reference_id: userId,
  metadata: { userId },
  // ... other params
};

// ✅ CORRECT - Include userId in webhook data
const webhookData = {
  userIdOrEmail: userId,
  customerEmail: email, // as fallback
  // ... other data
};
```

## Module Implementation Rules

### 4. Query Function Structure
**Rule**: All user-specific queries must follow this pattern:

```typescript
export const getUserSpecificData = query({
  args: { /* additional args */ },
  handler: async (ctx, args) => {
    // Step 1: Get authenticated user ID
    const userId = await getAuthUserId(ctx);
    
    // Step 2: Check authentication
    if (!userId) {
      return null; // or appropriate default
    }
    
    // Step 3: Use userId for secure filtering
    return await ctx.db
      .query("dataTable")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter(/* additional filters */)
      .collect();
  },
});
```

### 5. Internal Mutation Structure
**Rule**: Internal mutations that need user correlation must accept flexible user identification:

```typescript
export const processExternalData = internalMutation({
  args: {
    userIdOrEmail: v.string(),
    customerEmail: v.optional(v.string()),
    // ... other args
  },
  handler: async (ctx, args) => {
    let userId: Id<"users"> | null = null;
    
    // Step 1: Try direct user ID lookup
    try {
      const user = await ctx.db.get(args.userIdOrEmail as Id<"users">);
      if (user) userId = user._id;
    } catch (e) {
      // Not a valid ID, continue to email lookup
    }
    
    // Step 2: Try email lookup with customerEmail
    if (!userId && args.customerEmail) {
      const userByEmail = await ctx.db
        .query("users")
        .filter(q => q.eq(q.field("email"), args.customerEmail))
        .first();
      if (userByEmail) userId = userByEmail._id;
    }
    
    // Step 3: Try userIdOrEmail as email
    if (!userId) {
      const userByEmail = await ctx.db
        .query("users")
        .filter(q => q.eq(q.field("email"), args.userIdOrEmail))
        .first();
      if (userByEmail) userId = userByEmail._id;
    }
    
    // Step 4: Handle user not found
    if (!userId) {
      throw new Error(`User not found for identifier: ${args.userIdOrEmail}`);
    }
    
    // Step 5: Process with verified userId
    // ... implementation
  },
});
```

### 6. Database Schema Rules
**Rule**: All user-specific tables must include proper indexing:

```typescript
// ✅ CORRECT - Always include userId field and index
myTable: defineTable({
  userId: v.id("users"),
  // ... other fields
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
}).index("by_userId", ["userId"]),
```

### 7. Frontend Hook Integration
**Rule**: Create module-specific hooks that integrate with the authentication system:

```typescript
// ✅ CORRECT - Module-specific authenticated hook
export function useMyModuleData() {
  const { isAuthenticated, userId } = useConvexUser();
  
  const data = useQuery(
    api.myModule.getData,
    isAuthenticated && userId ? {} : "skip"
  );
  
  return {
    data,
    isLoading: data === undefined,
    hasAccess: isAuthenticated && !!userId
  };
}
```

### 8. Component Authentication Checking
**Rule**: Components must check authentication state before rendering user-specific content:

```typescript
// ✅ CORRECT - Proper authentication checking
export function MyModuleComponent() {
  const { isAuthenticated, isLoading, userId } = useConvexUser();
  
  // Handle loading state
  if (isLoading) {
    return <Skeleton />;
  }
  
  // Handle unauthenticated state
  if (!isAuthenticated || !userId) {
    return <AuthenticationRequired />;
  }
  
  // Render authenticated content
  return <AuthenticatedContent userId={userId} />;
}
```

### 9. API Route Integration
**Rule**: API routes that interact with Convex must include proper user identification:

```typescript
// ✅ CORRECT - API route with user validation
export async function POST(request: Request) {
  const { userId, /* other data */ } = await request.json();
  
  // Validate required authentication data
  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
  
  // Pass userId to external services
  const result = await externalService.process({
    client_reference_id: userId,
    metadata: { userId },
    // ... other data
  });
  
  return NextResponse.json(result);
}
```

### 10. Webhook Processing Rules
**Rule**: Webhook handlers must implement robust user correlation:

```typescript
// ✅ CORRECT - Webhook with user correlation
export const processWebhook = mutation({
  args: { eventType: v.string(), data: v.any() },
  handler: async (ctx, args) => {
    const { data } = args;
    
    // Extract user identifier with priority order
    const userIdentifier = data.client_reference_id || 
                          data.metadata?.userId || 
                          data.customer_details?.email;
    
    if (!userIdentifier) {
      console.error("No user identifier found in webhook data");
      return { success: false, error: "No user identifier found" };
    }
    
    // Process with internal mutation that handles user lookup
    await ctx.runMutation(internal.myModule.processData, {
      userIdOrEmail: userIdentifier,
      customerEmail: data.customer_details?.email,
      // ... other data
    });
    
    return { success: true };
  },
});
```

## Error Handling Rules

### 11. Authentication Error Handling
**Rule**: Handle authentication failures gracefully:

```typescript
// ✅ CORRECT - Graceful authentication error handling
export const secureQuery = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    
    if (!userId) {
      // Log for debugging but don't expose internal details
      console.log("Unauthenticated access attempt to secureQuery");
      return { error: "Authentication required", data: null };
    }
    
    try {
      // ... secure operations
    } catch (error) {
      console.error("Error in secureQuery:", error);
      return { error: "Operation failed", data: null };
    }
  },
});
```

### 12. User Not Found Handling
**Rule**: Provide meaningful error messages for user correlation failures:

```typescript
// ✅ CORRECT - Meaningful error messages
if (!userId) {
  const errorMsg = `User not found for identifier: ${args.userIdOrEmail}${
    args.customerEmail ? ` (customer email: ${args.customerEmail})` : ''
  }`;
  console.error(errorMsg);
  throw new Error(errorMsg);
}
```

## Testing Rules

### 13. Authentication Testing
**Rule**: Always test authentication flows with real user IDs:

```typescript
// ✅ CORRECT - Test with actual user ID format
const testUserId = "jx796r8sa3pfrfz4xnw598t4cd7g98s9"; // Real format
const result = await testMutation(api.myModule.createData, {
  userIdOrEmail: testUserId,
  // ... test data
});
```

## Security Rules

### 14. Data Access Security
**Rule**: Never trust client-provided user IDs for data access:

```typescript
// ❌ WRONG - Don't trust client userId
export const badQuery = query({
  args: { userId: v.string() }, // Client can manipulate this
  handler: async (ctx, { userId }) => {
    // This allows users to access other users' data!
    return await ctx.db.query("data").filter(q => q.eq("userId", userId));
  },
});

// ✅ CORRECT - Always use server-side authentication
export const goodQuery = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx); // Server determines user
    if (!userId) return null;
    
    return await ctx.db
      .query("data")
      .withIndex("by_userId", q => q.eq("userId", userId))
      .collect();
  },
});
```

### 15. Cross-User Data Access
**Rule**: Implement explicit permission checks for cross-user data access:

```typescript
// ✅ CORRECT - Explicit permission checking
export const getSharedData = query({
  args: { targetUserId: v.id("users") },
  handler: async (ctx, { targetUserId }) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) return null;
    
    // Check if current user has permission to access target user's data
    const hasPermission = await checkDataAccessPermission(ctx, currentUserId, targetUserId);
    if (!hasPermission) return null;
    
    return await ctx.db.get(targetUserId);
  },
});
```

## Convex-Specific Authentication Rules

### 16. Function Registration Rules
**Rule**: Use appropriate function types based on security requirements:

```typescript
// ✅ CORRECT - Public functions for authenticated user operations
export const getUserData = query({
  args: {},
  returns: v.union(v.null(), v.object({ /* user data */ })),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    // ... implementation
  },
});

// ✅ CORRECT - Internal functions for system operations
export const systemProcessUser = internalMutation({
  args: { userIdOrEmail: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Internal processing - not exposed to public API
    // ... implementation
  },
});
```

### 17. Validator Rules for Authentication
**Rule**: Always include proper validators for authentication-related functions:

```typescript
// ✅ CORRECT - Proper argument and return validators
export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  returns: v.union(
    v.null(),
    v.object({
      success: v.boolean(),
      userId: v.id("users"),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    // Update user with validated inputs
    await ctx.db.patch(userId, args);
    return { success: true, userId };
  },
});
```

### 18. Index Naming Convention
**Rule**: Follow consistent naming for user-related indexes:

```typescript
// ✅ CORRECT - Descriptive index names including all fields
export default defineSchema({
  userPosts: defineTable({
    userId: v.id("users"),
    categoryId: v.id("categories"),
    title: v.string(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_categoryId", ["userId", "categoryId"])
    .index("by_userId_and_createdAt", ["userId", "createdAt"]),
});
```

### 19. Function Call Patterns
**Rule**: Use proper function references for internal authentication operations:

```typescript
// ✅ CORRECT - Using proper function references
export const processUserAction = mutation({
  args: { action: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");
    
    // Call internal function with proper reference
    await ctx.runMutation(internal.myModule.logUserAction, {
      userId,
      action: args.action,
      timestamp: Date.now(),
    });
    
    return null;
  },
});
```

### 20. Pagination with Authentication
**Rule**: Always include authentication checks in paginated queries:

```typescript
// ✅ CORRECT - Authenticated pagination
export const getUserPosts = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    categoryId: v.optional(v.id("categories")),
  },
  returns: v.object({
    page: v.array(v.object({ /* post schema */ })),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }
    
    let query = ctx.db
      .query("posts")
      .withIndex("by_userId", q => q.eq("userId", userId));
    
    if (args.categoryId) {
      query = query.filter(q => q.eq(q.field("categoryId"), args.categoryId));
    }
    
    return await query
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
```

## Implementation Checklist

When implementing a new module, ensure you:

- [ ] Use `getAuthUserId(ctx)` for all backend user identification
- [ ] Use `useConvexUser()` hook for all frontend user identification  
- [ ] Include proper user ID indexing in database schema
- [ ] Implement user correlation with fallback methods for external integrations
- [ ] Add proper authentication state checking in components
- [ ] Include user ID in all external service calls as `client_reference_id`
- [ ] Implement graceful error handling for authentication failures
- [ ] Add security filtering to prevent unauthorized data access
- [ ] Test with real user ID formats
- [ ] Log authentication events for debugging
- [ ] Use appropriate function types (public vs internal) based on security needs
- [ ] Include proper argument and return validators for all functions
- [ ] Follow consistent index naming conventions
- [ ] Use proper function references for internal calls
- [ ] Include authentication checks in paginated queries

## Common Pitfalls to Avoid

1. **Never use `identity.subject`** - Always use `getAuthUserId(ctx)`
2. **Don't trust client-provided user IDs** - Always authenticate server-side
3. **Don't forget indexing** - Always add `by_userId` indexes to user-specific tables
4. **Don't skip authentication checks** - Every user-specific operation needs auth verification
5. **Don't hardcode user IDs** - Use the authentication system consistently
6. **Don't ignore webhook user correlation** - Always implement robust user lookup for external events
7. **Don't mix public and internal functions inappropriately** - Use internal functions for sensitive operations
8. **Don't forget argument validators** - All functions must have proper validation
9. **Don't use inefficient queries** - Always use indexes instead of filters for user lookups
10. **Don't skip pagination authentication** - Even paginated queries need user verification 
