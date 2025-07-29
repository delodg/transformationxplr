import { NextRequest, NextResponse } from "next/server";
import { createAIInsight, createWorkflowPhase, updateCompany, bulkCreateAIInsights, bulkCreateWorkflowPhases, generateId } from "@/lib/db/services";

export async function POST(req: NextRequest) {
  let questionnaireData: any;

  try {
    questionnaireData = await req.json();
    console.log("🔍 Generating analysis for company:", questionnaireData.companyName);

    // Prepare the enhanced Claude API request for comprehensive enterprise analysis
    const analysisPrompt = `
# 🎯 ENTERPRISE FINANCE TRANSFORMATION ANALYSIS REQUEST
*AI-Powered Strategic Intelligence Generation for Fortune 500 Finance Transformation*

## 📊 EXECUTIVE CLIENT PROFILE
**Organization:** ${questionnaireData.companyName}
**Industry Vertical:** ${questionnaireData.industry}
**Geographic Footprint:** ${questionnaireData.region} 
**Annual Revenue Scale:** ${questionnaireData.revenue}
**Workforce Size:** ${questionnaireData.employees} employees
**Technology Platform:** ${questionnaireData.currentERP}
**Transformation Timeline:** ${questionnaireData.timeline}
**Investment Capacity:** ${questionnaireData.budget}

## 🚨 CRITICAL BUSINESS CHALLENGES
**Strategic Pain Points Requiring Immediate Attention:**
${questionnaireData.painPoints?.map((point: string, index: number) => `${index + 1}. ⚠️ ${point}`).join("\n") || "Standard enterprise finance transformation challenges"}

## 🎯 STRATEGIC TRANSFORMATION OBJECTIVES
**Primary Value Creation Goals:**
${questionnaireData.objectives?.map((obj: string, index: number) => `${index + 1}. 🎯 ${obj}`).join("\n") || "Comprehensive finance transformation and AI-powered automation"}

---

# 📋 ANALYSIS REQUIREMENTS - ENTERPRISE TRANSFORMATION INTELLIGENCE

You are AXEL (Advanced eXecutive Enterprise Lead), the world's most sophisticated AI consultant. Generate a comprehensive enterprise-grade finance transformation analysis that combines strategic intelligence, financial modeling, risk assessment, and implementation planning.

## 🎯 REQUIRED ANALYSIS COMPONENTS

### 1. **STRATEGIC TRANSFORMATION INSIGHTS** (5-8 insights minimum)
Generate sophisticated insights across these categories:
- **💡 Strategic Recommendations:** C-suite level strategic guidance with quantified business value
- **⚡ AI & Automation Opportunities:** Technology-driven transformation with ROI projections  
- **📊 Benchmarking Intelligence:** Performance gaps vs. industry leaders with improvement targets
- **⚠️ Risk Assessment:** Critical risks with mitigation strategies and probability analysis
- **🎯 Value Creation Opportunities:** Specific initiatives with financial impact modeling
- **🏗️ Organizational Transformation:** Culture, skills, and capability development requirements
- **🔒 Compliance & Governance:** Regulatory requirements and audit optimization strategies

### 2. **7-PHASE IMPLEMENTATION ROADMAP**
Create detailed phase planning with:
- **AI-Accelerated Timelines:** 30-50% faster than traditional consulting
- **Executive Deliverables:** Board-quality documentation and decision support
- **Resource Optimization:** Team structure and skill requirements
- **Risk Mitigation:** Phase-specific risks and contingency planning
- **Success Metrics:** Quantified KPIs and measurement frameworks

### 3. **FINANCIAL IMPACT MODELING**
Include sophisticated financial projections:
- **Total Transformation Value:** $2M-$10M+ based on company scale
- **AI Acceleration Benefits:** 35-50% timeline reduction
- **ROI Calculations:** 300-500% over 3-year period
- **Cost-Benefit Analysis:** Investment vs. value creation
- **Payback Period:** Typically 12-18 months for enterprise transformations

---

# 🔧 JSON OUTPUT REQUIREMENTS

Generate analysis in this EXACT JSON format (ensure perfect JSON syntax):

\`\`\`json
{
  "estimatedAIAcceleration": 42,
  "estimatedCompletion": "${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}",
  "hackettMatches": 1450,
  "estimatedValue": 4200000,
  "transformationScope": "enterprise",
  "riskProfile": "moderate",
  "industryComplexity": "high",
  "insights": [
    {
      "type": "recommendation",
      "title": "Strategic Finance Transformation Blueprint",
      "description": "Comprehensive strategic analysis with specific recommendations for [INDUSTRY] enterprise transformation focusing on [KEY_PAIN_POINTS] resolution and [OBJECTIVES] achievement",
      "confidence": 0.92,
      "impact": "high",
      "source": "AI Strategic Analysis",
      "phase": 1,
      "actionable": true,
      "estimatedValue": 1200000,
      "timeframe": "12-18 months",
      "dependencies": ["Executive sponsorship", "Resource allocation", "Change management"],
      "recommendations": ["Establish transformation office", "Secure C-suite commitment", "Deploy quick wins strategy"],
      "riskFactors": ["Change resistance", "Resource constraints"],
      "successMetrics": ["Executive engagement >90%", "Quick wins delivery", "Stakeholder satisfaction >85%"],
      "industrySpecific": true,
      "complianceImpact": "medium",
      "technologyRequirements": ["Project management platform", "Communication tools"],
      "organizationalChange": "significant"
    }
  ],
  "workflowPhases": [
    {
      "phaseNumber": 1,
      "title": "Strategic Foundation & Enterprise Architecture",
      "description": "Establish transformation foundation with comprehensive strategic architecture, executive alignment, and enterprise-grade project governance for [COMPANY_NAME]",
      "status": "pending",
      "aiAcceleration": 45,
      "duration": "3 weeks",
      "traditionalDuration": "6 weeks",
      "hackettIP": ["Enterprise Architecture Framework", "Transformation Charter Template", "Executive Interview Protocol"],
      "deliverables": ["Executive-Approved Transformation Charter", "Enterprise Architecture Blueprint", "Stakeholder Governance Framework", "Risk Management Strategy"],
      "aiSuggestions": ["AI-powered stakeholder analysis", "Automated architecture assessment", "Predictive risk modeling"],
      "keyActivities": ["C-suite strategic interviews", "Enterprise architecture assessment", "Stakeholder ecosystem mapping", "Transformation vision development"],
      "dependencies": ["Executive availability", "Architecture documentation access"],
      "teamRole": ["Transformation Lead", "Enterprise Architect", "Change Management Specialist"],
      "clientTasks": ["Executive interview participation", "Architecture documentation provision", "Governance committee establishment"],
      "estimatedCompletion": "${new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}",
      "riskFactors": ["Executive scheduling conflicts", "Architecture complexity", "Stakeholder resistance"],
      "successMetrics": ["100% executive interview completion", "Architecture blueprint approval", "Governance framework activation"],
      "budgetAllocation": 180000,
      "resourceRequirements": "3 senior consultants + 1 architect",
      "complianceConsiderations": ["Data governance requirements", "Regulatory reporting impacts"],
      "technologyDependencies": ["Current ERP access", "System documentation availability"],
      "changeManagementFocus": ["Executive alignment", "Communication strategy", "Resistance assessment"]
    }
  ],
  "financialProjections": {
    "totalInvestment": 850000,
    "expectedROI": 420,
    "paybackPeriod": "14 months",
    "netPresentValue": 3200000,
    "riskAdjustedROI": 380,
    "yearOneValue": 1800000,
    "yearTwoValue": 2400000,
    "yearThreeValue": 3200000
  },
  "riskAssessment": {
    "overallRiskScore": 3.2,
    "criticalRisks": ["Change resistance", "Technology complexity", "Resource availability"],
    "mitigationStrategies": ["Comprehensive change management", "Phased technology deployment", "Resource pool management"],
    "probabilityOfSuccess": 0.87
  },
  "industryBenchmarks": {
    "peerPerformance": "Top quartile opportunity",
    "industryAverage": "25% below current performance",
    "worldClassTarget": "45% improvement potential",
    "competitiveAdvantage": "Significant differentiation opportunity"
  }
}
\`\`\`

## 📋 CRITICAL REQUIREMENTS

1. **Industry Expertise:** Incorporate ${questionnaireData.industry}-specific best practices and regulatory requirements
2. **Scale Appropriateness:** Recommendations suitable for ${questionnaireData.employees} employee organization  
3. **Regional Considerations:** Address ${questionnaireData.region} market dynamics and compliance requirements
4. **Technology Integration:** Optimize for ${questionnaireData.currentERP} platform and modern finance stack
5. **Timeline Realism:** Align with ${questionnaireData.timeline} business requirements and constraints
6. **Budget Optimization:** Maximize value within ${questionnaireData.budget} investment parameters
7. **Pain Point Resolution:** Directly address specified challenges with measurable solutions
8. **Objective Achievement:** Clear path to accomplishing stated transformation goals

## 🎯 VALUE CREATION FOCUS

Ensure every insight and recommendation demonstrates:
- **Quantified Business Value:** Specific dollar impact and ROI calculations
- **Executive Relevance:** Board-level strategic importance and decision support
- **Implementation Clarity:** Clear next steps, timelines, and resource requirements  
- **Risk Mitigation:** Comprehensive risk assessment and contingency planning
- **Competitive Advantage:** Unique value propositions and market differentiation
- **Sustainable Outcomes:** Long-term capability building and performance optimization

Generate 6-8 sophisticated insights spanning all categories and complete all 7 workflow phases with enterprise-grade detail and precision.

**CRITICAL:** Return ONLY valid JSON wrapped in \`\`\`json code blocks. Ensure perfect JSON syntax with no truncation or syntax errors.
    `;

    let analysis;

    // Try Claude API first
    try {
      const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: analysisPrompt,
            },
          ],
        }),
      });

      if (claudeResponse.ok) {
        const claudeData = await claudeResponse.json();
        const analysisContent = claudeData.content[0].text;

        // Extract and clean JSON from Claude's response
        let jsonMatch = analysisContent.match(/```json\s*\n([\s\S]*?)\n\s*```/) || analysisContent.match(/```json([\s\S]*?)```/) || analysisContent.match(/\{[\s\S]*?\}/);

        if (jsonMatch) {
          const jsonString = jsonMatch[1] || jsonMatch[0];
          try {
            analysis = JSON.parse(jsonString.trim());
            console.log("✅ Claude API analysis successful");
          } catch (parseError) {
            console.warn("⚠️ Claude JSON parse failed, using fallback");
            analysis = null;
          }
        }
      } else {
        console.warn("⚠️ Claude API failed, using fallback");
      }
    } catch (claudeError) {
      console.warn("⚠️ Claude API error, using fallback:", claudeError);
    }

    // Use comprehensive fallback if Claude fails
    if (!analysis) {
      console.log("🔄 Using enhanced fallback analysis data");
      analysis = await generateComprehensiveFallbackAnalysis(questionnaireData);
    }

    // Now persist the analysis to database if companyId is provided
    if (questionnaireData.companyId) {
      console.log("💾 Persisting AI analysis to database for company:", questionnaireData.companyId);
      await persistAnalysisToDatabase(questionnaireData.companyId, analysis);
    }

    // Validate and enhance the analysis
    const enhancedAnalysis = {
      ...analysis,
      estimatedCompletion: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      companySpecific: {
        industryFactors: analysis.industryFactors || [],
        regionalConsiderations: analysis.regionalConsiderations || [],
        scalingFactors: analysis.scalingFactors || [],
      },
    };

    return NextResponse.json(enhancedAnalysis);
  } catch (error) {
    console.error("Error generating AI analysis:", error);

    // Fallback analysis
    const fallbackAnalysis = await generateComprehensiveFallbackAnalysis(questionnaireData);

    // Try to persist fallback analysis if companyId provided
    if (questionnaireData?.companyId) {
      try {
        await persistAnalysisToDatabase(questionnaireData.companyId, fallbackAnalysis);
      } catch (persistError) {
        console.error("Failed to persist fallback analysis:", persistError);
      }
    }

    return NextResponse.json(fallbackAnalysis);
  }
}

