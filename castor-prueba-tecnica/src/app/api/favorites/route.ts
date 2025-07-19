import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseServerClient } from '@/utils/supabase/server';

// GET - Retrieve user's favorite songs
export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseServerClient();
    const { data } = await supabase.auth.getUser();
    
    if (!data?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favorites = await prisma.favoriteSong.findMany({
      where: { userId: data.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ favorites });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

// POST - Add a song to favorites
export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServerClient();
    const { data } = await supabase.auth.getUser();
    
    if (!data?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { spotifyId, name, artists, album, albumArt, previewUrl, externalUrl } = await req.json();

    if (!spotifyId || !name || !artists || !album || !externalUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const favorite = await prisma.favoriteSong.create({
      data: {
        userId: data.user.id,
        spotifyId,
        name,
        artists,
        album,
        albumArt,
        previewUrl,
        externalUrl,
      },
    });

    return NextResponse.json({ favorite });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Song already in favorites' }, { status: 409 });
    }
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
} 