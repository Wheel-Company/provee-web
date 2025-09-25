import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ServiceMatchCard } from '@/components/provee/service-match-card'
import { TrustIndicator } from '@/components/provee/trust-indicator'
import { Search, UserCheck, Shield, Zap, Star, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI 기반 서비스 매칭 플랫폼
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 mt-2">
              Provee
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto korean-text">
            전문가와 고객 모두가 신뢰할 수 있는 AI 매칭 시스템으로
            완벽한 서비스 파트너를 찾아보세요
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600">
              서비스 찾기 <Search className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              전문가 등록하기 <UserCheck className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            왜 Provee를 선택해야 할까요?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>신뢰할 수 있는 매칭</CardTitle>
                <CardDescription className="korean-text">
                  AI가 70% 이상 호환성을 보장하는 전문가만 추천
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <CardTitle>빠른 매칭</CardTitle>
                <CardDescription className="korean-text">
                  평균 24시간 내 최적의 전문가 매칭
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <CardTitle>결과 보장</CardTitle>
                <CardDescription className="korean-text">
                  만족하지 못하면 100% 환불 보장
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Matches Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            최근 성공적인 매칭 사례
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceMatchCard
              title="웹사이트 개발"
              category="개발"
              price="500,000원"
              duration="2주"
              matchScore={92}
              providerName="김개발"
              providerRating={4.9}
              skills={["React", "Node.js", "AWS"]}
              description="반응형 웹사이트 개발 및 배포"
            />
            <ServiceMatchCard
              title="브랜드 로고 디자인"
              category="디자인"
              price="200,000원"
              duration="1주"
              matchScore={88}
              providerName="이디자이너"
              providerRating={4.8}
              skills={["Illustrator", "브랜딩", "UI/UX"]}
              description="기업 로고 및 브랜드 아이덴티티 디자인"
            />
            <ServiceMatchCard
              title="마케팅 컨설팅"
              category="마케팅"
              price="1,000,000원"
              duration="1개월"
              matchScore={85}
              providerName="박마케터"
              providerRating={4.7}
              skills={["SEO", "광고", "분석"]}
              description="디지털 마케팅 전략 수립 및 실행"
            />
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            검증된 전문가들
          </h2>
          <div className="flex justify-center gap-8 flex-wrap">
            <TrustIndicator
              type="verified"
              score={95}
              label="신원 인증"
            />
            <TrustIndicator
              type="portfolio"
              score={88}
              label="포트폴리오 검증"
            />
            <TrustIndicator
              type="review"
              score={4.8}
              label="평균 평점"
            />
            <TrustIndicator
              type="response"
              score={2.3}
              label="평균 응답시간 (시간)"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">등록된 전문가</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">완료된 프로젝트</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-100">평균 만족도</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">92%</div>
              <div className="text-blue-100">매칭 성공률</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}