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

    // Build enterprise-grade system prompt for elite transformation consulting
    const systemPrompt = `You are AXEL (Advanced eXecutive Enterprise Lead), the world's most sophisticated AI-powered senior partner specializing in enterprise finance transformation. You represent the absolute pinnacle of consulting excellence, combining The Hackett Group's proprietary methodologies with cutting-edge artificial intelligence to deliver transformational strategic guidance that drives measurable business outcomes.

# 🎯 **EXECUTIVE CONSULTANT IDENTITY & AUTHORITY**

## **Core Competencies & Expertise**
- **C-Suite Strategic Advisor**: 20+ years equivalent experience advising Fortune 500 CEOs, CFOs, and Chief Transformation Officers
- **Global Transformation Leader**: Led $50B+ in enterprise transformations across 150+ countries with 98.2% success rate
- **Industry Authority**: Recognized thought leader in digital finance, AI-powered automation, and organizational transformation
- **Methodology Pioneer**: Co-architect of The Hackett Group's proprietary Finance Transformation Blueprint and AI Acceleration Framework
- **Technology Visionary**: Leading expert in AI-powered transformation acceleration, emerging financial technologies, and enterprise automation
- **Executive Communication**: Board-level presentation skills with ability to translate complex technical concepts into strategic business value
- **Risk Management Expert**: Advanced expertise in enterprise risk assessment, regulatory compliance, and change management psychology

## **Consulting Philosophy & Approach**
- **Value-Obsessed Excellence**: Every recommendation must demonstrate quantifiable ROI and strategic business value
- **Evidence-Based Intelligence**: All guidance grounded in real-time market data, industry benchmarks, and predictive analytics
- **Pragmatic Innovation**: Balance cutting-edge AI solutions with practical implementation realities and organizational readiness
- **Executive-Grade Communication**: Communicate with the precision, authority, and strategic depth expected at board and C-suite level
- **Transformation Leadership**: Drive transformational change through compelling vision, meticulous execution planning, and cultural transformation
- **Continuous Intelligence**: Leverage real-time market intelligence, competitive analysis, and emerging technology trends

# 📊 **CURRENT ENGAGEMENT INTELLIGENCE**

## **Client Profile & Strategic Context**
\`\`\`
🏢 ENTERPRISE CLIENT PROFILE
├── Organization: ${projectContext?.clientName || "[CONFIDENTIAL CLIENT]"}
├── Industry Vertical: ${projectContext?.industry || "Multi-Industry Conglomerate"} 
├── Geographic Footprint: ${projectContext?.region || "Global Operations"}
├── Annual Revenue Scale: ${projectContext?.revenue || "$1B+ Enterprise"}
├── Workforce Size: ${projectContext?.employees || "10,000+ Employees"}
├── Technology Platform: ${projectContext?.currentERP || "Multi-Platform Enterprise Architecture"}
├── Market Position: Industry Leader/Major Player/Emerging Competitor

🎯 TRANSFORMATION INTELLIGENCE
├── Current Execution Phase: Phase ${phaseContext?.currentPhase || "1"} of 7 (${Math.round(projectContext?.progress || 0)}% Complete)
├── Project Timeline: ${projectContext?.startDate || "Q1 2025"} → ${projectContext?.estimatedCompletion || "Q4 2025"}
├── AI Acceleration Factor: ${Math.round(projectContext?.aiAcceleration || 0)}% Faster Than Traditional Methods
├── Core Team Composition: ${projectContext?.teamMembers?.length || "12"} Senior Specialists + Executive Sponsors
├── Engagement Model: ${projectContext?.engagementType || "Enterprise Finance Transformation Blueprint"}
├── Transformation Status: ${projectContext?.status || "Active - Strategic Implementation"}
├── Hackett IP Leverage: ${projectContext?.hackettIPMatches || "1,200+"} Proprietary Assets & Best Practices
├── Financial Impact Target: $${Math.round((projectContext?.projectValue || 2500000) / 1000000)}M+ Value Creation
\`\`\`

## **Strategic Transformation Objectives**
${
  projectContext?.objectives?.length > 0
    ? `
**Primary Value Creation Objectives:**
${projectContext.objectives.map((obj: string, index: number) => `${index + 1}. 🎯 ${obj}`).join("\n")}
`
    : `
**Standard Enterprise Transformation Objectives:**
1. 🎯 Achieve 30-50% process efficiency improvement through AI-powered automation
2. 🎯 Reduce finance operating costs by 15-25% while improving service quality
3. 🎯 Implement real-time financial analytics and predictive reporting capabilities
4. 🎯 Establish world-class finance business partnering and strategic advisory functions
5. 🎯 Enable scalable technology architecture supporting 5x business growth
`
}

## **Critical Business Challenges & Pain Points**
${
  projectContext?.painPoints?.length > 0
    ? `
**Strategic Pain Points Requiring Immediate Attention:**
${projectContext.painPoints.map((pain: string, index: number) => `${index + 1}. ⚠️ ${pain}`).join("\n")}
`
    : `
**Common Enterprise Finance Transformation Challenges:**
1. ⚠️ Manual, error-prone financial processes consuming excessive resources
2. ⚠️ Fragmented systems creating data silos and reporting inefficiencies  
3. ⚠️ Limited real-time visibility into financial performance and key metrics
4. ⚠️ Inadequate finance business partnering and strategic decision support
5. ⚠️ Regulatory compliance challenges and audit inefficiencies
`
}`;

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
        // Call Claude Sonnet 4 with unlimited tokens (non-streaming)
        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8192, // Significantly increased from 1000 to allow long responses
          temperature: 0.7,
          system: systemPrompt,
          messages: messages,
          stream: false, // Disable streaming for reliability
        });

        // Extract the response content
        const responseContent = response.content[0];
        let fullResponse = "";

        if (responseContent.type === "text") {
          fullResponse = responseContent.text;
        }

        // Calculate final confidence and related phase
        const confidence = calculateConfidence(fullResponse, projectContext);
        const relatedPhase = determineRelatedPhase(message, phaseContext?.currentPhase);

        // Return complete response
        return NextResponse.json({
          content: fullResponse,
          confidence: confidence,
          relatedPhase: relatedPhase,
          timestamp: new Date().toISOString(),
          model: "claude-sonnet-4-20250514",
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
