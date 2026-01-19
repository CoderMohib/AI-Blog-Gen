import { useState } from "react";
import api from "@/utils/Api/axiosInstance";

const useAIGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [error, setError] = useState(null);

  const generateBlog = async ({
    prompt,
    tone = "professional",
    length = "medium",
    keywords = [],
  }) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await api.post("/api/ai/generate-blog", {
        prompt,
        tone,
        length,
        keywords,
      });

      setGeneratedContent(response.data.content);
      return response.data.content;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Failed to generate blog content";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerate = async (previousPrompt) => {
    return generateBlog(previousPrompt);
  };

  const clearGenerated = () => {
    setGeneratedContent("");
    setError(null);
  };

  return {
    generateBlog,
    isGenerating,
    generatedContent,
    error,
    regenerate,
    clearGenerated,
  };
};

export default useAIGeneration;
