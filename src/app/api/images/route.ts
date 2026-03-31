import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    const enhancedPrompt = `Create a professional insurance marketing image for SulAmérica Vida Flex life insurance. Style: ${style || 'modern, clean, professional'}. Theme: ${prompt}. Use blue and cyan color scheme. The image should be suitable for social media marketing by insurance sales agents. Do NOT include any text in the image. Professional, trustworthy, modern aesthetic.`;

    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

    return NextResponse.json({
      url: imageUrl,
      prompt: enhancedPrompt,
      revised_prompt: response.data?.[0]?.revised_prompt
    });
  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
