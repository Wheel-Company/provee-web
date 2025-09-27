'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleHeader } from '@/components/layout/header'
import { Eye, EyeOff, User, Lock, Mail, Phone } from 'lucide-react'
import { supabaseClient } from '@/lib/supabase-client'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    name: '',
    userType: 'customer' // customer or expert
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.')
      setIsLoading(false)
      return
    }

    // 비밀번호 길이 체크
    if (formData.password.length < 6) {
      setErrorMessage('비밀번호는 6자 이상이어야 합니다.')
      setIsLoading(false)
      return
    }

    try {
      // 1. 전화번호 중복 체크 (RLS 정책으로 인해 공개 함수 필요)
      // 임시로 Supabase Auth 에러로 이메일 중복을 체크하고,
      // 전화번호는 프로필 생성 시 에러로 체크

      // 2. Supabase Auth로 사용자 생성 (이메일 중복은 여기서 자동 체크됨)
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        console.error('Auth error:', authError)
        if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
          setErrorMessage('이미 가입된 이메일입니다.')
        } else if (authError.message.includes('422')) {
          setErrorMessage('이메일 형식이 올바르지 않거나 이미 사용중인 이메일입니다.')
        } else {
          setErrorMessage('회원가입 중 오류가 발생했습니다: ' + authError.message)
        }
        setIsLoading(false)
        return
      }

      // 2. profiles 테이블에 추가 정보 저장 (이중 역할 시스템)
      if (authData.user) {
        // 2-1. 기본 프로필 생성 (기본적으로 customer 역할)
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              username: formData.username,
              email: formData.email,
              name: formData.name,
              phone: formData.phone,
              user_type: 'customer', // 기본 역할은 고객
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (profileError) {
          console.error('Profile error:', profileError)
          if (profileError.message.includes('unique_phone') || profileError.message.includes('duplicate key')) {
            setErrorMessage('이미 가입된 전화번호입니다.')
          } else {
            setErrorMessage('프로필 생성 중 오류가 발생했습니다: ' + profileError.message)
          }
          setIsLoading(false)
          return
        }

        // 2-2. 전문가로 가입 선택시 추가 설정
        if (formData.userType === 'expert') {
          // user_type을 expert로 설정
          const { error: activeRoleError } = await supabaseClient
            .from('profiles')
            .update({ user_type: 'expert' })
            .eq('id', authData.user.id)

          if (activeRoleError) {
            console.error('Active role error:', activeRoleError)
          }
        }
      }

      // 성공시 로그인 페이지로 리다이렉트
      alert('회원가입이 완료되었습니다! 로그인해주세요.')
      router.push('/auth/login')

    } catch (err) {
      setErrorMessage('회원가입 중 오류가 발생했습니다.')
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
              Provee 회원가입
            </h1>
            <p className="text-gray-600">
              계정을 만들어 서비스를 이용하세요
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">회원가입</CardTitle>
            </CardHeader>
            <CardContent>
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 사용자 타입 선택 */}
                <div className="space-y-2">
                  <Label htmlFor="userType">가입 유형</Label>
                  <select
                    id="userType"
                    name="userType"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                  >
                    <option value="customer">고객 (서비스 이용)</option>
                    <option value="expert">전문가 (서비스 제공)</option>
                  </select>
                </div>

                {/* 이름 */}
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="실명을 입력하세요"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* 아이디 */}
                <div className="space-y-2">
                  <Label htmlFor="username">아이디</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="아이디를 입력하세요"
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* 이메일 */}
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* 전화번호 */}
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="010-0000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* 비밀번호 */}
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요 (6자 이상)"
                      value={formData.password}
                      onChange={handleChange}
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

                {/* 비밀번호 확인 */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600"
                  disabled={isLoading}
                >
                  {isLoading ? "가입 중..." : "회원가입"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  이미 계정이 있으신가요?{' '}
                  <Link
                    href="/auth/login"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    로그인
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