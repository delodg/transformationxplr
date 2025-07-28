"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
} from "lucide-react";
import { WorkflowPhase } from "../../types";
import { PHASE_COLORS } from "../../constants/workflowData";

interface WorkflowPhasesProps {
  phases: WorkflowPhase[];
  currentPhase: number;
  onPhaseSelect: (phase: WorkflowPhase) => void;
  onViewDetails: (phase: WorkflowPhase) => void;
  onPhaseStateChange?: (phaseId: number, newStatus: WorkflowPhase["status"], newProgress?: number) => void;
  onAIAssistantOpen?: (action: string, context: any) => void;
}

export const WorkflowPhases: React.FC<WorkflowPhasesProps> = ({ phases, currentPhase, onPhaseSelect, onViewDetails, onPhaseStateChange, onAIAssistantOpen }) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState(currentPhase);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([currentPhase]);

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

  // Enhanced calculations
  const selectedPhase = useMemo(() => {
    return phases.find(p => p.id === selectedPhaseId) || phases[0];
  }, [phases, selectedPhaseId]);

  const phaseStats = useMemo(() => {
    const completed = phases.filter(p => p.status === "completed").length;
    const inProgress = phases.filter(p => p.status === "in-progress").length;
    const aiEnhanced = phases.filter(p => p.status === "ai-enhanced").length;
    const totalProgress = Math.round(phases.reduce((sum, phase) => sum + phase.progress, 0) / phases.length);
    const averageAIAcceleration = Math.round(phases.reduce((sum, phase) => sum + phase.aiAcceleration, 0) / phases.length);

    return {
      completed,
      inProgress,
      aiEnhanced,
      totalProgress,
      averageAIAcceleration,
      remaining: phases.length - completed - inProgress - aiEnhanced,
    };
  }, [phases]);

  const handlePhaseClick = useCallback(
    (phase: WorkflowPhase) => {
      setSelectedPhaseId(phase.id);
      if (!expandedPhases.includes(phase.id)) {
        setExpandedPhases(prev => [...prev, phase.id]);
      }
    },
    [expandedPhases]
  );

  const handleStartPhase = useCallback(
    (phase: WorkflowPhase) => {
      if (phase.status === "pending" && onPhaseStateChange) {
        onPhaseStateChange(phase.id, "in-progress", 10);
      }
    },
    [onPhaseStateChange]
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
            action = `Enhance Phase ${phaseId} deliverables for ${phase.title}. Current deliverables: ${phase.deliverables.join(
              ", "
            )}. Provide detailed descriptions, quality criteria, and success metrics for each deliverable.`;
            context.currentContent = { deliverables: phase.deliverables };
            break;
          case "activities":
            action = `Optimize Phase ${phaseId} key activities for ${phase.title}. Current activities: ${phase.keyActivities.join(
              ", "
            )}. Suggest improvements, automation opportunities, and best practices.`;
            context.currentContent = { activities: phase.keyActivities };
            break;
          case "risks":
            action = `Analyze and expand Phase ${phaseId} risk assessment for ${phase.title}. Current risks: ${
              phase.riskFactors?.join(", ") || "No risks identified"
            }. Provide detailed risk analysis with mitigation strategies and contingency plans.`;
            context.currentContent = { risks: phase.riskFactors };
            break;
          case "success-criteria":
            action = `Refine Phase ${phaseId} success criteria for ${phase.title}. Current criteria: ${
              phase.successMetrics?.join(", ") || "No metrics defined"
            }. Make them SMART (Specific, Measurable, Achievable, Relevant, Time-bound).`;
            context.currentContent = { successCriteria: phase.successMetrics };
            break;
          case "optimization":
            action = `Provide comprehensive optimization recommendations for Phase ${phaseId}: ${phase.title}. Analyze timeline (${phase.duration}), deliverables, activities, and team requirements. Suggest AI acceleration opportunities.`;
            context.currentContent = {
              timeline: phase.duration,
              deliverables: phase.deliverables,
              activities: phase.keyActivities,
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
      - Completed Deliverables: ${phase.deliverables.filter((_, i) => i < Math.floor((phase.progress / 100) * phase.deliverables.length)).join(", ")}
      - Pending Activities: ${phase.keyActivities.filter((_, i) => i >= Math.floor((phase.progress / 100) * phase.keyActivities.length)).join(", ")}
      - Risk Status: ${phase.riskFactors?.join(", ") || "No risks identified"}
      - Team Performance: Based on ${phase.teamRole.length} role assignments
      
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

  return (
    <div className="space-y-6">
      {/* Enhanced Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{phaseStats.totalProgress}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{phaseStats.completed}</div>
                <div className="text-sm text-gray-600">Completed Phases</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{phaseStats.averageAIAcceleration}%</div>
                <div className="text-sm text-gray-600">AI Acceleration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{phaseStats.inProgress}</div>
                <div className="text-sm text-gray-600">Active Phases</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Phase Timeline - Responsive Design */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">7-Phase Transformation Methodology</CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">Hackett Group's proven approach to finance transformation</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                AI-Accelerated
              </Badge>
              <span className="text-sm text-gray-500">
                {completedPhases}/{phases.length} Completed
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Responsive Phase Grid */}
          <div className="phases-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-3 mb-6">
            {phases.map((phase, index) => {
              const isActive = phase.id === selectedPhaseId;
              const isCompleted = phase.status === "completed";
              const isInProgress = phase.status === "in-progress" || phase.status === "ai-enhanced";

              return (
                <div
                  key={phase.id}
                  className={`
                    phase-card relative cursor-pointer transition-all duration-300 ease-in-out group
                    ${isActive ? "transform scale-105 z-10" : "hover:transform hover:scale-102"}
                    min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] xl:min-w-[200px]
                  `}
                  onClick={() => handlePhaseClick(phase)}
                >
                  {/* Phase Card */}
                  <div
                    className={`
                      relative bg-white rounded-xl p-3 sm:p-4 border-2 transition-all duration-300
                      ${isActive ? "border-blue-400 shadow-lg" : "border-gray-200 hover:border-gray-300 hover:shadow-md"}
                      ${isCompleted ? "bg-green-50 border-green-200" : ""}
                      ${isInProgress ? "bg-blue-50 border-blue-200" : ""}
                      min-h-[280px] sm:min-h-[300px] lg:min-h-[320px] xl:min-h-[280px]
                      flex flex-col justify-between
                    `}
                  >
                    {/* Mobile Phase Number Badge */}
                    <div className="block xl:hidden absolute -top-2 -left-2 w-6 h-6 sm:w-7 sm:h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                      {phase.id}
                    </div>

                    {/* Card Content - Top Section */}
                    <div className="flex-1">
                      {/* Desktop Progress Circle */}
                      <div className="hidden xl:flex items-center justify-center mb-3">
                        <div
                          className={`
                             w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                             ${isCompleted ? "bg-green-100 text-green-700 border-2 border-green-300" : ""}
                             ${isInProgress ? "bg-blue-100 text-blue-700 border-2 border-blue-300" : ""}
                             ${!isCompleted && !isInProgress ? "bg-gray-100 text-gray-600 border-2 border-gray-300" : ""}
                           `}
                        >
                          {isCompleted ? <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" /> : <span className="text-xs sm:text-sm">{phase.id}</span>}
                        </div>
                      </div>

                      {/* Phase Title - Responsive Typography */}
                      <h3 className="font-semibold text-gray-800 text-center mb-2 text-sm sm:text-base lg:text-sm xl:text-base leading-tight">{phase.title}</h3>

                      {/* Status Badge */}
                      <div className="flex justify-center mb-3">
                        <Badge variant="outline" className={`text-xs ${getStatusColor(phase.status)}`}>
                          {phase.status.replace("-", " ")}
                        </Badge>
                      </div>

                      {/* Progress Bar - Mobile Optimized */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-medium">{Math.round(phase.progress)}%</span>
                        </div>
                        <Progress value={phase.progress} className="h-1.5 sm:h-2" />
                      </div>

                      {/* Duration - Responsive Text */}
                      <div className="text-center mb-4">
                        <div className="text-xs text-gray-500 mb-1">Duration</div>
                        <div className="text-xs sm:text-sm font-medium text-gray-700">{phase.duration}</div>
                        {phase.traditionalDuration && <div className="text-xs text-green-600 font-medium">↓ {Math.round(phase.aiAcceleration)}% faster</div>}
                      </div>
                    </div>

                    {/* Card Content - Bottom Section (Action Buttons) */}
                    <div className="flex-shrink-0 mt-3 pt-2 border-t border-gray-100">
                      {/* Always Visible Action Buttons - Responsive */}
                      <div className="action-buttons flex justify-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs bg-gray-50 hover:bg-gray-100"
                          onClick={e => {
                            e.stopPropagation();
                            onViewDetails(phase);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <PhaseActionButtons phase={phase} compact={true} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Navigation Dots */}
          <div className="block xl:hidden flex justify-center space-x-2 mb-4">
            {phases.map(phase => (
              <button
                key={phase.id}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${phase.id === selectedPhaseId ? "bg-blue-600 w-6" : "bg-gray-300 hover:bg-gray-400"}
                `}
                onClick={() => setSelectedPhaseId(phase.id)}
              />
            ))}
          </div>

          {/* Overall Progress Bar */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Project Progress</span>
              <span className="text-sm font-bold text-blue-600">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{completedPhases} phases completed</span>
              <span>{inProgressPhases.length} in progress</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Detailed Phase Information */}
      <Tabs defaultValue="overview" className="space-y-4">
        {/* Phase Header with Enhanced Controls */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedPhase.title}</h2>
              <p className="text-gray-600 mt-1">{selectedPhase.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`${getStatusColor(selectedPhase.status)} text-sm`}>
                {selectedPhase.status.replace("-", " ").toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {Math.round(selectedPhase.progress)}% Complete
              </Badge>
            </div>
          </div>

          {/* AI-Powered Quick Actions */}
          <div className="bg-white/60 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-800">AI-Powered Phase Management</h3>
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                Enhanced
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300" onClick={() => generatePhaseReport(selectedPhase.id)}>
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-green-50 hover:border-green-300" onClick={() => createActionPlan(selectedPhase.id)}>
                <Calendar className="h-4 w-4" />
                <span>Action Plan</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 hover:bg-purple-50 hover:border-purple-300"
                onClick={() => enhancePhaseContent(selectedPhase.id, "optimization")}
              >
                <Sparkles className="h-4 w-4" />
                <span>Optimize</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-orange-50 hover:border-orange-300" onClick={() => enhancePhaseContent(selectedPhase.id, "risks")}>
                <AlertTriangle className="h-4 w-4" />
                <span>Risk Analysis</span>
              </Button>
            </div>
          </div>

          {/* Content Enhancement Controls */}
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Content Enhancement</h3>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                AI Assisted
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-green-50" onClick={() => enhancePhaseContent(selectedPhase.id, "deliverables")}>
                <Target className="h-4 w-4" />
                <span>Enhance Deliverables</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-blue-50" onClick={() => enhancePhaseContent(selectedPhase.id, "activities")}>
                <Activity className="h-4 w-4" />
                <span>Optimize Activities</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-purple-50" onClick={() => enhancePhaseContent(selectedPhase.id, "success-criteria")}>
                <CheckCircle className="h-4 w-4" />
                <span>Refine Success Metrics</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-yellow-50" onClick={() => handleEnhanceWithAI(selectedPhase.id, "comprehensive-review")}>
                <BarChart3 className="h-4 w-4" />
                <span>Full Review</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Phase Details Tabs */}
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="team">Team & Client</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>Key Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Progress</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={Math.round(selectedPhase.progress)} className="w-16 h-2" />
                    <Badge variant="outline" className="text-xs">
                      {Math.round(selectedPhase.progress)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <Badge variant="outline">{selectedPhase.duration}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Traditional</span>
                  <Badge variant="outline" className="line-through opacity-60">
                    {selectedPhase.traditionalDuration}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI Acceleration</span>
                  <Badge className="bg-purple-100 text-purple-800">{Math.round(selectedPhase.aiAcceleration)}%</Badge>
                </div>
                {selectedPhase.estimatedCompletion && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Est. Completion</span>
                    <span className="text-sm font-medium">{selectedPhase.estimatedCompletion}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span>Deliverables ({selectedPhase.deliverables.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedPhase.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span>Hackett IP Assets ({selectedPhase.hackettIP.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedPhase.hackettIP.slice(0, 4).map((asset, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">{asset}</span>
                    </div>
                  ))}
                  {selectedPhase.hackettIP.length > 4 && <div className="text-xs text-gray-500 mt-2">+{selectedPhase.hackettIP.length - 4} more assets</div>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dependencies & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedPhase.dependencies.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-orange-600" />
                    <span>Dependencies ({selectedPhase.dependencies.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedPhase.dependencies.map((dependency, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">{dependency}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedPhase.riskFactors && selectedPhase.riskFactors.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span>Risk Factors ({selectedPhase.riskFactors.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedPhase.riskFactors.map((risk, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm">{risk}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span>Key Activities & Progress ({selectedPhase.keyActivities.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedPhase.keyActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <span className="font-medium">{activity}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedPhase.status === "completed" ? "Done" : selectedPhase.status === "in-progress" ? "Active" : "Pending"}
                      </Badge>
                      {selectedPhase.status === "in-progress" && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span>Phase Synthesis & Analysis ({selectedPhase.aiSuggestions.length})</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Brain className="h-4 w-4 mr-2" />
                    Generate More Insights
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Export Analysis
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Interactive Synthesis Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Data Sources Summary */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Data Sources</h4>
                      <Badge variant="outline" className="text-xs">
                        {selectedPhase.hackettIP.length} Assets
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Benchmark Data</span>
                        <span className="font-medium">87% Complete</span>
                      </div>
                      <Progress value={87} className="h-1" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Interview Insights</span>
                        <span className="font-medium">94% Complete</span>
                      </div>
                      <Progress value={94} className="h-1" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Survey Results</span>
                        <span className="font-medium">78% Complete</span>
                      </div>
                      <Progress value={78} className="h-1" />
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Confidence */}
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Analysis Confidence</h4>
                      <Badge className="bg-green-100 text-green-800 text-xs">High</Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">92%</div>
                      <div className="text-xs text-gray-600 mb-2">Based on {selectedPhase.hackettIP.length} IP assets</div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Key Insights Count */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Generated Insights</h4>
                      <Button variant="outline" size="sm" className="h-6 text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{selectedPhase.aiSuggestions.length}</div>
                        <div className="text-xs text-gray-600">AI Suggestions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{Math.floor(selectedPhase.aiSuggestions.length * 0.7)}</div>
                        <div className="text-xs text-gray-600">Actionable</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Interactive Insights Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">AI-Generated Insights</h4>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Activity className="h-4 w-4 mr-1" />
                      Filter by Priority
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Sort by Impact
                    </Button>
                  </div>
                </div>

                {selectedPhase.aiSuggestions.map((suggestion, index) => (
                  <Card key={index} className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                            <Brain className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h5 className="font-medium text-sm">AI Insight #{index + 1}</h5>
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                                High Priority
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Confidence: {90 + Math.floor(Math.random() * 10)}%
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{suggestion}</p>

                            {/* Interactive Elements */}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Est. Impact: 2-4 weeks</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-3 w-3" />
                                <span>Value: ${100 + Math.floor(Math.random() * 400)}K</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>Resources: 2-3 FTE</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1">
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            Implement
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs text-gray-500">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Interactive Progress Tracking */}
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">Implementation Progress</span>
                          <span className="text-xs text-gray-500">{Math.floor(Math.random() * 60)}% Complete</span>
                        </div>
                        <Progress value={Math.floor(Math.random() * 60)} className="h-1" />
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="h-6 text-xs">
                              <PlayCircle className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                            <Button variant="outline" size="sm" className="h-6 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Track
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500">Next Review: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Synthesis Summary */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Phase Synthesis Summary</h4>
                        <p className="text-xs text-gray-600">AI-powered analysis of {selectedPhase.title} data and recommendations</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{selectedPhase.hackettIP.length}</div>
                        <div className="text-xs text-gray-600">Data Sources Analyzed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{selectedPhase.aiSuggestions.length}</div>
                        <div className="text-xs text-gray-600">Insights Generated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{Math.round(selectedPhase.aiAcceleration)}%</div>
                        <div className="text-xs text-gray-600">Time Saved vs Traditional</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Team Responsibilities ({selectedPhase.teamRole.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedPhase.teamRole.map((role, index) => (
                    <div key={index} className="flex items-center space-x-2">
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
                  <span>Client Tasks ({selectedPhase.clientTasks.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedPhase.clientTasks.map((task, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Success Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPhase.successMetrics ? (
                  <div className="space-y-2">
                    {selectedPhase.successMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center space-x-2">
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
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span>Performance Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <Badge variant="outline">{Math.round(selectedPhase.progress)}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AI Acceleration</span>
                  <Badge className="bg-purple-100 text-purple-800">{Math.round(selectedPhase.aiAcceleration)}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Time Saved</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {selectedPhase.traditionalDuration} → {selectedPhase.duration}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
