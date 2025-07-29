import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CompanyAnalysisDashboard from "@/components/analytics/CompanyAnalysisDashboard";

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock insights data
const mockInsights = [
  {
    id: "insight-1",
    type: "recommendation",
    title: "Implement Automated Reporting",
    description: "Implement automated financial reporting to reduce manual effort",
    confidence: 0.85,
    impact: "high",
    source: "AI Analysis",
    phase: 1,
    actionable: true,
    estimatedValue: 500000,
    timeframe: "6 months",
    dependencies: ["System integration"],
    recommendations: ["Deploy automation tools"],
  },
  {
    id: "insight-2",
    type: "risk",
    title: "Data Quality Issues",
    description: "Current data quality issues may impact transformation success",
    confidence: 0.72,
    impact: "medium",
    source: "Data Assessment",
    phase: 2,
    actionable: true,
    estimatedValue: 200000,
    timeframe: "3 months",
    dependencies: ["Data cleanup"],
    recommendations: ["Implement data validation"],
  },
];

// Mock workflow phases data
const mockPhases = [
  {
    id: 1,
    title: "Project Initiation & Planning",
    description: "Initial assessment and planning phase",
    status: "in-progress",
    aiAcceleration: 40,
    duration: "2 weeks",
    traditionalDuration: "4 weeks",
    hackettIP: ["Project templates", "Best practices"],
    deliverables: ["Project charter", "Stakeholder matrix", "Risk assessment"],
    aiSuggestions: ["Automated planning", "Smart recommendations"],
    keyActivities: ["Stakeholder interviews", "Current state documentation"],
    dependencies: ["Leadership commitment"],
    teamRole: ["Project Manager", "Business Analyst"],
    clientTasks: ["Provide access", "Assign stakeholders"],
    progress: 25,
    estimatedCompletion: "2024-02-15",
    riskFactors: ["Resource availability", "Stakeholder alignment"],
    successMetrics: ["Deliverable completion", "Quality metrics"],
  },
  {
    id: 2,
    title: "Current State Assessment",
    description: "Comprehensive analysis of existing processes",
    status: "pending",
    aiAcceleration: 45,
    duration: "3 weeks",
    traditionalDuration: "6 weeks",
    hackettIP: ["Assessment frameworks", "Industry benchmarks"],
    deliverables: ["Process documentation", "Gap analysis", "Baseline metrics"],
    aiSuggestions: ["AI-powered analysis", "Automated documentation"],
    keyActivities: ["Process mapping", "System analysis", "Performance measurement"],
    dependencies: ["Phase 1 completion"],
    teamRole: ["Business Analyst", "Technical Lead"],
    clientTasks: ["Provide documentation", "Grant system access"],
    progress: 0,
    estimatedCompletion: "2024-03-08",
    riskFactors: ["Data availability", "System access"],
    successMetrics: ["Analysis completeness", "Stakeholder satisfaction"],
  },
];

// Mock company data
const mockCompanies = [
  {
    id: "company-1",
    clientName: "TechCorp Solutions",
    industry: "Technology",
    engagementType: "Full Transformation",
    status: "analysis",
    progress: 65,
    aiAcceleration: 35,
    startDate: "2024-01-15",
    estimatedCompletion: "2024-12-31",
    teamMembers: ["John Doe", "Jane Smith"],
    hackettIPMatches: 127,
    region: "North America",
    projectValue: 5200000,
    currentPhase: 3,
    revenue: "$500M",
    employees: "5,000-10,000",
    currentERP: "SAP",
    painPoints: ["Manual processes", "Data silos", "Reporting delays"],
    objectives: ["Process automation", "Real-time analytics", "Cost reduction"],
    timeline: "12 months",
    budget: "$5M",
  },
  {
    id: "company-2",
    clientName: "Manufacturing Inc",
    industry: "Manufacturing",
    engagementType: "Process Optimization",
    status: "initiation",
    progress: 15,
    aiAcceleration: 20,
    startDate: "2024-02-01",
    estimatedCompletion: "2024-10-31",
    teamMembers: ["Alice Johnson"],
    hackettIPMatches: 89,
    region: "Europe",
    projectValue: 3100000,
    currentPhase: 1,
    revenue: "$200M",
    employees: "1,000-5,000",
    currentERP: "Oracle",
    painPoints: ["Inventory management", "Supply chain visibility"],
    objectives: ["Optimize inventory", "Improve forecasting"],
    timeline: "9 months",
    budget: "$3M",
  },
];

