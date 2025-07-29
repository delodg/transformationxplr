import { createMocks } from "node-mocks-http";
import { GET, POST } from "../../app/api/ai-insights/route";
import { PUT, DELETE } from "../../app/api/ai-insights/[id]/route";

// Mock the database and auth
jest.mock("../../lib/db/services", () => ({
  createAIInsight: jest.fn(),
  getAIInsightsByCompany: jest.fn(),
  updateAIInsight: jest.fn(),
  deleteAIInsight: jest.fn(),
  bulkCreateAIInsights: jest.fn(),
  getCompanyById: jest.fn(),
  generateId: jest.fn(() => "generated-id"),
}));

jest.mock("../../lib/db", () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve([{ id: "insight-1", companyId: "company-1" }])),
        })),
      })),
    })),
  },
  aiInsights: {},
}));

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

import * as services from "../../lib/db/services";
import { auth } from "@clerk/nextjs/server";

describe("/api/ai-insights", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({ userId: "test-user-id" });
  });

  describe("GET /api/ai-insights", () => {
    it("should return AI insights for a company", async () => {
      const mockCompany = { id: "company-1", userId: "test-user-id" };
      const mockInsights = [
        {
          id: "insight-1",
          title: "Process Optimization",
          type: "recommendation",
          confidence: 85,
        },
      ];

      (services.getCompanyById as jest.Mock).mockResolvedValue(mockCompany);
      (services.getAIInsightsByCompany as jest.Mock).mockResolvedValue(mockInsights);

      const { req } = createMocks({
        method: "GET",
        url: "/api/ai-insights?companyId=company-1",
      });

      // Mock URL constructor
      global.URL = jest.fn().mockImplementation(url => ({
        searchParams: new URLSearchParams("companyId=company-1"),
      })) as any;

      const response = await GET(req as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.insights).toEqual(mockInsights);
    });

    it("should return 400 if companyId is missing", async () => {
      const { req } = createMocks({
        method: "GET",
        url: "/api/ai-insights",
      });

      global.URL = jest.fn().mockImplementation(() => ({
        searchParams: new URLSearchParams(),
      })) as any;

      const response = await GET(req as any);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Company ID is required");
    });

    it("should return 404 if company not found", async () => {
      (services.getCompanyById as jest.Mock).mockResolvedValue(null);

      const { req } = createMocks({
        method: "GET",
        url: "/api/ai-insights?companyId=company-1",
      });

      global.URL = jest.fn().mockImplementation(() => ({
        searchParams: new URLSearchParams("companyId=company-1"),
      })) as any;

      const response = await GET(req as any);

      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/ai-insights", () => {
    it("should create a single AI insight", async () => {
      const mockCompany = { id: "company-1", userId: "test-user-id" };
      const newInsight = {
        id: "generated-id",
        companyId: "company-1",
        title: "New Insight",
        type: "recommendation",
      };

      (services.getCompanyById as jest.Mock).mockResolvedValue(mockCompany);
      (services.createAIInsight as jest.Mock).mockResolvedValue(newInsight);

      const { req } = createMocks({
        method: "POST",
        body: {
          companyId: "company-1",
          title: "New Insight",
          type: "recommendation",
        },
      });

      const response = await POST(req as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.insight).toEqual(newInsight);
    });

    it("should create multiple AI insights in bulk", async () => {
      const mockCompany = { id: "company-1", userId: "test-user-id" };
      const insights = [
        { title: "Insight 1", type: "recommendation" },
        { title: "Insight 2", type: "opportunity" },
      ];
      const newInsights = insights.map((insight, index) => ({
        id: `generated-id-${index}`,
        companyId: "company-1",
        ...insight,
      }));

      (services.getCompanyById as jest.Mock).mockResolvedValue(mockCompany);
      (services.bulkCreateAIInsights as jest.Mock).mockResolvedValue(newInsights);

      const { req } = createMocks({
        method: "POST",
        body: {
          companyId: "company-1",
          insights,
        },
      });

      const response = await POST(req as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.insights).toEqual(newInsights);
    });
  });

  describe("PUT /api/ai-insights/[id]", () => {
    it("should update an AI insight", async () => {
      const mockCompany = { id: "company-1", userId: "test-user-id" };
      const updatedInsight = {
        id: "insight-1",
        title: "Updated Insight",
        confidence: 90,
      };

      (services.getCompanyById as jest.Mock).mockResolvedValue(mockCompany);
      (services.updateAIInsight as jest.Mock).mockResolvedValue(updatedInsight);

      const { req } = createMocks({
        method: "PUT",
        body: { confidence: 90 },
      });

      const response = await PUT(req as any, {
        params: Promise.resolve({ id: "insight-1" }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.insight).toEqual(updatedInsight);
    });
  });

  describe("DELETE /api/ai-insights/[id]", () => {
    it("should delete an AI insight", async () => {
      const mockCompany = { id: "company-1", userId: "test-user-id" };

      (services.getCompanyById as jest.Mock).mockResolvedValue(mockCompany);
      (services.deleteAIInsight as jest.Mock).mockResolvedValue(undefined);

      const { req } = createMocks({ method: "DELETE" });

      const response = await DELETE(req as any, {
        params: Promise.resolve({ id: "insight-1" }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe("AI insight deleted successfully");
    });
  });
});
