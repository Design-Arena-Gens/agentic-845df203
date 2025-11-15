'use client'

import { useState } from 'react'
import { Video, Sparkles, Calendar, TrendingUp, Settings, PlayCircle, BarChart3 } from 'lucide-react'
import ScriptGenerator from '@/components/ScriptGenerator'
import VideoCreator from '@/components/VideoCreator'
import Scheduler from '@/components/Scheduler'
import Analytics from '@/components/Analytics'
import VideoLog from '@/components/VideoLog'

export default function Home() {
  const [activeTab, setActiveTab] = useState('generate')

  const tabs = [
    { id: 'generate', label: 'Generate Scripts', icon: Sparkles },
    { id: 'create', label: 'Create Videos', icon: Video },
    { id: 'schedule', label: 'Schedule & Post', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'log', label: 'Video Log', icon: PlayCircle },
  ]

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Video className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              YouTube Shorts AI Agent
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Automate your YouTube Shorts content creation, from script to post
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 mb-6 border border-gray-700">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          {activeTab === 'generate' && <ScriptGenerator />}
          {activeTab === 'create' && <VideoCreator />}
          {activeTab === 'schedule' && <Scheduler />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'log' && <VideoLog />}
        </div>
      </div>
    </main>
  )
}
