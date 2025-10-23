import React, { useState, useEffect } from "react";
import { MessageCircle, Send, Heart, MoreVertical, Edit, Trash2, Reply } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/utils/context/ToastContext";
import api from "@/utils/Api/axiosInstance";
import ProfileAvatar from "@/components/atoms/ProfileAvatar";

const CommentSection = ({ blogId }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/blogs/${blogId}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      showToast("Failed to load comments", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    try {
      const response = await api.post(`/api/blogs/${blogId}/comment`, {
        text: newComment,
        parentCommentId: replyingTo,
      });
      
      setComments(prev => [response.data.comment, ...prev]);
      setNewComment("");
      setReplyingTo(null);
      showToast("Comment added successfully!", "success");
    } catch (error) {
      showToast("Failed to add comment", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await api.delete(`/api/comments/${commentId}`);
      setComments(prev => prev.filter(comment => comment._id !== commentId));
      showToast("Comment deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete comment", "error");
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await api.post(`/api/comments/${commentId}/like`);
      setComments(prev => 
        prev.map(comment => 
          comment._id === commentId 
            ? { ...comment, likes: response.data.likes, isLiked: response.data.isLiked }
            : comment
        )
      );
    } catch (error) {
      showToast("Failed to like comment", "error");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const CommentItem = ({ comment, isReply = false }) => {
    const isAuthor = user && comment.user._id === user.id;
    
    return (
      <div className={`${isReply ? "ml-8 border-l-2 border-muted pl-4" : ""} space-y-3`}>
        <div className="flex items-start gap-3">
          <ProfileAvatar user={comment.user} size="small" />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.user.fullName}</span>
              <span className="text-sm text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>
            
            <p className="text-sm">{comment.text}</p>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLikeComment(comment._id)}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  comment.isLiked 
                    ? "text-red-500 hover:text-red-600" 
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Heart className={`w-4 h-4 ${comment.isLiked ? "fill-current" : ""}`} />
                {comment.likes}
              </button>
              
              {!isReply && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
              )}
              
              {isAuthor && (
                <div className="flex items-center gap-2">
                  <button className="text-sm text-muted-foreground hover:text-primary">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Reply Form */}
        {replyingTo === comment._id && (
          <form onSubmit={handleSubmitComment} className="ml-8 space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
              >
                <Send className="w-3 h-3" />
                Reply
              </button>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="px-3 py-1 border rounded text-sm hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-card p-6 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Comments</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg border space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex items-start gap-3">
            <ProfileAvatar user={user} size="small" />
            <div className="flex-1 space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Please log in to leave a comment.</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
