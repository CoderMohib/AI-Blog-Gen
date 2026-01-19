import React from "react";
import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";

const BlogCard = ({ blog }) => {
  return (
    <Link
      to={`/blogs/${blog._id}`}
      className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-200"
    >
      {blog.image?.url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={blog.image.url}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {blog.excerpt}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{blog.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{blog.views || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
