import React, { useState } from "react";
import { Layout, Eye, Copy, Download, Star, Filter } from "lucide-react";

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "tech", name: "Technology" },
    { id: "business", name: "Business" },
    { id: "lifestyle", name: "Lifestyle" },
    { id: "tutorial", name: "Tutorial" }
  ];

  // Mock templates data
  const [templates] = useState([
    {
      id: 1,
      title: "Tech Review Template",
      description: "Perfect for reviewing the latest technology products and services",
      category: "tech",
      preview: "## Product Review: [Product Name]\n\n### Overview\n[Brief description]\n\n### Key Features\n- Feature 1\n- Feature 2\n\n### Pros and Cons\n**Pros:**\n- Pro 1\n- Pro 2\n\n**Cons:**\n- Con 1\n- Con 2\n\n### Verdict\n[Final thoughts and recommendation]",
      tags: ["Technology", "Review", "Product"],
      isPremium: false,
      downloads: 1250,
      rating: 4.8
    },
    {
      id: 2,
      title: "Business Strategy Guide",
      description: "Comprehensive template for business strategy and planning content",
      category: "business",
      preview: "# Business Strategy: [Strategy Name]\n\n## Executive Summary\n[Brief overview]\n\n## Market Analysis\n### Current Market State\n[Analysis]\n\n### Opportunities\n[Opportunities]\n\n## Implementation Plan\n### Phase 1\n[Details]\n\n### Phase 2\n[Details]\n\n## Expected Outcomes\n[Results and metrics]",
      tags: ["Business", "Strategy", "Planning"],
      isPremium: true,
      downloads: 890,
      rating: 4.9
    },
    {
      id: 3,
      title: "Tutorial Step-by-Step",
      description: "Clear and structured template for creating educational tutorials",
      category: "tutorial",
      preview: "# How to [Task Name]: Complete Tutorial\n\n## Prerequisites\n- Requirement 1\n- Requirement 2\n\n## Step 1: [Step Name]\n[Detailed instructions]\n\n## Step 2: [Step Name]\n[Detailed instructions]\n\n## Troubleshooting\n### Common Issues\n[Solutions]\n\n## Conclusion\n[Summary and next steps]",
      tags: ["Tutorial", "Education", "How-to"],
      isPremium: false,
      downloads: 2100,
      rating: 4.7
    },
    {
      id: 4,
      title: "Lifestyle Article",
      description: "Engaging template for lifestyle and personal development content",
      category: "lifestyle",
      preview: "# [Topic]: A Personal Journey\n\n## Introduction\n[Personal story or hook]\n\n## The Challenge\n[Problem or situation]\n\n## The Solution\n[How you addressed it]\n\n## Lessons Learned\n- Lesson 1\n- Lesson 2\n\n## Final Thoughts\n[Reflection and advice]",
      tags: ["Lifestyle", "Personal", "Development"],
      isPremium: false,
      downloads: 1560,
      rating: 4.6
    }
  ]);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template) => {
    // Navigate to blog generator with template
    console.log("Using template:", template.title);
  };

  const handlePreview = (template) => {
    // Show template preview
    console.log("Previewing template:", template.title);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Layout className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Blog Templates</h1>
          <p className="text-muted-foreground">Choose from our collection of professional blog templates</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card p-4 rounded-lg border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{template.title}</h3>
                  {template.isPremium && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {template.rating}
                  </div>
                  <div>{template.downloads} downloads</div>
                </div>
                <div className="flex gap-1 mb-4">
                  {template.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleUseTemplate(template)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Copy className="w-4 h-4" />
                Use Template
              </button>
              <button
                onClick={() => handlePreview(template)}
                className="px-4 py-2 border rounded-lg hover:bg-muted"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default Templates;

