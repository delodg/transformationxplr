"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Workflow, BarChart3, Database, CheckCircle, AlertCircle, TrendingUp, Zap, Brain, Lightbulb, Users, Calendar, DollarSign, Activity, Plus, Settings, Download } from "lucide-react";

import { CommandCenter } from "../components/workflow/CommandCenter";
import { WorkflowPhases } from "../components/workflow/WorkflowPhases";
import { AIAssistant } from "../components/ai/AIAssistant";
import { ClientOnboardingModal } from "../components/onboarding/ClientOnboarding";
import { GuidedTour } from "../components/guidance/GuidedTour";
import { useUser } from "@clerk/nextjs";

// Import types and data from existing files
import { TransformationProject, AIInsight, WorkflowPhase } from "../types";
import { SAMPLE_PROJECT, WORKFLOW_PHASES, AI_INSIGHTS, COMPANY_DATASETS } from "../constants/workflowData";

const TransformationXPLR: React.FC = () => {
  const { user, isLoaded } = useUser();

  // Core application state
  const [activeTab, setActiveTab] = useState("command-center");
  const [selectedCompany, setSelectedCompany] = useState<string>("mastec");
  const [currentProject, setCurrentProject] = useState<TransformationProject>(COMPANY_DATASETS.mastec.project);
  const [workflowPhases, setWorkflowPhases] = useState<WorkflowPhase[]>(WORKFLOW_PHASES);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>(COMPANY_DATASETS.mastec.aiInsights);

  // Modal and UI state
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<WorkflowPhase | null>(null);
  const [isAnalyticsMode, setIsAnalyticsMode] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: "success" | "info" | "warning" | "error"; timestamp: string }[]>([]);

  // Guided tour state
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [tourType, setTourType] = useState<"onboarding" | "phase-specific" | "full-workflow" | "ai-assistant">("full-workflow");
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your transformation dashboard...</p>
        </div>
      </div>
    );
  }

  // Show authentication message if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to access your transformation platform.</p>
        </div>
      </div>
    );
  }

  // Initialize application with sample data
  useEffect(() => {
    // Simulate real-time updates with better progress management
    const interval = setInterval(() => {
      // Update progress incrementally with whole numbers only
      setCurrentProject(prev => ({
        ...prev,
        progress: Math.min(Math.floor(prev.progress + Math.random() * 2), 100),
      }));

      // Update workflow phases progress
      setWorkflowPhases(prev =>
        prev.map(phase => ({
          ...phase,
          progress: phase.status === "in-progress" ? Math.min(Math.floor(phase.progress + Math.random() * 3), 100) : phase.progress,
        }))
      );
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Check for first-time user and show onboarding tour
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem(`transformation-xplr-visited-${user.id}`);
    if (!hasVisitedBefore) {
      setIsFirstTimeUser(true);
      setTourType("onboarding");
      setShowGuidedTour(true);
      localStorage.setItem(`transformation-xplr-visited-${user.id}`, "true");
    }
  }, [user.id]);

  // Enhanced notification system
  const addNotification = (message: string, type: "success" | "info" | "warning" | "error" = "success") => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [...prev, notification].slice(-3));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Enhanced progress calculation
  const calculateOverallProgress = () => {
    const totalPhaseProgress = workflowPhases.reduce((total, phase) => total + phase.progress, 0);
    return Math.floor(totalPhaseProgress / workflowPhases.length);
  };

  // Enhanced event handlers
  const handleNewProject = () => {
    addNotification("Starting new project creation...", "info");
    setShowOnboarding(true);
  };

  const handleClientOnboardingSubmit = (data: any) => {
    console.log("New project data:", data);

    // Generate new company key
    const companyKey = data.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Create comprehensive project data
    const newProject: TransformationProject = {
      id: `project_${Date.now()}`,
      clientName: data.companyName,
      industry: data.industry,
      engagementType: "Finance Transformation Blueprint",
      status: "initiation",
      progress: 5,
      aiAcceleration: Math.floor(35 + Math.random() * 25),
      startDate: new Date().toISOString().split("T")[0],
      estimatedCompletion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      teamMembers: ["AI Assistant", "Project Manager", "Lead Analyst", "Senior Consultant"],
      hackettIPMatches: Math.floor(800 + Math.random() * 600),
      region: data.region,
      projectValue: 0,
      currentPhase: 1,
      revenue: data.revenue,
      employees: data.employees,
      currentERP: data.currentERP,
      painPoints: data.painPoints,
      objectives: data.objectives,
      timeline: data.timeline,
      budget: data.budget,
    };

    // Generate initial AI insights
    const initialInsights: AIInsight[] = [
      {
        id: `insight_${Date.now()}_1`,
        type: "opportunity",
        title: `${data.industry} Best Practices Implementation`,
        description: `Leverage industry-specific best practices to optimize finance operations for ${data.companyName}`,
        confidence: 85,
        impact: "high",
        source: "Industry Analysis",
        phase: 1,
        actionable: true,
        estimatedValue: Math.floor(500000 + Math.random() * 1000000),
        timeframe: "6 months",
      },
      {
        id: `insight_${Date.now()}_2`,
        type: "automation",
        title: "Process Automation Opportunities",
        description: "Identify and implement automation solutions to address identified pain points",
        confidence: 78,
        impact: "medium",
        source: "Pain Point Analysis",
        phase: 2,
        actionable: true,
        estimatedValue: Math.floor(300000 + Math.random() * 800000),
        timeframe: "4 months",
      },
    ];

    // Store in user-specific localStorage
    const userStorageKey = `transformation-xplr-companies-${user.id}`;
    const existingCompanies = JSON.parse(localStorage.getItem(userStorageKey) || "{}");
    existingCompanies[companyKey] = { project: newProject, aiInsights: initialInsights };
    localStorage.setItem(userStorageKey, JSON.stringify(existingCompanies));

    // Update current application state
    setCurrentProject(newProject);
    setAIInsights(initialInsights);
    setSelectedCompany(companyKey);
    setShowOnboarding(false);

    // Reset workflow phases for new project
    setWorkflowPhases(
      WORKFLOW_PHASES.map(phase => ({
        ...phase,
        status: phase.id === 1 ? "in-progress" : "pending",
        progress: phase.id === 1 ? 15 : 0,
      }))
    );

    addNotification(`New project "${data.companyName}" created successfully!`, "success");

    // Auto-start onboarding tour
    setTimeout(() => {
      setTourType("onboarding");
      setShowGuidedTour(true);
    }, 2000);
    setActiveTab("command-center");
  };

  const handlePhaseSelect = (phase: WorkflowPhase) => {
    setSelectedPhase(phase);
    setCurrentProject(prev => ({
      ...prev,
      currentPhase: phase.id,
      progress: calculateOverallProgress(),
    }));
    addNotification(`Focused on Phase ${phase.id}: ${phase.title}`, "info");
  };

  const handleViewPhaseDetails = (phase: WorkflowPhase) => {
    setSelectedPhase(phase);
    setActiveTab("workflow");
    addNotification(`Viewing details for Phase ${phase.id}`, "info");
  };

  const handleAIAssistantOpen = () => {
    setShowAIAssistant(true);
    addNotification("AI Assistant activated", "info");
  };

  const handleExportDeck = () => {
    addNotification("Presentation deck exported successfully", "success");
  };

  const handleViewAnalytics = () => {
    setIsAnalyticsMode(!isAnalyticsMode);
    setActiveTab("analytics");
    addNotification("Analytics view " + (isAnalyticsMode ? "disabled" : "enabled"), "info");
  };

  // Handle company selection change
  const handleCompanyChange = (companyKey: string) => {
    const companyData = COMPANY_DATASETS[companyKey as keyof typeof COMPANY_DATASETS];
    if (companyData) {
      setSelectedCompany(companyKey);
      setCurrentProject(companyData.project);
      setAIInsights(companyData.aiInsights);
      addNotification(`Switched to ${companyData.project.clientName} analysis`, "info");

      // Update workflow phases to match the new company's current phase
      setWorkflowPhases(
        WORKFLOW_PHASES.map(phase => ({
          ...phase,
          status: phase.id < companyData.project.currentPhase ? "completed" : phase.id === companyData.project.currentPhase ? "in-progress" : "pending",
          progress: phase.id < companyData.project.currentPhase ? 100 : phase.id === companyData.project.currentPhase ? Math.floor(50 + Math.random() * 40) : 0,
        })) as WorkflowPhase[]
      );
    }
  };

  // Tour handlers
  const handleStartTour = (type: "onboarding" | "phase-specific" | "full-workflow" | "ai-assistant" = "full-workflow") => {
    setTourType(type);
    setShowGuidedTour(true);
  };

  const handleTourComplete = () => {
    setShowGuidedTour(false);
  };

  const handleTourSkip = () => {
    setShowGuidedTour(false);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: "64px" }}>
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => {
            const bgColors = {
              success: "bg-green-500",
              info: "bg-blue-500",
              warning: "bg-yellow-500",
              error: "bg-red-500",
            };
            return (
              <div
                key={notification.id}
                className={`${bgColors[notification.type]} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out`}
                style={{
                  animation: `slideInRight 0.3s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="flex items-center space-x-2">
                  {notification.type === "success" && <CheckCircle className="h-4 w-4" />}
                  {notification.type === "info" && <AlertCircle className="h-4 w-4" />}
                  {notification.type === "warning" && <AlertCircle className="h-4 w-4" />}
                  {notification.type === "error" && <AlertCircle className="h-4 w-4" />}
                  <span className="text-sm font-medium">{notification.message}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transformation XPLR</h1>
            <p className="text-gray-600">AI-Powered Finance Transformation Platform</p>
            <p className="text-sm text-blue-600">Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Guided Tour Controls */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleStartTour("ai-assistant")}>
                <Lightbulb className="h-4 w-4 mr-2" />
                Help
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleStartTour("full-workflow")}>
                <Users className="h-4 w-4 mr-2" />
                Start Full Workflow Tour
              </Button>
              {isFirstTimeUser && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Live Project
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4" role="tablist" aria-label="Main navigation tabs">
            <TabsTrigger value="command-center" className="flex items-center space-x-2" role="tab">
              <Target className="h-4 w-4" />
              <span>Command Center</span>
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center space-x-2" role="tab">
              <Workflow className="h-4 w-4" />
              <span>7-Phase Workflow</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2" role="tab">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="hackett-ip" className="flex items-center space-x-2" role="tab">
              <Database className="h-4 w-4" />
              <span>Hackett IP</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="command-center">
            <div data-tour="company-selection">
              <CommandCenter
                currentProject={currentProject}
                aiInsights={aiInsights}
                selectedCompany={selectedCompany}
                onNewProject={handleNewProject}
                onShowAIAssistant={() => setShowAIAssistant(true)}
                onExportDeck={handleExportDeck}
                onViewAnalytics={handleViewAnalytics}
                onCompanyChange={handleCompanyChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="workflow">
            <div data-tour="workflow-phases">
              <WorkflowPhases
                phases={workflowPhases}
                currentPhase={currentProject.currentPhase}
                onPhaseSelect={handlePhaseSelect}
                onViewDetails={handleViewPhaseDetails}
                onPhaseStateChange={(phaseId, status, progress) => {
                  setWorkflowPhases(prev => prev.map(phase => (phase.id === phaseId ? { ...phase, status, progress } : phase)));
                }}
                onAIAssistantOpen={handleAIAssistantOpen}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>Real-time insights and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hackett-ip">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hackett IP Library</CardTitle>
                  <CardDescription>Access to {currentProject.hackettIPMatches} matched intellectual property assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">IP library integration coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AIAssistant isVisible={showAIAssistant} onClose={() => setShowAIAssistant(false)} currentProject={currentProject} aiInsights={aiInsights} workflowPhases={workflowPhases} />

      <ClientOnboardingModal isVisible={showOnboarding} onClose={() => setShowOnboarding(false)} onSubmit={handleClientOnboardingSubmit} />

      {/* Guided Tour */}
      <GuidedTour isVisible={showGuidedTour} tourType={tourType} onComplete={handleTourComplete} onSkip={handleTourSkip} />
    </div>
  );
};

export default TransformationXPLR;
