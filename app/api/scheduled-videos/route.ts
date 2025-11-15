import { NextResponse } from 'next/server'

// Mock database of scheduled videos
const mockScheduledVideos = [
  {
    id: 'schedule_1',
    videoId: 'vid_1234567890_abc123',
    title: '5 Mind-Blowing Tech Tips You Need Right Now! 🤯',
    scheduledTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    status: 'pending',
  },
  {
    id: 'schedule_2',
    videoId: 'vid_9876543210_xyz789',
    title: 'This Life Hack Changed Everything... #shorts',
    scheduledTime: new Date(Date.now() + 172800000).toISOString(), // 2 days
    status: 'pending',
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      videos: mockScheduledVideos,
    })
  } catch (error) {
    console.error('Error fetching scheduled videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scheduled videos' },
      { status: 500 }
    )
  }
}
