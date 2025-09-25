'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/hooks/useUser'
import {
  ArrowLeft,
  Clock,
  MapPin,
  DollarSign,
  MessageSquare,
  Star,
  Calendar,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface QuoteRequest {
  id: string
  title: string
  category: string
  subcategory: string
  location: string
  date: string
  budget: string
  status: 'pending' | 'matched' | 'in_progress' | 'completed' | 'cancelled'
  quotesCount: number
  createdAt: string
  description?: string
}

export default function RequestsPage() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [activeFilter, setActiveFilter] = useState('all')

  // Mock data - 실제로는 API에서 가져와야 함
  const [requests] = useState<QuoteRequest[]>([
    {
      id: '1',
      title: '투룸 포장이사',
      category: '이사/청소',
      subcategory: '포장이사',
      location: '서울시 강남구',
      date: '2025-09-30',
      budget: '100-200만원',
      status: 'pending',
      quotesCount: 3,
      createdAt: '2025-09-26',
      description: '투룸에서 투룸으로 이사 예정입니다. 포장도 함께 부탁드립니다.'
    },
    {
      id: '2',
      title: '홈클리닝 서비스',
      category: '이사/청소',
      subcategory: '홈클리닝',
      location: '서울시 서초구',
      date: '2025-09-28',
      budget: '10-20만원',
      status: 'matched',
      quotesCount: 5,
      createdAt: '2025-09-25',
      description: '정기적인 홈클리닝 서비스를 원합니다.'
    },
    {
      id: '3',
      title: '영어 과외',
      category: '과외',
      subcategory: '영어',
      location: '서울시 송파구',
      date: '2025-10-01',
      budget: '월 40만원',
      status: 'completed',
      quotesCount: 7,
      createdAt: '2025-09-20',
      description: '토익 점수 향상을 위한 영어 과외를 찾습니다.'
    }
  ])

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const statusLabels = {
    pending: '견적 대기',
    matched: '매칭 완료',
    in_progress: '진행 중',
    completed: '완료',
    cancelled: '취소됨'
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    matched: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  const filters = [
    { id: 'all', label: '전체', count: requests.length },
    { id: 'pending', label: '견적 대기', count: requests.filter(r => r.status === 'pending').length },
    { id: 'matched', label: '매칭 완료', count: requests.filter(r => r.status === 'matched').length },
    { id: 'completed', label: '완료', count: requests.filter(r => r.status === 'completed').length }
  ]

  const filteredRequests = activeFilter === 'all'
    ? requests
    : requests.filter(request => request.status === activeFilter)

  const handleRequestClick = (requestId: string) => {
    router.push(`/profile/requests/${requestId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">내 견적 요청</h1>
              <p className="text-gray-600">요청한 견적의 진행 상황을 확인하세요</p>
            </div>
          </div>
          <Button
            onClick={() => router.push('/request')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            새 견적 요청
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter.label}
              <span className="ml-1 text-xs">({filter.count})</span>
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeFilter === 'all' ? '견적 요청이 없습니다' : `${statusLabels[activeFilter as keyof typeof statusLabels]} 상태의 요청이 없습니다`}
              </h3>
              <p className="text-gray-600 mb-6">
                전문가들에게 견적을 요청하고 최적의 서비스를 받아보세요.
              </p>
              <Button
                onClick={() => router.push('/request')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                첫 견적 요청하기
              </Button>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card
                key={request.id}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleRequestClick(request.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {request.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-gray-100 rounded-md">
                            {request.category}
                          </span>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {request.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {request.date}
                          </div>
                        </div>
                      </div>
                      <Badge className={statusColors[request.status]}>
                        {statusLabels[request.status]}
                      </Badge>
                    </div>

                    {request.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {request.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {request.budget}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {request.quotesCount}개 견적
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {request.createdAt} 요청
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRequestClick(request.id)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          보기
                        </Button>

                        {request.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                // TODO: 수정 페이지로 이동
                              }}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              수정
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                // TODO: 삭제 확인 모달
                              }}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              취소
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress indicator for matched/in-progress requests */}
                {(request.status === 'matched' || request.status === 'in_progress') && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">진행 상태</span>
                      <span className="font-medium text-blue-600">
                        {request.status === 'matched' ? '전문가 매칭 완료' : '서비스 진행 중'}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}