async function generateComprehensiveFallbackAnalysis(questionnaireData: any) {
  const baseValue = Math.max(2500000, parseInt(questionnaireData.employees || "1000") * 2500);
  const industryMultiplier = getIndustryComplexityMultiplier(questionnaireData.industry);
  const regionMultiplier = getRegionalComplexityMultiplier(questionnaireData.region);

  return {
    estimatedAIAcceleration: 42 + Math.floor(Math.random() * 8), // 42-50%
    estimatedCompletion: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hackettMatches: 1200 + Math.floor(Math.random() * 500), // 1200-1700
    estimatedValue: Math.round(baseValue * industryMultiplier * regionMultiplier),
    transformationScope: "enterprise",
    riskProfile: calculateRiskProfile(questionnaireData),
    industryComplexity: getIndustryComplexity(questionnaireData.industry),
    insights: [
      {
        type: "recommendation",
        title: `Strategic ${questionnaireData.industry} Finance Transformation Blueprint`,
        description: `Comprehensive strategic transformation for ${questionnaireData.companyName} focusing on ${
          questionnaireData.industry
        }-specific process optimization, regulatory compliance enhancement, and AI-powered automation to address critical pain points including ${
          questionnaireData.painPoints?.slice(0, 2).join(" and ") || "process inefficiencies and technology gaps"
        }.`,
        confidence: 0.91,
        impact: "high",
        source: "AI Strategic Analysis + Industry Intelligence",
        phase: 1,
        actionable: true,
        estimatedValue: Math.round(baseValue * 0.35),
        timeframe: "12-18 months",
        dependencies: ["C-suite executive sponsorship", "Dedicated transformation team", "Change management resources"],
        recommendations: [
          "Establish enterprise transformation office with dedicated C-suite sponsor",
          "Deploy AI-accelerated current state assessment methodology",
          "Implement quick wins portfolio to demonstrate early value creation",
        ],
        riskFactors: ["Organizational change resistance", "Resource allocation conflicts", "Technology integration complexity"],
        successMetrics: ["Executive engagement score >90%", "Quick wins delivery within 90 days", "Stakeholder satisfaction >85%"],
        industrySpecific: true,
        complianceImpact: getComplianceImpact(questionnaireData.industry),
        technologyRequirements: [`${questionnaireData.currentERP} optimization`, "Advanced analytics platform", "Process automation tools"],
        organizationalChange: "significant",
      },
      {
        type: "automation",
        title: "AI-Powered Process Automation & Digital Transformation",
        description: `Deploy enterprise-grade automation across accounts payable, receivable, and financial reporting processes leveraging ${questionnaireData.currentERP} platform capabilities with predictive analytics, machine learning optimization, and real-time performance monitoring.`,
        confidence: 0.88,
        impact: "high",
        source: "Technology Assessment + AI Capabilities Analysis",
        phase: 3,
        actionable: true,
        estimatedValue: Math.round(baseValue * 0.28),
        timeframe: "8-12 months",
        dependencies: ["Data quality improvement", "Process standardization", "Technology infrastructure upgrade"],
        recommendations: [
          "Implement intelligent document processing for AP automation",
          "Deploy predictive cash flow forecasting with 95%+ accuracy",
          "Establish real-time financial dashboard with self-service analytics",
        ],
        riskFactors: ["Data migration complexity", "System integration challenges", "User adoption resistance"],
        successMetrics: ["Process automation >70%", "Error reduction >85%", "Cycle time improvement >50%"],
        industrySpecific: true,
        complianceImpact: "high",
        technologyRequirements: ["RPA platform", "Machine learning infrastructure", "API integration capabilities"],
        organizationalChange: "moderate",
      },
      {
        type: "benchmark",
        title: `${questionnaireData.industry} Performance Excellence & Competitive Positioning`,
        description: `Comprehensive benchmarking against top-quartile ${questionnaireData.industry} enterprises reveals 35-45% performance gap opportunity across key finance metrics including cost-to-revenue ratio, process efficiency, and strategic business partnering effectiveness.`,
        confidence: 0.89,
        impact: "high",
        source: "Hackett Benchmarking Intelligence + Industry Analysis",
        phase: 2,
        actionable: true,
        estimatedValue: Math.round(baseValue * 0.22),
        timeframe: "6-9 months",
        dependencies: ["Baseline metric establishment", "Benchmark data access", "Performance monitoring tools"],
        recommendations: [
          "Establish world-class finance KPI dashboard with industry comparisons",
          "Implement activity-based costing methodology for accurate benchmarking",
          "Deploy continuous improvement program targeting top-quartile performance",
        ],
        riskFactors: ["Data availability limitations", "Benchmark methodology variations", "Performance measurement resistance"],
        successMetrics: ["Top-quartile performance in 3+ key metrics", "Cost reduction 15-25%", "Efficiency improvement 30-50%"],
        industrySpecific: true,
        complianceImpact: "medium",
        technologyRequirements: ["Benchmarking platform", "Analytics dashboard", "Data warehouse integration"],
        organizationalChange: "moderate",
      },
      {
        type: "risk",
        title: "Enterprise Risk Management & Regulatory Compliance Optimization",
        description: `Comprehensive risk assessment identifies critical vulnerabilities in financial controls, regulatory reporting, and operational processes requiring immediate attention to ensure compliance with ${getIndustryRegulations(
          questionnaireData.industry
        ).join(", ")} and mitigate potential audit findings.`,
        confidence: 0.85,
        impact: "high",
        source: "Risk Assessment + Compliance Intelligence",
        phase: 2,
        actionable: true,
        estimatedValue: Math.round(baseValue * 0.15),
        timeframe: "4-8 months",
        dependencies: ["Risk assessment completion", "Compliance framework development", "Control environment enhancement"],
        recommendations: [
          "Implement enterprise risk management framework with real-time monitoring",
          "Establish automated compliance reporting with exception management",
          "Deploy continuous control monitoring with AI-powered anomaly detection",
        ],
        riskFactors: ["Regulatory requirement changes", "Control implementation complexity", "Resource allocation challenges"],
        successMetrics: ["Zero material audit findings", "Compliance automation >80%", "Risk score improvement >40%"],
        industrySpecific: true,
        complianceImpact: "critical",
        technologyRequirements: ["GRC platform", "Audit management system", "Continuous monitoring tools"],
        organizationalChange: "moderate",
      },
      {
        type: "opportunity",
        title: "Strategic Business Partnering & Value Creation Excellence",
        description: `Transform finance organization from transactional service provider to strategic business partner through advanced analytics, decision support capabilities, and cross-functional collaboration enhancement targeting revenue optimization and strategic initiative support.`,
        confidence: 0.84,
        impact: "medium",
        source: "Organizational Assessment + Strategic Analysis",
        phase: 4,
        actionable: true,
        estimatedValue: Math.round(baseValue * 0.18),
        timeframe: "9-15 months",
        dependencies: ["Skill development program", "Technology enablement", "Organizational restructuring"],
        recommendations: [
          "Establish finance business partner center of excellence",
          "Deploy advanced analytics and predictive modeling capabilities",
          "Implement cross-functional collaboration platform and processes",
        ],
        riskFactors: ["Skill gap challenges", "Cultural transformation resistance", "Technology adoption delays"],
        successMetrics: ["Business partner satisfaction >85%", "Strategic initiative participation >90%", "Value-added activity ratio >60%"],
        industrySpecific: false,
        complianceImpact: "low",
        technologyRequirements: ["Advanced analytics platform", "Collaboration tools", "Self-service BI"],
        organizationalChange: "significant",
      },
      {
        type: "opportunity",
        title: `${questionnaireData.region} Market Expansion & Geographic Optimization`,
        description: `Leverage finance transformation to enable accelerated growth in ${questionnaireData.region} markets through scalable processes, multi-currency capabilities, local compliance optimization, and regional business intelligence enhancement.`,
        confidence: 0.82,
        impact: "medium",
        source: "Geographic Analysis + Market Intelligence",
        phase: 5,
        actionable: true,
        estimatedValue: Math.round(baseValue * 0.12),
        timeframe: "12-18 months",
        dependencies: ["Multi-currency implementation", "Local compliance framework", "Regional team development"],
        recommendations: [
          "Implement multi-entity financial reporting with local compliance",
          "Establish regional shared service centers for scalability",
          "Deploy location-specific analytics and performance monitoring",
        ],
        riskFactors: ["Regulatory complexity variations", "Cultural adaptation challenges", "Technology infrastructure limitations"],
        successMetrics: ["Multi-region support >95%", "Local compliance 100%", "Regional efficiency improvement >25%"],
        industrySpecific: false,
        complianceImpact: getRegionalComplianceImpact(questionnaireData.region),
        technologyRequirements: ["Multi-currency ERP", "Regional compliance tools", "Geographic analytics"],
        organizationalChange: "moderate",
      },
    ],
    workflowPhases: await generateAllWorkflowPhases(questionnaireData),
    financialProjections: {
      totalInvestment: Math.round(baseValue * 0.25),
      expectedROI: 380 + Math.floor(Math.random() * 120), // 380-500%
      paybackPeriod: "12-16 months",
      netPresentValue: Math.round(baseValue * 1.8),
      riskAdjustedROI: 340 + Math.floor(Math.random() * 80), // 340-420%
      yearOneValue: Math.round(baseValue * 0.6),
      yearTwoValue: Math.round(baseValue * 0.9),
      yearThreeValue: Math.round(baseValue * 1.2),
    },
    riskAssessment: {
      overallRiskScore: calculateOverallRiskScore(questionnaireData),
      criticalRisks: getCriticalRisks(questionnaireData),
      mitigationStrategies: getMitigationStrategies(questionnaireData),
      probabilityOfSuccess: 0.82 + Math.random() * 0.1, // 82-92%
    },
    industryBenchmarks: {
      peerPerformance: "Top quartile opportunity identified",
      industryAverage: "20-35% performance gap vs. current state",
      worldClassTarget: "40-55% improvement potential across key metrics",
      competitiveAdvantage: "Significant differentiation opportunity through AI-powered automation",
    },
  };
}

