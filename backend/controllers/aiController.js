const axios = require('axios');

// AI Blog Generation using OpenAI API
const generateAIBlog = async (req, res) => {
  try {
    const { topic, tone = "professional", length = "medium" } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    // Configure OpenAI API
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ 
        message: "AI service not configured. Please add OPENAI_API_KEY to environment variables." 
      });
    }

    // Determine word count based on length preference
    const wordCounts = {
      short: "300-500 words",
      medium: "800-1200 words", 
      long: "1500-2000 words"
    };

    const prompt = `Write a comprehensive blog post about "${topic}" with the following requirements:
    
    - Tone: ${tone}
    - Length: ${wordCounts[length]}
    - Include a compelling title
    - Write an engaging introduction
    - Create 3-5 main sections with subheadings
    - Include practical examples and insights
    - End with a strong conclusion
    - Use markdown formatting for structure
    - Include relevant emojis where appropriate
    - Make it SEO-friendly with natural keyword integration
    
    Format the response as JSON with the following structure:
    {
      "title": "Blog post title",
      "excerpt": "Brief 2-3 sentence summary",
      "content": "Full blog content in markdown format",
      "tags": ["tag1", "tag2", "tag3"],
      "suggestedImagePrompt": "Description for AI-generated image"
    }`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content writer and blogger. Generate high-quality, engaging blog posts that are informative and well-structured.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    // Parse the JSON response
    let blogData;
    try {
      blogData = JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      blogData = {
        title: `Complete Guide to ${topic}`,
        excerpt: `A comprehensive exploration of ${topic}, covering key concepts, practical applications, and expert insights.`,
        content: aiResponse,
        tags: [topic.toLowerCase(), "guide", "tutorial"],
        suggestedImagePrompt: `Professional illustration related to ${topic}`
      };
    }

    res.json({
      message: "Blog generated successfully",
      blog: blogData,
    });

  } catch (error) {
    console.error('AI Generation Error:', error);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        message: "Invalid OpenAI API key. Please check your configuration." 
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({ 
        message: "AI service rate limit exceeded. Please try again later." 
      });
    }

    // Fallback: Generate a basic blog structure without AI
    const { topic } = req.body;
    const fallbackBlog = {
      title: `Understanding ${topic}: A Complete Guide`,
      excerpt: `Explore the fundamentals of ${topic} and discover practical insights that can help you succeed.`,
      content: `# Understanding ${topic}: A Complete Guide

## Introduction

${topic} is an important concept that affects many aspects of our daily lives. In this comprehensive guide, we'll explore the key aspects of ${topic} and provide you with actionable insights.

## What is ${topic}?

${topic} encompasses various elements that work together to create meaningful outcomes. Understanding these components is crucial for success.

## Key Benefits

- **Benefit 1**: Improved understanding and application
- **Benefit 2**: Enhanced decision-making capabilities  
- **Benefit 3**: Better long-term results

## Practical Applications

### Getting Started

1. **Step 1**: Define your goals and objectives
2. **Step 2**: Research best practices and methodologies
3. **Step 3**: Implement and monitor progress

### Common Challenges

Some common challenges include:
- Lack of clear direction
- Insufficient resources
- Time constraints

## Best Practices

To maximize your success with ${topic}, consider these proven strategies:

- Set clear, measurable goals
- Track your progress regularly
- Seek feedback and adjust as needed
- Stay updated with latest trends

## Conclusion

${topic} offers significant opportunities for growth and improvement. By following the strategies outlined in this guide, you can achieve meaningful results and create lasting impact.

Remember, success with ${topic} requires patience, persistence, and continuous learning.`,
      tags: [topic.toLowerCase(), "guide", "tutorial", "best-practices"],
      suggestedImagePrompt: `Professional illustration showing ${topic} concepts and applications`
    };

    res.json({
      message: "Blog generated successfully (fallback mode)",
      blog: fallbackBlog,
    });
  }
};

// Generate blog image using AI (placeholder for image generation)
const generateBlogImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Image prompt is required" });
    }

    // This is a placeholder - you would integrate with DALL-E, Midjourney, or another image generation service
    // For now, we'll return a mock response
    res.json({
      message: "Image generation not implemented yet",
      imageUrl: null,
      note: "To implement image generation, integrate with DALL-E API or similar service"
    });

  } catch (error) {
    console.error('Image Generation Error:', error);
    res.status(500).json({ 
      message: "Failed to generate image", 
      error: error.message 
    });
  }
};

module.exports = {
  generateAIBlog,
  generateBlogImage,
};

