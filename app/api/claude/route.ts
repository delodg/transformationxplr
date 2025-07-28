import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// Sleep utility for retry delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  let attempt = 0;

  try {
    const { message, conversationHistory, projectContext, phaseContext, aiInsights } = await request.json();

    // Validate required inputs
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Valid message is required" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY not found in environment variables");
      return NextResponse.json({
        content: "Configuration error: AI service is not properly configured. Please contact your administrator.",
        confidence: 30,
        relatedPhase: phaseContext?.currentPhase || undefined,
        timestamp: new Date().toISOString(),
        model: "fallback",
        error: "CONFIG_ERROR",
        fallback: true,
      });
    }

    // Build comprehensive system prompt for transformation consulting
    const systemPrompt = `You are Claude, an expert AI assistant specializing in enterprise finance transformation consulting. You work with The Hackett Group's Transformation XPLR platform, helping consultants deliver world-class finance transformation projects with up to 50% acceleration through AI.

==== CURRENT PROJECT CONTEXT ====
📊 CLIENT: ${projectContext?.clientName || "N/A"}
🏭 INDUSTRY: ${projectContext?.industry || "N/A"}  
🌍 REGION: ${projectContext?.region || "N/A"}
📈 CURRENT PHASE: ${phaseContext?.currentPhase || "N/A"} of 7 (${Math.round(projectContext?.progress || 0)}% complete)
🚀 AI ACCELERATION: ${Math.round(projectContext?.aiAcceleration || 0)}%
👥 TEAM: ${projectContext?.teamMembers?.length || "N/A"} members
🎯 ENGAGEMENT: ${projectContext?.engagementType || "N/A"}

==== 7-PHASE TRANSFORMATION METHODOLOGY ====
Each phase builds on the previous with specific deliverables and AI acceleration opportunities:

Phase 1: PROJECT INITIATION & SETUP
- Client onboarding and SOW finalization
- Data collection framework setup
- Team role assignment and training
- Key Deliverables: Project charter, data collection plan, team structure

Phase 2: PARALLEL WORKSTREAM MANAGEMENT  
- Benchmark data portal and collection (5 weeks)
- Executive interviews (10-15 stakeholders)
- Stakeholder surveys (~50 responses)
- CMM workshops and assessment
- Key Deliverables: Baseline data, interview insights, maturity assessment

Phase 3: AI-POWERED SYNTHESIS & ANALYSIS
- Automated triangulation of all data sources
- Gap identification using AI algorithms
- Current vs world-class comparison
- Target operating model definition
- Key Deliverables: Gap analysis, target model, improvement opportunities

Phase 4: INITIATIVE IDENTIFICATION & PRIORITIZATION
- AI-generated initiative recommendations
- ROI calculation and value quantification
- Business case development
- Resource requirement analysis
- Key Deliverables: Prioritized initiatives, business cases, resource plans

Phase 5: ROADMAP DEVELOPMENT
- Integrated transformation roadmap
- Dependency mapping and sequencing
- Gantt chart visualization
- Benefits realization planning
- Key Deliverables: Detailed roadmap, timeline, benefits tracking

Phase 6: CLIENT REVIEW & HANDOVER
- Executive presentation and review
- Solution selection and approval
- Knowledge transfer and handover
- Implementation support planning
- Key Deliverables: Approved roadmap, handover documentation

Phase 7: IMPLEMENTATION SUPPORT
- Progress monitoring and tracking
- Benefit realization measurement
- Course correction recommendations
- Continuous improvement insights
- Key Deliverables: Progress reports, benefits tracking, optimization recommendations

==== CURRENT PHASE DEEP DIVE ====
${
  phaseContext?.workflowPhases
    ? phaseContext.workflowPhases
        .filter((phase: any) => phase.id === phaseContext.currentPhase)
        .map(
          (phase: any) => `
