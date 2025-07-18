import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseServerClient } from '@/utils/supabase/server';

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  // Extract type if provided, default to 'track'
  const type = searchParams.get('type') || 'track';

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  // Get authenticated user
  let userId = null;
  try {
    const supabase = await supabaseServerClient();
    const { data } = await supabase.auth.getUser();
    userId = data?.user?.id || null;
  } catch (e) {
    // If user not authenticated, skip saving search
    userId = null;
  }

  try {
    const accessToken = await getSpotifyAccessToken();
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`,
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

    // Save search to database if user is authenticated
    if (userId) {
      try {
        await prisma.searchHistory.create({
          data: {
            userId,
            query,
            type,
          },
        });
      } catch (dbError) {
        // Log but do not block response
        console.error('Error saving search history:', dbError);
      }
    }

    return NextResponse.json({ tracks });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Spotify API error:', error);
      return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 