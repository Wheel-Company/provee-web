'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

interface UserProfile {
  id: string
  username: string | null
  email: string | null
  name: string | null
  phone: string | null
  user_type: string | null
}

// 단일 Supabase 클라이언트 인스턴스 (모듈 레벨에서 생성)
const supabaseClient = createClient<Database>(
  'https://jqqwiokellbkyzhqrqls.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXdpb2tlbGxia3l6aHFycWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDI3ODksImV4cCI6MjA3NDI3ODc4OX0.DjVi6aL2dCvwkUNViLx08M8tUwWWIZ_eO0CAGOeE-m4'
)

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 현재 사용자 세션 가져오기
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('id, username, email, name, phone, user_type')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
  }

  return {
    user,
    profile,
    loading,
    signOut,
    isAuthenticated: !!user,
  }
}