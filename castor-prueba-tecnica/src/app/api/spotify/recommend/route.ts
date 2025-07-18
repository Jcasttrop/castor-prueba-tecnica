import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { prisma } from '@/lib/prisma';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTID;
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

async function getSpotifyAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to authenticate with Spotify: ${text}`);
  }
  const data = await response.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      console.error('Prompt missing or invalid:', prompt);
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    // 1. Use OpenAI to generate a Spotify search query
    const aiPrompt = `Given the following user intent, generate a concise Spotify search query that would return relevant songs. Only output the query.\nIntent: ${prompt}`;
    const { text: searchQuery } = await generateText({
      model: openai('gpt-4o-mini', { apiKey: process.env.OPENAI_API_KEY }),
      prompt: aiPrompt,
    });

    // Log the raw response from OpenAI
    console.log('OpenAI generated search query:', searchQuery);

    // 2. Use the generated query to search Spotify
    const accessToken = await getSpotifyAccessToken();
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!searchRes.ok) {
      const text = await searchRes.text();
      return NextResponse.json({ error: `Spotify search failed: ${text}` }, { status: 500 });
    }

    const data = await searchRes.json();
    const tracks = (data.tracks?.items || []).map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a: any) => a.name).join(', '),
      album: track.album.name,
      albumArt: track.album.images[0]?.url,
      previewUrl: track.preview_url,
      externalUrl: track.external_urls.spotify,
    }));

    // 3. Save to database (intent + top 5 songs)
    if (tracks.length > 0) {
      try {
        await prisma.recommendation.create({
          data: {
            intent: prompt,
            songs: tracks.slice(0, 5),
          },
        });
      } catch (dbError) {
        console.error('Error saving recommendation:', dbError);
      }
    }

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('AI/Spotify API error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations.' }, { status: 500 });
  }
}