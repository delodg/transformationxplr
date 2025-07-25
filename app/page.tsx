"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
  Upload,
  Settings,
  ArrowRight,
  Plus,
  Edit,
  Search,
  Filter,
  Star,
  AlertCircle,
  Play,
  Lightbulb,
  Database,
  Workflow,
  PieChart,
  Activity,
  Briefcase,
  Globe,
  Shield,
  Rocket,
  MapPin,
  Users2,
  MessageSquare,
  FileSpreadsheet,
  Presentation,
  ChevronRight,
  Timer,
  DollarSign,
  TrendingDown,
  Building,
  Phone,
  Mail,
  ClipboardList,
  GitBranch,
  Layers,
  Gauge,
  BookOpen,
  Eye,
  CheckSquare,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
} from "recharts";

interface TransformationProject {
  id: string;
  clientName: string;
  industry: string;
  engagementType: string;
  status: "initiation" | "data-collection" | "analysis" | "roadmap" | "review" | "implementation";
  progress: number;
  aiAcceleration: number;
  startDate: string;
  estimatedCompletion: string;
  teamMembers: string[];
  hackettIPMatches: number;
  region: string;
  projectValue: number;
  currentPhase: number;
}

interface AIInsight {
  id: string;
  type: "recommendation" | "risk" | "opportunity" | "benchmark" | "automation";
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  source: string;
  phase: number;
  actionable: boolean;
}

interface WorkflowPhase {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending" | "ai-enhanced";
  aiAcceleration: number;
  duration: string;
  traditionalDuration: string;
  hackettIP: string[];
  deliverables: string[];
  aiSuggestions: string[];
  keyActivities: string[];
  dependencies: string[];
  teamRole: string[];
  clientTasks: string[];
  progress: number;
}

interface ClientOnboarding {
  companyName: string;
  industry: string;
  revenue: string;
  employees: string;
  region: string;
  currentERP: string;
  painPoints: string[];
  objectives: string[];
  timeline: string;
  budget: string;
}