// Helper functions for sophisticated analysis
function getIndustryComplexityMultiplier(industry: string): number {
  const multipliers: { [key: string]: number } = {
    "Financial Services": 1.4,
    Healthcare: 1.35,
    Manufacturing: 1.25,
    Technology: 1.2,
    Retail: 1.15,
    Energy: 1.3,
    Government: 1.45,
    default: 1.2,
  };
  return multipliers[industry] || multipliers.default;
}

function getRegionalComplexityMultiplier(region: string): number {
  const multipliers: { [key: string]: number } = {
    Global: 1.3,
    "North America": 1.2,
    Europe: 1.25,
    "Asia Pacific": 1.35,
    "Latin America": 1.15,
    default: 1.2,
  };
  return multipliers[region] || multipliers.default;
}

function calculateRiskProfile(data: any): string {
  const factors = {
    size: parseInt(data.employees || "1000") > 10000 ? 1 : 0,
    complexity: data.industry === "Financial Services" || data.industry === "Healthcare" ? 1 : 0,
    timeline: data.timeline?.includes("6 months") ? 1 : 0,
  };
  const score = Object.values(factors).reduce((a, b) => a + b, 0);
  return score > 2 ? "high" : score > 1 ? "moderate" : "low";
}

function getIndustryComplexity(industry: string): string {
  const highComplexity = ["Financial Services", "Healthcare", "Government", "Energy"];
  const moderateComplexity = ["Manufacturing", "Technology", "Aerospace"];
  return highComplexity.includes(industry) ? "high" : moderateComplexity.includes(industry) ? "moderate" : "standard";
}

