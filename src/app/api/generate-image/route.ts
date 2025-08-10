import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = "1024x1024", quality = "standard", style = "vivid" } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Azure OpenAI configuration is missing. Please set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY environment variables." },
        { status: 500 }
      );
    }

    // Validate size parameter
    const validSizes = ["1024x1024", "1024x1792", "1792x1024"];
    if (!validSizes.includes(size)) {
      return NextResponse.json(
        { error: "Invalid size. Must be one of: 1024x1024, 1024x1792, 1792x1024" },
        { status: 400 }
      );
    }

    // Validate quality parameter
    const validQualities = ["standard", "hd"];
    if (!validQualities.includes(quality)) {
      return NextResponse.json(
        { error: "Invalid quality. Must be 'standard' or 'hd'" },
        { status: 400 }
      );
    }

    // Validate style parameter
    const validStyles = ["vivid", "natural"];
    if (!validStyles.includes(style)) {
      return NextResponse.json(
        { error: "Invalid style. Must be 'vivid' or 'natural'" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_API_KEY,
        },
        body: JSON.stringify({
          prompt: prompt,
          n: 1,
          size: size,
          quality: quality,
          style: style
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Azure OpenAI API error:", errorData);
      
      let errorMessage = "Failed to generate image";
      try {
        const errorJson = JSON.parse(errorData);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch {
        // If we can't parse the error, use the default message
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageUrl: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt || prompt
    });

  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 