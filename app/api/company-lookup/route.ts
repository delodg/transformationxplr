import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { companyIdentifier, companyName } = await req.json();

    if (!companyIdentifier && !companyName) {
      return NextResponse.json({ error: "Company identifier or name is required" }, { status: 400 });
    }

    // Check if API key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("❌ ANTHROPIC_API_KEY environment variable is not set");
      console.log("💡 To enable AI company lookup, add ANTHROPIC_API_KEY to your .env.local file");
      console.log("💡 You can get an API key from: https://console.anthropic.com/");
      // Return a fallback response instead of failing
      return NextResponse.json({
        success: true,
        data: {
          companyName: companyName || companyIdentifier || "Unknown Company",
          industry: "Technology",
          revenue: "$100M-$500M",
          employees: "1,000-5,000",
          region: "North America",
          confidence: 30,
          publiclyTraded: false,
          description: "Company information populated with default values (AI lookup unavailable).",
        },
      });
    }

    // Use Claude AI to research company information
    const prompt = `
You are a business intelligence assistant. Research and provide information about the following company:

Company Identifier/Number: ${companyIdentifier || "Not provided"}
Company Name: ${companyName || "Not provided"}

Please provide the following information in JSON format:
{
  "companyName": "Official company name",
  "industry": "Primary industry (choose from: Infrastructure & Construction, Manufacturing, Financial Services, Healthcare, Technology, Retail, Energy & Utilities, Telecommunications, Transportation, Government)",
  "revenue": "Annual revenue range (choose from: <$10M, $10M-$50M, $50M-$100M, $100M-$500M, $500M-$1B, $1B+)",
  "employees": "Employee count range (choose from: <1,000, 1,000-5,000, 5,000-10,000, 10,000-50,000, 50,000+)",
  "region": "Primary region (choose from: North America, Europe, Asia Pacific, Latin America, Middle East & Africa, Global)",
  "confidence": "Confidence level from 0-100 for the accuracy of this information",
  "publiclyTraded": "true/false if it's a publicly traded company",
  "description": "Brief company description"
}

If you cannot find specific information, make reasonable estimates based on the company name, industry, and any identifiers provided. Always provide your best estimate rather than leaving fields empty.

Important: Only respond with valid JSON, no additional text or explanations.
`;

    // Call Claude API
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", // Updated to Claude Sonnet 4
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error("Claude API error:", errorText);
      console.error("Response status:", claudeResponse.status);

      // Return fallback response instead of throwing error
      return NextResponse.json({
        success: true,
        data: {
          companyName: companyName || companyIdentifier || "Unknown Company",
          industry: "Technology",
          revenue: "$100M-$500M",
          employees: "1,000-5,000",
          region: "North America",
          confidence: 25,
          publiclyTraded: false,
          description: "Company information populated with default values (AI service temporarily unavailable).",
        },
      });
    }

    const claudeData = await claudeResponse.json();
    const aiResponse = claudeData.content[0].text;

    // Parse the AI response as JSON
    let companyInfo;
    try {
      companyInfo = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", aiResponse);
      // Fallback response if AI doesn't return valid JSON
      companyInfo = {
        companyName: companyName || companyIdentifier || "Unknown Company",
        industry: "Technology",
        revenue: "$100M-$500M",
        employees: "1,000-5,000",
        region: "North America",
        confidence: 30,
        publiclyTraded: false,
        description: "Company information could not be determined automatically.",
      };
    }

    // Validate that required fields are present and in correct format
    const validIndustries = [
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

    const validRevenues = ["<$10M", "$10M-$50M", "$50M-$100M", "$100M-$500M", "$500M-$1B", "$1B+"];
    const validEmployees = ["<1,000", "1,000-5,000", "5,000-10,000", "10,000-50,000", "50,000+"];
    const validRegions = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa", "Global"];

    // Validate and fix industry
    if (!validIndustries.includes(companyInfo.industry)) {
      companyInfo.industry = "Technology"; // Default fallback
    }

    // Validate and fix revenue
    if (!validRevenues.includes(companyInfo.revenue)) {
      companyInfo.revenue = "$100M-$500M"; // Default fallback
    }

    // Validate and fix employees
    if (!validEmployees.includes(companyInfo.employees)) {
      companyInfo.employees = "1,000-5,000"; // Default fallback
    }

    // Validate and fix region
    if (!validRegions.includes(companyInfo.region)) {
      companyInfo.region = "North America"; // Default fallback
    }

    console.log("✅ Company lookup successful:", companyInfo);

    return NextResponse.json({
      success: true,
      data: companyInfo,
    });
  } catch (error) {
    console.error("❌ Company lookup error:", error);

    // Return fallback response instead of error status to keep UX smooth
    return NextResponse.json({
      success: true,
      data: {
        companyName: "Unknown Company",
        industry: "Technology",
        revenue: "$100M-$500M",
        employees: "1,000-5,000",
        region: "North America",
        confidence: 20,
        publiclyTraded: false,
        description: "Company information populated with default values (service temporarily unavailable).",
      },
    });
  }
}
