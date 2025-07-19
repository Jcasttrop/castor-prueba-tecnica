import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseServerClient } from '@/utils/supabase/server';

// DELETE - Remove a song from favorites
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await supabaseServerClient();
    const { data } = await supabase.auth.getUser();
    
    if (!data?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favorite = await prisma.favoriteSong.deleteMany({
      where: {
        id: params.id,
        userId: data.user.id, // Ensure user can only delete their own favorites
      },
    });

    if (favorite.count === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Favorite removed successfully' });
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
} 