"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Brain, Users, BarChart3, Target, Settings, Workflow, Database, TrendingUp, Lightbulb, FileText, Globe, Activity, DollarSign, Clock, AlertCircle, CheckCircle } from "lucide-react";

// Import our modular components
import { CommandCenter } from "../components/workflow/CommandCenter";
import { WorkflowPhases } from "../components/workflow/WorkflowPhases";
import { AIAssistant } from "../components/ai/AIAssistant";
import { ClientOnboardingModal } from "../components/onboarding/ClientOnboarding";

// Import types and data
import { TransformationProject, AIInsight, WorkflowPhase, ClientOnboarding } from "../types";
import { SAMPLE_PROJECT, WORKFLOW_PHASES, AI_INSIGHTS, COMPANY_DATASETS } from "../constants/workflowData";

const TransformationXPLR: React.FC = () => {
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

  // Enhanced state for new features
  const [isAnalyticsMode, setIsAnalyticsMode] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: "success" | "info" | "warning" | "error"; timestamp: string }[]>([]);

  // Initialize application with sample data
  useEffect(() => {
    // Simulate real-time updates with better progress management
    const interval = setInterval(() => {
      // Update progress incrementally with whole numbers only
      setCurrentProject(prev => ({
        ...prev,
        progress: Math.min(Math.floor(prev.progress + Math.random() * 2), 100), // Whole numbers only
      }));

      // Update workflow phases progress
      setWorkflowPhases(prev =>
        prev.map(phase => ({
          ...phase,
          progress: phase.status === "in-progress" ? Math.min(Math.floor(phase.progress + Math.random() * 3), 100) : phase.progress,
        }))
      );
    }, 45000); // Less frequent updates

    return () => clearInterval(interval);
  }, []);

  // Enhanced notification system
  const addNotification = (message: string, type: "success" | "info" | "warning" | "error" = "success") => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [...prev, notification].slice(-3)); // Keep last 3 notifications
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Enhanced progress calculation
  const calculateOverallProgress = () => {
    const completedPhases = workflowPhases.filter(p => p.status === "completed").length;
    const inProgressPhases = workflowPhases.filter(p => p.status === "in-progress");
    const totalPhaseProgress = workflowPhases.reduce((total, phase) => total + phase.progress, 0);

    return Math.floor(totalPhaseProgress / workflowPhases.length);
  };

  // Enhanced event handlers
  const handleNewProject = () => {
    addNotification("Starting new project creation...", "info");
    setShowOnboarding(true);
  };

  const handleClientOnboardingSubmit = (data: ClientOnboarding) => {
    console.log("New project data:", data);

    // Create new project from onboarding data with enhanced validation
    const newProject: TransformationProject = {
      id: `project_${Date.now()}`,
      clientName: data.companyName,
      industry: data.industry,
      engagementType: "Finance Transformation Blueprint",
      status: "initiation",
      progress: 5, // Start with 5% to show initiation
      aiAcceleration: Math.floor(35 + Math.random() * 25), // 35-60% range, whole numbers
      startDate: new Date().toISOString().split("T")[0],
      estimatedCompletion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      teamMembers: ["AI Assistant", "Project Manager", "Lead Analyst"],
      hackettIPMatches: Math.floor(800 + Math.random() * 600),
      region: data.region,
      projectValue: 0,
      currentPhase: 1,
    };

    setCurrentProject(newProject);
    setShowOnboarding(false);

    // Reset workflow phases for new project with enhanced status
    setWorkflowPhases(
      WORKFLOW_PHASES.map(phase => ({
        ...phase,
        status: phase.id === 1 ? "in-progress" : "pending",
        progress: phase.id === 1 ? 15 : 0, // Start phase 1 with some progress
      }))
    );

    // Show success notification
    addNotification(`New project "${data.companyName}" created successfully!`, "success");
    setActiveTab("command-center");
  };

  const handlePhaseSelect = (phase: WorkflowPhase) => {
    setSelectedPhase(phase);
    setCurrentProject(prev => ({
      ...prev,
      currentPhase: phase.id,
      progress: calculateOverallProgress(), // Update overall progress
    }));
    addNotification(`Focused on Phase ${phase.id}: ${phase.title}`, "info");
  };

  const handleViewPhaseDetails = (phase: WorkflowPhase) => {
    setSelectedPhase(phase);
    setActiveTab("workflow");
    addNotification(`Viewing details for Phase ${phase.id}`, "info");
  };

  const handleExportDeck = () => {
    addNotification("Deck export initiated - generating PowerPoint presentation...", "info");
    // Simulate export progress
    setTimeout(() => {
      addNotification("Deck export completed successfully!", "success");
    }, 3000);
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
          progress:
            phase.id < companyData.project.currentPhase
              ? 100
              : phase.id === companyData.project.currentPhase
              ? Math.floor(50 + Math.random() * 40) // Random progress for current phase
              : 0,
        }))
      );
    }
  };

  // Handle phase state changes
  const handlePhaseStateChange = (phaseId: number, newStatus: WorkflowPhase["status"], newProgress: number = 0) => {
    setWorkflowPhases(prev => prev.map(phase => (phase.id === phaseId ? { ...phase, status: newStatus, progress: newProgress } : phase)));

    // Update current project progress based on phase changes
    const updatedPhases = workflowPhases.map(phase => (phase.id === phaseId ? { ...phase, status: newStatus, progress: newProgress } : phase));
    const overallProgress = calculateOverallProgress();
    setCurrentProject(prev => ({ ...prev, progress: overallProgress }));

    // Add notification based on the action
    const phaseName = `Phase ${phaseId}`;
    switch (newStatus) {
      case "in-progress":
        addNotification(`${phaseName} started successfully`, "info");
        break;
      case "completed":
        addNotification(`${phaseName} completed successfully!`, "success");
        break;
      case "ai-enhanced":
        addNotification(`${phaseName} enhanced with AI acceleration`, "info");
        break;
      case "pending":
        if (newProgress === 0) {
          addNotification(`${phaseName} reset to initial state`, "warning");
        } else {
          addNotification(`${phaseName} paused`, "warning");
        }
        break;
    }
  };

  // Handle AI Assistant integration from WorkflowPhases
  const handleAIAssistantOpen = (action: string, context: any) => {
    // Open AI Assistant and set the action as input
    setShowAIAssistant(true);

    // Use a small delay to ensure the AI Assistant is open before setting input
    setTimeout(() => {
      // Find the AI Assistant's input setter and use it
      // The action is already a complete prompt that can be sent directly
      const aiAssistantElement = document.querySelector("[data-ai-assistant-input]");
      if (aiAssistantElement) {
        (aiAssistantElement as any).value = action;
      }
    }, 100);

    addNotification(`AI Assistant opened with ${context.enhancementRequest || "phase enhancement"} request`, "info");
  };

  // Enhanced Analytics component with comprehensive metrics and visualizations
  const AnalyticsView = React.useMemo(() => {
    const phaseCompletionData = workflowPhases.map(phase => ({
      phase: `Phase ${phase.id}`,
      completed: phase.progress,
      target: 100,
      aiAcceleration: phase.aiAcceleration,
      status: phase.status,
    }));

    const valueMetrics = aiInsights
      .filter(insight => insight.estimatedValue)
      .reduce((acc, insight) => {
        const category = insight.type;
        acc[category] = (acc[category] || 0) + (insight.estimatedValue || 0);
        return acc;
      }, {} as Record<string, number>);

    const riskDistribution = aiInsights.reduce((acc, insight) => {
      acc[insight.impact] = (acc[insight.impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const timelineData = workflowPhases.map(phase => ({
      phase: `P${phase.id}`,
      traditional: parseInt(phase.traditionalDuration.replace(/\D/g, "")) || 1,
      aiEnhanced: parseInt(phase.duration.replace(/\D/g, "")) || 1,
      savings: phase.aiAcceleration,
    }));

    const overallMetrics = {
      totalValue: Object.values(valueMetrics).reduce((sum, val) => sum + val, 0),
      avgConfidence: Math.round(aiInsights.reduce((sum, i) => sum + i.confidence, 0) / aiInsights.length),
      completionRate: Math.round(workflowPhases.reduce((sum, p) => sum + p.progress, 0) / workflowPhases.length),
      riskScore: riskDistribution.high * 3 + riskDistribution.medium * 2 + riskDistribution.low * 1,
      timeSavings: Math.round(timelineData.reduce((sum, t) => sum + (t.traditional - t.aiEnhanced), 0)),
      efficiencyGain: Math.round(workflowPhases.reduce((sum, p) => sum + p.aiAcceleration, 0) / workflowPhases.length),
    };

    return () => (
      <div className="analytics-section space-y-8">
        {/* Executive Summary Dashboard */}
        <div className="mb-8">
          <h2 className="analytics-title text-3xl mb-2">Enterprise Analytics Dashboard</h2>
          <p className="analytics-subtitle text-lg">Real-time insights and performance metrics for {currentProject.clientName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="executive-metric-card bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-8 w-8" />
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                Live
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tight">{overallMetrics.completionRate}%</div>
              <div className="text-blue-100 font-medium">Project Progress</div>
              <div className="text-blue-200 text-sm">vs {Math.round(overallMetrics.completionRate * 0.85)}% industry benchmark</div>
            </div>
          </div>

          <div className="executive-metric-card bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Zap className="h-8 w-8" />
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                AI Powered
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tight">{Math.round(currentProject.aiAcceleration)}%</div>
              <div className="text-purple-100 font-medium">AI Acceleration</div>
              <div className="text-purple-200 text-sm">{overallMetrics.timeSavings} weeks saved</div>
            </div>
          </div>

          <div className="executive-metric-card bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="h-8 w-8" />
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                Value
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tight">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(overallMetrics.totalValue)}
              </div>
              <div className="text-emerald-100 font-medium">Identified Value</div>
              <div className="text-emerald-200 text-sm">{aiInsights.filter(i => i.estimatedValue).length} opportunities</div>
            </div>
          </div>

          <div className="executive-metric-card bg-gradient-to-br from-amber-600 to-orange-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Target className="h-8 w-8" />
              </div>
              <Badge variant="secondary" className={`bg-white/20 text-white border-white/30 backdrop-blur-sm`}>
                {overallMetrics.riskScore <= 10 ? "Low Risk" : overallMetrics.riskScore <= 20 ? "Med Risk" : "High Risk"}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tight">{overallMetrics.avgConfidence}%</div>
              <div className="text-amber-100 font-medium">AI Confidence</div>
              <div className="text-amber-200 text-sm">Risk Score: {overallMetrics.riskScore}</div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Phase Progress Chart */}
          <div className="analytics-chart-card">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Phase Progress & AI Impact</span>
                  </h3>
                  <p className="analytics-subtitle">7-phase workflow completion with AI acceleration metrics</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Real-time
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {phaseCompletionData.map((phase, index) => (
                  <div key={index} className="analytics-metric-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                            phase.status === "completed"
                              ? "bg-gradient-to-br from-green-500 to-emerald-600"
                              : phase.status === "in-progress" || phase.status === "ai-enhanced"
                              ? "bg-gradient-to-br from-blue-500 to-blue-600"
                              : "bg-gradient-to-br from-gray-400 to-gray-500"
                          }`}
                        >
                          {phase.status === "completed" ? <CheckCircle className="h-5 w-5" /> : <span className="text-sm">{index + 1}</span>}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{phase.phase}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                phase.status === "completed"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : phase.status === "in-progress" || phase.status === "ai-enhanced"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                              }`}
                            >
                              {phase.status.replace("-", " ").toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{Math.round(phase.completed)}%</div>
                        <Badge variant="outline" className="text-xs mt-1 bg-purple-50 text-purple-700 border-purple-200">
                          <Zap className="h-3 w-3 mr-1" />+{Math.round(phase.aiAcceleration)}% AI
                        </Badge>
                      </div>
                    </div>
                    <div className="enterprise-progress-bar mb-2">
                      <div className="progress-fill" style={{ width: `${Math.round(phase.completed)}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Target: 100%</span>
                      <span>AI Acceleration: +{Math.round(phase.aiAcceleration)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Value Distribution */}
          <div className="analytics-chart-card">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span>Value Distribution by Category</span>
                  </h3>
                  <p className="analytics-subtitle">Estimated value breakdown across insight categories</p>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  ${(overallMetrics.totalValue / 1000000).toFixed(1)}M Total
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                {Object.entries(valueMetrics).map(([category, value], index) => {
                  const percentage = (value / overallMetrics.totalValue) * 100;
                  return (
                    <div key={category} className="analytics-metric-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              category === "automation"
                                ? "bg-purple-500"
                                : category === "opportunity"
                                ? "bg-green-500"
                                : category === "recommendation"
                                ? "bg-blue-500"
                                : category === "benchmark"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span className="text-sm font-semibold capitalize text-gray-900">{category}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              notation: "compact",
                              maximumFractionDigits: 1,
                            }).format(value)}
                          </div>
                          <div className="text-sm text-gray-500">{Math.round(percentage)}% of total</div>
                        </div>
                      </div>
                      <div className="value-bar-container">
                        <div className={`value-bar-fill category-${category}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Risk Analysis & Timeline Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Risk Distribution */}
          <div className="analytics-chart-card">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <span>Risk Analysis</span>
                  </h3>
                  <p className="analytics-subtitle">Risk distribution and confidence levels</p>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    overallMetrics.riskScore <= 10
                      ? "bg-green-50 text-green-700 border-green-200"
                      : overallMetrics.riskScore <= 20
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  Score: {overallMetrics.riskScore}
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(riskDistribution).map(([level, count]) => {
                  const percentage = (count / aiInsights.length) * 100;
                  return (
                    <div key={level} className={`risk-card risk-${level}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${level === "high" ? "bg-red-500" : level === "medium" ? "bg-yellow-500" : "bg-green-500"} text-white`}>
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <span className={`font-semibold capitalize ${level === "high" ? "text-red-800" : level === "medium" ? "text-yellow-800" : "text-green-800"}`}>{level} Risk</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${level === "high" ? "text-red-800" : level === "medium" ? "text-yellow-800" : "text-green-800"}`}>{count}</div>
                          <div className="text-sm text-gray-600">{Math.round(percentage)}%</div>
                        </div>
                      </div>
                      <div className="enterprise-progress-bar">
                        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 analytics-metric-card p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-semibold text-gray-900">AI Analysis Summary</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Score:</span>
                      <span className="font-medium">{overallMetrics.riskScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-medium">{overallMetrics.avgConfidence}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actionable:</span>
                      <span className="font-medium">
                        {aiInsights.filter(i => i.actionable).length}/{aiInsights.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Critical:</span>
                      <span className="font-medium text-red-600">{riskDistribution.high || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Timeline Efficiency */}
          <div className="analytics-chart-card">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Timeline Efficiency</span>
                  </h3>
                  <p className="analytics-subtitle">Traditional vs AI-enhanced project timelines</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {overallMetrics.timeSavings}w Saved
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                {timelineData.map((phase, index) => (
                  <div key={index} className="analytics-metric-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">{index + 1}</div>
                        <span className="font-semibold text-gray-900">{phase.phase}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                          <span className="line-through text-red-500">{phase.traditional}w</span> → <span className="text-green-600 font-medium">{phase.aiEnhanced}w</span>
                        </div>
                        <div className="text-sm font-semibold text-green-600">-{Math.round(((phase.traditional - phase.aiEnhanced) / phase.traditional) * 100)}%</div>
                      </div>
                    </div>
                    <div className="timeline-bar-container mb-2">
                      <div className="timeline-bar-traditional" style={{ width: `${(phase.traditional / Math.max(...timelineData.map(t => t.traditional))) * 100}%` }}></div>
                      <div className="timeline-bar-ai" style={{ width: `${(phase.aiEnhanced / Math.max(...timelineData.map(t => t.traditional))) * 100}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Saved: {phase.traditional - phase.aiEnhanced} weeks</span>
                      <span>AI boost: {Math.round(phase.savings)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 analytics-metric-card p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-blue-900">Efficiency Summary</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">{overallMetrics.timeSavings}</div>
                    <div className="text-sm text-blue-600">Weeks Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">{overallMetrics.efficiencyGain}%</div>
                    <div className="text-sm text-blue-600">Avg Efficiency</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Performance Insights */}
        <div className="analytics-chart-card">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="analytics-title text-2xl mb-2 flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <span>Strategic Insights & Recommendations</span>
                </h3>
                <p className="analytics-subtitle text-lg">AI-powered analysis and strategic recommendations for {currentProject.clientName}</p>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-sm">
                Executive Summary
              </Badge>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="analytics-metric-card p-6 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-500 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-bold text-green-900 text-lg">Key Strengths</span>
                </div>
                <ul className="space-y-3 text-green-800">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{Math.round(currentProject.aiAcceleration)}% AI acceleration (above industry average)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{workflowPhases.filter(p => p.status === "completed").length} phases completed successfully</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">High confidence insights ({overallMetrics.avgConfidence}% average)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Strong value identification pipeline</span>
                  </li>
                </ul>
              </div>

              <div className="analytics-metric-card p-6 border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-yellow-500 rounded-xl">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-bold text-yellow-900 text-lg">Watch Areas</span>
                </div>
                <ul className="space-y-3 text-yellow-800">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{riskDistribution.medium || 0} medium-risk items need monitoring</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Phase {currentProject.currentPhase + 1} dependency planning</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Resource allocation for peak phases</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Stakeholder alignment timing</span>
                  </li>
                </ul>
              </div>

              <div className="analytics-metric-card p-6 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-bold text-blue-900 text-lg">Strategic Recommendations</span>
                </div>
                <ul className="space-y-3 text-blue-800">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Accelerate high-value automation projects</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Increase AI adoption in Phase {currentProject.currentPhase + 1}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Focus on {riskDistribution.high || 0} high-risk mitigations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Optimize team for {overallMetrics.efficiencyGain}% efficiency gain</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [currentProject, workflowPhases, aiInsights]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => {
            const bgColor = {
              success: "bg-green-500",
              info: "bg-blue-500",
              warning: "bg-yellow-500",
              error: "bg-red-500",
            }[notification.type];

            return (
              <div key={notification.id} className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right duration-300`}>
                {notification.message}
              </div>
            );
          })}
        </div>
      )}

      <div className="mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transformation XPLR</h1>
            <p className="text-gray-600">AI-Powered Finance Transformation Platform</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Live Project
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setShowAIAssistant(true)}>
              <Brain className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4" role="tablist" aria-label="Main navigation tabs">
            <TabsTrigger value="command-center" className="flex items-center space-x-2" role="tab" aria-selected={activeTab === "command-center"} aria-controls="command-center-panel">
              <Target className="h-4 w-4" aria-hidden="true" />
              <span>Command Center</span>
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center space-x-2" role="tab" aria-selected={activeTab === "workflow"} aria-controls="workflow-panel">
              <Workflow className="h-4 w-4" aria-hidden="true" />
              <span>7-Phase Workflow</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2" role="tab" aria-selected={activeTab === "analytics"} aria-controls="analytics-panel">
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="hackett-ip" className="flex items-center space-x-2" role="tab" aria-selected={activeTab === "hackett-ip"} aria-controls="hackett-ip-panel">
              <Database className="h-4 w-4" aria-hidden="true" />
              <span>Hackett IP</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="command-center" id="command-center-panel" role="tabpanel" aria-labelledby="command-center-tab">
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
          </TabsContent>

          <TabsContent value="workflow" id="workflow-panel" role="tabpanel" aria-labelledby="workflow-tab">
            <WorkflowPhases
              phases={workflowPhases}
              currentPhase={currentProject.currentPhase}
              onPhaseSelect={handlePhaseSelect}
              onViewDetails={handleViewPhaseDetails}
              onPhaseStateChange={handlePhaseStateChange}
              onAIAssistantOpen={handleAIAssistantOpen}
            />
          </TabsContent>

          <TabsContent value="analytics" id="analytics-panel" role="tabpanel" aria-labelledby="analytics-tab">
            <AnalyticsView />
          </TabsContent>

          <TabsContent value="hackett-ip">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-purple-600" />
                  <span>Hackett Intellectual Property</span>
                </CardTitle>
                <CardDescription>
                  Access to {currentProject.hackettIPMatches} matched intellectual property assets for {currentProject.clientName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "Benchmark Datasets", count: 234, icon: BarChart3, color: "blue" },
                    { title: "Best Practice Frameworks", count: 156, icon: Target, color: "green" },
                    { title: "Process Templates", count: 189, icon: FileText, color: "purple" },
                    { title: "Industry Case Studies", count: 98, icon: Lightbulb, color: "orange" },
                    { title: "Automation Playbooks", count: 145, icon: Zap, color: "yellow" },
                    { title: "Global Standards", count: 425, icon: Globe, color: "indigo" },
                  ].map((category, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                            <category.icon className={`h-5 w-5 text-${category.color}-600`} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{category.title}</div>
                            <div className="text-sm text-gray-500">{category.count} assets</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">AI-Matched Recommendations</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Based on your {currentProject.industry} industry and Phase {currentProject.currentPhase} requirements, our AI has identified the most relevant assets for your transformation
                    journey.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AIAssistant isVisible={showAIAssistant} onClose={() => setShowAIAssistant(false)} currentProject={currentProject} aiInsights={aiInsights} workflowPhases={workflowPhases} />

      <ClientOnboardingModal isVisible={showOnboarding} onClose={() => setShowOnboarding(false)} onSubmit={handleClientOnboardingSubmit} />
    </div>
  );
};

export default TransformationXPLR;