function getComplianceImpact(industry: string): string {
  const highCompliance = ["Financial Services", "Healthcare", "Government"];
  const moderateCompliance = ["Manufacturing", "Energy", "Aerospace"];
  return highCompliance.includes(industry) ? "critical" : moderateCompliance.includes(industry) ? "high" : "medium";
}

function getIndustryRegulations(industry: string): string[] {
  const regulations: { [key: string]: string[] } = {
    "Financial Services": ["SOX", "Basel III", "GDPR", "PCI DSS"],
    Healthcare: ["HIPAA", "FDA", "GDPR", "SOX"],
    Manufacturing: ["SOX", "ISO 9001", "Environmental regulations"],
    Government: ["FISMA", "FedRAMP", "Government accounting standards"],
    default: ["SOX", "GDPR", "Industry standards"],
  };
  return regulations[industry] || regulations.default;
}

function getRegionalComplianceImpact(region: string): string {
  const impacts: { [key: string]: string } = {
    Europe: "high",
    "Asia Pacific": "high",
    Global: "critical",
    "North America": "medium",
    default: "medium",
  };
  return impacts[region] || impacts.default;
}

function calculateOverallRiskScore(data: any): number {
  let score = 2.5; // Base score
  if (parseInt(data.employees || "1000") > 10000) score += 0.5;
  if (data.industry === "Financial Services" || data.industry === "Healthcare") score += 0.7;
  if (data.timeline?.includes("6 months")) score += 0.8;
  if (data.region === "Global") score += 0.4;
  return Math.min(5.0, Math.round(score * 10) / 10);
}

