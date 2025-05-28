import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Re-enabling Convex Auth middleware to test compatibility
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

// Updated to only protect the dashboard and server routes, not the landing page
const isProtectedRoute = createRouteMatcher(["/dashboard", "/server"]);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    // Only redirect from protected routes to home page, where the modal will be available
    if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/");
    }
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } } // 30 days
);

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
