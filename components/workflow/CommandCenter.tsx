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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
    const currentDate = new Date();

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
      <Card className="border-l-4 border-l-purple-500 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Building className="h-5 w-5 text-purple-600" />
                <span>Company Analysis Dashboard</span>
              </CardTitle>
              <CardDescription>Select a company to view their transformation scorecard and insights</CardDescription>
            </div>

            <div className="flex items-center space-x-3">
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
              <Button variant="outline" size="sm" onClick={() => handleCompanyChange(selectedCompany)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-600">
                <Globe className="h-3 w-3 mr-1" />
                {currentProject.region}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-600">
                <Briefcase className="h-3 w-3 mr-1" />
                {currentProject.engagementType}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-600">
                <Activity className="h-3 w-3 mr-1" />
                Phase {currentProject.currentPhase} Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button onClick={onNewProject} className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <Plus className="h-6 w-6" />
          <div className="text-center">
            <div className="text-sm font-medium">New Project</div>
            <div className="text-xs opacity-80">Start transformation</div>
          </div>
        </Button>

        <Button onClick={onShowAIAssistant} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 border-purple-200">
          <Brain className="h-6 w-6 text-purple-600" />
          <div className="text-center">
            <div className="text-sm font-medium">AI Assistant</div>
            <div className="text-xs text-gray-500">{phaseInsights.length} insights ready</div>
          </div>
        </Button>

        <Button onClick={onExportDeck} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 border-green-200">
          <Download className="h-6 w-6 text-green-600" />
          <div className="text-center">
            <div className="text-sm font-medium">Export Deck</div>
            <div className="text-xs text-gray-500">Generate presentation</div>
          </div>
        </Button>

        <Button onClick={onViewAnalytics} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 border-orange-200">
          <BarChart3 className="h-6 w-6 text-orange-600" />
          <div className="text-center">
            <div className="text-sm font-medium">Analytics</div>
            <div className="text-xs text-gray-500">Performance metrics</div>
          </div>
        </Button>
      </div>
      {/* Enhanced Hero Section */}
      <section className="bg-blue-600 text-white rounded-2xl p-8 relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 id="hero-heading" className="text-3xl font-bold mb-2">
                Transformation XPLR
              </h1>
              <p className="text-blue-100 text-lg" aria-describedby="hero-heading">
                AI-Powered Finance Transformation Platform
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Activity className="h-3 w-3 mr-1" />
                  {progressStatus.status}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
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
              <div className="text-2xl font-bold">{currentProject.hackettIPMatches.toLocaleString()}</div>
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
      <Card className="border-l-4 border-l-blue-500 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center space-x-2">
                <Building className="h-5 w-5 text-blue-600" />
                <span>{currentProject.clientName}</span>
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                <span>{currentProject.engagementType}</span>
                <Badge variant="outline" className="text-xs">
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
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">{currentProject.industry}</div>
                <div className="text-sm text-gray-500">{currentProject.region}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">{formatDate(currentProject.startDate)}</div>
                <div className="text-sm text-gray-500">Started ({timeMetrics.elapsedDays} days ago)</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Timer className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">{formatDate(currentProject.estimatedCompletion)}</div>
                <div className="text-sm text-gray-500">{timeMetrics.remainingDays > 0 ? `${timeMetrics.remainingDays} days left` : "Past due"}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">{formatCurrency(currentProject.projectValue || totalEstimatedValue)}</div>
                <div className="text-sm text-gray-500">Project Value</div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{Math.round(currentProject.progress)}%</span>
                <Badge variant="outline" className="text-xs">
                  {progressStatus.status}
                </Badge>
              </div>
            </div>
            <Progress value={Math.round(currentProject.progress)} className="h-3" />
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>Started: {formatDate(currentProject.startDate)}</span>
              <span>Target: {formatDate(currentProject.estimatedCompletion)}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Team Members ({currentProject.teamMembers.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentProject.teamMembers.map((member, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {member === "AI Assistant" && <Brain className="h-3 w-3 mr-1" />}
                  {member}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced AI Insights */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI Insights - Phase {currentProject.currentPhase}</span>
              </CardTitle>
              <CardDescription>Intelligent recommendations and analysis for current project phase</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-100 text-purple-800">{phaseInsights.length} Active</Badge>
              <Badge variant="outline" className="text-xs">
                Avg Confidence: {averageConfidence}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phaseInsights.slice(0, 3).map(insight => (
              <div key={insight.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow">
                <div
                  className={`p-2 rounded-lg ${insight.impact === "high" ? "bg-red-100 text-red-600" : insight.impact === "medium" ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"}`}
                >
                  {insight.type === "automation" && <Zap className="h-4 w-4" />}
                  {insight.type === "opportunity" && <Target className="h-4 w-4" />}
                  {insight.type === "risk" && <AlertCircle className="h-4 w-4" />}
                  {insight.type === "benchmark" && <BarChart3 className="h-4 w-4" />}
                  {insight.type === "recommendation" && <Lightbulb className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <div className="flex items-center space-x-2">
                      {insight.estimatedValue && (
                        <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                          {formatCurrency(insight.estimatedValue)}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          insight.impact === "high" ? "text-red-600 border-red-200" : insight.impact === "medium" ? "text-yellow-600 border-yellow-200" : "text-blue-600 border-blue-200"
                        }`}
                      >
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
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
            ))}

            {phaseInsights.length > 3 && (
              <div className="text-center">
                <Button variant="outline" size="sm" onClick={onShowAIAssistant}>
                  <Brain className="h-4 w-4 mr-2" />
                  View All {phaseInsights.length} Insights
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
