'use client'

import { useState } from 'react'
import { Video, Upload, Download } from 'lucide-react'

export default function VideoCreator() {
  const [scriptData, setScriptData] = useState('')
  const [voiceType, setVoiceType] = useState('female')
  const [videoStyle, setVideoStyle] = useState('stock')
  const [loading, setLoading] = useState(false)
  const [createdVideo, setCreatedVideo] = useState<any>(null)

  const createVideo = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: scriptData,
          voiceType,
          videoStyle,
        }),
      })
      const data = await response.json()
      setCreatedVideo(data.video)
    } catch (error) {
      console.error('Error creating video:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string)
          setScriptData(JSON.stringify(json, null, 2))
        } catch {
          setScriptData(event.target?.result as string)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Video className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold">Video Creator</h2>
      </div>

      {/* Script Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Script Data (JSON or Text)
        </label>
        <textarea
          value={scriptData}
          onChange={(e) => setScriptData(e.target.value)}
          placeholder="Paste your generated script here or upload a file..."
          rows={10}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 font-mono text-sm"
        />
        <div className="mt-2">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm">Upload Script File</span>
            <input
              type="file"
              accept=".json,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Video Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Voice Type
          </label>
          <select
            value={voiceType}
            onChange={(e) => setVoiceType(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          >
            <option value="female">Female Voice</option>
            <option value="male">Male Voice</option>
            <option value="neutral">Neutral Voice</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Video Style
          </label>
          <select
            value={videoStyle}
            onChange={(e) => setVideoStyle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          >
            <option value="stock">Stock Footage</option>
            <option value="ai-generated">AI Generated</option>
            <option value="slideshow">Slideshow</option>
            <option value="text-animation">Text Animation</option>
          </select>
        </div>
      </div>

      <button
        onClick={createVideo}
        disabled={loading || !scriptData}
        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            Creating Video...
          </>
        ) : (
          <>
            <Video className="w-5 h-5" />
            Create Video
          </>
        )}
      </button>

      {/* Created Video Preview */}
      {createdVideo && (
        <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">Video Created Successfully!</h3>

          <div className="space-y-4">
            <div className="aspect-[9/16] bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">Video Preview</p>
                <p className="text-sm text-gray-500">({createdVideo.resolution})</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-white font-semibold">{createdVideo.duration}s</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Format</p>
                <p className="text-white font-semibold">{createdVideo.format}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">File Size</p>
                <p className="text-white font-semibold">{createdVideo.fileSize}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="text-green-400 font-semibold">{createdVideo.status}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Video ID</p>
              <code className="block bg-gray-800 p-3 rounded text-sm text-purple-400">{createdVideo.id}</code>
            </div>

            <button
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Video
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
        <h4 className="font-semibold text-blue-300 mb-2">How it works:</h4>
        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
          <li>Upload or paste your generated script</li>
          <li>AI converts text to natural speech using TTS</li>
          <li>Automatically sources relevant stock footage or generates AI visuals</li>
          <li>Adds text overlays and captions based on script</li>
          <li>Renders final 9:16 vertical video optimized for YouTube Shorts</li>
        </ul>
      </div>
    </div>
  )
}
