'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
// import { Progress } from '@/components/ui/progress'
import {
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
  ArrowLeft
} from 'lucide-react'

const categories = [
  { id: 'cleaning', name: '이사/청소', icon: Home, description: '홈클리닝, 이사청소, 사무실청소' },
  { id: 'interior', name: '인테리어', icon: Brush, description: '리모델링, 도배, 타일시공' },
  { id: 'event', name: '이벤트/파티', icon: Calendar, description: '웨딩, 생일파티, 기업행사' },
  { id: 'tutoring', name: '과외', icon: GraduationCap, description: '학습지도, 음악레슨, 어학' },
  { id: 'automotive', name: '자동차', icon: Car, description: '정비, 세차, 중고차매매' },
  { id: 'repair', name: '설치/수리', icon: Settings, description: '가전수리, 배관, 전기공사' },
  { id: 'outsourcing', name: '외주', icon: Zap, description: '디자인, 개발, 마케팅' },
  { id: 'career', name: '취업/직무', icon: Briefcase, description: '컨설팅, 이력서작성, 면접코칭' },
  { id: 'legal', name: '법률/금융', icon: Scale, description: '법무상담, 세무, 보험' },
  { id: 'hobby', name: '취미/자기계발', icon: Heart, description: '운동, 요리, 예술활동' },
]

export default function ExpertOnboardingPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const router = useRouter()

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleNext = () => {
    if (selectedCategories.length === 0) {
      alert('최소 1개 이상의 서비스 카테고리를 선택해주세요.')
      return
    }
    // TODO: 선택된 카테고리 저장하고 다음 단계로 이동
    console.log('Selected categories:', selectedCategories)
    router.push('/expert/join/onboarding/services')
  }

  const handleBack = () => {
    router.push('/expert/join')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={handleBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-sm text-gray-500">1/5</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: '20%'}}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            어떤 전문가로 활동하실건가요?
          </h1>
          <p className="text-gray-600">
            제공하실 수 있는 서비스 분야를 선택해주세요. (복수 선택 가능)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategories.includes(category.id)

            return (
              <Card
                key={category.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    isSelected ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {category.name}
                  </h3>
                  <p className={`text-sm ${
                    isSelected ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {category.description}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Selected Categories Summary */}
        {selectedCategories.length > 0 && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">선택된 서비스 ({selectedCategories.length}개)</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(categoryId => {
                const category = categories.find(c => c.id === categoryId)
                return (
                  <span
                    key={categoryId}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {category?.name}
                  </span>
                )
              })}
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="ghost" onClick={handleBack}>
            이전
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedCategories.length === 0}
            className="px-8"
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}