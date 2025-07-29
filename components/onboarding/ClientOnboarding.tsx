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

interface ClientOnboardingProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: ClientOnboarding) => void;
}

export const ClientOnboardingModal: React.FC<ClientOnboardingProps> = ({ isVisible, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ClientOnboarding>({
    companyName: "",
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
  } | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

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

  const handleInputChange = (field: keyof ClientOnboarding, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    // Simulate realistic AI analysis progress
    const progressSteps = [
      { progress: 15, message: "Analyzing company profile..." },
      { progress: 35, message: "Evaluating industry benchmarks..." },
      { progress: 55, message: "Calculating risk factors..." },
      { progress: 75, message: "Matching Hackett IP assets..." },
      { progress: 90, message: "Generating recommendations..." },
      { progress: 100, message: "Analysis complete!" },
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step.progress);
    }

    // Generate recommendations based on form data
    const baseTimeline = formData.maturityLevel === "basic" ? 20 : formData.maturityLevel === "advanced" ? 14 : 16;
    const complexityFactor = formData.painPoints.length > 6 ? 1.2 : formData.painPoints.length < 3 ? 0.8 : 1.0;
    const estimatedWeeks = Math.round(baseTimeline * complexityFactor);
    const hackettAssets = 1200;
    const estimatedValue = 6000000;
    const riskLevel = formData.previousTransformations ? "low" : formData.maturityLevel === "basic" ? "high" : "medium";

    setAIRecommendations({
      timeline: `${estimatedWeeks} weeks`,
      hackettAssets,
      estimatedValue,
      riskLevel,
      confidence: 92,
    });

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                          Company Name *
                        </Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={e => handleInputChange("companyName", e.target.value)}
                          placeholder="Enter your company name"
                          className="h-12 border-gray-200 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
                          Industry *
                        </Label>
                        <Select value={formData.industry} onValueChange={value => handleInputChange("industry", value)}>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
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
                        </Label>
                        <Select value={formData.revenue} onValueChange={value => handleInputChange("revenue", value)}>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
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
                        </Label>
                        <Select value={formData.employees} onValueChange={value => handleInputChange("employees", value)}>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
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
                        </Label>
                        <Select value={formData.region} onValueChange={value => handleInputChange("region", value)}>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-green-500">
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
                        <p className="text-gray-600">Generating personalized recommendations based on your input</p>
                        <div className="space-y-2">
                          <Progress value={analysisProgress} className="w-full h-2" />
                          <p className="text-sm text-purple-600 font-medium">{analysisProgress}% Complete</p>
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
