import React, { useState } from "react";
import { BarChart3, TrendingUp, Users, Eye, Calendar, Download } from "lucide-react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalViews: 15420,
      totalBlogs: 12,
      avgReadTime: "3.2 min",
      engagementRate: "68%"
    },
    chartData: [
      { date: "2024-01-01", views: 120, reads: 85 },
      { date: "2024-01-02", views: 150, reads: 110 },
      { date: "2024-01-03", views: 180, reads: 130 },
      { date: "2024-01-04", views: 200, reads: 145 },
      { date: "2024-01-05", views: 220, reads: 160 },
      { date: "2024-01-06", views: 190, reads: 140 },
      { date: "2024-01-07", views: 250, reads: 180 }
    ],
    topBlogs: [
      { title: "Getting Started with React Hooks", views: 1250, engagement: "85%" },
      { title: "AI in Modern Web Development", views: 980, engagement: "72%" },
      { title: "Best Practices for API Design", views: 890, engagement: "68%" }
    ]
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = "primary" }) => (
    <div className="bg-card p-6 rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-500">{trend}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Track your blog performance and insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Views"
          value={analyticsData.overview.totalViews.toLocaleString()}
          icon={Eye}
          trend="+12%"
          color="blue"
        />
        <StatCard
          title="Total Blogs"
          value={analyticsData.overview.totalBlogs}
          icon={BarChart3}
          trend="+2"
          color="green"
        />
        <StatCard
          title="Avg. Read Time"
          value={analyticsData.overview.avgReadTime}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Engagement Rate"
          value={analyticsData.overview.engagementRate}
          icon={Users}
          trend="+5%"
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {analyticsData.chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="w-8 bg-primary rounded-t"
                  style={{ height: `${(data.views / 250) * 200}px` }}
                />
                <span className="text-xs text-muted-foreground">
                  {new Date(data.date).getDate()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Engagement Rate</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {analyticsData.chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="w-8 bg-green-500 rounded-t"
                  style={{ height: `${(data.reads / data.views) * 200}px` }}
                />
                <span className="text-xs text-muted-foreground">
                  {new Date(data.date).getDate()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Blogs */}
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Top Performing Blogs</h3>
        <div className="space-y-4">
          {analyticsData.topBlogs.map((blog, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium">{blog.title}</h4>
                  <p className="text-sm text-muted-foreground">{blog.views} views</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{blog.engagement}</p>
                <p className="text-sm text-muted-foreground">engagement</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