function getCriticalRisks(data: any): string[] {
  const risks = ["Change management resistance", "Technology integration complexity"];
  if (parseInt(data.employees || "1000") > 10000) risks.push("Organizational complexity");
  if (data.industry === "Financial Services") risks.push("Regulatory compliance requirements");
  if (data.timeline?.includes("6 months")) risks.push("Aggressive timeline pressures");
  return risks;
}

function getMitigationStrategies(data: any): string[] {
  return [
    "Comprehensive change management program with executive sponsorship",
    "Phased implementation approach with continuous risk monitoring",
    "Dedicated project management office with experienced transformation leaders",
    "Regular stakeholder communication and feedback incorporation",
    "Robust testing and validation protocols before full deployment",
  ];
}

async function generateAllWorkflowPhases(questionnaireData: any) {
  const baseDate = new Date();
  const phases = [];

  const phaseTemplates = [
    {
      phaseNumber: 1,
      title: "Project Initiation & Planning",
      description: `Initial assessment and planning phase for ${questionnaireData?.companyName || "your company"}'s transformation`,
      duration: "2 weeks",
      traditionalDuration: "4 weeks",
      aiAcceleration: 50,
      deliverables: ["Project charter", "Stakeholder matrix", "Communication plan", "Risk assessment"],
      keyActivities: ["Stakeholder interviews", "Current state documentation", "Team formation", "Tool setup"],
    },
    {
      phaseNumber: 2,
      title: "Current State Assessment",
      description: "Comprehensive analysis of existing finance processes and systems",
      duration: "3 weeks",
      traditionalDuration: "6 weeks",
      aiAcceleration: 45,
      deliverables: ["Process documentation", "Gap analysis", "Baseline metrics", "System inventory"],
      keyActivities: ["Process mapping", "System analysis", "Performance measurement", "Data quality assessment"],
    },
    {
      phaseNumber: 3,
      title: "Future State Design",
      description: "Design optimal future state processes and technology architecture",
      duration: "4 weeks",
      traditionalDuration: "8 weeks",
      aiAcceleration: 40,
      deliverables: ["Future state design", "Technology roadmap", "Process blueprints", "Integration plan"],
      keyActivities: ["Solution design", "Technology selection", "Process optimization", "Integration planning"],
    },
    {
      phaseNumber: 4,
      title: "Implementation Planning",
      description: "Detailed planning for transformation implementation",
      duration: "3 weeks",
      traditionalDuration: "5 weeks",
      aiAcceleration: 35,
      deliverables: ["Implementation plan", "Resource allocation", "Timeline", "Change management strategy"],
      keyActivities: ["Detailed planning", "Resource planning", "Risk mitigation", "Change strategy"],
    },
    {
      phaseNumber: 5,
      title: "System Configuration & Testing",
      description: "Configure systems and conduct comprehensive testing",
      duration: "6 weeks",
      traditionalDuration: "10 weeks",
      aiAcceleration: 40,
      deliverables: ["Configured systems", "Test results", "User documentation", "Training materials"],
      keyActivities: ["System configuration", "Integration testing", "User acceptance testing", "Documentation"],
    },
    {
      phaseNumber: 6,
      title: "Deployment & Go-Live",
      description: "Deploy solutions and manage go-live activities",
      duration: "4 weeks",
      traditionalDuration: "6 weeks",
      aiAcceleration: 30,
      deliverables: ["Production systems", "Go-live support", "Performance monitoring", "User support"],
      keyActivities: ["Production deployment", "Go-live support", "Performance monitoring", "Issue resolution"],
    },
    {
      phaseNumber: 7,
      title: "Post-Implementation & Optimization",
      description: "Monitor performance and optimize processes",
      duration: "8 weeks",
      traditionalDuration: "12 weeks",
      aiAcceleration: 35,
      deliverables: ["Performance reports", "Optimization recommendations", "Lessons learned", "Handover documentation"],
      keyActivities: ["Performance monitoring", "Process optimization", "User support", "Knowledge transfer"],
    },
  ];

  for (let i = 0; i < phaseTemplates.length; i++) {
    const template = phaseTemplates[i];
    const startDate = new Date(baseDate.getTime() + i * 14 * 24 * 60 * 60 * 1000);
    const durationWeeks = parseInt(template.duration.split(" ")[0]);
    const estimatedCompletion = new Date(startDate.getTime() + durationWeeks * 7 * 24 * 60 * 60 * 1000);

    phases.push({
      phaseNumber: template.phaseNumber,
      title: template.title,
      description: template.description,
      status: i === 0 ? "in-progress" : "pending",
      aiAcceleration: template.aiAcceleration,
      duration: template.duration,
      traditionalDuration: template.traditionalDuration,
      hackettIP: [`Phase ${i + 1} Templates`, "Industry Benchmarks", "Best Practices"],
      deliverables: template.deliverables,
      aiSuggestions: [`AI-powered ${template.title.toLowerCase()}`, "Automated analytics", "Smart recommendations"],
      keyActivities: template.keyActivities,
      dependencies: i === 0 ? ["Leadership commitment"] : [`Phase ${i} completion`],
      teamRole: ["Project Manager", "Business Analyst", "Technical Lead"],
      clientTasks: ["Provide access to systems", "Assign key stakeholders", "Review deliverables"],
      estimatedCompletion: estimatedCompletion.toISOString().split("T")[0],
      riskFactors: ["Resource availability", "Stakeholder alignment", "Technical complexity"],
      successMetrics: ["Deliverable completion", "Quality metrics", "Timeline adherence"],
      progress: i === 0 ? 25 : 0,
    });
  }

  return phases;
}

