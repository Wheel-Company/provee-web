'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('')
  const [description, setDescription] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏠</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Provee</h1>
                <p className="text-sm text-gray-600">AI 기반 전문가 매칭 플랫폼</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/expert">
                <Button variant="outline">전문가 등록</Button>
              </Link>
              <Link href="/login">
                <Button>로그인</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                AI가 찾아주는<br />
                <span className="text-blue-600">맞춤 전문가</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                3분만에 전문가 5명을 추천받고,<br />
                최적의 서비스 파트너를 만나보세요
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">3분</div>
                  <div className="text-sm text-gray-600">빠른 매칭</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">87%</div>
                  <div className="text-sm text-gray-600">매칭 성공률</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">4.8★</div>
                  <div className="text-sm text-gray-600">평균 만족도</div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div>
              <Card className="p-8 shadow-lg">
                <h3 className="text-2xl font-semibold mb-6">
                  어떤 서비스가 필요하세요?
                </h3>

                {/* Category Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    카테고리 선택
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['청소', '수리', '과외', '디자인'].map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="h-14 text-lg"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === '청소' && '🧹'}
                        {category === '수리' && '🔧'}
                        {category === '과외' && '📚'}
                        {category === '디자인' && '🎨'} {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Location & Budget Row */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      지역
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-md"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value="">지역 선택</option>
                      <option value="강남구">서울 강남구</option>
                      <option value="강북구">서울 강북구</option>
                      <option value="서초구">서울 서초구</option>
                      <option value="송파구">서울 송파구</option>
                      <option value="영등포구">서울 영등포구</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      예산
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-md"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    >
                      <option value="">예산 범위</option>
                      <option value="10-30">10-30만원</option>
                      <option value="30-50">30-50만원</option>
                      <option value="50-100">50-100만원</option>
                      <option value="100+">100만원 이상</option>
                    </select>
                  </div>
                </div>

                {/* Request Details */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    요청 내용
                  </label>
                  <textarea
                    className="w-full p-4 border border-gray-300 rounded-md h-32 resize-none"
                    placeholder="구체적인 요청 내용을 입력해주세요..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* CTA Button */}
                <Link href={`/matching?category=${selectedCategory}&location=${location}&budget=${budget}&description=${description}`}>
                  <Button
                    className="w-full h-14 text-lg font-semibold"
                    disabled={!selectedCategory || !location || !budget}
                  >
                    전문가 찾기 🚀
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">이용 방법</h3>
            <p className="text-lg text-gray-600">간단한 3단계로 최적의 전문가를 만나보세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✏️</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">1. 요청 작성</h4>
              <p className="text-gray-600">필요한 서비스와 조건을 입력하세요 (3분)</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">2. AI 매칭</h4>
              <p className="text-gray-600">AI가 최적의 전문가 5명을 추천합니다 (2분)</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">3. 전문가 연락</h4>
              <p className="text-gray-600">마음에 드는 전문가에게 바로 연락하세요 (1분)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🏠</span>
                <span className="font-bold text-xl">Provee</span>
              </div>
              <p className="text-gray-400">
                AI 기반 전문가 매칭 플랫폼
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li>청소 서비스</li>
                <li>수리 서비스</li>
                <li>과외 서비스</li>
                <li>디자인 서비스</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400">
                <li>회사 소개</li>
                <li>서비스 소개</li>
                <li>채용 정보</li>
                <li>문의하기</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li>고객 센터</li>
                <li>이용 가이드</li>
                <li>자주 묻는 질문</li>
                <li>개인정보 처리방침</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Provee. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}