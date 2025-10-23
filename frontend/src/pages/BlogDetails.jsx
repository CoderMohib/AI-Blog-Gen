import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Edit, 
  Trash2,
  ArrowLeft,
  Tag
} from "lucide-react";
import { useToast } from "@/utils/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import api from "@/utils/Api/axiosInstance";
import DotRingSpinner from "@/components/atoms/Loader";
import CommentSection from "@/components/organisms/CommentSection";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/blogs/${id}`);
      setBlog(response.data.blog);
      setIsLiked(response.data.blog.isLiked || false);
    } catch (error) {
      showToast("Failed to load blog", "error");
      navigate("/my-blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (isLiking || !user) return;
    
    setIsLiking(true);
    try {
      const response = await api.post(`/api/blogs/${id}/like`);
      
      setBlog(prev => ({
        ...prev,
        likes: response.data.likes
      }));
      setIsLiked(response.data.isLiked);
    } catch (error) {
      showToast("Failed to update like", "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      await api.delete(`/api/blogs/${id}`);
      showToast("Blog deleted successfully", "success");
      navigate("/my-blogs");
    } catch (error) {
      showToast("Failed to delete blog", "error");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) return <DotRingSpinner />;

  if (!blog) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
        <p className="text-muted-foreground mb-6">The blog you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/my-blogs")}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  const isAuthor = user && blog.author._id === user.id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-text"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Blog Header */}
      <div className="bg-card p-8 rounded-lg border">
        {/* Featured Image */}
        {blog.image?.url && (
          <img
            src={blog.image.url}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{blog.author.fullName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{blog.views} views</span>
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={isLiking || !user}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              {blog.likes}
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg">
              <MessageCircle className="w-4 h-4" />
              Comments
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/blog/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Blog Content */}
      <div className="bg-card p-8 rounded-lg border">
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* Comments Section */}
      <CommentSection blogId={id} />
    </div>
  );
};

export default BlogDetails;
