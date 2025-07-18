'use client'
import { createClient } from '@/utils/supabase/client'

export default function LoginWithGoogleButton() {
  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    })
  }

  return (
    <button
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      aria-label="Sign in with Google"
    >
      <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_17_40)">
          <path d="M47.9999 24.552C47.9999 22.864 47.852 21.232 47.5839 19.68H24.4799V28.672H37.5839C37.0239 31.36 35.3919 33.616 32.9999 35.12V40.12H40.7999C45.1999 36.08 47.9999 30.8 47.9999 24.552Z" fill="#4285F4"/>
          <path d="M24.48 48C30.48 48 35.52 46.08 39.2 40.12L32.96 35.12C31.04 36.32 28.72 37.04 24.48 37.04C18.64 37.04 13.6 33.36 11.84 28.16H4.8V33.36C8.48 41.12 15.84 48 24.48 48Z" fill="#34A853"/>
          <path d="M11.84 28.16C11.36 26.96 11.12 25.68 11.12 24.32C11.12 22.96 11.36 21.68 11.84 20.48V15.28H4.8C3.36 18.08 2.56 21.12 2.56 24.32C2.56 27.52 3.36 30.56 4.8 33.36L11.84 28.16Z" fill="#FBBC05"/>
          <path d="M24.48 11.6C27.6 11.6 30.08 12.72 31.84 14.32L39.36 7.12C35.52 3.6 30.48 0.96 24.48 0.96C15.84 0.96 8.48 7.84 4.8 15.28L11.84 20.48C13.6 15.28 18.64 11.6 24.48 11.6Z" fill="#EA4335"/>
        </g>
        <defs>
          <clipPath id="clip0_17_40">
            <rect width="48" height="48" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      Sign in with Google
    </button>
  )
}