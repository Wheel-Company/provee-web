'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Star, TrendingUp, Users, Gift } from 'lucide-react'

export default function CompletePage() {
  const router = useRouter()

  const handleStartDashboard = () => {
    router.push('/expert')
  }

  const handleViewProfile = () => {
    router.push('/expert/profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">5/5</div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 전문가 등록 완료!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Provee 전문가 커뮤니티에 오신 것을 환영합니다!
          </p>
          <p className="text-gray-500">
            이제 AI 매칭을 통해 고객들과 만나보세요.
          </p>
        </div>

        {/* Welcome Benefits */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="text-center">
            <Gift className="w-8 h-8 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">신규 전문가 혜택</h2>
            <p className="text-blue-100 mb-4">첫 달 수수료 50% 할인 + 프리미엄 기능 무료</p>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-2xl font-bold">최대 75만원</div>
              <div className="text-sm text-blue-100">추가 수익 기회</div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <div className="space-y-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">프로필 완성하기</h3>
                <p className="text-sm text-gray-600">상세 경력과 포트폴리오를 추가하여 매칭률을 높이세요</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleViewProfile}>
                설정하기
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">첫 번째 프로젝트 받기</h3>
                <p className="text-sm text-gray-600">AI가 분석한 맞춤 프로젝트를 확인해보세요</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleStartDashboard}>
                시작하기
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">전문가 가이드 읽기</h3>
                <p className="text-sm text-gray-600">성공하는 전문가들의 노하우와 팁을 확인하세요</p>
              </div>
              <Button variant="outline" size="sm">
                읽어보기
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Stats Preview */}
        <Card className="p-6 mb-8 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            Provee 전문가들의 평균 성과
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">150만원</div>
              <div className="text-sm text-gray-600">월 평균 수익</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">4.8</div>
              <div className="text-sm text-gray-600">평균 평점</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">92%</div>
              <div className="text-sm text-gray-600">고객 만족도</div>
            </div>
          </div>
        </Card>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleStartDashboard}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            전문가 대시보드 시작하기
          </Button>

          <Button
            onClick={handleViewProfile}
            variant="outline"
            className="w-full h-12 font-medium"
          >
            프로필 설정하기
          </Button>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            궁금한 점이 있으시나요?
          </p>
          <div className="space-x-4">
            <Button variant="link" className="text-blue-600 text-sm p-0">
              전문가 가이드
            </Button>
            <Button variant="link" className="text-blue-600 text-sm p-0">
              고객센터
            </Button>
            <Button variant="link" className="text-blue-600 text-sm p-0">
              커뮤니티
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}