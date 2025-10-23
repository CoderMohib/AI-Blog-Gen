import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenTool, Sparkles, Save, Eye, Upload, X, Wand2 } from "lucide-react";
import { useToast } from "@/utils/context/ToastContext";
import api from "@/utils/Api/axiosInstance";
import RichTextEditor from "@/components/organisms/RichTextEditor";
import AIGenerator from "@/components/organisms/AIGenerator";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    status: "draft",
    image: null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAIGenerate = (aiContent) => {
    setFormData(prev => ({
      ...prev,
      title: aiContent.title || prev.title,
      content: aiContent.content || prev.content,
      excerpt: aiContent.excerpt || prev.excerpt,
      tags: aiContent.tags ? aiContent.tags.join(", ") : prev.tags,
    }));
    setShowAIGenerator(false);
    showToast("AI content generated successfully!", "success");
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await api.post("/api/blogs/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setFormData(prev => ({
        ...prev,
        image: response.data.imageUrl
      }));
      
      showToast("Image uploaded successfully!", "success");
    } catch (error) {
      showToast("Failed to upload image", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast("Title and content are required", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await api.post("/api/blogs/create", {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      });
      
      showToast("Blog created successfully!", "success");
      navigate(`/blog/${response.data.blog._id}`);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create blog", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <PenTool className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Create New Blog</h1>
            <p className="text-muted-foreground">Share your thoughts with the world</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowAIGenerator(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
          >
            <Wand2 className="w-4 h-4" />
            AI Generate
          </button>
          
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted"
          >
            <Eye className="w-4 h-4" />
            {isPreviewMode ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {/* AI Generator Modal */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI Blog Generator
                </h2>
                <button
                  onClick={() => setShowAIGenerator(false)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <AIGenerator onGenerate={handleAIGenerate} />
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card p-6 rounded-lg border">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Blog Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter your blog title..."
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg"
              required
            />
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Excerpt (Optional)</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              placeholder="Brief description of your blog..."
              rows={3}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="Enter tags separated by commas..."
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Featured Image</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {formData.image ? (
                <div className="space-y-4">
                  <img
                    src={formData.image}
                    alt="Blog preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange("image", null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Upload a featured image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Image
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Content</label>
            {isPreviewMode ? (
              <div className="min-h-[400px] p-4 border rounded-lg bg-muted/20">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </div>
            ) : (
              <RichTextEditor
                value={formData.content}
                onChange={(content) => handleInputChange("content", content)}
                placeholder="Write your blog content here..."
              />
            )}
          </div>

          {/* Status and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate("/my-blogs")}
                className="px-6 py-2 border rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Blog
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;

