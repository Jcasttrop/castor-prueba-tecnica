import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseServerClient } from '@/utils/supabase/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = await supabaseServerClient()

  const { data } = await supabase.auth.getUser()
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isStatic =
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon.ico') ||
    request.nextUrl.pathname.startsWith('/public')

  if (!data.user && !isAuthPage && !isStatic) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!auth|_next|favicon.ico|public).*)',
  ],
}