const mockCompanyDetails = {
  insights: [
    {
      id: "insight-1",
      type: "recommendation",
      title: "Implement Automated Reporting",
      description: "Automate financial reporting processes to reduce manual effort by 60%",
      confidence: 0.85,
      impact: "high",
      source: "AI Analysis",
      phase: 3,
      actionable: true,
      estimatedValue: 250000,
      timeframe: "3 months",
    },
    {
      id: "insight-2",
      type: "risk",
      title: "Data Quality Issues",
      description: "Current data quality may impact transformation success",
      confidence: 0.72,
      impact: "medium",
      source: "Data Assessment",
      phase: 2,
      actionable: true,
    },
  ],
  phases: [
    {
      id: "phase-1",
      phaseNumber: 1,
      title: "Project Initiation",
      description: "Initial project setup and planning",
      status: "completed",
      aiAcceleration: 25,
      duration: "2 weeks",
      traditionalDuration: "3 weeks",
      deliverables: '["Project Charter", "Team Setup", "Initial Assessment"]',
      progress: 100,
    },
    {
      id: "phase-2",
      phaseNumber: 2,
      title: "Data Collection",
      description: "Gather and analyze current state data",
      status: "in-progress",
      aiAcceleration: 40,
      duration: "4 weeks",
      traditionalDuration: "6 weeks",
      deliverables: '["Data Inventory", "Process Maps", "Stakeholder Interviews"]',
      progress: 75,
    },
  ],
};

