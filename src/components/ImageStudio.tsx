"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { ShareButton } from "./ui/Share";
import { Download, Loader2, Wand2, RefreshCw, Share2, Sparkles } from "lucide-react";

interface GenerationSettings {
  size: "1024x1024" | "1024x1792" | "1792x1024";
  quality: "standard" | "hd";
  style: "vivid" | "natural";
}

// Web3-themed prompt suggestions
const web3Prompts = [
  {
    emoji: "🚀",
    title: "NFT Collection Art",
    prompt: "A vibrant NFT collection featuring futuristic digital creatures with holographic effects, neon colors, and blockchain-inspired geometric patterns"
  },
  {
    emoji: "⚡",
    title: "DeFi Visualization", 
    prompt: "An abstract representation of decentralized finance with flowing digital currencies, interconnected nodes, and glowing smart contracts in a cyberpunk style"
  },
  {
    emoji: "🌐",
    title: "Metaverse Scene",
    prompt: "A stunning metaverse landscape with floating digital islands, virtual reality elements, avatar characters, and immersive Web3 technology"
  },
  {
    emoji: "💎",
    title: "Crypto Trading",
    prompt: "A dynamic crypto trading scene with charts, candlesticks, Bitcoin and Ethereum symbols floating in a high-tech digital environment with blue and gold accents"
  }
];

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [revisedPrompt, setRevisedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<GenerationSettings>({
    size: "1024x1024",
    quality: "standard",
    style: "vivid",
  });

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError("");
    setImageUrl("");
    setRevisedPrompt("");

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          ...settings
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImageUrl(data.imageUrl);
      setRevisedPrompt(data.revisedPrompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setError("Failed to download image");
    }
  };

  const clearAll = () => {
    setPrompt("");
    setImageUrl("");
    setRevisedPrompt("");
    setError("");
  };

  const usePromptSuggestion = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Wand2 className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Image Studio
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Create stunning images with AI using Azure OpenAI DALL-E 3
        </p>
      </div>

      {/* Web3 Prompt Suggestions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900 dark:text-purple-100">Web3 Prompt Suggestions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {web3Prompts.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => usePromptSuggestion(suggestion.prompt)}
              className="text-left p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-purple-200/50 dark:border-purple-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{suggestion.emoji}</span>
                <span className="font-medium text-sm text-purple-900 dark:text-purple-100 group-hover:text-purple-700 dark:group-hover:text-purple-200">
                  {suggestion.title}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {suggestion.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Describe your image
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A serene landscape with mountains, a lake, and colorful sunset sky..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none transition-colors"
              rows={4}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {prompt.length}/1000 characters
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">Generation Settings</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image Size
                </label>
                <select
                  value={settings.size}
                  onChange={(e) => setSettings({...settings, size: e.target.value as GenerationSettings['size']})}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="1024x1024">Square (1024×1024)</option>
                  <option value="1024x1792">Portrait (1024×1792)</option>
                  <option value="1792x1024">Landscape (1792×1024)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quality
                </label>
                <select
                  value={settings.quality}
                  onChange={(e) => setSettings({...settings, quality: e.target.value as GenerationSettings['quality']})}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="standard">Standard</option>
                  <option value="hd">HD (Higher Quality)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Style
                </label>
                <select
                  value={settings.style}
                  onChange={(e) => setSettings({...settings, style: e.target.value as GenerationSettings['style']})}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="vivid">Vivid (Dramatic, saturated)</option>
                  <option value="natural">Natural (More realistic)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={generateImage}
              disabled={isLoading || !prompt.trim()}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-3" />
                  <span>Generate Image</span>
                </>
              )}
            </Button>
            
            {(imageUrl || prompt || error) && (
              <Button
                onClick={clearAll}
                className="w-full h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 font-medium transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                <span>Clear & Start Over</span>
              </Button>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
              <div className="font-medium">Error</div>
              <div className="text-sm mt-1">{error}</div>
            </div>
          )}

          {imageUrl && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Generated image"
                  className="w-full rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                />
                <Button
                  onClick={downloadImage}
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-lg border border-gray-300 dark:border-gray-600"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              {revisedPrompt && revisedPrompt !== prompt && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="text-xs font-medium text-blue-800 dark:text-blue-400 mb-1">
                    Revised Prompt:
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    {revisedPrompt}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {/* Share Button */}
                <ShareButton
                  buttonText="Share on Farcaster"
                  cast={{
                    text: `Just created this amazing AI-generated image! 🎨✨\n\nPrompt: "${prompt.slice(0, 100)}${prompt.length > 100 ? '...' : ''}"\n\nCreated with AI Image Studio 🚀`,
                    embeds: [
                      {
                        imageUrl: async () => imageUrl,
                        url: imageUrl
                      }
                    ]
                  }}
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                />
                
                {/* Action Buttons Row */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => window.open(imageUrl, '_blank')}
                    className="h-11 bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                  >
                    <span className="text-lg">👁️</span>
                    <span className="hidden sm:inline">View</span>
                  </Button>
                  
                  <Button
                    onClick={downloadImage}
                    className="h-11 bg-green-500 hover:bg-green-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setImageUrl("");
                      setRevisedPrompt("");
                      setError("");
                    }}
                    className="h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Retry</span>
                  </Button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => {
                      if (navigator.share && imageUrl) {
                        navigator.share({
                          title: 'AI Generated Image',
                          text: `Check out this AI-generated image: ${prompt.slice(0, 50)}...`,
                          url: imageUrl
                        }).catch(() => {
                          // Fallback to copy URL
                          navigator.clipboard.writeText(imageUrl);
                        });
                      } else {
                        navigator.clipboard.writeText(imageUrl);
                      }
                    }}
                    className="flex-1 h-9 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium border border-gray-300 dark:border-gray-600 transition-all duration-200"
                  >
                    📋 Copy Link
                  </Button>
                  
                  <Button
                    onClick={() => {
                      const newPrompt = prompt + " with different style and composition";
                      setPrompt(newPrompt);
                    }}
                    className="flex-1 h-9 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium border border-gray-300 dark:border-gray-600 transition-all duration-200"
                  >
                    🎲 Remix
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!imageUrl && !error && !isLoading && (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Wand2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Your generated image will appear here</p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="text-center text-purple-600 dark:text-purple-400">
                <Loader2 className="w-12 h-12 mx-auto mb-2 animate-spin" />
                <p>Creating your image...</p>
                <p className="text-sm opacity-75 mt-1">This may take 10-30 seconds</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 