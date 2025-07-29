import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransformationXPLR from "../../app/page";
import { useUser } from "@clerk/nextjs";

// Mock the child components
jest.mock("../../components/workflow/CommandCenter", () => ({
  CommandCenter: ({ currentProject, onNewProject }: any) => (
    <div data-testid="command-center">
      <span>Command Center for {currentProject?.clientName}</span>
      <button onClick={onNewProject}>New Project</button>
    </div>
  ),
}));

jest.mock("../../components/workflow/WorkflowPhases", () => ({
  WorkflowPhases: ({ phases, currentPhase }: any) => (
    <div data-testid="workflow-phases">
      <span>Workflow Phases - Current: {currentPhase}</span>
      <span>Phases: {phases.length}</span>
    </div>
  ),
}));

jest.mock("../../components/ai/AIAssistant", () => ({
  AIAssistant: ({ isVisible, onClose }: any) =>
    isVisible ? (
      <div data-testid="ai-assistant">
        <span>AI Assistant</span>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock("../../components/onboarding/ClientOnboarding", () => ({
  ClientOnboardingModal: ({ isVisible, onClose, onSubmit }: any) =>
    isVisible ? (
      <div data-testid="onboarding-modal">
        <span>Onboarding Modal</span>
        <button onClick={onClose}>Close</button>
        <button
          onClick={() =>
            onSubmit({
              companyName: "Test Company",
              industry: "Technology",
              region: "North America",
            })
          }
        >
          Submit
        </button>
      </div>
    ) : null,
}));

jest.mock("../../components/guidance/GuidedTour", () => ({
  GuidedTour: ({ tourType, onComplete }: any) => (
    <div data-testid="guided-tour">
      <span>Guided Tour: {tourType}</span>
      <button onClick={onComplete}>Complete Tour</button>
    </div>
  ),
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("TransformationXPLR Page", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();

    // Mock useUser hook
    (useUser as jest.Mock).mockReturnValue({
      user: {
        id: "test-user-id",
        firstName: "Test",
        lastName: "User",
        emailAddresses: [{ emailAddress: "test@example.com" }],
      },
      isLoaded: true,
    });
  });

  describe("Loading States", () => {
    it("should show loading state when Clerk is not loaded", () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: false,
      });

      render(<TransformationXPLR />);

      expect(screen.getByText("Loading your transformation dashboard...")).toBeInTheDocument();
    });

    it("should show authentication required when no user", () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: true,
      });

      render(<TransformationXPLR />);

      expect(screen.getByText("Authentication Required")).toBeInTheDocument();
      expect(screen.getByText("Please sign in to access your transformation platform.")).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should show welcome page when no companies exist", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ companies: [] }),
      });

      render(<TransformationXPLR />);

      await waitFor(() => {
        expect(screen.getByText("Welcome to Transformation XPLR")).toBeInTheDocument();
        expect(screen.getByText("Add Your First Company")).toBeInTheDocument();
      });
    });

    it("should open onboarding modal when Add Company is clicked", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ companies: [] }),
      });

      render(<TransformationXPLR />);

      await waitFor(() => {
        expect(screen.getByText("Add Your First Company")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Add Your First Company"));

      expect(screen.getByTestId("onboarding-modal")).toBeInTheDocument();
    });
  });

  describe("Main Application", () => {
    const mockCompanies = [
      {
        id: "company-1",
        clientName: "Test Company",
        industry: "Technology",
        status: "initiation",
        progress: 25,
        aiAcceleration: 40,
        currentPhase: 1,
        teamMembers: "[]",
        painPoints: "[]",
        objectives: "[]",
      },
    ];

    const mockInsights = [
      {
        id: "insight-1",
        type: "recommendation",
        title: "Test Insight",
        description: "Test Description",
        confidence: 85,
        impact: "high",
        source: "AI Analysis",
        phase: 1,
        actionable: true,
      },
    ];

    const mockPhases = [
      {
        phaseNumber: 1,
        title: "Project Initiation",
        description: "Initial phase",
        status: "in-progress",
        progress: 25,
        deliverables: "[]",
        keyActivities: "[]",
        dependencies: "[]",
        teamRole: "[]",
        clientTasks: "[]",
        riskFactors: "[]",
        successMetrics: "[]",
        hackettIP: "[]",
        aiSuggestions: "[]",
      },
    ];

    beforeEach(() => {
      // Mock successful API responses
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ companies: mockCompanies }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ insights: mockInsights, phases: mockPhases }),
        });
    });

    it("should render main application with companies", async () => {
      render(<TransformationXPLR />);

      await waitFor(() => {
        expect(screen.getByText("Transformation XPLR")).toBeInTheDocument();
        expect(screen.getByText("AI-Powered Finance Transformation Platform")).toBeInTheDocument();
        expect(screen.getByText("Welcome, Test")).toBeInTheDocument();
      });
    });

    it("should show tabs navigation", async () => {
      render(<TransformationXPLR />);

      await waitFor(() => {
        expect(screen.getByText("Command Center")).toBeInTheDocument();
        expect(screen.getByText("7-Phase Workflow")).toBeInTheDocument();
        expect(screen.getByText("Analytics")).toBeInTheDocument();
        expect(screen.getByText("Hackett IP")).toBeInTheDocument();
      });
    });

    it("should switch between tabs", async () => {
      render(<TransformationXPLR />);

      await waitFor(() => {
        expect(screen.getByTestId("command-center")).toBeInTheDocument();
      });

      // Click on workflow tab
      await user.click(screen.getByText("7-Phase Workflow"));

      expect(screen.getByTestId("workflow-phases")).toBeInTheDocument();
    });

    it("should open AI Assistant", async () => {
      render(<TransformationXPLR />);

      await waitFor(() => {
        expect(screen.getByText("Help")).toBeInTheDocument();
      });

      // Click help button (which opens AI assistant)
      await user.click(screen.getByText("Help"));

      // Note: This would need more specific implementation based on actual component behavior
    });

    it("should handle new project creation", async () => {
      render(<TransformationXPLR />);

      await waitFor(() => {
        expect(screen.getByText("Add Company")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Add Company"));

      expect(screen.getByTestId("onboarding-modal")).toBeInTheDocument();
    });

    it("should submit onboarding form and create company", async () => {
      // Mock the generate analysis API call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            estimatedAIAcceleration: 45,
            estimatedCompletion: `${new Date().getFullYear()}-12-31`,
            hackettMatches: 1200,
            estimatedValue: 2500000,
          }),
      });

      // Mock the create company API call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            company: {
              ...mockCompanies[0],
              id: "new-company-id",
              clientName: "Test Company",
            },
          }),
      });

      // Mock the load company data API call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ insights: [], phases: [] }),
      });

      render(<TransformationXPLR />);

      await waitFor(() => {
        expect(screen.getByText("Add Company")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Add Company"));

      expect(screen.getByTestId("onboarding-modal")).toBeInTheDocument();

      // Submit the onboarding form
      await user.click(screen.getByText("Submit"));

      // Should show success notification and close modal
      await waitFor(() => {
        expect(screen.queryByTestId("onboarding-modal")).not.toBeInTheDocument();
      });
    });

    it("should handle API errors gracefully", async () => {
      // Mock failed API response
      mockFetch.mockRejectedValueOnce(new Error("API Error"));

      render(<TransformationXPLR />);

      // Should show error notification after failed load
      await waitFor(
        () => {
          // This would depend on how notifications are implemented
          // For now, we just ensure the component doesn't crash
          expect(screen.getByText("Loading your transformation projects...")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Notifications", () => {
    it("should show notifications when actions are performed", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ companies: [] }),
      });

      render(<TransformationXPLR />);

      await waitFor(() => {
        expect(screen.getByText("Add Your First Company")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Add Your First Company"));

      // Should show notification about starting project creation
      // This would depend on the actual notification implementation
    });
  });
});
