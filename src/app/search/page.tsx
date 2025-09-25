'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  name: string
  category: string
  subcategory: string[]
  rating: number
  reviewCount: number
  completedProjects: number
  location: string
  profileImage?: string
  description: string
  responseTime: string
  isVerified: boolean
  isPremium: boolean
  badges: string[]
  priceRange: string
  availability: 'available' | 'busy' | 'unavailable'
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedLocation, setSelectedLocation] = useState('전국')
  const [sortBy, setSortBy] = useState('추천순')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  // URL 파라미터에서 초기 검색어 설정
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  // Mock experts data - 실제로는 API에서 가져와야 함
  const [experts] = useState<Expert[]>([
    {
      id: '1',
      name: '김청소',
      category: '이사/청소',
      subcategory: ['홈클리닝', '사무실청소', '입주청소'],
      rating: 4.9,
      reviewCount: 245,
      completedProjects: 324,
      location: '서울 강남구',
      description: '10년 경력의 전문 청소사입니다. 꼼꼼하고 정성스러운 청소로 고객 만족도 99%를 자랑합니다.',
      responseTime: '1시간 내',
      isVerified: true,
      isPremium: true,
      badges: ['신원인증', '경력인증', '우수고수'],
      priceRange: '시간당 15,000-25,000원',
      availability: 'available'
    },
    {
      id: '2',
      name: '박인테리어',
      category: '인테리어',
      subcategory: ['홈스타일링', '공간설계', '가구배치'],
      rating: 4.8,
      reviewCount: 167,
      completedProjects: 89,
      location: '서울 서초구',
      description: '감각적이고 실용적인 인테리어 디자인을 제공합니다. 고객의 라이프스타일에 맞는 공간을 만들어드려요.',
      responseTime: '30분 내',
      isVerified: true,
      isPremium: false,
      badges: ['신원인증', '포트폴리오인증'],
      priceRange: '평당 50,000-100,000원',
      availability: 'available'
    },
    {
      id: '3',
      name: '이과외',
      category: '과외',
      subcategory: ['영어회화', '토익', '토플'],
      rating: 4.9,
      reviewCount: 198,
      completedProjects: 156,
      location: '서울 송파구',
      description: '원어민급 영어실력으로 체계적인 영어교육을 제공합니다. 목표 달성률 95% 이상!',
      responseTime: '2시간 내',
      isVerified: true,
      isPremium: false,
      badges: ['학력인증', '자격증인증'],
      priceRange: '시간당 35,000-50,000원',
      availability: 'busy'
    },
    {
      id: '4',
      name: '최수리',
      category: '설치/수리',
      subcategory: ['가전수리', '가구수리', '도배/페인팅'],
      rating: 4.7,
      reviewCount: 134,
      completedProjects: 278,
      location: '서울 마포구',
      description: '20년 경력의 수리 전문가입니다. 정확한 진단과 합리적인 가격으로 서비스를 제공합니다.',
      responseTime: '1시간 내',
      isVerified: true,
      isPremium: true,
      badges: ['신원인증', '기술인증', '우수고수'],
      priceRange: '건당 20,000-80,000원',
      availability: 'available'
    }
  ])

  const [filteredExperts, setFilteredExperts] = useState<Expert[]>(experts)

  const categories = [
    '전체', '이사/청소', '인테리어', '설치/수리', '외주', '이벤트/파티',
    '취업/직무', '과외', '취미/자기계발', '자동차', '법률/금융'
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
      filtered = filtered.filter(expert => expert.category === selectedCategory)
    }

    // 지역 필터
    if (selectedLocation !== '전국') {
      filtered = filtered.filter(expert => expert.location.includes(selectedLocation))
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      filtered = filtered.filter(expert =>
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.subcategory.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase())) ||
        expert.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case '추천순':
          return (b.rating * b.reviewCount + b.completedProjects * 0.1) -
                 (a.rating * a.reviewCount + a.completedProjects * 0.1)
        case 'Provee 이용순':
          return b.completedProjects - a.completedProjects
        case '리뷰 많은 순':
          return b.reviewCount - a.reviewCount
        case '평점 높은 순':
          return b.rating - a.rating
        case '고용순':
          return b.completedProjects - a.completedProjects
        case '응답빠른순':
          const responseTimeA = parseInt(a.responseTime.match(/\d+/)?.[0] || '999')
          const responseTimeB = parseInt(b.responseTime.match(/\d+/)?.[0] || '999')
          return responseTimeA - responseTimeB
        case '최근활동순':
          // Mock: 랜덤 정렬 (실제로는 최근 활동 시간으로 정렬)
          return Math.random() - 0.5
        default:
          return 0
      }
    })

    setFilteredExperts(filtered)
  }, [experts, selectedCategory, selectedLocation, searchQuery, sortBy])

  const handleSearch = () => {
    // 검색 실행 - useEffect에서 자동으로 처리됨
    console.log('Search executed:', { searchQuery, selectedCategory, selectedLocation, sortBy })
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'busy':
        return 'bg-yellow-100 text-yellow-800'
      case 'unavailable':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return '즉시 연락 가능'
      case 'busy':
        return '상담 중'
      case 'unavailable':
        return '일시 중단'
      default:
        return '상태 확인 중'
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

        {/* Expert Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExperts.map((expert) => (
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
                        {expert.name}
                        {expert.isVerified && (
                          <Shield className="inline w-4 h-4 text-blue-500 ml-1" />
                        )}
                        {expert.isPremium && (
                          <Award className="inline w-4 h-4 text-yellow-500 ml-1" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{expert.category}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="p-1">
                      <Heart className="w-5 h-5 text-gray-400" />
                    </Button>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{expert.rating}</span>
                      <span className="text-gray-500 text-sm">({expert.reviewCount})</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      완료 {expert.completedProjects}건
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
                      {expert.responseTime}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                    {expert.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {expert.badges.map((badge, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-800"
                      >
                        {badge}
                      </Badge>
                    ))}
                    <Badge className={getAvailabilityColor(expert.availability)}>
                      {getAvailabilityText(expert.availability)}
                    </Badge>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-600">예상 비용: </span>
                      <span className="font-medium text-gray-900">{expert.priceRange}</span>
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
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="px-8">
            더 많은 전문가 보기
          </Button>
        </div>
      </div>
    </div>
  )
}