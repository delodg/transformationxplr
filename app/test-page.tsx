"use client";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Tailwind CSS Test
          </h1>
          
          <div className="space-y-3">
            <div className="p-4 bg-blue-100 border border-blue-200 rounded-md">
              <p className="text-blue-800 font-medium">Primary Color Test</p>
            </div>
            
            <div className="p-4 bg-green-100 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium">Success Color Test</p>
            </div>
            
            <div className="p-4 bg-red-100 border border-red-200 rounded-md">
              <p className="text-red-800 font-medium">Error Color Test</p>
            </div>
          </div>
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
            Test Button
          </button>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-primary rounded"></div>
            <div className="h-16 bg-secondary rounded"></div>
            <div className="h-16 bg-accent rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
