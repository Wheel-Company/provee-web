import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ServiceMatchCard } from '@/components/provee/service-match-card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Search,
  Filter,
  Code,
  Palette,
  Megaphone,
  Camera,
  FileText,
  Zap,
  Star,
  Clock,
  MapPin
} from 'lucide-react'

const categories = [
  { icon: Code, name: '개발', count: '1,234' },
  { icon: Palette, name: '디자인', count: '987' },
  { icon: Megaphone, name: '마케팅', count: '756' },
  { icon: Camera, name: '영상/사진', count: '543' },
  { icon: FileText, name: '문서작성', count: '432' },
  { icon: Zap, name: '기타', count: '321' },
]

const featuredServices = [
  {
    title: "E-커머스 웹사이트 개발",
    category: "개발",
    price: "2,500,000원",
    duration: "6주",
    matchScore: 96,
    providerName: "김웹개발",
    providerRating: 4.9,
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    description: "완전한 온라인 쇼핑몰 구축 (결제 시스템 포함)",
    location: "서울 강남구",
    responseTime: "1시간 내"
  },
  {
    title: "브랜드 아이덴티티 디자인",
    category: "디자인",
    price: "800,000원",
    duration: "3주",
    matchScore: 93,
    providerName: "박브랜딩",
    providerRating: 4.8,
    skills: ["Illustrator", "Photoshop", "브랜딩", "로고"],
    description: "로고부터 브랜드 가이드라인까지 완성",
    location: "서울 홍대",
    responseTime: "30분 내"
  },
  {
    title: "유튜브 채널 성장 마케팅",
    category: "마케팅",
    price: "1,200,000원",
    duration: "2개월",
    matchScore: 91,
    providerName: "이유튜버",
    providerRating: 4.7,
    skills: ["YouTube", "SEO", "콘텐츠기획", "분석"],
    description: "구독자 10만 달성을 위한 체계적 마케팅",
    location: "온라인",
    responseTime: "2시간 내"
  },
  {
    title: "제품 사진 촬영",
    category: "영상/사진",
    price: "300,000원",
    duration: "1주",
    matchScore: 89,
    providerName: "최포토",
    providerRating: 4.9,
    skills: ["제품촬영", "보정", "스튜디오", "라이팅"],
    description: "전문 스튜디오에서의 고품질 제품 사진",
    location: "서울 성수동",
    responseTime: "4시간 내"
  },
  {
    title: "사업계획서 작성",
    category: "문서작성",
    price: "600,000원",
    duration: "2주",
    matchScore: 87,
    providerName: "정컨설턴트",
    providerRating: 4.6,
    skills: ["사업기획", "재무분석", "시장조사", "PPT"],
    description: "투자유치용 전문 사업계획서 작성",
    location: "서울 여의도",
    responseTime: "6시간 내"
  },
  {
    title: "모바일 앱 기획 컨설팅",
    category: "기타",
    price: "900,000원",
    duration: "3주",
    matchScore: 84,
    providerName: "한기획자",
    providerRating: 4.8,
    skills: ["앱기획", "UX설계", "프로토타이핑", "시장분석"],
    description: "성공적인 앱 런칭을 위한 전략 컨설팅",
    location: "서울 판교",
    responseTime: "1시간 내"
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            완벽한 서비스를 찾아보세요
          </h1>
          <p className="text-xl text-gray-600 korean-text max-w-2xl mx-auto">
            AI가 추천하는 최고의 전문가들과 함께
            당신의 프로젝트를 성공시키세요
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="어떤 서비스가 필요하신가요? (예: 웹사이트 개발, 로고 디자인)"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="dev">개발</SelectItem>
                  <SelectItem value="design">디자인</SelectItem>
                  <SelectItem value="marketing">마케팅</SelectItem>
                  <SelectItem value="photo">영상/사진</SelectItem>
                  <SelectItem value="writing">문서작성</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="예산" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="under-500k">50만원 이하</SelectItem>
                  <SelectItem value="500k-1m">50만원~100만원</SelectItem>
                  <SelectItem value="1m-3m">100만원~300만원</SelectItem>
                  <SelectItem value="over-3m">300만원 이상</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600">
                검색
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">인기 카테고리</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ icon: Icon, name, count }, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-600">{count}개 서비스</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Services */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">추천 서비스</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1" />
                AI 추천
              </Badge>
              <span className="text-sm text-gray-600 korean-text">
                당신에게 최적화된 서비스들
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service, index) => (
              <div key={index} className="relative">
                <ServiceMatchCard
                  title={service.title}
                  category={service.category}
                  price={service.price}
                  duration={service.duration}
                  matchScore={service.matchScore}
                  providerName={service.providerName}
                  providerRating={service.providerRating}
                  skills={service.skills}
                  description={service.description}
                />
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {service.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {service.responseTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            원하는 서비스를 찾지 못하셨나요?
          </h2>
          <p className="text-blue-100 mb-6 korean-text max-w-2xl mx-auto">
            AI 매칭 시스템이 당신의 요구사항에 맞는
            전문가를 직접 찾아드립니다
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            맞춤 매칭 요청하기
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}