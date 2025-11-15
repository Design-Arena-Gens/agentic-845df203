'use client'

import { useState, useEffect } from 'react'
import { PlayCircle, Download, ExternalLink, Trash2, Filter } from 'lucide-react'

export default function VideoLog() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/video-log')
      const data = await response.json()
      setVideos(data.videos || [])
    } catch (error) {
      console.error('Error fetching video log:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      await fetch(`/api/video-log/${videoId}`, {
        method: 'DELETE',
      })
      fetchVideos()
    } catch (error) {
      console.error('Error deleting video:', error)
    }
  }

  const filteredVideos = videos.filter(video => {
    const matchesFilter = filter === 'all' || video.status === filter
    const matchesSearch = video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <PlayCircle className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold">Video Log</h2>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search videos..."
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          >
            <option value="all">All Videos</option>
            <option value="created">Created</option>
            <option value="scheduled">Scheduled</option>
            <option value="posted">Posted</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
          <p className="text-2xl font-bold text-white">{videos.length}</p>
          <p className="text-sm text-gray-400">Total Videos</p>
        </div>
        <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-400">
            {videos.filter(v => v.status === 'posted').length}
          </p>
          <p className="text-sm text-gray-400">Posted</p>
        </div>
        <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
          <p className="text-2xl font-bold text-yellow-400">
            {videos.filter(v => v.status === 'scheduled').length}
          </p>
          <p className="text-sm text-gray-400">Scheduled</p>
        </div>
        <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
          <p className="text-2xl font-bold text-blue-400">
            {videos.filter(v => v.status === 'created').length}
          </p>
          <p className="text-sm text-gray-400">Created</p>
        </div>
      </div>

      {/* Video List */}
      <div className="space-y-3">
        {filteredVideos.length === 0 ? (
          <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-12 text-center">
            <PlayCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No videos found</p>
            <p className="text-gray-500 text-sm mt-2">Start creating videos to see them here</p>
          </div>
        ) : (
          filteredVideos.map((video, index) => (
            <div key={index} className="bg-gray-700/30 border border-gray-600 rounded-lg p-5 hover:border-purple-500 transition-colors">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Video Thumbnail/Preview */}
                <div className="w-full md:w-32 h-56 md:h-32 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PlayCircle className="w-12 h-12 text-gray-600" />
                </div>

                {/* Video Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{video.title || 'Untitled Video'}</h3>
                      <p className="text-sm text-gray-400 mt-1">{video.description || 'No description'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      video.status === 'posted' ? 'bg-green-600/30 text-green-400' :
                      video.status === 'scheduled' ? 'bg-yellow-600/30 text-yellow-400' :
                      video.status === 'created' ? 'bg-blue-600/30 text-blue-400' :
                      'bg-red-600/30 text-red-400'
                    }`}>
                      {video.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {video.tags?.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-purple-600/20 border border-purple-600 rounded text-xs text-purple-300">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm pt-2">
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="text-white font-medium">{new Date(video.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="text-white font-medium">{video.duration || 'N/A'}s</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Views</p>
                      <p className="text-white font-medium">{video.views?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Engagement</p>
                      <p className="text-white font-medium">{video.engagement || '0'}%</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {video.youtubeId && (
                      <a
                        href={`https://youtube.com/shorts/${video.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on YouTube
                      </a>
                    )}
                    <button
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600 rounded text-sm flex items-center gap-1 transition-colors text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Export Button */}
      <button
        onClick={() => {
          const dataStr = JSON.stringify(videos, null, 2)
          const blob = new Blob([dataStr], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `video-log-${Date.now()}.json`
          a.click()
        }}
        className="w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <Download className="w-5 h-5" />
        Export Log as JSON
      </button>
    </div>
  )
}
