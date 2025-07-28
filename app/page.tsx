"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Workflow, BarChart3, Database, CheckCircle, AlertCircle, TrendingUp, Zap, Brain, Lightbulb, Users, Plus } from "lucide-react";

import { CommandCenter } from "../components/workflow/CommandCenter";
import { WorkflowPhases } from "../components/workflow/WorkflowPhases";
import { AIAssistant } from "../components/ai/AIAssistant";
import { ClientOnboardingModal } from "../components/onboarding/ClientOnboarding";
import { GuidedTour } from "../components/guidance/GuidedTour";
import { useUser } from "@clerk/nextjs";

// Database imports
import {
  getCompaniesByUser,
  getAIInsightsByCompany,
  getWorkflowPhasesByCompany,
  createCompany,
  bulkCreateAIInsights,
  bulkCreateWorkflowPhases,
  generateId,
  stringifyJSONField,
} from "../lib/db/services";
import type { Company, AIInsight, WorkflowPhase } from "../lib/db/schema";

// Types for UI compatibility
import { TransformationProject, AIInsight as UIAIInsight, WorkflowPhase as UIWorkflowPhase } from "../types";

const TransformationXPLR: React.FC = () => {
  const { user, isLoaded } = useUser();

  // Core application state - now database-driven
  const [activeTab, setActiveTab] = useState("command-center");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentProject, setCurrentProject] = useState<TransformationProject | null>(null);
  const [workflowPhases, setWorkflowPhases] = useState<UIWorkflowPhase[]>([]);
  const [aiInsights, setAIInsights] = useState<UIAIInsight[]>([]);

  // Modal and UI state
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAnalyticsMode, setIsAnalyticsMode] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: "success" | "info" | "warning" | "error"; timestamp: string }[]>([]);

  // Guided tour state
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [tourType, setTourType] = useState<"onboarding" | "phase-specific" | "full-workflow" | "ai-assistant">("full-workflow");
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // Load user's companies and data
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);

      // Load user's companies from database
      const userCompanies = await getCompaniesByUser(user.id);
      setCompanies(userCompanies);

      if (userCompanies.length === 0) {
        // No companies yet - show onboarding
        setIsFirstTimeUser(true);
        setShowOnboarding(true);
      } else {
        // Load first company by default
        const defaultCompany = userCompanies[0];
        setSelectedCompany(defaultCompany.id);
        await loadCompanyData(defaultCompany);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanyData = async (company: Company) => {
    try {
      // Convert database company to UI format
      const projectData: TransformationProject = {
        id: company.id,
        clientName: company.clientName,
        industry: company.industry,
        engagementType: company.engagementType,
        status: company.status as any,
        progress: company.progress,
        aiAcceleration: company.aiAcceleration,
        startDate: company.startDate,
        estimatedCompletion: company.estimatedCompletion,
        teamMembers: JSON.parse(company.teamMembers || "[]"),
        hackettIPMatches: company.hackettIPMatches || 0,
        region: company.region,
        projectValue: company.projectValue || 0,
        currentPhase: company.currentPhase || 1,
        revenue: company.revenue || undefined,
        employees: company.employees || undefined,
        currentERP: company.currentERP || undefined,
        painPoints: JSON.parse(company.painPoints || "[]"),
        objectives: JSON.parse(company.objectives || "[]"),
        timeline: company.timeline || undefined,
        budget: company.budget || undefined,
      };

      setCurrentProject(projectData);

      // Load AI insights for this company
      const insights = await getAIInsightsByCompany(company.id);
      // @ts-ignore - Database schema types need refinement
      const uiInsights: UIAIInsight[] = insights.map((insight: any) => ({
        id: insight.id,
        type: insight.type as any,
        title: insight.title,
        description: insight.description,
        confidence: insight.confidence,
        impact: insight.impact as any,
        source: insight.source,
        phase: insight.phase,
        actionable: insight.actionable ?? true,
        estimatedValue: insight.estimatedValue || undefined,
        timeframe: insight.timeframe || undefined,
      }));
      setAIInsights(uiInsights);

      // Load workflow phases for this company
      const phases = await getWorkflowPhasesByCompany(company.id);
      // @ts-ignore - Database schema types need refinement
      const uiPhases: UIWorkflowPhase[] = phases.map((phase: any) => ({
        id: phase.phaseNumber,
        title: phase.title,
        description: phase.description,
        status: phase.status as any,
        progress: phase.progress || 0,
        aiAcceleration: phase.aiAcceleration || 0,
        duration: phase.duration || "2 weeks",
        traditionalDuration: phase.traditionalDuration || "4 weeks",
        hackettIP: JSON.parse(phase.hackettIP || "[]"),
        deliverables: JSON.parse(phase.deliverables || "[]"),
        aiSuggestions: JSON.parse(phase.aiSuggestions || "[]"),
        keyActivities: JSON.parse(phase.keyActivities || "[]"),
        dependencies: JSON.parse(phase.dependencies || "[]"),
        teamRole: JSON.parse(phase.teamRole || "[]"),
        clientTasks: JSON.parse(phase.clientTasks || "[]"),
        estimatedCompletion: phase.estimatedCompletion || undefined,
        riskFactors: JSON.parse(phase.riskFactors || "[]"),
        successMetrics: JSON.parse(phase.successMetrics || "[]"),
      }));
      setWorkflowPhases(uiPhases);
    } catch (error) {
      console.error("Error loading company data:", error);
    }
  };

  // Check for first-time user and show onboarding tour
  useEffect(() => {
    if (companies.length > 0) {
      const hasVisitedBefore = localStorage.getItem(`transformation-xplr-visited-${user.id}`);
      if (!hasVisitedBefore) {
        setTourType("onboarding");
        setShowGuidedTour(true);
        localStorage.setItem(`transformation-xplr-visited-${user.id}`, "true");
      }
    }
  }, [user.id, companies.length]);

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

  // Enhanced event handlers
  const handleNewProject = () => {
    addNotification("Starting new project creation...", "info");
    setShowOnboarding(true);
  };

  const handleClientOnboardingSubmit = async (data: any) => {
    try {
      addNotification("Analyzing company data with AI...", "info");

      const companyId = generateId();

      // Generate AI analysis based on questionnaire data
      const aiAnalysis = await generateCompanyAnalysis(data);

      // Create company record
      const newCompanyData = {
        id: companyId,
        userId: user.id,
        clientName: data.companyName,
        industry: data.industry,
        engagementType: "Full Transformation",
        status: "initiation" as const,
        progress: 5,
        aiAcceleration: aiAnalysis.estimatedAIAcceleration,
        startDate: new Date().toISOString().split("T")[0],
        estimatedCompletion: aiAnalysis.estimatedCompletion,
        teamMembers: stringifyJSONField([]),
        hackettIPMatches: aiAnalysis.hackettMatches,
        region: data.region,
        projectValue: aiAnalysis.estimatedValue,
        currentPhase: 1,
        revenue: data.revenue,
        employees: data.employees,
        currentERP: data.currentERP,
        painPoints: stringifyJSONField(data.painPoints || []),
        objectives: stringifyJSONField(data.objectives || []),
        timeline: data.timeline,
        budget: data.budget,
      };

      const newCompany = await createCompany(newCompanyData);

      // Generate and save AI insights
      await bulkCreateAIInsights(
        aiAnalysis.insights.map(insight => ({
          id: generateId(),
          companyId: companyId,
          type: insight.type,
          title: insight.title,
          description: insight.description,
          confidence: insight.confidence,
          impact: insight.impact,
          source: insight.source,
          phase: insight.phase,
          actionable: insight.actionable,
          estimatedValue: insight.estimatedValue,
          timeframe: insight.timeframe,
          dependencies: stringifyJSONField(insight.dependencies || []),
          recommendations: stringifyJSONField(insight.recommendations || []),
        }))
      );

      // Generate and save workflow phases
      await bulkCreateWorkflowPhases(
        aiAnalysis.workflowPhases.map(phase => ({
          id: generateId(),
          companyId: companyId,
          phaseNumber: phase.phaseNumber,
          title: phase.title,
          description: phase.description,
          status: phase.status,
          aiAcceleration: phase.aiAcceleration,
          duration: phase.duration,
          traditionalDuration: phase.traditionalDuration,
          hackettIP: stringifyJSONField(phase.hackettIP),
          deliverables: stringifyJSONField(phase.deliverables),
          aiSuggestions: stringifyJSONField(phase.aiSuggestions),
          keyActivities: stringifyJSONField(phase.keyActivities),
          dependencies: stringifyJSONField(phase.dependencies),
          teamRole: stringifyJSONField(phase.teamRole),
          clientTasks: stringifyJSONField(phase.clientTasks),
          progress: 0,
          estimatedCompletion: phase.estimatedCompletion,
          riskFactors: stringifyJSONField(phase.riskFactors),
          successMetrics: stringifyJSONField(phase.successMetrics),
        }))
      );

      // Update state
      const updatedCompanies = [...companies, newCompany];
      setCompanies(updatedCompanies);
      setSelectedCompany(newCompany.id);
      await loadCompanyData(newCompany);

      setShowOnboarding(false);
      addNotification(`AI analysis complete! Generated ${aiAnalysis.insights.length} insights and 7-phase roadmap for ${data.companyName}`, "success");

      // Auto-start onboarding tour
      setTimeout(() => {
        setTourType("onboarding");
        setShowGuidedTour(true);
      }, 2000);
      setActiveTab("command-center");
    } catch (error) {
      console.error("Error creating company analysis:", error);
      addNotification("Error creating company analysis. Please try again.", "error");
    }
  };

  // AI Analysis Generation Function
  const generateCompanyAnalysis = async (data: any) => {
    // This would call your Claude API to generate comprehensive analysis
    const response = await fetch("/api/generate-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to generate analysis");
    }

    return await response.json();
  };

  // Handle company selection change
  const handleCompanyChange = async (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(companyId);
      await loadCompanyData(company);
      addNotification(`Switched to ${company.clientName} analysis`, "info");
    }
  };

  // Other handlers
  const handlePhaseSelect = (phase: UIWorkflowPhase) => {
    if (currentProject) {
      setCurrentProject(prev =>
        prev
          ? {
              ...prev,
              currentPhase: phase.id,
            }
          : null
      );
      addNotification(`Focused on Phase ${phase.id}: ${phase.title}`, "info");
    }
  };

  const handleViewPhaseDetails = (phase: UIWorkflowPhase) => {
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your transformation projects...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no companies
  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: "64px" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Brain className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Transformation XPLR</h1>
            <p className="text-xl text-gray-600 mb-8">AI-Powered Finance Transformation Platform</p>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get started by adding your first company. Our AI will analyze your business and generate a comprehensive 7-phase transformation roadmap with actionable insights.
            </p>
            <Button onClick={handleNewProject} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Company
            </Button>
          </div>
        </div>

        {/* Onboarding Modal */}
        <ClientOnboardingModal isVisible={showOnboarding} onClose={() => setShowOnboarding(false)} onSubmit={handleClientOnboardingSubmit} />
      </div>
    );
  }

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
              <Button onClick={handleNewProject} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {currentProject && (
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
                    setWorkflowPhases(prev => prev.map(phase => (phase.id === phaseId ? { ...phase, status, progress: progress || 0 } : phase)));
                  }}
                  onAIAssistantOpen={handleAIAssistantOpen}
                />
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Generated Analytics Dashboard</CardTitle>
                    <CardDescription>Real-time insights and performance metrics for {currentProject.clientName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Advanced analytics dashboard coming soon</p>
                      <p className="text-sm text-gray-500 mt-2">AI-powered insights will be displayed here</p>
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
                    <CardDescription>
                      Access to {currentProject.hackettIPMatches} matched intellectual property assets for {currentProject.clientName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">AI-curated IP library integration coming soon</p>
                      <p className="text-sm text-gray-500 mt-2">Personalized content based on your company analysis</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Modals */}
      {currentProject && <AIAssistant isVisible={showAIAssistant} onClose={() => setShowAIAssistant(false)} currentProject={currentProject} aiInsights={aiInsights} workflowPhases={workflowPhases} />}

      <ClientOnboardingModal isVisible={showOnboarding} onClose={() => setShowOnboarding(false)} onSubmit={handleClientOnboardingSubmit} />

      {/* Guided Tour */}
      {/* <GuidedTour tourType={tourType} onComplete={handleTourComplete} onSkip={handleTourSkip} /> */}
    </div>
  );
};

export default TransformationXPLR;