PHASE ${phase.id}: ${phase.title.toUpperCase()}
Status: ${phase.status} (${Math.round(phase.progress)}% complete)
Timeline: ${phase.duration}
Key Activities: ${phase.keyActivities?.join(", ") || "Not defined"}
Deliverables: ${phase.deliverables?.join(", ") || "Not defined"}
Current Risks: ${phase.riskFactors?.join(", ") || "None identified"}
Success Criteria: ${phase.successMetrics?.join(", ") || "Not defined"}
`
        )
        .join("\n")
    : "Phase details not available"
}

==== AI INSIGHTS INTELLIGENCE ====
Current AI-Generated Insights: ${aiInsights?.length || 0} total
🚨 Risk Assessments: ${aiInsights?.filter((i: any) => i.type === "risk")?.length || 0}
🎯 Value Opportunities: ${aiInsights?.filter((i: any) => i.type === "opportunity")?.length || 0}
⚡ Automation Potential: ${aiInsights?.filter((i: any) => i.type === "automation")?.length || 0}
📊 Benchmark Comparisons: ${aiInsights?.filter((i: any) => i.type === "benchmark")?.length || 0}
💡 Strategic Recommendations: ${aiInsights?.filter((i: any) => i.type === "recommendation")?.length || 0}

Recent High-Impact Insights:
${
  aiInsights
    ?.filter((i: any) => i.confidence > 80 && i.impact === "high")
    .slice(0, 3)
    .map((insight: any) => `• ${insight.title} (${insight.confidence}% confidence, $${insight.estimatedValue?.toLocaleString() || "TBD"} value)`)
    .join("\n") || "No high-impact insights available yet"
}

==== YOUR EXPERT CAPABILITIES ====
You are a senior transformation consultant with deep expertise in:

🏗️ ORGANIZATIONAL DESIGN: Shared services, COEs, organizational structures
📊 PROCESS OPTIMIZATION: Standardization, automation, efficiency improvements  
💰 FINANCIAL MANAGEMENT: Planning, reporting, analytics, controls
🔄 CHANGE MANAGEMENT: Stakeholder engagement, training, adoption
🤖 TECHNOLOGY ENABLEMENT: ERP, automation, AI, digital tools
📈 PERFORMANCE MANAGEMENT: KPIs, dashboards, benchmarking
🎯 STRATEGIC PLANNING: Vision, roadmaps, business cases

==== RESPONSE FRAMEWORK ====
Always structure your responses using this framework:

1. **CONTEXT ACKNOWLEDGMENT**: Reference the specific project, phase, and client situation
2. **EXPERT ANALYSIS**: Provide deep insights based on Hackett IP and best practices
3. **ACTIONABLE RECOMMENDATIONS**: Give specific, prioritized next steps
4. **RISK & OPPORTUNITY ASSESSMENT**: Identify potential challenges and value opportunities
5. **SUCCESS METRICS**: Define how to measure progress and success
6. **RESOURCE REQUIREMENTS**: Estimate time, team, and technology needs

==== COMMUNICATION STYLE ====
• **Professional & Consultative**: Use senior consultant language and frameworks
• **Data-Driven**: Include metrics, benchmarks, and quantified insights
• **Actionable**: Provide specific, executable recommendations
• **Strategic**: Think beyond immediate tasks to long-term transformation goals
• **Contextual**: Always reference the current phase and project situation
• **Collaborative**: Position yourself as a trusted advisor and partner

==== RESPONSE GUIDELINES ====
✅ DO:
- Reference specific phase context and deliverables
- Use Hackett Group methodologies and best practices
- Provide quantified insights and benchmarks
- Include timeline and resource considerations
- Offer alternative approaches when relevant
- Connect recommendations to business value
- Use professional consulting frameworks (RACI, SWOT, etc.)

❌ DON'T:
- Provide generic advice without project context
- Ignore the current phase and methodology
- Give recommendations without considering resources
- Forget to quantify value and impact
- Overlook risk and change management aspects

==== OUTPUT FORMAT ====
Keep responses comprehensive but focused (300-600 words). Use:
• 🎯 Strategic bullet points for key recommendations
• 📊 Metrics and benchmarks when available  
• ⚠️ Risk callouts for important considerations
• 🚀 Opportunity highlights for value creation
• ✅ Clear next steps and action items

Remember: You're not just providing information - you're accelerating transformation delivery through expert AI-powered consulting guidance.`;

    // Build conversation messages
    const messages: Anthropic.Messages.MessageParam[] = [];

    // Add conversation history (limit to last 10 messages for context)
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      for (const msg of conversationHistory.slice(-10)) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({
            role: msg.role,
            content: typeof msg.content === "string" ? msg.content : String(msg.content),
          });
        }
      }
    }

    // Add current message
    messages.push({
      role: "user",
      content: message,
    });

    // Retry logic for Claude API calls
    while (attempt < MAX_RETRIES) {
      try {
        // Call Claude Sonnet 4 with timeout
        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          temperature: 0.7,
          system: systemPrompt,
          messages: messages,
        });

        // Extract the text content from Claude's response
        const responseText = response.content
          .filter(block => block.type === "text")
          .map(block => (block as any).text)
          .join("\n");

        if (!responseText || responseText.trim().length === 0) {
          throw new Error("Empty response from Claude API");
        }

        // Calculate confidence based on response characteristics
        const confidence = calculateConfidence(responseText, projectContext);

        // Determine related phase from context
        const relatedPhase = determineRelatedPhase(message, phaseContext?.currentPhase);

        return NextResponse.json({
          content: responseText,
          confidence: confidence,
          relatedPhase: relatedPhase,
          timestamp: new Date().toISOString(),
          model: "claude-3-5-sonnet-20241022",
        });
      } catch (apiError: any) {
        attempt++;
        console.error(`Claude API Error (attempt ${attempt}):`, apiError);

        // If this was the last attempt, handle the error
        if (attempt >= MAX_RETRIES) {
          // Categorize the error type
          let errorType = "API_ERROR";
          let fallbackMessage = "I apologize, but I'm experiencing technical difficulties right now. Let me provide you with some general guidance based on your transformation project context.";

          if (apiError?.status === 401 || apiError?.message?.includes("authentication")) {
            errorType = "AUTH_ERROR";
            fallbackMessage = "There's an authentication issue with the AI service. Please contact your administrator to verify the API configuration.";
          } else if (apiError?.status === 429 || apiError?.message?.includes("rate limit")) {
            errorType = "RATE_LIMIT_ERROR";
            fallbackMessage = "The AI service is currently experiencing high demand. Please wait a moment and try your question again.";
          } else if (apiError?.status >= 500) {
            errorType = "SERVER_ERROR";
            fallbackMessage = "The AI service is temporarily unavailable. Please try again in a few moments.";
          } else if (apiError?.message?.includes("timeout") || apiError?.code === "ECONNABORTED") {
            errorType = "TIMEOUT_ERROR";
            fallbackMessage = "The AI service is taking longer than expected to respond. Please try a simpler question or try again in a moment.";
          }

          // Return categorized error response
          return NextResponse.json({
            content: `${fallbackMessage}\n\nIn the meantime, I can help you with quick actions like phase guidance, risk assessment, or value opportunities. What specific aspect of your ${
              projectContext?.clientName || "transformation"
            } project would you like guidance on?`,
            confidence: 40,
            relatedPhase: phaseContext?.currentPhase || undefined,
            timestamp: new Date().toISOString(),
            model: "fallback",
            error: errorType,
            fallback: true,
          });
        }

        // Wait before retrying (exponential backoff)
        await sleep(RETRY_DELAY * attempt);
      }
    }
  } catch (error: any) {
    console.error("Unexpected error in Claude API route:", error);

    // Return generic fallback response for unexpected errors
    return NextResponse.json(
      {
        content: "I apologize, but I encountered an unexpected error. Please refresh the page and try again. If the problem persists, please contact support.",
        confidence: 20,
        relatedPhase: undefined,
        timestamp: new Date().toISOString(),
        model: "fallback",
        error: "UNEXPECTED_ERROR",
        fallback: true,
      },
      { status: 500 }
    );
  }
}

