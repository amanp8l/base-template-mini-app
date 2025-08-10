# AI Image Studio Setup Guide

This project includes an AI Image Studio that allows users to generate stunning images using Azure OpenAI's DALL-E 3 model.

## Prerequisites

1. **Azure OpenAI Resource**: You need an Azure OpenAI resource with DALL-E 3 model deployed.
2. **API Access**: Ensure you have API access to the DALL-E 3 model in your Azure region.

## Environment Variables

Create a `.env.local` file in your project root and add the following variables:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT="https://your-resource-name.openai.azure.com"
AZURE_OPENAI_API_KEY="your-api-key-here"

# Next.js Configuration
NEXT_PUBLIC_URL="http://localhost:3000"
```

### Getting Your Azure OpenAI Credentials

1. **Azure OpenAI Endpoint**:
   - Go to the [Azure Portal](https://portal.azure.com)
   - Navigate to your Azure OpenAI resource
   - Copy the endpoint URL from the "Keys and Endpoint" section
   - Format: `https://your-resource-name.openai.azure.com`

2. **Azure OpenAI API Key**:
   - In the same "Keys and Endpoint" section
   - Copy either Key 1 or Key 2

## DALL-E 3 Model Deployment

Make sure you have DALL-E 3 model deployed in your Azure OpenAI resource:

1. Go to Azure OpenAI Studio
2. Navigate to "Deployments"
3. Create a new deployment with:
   - Model: `dall-e-3`
   - Deployment name: `dall-e-3` (or update the API route if using a different name)

## Features

The AI Image Studio includes:

- **Image Generation**: Create images from text prompts using DALL-E 3
- **Size Options**: Choose from multiple image sizes (1024x1024, 1024x1792, 1792x1024)
- **Quality Settings**: Standard or HD quality options
- **Style Options**: Vivid (dramatic) or Natural (realistic) styles
- **Download**: Download generated images
- **Revised Prompts**: See how DALL-E 3 interpreted your prompt

## Usage

1. Start the development server: `npm run dev`
2. Navigate to the AI Studio tab in the application
3. Enter a descriptive prompt for your image
4. Adjust generation settings (size, quality, style)
5. Click "Generate Image"
6. Download or view your generated image

## API Endpoint

The image generation is handled by the `/api/generate-image` endpoint which:

- Validates input parameters
- Calls Azure OpenAI DALL-E 3 API
- Returns the generated image URL and revised prompt
- Handles errors gracefully

## Troubleshooting

### Common Issues:

1. **"Azure OpenAI configuration is missing"**
   - Ensure your environment variables are set correctly
   - Restart the development server after adding environment variables

2. **API Rate Limits**
   - DALL-E 3 has usage limits based on your Azure subscription
   - Check your Azure OpenAI usage quotas

3. **Model Not Available**
   - Ensure DALL-E 3 is deployed in your Azure OpenAI resource
   - Check that the deployment name matches the one in the API route

4. **Network Errors**
   - Verify your Azure OpenAI endpoint URL is correct
   - Check your API key is valid and hasn't expired

## Cost Considerations

- DALL-E 3 charges per image generated
- HD quality images cost more than standard quality
- Monitor your usage in the Azure Portal to manage costs

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API keys secure
- Consider using Azure Key Vault for production deployments 