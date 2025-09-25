'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { matchingService, type MatchedExpert } from '@/lib/matching'
import type { Database } from '@/types/supabase'

type ServiceCategory = Database['public']['Enums']['service_category']

function MatchingResults() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') as ServiceCategory || '청소'
  const location = searchParams.get('location') || '지역'
  const budget = searchParams.get('budget') || '예산'
  const description = searchParams.get('description') || ''

  const [experts, setExperts] = useState<MatchedExpert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function findMatches() {
      try {
        setLoading(true)
        setError('')

        // 예산 범위 파싱
        const budgetParts = budget.split('-')
        const budgetMin = parseInt(budgetParts[0]) || 10
        const budgetMax = budgetParts[1] === '+' ? 200 : parseInt(budgetParts[1]) || budgetMin + 20

        const matchingRequest = {
          category,
          location: `서울 ${location}`,
          budgetMin: budgetMin * 10000, // 만원 -> 원
          budgetMax: budgetMax * 10000,
          description
        }

        const matchedExperts = await matchingService.findMatches(matchingRequest)
        setExperts(matchedExperts)

        if (matchedExperts.length === 0) {
          setError('조건에 맞는 전문가를 찾을 수 없습니다. 조건을 조정해서 다시 시도해주세요.')
        }

      } catch (err) {
        console.error('Matching error:', err)
        setError('매칭 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (category && location && budget) {
      findMatches()
    }
  }, [category, location, budget, description])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">AI가 최적의 전문가를 찾고 있습니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm">
                  ← 홈으로
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Provee</h1>
                <p className="text-sm text-gray-600">매칭 결과</p>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                추천 전문가 ({experts.length}명)
              </h1>
              <p className="text-lg text-gray-600">
                {category} • {location} • {budget}만원
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" size="lg">
                새로운 요청하기
              </Button>
            </Link>
          </div>

          {/* Info Banner */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">AI 매칭 완료</h3>
                <p className="text-sm text-blue-800">
                  매칭률 50% 이상인 전문가만 추천되었습니다. 점수가 높을수록 더 적합한 전문가입니다.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Card className="p-8 mb-8 bg-red-50 border-red-200 text-center">
            <div className="text-4xl mb-4">😞</div>
            <h3 className="text-xl font-semibold text-red-900 mb-2">매칭 결과가 없습니다</h3>
            <p className="text-red-800 mb-6">{error}</p>
            <Link href="/">
              <Button variant="outline" size="lg">
                새로운 요청하기
              </Button>
            </Link>
          </Card>
        )}

        {/* Matching Results */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <Card key={expert.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* Expert Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{expert.profile.name}</h3>
                      {expert.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✅ 인증
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(expert.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="font-semibold">{expert.rating || 0}</span>
                      <span>•</span>
                      <span>리뷰 {expert.review_count || 0}개</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    expert.matchScore >= 80 ? 'text-green-600' :
                    expert.matchScore >= 60 ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {expert.matchScore}%
                  </div>
                  <div className="text-sm text-gray-500">매칭률</div>
                </div>
              </div>

              {/* Match Score Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      expert.matchScore >= 80 ? 'bg-green-500' :
                      expert.matchScore >= 60 ? 'bg-blue-600' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${expert.matchScore}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-500">
                  <span>서비스: {expert.serviceScore}점</span>
                  <span>지역: {expert.locationScore}점</span>
                  <span>가격: {expert.priceScore}점</span>
                </div>
              </div>

              {/* Expert Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">전문 분야</span>
                  <span className="font-medium">{expert.category?.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">지역</span>
                  <span className="font-medium">{expert.profile.district || '서울'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">가격대</span>
                  <span className="font-medium text-blue-600">
                    {Math.floor(expert.price_min/10000)}-{Math.floor(expert.price_max/10000)}만원
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">응답시간</span>
                  <span className="font-medium">{expert.response_time_hours || 24}시간</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">완료 프로젝트</span>
                  <span className="font-medium">{expert.completed_projects || 0}건</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link href={`/expert/${expert.id}`} className="flex-1">
                  <Button variant="outline" className="w-full h-12">
                    상세정보 보기
                  </Button>
                </Link>
                <Link href={`/contact/${expert.id}`} className="flex-1">
                  <Button className="w-full h-12">
                    📞 연락하기
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        {experts.length > 0 && (
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                💡 매칭률이란?
              </h3>
              <p className="text-blue-800 mb-4">
                AI가 계산한 요청 내용과 전문가의 서비스, 위치, 가격 호환성을 나타냅니다.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 서비스 매칭: 60점 (카테고리 일치도)</li>
                <li>• 지역 매칭: 25점 (거리 및 접근성)</li>
                <li>• 가격 매칭: 15점 (예산 범위 적합도)</li>
              </ul>
            </Card>

            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="text-xl font-semibold text-green-900 mb-3">
                🎯 다음 단계
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <span className="text-green-800">관심있는 전문가 상세정보 확인</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <span className="text-green-800">직접 연락하여 상담 및 견적 요청</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <span className="text-green-800">조건 협의 후 서비스 계약 체결</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MatchingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">로딩 중...</div>}>
      <MatchingResults />
    </Suspense>
  )
}