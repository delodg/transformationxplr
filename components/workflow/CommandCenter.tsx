"use client";

import React, { useMemo, useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Zap,
  Brain,
  Users,
  FileText,
  BarChart3,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  Settings,
  ArrowRight,
  Plus,
  DollarSign,
  Building,
  Globe,
  Briefcase,
  Database,
  AlertCircle,
  Lightbulb,
  Activity,
  Sparkles,
  Timer,
  RefreshCw,
  ChevronDown,
  HelpCircle,
  Rocket,
  Star,
  Award,
  MessageSquare,
  Workflow,
  Search,
  BookOpen,
} from "lucide-react";
// Types for UI compatibility
import { TransformationProject, AIInsight } from "../../types";

// Simple toast notification function
const showToast = (message: string, type: "success" | "info" | "warning" = "info") => {
  // Create a simple toast element
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-300 ${
    type === "success" ? "bg-green-600" : type === "warning" ? "bg-yellow-600" : "bg-blue-600"
  }`;
  toast.textContent = message;
  toast.style.transform = "translateX(100%)";

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

interface CommandCenterProps {
  currentProject: TransformationProject;
  aiInsights: AIInsight[];
  companies?: any[]; // Real companies from database
  onNewProject: () => void;
  onShowAIAssistant: () => void;
  onExportDeck: () => void;
  onViewAnalytics: () => void;
  onCompanyChange?: (companyKey: string) => void;
  selectedCompany?: string;
  // New cross-section navigation functions
  onNavigateToPhase?: (phaseNumber: number) => void;
  onViewPhaseAnalytics?: (phaseNumber: number) => void;
  onAccessHackettIP?: (category?: string) => void;
}

// Company data mapping for the selector
const COMPANY_OPTIONS = [
  { value: "mastec", label: "MasTec Power Delivery", industry: "Infrastructure & Construction", region: "North America", currentPhase: 1 },
  { value: "global-tech", label: "Global Tech Solutions", industry: "Technology & Software", region: "Global", currentPhase: 2 },
  { value: "meridian-manufacturing", label: "Meridian Manufacturing Corp", industry: "Manufacturing & Industrial", region: "Europe", currentPhase: 1 },
  { value: "apex-financial", label: "Apex Financial Services", industry: "Financial Services", region: "North America", currentPhase: 1 },
];

interface CompanyOption {
  value: string;
  label: string;
  industry: string;
  region?: string;
  status?: string;
  currentPhase?: number;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  currentProject,
  aiInsights,
  companies = [], // Real companies from database
  onNewProject,
  onShowAIAssistant,
  onExportDeck,
  onViewAnalytics,
  onCompanyChange,
  selectedCompany = "mastec",
  onNavigateToPhase,
  onViewPhaseAnalytics,
  onAccessHackettIP,
}) => {
  // Help modal state
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Memoized calculations for better performance
  const formatCurrency = useCallback((value: number) => {
    // Use a deterministic formatting to avoid hydration mismatches
    if (value >= 1000000) {
      const millions = value / 1000000;
      return `$${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
    } else if (value >= 1000) {
      const thousands = value / 1000;
      return `$${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    // Use a deterministic date formatting to avoid hydration mismatches
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }, []);

  // **CRITICAL FIX**: Use real companies from database instead of demo data
  const companyOptions: CompanyOption[] = useMemo(() => {
    if (companies && companies.length > 0) {
      return companies.map(company => ({
        value: company.id,
        label: company.clientName,
        industry: company.industry,
        region: company.region,
        status: company.status,
        currentPhase: company.currentPhase,
      }));
    }
    // Fallback to demo data only if no real companies
    return COMPANY_OPTIONS;
  }, [companies]);

  console.log("🏢 CommandCenter companies:", companies?.length || 0, "real companies");
  console.log("🎯 Company options:", companyOptions.length, "options available");

  // Enhanced insights calculations
  const phaseInsights = useMemo(() => {
    return aiInsights.filter(insight => insight.phase === currentProject.currentPhase);
  }, [aiInsights, currentProject.currentPhase]);

  // Get selected company info for display
  const selectedCompanyInfo = useMemo(() => {
    return companyOptions.find(option => option.value === selectedCompany);
  }, [companyOptions, selectedCompany]);

  const totalEstimatedValue = useMemo(() => {
    return aiInsights.filter(insight => insight.estimatedValue).reduce((total, insight) => total + (insight.estimatedValue || 0), 0);
  }, [aiInsights]);

  const highImpactInsights = useMemo(() => {
    return aiInsights.filter(insight => insight.impact === "high");
  }, [aiInsights]);

  const averageConfidence = useMemo(() => {
    const confidenceSum = aiInsights.reduce((sum, insight) => sum + insight.confidence, 0);
    return Math.round(confidenceSum / aiInsights.length);
  }, [aiInsights]);

  // Enhanced progress calculation
  const progressStatus = useMemo(() => {
    const progress = Math.round(currentProject.progress); // Ensure whole numbers
    if (progress >= 80) return { color: "green", status: "Excellent" };
    if (progress >= 60) return { color: "blue", status: "On Track" };
    if (progress >= 40) return { color: "yellow", status: "In Progress" };
    return { color: "orange", status: "Starting" };
  }, [currentProject.progress]);

  // Enhanced time calculations
  const timeMetrics = useMemo(() => {
    const startDate = new Date(currentProject.startDate);
    const endDate = new Date(currentProject.estimatedCompletion);
    // Use a fixed date for consistent server/client rendering (demo mode)
    const currentDate = new Date("2025-01-15T00:00:00Z");

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, totalDays - elapsedDays);

    return {
      totalDays,
      elapsedDays,
      remainingDays,
      isOverdue: currentDate > endDate,
    };
  }, [currentProject.startDate, currentProject.estimatedCompletion]);

  // Handle company selection change
  const handleCompanyChange = useCallback(
    (value: string) => {
      if (onCompanyChange) {
        onCompanyChange(value);
      }
    },
    [onCompanyChange]
  );

  return (
    <div className="space-y-6" role="main" aria-label="Transformation XPLR Command Center">
      {/* Company Selection Header */}
      <div className="analytics-chart-card">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building className="h-5 w-5 text-purple-600" />
                </div>
                <span>Company Analysis Dashboard</span>
              </h3>
              <p className="analytics-subtitle">Select a company to view their transformation scorecard and insights</p>
            </div>

            <div className="flex items-center space-x-3" data-tour="company-selection">
              <Select value={selectedCompany} onValueChange={handleCompanyChange}>
                <SelectTrigger className="w-[300px]" aria-label="Select company for analysis">
                  <SelectValue placeholder="Select company">{companyOptions.find(c => c.value === selectedCompany)?.label || "Select a company"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.length === 0 ? (
                    <SelectItem value="no-companies" disabled>
                      No companies available - Create your first company
                    </SelectItem>
                  ) : (
                    companyOptions.map(company => (
                      <SelectItem key={company.value} value={company.value}>
                        <div className="flex flex-col text-left">
                          <span className="font-medium">{company.label}</span>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{company.industry}</span>
                            {company.region && <span>• {company.region}</span>}
                            {company.currentPhase && <span>• Phase {company.currentPhase}</span>}
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {/* Debug info for companies */}
              <div className="text-xs text-gray-500">
                {companies?.length || 0} companies loaded
                {companyOptions.length !== companies?.length && <span className="text-orange-600"> (using demo data)</span>}
              </div>

              <Button variant="outline" size="sm" onClick={() => handleCompanyChange(selectedCompany)} className="bg-white/60 hover:bg-white/80">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                <Globe className="h-3 w-3 mr-1" />
                {currentProject.region}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                <Briefcase className="h-3 w-3 mr-1" />
                {currentProject.engagementType}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                Phase {currentProject.currentPhase} Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="analytics-metric-card p-6 cursor-pointer transition-all duration-300 hover:scale-105" onClick={onNewProject} data-tour="new-project">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">New Project</div>
              <div className="text-sm text-gray-500">Start transformation</div>
            </div>
          </div>
        </div>

        <div className="analytics-metric-card p-6 cursor-pointer transition-all duration-300 hover:scale-105" onClick={onShowAIAssistant}>
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">AI Assistant</div>
              <div className="text-sm text-gray-500">{phaseInsights.length} insights ready</div>
            </div>
          </div>
        </div>

        <div className="analytics-metric-card p-6 cursor-pointer transition-all duration-300 hover:scale-105" onClick={onExportDeck}>
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
              <Download className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Export Deck</div>
              <div className="text-sm text-gray-500">Generate presentation</div>
            </div>
          </div>
        </div>

        <div className="analytics-metric-card p-6 cursor-pointer transition-all duration-300 hover:scale-105" onClick={onViewAnalytics}>
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Analytics</div>
              <div className="text-sm text-gray-500">Performance metrics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="executive-metric-card bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 id="hero-heading" className="text-3xl font-bold mb-2">
                {selectedCompanyInfo?.label || currentProject?.clientName || "Company Overview"}
              </h1>
              <p className="text-blue-100 text-lg" aria-describedby="hero-heading">
                AI-Powered Transformation Dashboard
              </p>
              <div className="flex items-center space-x-2 mt-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Activity className="h-3 w-3 mr-1" />
                  {progressStatus.status}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Confidence: {averageConfidence}%
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6" role="region" aria-label="Key Performance Metrics">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20" role="article" aria-labelledby="ai-acceleration-metric">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-6 w-6 text-green-300" aria-hidden="true" />
                <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-400">
                  Live
                </Badge>
              </div>
              <div className="text-2xl font-bold" id="ai-acceleration-metric" aria-describedby="ai-acceleration-desc">
                {Math.round(currentProject.aiAcceleration)}%
              </div>
              <div className="text-sm text-blue-100">AI Acceleration</div>
              <div className="text-xs text-blue-200 mt-1" id="ai-acceleration-desc">
                vs 35% average
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <Database className="h-6 w-6 text-blue-300" />
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-100 border-blue-400">
                  Matched
                </Badge>
              </div>
              <div className="text-2xl font-bold">{currentProject.hackettIPMatches.toString()}</div>
              <div className="text-sm text-blue-100">Hackett IP Assets</div>
              <div className="text-xs text-blue-200 mt-1">{highImpactInsights.length} high-impact</div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-6 w-6 text-yellow-300" />
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-100 border-yellow-400">
                  Estimated
                </Badge>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(totalEstimatedValue)}</div>
              <div className="text-sm text-blue-100">AI-Identified Value</div>
              <div className="text-xs text-blue-200 mt-1">From {aiInsights.length} insights</div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-6 w-6 text-purple-300" />
                <Badge variant="secondary" className={`bg-${progressStatus.color}-500/20 text-${progressStatus.color}-100 border-${progressStatus.color}-400`}>
                  {progressStatus.status}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{Math.round(currentProject.progress)}%</div>
              <div className="text-sm text-blue-100">Project Complete</div>
              <div className="text-xs text-blue-200 mt-1">{timeMetrics.remainingDays} days remaining</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Project Overview */}
      <div className="analytics-chart-card">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <span>{currentProject.clientName}</span>
              </h3>
              <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                <span>{currentProject.engagementType}</span>
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                  Phase {currentProject.currentPhase}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`${currentProject.status === "analysis" ? "border-purple-500 text-purple-700 bg-purple-50" : "border-gray-500 text-gray-700 bg-gray-50"}`}>
                {currentProject.status.charAt(0).toUpperCase() + currentProject.status.slice(1)}
              </Badge>
              {timeMetrics.isOverdue && (
                <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="analytics-metric-card p-4 flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{currentProject.industry}</div>
                <div className="text-sm text-gray-500">{currentProject.region}</div>
              </div>
            </div>
            <div className="analytics-metric-card p-4 flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{formatDate(currentProject.startDate)}</div>
                <div className="text-sm text-gray-500">Started ({timeMetrics.elapsedDays} days ago)</div>
              </div>
            </div>
            <div className="analytics-metric-card p-4 flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Timer className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{formatDate(currentProject.estimatedCompletion)}</div>
                <div className="text-sm text-gray-500">{timeMetrics.remainingDays > 0 ? `${timeMetrics.remainingDays} days left` : "Past due"}</div>
              </div>
            </div>
            <div className="analytics-metric-card p-4 flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{formatCurrency(currentProject.projectValue || totalEstimatedValue)}</div>
                <div className="text-sm text-gray-500">Project Value</div>
              </div>
            </div>
          </div>

          <div className="analytics-metric-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-900">Overall Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">{Math.round(currentProject.progress)}%</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    progressStatus.color === "green"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : progressStatus.color === "blue"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : progressStatus.color === "yellow"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-orange-50 text-orange-700 border-orange-200"
                  }`}
                >
                  {progressStatus.status}
                </Badge>
              </div>
            </div>
            <div className="enterprise-progress-bar mb-3">
              <div className="progress-fill" style={{ width: `${Math.round(currentProject.progress)}%` }}></div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Started {formatDate(currentProject.startDate)}</span>
              <span>Target: {formatDate(currentProject.estimatedCompletion)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced AI Insights */}
      <div className="analytics-chart-card">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <span>AI-Powered Insights</span>
              </h3>
              <p className="analytics-subtitle">Intelligent recommendations and analysis for current project phase</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {phaseInsights.length} Active
              </Badge>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                Avg Confidence: {averageConfidence}%
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {phaseInsights.slice(0, 3).map(insight => (
              <div key={insight.id} className="analytics-metric-card p-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-xl ${insight.impact === "high" ? "bg-red-100 text-red-600" : insight.impact === "medium" ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"}`}
                  >
                    {insight.type === "automation" && <Zap className="h-5 w-5" />}
                    {insight.type === "opportunity" && <Target className="h-5 w-5" />}
                    {insight.type === "risk" && <AlertCircle className="h-5 w-5" />}
                    {insight.type === "benchmark" && <BarChart3 className="h-5 w-5" />}
                    {insight.type === "recommendation" && <Lightbulb className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                        {insight.estimatedValue && (
                          <Badge variant="outline" className="text-green-600 border-green-200 text-xs bg-green-50">
                            {formatCurrency(insight.estimatedValue)}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                          {insight.confidence}% confidence
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            insight.impact === "high"
                              ? "text-red-600 border-red-200 bg-red-50"
                              : insight.impact === "medium"
                              ? "text-yellow-600 border-yellow-200 bg-yellow-50"
                              : "text-blue-600 border-blue-200 bg-blue-50"
                          }`}
                        >
                          {insight.impact} impact
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Source: {insight.source}</span>
                        {insight.timeframe && <span>Timeline: {insight.timeframe}</span>}
                      </div>
                      {insight.actionable && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Actionable
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {phaseInsights.length > 3 && (
              <div className="analytics-metric-card p-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <span>+{phaseInsights.length - 3} more insights available</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            )}

            {phaseInsights.length === 0 && (
              <div className="analytics-metric-card p-8 text-center">
                <div className="p-4 bg-gray-100 rounded-xl w-fit mx-auto mb-4">
                  <Brain className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">No insights for current phase</h4>
                <p className="text-sm text-gray-500">AI analysis is in progress for Phase {currentProject.currentPhase}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Phase Navigation Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Quick Phase Navigation
        </h3>

        {/* Enhanced Phase Grid with Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map(phaseNum => {
            const isCurrentPhase = currentProject.currentPhase === phaseNum;
            const isCompleted = currentProject.currentPhase > phaseNum;
            const isPending = currentProject.currentPhase < phaseNum;

            return (
              <Button
                key={phaseNum}
                variant={isCurrentPhase ? "default" : "secondary"}
                size="sm"
                className={`
                  relative min-h-[60px] flex flex-col items-center justify-center p-3 transition-all duration-200
                  ${
                    isCurrentPhase
                      ? "bg-white text-purple-600 border-white shadow-lg ring-2 ring-white/50 transform scale-105"
                      : isCompleted
                      ? "bg-green-600/80 text-white border-green-500/50 hover:bg-green-600"
                      : isPending
                      ? "bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white"
                      : "bg-white/20 text-white border-white/30 hover:bg-white/30"
                  }
                  hover:transform hover:scale-102 hover:shadow-lg
                  focus:ring-2 focus:ring-white/50 focus:outline-none
                `}
                onClick={() => {
                  console.log(`🚀 Phase Navigation: Attempting to navigate to Phase ${phaseNum}`);
                  console.log("Current project:", currentProject);
                  console.log("onNavigateToPhase callback:", onNavigateToPhase);

                  if (!onNavigateToPhase) {
                    console.error("❌ onNavigateToPhase callback is not defined!");
                    showToast("Navigation error: Callback not defined", "warning");
                    return;
                  }

                  onNavigateToPhase(phaseNum);
                  showToast(`Navigated to Phase ${phaseNum}`, "success");
                  console.log(`✅ Navigation to Phase ${phaseNum} triggered successfully`);
                }}
              >
                {/* Phase Status Icon */}
                <div className="flex items-center justify-center mb-1">
                  {isCompleted ? <CheckCircle className="h-4 w-4" /> : isCurrentPhase ? <Activity className="h-4 w-4 animate-pulse" /> : <Target className="h-4 w-4" />}
                </div>

                {/* Phase Number and Label */}
                <div className="text-xs font-semibold">Phase {phaseNum}</div>

                {/* Status Badge */}
                {isCurrentPhase && <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>}
                {isCompleted && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>}
              </Button>
            );
          })}
        </div>

        {/* Phase Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-white/80">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <span>Current Phase</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <span>Upcoming</span>
          </div>
        </div>
      </div>

      {/* Enhanced Analytics and IP Access */}
      <div className="mt-8">
        <h4 className="text-base font-medium text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Quick Actions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-white/30 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 min-h-[50px]"
            onClick={() => {
              console.log(`📊 Analytics Navigation: Attempting to view analytics for Phase ${currentProject.currentPhase}`);
              console.log("onViewPhaseAnalytics callback:", onViewPhaseAnalytics);

              if (!onViewPhaseAnalytics) {
                console.error("❌ onViewPhaseAnalytics callback is not defined!");
                showToast("Analytics navigation error: Callback not defined", "warning");
                return;
              }

              onViewPhaseAnalytics(currentProject.currentPhase);
              showToast(`Viewing Phase ${currentProject.currentPhase} Analytics`, "success");
              console.log(`✅ Analytics navigation triggered successfully`);
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Phase Analytics</span>
            </div>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-white/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 min-h-[50px]"
            onClick={() => {
              console.log(`📚 Hackett IP Navigation: Attempting to access Hackett IP Library`);
              console.log("onAccessHackettIP callback:", onAccessHackettIP);

              if (!onAccessHackettIP) {
                console.error("❌ onAccessHackettIP callback is not defined!");
                showToast("Hackett IP navigation error: Callback not defined", "warning");
                return;
              }

              onAccessHackettIP("Finance Transformation");
              showToast("Accessing Hackett IP Library", "success");
              console.log(`✅ Hackett IP navigation triggered successfully`);
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <Database className="h-4 w-4" />
              <span className="text-xs">Hackett IP Library</span>
            </div>
          </Button>
        </div>

        {/* Additional Help Action */}
        <div className="mt-3">
          <Button
            variant="secondary"
            size="sm"
            className="w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 text-white border-white/30 hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-200 min-h-[50px]"
            onClick={() => {
              console.log("📖 Opening Help Modal");
              setShowHelpModal(true);
              showToast("Opening User Guide", "info");
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Help & User Guide</span>
              <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                New
              </Badge>
            </div>
          </Button>
        </div>
      </div>

      {/* Help Modal */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <HelpCircle className="h-6 w-6 text-purple-600" />
              Transformation XPLR - User Guide
            </DialogTitle>
            <DialogDescription className="text-base">Your complete guide to accelerating finance transformation with AI-powered insights</DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-4">
            {/* Overview Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-purple-600">
                <Rocket className="h-5 w-5" />
                What You'll Achieve
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium">50% Faster Delivery</span>
                    </div>
                    <p className="text-sm text-gray-600">Complete finance transformation projects in half the time with AI-powered automation</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">1,247+ Hackett IP Assets</span>
                    </div>
                    <p className="text-sm text-gray-600">Access to comprehensive intellectual property and proven methodologies</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">AI-Powered Analysis</span>
                    </div>
                    <p className="text-sm text-gray-600">Intelligent insights, automated documentation, and smart recommendations</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Professional Deliverables</span>
                    </div>
                    <p className="text-sm text-gray-600">Export presentation-ready documents and comprehensive project reports</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 7-Phase Journey */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-purple-600">
                <Workflow className="h-5 w-5" />
                7-Phase Transformation Journey
              </div>

              <div className="space-y-3">
                {[
                  {
                    phase: 1,
                    title: "Project Initiation & Setup",
                    description: "AI-powered client onboarding, engagement setup, and team configuration",
                    features: ["Smart company data population", "Automated requirements analysis", "Team role assignment"],
                  },
                  {
                    phase: 2,
                    title: "Parallel Workstream Management",
                    description: "Coordinated data collection across multiple streams with AI assistance",
                    features: ["Executive interviews", "Stakeholder surveys", "Benchmark data collection"],
                  },
                  {
                    phase: 3,
                    title: "AI-Powered Synthesis & Analysis",
                    description: "Intelligent data triangulation and gap analysis with automated insights",
                    features: ["Multi-source data integration", "AI-driven pattern recognition", "Target operating model definition"],
                  },
                  {
                    phase: 4,
                    title: "Initiative Identification & Prioritization",
                    description: "Smart recommendations with ROI calculations and value quantification",
                    features: ["AI-generated initiatives", "Automated ROI calculations", "Intelligent prioritization"],
                  },
                  {
                    phase: 5,
                    title: "Roadmap Development",
                    description: "Dynamic roadmap construction with dependency management",
                    features: ["Interactive Gantt charts", "Resource allocation", "Business case preparation"],
                  },
                  {
                    phase: 6,
                    title: "Client Review & Handover",
                    description: "Interactive presentations and collaborative solution finalization",
                    features: ["Professional deliverable export", "Client collaboration tools", "Solution validation"],
                  },
                  {
                    phase: 7,
                    title: "Implementation Tracking",
                    description: "Progress monitoring and benefits realization tracking",
                    features: ["Real-time progress updates", "Success metrics reporting", "Continuous optimization"],
                  },
                ].map(phase => (
                  <Card key={phase.phase} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600">{phase.phase}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{phase.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {phase.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Navigation Guide */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-purple-600">
                <Search className="h-5 w-5" />
                How to Navigate
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Command Center</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Your project overview and quick navigation hub</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• View project status and key metrics</li>
                      <li>• Access quick phase navigation</li>
                      <li>• Launch AI assistant and analytics</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Workflow className="h-4 w-4 text-green-600" />
                      <span className="font-medium">7-Phase Workflow</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Detailed phase management and execution</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Track progress through each phase</li>
                      <li>• Access deliverables and milestones</li>
                      <li>• Generate AI analysis and insights</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Analytics Dashboard</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Comprehensive project insights and reporting</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• View detailed company analysis</li>
                      <li>• Track phase completion metrics</li>
                      <li>• Export reports and presentations</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Hackett IP Library</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Access comprehensive intellectual property</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Browse 1,247+ proven methodologies</li>
                      <li>• Filter by industry and phase</li>
                      <li>• Get personalized recommendations</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-purple-600">
                <Brain className="h-5 w-5" />
                AI-Powered Features
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardContent className="p-4">
                    <Lightbulb className="h-8 w-8 text-blue-600 mb-2" />
                    <h4 className="font-semibold mb-2">Smart Insights</h4>
                    <p className="text-sm text-gray-600">AI analyzes your data to provide contextual recommendations and identify opportunities</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-blue-50">
                  <CardContent className="p-4">
                    <MessageSquare className="h-8 w-8 text-green-600 mb-2" />
                    <h4 className="font-semibold mb-2">AI Assistant</h4>
                    <p className="text-sm text-gray-600">Get instant help and guidance throughout your transformation journey</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="p-4">
                    <FileText className="h-8 w-8 text-purple-600 mb-2" />
                    <h4 className="font-semibold mb-2">Auto Documentation</h4>
                    <p className="text-sm text-gray-600">Automatically generate professional reports and presentations</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Getting Started */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-purple-600">
                <Star className="h-5 w-5" />
                Getting Started
              </div>

              <Card className="bg-gradient-to-r from-purple-100 to-blue-100">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <span className="font-medium">Create a new project using the "New Project" button</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <span className="font-medium">Complete the AI-powered client onboarding process</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <span className="font-medium">Navigate through the 7-phase workflow with AI guidance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <span className="font-medium">Use analytics and Hackett IP for enhanced insights</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowHelpModal(false)}>
              Close Guide
            </Button>
            <Button
              onClick={() => {
                setShowHelpModal(false);
                onNewProject();
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
