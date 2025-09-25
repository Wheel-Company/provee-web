'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Star,
  MapPin,
  Clock,
  Award,
  Shield,
  Heart,
  MessageSquare,
  Phone,
  ArrowLeft
} from 'lucide-react'

// Mock data for expert details
const mockExpertData: { [key: string]: any } = {
  '1': {
    id: 1,
    name: '김전문',
    rating: 4.8,
    reviewCount: 24,
    category: '홈클리닝',
    location: '서울 강남구',
    pricePerHour: 30000,
    experience: 5,
    verified: true,
    responseTime: '2시간',
    completedProjects: 156,
    about: '5년간 홈클리닝 전문가로 활동해왔습니다. 깔끔하고 꼼꼼한 청소로 고객 만족도를 최우선으로 합니다.',
    services: ['일반 청소', '대청소', '이사 청소', '사무실 청소'],
    portfolio: [
      { id: 1, title: '아파트 대청소 완료', image: '🏠' },
      { id: 2, title: '사무실 정기 청소', image: '🏢' },
      { id: 3, title: '신축 아파트 입주 청소', image: '✨' }
    ],
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: '정말 꼼꼼하게 청소해주셨어요. 다음에도 부탁드릴게요!',
        date: '2024-01-15',
        customer: '김고객'
      },
      {
        id: 2,
        rating: 5,
        comment: '시간 약속도 잘 지키시고 청소 실력도 최고예요.',
        date: '2024-01-10',
        customer: '이고객'
      },
      {
        id: 3,
        rating: 4,
        comment: '만족합니다. 가격도 합리적이고 서비스 좋아요.',
        date: '2024-01-05',
        customer: '박고객'
      }
    ]
  },
  '2': {
    id: 2,
    name: '이전문',
    rating: 4.6,
    reviewCount: 18,
    category: '홈클리닝',
    location: '서울 강남구',
    pricePerHour: 28000,
    experience: 3,
    verified: true,
    responseTime: '4시간',
    completedProjects: 89
  }
}

export default function ExpertDetailPage({ params }: { params: { id: string } }) {
  const expert = mockExpertData[params.id]

  if (!expert) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/search" className="hover:text-blue-600">
            서비스 찾기
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">전문가 상세</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expert Profile */}
            <Card className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {expert.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{expert.name}</h1>
                      {expert.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          인증 전문가
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-lg text-gray-600 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < Math.floor(expert.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="font-semibold">{expert.rating}</span>
                      <span>(리뷰 {expert.reviewCount}개)</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {expert.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        평균 {expert.responseTime} 응답
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {expert.completedProjects}건 완료
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              {/* About */}
              {expert.about && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">소개</h3>
                  <p className="text-gray-700 leading-relaxed">{expert.about}</p>
                </div>
              )}

              {/* Services */}
              {expert.services && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">제공 서비스</h3>
                  <div className="flex flex-wrap gap-2">
                    {expert.services.map((service: string, index: number) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Info Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">서비스 분야</span>
                    <span className="font-semibold">{expert.category}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">지역</span>
                    <span className="font-semibold">{expert.location}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">경력</span>
                    <span className="font-semibold">{expert.experience}년</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-600 font-medium">시간당 요금</span>
                    <span className="font-semibold text-blue-600">
                      {expert.pricePerHour?.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">평균 응답시간</span>
                    <span className="font-semibold">{expert.responseTime}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">완료 프로젝트</span>
                    <span className="font-semibold">{expert.completedProjects || 0}건</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Portfolio */}
            {expert.portfolio && (
              <Card className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">📸 포트폴리오 ({expert.portfolio.length}장)</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {expert.portfolio.map((item: any) => (
                    <div key={item.id} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-4xl hover:bg-gray-200 transition-colors">
                      {item.image}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews */}
            {expert.reviews && (
              <Card className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">💬 고객 리뷰</h3>
                <div className="space-y-6">
                  {expert.reviews.slice(0, 3).map((review: any) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="font-medium text-gray-700">{review.customer}</span>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">연락하기</h3>
              <div className="space-y-3">
                <Link href={`/request?expert=${expert.id}`}>
                  <Button className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700">
                    <Phone className="w-5 h-5 mr-2" />
                    견적 요청하기
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-12 text-base">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  채팅으로 문의
                </Button>
                <Button variant="outline" className="w-full h-12 text-base">
                  <Heart className="w-5 h-5 mr-2" />
                  관심 전문가 추가
                </Button>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">빠른 응답</span>
                </div>
                <p className="text-sm text-green-700">
                  평균 {expert.responseTime} 내 응답합니다
                </p>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-center">
                  <p className="text-sm text-blue-800 font-medium">시간당 예상 비용</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {expert.pricePerHour?.toLocaleString()}원
                  </p>
                </div>
              </div>
            </Card>

            {/* Similar Experts */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">유사한 전문가</h3>
              <div className="space-y-4">
                <Link href="/expert/2">
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      👤
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">이전문</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <span>⭐ 4.6</span>
                        <span>•</span>
                        <span>청소 전문</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      보기
                    </Button>
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}