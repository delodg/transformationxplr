import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

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
    const { 
      message, 
      conversationHistory, 
      projectContext, 
      phaseContext,
      aiInsights 
    } = await request.json();

    // Validate required inputs
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Valid message is required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not found in environment variables');
      return NextResponse.json(
        { 
          content: "Configuration error: AI service is not properly configured. Please contact your administrator.",
          confidence: 30,
          relatedPhase: phaseContext?.currentPhase || undefined,
          timestamp: new Date().toISOString(),
          model: 'fallback',
          error: 'CONFIG_ERROR',
          fallback: true
        }
      );
    }

    // Build comprehensive system prompt for transformation consulting
    const systemPrompt = `You are an expert AI assistant specializing in finance transformation consulting. You work with The Hackett Group's Transformation XPLR platform, helping consultants deliver world-class finance transformation projects.

CURRENT PROJECT CONTEXT:
- Client: ${projectContext?.clientName || 'N/A'}
- Industry: ${projectContext?.industry || 'N/A'}
- Region: ${projectContext?.region || 'N/A'}
- Current Phase: ${phaseContext?.currentPhase || 'N/A'} of 7
- Project Progress: ${Math.round(projectContext?.progress || 0)}%
- AI Acceleration: ${Math.round(projectContext?.aiAcceleration || 0)}%
- Team Size: ${projectContext?.teamMembers?.length || 'N/A'} members
- Engagement Type: ${projectContext?.engagementType || 'N/A'}

PHASE INFORMATION:
The 7-phase methodology includes:
1. Project Initiation & Setup
2. Parallel Workstream Management  
3. AI-Powered Synthesis & Analysis
4. Initiative Identification & Prioritization
5. Roadmap Development
6. Client Review & Handover
7. Implementation Support

CURRENT AI INSIGHTS AVAILABLE:
${aiInsights?.length || 0} insights have been generated, including:
- ${aiInsights?.filter((i: any) => i.type === 'risk')?.length || 0} risk assessments
- ${aiInsights?.filter((i: any) => i.type === 'opportunity')?.length || 0} value opportunities  
- ${aiInsights?.filter((i: any) => i.type === 'automation')?.length || 0} automation recommendations
- ${aiInsights?.filter((i: any) => i.type === 'benchmark')?.length || 0} benchmark comparisons

YOUR ROLE:
You provide expert guidance on finance transformation, leveraging Hackett Group's intellectual property and best practices. Always:

1. **Be Contextual**: Reference the specific project, phase, and client situation
2. **Be Actionable**: Provide concrete next steps and recommendations
3. **Be Data-Driven**: Reference benchmarks, metrics, and quantified insights
4. **Be Consultative**: Think like a senior transformation consultant
5. **Be Comprehensive**: Consider risks, opportunities, timeline, and resources

RESPONSE GUIDELINES:
- Use professional consulting language
- Include relevant metrics and benchmarks when available
- Provide structured recommendations with priorities
- Reference Hackett IP and best practices
- Consider the current phase context in all advice
- Use emojis sparingly for visual clarity (🎯, 📊, ⚠️, 🚀, etc.)
- Keep responses focused but comprehensive (aim for 200-400 words)

Remember: You're not just an AI assistant, you're a transformation consulting expert helping to accelerate project delivery by up to 50% through intelligent automation and guidance.`;

    // Build conversation messages
    const messages: Anthropic.Messages.MessageParam[] = [];
    
    // Add conversation history (limit to last 10 messages for context)
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      for (const msg of conversationHistory.slice(-10)) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: typeof msg.content === 'string' ? msg.content : String(msg.content)
          });
        }
      }
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    // Retry logic for Claude API calls
    while (attempt < MAX_RETRIES) {
      try {
        // Call Claude Sonnet 4 with timeout
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          temperature: 0.7,
          system: systemPrompt,
          messages: messages
        });

        // Extract the text content from Claude's response
        const responseText = response.content
          .filter((block) => block.type === 'text')
          .map((block) => (block as any).text)
          .join('\n');

        if (!responseText || responseText.trim().length === 0) {
          throw new Error('Empty response from Claude API');
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
          model: 'claude-3-5-sonnet-20241022'
        });

      } catch (apiError: any) {
        attempt++;
        console.error(`Claude API Error (attempt ${attempt}):`, apiError);

        // If this was the last attempt, handle the error
        if (attempt >= MAX_RETRIES) {
          // Categorize the error type
          let errorType = 'API_ERROR';
          let fallbackMessage = "I apologize, but I'm experiencing technical difficulties right now. Let me provide you with some general guidance based on your transformation project context.";

          if (apiError?.status === 401 || apiError?.message?.includes('authentication')) {
            errorType = 'AUTH_ERROR';
            fallbackMessage = "There's an authentication issue with the AI service. Please contact your administrator to verify the API configuration.";
          } else if (apiError?.status === 429 || apiError?.message?.includes('rate limit')) {
            errorType = 'RATE_LIMIT_ERROR';
            fallbackMessage = "The AI service is currently experiencing high demand. Please wait a moment and try your question again.";
          } else if (apiError?.status >= 500) {
            errorType = 'SERVER_ERROR';
            fallbackMessage = "The AI service is temporarily unavailable. Please try again in a few moments.";
          } else if (apiError?.message?.includes('timeout') || apiError?.code === 'ECONNABORTED') {
            errorType = 'TIMEOUT_ERROR';
            fallbackMessage = "The AI service is taking longer than expected to respond. Please try a simpler question or try again in a moment.";
          }

          // Return categorized error response
          return NextResponse.json({
            content: `${fallbackMessage}\n\nIn the meantime, I can help you with quick actions like phase guidance, risk assessment, or value opportunities. What specific aspect of your ${projectContext?.clientName || 'transformation'} project would you like guidance on?`,
            confidence: 40,
            relatedPhase: phaseContext?.currentPhase || undefined,
            timestamp: new Date().toISOString(),
            model: 'fallback',
            error: errorType,
            fallback: true
          });
        }

        // Wait before retrying (exponential backoff)
        await sleep(RETRY_DELAY * attempt);
      }
    }

  } catch (error: any) {
    console.error('Unexpected error in Claude API route:', error);
    
    // Return generic fallback response for unexpected errors
    return NextResponse.json({
      content: "I apologize, but I encountered an unexpected error. Please refresh the page and try again. If the problem persists, please contact support.",
      confidence: 20,
      relatedPhase: undefined,
      timestamp: new Date().toISOString(),
      model: 'fallback',
      error: 'UNEXPECTED_ERROR',
      fallback: true
    }, { status: 500 });
  }
}

