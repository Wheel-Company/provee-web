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
  active_role: string | null
  available_roles: string[] | null
  is_expert: boolean | null
  is_customer: boolean | null
  expert_active: boolean | null
  expert_verification_status: string | null
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

      // 먼저 user_roles_view에서 조회 시도
      let { data, error } = await supabaseClient
        .from('user_roles_view')
        .select('*')
        .eq('id', userId)
        .single()

      // user_roles_view가 없는 경우 기본 profiles 테이블에서 조회하고 expert 여부 확인
      if (error) {
        console.log('user_roles_view not found, using basic query with expert check')

        // profiles 테이블에서 기본 정보 조회
        const { data: profileData, error: profileError } = await supabaseClient
          .from('profiles')
          .select('id, username, email, name, phone, user_type, active_role')
          .eq('id', userId)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          setProfile(null)
          return
        }

        // expert_profiles 테이블에서 expert 여부 확인
        const { data: expertData, error: expertError } = await supabaseClient
          .from('expert_profiles')
          .select('profile_id, is_active, verification_status')
          .eq('profile_id', userId)
          .single()

        // 결과 조합
        data = {
          ...profileData,
          available_roles: expertData && !expertError ? ['customer', 'expert'] : ['customer'],
          is_expert: !!(expertData && !expertError),
          is_customer: true,
          expert_active: expertData?.is_active || false,
          expert_verification_status: expertData?.verification_status || null
        }
      }

      console.log('Profile query result:', { data, error })

      if (data) {
        console.log('Setting profile data:', data)
        console.log('User type from database:', data?.user_type)
        console.log('Active role from database:', data?.active_role)
        console.log('Available roles:', data?.available_roles)
        console.log('Is expert:', data?.is_expert)
        setProfile(data)
      } else {
        setProfile(null)
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
      // 전문가로 전환하려는 경우 expert 등록 여부 확인
      if (newRole === 'expert' && !profile.is_expert) {
        router.push('/expert/join')
        return { success: false, error: 'Expert registration required' }
      }

      // active_role 업데이트 (user_type은 그대로 유지)
      console.log('Updating active_role to:', newRole, 'for user:', user.id)
      const { error } = await supabaseClient
        .from('profiles')
        .update({ active_role: newRole })
        .eq('id', user.id)

      if (error) {
        console.error('Error switching role:', error)
        return { success: false, error: error.message }
      }

      console.log('Role updated successfully, fetching profile...')
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
      // expert_profiles 테이블에 레코드 생성 (이미 있으면 무시)
      const { error: expertError } = await supabaseClient
        .from('expert_profiles')
        .insert({
          profile_id: user.id,
          title: '전문가',
          description: '',
          is_active: true,
          verification_status: 'pending'
        })

      // 중복 삽입 에러는 무시 (이미 expert_profiles에 있는 경우)
      if (expertError && !expertError.message.includes('duplicate') && !expertError.message.includes('already exists')) {
        console.error('Error creating expert profile:', expertError)
        return { success: false, error: expertError.message }
      }

      // active_role을 expert로 설정
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ active_role: 'expert' })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating active role to expert:', updateError)
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