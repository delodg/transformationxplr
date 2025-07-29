"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Target,
  Activity,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Zap,
  RefreshCw,
  AlertCircle,
  Loader2,
  Brain,
} from "lucide-react";
import { TransformationProject, AIInsight, WorkflowPhase } from "@/types";

interface CompanyAnalysisDashboardProps {
  className?: string;
  refreshTrigger?: number; // Add refresh trigger to force data reload
  onDataChange?: () => void; // Callback when data changes (for parent refresh)
}

interface CompanyWithInsights extends TransformationProject {
  insights: AIInsight[];
  phases: WorkflowPhase[];
}

export default function CompanyAnalysisDashboard({ className, refreshTrigger, onDataChange }: CompanyAnalysisDashboardProps) {
  const [companies, setCompanies] = useState<TransformationProject[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Fetch companies on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchCompanies();
  }, [refreshTrigger]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔍 Fetching companies from API...");

      const response = await fetch("/api/companies");
      console.log("📡 Companies API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Companies API error:", response.status, errorText);

        if (response.status === 401) {
          throw new Error("Authentication required. Please sign in.");
        } else if (response.status === 500) {
          throw new Error("Database connection error. Please try again.");
        } else {
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log("📊 Raw API response:", data);
      console.log("🔍 Companies array type:", typeof data.companies, "length:", data.companies?.length);
      console.log("🔍 Sample company data:", data.companies?.[0]);

      setDebugInfo({
        responseStatus: response.status,
        rawData: data,
        companiesCount: data.companies?.length || 0,
        timestamp: new Date().toISOString(),
        companiesArray: data.companies || [],
        sampleCompany: data.companies?.[0] || null,
      });

      if (!data.companies || !Array.isArray(data.companies)) {
        console.warn("⚠️ API response missing companies array:", data);
        console.warn("⚠️ Expected format: { companies: [...] }");
        setCompanies([]);
        return;
      }

      const formattedCompanies = data.companies.map((company: any) => ({
        id: company.id,
        clientName: company.clientName,
        industry: company.industry,
        engagementType: company.engagementType,
        status: company.status,
        progress: company.progress,
        aiAcceleration: company.aiAcceleration,
        startDate: company.startDate,
        estimatedCompletion: company.estimatedCompletion,
        teamMembers: JSON.parse(company.teamMembers || "[]"),
        hackettIPMatches: company.hackettIPMatches || 0,
        region: company.region,
        projectValue: company.projectValue || 0,
        currentPhase: company.currentPhase || 1,
        revenue: company.revenue,
        employees: company.employees,
        currentERP: company.currentERP,
        painPoints: JSON.parse(company.painPoints || "[]"),
        objectives: JSON.parse(company.objectives || "[]"),
        timeline: company.timeline,
        budget: company.budget,
      }));

      console.log("✅ Formatted companies:", formattedCompanies.length, "companies");
      console.log(
        "🏢 Company names:",
        formattedCompanies.map((c: TransformationProject) => c.clientName)
      );
      setCompanies(formattedCompanies);

      // If no companies, provide helpful guidance
      if (formattedCompanies.length === 0) {
        console.log("ℹ️ No companies found for this user - they may need to create their first company");
      } else {
        console.log("🎉 Companies loaded successfully into state!");
      }
    } catch (error) {
      console.error("❌ Error fetching companies:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch companies");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const selectCompany = async (company: TransformationProject) => {
    setInsightsLoading(true);
    setError(null);

    try {
      console.log("🏢 Selecting company:", company.clientName);

      // Fetch detailed company data including insights and phases
      const response = await fetch(`/api/companies/${company.id}`);
      console.log("📡 Company details API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Company details API error:", response.status, errorText);
        throw new Error(`Failed to fetch company details: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 Company details data:", data);
      console.log("🧠 AI Insights found:", data.insights?.length || 0);
      console.log("🔄 Workflow Phases found:", data.phases?.length || 0);

      // **SAFE JSON PARSING HELPER**
      const safeJsonParse = (jsonString: string, fallback: any[] = []) => {
        try {
          return typeof jsonString === "string" ? JSON.parse(jsonString || "[]") : jsonString || fallback;
        } catch (error) {
          console.warn("⚠️ JSON parse error:", error, "Input:", jsonString);
          return fallback;
        }
      };

      // **CRITICAL FIX**: Ensure insights and phases are properly mapped
      const companyWithInsights: CompanyWithInsights = {
        ...company,
        insights: (data.insights || []).map((insight: any) => ({
          ...insight,
          // **FIX**: Parse JSON fields that come as strings from database
          dependencies: safeJsonParse(insight.dependencies, []),
          recommendations: safeJsonParse(insight.recommendations, []),
        })),
        phases: (data.phases || []).map((phase: any) => ({
          ...phase,
          // **FIX**: Parse JSON fields that come as strings from database
          deliverables: safeJsonParse(phase.deliverables, []),
          keyActivities: safeJsonParse(phase.keyActivities, []),
          hackettIP: safeJsonParse(phase.hackettIP, []),
          aiSuggestions: safeJsonParse(phase.aiSuggestions, []),
          dependencies: safeJsonParse(phase.dependencies, []),
          teamRole: safeJsonParse(phase.teamRole, []),
          clientTasks: safeJsonParse(phase.clientTasks, []),
          riskFactors: safeJsonParse(phase.riskFactors, []),
          successMetrics: safeJsonParse(phase.successMetrics, []),
        })),
      };

      console.log("✅ Company selected with", data.insights?.length || 0, "insights and", data.phases?.length || 0, "phases");
      console.log(
        "🔍 Sample insight:",
        data.insights?.[0]
          ? {
              id: data.insights[0].id,
              title: data.insights[0].title,
              type: data.insights[0].type,
            }
          : "No insights found"
      );

      setSelectedCompany(companyWithInsights);

      // **CRITICAL FIX**: If no insights found, show helpful message
      if ((data.insights?.length || 0) === 0) {
        console.log("⚠️ No AI insights found for this company. May need to generate AI analysis.");
      }
    } catch (error) {
      console.error("❌ Error fetching company details:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch company details");
    } finally {
      setInsightsLoading(false);
    }
  };

  const regenerateAIAnalysis = async () => {
    if (!selectedCompany) return;

    setRegenerating(true);
    try {
      console.log("🔄 Regenerating AI analysis for:", selectedCompany.clientName);

      // Call the generate-analysis endpoint to regenerate AI data
      const response = await fetch("/api/generate-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: selectedCompany.id,
          companyName: selectedCompany.clientName,
          industry: selectedCompany.industry,
          region: selectedCompany.region,
          revenue: selectedCompany.revenue,
          employees: selectedCompany.employees,
          currentERP: selectedCompany.currentERP,
          painPoints: selectedCompany.painPoints,
          objectives: selectedCompany.objectives,
          timeline: selectedCompany.timeline,
          budget: selectedCompany.budget,
          engagementType: selectedCompany.engagementType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to regenerate AI analysis");
      }

      const analysisResults = await response.json();
      console.log("✅ AI analysis regenerated successfully:", analysisResults);

      // Refresh the company data to get the updated insights and phases
      await selectCompany(selectedCompany);

      // Trigger parent refresh if callback provided
      if (onDataChange) {
        onDataChange();
      }

      // Show success notification (you can enhance this with a toast library)
      console.log(`🎉 AI analysis regenerated! Generated ${analysisResults.insights?.length || 0} insights and ${analysisResults.workflowPhases?.length || 0} workflow phases`);
    } catch (error) {
      console.error("❌ Error regenerating AI analysis:", error);
      // Show error notification
      console.error("Failed to regenerate AI analysis. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      initiation: "bg-blue-100 text-blue-800",
      "data-collection": "bg-yellow-100 text-yellow-800",
      analysis: "bg-purple-100 text-purple-800",
      roadmap: "bg-orange-100 text-orange-800",
      review: "bg-green-100 text-green-800",
      implementation: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getInsightIcon = (type: string) => {
    const icons = {
      recommendation: Lightbulb,
      risk: AlertTriangle,
      opportunity: TrendingUp,
      benchmark: BarChart3,
      automation: Zap,
    };
    const Icon = icons[type as keyof typeof icons] || Activity;
    return <Icon className="h-4 w-4" />;
  };

  const getInsightColor = (type: string) => {
    const colors = {
      recommendation: "border-blue-200 bg-blue-50",
      risk: "border-red-200 bg-red-50",
      opportunity: "border-green-200 bg-green-50",
      benchmark: "border-purple-200 bg-purple-50",
      automation: "border-yellow-200 bg-yellow-50",
    };
    return colors[type as keyof typeof colors] || "border-gray-200 bg-gray-50";
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Analysis Dashboard</h1>
            <p className="text-gray-600 mt-1">Error loading companies</p>
          </div>
          <Button onClick={fetchCompanies} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-red-900 mb-2">Failed to Load Companies</h3>
                <p className="text-red-700 mb-4">{error}</p>

                {debugInfo && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-red-600 hover:text-red-800">Debug Information</summary>
                    <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
                  </details>
                )}

                <div className="mt-4 space-y-2 text-sm text-red-700">
                  <p>
                    <strong>Possible solutions:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Make sure you're signed in to your account</li>
                    <li>Check your internet connection</li>
                    <li>Try refreshing the page</li>
                    <li>If this persists, the database service may be temporarily unavailable</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Analysis Dashboard</h1>
          <p className="text-gray-600 mt-1">Select a company to view their transformation scorecard and insights</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedCompany && (
            <Button onClick={regenerateAIAnalysis} disabled={regenerating} variant="outline">
              {regenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate AI Analysis
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Selector */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Companies
              </CardTitle>
              <CardDescription>Select a company to analyze</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {companies.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Companies Found</h3>
                  <p className="text-gray-600 text-sm mb-4">You haven't created any companies yet. Get started by adding your first company.</p>

                  <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="mb-2">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              ) : (
                companies.map(company => (
                  <div
                    key={company.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCompany?.id === company.id ? "border-purple-300 bg-purple-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => selectCompany(company)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{company.clientName}</h3>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(company.status)} variant="secondary">
                            {company.status}
                          </Badge>
                          <span className="text-xs text-gray-500">Phase {company.currentPhase}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{company.progress}%</div>
                        <Progress value={company.progress} className="w-16 h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Company Analysis */}
        <div className="lg:col-span-2">
          {!selectedCompany ? (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Company</h3>
                  <p className="text-gray-600">Choose a company from the list to view their transformation scorecard and insights</p>
                </div>
              </CardContent>
            </Card>
          ) : insightsLoading || regenerating ? (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">{regenerating ? "Regenerating AI analysis..." : "Loading company analysis..."}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="overview" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList className="grid grid-cols-4 w-fit">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
                  <TabsTrigger value="insights">AI Insights</TabsTrigger>
                  <TabsTrigger value="phases">Workflow</TabsTrigger>
                </TabsList>
                {selectedCompany && (
                  <div className="text-sm text-gray-500">
                    {selectedCompany.insights.length} insights • {selectedCompany.phases.length} phases
                  </div>
                )}
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {selectedCompany.clientName}
                    </CardTitle>
                    <CardDescription>
                      {selectedCompany.industry} • {selectedCompany.region}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedCompany.progress}%</div>
                        <div className="text-sm text-gray-600">Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedCompany.aiAcceleration}%</div>
                        <div className="text-sm text-gray-600">AI Acceleration</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedCompany.hackettIPMatches}</div>
                        <div className="text-sm text-gray-600">Hackett IP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">${(selectedCompany.projectValue / 1000000).toFixed(1)}M</div>
                        <div className="text-sm text-gray-600">Project Value</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Project Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Engagement Type:</span>
                            <span>{selectedCompany.engagementType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Phase:</span>
                            <span>Phase {selectedCompany.currentPhase}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Start Date:</span>
                            <span>{new Date(selectedCompany.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Est. Completion:</span>
                            <span>{new Date(selectedCompany.estimatedCompletion).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Company Info</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Revenue:</span>
                            <span>{selectedCompany.revenue || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Employees:</span>
                            <span>{selectedCompany.employees || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current ERP:</span>
                            <span>{selectedCompany.currentERP || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Timeline:</span>
                            <span>{selectedCompany.timeline || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Scorecard Tab */}
              <TabsContent value="scorecard" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Progress Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Progress Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Overall Progress</span>
                          <span className="text-sm font-medium">{selectedCompany.progress}%</span>
                        </div>
                        <Progress value={selectedCompany.progress} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">AI Acceleration</span>
                          <span className="text-sm font-medium">{selectedCompany.aiAcceleration}%</span>
                        </div>
                        <Progress value={selectedCompany.aiAcceleration} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Phase Completion</span>
                          <span className="text-sm font-medium">{Math.round(((selectedCompany.currentPhase - 1) / 7) * 100)}%</span>
                        </div>
                        <Progress value={((selectedCompany.currentPhase - 1) / 7) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Performance Indicators */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Key Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-lg font-bold text-purple-600">{selectedCompany.hackettIPMatches}</div>
                          <div className="text-xs text-gray-600">Hackett IP Assets</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-lg font-bold text-green-600">{selectedCompany.insights.length}</div>
                          <div className="text-xs text-gray-600">AI Insights</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{selectedCompany.phases.length}</div>
                          <div className="text-xs text-gray-600">Active Phases</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-lg font-bold text-orange-600">{selectedCompany.teamMembers.length}</div>
                          <div className="text-xs text-gray-600">Team Members</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pain Points and Objectives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Pain Points
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedCompany.painPoints && selectedCompany.painPoints.length > 0 ? (
                        <div className="space-y-2">
                          {selectedCompany.painPoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{point}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No pain points identified</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Objectives
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedCompany.objectives && selectedCompany.objectives.length > 0 ? (
                        <div className="space-y-2">
                          {selectedCompany.objectives.map((objective, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{objective}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No objectives defined</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* AI Insights Tab */}
              <TabsContent value="insights" className="space-y-4">
                {selectedCompany.insights.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Insights Generated</h3>
                      <p className="text-gray-600 mb-4">AI insights will appear here after analysis is generated for this company.</p>
                      <Button onClick={regenerateAIAnalysis} disabled={regenerating} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {regenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            Generate AI Insights
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Found {selectedCompany.insights.length} AI insights for {selectedCompany.clientName}
                    </div>
                    <div className="grid gap-4">
                      {selectedCompany.insights.map(insight => (
                        <Card key={insight.id} className={`border-l-4 ${getInsightColor(insight.type)}`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                {getInsightIcon(insight.type)}
                                <CardTitle className="text-lg">{insight.title}</CardTitle>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  Phase {insight.phase}
                                </Badge>
                                <Badge variant={insight.impact === "high" ? "destructive" : insight.impact === "medium" ? "default" : "secondary"}>{insight.impact}</Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700 mb-4">{insight.description}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-4">
                                <span>Confidence: {Math.round((insight.confidence || 0) * 100)}%</span>
                                {insight.estimatedValue && <span>Value: ${(insight.estimatedValue / 1000000).toFixed(1)}M</span>}
                                {insight.timeframe && <span>Timeline: {insight.timeframe}</span>}
                              </div>
                              <span>Source: {insight.source}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Workflow Phases Tab */}
              <TabsContent value="phases" className="space-y-4">
                {selectedCompany.phases.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Workflow Phases</h3>
                      <p className="text-gray-600">Workflow phases will appear here as they are created</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {selectedCompany.phases.map(phase => (
                      <Card key={phase.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Phase {phase.id}</span>
                                {phase.title}
                              </CardTitle>
                              <CardDescription className="mt-1">{phase.description}</CardDescription>
                            </div>
                            <Badge className={getStatusColor(phase.status)} variant="secondary">
                              {phase.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h5 className="font-medium text-sm text-gray-900 mb-2">Progress</h5>
                              <Progress value={phase.progress} className="h-2" />
                              <span className="text-xs text-gray-600 mt-1">{phase.progress}% complete</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-sm text-gray-900 mb-2">Duration</h5>
                              <p className="text-sm text-gray-700">{phase.duration}</p>
                              <p className="text-xs text-gray-500">Traditional: {phase.traditionalDuration}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-sm text-gray-900 mb-2">AI Acceleration</h5>
                              <p className="text-sm font-medium text-green-600">{phase.aiAcceleration}%</p>
                            </div>
                          </div>

                          {phase.deliverables && phase.deliverables.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm text-gray-900 mb-2">Key Deliverables</h5>
                              <div className="space-y-1">
                                {phase.deliverables.slice(0, 3).map((deliverable: string, index: number) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                    <span className="text-sm text-gray-700">{deliverable}</span>
                                  </div>
                                ))}
                                {phase.deliverables.length > 3 && <p className="text-xs text-gray-500 ml-3.5">+{phase.deliverables.length - 3} more deliverables</p>}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
