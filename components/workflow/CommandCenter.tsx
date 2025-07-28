"use client";

import React, { useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
} from "lucide-react";
import { TransformationProject, AIInsight } from "../../types";

interface CommandCenterProps {
  currentProject: TransformationProject;
  aiInsights: AIInsight[];
  onNewProject: () => void;
  onShowAIAssistant: () => void;
  onExportDeck: () => void;
  onViewAnalytics: () => void;
  onCompanyChange?: (companyKey: string) => void;
  selectedCompany?: string;
}

// Company data mapping for the selector
const COMPANY_OPTIONS = [
  { value: "mastec", label: "MasTec Power Delivery", industry: "Infrastructure & Construction" },
  { value: "global-tech", label: "Global Tech Solutions", industry: "Technology & Software" },
  { value: "meridian-manufacturing", label: "Meridian Manufacturing Corp", industry: "Manufacturing & Industrial" },
  { value: "apex-financial", label: "Apex Financial Services", industry: "Financial Services" },
];

export const CommandCenter: React.FC<CommandCenterProps> = ({
  currentProject,
  aiInsights,
  onNewProject,
  onShowAIAssistant,
  onExportDeck,
  onViewAnalytics,
  onCompanyChange,
  selectedCompany = "mastec",
}) => {
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

  // Enhanced insights calculations
  const phaseInsights = useMemo(() => {
    return aiInsights.filter(insight => insight.phase === currentProject.currentPhase);
  }, [aiInsights, currentProject.currentPhase]);

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
    const currentDate = new Date("2024-01-15T00:00:00Z");

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
                  <SelectValue placeholder="Select company">{COMPANY_OPTIONS.find(c => c.value === selectedCompany)?.label}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_OPTIONS.map(company => (
                    <SelectItem key={company.value} value={company.value}>
                      <div className="flex flex-col text-left">
                        <span className="font-medium">{company.label}</span>
                        <span className="text-xs text-gray-500">{company.industry}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                Transformation XPLR
              </h1>
              <p className="text-blue-100 text-lg" aria-describedby="hero-heading">
                AI-Powered Finance Transformation Platform
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
    </div>
  );
};
