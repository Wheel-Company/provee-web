'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase-client'

interface UserProfile {
  id: string
  username: string | null
  email: string | null
  name: string | null
  phone: string | null
  user_type: string | null
  current_role: string | null
  available_roles: string[] | null
  is_expert: boolean | null
  is_customer: boolean | null
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
      console.log('Fetching profile for user ID:', userId)
      const { data, error } = await supabaseClient
        .from('user_roles_view')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('Profile query result:', { data, error })

      if (error) {
        console.error('Error fetching profile:', error)
        // Fallback to basic profiles table if view doesn't exist yet
        const { data: basicData, error: basicError } = await supabaseClient
          .from('profiles')
          .select('id, username, email, name, phone, user_type')
          .eq('id', userId)
          .single()

        if (!basicError && basicData) {
          setProfile({
            ...basicData,
            current_role: basicData.user_type,
            available_roles: [basicData.user_type || 'customer'],
            is_expert: basicData.user_type === 'expert',
            is_customer: basicData.user_type === 'customer' || !basicData.user_type
          })
        }
      } else {
        console.log('Setting profile data:', data)
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
    } else {
      // 로그아웃 성공시 홈페이지로 이동
      router.push('/')
    }
  }

  const switchRole = async (newRole: 'customer' | 'expert') => {
    if (!user || !profile) return { success: false, error: 'No user logged in' }

    try {
      // 사용자가 해당 역할을 가지고 있는지 확인
      const hasRole = profile.available_roles?.includes(newRole)

      if (!hasRole) {
        if (newRole === 'expert') {
          // 전문가 역할이 없는 경우 전문가 가입 플로우로 리다이렉트
          router.push('/expert/join')
          return { success: false, error: 'Expert registration required' }
        } else {
          // 고객 역할이 없는 경우 추가 (기본적으로 모든 사용자는 고객 역할 가능)
          const { error: roleError } = await supabaseClient
            .from('user_roles')
            .insert({
              user_id: user.id,
              role: 'customer',
              is_active: true
            })

          if (roleError && !roleError.message.includes('duplicate')) {
            console.error('Error adding customer role:', roleError)
            return { success: false, error: roleError.message }
          }
        }
      }

      // active_role 업데이트
      const { error } = await supabaseClient
        .from('profiles')
        .update({ active_role: newRole })
        .eq('id', user.id)

      if (error) {
        console.error('Error switching role:', error)
        return { success: false, error: error.message }
      }

      // 프로필 새로고침
      await fetchProfile(user.id)

      return { success: true }
    } catch (error) {
      console.error('Error switching role:', error)
      return { success: false, error: 'Failed to switch role' }
    }
  }

  const becomeExpert = async () => {
    if (!user) return { success: false, error: 'No user logged in' }

    try {
      // 1. user_roles 테이블에 expert 역할 추가
      const { error: roleError } = await supabaseClient
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'expert',
          is_active: true
        })

      if (roleError && !roleError.message.includes('duplicate')) {
        console.error('Error adding expert role:', roleError)
        return { success: false, error: roleError.message }
      }

      // 2. expert_profiles 테이블에 기본 전문가 프로필 생성
      const { error: profileError } = await supabaseClient
        .from('expert_profiles')
        .insert({
          id: user.id,
          is_active: true,
          is_accepting_requests: true
        })

      if (profileError && !profileError.message.includes('duplicate')) {
        console.error('Error creating expert profile:', profileError)
        return { success: false, error: profileError.message }
      }

      // 3. active_role을 expert로 변경
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ active_role: 'expert' })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating active role:', updateError)
        return { success: false, error: updateError.message }
      }

      // 프로필 새로고침
      await fetchProfile(user.id)

      return { success: true }
    } catch (error) {
      console.error('Error becoming expert:', error)
      return { success: false, error: 'Failed to become expert' }
    }
  }

  return {
    user,
    profile,
    loading,
    signOut,
    switchRole,
    becomeExpert,
    isAuthenticated: !!user,
  }
}