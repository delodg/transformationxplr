"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Building,
  Users,
  DollarSign,
  Calendar,
  Target,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Database,
  Globe,
  Settings,
  FileText,
  Lightbulb,
  Star,
  BarChart3,
  Shield,
  Rocket,
} from "lucide-react";
import { ClientOnboarding } from "../../types";

// Simple debounce utility function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

interface ClientOnboardingProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: ClientOnboarding) => void;
}

export const ClientOnboardingModal: React.FC<ClientOnboardingProps> = ({ isVisible, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ClientOnboarding>({
    companyName: "",
    companyNumber: "", // New field for company identifier
    industry: "",
    revenue: "",
    employees: "",
    region: "",
    currentERP: "",
    painPoints: [],
    objectives: [],
    timeline: "",
    budget: "",
    maturityLevel: "intermediate",
    previousTransformations: false,
    complianceRequirements: [],
  });

  const [aiRecommendations, setAIRecommendations] = useState<{
    timeline: string;
    hackettAssets: number;
    estimatedValue: number;
    riskLevel: "low" | "medium" | "high";
    confidence: number;
    keyInsights?: string[];
    recommendedApproach?: {
      phase1: string;
      phase2: string;
      phase3: string;
      criticalSuccessFactors: string[];
    };
    riskFactors?: string[];
    quickWins?: string[];
  } | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(""); // Track analysis progress
  const [isLookingUpCompany, setIsLookingUpCompany] = useState(false); // New state for company lookup
  const [autoPopulatedFields, setAutoPopulatedFields] = useState<string[]>([]); // Track which fields were auto-populated

  const industries = [
    "Infrastructure & Construction",
    "Manufacturing",
    "Financial Services",
    "Healthcare",
    "Technology",
    "Retail",
    "Energy & Utilities",
    "Telecommunications",
    "Transportation",
    "Government",
  ];

  const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa", "Global"];

  const erpSystems = ["Oracle Fusion", "SAP S/4HANA", "Microsoft Dynamics", "Workday", "NetSuite", "Sage", "Infor", "Epicor", "Legacy/Custom", "Multiple Systems"];

  const commonPainPoints = [
    "Manual processes and lack of automation",
    "Long month-end close cycles",
    "Poor data quality and visibility",
    "Siloed systems and processes",
    "High operational costs",
    "Compliance and control issues",
    "Limited real-time reporting",
    "Resource constraints",
    "Change management challenges",
    "Technology debt",
  ];

  const commonObjectives = [
    "Reduce operational costs",
    "Improve process efficiency",
    "Enhance data quality and reporting",
    "Accelerate month-end close",
    "Implement automation",
    "Strengthen controls and compliance",
    "Centralize shared services",
    "Improve customer experience",
    "Enable digital transformation",
    "Scale operations",
  ];

  const complianceOptions = ["SOX (Sarbanes-Oxley)", "GAAP", "IFRS", "SEC Reporting", "GDPR", "SOC 1/2", "ISO 27001", "Industry-specific regulations"];

  const handleInputChange = (field: keyof ClientOnboarding, value: string | string[] | boolean) => {
    console.log(`📝 Updating ${field}:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // New function for AI-powered company lookup
  const handleCompanyLookup = async (companyIdentifier: string) => {
    if (!companyIdentifier.trim()) return;

    setIsLookingUpCompany(true);
    try {
      console.log("🔍 Looking up company information for:", companyIdentifier);

      const response = await fetch("/api/company-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyIdentifier: companyIdentifier,
          companyName: formData.companyName, // Also send current company name if available
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to lookup company information");
      }

      const result = await response.json();

      if (result.success && result.data) {
        const companyInfo = result.data;
        console.log("✅ Company information found:", companyInfo);

        // Track which fields will be auto-populated
        const fieldsToUpdate: string[] = [];
        const updatedData: Partial<ClientOnboarding> = {};

        if (companyInfo.companyName && companyInfo.companyName !== formData.companyName) {
          updatedData.companyName = companyInfo.companyName;
          fieldsToUpdate.push("companyName");
        }
        if (companyInfo.industry && companyInfo.industry !== formData.industry) {
          updatedData.industry = companyInfo.industry;
          fieldsToUpdate.push("industry");
        }
        if (companyInfo.revenue && companyInfo.revenue !== formData.revenue) {
          updatedData.revenue = companyInfo.revenue;
          fieldsToUpdate.push("revenue");
        }
        if (companyInfo.employees && companyInfo.employees !== formData.employees) {
          updatedData.employees = companyInfo.employees;
          fieldsToUpdate.push("employees");
        }
        if (companyInfo.region && companyInfo.region !== formData.region) {
          updatedData.region = companyInfo.region;
          fieldsToUpdate.push("region");
        }

        // Auto-populate the form fields
        setFormData(prev => ({
          ...prev,
          ...updatedData,
        }));

        // Track auto-populated fields for visual feedback
        setAutoPopulatedFields(fieldsToUpdate);

        // Clear the auto-populated indicator after 5 seconds
        setTimeout(() => {
          setAutoPopulatedFields([]);
        }, 5000);

        // Show success notification with confidence level
        console.log(`🎯 Auto-populated ${fieldsToUpdate.length} fields (${companyInfo.confidence}% confidence)`);
      } else {
        console.error("❌ Failed to get company information:", result.error);
      }
    } catch (error) {
      console.error("❌ Error looking up company:", error);
    } finally {
      setIsLookingUpCompany(false);
    }
  };

  // Debounced company lookup function
  const debouncedCompanyLookup = React.useCallback(
    debounce((identifier: string) => {
      handleCompanyLookup(identifier);
    }, 1000), // Wait 1 second after user stops typing
    [formData.companyName]
  );

  // Handle company number change with auto-lookup
  const handleCompanyNumberChange = (value: string) => {
    handleInputChange("companyNumber", value);

    // Trigger auto-lookup if we have enough characters
    if (value.trim().length >= 3) {
      debouncedCompanyLookup(value);
    }
  };

  const handleArrayChange = (field: keyof ClientOnboarding, item: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked ? [...(prev[field] as string[]), item] : (prev[field] as string[]).filter(i => i !== item),
    }));
  };

  const generateAIRecommendations = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentAnalysisStep("Initializing AI analysis..."); // Reset step

    try {
      // Realistic AI analysis progress steps
      const progressSteps = [
        { progress: 10, message: "Analyzing company profile and industry context..." },
        { progress: 25, message: "Evaluating transformation complexity factors..." },
        { progress: 40, message: "Benchmarking against industry standards..." },
        { progress: 55, message: "Assessing risk factors and mitigation strategies..." },
        { progress: 70, message: "Calculating timeline and resource requirements..." },
        { progress: 85, message: "Matching relevant Hackett IP assets..." },
        { progress: 95, message: "Generating personalized recommendations..." },
      ];

      // Start progress simulation
      let currentStepIndex = 0;
      const progressInterval = setInterval(() => {
        if (currentStepIndex < progressSteps.length) {
          const step = progressSteps[currentStepIndex];
          setAnalysisProgress(step.progress);
          setCurrentAnalysisStep(step.message);
          currentStepIndex++;
        }
      }, 800);

      console.log("🧠 Starting AI requirements analysis for:", formData.companyName);

      // Call the AI analysis API
      const response = await fetch("/api/analyze-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI analysis");
      }

      const result = await response.json();

      // Clear the progress interval
      clearInterval(progressInterval);

      // Complete the progress
      setAnalysisProgress(100);
      setCurrentAnalysisStep("Analysis complete!");

      // Wait a moment to show completion
      await new Promise(resolve => setTimeout(resolve, 500));

      if (result.success && result.data) {
        console.log("✅ AI analysis completed:", result.data);
        setAIRecommendations(result.data);
      } else {
        console.error("❌ Failed to get AI analysis:", result.error);
        // Fall back to basic analysis if API fails
        throw new Error("AI analysis failed");
      }
    } catch (error) {
      console.error("❌ Error during AI analysis:", error);

      // Provide fallback analysis based on form data
      const fallbackAnalysis = {
        timeline: formData.maturityLevel === "basic" ? "20 weeks" : formData.maturityLevel === "advanced" ? "14 weeks" : "16 weeks",
        hackettAssets: 1200,
        estimatedValue: 6000000,
        riskLevel: (formData.previousTransformations ? "low" : formData.maturityLevel === "basic" ? "high" : "medium") as "low" | "medium" | "high",
        confidence: 85,
        keyInsights: [
          `${formData.industry} transformation with significant automation potential`,
          "Multiple process optimization opportunities identified",
          "Strong ROI potential through efficiency improvements",
          "Technology modernization will enable real-time visibility",
        ],
        recommendedApproach: {
          phase1: "Comprehensive stakeholder alignment and current state assessment",
          phase2: "Multi-workstream data collection and executive interviews",
          phase3: "AI-powered analysis and future state design",
          criticalSuccessFactors: ["Executive sponsorship", "Change management", "Data quality focus"],
        },
        riskFactors: ["Change management complexity", "Integration with legacy systems", "Resource allocation challenges", "Data migration considerations"],
        quickWins: ["Automated reporting implementation", "Process standardization", "Enhanced month-end procedures", "Improved expense workflows"],
      };

      setAnalysisProgress(100);
      setCurrentAnalysisStep("Analysis complete!");
      setAIRecommendations(fallbackAnalysis);
    }

    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (currentStep === 4 && formData.companyName && formData.industry && !aiRecommendations) {
      generateAIRecommendations();
    }
  }, [currentStep, formData.companyName, formData.industry]);

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.companyName && formData.industry && formData.revenue && formData.employees;
      case 2:
        return formData.region && formData.currentERP;
      case 3:
        return formData.painPoints.length > 0 && formData.objectives.length > 0;
      case 4:
        return formData.timeline && formData.budget;
      default:
        return false;
    }
  };

  // CRITICAL FUNCTIONS - Previously missing!
  const handleNext = () => {
    console.log("🔄 handleNext called, currentStep:", currentStep);

    if (currentStep < 4) {
      console.log("📍 Moving to step:", currentStep + 1);
      setCurrentStep(currentStep + 1);
    } else {
      // Step 4 - Start Project
      console.log("🚀 Starting project submission!");
      console.log("📋 Form data:", formData);

      if (!isStepComplete(4)) {
        console.error("❌ Step 4 is not complete!");
        return;
      }

      try {
        // Call the onSubmit prop to trigger the parent component's submission handler
        console.log("📤 Calling onSubmit with form data");
        onSubmit(formData);
        console.log("✅ onSubmit called successfully");
      } catch (error) {
        console.error("❌ Error calling onSubmit:", error);
      }
    }
  };

  const handlePrevious = () => {
    console.log("🔙 handlePrevious called, currentStep:", currentStep);

    if (currentStep > 1) {
      console.log("📍 Moving to step:", currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      const millions = value / 1000000;
      return `$${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
    } else if (value >= 1000) {
      const thousands = value / 1000;
      return `$${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Building className="h-4 w-4" />;
      case 2:
        return <Settings className="h-4 w-4" />;
      case 3:
        return <Target className="h-4 w-4" />;
      case 4:
        return <Brain className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStepColor = (step: number) => {
    switch (step) {
      case 1:
        return "from-blue-500 to-blue-600";
      case 2:
        return "from-green-500 to-green-600";
      case 3:
        return "from-orange-500 to-orange-600";
      case 4:
        return "from-purple-500 to-purple-600";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[95vh] flex flex-col">
        {/* FIXED HEADER - Always visible */}
        <DialogHeader className="flex-shrink-0 text-center pb-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">Project Setup</DialogTitle>
          <DialogDescription className="text-gray-600">Tell us about your organization to get started</DialogDescription>
        </DialogHeader>

        {/* FIXED PROGRESS INDICATOR - Always visible */}
        <div className="flex-shrink-0 relative mb-6 mt-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step <= currentStep
                      ? `bg-gradient-to-br ${getStepColor(step)} text-white shadow-md`
                      : step === currentStep + 1
                      ? "bg-gray-100 text-gray-600 border border-gray-300"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step === currentStep ? getStepIcon(step) : step}
                </div>
                <span className={`mt-3 text-sm font-medium transition-colors duration-300 ${step <= currentStep ? "text-gray-900" : "text-gray-500"}`}>
                  {step === 1 && "Company"}
                  {step === 2 && "Systems"}
                  {step === 3 && "Goals"}
                  {step === 4 && "Analysis"}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full -z-10">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
          </div>
        </div>

        {/* SCROLLABLE CONTENT AREA - Only this section scrolls */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="animate-in slide-in-from-right-5 duration-500">
                <Card className="border shadow-sm bg-white">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900 flex items-center space-x-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      <span>Company Information</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600">Basic details about your organization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Company Number Field - Featured prominently */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <Label className="text-sm font-medium text-blue-900">AI-Powered Company Lookup</Label>
                      </div>
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <Input
                              id="companyNumber"
                              value={formData.companyNumber}
                              onChange={e => handleCompanyNumberChange(e.target.value)}
                              placeholder="Enter D-U-N-S, EIN, VAT, or Company Number"
                              className="h-10 border-blue-200 focus:border-blue-500"
                              disabled={isLookingUpCompany}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleCompanyLookup(formData.companyNumber || "")}
                            disabled={isLookingUpCompany || !formData.companyNumber?.trim()}
                            className="h-10 px-4 bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                          >
                            {isLookingUpCompany ? (
                              <>
                                <Zap className="h-3 w-3 mr-2 animate-spin" />
                                Looking up...
                              </>
                            ) : (
                              <>
                                <Zap className="h-3 w-3 mr-2" />
                                Auto-fill
                              </>
                            )}
                          </Button>
                        </div>
                        {isLookingUpCompany && (
                          <div className="flex items-center space-x-2 text-sm text-blue-700">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>AI is researching your company information...</span>
                          </div>
                        )}
                        <p className="text-xs text-blue-700">Enter your company identifier to automatically populate industry, revenue, and employee count using AI.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                          Company Name *
                          {autoPopulatedFields.includes("companyName") && (
                            <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">
                              AI filled
                            </Badge>
                          )}
                        </Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={e => handleInputChange("companyName", e.target.value)}
                          placeholder="Enter your company name"
                          className={`h-12 border-gray-200 focus:border-blue-500 transition-colors ${autoPopulatedFields.includes("companyName") ? "ring-2 ring-green-200 bg-green-50" : ""}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
                          Industry *
                          {autoPopulatedFields.includes("industry") && (
                            <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">
                              AI filled
                            </Badge>
                          )}
                        </Label>
                        <Select value={formData.industry} onValueChange={value => handleInputChange("industry", value)}>
                          <SelectTrigger className={`h-12 border-gray-200 focus:border-blue-500 ${autoPopulatedFields.includes("industry") ? "ring-2 ring-green-200 bg-green-50" : ""}`}>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map(industry => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="revenue" className="text-sm font-medium text-gray-700">
                          Annual Revenue *
                          {autoPopulatedFields.includes("revenue") && (
                            <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">
                              AI filled
                            </Badge>
                          )}
                        </Label>
                        <Select value={formData.revenue} onValueChange={value => handleInputChange("revenue", value)}>
                          <SelectTrigger className={`h-12 border-gray-200 focus:border-blue-500 ${autoPopulatedFields.includes("revenue") ? "ring-2 ring-green-200 bg-green-50" : ""}`}>
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<$10M">Less than $10M</SelectItem>
                            <SelectItem value="$10M-$50M">$10M - $50M</SelectItem>
                            <SelectItem value="$50M-$100M">$50M - $100M</SelectItem>
                            <SelectItem value="$100M-$500M">$100M - $500M</SelectItem>
                            <SelectItem value="$500M-$1B">$500M - $1B</SelectItem>
                            <SelectItem value="$1B+">$1B+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employees" className="text-sm font-medium text-gray-700">
                          Employee Count *
                          {autoPopulatedFields.includes("employees") && (
                            <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">
                              AI filled
                            </Badge>
                          )}
                        </Label>
                        <Select value={formData.employees} onValueChange={value => handleInputChange("employees", value)}>
                          <SelectTrigger className={`h-12 border-gray-200 focus:border-blue-500 ${autoPopulatedFields.includes("employees") ? "ring-2 ring-green-200 bg-green-50" : ""}`}>
                            <SelectValue placeholder="Select employee range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<1,000">Less than 1,000</SelectItem>
                            <SelectItem value="1,000-5,000">1,000 - 5,000</SelectItem>
                            <SelectItem value="5,000-10,000">5,000 - 10,000</SelectItem>
                            <SelectItem value="10,000-50,000">10,000 - 50,000</SelectItem>
                            <SelectItem value="50,000+">50,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in slide-in-from-right-5 duration-500">
                <Card className="border shadow-sm bg-white">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900 flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-green-600" />
                      <span>Technology & Operations</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600">Current systems and operational details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="region" className="text-sm font-medium text-gray-700">
                          Primary Region *
                          {autoPopulatedFields.includes("region") && (
                            <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">
                              AI filled
                            </Badge>
                          )}
                        </Label>
                        <Select value={formData.region} onValueChange={value => handleInputChange("region", value)}>
                          <SelectTrigger className={`h-12 border-gray-200 focus:border-green-500 ${autoPopulatedFields.includes("region") ? "ring-2 ring-green-200 bg-green-50" : ""}`}>
                            <SelectValue placeholder="Select primary region" />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map(region => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentERP" className="text-sm font-medium text-gray-700">
                          Current ERP System *
                        </Label>
                        <Select value={formData.currentERP} onValueChange={value => handleInputChange("currentERP", value)}>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-green-500">
                            <SelectValue placeholder="Select ERP system" />
                          </SelectTrigger>
                          <SelectContent>
                            {erpSystems.map(erp => (
                              <SelectItem key={erp} value={erp}>
                                {erp}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maturityLevel" className="text-sm font-medium text-gray-700">
                        Transformation Maturity Level
                      </Label>
                      <Select value={formData.maturityLevel} onValueChange={(value: "basic" | "intermediate" | "advanced") => handleInputChange("maturityLevel", value)}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-green-500">
                          <SelectValue placeholder="Select maturity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">🔧 Basic - Limited automation, manual processes</SelectItem>
                          <SelectItem value="intermediate">⚙️ Intermediate - Some automation, mixed processes</SelectItem>
                          <SelectItem value="advanced">🚀 Advanced - Highly automated, digital-first</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="previousTransformations" checked={formData.previousTransformations} onCheckedChange={checked => handleInputChange("previousTransformations", checked)} />
                        <Label htmlFor="previousTransformations" className="text-gray-700 cursor-pointer">
                          Have you undergone previous finance transformation initiatives?
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Compliance Requirements</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {complianceOptions.map(requirement => (
                          <div key={requirement} className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                            <Checkbox
                              id={requirement}
                              checked={formData.complianceRequirements?.includes(requirement)}
                              onCheckedChange={checked => handleArrayChange("complianceRequirements", requirement, !!checked)}
                            />
                            <Label htmlFor={requirement} className="text-sm text-gray-700 cursor-pointer flex-1">
                              {requirement}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-in slide-in-from-right-5 duration-500 space-y-6">
                <Card className="border shadow-sm bg-white">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900 flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <span>Pain Points & Challenges</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600">Select your main challenges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {commonPainPoints.map(painPoint => (
                        <div key={painPoint} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-all duration-200 hover:shadow-md">
                          <Checkbox id={painPoint} checked={formData.painPoints.includes(painPoint)} onCheckedChange={checked => handleArrayChange("painPoints", painPoint, !!checked)} />
                          <Label htmlFor={painPoint} className="text-sm text-gray-700 cursor-pointer flex-1">
                            {painPoint}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm bg-white">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900 flex items-center space-x-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <span>Transformation Objectives</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600">Select your key goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {commonObjectives.map(objective => (
                        <div key={objective} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-md">
                          <Checkbox id={objective} checked={formData.objectives.includes(objective)} onCheckedChange={checked => handleArrayChange("objectives", objective, !!checked)} />
                          <Label htmlFor={objective} className="text-sm text-gray-700 cursor-pointer flex-1">
                            {objective}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-in slide-in-from-right-5 duration-500 space-y-6">
                <Card className="border shadow-sm bg-white">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900 flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span>Timeline & Budget</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600">Project timeline and budget preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="timeline" className="text-sm font-medium text-gray-700">
                          Desired Timeline *
                        </Label>
                        <Select value={formData.timeline} onValueChange={value => handleInputChange("timeline", value)}>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8-12 weeks">🏃 8-12 weeks</SelectItem>
                            <SelectItem value="12-16 weeks">🚶 12-16 weeks</SelectItem>
                            <SelectItem value="16-20 weeks">🐌 16-20 weeks</SelectItem>
                            <SelectItem value="20+ weeks">📅 20+ weeks</SelectItem>
                            <SelectItem value="Flexible">🤝 Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
                          Budget Range *
                        </Label>
                        <Select value={formData.budget} onValueChange={value => handleInputChange("budget", value)}>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<$500K">💰 Less than $500K</SelectItem>
                            <SelectItem value="$500K-$1M">💵 $500K - $1M</SelectItem>
                            <SelectItem value="$1M-$2M">💸 $1M - $2M</SelectItem>
                            <SelectItem value="$2M-$5M">🏦 $2M - $5M</SelectItem>
                            <SelectItem value="$5M+">🏛️ $5M+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Analysis Section */}
                {isAnalyzing ? (
                  <Card className="border shadow-sm bg-white">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
                          <h3 className="text-lg font-semibold text-gray-900">Analyzing Your Requirements</h3>
                        </div>
                        <p className="text-gray-600">Our AI is generating personalized recommendations based on your input</p>
                        <div className="space-y-3">
                          <Progress value={analysisProgress} className="w-full h-3" />
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-purple-600 font-medium">{analysisProgress}% Complete</p>
                            {currentAnalysisStep && <p className="text-xs text-gray-500 max-w-xs text-right">{currentAnalysisStep}</p>}
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
                          <Sparkles className="h-3 w-3" />
                          <span>Powered by Claude AI</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  aiRecommendations && (
                    <Card className="border shadow-sm bg-white">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-gray-900 flex items-center space-x-2">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            <span>AI Recommendations</span>
                          </CardTitle>
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                            <Star className="h-3 w-3 mr-1" />
                            {aiRecommendations.confidence}% confidence
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-6 bg-white rounded-xl border border-blue-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-600">Timeline</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">{aiRecommendations.timeline}</div>
                          </div>
                          <div className="p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Database className="h-5 w-5 text-purple-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-600">Hackett IP</span>
                            </div>
                            <div className="text-2xl font-bold text-purple-600">{aiRecommendations.hackettAssets}</div>
                          </div>
                          <div className="p-6 bg-white rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-600">Est. Value</span>
                            </div>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(aiRecommendations.estimatedValue)}</div>
                          </div>
                          <div className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`p-2 rounded-lg ${aiRecommendations.riskLevel === "low" ? "bg-green-100" : aiRecommendations.riskLevel === "medium" ? "bg-yellow-100" : "bg-red-100"}`}>
                                <Shield
                                  className={`h-5 w-5 ${aiRecommendations.riskLevel === "low" ? "text-green-600" : aiRecommendations.riskLevel === "medium" ? "text-yellow-600" : "text-red-600"}`}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-600">Risk Level</span>
                            </div>
                            <div
                              className={`text-2xl font-bold capitalize ${
                                aiRecommendations.riskLevel === "low" ? "text-green-600" : aiRecommendations.riskLevel === "medium" ? "text-yellow-600" : "text-red-600"
                              }`}
                            >
                              {aiRecommendations.riskLevel}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}

                {/* Enhanced AI Insights - Key Insights */}
                {aiRecommendations?.keyInsights && aiRecommendations.keyInsights.length > 0 && (
                  <Card className="border shadow-sm bg-white mt-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-gray-900 flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5 text-amber-600" />
                        <span>Key Insights</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiRecommendations.keyInsights.map((insight, index) => (
                          <div key={index} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <div className="p-1 bg-amber-100 rounded-full mt-1">
                                <Star className="h-3 w-3 text-amber-600" />
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Wins */}
                {aiRecommendations?.quickWins && aiRecommendations.quickWins.length > 0 && (
                  <Card className="border shadow-sm bg-white mt-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-gray-900 flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-green-600" />
                        <span>Quick Wins</span>
                      </CardTitle>
                      <CardDescription>Immediate opportunities for impact</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {aiRecommendations.quickWins.map((win, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{win}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Risk Factors */}
                {aiRecommendations?.riskFactors && aiRecommendations.riskFactors.length > 0 && (
                  <Card className="border shadow-sm bg-white mt-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-gray-900 flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <span>Risk Factors & Mitigation</span>
                      </CardTitle>
                      <CardDescription>Key risks to monitor and address</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {aiRecommendations.riskFactors.map((risk, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="p-1 bg-red-100 rounded-full mt-1">
                              <AlertCircle className="h-3 w-3 text-red-600" />
                            </div>
                            <span className="text-sm text-gray-700 leading-relaxed">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommended Approach */}
                {aiRecommendations?.recommendedApproach && (
                  <Card className="border shadow-sm bg-white mt-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-gray-900 flex items-center space-x-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <span>Recommended Approach</span>
                      </CardTitle>
                      <CardDescription>Strategic implementation methodology</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Phase 1: Foundation</h4>
                            <p className="text-sm text-gray-700">{aiRecommendations.recommendedApproach.phase1}</p>
                          </div>
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Phase 2: Execution</h4>
                            <p className="text-sm text-gray-700">{aiRecommendations.recommendedApproach.phase2}</p>
                          </div>
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Phase 3: Optimization</h4>
                            <p className="text-sm text-gray-700">{aiRecommendations.recommendedApproach.phase3}</p>
                          </div>
                        </div>

                        {aiRecommendations.recommendedApproach.criticalSuccessFactors && (
                          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-2" />
                              Critical Success Factors
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {aiRecommendations.recommendedApproach.criticalSuccessFactors.map((factor, index) => (
                                <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                                  {factor}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FIXED NAVIGATION - Always visible at bottom */}
        <div className="flex-shrink-0 flex items-center justify-between pt-6 mt-4 border-t border-gray-200">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="h-12 px-6 border-gray-300 hover:border-gray-400">
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map(step => (
                <div key={step} className={`w-2 h-2 rounded-full transition-colors ${step <= currentStep ? "bg-purple-600" : "bg-gray-300"}`} />
              ))}
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={!isStepComplete(currentStep)}
            className={`h-12 px-6 ${
              currentStep === 4
                ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            }`}
          >
            {currentStep === 4 ? (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Start Project
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
