# SoloPro

A Next.js + Convex application with authentication.

## Authentication System

This application uses [Convex Auth](https://labs.convex.dev/auth) for authentication with the following features:

### Client-side Authentication

- Password-based authentication (sign in/sign up)
- GitHub authentication
- Protected routes with middleware redirection
- Authentication state available in React components

### Server-side Authentication

Authentication state is available on the server through:

1. **Middleware** - Protects routes and redirects unauthenticated users
   - Implementation in `middleware.ts`
   - Cookie expiration set to 30 days

2. **Server Components** - Can access authentication token
   - Example in `app/server/page.tsx`
   - Uses `convexAuthNextjsToken()` to get the authentication token
   - Can fetch authenticated data with `fetchQuery`, `fetchMutation`

3. **Security considerations**
   - Only use queries from GET requests
   - Only use mutations/actions from non-GET requests (form submissions, POST routes)
   - This prevents CSRF attacks

## Getting Started

1. Start the Convex development server:
   ```bash
   npx convex dev
   ```

2. In another terminal, start the Next.js development server:
   ```bash
   npm run dev
   ```

3. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deploy to Convex and your preferred Next.js hosting platform.

When deploying to production, configure the `CONVEX_SITE_URL` environment variable to your production URL.

## Learn more

To learn more about developing your project with Convex, check out:

- The [Tour of Convex](https://docs.convex.dev/get-started) for a thorough introduction to Convex principles.
- The rest of [Convex docs](https://docs.convex.dev/) to learn about all Convex features.
- [Stack](https://stack.convex.dev/) for in-depth articles on advanced topics.
- [Convex Auth docs](https://labs.convex.dev/auth) for documentation on the Convex Auth library.

## Configuring other authentication methods

To configure different authentication methods, see [Configuration](https://labs.convex.dev/auth/config) in the Convex Auth docs.

## Join the community

Join thousands of developers building full-stack apps with Convex:

- Join the [Convex Discord community](https://convex.dev/community) to get help in real-time.
- Follow [Convex on GitHub](https://github.com/get-convex/), star and contribute to the open-source implementation of Convex.
