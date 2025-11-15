'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Eye, ThumbsUp, MessageCircle, Share2 } from 'lucide-react'

export default function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-600 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 text-blue-400" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics?.totalViews?.toLocaleString() || '0'}</p>
          <p className="text-sm text-gray-400">Total Views</p>
          <p className="text-xs text-green-400 mt-1">+{analytics?.viewsGrowth || 0}% vs previous period</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-600 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <ThumbsUp className="w-8 h-8 text-purple-400" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics?.totalLikes?.toLocaleString() || '0'}</p>
          <p className="text-sm text-gray-400">Total Likes</p>
          <p className="text-xs text-green-400 mt-1">+{analytics?.likesGrowth || 0}% vs previous period</p>
        </div>

        <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 border border-pink-600 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <MessageCircle className="w-8 h-8 text-pink-400" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics?.totalComments?.toLocaleString() || '0'}</p>
          <p className="text-sm text-gray-400">Total Comments</p>
          <p className="text-xs text-green-400 mt-1">+{analytics?.commentsGrowth || 0}% vs previous period</p>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-600 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Share2 className="w-8 h-8 text-green-400" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics?.totalShares?.toLocaleString() || '0'}</p>
          <p className="text-sm text-gray-400">Total Shares</p>
          <p className="text-xs text-green-400 mt-1">+{analytics?.sharesGrowth || 0}% vs previous period</p>
        </div>
      </div>

      {/* Engagement Rate */}
      <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">Engagement Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Avg Watch Time</p>
            <p className="text-xl font-bold text-white">{analytics?.avgWatchTime || '0'}s</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Engagement Rate</p>
            <p className="text-xl font-bold text-white">{analytics?.engagementRate || '0'}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">CTR</p>
            <p className="text-xl font-bold text-white">{analytics?.ctr || '0'}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Completion Rate</p>
            <p className="text-xl font-bold text-white">{analytics?.completionRate || '0'}%</p>
          </div>
        </div>
      </div>

      {/* Top Performing Videos */}
      <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">Top Performing Videos</h3>
        <div className="space-y-3">
          {analytics?.topVideos?.map((video: any, index: number) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-white">{video.title}</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Posted: {new Date(video.publishedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-400">{video.views.toLocaleString()}</p>
                <p className="text-xs text-gray-400">views</p>
              </div>
            </div>
          )) || (
            <p className="text-gray-400 text-center py-8">No videos yet. Start creating!</p>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">AI Insights & Recommendations</h3>
        <div className="space-y-3">
          {analytics?.insights?.map((insight: string, index: number) => (
            <div key={index} className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
              <p className="text-gray-300 flex-1">{insight}</p>
            </div>
          )) || (
            <>
              <div className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                <p className="text-gray-300 flex-1">Post consistently at 6 PM for best engagement</p>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                <p className="text-gray-300 flex-1">Videos with hooks in first 3 seconds perform 45% better</p>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                <p className="text-gray-300 flex-1">Consider using trending hashtags: #viral #fyp #shorts</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchAnalytics}
        className="w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
      >
        Refresh Analytics
      </button>
    </div>
  )
}
