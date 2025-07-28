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
  ChevronDown,
  ChevronUp,
  Layers,
  Briefcase,
  Presentation,
  Search,
  Filter,
  Star,
  Database,
} from "lucide-react";
import { ChatMessage, TransformationProject, AIInsight, ConversationContext, AIAssistantState, ClaudeApiRequest, ClaudeApiResponse, WorkflowPhase } from "../../types";

// Simple Collapsible component with actual functionality
const Collapsible = ({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => <div>{children}</div>;

const CollapsibleTrigger = ({ asChild, children, onClick }: { asChild?: boolean; children: React.ReactNode; onClick?: () => void }) => <div onClick={onClick}>{children}</div>;

const CollapsibleContent = ({ className, children, isOpen }: { className?: string; children: React.ReactNode; isOpen?: boolean }) => (
  <div className={`${className} transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>{children}</div>
);

interface AIAssistantProps {
  isVisible: boolean;
  onClose: () => void;
  currentProject: TransformationProject;
  aiInsights: AIInsight[];
  workflowPhases?: WorkflowPhase[];
}

export const AIAssistant: React.FC<AIAssistantProps> = React.memo(({ isVisible, onClose, currentProject, aiInsights, workflowPhases = [] }) => {
  // Create a unique storage key for this project's conversation
  const conversationStorageKey = `ai-conversation-${currentProject.id}`;

  // Initialize messages with localStorage data if available
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMessages = localStorage.getItem(conversationStorageKey);
        if (savedMessages) {
          const parsed = JSON.parse(savedMessages);
          // Convert timestamp strings back to Date objects
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
        }
      } catch (error) {
        console.error("Error loading conversation from localStorage:", error);
      }
    }
    return [];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = useState(false);
  const [selectedActionCategory, setSelectedActionCategory] = useState<string>("all");
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [assistantState, setAssistantState] = useState<AIAssistantState>({
    isLoading: false,
    isConnected: true,
    lastApiCall: null,
    apiStatus: "connected",
    currentModel: "claude-sonnet-4-20250514",
  });

  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    topicsDiscussed: [],
    lastPhaseDiscussed: currentProject.currentPhase,
    questionsAsked: 0,
    userPreferences: {
      prefers: "actionable",
      focusAreas: [],
    },
    sessionStartTime: new Date("2024-01-15T00:00:00Z"),
    lastActivity: new Date("2024-01-15T00:00:00Z"),
    responseQuality: {
      totalResponses: 0,
      avgConfidence: 0,
      successfulApiCalls: 0,
      failedApiCalls: 0,
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle project changes - load appropriate conversation history
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoadingConversation(true);
      try {
        const savedMessages = localStorage.getItem(conversationStorageKey);
        if (savedMessages) {
          const parsed = JSON.parse(savedMessages);
          const messagesWithDates = parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(messagesWithDates);
        } else {
          // No saved conversation for this project, start fresh
          setMessages([]);
        }
      } catch (error) {
        console.error("Error loading conversation for project:", error);
        setMessages([]);
      }
      setIsLoadingConversation(false);
    }
  }, [currentProject.id, conversationStorageKey]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      try {
        localStorage.setItem(conversationStorageKey, JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving conversation to localStorage:", error);
      }
    }
  }, [messages, conversationStorageKey]);

  // Initialize welcome message with enhanced markdown structure (only if no saved messages and loading is complete)
  useEffect(() => {
    if (!isLoadingConversation && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        content: `# 🤖 Welcome to Your AI Transformation Consultant

I'm **Axel**, your enterprise-grade AI assistant specialized in **Finance Transformation Blueprint** methodology.

## 📋 **Current Project Overview**

| **Attribute** | **Details** |
|---------------|-------------|
| **Client** | ${currentProject.clientName} |
| **Industry** | ${currentProject.industry || "Not specified"} |
| **Current Phase** | **Phase ${currentProject.currentPhase}** of 7 |
| **Progress** | ${Math.round(currentProject.progress)}% complete |
| **AI Acceleration** | ${Math.round(currentProject.aiAcceleration)}% |
| **Team Size** | ${currentProject.teamMembers?.length || "N/A"} members |

## 🎯 **What I Can Help You With**

### **📊 Strategic Analysis & Planning**
- **Gap analysis** and **benchmarking** against industry standards
- **ROI calculations** and **business case development** 
- **Risk assessment** and **mitigation strategies**
- **Resource planning** and **timeline optimization**

### **🔄 Process & Technology Optimization**  
- **Process standardization** and **automation opportunities**
- **Technology roadmap** development and **system integration**
- **Change management** strategies and **stakeholder engagement**
- **Performance metrics** and **KPI dashboard** design

### **📈 Insights & Recommendations**
- **AI-powered insights** from your ${aiInsights.length} available analyses
- **Phase-specific guidance** tailored to your current methodology stage
- **Best practice recommendations** from The Hackett Group's IP library
- **Executive reporting** and **stakeholder communication** materials

---

**💡 Tip:** Use the **Quick Actions** below to get started, or ask me anything about your transformation journey!`,
        role: "assistant",
        timestamp: new Date("2024-01-15T00:00:00Z"),
        confidence: 95,
        relatedPhase: currentProject.currentPhase,
      };

      setMessages([welcomeMessage]);
    }
  }, [currentProject, aiInsights, messages.length, isLoadingConversation]);

  // Enhanced Quick Actions with better categorization
  const getEnhancedQuickActions = () => {
    const currentPhase = currentProject.currentPhase;

    const actions = [
      // Strategic Analysis Actions
      {
        id: "gap-analysis",
        label: "Comprehensive Gap Analysis",
        description: "AI-powered analysis of current vs. target state with specific recommendations",
        icon: Target,
        category: "analysis",
        type: "Strategic Analysis",
        phase: "all",
        priority: "high",
        action: () => {
          setActiveTab("chat");
          setInput(`Conduct a comprehensive gap analysis for ${currentProject.clientName} comparing our current state to digital world-class standards. Include:

• **Process Maturity Assessment**: Current capabilities vs. best practices
• **Technology Gap Analysis**: System limitations and integration opportunities  
• **Organizational Readiness**: Skills, structure, and change capacity
• **Performance Benchmarking**: KPIs vs. industry leaders
• **Priority Gap Ranking**: By impact, effort, and strategic importance

Provide specific recommendations with quantified benefits and implementation roadmaps.`);
          setTimeout(() => handleSendMessage(), 100);
        },
      },
      {
        id: "roi-calculator",
        label: "ROI & Business Case Builder",
        description: "Generate detailed financial justification with cost-benefit analysis",
        icon: DollarSign,
        category: "financial",
        type: "Financial Analysis",
        phase: "all",
        priority: "high",
        action: () => {
          setActiveTab("chat");
          setInput(`Build a comprehensive ROI and business case for our transformation initiatives. Include:

**🎯 Executive Summary**
• **Total Investment Required**: Capital and operational costs
• **Expected Benefits**: Revenue increase, cost reduction, efficiency gains
• **ROI Calculations**: NPV, IRR, payback period, and break-even analysis
• **Risk Assessment**: Implementation risks and mitigation strategies

**📊 Detailed Financial Analysis**
• **Cost Breakdown**: Technology, process, training, and change management
• **Benefit Quantification**: Productivity gains, error reduction, compliance savings
• **Timeline**: Phased implementation with milestone-based benefits realization
• **Sensitivity Analysis**: Best case, worst case, and most likely scenarios

Format as executive presentation with supporting data tables.`);
          setTimeout(() => handleSendMessage(), 100);
        },
      },
      {
        id: "risk-assessment",
        label: "Enterprise Risk Assessment",
        description: "Identify, assess, and prioritize transformation risks with mitigation plans",
        icon: AlertTriangle,
        category: "risk",
        type: "Risk Management",
        phase: "all",
        priority: "high",
        action: () => {
          setActiveTab("chat");
          setInput(`Perform a comprehensive enterprise risk assessment for our transformation. Analyze:

**🚨 Strategic Risks**
• **Technology Integration**: System compatibility, data migration, downtime risks
• **Organizational Change**: Resistance, skills gaps, cultural barriers
• **Timeline & Budget**: Scope creep, resource constraints, dependencies
• **Regulatory Compliance**: Control frameworks, audit requirements, data governance

**📋 Risk Management Framework**
• **Risk Matrix**: Probability vs. Impact scoring (1-5 scale)
• **Mitigation Strategies**: Preventive and contingent action plans  
• **Risk Ownership**: RACI assignments for monitoring and response
• **Key Risk Indicators**: Early warning metrics and escalation triggers

Prioritize top 10 risks with detailed mitigation roadmaps and success criteria.`);
          setTimeout(() => handleSendMessage(), 100);
        },
      },

      // Process & Technology Actions
      {
        id: "process-optimization",
        label: "Process Standardization & Automation",
        description: "Identify automation opportunities and design optimized workflows",
        icon: Zap,
        category: "process",
        type: "Process Excellence",
        phase: "all",
        priority: "medium",
        action: () => {
          setActiveTab("chat");
          setInput(`Design a comprehensive process optimization strategy focusing on:

**🔄 Process Standardization**
• **Current State Mapping**: Document existing processes with pain points
• **Best Practice Design**: Industry-leading process blueprints
• **Standardization Opportunities**: Consolidate variations and eliminate redundancies
• **Control Point Optimization**: Reduce manual touchpoints and approval cycles

**🤖 Automation Opportunities**
• **RPA Candidates**: Repetitive, rule-based tasks for bot automation
• **AI Enhancement**: Decision support, predictive analytics, intelligent routing
• **System Integration**: API connections and data flow automation
• **Exception Handling**: Automated escalation and resolution workflows

Include implementation prioritization matrix and expected efficiency gains (FTE reduction, cycle time improvement).`);
          setTimeout(() => handleSendMessage(), 100);
        },
      },
      {
        id: "technology-roadmap",
        label: "Technology Architecture & Roadmap",
        description: "Design future-state technology architecture with implementation timeline",
        icon: Layers,
        category: "technology",
        type: "Technology Strategy",
        phase: "all",
        priority: "medium",
        action: () => {
          setActiveTab("chat");
          setInput(`Develop a comprehensive technology architecture and implementation roadmap:

**🏗️ Target Architecture Design**
• **Core ERP Strategy**: Platform consolidation and standardization approach
• **Analytics & BI Platform**: Data warehouse, reporting, and dashboard architecture
• **Integration Layer**: API strategy, middleware, and data flow design
• **Cloud Strategy**: Migration approach, security, and cost optimization

**📅 Implementation Roadmap**
• **Phase 1**: Foundation (6-9 months) - Core system stabilization
• **Phase 2**: Integration (9-12 months) - Data flows and process automation  
• **Phase 3**: Optimization (12-18 months) - AI/ML capabilities and advanced analytics
• **Phase 4**: Innovation (18+ months) - Emerging technologies and continuous improvement

Include vendor selection criteria, total cost of ownership, and risk mitigation strategies.`);
          setTimeout(() => handleSendMessage(), 100);
        },
      },

      // Executive & Stakeholder Actions
      {
        id: "executive-dashboard",
        label: "Executive Dashboard & KPIs",
        description: "Design C-level dashboards with key transformation metrics",
        icon: BarChart3,
        category: "reporting",
        type: "Executive Reporting",
        phase: "all",
        priority: "medium",
        action: () => {
          setActiveTab("chat");
          setInput(`Design a comprehensive executive dashboard and KPI framework:

**📊 Executive Dashboard Components**
• **Transformation Health**: Overall progress, milestone achievement, budget variance
• **Financial Performance**: Cost savings realized, efficiency gains, ROI tracking
• **Operational Metrics**: Process cycle times, error rates, automation penetration
• **Risk & Compliance**: Open issues, control effectiveness, audit readiness

**🎯 KPI Framework by Stakeholder**
• **CFO Metrics**: Financial accuracy, reporting speed, cost per transaction
• **COO Metrics**: Process efficiency, SLA performance, resource utilization  
• **CHRO Metrics**: Employee satisfaction, training completion, change adoption
• **CTO Metrics**: System uptime, integration success, security compliance

Include visualization recommendations, refresh frequencies, and drill-down capabilities.`);
          setTimeout(() => handleSendMessage(), 100);
        },
      },
      {
        id: "stakeholder-presentation",
        label: "Stakeholder Communication Package",
        description: "Create tailored presentations for different stakeholder groups",
        icon: Presentation,
        category: "communication",
        type: "Change Management",
        phase: "all",
        priority: "medium",
        action: () => {
          setActiveTab("chat");
          setInput(`Create a comprehensive stakeholder communication package:

**🎤 Executive Presentation (Board/C-Suite)**
• **Strategic Vision**: Transformation objectives and business case
• **Progress Update**: Milestones achieved, challenges overcome, upcoming phases
• **Financial Performance**: ROI realization, cost savings, investment tracking
• **Risk Management**: Key risks, mitigation status, escalation needs

**👥 Operational Team Communication**  
• **Day-to-Day Impact**: Process changes, system updates, training requirements
• **Success Stories**: Quick wins, productivity improvements, team recognition
• **Support Resources**: Help desk, training materials, feedback channels
• **Timeline**: Upcoming changes, key dates, preparation requirements

**📋 Change Management Materials**
• **FAQ Document**: Common concerns and detailed responses
• **Training Curriculum**: Role-based learning paths and certification requirements
• **Communication Calendar**: Regular updates, town halls, and feedback sessions

Tailor messaging and format for each audience with appropriate detail levels.`);
          setTimeout(() => handleSendMessage(), 100);
        },
      },

      // Phase-Specific Actions
      {
        id: "phase-guidance",
        label: `Phase ${currentPhase} Specific Guidance`,
        description: `Detailed guidance and next steps for current phase activities`,
        icon: Briefcase,
        category: "phase",
        type: "Phase Management",
        phase: currentPhase.toString(),
        priority: "high",
        action: () => {
          setActiveTab("chat");
          setInput(`Provide comprehensive Phase ${currentPhase} specific guidance for ${currentProject.clientName}:

**📋 Current Phase Overview**
• **Phase ${currentPhase} Objectives**: Key goals and success criteria
• **Critical Activities**: Must-complete tasks and deliverables
• **Resource Requirements**: Team allocation, skills needed, external support
• **Timeline & Milestones**: Key dates, dependencies, and checkpoint reviews

**🎯 Immediate Next Steps (Next 2 Weeks)**
• **Priority 1 Actions**: Critical path activities requiring immediate attention
• **Priority 2 Actions**: Important but not urgent tasks
• **Stakeholder Engagement**: Required approvals, reviews, and communications
• **Risk Mitigation**: Current phase risks and preventive actions

**📊 Success Metrics & Checkpoints**
• **Completion Criteria**: How to measure phase success
• **Quality Gates**: Review points and approval requirements  
• **Progress Indicators**: Weekly tracking metrics and dashboard updates
• **Escalation Triggers**: Warning signs requiring senior management attention

Include specific templates, tools, and resources for execution.`);
          setTimeout(() => handleSendMessage(), 100);
        },
      },

      // Innovation & Advanced Analytics
      {
        id: "ai-acceleration",
        label: "AI Acceleration Opportunities",
        description: "Identify AI and machine learning applications to boost transformation speed",
        icon: Brain,
        category: "innovation",
        type: "AI Strategy",
        phase: "all",
        priority: "medium",
        action: () => {
          setActiveTab("chat");
          setInput(`Identify comprehensive AI acceleration opportunities for our transformation:

**🤖 AI Application Areas**
• **Intelligent Process Automation**: Beyond RPA with cognitive capabilities
• **Predictive Analytics**: Forecasting, demand planning, risk prediction
• **Natural Language Processing**: Document processing, contract analysis, regulatory compliance
• **Computer Vision**: Invoice processing, document digitization, quality control

**🚀 Transformation Acceleration Strategy**
• **Quick Wins**: Low-effort, high-impact AI implementations (3-6 months)
• **Strategic Initiatives**: Medium-term AI platforms and capabilities (6-18 months)  
• **Innovation Pipeline**: Long-term emerging technology adoption (18+ months)
• **Skill Development**: AI literacy, data science capabilities, change management

**📈 Expected Impact Analysis**
• **Speed Improvement**: Reduce transformation timeline by 25-40%
• **Quality Enhancement**: Improve accuracy, reduce errors, enhance compliance
• **Cost Optimization**: Lower operational costs, improve resource utilization
• **Competitive Advantage**: New capabilities, innovative service delivery

Include technology vendor recommendations, implementation roadmap, and ROI projections.`);
          setTimeout(() => handleSendMessage(), 100);
        },
      },
    ];

    // Filter actions based on selected category
    if (selectedActionCategory === "all") {
      return actions;
    }
    return actions.filter(action => action.category === selectedActionCategory);
  };

  // Enhanced message handling with simple non-streaming approach
  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setAssistantState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          conversationHistory: messages,
          projectContext: {
            clientName: currentProject.clientName,
            industry: currentProject.industry,
            currentPhase: currentProject.currentPhase,
            workflowPhases: workflowPhases,
          },
          aiInsights: aiInsights,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        role: "assistant",
        timestamp: new Date(data.timestamp),
        confidence: data.confidence,
        relatedPhase: data.relatedPhase,
        model: data.model,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update conversation context
      setConversationContext(prev => ({
        ...prev,
        questionsAsked: prev.questionsAsked + 1,
        lastActivity: new Date(),
        responseQuality: {
          ...prev.responseQuality,
          totalResponses: prev.responseQuality.totalResponses + 1,
          successfulApiCalls: prev.responseQuality.successfulApiCalls + 1,
          avgConfidence: (prev.responseQuality.avgConfidence * prev.responseQuality.totalResponses + (data.confidence || 0)) / (prev.responseQuality.totalResponses + 1),
        },
      }));

      setAssistantState(prev => ({
        ...prev,
        isLoading: false,
        lastApiCall: new Date(),
        apiStatus: "connected",
      }));
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing technical difficulties. Please try again or contact support if the issue persists.",
        role: "assistant",
        timestamp: new Date(),
        confidence: 30,
        error: "CONNECTION_ERROR",
        fallback: true,
      };

      setMessages(prev => [...prev, errorMessage]);

      setAssistantState(prev => ({
        ...prev,
        isLoading: false,
        apiStatus: "error",
      }));
    } finally {
      setIsTyping(false);
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    setConversationContext(prev => ({ ...prev, questionsAsked: 0, topicsDiscussed: [] }));

    // Clear localStorage data
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(conversationStorageKey);
      } catch (error) {
        console.error("Error clearing conversation from localStorage:", error);
      }
    }

    // Re-initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      content: `# 🤖 Welcome to Your AI Transformation Consultant

I'm **Claude**, your enterprise-grade AI assistant specialized in **Finance Transformation Blueprint** methodology.

## 📋 **Current Project Overview**

| **Attribute** | **Details** |
|---------------|-------------|
| **Client** | ${currentProject.clientName} |
| **Industry** | ${currentProject.industry || "Not specified"} |
| **Current Phase** | **Phase ${currentProject.currentPhase}** of 7 |
| **Progress** | ${Math.round(currentProject.progress)}% complete |
| **AI Acceleration** | ${Math.round(currentProject.aiAcceleration)}% |
| **Team Size** | ${currentProject.teamMembers?.length || "N/A"} members |

## 🎯 **What I Can Help You With**

### **📊 Strategic Analysis & Planning**
- **Gap analysis** and **benchmarking** against industry standards
- **ROI calculations** and **business case development** 
- **Risk assessment** and **mitigation strategies**
- **Resource planning** and **timeline optimization**

### **🔄 Process & Technology Optimization**  
- **Process standardization** and **automation opportunities**
- **Technology roadmap** development and **system integration**
- **Change management** strategies and **stakeholder engagement**
- **Performance metrics** and **KPI dashboard** design

### **📈 Insights & Recommendations**
- **AI-powered insights** from your ${aiInsights.length} available analyses
- **Phase-specific guidance** tailored to your current methodology stage
- **Best practice recommendations** from The Hackett Group's IP library
- **Executive reporting** and **stakeholder communication** materials

---

**💡 Tip:** Use the **Quick Actions** below to get started, or ask me anything about your transformation journey!`,
      role: "assistant",
      timestamp: new Date("2024-01-15T00:00:00Z"),
      confidence: 95,
      relatedPhase: currentProject.currentPhase,
    };

    setMessages([welcomeMessage]);
  };

  // Function to copy message content to clipboard
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      // Could add a toast notification here
      console.log("Message copied to clipboard");
    });
  };

  // Function to export conversation history
  const exportConversation = () => {
    const conversationData = {
      projectName: currentProject.clientName,
      projectId: currentProject.id,
      exportDate: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        confidence: msg.confidence,
        relatedPhase: msg.relatedPhase,
      })),
    };

    const dataStr = JSON.stringify(conversationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-conversation-${currentProject.clientName}-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Auto-scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enhanced AI Insights rendering with better structure
  const renderAIInsights = () => (
    <div className="px-6 pb-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">AI-Generated Insights</h2>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {aiInsights.length} insights available
        </Badge>
      </div>

      {aiInsights.length === 0 ? (
        <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-blue-50 border-dashed">
          <Brain className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No AI Insights Yet</h3>
          <p className="text-gray-600 mb-4">Start a conversation to generate AI-powered insights and recommendations.</p>
          <Button onClick={() => setActiveTab("chat")} className="bg-blue-600 hover:bg-blue-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            Start Conversation
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {aiInsights.map((insight, index) => (
            <Card
              key={index}
              className={`p-4 border-l-4 hover:shadow-lg transition-all duration-200 ${
                insight.type === "opportunity"
                  ? "border-l-green-400 bg-green-50/50"
                  : insight.type === "risk"
                  ? "border-l-red-400 bg-red-50/50"
                  : insight.type === "automation"
                  ? "border-l-blue-400 bg-blue-50/50"
                  : "border-l-blue-400 bg-blue-50/50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {insight.type === "opportunity" && <TrendingUp className="h-5 w-5 text-green-600" />}
                  {insight.type === "risk" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                  {insight.type === "automation" && <Zap className="h-5 w-5 text-blue-600" />}
                  {insight.type === "recommendation" && <Lightbulb className="h-5 w-5 text-blue-600" />}
                  <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence}% confidence
                  </Badge>
                  {insight.estimatedValue && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                      $
                      {insight.estimatedValue >= 1000000
                        ? `${(insight.estimatedValue / 1000000).toFixed(1)}M`
                        : insight.estimatedValue >= 1000
                        ? `${(insight.estimatedValue / 1000).toFixed(0)}K`
                        : insight.estimatedValue.toString()}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-gray-700 mb-3">{insight.description}</p>
              {(insight as any).recommendations && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-800">Recommendations:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {(insight as any).recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Sheet open={isVisible} onOpenChange={onClose}>
      <SheetContent className="w-[920px] sm:w-[1000px] lg:w-[1200px] xl:w-[1300px] ai-assistant-sheet h-full max-h-screen min-h-0" side="right">
        <div className="h-full flex flex-col min-h-0">
          <SheetHeader className="flex-shrink-0 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="analytics-title text-2xl flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-100 rounded-xl">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <span>AI Transformation Consultant</span>
                </SheetTitle>
                <SheetDescription className="analytics-subtitle text-lg mt-2">Enterprise-grade Claude assistant for {currentProject.clientName} transformation</SheetDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={`text-sm ${
                    assistantState.apiStatus === "connected"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : assistantState.apiStatus === "error"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {assistantState.apiStatus === "connected" ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
                  {assistantState.apiStatus}
                </Badge>
                <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                  <Brain className="h-3 w-3 mr-1" />
                  {assistantState.currentModel.split("-").pop()}
                </Badge>
                {messages.length > 1 && (
                  <Badge variant="outline" className="text-sm bg-gray-50 text-gray-600 border-gray-200" title="Conversation automatically saved">
                    <Database className="h-3 w-3 mr-1" />
                    Auto-saved
                  </Badge>
                )}
              </div>
            </div>
          </SheetHeader>

          {/* Enhanced Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 relative">
            <div className="border-b px-4 flex-shrink-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat" data-tour="ai-chat" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Intelligent Chat</span>
                </TabsTrigger>
                <TabsTrigger value="insights" data-tour="ai-insights" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>AI Insights</span>
                </TabsTrigger>
                <TabsTrigger value="actions" data-tour="ai-actions" className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Action Center</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 flex flex-col mt-0 min-h-0">
              {/* Chat Messages Area with enhanced design */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white min-h-0">
                {isLoadingConversation ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Loading conversation history...</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {messages.map(message => (
                      <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-xl p-4 ${message.role === "user" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-800 border border-gray-200 shadow-sm"}`}>
                          {message.role === "assistant" && (
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                              <div className="flex items-center space-x-2">
                                <div className="p-1 bg-blue-100 rounded-full">
                                  <Brain className="h-3 w-3 text-blue-600" />
                                </div>
                                <span className="text-xs font-medium text-gray-600">Axel AI Assistant</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {message.confidence && (
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    {message.confidence}% confidence
                                  </Badge>
                                )}
                                {message.relatedPhase && (
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                    Phase {message.relatedPhase}
                                  </Badge>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => copyMessage(message.content)} className="h-6 w-6 p-0">
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Enhanced Markdown Rendering with Better Styling */}
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            className="ai-assistant-markdown prose prose-sm max-w-none"
                            components={{
                              // Enhanced heading styles with conditional colors
                              h1: ({ children }) => (
                                <h1 className={`text-xl font-bold mb-4 pb-2 border-b ${message.role === "user" ? "text-white border-white/20" : "text-gray-900 border-gray-200"}`}>{children}</h1>
                              ),
                              h2: ({ children }) => <h2 className={`text-lg font-semibold mb-3 mt-6 ${message.role === "user" ? "text-white" : "text-gray-800"}`}>{children}</h2>,
                              h3: ({ children }) => <h3 className={`text-md font-medium mb-2 mt-4 ${message.role === "user" ? "text-white" : "text-gray-700"}`}>{children}</h3>,

                              // Enhanced list styles with conditional colors
                              ul: ({ children }) => <ul className={`list-disc list-inside space-y-1 my-3 ml-2 ${message.role === "user" ? "text-white" : "text-gray-700"}`}>{children}</ul>,
                              ol: ({ children }) => <ol className={`list-decimal list-inside space-y-1 my-3 ml-2 ${message.role === "user" ? "text-white" : "text-gray-700"}`}>{children}</ol>,
                              li: ({ children }) => <li className="leading-relaxed">{children}</li>,

                              // Enhanced table styles with conditional colors
                              table: ({ children }) => (
                                <div className="overflow-x-auto my-4">
                                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">{children}</table>
                                </div>
                              ),
                              thead: ({ children }) => <thead className={message.role === "user" ? "bg-white/10" : "bg-gray-50"}>{children}</thead>,
                              th: ({ children }) => (
                                <th
                                  className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider border-b ${
                                    message.role === "user" ? "text-white/80 border-white/20" : "text-gray-500 border-gray-200"
                                  }`}
                                >
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className={`px-4 py-2 text-sm border-b ${message.role === "user" ? "text-white border-white/10" : "text-gray-900 border-gray-100"}`}>{children}</td>
                              ),

                              // Enhanced code styles with conditional colors
                              code: ({ node, inline, className, children, ...props }: any) =>
                                inline ? (
                                  <code className={`px-2 py-1 rounded-md text-xs font-mono font-medium ${message.role === "user" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-900"}`} {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto my-3 border border-gray-200" {...props}>
                                    {children}
                                  </code>
                                ),

                              // Enhanced blockquote with conditional colors
                              blockquote: ({ children }) => (
                                <blockquote
                                  className={`border-l-4 pl-4 py-2 my-3 italic rounded-r-lg ${
                                    message.role === "user" ? "border-white/40 bg-white/10 text-white" : "border-blue-400 bg-blue-50 text-gray-700"
                                  }`}
                                >
                                  {children}
                                </blockquote>
                              ),

                              // Enhanced paragraph spacing with conditional colors
                              p: ({ children }) => <p className={`leading-relaxed mb-3 ${message.role === "user" ? "text-white" : "text-gray-700"}`}>{children}</p>,

                              // Enhanced strong/bold text with conditional colors
                              strong: ({ children }) => <strong className={`font-semibold ${message.role === "user" ? "text-white" : "text-gray-900"}`}>{children}</strong>,

                              // Enhanced em/italic text
                              em: ({ children }) => <em className={`italic ${message.role === "user" ? "text-white" : "text-gray-800"}`}>{children}</em>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>

                          {message.error && (
                            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-xs text-red-700">{message.fallback ? "Using fallback response" : "Error occurred"}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                          <div className="flex items-center space-x-2">
                            <div className="p-1 bg-blue-100 rounded-full">
                              <Brain className="h-3 w-3 text-blue-600 animate-pulse" />
                            </div>
                            <span className="text-sm text-gray-600">Axel is thinking...</span>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Enhanced Chat Input Area */}
              <div className="flex-shrink-0 border-t border-gray-200 bg-white">
                <div className="p-4">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                        placeholder="Ask about transformation strategy, risks, opportunities, or request analysis..."
                        className="min-h-[44px] resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        disabled={isTyping}
                      />
                    </div>

                    {/* Send button - simplified without streaming options */}
                    <Button onClick={handleSendMessage} disabled={!input.trim() || isTyping} className="h-[44px] px-6 bg-blue-600 hover:bg-blue-700">
                      {isTyping ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Quick Action Buttons - Moved Below Chat */}
                  <div className="mt-4">
                    <Collapsible open={isQuickActionsExpanded} onOpenChange={setIsQuickActionsExpanded}>
                      <CollapsibleTrigger asChild onClick={() => setIsQuickActionsExpanded(!isQuickActionsExpanded)}>
                        <Button variant="outline" className="w-full justify-between bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200 hover:from-blue-100 hover:to-blue-100">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-700">Quick Actions & Templates</span>
                            <Badge variant="outline" className="bg-white text-blue-600 border-blue-300">
                              {getEnhancedQuickActions().length} available
                            </Badge>
                          </div>
                          {isQuickActionsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-3" isOpen={isQuickActionsExpanded}>
                        <div className="space-y-4">
                          {/* Category Filter */}
                          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Categories:</span>
                            {["all", "analysis", "financial", "risk", "process", "technology", "reporting", "communication", "phase", "innovation"].map(category => (
                              <Button
                                key={category}
                                variant={selectedActionCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedActionCategory(category)}
                                className={`text-xs whitespace-nowrap ${selectedActionCategory === category ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-50 text-blue-600 border-blue-200"}`}
                              >
                                {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                              </Button>
                            ))}
                          </div>

                          {/* Enhanced Quick Actions Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                            {getEnhancedQuickActions().map((action, index) => (
                              <Card
                                key={action.id}
                                className="p-3 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-200 hover:border-l-blue-400 hover:bg-blue-50/50 group"
                                onClick={action.action}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <action.icon className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="font-medium text-gray-800 text-sm leading-tight">{action.label}</h4>
                                      {action.priority === "high" && <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />}
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">{action.description}</p>
                                    <div className="flex items-center justify-between">
                                      <Badge variant="outline" className="text-xs bg-white border-blue-200 text-blue-700">
                                        {action.type}
                                      </Badge>
                                      <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Lightbulb className="h-3 w-3" />
                              <span>Click any action to auto-populate optimized prompts</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {messages.length > 1 && (
                                <Button variant="ghost" size="sm" onClick={exportConversation} className="text-xs hover:bg-blue-50 hover:text-blue-600">
                                  <Download className="h-3 w-3 mr-1" />
                                  Export
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={clearConversation} className="text-xs hover:bg-red-50 hover:text-red-600">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Clear Chat
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="h-full overflow-y-auto">
              {renderAIInsights()}
            </TabsContent>

            <TabsContent value="actions" className="h-full overflow-y-auto">
              <div className="px-6 pb-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Action Center</h2>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {getEnhancedQuickActions().length} actions available
                  </Badge>
                </div>

                {/* Comprehensive Action Categories */}
                <div className="space-y-8">
                  {/* Strategic Analysis Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-blue-600" />
                      Strategic Analysis & Planning
                      <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                        High Impact
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getEnhancedQuickActions()
                        .filter(action => action.category === "analysis" || action.category === "financial")
                        .map((action, index) => (
                          <Card
                            key={action.id}
                            className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-200 hover:border-l-blue-400 hover:bg-blue-50/50 group"
                            onClick={action.action}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <action.icon className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-semibold text-gray-800">{action.label}</div>
                                  {action.priority === "high" && <Star className="h-4 w-4 text-yellow-500" />}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">{action.description}</div>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {action.type}
                                  </Badge>
                                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Process & Technology Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-green-600" />
                      Process & Technology Optimization
                      <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                        Efficiency Focus
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getEnhancedQuickActions()
                        .filter(action => action.category === "process" || action.category === "technology" || action.category === "innovation")
                        .map((action, index) => (
                          <Card
                            key={action.id}
                            className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-green-200 hover:border-l-green-400 hover:bg-green-50/50 group"
                            onClick={action.action}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <action.icon className="h-6 w-6 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-semibold text-gray-800">{action.label}</div>
                                  {action.priority === "high" && <Star className="h-4 w-4 text-yellow-500" />}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">{action.description}</div>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    {action.type}
                                  </Badge>
                                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Executive & Communication Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Executive & Stakeholder Management
                      <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                        Leadership Focus
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getEnhancedQuickActions()
                        .filter(action => action.category === "reporting" || action.category === "communication" || action.category === "phase")
                        .map((action, index) => (
                          <Card
                            key={action.id}
                            className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-200 hover:border-l-blue-400 hover:bg-blue-50/50 group"
                            onClick={action.action}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <action.icon className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-semibold text-gray-800">{action.label}</div>
                                  {action.priority === "high" && <Star className="h-4 w-4 text-yellow-500" />}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">{action.description}</div>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {action.type}
                                  </Badge>
                                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Risk Management Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                      Risk Management & Governance
                      <Badge variant="outline" className="ml-2 text-xs bg-red-50 text-red-700 border-red-200">
                        Critical
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getEnhancedQuickActions()
                        .filter(action => action.category === "risk")
                        .map((action, index) => (
                          <Card
                            key={action.id}
                            className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-red-200 hover:border-l-red-400 hover:bg-red-50/50 group"
                            onClick={action.action}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <action.icon className="h-6 w-6 text-red-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-semibold text-gray-800">{action.label}</div>
                                  {action.priority === "high" && <Star className="h-4 w-4 text-yellow-500" />}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">{action.description}</div>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                    {action.type}
                                  </Badge>
                                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Custom Styles for Better Markdown Rendering */}
        <style jsx global>{`
          .ai-assistant-markdown {
            color: inherit;
          }

          .ai-assistant-markdown h1,
          .ai-assistant-markdown h2,
          .ai-assistant-markdown h3,
          .ai-assistant-markdown h4,
          .ai-assistant-markdown h5,
          .ai-assistant-markdown h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: 600;
            line-height: 1.25;
          }

          .ai-assistant-markdown h1 {
            font-size: 1.25rem;
            padding-bottom: 0.5rem;
          }

          .ai-assistant-markdown h2 {
            font-size: 1.125rem;
          }

          .ai-assistant-markdown h3 {
            font-size: 1rem;
          }

          .ai-assistant-markdown ul,
          .ai-assistant-markdown ol {
            margin: 1em 0;
            padding-left: 1.5em;
          }

          .ai-assistant-markdown ul {
            list-style-type: disc;
          }

          .ai-assistant-markdown ol {
            list-style-type: decimal;
            margin-left: 1.25em;
          }

          .ai-assistant-markdown li {
            margin: 0.25em 0;
            line-height: 1.6;
          }

          .ai-assistant-markdown p {
            margin: 1em 0;
            line-height: 1.6;
          }

          .ai-assistant-markdown strong {
            font-weight: 600;
          }

          .ai-assistant-markdown em {
            font-style: italic;
          }

          .ai-assistant-markdown code {
            font-family: "Fira Code", "Monaco", "Cascadia Code", "Roboto Mono", monospace;
          }

          .ai-assistant-markdown table {
            border-collapse: collapse;
            margin: 1em 0;
            width: 100%;
          }

          .ai-assistant-markdown th,
          .ai-assistant-markdown td {
            padding: 0.5em;
            text-align: left;
          }

          .ai-assistant-markdown th {
            font-weight: 600;
          }

          .ai-assistant-markdown hr {
            border: none;
            margin: 2em 0;
          }

          .prose {
            max-width: none;
          }

          .prose ul {
            list-style-type: disc;
            margin-left: 1.25em;
          }

          .prose ol {
            list-style-type: decimal;
            margin-left: 1.25em;
          }

          .prose li {
            margin-top: 0.25em;
            margin-bottom: 0.25em;
          }

          /* Fix for Radix UI Tabs hidden content interfering with layout */
          [role="tabpanel"][hidden] {
            display: none !important;
          }

          [data-state="inactive"][role="tabpanel"] {
            display: none !important;
          }
        `}</style>
      </SheetContent>
    </Sheet>
  );
});
