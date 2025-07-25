import "./globals.css";

export const metadata = {
  title: "Transformation XPLR - AI-Powered Finance Transformation",
  description: "AI-accelerated Finance Transformation platform combining Hackett IP with intelligent automation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
