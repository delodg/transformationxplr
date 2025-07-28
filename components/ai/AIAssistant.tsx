"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Send,
  Sparkles,
  Lightbulb,
  Target,
  TrendingUp,
  AlertCircle,
  Clock,
  MessageSquare,
  X,
  Mic,
  Paperclip,
  Settings,
  RefreshCw,
  Download,
  BookOpen,
  BarChart3,
  FileText,
  Users,
  Zap,
  CheckCircle,
  Calendar,
  DollarSign,
  Activity,
  ArrowRight,
  Wifi,
  WifiOff,
  AlertTriangle,
  Plus,
  Copy,
} from "lucide-react";
import { ChatMessage, TransformationProject, AIInsight, ConversationContext, AIAssistantState, ClaudeApiRequest, ClaudeApiResponse, WorkflowPhase } from "../../types";

interface AIAssistantProps {
  isVisible: boolean;
  onClose: () => void;
  currentProject: TransformationProject;
  aiInsights: AIInsight[];
  workflowPhases?: WorkflowPhase[];
}

export const AIAssistant: React.FC<AIAssistantProps> = React.memo(({ isVisible, onClose, currentProject, aiInsights, workflowPhases = [] }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [assistantState, setAssistantState] = useState<AIAssistantState>({
    isLoading: false,
    isConnected: true,
    lastApiCall: null,
    apiStatus: "connected",
    streamingResponse: false,
    currentModel: "claude-3-5-sonnet-20241022",
  });

  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    topicsDiscussed: [],
    lastPhaseDiscussed: currentProject.currentPhase,
    questionsAsked: 0,
    userPreferences: {
      prefers: "actionable",
      focusAreas: [],
    },
    sessionStartTime: new Date(),
    lastActivity: new Date(),
    responseQuality: {
      totalResponses: 0,
      avgConfidence: 0,
      successfulApiCalls: 0,
      failedApiCalls: 0,
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      content: `Hello! I'm your **Claude-powered AI assistant** for the **${
        currentProject.clientName
      }** transformation project. I can help you with insights, recommendations, and guidance across all 7 phases.

## 🎯 Current Status:
- **Phase ${currentProject.currentPhase}** (${Math.round(currentProject.progress)}% complete)
- **${aiInsights.length} AI insights** available
- **${Math.round(currentProject.aiAcceleration)}% AI acceleration**
- Connected to *Claude Sonnet 4* ⚡

### What I can help you with:
1. **Strategic Analysis** - Risk assessment, opportunity identification
2. **Phase Management** - Progress tracking, timeline optimization
3. **Content Generation** - Reports, presentations, action plans
4. **Data Insights** - Benchmark analysis, performance metrics

> 💡 **Tip**: Try asking me about specific phases, risks, or opportunities. I can provide detailed analysis and actionable recommendations!

What would you like to explore?`,
      role: "assistant",
      timestamp: new Date(),
      relatedPhase: currentProject.currentPhase,
      confidence: 95,
    };

    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, [currentProject, aiInsights.length, messages.length]);

  // Enhanced memoized calculations
  const insightsByType = useMemo(() => {
    return {
      risks: aiInsights.filter(i => i.type === "risk"),
      opportunities: aiInsights.filter(i => i.type === "opportunity"),
      automations: aiInsights.filter(i => i.type === "automation"),
      benchmarks: aiInsights.filter(i => i.type === "benchmark"),
      recommendations: aiInsights.filter(i => i.type === "recommendation"),
    };
  }, [aiInsights]);

  const phaseInsights = useMemo(() => {
    return aiInsights.filter(insight => insight.phase === currentProject.currentPhase);
  }, [aiInsights, currentProject.currentPhase]);

  const totalEstimatedValue = useMemo(() => {
    return aiInsights.filter(insight => insight.estimatedValue).reduce((total, insight) => total + (insight.estimatedValue || 0), 0);
  }, [aiInsights]);

  const averageConfidence = useMemo(() => {
    return conversationContext.responseQuality.totalResponses > 0 ? Math.round(conversationContext.responseQuality.avgConfidence) : 0;
  }, [conversationContext.responseQuality.totalResponses, conversationContext.responseQuality.avgConfidence]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Update conversation context
  const updateContext = useCallback((topic: string, phase?: number, success: boolean = true) => {
    setConversationContext(prev => ({
      ...prev,
      topicsDiscussed: Array.from(new Set([...prev.topicsDiscussed, topic])),
      lastPhaseDiscussed: phase || prev.lastPhaseDiscussed,
      questionsAsked: prev.questionsAsked + 1,
      lastActivity: new Date(),
      responseQuality: {
        ...prev.responseQuality,
        totalResponses: prev.responseQuality.totalResponses + 1,
        successfulApiCalls: success ? prev.responseQuality.successfulApiCalls + 1 : prev.responseQuality.successfulApiCalls,
        failedApiCalls: success ? prev.responseQuality.failedApiCalls : prev.responseQuality.failedApiCalls + 1,
        avgConfidence: success ? (prev.responseQuality.avgConfidence * (prev.responseQuality.totalResponses - 1) + 85) / prev.responseQuality.totalResponses : prev.responseQuality.avgConfidence,
      },
    }));
  }, []);

  // Call Claude API
  const callClaudeAPI = useCallback(
    async (message: string): Promise<ClaudeApiResponse> => {
      setAssistantState(prev => ({
        ...prev,
        isLoading: true,
        lastApiCall: new Date(),
        apiStatus: "connected",
      }));

      try {
        const apiRequest: ClaudeApiRequest = {
          message,
          conversationHistory: messages,
          projectContext: currentProject,
          phaseContext: {
            currentPhase: currentProject.currentPhase,
            workflowPhases: workflowPhases,
          },
          aiInsights: aiInsights,
        };

        const response = await fetch("/api/claude", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequest),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const claudeResponse: ClaudeApiResponse = await response.json();

        setAssistantState(prev => ({
          ...prev,
          isLoading: false,
          isConnected: true,
          apiStatus: "connected",
        }));

        return claudeResponse;
      } catch (error) {
        console.error("Claude API Error:", error);

        setAssistantState(prev => ({
          ...prev,
          isLoading: false,
          isConnected: false,
          apiStatus: "error",
        }));

        // Return fallback response
        return {
          content:
            "I apologize, but I'm experiencing connectivity issues with the AI right now. Let me provide you with some general guidance based on your transformation project context. Please try your question again in a moment, or I can help you with quick actions like phase guidance or risk assessment.",
          confidence: 50,
          relatedPhase: currentProject.currentPhase,
          timestamp: new Date().toISOString(),
          model: "fallback",
          error: "CONNECTION_ERROR",
          fallback: true,
        };
      }
    },
    [messages, currentProject, workflowPhases, aiInsights]
  );

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    // Update context based on user input
    const detectedTopic = detectTopic(currentInput);
    const detectedPhase = detectPhaseFromMessage(currentInput);

    try {
      // Call real Claude API
      const claudeResponse = await callClaudeAPI(currentInput);

      const aiResponse: ChatMessage = {
        id: `ai_${Date.now()}`,
        content: claudeResponse.content,
        role: "assistant",
        timestamp: new Date(claudeResponse.timestamp),
        relatedPhase: claudeResponse.relatedPhase,
        confidence: claudeResponse.confidence,
      };

      setMessages(prev => [...prev, aiResponse]);
      updateContext(detectedTopic, detectedPhase, !claudeResponse.fallback);

      // Update average confidence in context
      if (!claudeResponse.fallback) {
        setConversationContext(prev => ({
          ...prev,
          responseQuality: {
            ...prev.responseQuality,
            avgConfidence: (prev.responseQuality.avgConfidence * (prev.responseQuality.totalResponses - 1) + claudeResponse.confidence) / prev.responseQuality.totalResponses,
          },
        }));
      }
    } catch (error) {
      console.error("Error handling message:", error);
      updateContext(detectedTopic, detectedPhase, false);
    }

    setIsTyping(false);
  }, [input, callClaudeAPI, updateContext]);

  const detectTopic = useCallback((input: string): string => {
    const lowercaseInput = input.toLowerCase();
    if (lowercaseInput.includes("risk") || lowercaseInput.includes("challenge")) return "risks";
    if (lowercaseInput.includes("opportunity") || lowercaseInput.includes("quick win")) return "opportunities";
    if (lowercaseInput.includes("phase") || lowercaseInput.includes("next")) return "phases";
    if (lowercaseInput.includes("benchmark") || lowercaseInput.includes("performance")) return "benchmarks";
    if (lowercaseInput.includes("automation") || lowercaseInput.includes("ai")) return "automation";
    if (lowercaseInput.includes("team") || lowercaseInput.includes("resource")) return "team";
    if (lowercaseInput.includes("timeline") || lowercaseInput.includes("schedule")) return "timeline";
    return "general";
  }, []);

  const detectPhaseFromMessage = useCallback((input: string): number | undefined => {
    const lowercaseInput = input.toLowerCase();

    // Explicit phase mentions
    for (let i = 1; i <= 7; i++) {
      if (lowercaseInput.includes(`phase ${i}`)) return i;
    }

    return undefined;
  }, []);

  const getEnhancedQuickActions = useCallback(
    () => [
      // STRATEGIC ANALYSIS ACTIONS
      {
        category: "strategic",
        label: "Phase Deep Dive",
        action: () => {
          setActiveTab("chat");
          setInput(
            `Provide a comprehensive analysis of Phase ${currentProject.currentPhase}. Include current progress, key risks, upcoming deliverables, and actionable recommendations for the next 2 weeks.`
          );
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: Target,
        description: "Comprehensive current phase analysis",
        type: "analysis",
      },
      {
        category: "strategic",
        label: "Risk Assessment & Mitigation",
        action: () => {
          setActiveTab("chat");
          setInput(
            `Analyze our top 3 project risks: ${
              insightsByType.risks
                .slice(0, 3)
                .map(r => r.title)
                .join(", ") || "general project risks"
            }. For each risk, provide impact assessment, likelihood, and specific mitigation strategies with timelines.`
          );
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: AlertCircle,
        description: `${insightsByType.risks.length} risks require attention`,
        type: "risk",
      },
      {
        category: "strategic",
        label: "Value Opportunity Roadmap",
        action: () => {
          setActiveTab("chat");
          setInput(
            `Create a detailed value realization roadmap for our identified opportunities totaling ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(
              totalEstimatedValue
            )}. Prioritize by ROI, effort, and timeline. Include quick wins for the next 30 days.`
          );
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: TrendingUp,
        description: `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(totalEstimatedValue)} potential value`,
        type: "opportunity",
      },
      {
        category: "strategic",
        label: "AI Acceleration Strategy",
        action: () => {
          setActiveTab("chat");
          setInput(
            `Develop a comprehensive AI acceleration strategy to increase our current ${Math.round(
              currentProject.aiAcceleration
            )}% to 50%+ target. Include specific AI use cases, technology recommendations, and implementation priorities.`
          );
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: Sparkles,
        description: `Optimize from ${Math.round(currentProject.aiAcceleration)}% current`,
        type: "automation",
      },

      // OPERATIONAL SUPPORT ACTIONS
      {
        category: "operational",
        label: "Team & Resource Optimization",
        action: () => {
          setActiveTab("chat");
          setInput(
            `Analyze our team of ${currentProject.teamMembers.length} members and recommend optimal resource allocation for Phase ${currentProject.currentPhase}. Include skill gaps, workload balancing, and training needs.`
          );
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: Users,
        description: `Optimize ${currentProject.teamMembers.length} team members`,
        type: "resource",
      },
      {
        category: "operational",
        label: "Progress & Timeline Review",
        action: () => {
          setActiveTab("chat");
          setInput(
            `Conduct a comprehensive project health check. We're ${Math.round(
              currentProject.progress
            )}% complete. Analyze timeline adherence, identify bottlenecks, and recommend acceleration tactics for upcoming phases.`
          );
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: Calendar,
        description: `${Math.round(currentProject.progress)}% complete - health check`,
        type: "progress",
      },
      {
        category: "operational",
        label: "Stakeholder Communication Plan",
        action: () => {
          setActiveTab("chat");
          setInput(
            `Create a stakeholder communication strategy for ${currentProject.clientName}. Include key messages for Phase ${currentProject.currentPhase}, meeting cadence, reporting templates, and change management tactics.`
          );
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: Users,
        description: "Enhance stakeholder engagement",
        type: "communication",
      },
      {
        category: "operational",
        label: "Phase Deliverable Review",
        action: () => {
          setActiveTab("chat");
          setInput(
            `Review all Phase ${currentProject.currentPhase} deliverables and provide quality assessment. Suggest improvements, identify gaps, and recommend next actions to ensure client satisfaction.`
          );
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: FileText,
        description: "Quality check deliverables",
        type: "deliverable",
      },

      // CONTENT MODIFICATION ACTIONS
      {
        category: "content",
        label: "Generate Phase Summary",
        action: () => {
          setActiveTab("chat");
          setInput(
            `Generate a comprehensive Phase ${currentProject.currentPhase} executive summary for ${currentProject.clientName}. Include progress, key findings, recommendations, and next steps in presentation-ready format.`
          );
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: FileText,
        description: "Create executive summary",
        type: "generation",
      },
      {
        category: "content",
        label: "Markdown Demo",
        action: () => {
          setActiveTab("chat");
          setInput("Show me examples of how you can format responses with headers, lists, code blocks, tables, and other markdown features.");
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: BookOpen,
        description: "See formatting examples",
        type: "demo",
      },
      {
        category: "content",
        label: "Update Project Charter",
        action: () => {
          setActiveTab("chat");
          setInput(`Review and update our project charter based on current progress and learnings. Include revised scope, timeline adjustments, resource changes, and updated success criteria.`);
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: RefreshCw,
        description: "Revise project charter",
        type: "update",
      },
      {
        category: "content",
        label: "Create Action Items",
        action: () => {
          setActiveTab("chat");
          setInput(`Generate prioritized action items for the next 2 weeks based on our current phase progress. Include owners, deadlines, dependencies, and success criteria for each action.`);
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: Plus,
        description: "Generate next steps",
        type: "planning",
      },
      {
        category: "content",
        label: "Business Case Development",
        action: () => {
          setActiveTab("chat");
          setInput(
            `Develop a detailed business case for our top 3 transformation initiatives. Include investment requirements, ROI calculations, implementation timeline, and risk mitigation strategies.`
          );
          setTimeout(() => handleSendMessage(), 100);
        },
        icon: DollarSign,
        description: "Build investment case",
        type: "business-case",
      },
    ],
    [currentProject, insightsByType.risks.length, totalEstimatedValue, setActiveTab, setInput, handleSendMessage]
  );

  const clearConversation = useCallback(() => {
    const welcomeMessage = messages[0];
    setMessages(welcomeMessage ? [welcomeMessage] : []);
    setConversationContext(prev => ({
      ...prev,
      topicsDiscussed: [],
      questionsAsked: 0,
      sessionStartTime: new Date(),
      lastActivity: new Date(),
      responseQuality: {
        totalResponses: 0,
        avgConfidence: 0,
        successfulApiCalls: 0,
        failedApiCalls: 0,
      },
    }));
  }, [messages]);

  const exportConversation = useCallback(() => {
    const conversationText = messages.map(m => `[${m.role.toUpperCase()}] ${m.timestamp.toLocaleString()}\n${m.content}\n`).join("\n---\n");

    const metadata = `AI Assistant Conversation Export
Client: ${currentProject.clientName}
Phase: ${currentProject.currentPhase}
Export Date: ${new Date().toLocaleString()}
Questions Asked: ${conversationContext.questionsAsked}
API Success Rate: ${conversationContext.responseQuality.successfulApiCalls}/${conversationContext.responseQuality.totalResponses}
Average Confidence: ${Math.round(conversationContext.responseQuality.avgConfidence)}%

---\n\n`;

    const blob = new Blob([metadata + conversationText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Claude_AI_Conversation_${currentProject.clientName}_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages, currentProject.clientName, conversationContext]);

  // Enhanced insights panel
  const InsightsPanel = React.memo(() => (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header with Summary Stats */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-800">Project Intelligence Dashboard</h2>
            </div>
            <Badge variant="outline" className="bg-white/60 border-purple-200 text-purple-700">
              {aiInsights.length} Total Insights
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(averageConfidence)}%</div>
              <div className="text-xs text-gray-600">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(totalEstimatedValue)}</div>
              <div className="text-xs text-gray-600">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{phaseInsights.length}</div>
              <div className="text-xs text-gray-600">Phase {currentProject.currentPhase} Focus</div>
            </div>
          </div>
        </div>

        {/* Insights by Type - Enhanced Cards */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
            Insights by Category
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(insightsByType).map(([type, insights]) => {
              const totalValue = insights.reduce((sum, i) => sum + (i.estimatedValue || 0), 0);
              const highConfidenceCount = insights.filter(i => i.confidence > 80).length;

              return (
                <Card key={type} className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-gray-200 hover:border-l-purple-400">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {type === "risks" && <AlertCircle className="h-5 w-5 text-red-500" />}
                      {type === "opportunities" && <TrendingUp className="h-5 w-5 text-green-500" />}
                      {type === "automations" && <Zap className="h-5 w-5 text-purple-500" />}
                      {type === "benchmarks" && <BarChart3 className="h-5 w-5 text-blue-500" />}
                      {type === "recommendations" && <Lightbulb className="h-5 w-5 text-yellow-500" />}
                      <span className="text-sm font-semibold capitalize text-gray-700">{type}</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      {insights.length}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">High Confidence</span>
                      <span className="text-xs font-medium">
                        {highConfidenceCount}/{insights.length}
                      </span>
                    </div>

                    {(type === "opportunities" || type === "automations") && totalValue > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Potential Value</span>
                        <span className="text-xs font-medium text-green-600">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(totalValue)}</span>
                      </div>
                    )}

                    <Progress value={(insights.length / aiInsights.length) * 100} className="h-2" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Current Phase Deep Dive */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Phase {currentProject.currentPhase} Deep Dive</span>
            </CardTitle>
            <CardDescription>Detailed insights for current transformation phase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {phaseInsights.slice(0, 4).map(insight => (
              <div key={insight.id} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-1 rounded ${insight.impact === "high" ? "bg-red-100 text-red-600" : insight.impact === "medium" ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"}`}
                    >
                      {insight.type === "automation" && <Zap className="h-3 w-3" />}
                      {insight.type === "opportunity" && <Target className="h-3 w-3" />}
                      {insight.type === "risk" && <AlertCircle className="h-3 w-3" />}
                      {insight.type === "benchmark" && <BarChart3 className="h-3 w-3" />}
                      {insight.type === "recommendation" && <Lightbulb className="h-3 w-3" />}
                    </div>
                    <div className="font-medium text-sm">{insight.title}</div>
                  </div>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}%
                    </Badge>
                    {insight.estimatedValue && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(insight.estimatedValue)}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{insight.description.substring(0, 120)}...</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Source: {insight.source}</span>
                    {insight.timeframe && <span>• {insight.timeframe}</span>}
                  </div>
                  {insight.actionable && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Actionable
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {phaseInsights.length > 4 && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm" onClick={() => setActiveTab("chat")}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discuss {phaseInsights.length - 4} More Insights
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced API Status */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>AI Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Connection</span>
                  <div className="flex items-center space-x-2">
                    {assistantState.apiStatus === "connected" ? (
                      <>
                        <Wifi className="h-4 w-4 text-green-500" />
                        <Badge variant="default" className="text-xs bg-green-100 text-green-700 border-green-200">
                          Connected
                        </Badge>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-red-500" />
                        <Badge variant="destructive" className="text-xs">
                          {assistantState.apiStatus}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Model</span>
                  <Badge variant="outline" className="text-xs bg-white">
                    {assistantState.currentModel.split("-").slice(-1)[0]}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">
                      {conversationContext.responseQuality.totalResponses > 0
                        ? Math.round((conversationContext.responseQuality.successfulApiCalls / conversationContext.responseQuality.totalResponses) * 100)
                        : 100}
                      %
                    </span>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Confidence</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">{Math.round(conversationContext.responseQuality.avgConfidence)}%</span>
                    <Brain className="h-3 w-3 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ));

  return (
    <Sheet open={isVisible} onOpenChange={onClose}>
      <SheetContent className="ai-assistant-sheet p-0 flex flex-col h-full max-h-screen">
        <div className="flex flex-col h-full min-h-0">
          {/* Enhanced Header with API Status */}
          <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <SheetTitle className="text-lg flex items-center space-x-2">
                    <span>AI Assistant</span>
                    {assistantState.apiStatus === "connected" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {assistantState.apiStatus === "error" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </SheetTitle>
                  <SheetDescription className="text-sm">
                    Phase {currentProject.currentPhase} • {currentProject.clientName} • {conversationContext.questionsAsked} questions asked
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={`${assistantState.isConnected ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${assistantState.isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
                  {assistantState.isConnected ? "Claude Online" : "Offline"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {Math.round(currentProject.aiAcceleration)}% AI
                </Badge>
              </div>
            </div>
          </SheetHeader>

          {/* Tabs for different views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 relative">
            <div className="border-b px-4 flex-shrink-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="insights">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Insights
                </TabsTrigger>
                <TabsTrigger value="actions">
                  <Target className="h-4 w-4 mr-2" />
                  Actions
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 flex flex-col mt-0 min-h-0">
              {/* Enhanced Quick Actions */}
              <div className="p-4 border-b bg-gray-50 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Quick Actions</span>
                    <Badge variant="outline" className="text-xs">
                      {getEnhancedQuickActions().length} available
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearConversation}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Clear Chat
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {getEnhancedQuickActions()
                    .slice(0, 4)
                    .map((action, index) => (
                      <Button key={index} variant="outline" size="sm" onClick={action.action} className="justify-start text-xs h-10 p-2">
                        <div className="flex items-start space-x-2">
                          <action.icon className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <div className="text-left">
                            <div className="font-medium">{action.label}</div>
                            <div className="text-xs text-gray-500">{action.description}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                </div>
              </div>

              {/* Chat Messages Area with fixed height and scroll */}
              <div className="flex-1 overflow-y-auto border-l-4 border-l-purple-200 bg-gray-50/30 min-h-0">
                <div className="p-4 space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-lg p-3 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border shadow-sm"}`}>
                        {message.role === "assistant" && (
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Brain className="h-4 w-4 text-purple-600" />
                              <span className="text-xs font-medium text-gray-600">AI Assistant</span>
                            </div>
                            <div className="flex space-x-1">
                              {message.confidence && (
                                <Badge variant="outline" className="text-xs">
                                  {message.confidence}% confidence
                                </Badge>
                              )}
                              {message.relatedPhase && (
                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600">
                                  Phase {message.relatedPhase}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          className="ai-assistant-markdown text-sm leading-relaxed"
                          components={{
                            code: ({ node, inline, className, children, ...props }: any) =>
                              inline ? (
                                <code className="bg-blue-50 text-blue-700 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                                  {children}
                                </code>
                              ) : (
                                <code className="block bg-gray-100 text-gray-800 p-2 rounded text-xs font-mono overflow-x-auto" {...props}>
                                  {children}
                                </code>
                              ),
                            pre: ({ children }: any) => (
                              <pre className="bg-gray-100 border border-gray-200 rounded p-3 mb-2 overflow-x-auto relative">
                                <div className="absolute top-2 right-2 flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      // Extract text content from children
                                      const extractText = (node: any): string => {
                                        if (typeof node === "string") return node;
                                        if (node?.props?.children) {
                                          if (Array.isArray(node.props.children)) {
                                            return node.props.children.map(extractText).join("");
                                          }
                                          return extractText(node.props.children);
                                        }
                                        return "";
                                      };

                                      const text = Array.isArray(children) ? children.map(extractText).join("") : extractText(children);

                                      navigator.clipboard
                                        .writeText(text)
                                        .then(() => {
                                          alert("Code copied to clipboard!");
                                        })
                                        .catch(err => {
                                          console.error("Failed to copy code: ", err);
                                        });
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                        <div className="text-xs opacity-70 mt-2 flex justify-between items-center">
                          <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          {message.role === "assistant" && (
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 opacity-50 hover:opacity-100">
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border rounded-lg p-3 max-w-[85%] shadow-sm">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
                          <span className="text-sm text-gray-600">Claude is thinking...</span>
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} className="h-1" />
                </div>
              </div>

              {/* Fixed Input Area at Bottom */}
              <div className="border-t bg-white p-4 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="Ask Claude about your transformation project..."
                      onKeyPress={e => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      className="pr-16 min-h-[40px] border-purple-200 focus:border-purple-400 focus:ring-purple-200"
                      disabled={assistantState.isLoading}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                        <Paperclip className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                        <Mic className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!input.trim() || isTyping || assistantState.isLoading} className="bg-purple-600 hover:bg-purple-700 h-10 px-4">
                    {assistantState.isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Enhanced Status Bar */}
                <div className="flex items-center justify-between mt-3 text-xs">
                  <div className="flex items-center space-x-4 text-gray-500">
                    <span>Press Enter to send • Shift+Enter for new line</span>
                    {assistantState.apiStatus === "error" && (
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        <span className="text-red-500">Connection issues</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <MessageSquare className="h-3 w-3" />
                      <span>{messages.length - 1} messages</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500 hover:text-gray-700" onClick={exportConversation}>
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="absolute inset-0 top-12 overflow-y-auto">
              <InsightsPanel />
            </TabsContent>

            <TabsContent value="actions" className="absolute inset-0 top-12 overflow-y-auto">
              <div className="h-full p-4 space-y-6">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">AI-Powered Actions</h2>
                  </div>
                  <p className="text-sm text-gray-600">Click any action to automatically send it to the AI Assistant for immediate execution</p>
                </div>

                {/* Action Categories */}
                <div className="space-y-6">
                  {/* Strategic Analysis Actions */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                      Strategic Analysis & Planning
                      <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                        AI Enhanced
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {getEnhancedQuickActions()
                        .filter(action => action.category === "strategic")
                        .map((action, index) => (
                          <Card
                            key={index}
                            className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-green-200 hover:border-l-green-400 hover:bg-green-50/50"
                            onClick={action.action}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                                <action.icon className="h-6 w-6 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800">{action.label}</div>
                                <div className="text-sm text-gray-600 mt-1">{action.description}</div>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    {action.type}
                                  </Badge>
                                  <span className="text-xs text-gray-500">Auto-executes in chat</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Operational Support Actions */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <Settings className="h-4 w-4 mr-2 text-blue-600" />
                      Operational Support & Management
                      <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                        Process Optimization
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {getEnhancedQuickActions()
                        .filter(action => action.category === "operational")
                        .map((action, index) => (
                          <Card
                            key={index}
                            className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-200 hover:border-l-blue-400 hover:bg-blue-50/50"
                            onClick={action.action}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                                <action.icon className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800">{action.label}</div>
                                <div className="text-sm text-gray-600 mt-1">{action.description}</div>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {action.type}
                                  </Badge>
                                  <span className="text-xs text-gray-500">Auto-executes in chat</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Content Modification Actions */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-purple-600" />
                      Content Creation & Modification
                      <Badge variant="outline" className="ml-2 text-xs bg-purple-50 text-purple-700 border-purple-200">
                        AI Generation
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {getEnhancedQuickActions()
                        .filter(action => action.category === "content")
                        .map((action, index) => (
                          <Card
                            key={index}
                            className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-purple-200 hover:border-l-purple-400 hover:bg-purple-50/50"
                            onClick={action.action}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                <action.icon className="h-6 w-6 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800">{action.label}</div>
                                <div className="text-sm text-gray-600 mt-1">{action.description}</div>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                    {action.type}
                                  </Badge>
                                  <span className="text-xs text-gray-500">Auto-executes in chat</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Quick Start Templates */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-orange-600" />
                      Quick Start Templates
                      <Badge variant="outline" className="ml-2 text-xs bg-orange-50 text-orange-700 border-orange-200">
                        Pre-built
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Card
                        className="p-3 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-orange-200 hover:border-l-orange-400 hover:bg-orange-50/50"
                        onClick={() => {
                          setActiveTab("chat");
                          setInput(
                            `Provide a comprehensive assessment of our transformation progress across all phases. Include achievements, challenges, upcoming risks, and strategic recommendations for accelerating delivery.`
                          );
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <BarChart3 className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">Comprehensive Review</span>
                        </div>
                        <p className="text-xs text-gray-600">Full project assessment</p>
                      </Card>

                      <Card
                        className="p-3 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-orange-200 hover:border-l-orange-400 hover:bg-orange-50/50"
                        onClick={() => {
                          setActiveTab("chat");
                          setInput(`What are the next 3 critical steps we should focus on? Prioritize by impact, urgency, and resource requirements. Include specific deliverables and timelines.`);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <ArrowRight className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">Next Priority Steps</span>
                        </div>
                        <p className="text-xs text-gray-600">Critical next actions</p>
                      </Card>

                      <Card
                        className="p-3 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-orange-200 hover:border-l-orange-400 hover:bg-orange-50/50"
                        onClick={() => {
                          setActiveTab("chat");
                          setInput(
                            `How can we leverage AI and automation to accelerate our transformation by 25%? Include specific technology recommendations, process improvements, and implementation roadmap.`
                          );
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">AI Acceleration</span>
                        </div>
                        <p className="text-xs text-gray-600">Boost transformation speed</p>
                      </Card>

                      <Card
                        className="p-3 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-orange-200 hover:border-l-orange-400 hover:bg-orange-50/50"
                        onClick={() => {
                          setActiveTab("chat");
                          setInput(`Prepare a stakeholder presentation for our next executive meeting. Include project status, key wins, challenges, upcoming milestones, and resource requirements.`);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">Executive Update</span>
                        </div>
                        <p className="text-xs text-gray-600">Stakeholder presentation</p>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
});
