'use server'

import { supabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await supabaseServerClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error)
    return { error: error.message }
  }
  
  redirect('/auth')
}