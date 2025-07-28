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
import { Brain, Building, Users, DollarSign, Calendar, Target, Zap, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Sparkles, Database, Globe, Settings, FileText, Lightbulb } from "lucide-react";
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

    // Simulate AI analysis based on form data
    setTimeout(() => {
      const baseTimeline = formData.maturityLevel === "basic" ? 20 : formData.maturityLevel === "advanced" ? 14 : 16;

      const complexityFactor = formData.painPoints.length > 6 ? 1.2 : formData.painPoints.length < 3 ? 0.8 : 1.0;

      const estimatedWeeks = Math.round(baseTimeline * complexityFactor);

      const hackettAssets = 1200; // Fixed value instead of Math.floor(800 + Math.random() * 600);
      const estimatedValue = 6000000; // Fixed value instead of Math.floor((2 + Math.random() * 8) * 1000000);

      const riskLevel = formData.previousTransformations ? "low" : formData.maturityLevel === "basic" ? "high" : "medium";

      setAIRecommendations({
        timeline: `${estimatedWeeks} weeks`,
        hackettAssets,
        estimatedValue,
        riskLevel,
        confidence: 92, // Fixed value instead of Math.floor(85 + Math.random() * 10),
      });

      setIsAnalyzing(false);
    }, 2000);
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

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatCurrency = (value: number) => {
    // Use deterministic formatting to avoid hydration mismatches
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

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI-Powered Project Setup</span>
          </DialogTitle>
          <DialogDescription>Let's gather information about your organization to provide intelligent recommendations</DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="analytics-metric-card p-4 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step <= currentStep
                      ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg"
                      : step === currentStep + 1
                      ? "bg-purple-100 text-purple-600 border-2 border-purple-300"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div className="w-20 h-2 mx-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${step < currentStep ? "bg-gradient-to-r from-purple-600 to-purple-700" : "bg-gray-200"}`}
                      style={{ width: step < currentStep ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-sm">
            <span className={currentStep >= 1 ? "text-purple-600 font-medium" : "text-gray-500"}>Company Info</span>
            <span className={currentStep >= 2 ? "text-purple-600 font-medium" : "text-gray-500"}>Requirements</span>
            <span className={currentStep >= 3 ? "text-purple-600 font-medium" : "text-gray-500"}>Objectives</span>
            <span className={currentStep >= 4 ? "text-purple-600 font-medium" : "text-gray-500"}>AI Analysis</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="analytics-chart-card">
              <div className="p-6 border-b border-gray-100">
                <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <span>Company Information</span>
                </h3>
                <p className="analytics-subtitle">Basic information about your organization</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input id="companyName" value={formData.companyName} onChange={e => handleInputChange("companyName", e.target.value)} placeholder="Enter company name" />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={formData.industry} onValueChange={value => handleInputChange("industry", value)}>
                      <SelectTrigger>
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
                  <div>
                    <Label htmlFor="revenue">Annual Revenue *</Label>
                    <Select value={formData.revenue} onValueChange={value => handleInputChange("revenue", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select revenue range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<$100M">Less than $100M</SelectItem>
                        <SelectItem value="$100M-$500M">$100M - $500M</SelectItem>
                        <SelectItem value="$500M-$1B">$500M - $1B</SelectItem>
                        <SelectItem value="$1B-$5B">$1B - $5B</SelectItem>
                        <SelectItem value="$5B+">$5B+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="employees">Employee Count *</Label>
                    <Select value={formData.employees} onValueChange={value => handleInputChange("employees", value)}>
                      <SelectTrigger>
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
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="analytics-chart-card">
              <div className="p-6 border-b border-gray-100">
                <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                  <span>Technology & Operations</span>
                </h3>
                <p className="analytics-subtitle">Information about your current systems and operations</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">Primary Region *</Label>
                    <Select value={formData.region} onValueChange={value => handleInputChange("region", value)}>
                      <SelectTrigger>
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
                  <div>
                    <Label htmlFor="currentERP">Current ERP System *</Label>
                    <Select value={formData.currentERP} onValueChange={value => handleInputChange("currentERP", value)}>
                      <SelectTrigger>
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

                <div>
                  <Label htmlFor="maturityLevel">Transformation Maturity Level</Label>
                  <Select value={formData.maturityLevel} onValueChange={(value: "basic" | "intermediate" | "advanced") => handleInputChange("maturityLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select maturity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic - Limited automation, manual processes</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Some automation, mixed processes</SelectItem>
                      <SelectItem value="advanced">Advanced - Highly automated, digital-first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="previousTransformations" checked={formData.previousTransformations} onCheckedChange={checked => handleInputChange("previousTransformations", checked)} />
                  <Label htmlFor="previousTransformations">Have you undergone previous finance transformation initiatives?</Label>
                </div>

                <div>
                  <Label>Compliance Requirements</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {complianceOptions.map(requirement => (
                      <div key={requirement} className="flex items-center space-x-2">
                        <Checkbox
                          id={requirement}
                          checked={formData.complianceRequirements?.includes(requirement)}
                          onCheckedChange={checked => handleArrayChange("complianceRequirements", requirement, !!checked)}
                        />
                        <Label htmlFor={requirement} className="text-sm">
                          {requirement}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="analytics-chart-card">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <span>Pain Points & Challenges</span>
                  </h3>
                  <p className="analytics-subtitle">Select the main challenges your organization faces</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {commonPainPoints.map(painPoint => (
                      <div key={painPoint} className="flex items-center space-x-2">
                        <Checkbox id={painPoint} checked={formData.painPoints.includes(painPoint)} onCheckedChange={checked => handleArrayChange("painPoints", painPoint, !!checked)} />
                        <Label htmlFor={painPoint} className="text-sm">
                          {painPoint}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="analytics-chart-card">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <span>Transformation Objectives</span>
                  </h3>
                  <p className="analytics-subtitle">What are your key goals for this transformation?</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {commonObjectives.map(objective => (
                      <div key={objective} className="flex items-center space-x-2">
                        <Checkbox id={objective} checked={formData.objectives.includes(objective)} onCheckedChange={checked => handleArrayChange("objectives", objective, !!checked)} />
                        <Label htmlFor={objective} className="text-sm">
                          {objective}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="analytics-chart-card">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Timeline & Budget</span>
                  </h3>
                  <p className="analytics-subtitle">Project constraints and expectations</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timeline">Desired Timeline *</Label>
                      <Select value={formData.timeline} onValueChange={value => handleInputChange("timeline", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8-12 weeks">8-12 weeks</SelectItem>
                          <SelectItem value="12-16 weeks">12-16 weeks</SelectItem>
                          <SelectItem value="16-20 weeks">16-20 weeks</SelectItem>
                          <SelectItem value="20+ weeks">20+ weeks</SelectItem>
                          <SelectItem value="Flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="budget">Budget Range *</Label>
                      <Select value={formData.budget} onValueChange={value => handleInputChange("budget", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<$500K">Less than $500K</SelectItem>
                          <SelectItem value="$500K-$1M">$500K - $1M</SelectItem>
                          <SelectItem value="$1M-$2M">$1M - $2M</SelectItem>
                          <SelectItem value="$2M-$5M">$2M - $5M</SelectItem>
                          <SelectItem value="$5M+">$5M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              {isAnalyzing ? (
                <div className="analytics-chart-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <div className="p-8">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="p-3 bg-purple-500 rounded-xl">
                        <Brain className="h-6 w-6 text-white animate-pulse" />
                      </div>
                      <span className="text-lg font-semibold text-purple-800">AI is analyzing your requirements...</span>
                    </div>
                  </div>
                </div>
              ) : (
                aiRecommendations && (
                  <div className="analytics-chart-card bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                    <div className="p-6 border-b border-purple-100">
                      <div className="flex items-center justify-between">
                        <h3 className="analytics-title text-xl mb-2 flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                          </div>
                          <span>AI Recommendations</span>
                        </h3>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {aiRecommendations.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-600">Recommended Timeline</span>
                          </div>
                          <div className="text-lg font-bold text-blue-600">{aiRecommendations.timeline}</div>
                        </div>
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="flex items-center space-x-2 mb-2">
                            <Database className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-600">Hackett IP Matches</span>
                          </div>
                          <div className="text-lg font-bold text-purple-600">{aiRecommendations.hackettAssets}</div>
                        </div>
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-600">Estimated Value</span>
                          </div>
                          <div className="text-lg font-bold text-green-600">{formatCurrency(aiRecommendations.estimatedValue)}</div>
                        </div>
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle
                              className={`h-4 w-4 ${aiRecommendations.riskLevel === "low" ? "text-green-600" : aiRecommendations.riskLevel === "medium" ? "text-yellow-600" : "text-red-600"}`}
                            />
                            <span className="text-sm font-medium text-gray-600">Risk Level</span>
                          </div>
                          <div
                            className={`text-lg font-bold capitalize ${
                              aiRecommendations.riskLevel === "low" ? "text-green-600" : aiRecommendations.riskLevel === "medium" ? "text-yellow-600" : "text-red-600"
                            }`}
                          >
                            {aiRecommendations.riskLevel}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
          </div>
          <Button onClick={handleNext} disabled={!isStepComplete(currentStep)} className={currentStep === 4 ? "bg-purple-600 hover:bg-purple-700" : ""}>
            {currentStep === 4 ? "Start Project" : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
