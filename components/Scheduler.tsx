'use client'

import { useState, useEffect } from 'react'
import { Calendar, Upload, Clock, Youtube } from 'lucide-react'

export default function Scheduler() {
  const [videoId, setVideoId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [scheduled, setScheduled] = useState<any[]>([])
  const [autoOptimize, setAutoOptimize] = useState(true)

  useEffect(() => {
    fetchScheduled()
  }, [])

  const fetchScheduled = async () => {
    try {
      const response = await fetch('/api/scheduled-videos')
      const data = await response.json()
      setScheduled(data.videos || [])
    } catch (error) {
      console.error('Error fetching scheduled videos:', error)
    }
  }

  const scheduleVideo = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/schedule-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          title,
          description,
          tags: tags.split(',').map(t => t.trim()),
          scheduleDate,
          scheduleTime,
          autoOptimize,
        }),
      })
      const data = await response.json()
      if (data.success) {
        alert('Video scheduled successfully!')
        fetchScheduled()
        // Reset form
        setVideoId('')
        setTitle('')
        setDescription('')
        setTags('')
        setScheduleDate('')
        setScheduleTime('')
      }
    } catch (error) {
      console.error('Error scheduling video:', error)
    } finally {
      setLoading(false)
    }
  }

  const postNow = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/post-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          title,
          description,
          tags: tags.split(',').map(t => t.trim()),
          autoOptimize,
        }),
      })
      const data = await response.json()
      if (data.success) {
        alert(`Video posted successfully! YouTube ID: ${data.youtubeId}`)
      }
    } catch (error) {
      console.error('Error posting video:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold">Schedule & Post</h2>
      </div>

      {/* Video Details Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Video ID
          </label>
          <input
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            placeholder="Enter the video ID from creation step"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Video Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
            rows={4}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="shorts, viral, trending, etc."
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoOptimize"
            checked={autoOptimize}
            onChange={(e) => setAutoOptimize(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="autoOptimize" className="text-sm text-gray-300">
            Auto-optimize title, description, and tags based on trending keywords
          </label>
        </div>

        {/* Schedule Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Schedule Date (Optional)
            </label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Schedule Time (Optional)
            </label>
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={postNow}
            disabled={loading || !videoId || !title}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-red-500/50 flex items-center gap-2"
          >
            <Youtube className="w-5 h-5" />
            Post Now
          </button>

          <button
            onClick={scheduleVideo}
            disabled={loading || !videoId || !title || !scheduleDate || !scheduleTime}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
          >
            <Clock className="w-5 h-5" />
            Schedule for Later
          </button>
        </div>
      </div>

      {/* Scheduled Videos */}
      {scheduled.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">Scheduled Videos</h3>
          <div className="space-y-3">
            {scheduled.map((video, index) => (
              <div key={index} className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{video.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Scheduled for: {new Date(video.scheduledTime).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Video ID: {video.videoId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    video.status === 'pending' ? 'bg-yellow-600/30 text-yellow-400' :
                    video.status === 'posted' ? 'bg-green-600/30 text-green-400' :
                    'bg-gray-600/30 text-gray-400'
                  }`}>
                    {video.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
        <h4 className="font-semibold text-blue-300 mb-2">YouTube Integration:</h4>
        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
          <li>Requires YouTube Data API v3 credentials</li>
          <li>Auto-optimization uses trending search data for better reach</li>
          <li>Scheduling handled server-side with cron jobs</li>
          <li>Videos can be posted immediately or scheduled for optimal times</li>
          <li>All videos are uploaded as YouTube Shorts (#Shorts tag auto-added)</li>
        </ul>
      </div>
    </div>
  )
}
