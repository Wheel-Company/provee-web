'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProveeAPI from '@/lib/api'
import { EnhancedProveeAPI } from '@/lib/api-enhanced'
import { Database } from '@/types/supabase'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Shield,
  ChevronDown,
  LayoutGrid,
  Map,
  Heart,
  MessageSquare,
  Phone,
  Award,
  Users
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface Expert {
  id: string
  name?: string
  category?: Database['public']['Enums']['service_category'][]
  services: string[]
  rating: number | null
  review_count: number | null
  completed_projects: number | null
  location: string
  description: string | null
  response_time_hours: number | null
  verified: boolean | null
  is_available: boolean | null
  price_min: number
  price_max: number
  experience_years: number | null
  hourly_rate: number | null
  portfolio_images: string[] | null
}

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedLocation, setSelectedLocation] = useState('전국')
  const [sortBy, setSortBy] = useState('추천순')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  // URL 파라미터에서 초기 검색어 및 카테고리 설정
  useEffect(() => {
    const query = searchParams.get('q')
    const category = searchParams.get('category')

    if (query) {
      setSearchQuery(query)
    }
    if (category) {
      // 유효한 카테고리인지 확인
      const validCategories = [
        '전체', '이사/청소', '인테리어', '설치/수리', '외주', '이벤트/파티',
        '취업/직무', '과외', '취미/자기계발', '자동차', '법률/금융'
      ]
      if (validCategories.includes(category)) {
        setSelectedCategory(category)
      }
    }
  }, [searchParams])

  // 실제 전문가 데이터
  const [experts, setExperts] = useState<Expert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load experts data from API
  const loadExperts = async (filters = {}) => {
    try {
      setLoading(true)
      const response = await EnhancedProveeAPI.searchExperts(filters)
      if (response.success && response.data) {
        setExperts(response.data)
      } else {
        // Fallback to mock data if API fails
        console.log('API failed, using mock data:', response.error)
        setExperts(mockExperts)
      }
    } catch (err) {
      console.log('API error, using mock data:', err)
      setExperts(mockExperts)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadExperts()
  }, [])

  // Mock experts data - fallback if API is not working
  const mockExperts: Expert[] = [
    {
      id: '1',
      services: ['홈클리닝', '사무실청소', '입주청소'],
      rating: 4.9,
      review_count: 245,
      completed_projects: 324,
      location: '서울 강남구',
      description: '10년 경력의 전문 청소사입니다. 꼼꼼하고 정성스러운 청소로 고객 만족도 99%를 자랑합니다.',
      response_time_hours: 1,
      verified: true,
      is_available: true,
      price_min: 15000,
      price_max: 25000,
      experience_years: 10,
      hourly_rate: 20000,
      portfolio_images: [],
      category: ['청소']
    }
  ]

  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([])

  const categories = [
    '전체', '청소', '수리', '과외', '디자인'
  ]

  const locations = [
    '전국', '서울', '부산', '대구', '인천', '광주', '대전', '울산',
    '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
  ]

  const sortOptions = [
    '추천순',
    'Provee 이용순',
    '리뷰 많은 순',
    '최근활동순',
    '평점 높은 순',
    '고용순',
    '응답빠른순'
  ]

  // 필터링 및 정렬 로직
  useEffect(() => {
    let filtered = experts

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(expert =>
        expert.category?.includes(selectedCategory as Database['public']['Enums']['service_category'])
      )
    }

    // 지역 필터
    if (selectedLocation !== '전국') {
      filtered = filtered.filter(expert => expert.location.includes(selectedLocation))
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      filtered = filtered.filter(expert =>
        expert.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase())) ||
        expert.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case '추천순':
          const scoreA = (a.rating || 0) * (a.review_count || 0) + (a.completed_projects || 0) * 0.1
          const scoreB = (b.rating || 0) * (b.review_count || 0) + (b.completed_projects || 0) * 0.1
          return scoreB - scoreA
        case 'Provee 이용순':
          return (b.completed_projects || 0) - (a.completed_projects || 0)
        case '리뷰 많은 순':
          return (b.review_count || 0) - (a.review_count || 0)
        case '평점 높은 순':
          return (b.rating || 0) - (a.rating || 0)
        case '고용순':
          return (b.completed_projects || 0) - (a.completed_projects || 0)
        case '응답빠른순':
          return (a.response_time_hours || 999) - (b.response_time_hours || 999)
        case '최근활동순':
          // Mock: 랜덤 정렬 (실제로는 최근 활동 시간으로 정렬)
          return Math.random() - 0.5
        default:
          return 0
      }
    })

    setFilteredExperts(filtered)
  }, [experts, selectedCategory, selectedLocation, searchQuery, sortBy])

  const handleSearch = async () => {
    // API 호출로 검색 실행
    const filters = {
      category: selectedCategory !== '전체' ? selectedCategory as Database['public']['Enums']['service_category'] : undefined,
      location: selectedLocation !== '전국' ? { city: selectedLocation } : undefined,
      query: searchQuery.trim() || undefined
    }

    await loadExperts(filters)
  }

  const getAvailabilityColor = (isAvailable?: boolean | null) => {
    if (isAvailable) {
      return 'bg-green-100 text-green-800'
    } else {
      return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityText = (isAvailable?: boolean | null) => {
    if (isAvailable) {
      return '즉시 연락 가능'
    } else {
      return '상담 불가'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">서비스 찾기</h1>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="어떤 서비스를 찾으시나요? (예: 홈클리닝, 인테리어, 과외)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 whitespace-nowrap"
            >
              검색
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>서비스</span>
                  <span className="text-blue-600 font-medium">{selectedCategory}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? 'bg-blue-50 text-blue-600' : ''}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>지역</span>
                  <span className="text-blue-600 font-medium">{selectedLocation}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {locations.map((location) => (
                  <DropdownMenuItem
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={selectedLocation === location ? 'bg-blue-50 text-blue-600' : ''}
                  >
                    {location}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              총 <span className="font-semibold text-gray-900">{filteredExperts.length}</span>명의 전문가
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>{sortBy}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={sortBy === option ? 'bg-blue-50 text-blue-600' : ''}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="rounded-none"
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">전문가 정보를 불러오고 있습니다...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => loadExperts()} variant="outline">
              다시 시도
            </Button>
          </div>
        )}

        {/* Expert Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredExperts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 mb-4">검색 조건에 맞는 전문가를 찾을 수 없습니다.</p>
                <Button onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('전체')
                  setSelectedLocation('전국')
                  loadExperts()
                }} variant="outline">
                  검색 조건 초기화
                </Button>
              </div>
            ) : (
              filteredExperts.map((expert) => (
                <Card
                  key={expert.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/expert/${expert.id}`)}
                >
                  <div className="flex space-x-4">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Expert Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            전문가 #{expert.id}
                            {expert.verified && (
                              <Shield className="inline w-4 h-4 text-blue-500 ml-1" />
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">{expert.category?.join(', ')}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Heart className="w-5 h-5 text-gray-400" />
                        </Button>
                      </div>

                      {/* Rating and Reviews */}
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{expert.rating || 0}</span>
                          <span className="text-gray-500 text-sm">({expert.review_count || 0})</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          완료 {expert.completed_projects || 0}건
                        </div>
                      </div>

                      {/* Location and Response Time */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {expert.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {expert.response_time_hours ? `${expert.response_time_hours}시간 내` : '응답시간 미상'}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {expert.description || '소개글이 없습니다.'}
                      </p>

                      {/* Services */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {expert.services.slice(0, 3).map((service, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-blue-100 text-blue-800"
                          >
                            {service}
                          </Badge>
                        ))}
                        <Badge className={getAvailabilityColor(expert.is_available)}>
                          {getAvailabilityText(expert.is_available)}
                        </Badge>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-600">예상 비용: </span>
                          <span className="font-medium text-gray-900">
                            {expert.price_min.toLocaleString()}원 - {expert.price_max.toLocaleString()}원
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="text-sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            채팅
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-sm">
                            <Phone className="w-4 h-4 mr-1" />
                            연락하기
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Load More */}
        {!loading && !error && filteredExperts.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="px-8" onClick={() => loadExperts()}>
              더 많은 전문가 보기
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>검색 페이지 로딩 중...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}