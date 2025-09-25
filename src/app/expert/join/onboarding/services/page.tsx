'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'

// 서비스별 세부 카테고리 (예시: 청소 관련)
const services = [
  { id: 'home-cleaning', name: '홈클리닝', description: '일반 가정집 청소 서비스' },
  { id: 'move-cleaning', name: '입주/잔 청소', description: '이사 후 입주 전 청소' },
  { id: 'house-cleaning', name: '가정/가구 청소', description: '가구, 가전제품 청소' },
  { id: 'office-cleaning', name: '사무실 청소', description: '사무실, 상가 청소 서비스' },
  { id: 'special-cleaning', name: '특수 청소', description: '에어컨, 환풍기 등 특수 청소' },
  { id: 'demolition', name: '철거/폐기', description: '가구 철거 및 폐기물 처리' }
]

export default function ServicesPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const router = useRouter()

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId)
      } else {
        return [...prev, serviceId]
      }
    })
  }

  const handleNext = () => {
    if (selectedServices.length === 0) {
      alert('최소 1개 이상의 서비스를 선택해주세요.')
      return
    }
    // TODO: 선택된 서비스 저장하고 다음 단계로 이동
    console.log('Selected services:', selectedServices)
    router.push('/expert/join/onboarding/auth')
  }

  const handleBack = () => {
    router.push('/expert/join/onboarding')
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
            <div className="text-sm text-gray-500">2/5</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: '40%'}}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            어떤 서비스를 제공할 수 있나요?
          </h1>
          <p className="text-gray-600">
            선택하신 카테고리에서 제공 가능한 세부 서비스를 선택해주세요.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {services.map((service) => {
            const isSelected = selectedServices.includes(service.id)

            return (
              <Card
                key={service.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => handleServiceToggle(service.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {service.name}
                    </h3>
                    <p className={`text-sm ${
                      isSelected ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {service.description}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Selected Services Summary */}
        {selectedServices.length > 0 && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">선택된 서비스 ({selectedServices.length}개)</h3>
            <div className="flex flex-wrap gap-2">
              {selectedServices.map(serviceId => {
                const service = services.find(s => s.id === serviceId)
                return (
                  <span
                    key={serviceId}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {service?.name}
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
            disabled={selectedServices.length === 0}
            className="px-8"
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}