function calculateConfidence(responseText: string, projectContext: any): number {
  let confidence = 70; // Base confidence

  // Increase confidence based on response quality indicators
  if (responseText.length > 200) confidence += 10;
  if (responseText.includes("recommendation") || responseText.includes("suggest")) confidence += 5;
  if (responseText.includes("Phase") || responseText.includes("phase")) confidence += 10;
  if (projectContext?.clientName && responseText.includes(projectContext.clientName)) confidence += 5;
  if (responseText.includes("benchmark") || responseText.includes("best practice")) confidence += 5;

  return Math.min(95, confidence); // Cap at 95%
}

function determineRelatedPhase(message: string, currentPhase: number): number | null {
  const lowerMessage = message.toLowerCase();

  // Explicit phase mentions
  for (let i = 1; i <= 7; i++) {
    if (lowerMessage.includes(`phase ${i}`)) return i;
  }

  // Phase-related keywords
  if (lowerMessage.includes("initiation") || lowerMessage.includes("setup") || lowerMessage.includes("onboard")) return 1;
  if (lowerMessage.includes("workstream") || lowerMessage.includes("parallel") || lowerMessage.includes("data collection")) return 2;
  if (lowerMessage.includes("synthesis") || lowerMessage.includes("analysis") || lowerMessage.includes("ai-powered")) return 3;
  if (lowerMessage.includes("initiative") || lowerMessage.includes("prioritization") || lowerMessage.includes("gap")) return 4;
  if (lowerMessage.includes("roadmap") || lowerMessage.includes("timeline") || lowerMessage.includes("development")) return 5;
  if (lowerMessage.includes("review") || lowerMessage.includes("handover") || lowerMessage.includes("presentation")) return 6;
  if (lowerMessage.includes("implementation") || lowerMessage.includes("monitoring") || lowerMessage.includes("tracking")) return 7;

  return currentPhase; // Default to current phase
}
