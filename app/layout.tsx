import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { ClerkTelemetryFix } from "@/components/ClerkTelemetryFix";
import { Header } from "@/components/ui/header";

export const metadata = {
  title: "Transformation XPLR - AI-Powered Finance Transformation",
  description: "AI-accelerated Finance Transformation platform combining Hackett IP with intelligent automation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="font-sans min-h-screen bg-gray-50 antialiased">
          <Header />
          <main className="flex-1">
            <SignedIn>
              <div className="min-h-screen">
                {children}
              </div>
            </SignedIn>
            <SignedOut>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Transformation XPLR</h2>
                  <p className="text-gray-600 mb-8">Please sign in to access your AI-powered finance transformation platform.</p>
                  <div className="space-x-4">
                    <SignInButton mode="modal">
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">Sign In</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors">Get Started</button>
                    </SignUpButton>
                  </div>
                </div>
              </div>
            </SignedOut>
          </main>
          <ClerkTelemetryFix />
        </body>
      </html>
    </ClerkProvider>
  );
}
