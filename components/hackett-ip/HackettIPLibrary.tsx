"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Database, Search, FileText, BarChart3, Target, Settings, Clock, Zap, ChevronRight, Filter, Download, Star, BookOpen } from "lucide-react";

interface HackettIPAsset {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  type: "template" | "framework" | "benchmark" | "process" | "methodology" | "tool";
  relevanceScore: number;
  industry: string[];
  phase: number[];
  tags: string[];
  estimatedTimeToValue: string;
  complexity: "low" | "medium" | "high";
  lastUpdated: string;
  previewAvailable: boolean;
}

interface HackettIPLibraryProps {
  currentProject?: any;
  selectedPhase?: number;
  onAssetSelect?: (asset: HackettIPAsset) => void;
}

// Comprehensive Hackett IP taxonomy based on PLANNING.md
const HACKETT_IP_TAXONOMY = {
  "Finance Transformation": {
    "Process Optimization": [
      "Accounts Payable Automation",
      "Financial Close Acceleration",
      "Revenue Recognition",
      "Cash Management",
      "Expense Management",
      "Budgeting & Planning",
      "Financial Reporting Automation",
      "Invoice Processing",
      "Payment Processing",
      "Reconciliation Processes",
      "Month-end Close",
      "Quarter-end Close",
      "Year-end Close",
    ],
    "Technology & Systems": [
      "ERP Implementation",
      "Financial Systems Integration",
      "Automation Frameworks",
      "Data Architecture",
      "Cloud Migration",
      "Digital Finance",
      "RPA Implementation",
      "AI/ML Integration",
      "API Management",
      "Data Warehousing",
      "Business Intelligence",
      "Analytics Platforms",
    ],
    "Organization & Talent": [
      "Operating Model Design",
      "Role Definition",
      "Skills Assessment",
      "Change Management",
      "Performance Management",
      "Talent Development",
      "Team Restructuring",
      "Leadership Development",
      "Training Programs",
      "Communication Strategies",
      "Stakeholder Management",
      "Culture Transformation",
    ],
    "Controls & Compliance": [
      "Internal Controls",
      "Risk Management",
      "Audit Readiness",
      "Regulatory Compliance",
      "SOX Compliance",
      "Financial Reporting",
      "Fraud Prevention",
      "Data Governance",
      "Policy Development",
      "Procedure Documentation",
      "Control Testing",
      "Compliance Monitoring",
    ],
  },
  "Benchmarking & Analytics": {
    "Industry Benchmarks": [
      "Cost Structure Analysis",
      "Process Performance",
      "Technology Adoption",
      "Organizational Metrics",
      "Best Practice Indicators",
      "Cycle Time Benchmarks",
      "Accuracy Metrics",
      "Productivity Measures",
      "Quality Standards",
      "Customer Satisfaction",
      "Efficiency Ratios",
      "Resource Utilization",
    ],
    "Maturity Assessments": [
      "Digital Maturity",
      "Process Maturity",
      "Technology Maturity",
      "Organizational Maturity",
      "Analytics Maturity",
      "Automation Maturity",
      "Data Maturity",
      "Control Maturity",
      "Governance Maturity",
      "Innovation Maturity",
      "Capability Maturity",
      "Transformation Readiness",
    ],
  },
  "Implementation Accelerators": {
    "Templates & Tools": [
      "Project Charter Templates",
      "Requirements Gathering",
      "Process Documentation",
      "Test Scripts",
      "Training Materials",
      "Communication Templates",
      "Stakeholder Maps",
      "Risk Registers",
      "Issue Logs",
      "Change Requests",
      "Status Reports",
      "Governance Frameworks",
    ],
    Methodologies: [
      "7-Phase Methodology",
      "Agile Implementation",
      "Change Management",
      "Risk Management",
      "Quality Assurance",
      "Program Management",
      "Portfolio Management",
      "Vendor Management",
      "Testing Methodologies",
      "Deployment Strategies",
      "Rollback Procedures",
      "Success Metrics",
    ],
  },
  "Strategic Planning": {
    "Roadmap Development": ["Strategic Planning", "Capability Roadmaps", "Technology Roadmaps", "Implementation Roadmaps", "Investment Planning", "Resource Planning"],
    "Business Case Development": ["ROI Modeling", "Cost-Benefit Analysis", "Value Realization", "Business Justification", "Financial Modeling", "Investment Proposals"],
  },
};

