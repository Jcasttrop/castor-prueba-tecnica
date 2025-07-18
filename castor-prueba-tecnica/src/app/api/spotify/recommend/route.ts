import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      console.error('Prompt missing or invalid:', prompt);
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }
    const { text } = await generateText({
      model: openai('gpt-4o-mini', { apiKey: process.env.OPENAI_API_KEY}),
      prompt,
    });
    return NextResponse.json({ text });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json({ error: 'Failed to generate text.' }, { status: 500 });
  }
}