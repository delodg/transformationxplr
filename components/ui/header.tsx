'use client';

import React from 'react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AIAssistantButton } from './ai-assistant-button';

interface HeaderProps {
  onAIAssistantClick?: () => void;
}

export function Header({ onAIAssistantClick }: HeaderProps) {
  const handleAIAssistantClick = () => {
    console.log("🤖 AI Assistant Axel activated!");
    if (onAIAssistantClick) {
      onAIAssistantClick();
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Transformation XPLR</h1>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">Sign Up</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <AIAssistantButton onClick={handleAIAssistantClick} />
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}