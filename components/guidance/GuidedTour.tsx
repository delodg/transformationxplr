"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, PlayCircle, BookOpen, Target } from "lucide-react";

interface GuidedTourProps {
  tourType?: "onboarding" | "phase-specific" | "full-workflow" | "ai-assistant";
  currentPhase?: number;
  onTourComplete?: () => void;
  onTourSkip?: () => void;
}

// Finance Transformation Blueprint Tour Steps - Updated to follow driver.js documentation
const TRANSFORMATION_TOUR_STEPS = {
  // Full workflow overview tour - simplified to existing elements
  fullWorkflow: [
    {
      element: '[data-tour="company-selection"]',
      popover: {
        title: "🏢 Step 1: Client Onboarding & Selection",
        description: `
          <strong>Project Initiation & Planning Phase</strong><br/>
          Start by selecting or creating a new company profile. This establishes the foundation for your transformation project.
          <br/><br/>
          <strong>Key Activities:</strong>
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li>Onboard the client with sales intelligence</li>
            <li>Select engagement type (Blueprint)</li>
            <li>Upload SOW and client data</li>
            <li>Define data collection approach</li>
          </ul>
        `,
        side: "bottom",
        align: "start",
      },
    },
    {
      element: '[data-tour="new-project"]',
      popover: {
        title: "🚀 Step 2: Create New Project",
        description: `
          <strong>Project Setup</strong><br/>
          Click here to create a new transformation project and begin the detailed client onboarding process.
          <br/><br/>
          <strong>What happens next:</strong>
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li>Complete company profile details</li>
            <li>Set transformation objectives</li>
            <li>Define timeline and budget parameters</li>
            <li>Begin Phase 1 activities</li>
          </ul>
        `,
        side: "left",
        align: "start",
      },
    },
    {
      element: '[data-tour="workflow-phases"]',
      popover: {
        title: "📋 Step 3: 7-Phase Workflow Management",
        description: `
          <strong>Comprehensive Transformation Process</strong><br/>
          Navigate through the 7 phases of finance transformation. Each phase builds on the previous one with specific deliverables and timelines.
          <br/><br/>
          <strong>Phase Overview:</strong>
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li><strong>Phase 1-2:</strong> Project initiation & parallel workstreams</li>
            <li><strong>Phase 3-4:</strong> Analysis & initiative identification</li>
            <li><strong>Phase 5-7:</strong> Roadmap development & implementation</li>
          </ul>
          <br/>
          Click on any phase to see detailed activities and deliverables.
        `,
        side: "left",
        align: "start",
      },
    },
    {
      element: '[data-tour="ai-assistant-open"]',
      popover: {
        title: "🤖 Step 4: AI-Powered Analysis & Guidance",
        description: `
          <strong>Claude-Powered Transformation Expert</strong><br/>
          Your AI assistant provides expert guidance throughout the transformation process, helping with analysis, recommendations, and documentation.
          <br/><br/>
          <strong>AI Capabilities:</strong>
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li>Phase-specific guidance and recommendations</li>
            <li>Risk assessment and mitigation strategies</li>
            <li>Initiative prioritization and ROI analysis</li>
            <li>Document generation and report creation</li>
          </ul>
          <br/>
          Click to open the AI Assistant and explore its features!
        `,
        side: "left",
        align: "start",
      },
    },
  ],

  // Phase-specific tours
  phaseSpecific: {
    1: [
      {
        element: '[data-tour="new-project"]',
        popover: {
          title: "🚀 Phase 1: Project Initiation",
          description: `
            <strong>Getting Started</strong><br/>
            Click here to create a new transformation project and begin the client onboarding process.
            <br/><br/>
            <strong>Phase 1 Key Activities:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li>Client onboarding and data collection setup</li>
              <li>Executive interview scheduling</li>
              <li>Project team assignment</li>
              <li>Initial stakeholder engagement</li>
            </ul>
          `,
          side: "left",
          align: "start",
        },
      },
      {
        element: '[data-tour="company-selection"]',
        popover: {
          title: "🏢 Select Client Company",
          description: `
            Choose your client company or create a new company profile for this transformation engagement.
            <br/><br/>
            This will load the project context and allow you to begin phase-specific activities.
          `,
          side: "bottom",
          align: "start",
        },
      },
    ],
    2: [
      {
        element: '[data-tour="workflow-phases"]',
        popover: {
          title: "📊 Phase 2: Parallel Workstreams Launch",
          description: `
            <strong>Data Collection & Stakeholder Engagement</strong><br/>
            In Phase 2, multiple activities run in parallel:
            <br/><br/>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li>5-week benchmark data collection</li>
              <li>Executive interviews (10-15 sessions)</li>
              <li>Stakeholder survey development and distribution</li>
              <li>CMM workshop preparation</li>
            </ul>
          `,
          side: "left",
          align: "start",
        },
      },
    ],
    3: [
      {
        element: '[data-tour="ai-assistant-open"]',
        popover: {
          title: "🤖 Phase 3: AI-Powered Synthesis",
          description: `
            <strong>Analysis & Data Triangulation</strong><br/>
            Use AI to synthesize findings from multiple data sources and identify transformation opportunities.
            <br/><br/>
            <strong>AI Analysis:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li>Triangulate benchmark data, interviews, and surveys</li>
              <li>Identify operational gaps and opportunities</li>
              <li>Compare against digital world-class standards</li>
              <li>Define target operating model</li>
            </ul>
          `,
          side: "left",
          align: "start",
        },
      },
    ],
  },

  // AI Assistant specific tour
  aiAssistant: [
    {
      element: '[data-tour="ai-assistant-open"]',
      popover: {
        title: "🤖 Meet Your AI Assistant",
        description: `
          <strong>Claude-Powered Transformation Expert</strong><br/>
          Your AI assistant is powered by Claude Sonnet 4 and trained specifically for finance transformation consulting using The Hackett Group's methodology.
          <br/><br/>
          Click to open and explore the AI features!
        `,
        side: "left",
        align: "start",
      },
    },
    {
      element: '[data-tour="ai-chat"]',
      popover: {
        title: "💬 Intelligent Conversations",
        description: `
          <strong>Context-Aware Assistance</strong><br/>
          Ask questions about your transformation project and get expert recommendations tailored to your current phase and client situation.
          <br/><br/>
          Try asking: "What are the key risks for Phase 2?" or "Generate a stakeholder survey template"
        `,
        side: "left",
        align: "start",
      },
    },
    {
      element: '[data-tour="ai-insights"]',
      popover: {
        title: "📊 AI-Generated Insights",
        description: `
          <strong>Automated Intelligence</strong><br/>
          View AI-generated insights including risk assessments, value opportunities, and strategic recommendations based on your project data.
        `,
        side: "left",
        align: "start",
      },
    },
    {
      element: '[data-tour="ai-actions"]',
      popover: {
        title: "⚡ Quick Actions",
        description: `
          <strong>Accelerate Your Work</strong><br/>
          Use pre-built action templates to quickly generate analysis, reports, and recommendations for your transformation project.
          <br/><br/>
          <strong>🎉 Tour Complete!</strong> You're ready to leverage AI for your finance transformation project.
        `,
        side: "left",
        align: "start",
      },
    },
  ],
};

