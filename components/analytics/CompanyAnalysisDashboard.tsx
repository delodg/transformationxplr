"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Database,
  Trash2,
  Download,
  FileText,
  TrendingDown,
  Globe,
  Timer,
  Star,
  Award,
  Briefcase,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import jsPDF from "jspdf";
import { TransformationProject, AIInsight, WorkflowPhase } from "@/types";

// Global helper function for safe JSON parsing with array validation
const safeJsonParse = (jsonString: any, fallback: any[] = []): any[] => {
  try {
    if (Array.isArray(jsonString)) {
      return jsonString;
    }
    if (typeof jsonString === "string") {
      const parsed = JSON.parse(jsonString || "[]");
      return Array.isArray(parsed) ? parsed : fallback;
    }
    return fallback;
  } catch (error) {
    console.warn("⚠️ JSON parse error:", error, "Input:", jsonString);
    return fallback;
  }
};

interface CompanyAnalysisDashboardProps {
  className?: string;
  refreshTrigger?: number;
  onDataChange?: () => void;
}

interface CompanyWithInsights extends TransformationProject {
  insights: AIInsight[];
  phases: WorkflowPhase[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff88", "#0088fe", "#ff8042"];

export default function CompanyAnalysisDashboard({ className, refreshTrigger, onDataChange }: CompanyAnalysisDashboardProps) {
  const [companies, setCompanies] = useState<TransformationProject[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    company: TransformationProject | null;
    deleting: boolean;
  }>({ open: false, company: null, deleting: false });

  // Fetch companies on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchCompanies();
  }, [refreshTrigger]);

