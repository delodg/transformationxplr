"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface ColorSwatch {
  name: string;
  variable: string;
  hex: string;
  description: string;
}

const ColorShowcase: React.FC = () => {
  const primaryColors: ColorSwatch[] = [
    {
      name: "Primary Blue",
      variable: "--primary-blue",
      hex: "#235ce8",
      description: "Main brand color for buttons, links, and primary actions"
    },
    {
      name: "Primary Blue Light",
      variable: "--primary-blue-light", 
      hex: "#00a6fb",
      description: "Lighter variant for hover states and accents"
    },
    {
      name: "Primary Blue Dark",
      variable: "--primary-blue-dark",
      hex: "#184389",
      description: "Darker variant for emphasis and depth"
    },
    {
      name: "Secondary Orange",
      variable: "--secondary-orange",
      hex: "#f4900c",
      description: "Accent color for CTAs and highlights"
    }
  ];

  const neutralColors: ColorSwatch[] = [
    {
      name: "Neutral 50",
      variable: "--neutral-50",
      hex: "#f4f7fb",
      description: "Lightest background color"
    },
    {
      name: "Neutral 100", 
      variable: "--neutral-100",
      hex: "#c2c8ce",
      description: "Light borders and subtle backgrounds"
    },
    {
      name: "Neutral 200",
      variable: "--neutral-200", 
      hex: "#a6b1bc",
      description: "Input borders and dividers"
    },
    {
      name: "Neutral 300",
      variable: "--neutral-300",
      hex: "#7a8e9e", 
      description: "Disabled text and secondary elements"
    },
    {
      name: "Neutral 400",
      variable: "--neutral-400",
      hex: "#4a5a66",
      description: "Body text and icons"
    },
    {
      name: "Neutral 500",
      variable: "--neutral-500",
      hex: "#212933",
      description: "Headings and high contrast text"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const ColorSwatchComponent: React.FC<{ color: ColorSwatch; showTailwind?: boolean }> = ({ 
    color, 
    showTailwind = false 
  }) => (
    <div className="space-y-3">
      <div 
        className="w-full h-20 rounded-lg border-2 border-gray-200 cursor-pointer transition-transform hover:scale-105"
        style={{ backgroundColor: color.hex }}
        onClick={() => copyToClipboard(color.hex)}
        title="Click to copy hex value"
      />
      <div className="space-y-1">
        <h4 className="font-semibold text-sm text-gray-900">{color.name}</h4>
        <p className="text-xs text-gray-600">{color.description}</p>
        <div className="space-y-1">
          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
            {color.hex}
          </code>
          <br />
          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
            hsl(var({color.variable}))
          </code>
          {showTailwind && (
            <>
              <br />
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
                {color.variable.includes('primary-blue') 
                  ? `brand-blue-${color.variable.includes('light') ? 'light' : color.variable.includes('dark') ? 'dark' : 'DEFAULT'}`
                  : color.variable.includes('secondary-orange')
                  ? 'brand-orange'
                  : `neutral-${color.variable.split('-')[1]}`
                }
              </code>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-neutral-500">Custom Color Palette</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          A carefully crafted color system designed for modern finance transformation applications. 
          All colors are available as CSS variables and Tailwind utilities.
        </p>
      </div>

      {/* Primary Colors */}
      <Card className="border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white">
          <CardTitle className="text-2xl">Primary Colors</CardTitle>
          <CardDescription className="text-blue-100">
            Core brand colors for primary actions and branding elements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {primaryColors.map((color) => (
              <ColorSwatchComponent key={color.name} color={color} showTailwind />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Neutral Scale */}
      <Card className="border-neutral-200">
        <CardHeader className="bg-neutral-50 border-b border-neutral-200">
          <CardTitle className="text-2xl text-neutral-500">Neutral Scale</CardTitle>
          <CardDescription className="text-neutral-400">
            Flexible gray scale for text, backgrounds, and UI elements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neutralColors.map((color) => (
              <ColorSwatchComponent key={color.name} color={color} showTailwind />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Examples */}
      <Card className="border-neutral-200">
        <CardHeader>
          <CardTitle className="text-2xl text-neutral-500">Interactive Examples</CardTitle>
          <CardDescription className="text-neutral-400">
            See the colors in action with real UI components
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-500">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-brand-blue hover:bg-brand-blue-dark">
                Primary Action
              </Button>
              <Button className="bg-brand-orange hover:bg-brand-orange/90">
                Secondary Action  
              </Button>
              <Button variant="outline" className="border-neutral-200 text-neutral-500 hover:bg-neutral-50">
                Outline Button
              </Button>
              <Button variant="ghost" className="text-neutral-400 hover:bg-neutral-100">
                Ghost Button
              </Button>
            </div>
          </div>

          <Separator className="bg-neutral-200" />

          {/* Badges */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-500">Badges & Status</h3>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-brand-blue text-white">Primary</Badge>
              <Badge className="bg-brand-orange text-white">Accent</Badge>
              <Badge className="bg-neutral-100 text-neutral-500 border border-neutral-200">Neutral</Badge>
              <Badge className="bg-green-100 text-green-700 border border-green-200">Success</Badge>
              <Badge className="bg-red-100 text-red-700 border border-red-200">Error</Badge>
            </div>
          </div>

          <Separator className="bg-neutral-200" />

          {/* Progress Bars */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-500">Progress Indicators</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-neutral-400 mb-1">
                  <span>Project Progress</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm text-neutral-400 mb-1">
                  <span>AI Acceleration</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-3">
                  <div 
                    className="bg-brand-orange h-3 rounded-full transition-all duration-500" 
                    style={{ width: '60%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-200" />

          {/* Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-500">Card Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-neutral-200">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-brand-blue rounded-lg"></div>
                    <h4 className="font-semibold text-neutral-500">Primary Card</h4>
                    <p className="text-sm text-neutral-400">Using primary blue accent</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-brand-orange">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-brand-orange rounded-lg"></div>
                    <h4 className="font-semibold text-neutral-500">Accent Card</h4>
                    <p className="text-sm text-neutral-400">Using orange accent border</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-50 border-neutral-200">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-neutral-300 rounded-lg"></div>
                    <h4 className="font-semibold text-neutral-500">Neutral Card</h4>
                    <p className="text-sm text-neutral-400">Using neutral background</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="bg-neutral-200" />

          {/* Gradients */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-500">Gradient Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="gradient-bg h-24 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Primary Gradient</span>
              </div>
              <div className="gradient-accent h-24 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Accent Gradient</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card className="border-neutral-200">
        <CardHeader>
          <CardTitle className="text-2xl text-neutral-500">Usage Guide</CardTitle>
          <CardDescription className="text-neutral-400">
            How to use these colors in your components
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CSS Variables */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-500">CSS Variables</h3>
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <pre className="text-sm text-neutral-500 overflow-x-auto">
{`/* Use with hsl() */
background: hsl(var(--primary-blue));
color: hsl(var(--neutral-50));

/* Custom gradients */
background: linear-gradient(
  135deg, 
  hsl(var(--primary-blue)), 
  hsl(var(--primary-blue-dark))
);`}
                </pre>
              </div>
            </div>

            {/* Tailwind Classes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-500">Tailwind Classes</h3>
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <pre className="text-sm text-neutral-500 overflow-x-auto">
{`<!-- Brand colors -->
<div class="bg-brand-blue">
<div class="text-brand-orange">
<div class="border-brand-blue-light">

<!-- Neutral scale -->
<div class="bg-neutral-50">
<div class="text-neutral-500">
<div class="border-neutral-200">`}
                </pre>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-200" />

          {/* Color Guidelines */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-500">Color Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-neutral-500">Primary Blue</h4>
                <ul className="text-sm text-neutral-400 space-y-1">
                  <li>• Primary buttons and CTAs</li>
                  <li>• Active navigation states</li>
                  <li>• Links and interactive elements</li>
                  <li>• Progress indicators</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-neutral-500">Secondary Orange</h4>
                <ul className="text-sm text-neutral-400 space-y-1">
                  <li>• Accent highlights</li>
                  <li>• Important notifications</li>
                  <li>• Secondary CTAs</li>
                  <li>• Status indicators</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-neutral-500">Neutral Scale</h4>
                <ul className="text-sm text-neutral-400 space-y-1">
                  <li>• Text hierarchy (500 → 300)</li>
                  <li>• Backgrounds (50 → 100)</li>
                  <li>• Borders and dividers (200)</li>
                  <li>• Disabled states (300)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-neutral-500">Accessibility</h4>
                <ul className="text-sm text-neutral-400 space-y-1">
                  <li>• Meets WCAG 2.1 AA standards</li>
                  <li>• High contrast ratios</li>
                  <li>• Color-blind friendly</li>
                  <li>• Dark mode support</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorShowcase; 