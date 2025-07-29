"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  Timer,
  Users,
  Target,
  Brain,
  Zap,
  FileText,
  AlertTriangle,
  TrendingUp,
  Activity,
  Eye,
  PlayCircle,
  PauseCircle,
  Calendar,
  BarChart3,
  Sparkles,
  RefreshCw,
  Plus,
  DollarSign,
  X,
  Filter,
  Search,
  Download,
  Settings,
  MoreHorizontal,
  Star,
  Shield,
  Globe,
  Bookmark,
  Info,
  CheckCircle2,
  AlertCircle,
  Circle,
  Loader2,
  Database,
  ExternalLink,
} from "lucide-react";
import { WorkflowPhase } from "../../types";
import { PHASE_COLORS } from "../../constants/workflowData";

// Safe JSON parsing helper - ensures we always get an array
const safeJsonParse = (value: any, fallback: any[] = []): any[] => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

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

interface WorkflowPhasesProps {
  phases: WorkflowPhase[];
  currentPhase: number;
  onPhaseSelect: (phase: WorkflowPhase) => void;
  onViewDetails: (phase: WorkflowPhase) => void;
  onPhaseStateChange?: (phaseId: number, newStatus: WorkflowPhase["status"], newProgress?: number) => void;
  onAIAssistantOpen?: (action: string, context: any) => void;
  onGenerateAI?: () => Promise<void>; // New callback for AI analysis generation
  // New cross-section navigation and phase management functions
  onPhaseProgress?: (phaseId: number, newProgress: number) => void;
  onPhaseCompletion?: (phaseId: number) => void;
  onViewAnalytics?: (phaseNumber: number) => void;
  onAccessHackettIP?: (category?: string) => void;
  insights?: any; // Added insights prop
}