  // Fetch selected company details when selection changes
  useEffect(() => {
    if (selectedCompanyId) {
      fetchCompanyDetails(selectedCompanyId);
    }
  }, [selectedCompanyId]);

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
          setError("Authentication required. Please sign in.");
          return;
        }

        throw new Error(`Failed to fetch companies: ${response.status} ${response.statusText}`);
      }

      const companiesData = await response.json();
      console.log("📊 Received companies data:", companiesData);

      // Extract companies array from the response object
      const companiesArray = companiesData.companies || companiesData;

      // Ensure companiesArray is an array
      const validCompaniesData = Array.isArray(companiesArray) ? companiesArray : [];
      console.log("✅ Validated companies data:", validCompaniesData.length, "companies");

      setCompanies(validCompaniesData);

      // Auto-select first company if none selected
      if (validCompaniesData.length > 0 && !selectedCompanyId) {
        setSelectedCompanyId(validCompaniesData[0].id);
      }
    } catch (error) {
      console.error("❌ Error fetching companies:", error);
      setError(error instanceof Error ? error.message : "Failed to load companies");
      // Ensure companies is set to empty array on error
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyDetails = async (companyId: string) => {
    try {
      setInsightsLoading(true);
      console.log("🔍 Fetching insights and phases for company:", companyId);

      const [companyResponse, detailsResponse] = await Promise.all([fetch("/api/companies"), fetch(`/api/companies/${companyId}`)]);

      if (!companyResponse.ok || !detailsResponse.ok) {
        throw new Error("Failed to fetch company details");
      }

      const [companiesData, details] = await Promise.all([companyResponse.json(), detailsResponse.json()]);

      // Extract companies array from the response object
      const companiesArray = companiesData.companies || companiesData;
      const validCompaniesData = Array.isArray(companiesArray) ? companiesArray : [];

      const company = validCompaniesData.find((c: any) => c.id === companyId);
      if (!company) {
        throw new Error("Company not found");
      }

      const companyWithInsights: CompanyWithInsights = {
        ...company,
        insights: details.insights || [],
        phases: details.phases || [],
      };

      setSelectedCompany(companyWithInsights);
      console.log("✅ Company details loaded:", companyWithInsights);
    } catch (error) {
      console.error("❌ Error fetching company details:", error);
      setError(error instanceof Error ? error.message : "Failed to load company details");
    } finally {
      setInsightsLoading(false);
    }
  };

  const deleteCompany = async (company: TransformationProject) => {
    try {
      console.log("🗑️ [Analytics] Starting delete process for company:", company);
      console.log("🎯 [Analytics] Company ID:", company.id);

      if (!company || !company.id) {
        console.error("❌ [Analytics] Cannot delete: Invalid company or missing ID");
        throw new Error("Invalid company data");
      }

      setDeleteDialog(prev => ({ ...prev, deleting: true }));

      const response = await fetch(`/api/companies/${company.id}`, {
        method: "DELETE",
      });

      console.log("📡 [Analytics] Delete API response:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error("Failed to delete company");
      }

      // Remove from state
      setCompanies(prev => prev.filter(c => c.id !== company.id));

      // If deleted company was selected, clear selection
      if (selectedCompanyId === company.id) {
        setSelectedCompanyId("");
        setSelectedCompany(null);
      }

      // Close dialog
      setDeleteDialog({ open: false, company: null, deleting: false });

      // Notify parent
      onDataChange?.();

      console.log("✅ Company deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting company:", error);
      alert("Failed to delete company. Please try again.");
    } finally {
      setDeleteDialog(prev => ({ ...prev, deleting: false }));
    }
  };

  const exportToPDF = async () => {
    if (!selectedCompany) return;

    try {
      setExporting(true);

      // Create a new PDF document
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let currentY = margin;

      // Helper functions
      const addNewPage = () => {
        pdf.addPage();
        currentY = margin;
        addHeader();
        addFooter();
      };

      const addHeader = () => {
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        pdf.text("TransformationXPLR Analytics Report", margin, 15);
        pdf.line(margin, 18, pageWidth - margin, 18);
      };

      const addFooter = () => {
        const pageNum = pdf.internal.getNumberOfPages();
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        pdf.text(`Page ${pageNum}`, pageWidth - margin - 15, pageHeight - 10);
        pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
        pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      };

      const checkPageSpace = (requiredSpace: number) => {
        if (currentY + requiredSpace > pageHeight - 30) {
          addNewPage();
        }
      };

      const addTitle = (title: string, fontSize: number = 14, spacing: number = 10) => {
        checkPageSpace(spacing * 2);
        pdf.setFontSize(fontSize);
        pdf.setTextColor(0);
        pdf.setFont("helvetica", "bold");
        pdf.text(title, margin, currentY);
        currentY += spacing;
        pdf.setFont("helvetica", "normal");
      };

      const addText = (text: string, fontSize: number = 10, spacing: number = 6) => {
        checkPageSpace(spacing);
        pdf.setFontSize(fontSize);
        pdf.setTextColor(0);

        // Handle text wrapping
        const lines = pdf.splitTextToSize(text, contentWidth);
        lines.forEach((line: string) => {
          checkPageSpace(spacing);
          pdf.text(line, margin, currentY);
          currentY += spacing;
        });
      };

      const addSection = (title: string, content: string) => {
        checkPageSpace(25);
        addTitle(title, 12, 8);
        addText(content, 10, 5);
        currentY += 5;
      };

      // === COVER PAGE ===
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 51, 102); // Dark blue
      const titleY = pageHeight / 3;
      pdf.text("BUSINESS TRANSFORMATION", pageWidth / 2, titleY, { align: "center" });
      pdf.text("ANALYTICS REPORT", pageWidth / 2, titleY + 15, { align: "center" });

      // Company info box
      pdf.setDrawColor(0, 51, 102);
      pdf.setLineWidth(1);
      pdf.rect(margin + 20, titleY + 40, contentWidth - 40, 60);

      pdf.setFontSize(18);
      pdf.setTextColor(0);
      pdf.text(selectedCompany.clientName, pageWidth / 2, titleY + 55, { align: "center" });

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Industry: ${selectedCompany.industry}`, pageWidth / 2, titleY + 70, { align: "center" });
      pdf.text(`Region: ${selectedCompany.region}`, pageWidth / 2, titleY + 80, { align: "center" });
      pdf.text(`Employees: ${(selectedCompany as any).employeeCount?.toLocaleString() || "N/A"}`, pageWidth / 2, titleY + 90, { align: "center" });

      // Report metadata
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(
        `Report Generated: ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        pageWidth / 2,
        pageHeight - 40,
        { align: "center" }
      );
      pdf.text("Powered by TransformationXPLR AI Platform", pageWidth / 2, pageHeight - 30, { align: "center" });

      // === EXECUTIVE SUMMARY PAGE ===
      addNewPage();
      currentY = 40;

      addTitle("EXECUTIVE SUMMARY", 18, 15);

      const overallProgress = Math.round(selectedCompany.phases.reduce((acc, phase) => acc + phase.progress, 0) / selectedCompany.phases.length);
      const completedPhases = selectedCompany.phases.filter(p => p.status === "completed").length;
      const avgAiAcceleration = Math.round(selectedCompany.phases.reduce((acc, phase) => acc + (phase.aiAcceleration || 0), 0) / selectedCompany.phases.length);

      addSection(
        "Transformation Overview",
        `This report provides a comprehensive analysis of ${selectedCompany.clientName}'s digital transformation journey. The company is currently ${overallProgress}% through their 7-phase transformation methodology, with ${completedPhases} phases completed. The AI-accelerated approach has delivered an average time savings of ${avgAiAcceleration}% compared to traditional transformation methods.`
      );

      addSection(
        "Key Performance Indicators",
        `• Overall Progress: ${overallProgress}%\n• Completed Phases: ${completedPhases} of ${selectedCompany.phases.length}\n• AI Acceleration: ${avgAiAcceleration}% average time savings\n• Active Insights: ${selectedCompany.insights.length} recommendations\n• Current Status: ${selectedCompany.status}`
      );

      const timeSaved = selectedCompany.phases.reduce((acc, phase) => {
        const traditional = parseInt(phase.traditionalDuration?.split(" ")[0] || "0");
        const current = parseInt(phase.duration?.split(" ")[0] || "0");
        return acc + (traditional - current);
      }, 0);

      addSection(
        "Business Impact",
        `The AI-enhanced transformation approach has generated significant business value:\n• Time Savings: ${timeSaved} weeks compared to traditional methods\n• Process Efficiency: Improved through automated recommendations\n• Risk Mitigation: Proactive identification of potential challenges\n• Strategic Alignment: Data-driven decision making throughout the transformation`
      );

      // === COMPANY ANALYSIS PAGE ===
      addNewPage();
      currentY = 40;

      addTitle("COMPANY ANALYSIS", 18, 15);

      addSection(
        "Company Profile",
        `Company Name: ${selectedCompany.clientName}\nIndustry: ${selectedCompany.industry}\nRegion: ${selectedCompany.region}\nEmployee Count: ${
          (selectedCompany as any).employeeCount?.toLocaleString() || "Not specified"
        }\nAnnual Revenue: ${(selectedCompany as any).annualRevenue ? "$" + (selectedCompany as any).annualRevenue.toLocaleString() : "Not specified"}`
      );

      if ((selectedCompany as any).projectGoals) {
        addSection("Strategic Objectives", (selectedCompany as any).projectGoals);
      }

      if ((selectedCompany as any).expectedOutcomes) {
        addSection("Expected Outcomes", (selectedCompany as any).expectedOutcomes);
      }

      if ((selectedCompany as any).timeline) {
        addSection("Project Timeline", (selectedCompany as any).timeline);
      }

      // === AI INSIGHTS PAGE ===
      if (selectedCompany.insights.length > 0) {
        addNewPage();
        currentY = 40;

        addTitle("AI-POWERED INSIGHTS", 18, 15);

        const insightsByType = selectedCompany.insights.reduce((acc, insight) => {
          acc[insight.type] = acc[insight.type] || [];
          acc[insight.type].push(insight);
          return acc;
        }, {} as Record<string, any[]>);

        Object.entries(insightsByType).forEach(([type, insights]) => {
          addTitle(type.toUpperCase().replace("_", " "), 14, 10);

          insights.forEach((insight, index) => {
            checkPageSpace(20);
            pdf.setFontSize(11);
            pdf.setFont("helvetica", "bold");
            pdf.text(`${index + 1}. ${insight.title}`, margin, currentY);
            currentY += 6;

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            const descLines = pdf.splitTextToSize(insight.description, contentWidth);
            descLines.forEach((line: string) => {
              checkPageSpace(5);
              pdf.text(line, margin + 5, currentY);
              currentY += 5;
            });

            if (insight.priority) {
              pdf.setFontSize(9);
              pdf.setTextColor(100);
              pdf.text(`Priority: ${insight.priority} | Source: ${insight.source}`, margin + 5, currentY);
              currentY += 8;
              pdf.setTextColor(0);
            }
          });
          currentY += 5;
        });
      }

      // === WORKFLOW PHASES PAGE ===
      addNewPage();
      currentY = 40;

      addTitle("7-PHASE TRANSFORMATION WORKFLOW", 18, 15);

      addSection(
        "Methodology Overview",
        "The 7-Phase Transformation Methodology is an AI-accelerated approach that systematically guides organizations through digital transformation. Each phase builds upon the previous one, ensuring comprehensive transformation coverage."
      );

      selectedCompany.phases.forEach((phase, index) => {
        checkPageSpace(40);

        // Phase header
        pdf.setFillColor(240, 248, 255);
        pdf.rect(margin, currentY - 2, contentWidth, 12, "F");

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(`PHASE ${phase.phaseNumber || index + 1}: ${phase.title.toUpperCase()}`, margin + 3, currentY + 6);
        currentY += 15;

        // Phase details
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);

        // Status and progress
        pdf.text(`Status: ${phase.status} | Progress: ${phase.progress}%`, margin, currentY);
        currentY += 6;

        pdf.text(`Duration: ${phase.duration} (Traditional: ${phase.traditionalDuration})`, margin, currentY);
        currentY += 6;

        pdf.text(`AI Acceleration: ${phase.aiAcceleration}% time savings`, margin, currentY);
        currentY += 8;

        // Description
        if (phase.description) {
          const descLines = pdf.splitTextToSize(phase.description, contentWidth);
          descLines.forEach((line: string) => {
            checkPageSpace(5);
            pdf.text(line, margin, currentY);
            currentY += 5;
          });
          currentY += 3;
        }

        // Deliverables
        const deliverables = safeJsonParse(phase.deliverables);
        if (deliverables.length > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.text("Key Deliverables:", margin, currentY);
          currentY += 6;
          pdf.setFont("helvetica", "normal");

          deliverables.slice(0, 5).forEach((deliverable: string) => {
            checkPageSpace(5);
            pdf.text(`• ${deliverable}`, margin + 5, currentY);
            currentY += 5;
          });

          if (deliverables.length > 5) {
            pdf.setFontSize(9);
            pdf.setTextColor(100);
            pdf.text(`... and ${deliverables.length - 5} more deliverables`, margin + 5, currentY);
            currentY += 5;
            pdf.setFontSize(10);
            pdf.setTextColor(0);
          }
        }

        currentY += 8;
      });

      // === ANALYTICS & METRICS PAGE ===
      addNewPage();
      currentY = 40;

      addTitle("TRANSFORMATION ANALYTICS", 18, 15);

      // Progress metrics
      addTitle("Progress Metrics", 14, 10);

      const progressData = [
        ["Metric", "Value", "Target"],
        ["Overall Progress", `${overallProgress}%`, "100%"],
        ["Completed Phases", `${completedPhases}`, `${selectedCompany.phases.length}`],
        ["In Progress", `${selectedCompany.phases.filter(p => p.status === "in-progress").length}`, "-"],
        ["AI Enhanced", `${selectedCompany.phases.filter(p => p.status === "ai-enhanced").length}`, "-"],
        ["Avg AI Acceleration", `${avgAiAcceleration}%`, "-"],
      ];

      // Simple table
      const startY = currentY;
      const rowHeight = 8;
      const colWidths = [60, 40, 40];

      progressData.forEach((row, rowIndex) => {
        checkPageSpace(rowHeight);

        if (rowIndex === 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setFillColor(240, 240, 240);
          pdf.rect(margin, currentY - 2, contentWidth, rowHeight, "F");
        } else {
          pdf.setFont("helvetica", "normal");
        }

        let xOffset = margin;
        row.forEach((cell, colIndex) => {
          pdf.text(cell, xOffset + 2, currentY + 4);
          xOffset += colWidths[colIndex];
        });

        currentY += rowHeight;
      });

      currentY += 10;

      // Time efficiency analysis
      addTitle("Time Efficiency Analysis", 14, 10);

      const traditionalTotal = selectedCompany.phases.reduce((acc, phase) => {
        return acc + parseInt(phase.traditionalDuration?.split(" ")[0] || "0");
      }, 0);

      const acceleratedTotal = selectedCompany.phases.reduce((acc, phase) => {
        return acc + parseInt(phase.duration?.split(" ")[0] || "0");
      }, 0);

      addText(`Traditional Approach: ${traditionalTotal} weeks`);
      addText(`AI-Accelerated Approach: ${acceleratedTotal} weeks`);
      addText(`Time Savings: ${traditionalTotal - acceleratedTotal} weeks (${Math.round(((traditionalTotal - acceleratedTotal) / traditionalTotal) * 100)}% improvement)`);

      currentY += 10;

      // Recommendations
      addTitle("Key Recommendations", 14, 10);

      const recommendations = [
        "Continue leveraging AI-enhanced methodologies for maximum efficiency",
        "Focus on completing in-progress phases before initiating new ones",
        "Regular monitoring of phase progress and deliverable quality",
        "Maintain stakeholder engagement throughout the transformation",
        "Document lessons learned for future transformation initiatives",
      ];

      recommendations.forEach(rec => {
        addText(`• ${rec}`);
      });

      // === CONCLUSION PAGE ===
      addNewPage();
      currentY = 40;

      addTitle("CONCLUSION & NEXT STEPS", 18, 15);

      addSection(
        "Transformation Status",
        `${selectedCompany.clientName} is making excellent progress in their digital transformation journey. With ${overallProgress}% completion and ${completedPhases} phases successfully delivered, the organization is well-positioned to achieve their strategic objectives.`
      );

      addSection(
        "AI Impact Assessment",
        `The AI-accelerated approach has demonstrated significant value, delivering ${avgAiAcceleration}% average time savings compared to traditional methodologies. This efficiency gain translates to faster time-to-value and reduced transformation risk.`
      );

      addSection(
        "Next Steps",
        "1. Continue execution of remaining transformation phases\n2. Monitor progress metrics and adjust strategies as needed\n3. Leverage AI insights for continuous improvement\n4. Prepare for post-transformation optimization\n5. Document best practices and lessons learned"
      );

      addSection(
        "Contact Information",
        "For questions about this report or transformation methodology, please contact the TransformationXPLR team.\n\nThis report is confidential and proprietary to " +
          selectedCompany.clientName +
          "."
      );

      // Add headers and footers to all pages
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 2; i <= totalPages; i++) {
        pdf.setPage(i);
        addHeader();
        addFooter();
      }

      // Save the PDF
      pdf.save(`${selectedCompany.clientName}-Transformation-Report-${new Date().toISOString().split("T")[0]}.pdf`);

      // Show success message
      alert(`Enterprise report for ${selectedCompany.clientName} has been generated successfully!`);
    } catch (error) {
      console.error("❌ Error exporting PDF:", error);
      alert("Failed to generate enterprise report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Prepare chart data
  const phaseProgressData =
    selectedCompany?.phases.map((phase, index) => ({
      phase: `Phase ${phase.phaseNumber || index + 1}`,
      progress: phase.progress || 0,
      aiAcceleration: phase.aiAcceleration || 0,
      name: phase.title.substring(0, 20) + (phase.title.length > 20 ? "..." : ""),
    })) || [];

  const insightsByType =
    selectedCompany?.insights.reduce((acc, insight) => {
      acc[insight.type] = (acc[insight.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const insightsChartData = Object.entries(insightsByType).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    value: count,
  }));

  const transformationMetrics = selectedCompany
    ? {
        overall: selectedCompany.progress || 0,
        aiAcceleration: selectedCompany.aiAcceleration || 0,
        phaseCompletion: selectedCompany.phases.filter(p => p.status === "completed").length,
        totalPhases: selectedCompany.phases.length,
        insights: selectedCompany.insights.length,
        riskLevel: selectedCompany.insights.filter(i => i.type === "risk").length,
      }
    : null;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "recommendation":
        return <Lightbulb className="h-4 w-4 text-blue-600" />;
      case "risk":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "benchmark":
        return <BarChart3 className="h-4 w-4 text-purple-600" />;
      case "automation":
        return <Zap className="h-4 w-4 text-yellow-600" />;
      default:
        return <Brain className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "ai-enhanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && companies.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading analytics dashboard...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <span>{error}</span>
            </div>
            <div className="mt-4 text-center">
              <Button onClick={fetchCompanies} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!Array.isArray(companies) || companies.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <Building2 className="h-12 w-12 mx-auto text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold">No Companies Found</h3>
                <p className="text-gray-600">Create your first company to start viewing analytics.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Company Selector and Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Company Analytics Dashboard</h2>
            <p className="text-gray-600">Comprehensive transformation analytics and insights</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a company to analyze" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(companies) && companies.length > 0 ? (
                companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>{company.clientName}</span>
                      <Badge variant="outline" className="ml-auto">
                        {company.progress}%
                      </Badge>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  {loading ? "Loading companies..." : "No companies available"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <Button
            onClick={exportToPDF}
            disabled={!selectedCompany || exporting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2"
            title="Generate comprehensive transformation report for client presentation"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Enterprise Report
              </>
            )}
          </Button>
        </div>
      </div>

      {!selectedCompany ? (
        <Card className="h-64">
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Company</h3>
              <p className="text-gray-600">Choose a company from the dropdown to view detailed analytics</p>
            </div>
          </CardContent>
        </Card>
      ) : insightsLoading ? (
        <Card className="h-64">
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading company analytics...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-5 w-fit">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="phases">Workflow</TabsTrigger>
              <TabsTrigger value="export">Export Data</TabsTrigger>
            </TabsList>

            {selectedCompany && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  {selectedCompany.insights.length} insights • {selectedCompany.phases.length} phases
                </div>
                <Button size="sm" variant="destructive" onClick={() => setDeleteDialog({ open: true, company: selectedCompany, deleting: false })}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Company Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Building2 className="h-6 w-6" />
                      {selectedCompany.clientName}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      {selectedCompany.industry} • {selectedCompany.region} • {selectedCompany.engagementType}
                    </CardDescription>
                  </div>
                  <Badge className={`text-base px-3 py-1 ${getStatusColor(selectedCompany.status)}`}>{selectedCompany.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{selectedCompany.progress}%</div>
                    <div className="text-sm text-gray-600 mt-1">Overall Progress</div>
                    <Progress value={selectedCompany.progress} className="mt-2" />
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{selectedCompany.aiAcceleration}%</div>
                    <div className="text-sm text-gray-600 mt-1">AI Acceleration</div>
                    <div className="text-xs text-green-600 mt-1">Time Savings</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{selectedCompany.hackettIPMatches}</div>
                    <div className="text-sm text-gray-600 mt-1">Hackett IP Assets</div>
                    <div className="text-xs text-blue-600 mt-1">Best Practices</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">${(selectedCompany.projectValue / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-gray-600 mt-1">Project Value</div>
                    <div className="text-xs text-orange-600 mt-1">Investment</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Phase</span>
                    <Badge variant="outline">Phase {selectedCompany.currentPhase}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Start Date</span>
                    <span className="text-sm font-medium">{new Date(selectedCompany.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target Completion</span>
                    <span className="text-sm font-medium">{new Date(selectedCompany.estimatedCompletion).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Team Size</span>
                    <span className="text-sm font-medium">{safeJsonParse(selectedCompany.teamMembers).length} members</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Company Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="text-sm font-medium">{selectedCompany.revenue || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Employees</span>
                    <span className="text-sm font-medium">{selectedCompany.employees || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ERP System</span>
                    <span className="text-sm font-medium">{selectedCompany.currentERP || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Budget</span>
                    <span className="text-sm font-medium">{selectedCompany.budget || "N/A"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Analytics Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Insights</span>
                    <Badge variant="secondary">{selectedCompany.insights.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed Phases</span>
                    <Badge variant="secondary">{selectedCompany.phases.filter(p => p.status === "completed").length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Risk Factors</span>
                    <Badge variant="destructive">{selectedCompany.insights.filter(i => i.type === "risk").length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Opportunities</span>
                    <Badge variant="default" className="bg-green-600">
                      {selectedCompany.insights.filter(i => i.type === "opportunity").length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab with Charts */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Phase Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Phase Progress Analytics
                  </CardTitle>
                  <CardDescription>Progress and AI acceleration by phase</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={phaseProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="phase" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="progress" fill="#8884d8" name="Progress %" />
                      <Bar dataKey="aiAcceleration" fill="#82ca9d" name="AI Acceleration %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Insights Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    AI Insights Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of insights by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie dataKey="value" data={insightsChartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ type, value }: { type: string; value: number }) => `${type}: ${value}`}>
                        {insightsChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Transformation Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Transformation Scorecard
                  </CardTitle>
                  <CardDescription>Multi-dimensional transformation assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart
                      data={[
                        { metric: "Progress", value: selectedCompany.progress },
                        { metric: "AI Adoption", value: selectedCompany.aiAcceleration },
                        { metric: "Phase Completion", value: (selectedCompany.phases.filter(p => p.status === "completed").length / selectedCompany.phases.length) * 100 },
                        { metric: "Insights Quality", value: selectedCompany.insights.length > 0 ? 85 : 0 },
                        { metric: "Risk Management", value: Math.max(0, 100 - selectedCompany.insights.filter(i => i.type === "risk").length * 10) },
                        { metric: "Value Delivery", value: selectedCompany.projectValue > 0 ? 75 : 0 },
                      ]}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Timeline Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Project Timeline
                  </CardTitle>
                  <CardDescription>Progress tracking over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={[
                        { month: "Jan", planned: 10, actual: 8 },
                        { month: "Feb", planned: 25, actual: 22 },
                        { month: "Mar", planned: 40, actual: 45 },
                        { month: "Apr", planned: 60, actual: selectedCompany.progress },
                        { month: "May", planned: 80, actual: 0 },
                        { month: "Jun", planned: 100, actual: 0 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="planned" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="actual" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.8} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {selectedCompany.insights.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Insights</h3>
                  <p className="text-gray-600">AI insights will appear here as they are generated</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Insights Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Lightbulb className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{selectedCompany.insights.filter(i => i.type === "recommendation").length}</div>
                      <div className="text-sm text-gray-600">Recommendations</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">{selectedCompany.insights.filter(i => i.type === "risk").length}</div>
                      <div className="text-sm text-gray-600">Risk Factors</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{selectedCompany.insights.filter(i => i.type === "opportunity").length}</div>
                      <div className="text-sm text-gray-600">Opportunities</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">{selectedCompany.insights.filter(i => i.type === "automation").length}</div>
                      <div className="text-sm text-gray-600">Automation</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Insights */}
                <div className="grid grid-cols-1 gap-4">
                  {selectedCompany.insights.map(insight => (
                    <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Confidence:</span>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{Math.round((insight.confidence || 0) * 100)}%</span>
                              <Progress value={(insight.confidence || 0) * 100} className="w-16 h-2" />
                            </div>
                          </div>
                          {insight.estimatedValue && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Est. Value:</span>
                              <span className="font-medium text-green-600">${(insight.estimatedValue / 1000000).toFixed(1)}M</span>
                            </div>
                          )}
                          {insight.timeframe && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Timeline:</span>
                              <span className="font-medium">{insight.timeframe}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">Source: {insight.source}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Enhanced Workflow Phases Tab */}
          <TabsContent value="phases" className="space-y-6">
            {selectedCompany.phases.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Workflow Phases</h3>
                  <p className="text-gray-600">Workflow phases will appear here as they are created</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Transformation Progress Header */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Activity className="h-6 w-6 text-blue-600" />
                          </div>
                          7-Phase Transformation Journey
                        </CardTitle>
                        <CardDescription className="text-base mt-2">AI-Accelerated Business Transformation Progress</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{Math.round(selectedCompany.phases.reduce((acc, phase) => acc + phase.progress, 0) / selectedCompany.phases.length)}%</div>
                        <div className="text-sm text-gray-600">Overall Progress</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedCompany.phases.filter(p => p.status === "completed").length}</div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedCompany.phases.filter(p => p.status === "in-progress").length}</div>
                        <div className="text-sm text-gray-600">In Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedCompany.phases.filter(p => p.status === "ai-enhanced").length}</div>
                        <div className="text-sm text-gray-600">AI Enhanced</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {Math.round(selectedCompany.phases.reduce((acc, phase) => acc + (phase.aiAcceleration || 0), 0) / selectedCompany.phases.length)}%
                        </div>
                        <div className="text-sm text-gray-600">Avg AI Acceleration</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline View */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="h-5 w-5" />
                      Transformation Timeline
                    </CardTitle>
                    <CardDescription>Visual overview of all phases with interconnected workflow</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-purple-200 to-green-200"></div>

                      <div className="space-y-8">
                        {selectedCompany.phases.map((phase, index) => (
                          <div key={phase.id} className="relative flex items-start gap-6">
                            {/* Timeline Node */}
                            <div
                              className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                                phase.status === "completed"
                                  ? "bg-green-100 border-green-300 text-green-700"
                                  : phase.status === "in-progress"
                                  ? "bg-blue-100 border-blue-300 text-blue-700 animate-pulse"
                                  : phase.status === "ai-enhanced"
                                  ? "bg-purple-100 border-purple-300 text-purple-700"
                                  : "bg-gray-100 border-gray-300 text-gray-600"
                              }`}
                            >
                              {phase.status === "completed" ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : phase.status === "in-progress" ? (
                                <Activity className="h-6 w-6" />
                              ) : phase.status === "ai-enhanced" ? (
                                <Zap className="h-6 w-6" />
                              ) : (
                                <div className="text-sm font-bold">{phase.phaseNumber || index + 1}</div>
                              )}
                            </div>

                            {/* Phase Card */}
                            <div className="flex-1 min-w-0">
                              <Card className={`transition-all duration-200 hover:shadow-lg ${phase.status === "in-progress" ? "ring-2 ring-blue-200 bg-blue-50/30" : ""}`}>
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{phase.title}</h3>
                                        <Badge className={`${getStatusColor(phase.status)} px-3 py-1`} variant="secondary">
                                          {phase.status.replace("-", " ").toUpperCase()}
                                        </Badge>
                                      </div>
                                      <p className="text-gray-600 text-sm mb-3">{phase.description}</p>

                                      {/* Progress and Metrics */}
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Progress</span>
                                            <span className="text-sm font-bold text-blue-600">{phase.progress}%</span>
                                          </div>
                                          <Progress value={phase.progress} className="h-3" />
                                        </div>
                                        <div className="text-center">
                                          <div className="text-sm text-gray-600 mb-1">Duration</div>
                                          <div className="flex items-center justify-center gap-1">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm font-medium">{phase.duration}</span>
                                          </div>
                                          <div className="text-xs text-gray-500">vs {phase.traditionalDuration} traditional</div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-sm text-gray-600 mb-1">AI Acceleration</div>
                                          <div className="flex items-center justify-center gap-1">
                                            <Zap className="h-4 w-4 text-purple-500" />
                                            <span className="text-sm font-bold text-purple-600">{phase.aiAcceleration}%</span>
                                          </div>
                                          <div className="text-xs text-gray-500">time savings</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Deliverables and Activities */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Key Deliverables */}
                                    {safeJsonParse(phase.deliverables).length > 0 && (
                                      <div>
                                        <h5 className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
                                          <Award className="h-4 w-4 text-blue-500" />
                                          Key Deliverables
                                        </h5>
                                        <div className="space-y-2">
                                          {safeJsonParse(phase.deliverables)
                                            .slice(0, 4)
                                            .map((deliverable: string, index: number) => (
                                              <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                                <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-800 leading-relaxed">{deliverable}</span>
                                              </div>
                                            ))}
                                          {safeJsonParse(phase.deliverables).length > 4 && (
                                            <div className="text-xs text-gray-500 text-center mt-2">+{safeJsonParse(phase.deliverables).length - 4} more deliverables</div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Key Activities */}
                                    {safeJsonParse(phase.keyActivities).length > 0 && (
                                      <div>
                                        <h5 className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
                                          <Target className="h-4 w-4 text-purple-500" />
                                          Key Activities
                                        </h5>
                                        <div className="space-y-2">
                                          {safeJsonParse(phase.keyActivities)
                                            .slice(0, 4)
                                            .map((activity: string, index: number) => (
                                              <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                                                <span className="text-sm text-gray-800 leading-relaxed">{activity}</span>
                                              </div>
                                            ))}
                                          {safeJsonParse(phase.keyActivities).length > 4 && (
                                            <div className="text-xs text-gray-500 text-center mt-2">+{safeJsonParse(phase.keyActivities).length - 4} more activities</div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Phase Footer with Additional Info */}
                                  <div className="mt-6 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-gray-600">
                                          <Calendar className="h-4 w-4" />
                                          <span>Target: {phase.estimatedCompletion ? new Date(phase.estimatedCompletion).toLocaleDateString() : "TBD"}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                          <Users className="h-4 w-4" />
                                          <span>Phase {phase.phaseNumber || index + 1} of 7</span>
                                        </div>
                                      </div>
                                      {phase.status === "in-progress" && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                          <Activity className="h-3 w-3 mr-1" />
                                          Currently Active
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Phase Analytics Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Phase Analytics & Insights
                    </CardTitle>
                    <CardDescription>Performance metrics and AI acceleration analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Time Savings Chart */}
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                          <Timer className="h-4 w-4" />
                          Time Efficiency
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-700">Traditional Approach</span>
                            <span className="text-sm font-medium text-green-900">
                              {selectedCompany.phases.reduce((acc, phase) => {
                                const traditional = parseInt(phase.traditionalDuration?.split(" ")[0] || "0");
                                return acc + traditional;
                              }, 0)}{" "}
                              weeks
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-700">AI-Accelerated</span>
                            <span className="text-sm font-medium text-green-900">
                              {selectedCompany.phases.reduce((acc, phase) => {
                                const current = parseInt(phase.duration?.split(" ")[0] || "0");
                                return acc + current;
                              }, 0)}{" "}
                              weeks
                            </span>
                          </div>
                          <div className="border-t border-green-200 pt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-green-800">Time Saved</span>
                              <span className="text-lg font-bold text-green-600">
                                {selectedCompany.phases.reduce((acc, phase) => {
                                  const traditional = parseInt(phase.traditionalDuration?.split(" ")[0] || "0");
                                  const current = parseInt(phase.duration?.split(" ")[0] || "0");
                                  return acc + (traditional - current);
                                }, 0)}{" "}
                                weeks
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Distribution */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                          <PieChart className="h-4 w-4" />
                          Progress Distribution
                        </h4>
                        <div className="space-y-3">
                          {[
                            { status: "completed", label: "Completed", color: "green" },
                            { status: "in-progress", label: "In Progress", color: "blue" },
                            { status: "ai-enhanced", label: "AI Enhanced", color: "purple" },
                            { status: "pending", label: "Pending", color: "gray" },
                          ].map(({ status, label, color }) => {
                            const count = selectedCompany.phases.filter(p => p.status === status).length;
                            const percentage = Math.round((count / selectedCompany.phases.length) * 100);
                            return (
                              <div key={status} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full bg-${color}-500`}></div>
                                  <span className="text-sm text-blue-700">{label}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-medium text-blue-900">{count}</span>
                                  <span className="text-xs text-blue-600 ml-1">({percentage}%)</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* AI Impact Metrics */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          AI Impact
                        </h4>
                        <div className="space-y-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {Math.round(selectedCompany.phases.reduce((acc, phase) => acc + (phase.aiAcceleration || 0), 0) / selectedCompany.phases.length)}%
                            </div>
                            <div className="text-xs text-purple-700">Average Acceleration</div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-purple-700">Max Acceleration</span>
                              <span className="text-sm font-medium text-purple-900">{Math.max(...selectedCompany.phases.map(p => p.aiAcceleration || 0))}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-purple-700">AI-Enhanced Phases</span>
                              <span className="text-sm font-medium text-purple-900">{selectedCompany.phases.filter(p => p.status === "ai-enhanced").length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Export Data Tab */}
          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Export Options
                  </CardTitle>
                  <CardDescription>Download comprehensive analytics reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={exportToPDF} disabled={exporting} className="w-full bg-blue-600 hover:bg-blue-700">
                    {exporting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export Full Analytics Report (PDF)
                      </>
                    )}
                  </Button>

                  <Button variant="outline" className="w-full" disabled>
                    <FileText className="h-4 w-4 mr-2" />
                    Export Raw Data (CSV) - Coming Soon
                  </Button>

                  <Button variant="outline" className="w-full" disabled>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Export Charts (PNG) - Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Report Summary
                  </CardTitle>
                  <CardDescription>What&apos;s included in your export</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Company overview and metrics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Performance charts and analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>AI insights and recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>7-phase transformation progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Risk factors and opportunities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Timeline and milestones</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete {deleteDialog.company?.clientName}? This action cannot be undone and will remove all associated data.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(prev => ({ ...prev, open: false }))} disabled={deleteDialog.deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteDialog.company && deleteCompany(deleteDialog.company)} disabled={deleteDialog.deleting}>
              {deleteDialog.deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Company"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
