"use client";

import ColorShowcase from "@/components/ColorShowcase";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-blue to-brand-blue-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-500">Color Palette Test</h1>
                <p className="text-xs text-neutral-400">Custom Brand Colors Implementation</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-brand-blue rounded-full"></div>
              <div className="w-3 h-3 bg-brand-orange rounded-full"></div>
              <div className="w-3 h-3 bg-neutral-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ColorShowcase />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="w-4 h-4 bg-brand-blue rounded mx-auto mb-1"></div>
                <span className="text-xs text-neutral-400">#235ce8</span>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-brand-blue-light rounded mx-auto mb-1"></div>
                <span className="text-xs text-neutral-400">#00a6fb</span>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-brand-orange rounded mx-auto mb-1"></div>
                <span className="text-xs text-neutral-400">#f4900c</span>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-neutral-500 rounded mx-auto mb-1"></div>
                <span className="text-xs text-neutral-400">#212933</span>
              </div>
            </div>
            <p className="text-sm text-neutral-400">
              Custom color palette implemented with CSS variables and Tailwind utilities
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
