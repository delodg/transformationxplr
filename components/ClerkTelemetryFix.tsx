"use client";

import { useEffect } from "react";

export const ClerkTelemetryFix = () => {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === "development") {
      // Intercept fetch requests to clerk-telemetry.com to prevent 400 errors
      const originalFetch = window.fetch;

      window.fetch = async (...args) => {
        const [resource] = args;

        // Check if the request is to Clerk telemetry
        if (typeof resource === "string" && resource.includes("clerk-telemetry.com")) {
          console.log("🔇 Blocking Clerk telemetry request in development:", resource);
          // Return a fake successful response
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // For all other requests, use the original fetch
        return originalFetch.apply(window, args);
      };

      // Also suppress console errors related to Clerk telemetry
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args.join(" ");
        if (message.includes("clerk-telemetry.com") || (message.includes("Failed to load resource") && message.includes("400"))) {
          console.log("🔇 Suppressed Clerk telemetry error in development");
          return;
        }
        originalConsoleError.apply(console, args);
      };

      // Cleanup function
      return () => {
        window.fetch = originalFetch;
        console.error = originalConsoleError;
      };
    }
  }, []);

  return null; // This component doesn't render anything
};
