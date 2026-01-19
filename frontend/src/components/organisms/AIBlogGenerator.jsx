import { useState } from "react";
import { Sparkles, RefreshCw, Copy, Check } from "lucide-react";
import Button from "@/components/atoms/FormSubmitBtn";
import useAIGeneration from "@/hooks/useAIGeneration";
import { useToast } from "@/utils/context/ToastContext";

const AIBlogGenerator = ({ onInsert }) => {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [keywords, setKeywords] = useState("");
  const [copied, setCopied] = useState(false);

  const { generateBlog, isGenerating, generatedContent, error } =
    useAIGeneration();
  const { showToast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast("Please enter a topic or prompt", "error");
      return;
    }

    try {
      await generateBlog({
        prompt: prompt.trim(),
        tone,
        length,
        keywords: keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      });
      showToast("Blog generated successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to generate blog", "error");
    }
  };

  const handleInsert = () => {
    if (generatedContent) {
      onInsert(generatedContent);
      showToast("Content inserted into editor", "success");
    }
  };

  const handleCopy = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      showToast("Content copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Topic / Prompt *
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Write a blog about the benefits of React hooks for beginners"
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
            disabled={isGenerating}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={isGenerating}
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="technical">Technical</option>
              <option value="creative">Creative</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Length
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={isGenerating}
            >
              <option value="short">Short (~300 words)</option>
              <option value="medium">Medium (~600 words)</option>
              <option value="long">Long (~1000 words)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Keywords (optional)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="React, hooks, useState, useEffect (comma-separated)"
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
            disabled={isGenerating}
          />
        </div>

        <Button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="!m-0 !w-full px-6 py-3 rounded-lg bg-primary hover:brightness-110 text-white font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate with AI
            </>
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500">
          {error}
        </div>
      )}

      {/* Generated Content Preview */}
      {generatedContent && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text">
              Generated Content
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-card-muted transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-text-secondary" />
                )}
              </button>
            </div>
          </div>

          <div
            className="p-4 rounded-lg border border-border bg-card-soft max-h-96 overflow-y-auto prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: generatedContent }}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleInsert}
              className="!m-0 !w-auto flex-1 px-6 py-3 rounded-lg bg-primary hover:brightness-110 text-white font-medium transition-all duration-200"
            >
              Insert into Editor
            </Button>
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="!m-0 !w-auto px-6 py-3 rounded-lg border border-border bg-card-muted hover:bg-card text-text font-medium transition-all duration-200 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBlogGenerator;
