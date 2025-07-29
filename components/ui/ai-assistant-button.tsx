'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles } from 'lucide-react';

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
      className={`flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 hover:border-purple-300 transition-all duration-200 ${className}`}
    >
      <div className="relative">
        <Brain className="h-4 w-4 text-purple-600" />
        <Sparkles className="h-2.5 w-2.5 text-blue-500 absolute -top-0.5 -right-0.5 animate-pulse" />
      </div>
      <span className="font-medium text-purple-700">Axel</span>
    </Button>
  );
}