'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import Link from 'next/link'
import {
  TrendingUp,
  Star,
  Clock,
  Users,
  DollarSign,
  Calendar,
  Settings,
  BarChart3,
  MessageSquare,
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

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
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">전문가 대시보드</h1>
          <p className="text-gray-600">김전문님, 오늘도 좋은 서비스로 고객들을 만족시켜 보세요!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">이번 달 매칭</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.thisMonth.matches}</p>
                <p className="text-sm text-green-600 font-medium">+20% vs 지난달</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">이번 달 수입</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(mockStats.thisMonth.revenue / 10000).toFixed(0)}만원
                </p>
                <p className="text-sm text-green-600 font-medium">+15% vs 지난달</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">평균 평점</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.thisMonth.rating}</p>
                <p className="text-sm text-green-600 font-medium">+0.2 vs 지난달</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">응답률</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.thisMonth.responseRate}%</p>
                <p className="text-sm text-green-600 font-medium">+5% vs 지난달</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* New Requests */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
                  새로운 견적 요청 ({mockRequests.length}건)
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

            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h3>
              <div className="space-y-3">
                <Link href="/profile/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    프로필 설정
                  </Button>
                </Link>
                <Link href="/expert/history">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    실적 보기
                  </Button>
                </Link>
                <Link href="/expert/schedule">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    일정 관리
                  </Button>
                </Link>
                <Link href="/expert/messages">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    메시지 확인
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Active Projects */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                진행 중인 프로젝트
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="font-medium text-gray-900">강남구 아파트 청소</div>
                  <div className="text-sm text-gray-600 mb-2">진행률: 50% • 마감: 2일 후</div>
                  <Badge variant="outline" className="text-xs">
                    진행중
                  </Badge>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="font-medium text-gray-900">서초구 사무실 정기청소</div>
                  <div className="text-sm text-gray-600 mb-2">다음 방문: 내일 오후 2시</div>
                  <Badge variant="outline" className="text-xs bg-green-100">
                    예정
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Achievement Badge */}
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div className="text-center">
                <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-semibold text-yellow-900 mb-2">이달의 우수 전문가</h3>
                <p className="text-sm text-yellow-800">고객 만족도 95% 달성!</p>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                매칭률 높이는 팁
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  프로필을 상세히 작성하세요
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  빠른 응답으로 신뢰도를 높이세요
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  포트폴리오 사진을 추가하세요
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}