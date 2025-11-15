import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
})

export async function POST(request: Request) {
  try {
    const { niche, duration, tone, count } = await request.json()

    // Generate trending topics (mock for demo, would use real API)
    const trendingTopics = await generateTrendingTopics(niche)

    const scripts = []

    for (let i = 0; i < count; i++) {
      const script = await generateScript(niche, duration, tone, trendingTopics[i % trendingTopics.length])
      scripts.push(script)
    }

    return NextResponse.json({ scripts })
  } catch (error) {
    console.error('Error generating scripts:', error)
    return NextResponse.json(
      { error: 'Failed to generate scripts' },
      { status: 500 }
    )
  }
}

async function generateTrendingTopics(niche: string): Promise<string[]> {
  // In production, this would fetch from YouTube Trending API or Google Trends
  const mockTopics = {
    'tech': ['AI Revolution', 'New iPhone Features', 'Productivity Hacks', 'Coding Tips', 'Tech News'],
    'motivation': ['Morning Routine', 'Success Mindset', 'Overcome Fear', 'Daily Habits', 'Goal Setting'],
    'life hacks': ['Kitchen Hacks', 'Money Saving Tips', 'Phone Tricks', 'Organization Ideas', 'DIY Solutions'],
  }

  const key = niche.toLowerCase()
  return mockTopics[key as keyof typeof mockTopics] || mockTopics['tech']
}

async function generateScript(niche: string, duration: number, tone: string, topic: string) {
  try {
    const prompt = `Create a viral YouTube Short script for a ${duration}-second video.

Niche: ${niche}
Topic: ${topic}
Tone: ${tone}
Duration: ${duration} seconds

Requirements:
1. Start with a POWERFUL hook (first 3 seconds) that stops scrolling
2. Deliver value quickly with concise storytelling
3. Use pattern interrupts and engaging language
4. End with a strong CTA (call-to-action)
5. Keep it under ${duration} seconds when spoken

Provide the script in this exact JSON format:
{
  "hook": "Opening hook (3 seconds)",
  "content": "Main content (engaging and concise)",
  "cta": "Strong call to action",
  "fullScript": "Complete script as one paragraph",
  "visuals": ["Visual suggestion 1", "Visual suggestion 2", "Visual suggestion 3"],
  "textOverlays": ["Text overlay 1", "Text overlay 2", "Text overlay 3"],
  "captions": "Full captions/subtitles",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "title": "Optimized video title",
  "description": "SEO-optimized description"
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert YouTube Shorts content creator who creates viral, engaging scripts. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      response_format: { type: 'json_object' },
    })

    const scriptData = JSON.parse(response.choices[0].message.content || '{}')
    return scriptData
  } catch (error) {
    console.error('OpenAI error:', error)
    // Return demo script if OpenAI fails
    return generateDemoScript(niche, duration, topic)
  }
}

function generateDemoScript(niche: string, duration: number, topic: string) {
  return {
    hook: `Wait... did you know this about ${topic}?`,
    content: `Here's a ${duration}-second breakdown: This ${topic} trick will completely change how you think about ${niche}. The secret is simple but powerful.`,
    cta: 'Follow for more tips like this! Drop a 🔥 if this helped!',
    fullScript: `Wait... did you know this about ${topic}? Here's a ${duration}-second breakdown: This ${topic} trick will completely change how you think about ${niche}. The secret is simple but powerful. Follow for more tips like this! Drop a 🔥 if this helped!`,
    visuals: [
      'Eye-catching opening graphic',
      'B-roll footage related to topic',
      'Text animations and transitions',
      'Engaging closing screen'
    ],
    textOverlays: [
      '🚀 GAME CHANGER',
      'Watch this...',
      'Mind = Blown',
      'Follow for more!'
    ],
    captions: `Wait... did you know this about ${topic}? This trick will change everything. Follow for more!`,
    keywords: [topic.toLowerCase(), niche.toLowerCase(), 'viral', 'shorts', 'trending'],
    title: `${topic} That Will Blow Your Mind! 🤯 #${niche} #shorts`,
    description: `Discover this amazing ${topic} in ${niche}! 🔥\n\n#${niche} #shorts #viral #trending #fyp #${topic.replace(/\s+/g, '')}\n\nFollow for more amazing content!`
  }
}
