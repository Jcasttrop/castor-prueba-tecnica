import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseServerClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const history = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { query: true, type: true, createdAt: true },
      take: 20,
    });
    
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching search history:', error);
    return NextResponse.json({ error: 'Failed to fetch search history' }, { status: 500 });
  }
} 