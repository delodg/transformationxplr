import { createMocks } from "node-mocks-http";
import { GET, POST } from "../../app/api/companies/route";
import { GET as getCompanyById, PUT, DELETE } from "../../app/api/companies/[id]/route";

// Mock the database and auth
jest.mock("../../lib/db/services", () => ({
  createCompany: jest.fn(),
  getCompaniesByUser: jest.fn(),
  getCompanyById: jest.fn(),
  updateCompany: jest.fn(),
  deleteCompany: jest.fn(),
  getAIInsightsByCompany: jest.fn(() => Promise.resolve([])),
  getWorkflowPhasesByCompany: jest.fn(() => Promise.resolve([])),
}));

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

import * as services from "../../lib/db/services";
import { auth } from "@clerk/nextjs/server";

describe("/api/companies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({ userId: "test-user-id" });
  });

  describe("GET /api/companies", () => {
    it("should return companies for authenticated user", async () => {
      const mockCompanies = [
        {
          id: "company-1",
          clientName: "Test Company",
          industry: "Technology",
          userId: "test-user-id",
        },
      ];
      (services.getCompaniesByUser as jest.Mock).mockResolvedValue(mockCompanies);

      const { req } = createMocks({ method: "GET" });
      const response = await GET();

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.companies).toEqual(mockCompanies);
      expect(services.getCompaniesByUser).toHaveBeenCalledWith("test-user-id");
    });

    it("should return 401 for unauthenticated user", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });

      const response = await GET();

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("should handle database errors", async () => {
      (services.getCompaniesByUser as jest.Mock).mockRejectedValue(new Error("Database error"));

      const response = await GET();

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe("Failed to fetch companies");
    });
  });

  describe("POST /api/companies", () => {
    it("should create a new company", async () => {
      const newCompany = {
        id: "company-2",
        clientName: "New Company",
        industry: "Finance",
        userId: "test-user-id",
      };
      (services.createCompany as jest.Mock).mockResolvedValue(newCompany);

      const { req } = createMocks({
        method: "POST",
        body: {
          clientName: "New Company",
          industry: "Finance",
        },
      });

      const response = await POST(req as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.company).toEqual(newCompany);
      expect(services.createCompany).toHaveBeenCalledWith({
        clientName: "New Company",
        industry: "Finance",
        userId: "test-user-id",
      });
    });

    it("should return 401 for unauthenticated user", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });

      const { req } = createMocks({
        method: "POST",
        body: { clientName: "Test" },
      });

      const response = await POST(req as any);

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/companies/[id]", () => {
    it("should return company data with insights and phases", async () => {
      const mockInsights = [{ id: "insight-1", title: "Test Insight" }];
      const mockPhases = [{ id: 1, title: "Phase 1" }];

      (services.getAIInsightsByCompany as jest.Mock).mockResolvedValue(mockInsights);
      (services.getWorkflowPhasesByCompany as jest.Mock).mockResolvedValue(mockPhases);

      const { req } = createMocks({ method: "GET" });
      const response = await getCompanyById(req as any, {
        params: Promise.resolve({ id: "company-1" }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.insights).toEqual(mockInsights);
      expect(data.phases).toEqual(mockPhases);
    });
  });

  describe("PUT /api/companies/[id]", () => {
    it("should update a company", async () => {
      const mockCompany = {
        id: "company-1",
        userId: "test-user-id",
        clientName: "Test Company",
      };
      const updatedCompany = { ...mockCompany, progress: 50 };

      (services.getCompanyById as jest.Mock).mockResolvedValue(mockCompany);
      (services.updateCompany as jest.Mock).mockResolvedValue(updatedCompany);

      const { req } = createMocks({
        method: "PUT",
        body: { progress: 50 },
      });

      const response = await PUT(req as any, {
        params: Promise.resolve({ id: "company-1" }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.company).toEqual(updatedCompany);
    });

    it("should return 404 for non-existent company", async () => {
      (services.getCompanyById as jest.Mock).mockResolvedValue(null);

      const { req } = createMocks({
        method: "PUT",
        body: { progress: 50 },
      });

      const response = await PUT(req as any, {
        params: Promise.resolve({ id: "non-existent" }),
      });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/companies/[id]", () => {
    it("should delete a company", async () => {
      const mockCompany = {
        id: "company-1",
        userId: "test-user-id",
        clientName: "Test Company",
      };

      (services.getCompanyById as jest.Mock).mockResolvedValue(mockCompany);
      (services.deleteCompany as jest.Mock).mockResolvedValue(undefined);

      const { req } = createMocks({ method: "DELETE" });

      const response = await DELETE(req as any, {
        params: Promise.resolve({ id: "company-1" }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe("Company deleted successfully");
      expect(services.deleteCompany).toHaveBeenCalledWith("company-1");
    });
  });
});
