'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleHeader } from '@/components/layout/header'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('로그인 시도:', { username })
    console.log('환경변수 확인:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
    })
    setIsLoading(true)
    setErrorMessage('')

    try {
      // 1. username으로 profiles 테이블에서 사용자 조회
      console.log('프로필 조회 중...')

      // 임시: 모든 사용자 목록 확인
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('username, email, user_type')
      console.log('전체 프로필 목록:', allProfiles, '에러:', allProfilesError)

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      console.log('프로필 조회 결과:', { profile, profileError })
      if (profileError) {
        console.error('프로필 에러 상세:', profileError.message, profileError.code, profileError.hint)
      }

      if (profileError || !profile) {
        console.log('프로필 조회 실패')
        setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.')
        setIsLoading(false)
        return
      }

      // 2. Supabase Auth로 로그인 (이메일과 비밀번호 사용)
      console.log('인증 시도 중...', profile.email)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: password,
      })

      console.log('인증 결과:', { authData, authError })

      if (authError) {
        console.log('인증 실패:', authError)
        setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.')
        setIsLoading(false)
        return
      }

      // 로그인 성공시 대시보드로 리다이렉트
      console.log('로그인 성공, 리다이렉트 중...')
      router.push('/dashboard')
    } catch (err) {
      console.error('로그인 오류:', err)
      setErrorMessage('로그인 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SimpleHeader />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Provee 로그인
            </h1>
            <p className="text-gray-600">
              아이디와 비밀번호를 입력하세요
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">로그인</CardTitle>
            </CardHeader>
            <CardContent>
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">아이디</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="아이디를 입력하세요"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600"
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  아직 계정이 없으신가요?{' '}
                  <Link
                    href="/auth/register"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    회원가입
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}