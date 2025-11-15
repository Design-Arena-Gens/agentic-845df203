import { NextResponse } from 'next/server'

const mockVideoLog = [
  {
    id: 'vid_1701234567_abc123',
    title: '5 Mind-Blowing Tech Tips You Need Right Now! 🤯',
    description: 'Discover these amazing tech tips that will change how you use your phone forever!',
    tags: ['tech', 'tips', 'shorts', 'viral', 'trending'],
    status: 'posted',
    youtubeId: 'YTdQw4w9WgXcQ',
    duration: 45,
    views: 45230,
    engagement: 8.7,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'vid_1701234890_xyz789',
    title: 'This Life Hack Changed Everything... #shorts',
    description: 'A simple life hack that will save you hours every week!',
    tags: ['lifehacks', 'productivity', 'shorts'],
    status: 'posted',
    youtubeId: 'YTabc123def456',
    duration: 38,
    views: 38940,
    engagement: 7.2,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'vid_1701235000_mno456',
    title: 'Wait Until You See This... 😱 #viral',
    description: 'You won\'t believe what happens next!',
    tags: ['viral', 'shorts', 'trending', 'fyp'],
    status: 'scheduled',
    duration: 52,
    views: 0,
    engagement: 0,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'vid_1701236000_pqr789',
    title: 'New Video Coming Soon!',
    description: 'An amazing video is being prepared...',
    tags: ['shorts', 'new'],
    status: 'created',
    duration: 30,
    views: 0,
    engagement: 0,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      videos: mockVideoLog,
    })
  } catch (error) {
    console.error('Error fetching video log:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video log' },
      { status: 500 }
    )
  }
}
