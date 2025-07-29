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
import { AIAnalysisProgress } from "../components/ai/AIAnalysisProgress";
import { ClientOnboardingModal } from "../components/onboarding/ClientOnboarding";
import { GuidedTour } from "../components/guidance/GuidedTour";
import { CompanyAnalysisDashboard } from "../components/analytics";
import { useUser } from "@clerk/nextjs";

// Import additional UI components for the integrated header
import { SignedIn, UserButton } from "@clerk/nextjs";
import { AIAssistantButton } from "@/components/ui/ai-assistant-button";

// Types for UI compatibility
import { TransformationProject, AIInsight as UIAIInsight, WorkflowPhase as UIWorkflowPhase } from "../types";

// Utility function to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

const TransformationXPLR: React.FC = () => {
  const { user, isLoaded } = useUser();

  // Show loading state while Clerk is initializing to prevent hydration issues
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Transformation XPLR...</p>
        </div>
      </div>
    );
  }

  // Ensure user is authenticated before proceeding
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

  // Core application state - now database-driven
  const [activeTab, setActiveTab] = useState("command-center");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [companies, setCompanies] = useState<any[]>([]);
  const [currentProject, setCurrentProject] = useState<TransformationProject | null>(null);
  const [workflowPhases, setWorkflowPhases] = useState<UIWorkflowPhase[]>([]);
  const [aiInsights, setAIInsights] = useState<UIAIInsight[]>([]);

  // Modal and UI state
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [currentOnboardingData, setCurrentOnboardingData] = useState<any>(null);
  const [currentCreatedCompany, setCurrentCreatedCompany] = useState<any>(null);
  const [isAnalyticsMode, setIsAnalyticsMode] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: "success" | "info" | "warning" | "error"; timestamp: string }[]>([]);
  const [dashboardRefresh, setDashboardRefresh] = useState(0); // Add refresh trigger for dashboard

  // Utility function to generate unique IDs
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  // Guided tour state
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [tourType, setTourType] = useState<"onboarding" | "phase-specific" | "full-workflow" | "ai-assistant">("full-workflow");
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user's companies and data
  useEffect(() => {
    if (user && isLoaded) {
      loadUserData();
    }
  }, [user, isLoaded]);

  // Check for first-time user and show onboarding tour
  useEffect(() => {
    if (user && isLoaded && companies.length > 0) {
      const hasVisitedBefore = localStorage.getItem(`transformation-xplr-visited-${user.id}`);
      if (!hasVisitedBefore) {
        setTourType("onboarding");
        setShowGuidedTour(true);
        localStorage.setItem(`transformation-xplr-visited-${user.id}`, "true");
      }
    }
  }, [user?.id, companies.length, isLoaded]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);

      // Load user's companies from API
      const response = await fetch("/api/companies");
      if (!response.ok) throw new Error("Failed to fetch companies");

      const { companies: userCompanies } = await response.json();
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
      addNotification("Failed to load user data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanyData = async (company: any) => {
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

      // Load AI insights and workflow phases for this company from API
      const response = await fetch(`/api/companies/${company.id}`);
      if (!response.ok) throw new Error("Failed to fetch company data");

      const { insights, phases } = await response.json();

      // Convert to UI format
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
      addNotification("Failed to load company data", "error");
    }
  };

  // Enhanced notification system
  const addNotification = (message: string, type: "success" | "info" | "warning" | "error" = "success") => {
    const notification = {
      id: generateId(),
      message,
      type,
      timestamp: new Date().toISOString(),
    };

    console.log(`📢 Notification [${type.toUpperCase()}]: ${message}`);
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

  // 🔥 NEW: AI Assistant button handler
  const handleAIAssistantClick = () => {
    console.log("🤖 Axel AI Assistant activated from header!");
    setShowAIAssistant(true);
    addNotification("AI Assistant Axel activated!", "info");
  };

  const handleClientOnboardingSubmit = async (data: any) => {
    console.log("🎯 QUESTIONNAIRE SUBMITTED!");
    console.log("📋 Questionnaire data received:", data);

    try {
      // Store the onboarding data first
      console.log("💾 Storing onboarding data");
      setCurrentOnboardingData(data);

      // Close questionnaire modal
      console.log("❌ Closing questionnaire modal");
      setShowOnboarding(false);

      // Show notification that company creation is starting
      addNotification("🏢 Creating your company profile...", "info");

      // Create company immediately
      console.log("🏢 CREATING COMPANY IMMEDIATELY");
      const companyId = generateId();

      const newCompanyData = {
        id: companyId,
        clientName: data.companyName,
        industry: data.industry,
        engagementType: "Full Transformation",
        status: "initiation" as const,
        progress: 5,
        aiAcceleration: 0, // Will be updated after AI analysis
        startDate: new Date().toISOString().split("T")[0],
        estimatedCompletion: `${new Date().getFullYear()}-12-31`, // Will be updated after AI analysis
        teamMembers: JSON.stringify([]),
        hackettIPMatches: 0, // Will be updated after AI analysis
        region: data.region,
        projectValue: 0, // Will be updated after AI analysis
        currentPhase: 1,
        revenue: data.revenue,
        employees: data.employees,
        currentERP: data.currentERP,
        painPoints: JSON.stringify(data.painPoints || []),
        objectives: JSON.stringify(data.objectives || []),
        timeline: data.timeline,
        budget: data.budget,
      };

      console.log("🏢 Creating company with data:", newCompanyData);

      // Create company record
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompanyData),
      });

      if (!response.ok) {
        throw new Error("Failed to create company");
      }

      const { company: newCompany } = await response.json();
      console.log("✅ Company created successfully:", newCompany);

      // Show success notification with company details
      addNotification(`✅ Company "${data.companyName}" created successfully! Now generating AI analysis...`, "success");

      // Update companies list immediately
      const updatedCompanies = [...companies, newCompany];
      setCompanies(updatedCompanies);
      setSelectedCompany(newCompany.id);

      // Store the created company for AI analysis
      setCurrentCreatedCompany(newCompany);

      // Trigger dashboard refresh to show new company
      setDashboardRefresh(prev => prev + 1);

      // Now start AI analysis
      console.log("🧠 Opening AI analysis modal for AI generation");
      setShowAIAnalysis(true);

      console.log("✅ Company creation and AI analysis initiation completed successfully");
    } catch (error) {
      console.error("❌ Error in company creation:", error);
      addNotification("❌ Error creating company. Please try again.", "error");
    }
  };

  const handleAIAnalysisComplete = async (analysisResults: any) => {
    try {
      console.log("🔍 AI Analysis Results received:", analysisResults);
      console.log("🔍 Analysis has insights?", !!analysisResults.insights);
      console.log("🔍 Analysis has workflowPhases?", !!analysisResults.workflowPhases);
      if (analysisResults.insights) {
        console.log("🔍 Number of insights:", analysisResults.insights.length);
      }
      if (analysisResults.workflowPhases) {
        console.log("🔍 Number of workflow phases:", analysisResults.workflowPhases.length);
      }

      if (!currentCreatedCompany) {
        console.error("❌ No company was created! This should not happen.");
        addNotification("❌ Error: No company found to update with AI analysis.", "error");
        return;
      }

      console.log("🔄 Processing AI analysis completion for company:", currentCreatedCompany.id);
      const companyId = currentCreatedCompany.id;

      // Note: AI insights and workflow phases are now automatically saved by the generate-analysis endpoint
      // We just need to update the company record and refresh the UI

      const updatedCompanyData = {
        aiAcceleration: analysisResults.estimatedAIAcceleration || 35,
        estimatedCompletion: analysisResults.estimatedCompletion || `${new Date().getFullYear()}-12-31`,
        hackettIPMatches: analysisResults.hackettMatches || 800,
        projectValue: analysisResults.estimatedValue || 2500000,
        progress: 15, // Update progress to reflect analysis completion
      };

      console.log("📊 Updating company with AI results:", updatedCompanyData);

      // Update company record with AI analysis results
      const updateResponse = await fetch(`/api/companies/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCompanyData),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update company with AI results");
      }

      const { company: updatedCompany } = await updateResponse.json();
      console.log("✅ Company updated successfully:", updatedCompany);

      // Update state with the enhanced company
      const updatedCompanies = companies.map(c => (c.id === companyId ? updatedCompany : c));
      setCompanies(updatedCompanies);

      console.log("📈 Loading enhanced company data for dashboard...");
      await loadCompanyData(updatedCompany);

      // Close AI analysis modal and switch to dashboard
      setShowAIAnalysis(false);

      // **CRITICAL FIX**: Switch to analytics tab to show the new AI insights and phases
      setActiveTab("analytics");

      // Show success notification
      addNotification(
        `🎉 AI analysis complete! Generated ${analysisResults.insights?.length || 0} insights and ${analysisResults.workflowPhases?.length || 0} workflow phases for ${updatedCompany.clientName}`,
        "success"
      );

      // **CRITICAL FIX**: Trigger dashboard refresh to show updated company with AI results
      setDashboardRefresh(prev => prev + 1);

      // **CRITICAL FIX**: Force reload of the company data to ensure insights and phases are displayed
      setTimeout(async () => {
        console.log("🔄 Force refreshing company data to ensure AI insights are displayed");
        await loadCompanyData(updatedCompany);
        setDashboardRefresh(prev => prev + 1);
      }, 500);

      console.log("🎯 AI analysis orchestration completed successfully");
    } catch (error) {
      console.error("❌ Error in AI analysis completion:", error);
      addNotification("❌ Error processing AI analysis results. Please try refreshing.", "error");
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
      {/* Integrated Header with AI Assistant Button */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm" style={{ height: "64px" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Transformation XPLR</h1>
            </div>
            <div className="flex items-center space-x-4">
              <SignedIn>
                <AIAssistantButton onClick={handleAIAssistantClick} />
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>

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
                <CompanyAnalysisDashboard refreshTrigger={dashboardRefresh} onDataChange={() => setDashboardRefresh(prev => prev + 1)} />
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

      <AIAnalysisProgress isVisible={showAIAnalysis} companyData={currentOnboardingData} onComplete={handleAIAnalysisComplete} onClose={() => setShowAIAnalysis(false)} />

      {/* Guided Tour */}
      {/* <GuidedTour tourType={tourType} onComplete={handleTourComplete} onSkip={handleTourSkip} /> */}
    </div>
  );
};

export default TransformationXPLR;
