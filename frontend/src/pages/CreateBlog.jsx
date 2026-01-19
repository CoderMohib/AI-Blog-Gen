import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PenTool, Sparkles, Save, Eye, Upload, X } from "lucide-react";
import { useToast } from "@/utils/context/ToastContext";
import api from "@/utils/Api/axiosInstance";
import RichTextEditor from "@/components/organisms/RichTextEditor";
import AIBlogGenerator from "@/components/organisms/AIBlogGenerator";
import useRichTextEditor from "@/hooks/useRichTextEditor";
import "@/styles/editor.css";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    tags: "",
    status: "draft",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("manual"); // "manual" or "ai"
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Initialize rich text editor
  const { editor, wordCount, characterCount, setContent } = useRichTextEditor();

  // Check URL params for tab
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "ai") {
      setActiveTab("ai");
    }
  }, [searchParams]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAIInsert = (content) => {
    if (editor) {
      setContent(content);
      setActiveTab("manual");
      showToast("AI content inserted into editor", "success");
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const response = await api.post(
        "/api/blogs/upload-image",
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setFormData((prev) => ({
        ...prev,
        image: response.data.imageUrl,
      }));

      showToast("Image uploaded successfully!", "success");
    } catch (error) {
      showToast("Failed to upload image", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("Title is required", "error");
      return;
    }

    const content = editor ? editor.getHTML() : "";
    if (!content.trim() || content === "<p></p>") {
      showToast("Content is required", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/api/blogs/create", {
        ...formData,
        content,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      });

      showToast("Blog created successfully!", "success");
      navigate(`/blog/${response.data.blog._id}`);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to create blog",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-xl flex-shrink-0">
              <PenTool className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text truncate">
                Create New Blog
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary hidden sm:block">
                Write manually or generate with AI
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-border rounded-lg hover:bg-card-muted transition-colors text-sm flex-shrink-0"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isPreviewMode ? "Edit" : "Preview"}
            </span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter an engaging title for your blog..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg bg-card text-text placeholder:text-text-secondary"
                required
              />
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-2">
                Excerpt (Optional)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                placeholder="Brief description of your blog (shown in previews)..."
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card text-text placeholder:text-text-secondary resize-none"
              />
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="React, JavaScript, Web Development (comma-separated)"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card text-text placeholder:text-text-secondary"
              />
            </div>

            {/* Featured Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-2">
                Featured Image
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-card-soft">
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
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary mb-2">
                      Upload a featured image
                    </p>
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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 cursor-pointer transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-4 sm:mb-6">
              <div className="flex gap-1 sm:gap-2 border-b border-border overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("manual")}
                  className={`px-3 sm:px-4 py-2 font-medium transition-colors text-sm sm:text-base whitespace-nowrap flex items-center gap-1 sm:gap-2 ${
                    activeTab === "manual"
                      ? "text-primary border-b-2 border-primary"
                      : "text-text-secondary hover:text-text"
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Manual Editor</span>
                  <span className="xs:hidden">Manual</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className={`px-3 sm:px-4 py-2 font-medium transition-colors text-sm sm:text-base whitespace-nowrap flex items-center gap-1 sm:gap-2 ${
                    activeTab === "ai"
                      ? "text-primary border-b-2 border-primary"
                      : "text-text-secondary hover:text-text"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">AI Generator</span>
                  <span className="xs:hidden">AI</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="mb-6">
              {activeTab === "manual" ? (
                isPreviewMode ? (
                  <div className="min-h-[400px] p-6 border border-border rounded-lg bg-card-soft">
                    <div
                      className="prose prose-sm sm:prose lg:prose-lg max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: editor ? editor.getHTML() : "",
                      }}
                    />
                  </div>
                ) : (
                  <RichTextEditor
                    editor={editor}
                    wordCount={wordCount}
                    characterCount={characterCount}
                  />
                )
              ) : (
                <div className="p-6 border border-border rounded-lg bg-card">
                  <AIBlogGenerator onInsert={handleAIInsert} />
                </div>
              )}
            </div>

            {/* Status and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-border">
              <div className="flex items-center gap-2 sm:gap-4">
                <label className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-text">
                    Status:
                  </span>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card text-text"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>

              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate("/my-blogs")}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg hover:bg-card-muted transition-colors text-text font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-primary text-white rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden xs:inline">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span className="hidden xs:inline">Save Blog</span>
                      <span className="xs:hidden">Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