export const GuidedTour: React.FC<GuidedTourProps> = ({ tourType = "full-workflow", currentPhase = 1, onTourComplete, onTourSkip }) => {
  const driverRef = useRef<any>(null);

  // Get tour steps based on tour type
  const getTourSteps = useCallback(() => {
    switch (tourType) {
      case "full-workflow":
        return TRANSFORMATION_TOUR_STEPS.fullWorkflow;
      case "phase-specific":
        return TRANSFORMATION_TOUR_STEPS.phaseSpecific[currentPhase as keyof typeof TRANSFORMATION_TOUR_STEPS.phaseSpecific] || [];
      case "ai-assistant":
        return TRANSFORMATION_TOUR_STEPS.aiAssistant;
      case "onboarding":
        return TRANSFORMATION_TOUR_STEPS.phaseSpecific[1] || [];
      default:
        return TRANSFORMATION_TOUR_STEPS.fullWorkflow;
    }
  }, [tourType, currentPhase]);

  // Initialize driver instance with proper close functionality
  const initializeDriver = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }

    driverRef.current = driver({
      showProgress: true,
      allowClose: true,
      popoverClass: "driverjs-theme-custom",
      nextBtnText: "Next →",
      prevBtnText: "← Previous",
      doneBtnText: "✨ Finish",
      onCloseClick: () => {
        console.log("Close button clicked");
        if (driverRef.current) {
          driverRef.current.destroy();
        }
        onTourSkip?.();
      },
      onPopoverRender: (popover, { config, state }) => {
        const stepIndex = (state as any)?.activeIndex ?? 0;
        const totalSteps = (state as any)?.totalSteps ?? 0;
        console.log(`Rendering step ${stepIndex + 1} of ${totalSteps}`);

        // Add click outside to close functionality
        setTimeout(() => {
          const overlay = document.querySelector(".driver-overlay");
          if (overlay) {
            overlay.addEventListener("click", e => {
              if (e.target === overlay && driverRef.current) {
                console.log("Overlay clicked - closing tour");
                driverRef.current.destroy();
                onTourSkip?.();
              }
            });
          }
        }, 100);
      },
      onDestroyStarted: () => {
        console.log("Tour finishing...");
        onTourComplete?.();
      },
      onDestroyed: () => {
        console.log("Tour completed");
        driverRef.current = null;

        // Clean up any event listeners
        const overlay = document.querySelector(".driver-overlay");
        if (overlay) {
          overlay.replaceWith(overlay.cloneNode(true));
        }
      },
    });

    return driverRef.current;
  }, [onTourComplete, onTourSkip]);

  // Start the tour with better debugging
  const startTour = useCallback(() => {
    const steps = getTourSteps();
    console.log(
      `Starting ${tourType} tour with ${steps.length} total steps:`,
      steps.map(s => s.element)
    );

    if (steps.length === 0) {
      console.warn("No tour steps available for", tourType);
      return;
    }

    // Check which elements exist in the DOM with detailed logging
    const elementCheck = steps.map(step => {
      const element = document.querySelector(step.element);
      const exists = element !== null;
      const htmlElement = element as HTMLElement;
      const isVisible = exists && htmlElement && htmlElement.offsetParent !== null;

      console.log(`Element ${step.element}:`, {
        exists,
        isVisible,
        element: element,
        offsetParent: htmlElement?.offsetParent,
      });

      return { step, exists, isVisible, element };
    });

    // Filter to only include visible elements
    const availableSteps = elementCheck.filter(({ exists, isVisible }) => exists && isVisible).map(({ step }) => step);

    console.log(`✅ Available steps: ${availableSteps.length}/${steps.length}`);
    availableSteps.forEach((step, index) => {
      console.log(`  Step ${index + 1}: ${step.popover.title}`);
    });

    if (availableSteps.length === 0) {
      console.error("❌ No visible tour elements found in DOM for", tourType);

      // Show which elements are missing
      const missingElements = elementCheck.filter(({ exists, isVisible }) => !exists || !isVisible).map(({ step }) => step.element);

      console.error("Missing elements:", missingElements);
      return;
    }

    // Initialize driver and start tour
    try {
      const driverInstance = initializeDriver();
      driverInstance.setSteps(availableSteps);

      // Add a small delay to ensure DOM is fully ready
      setTimeout(() => {
        driverInstance.drive();
      }, 100);
    } catch (error) {
      console.error("Error starting tour:", error);
    }
  }, [getTourSteps, tourType, initializeDriver]);

  // Auto-start tour for onboarding with longer delay
  useEffect(() => {
    if (tourType === "onboarding") {
      const timer = setTimeout(() => {
        startTour();
      }, 2000); // Increased delay to ensure all elements are rendered

      return () => clearTimeout(timer);
    }
  }, [tourType, startTour]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
        driverRef.current = null;
      }
    };
  }, []);

  // Tour control functions
  const skipTour = useCallback(() => {
    console.log("Manually skipping tour");
    if (driverRef.current) {
      driverRef.current.destroy();
    }
    onTourSkip?.();
  }, [onTourSkip]);

  // Render tour control buttons
  const renderTourControls = () => {
    if (tourType === "onboarding") return null;

    const getTourDescription = () => {
      switch (tourType) {
        case "full-workflow":
          return "Complete walkthrough of the Finance Transformation Blueprint methodology";
        case "phase-specific":
          return `Focused guidance for Phase ${currentPhase} activities and deliverables`;
        case "ai-assistant":
          return "Explore AI-powered features for expert transformation consulting";
        default:
          return "Interactive tour of key application features";
      }
    };

    return (
      <div className="tour-controls flex items-center space-x-3">
        <div className="flex flex-col space-y-1">
          <Button onClick={startTour} variant="outline" size="sm" className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
            <PlayCircle className="h-4 w-4 mr-2" />
            Start {tourType.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())} Tour
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderTourControls()}

      {/* Enhanced custom styles with better close functionality */}
      <style jsx global>{`
        .driverjs-theme-custom {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-width: 420px;
          min-width: 300px;
          z-index: 10001;
        }

        .driverjs-theme-custom .driver-popover-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 8px;
          padding-right: 30px; /* Space for close button */
        }

        .driverjs-theme-custom .driver-popover-description {
          font-size: 14px;
          line-height: 1.6;
          color: #4b5563;
          margin-bottom: 12px;
        }

        .driverjs-theme-custom .driver-popover-description ul {
          font-size: 13px;
          line-height: 1.5;
          margin: 8px 0;
        }

        .driverjs-theme-custom .driver-popover-description li {
          margin-bottom: 4px;
        }

        .driverjs-theme-custom .driver-popover-description strong {
          color: #7c3aed;
          font-weight: 600;
        }

        .driverjs-theme-custom .driver-popover-footer {
          border-top: 1px solid #f3f4f6;
          padding-top: 12px;
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .driverjs-theme-custom .driver-popover-next-btn,
        .driverjs-theme-custom .driver-popover-done-btn {
          background: #7c3aed !important;
          color: white !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 8px 16px !important;
          font-weight: 500 !important;
          transition: background 0.2s !important;
          cursor: pointer !important;
          font-size: 14px !important;
        }

        .driverjs-theme-custom .driver-popover-next-btn:hover,
        .driverjs-theme-custom .driver-popover-done-btn:hover {
          background: #6d28d9 !important;
        }

        .driverjs-theme-custom .driver-popover-prev-btn {
          background: #f3f4f6 !important;
          color: #6b7280 !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 8px 16px !important;
          font-weight: 500 !important;
          margin-right: 8px !important;
          transition: background 0.2s !important;
          cursor: pointer !important;
          font-size: 14px !important;
        }

        .driverjs-theme-custom .driver-popover-prev-btn:hover {
          background: #e5e7eb !important;
        }

        .driverjs-theme-custom .driver-popover-prev-btn:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }

        .driverjs-theme-custom .driver-popover-close-btn {
          color: #9ca3af !important;
          font-size: 18px !important;
          font-weight: bold !important;
          line-height: 1 !important;
          padding: 4px 8px !important;
          border-radius: 4px !important;
          transition: all 0.2s !important;
          cursor: pointer !important;
          position: absolute !important;
          top: 12px !important;
          right: 12px !important;
          background: none !important;
          border: none !important;
          z-index: 10002 !important;
        }

        .driverjs-theme-custom .driver-popover-close-btn:hover {
          color: #ef4444 !important;
          background: #fef2f2 !important;
        }

        .driver-overlay {
          background: rgba(0, 0, 0, 0.5) !important;
          z-index: 10000 !important;
          cursor: pointer !important;
        }

        .driver-highlighted-element {
          box-shadow: 0 0 0 4px #7c3aed, 0 0 0 8px rgba(124, 58, 237, 0.2) !important;
          border-radius: 8px !important;
          z-index: 10000 !important;
        }

        .driver-popover {
          z-index: 10001 !important;
        }

        .driver-popover-progress-text {
          color: #7c3aed !important;
          font-weight: 500 !important;
          font-size: 12px !important;
        }

        /* Ensure buttons are always clickable */
        .driverjs-theme-custom button {
          pointer-events: auto !important;
          user-select: none !important;
        }

        /* Make overlay clickable to close */
        .driver-overlay::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
        }
      `}</style>
    </>
  );
};

export default GuidedTour;
