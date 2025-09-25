'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import Link from 'next/link'
import {
  Search,
  Home,
  Brush,
  Calendar,
  GraduationCap,
  Car,
  Settings,
  Zap,
  Briefcase,
  Scale,
  Heart,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  Shield,
  ArrowRight
} from 'lucide-react'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  // 메인 카테고리
  const mainCategories = [
    { name: '이사/청소', icon: Home, color: 'bg-blue-100 text-blue-600' },
    { name: '인테리어', icon: Brush, color: 'bg-green-100 text-green-600' },
    { name: '이벤트/파티', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
    { name: '과외', icon: GraduationCap, color: 'bg-yellow-100 text-yellow-600' },
    { name: '자동차', icon: Car, color: 'bg-red-100 text-red-600' },
    { name: '설치/수리', icon: Settings, color: 'bg-indigo-100 text-indigo-600' },
    { name: '외주', icon: Zap, color: 'bg-orange-100 text-orange-600' },
    { name: '취업/직무', icon: Briefcase, color: 'bg-teal-100 text-teal-600' },
    { name: '법률/금융', icon: Scale, color: 'bg-gray-100 text-gray-600' },
    { name: '취미/자기계발', icon: Heart, color: 'bg-pink-100 text-pink-600' }
  ]

  // 실시간 요청
  const liveRequests = [
    { service: '홈클리닝', location: '강남구', time: '5분 전', budget: '15만원' },
    { service: '인테리어 컨설팅', location: '서초구', time: '12분 전', budget: '50만원' },
    { service: '영어 과외', location: '송파구', time: '18분 전', budget: '월 40만원' },
    { service: '자동차 정비', location: '마포구', time: '23분 전', budget: '30만원' }
  ]

  // 인기 카테고리
  const popularCategories = [
    { name: '홈클리닝', image: '/api/placeholder/200/120', requests: '124건' },
    { name: '인테리어', image: '/api/placeholder/200/120', requests: '89건' },
    { name: '과외/레슨', image: '/api/placeholder/200/120', requests: '156건' },
    { name: '수리/설치', image: '/api/placeholder/200/120', requests: '78건' }
  ]

  // 전문가 성공사례
  const expertStories = [
    {
      name: '김청소',
      service: '홈클리닝',
      rating: 4.9,
      reviews: 245,
      monthlyIncome: '월 180만원',
      image: '/api/placeholder/100/100'
    },
    {
      name: '박인테리어',
      service: '인테리어',
      rating: 4.8,
      reviews: 167,
      monthlyIncome: '월 320만원',
      image: '/api/placeholder/100/100'
    },
    {
      name: '이과외',
      service: '과외',
      rating: 4.9,
      reviews: 198,
      monthlyIncome: '월 250만원',
      image: '/api/placeholder/100/100'
    },
    {
      name: '최수리',
      service: '설치/수리',
      rating: 4.7,
      reviews: 134,
      monthlyIncome: '월 220만원',
      image: '/api/placeholder/100/100'
    }
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // TODO: 검색 페이지로 이동
      console.log('Searching for:', searchQuery)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            어떤 서비스가 필요하세요?
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            3분만에 AI가 맞춤 전문가를 추천해드립니다
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-xl p-2 shadow-lg flex max-w-2xl mx-auto">
            <div className="flex-1 flex items-center">
              <Search className="w-5 h-5 text-gray-400 ml-4 mr-3" />
              <Input
                type="text"
                placeholder="필요한 서비스를 검색해보세요 (예: 홈클리닝, 인테리어, 과외)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus:ring-0 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
            >
              검색
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">15만+</div>
              <div className="text-blue-200 text-sm">활동 전문가</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">87%</div>
              <div className="text-blue-200 text-sm">매칭 성공률</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">4.8★</div>
              <div className="text-blue-200 text-sm">평균 만족도</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            어떤 서비스를 찾고 계신가요?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {mainCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Live Requests */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">실시간 요청</h2>
              <p className="text-gray-600">지금 이 순간에도 새로운 요청이 올라오고 있어요</p>
            </div>
            <Badge className="bg-red-100 text-red-700 animate-pulse">
              LIVE
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {liveRequests.map((request, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{request.service}</h3>
                  <Badge variant="outline" className="text-xs">
                    NEW
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {request.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {request.time}
                  </div>
                  <div className="font-medium text-blue-600">
                    {request.budget}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            인기 카테고리
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCategories.map((category, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm opacity-90">이번 주 {category.requests}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              진짜 전문가들이 이야기하는 Provee
            </h2>
            <p className="text-gray-600">
              실제 활동 중인 전문가들의 생생한 후기와 수익을 확인해보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertStories.map((expert, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{expert.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{expert.service}</p>

                <div className="flex items-center justify-center mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="ml-1 font-medium">{expert.rating}</span>
                  <span className="ml-1 text-gray-500 text-sm">({expert.reviews})</span>
                </div>

                <div className="text-lg font-bold text-blue-600">
                  {expert.monthlyIncome}
                </div>
                <div className="text-sm text-gray-500">평균 수익</div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/expert/join">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                나도 전문가로 시작하기
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              이용 방법
            </h2>
            <p className="text-gray-600">
              간단한 3단계로 최적의 전문가를 만나보세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. 서비스 검색</h3>
              <p className="text-gray-600">
                필요한 서비스를 검색하고 요청서를 작성하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI 매칭</h3>
              <p className="text-gray-600">
                AI가 분석하여 최적의 전문가 5명을 추천해드립니다
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. 안전한 거래</h3>
              <p className="text-gray-600">
                검증된 전문가와 안전하게 프로젝트를 진행하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            3분만에 맞춤 전문가를 찾아보세요
          </p>

          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
              서비스 찾기
            </Button>
            <Link href="/expert/join">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8">
                전문가 등록
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏠</span>
                <span className="font-bold text-xl">Provee</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI 기반 전문가 매칭 플랫폼
              </p>
              <div className="space-y-2 text-gray-400">
                <div>대표: Provee Inc.</div>
                <div>사업자등록번호: 123-45-67890</div>
                <div>통신판매신고: 제2024-서울강남-1234호</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">전문가찾기</Link></li>
                <li><Link href="#" className="hover:text-white">고수찾기</Link></li>
                <li><Link href="#" className="hover:text-white">마켓</Link></li>
                <li><Link href="#" className="hover:text-white">커뮤니티</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">회사소개</Link></li>
                <li><Link href="#" className="hover:text-white">채용정보</Link></li>
                <li><Link href="#" className="hover:text-white">제휴문의</Link></li>
                <li><Link href="#" className="hover:text-white">광고문의</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">고객센터</h4>
              <div className="space-y-2 text-gray-400">
                <div>1599-5319</div>
                <div>평일 09:00 - 18:00</div>
                <div>토요일 09:00 - 15:00 (일요일, 공휴일 휴무)</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">
                &copy; 2024 Provee Inc. All Rights Reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="#" className="text-gray-400 hover:text-white">이용약관</Link>
                <Link href="#" className="text-gray-400 hover:text-white">개인정보처리방침</Link>
                <Link href="#" className="text-gray-400 hover:text-white">위치기반서비스 이용약관</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}