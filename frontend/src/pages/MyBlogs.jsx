import React, { useState, useEffect } from "react";
import { FileText, Search, Filter, MoreVertical, Edit, Trash2, Eye, Calendar, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/utils/context/ToastContext";
import api from "@/utils/Api/axiosInstance";

const MyBlogs = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [filterStatus, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (searchTerm) params.append("search", searchTerm);
      
      const response = await api.get(`/api/blogs?${params.toString()}`);
      setBlogs(response.data.blogs);
    } catch (error) {
      showToast("Failed to load blogs", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      await api.delete(`/api/blogs/${blogId}`);
      setBlogs(prev => prev.filter(blog => blog._id !== blogId));
      showToast("Blog deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete blog", "error");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Blogs</h1>
            <p className="text-muted-foreground">Manage and organize your blog posts</p>
          </div>
        </div>
        
        <button
          onClick={() => navigate("/create-blog")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Create Blog
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-card p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Start creating your first blog post"}
            </p>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(blog.status)}`}>
                      {blog.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">{blog.excerpt || "No excerpt available"}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(blog.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {blog.views} views
                    </div>
                  </div>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate(`/blog/${blog._id}`)}
                    className="p-2 hover:bg-muted rounded-lg"
                    title="View Blog"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => navigate(`/blog/${blog._id}/edit`)}
                    className="p-2 hover:bg-muted rounded-lg"
                    title="Edit Blog"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="p-2 hover:bg-muted rounded-lg text-red-500 hover:text-red-700"
                    title="Delete Blog"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