export const WorkflowPhases: React.FC<WorkflowPhasesProps> = ({
  phases,
  currentPhase,
  onPhaseSelect,
  onViewDetails,
  onPhaseStateChange,
  onAIAssistantOpen,
  onGenerateAI,
  onPhaseProgress,
  onPhaseCompletion,
  onViewAnalytics,
  onAccessHackettIP,
  insights,
}) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(currentPhase);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loadingPhases, setLoadingPhases] = useState<Set<number>>(new Set());
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => void;
    type: "destructive" | "default";
  }>({ open: false, title: "", description: "", action: () => {}, type: "default" });
  const [phaseAssets, setPhaseAssets] = useState<Record<number, HackettIPAsset[]>>({});
  const [loadingAssets, setLoadingAssets] = useState<Record<number, boolean>>({});

  // Progress bar state for AI generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState("");

  // Enhanced status functions
  const getStatusIcon = useCallback((status: WorkflowPhase["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Activity className="h-5 w-5 text-blue-600 animate-pulse" />;
      case "ai-enhanced":
        return <Brain className="h-5 w-5 text-purple-600 animate-pulse" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  }, []);

  const getStatusColor = useCallback((status: WorkflowPhase["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ai-enhanced":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  }, []);

  // Enhanced phase statistics
  const phaseStats = useMemo(() => {
    const total = phases.length;
    const completed = phases.filter(p => p.status === "completed").length;
    const inProgress = phases.filter(p => p.status === "in-progress" || p.status === "ai-enhanced").length;
    const pending = phases.filter(p => p.status === "pending").length;
    const totalProgress = Math.round(phases.reduce((sum, phase) => sum + phase.progress, 0) / phases.length);
    const averageAIAcceleration = Math.round(phases.reduce((sum, phase) => sum + phase.aiAcceleration, 0) / phases.length);
    const estimatedValue = phases.reduce((sum, phase) => sum + (phase.estimatedCompletion ? 1000000 : 0), 0);
    const criticalRisks = phases.filter(p => p.riskFactors && p.riskFactors.length > 0).length;

    return {
      total,
      completed,
      inProgress,
      pending,
      totalProgress,
      averageAIAcceleration,
      estimatedValue,
      criticalRisks,
      onTrack: inProgress + completed >= total * 0.6,
      completionRate: (completed / total) * 100,
    };
  }, [phases]);

  // Filtered phases based on search and filters
  const filteredPhases = useMemo(() => {
    return phases.filter(phase => {
      const matchesSearch = searchQuery === "" || phase.title.toLowerCase().includes(searchQuery.toLowerCase()) || phase.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === "all" || phase.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [phases, searchQuery, filterStatus]);

  // Enhanced action handlers with loading states and confirmations
  const handlePhaseAction = useCallback(async (phaseId: number, action: string, requiresConfirmation = false, confirmationMessage = "") => {
    if (requiresConfirmation) {
      setConfirmationDialog({
        open: true,
        title: `Confirm ${action}`,
        description: confirmationMessage,
        action: () => executePhaseAction(phaseId, action),
        type: action.includes("reset") || action.includes("delete") ? "destructive" : "default",
      });
      return;
    }

    await executePhaseAction(phaseId, action);
  }, []);

  const executePhaseAction = useCallback(
    async (phaseId: number, action: string) => {
      setLoadingPhases(prev => new Set(Array.from(prev).concat(phaseId)));

      try {
        // Simulate API call delay for enterprise feel
        await new Promise(resolve => setTimeout(resolve, 800));

        const phase = phases.find(p => p.id === phaseId);
        if (!phase) return;

        switch (action) {
          case "start":
            onPhaseStateChange?.(phaseId, "in-progress", 0);
            break;
          case "pause":
            onPhaseStateChange?.(phaseId, "pending", phase.progress);
            break;
          case "complete":
            onPhaseStateChange?.(phaseId, "completed", 100);
            break;
          case "reset":
            onPhaseStateChange?.(phaseId, "pending", 0);
            break;
          case "ai-enhance":
            onPhaseStateChange?.(phaseId, "ai-enhanced", phase.progress);
            break;
        }
      } finally {
        setLoadingPhases(prev => {
          const newArray = Array.from(prev).filter(id => id !== phaseId);
          return new Set(newArray);
        });
        setConfirmationDialog(prev => ({ ...prev, open: false }));
      }
    },
    [phases, onPhaseStateChange]
  );

  // Add missing helper functions
  const selectedPhase = useMemo(() => {
    return phases.find(p => p.id === selectedPhaseId) || phases[0];
  }, [phases, selectedPhaseId]);

  const handlePhaseClick = useCallback(
    (phase: WorkflowPhase) => {
      setSelectedPhaseId(phase.id);
      onPhaseSelect(phase);
    },
    [onPhaseSelect]
  );

  const handleStartPhase = useCallback(
    (phase: WorkflowPhase) => {
      handlePhaseAction(phase.id, "start");
    },
    [handlePhaseAction]
  );

  // Enterprise Phase Actions Component
  const EnterprisePhaseActions = React.memo(
    ({ phase, onAction, isLoading }: { phase: WorkflowPhase; onAction: (id: number, action: string, requiresConfirmation?: boolean, message?: string) => void; isLoading: boolean }) => {
      if (phase.status === "completed") {
        return (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs bg-green-50/80 border-green-200 text-green-700 hover:bg-green-100/80 backdrop-blur-sm"
            onClick={e => {
              e.stopPropagation();
              onAction(phase.id, "reset", true, "Are you sure you want to reset this completed phase? This will set the progress back to 0%.");
            }}
            disabled={isLoading}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        );
      }

      if (phase.status === "in-progress" || phase.status === "ai-enhanced") {
        return (
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs bg-orange-50/80 border-orange-200 text-orange-700 hover:bg-orange-100/80 backdrop-blur-sm"
              onClick={e => {
                e.stopPropagation();
                onAction(phase.id, "pause");
              }}
              disabled={isLoading}
            >
              <PauseCircle className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs bg-green-50/80 border-green-200 text-green-700 hover:bg-green-100/80 backdrop-blur-sm"
              onClick={e => {
                e.stopPropagation();
                onAction(phase.id, "complete", true, "Mark this phase as complete? This will set progress to 100%.");
              }}
              disabled={isLoading}
            >
              <CheckCircle2 className="h-3 w-3" />
            </Button>
          </div>
        );
      }

      // Pending status
      return (
        <Button
          variant="default"
          size="sm"
          className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white backdrop-blur-sm"
          onClick={e => {
            e.stopPropagation();
            onAction(phase.id, "start");
          }}
          disabled={isLoading}
        >
          <PlayCircle className="h-3 w-3 mr-1" />
          Start
        </Button>
      );
    }
  );

  // New phase state manipulation functions
  const handlePausePhase = useCallback(
    (phaseId: number) => {
      onPhaseStateChange?.(phaseId, "in-progress", undefined);
    },
    [onPhaseStateChange]
  );

  const handleCompletePhase = useCallback(
    (phaseId: number) => {
      onPhaseStateChange?.(phaseId, "completed", 100);
    },
    [onPhaseStateChange]
  );

  const handleResetPhase = useCallback(
    (phaseId: number) => {
      onPhaseStateChange?.(phaseId, "pending", 0);
    },
    [onPhaseStateChange]
  );

  const handleEnhanceWithAI = useCallback(
    (phaseId: number, enhancementType: string) => {
      const phase = phases.find(p => p.id === phaseId);
      if (phase && onAIAssistantOpen) {
        const context = {
          phaseId,
          phaseName: phase.title,
          phaseStatus: phase.status,
          phaseProgress: phase.progress,
          enhancementType,
        };
        onAIAssistantOpen(enhancementType, context);
      }
    },
    [phases, onAIAssistantOpen]
  );

  // AI-powered content modification functions
  const enhancePhaseContent = useCallback(
    (phaseId: number, contentType: string) => {
      const phase = phases.find(p => p.id === phaseId);
      if (phase && onAIAssistantOpen) {
        let action = "";
        let context = {
          phaseId,
          phaseName: phase.title,
          currentContent: {},
          enhancementRequest: contentType,
        };

        switch (contentType) {
          case "deliverables":
            action = `Enhance Phase ${phaseId} deliverables for ${phase.title}. Current deliverables: ${safeJsonParse(phase.deliverables).join(
              ", "
            )}. Provide detailed descriptions, quality criteria, and success metrics for each deliverable.`;
            context.currentContent = { deliverables: safeJsonParse(phase.deliverables) };
            break;
          case "activities":
            action = `Optimize Phase ${phaseId} key activities for ${phase.title}. Current activities: ${safeJsonParse(phase.keyActivities).join(
              ", "
            )}. Suggest improvements, automation opportunities, and best practices.`;
            context.currentContent = { activities: safeJsonParse(phase.keyActivities) };
            break;
          case "risks":
            action = `Analyze and expand Phase ${phaseId} risk assessment for ${phase.title}. Current risks: ${
              safeJsonParse(phase.riskFactors).join(", ") || "No risks identified"
            }. Provide detailed risk analysis with mitigation strategies and contingency plans.`;
            context.currentContent = { risks: safeJsonParse(phase.riskFactors) };
            break;
          case "success-criteria":
            action = `Refine Phase ${phaseId} success criteria for ${phase.title}. Current criteria: ${
              safeJsonParse(phase.successMetrics).join(", ") || "No metrics defined"
            }. Make them SMART (Specific, Measurable, Achievable, Relevant, Time-bound).`;
            context.currentContent = { successCriteria: safeJsonParse(phase.successMetrics) };
            break;
          case "optimization":
            action = `Provide comprehensive optimization recommendations for Phase ${phaseId}: ${phase.title}. Analyze timeline (${phase.duration}), deliverables, activities, and team requirements. Suggest AI acceleration opportunities.`;
            context.currentContent = {
              timeline: phase.duration,
              deliverables: safeJsonParse(phase.deliverables),
              activities: safeJsonParse(phase.keyActivities),
              status: phase.status,
              progress: phase.progress,
            };
            break;
          default:
            action = `Provide general enhancement recommendations for Phase ${phaseId}: ${phase.title}.`;
        }

        onAIAssistantOpen(action, context);
      }
    },
    [phases, onAIAssistantOpen]
  );

  // Phase collaboration functions
  const generatePhaseReport = useCallback(
    (phaseId: number) => {
      const phase = phases.find(p => p.id === phaseId);
      if (phase && onAIAssistantOpen) {
        const action = `Generate a comprehensive Phase ${phaseId} status report for ${phase.title}. Include:
      - Current Progress: ${Math.round(phase.progress)}% complete
      - Status: ${phase.status}
      - Timeline: ${phase.duration}
      - Completed Deliverables: ${safeJsonParse(phase.deliverables)
        .filter((_, i) => i < Math.floor((phase.progress / 100) * safeJsonParse(phase.deliverables).length))
        .join(", ")}
      - Pending Activities: ${safeJsonParse(phase.keyActivities)
        .filter((_, i) => i >= Math.floor((phase.progress / 100) * safeJsonParse(phase.keyActivities).length))
        .join(", ")}
      - Risk Status: ${safeJsonParse(phase.riskFactors).join(", ") || "No risks identified"}
      - Team Performance: Based on ${safeJsonParse(phase.teamRole).length} role assignments
      
      Format as an executive summary with next steps and recommendations.`;

        onAIAssistantOpen(action, { phaseId, phase });
      }
    },
    [phases, onAIAssistantOpen]
  );

  const createActionPlan = useCallback(
    (phaseId: number) => {
      const phase = phases.find(p => p.id === phaseId);
      if (phase && onAIAssistantOpen) {
        const action = `Create a detailed 2-week action plan for Phase ${phaseId}: ${phase.title}. 
      Current status: ${phase.status} (${Math.round(phase.progress)}% complete)
      
      Include:
      - Prioritized tasks with owners and deadlines
      - Resource requirements and dependencies  
      - Risk mitigation actions
      - Success metrics and checkpoints
      - AI acceleration opportunities
      
      Focus on moving from ${Math.round(phase.progress)}% to ${Math.min(100, Math.round(phase.progress) + 25)}% completion.`;

        onAIAssistantOpen(action, { phaseId, phase, targetProgress: Math.min(100, Math.round(phase.progress) + 25) });
      }
    },
    [phases, onAIAssistantOpen]
  );

  // Enhanced action buttons component
  const PhaseActionButtons = React.memo(({ phase, compact = false }: { phase: WorkflowPhase; compact?: boolean }) => {
    if (phase.status === "completed") {
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          onClick={e => {
            e.stopPropagation();
            onViewDetails(phase);
          }}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Done
        </Button>
      );
    }

    if (phase.status === "in-progress" || phase.status === "ai-enhanced") {
      return (
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
            onClick={e => {
              e.stopPropagation();
              handlePausePhase(phase.id);
            }}
          >
            <PauseCircle className="h-3 w-3 mr-1" />
            Pause
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            onClick={e => {
              e.stopPropagation();
              handleCompletePhase(phase.id);
            }}
          >
            <CheckCircle className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    // Pending status
    return (
      <Button
        variant="default"
        size="sm"
        className="h-8 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
        onClick={e => {
          e.stopPropagation();
          handleStartPhase(phase);
        }}
      >
        <PlayCircle className="h-3 w-3 mr-1" />
        Start
      </Button>
    );
  });

  // Calculate overall progress and phases for the new progress bar
  const overallProgress = Math.round(phases.reduce((sum, phase) => sum + phase.progress, 0) / phases.length);
  const completedPhases = phases.filter(p => p.status === "completed").length;
  const inProgressPhases = phases.filter(p => p.status === "in-progress" || p.status === "ai-enhanced");

  // Function to generate AI analysis and workflow phases
  const generateAIAnalysis = async () => {
    if (!onGenerateAI) {
      alert("AI analysis generation is not available.");
      return;
    }

    try {
      console.log("🚀 Generating AI analysis and 7-phase methodology...");

      // Start progress tracking
      setIsGenerating(true);
      setGenerationProgress(0);
      setGenerationStage("Initializing AI analysis...");

      // Stage 1: Initialize (0-15%)
      await new Promise(resolve => setTimeout(resolve, 500));
      setGenerationProgress(15);
      setGenerationStage("Analyzing company requirements...");

      // Stage 2: Company Analysis (15-35%)
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(35);
      setGenerationStage("Generating strategic insights...");

      // Stage 3: Insights Generation (35-60%)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress(60);
      setGenerationStage("Creating 7-phase methodology...");

      // Stage 4: Workflow Phases (60-85%)
      await new Promise(resolve => setTimeout(resolve, 1200));
      setGenerationProgress(85);
      setGenerationStage("Integrating Hackett IP assets...");

      // Stage 5: Finalization (85-100%)
      await onGenerateAI();

      setGenerationProgress(100);
      setGenerationStage("Analysis complete!");

      // Hold completion state briefly before hiding
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("✅ AI analysis generation completed.");
    } catch (error) {
      console.error("❌ Error generating AI analysis:", error);
      setGenerationStage("Generation failed. Please try again.");
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Failed to generate AI analysis: ${error}`);
    } finally {
      // Reset progress state
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStage("");
    }
  };

  // Function to load Hackett IP assets for a specific phase
  const loadPhaseAssets = async (phaseNumber: number) => {
    if (phaseAssets[phaseNumber] || loadingAssets[phaseNumber]) return;

    setLoadingAssets(prev => ({ ...prev, [phaseNumber]: true }));

    try {
      const response = await fetch(`/api/hackett-ip?phase=${phaseNumber}&limit=6`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPhaseAssets(prev => ({ ...prev, [phaseNumber]: result.data }));
        }
      }
    } catch (error) {
      console.error(`Error loading assets for phase ${phaseNumber}:`, error);
    } finally {
      setLoadingAssets(prev => ({ ...prev, [phaseNumber]: false }));
    }
  };

  // Load assets when a phase is selected
  useEffect(() => {
    if (selectedPhase) {
      loadPhaseAssets(selectedPhase.id);
    }
  }, [selectedPhase]);

  return (
    <div className="space-y-8">
      {/* Enterprise Dashboard Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-blue-50">
        <CardHeader className="pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span>7-Phase Transformation Methodology</span>
                <Badge variant="outline" className="bg-white/60 border-blue-200 text-blue-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Accelerated
                </Badge>
              </CardTitle>
              <CardDescription className="text-base mt-2 flex items-center space-x-4">
                <span>Hackett Group's proven approach to finance transformation</span>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${phaseStats.onTrack ? "bg-green-500" : "bg-amber-500"}`} />
                  <span className="text-sm font-medium">{phaseStats.onTrack ? "On Track" : "Needs Attention"}</span>
                </div>
              </CardDescription>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/60 rounded-lg px-3 py-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select className="bg-transparent border-0 text-sm font-medium focus:outline-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">All Phases</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="ai-enhanced">AI Enhanced</option>
                </select>
              </div>

              <Button variant="outline" className="bg-white/60 hover:bg-white/80">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button variant="outline" className="bg-white/60 hover:bg-white/80">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Enhanced Metrics Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white/70 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{phaseStats.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2">
                <div className="enterprise-progress-bar">
                  <div className="progress-fill" style={{ width: `${phaseStats.completionRate}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{phaseStats.inProgress}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">Active phases</span>
              </div>
            </div>

            <div className="bg-white/70 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{phaseStats.averageAIAcceleration}%</div>
                  <div className="text-sm text-gray-600">AI Boost</div>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <Zap className="h-3 w-3 text-purple-400" />
                <span className="text-xs text-gray-500">Acceleration</span>
              </div>
            </div>

            <div className="bg-white/70 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{phaseStats.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <Circle className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">Upcoming</span>
              </div>
            </div>

            <div className="bg-white/70 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">${(phaseStats.estimatedValue / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-gray-600">Est. Value</div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-400" />
                <span className="text-xs text-gray-500">Projected ROI</span>
              </div>
            </div>

            <div className="bg-white/70 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{phaseStats.criticalRisks}</div>
                  <div className="text-sm text-gray-600">Risks</div>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
              <div className="mt-2 flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3 text-red-400" />
                <span className="text-xs text-gray-500">Monitoring</span>
              </div>
            </div>
          </div>

          {/* Search and Advanced Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search phases, deliverables, or activities..."
                className="w-full pl-10 pr-4 py-2 bg-white/70 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Showing {filteredPhases.length} of {phases.length} phases
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="text-gray-600 hover:text-gray-900">
                <Settings className="h-4 w-4 mr-1" />
                Advanced
              </Button>
            </div>
          </div>

          {/* Overall Progress Indicator */}
          <div className="mt-6 bg-white/70 rounded-xl p-4 border border-white/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Overall Transformation Progress</h3>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-blue-600">{phaseStats.totalProgress}%</span>
                <Badge variant={phaseStats.onTrack ? "default" : "secondary"} className="text-xs">
                  {phaseStats.onTrack ? "On Track" : "Behind Schedule"}
                </Badge>
              </div>
            </div>
            <div className="enterprise-progress-bar mb-2">
              <div className="progress-fill" style={{ width: `${phaseStats.totalProgress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{phaseStats.completed} phases completed</span>
              <span>{phaseStats.inProgress} in progress</span>
              <span>{phaseStats.pending} pending</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Vertical Phase Cards */}
        <div className="lg:col-span-5">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">Transformation Phases</CardTitle>
                  <CardDescription className="text-sm text-gray-600 mt-1">Click any phase to view detailed information</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 w-fit">
                  <Activity className="h-3 w-3 mr-1" />
                  {filteredPhases.length} Phases
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* No Phases State - Generate AI Analysis */}
              {phases.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Brain className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">7-Phase Transformation Methodology</h3>
                      <p className="text-sm text-gray-600 mb-4 max-w-md">
                        Generate AI-powered workflow phases tailored to your company's transformation journey. Our advanced AI will create a comprehensive 7-phase methodology based on your specific
                        needs.
                      </p>
                    </div>

                    {/* Progress Bar and Generation Status */}
                    {isGenerating ? (
                      <div className="w-full max-w-md space-y-4">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">{generationStage}</span>
                            <span className="text-gray-500">{generationProgress}%</span>
                          </div>
                          <Progress value={generationProgress} className="h-3 bg-gray-200" />
                        </div>

                        {/* Generation Status with Animation */}
                        <div className="flex items-center justify-center space-x-2 text-blue-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm font-medium">AI is working on your transformation plan...</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={generateAIAnalysis}
                          disabled={isGenerating}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate AI Analysis & 7-Phase Methodology
                        </Button>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>~2-3 minutes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-3 w-3" />
                            <span>7 Custom Phases</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="h-3 w-3" />
                            <span>AI-Accelerated</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Vertical Phase Cards */}
                  {filteredPhases.map((phase, index) => {
                    const isActive = phase.id === selectedPhaseId;
                    const isCompleted = phase.status === "completed";
                    const isInProgress = phase.status === "in-progress" || phase.status === "ai-enhanced";
                    const isPending = phase.status === "pending";
                    const isLoading = loadingPhases.has(phase.id);

                    return (
                      <div
                        key={phase.id}
                        className={`
                      group relative cursor-pointer transition-all duration-300 ease-in-out
                      ${isActive ? "transform scale-[1.02] z-10" : "hover:transform hover:scale-[1.01]"}
                      ${isLoading ? "pointer-events-none" : ""}
                    `}
                        onClick={() => handlePhaseClick(phase)}
                      >
                        {/* Vertical Phase Card */}
                        <Card
                          className={`
                        relative border-2 transition-all duration-300 shadow-md hover:shadow-lg
                        ${isActive ? "border-blue-400 shadow-blue-100 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"}
                        ${isCompleted ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" : ""}
                        ${isInProgress ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200" : ""}
                        ${isPending ? "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200" : ""}
                        ${phase.status === "ai-enhanced" ? "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200" : ""}
                        overflow-hidden
                      `}
                        >
                          {/* Status Indicator Strip */}
                          <div
                            className={`
                        absolute top-0 left-0 bottom-0 w-1
                        ${isCompleted ? "bg-gradient-to-b from-green-400 to-emerald-500" : ""}
                        ${isInProgress ? "bg-gradient-to-b from-blue-400 to-cyan-500" : ""}
                        ${isPending ? "bg-gradient-to-b from-gray-300 to-slate-400" : ""}
                        ${phase.status === "ai-enhanced" ? "bg-gradient-to-b from-purple-400 to-violet-500" : ""}
                      `}
                          />

                          {/* Loading Overlay */}
                          {isLoading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
                              <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                                <span className="text-sm text-gray-600">Processing...</span>
                              </div>
                            </div>
                          )}

                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              {/* Phase Number and Status Icon */}
                              <div
                                className={`
                            w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-md flex-shrink-0
                            ${isCompleted ? "bg-gradient-to-br from-green-500 to-emerald-600" : ""}
                            ${isInProgress ? "bg-gradient-to-br from-blue-500 to-cyan-600" : ""}
                            ${isPending ? "bg-gradient-to-br from-gray-400 to-slate-500" : ""}
                            ${phase.status === "ai-enhanced" ? "bg-gradient-to-br from-purple-500 to-violet-600" : ""}
                          `}
                              >
                                {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-lg">{phase.id}</span>}
                              </div>

                              {/* Phase Information */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{phase.title}</h3>
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Badge variant="outline" className={`text-xs ${getStatusColor(phase.status)}`}>
                                        {phase.status.replace("-", " ").toLowerCase()}
                                      </Badge>
                                      {phase.aiAcceleration > 0 && (
                                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                          <Sparkles className="h-3 w-3 mr-1" />
                                          {Math.round(phase.aiAcceleration)}% AI
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-gray-600">Progress</span>
                                        <span className="text-xs font-bold text-gray-900">{Math.round(phase.progress)}%</span>
                                      </div>
                                      <div className="enterprise-progress-bar">
                                        <div className="progress-fill" style={{ width: `${phase.progress}%` }}></div>
                                      </div>
                                    </div>

                                    {/* Duration and Key Info */}
                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                      <div className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{phase.duration}</span>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <span>{safeJsonParse(phase.deliverables).length} deliverables</span>
                                        <span>{safeJsonParse(phase.keyActivities).length} activities</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center space-x-1 ml-2">
                                    <EnterprisePhaseActions phase={phase} onAction={handlePhaseAction} isLoading={isLoading} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>

                          {/* Cross-Section Integration Toolbar */}
                          <div className="px-6 pb-4">
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <Target className="h-3 w-3" />
                                <span>Phase {phase.id} Integration</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={e => {
                                    e.stopPropagation();
                                    onViewAnalytics?.(phase.id);
                                  }}
                                >
                                  <BarChart3 className="h-3 w-3 mr-1" />
                                  Analytics
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={e => {
                                    e.stopPropagation();
                                    onAccessHackettIP?.(`Phase ${phase.id} Resources`);
                                  }}
                                >
                                  <Database className="h-3 w-3 mr-1" />
                                  IP Assets
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Phase Details */}
        <div className="lg:col-span-7">
          {selectedPhase ? (
            <Card className="border-0 shadow-lg h-fit sticky top-4">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center space-x-3">
                      <div
                        className={`
                        w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-md
                        ${selectedPhase.status === "completed" ? "bg-gradient-to-br from-green-500 to-emerald-600" : ""}
                        ${selectedPhase.status === "in-progress" || selectedPhase.status === "ai-enhanced" ? "bg-gradient-to-br from-blue-500 to-cyan-600" : ""}
                        ${selectedPhase.status === "pending" ? "bg-gradient-to-br from-gray-400 to-slate-500" : ""}
                      `}
                      >
                        {selectedPhase.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm">{selectedPhase.id}</span>}
                      </div>
                      <span>
                        Phase {selectedPhase.id}: {selectedPhase.title}
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-2">{selectedPhase.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={`${getStatusColor(selectedPhase.status)} text-sm`}>
                      {selectedPhase.status.replace("-", " ").toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                      {Math.round(selectedPhase.progress)}% Complete
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
                    <TabsTrigger value="activities">Activities</TabsTrigger>
                    <TabsTrigger value="team">Team & Client</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{Math.round(selectedPhase.progress)}%</div>
                            <div className="text-sm text-gray-600">Progress</div>
                          </div>
                          <Activity className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="enterprise-progress-bar mt-3">
                          <div className="progress-fill" style={{ width: `${selectedPhase.progress}%` }}></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-purple-600">{Math.round(selectedPhase.aiAcceleration)}%</div>
                            <div className="text-sm text-gray-600">AI Boost</div>
                          </div>
                          <Sparkles className="h-8 w-8 text-purple-500" />
                        </div>
                        <div className="mt-2 flex items-center space-x-1">
                          <Zap className="h-3 w-3 text-purple-400" />
                          <span className="text-xs text-gray-500">vs Traditional</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-green-600">{safeJsonParse(selectedPhase.deliverables).length}</div>
                            <div className="text-sm text-gray-600">Deliverables</div>
                          </div>
                          <Target className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="mt-2 flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span className="text-xs text-gray-500">{safeJsonParse(selectedPhase.keyActivities).length} activities</span>
                        </div>
                      </div>
                    </div>

                    {/* Duration Information */}
                    <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span>Timeline Information</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">AI-Accelerated Duration</div>
                            <div className="text-lg font-bold text-blue-600">{selectedPhase.duration}</div>
                          </div>
                          {selectedPhase.traditionalDuration && (
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Traditional Duration</div>
                              <div className="text-lg font-bold text-gray-600 line-through opacity-60">{selectedPhase.traditionalDuration}</div>
                              <div className="text-sm text-green-600 font-medium">↓ {Math.round(selectedPhase.aiAcceleration)}% faster with AI</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Deliverables */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        Deliverables ({safeJsonParse(selectedPhase.deliverables).length})
                      </h4>
                      <div className="space-y-2">
                        {safeJsonParse(selectedPhase.deliverables)
                          .slice(0, 3)
                          .map((deliverable: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{deliverable}</span>
                            </div>
                          ))}
                        {safeJsonParse(selectedPhase.deliverables).length > 3 && (
                          <div className="text-xs text-gray-500 mt-2">+{safeJsonParse(selectedPhase.deliverables).length - 3} more deliverables</div>
                        )}
                      </div>
                    </div>

                    {/* Hackett IP Assets Section */}
                    <div className="mt-6 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                          <Database className="h-4 w-4 text-purple-600" />
                          Recommended Hackett IP Assets
                        </h4>
                        <Button variant="outline" size="sm" onClick={() => onAccessHackettIP?.()}>
                          <ExternalLink className="h-3 w-3 mr-2" />
                          View All Assets
                        </Button>
                      </div>

                      {loadingAssets[selectedPhase.id] ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse bg-gray-50 rounded-lg p-3">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                          ))}
                        </div>
                      ) : phaseAssets[selectedPhase.id] && phaseAssets[selectedPhase.id].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {phaseAssets[selectedPhase.id].slice(0, 4).map((asset: HackettIPAsset) => (
                            <div key={asset.id} className="bg-purple-50 rounded-lg p-3 border border-purple-200 hover:border-purple-300 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-sm text-gray-900 leading-tight">{asset.title}</h5>
                                <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                                  {asset.relevanceScore}%
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{asset.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {asset.type}
                                  </Badge>
                                  <Badge
                                    className={`text-xs ${
                                      asset.complexity === "low" ? "bg-green-100 text-green-800" : asset.complexity === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {asset.complexity}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <Database className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">No assets loaded yet</p>
                          <Button variant="outline" size="sm" className="mt-2" onClick={() => loadPhaseAssets(selectedPhase.id)}>
                            Load Recommendations
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="activities" className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {safeJsonParse(selectedPhase.keyActivities).map((activity, index) => (
                        <Card key={index} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900 mb-1">Activity {index + 1}</h5>
                                <p className="text-sm text-gray-700">{activity}</p>
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Timer className="h-3 w-3" />
                                      <span>Est. {Math.ceil((index + 1) * 0.5)} days</span>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {selectedPhase.status === "completed" ? "Completed" : selectedPhase.status === "in-progress" ? "In Progress" : "Pending"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="team" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>Team Responsibilities</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {safeJsonParse(selectedPhase.teamRole).map((role, index) => (
                              <div key={index} className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm">{role}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <Target className="h-4 w-4 text-green-600" />
                            <span>Client Tasks</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {safeJsonParse(selectedPhase.clientTasks).map((task, index) => (
                              <div key={index} className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">{task}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span>Success Metrics</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {safeJsonParse(selectedPhase.successMetrics).length > 0 ? (
                            <div className="space-y-3">
                              {safeJsonParse(selectedPhase.successMetrics).map((metric, index) => (
                                <div key={index} className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">{metric}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Success metrics will be defined based on phase requirements.</p>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span>Risk Factors</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {safeJsonParse(selectedPhase.riskFactors).length > 0 ? (
                            <div className="space-y-3">
                              {safeJsonParse(selectedPhase.riskFactors).map((risk, index) => (
                                <div key={index} className="flex items-center space-x-3 p-2 bg-red-50 rounded-lg">
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                  <span className="text-sm">{risk}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                              <Shield className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-700">No significant risks identified</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg h-96">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Phase</h3>
                  <p className="text-gray-500">Click on any phase card to view detailed information</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialog.open} onOpenChange={open => setConfirmationDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>{confirmationDialog.title}</span>
            </DialogTitle>
            <DialogDescription>{confirmationDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setConfirmationDialog(prev => ({ ...prev, open: false }))}>
              Cancel
            </Button>
            <Button variant={confirmationDialog.type === "destructive" ? "destructive" : "default"} onClick={confirmationDialog.action}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
