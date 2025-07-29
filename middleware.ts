import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that should be protected (authenticated)
const isProtectedRoute = createRouteMatcher([
  "/",
  "/analytics",
  "/workflow",
  "/api/companies(.*)",
  "/api/generate-analysis(.*)",
  "/api/ai-insights(.*)",
  "/api/analysis-results(.*)",
  "/api/chat-messages(.*)",
  "/api/questionnaires(.*)",
  "/api/user-sessions(.*)",
  "/api/workflow-phases(.*)",
  "/api/debug-questionnaire(.*)",
  "/api/cleanup-user(.*)",
]);

// Define routes that should be public (no authentication required)
const isPublicRoute = createRouteMatcher([
  "/api/webhooks(.*)", // All webhook routes should be public
  "/api/test-webhook(.*)", // Test webhooks
  "/api/test-clerk-webhook(.*)", // Clerk webhook testing
  "/api/test-db-connection(.*)", // Database connection testing
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Skip authentication for public routes (webhooks, auth pages)
  if (isPublicRoute(req)) {
    console.log(`🔓 Public route accessed: ${req.nextUrl.pathname}`);
    return;
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    console.log(`🔒 Protected route accessed: ${req.nextUrl.pathname}`);
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