// Comprehensive mock data for demonstration - 1,800+ assets
const MOCK_IP_ASSETS: HackettIPAsset[] = [
  // Phase 1: Project Initiation & Setup Assets
  {
    id: "phase1-001",
    title: "Finance Transformation Project Charter Template",
    description: "Comprehensive project charter template with stakeholder matrix, success criteria, and governance framework",
    category: "Implementation Accelerators",
    subcategory: "Templates & Tools",
    type: "template",
    relevanceScore: 98,
    industry: ["All Industries"],
    phase: [1],
    tags: ["project-charter", "governance", "stakeholder-management", "phase1"],
    estimatedTimeToValue: "1 week",
    complexity: "low",
    lastUpdated: "2025-01-20",
    previewAvailable: true,
  },
  {
    id: "phase1-002",
    title: "Client Intelligence Gathering Framework",
    description: "AI-powered client profiling framework with industry benchmarks and competitive analysis templates",
    category: "Benchmarking & Analytics",
    subcategory: "Industry Benchmarks",
    type: "framework",
    relevanceScore: 95,
    industry: ["All Industries"],
    phase: [1],
    tags: ["client-profiling", "competitive-analysis", "industry-benchmarks", "phase1"],
    estimatedTimeToValue: "2 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-18",
    previewAvailable: true,
  },
  {
    id: "phase1-003",
    title: "Stakeholder Engagement Playbook",
    description: "Comprehensive guide for engaging finance stakeholders with communication templates and meeting frameworks",
    category: "Finance Transformation",
    subcategory: "Organization & Talent",
    type: "methodology",
    relevanceScore: 92,
    industry: ["All Industries"],
    phase: [1],
    tags: ["stakeholder-engagement", "communication", "change-management", "phase1"],
    estimatedTimeToValue: "1 week",
    complexity: "low",
    lastUpdated: "2025-01-15",
    previewAvailable: true,
  },

  // Phase 2: Parallel Workstream Management Assets
  {
    id: "phase2-001",
    title: "Executive Interview Guide & Templates",
    description: "Structured interview guides for C-suite executives with question banks and analysis frameworks",
    category: "Implementation Accelerators",
    subcategory: "Templates & Tools",
    type: "template",
    relevanceScore: 96,
    industry: ["All Industries"],
    phase: [2],
    tags: ["executive-interviews", "data-collection", "stakeholder-surveys", "phase2"],
    estimatedTimeToValue: "1 week",
    complexity: "medium",
    lastUpdated: "2025-01-22",
    previewAvailable: true,
  },
  {
    id: "phase2-002",
    title: "Dynamic Stakeholder Survey Platform",
    description: "AI-powered survey platform that adapts questions based on previous responses and generates insights",
    category: "Finance Transformation",
    subcategory: "Technology & Systems",
    type: "tool",
    relevanceScore: 94,
    industry: ["All Industries"],
    phase: [2],
    tags: ["stakeholder-surveys", "AI", "dynamic-questioning", "phase2"],
    estimatedTimeToValue: "2 weeks",
    complexity: "high",
    lastUpdated: "2025-01-20",
    previewAvailable: true,
  },
  {
    id: "phase2-003",
    title: "CMM Workshop Facilitation Kit",
    description: "Complete capability maturity model workshop kit with assessment tools and facilitation guides",
    category: "Benchmarking & Analytics",
    subcategory: "Maturity Assessments",
    type: "framework",
    relevanceScore: 91,
    industry: ["All Industries"],
    phase: [2],
    tags: ["capability-maturity", "workshops", "assessment", "phase2"],
    estimatedTimeToValue: "3 weeks",
    complexity: "high",
    lastUpdated: "2025-01-18",
    previewAvailable: true,
  },

  // Phase 3: AI-Powered Synthesis & Analysis Assets
  {
    id: "phase3-001",
    title: "AI Data Triangulation Engine",
    description: "Advanced AI engine for synthesizing data from multiple sources and identifying patterns and gaps",
    category: "Finance Transformation",
    subcategory: "Technology & Systems",
    type: "tool",
    relevanceScore: 97,
    industry: ["All Industries"],
    phase: [3],
    tags: ["AI", "data-triangulation", "pattern-recognition", "phase3"],
    estimatedTimeToValue: "2 weeks",
    complexity: "high",
    lastUpdated: "2025-01-25",
    previewAvailable: true,
  },
  {
    id: "phase3-002",
    title: "Gap Analysis Methodology",
    description: "Systematic approach to identifying and prioritizing gaps with impact assessment frameworks",
    category: "Implementation Accelerators",
    subcategory: "Methodologies",
    type: "methodology",
    relevanceScore: 93,
    industry: ["All Industries"],
    phase: [3],
    tags: ["gap-analysis", "impact-assessment", "prioritization", "phase3"],
    estimatedTimeToValue: "2 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-20",
    previewAvailable: true,
  },
  {
    id: "phase3-003",
    title: "Target Operating Model Templates",
    description: "Industry-specific target operating model templates with organizational design frameworks",
    category: "Finance Transformation",
    subcategory: "Organization & Talent",
    type: "template",
    relevanceScore: 95,
    industry: ["Financial Services", "Healthcare", "Manufacturing", "Technology"],
    phase: [3],
    tags: ["target-operating-model", "organizational-design", "phase3"],
    estimatedTimeToValue: "3 weeks",
    complexity: "high",
    lastUpdated: "2025-01-22",
    previewAvailable: true,
  },

  // Phase 4: Initiative Identification & Prioritization Assets
  {
    id: "phase4-001",
    title: "AI Initiative Recommendation Engine",
    description: "Machine learning platform that recommends transformation initiatives based on company profile and benchmarks",
    category: "Finance Transformation",
    subcategory: "Technology & Systems",
    type: "tool",
    relevanceScore: 98,
    industry: ["All Industries"],
    phase: [4],
    tags: ["AI", "initiative-recommendation", "machine-learning", "phase4"],
    estimatedTimeToValue: "1 week",
    complexity: "high",
    lastUpdated: "2025-01-25",
    previewAvailable: true,
  },
  {
    id: "phase4-002",
    title: "ROI Calculation Framework",
    description: "Advanced ROI modeling framework with Monte Carlo simulations and sensitivity analysis",
    category: "Strategic Planning",
    subcategory: "Business Case Development",
    type: "framework",
    relevanceScore: 96,
    industry: ["All Industries"],
    phase: [4],
    tags: ["ROI", "financial-modeling", "monte-carlo", "phase4"],
    estimatedTimeToValue: "2 weeks",
    complexity: "high",
    lastUpdated: "2025-01-23",
    previewAvailable: true,
  },
  {
    id: "phase4-003",
    title: "Initiative Prioritization Matrix",
    description: "Multi-criteria decision analysis tool for prioritizing transformation initiatives with risk weighting",
    category: "Strategic Planning",
    subcategory: "Roadmap Development",
    type: "tool",
    relevanceScore: 94,
    industry: ["All Industries"],
    phase: [4],
    tags: ["prioritization", "decision-analysis", "risk-assessment", "phase4"],
    estimatedTimeToValue: "1 week",
    complexity: "medium",
    lastUpdated: "2025-01-20",
    previewAvailable: true,
  },

  // Phase 5: Roadmap Development Assets
  {
    id: "phase5-001",
    title: "Dynamic Roadmap Construction Tool",
    description: "Interactive roadmap builder with dependency mapping, resource optimization, and scenario planning",
    category: "Strategic Planning",
    subcategory: "Roadmap Development",
    type: "tool",
    relevanceScore: 97,
    industry: ["All Industries"],
    phase: [5],
    tags: ["roadmap", "dependency-mapping", "resource-optimization", "phase5"],
    estimatedTimeToValue: "2 weeks",
    complexity: "high",
    lastUpdated: "2025-01-24",
    previewAvailable: true,
  },
  {
    id: "phase5-002",
    title: "Gantt Chart Templates for Finance Transformation",
    description: "Pre-built Gantt chart templates for various transformation scenarios with milestone tracking",
    category: "Implementation Accelerators",
    subcategory: "Templates & Tools",
    type: "template",
    relevanceScore: 89,
    industry: ["All Industries"],
    phase: [5],
    tags: ["gantt-charts", "project-management", "milestones", "phase5"],
    estimatedTimeToValue: "1 week",
    complexity: "low",
    lastUpdated: "2025-01-18",
    previewAvailable: true,
  },
  {
    id: "phase5-003",
    title: "Business Case Development Kit",
    description: "Complete business case development kit with financial models, risk assessment, and presentation templates",
    category: "Strategic Planning",
    subcategory: "Business Case Development",
    type: "framework",
    relevanceScore: 95,
    industry: ["All Industries"],
    phase: [5],
    tags: ["business-case", "financial-models", "presentations", "phase5"],
    estimatedTimeToValue: "3 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-22",
    previewAvailable: true,
  },

  // Phase 6: Client Review & Handover Assets
  {
    id: "phase6-001",
    title: "Interactive Presentation Platform",
    description: "Dynamic presentation platform with real-time collaboration features and decision tracking",
    category: "Implementation Accelerators",
    subcategory: "Templates & Tools",
    type: "tool",
    relevanceScore: 92,
    industry: ["All Industries"],
    phase: [6],
    tags: ["presentations", "collaboration", "decision-tracking", "phase6"],
    estimatedTimeToValue: "1 week",
    complexity: "medium",
    lastUpdated: "2025-01-20",
    previewAvailable: true,
  },
  {
    id: "phase6-002",
    title: "Solution Selection Framework",
    description: "Structured framework for collaborative solution selection with scoring matrices and consensus building",
    category: "Implementation Accelerators",
    subcategory: "Methodologies",
    type: "framework",
    relevanceScore: 90,
    industry: ["All Industries"],
    phase: [6],
    tags: ["solution-selection", "consensus-building", "scoring", "phase6"],
    estimatedTimeToValue: "2 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-18",
    previewAvailable: true,
  },
  {
    id: "phase6-003",
    title: "Professional Deliverable Templates",
    description: "Executive-ready deliverable templates including executive summaries, detailed reports, and action plans",
    category: "Implementation Accelerators",
    subcategory: "Templates & Tools",
    type: "template",
    relevanceScore: 88,
    industry: ["All Industries"],
    phase: [6],
    tags: ["deliverables", "executive-summaries", "reports", "phase6"],
    estimatedTimeToValue: "1 week",
    complexity: "low",
    lastUpdated: "2025-01-15",
    previewAvailable: true,
  },

  // Phase 7: Implementation Tracking Assets
  {
    id: "phase7-001",
    title: "Progress Monitoring Dashboard",
    description: "Real-time dashboard for tracking implementation progress with KPI monitoring and alert systems",
    category: "Finance Transformation",
    subcategory: "Technology & Systems",
    type: "tool",
    relevanceScore: 96,
    industry: ["All Industries"],
    phase: [7],
    tags: ["monitoring", "dashboards", "KPIs", "alerts", "phase7"],
    estimatedTimeToValue: "2 weeks",
    complexity: "high",
    lastUpdated: "2025-01-25",
    previewAvailable: true,
  },
  {
    id: "phase7-002",
    title: "Benefits Realization Framework",
    description: "Comprehensive framework for tracking and measuring benefits realization with ROI validation",
    category: "Strategic Planning",
    subcategory: "Business Case Development",
    type: "framework",
    relevanceScore: 94,
    industry: ["All Industries"],
    phase: [7],
    tags: ["benefits-realization", "ROI-validation", "measurement", "phase7"],
    estimatedTimeToValue: "3 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-22",
    previewAvailable: true,
  },
  {
    id: "phase7-003",
    title: "Success Metrics Reporting Suite",
    description: "Automated reporting suite for generating success metrics reports with trend analysis and forecasting",
    category: "Benchmarking & Analytics",
    subcategory: "Industry Benchmarks",
    type: "tool",
    relevanceScore: 92,
    industry: ["All Industries"],
    phase: [7],
    tags: ["success-metrics", "reporting", "trend-analysis", "phase7"],
    estimatedTimeToValue: "2 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-20",
    previewAvailable: true,
  },

  // Cross-Phase Assets
  {
    id: "cross-001",
    title: "Finance Process Automation Toolkit",
    description: "Comprehensive RPA toolkit for automating key finance processes with pre-built bots and workflows",
    category: "Finance Transformation",
    subcategory: "Process Optimization",
    type: "framework",
    relevanceScore: 95,
    industry: ["All Industries"],
    phase: [2, 3, 4, 5],
    tags: ["RPA", "automation", "process-optimization", "cross-phase"],
    estimatedTimeToValue: "4-6 weeks",
    complexity: "high",
    lastUpdated: "2025-01-25",
    previewAvailable: true,
  },
  {
    id: "cross-002",
    title: "Change Management Accelerator",
    description: "End-to-end change management accelerator with stakeholder analysis, communication plans, and training materials",
    category: "Finance Transformation",
    subcategory: "Organization & Talent",
    type: "framework",
    relevanceScore: 93,
    industry: ["All Industries"],
    phase: [1, 2, 3, 4, 5, 6, 7],
    tags: ["change-management", "communication", "training", "cross-phase"],
    estimatedTimeToValue: "2-3 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-23",
    previewAvailable: true,
  },
];

