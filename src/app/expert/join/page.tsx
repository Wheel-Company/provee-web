'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SimpleHeader } from '@/components/layout/header'
import {
  Star,
  Users,
  TrendingUp,
  Clock,
  Shield,
  Smartphone,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

export default function ExpertJoinPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const router = useRouter()

  const successStories = [
    {
      name: '김청소',
      service: '홈클리닝',
      monthlyIncome: '180만원',
      rating: 4.9,
      image: '/api/placeholder/80/80',
      review: '체계적인 매칭 시스템 덕분에 안정적인 수입을 얻고 있어요.'
    },
    {
      name: '박인테리어',
      service: '인테리어',
      monthlyIncome: '320만원',
      rating: 4.8,
      image: '/api/placeholder/80/80',
      review: 'AI 매칭으로 정말 딱 맞는 고객들만 연결되어서 만족도가 높아요.'
    },
    {
      name: '이과외',
      service: '과외',
      monthlyIncome: '250만원',
      rating: 4.9,
      image: '/api/placeholder/80/80',
      review: '플랫폼이 안정적이고 고객 관리도 편리해서 추천합니다.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Custom Header with Back Button */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                뒤로
              </Button>
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="font-bold text-gray-900 text-xl">Provee</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI 고객매칭 AI 수익예측<br />
            새로운 전문가 플랫폼
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Provee에서 활동 중인 전문가의 평균 수익
          </p>
          <div className="text-6xl font-bold mb-8">
            150만원<span className="text-3xl">/월</span>
          </div>
          <Link href="/expert/join/onboarding">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
            전문가 활동 중인 3단계 간편 프로세스
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">STEP 1. 간편가입</h3>
              <p className="text-gray-600 mb-6">
                간편하게 핵심 정보만<br />
                으로 빠르게 가입 진행
              </p>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-sm text-gray-500">모바일 가입 화면</div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">STEP 2. 빠른 프로필 완성</h3>
              <p className="text-gray-600 mb-6">
                전문 분야와 경력을<br />
                상세히 등록하세요
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded p-2 shadow-sm">
                    <div className="w-full h-16 bg-gray-100 rounded mb-1"></div>
                    <div className="text-xs text-gray-400">단계 {i}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">STEP 3. 고객 응답 및 수익</h3>
              <p className="text-gray-600 mb-6">
                Provee에서 알아서<br />
                고객을 보내드려요
              </p>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-green-600 mb-2">+150만원</div>
                <div className="text-sm text-gray-500">이번 달 예상 수익</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Matching Feature */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                15만명 전문가가 활동 중인<br />
                Provee에 지금 무료로 가입
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-lg">AI 기반 정확한 고객 매칭</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-lg">실시간 수익 예측 시스템</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-lg">24시간 고객 관리 지원</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-lg">투명한 수수료 정책</span>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/expert/join/onboarding">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg">
                    지금 바로 시작하기
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">실시간 매칭 현황</h3>
                  <Badge className="bg-green-100 text-green-800">LIVE</Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <div>
                      <div className="font-medium">홈클리닝 - 강남구</div>
                      <div className="text-sm text-gray-600">매칭률 95%</div>
                    </div>
                    <Badge variant="outline">매칭중</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <div>
                      <div className="font-medium">인테리어 - 서초구</div>
                      <div className="text-sm text-gray-600">매칭률 89%</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">완료</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <div>
                      <div className="font-medium">과외 - 송파구</div>
                      <div className="text-sm text-gray-600">매칭률 78%</div>
                    </div>
                    <Badge variant="outline">대기중</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            진짜 전문가들이 이야기하는 Provee
          </h2>
          <p className="text-center text-gray-600 mb-12">실제 활동 중인 전문가들의 생생한 후기</p>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{story.name}</h3>
                    <p className="text-gray-600">{story.service}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {story.monthlyIncome}/월
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm font-medium">{story.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">평점</span>
                  </div>
                </div>

                <p className="text-gray-700 italic">"{story.review}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            지금 시작하면 첫 달 수수료 50% 할인!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            신규 전문가를 위한 특별 혜택을 놓치지 마세요
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/expert/join/onboarding">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                무료 가입하기
              </Button>
            </Link>
            <Link href="/expert">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
                더 알아보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}