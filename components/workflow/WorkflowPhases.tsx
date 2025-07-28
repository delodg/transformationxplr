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
}

export const WorkflowPhases: React.FC<WorkflowPhasesProps> = ({ phases, currentPhase, onPhaseSelect, onViewDetails, onPhaseStateChange }) => {
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
    (phase: WorkflowPhase) => {
      if (phase.status === "in-progress" && onPhaseStateChange) {
        onPhaseStateChange(phase.id, "pending", phase.progress);
      }
    },
    [onPhaseStateChange]
  );

  const handleCompletePhase = useCallback(
    (phase: WorkflowPhase) => {
      if ((phase.status === "in-progress" || phase.status === "ai-enhanced") && onPhaseStateChange) {
        onPhaseStateChange(phase.id, "completed", 100);
      }
    },
    [onPhaseStateChange]
  );

  const handleResetPhase = useCallback(
    (phase: WorkflowPhase) => {
      if (onPhaseStateChange) {
        onPhaseStateChange(phase.id, "pending", 0);
      }
    },
    [onPhaseStateChange]
  );

  const handleEnhanceWithAI = useCallback(
    (phase: WorkflowPhase) => {
      if (phase.status === "in-progress" && onPhaseStateChange) {
        onPhaseStateChange(phase.id, "ai-enhanced", Math.min(phase.progress + 20, 90));
      }
    },
    [onPhaseStateChange]
  );

  // Enhanced action buttons component
  const PhaseActionButtons = useCallback(
    ({ phase, compact = false }: { phase: WorkflowPhase; compact?: boolean }) => {
      const buttonClass = compact ? "text-xs h-6 px-2" : "text-sm h-8 px-3";
      const iconClass = compact ? "h-3 w-3" : "h-4 w-4";

      return (
        <div className={`flex items-center ${compact ? "space-x-1" : "space-x-2"}`}>
          {phase.status === "pending" && (
            <Button
              size="sm"
              variant="outline"
              className={`${buttonClass} border-green-200 text-green-600 hover:bg-green-50`}
              onClick={e => {
                e.stopPropagation();
                handleStartPhase(phase);
              }}
            >
              <PlayCircle className={`${iconClass} mr-1`} />
              {compact ? "Start" : "Start Phase"}
            </Button>
          )}

          {phase.status === "in-progress" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className={`${buttonClass} border-orange-200 text-orange-600 hover:bg-orange-50`}
                onClick={e => {
                  e.stopPropagation();
                  handlePausePhase(phase);
                }}
              >
                <PauseCircle className={`${iconClass} mr-1`} />
                {compact ? "Pause" : "Pause"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className={`${buttonClass} border-purple-200 text-purple-600 hover:bg-purple-50`}
                onClick={e => {
                  e.stopPropagation();
                  handleEnhanceWithAI(phase);
                }}
              >
                <Brain className={`${iconClass} mr-1`} />
                {compact ? "AI+" : "AI Enhance"}
              </Button>

              <Button
                size="sm"
                className={`${buttonClass} bg-green-600 hover:bg-green-700 text-white`}
                onClick={e => {
                  e.stopPropagation();
                  handleCompletePhase(phase);
                }}
              >
                <CheckCircle className={`${iconClass} mr-1`} />
                {compact ? "Done" : "Complete"}
              </Button>
            </>
          )}

          {phase.status === "ai-enhanced" && (
            <Button
              size="sm"
              className={`${buttonClass} bg-green-600 hover:bg-green-700 text-white`}
              onClick={e => {
                e.stopPropagation();
                handleCompletePhase(phase);
              }}
            >
              <CheckCircle className={`${iconClass} mr-1`} />
              {compact ? "Done" : "Complete"}
            </Button>
          )}

          {(phase.status === "completed" || phase.status === "in-progress" || phase.status === "ai-enhanced") && (
            <Button
              size="sm"
              variant="outline"
              className={`${buttonClass} border-gray-300 text-gray-600 hover:bg-gray-50`}
              onClick={e => {
                e.stopPropagation();
                handleResetPhase(phase);
              }}
            >
              <RefreshCw className={`${iconClass} mr-1`} />
              {compact ? "Reset" : "Reset"}
            </Button>
          )}
        </div>
      );
    },
    [handleStartPhase, handlePausePhase, handleCompletePhase, handleResetPhase, handleEnhanceWithAI]
  );

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

      {/* Enhanced Phase Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>7-Phase Transformation Workflow</span>
              </CardTitle>
              <CardDescription>AI-powered workflow with intelligent automation and guidance at each phase</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-600">
                Phase {currentPhase} Active
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-600">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Enhanced Stepper - Non-compressed with better spacing */}
          <div className="relative">
            {/* Desktop View - Horizontal Stepper */}
            <div className="hidden lg:block">
              <div className="flex items-start justify-between relative mb-8">
                {phases.map((phase, index) => (
                  <div key={phase.id} className="flex-1 relative" style={{ maxWidth: `${100 / phases.length}%` }}>
                    {/* Connection Line */}
                    {index < phases.length - 1 && (
                      <div className="absolute top-6 left-1/2 transform translate-x-1/2 w-full h-0.5 z-0">
                        <div className={`h-full transition-colors duration-300 ${phase.status === "completed" ? "bg-green-400" : "bg-gray-200"}`}></div>
                      </div>
                    )}

                    {/* Phase Step */}
                    <div
                      className={`relative z-10 flex flex-col items-center cursor-pointer transition-all duration-300 p-4 rounded-xl ${
                        phase.id === selectedPhaseId ? "transform scale-105 bg-blue-50 shadow-lg" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handlePhaseClick(phase)}
                    >
                      {/* Phase Circle */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          phase.status === "completed"
                            ? "bg-green-500 text-white shadow-md"
                            : phase.status === "in-progress"
                            ? "bg-blue-500 text-white shadow-md animate-pulse"
                            : phase.status === "ai-enhanced"
                            ? "bg-purple-500 text-white shadow-md"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {phase.status === "completed" ? <CheckCircle className="h-6 w-6" /> : <span>{phase.id}</span>}
                      </div>

                      {/* Phase Info */}
                      <div className="text-center mt-3 min-h-[80px] flex flex-col justify-center">
                        <h3 className="text-sm font-medium text-gray-900 mb-1 leading-tight max-w-[140px]">{phase.title}</h3>
                        <div className="flex flex-col items-center space-y-1">
                          <Badge variant="outline" className={`text-xs ${getStatusColor(phase.status)}`}>
                            {phase.status.replace("-", " ").toUpperCase()}
                          </Badge>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Timer className="h-3 w-3 mr-1" />
                            {phase.duration}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{Math.round(phase.progress)}%</span>
                        </div>
                        <Progress value={Math.round(phase.progress)} className="h-2" />
                      </div>

                      {/* AI Acceleration Badge */}
                      {phase.aiAcceleration > 0 && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                            <Zap className="h-3 w-3 mr-1" />+{Math.round(phase.aiAcceleration)}%
                          </Badge>
                        </div>
                      )}

                      {/* Enhanced Action buttons */}
                      <div className="mt-3">
                        <PhaseActionButtons phase={phase} compact={true} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile/Tablet View - Vertical Stepper */}
            <div className="lg:hidden space-y-4">
              {phases.map((phase, index) => (
                <div key={phase.id} className="relative">
                  {/* Connection Line for Mobile */}
                  {index < phases.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 z-0">
                      <div className={`w-full h-full transition-colors duration-300 ${phase.status === "completed" ? "bg-green-400" : "bg-gray-200"}`}></div>
                    </div>
                  )}

                  {/* Phase Card for Mobile */}
                  <div
                    className={`relative z-10 flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      phase.id === selectedPhaseId ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handlePhaseClick(phase)}
                  >
                    {/* Phase Circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        phase.status === "completed"
                          ? "bg-green-500 text-white"
                          : phase.status === "in-progress"
                          ? "bg-blue-500 text-white animate-pulse"
                          : phase.status === "ai-enhanced"
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {phase.status === "completed" ? <CheckCircle className="h-6 w-6" /> : <span>{phase.id}</span>}
                    </div>

                    {/* Phase Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">{phase.title}</h3>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          <Badge variant="outline" className={`text-xs ${getStatusColor(phase.status)}`}>
                            {phase.status.replace("-", " ").toUpperCase()}
                          </Badge>
                          {phase.aiAcceleration > 0 && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                              <Zap className="h-3 w-3 mr-1" />
                              {Math.round(phase.aiAcceleration)}%
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{phase.description}</p>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-medium">{Math.round(phase.progress)}%</span>
                          </div>
                          <Progress value={Math.round(phase.progress)} className="h-2" />
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Timer className="h-3 w-3 mr-1" />
                          <span>{phase.duration}</span>
                        </div>
                      </div>

                      {/* Enhanced Action buttons for mobile */}
                      <div className="mt-3">
                        <PhaseActionButtons phase={phase} compact={false} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">Workflow Progress</span>
              <span className="text-sm text-gray-600">{phaseStats.totalProgress}% Complete</span>
            </div>
            <Progress value={phaseStats.totalProgress} className="h-3" />
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
              <span>
                {phaseStats.completed} of {phases.length} phases completed
              </span>
              <span>AI Acceleration: {phaseStats.averageAIAcceleration}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Detailed Phase Information */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1 flex items-center space-x-2">
              <span>{selectedPhase.title}</span>
              <Badge variant="outline" className={getStatusColor(selectedPhase.status)}>
                {selectedPhase.status.replace("-", " ")}
              </Badge>
            </h2>
            <p className="text-gray-600">{selectedPhase.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(selectedPhase)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button size="sm" onClick={() => onPhaseSelect(selectedPhase)}>
              <Target className="h-4 w-4 mr-2" />
              Focus Phase
            </Button>
            <PhaseActionButtons phase={selectedPhase} compact={false} />
          </div>
        </div>

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