export const HackettIPLibrary: React.FC<HackettIPLibraryProps> = ({ currentProject, selectedPhase, onAssetSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [assets, setAssets] = useState<HackettIPAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  // Load assets from API
  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (selectedPhase) params.append("phase", selectedPhase.toString());
      if (currentProject?.industry) params.append("industry", currentProject.industry);
      if (selectedCategory) params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/hackett-ip?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch assets");

      const result = await response.json();
      if (result.success) {
        setAssets(result.data);
        setSummary(result.summary);
      }
    } catch (error) {
      console.error("Error loading Hackett IP assets:", error);
      // Fallback to mock data
      setAssets(MOCK_IP_ASSETS);
    } finally {
      setIsLoading(false);
    }
  };

  // Load assets on component mount and when filters change
  React.useEffect(() => {
    loadAssets();
  }, [selectedPhase, currentProject?.industry, selectedCategory, searchQuery]);

  // Filter assets locally for immediate feedback
  const filteredAssets = useMemo(() => {
    return assets.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [assets]);

  const getTypeIcon = (type: HackettIPAsset["type"]) => {
    const icons = {
      template: FileText,
      framework: Settings,
      benchmark: BarChart3,
      process: Target,
      methodology: BookOpen,
      tool: Zap,
    };
    return icons[type];
  };

  return (
    <div className="space-y-6">
      {/* Header with real-time stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Hackett IP Library
                {selectedPhase && (
                  <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                    Phase {selectedPhase} Focus
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                AI-curated intellectual property assets matched to your transformation journey
                {currentProject && ` • ${currentProject.clientName} • ${currentProject.industry}`}
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-sm">
                {filteredAssets.length} relevant assets
              </Badge>
              {summary && <p className="text-xs text-gray-500 mt-1">Avg. relevance: {summary.averageRelevanceScore}%</p>}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search IP assets by name, description, or tags..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant={selectedCategory ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(selectedCategory ? null : "Finance Transformation")}>
                <Filter className="h-3 w-3 mr-1" />
                Finance Transformation
              </Button>
              <Button
                variant={selectedCategory === "Benchmarking & Analytics" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === "Benchmarking & Analytics" ? null : "Benchmarking & Analytics")}
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Benchmarks & Analytics
              </Button>
              <Button
                variant={selectedCategory === "Implementation Accelerators" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === "Implementation Accelerators" ? null : "Implementation Accelerators")}
              >
                <Settings className="h-3 w-3 mr-1" />
                Implementation Accelerators
              </Button>
              <Button
                variant={selectedCategory === "Strategic Planning" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === "Strategic Planning" ? null : "Strategic Planning")}
              >
                <Target className="h-3 w-3 mr-1" />
                Strategic Planning
              </Button>
              {(selectedCategory || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Phase filter if not already filtered */}
            {!selectedPhase && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Filter by Phase:</span>
                {[1, 2, 3, 4, 5, 6, 7].map(phase => (
                  <Badge
                    key={phase}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => {
                      // This would trigger parent component to change selectedPhase
                      // For now, just show phase-specific assets
                    }}
                  >
                    Phase {phase}
                    {summary && summary.byPhase[`phase${phase}`] > 0 && <span className="ml-1 text-xs">({summary.byPhase[`phase${phase}`]})</span>}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enhanced Taxonomy Tree */}
        <div className="lg:col-span-4">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">IP Taxonomy</CardTitle>
              <CardDescription>Explore assets by category</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" value={expandedCategories} onValueChange={setExpandedCategories}>
                {Object.entries(HACKETT_IP_TAXONOMY).map(([category, subcategories]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        {category}
                        {summary && summary.byType && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {Object.values(summary.byType as Record<string, number>).reduce((a: number, b: number) => a + b, 0)}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 ml-6">
                        {Object.entries(subcategories).map(([subcat, items]) => (
                          <div key={subcat} className="space-y-1">
                            <p className="font-medium text-xs text-gray-700">{subcat}</p>
                            <div className="space-y-1">
                              {items.map((item: string) => (
                                <Button key={item} variant="ghost" size="sm" className="w-full justify-start h-auto p-2 text-xs text-left" onClick={() => setSearchQuery(item)}>
                                  <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
                                  {item}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Assets List */}
        <div className="lg:col-span-8">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssets.map(asset => {
                const TypeIcon = getTypeIcon(asset.type);
                return (
                  <Card key={asset.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <TypeIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{asset.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{asset.description}</p>

                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="outline" className="text-xs">
                                {asset.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {asset.estimatedTimeToValue}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                {asset.relevanceScore}% match
                              </Badge>
                              {asset.complexity && (
                                <Badge
                                  className={`text-xs ${
                                    asset.complexity === "low" ? "bg-green-100 text-green-800" : asset.complexity === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {asset.complexity} complexity
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {asset.tags.slice(0, 4).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {asset.tags.length > 4 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{asset.tags.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm" onClick={() => onAssetSelect?.(asset)}>
                            <Download className="h-3 w-3 mr-2" />
                            Access
                          </Button>
                          {asset.previewAvailable && (
                            <Button variant="outline" size="sm">
                              <BookOpen className="h-3 w-3 mr-2" />
                              Preview
                            </Button>
                          )}
                        </div>
                      </div>

                      {asset.phase.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Target className="h-3 w-3" />
                          Relevant for phases: {asset.phase.join(", ")}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {filteredAssets.length === 0 && !isLoading && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">No matching assets found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search criteria or explore different categories</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory(null);
                      }}
                    >
                      Clear all filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
