import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    // In production, this would fetch real data from YouTube Analytics API
    const analytics = generateMockAnalytics(range)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

function generateMockAnalytics(range: string) {
  const multiplier = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90

  return {
    totalViews: 125430 * multiplier,
    viewsGrowth: 23.5,
    totalLikes: 8234 * multiplier,
    likesGrowth: 18.2,
    totalComments: 1523 * multiplier,
    commentsGrowth: 31.4,
    totalShares: 2156 * multiplier,
    sharesGrowth: 45.8,
    avgWatchTime: 42,
    engagementRate: 8.7,
    ctr: 12.3,
    completionRate: 78.5,
    topVideos: [
      {
        title: '5 Mind-Blowing Tech Tips You Need Right Now! 🤯',
        publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        views: 45230,
        likes: 3421,
        comments: 234,
      },
      {
        title: 'This Life Hack Changed Everything... #shorts',
        publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        views: 38940,
        likes: 2856,
        comments: 189,
      },
      {
        title: 'Wait Until You See This... 😱 #viral',
        publishedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        views: 32150,
        likes: 2341,
        comments: 156,
      },
    ],
    insights: [
      'Your videos posted at 6 PM get 45% more views than other times',
      'Videos with emotional hooks perform 67% better in the first hour',
      'Adding trending hashtags increases discoverability by 38%',
      'Your completion rate is 23% above average for your niche',
      'Consider increasing posting frequency to 3x per day for optimal growth',
    ],
  }
}