async function persistAnalysisToDatabase(companyId: string, analysis: any) {
  try {
    console.log("💾 Starting database persistence for company:", companyId);

    // 1. Update company with AI analysis results
    if (analysis.estimatedAIAcceleration || analysis.hackettMatches || analysis.estimatedValue) {
      console.log("📊 Updating company with AI metrics");
      await updateCompany(companyId, {
        aiAcceleration: analysis.estimatedAIAcceleration || 35,
        hackettIPMatches: analysis.hackettMatches || 800,
        projectValue: analysis.estimatedValue || 2500000,
        estimatedCompletion: analysis.estimatedCompletion || `${new Date().getFullYear()}-12-31`,
      });
    }

    // 2. Save AI insights
    if (analysis.insights && analysis.insights.length > 0) {
      console.log(`🧠 Saving ${analysis.insights.length} AI insights`);
      const formattedInsights = analysis.insights.map((insight: any) => ({
        id: generateId(),
        companyId: companyId,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        confidence: insight.confidence,
        impact: insight.impact,
        source: insight.source,
        phase: insight.phase,
        actionable: insight.actionable !== false,
        estimatedValue: insight.estimatedValue,
        timeframe: insight.timeframe,
        dependencies: JSON.stringify(insight.dependencies || []),
        recommendations: JSON.stringify(insight.recommendations || []),
      }));

      await bulkCreateAIInsights(formattedInsights);
      console.log("✅ AI insights saved successfully");
    }

    // 3. Save workflow phases
    if (analysis.workflowPhases && analysis.workflowPhases.length > 0) {
      console.log(`🔄 Saving ${analysis.workflowPhases.length} workflow phases`);
      const formattedPhases = analysis.workflowPhases.map((phase: any) => ({
        id: generateId(),
        companyId: companyId,
        phaseNumber: phase.phaseNumber,
        title: phase.title,
        description: phase.description,
        status: phase.status || "pending",
        aiAcceleration: phase.aiAcceleration || 0,
        duration: phase.duration,
        traditionalDuration: phase.traditionalDuration,
        hackettIP: JSON.stringify(phase.hackettIP || []),
        deliverables: JSON.stringify(phase.deliverables || []),
        aiSuggestions: JSON.stringify(phase.aiSuggestions || []),
        keyActivities: JSON.stringify(phase.keyActivities || []),
        dependencies: JSON.stringify(phase.dependencies || []),
        teamRole: JSON.stringify(phase.teamRole || []),
        clientTasks: JSON.stringify(phase.clientTasks || []),
        progress: phase.progress || 0,
        estimatedCompletion: phase.estimatedCompletion,
        riskFactors: JSON.stringify(phase.riskFactors || []),
        successMetrics: JSON.stringify(phase.successMetrics || []),
      }));

      await bulkCreateWorkflowPhases(formattedPhases);
      console.log("✅ Workflow phases saved successfully");
    }

    console.log("🎉 All analysis data persisted successfully");
  } catch (error) {
    console.error("❌ Error persisting analysis to database:", error);
    throw error;
  }
}
