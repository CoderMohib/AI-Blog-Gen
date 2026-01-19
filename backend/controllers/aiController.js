const { GoogleGenerativeAI } = require("@google/generative-ai");

// AI Blog Generation using Google Gemini API
const generateAIBlog = async (req, res) => {
  try {
    const {
      prompt,
      tone = "professional",
      length = "medium",
      keywords = [],
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Configure Google Gemini API
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        message:
          "AI service not configured. Please add GEMINI_API_KEY to environment variables.",
      });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Determine word count based on length preference
    const wordCounts = {
      short: "300-400 words",
      medium: "600-800 words",
      long: "1000-1500 words",
    };

    // Build keyword string
    const keywordString =
      keywords.length > 0
        ? `\n- Keywords to include naturally: ${keywords.join(", ")}`
        : "";

    const generationPrompt = `Write a comprehensive blog post with the following requirements:

Topic: ${prompt}

Requirements:
- Tone: ${tone}
- Length: ${wordCounts[length]}${keywordString}
- Include a compelling title as an H1 heading
- Write an engaging introduction
- Create 3-5 main sections with H2 subheadings
- Include practical examples and insights
- End with a strong conclusion
- Use HTML formatting (h1, h2, p, ul, ol, strong, em tags)
- Make it SEO-friendly with natural keyword integration
- Write in a clear, engaging style

Format the response as valid HTML content that can be directly inserted into a blog editor. Start with an <h1> tag for the title, then use proper HTML structure throughout.`;

    const result = await model.generateContent(generationPrompt);
    const response = await result.response;
    const content = response.text();

    // Calculate approximate word count
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    res.json({
      success: true,
      content: content,
      wordCount: wordCount,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Generation Error:", error);

    if (error.message?.includes("API key")) {
      return res.status(401).json({
        message: "Invalid Gemini API key. Please check your configuration.",
      });
    }

    if (
      error.message?.includes("quota") ||
      error.message?.includes("rate limit")
    ) {
      return res.status(429).json({
        message: "AI service rate limit exceeded. Please try again later.",
      });
    }

    // Fallback: Generate a basic blog structure without AI
    const { prompt } = req.body;
    const fallbackContent = `<h1>Understanding ${prompt}: A Complete Guide</h1>

<p>${prompt} is an important concept that affects many aspects of our daily lives. In this comprehensive guide, we'll explore the key aspects of ${prompt} and provide you with actionable insights.</p>

<h2>What is ${prompt}?</h2>

<p>${prompt} encompasses various elements that work together to create meaningful outcomes. Understanding these components is crucial for success.</p>

<h2>Key Benefits</h2>

<ul>
<li><strong>Benefit 1</strong>: Improved understanding and application</li>
<li><strong>Benefit 2</strong>: Enhanced decision-making capabilities</li>
<li><strong>Benefit 3</strong>: Better long-term results</li>
</ul>

<h2>Practical Applications</h2>

<h3>Getting Started</h3>

<ol>
<li><strong>Step 1</strong>: Define your goals and objectives</li>
<li><strong>Step 2</strong>: Research best practices and methodologies</li>
<li><strong>Step 3</strong>: Implement and monitor progress</li>
</ol>

<h3>Common Challenges</h3>

<p>Some common challenges include:</p>
<ul>
<li>Lack of clear direction</li>
<li>Insufficient resources</li>
<li>Time constraints</li>
</ul>

<h2>Best Practices</h2>

<p>To maximize your success with ${prompt}, consider these proven strategies:</p>

<ul>
<li>Set clear, measurable goals</li>
<li>Track your progress regularly</li>
<li>Seek feedback and adjust as needed</li>
<li>Stay updated with latest trends</li>
</ul>

<h2>Conclusion</h2>

<p>${prompt} offers significant opportunities for growth and improvement. By following the strategies outlined in this guide, you can achieve meaningful results and create lasting impact.</p>

<p>Remember, success with ${prompt} requires patience, persistence, and continuous learning.</p>`;

    res.json({
      success: true,
      content: fallbackContent,
      wordCount: fallbackContent.split(/\s+/).filter(Boolean).length,
      generatedAt: new Date().toISOString(),
      note: "Generated using fallback mode due to AI service error",
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
      note: "To implement image generation, integrate with DALL-E API or similar service",
    });
  } catch (error) {
    console.error("Image Generation Error:", error);
    res.status(500).json({
      message: "Failed to generate image",
      error: error.message,
    });
  }
};

module.exports = {
  generateAIBlog,
  generateBlogImage,
};
