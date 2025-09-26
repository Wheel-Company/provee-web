'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  DollarSign,
  Phone,
  Send
} from 'lucide-react'

// 견적 요청 데이터 타입
interface QuoteRequest {
  category: string
  subcategory: string
  date: string
  location: string
  details: any
  budget: string
  contactPreference: string
}

function RequestQuotePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(12)

  const [requestData, setRequestData] = useState<QuoteRequest>({
    category: '',
    subcategory: '',
    date: '',
    location: '',
    details: {},
    budget: '',
    contactPreference: ''
  })

  // URL 파라미터에서 카테고리 설정
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setRequestData(prev => ({
        ...prev,
        category: category
      }))
      // 카테고리가 선택된 경우 다음 단계로 진행하거나 적절한 단계로 이동
      if (currentStep === 1) {
        setCurrentStep(2)
        setProgress(25)
      }
    }
  }, [searchParams, currentStep])

  // 메인 카테고리 (숨고와 동일한 10개)
  const mainCategories = [
    { id: 'moving', name: '이사/청소', icon: Home, color: 'bg-blue-100 text-blue-600' },
    { id: 'interior', name: '인테리어', icon: Brush, color: 'bg-green-100 text-green-600' },
    { id: 'repair', name: '설치/수리', icon: Settings, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'outsourcing', name: '외주', icon: Zap, color: 'bg-orange-100 text-orange-600' },
    { id: 'event', name: '이벤트/파티', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
    { id: 'career', name: '취업/직무', icon: Briefcase, color: 'bg-teal-100 text-teal-600' },
    { id: 'lesson', name: '과외', icon: GraduationCap, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'hobby', name: '취미/자기계발', icon: Heart, color: 'bg-pink-100 text-pink-600' },
    { id: 'car', name: '자동차', icon: Car, color: 'bg-red-100 text-red-600' },
    { id: 'legal', name: '법률/금융', icon: Scale, color: 'bg-gray-100 text-gray-600' }
  ]

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setRequestData(prev => ({ ...prev, category: categoryId }))
    setCurrentStep(2)
    setProgress(25)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)

      // Progress calculation based on 8 total steps
      const progressMap = [0, 12, 25, 37, 50, 62, 75, 87, 100]
      setProgress(progressMap[prevStep] || 0)
    }
  }

  const handleNext = () => {
    if (currentStep < 8) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)

      // Progress calculation based on 8 total steps
      const progressMap = [0, 12, 25, 37, 50, 62, 75, 87, 100]
      setProgress(progressMap[nextStep] || 100)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-gray-900">견적 요청</h1>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step 1: Category Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                어떤 서비스가 필요하신가요?
              </h2>
              <p className="text-gray-600">
                카테고리를 선택하면 맞춤형 질문을 통해 정확한 견적을 받을 수 있어요.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {mainCategories.map((category) => {
                const Icon = category.icon
                return (
                  <Card
                    key={category.id}
                    className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => handleCategorySelect(category.id, category.name)}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        {category.name}
                      </h3>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="text-center text-sm text-gray-500 mt-8">
              💡 몇 가지 정보만 알려주시면 평균 4개 이상의 견적을 받을 수 있어요.
            </div>
          </div>
        )}

        {/* Step 2: Service Type Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="absolute left-0 top-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </Button>

              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                어떤 서비스를 원하시나요?
              </h2>
              <p className="text-gray-600">
                이사/청소 서비스의 세부 유형을 선택해주세요.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {[
                {
                  id: 'full-packing',
                  title: '포장이사',
                  description: '고수가 전부 포장 및 정리/귀중품 제외',
                  selected: requestData.subcategory === 'full-packing'
                },
                {
                  id: 'semi-packing',
                  title: '반포장이사',
                  description: '고수와 함께 포장/고수는 큰 것 배치만',
                  selected: requestData.subcategory === 'semi-packing'
                },
                {
                  id: 'general-moving',
                  title: '일반이사',
                  description: '고객이 전부 포장 및 정리/고수는 짐 운반만',
                  selected: requestData.subcategory === 'general-moving'
                },
                {
                  id: 'storage-moving',
                  title: '보관이사',
                  description: '이사짐 보관 후 입주일에 맞춰 운반',
                  selected: requestData.subcategory === 'storage-moving'
                }
              ].map((option) => (
                <Card
                  key={option.id}
                  className={`p-6 cursor-pointer border-2 transition-all ${
                    option.selected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() =>
                    setRequestData(prev => ({ ...prev, subcategory: option.id }))
                  }
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-5 h-5 rounded-full border-2 mt-1 ${
                      option.selected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {option.selected && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center text-sm text-gray-500 mt-8">
              💡 몇 가지 정보만 알려주시면 평균 4개 이상의 견적을 받을 수 있어요.
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <Button
                onClick={handleNext}
                disabled={!requestData.subcategory}
                className="px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
              >
                다음
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Date Selection */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                언제 서비스가 필요하신가요?
              </h2>
              <p className="text-gray-600">
                원하시는 서비스 날짜를 선택해주세요.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {/* Date Type Selection */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">서비스 일정</h3>
                {[
                  { id: 'urgent', title: '긴급 (1-2일 내)', description: '빠른 시일 내에 서비스가 필요해요' },
                  { id: 'within-week', title: '이번 주 내', description: '이번 주 내에 서비스를 받고 싶어요' },
                  { id: 'within-month', title: '한 달 내', description: '시간적 여유가 있어요' },
                  { id: 'specific-date', title: '특정 날짜', description: '정확한 날짜를 지정하고 싶어요' }
                ].map((option) => (
                  <Card
                    key={option.id}
                    className={`p-4 cursor-pointer border-2 transition-all ${
                      requestData.date === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() =>
                      setRequestData(prev => ({ ...prev, date: option.id }))
                    }
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-5 h-5 rounded-full border-2 mt-1 ${
                        requestData.date === option.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {requestData.date === option.id && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {option.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Specific Date Picker - shown when 'specific-date' is selected */}
              {requestData.date === 'specific-date' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">원하는 날짜</h4>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) =>
                      setRequestData(prev => ({
                        ...prev,
                        details: { ...prev.details, specificDate: e.target.value }
                      }))
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </Button>

              <Button
                onClick={handleNext}
                disabled={!requestData.date}
                className="px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
              >
                다음
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Location Selection */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                어디에서 서비스가 필요하신가요?
              </h2>
              <p className="text-gray-600">
                서비스를 받을 지역을 선택해주세요.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {/* 시/도 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시/도
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={requestData.details?.city || ''}
                  onChange={(e) =>
                    setRequestData(prev => ({
                      ...prev,
                      details: { ...prev.details, city: e.target.value }
                    }))
                  }
                >
                  <option value="">시/도를 선택하세요</option>
                  <option value="seoul">서울특별시</option>
                  <option value="busan">부산광역시</option>
                  <option value="daegu">대구광역시</option>
                  <option value="incheon">인천광역시</option>
                  <option value="gwangju">광주광역시</option>
                  <option value="daejeon">대전광역시</option>
                  <option value="ulsan">울산광역시</option>
                  <option value="sejong">세종특별자치시</option>
                  <option value="gyeonggi">경기도</option>
                  <option value="gangwon">강원도</option>
                  <option value="chungbuk">충청북도</option>
                  <option value="chungnam">충청남도</option>
                  <option value="jeonbuk">전라북도</option>
                  <option value="jeonnam">전라남도</option>
                  <option value="gyeongbuk">경상북도</option>
                  <option value="gyeongnam">경상남도</option>
                  <option value="jeju">제주특별자치도</option>
                </select>
              </div>

              {/* 구/군 선택 */}
              {requestData.details?.city && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    구/군
                  </label>
                  <input
                    type="text"
                    placeholder="구/군을 입력하세요 (예: 강남구, 수원시)"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={requestData.details?.district || ''}
                    onChange={(e) =>
                      setRequestData(prev => ({
                        ...prev,
                        details: { ...prev.details, district: e.target.value }
                      }))
                    }
                  />
                </div>
              )}

              {/* 상세 주소 (선택사항) */}
              {requestData.details?.district && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상세 주소 <span className="text-gray-500">(선택사항)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="동/읍/면을 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={requestData.details?.address || ''}
                    onChange={(e) =>
                      setRequestData(prev => ({
                        ...prev,
                        details: { ...prev.details, address: e.target.value }
                      }))
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </Button>

              <Button
                onClick={handleNext}
                disabled={!requestData.details?.city || !requestData.details?.district}
                className="px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
              >
                다음
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Budget Selection */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                예산 범위를 알려주세요
              </h2>
              <p className="text-gray-600">
                대략적인 예산 범위를 선택하시면 더 정확한 견적을 받을 수 있어요.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {[
                { id: 'under-50', title: '5만원 미만', description: '소규모 작업' },
                { id: '50-100', title: '5만원 - 10만원', description: '일반적인 규모' },
                { id: '100-200', title: '10만원 - 20만원', description: '중간 규모' },
                { id: '200-500', title: '20만원 - 50만원', description: '큰 규모' },
                { id: 'over-500', title: '50만원 이상', description: '대규모 프로젝트' },
                { id: 'flexible', title: '예산 협의', description: '견적을 받아본 후 결정하겠습니다' }
              ].map((option) => (
                <Card
                  key={option.id}
                  className={`p-4 cursor-pointer border-2 transition-all ${
                    requestData.budget === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() =>
                    setRequestData(prev => ({ ...prev, budget: option.id }))
                  }
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-5 h-5 rounded-full border-2 mt-1 ${
                      requestData.budget === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {requestData.budget === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {option.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </Button>

              <Button
                variant="outline"
                onClick={handleSkip}
                className="px-6"
              >
                건너뛰기
              </Button>

              <Button
                onClick={handleNext}
                className="px-8 bg-blue-600 hover:bg-blue-700"
              >
                다음
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 6: Contact Preference */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                연락 방법을 선택해주세요
              </h2>
              <p className="text-gray-600">
                전문가들이 어떤 방식으로 연락드릴까요?
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {[
                { id: 'chat', title: '채팅으로 연락', description: '앱 내에서 메시지로 소통하고 싶어요' },
                { id: 'call', title: '전화 연락', description: '직접 전화로 상담받고 싶어요' },
                { id: 'both', title: '채팅 + 전화', description: '둘 다 괜찮아요' }
              ].map((option) => (
                <Card
                  key={option.id}
                  className={`p-4 cursor-pointer border-2 transition-all ${
                    requestData.contactPreference === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() =>
                    setRequestData(prev => ({ ...prev, contactPreference: option.id }))
                  }
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-5 h-5 rounded-full border-2 mt-1 ${
                      requestData.contactPreference === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {requestData.contactPreference === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {option.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </Button>

              <Button
                onClick={handleNext}
                disabled={!requestData.contactPreference}
                className="px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
              >
                다음
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 7: Final Confirmation */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                견적 요청을 완료하시겠어요?
              </h2>
              <p className="text-gray-600">
                입력하신 정보를 확인하고 전문가들에게 견적을 요청하세요.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="p-6 space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                  요청 정보 요약
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">서비스 카테고리:</span>
                    <span className="font-medium">이사/청소</span>
                  </div>

                  {requestData.subcategory && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">서비스 유형:</span>
                      <span className="font-medium">
                        {requestData.subcategory === 'full-packing' && '포장이사'}
                        {requestData.subcategory === 'semi-packing' && '반포장이사'}
                        {requestData.subcategory === 'general-moving' && '일반이사'}
                        {requestData.subcategory === 'storage-moving' && '보관이사'}
                      </span>
                    </div>
                  )}

                  {requestData.date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">희망 일정:</span>
                      <span className="font-medium">
                        {requestData.date === 'urgent' && '긴급 (1-2일 내)'}
                        {requestData.date === 'within-week' && '이번 주 내'}
                        {requestData.date === 'within-month' && '한 달 내'}
                        {requestData.date === 'specific-date' && '특정 날짜'}
                      </span>
                    </div>
                  )}

                  {requestData.details?.city && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">서비스 지역:</span>
                      <span className="font-medium">
                        {requestData.details.city} {requestData.details.district}
                      </span>
                    </div>
                  )}

                  {requestData.budget && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">예산 범위:</span>
                      <span className="font-medium">
                        {requestData.budget === 'under-50' && '5만원 미만'}
                        {requestData.budget === '50-100' && '5만원 - 10만원'}
                        {requestData.budget === '100-200' && '10만원 - 20만원'}
                        {requestData.budget === '200-500' && '20만원 - 50만원'}
                        {requestData.budget === 'over-500' && '50만원 이상'}
                        {requestData.budget === 'flexible' && '예산 협의'}
                      </span>
                    </div>
                  )}

                  {requestData.contactPreference && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">연락 방법:</span>
                      <span className="font-medium">
                        {requestData.contactPreference === 'chat' && '채팅으로 연락'}
                        {requestData.contactPreference === 'call' && '전화 연락'}
                        {requestData.contactPreference === 'both' && '채팅 + 전화'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                    <span className="text-sm text-blue-800">
                      평균 2시간 내에 4-5명의 전문가로부터 견적을 받으실 수 있습니다.
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                수정하기
              </Button>

              <Button
                onClick={() => {
                  setCurrentStep(8)
                  setProgress(100)
                }}
                className="px-8 bg-green-600 hover:bg-green-700"
              >
                견적 요청하기
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 8: Success */}
        {currentStep === 8 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              견적 요청이 완료되었습니다!
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              전문가들에게 요청이 전달되었습니다.<br />
              평균 2시간 내에 견적을 받으실 수 있어요.
            </p>

            <div className="space-y-4">
              <Button
                onClick={() => router.push('/dashboard')}
                className="px-8 bg-blue-600 hover:bg-blue-700"
              >
                내 요청 관리하기
              </Button>

              <div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="px-6"
                >
                  홈으로 돌아가기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RequestQuotePage() {
  return (
    <Suspense fallback={<div>견적 요청 페이지 로딩 중...</div>}>
      <RequestQuotePageContent />
    </Suspense>
  )
}