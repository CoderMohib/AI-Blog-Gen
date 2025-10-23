import React, { useState } from "react";
import { Sparkles, Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/utils/context/ToastContext";
import api from "@/utils/Api/axiosInstance";

const AIGenerator = ({ onGenerate }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    topic: "",
    tone: "professional",
    length: "medium"
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      showToast("Please enter a topic", "error");
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await api.post("/api/blogs/ai-generate", formData);
      onGenerate(response.data.blog);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to generate blog", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-semibold">AI Blog Generator</h3>
        </div>
        <p className="text-muted-foreground">
          Enter a topic and let AI create a complete blog post for you
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            What would you like to write about?
          </label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => handleInputChange("topic", e.target.value)}
            placeholder="e.g., 'The Future of Artificial Intelligence', 'Healthy Cooking Tips', 'Remote Work Best Practices'"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            required
          />
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Writing Tone</label>
          <select
            value={formData.tone}
            onChange={(e) => handleInputChange("tone", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="academic">Academic</option>
            <option value="humorous">Humorous</option>
          </select>
        </div>

        {/* Length Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Blog Length</label>
          <select
            value={formData.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="short">Short (300-500 words)</option>
            <option value="medium">Medium (800-1200 words)</option>
            <option value="long">Long (1500-2000 words)</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Blog...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Blog Post
            </>
          )}
        </button>
      </form>

      {/* Tips */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">💡 Tips for better results:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Be specific about your topic</li>
          <li>• Include keywords you want to target</li>
          <li>• Mention your target audience</li>
          <li>• Specify the type of content (tutorial, opinion, news, etc.)</li>
        </ul>
      </div>
    </div>
  );
};

export default AIGenerator;