describe("CompanyAnalysisDashboard", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Test 1: Expected rendering/behavior
  test("renders dashboard with loading state initially", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    } as Response);

    render(<CompanyAnalysisDashboard />);

    // Check loading state
    expect(screen.getByText("Loading companies...")).toBeInTheDocument();

    // Wait for companies to load
    await waitFor(() => {
      expect(screen.getByText("Company Analysis Dashboard")).toBeInTheDocument();
    });

    expect(screen.getByText("Select a company to view their transformation scorecard and insights")).toBeInTheDocument();
    expect(screen.getByText("2 companies")).toBeInTheDocument();
  });

  test("displays companies list after loading", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    } as Response);

    render(<CompanyAnalysisDashboard />);

    await waitFor(() => {
      expect(screen.getByText("TechCorp Solutions")).toBeInTheDocument();
      expect(screen.getByText("Manufacturing Inc")).toBeInTheDocument();
    });

    // Check company details
    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("Manufacturing")).toBeInTheDocument();
    expect(screen.getByText("analysis")).toBeInTheDocument();
    expect(screen.getByText("initiation")).toBeInTheDocument();
  });

  test("shows placeholder when no company is selected", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    } as Response);

    render(<CompanyAnalysisDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Select a Company")).toBeInTheDocument();
    });

    expect(screen.getByText("Choose a company from the list to view their transformation scorecard and insights")).toBeInTheDocument();
  });

  // Test 2: User interactions
  test("selects company and loads detailed data", async () => {
    // Mock companies list response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    } as Response);

    // Mock company details response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCompanyDetails,
    } as Response);

    render(<CompanyAnalysisDashboard />);

    // Wait for companies to load
    await waitFor(() => {
      expect(screen.getByText("TechCorp Solutions")).toBeInTheDocument();
    });

    // Click on the first company
    fireEvent.click(screen.getByText("TechCorp Solutions"));

    // Check loading state for company details
    expect(screen.getByText("Loading company analysis...")).toBeInTheDocument();

    // Wait for company details to load
    await waitFor(() => {
      expect(screen.getByText("Overview")).toBeInTheDocument();
    });

    // Verify API calls
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenCalledWith("/api/companies");
    expect(mockFetch).toHaveBeenCalledWith("/api/companies/company-1");
  });

  test("switches between tabs after selecting company", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    } as Response);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCompanyDetails,
    } as Response);

    render(<CompanyAnalysisDashboard />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("TechCorp Solutions"));
    });

    await waitFor(() => {
      expect(screen.getByText("Overview")).toBeInTheDocument();
    });

    // Test tab switching
    fireEvent.click(screen.getByText("Scorecard"));
    expect(screen.getByText("Progress Metrics")).toBeInTheDocument();
    expect(screen.getByText("Key Metrics")).toBeInTheDocument();

    fireEvent.click(screen.getByText("AI Insights"));
    await waitFor(() => {
      expect(screen.getByText("Implement Automated Reporting")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Workflow"));
    expect(screen.getByText("Project Initiation")).toBeInTheDocument();
  });

  test("highlights selected company", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    } as Response);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCompanyDetails,
    } as Response);

    render(<CompanyAnalysisDashboard />);

    await waitFor(() => {
      expect(screen.getByText("TechCorp Solutions")).toBeInTheDocument();
    });

    const companyCard = screen.getByText("TechCorp Solutions").closest("div");
    fireEvent.click(companyCard!);

    await waitFor(() => {
      const selectedCard = screen.getByText("TechCorp Solutions").closest("div");
      expect(selectedCard).toHaveClass("border-purple-300", "bg-purple-50");
    });
  });

  // Test 3: Edge cases and error states
  test("handles empty companies list", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: [] }),
    } as Response);

    render(<CompanyAnalysisDashboard />);

    await waitFor(() => {
      expect(screen.getByText("No companies found")).toBeInTheDocument();
    });

    expect(screen.getByText("0 companies")).toBeInTheDocument();
  });

  test("handles API error when fetching companies", async () => {
    mockFetch.mockRejectedValueOnce(new Error("API Error"));

    // Spy on console.error to prevent error output in test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(<CompanyAnalysisDashboard />);

    await waitFor(() => {
      expect(screen.getByText("No companies found")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test("handles API error when fetching company details", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    } as Response);

    mockFetch.mockRejectedValueOnce(new Error("Company details API Error"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(<CompanyAnalysisDashboard />);

    await waitFor(() => {
      expect(screen.getByText("TechCorp Solutions")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("TechCorp Solutions"));

    // Should still show loading stopped (error handled gracefully)
    await waitFor(() => {
      expect(screen.queryByText("Loading company analysis...")).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test("handles company with no insights", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    } as Response);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ insights: [], phases: [] }),
    } as Response);

    render(<CompanyAnalysisDashboard />);

    await waitFor(() => {
      expect(screen.getByText("TechCorp Solutions")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("TechCorp Solutions"));

    await waitFor(() => {
      expect(screen.getByText("AI Insights")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("AI Insights"));

    expect(screen.getByText("No AI Insights")).toBeInTheDocument();
    expect(screen.getByText("AI insights will appear here as analysis progresses")).toBeInTheDocument();
  });

  test("handles company with no workflow phases", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    } as Response);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ insights: [], phases: [] }),
    } as Response);

    render(<CompanyAnalysisDashboard />);

    await waitFor(() => {
      expect(screen.getByText("TechCorp Solutions")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("TechCorp Solutions"));

    await waitFor(() => {
      expect(screen.getByText("Workflow")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Workflow"));

    expect(screen.getByText("No Workflow Phases")).toBeInTheDocument();
    expect(screen.getByText("Workflow phases will appear here as they are created")).toBeInTheDocument();
  });

  test("handles company with missing optional data", async () => {
    const companyWithMissingData = {
      ...mockCompanies[0],
      revenue: undefined,
      employees: undefined,
      currentERP: undefined,
      timeline: undefined,
      painPoints: [],
      objectives: [],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: [companyWithMissingData] }),
    } as Response);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCompanyDetails,
    } as Response);

    render(<CompanyAnalysisDashboard />);

    await waitFor(() => {
      expect(screen.getByText("TechCorp Solutions")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("TechCorp Solutions"));

    await waitFor(() => {
      expect(screen.getByText("Scorecard")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Scorecard"));

    // Check that N/A is displayed for missing data
    expect(screen.getAllByText("N/A")).toHaveLength(4); // revenue, employees, currentERP, timeline

    // Check empty states for pain points and objectives
    expect(screen.getByText("No pain points identified")).toBeInTheDocument();
    expect(screen.getByText("No objectives defined")).toBeInTheDocument();
  });

  test("displays correct insight icons and colors based on type", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    } as Response);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCompanyDetails,
    } as Response);

    render(<CompanyAnalysisDashboard />);

    await waitFor(() => {
      expect(screen.getByText("TechCorp Solutions")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("TechCorp Solutions"));

    await waitFor(() => {
      expect(screen.getByText("AI Insights")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("AI Insights"));

    await waitFor(() => {
      expect(screen.getByText("Implement Automated Reporting")).toBeInTheDocument();
    });

    // Check that insights are displayed with proper styling
    const recommendationCard = screen.getByText("Implement Automated Reporting").closest(".border-l-4");
    expect(recommendationCard).toHaveClass("border-blue-200", "bg-blue-50");

    const riskCard = screen.getByText("Data Quality Issues").closest(".border-l-4");
    expect(riskCard).toHaveClass("border-red-200", "bg-red-50");
  });

  test("regenerates AI analysis when regenerate button is clicked", async () => {
    // Mock initial companies fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    } as Response);

    // Mock company details fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        insights: mockInsights,
        phases: mockPhases,
      }),
    } as Response);

    render(<CompanyAnalysisDashboard />);

    // Wait for companies to load and select first company
    await waitFor(() => {
      expect(screen.getByText("TechCorp Solutions")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("TechCorp Solutions"));

    // Wait for company details to load
    await waitFor(() => {
      expect(screen.getByText("Overview")).toBeInTheDocument();
    });

    // Regenerate button should now be visible
    await waitFor(() => {
      expect(screen.getByText("Regenerate AI Analysis")).toBeInTheDocument();
    });

    // Mock the regenerate analysis API call
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        insights: mockInsights,
        workflowPhases: mockPhases,
        estimatedAIAcceleration: 45,
        hackettMatches: 1200,
        estimatedValue: 2800000,
      }),
    } as Response);

    // Mock the follow-up company details fetch after regeneration
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        insights: mockInsights,
        phases: mockPhases,
      }),
    } as Response);

    // Click regenerate button
    fireEvent.click(screen.getByText("Regenerate AI Analysis"));

    // Should show regenerating state
    await waitFor(() => {
      expect(screen.getByText("Regenerating...")).toBeInTheDocument();
    });

    // Should show regenerating message in loading area
    await waitFor(() => {
      expect(screen.getByText("Regenerating AI analysis...")).toBeInTheDocument();
    });

    // Wait for regeneration to complete
    await waitFor(
      () => {
        expect(screen.getByText("Regenerate AI Analysis")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify API calls were made correctly
    expect(mockFetch).toHaveBeenCalledWith("/api/generate-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId: "company-1",
        companyName: "TechCorp Solutions",
        industry: "Technology",
        region: "North America",
        revenue: "$500M",
        employees: "5,000-10,000",
        currentERP: "SAP",
        painPoints: ["Manual processes", "Data silos", "Reporting delays"],
        objectives: ["Process automation", "Real-time analytics", "Cost reduction"],
        timeline: "12 months",
        budget: "$5M",
        engagementType: "Full Transformation",
      }),
    });
  });

  test("handles regenerate API failure gracefully", async () => {
    // Mock initial companies fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    } as Response);

    // Mock company details fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        insights: mockInsights,
        phases: mockPhases,
      }),
    } as Response);

    render(<CompanyAnalysisDashboard />);

    // Wait for companies to load and select first company
    await waitFor(() => {
      expect(screen.getByText("TechCorp Solutions")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("TechCorp Solutions"));

    // Wait for regenerate button to appear
    await waitFor(() => {
      expect(screen.getByText("Regenerate AI Analysis")).toBeInTheDocument();
    });

    // Mock failed API call
    mockFetch.mockRejectedValueOnce(new Error("API Error"));

    // Click regenerate button
    fireEvent.click(screen.getByText("Regenerate AI Analysis"));

    // Should show regenerating state
    await waitFor(() => {
      expect(screen.getByText("Regenerating...")).toBeInTheDocument();
    });

    // Should return to normal state after error
    await waitFor(
      () => {
        expect(screen.getByText("Regenerate AI Analysis")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Button should be enabled again
    expect(screen.getByText("Regenerate AI Analysis")).not.toBeDisabled();
  });
});