const TransformationXPLR: React.FC = () => {
  const [activeTab, setActiveTab] = useState("command-center");
  const [currentProject, setCurrentProject] = useState<TransformationProject | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [workflowPhases, setWorkflowPhases] = useState<WorkflowPhase[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [clientData, setClientData] = useState<ClientOnboarding | null>(null);

  // Modal states for view/detail buttons
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [selectedPhaseDetail, setSelectedPhaseDetail] = useState<WorkflowPhase | null>(null);
  const [showIPAssetModal, setShowIPAssetModal] = useState(false);
  const [selectedIPAsset, setSelectedIPAsset] = useState<any>(null);

  // AI Chat Assistant states
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; content: string; role: "user" | "assistant"; timestamp: Date }>>([
    {
      id: "1",
      content:
        "Hello! I'm your AI assistant for the MasTec Power Delivery transformation project. I can help you with insights, recommendations, and guidance across all 7 phases. What would you like to know?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Additional functionality states
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Enhanced sample data with 7-phase workflow
  const sampleProject: TransformationProject = {
    id: "1",
    clientName: "MasTec Power Delivery",
    industry: "Infrastructure & Construction",
    engagementType: "Finance Transformation Blueprint",
    status: "analysis",
    progress: 42,
    aiAcceleration: 47,
    startDate: "2024-01-15",
    estimatedCompletion: "2024-03-28",
    teamMembers: ["Sarah Johnson", "Mike Chen", "Lisa Rodriguez", "AI Assistant", "David Kim"],
    hackettIPMatches: 1247,
    region: "North America",
    projectValue: 12400000,
    currentPhase: 3,
  };

  const enhancedAIInsights: AIInsight[] = [
    {
      id: "1",
      type: "automation",
      title: "AI-Powered Invoice Processing Priority",
      description:
        "Based on MasTec's current AP volume (15K invoices/month) and Hackett benchmark data, implementing AI-powered invoice processing could reduce cycle time by 78% and save $2.3M annually.",
      confidence: 94,
      impact: "high",
      source: "Hackett Benchmark Database + Client Data Analysis",
      phase: 4,
      actionable: true,
    },
    {
      id: "2",
      type: "opportunity",
      title: "Quick Win: Expense Management Mobile Solution",
      description:
        "Client data shows 23% higher expense processing costs vs. Digital World Class. Mobile expense capture implementation could deliver $1.2M annual savings with 6-week implementation.",
      confidence: 87,
      impact: "medium",
      source: "Client Survey Data + CMM Workshop Results",
      phase: 4,
      actionable: true,
    },
    {
      id: "3",
      type: "risk",
      title: "Oracle Fusion Integration Complexity",
      description: "Legacy system integration with Oracle Fusion may require additional effort. Similar infrastructure clients experienced 15% timeline extension. Recommend phased approach.",
      confidence: 82,
      impact: "medium",
      source: "Historical Project Database + Industry Analysis",
      phase: 5,
      actionable: true,
    },
    {
      id: "4",
      type: "benchmark",
      title: "Month-End Close Performance Gap",
      description: "Current 8-day close vs. 3-day Digital World Class benchmark. AI-powered reconciliation could achieve 4-day close, saving $850K annually in FTE costs.",
      confidence: 91,
      impact: "high",
      source: "Hackett Finance Benchmark 2024",
      phase: 3,
      actionable: true,
    },
    {
      id: "5",
      type: "recommendation",
      title: "Shared Services Center Optimization",
      description: "Based on Hackett GBS model, centralizing AP, AR, and GL functions could reduce costs by 35% while improving service quality. ROI: 280% over 3 years.",
      confidence: 89,
      impact: "high",
      source: "Hackett GBS Operating Model + Client Interviews",
      phase: 4,
      actionable: true,
    },
  ];

  const sevenPhaseWorkflow: WorkflowPhase[] = [
    {
      id: 1,
      title: "Project Initiation & Client Onboarding",
      description: "AI-enhanced client intelligence gathering with automated data ingestion and Hackett IP matching",
      status: "completed",
      aiAcceleration: 57,
      duration: "3 days",
      traditionalDuration: "7 days",
      hackettIP: ["Client Profiling Templates", "Industry Benchmarks", "Engagement Playbooks", "SOW Analysis Framework"],
      deliverables: ["Client Profile", "SOW Analysis", "Data Collection Plan", "Team Assignment"],
      aiSuggestions: [
        "Auto-populated client profile from public data and industry databases",
        "Recommended data collection approach based on client complexity",
        "Risk assessment using historical engagement patterns",
        "Optimal team composition recommendation",
      ],
      keyActivities: ["Client intelligence gathering", "SOW review", "Stakeholder mapping", "Tool setup"],
      dependencies: [],
      teamRole: ["Project Director", "Engagement Manager", "AI Assistant"],
      clientTasks: ["Provide SOW", "Identify key stakeholders", "Grant data access"],
      progress: 100,
    },
    {
      id: 2,
      title: "Parallel Workstreams Launch",
      description: "AI-orchestrated data collection with intelligent survey generation and automated interview scheduling",
      status: "completed",
      aiAcceleration: 60,
      duration: "2 weeks",
      traditionalDuration: "5 weeks",
      hackettIP: ["Survey Templates", "Interview Guides", "CMM Frameworks", "Benchmark Data Portal"],
      deliverables: ["Benchmark Data", "Interview Insights", "Survey Results", "CMM Assessment", "Technology Inventory"],
      aiSuggestions: [
        "Dynamic survey questions based on interview themes",
        "Automated interview scheduling optimization",
        "Real-time data validation and gap identification",
        "Intelligent follow-up recommendations",
      ],
      keyActivities: ["Executive interviews (10-15)", "Stakeholder survey (~50 responses)", "CMM workshops", "Data portal launch"],
      dependencies: ["Phase 1 completion"],
      teamRole: ["Senior Consultants", "CMM Specialists", "Data Analysts"],
      clientTasks: ["Participate in interviews", "Complete surveys", "Provide system access", "CMM workshop attendance"],
      progress: 100,
    },
    {
      id: 3,
      title: "Synthesis & Analysis",
      description: "AI-powered triangulation of findings with automated gap identification and intelligent pattern recognition",
      status: "in-progress",
      aiAcceleration: 61,
      duration: "4 days",
      traditionalDuration: "10 days",
      hackettIP: ["Gap Analysis Models", "Maturity Frameworks", "Best Practice Library", "Digital World Class Benchmarks"],
      deliverables: ["Current State Assessment", "Gap Analysis", "Target Operating Model", "Capability Maturity Report"],
      aiSuggestions: ["Automated pattern recognition across data sources", "Intelligent gap prioritization based on impact", "Benchmark comparison with peer insights", "Target state recommendations"],
      keyActivities: ["Data triangulation", "Gap identification", "Maturity scoring", "Target model design"],
      dependencies: ["Phase 2 data collection"],
      teamRole: ["Senior Analysts", "Benchmark Specialists", "AI Analytics"],
      clientTasks: ["Validate findings", "Provide clarifications", "Review assessments"],
      progress: 68,
    },
    {
      id: 4,
      title: "Initiative Identification & Prioritization",
      description: "AI-driven initiative generation with intelligent ROI calculation and automated business case development",
      status: "pending",
      aiAcceleration: 55,
      duration: "3 days",
      traditionalDuration: "8 days",
      hackettIP: ["Initiative Templates", "ROI Models", "Business Case Framework", "Quick Wins Database"],
      deliverables: ["Initiative Inventory", "ROI Analysis", "Business Cases", "Priority Matrix", "Quick Wins Identification"],
      aiSuggestions: ["Auto-generated initiative recommendations", "Intelligent ROI calculations based on benchmarks", "Quick wins identification and sequencing", "Resource requirement optimization"],
      keyActivities: ["Initiative brainstorming", "Value quantification", "Prioritization matrix", "Business case development"],
      dependencies: ["Phase 3 analysis"],
      teamRole: ["Strategy Consultants", "Financial Analysts", "Industry SMEs"],
      clientTasks: ["Validate assumptions", "Provide cost data", "Review priorities"],
      progress: 0,
    },
    {
      id: 5,
      title: "Roadmap Development",
      description: "AI-optimized transformation roadmap with intelligent sequencing and dependency management",
      status: "pending",
      aiAcceleration: 52,
      duration: "3 days",
      traditionalDuration: "8 days",
      hackettIP: ["Roadmap Templates", "Implementation Playbooks", "Change Management Framework", "Dependency Models"],
      deliverables: ["Transformation Roadmap", "Implementation Timeline", "Resource Plan", "Change Strategy", "Benefits Realization Plan"],
      aiSuggestions: ["Optimal initiative sequencing based on dependencies", "Resource allocation optimization", "Risk mitigation strategies", "Change management recommendations"],
      keyActivities: ["Roadmap creation", "Timeline development", "Resource planning", "Risk assessment"],
      dependencies: ["Phase 4 prioritization"],
      teamRole: ["Program Managers", "Change Management", "Implementation Specialists"],
      clientTasks: ["Review roadmap", "Confirm resources", "Approve timeline"],
      progress: 0,
    },
    {
      id: 6,
      title: "Client Review & Handover",
      description: "AI-enhanced presentation generation with intelligent deck creation and automated documentation",
      status: "pending",
      aiAcceleration: 45,
      duration: "2 days",
      traditionalDuration: "5 days",
      hackettIP: ["Presentation Templates", "Executive Summary Framework", "Handover Playbook"],
      deliverables: ["Executive Presentation", "Detailed Documentation", "Handover Package", "Next Steps Plan"],
      aiSuggestions: ["Auto-generated executive presentation", "Intelligent content adaptation for audience", "Key message optimization", "Follow-up action recommendations"],
      keyActivities: ["Presentation preparation", "Executive review", "Documentation handover", "Next steps planning"],
      dependencies: ["Phase 5 roadmap"],
      teamRole: ["Project Director", "Presentation Specialists", "Client Success"],
      clientTasks: ["Executive review", "Decision making", "Implementation planning"],
      progress: 0,
    },
    {
      id: 7,
      title: "Implementation Support",
      description: "AI-guided implementation with continuous monitoring and adaptive optimization",
      status: "pending",
      aiAcceleration: 40,
      duration: "Ongoing",
      traditionalDuration: "Ongoing + 40%",
      hackettIP: ["Implementation Guides", "Project Management Tools", "Benefits Tracking", "Continuous Improvement"],
      deliverables: ["Implementation Plans", "Progress Reports", "Benefits Tracking", "Optimization Recommendations"],
      aiSuggestions: ["Continuous progress monitoring", "Adaptive optimization recommendations", "Risk early warning system", "Benefits realization tracking"],
      keyActivities: ["Implementation guidance", "Progress tracking", "Benefits monitoring", "Continuous optimization"],
      dependencies: ["Phase 6 approval"],
      teamRole: ["Implementation Team", "Project Managers", "Success Managers"],
      clientTasks: ["Execute initiatives", "Report progress", "Realize benefits"],
      progress: 0,
    },
  ];

  const accelerationMetrics = [
    { phase: "Initiation", traditional: 7, aiEnhanced: 3, savings: 57, value: 0.2 },
    { phase: "Data Collection", traditional: 35, aiEnhanced: 14, savings: 60, value: 1.8 },
    { phase: "Analysis", traditional: 10, aiEnhanced: 4, savings: 60, value: 2.4 },
    { phase: "Prioritization", traditional: 8, aiEnhanced: 3, savings: 63, value: 1.2 },
    { phase: "Roadmap", traditional: 8, aiEnhanced: 3, savings: 63, value: 0.8 },
    { phase: "Review", traditional: 5, aiEnhanced: 2, savings: 60, value: 0.4 },
    { phase: "Implementation", traditional: 180, aiEnhanced: 108, savings: 40, value: 6.6 },
  ];

  const hackettIPUtilization = [
    { category: "Benchmarks", matches: 234, utilization: 89, relevant: 156 },
    { category: "Best Practices", matches: 187, utilization: 76, relevant: 142 },
    { category: "Templates", matches: 156, utilization: 94, relevant: 147 },
    { category: "Case Studies", matches: 142, utilization: 68, relevant: 97 },
    { category: "Frameworks", matches: 128, utilization: 82, relevant: 105 },
    { category: "Playbooks", matches: 89, utilization: 71, relevant: 63 },
  ];

  useEffect(() => {
    setCurrentProject(sampleProject);
    setAIInsights(enhancedAIInsights);
    setWorkflowPhases(sevenPhaseWorkflow);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "in-progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "ai-enhanced":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "pending":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const calculateTimeSaved = () => {
    const totalTraditional = accelerationMetrics.reduce((sum, phase) => sum + phase.traditional, 0);
    const totalAiEnhanced = accelerationMetrics.reduce((sum, phase) => sum + phase.aiEnhanced, 0);
    return Math.round(((totalTraditional - totalAiEnhanced) / totalTraditional) * 100);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: chatInput,
      role: "user" as const,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(chatInput),
        role: "assistant" as const,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("phase") || lowerInput.includes("workflow")) {
      return `Based on your current progress in Phase ${currentProject?.currentPhase}, I recommend focusing on the AI-enhanced activities that can accelerate delivery by ${
        sevenPhaseWorkflow.find(p => p.id === currentProject?.currentPhase)?.aiAcceleration
      }%. Would you like me to show you the specific tasks and Hackett IP assets for this phase?`;
    }

    if (lowerInput.includes("savings") || lowerInput.includes("value") || lowerInput.includes("roi")) {
      return `The current identified value for MasTec is $${(currentProject?.projectValue! / 1000000).toFixed(
        1
      )}M annually. The biggest opportunities are in AI-powered invoice processing ($2.3M) and expense management automation ($1.2M). Shall I break down the implementation approach for these?`;
    }

    if (lowerInput.includes("risk") || lowerInput.includes("challenge")) {
      return `I've identified Oracle Fusion integration complexity as the primary risk. Based on similar infrastructure clients, I recommend a phased approach with 15% timeline buffer. I can generate a detailed risk mitigation plan if needed.`;
    }

    if (lowerInput.includes("next") || lowerInput.includes("recommendation")) {
      return `My top recommendation is to prioritize the AI-powered invoice processing initiative as a quick win. It has 94% confidence, high impact, and can deliver $2.3M annually. This will fund other transformation efforts and demonstrate early value.`;
    }

    return `I understand you're asking about "${userInput}". Based on the MasTec project data and Hackett benchmarks, I can provide specific guidance. Could you clarify if you're looking for insights about process optimization, timeline acceleration, or value identification?`;
  };

  // Button functionality handlers
  const handleExportDeck = () => {
    setIsExporting(true);
    // Simulate deck generation
    setTimeout(() => {
      setIsExporting(false);
      // Create downloadable content
      const deckContent = {
        projectName: currentProject?.clientName,
        industry: currentProject?.industry,
        progress: currentProject?.progress,
        timeSaved: calculateTimeSaved(),
        valueIdentified: currentProject?.projectValue,
        keyInsights: aiInsights.slice(0, 3),
        phases: sevenPhaseWorkflow,
      };

      const dataStr = JSON.stringify(deckContent, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `${currentProject?.clientName}_Transformation_Report.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      alert(`Deck generated successfully! Downloaded as ${exportFileDefaultName}`);
    }, 2000);
  };

  const handleGenerateDeck = () => {
    setIsGeneratingDeck(true);
    setTimeout(() => {
      setIsGeneratingDeck(false);
      handleExportDeck();
    }, 1500);
  };

  const handleViewAnalytics = () => {
    setActiveTab("analytics");
  };

  const handleConfigureAI = () => {
    alert("AI Configuration panel would open here. This would allow customizing AI parameters, confidence thresholds, and data sources.");
  };

  const handleFilterByPhase = () => {
    alert("Phase filter modal would open here. This would allow filtering IP assets and insights by specific transformation phases.");
  };

  const handleAIOptimize = () => {
    alert("AI Optimization starting... This would analyze the current workflow and suggest optimizations to further reduce timeline and increase value.");
  };

  const handleExportWorkflow = () => {
    const workflowData = {
      phases: sevenPhaseWorkflow,
      acceleration: accelerationMetrics,
      totalTimeSaved: calculateTimeSaved(),
      exportDate: new Date(),
    };

    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "Transformation_Workflow.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleApplyRecommendation = (insight: AIInsight) => {
    alert(`Applying recommendation: "${insight.title}". This would integrate the AI recommendation into the project workflow and update the implementation timeline.`);
  };

  const handleGoToPhase = (phaseId: number) => {
    setActiveTab("workflow");
    setSelectedPhase(phaseId);
    alert(`Navigating to Phase ${phaseId}: ${sevenPhaseWorkflow.find(p => p.id === phaseId)?.title}. This would open the detailed phase view with current tasks and next steps.`);
  };

  const handleDownloadAsset = (asset: any) => {
    alert(`Downloading asset: "${asset.title}". This would download the complete asset documentation, templates, and related materials.`);
  };

  const handleUseInProject = (asset: any) => {
    alert(`Adding "${asset.title}" to current project. This would integrate the asset into the project workflow and add it to the active IP assets list.`);
  };

  const handleInitializeProject = () => {
    alert("Project initialization starting... This would create a new project with the entered client data and AI-generated recommendations.");
    setShowOnboarding(false);
  };

  const handleUploadSOW = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`SOW file "${file.name}" uploaded successfully. AI is analyzing the document to extract project requirements and scope.`);
      }
    };
    input.click();
  };

  const renderCommandCenter = () => (
    <div className="space-y-6">
      {/* Enhanced Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Zap className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Transformation XPLR</h1>
                  <p className="text-blue-100 text-lg">AI-Powered Finance Transformation Platform</p>
                  <p className="text-blue-200 text-sm mt-1">Accelerating delivery by up to 50% with intelligent automation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-5 w-5 text-blue-200" />
                    <span className="text-sm font-medium">AI Acceleration</span>
                  </div>
                  <p className="text-3xl font-bold">{calculateTimeSaved()}%</p>
                  <p className="text-xs text-blue-200">Faster delivery</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="h-5 w-5 text-purple-200" />
                    <span className="text-sm font-medium">Hackett IP</span>
                  </div>
                  <p className="text-3xl font-bold">{currentProject?.hackettIPMatches}</p>
                  <p className="text-xs text-purple-200">Relevant assets</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-200" />
                    <span className="text-sm font-medium">Project Value</span>
                  </div>
                  <p className="text-3xl font-bold">${(currentProject?.projectValue! / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-green-200">Identified savings</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-indigo-200" />
                    <span className="text-sm font-medium">Progress</span>
                  </div>
                  <p className="text-3xl font-bold">{currentProject?.progress}%</p>
                  <p className="text-xs text-indigo-200">Phase {currentProject?.currentPhase} of 7</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-40 h-40 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <Rocket className="h-20 w-20 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button onClick={() => setShowOnboarding(true)} className="h-20 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center space-y-2">
          <Plus className="h-6 w-6" />
          <span>New Project</span>
        </Button>
        <Button onClick={() => setShowAIAssistant(true)} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-purple-200 hover:bg-purple-50">
          <Brain className="h-6 w-6 text-purple-600" />
          <span>AI Assistant</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-green-200 hover:bg-green-50" onClick={handleExportDeck} disabled={isExporting}>
          <Download className="h-6 w-6 text-green-600" />
          <span>{isExporting ? "Exporting..." : "Export Deck"}</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-orange-200 hover:bg-orange-50" onClick={handleViewAnalytics}>
          <BarChart3 className="h-6 w-6 text-orange-600" />
          <span>View Analytics</span>
        </Button>
      </div>

      {/* Current Project Status */}
      {currentProject && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <Building className="h-6 w-6 text-blue-600" />
                  <span>{currentProject.clientName}</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {currentProject.industry}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg mt-1">
                  {currentProject.engagementType} • {currentProject.region}
                </CardDescription>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setActiveTab("workflow")}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Workflow
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleGenerateDeck} disabled={isGeneratingDeck}>
                  <Presentation className="h-4 w-4 mr-2" />
                  {isGeneratingDeck ? "Generating..." : "Generate Deck"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Project Progress */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg flex items-center space-x-2">
                  <Gauge className="h-5 w-5 text-blue-600" />
                  <span>Project Progress</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-semibold text-gray-900">{currentProject.progress}%</span>
                    </div>
                    <Progress value={currentProject.progress} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 block">Started</span>
                      <span className="font-semibold">{currentProject.startDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Est. Completion</span>
                      <span className="font-semibold">{currentProject.estimatedCompletion}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Current Phase</span>
                      <span className="font-semibold">Phase {currentProject.currentPhase}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Time Saved</span>
                      <span className="font-semibold text-green-600">{calculateTimeSaved()}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team & Resources */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg flex items-center space-x-2">
                  <Users2 className="h-5 w-5 text-purple-600" />
                  <span>Team & Resources</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Team Members</span>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.teamMembers.map((member, index) => (
                        <Badge key={index} variant={member === "AI Assistant" ? "default" : "outline"} className={member === "AI Assistant" ? "bg-purple-100 text-purple-700 border-purple-200" : ""}>
                          {member}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Status</span>
                    <Badge className={`${getStatusColor(currentProject.status)} border`}>{currentProject.status.replace("-", " ").toUpperCase()}</Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Hackett IP Assets</span>
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold">{currentProject.hackettIPMatches}</span>
                      <span className="text-sm text-gray-600">matched assets</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Key Metrics</span>
                </h3>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Value Identified</span>
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-900">${(currentProject.projectValue / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-green-700">Annual savings potential</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">AI Acceleration</span>
                      <Brain className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{currentProject.aiAcceleration}%</p>
                    <p className="text-xs text-blue-700">Faster than traditional</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-800">ROI Projection</span>
                      <Target className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900">340%</p>
                    <p className="text-xs text-purple-700">3-year ROI</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phase-Specific AI Insights */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-xl font-semibold text-gray-900">AI-Powered Insights</CardTitle>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">Phase {currentProject?.currentPhase} Focus</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleConfigureAI}>
              <Settings className="h-4 w-4 mr-2" />
              Configure AI
            </Button>
          </div>
          <CardDescription className="text-gray-600">Real-time recommendations based on Hackett IP, client data, and current project phase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights
              .filter(insight => insight.phase <= (currentProject?.currentPhase || 1))
              .slice(0, 3)
              .map(insight => (
                <div key={insight.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className={`p-2 rounded-full ${
                            insight.type === "recommendation"
                              ? "bg-blue-100"
                              : insight.type === "opportunity"
                              ? "bg-green-100"
                              : insight.type === "risk"
                              ? "bg-red-100"
                              : insight.type === "automation"
                              ? "bg-purple-100"
                              : "bg-gray-100"
                          }`}
                        >
                          {insight.type === "recommendation" && <Lightbulb className="h-5 w-5 text-blue-600" />}
                          {insight.type === "opportunity" && <TrendingUp className="h-5 w-5 text-green-600" />}
                          {insight.type === "risk" && <AlertCircle className="h-5 w-5 text-red-600" />}
                          {insight.type === "automation" && <Zap className="h-5 w-5 text-purple-600" />}
                          {insight.type === "benchmark" && <BarChart3 className="h-5 w-5 text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`${getImpactColor(insight.impact)} border text-xs`}>{insight.impact.toUpperCase()} IMPACT</Badge>
                            <Badge variant="outline" className="text-xs">
                              Phase {insight.phase}
                            </Badge>
                            {insight.actionable && <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">ACTIONABLE</Badge>}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-gray-500">Source: {insight.source}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Confidence:</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${insight.confidence}%` }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">{insight.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedInsight(insight);
                          setShowInsightModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleApplyRecommendation(insight)}>
                        <CheckSquare className="h-4 w-4 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-900">AI Analysis Summary</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("analytics")}>
                View All Insights
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900">{aiInsights.filter(i => i.actionable).length}</p>
                  <p className="text-sm text-blue-700">Actionable Insights</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-900">${((currentProject?.projectValue! / 1000000) * 0.8).toFixed(1)}M</p>
                  <p className="text-sm text-green-700">High Confidence Value</p>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-900">{Math.round(aiInsights.reduce((sum, insight) => sum + insight.confidence, 0) / aiInsights.length)}%</p>
                  <p className="text-sm text-purple-700">Avg Confidence</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acceleration Impact Visualization */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Activity className="h-6 w-6 text-green-600" />
            <span>AI Acceleration Impact</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Time savings and value acceleration across all 7 transformation phases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accelerationMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="phase" stroke="#64748b" />
                <YAxis stroke="#64748b" label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name) => [`${value} days`, name === "traditional" ? "Traditional Approach" : "AI-Enhanced Approach"]}
                />
                <Area type="monotone" dataKey="traditional" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Area type="monotone" dataKey="aiEnhanced" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.7} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-2xl font-bold text-red-900">{accelerationMetrics.reduce((sum, phase) => sum + phase.traditional, 0)} days</p>
              <p className="text-sm text-red-700">Traditional Timeline</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-900">{accelerationMetrics.reduce((sum, phase) => sum + phase.aiEnhanced, 0)} days</p>
              <p className="text-sm text-blue-700">AI-Enhanced Timeline</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-2xl font-bold text-green-900">{accelerationMetrics.reduce((sum, phase) => sum + (phase.traditional - phase.aiEnhanced), 0)} days</p>
              <p className="text-sm text-green-700">Time Saved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWorkflow = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Workflow className="h-6 w-6 text-blue-600" />
            <span>7-Phase AI-Enhanced Workflow</span>
          </h2>
          <p className="text-gray-600">Finance Transformation Blueprint with intelligent automation and Hackett IP integration</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter Phases
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleAIOptimize}>
            <Brain className="h-4 w-4 mr-2" />
            AI Optimize
          </Button>
          <Button variant="outline" onClick={handleExportWorkflow}>
            <Download className="h-4 w-4 mr-2" />
            Export Workflow
          </Button>
        </div>
      </div>

      {/* Workflow Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{calculateTimeSaved()}%</div>
              <div className="text-sm text-gray-600">Time Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{accelerationMetrics.reduce((sum, phase) => sum + (phase.traditional - phase.aiEnhanced), 0)}</div>
              <div className="text-sm text-gray-600">Days Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{hackettIPUtilization.reduce((sum, ip) => sum + ip.matches, 0)}</div>
              <div className="text-sm text-gray-600">Hackett IP Assets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">7</div>
              <div className="text-sm text-gray-600">Transformation Phases</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Progress Tracker */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Phase Progress Overview</CardTitle>
          <CardDescription className="text-gray-600">Current status across all transformation phases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {workflowPhases.map((phase, index) => (
              <div key={phase.id} className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center border-2 mb-3 ${getStatusColor(phase.status)}`}>
                  {phase.status === "completed" ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : phase.status === "in-progress" ? (
                    <Play className="h-8 w-8" />
                  ) : (
                    <span className="text-xl font-bold">{phase.id}</span>
                  )}
                </div>
                <div className="text-xs font-medium text-gray-900 mb-1">{phase.title.split(" ")[0]}</div>
                <div className="text-xs text-gray-500">{phase.duration}</div>
                {phase.progress > 0 && (
                  <div className="mt-2">
                    <Progress value={phase.progress} className="h-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Phase Breakdown - Accordion Version */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Detailed Phase Breakdown</CardTitle>
          <CardDescription className="text-gray-600">AI-accelerated workflow with Hackett IP integration and intelligent automation</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-4">
            {workflowPhases.map((phase, index) => (
              <AccordionItem key={phase.id} value={`phase-${phase.id}`} className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="hover:no-underline px-6 py-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${getStatusColor(phase.status)}`}>
                        {phase.status === "completed" ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : phase.status === "in-progress" ? (
                          <Play className="h-6 w-6" />
                        ) : (
                          <span className="text-lg font-bold">{phase.id}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900">{phase.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`${getStatusColor(phase.status)} border`}>{phase.status.replace("-", " ").toUpperCase()}</Badge>
                          <span className="text-sm text-gray-500">{phase.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mr-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Zap className="h-4 w-4 text-green-600" />
                          <span className="text-lg font-bold text-green-600">{phase.aiAcceleration}%</span>
                        </div>
                        <span className="text-xs text-gray-500">acceleration</span>
                      </div>
                      {phase.progress > 0 && (
                        <div className="w-20">
                          <Progress value={phase.progress} className="h-2" />
                          <span className="text-xs text-gray-500">{phase.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6">
                    <p className="text-gray-600 leading-relaxed">{phase.description}</p>

                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="activities">Activities</TabsTrigger>
                        <TabsTrigger value="ai">AI Features</TabsTrigger>
                        <TabsTrigger value="team">Team & Tasks</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="mt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Hackett IP */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                              <Database className="h-5 w-5 text-purple-600" />
                              <span>Hackett IP Assets</span>
                            </h4>
                            <div className="space-y-2">
                              {phase.hackettIP.map((ip, idx) => (
                                <Badge key={idx} variant="outline" className="block text-xs bg-purple-50 text-purple-700 border-purple-200 p-2">
                                  {ip}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Deliverables */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-green-600" />
                              <span>Key Deliverables</span>
                            </h4>
                            <div className="space-y-2">
                              {phase.deliverables.map((deliverable, idx) => (
                                <Badge key={idx} variant="outline" className="block text-xs bg-green-50 text-green-700 border-green-200 p-2">
                                  {deliverable}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Dependencies */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                              <GitBranch className="h-5 w-5 text-orange-600" />
                              <span>Dependencies</span>
                            </h4>
                            <div className="space-y-2">
                              {phase.dependencies.length > 0 ? (
                                phase.dependencies.map((dep, idx) => (
                                  <Badge key={idx} variant="outline" className="block text-xs bg-orange-50 text-orange-700 border-orange-200 p-2">
                                    {dep}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500 italic">No dependencies</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="activities" className="mt-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                            <ClipboardList className="h-5 w-5 text-blue-600" />
                            <span>Key Activities</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {phase.keyActivities.map((activity, idx) => (
                              <div key={idx} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <CheckSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                                <span className="text-sm text-blue-800">{activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="ai" className="mt-4">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                          <h4 className="font-semibold text-purple-900 mb-4 flex items-center space-x-2">
                            <Brain className="h-5 w-5" />
                            <span>AI-Powered Enhancements</span>
                          </h4>
                          <div className="space-y-3">
                            {phase.aiSuggestions.map((suggestion, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
                                <span className="text-sm text-purple-800">{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="team" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                              <Users2 className="h-5 w-5 text-indigo-600" />
                              <span>Team Roles</span>
                            </h4>
                            <div className="space-y-2">
                              {phase.teamRole.map((role, idx) => (
                                <Badge key={idx} variant="outline" className="block text-xs bg-indigo-50 text-indigo-700 border-indigo-200 p-2">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                              <Building className="h-5 w-5 text-gray-600" />
                              <span>Client Tasks</span>
                            </h4>
                            <div className="space-y-2">
                              {phase.clientTasks.map((task, idx) => (
                                <Badge key={idx} variant="outline" className="block text-xs bg-gray-50 text-gray-700 border-gray-200 p-2">
                                  {task}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPhaseDetail(phase);
                          setShowPhaseModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleGoToPhase(phase.id)}>
                        <ArrowRight className="h-4 w-4 mr-1" />
                        Go to Phase
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );

  const renderHackettIP = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Database className="h-6 w-6 text-purple-600" />
            <span>Hackett IP Integration</span>
          </h2>
          <p className="text-gray-600">Intelligent matching and utilization of Hackett intellectual property across all phases</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search Hackett IP..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-64" />
          </div>
          <Button variant="outline" onClick={handleFilterByPhase}>
            <Filter className="h-4 w-4 mr-2" />
            Filter by Phase
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* IP Utilization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">IP Asset Distribution</CardTitle>
            <CardDescription className="text-gray-600">Assets matched to current engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={hackettIPUtilization} cx="50%" cy="50%" outerRadius={80} dataKey="matches" label={({ category, matches }) => `${category}: ${matches}`}>
                    {hackettIPUtilization.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Utilization Rates</CardTitle>
            <CardDescription className="text-gray-600">Active usage across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hackettIPUtilization.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{item.category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{item.utilization}%</span>
                      <Badge variant="outline" className="text-xs">
                        {item.relevant}/{item.matches}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${item.utilization}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-900">AI Matching Summary</CardTitle>
            <CardDescription className="text-purple-700">Intelligent asset recommendation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                <div className="text-3xl font-bold text-purple-600">{hackettIPUtilization.reduce((sum, ip) => sum + ip.matches, 0)}</div>
                <div className="text-sm text-purple-700">Total Assets Matched</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                <div className="text-3xl font-bold text-green-600">{hackettIPUtilization.reduce((sum, ip) => sum + ip.relevant, 0)}</div>
                <div className="text-sm text-green-700">Highly Relevant</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                <div className="text-3xl font-bold text-blue-600">{Math.round(hackettIPUtilization.reduce((sum, ip) => sum + ip.utilization, 0) / hackettIPUtilization.length)}%</div>
                <div className="text-sm text-blue-700">Avg Utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase-Specific IP Assets */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Phase-Specific IP Assets</CardTitle>
          <CardDescription className="text-gray-600">Hackett IP organized by transformation phase</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="phase1" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              {[1, 2, 3, 4, 5, 6, 7].map(phase => (
                <TabsTrigger key={phase} value={`phase${phase}`} className="text-xs">
                  Phase {phase}
                </TabsTrigger>
              ))}
            </TabsList>

            {[1, 2, 3, 4, 5, 6, 7].map(phaseNum => (
              <TabsContent key={phaseNum} value={`phase${phaseNum}`} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workflowPhases
                    .find(p => p.id === phaseNum)
                    ?.hackettIP.map((ip, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50 to-white">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 text-sm">{ip}</h3>
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-xs text-gray-600">High relevance</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Available IP Assets Library - Accordion Version */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Available IP Assets Library</CardTitle>
          <CardDescription className="text-gray-600">Comprehensive collection of Hackett intellectual property for Finance Transformation</CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            const ipAssets = [
              {
                title: "Finance Function Maturity Model",
                type: "Framework",
                relevance: 95,
                usage: "Active",
                description: "Comprehensive maturity assessment across 6 capabilities",
                phase: 2,
                category: "Assessment & Maturity",
              },
              {
                title: "Digital World Class Benchmarks",
                type: "Benchmark",
                relevance: 92,
                usage: "Active",
                description: "Industry-leading performance metrics and KPIs",
                phase: 3,
                category: "Benchmarks & Standards",
              },
              {
                title: "Process Automation Playbook",
                type: "Playbook",
                relevance: 88,
                usage: "Pending",
                description: "Step-by-step guide for finance process automation",
                phase: 4,
                category: "Implementation Guides",
              },
              {
                title: "ROI Calculation Templates",
                type: "Template",
                relevance: 85,
                usage: "Active",
                description: "Standardized business case and ROI models",
                phase: 4,
                category: "Templates & Tools",
              },
              {
                title: "Change Management Framework",
                type: "Framework",
                relevance: 82,
                usage: "Available",
                description: "Proven approach for organizational transformation",
                phase: 5,
                category: "Change Management",
              },
              {
                title: "Technology Assessment Guide",
                type: "Guide",
                relevance: 79,
                usage: "Available",
                description: "ERP and technology evaluation criteria",
                phase: 1,
                category: "Assessment & Maturity",
              },
              {
                title: "Shared Services Operating Model",
                type: "Model",
                relevance: 94,
                usage: "Active",
                description: "GBS structure and governance templates",
                phase: 4,
                category: "Operating Models",
              },
              {
                title: "AI Implementation Roadmap",
                type: "Roadmap",
                relevance: 91,
                usage: "Pending",
                description: "Intelligent automation adoption strategy",
                phase: 4,
                category: "Implementation Guides",
              },
              {
                title: "Executive Interview Guide",
                type: "Guide",
                relevance: 87,
                usage: "Active",
                description: "Structured stakeholder engagement templates",
                phase: 2,
                category: "Templates & Tools",
              },
              {
                title: "Cost Reduction Benchmarks",
                type: "Benchmark",
                relevance: 89,
                usage: "Active",
                description: "Industry cost reduction standards and metrics",
                phase: 3,
                category: "Benchmarks & Standards",
              },
              {
                title: "Project Management Templates",
                type: "Template",
                relevance: 76,
                usage: "Available",
                description: "Comprehensive project planning and tracking tools",
                phase: 1,
                category: "Templates & Tools",
              },
              {
                title: "Organizational Change Playbook",
                type: "Playbook",
                relevance: 84,
                usage: "Active",
                description: "Best practices for managing transformation change",
                phase: 5,
                category: "Change Management",
              },
              {
                title: "Financial Controls Framework",
                type: "Framework",
                relevance: 88,
                usage: "Available",
                description: "Governance and risk management structures",
                phase: 6,
                category: "Operating Models",
              },
              {
                title: "Performance Dashboard Templates",
                type: "Template",
                relevance: 83,
                usage: "Pending",
                description: "Executive reporting and KPI dashboards",
                phase: 6,
                category: "Templates & Tools",
              },
            ];

            const groupedAssets = ipAssets.reduce((acc, asset) => {
              if (!acc[asset.category]) {
                acc[asset.category] = [];
              }
              acc[asset.category].push(asset);
              return acc;
            }, {} as Record<string, typeof ipAssets>);

            return (
              <Accordion type="multiple" className="w-full space-y-4">
                {Object.entries(groupedAssets).map(([category, assets]) => (
                  <AccordionItem key={category} value={category} className="border border-gray-200 rounded-lg">
                    <AccordionTrigger className="hover:no-underline px-6 py-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Database className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="text-left">
                            <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                            <p className="text-sm text-gray-600">{assets.length} assets available</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mr-4">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">{assets.filter(a => a.usage === "Active").length} Active</Badge>
                          <Badge variant="outline" className="text-xs">
                            Avg {Math.round(assets.reduce((sum, a) => sum + a.relevance, 0) / assets.length)}% relevance
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assets.map((asset, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-gray-50">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm mb-1">{asset.title}</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">{asset.description}</p>
                              </div>
                              <Badge
                                className={`ml-2 ${
                                  asset.usage === "Active"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : asset.usage === "Pending"
                                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                }`}
                              >
                                {asset.usage}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                {asset.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                Phase {asset.phase}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Relevance:</span>
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${asset.relevance}%` }}></div>
                                </div>
                                <span className="text-xs font-medium text-gray-700">{asset.relevance}%</span>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedIPAsset(asset);
                                    setShowIPAssetModal(true);
                                  }}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => handleUseInProject(asset)}>
                                  <Plus className="h-3 w-3 mr-1" />
                                  Use
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-green-600" />
            <span>Analytics & Insights</span>
          </h2>
          <p className="text-gray-600">AI-powered analysis and benchmarking insights</p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => {
            const analyticsData = {
              projectMetrics: {
                valueIdentified: currentProject?.projectValue,
                timeSaved: calculateTimeSaved(),
                aiConfidence: Math.round(aiInsights.reduce((sum, insight) => sum + insight.confidence, 0) / aiInsights.length),
                roiPotential: 340,
              },
              maturityAssessment: [
                { capability: "Financial Planning", current: 2.8, target: 4.5, benchmark: 3.8 },
                { capability: "Reporting", current: 3.2, target: 4.8, benchmark: 4.1 },
                { capability: "Process Automation", current: 1.9, target: 4.2, benchmark: 3.5 },
                { capability: "Analytics", current: 2.1, target: 4.6, benchmark: 3.9 },
                { capability: "Business Partnering", current: 3.5, target: 4.7, benchmark: 4.0 },
                { capability: "Risk Management", current: 2.6, target: 4.3, benchmark: 3.7 },
              ],
              exportDate: new Date(),
            };

            const dataStr = JSON.stringify(analyticsData, null, 2);
            const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

            const exportFileDefaultName = `${currentProject?.clientName}_Analytics_Report.json`;

            const linkElement = document.createElement("a");
            linkElement.setAttribute("href", dataUri);
            linkElement.setAttribute("download", exportFileDefaultName);
            linkElement.click();

            alert(`Analytics exported successfully! Downloaded as ${exportFileDefaultName}`);
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Analysis
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Value Identified</p>
                <p className="text-3xl font-bold text-green-600">$12.4M</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">+23% vs benchmark</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Saved</p>
                <p className="text-3xl font-bold text-blue-600">47%</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">6.2 weeks faster</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Confidence</p>
                <p className="text-3xl font-bold text-purple-600">89%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">High accuracy</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ROI Potential</p>
                <p className="text-3xl font-bold text-orange-600">340%</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">3-year projection</p>
          </CardContent>
        </Card>
      </div>

      {/* Capability Maturity Radar */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Capability Maturity Assessment</CardTitle>
          <CardDescription className="text-gray-600">Current vs target state across key finance capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={[
                  { capability: "Financial Planning", current: 2.8, target: 4.5, benchmark: 3.8 },
                  { capability: "Reporting", current: 3.2, target: 4.8, benchmark: 4.1 },
                  { capability: "Process Automation", current: 1.9, target: 4.2, benchmark: 3.5 },
                  { capability: "Analytics", current: 2.1, target: 4.6, benchmark: 3.9 },
                  { capability: "Business Partnering", current: 3.5, target: 4.7, benchmark: 4.0 },
                  { capability: "Risk Management", current: 2.6, target: 4.3, benchmark: 3.7 },
                ]}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="capability" />
                <PolarRadiusAxis angle={90} domain={[0, 5]} />
                <Radar name="Current" dataKey="current" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transformation Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Process Efficiency Gains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { process: "Invoice Processing", current: 5.2, improved: 1.1, savings: 79 },
                    { process: "Month-end Close", current: 8, improved: 3, savings: 63 },
                    { process: "Expense Management", current: 12, improved: 2, savings: 83 },
                    { process: "Financial Reporting", current: 24, improved: 4, savings: 83 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="process" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="current" fill="#ef4444" name="Current (days)" />
                  <Bar dataKey="improved" fill="#10b981" name="Improved (days)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Value Creation Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: "Month 1", cumulative: 0.8, monthly: 0.8 },
                    { month: "Month 3", cumulative: 2.4, monthly: 1.6 },
                    { month: "Month 6", cumulative: 5.2, monthly: 2.8 },
                    { month: "Month 9", cumulative: 8.7, monthly: 3.5 },
                    { month: "Month 12", cumulative: 12.4, monthly: 3.7 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip formatter={value => [`$${value}M`, ""]} />
                  <Line type="monotone" dataKey="cumulative" stroke="#3b82f6" strokeWidth={3} name="Cumulative Value" />
                  <Line type="monotone" dataKey="monthly" stroke="#10b981" strokeWidth={2} name="Monthly Value" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Transformation XPLR</h1>
                  <p className="text-xs text-gray-500">AI-Powered Finance Transformation</p>
                </div>
              </div>
              {currentProject && (
                <div className="hidden md:block pl-6 border-l border-gray-200">
                  <span className="text-sm text-gray-500">Active:</span>
                  <span className="ml-2 font-medium text-gray-900">{currentProject.clientName}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setShowAIAssistant(true)}>
                <Brain className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "command-center", label: "Command Center", icon: Activity },
              { id: "workflow", label: "AI Workflow", icon: Workflow },
              { id: "hackett-ip", label: "Hackett IP", icon: Database },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "command-center" && renderCommandCenter()}
        {activeTab === "workflow" && renderWorkflow()}
        {activeTab === "hackett-ip" && renderHackettIP()}
        {activeTab === "analytics" && renderAnalytics()}
      </main>

      {/* Client Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Plus className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-xl font-semibold">New Finance Transformation Project</CardTitle>
                    <CardDescription className="text-blue-100">AI-powered client onboarding and project setup</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowOnboarding(false)} className="text-white hover:bg-white/20">
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Client Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      <span>Client Information</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" placeholder="Enter company name..." className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="financial-services">Financial Services</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="energy">Energy & Utilities</SelectItem>
                              <SelectItem value="infrastructure">Infrastructure & Construction</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="region">Region</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="north-america">North America</SelectItem>
                              <SelectItem value="europe">Europe</SelectItem>
                              <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                              <SelectItem value="latin-america">Latin America</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="revenue">Annual Revenue</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-100m">Under $100M</SelectItem>
                              <SelectItem value="100m-500m">$100M - $500M</SelectItem>
                              <SelectItem value="500m-1b">$500M - $1B</SelectItem>
                              <SelectItem value="1b-5b">$1B - $5B</SelectItem>
                              <SelectItem value="over-5b">Over $5B</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="employees">Employees</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-1000">Under 1,000</SelectItem>
                              <SelectItem value="1000-5000">1,000 - 5,000</SelectItem>
                              <SelectItem value="5000-10000">5,000 - 10,000</SelectItem>
                              <SelectItem value="10000-50000">10,000 - 50,000</SelectItem>
                              <SelectItem value="over-50000">Over 50,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Configuration */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-purple-600" />
                      <span>Project Configuration</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="engagementType">Engagement Type</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select engagement type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blueprint">Finance Transformation Blueprint</SelectItem>
                            <SelectItem value="implementation">Full Implementation</SelectItem>
                            <SelectItem value="assessment">Maturity Assessment</SelectItem>
                            <SelectItem value="optimization">Process Optimization</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="currentERP">Current ERP System</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select ERP system" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="oracle-fusion">Oracle Fusion</SelectItem>
                            <SelectItem value="sap-s4hana">SAP S/4HANA</SelectItem>
                            <SelectItem value="sap-ecc">SAP ECC</SelectItem>
                            <SelectItem value="workday">Workday</SelectItem>
                            <SelectItem value="netsuite">NetSuite</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="timeline">Project Timeline</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3-months">3 months</SelectItem>
                              <SelectItem value="6-months">6 months</SelectItem>
                              <SelectItem value="12-months">12 months</SelectItem>
                              <SelectItem value="18-months">18+ months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="budget">Budget Range</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-500k">Under $500K</SelectItem>
                              <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                              <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                              <SelectItem value="over-2m">Over $2M</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pain Points & Objectives */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span>Pain Points & Objectives</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="painPoints">Key Pain Points</Label>
                      <Textarea id="painPoints" placeholder="Describe current challenges in finance operations..." className="mt-1 h-24" />
                    </div>
                    <div>
                      <Label htmlFor="objectives">Transformation Objectives</Label>
                      <Textarea id="objectives" placeholder="Describe desired outcomes and goals..." className="mt-1 h-24" />
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>AI-Powered Recommendations</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Database className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-900">Hackett IP Match</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">847</p>
                      <p className="text-sm text-purple-700">Relevant assets identified</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Timeline Estimate</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">14 weeks</p>
                      <p className="text-sm text-blue-700">AI-accelerated delivery</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">Value Potential</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">$8.5M</p>
                      <p className="text-sm text-green-700">Estimated annual impact</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Button variant="outline" onClick={() => setShowOnboarding(false)}>
                    Cancel
                  </Button>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={handleUploadSOW}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload SOW
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleInitializeProject}>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Initialize Project
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Assistant Chat Sheet */}
      <Sheet open={showAIAssistant} onOpenChange={setShowAIAssistant}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col bg-white">
          <SheetHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold">AI Assistant</SheetTitle>
                <SheetDescription>Your intelligent transformation guide for MasTec</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col mt-6">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {chatMessages.map(message => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs justify-start" onClick={() => setChatInput("What's the current phase status?")}>
                  <Activity className="h-3 w-3 mr-1" />
                  Phase Status
                </Button>
                <Button variant="outline" size="sm" className="text-xs justify-start" onClick={() => setChatInput("Show me the value opportunities")}>
                  <DollarSign className="h-3 w-3 mr-1" />
                  Value Analysis
                </Button>
                <Button variant="outline" size="sm" className="text-xs justify-start" onClick={() => setChatInput("What are the current risks?")}>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Risk Assessment
                </Button>
                <Button variant="outline" size="sm" className="text-xs justify-start" onClick={() => setChatInput("What should we do next?")}>
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Next Steps
                </Button>
              </div>
            </div>

            {/* Chat Input */}
            <div className="mt-4 flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask me anything about the transformation..."
                  className="pr-10"
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button size="sm" onClick={handleSendMessage} disabled={!chatInput.trim()} className="absolute right-1 top-1 h-8 w-8 p-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500 text-center">AI responses are based on project data and Hackett benchmarks</div>
          </div>
        </SheetContent>
      </Sheet>

      {/* AI Insight Detail Modal */}
      {showInsightModal && selectedInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {selectedInsight.type === "recommendation" && <Lightbulb className="h-6 w-6" />}
                  {selectedInsight.type === "opportunity" && <TrendingUp className="h-6 w-6" />}
                  {selectedInsight.type === "risk" && <AlertCircle className="h-6 w-6" />}
                  {selectedInsight.type === "automation" && <Zap className="h-6 w-6" />}
                  {selectedInsight.type === "benchmark" && <BarChart3 className="h-6 w-6" />}
                  <CardTitle className="text-xl font-semibold">{selectedInsight.title}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowInsightModal(false)} className="text-white hover:bg-white/20">
                  ×
                </Button>
              </div>
              <CardDescription className="text-purple-100">
                AI-Generated {selectedInsight.type} • Phase {selectedInsight.phase}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Badge className={`${getImpactColor(selectedInsight.impact)} border`}>{selectedInsight.impact.toUpperCase()} IMPACT</Badge>
                  <Badge className="bg-green-100 text-green-700 border-green-200">{selectedInsight.confidence}% Confidence</Badge>
                  {selectedInsight.actionable && <Badge className="bg-blue-100 text-blue-700 border-blue-200">ACTIONABLE</Badge>}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedInsight.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Data Source</h3>
                  <p className="text-gray-600">{selectedInsight.source}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Recommended Actions</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <CheckSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                      <span className="text-sm text-blue-800">Review detailed analysis with project team</span>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <CheckSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                      <span className="text-sm text-blue-800">Validate assumptions with client stakeholders</span>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <CheckSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                      <span className="text-sm text-blue-800">Develop implementation timeline and resource plan</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button variant="outline" onClick={() => setShowInsightModal(false)}>
                    Close
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      handleApplyRecommendation(selectedInsight!);
                      setShowInsightModal(false);
                    }}
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Apply Recommendation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Phase Detail Modal */}
      {showPhaseModal && selectedPhaseDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 border-white/20 bg-white/10`}>
                    {selectedPhaseDetail.status === "completed" ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : selectedPhaseDetail.status === "in-progress" ? (
                      <Play className="h-6 w-6" />
                    ) : (
                      <span className="text-lg font-bold">{selectedPhaseDetail.id}</span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">{selectedPhaseDetail.title}</CardTitle>
                    <CardDescription className="text-blue-100">
                      Phase {selectedPhaseDetail.id} • {selectedPhaseDetail.duration}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowPhaseModal(false)} className="text-white hover:bg-white/20">
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">AI Acceleration</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{selectedPhaseDetail.aiAcceleration}%</p>
                    <p className="text-sm text-green-700">Faster than traditional</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Duration</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{selectedPhaseDetail.duration}</p>
                    <p className="text-sm text-blue-700">vs {selectedPhaseDetail.traditionalDuration}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Database className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-purple-900">Hackett IP</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{selectedPhaseDetail.hackettIP.length}</p>
                    <p className="text-sm text-purple-700">Assets available</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Phase Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedPhaseDetail.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Key Activities</h3>
                    <div className="space-y-2">
                      {selectedPhaseDetail.keyActivities.map((activity, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <CheckSquare className="h-4 w-4 text-blue-600 mt-1" />
                          <span className="text-sm text-gray-700">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Deliverables</h3>
                    <div className="space-y-2">
                      {selectedPhaseDetail.deliverables.map((deliverable, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <FileText className="h-4 w-4 text-green-600 mt-1" />
                          <span className="text-sm text-gray-700">{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">AI-Powered Enhancements</h3>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                    <div className="space-y-3">
                      {selectedPhaseDetail.aiSuggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <Brain className="h-4 w-4 text-purple-600 mt-1" />
                          <span className="text-sm text-purple-800">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button variant="outline" onClick={() => setShowPhaseModal(false)}>
                    Close
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      handleGoToPhase(selectedPhaseDetail!.id);
                      setShowPhaseModal(false);
                    }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Go to Phase
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* IP Asset Detail Modal */}
      {showIPAssetModal && selectedIPAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white w-full max-w-3xl mx-4 max-h-[80vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Database className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-xl font-semibold">{selectedIPAsset.title}</CardTitle>
                    <CardDescription className="text-purple-100">
                      {selectedIPAsset.type} • Phase {selectedIPAsset.phase}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowIPAssetModal(false)} className="text-white hover:bg-white/20">
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-purple-900">Relevance</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{selectedIPAsset.relevance}%</p>
                    <p className="text-sm text-purple-700">Match confidence</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Status</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{selectedIPAsset.usage}</p>
                    <p className="text-sm text-blue-700">Current usage</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">Category</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">{selectedIPAsset.type}</p>
                    <p className="text-sm text-green-700">Asset type</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedIPAsset.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900 block">Comprehensive Framework</span>
                        <span className="text-sm text-gray-600">Industry-proven methodology</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900 block">Benchmarked Data</span>
                        <span className="text-sm text-gray-600">Real industry performance metrics</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Zap className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900 block">AI-Enhanced</span>
                        <span className="text-sm text-gray-600">Intelligent recommendations</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900 block">Team Collaboration</span>
                        <span className="text-sm text-gray-600">Multi-stakeholder engagement</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Implementation Guide</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-sm text-blue-800">Download and review the complete asset documentation</span>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-sm text-blue-800">Customize templates and frameworks for client context</span>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-sm text-blue-800">Engage stakeholders and gather required data inputs</span>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <span className="text-sm text-blue-800">Execute activities and track progress against milestones</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Button variant="outline" onClick={() => setShowIPAssetModal(false)}>
                    Close
                  </Button>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => handleDownloadAsset(selectedIPAsset)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Asset
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => {
                        handleUseInProject(selectedIPAsset);
                        setShowIPAssetModal(false);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Use in Project
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TransformationXPLR;
