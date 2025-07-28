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
      <div className="space-y-6">
        {/* Executive Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-6 w-6 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Live
                </Badge>
              </div>
              <div className="text-2xl font-bold">{overallMetrics.completionRate}%</div>
              <div className="text-sm opacity-80">Project Progress</div>
              <div className="text-xs opacity-60 mt-1">vs {Math.round(overallMetrics.completionRate * 0.85)}% industry avg</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Zap className="h-6 w-6 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  AI
                </Badge>
              </div>
              <div className="text-2xl font-bold">{Math.round(currentProject.aiAcceleration)}%</div>
              <div className="text-sm opacity-80">AI Acceleration</div>
              <div className="text-xs opacity-60 mt-1">{overallMetrics.timeSavings} weeks saved</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-6 w-6 opacity-80" />
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Value
                </Badge>
              </div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(overallMetrics.totalValue)}
              </div>
              <div className="text-sm opacity-80">Identified Value</div>
              <div className="text-xs opacity-60 mt-1">{aiInsights.filter(i => i.estimatedValue).length} opportunities</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-6 w-6 opacity-80" />
                <Badge variant="secondary" className={`bg-white/20 text-white border-white/30`}>
                  {overallMetrics.riskScore <= 10 ? "Low" : overallMetrics.riskScore <= 20 ? "Med" : "High"}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{overallMetrics.avgConfidence}%</div>
              <div className="text-sm opacity-80">AI Confidence</div>
              <div className="text-xs opacity-60 mt-1">Risk Score: {overallMetrics.riskScore}</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Phase Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Phase Progress & AI Impact</span>
              </CardTitle>
              <CardDescription>7-phase workflow completion with AI acceleration metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phaseCompletionData.map((phase, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{phase.phase}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{Math.round(phase.completed)}%</span>
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          {Math.round(phase.aiAcceleration)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={Math.round(phase.completed)} className="h-3" />
                      <div className="absolute top-0 right-0 h-3 w-1 bg-purple-500 rounded-r" style={{ width: `${Math.min(phase.aiAcceleration / 2, 50)}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Status: {phase.status}</span>
                      <span>AI boost: +{Math.round(phase.aiAcceleration)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Value Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Value Distribution by Category</span>
              </CardTitle>
              <CardDescription>Estimated value breakdown across insight categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(valueMetrics).map(([category, value], index) => {
                  const percentage = (value / overallMetrics.totalValue) * 100;
                  const colors = {
                    automation: "bg-purple-500",
                    opportunity: "bg-green-500",
                    recommendation: "bg-blue-500",
                    benchmark: "bg-yellow-500",
                    risk: "bg-red-500",
                  };
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{category}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              notation: "compact",
                            }).format(value)}
                          </div>
                          <div className="text-xs text-gray-500">{Math.round(percentage)}%</div>
                        </div>
                      </div>
                      <div className="relative h-2 bg-gray-200 rounded-full">
                        <div className={`absolute top-0 left-0 h-2 rounded-full ${colors[category as keyof typeof colors] || "bg-gray-500"}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Analysis & Timeline Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span>Risk Analysis</span>
              </CardTitle>
              <CardDescription>Risk distribution and confidence levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(riskDistribution).map(([level, count]) => {
                  const colors = {
                    high: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200", bar: "bg-red-500" },
                    medium: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200", bar: "bg-yellow-500" },
                    low: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200", bar: "bg-green-500" },
                  };
                  const color = colors[level as keyof typeof colors];
                  const percentage = (count / aiInsights.length) * 100;

                  return (
                    <div key={level} className={`p-3 rounded-lg border ${color?.bg} ${color?.border}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium capitalize ${color?.text}`}>{level} Risk</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${color?.text}`}>{count} insights</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(percentage)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="h-2 bg-white/50 rounded-full">
                        <div className={`h-2 rounded-full ${color?.bar}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">AI Analysis Summary</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>
                    • Risk Score: {overallMetrics.riskScore} ({overallMetrics.riskScore <= 10 ? "Low" : overallMetrics.riskScore <= 20 ? "Medium" : "High"} overall risk)
                  </li>
                  <li>• Average Confidence: {overallMetrics.avgConfidence}% across all insights</li>
                  <li>
                    • Actionable Items: {aiInsights.filter(i => i.actionable).length} of {aiInsights.length} insights
                  </li>
                  <li>• Immediate Attention: {riskDistribution.high || 0} high-risk items</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Timeline Efficiency</span>
              </CardTitle>
              <CardDescription>Traditional vs AI-enhanced project timelines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineData.map((phase, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{phase.phase}</span>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {phase.traditional}w → {phase.aiEnhanced}w
                        </div>
                        <div className="text-xs font-medium text-green-600">-{Math.round(((phase.traditional - phase.aiEnhanced) / phase.traditional) * 100)}%</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                        <div className="absolute top-0 left-0 h-2 bg-red-300 rounded-full" style={{ width: `${(phase.traditional / Math.max(...timelineData.map(t => t.traditional))) * 100}%` }}></div>
                        <div
                          className="absolute top-0 left-0 h-2 bg-green-500 rounded-full"
                          style={{ width: `${(phase.aiEnhanced / Math.max(...timelineData.map(t => t.traditional))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Saved: {phase.traditional - phase.aiEnhanced} weeks</span>
                      <span>AI boost: {Math.round(phase.savings)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Efficiency Summary</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-blue-800">Total Time Saved</div>
                    <div className="text-blue-600">{overallMetrics.timeSavings} weeks</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-800">Avg Efficiency Gain</div>
                    <div className="text-blue-600">{overallMetrics.efficiencyGain}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span>Performance Insights & Recommendations</span>
            </CardTitle>
            <CardDescription>AI-powered analysis and strategic recommendations for {currentProject.clientName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Strengths</span>
                </div>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• {Math.round(currentProject.aiAcceleration)}% AI acceleration (above average)</li>
                  <li>• {workflowPhases.filter(p => p.status === "completed").length} phases completed successfully</li>
                  <li>• High confidence insights ({overallMetrics.avgConfidence}% avg)</li>
                  <li>• Strong value identification pipeline</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Watch Areas</span>
                </div>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• {riskDistribution.medium || 0} medium-risk items need monitoring</li>
                  <li>• Phase {currentProject.currentPhase + 1} dependency planning</li>
                  <li>• Resource allocation for peak phases</li>
                  <li>• Stakeholder alignment timing</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Recommendations</span>
                </div>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Accelerate high-value automation projects</li>
                  <li>• Increase AI adoption in Phase {currentProject.currentPhase + 1}</li>
                  <li>• Focus on {riskDistribution.high || 0} high-risk mitigations</li>
                  <li>• Optimize team for {overallMetrics.efficiencyGain}% efficiency</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
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
