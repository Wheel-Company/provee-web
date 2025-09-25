'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Mock data for expert dashboard
const mockRequests = [
  {
    id: 1,
    service: '홈클리닝',
    location: '강남구',
    budget: '50만원',
    matchScore: 87,
    description: '3룸 아파트 전체 청소 필요. 화장실 2개, 베란다 포함',
    postedTime: '2시간 전',
    customerType: 'verified'
  },
  {
    id: 2,
    service: '사무실청소',
    location: '서초구',
    budget: '80만원',
    matchScore: 65,
    description: '50평 사무실 정기 청소 서비스. 주 2회 방문',
    postedTime: '4시간 전',
    customerType: 'new'
  },
  {
    id: 3,
    service: '이사청소',
    location: '송파구',
    budget: '120만원',
    matchScore: 92,
    description: '신축 아파트 입주 전 청소. 4룸, 화장실 3개',
    postedTime: '6시간 전',
    customerType: 'verified'
  }
]

const mockStats = {
  thisMonth: {
    matches: 5,
    revenue: 1200000,
    rating: 4.8,
    responseRate: 95
  },
  pendingRequests: 3,
  activeProjects: 2
}

export default function ExpertDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">전문가 대시보드</h1>
            <p className="text-sm text-gray-600">김전문님, 안녕하세요!</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              홈으로
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <Card className="p-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">📊 이번 달 현황</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{mockStats.thisMonth.matches}건</div>
              <div className="text-sm text-gray-600">매칭</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {(mockStats.thisMonth.revenue / 10000).toFixed(0)}만원
              </div>
              <div className="text-sm text-gray-600">수입</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{mockStats.thisMonth.rating}</div>
              <div className="text-sm text-gray-600">평균 평점</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{mockStats.thisMonth.responseRate}%</div>
              <div className="text-sm text-gray-600">응답률</div>
            </div>
          </div>
        </Card>

        {/* New Requests */}
        <Card className="p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">
              🆕 새 요청 ({mockRequests.length}건)
            </h2>
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              NEW
            </Badge>
          </div>

          <div className="space-y-3">
            {mockRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                {/* Request Header */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {request.service} - {request.location}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>매칭률: {request.matchScore}%</span>
                      <span>•</span>
                      <span>예산: {request.budget}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={request.customerType === 'verified' ? 'default' : 'outline'}
                      className="text-xs mb-1"
                    >
                      {request.customerType === 'verified' ? '인증고객' : '신규고객'}
                    </Badge>
                    <div className="text-xs text-gray-500">{request.postedTime}</div>
                  </div>
                </div>

                {/* Match Score Bar */}
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        request.matchScore >= 80 ? 'bg-green-500' :
                        request.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${request.matchScore}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    이유: 서비스 일치, 위치 가까움
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {request.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link href={`/expert/request/${request.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      상세보기
                    </Button>
                  </Link>
                  <Button size="sm" className="flex-1">
                    관심있음
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Projects */}
        <Card className="p-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">🔄 진행 중인 프로젝트</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <div>
                <div className="font-medium text-sm">강남구 아파트 청소</div>
                <div className="text-xs text-gray-600">진행률: 50% • 마감: 2일 후</div>
              </div>
              <Badge variant="outline" className="text-xs">
                진행중
              </Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <div>
                <div className="font-medium text-sm">서초구 사무실 정기청소</div>
                <div className="text-xs text-gray-600">다음 방문: 내일 오후 2시</div>
              </div>
              <Badge variant="outline" className="text-xs bg-green-100">
                예정
              </Badge>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/expert/profile">
            <Button variant="outline" className="w-full h-12">
              ⚙️ 프로필 설정
            </Button>
          </Link>
          <Link href="/expert/history">
            <Button variant="outline" className="w-full h-12">
              📈 실적 보기
            </Button>
          </Link>
        </div>

        {/* Tips */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2">💡 매칭률 높이는 팁</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 프로필을 상세히 작성하세요</li>
            <li>• 빠른 응답으로 신뢰도를 높이세요</li>
            <li>• 포트폴리오 사진을 추가하세요</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}