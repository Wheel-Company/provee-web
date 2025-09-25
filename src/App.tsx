import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function App() {
  return (
    <div className="min-h-screen bg-background font-sans korean-text">
      <div className="container mx-auto p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="provee-gradient w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Provee</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            전문가와 고객 모두가 신뢰할 수 있는 AI 기반 서비스 매칭 플랫폼
          </p>
          <Badge variant="success" className="text-sm">
            React 웹 애플리케이션 개발 중
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🎯 AI 매칭 시스템</CardTitle>
              <CardDescription>
                헤드헌터 모델 기반 정확한 매칭
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                70% 이상 호환성을 가진 전문가만 추천합니다
              </p>
              <Badge variant="matching">매칭 성공률 80%+</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💰 보증금 시스템</CardTitle>
              <CardDescription>
                양방향 신뢰성 확보
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                전문가 5-10만원, 고객 1만원 보증금으로 진정성 확보
              </p>
              <Badge variant="deposit">안전한 거래</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📱 구독 모델</CardTitle>
              <CardDescription>
                투명한 월정액 시스템
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                고객 9,900원, 전문가 19,900원의 투명한 요금제
              </p>
              <Badge variant="success">100% 환불 보장</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button size="lg" className="mr-4">
            서비스 찾기
          </Button>
          <Button variant="outline" size="lg">
            전문가 등록
          </Button>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>🚀 개발 중인 기능들</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Badge variant="outline">서비스 매칭 카드</Badge>
            <Badge variant="outline">신뢰도 표시기</Badge>
            <Badge variant="outline">매칭 진행 단계</Badge>
            <Badge variant="outline">레이아웃 컴포넌트</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App