function calculateConfidence(responseText: string, projectContext: any): number {
  let confidence = 70; // Base confidence
  
  // Increase confidence based on response quality indicators
  if (responseText.length > 200) confidence += 10;
  if (responseText.includes('recommendation') || responseText.includes('suggest')) confidence += 5;
  if (responseText.includes('Phase') || responseText.includes('phase')) confidence += 10;
  if (projectContext?.clientName && responseText.includes(projectContext.clientName)) confidence += 5;
  if (responseText.includes('benchmark') || responseText.includes('best practice')) confidence += 5;
  
  return Math.min(95, confidence); // Cap at 95%
}

function determineRelatedPhase(message: string, currentPhase: number): number | null {
  const lowerMessage = message.toLowerCase();
  
  // Explicit phase mentions
  for (let i = 1; i <= 7; i++) {
    if (lowerMessage.includes(`phase ${i}`)) return i;
  }
  
  // Phase-related keywords
  if (lowerMessage.includes('initiation') || lowerMessage.includes('setup') || lowerMessage.includes('onboard')) return 1;
  if (lowerMessage.includes('workstream') || lowerMessage.includes('parallel') || lowerMessage.includes('data collection')) return 2;
  if (lowerMessage.includes('synthesis') || lowerMessage.includes('analysis') || lowerMessage.includes('ai-powered')) return 3;
  if (lowerMessage.includes('initiative') || lowerMessage.includes('prioritization') || lowerMessage.includes('gap')) return 4;
  if (lowerMessage.includes('roadmap') || lowerMessage.includes('timeline') || lowerMessage.includes('development')) return 5;
  if (lowerMessage.includes('review') || lowerMessage.includes('handover') || lowerMessage.includes('presentation')) return 6;
  if (lowerMessage.includes('implementation') || lowerMessage.includes('monitoring') || lowerMessage.includes('tracking')) return 7;
  
  return currentPhase; // Default to current phase
} 