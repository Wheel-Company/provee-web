'use client'

import { useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface AuthState {
  user: User | null
  loading: boolean
  error: AuthError | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // 초기 세션 확인
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          setAuthState({ user: null, loading: false, error })
          return
        }

        setAuthState({
          user: session?.user ?? null,
          loading: false,
          error: null
        })
      } catch (err) {
        setAuthState({
          user: null,
          loading: false,
          error: err as AuthError
        })
      }
    }

    getInitialSession()

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          loading: false,
          error: null
        })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // 로그인 함수들
  const signInWithEmail = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error }))
      return { data: null, error }
    }

    return { data, error: null }
  }

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error }))
      return { data: null, error }
    }

    return { data, error: null }
  }

  const signInWithProvider = async (provider: 'google' | 'github' | 'kakao') => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error }))
      return { data: null, error }
    }

    return { data, error: null }
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    const { error } = await supabase.auth.signOut()

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error }))
      return { error }
    }

    setAuthState({ user: null, loading: false, error: null })
    return { error: null }
  }

  return {
    ...authState,
    signInWithEmail,
    signUpWithEmail,
    signInWithProvider,
    signOut
  }
}