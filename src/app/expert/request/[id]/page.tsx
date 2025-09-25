'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState } from 'react'

// Mock data for request details
const mockRequestData: { [key: string]: any } = {
  '1': {
    id: 1,
    service: '홈클리닝',
    location: '서울 강남구 삼성동',
    budget: {
      min: 30,
      max: 50
    },
    schedule: '이번 주말',
    description: '3룸 아파트 전체 청소 필요. 화장실 2개, 베란다 포함. 애완동물(강아지) 있음.',
    requirements: [
      '친환경 세제 사용 희망',
      '오전 10시~오후 5시 사이',
      '주차공간 있음',
      '엘리베이터 이용 가능'
    ],
    customer: {
      name: '김고객',
      verified: true,
      rating: 4.2,
      previousOrders: 8,
      location: '강남구'
    },
    matchScore: 87,
    matchReasons: [
      '서비스 카테고리 완전 일치 (60/60점)',
      '지역 매칭 높음 (23/25점)',
      '예산 범위 적합 (4/15점)'
    ],
    postedTime: '2024-01-20 14:30',
    applicants: 3,
    deadline: '2024-01-22 18:00'
  },
  '2': {
    id: 2,
    service: '사무실청소',
    location: '서울 서초구',
    budget: {
      min: 60,
      max: 80
    },
    schedule: '주 2회 정기',
    description: '50평 사무실 정기 청소 서비스. 월~금 운영, 주 2회 방문 희망'
  }
}

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  const [isInterested, setIsInterested] = useState(false)
  const [showContact, setShowContact] = useState(false)

  const request = mockRequestData[params.id]

  if (!request) {
    notFound()
  }

  const handleInterest = () => {
    setIsInterested(true)
    setShowContact(true)
  }

  const handlePass = () => {
    // Handle pass logic
    alert('이 요청을 패스했습니다.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/expert">
            <Button variant="outline" size="sm" className="mb-4">
              ← 대시보드로
            </Button>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-bold text-gray-900">고객 요청 상세</h1>
              <p className="text-sm text-gray-600">{request.postedTime}</p>
            </div>
            <Badge variant="outline" className="bg-blue-50">
              신규 요청
            </Badge>
          </div>
        </div>

        {/* Match Score */}
        <Card className="p-4 mb-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-green-900">매칭률</h2>
            <span className="text-2xl font-bold text-green-600">{request.matchScore}%</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-3 mb-3">
            <div
              className="bg-green-600 h-3 rounded-full"
              style={{ width: `${request.matchScore}%` }}
            />
          </div>
          <div className="text-sm text-green-800">
            <div className="font-medium mb-1">매칭 점수 상세:</div>
            <ul className="space-y-1">
              {request.matchReasons?.map((reason: string, index: number) => (
                <li key={index}>• {reason}</li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Request Details */}
        <Card className="p-4 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">요청 정보</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">서비스:</span>
              <span className="font-medium">{request.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">지역:</span>
              <span className="font-medium">{request.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">예산:</span>
              <span className="font-medium text-blue-600">
                {request.budget.min}-{request.budget.max}만원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">일정:</span>
              <span className="font-medium">{request.schedule}</span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-medium text-gray-900 mb-2">요청 내용:</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {request.description}
            </p>
          </div>

          {request.requirements && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 mb-2">추가 요구사항:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {request.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Customer Info */}
        <Card className="p-4 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">고객 정보</h2>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{request.customer.name}</span>
                {request.customer.verified && (
                  <Badge variant="secondary" className="text-xs">
                    인증
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-600">
                평점: {request.customer.rating} • 거래: {request.customer.previousOrders}회
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <div className="flex justify-between">
              <span>위치:</span>
              <span>{request.customer.location}</span>
            </div>
          </div>
        </Card>

        {/* Competition Info */}
        <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
          <h2 className="font-semibold text-yellow-900 mb-2">경쟁 현황</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-yellow-800">현재 지원자: {request.applicants}명</span>
            <span className="text-yellow-800">마감: {new Date(request.deadline).toLocaleDateString()}</span>
          </div>
        </Card>

        {/* Action Buttons */}
        {!isInterested ? (
          <div className="flex gap-3 mb-6">
            <Button
              variant="outline"
              className="flex-1 h-12"
              onClick={handlePass}
            >
              패스
            </Button>
            <Button
              className="flex-1 h-12 bg-green-600 hover:bg-green-700"
              onClick={handleInterest}
            >
              관심 있음
            </Button>
          </div>
        ) : (
          <Card className="p-4 mb-6 bg-green-50 border-green-200">
            <div className="text-center">
              <div className="text-green-600 text-2xl mb-2">✅</div>
              <h3 className="font-semibold text-green-900 mb-2">관심 표시 완료!</h3>
              <p className="text-sm text-green-800 mb-3">
                고객에게 귀하의 프로필이 전달되었습니다.
              </p>
              {showContact && (
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-600 mb-2">고객 연락처:</p>
                  <p className="font-mono text-lg">010-1234-5678</p>
                  <p className="text-xs text-gray-500 mt-1">
                    * 연락처는 관심 표시한 전문가에게만 제공됩니다
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Tips */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 성공 팁</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 빠른 연락으로 우선권을 확보하세요</li>
            <li>• 구체적인 서비스 계획을 제시하세요</li>
            <li>• 고객 요구사항을 꼼꼼히 확인하세요</li>
            <li>• 합리적인 가격으로 경쟁력을 높이세요</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}