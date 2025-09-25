import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ServiceMatchCard } from '@/components/provee/service-match-card'
import { TrustIndicator } from '@/components/provee/trust-indicator'
import { MatchingProgress } from '@/components/provee/matching-progress'
import { Header } from '@/components/layout/header'
import {
  Calendar,
  Clock,
  Users,
  Star,
  TrendingUp,
  MessageCircle,
  Bell,
  Settings
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
          <p className="text-gray-600 korean-text">안녕하세요! 오늘도 최고의 매칭을 경험해보세요.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">진행중인 프로젝트</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground korean-text">
                지난 달 대비 +2
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">완료된 프로젝트</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground korean-text">
                평균 만족도 4.8/5
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">매칭 성공률</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground korean-text">
                업계 평균 대비 +15%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">미읽은 메시지</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground korean-text">
                새로운 매칭 알림 포함
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Matching Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  진행중인 매칭
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MatchingProgress
                  step={2}
                  totalSteps={4}
                  title="웹사이트 개발 전문가 매칭"
                  description="AI가 최적의 전문가를 찾고 있습니다"
                  estimatedTime="약 6시간 소요 예정"
                />
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    매칭 상세보기
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Matches */}
            <Card>
              <CardHeader>
                <CardTitle>최근 매칭 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ServiceMatchCard
                    title="모바일 앱 UI/UX 디자인"
                    category="디자인"
                    price="800,000원"
                    duration="3주"
                    matchScore={89}
                    providerName="김디자이너"
                    providerRating={4.9}
                    skills={["Figma", "Sketch", "프로토타이핑"]}
                    description="사용자 친화적인 모바일 앱 디자인"
                  />
                  <ServiceMatchCard
                    title="마케팅 자동화 시스템 구축"
                    category="개발"
                    price="1,200,000원"
                    duration="1개월"
                    matchScore={94}
                    providerName="이개발자"
                    providerRating={4.8}
                    skills={["Python", "Django", "API"]}
                    description="효율적인 마케팅 워크플로우 구축"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  새로운 서비스 요청
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="mr-2 h-4 w-4" />
                  알림 설정
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  프로필 관리
                </Button>
              </CardContent>
            </Card>

            {/* Trust Score */}
            <Card>
              <CardHeader>
                <CardTitle>신뢰도 점수</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TrustIndicator
                  type="verified"
                  score={98}
                  label="프로필 인증"
                />
                <TrustIndicator
                  type="review"
                  score={4.7}
                  label="평균 평점"
                />
                <TrustIndicator
                  type="response"
                  score={1.2}
                  label="평균 응답시간"
                />
                <div className="pt-2">
                  <Button variant="provee-outline" size="sm" className="w-full">
                    신뢰도 향상하기
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm korean-text">웹 개발 프로젝트 완료</span>
                    <Badge variant="secondary" className="text-xs">2일 전</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm korean-text">새로운 매칭 요청</span>
                    <Badge variant="secondary" className="text-xs">5일 전</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm korean-text">프로필 업데이트</span>
                    <Badge variant="secondary" className="text-xs">1주 전</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}