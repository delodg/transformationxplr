// Core transformation project interfaces
export interface TransformationProject {
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
  // Additional onboarding data
  revenue?: string;
  employees?: string;
  currentERP?: string;
  painPoints?: string[];
  objectives?: string[];
  timeline?: string;
  budget?: string;
}

// AI insights and recommendations
export interface AIInsight {
  id: string;
  type: "recommendation" | "risk" | "opportunity" | "benchmark" | "automation";
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  source: string;
  phase: number;
  actionable: boolean;
  estimatedValue?: number;
  timeframe?: string;
  dependencies?: string[];
}

// Workflow phase management
export interface WorkflowPhase {
  id: number;
  phaseNumber: number;
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
  estimatedCompletion?: string;
  riskFactors?: string[];
  successMetrics?: string[];
}

// Client onboarding data
export interface ClientOnboarding {
  companyName: string;
  companyNumber?: string; // New field for company identifier/number
  industry: string;
  revenue: string;
  employees: string;
  region: string;
  currentERP: string;
  painPoints: string[];
  objectives: string[];
  timeline: string;
  budget: string;
  maturityLevel: "basic" | "intermediate" | "advanced";
  previousTransformations: boolean;
  complianceRequirements: string[];
}

// Hackett IP assets
export interface HackettIPAsset {
  id: string;
  title: string;
  type: "benchmark" | "template" | "framework" | "best-practice" | "case-study";
  phase: number;
  relevanceScore: number;
  description: string;
  industry: string[];
  complexity: "low" | "medium" | "high";
  estimatedTimeToImplement: string;
  prerequisites?: string[];
  outcomes?: string[];
}

// Analytics and performance data
export interface PerformanceMetric {
  id: string;
  name: string;
  current: number;
  target: number;
  benchmark: number;
  unit: string;
  trend: "up" | "down" | "stable";
  category: "efficiency" | "quality" | "cost" | "time";
}

// Team collaboration
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  workstreams: string[];
  availability: "available" | "busy" | "offline";
  expertise: string[];
}

// Chat and communication
export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  attachments?: string[];
  relatedPhase?: number;
  confidence?: number;
  model?: string;
  error?: string;
  fallback?: boolean;
}

// Progress tracking
export interface ProgressUpdate {
  id: string;
  phaseId: number;
  timestamp: Date;
  description: string;
  author: string;
  type: "milestone" | "blocker" | "update" | "completion";
  impact: "high" | "medium" | "low";
}

// Roadmap and planning
export interface Initiative {
  id: string;
  title: string;
  description: string;
  phase: number;
  priority: "high" | "medium" | "low";
  estimatedValue: number;
  timeframe: string;
  resources: string[];
  dependencies: string[];
  risks: string[];
  owner: string;
  status: "planned" | "in-progress" | "completed" | "on-hold";
}

// Export utilities for filtering and sorting
export type PhaseStatus = WorkflowPhase["status"];
export type InsightType = AIInsight["type"];
export type ProjectStatus = TransformationProject["status"];

// Claude API integration types
export interface ClaudeApiRequest {
  message: string;
  conversationHistory: ChatMessage[];
  projectContext: TransformationProject;
  phaseContext: {
    currentPhase: number;
    workflowPhases: WorkflowPhase[];
  };
  aiInsights: AIInsight[];
}

export interface ClaudeApiResponse {
  content: string;
  confidence: number;
  relatedPhase: number | undefined;
  timestamp: string;
  model: string;
  error?: string;
  fallback?: boolean;
}

// Enhanced conversation context for AI assistant
export interface ConversationContext {
  topicsDiscussed: string[];
  lastPhaseDiscussed: number;
  questionsAsked: number;
  userPreferences: {
    prefers: "detailed" | "concise" | "actionable";
    focusAreas: string[];
  };
  sessionStartTime: Date;
  lastActivity: Date;
  responseQuality: {
    totalResponses: number;
    avgConfidence: number;
    successfulApiCalls: number;
    failedApiCalls: number;
  };
}

// AI Assistant state management
export interface AIAssistantState {
  isLoading: boolean;
  isConnected: boolean;
  lastApiCall: Date | null;
  apiStatus: "connected" | "error" | "connecting";
  currentModel: string;
}
