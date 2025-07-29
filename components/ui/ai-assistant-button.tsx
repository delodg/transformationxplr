"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Bot, ChevronRight } from "lucide-react";

interface AIAssistantButtonProps {
  onClick?: () => void;
  className?: string;
}

export function AIAssistantButton({ onClick, className }: AIAssistantButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className={`
        group relative flex items-center gap-3 px-2 py-3 
        bg-white border border-gray-200 hover:border-gray-300 
        shadow-sm hover:shadow-md transition-all duration-200 ease-in-out
        focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${className}
      `}
    >
      {/* Professional AI Icon Container */}
      <div className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200">
        <Bot className="h-4 w-4 text-slate-600 group-hover:text-slate-700" />
      </div>

      {/* Enterprise Typography */}
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold text-gray-900 leading-none">AXEL</span>
        <span className="text-xs text-gray-500 leading-none mt-0.5">AI Assistant</span>
      </div>

      {/* Subtle Chevron Indicator */}
      <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all duration-200" />

      {/* Professional Status Indicator */}
      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
    </Button>
  );
}
