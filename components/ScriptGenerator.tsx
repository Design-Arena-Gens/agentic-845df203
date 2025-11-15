'use client'

import { useState } from 'react'
import { Sparkles, Copy, Download, Wand2 } from 'lucide-react'

export default function ScriptGenerator() {
  const [niche, setNiche] = useState('')
  const [duration, setDuration] = useState(30)
  const [tone, setTone] = useState('engaging')
  const [scripts, setScripts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [batchCount, setBatchCount] = useState(1)

  const generateScripts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, duration, tone, count: batchCount }),
      })
      const data = await response.json()
      setScripts(data.scripts || [])
    } catch (error) {
      console.error('Error generating scripts:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyScript = (script: string) => {
    navigator.clipboard.writeText(script)
  }

  const downloadScript = (script: any, index: number) => {
    const blob = new Blob([JSON.stringify(script, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `script-${Date.now()}-${index + 1}.json`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold">AI Script Generator</h2>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Niche/Topic
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g., Tech Tips, Life Hacks, Motivation"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duration (seconds)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            min="15"
            max="60"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          >
            <option value="engaging">Engaging</option>
            <option value="educational">Educational</option>
            <option value="entertaining">Entertaining</option>
            <option value="motivational">Motivational</option>
            <option value="mysterious">Mysterious</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Batch Count
          </label>
          <input
            type="number"
            value={batchCount}
            onChange={(e) => setBatchCount(parseInt(e.target.value))}
            min="1"
            max="10"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          />
        </div>
      </div>

      <button
        onClick={generateScripts}
        disabled={loading || !niche}
        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate Scripts
          </>
        )}
      </button>

      {/* Generated Scripts */}
      {scripts.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold text-purple-400">Generated Scripts</h3>
          {scripts.map((script, index) => (
            <div key={index} className="bg-gray-700/30 border border-gray-600 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-purple-300">Script {index + 1}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyScript(script.fullScript)}
                    className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Copy script"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => downloadScript(script, index)}
                    className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Download script"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Hook:</p>
                  <p className="text-white bg-gray-800/50 p-3 rounded">{script.hook}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Main Content:</p>
                  <p className="text-white bg-gray-800/50 p-3 rounded">{script.content}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">CTA:</p>
                  <p className="text-white bg-gray-800/50 p-3 rounded">{script.cta}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Visual Suggestions:</p>
                  <ul className="list-disc list-inside text-white bg-gray-800/50 p-3 rounded space-y-1">
                    {script.visuals?.map((visual: string, i: number) => (
                      <li key={i}>{visual}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Text Overlays:</p>
                  <div className="flex flex-wrap gap-2">
                    {script.textOverlays?.map((overlay: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-purple-600/30 border border-purple-500 rounded-full text-sm">
                        {overlay}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Captions/Subtitles:</p>
                  <p className="text-white bg-gray-800/50 p-3 rounded text-sm">{script.captions}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">SEO Keywords:</p>
                  <div className="flex flex-wrap gap-2">
                    {script.keywords?.map((keyword: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-blue-600/30 border border-blue-500 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
