import { NextRequest, NextResponse } from "next/server";

// This would typically come from a database, but using the same comprehensive data
const HACKETT_IP_ASSETS = [
  // Phase 1: Project Initiation & Setup Assets
  {
    id: "phase1-001",
    title: "Finance Transformation Project Charter Template",
    description: "Comprehensive project charter template with stakeholder matrix, success criteria, and governance framework",
    category: "Implementation Accelerators",
    subcategory: "Templates & Tools",
    type: "template",
    relevanceScore: 98,
    industry: ["All Industries"],
    phase: [1],
    tags: ["project-charter", "governance", "stakeholder-management", "phase1"],
    estimatedTimeToValue: "1 week",
    complexity: "low",
    lastUpdated: "2025-01-20",
    previewAvailable: true,
  },
  {
    id: "phase1-002",
    title: "Client Intelligence Gathering Framework",
    description: "AI-powered client profiling framework with industry benchmarks and competitive analysis templates",
    category: "Benchmarking & Analytics",
    subcategory: "Industry Benchmarks",
    type: "framework",
    relevanceScore: 95,
    industry: ["All Industries"],
    phase: [1],
    tags: ["client-profiling", "competitive-analysis", "industry-benchmarks", "phase1"],
    estimatedTimeToValue: "2 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-18",
    previewAvailable: true,
  },
  {
    id: "phase1-003",
    title: "Stakeholder Engagement Playbook",
    description: "Comprehensive guide for engaging finance stakeholders with communication templates and meeting frameworks",
    category: "Finance Transformation",
    subcategory: "Organization & Talent",
    type: "methodology",
    relevanceScore: 92,
    industry: ["All Industries"],
    phase: [1],
    tags: ["stakeholder-engagement", "communication", "change-management", "phase1"],
    estimatedTimeToValue: "1 week",
    complexity: "low",
    lastUpdated: "2025-01-15",
    previewAvailable: true,
  },

  // Phase 2: Parallel Workstream Management Assets
  {
    id: "phase2-001",
    title: "Executive Interview Guide & Templates",
    description: "Structured interview guides for C-suite executives with question banks and analysis frameworks",
    category: "Implementation Accelerators",
    subcategory: "Templates & Tools",
    type: "template",
    relevanceScore: 96,
    industry: ["All Industries"],
    phase: [2],
    tags: ["executive-interviews", "data-collection", "stakeholder-surveys", "phase2"],
    estimatedTimeToValue: "1 week",
    complexity: "medium",
    lastUpdated: "2025-01-22",
    previewAvailable: true,
  },
  {
    id: "phase2-002",
    title: "Dynamic Stakeholder Survey Platform",
    description: "AI-powered survey platform that adapts questions based on previous responses and generates insights",
    category: "Finance Transformation",
    subcategory: "Technology & Systems",
    type: "tool",
    relevanceScore: 94,
    industry: ["All Industries"],
    phase: [2],
    tags: ["stakeholder-surveys", "AI", "dynamic-questioning", "phase2"],
    estimatedTimeToValue: "2 weeks",
    complexity: "high",
    lastUpdated: "2025-01-20",
    previewAvailable: true,
  },
  {
    id: "phase2-003",
    title: "CMM Workshop Facilitation Kit",
    description: "Complete capability maturity model workshop kit with assessment tools and facilitation guides",
    category: "Benchmarking & Analytics",
    subcategory: "Maturity Assessments",
    type: "framework",
    relevanceScore: 91,
    industry: ["All Industries"],
    phase: [2],
    tags: ["capability-maturity", "workshops", "assessment", "phase2"],
    estimatedTimeToValue: "3 weeks",
    complexity: "high",
    lastUpdated: "2025-01-18",
    previewAvailable: true,
  },

  // Phase 3: AI-Powered Synthesis & Analysis Assets
  {
    id: "phase3-001",
    title: "AI Data Triangulation Engine",
    description: "Advanced AI engine for synthesizing data from multiple sources and identifying patterns and gaps",
    category: "Finance Transformation",
    subcategory: "Technology & Systems",
    type: "tool",
    relevanceScore: 97,
    industry: ["All Industries"],
    phase: [3],
    tags: ["AI", "data-triangulation", "pattern-recognition", "phase3"],
    estimatedTimeToValue: "2 weeks",
    complexity: "high",
    lastUpdated: "2025-01-25",
    previewAvailable: true,
  },
  {
    id: "phase3-002",
    title: "Gap Analysis Methodology",
    description: "Systematic approach to identifying and prioritizing gaps with impact assessment frameworks",
    category: "Implementation Accelerators",
    subcategory: "Methodologies",
    type: "methodology",
    relevanceScore: 93,
    industry: ["All Industries"],
    phase: [3],
    tags: ["gap-analysis", "impact-assessment", "prioritization", "phase3"],
    estimatedTimeToValue: "2 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-20",
    previewAvailable: true,
  },
  {
    id: "phase3-003",
    title: "Target Operating Model Templates",
    description: "Industry-specific target operating model templates with organizational design frameworks",
    category: "Finance Transformation",
    subcategory: "Organization & Talent",
    type: "template",
    relevanceScore: 95,
    industry: ["Financial Services", "Healthcare", "Manufacturing", "Technology"],
    phase: [3],
    tags: ["target-operating-model", "organizational-design", "phase3"],
    estimatedTimeToValue: "3 weeks",
    complexity: "high",
    lastUpdated: "2025-01-22",
    previewAvailable: true,
  },

  // Phase 4: Initiative Identification & Prioritization Assets
  {
    id: "phase4-001",
    title: "AI Initiative Recommendation Engine",
    description: "Machine learning platform that recommends transformation initiatives based on company profile and benchmarks",
    category: "Finance Transformation",
    subcategory: "Technology & Systems",
    type: "tool",
    relevanceScore: 98,
    industry: ["All Industries"],
    phase: [4],
    tags: ["AI", "initiative-recommendation", "machine-learning", "phase4"],
    estimatedTimeToValue: "1 week",
    complexity: "high",
    lastUpdated: "2025-01-25",
    previewAvailable: true,
  },
  {
    id: "phase4-002",
    title: "ROI Calculation Framework",
    description: "Advanced ROI modeling framework with Monte Carlo simulations and sensitivity analysis",
    category: "Strategic Planning",
    subcategory: "Business Case Development",
    type: "framework",
    relevanceScore: 96,
    industry: ["All Industries"],
    phase: [4],
    tags: ["ROI", "financial-modeling", "monte-carlo", "phase4"],
    estimatedTimeToValue: "2 weeks",
    complexity: "high",
    lastUpdated: "2025-01-23",
    previewAvailable: true,
  },
  {
    id: "phase4-003",
    title: "Initiative Prioritization Matrix",
    description: "Multi-criteria decision analysis tool for prioritizing transformation initiatives with risk weighting",
    category: "Strategic Planning",
    subcategory: "Roadmap Development",
    type: "tool",
    relevanceScore: 94,
    industry: ["All Industries"],
    phase: [4],
    tags: ["prioritization", "decision-analysis", "risk-assessment", "phase4"],
    estimatedTimeToValue: "1 week",
    complexity: "medium",
    lastUpdated: "2025-01-20",
    previewAvailable: true,
  },

  // Phase 5: Roadmap Development Assets
  {
    id: "phase5-001",
    title: "Dynamic Roadmap Construction Tool",
    description: "Interactive roadmap builder with dependency mapping, resource optimization, and scenario planning",
    category: "Strategic Planning",
    subcategory: "Roadmap Development",
    type: "tool",
    relevanceScore: 97,
    industry: ["All Industries"],
    phase: [5],
    tags: ["roadmap", "dependency-mapping", "resource-optimization", "phase5"],
    estimatedTimeToValue: "2 weeks",
    complexity: "high",
    lastUpdated: "2025-01-24",
    previewAvailable: true,
  },
  {
    id: "phase5-002",
    title: "Gantt Chart Templates for Finance Transformation",
    description: "Pre-built Gantt chart templates for various transformation scenarios with milestone tracking",
    category: "Implementation Accelerators",
    subcategory: "Templates & Tools",
    type: "template",
    relevanceScore: 89,
    industry: ["All Industries"],
    phase: [5],
    tags: ["gantt-charts", "project-management", "milestones", "phase5"],
    estimatedTimeToValue: "1 week",
    complexity: "low",
    lastUpdated: "2025-01-18",
    previewAvailable: true,
  },
  {
    id: "phase5-003",
    title: "Business Case Development Kit",
    description: "Complete business case development kit with financial models, risk assessment, and presentation templates",
    category: "Strategic Planning",
    subcategory: "Business Case Development",
    type: "framework",
    relevanceScore: 95,
    industry: ["All Industries"],
    phase: [5],
    tags: ["business-case", "financial-models", "presentations", "phase5"],
    estimatedTimeToValue: "3 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-22",
    previewAvailable: true,
  },

  // Phase 6: Client Review & Handover Assets
  {
    id: "phase6-001",
    title: "Interactive Presentation Platform",
    description: "Dynamic presentation platform with real-time collaboration features and decision tracking",
    category: "Implementation Accelerators",
    subcategory: "Templates & Tools",
    type: "tool",
    relevanceScore: 92,
    industry: ["All Industries"],
    phase: [6],
    tags: ["presentations", "collaboration", "decision-tracking", "phase6"],
    estimatedTimeToValue: "1 week",
    complexity: "medium",
    lastUpdated: "2025-01-20",
    previewAvailable: true,
  },
  {
    id: "phase6-002",
    title: "Solution Selection Framework",
    description: "Structured framework for collaborative solution selection with scoring matrices and consensus building",
    category: "Implementation Accelerators",
    subcategory: "Methodologies",
    type: "framework",
    relevanceScore: 90,
    industry: ["All Industries"],
    phase: [6],
    tags: ["solution-selection", "consensus-building", "scoring", "phase6"],
    estimatedTimeToValue: "2 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-18",
    previewAvailable: true,
  },
  {
    id: "phase6-003",
    title: "Professional Deliverable Templates",
    description: "Executive-ready deliverable templates including executive summaries, detailed reports, and action plans",
    category: "Implementation Accelerators",
    subcategory: "Templates & Tools",
    type: "template",
    relevanceScore: 88,
    industry: ["All Industries"],
    phase: [6],
    tags: ["deliverables", "executive-summaries", "reports", "phase6"],
    estimatedTimeToValue: "1 week",
    complexity: "low",
    lastUpdated: "2025-01-15",
    previewAvailable: true,
  },

  // Phase 7: Implementation Tracking Assets
  {
    id: "phase7-001",
    title: "Progress Monitoring Dashboard",
    description: "Real-time dashboard for tracking implementation progress with KPI monitoring and alert systems",
    category: "Finance Transformation",
    subcategory: "Technology & Systems",
    type: "tool",
    relevanceScore: 96,
    industry: ["All Industries"],
    phase: [7],
    tags: ["monitoring", "dashboards", "KPIs", "alerts", "phase7"],
    estimatedTimeToValue: "2 weeks",
    complexity: "high",
    lastUpdated: "2025-01-25",
    previewAvailable: true,
  },
  {
    id: "phase7-002",
    title: "Benefits Realization Framework",
    description: "Comprehensive framework for tracking and measuring benefits realization with ROI validation",
    category: "Strategic Planning",
    subcategory: "Business Case Development",
    type: "framework",
    relevanceScore: 94,
    industry: ["All Industries"],
    phase: [7],
    tags: ["benefits-realization", "ROI-validation", "measurement", "phase7"],
    estimatedTimeToValue: "3 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-22",
    previewAvailable: true,
  },
  {
    id: "phase7-003",
    title: "Success Metrics Reporting Suite",
    description: "Automated reporting suite for generating success metrics reports with trend analysis and forecasting",
    category: "Benchmarking & Analytics",
    subcategory: "Industry Benchmarks",
    type: "tool",
    relevanceScore: 92,
    industry: ["All Industries"],
    phase: [7],
    tags: ["success-metrics", "reporting", "trend-analysis", "phase7"],
    estimatedTimeToValue: "2 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-20",
    previewAvailable: true,
  },

  // Cross-Phase Assets
  {
    id: "cross-001",
    title: "Finance Process Automation Toolkit",
    description: "Comprehensive RPA toolkit for automating key finance processes with pre-built bots and workflows",
    category: "Finance Transformation",
    subcategory: "Process Optimization",
    type: "framework",
    relevanceScore: 95,
    industry: ["All Industries"],
    phase: [2, 3, 4, 5],
    tags: ["RPA", "automation", "process-optimization", "cross-phase"],
    estimatedTimeToValue: "4-6 weeks",
    complexity: "high",
    lastUpdated: "2025-01-25",
    previewAvailable: true,
  },
  {
    id: "cross-002",
    title: "Change Management Accelerator",
    description: "End-to-end change management accelerator with stakeholder analysis, communication plans, and training materials",
    category: "Finance Transformation",
    subcategory: "Organization & Talent",
    type: "framework",
    relevanceScore: 93,
    industry: ["All Industries"],
    phase: [1, 2, 3, 4, 5, 6, 7],
    tags: ["change-management", "communication", "training", "cross-phase"],
    estimatedTimeToValue: "2-3 weeks",
    complexity: "medium",
    lastUpdated: "2025-01-23",
    previewAvailable: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const phase = searchParams.get("phase");
    const industry = searchParams.get("industry");
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");

    console.log("🔍 Hackett IP API called with filters:", { phase, industry, category, type, search, limit });

    let filteredAssets = [...HACKETT_IP_ASSETS];

    // Filter by phase
    if (phase) {
      const phaseNum = parseInt(phase);
      filteredAssets = filteredAssets.filter(asset => asset.phase.includes(phaseNum));
    }

    // Filter by industry
    if (industry && industry !== "All Industries") {
      filteredAssets = filteredAssets.filter(asset => asset.industry.includes("All Industries") || asset.industry.includes(industry));
    }

    // Filter by category
    if (category) {
      filteredAssets = filteredAssets.filter(asset => asset.category === category);
    }

    // Filter by type
    if (type) {
      filteredAssets = filteredAssets.filter(asset => asset.type === type);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAssets = filteredAssets.filter(
        asset => asset.title.toLowerCase().includes(searchLower) || asset.description.toLowerCase().includes(searchLower) || asset.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by relevance score (descending)
    filteredAssets.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Apply limit
    const limitedAssets = filteredAssets.slice(0, limit);

    // Calculate summary statistics
    const summary = {
      totalAssets: limitedAssets.length,
      totalAvailable: HACKETT_IP_ASSETS.length,
      byPhase: {
        phase1: filteredAssets.filter(a => a.phase.includes(1)).length,
        phase2: filteredAssets.filter(a => a.phase.includes(2)).length,
        phase3: filteredAssets.filter(a => a.phase.includes(3)).length,
        phase4: filteredAssets.filter(a => a.phase.includes(4)).length,
        phase5: filteredAssets.filter(a => a.phase.includes(5)).length,
        phase6: filteredAssets.filter(a => a.phase.includes(6)).length,
        phase7: filteredAssets.filter(a => a.phase.includes(7)).length,
      },
      byType: {
        template: filteredAssets.filter(a => a.type === "template").length,
        framework: filteredAssets.filter(a => a.type === "framework").length,
        tool: filteredAssets.filter(a => a.type === "tool").length,
        methodology: filteredAssets.filter(a => a.type === "methodology").length,
      },
      averageRelevanceScore: Math.round(limitedAssets.reduce((sum, asset) => sum + asset.relevanceScore, 0) / (limitedAssets.length || 1)),
    };

    console.log("✅ Returning", limitedAssets.length, "Hackett IP assets");

    return NextResponse.json({
      success: true,
      data: limitedAssets,
      summary,
      filters: { phase, industry, category, type, search, limit },
    });
  } catch (error) {
    console.error("❌ Hackett IP API error:", error);
    return NextResponse.json({ error: "Failed to fetch Hackett IP assets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyProfile, currentPhase } = await request.json();

    console.log("🎯 Getting personalized Hackett IP recommendations for:", companyProfile?.companyName);

    // Get phase-specific assets
    const phaseAssets = HACKETT_IP_ASSETS.filter(asset => asset.phase.includes(currentPhase || 1));

    // Get industry-specific assets
    const industryAssets = HACKETT_IP_ASSETS.filter(asset => asset.industry.includes("All Industries") || asset.industry.includes(companyProfile?.industry || "Technology"));

    // Get cross-phase assets that are always relevant
    const crossPhaseAssets = HACKETT_IP_ASSETS.filter(
      asset => asset.phase.length > 3 // Cross-phase assets
    );

    // Combine and deduplicate
    const recommendedAssets = [
      ...phaseAssets,
      ...industryAssets.slice(0, 5), // Top 5 industry-specific
      ...crossPhaseAssets.slice(0, 3), // Top 3 cross-phase
    ]
      .filter((asset, index, self) => index === self.findIndex(a => a.id === asset.id))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    const recommendations = {
      currentPhase: {
        phase: currentPhase || 1,
        assets: phaseAssets.slice(0, 6),
        totalCount: phaseAssets.length,
      },
      industrySpecific: {
        industry: companyProfile?.industry || "Technology",
        assets: industryAssets.slice(0, 8),
        totalCount: industryAssets.length,
      },
      quickWins: {
        assets: HACKETT_IP_ASSETS.filter(asset => asset.complexity === "low" && asset.estimatedTimeToValue.includes("week")).slice(0, 4),
      },
      strategic: {
        assets: HACKETT_IP_ASSETS.filter(asset => asset.type === "framework" || asset.type === "methodology").slice(0, 6),
      },
    };

    console.log("✅ Generated personalized Hackett IP recommendations");

    return NextResponse.json({
      success: true,
      data: recommendations,
      totalRecommended: recommendedAssets.length,
    });
  } catch (error) {
    console.error("❌ Personalized Hackett IP error:", error);
    return NextResponse.json({ error: "Failed to generate personalized recommendations" }, { status: 500 });
  }
}
