'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()

  const handleKakaoAuth = () => {
    // TODO: 카카오 OAuth 연동
    console.log('Kakao auth')
    router.push('/expert/join/onboarding/profile')
  }

  const handleNaverAuth = () => {
    // TODO: 네이버 OAuth 연동
    console.log('Naver auth')
    router.push('/expert/join/onboarding/profile')
  }

  const handleEmailAuth = () => {
    // TODO: 이메일 인증 플로우
    console.log('Email auth')
    router.push('/expert/join/onboarding/profile')
  }

  const handleBack = () => {
    router.push('/expert/join/onboarding/services')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={handleBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-sm text-gray-500">3/5</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            필수정보 입력 방식을<br />
            선택해주세요
          </h1>
          <p className="text-gray-600">
            간편하게 소셜 계정으로 시작하거나<br />
            이메일로 직접 가입하실 수 있습니다.
          </p>
        </div>

        <div className="space-y-4">
          {/* 카카오 로그인 */}
          <Button
            onClick={handleKakaoAuth}
            className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
            </svg>
            카카오로 시작하기
          </Button>

          {/* 네이버 로그인 */}
          <Button
            onClick={handleNaverAuth}
            className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg"
          >
            <span className="w-6 h-6 mr-3 bg-white text-green-500 rounded font-bold flex items-center justify-center text-sm">
              N
            </span>
            네이버로 시작하기
          </Button>

          {/* 이메일 로그인 */}
          <Button
            onClick={handleEmailAuth}
            variant="outline"
            className="w-full h-14 border-2 font-semibold text-lg hover:bg-gray-50"
          >
            이메일로 시작하기
          </Button>
        </div>

        {/* 약관 동의 안내 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            계속 진행하시면{' '}
            <button className="text-blue-600 underline">이용약관</button>과{' '}
            <button className="text-blue-600 underline">개인정보처리방침</button>에<br />
            동의하는 것으로 간주됩니다.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={handleBack}>
            이전
          </Button>
        </div>
      </div>
    </div>
  )
}