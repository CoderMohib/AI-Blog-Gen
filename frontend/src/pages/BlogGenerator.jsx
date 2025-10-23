import React, { useState } from "react";
import { PenTool, Sparkles, Download, Copy, Share2 } from "lucide-react";
import { useToast } from "@/utils/context/ToastContext";
import api from "@/utils/Api/axiosInstance";

const BlogGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState("");
  const { showToast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast("Please enter a blog topic or prompt", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/api/blogs/ai-generate", {
        topic: prompt,
        tone: "professional",
        length: "medium"
      });
      
      const { title, content, excerpt, tags } = response.data.blog;
      
      setGeneratedBlog(`
# ${title}

${excerpt ? `> ${excerpt}` : ''}

${content}

## Tags
${tags ? tags.map(tag => `#${tag}`).join(' ') : ''}
      `);
      showToast("Blog generated successfully!", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to generate blog. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedBlog);
    showToast("Blog copied to clipboard!", "success");
  };

  const handleDownload = () => {
    const blob = new Blob([generatedBlog], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prompt.toLowerCase().replace(/\s+/g, '-')}-blog.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Blog downloaded!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <PenTool className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Blog Generator</h1>
          <p className="text-muted-foreground">Create engaging blog posts with AI assistance</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-card p-6 rounded-lg border">
        <label htmlFor="prompt" className="block text-sm font-medium mb-2">
          What would you like to write about?
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your blog topic, keywords, or specific requirements..."
          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          rows={4}
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="mt-4 flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Blog
            </>
          )}
        </button>
      </div>

      {/* Generated Blog */}
      {generatedBlog && (
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Generated Blog</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-x-auto">
              {generatedBlog}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogGenerator;
