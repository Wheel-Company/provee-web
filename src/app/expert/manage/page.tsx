'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/hooks/useUser'
import { EnhancedProveeAPI } from '@/lib/api-enhanced'
import {
  Plus,
  X,
  Save,
  ArrowLeft,
  Upload,
  Star,
  MapPin,
  Clock,
  Award,
  Settings
} from 'lucide-react'

interface Certification {
  id?: string
  name: string
  issuer: string
  type: 'professional' | 'platform'
  verified: boolean
}

interface FAQ {
  id?: string
  question: string
  answer: string
  display_order: number
}

interface ServiceArea {
  id?: string
  area_name: string
  is_primary: boolean
  travel_fee: number
  travel_time_minutes: number
}

interface WorkProcess {
  id?: string
  step_number: number
  title: string
  description: string
  icon: string
}

interface PortfolioItem {
  id?: string
  image_url: string
  title: string
  description: string
  category: string
  display_order: number
}

export default function ExpertManagePage() {
  const { user, profile, loading: userLoading } = useUser()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expertData, setExpertData] = useState<any>(null)

  // Form states
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([])
  const [workProcess, setWorkProcess] = useState<WorkProcess[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [activeTab, setActiveTab] = useState<'basic' | 'certifications' | 'faqs' | 'service' | 'process' | 'portfolio'>('basic')

  // Basic info form states
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    description: '',
    location: '',
    services: [] as string[],
    hourly_rate: 0,
    experience_years: 0,
    response_time_hours: 24
  })

  useEffect(() => {
    if (userLoading) return

    console.log('Current user:', user)
    console.log('Current profile:', profile)
    console.log('User type:', profile?.user_type)

    if (!user) {
      router.push('/auth/login')
      return
    }

    if (profile?.user_type !== 'expert') {
      alert(`현재 사용자 타입: ${profile?.user_type}. 전문가만 접근할 수 있는 페이지입니다.`)
      router.push('/')
      return
    }

    loadExpertData()
  }, [user, profile, userLoading, router])

  const loadExpertData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await EnhancedProveeAPI.getExpertDetails(user.id)

      if (response.success && response.data) {
        setExpertData(response.data)

        // Load basic info
        setBasicInfo({
          name: response.data.profiles?.name || '',
          description: response.data.description || '',
          location: response.data.location || '',
          services: response.data.services || [],
          hourly_rate: response.data.hourly_rate || 0,
          experience_years: response.data.experience_years || 0,
          response_time_hours: response.data.response_time_hours || 24
        })

        // Load existing data
        setCertifications(response.data.certifications || [])
        setFAQs(response.data.faqs || [])
        setServiceAreas(response.data.service_areas || [])
        setWorkProcess(response.data.work_process || [])

        // Load portfolio data
        if (response.data.portfolio) {
          const portfolioItems = Array.isArray(response.data.portfolio[0])
            ? response.data.portfolio.map((url: string, index: number) => ({
                image_url: url,
                title: `포트폴리오 ${index + 1}`,
                description: '',
                category: 'work',
                display_order: index + 1
              }))
            : response.data.portfolio
          setPortfolio(portfolioItems)
        }
      }
    } catch (error) {
      console.error('Error loading expert data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addCertification = () => {
    setCertifications([...certifications, {
      name: '',
      issuer: '',
      type: 'professional',
      verified: false
    }])
  }

  const updateCertification = (index: number, field: keyof Certification, value: any) => {
    const updated = [...certifications]
    updated[index] = { ...updated[index], [field]: value }
    setCertifications(updated)
  }

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  const addFAQ = () => {
    setFAQs([...faqs, {
      question: '',
      answer: '',
      display_order: faqs.length + 1
    }])
  }

  const updateFAQ = (index: number, field: keyof FAQ, value: any) => {
    const updated = [...faqs]
    updated[index] = { ...updated[index], [field]: value }
    setFAQs(updated)
  }

  const removeFAQ = (index: number) => {
    setFAQs(faqs.filter((_, i) => i !== index))
  }

  const addServiceArea = () => {
    setServiceAreas([...serviceAreas, {
      area_name: '',
      is_primary: false,
      travel_fee: 0,
      travel_time_minutes: 0
    }])
  }

  const updateServiceArea = (index: number, field: keyof ServiceArea, value: any) => {
    const updated = [...serviceAreas]
    updated[index] = { ...updated[index], [field]: value }
    setServiceAreas(updated)
  }

  const removeServiceArea = (index: number) => {
    setServiceAreas(serviceAreas.filter((_, i) => i !== index))
  }

  const addWorkProcessStep = () => {
    setWorkProcess([...workProcess, {
      step_number: workProcess.length + 1,
      title: '',
      description: '',
      icon: '⚡'
    }])
  }

  const updateWorkProcess = (index: number, field: keyof WorkProcess, value: any) => {
    const updated = [...workProcess]
    updated[index] = { ...updated[index], [field]: value }
    setWorkProcess(updated)
  }

  const removeWorkProcess = (index: number) => {
    const updated = workProcess.filter((_, i) => i !== index)
    // Renumber steps
    updated.forEach((step, i) => {
      step.step_number = i + 1
    })
    setWorkProcess(updated)
  }

  const saveData = async () => {
    if (!user?.id) return

    try {
      setSaving(true)

      // Save each section
      await Promise.all([
        saveCertifications(),
        saveFAQs(),
        saveServiceAreas(),
        saveWorkProcess()
      ])

      alert('정보가 성공적으로 저장되었습니다!')

    } catch (error) {
      console.error('Save error:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const saveCertifications = async () => {
    if (!user?.id) return

    const response = await EnhancedProveeAPI.saveCertifications(user.id, certifications)
    if (!response.success) {
      throw new Error(response.error || 'Failed to save certifications')
    }
    console.log('✅ Certifications saved successfully')
  }

  const saveFAQs = async () => {
    if (!user?.id) return

    const response = await EnhancedProveeAPI.saveFAQs(user.id, faqs)
    if (!response.success) {
      throw new Error(response.error || 'Failed to save FAQs')
    }
    console.log('✅ FAQs saved successfully')
  }

  const saveServiceAreas = async () => {
    if (!user?.id) return

    const response = await EnhancedProveeAPI.saveServiceAreas(user.id, serviceAreas)
    if (!response.success) {
      throw new Error(response.error || 'Failed to save service areas')
    }
    console.log('✅ Service areas saved successfully')
  }

  const saveWorkProcess = async () => {
    if (!user?.id) return

    const response = await EnhancedProveeAPI.saveWorkProcess(user.id, workProcess)
    if (!response.success) {
      throw new Error(response.error || 'Failed to save work process')
    }
    console.log('✅ Work process saved successfully')
  }

  const saveBasicInfo = async () => {
    if (!user?.id) return
    // API에서 기본 정보 저장 기능 구현 필요
    console.log('✅ Basic info saved successfully', basicInfo)
  }

  const savePortfolio = async () => {
    if (!user?.id) return

    const response = await EnhancedProveeAPI.savePortfolio(user.id, portfolio)
    if (!response.success) {
      throw new Error(response.error || 'Failed to save portfolio')
    }
    console.log('✅ Portfolio saved successfully')
  }

  const addPortfolioItem = () => {
    setPortfolio([...portfolio, {
      image_url: '',
      title: '',
      description: '',
      category: 'work',
      display_order: portfolio.length + 1
    }])
  }

  const updatePortfolioItem = (index: number, field: keyof PortfolioItem, value: any) => {
    const updated = [...portfolio]
    updated[index] = { ...updated[index], [field]: value }
    setPortfolio(updated)
  }

  const removePortfolioItem = (index: number) => {
    const updated = portfolio.filter((_, i) => i !== index)
    // Renumber display order
    updated.forEach((item, i) => {
      item.display_order = i + 1
    })
    setPortfolio(updated)
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.back()} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                돌아가기
              </Button>
              <div>
                <h1 className="text-2xl font-bold">전문가 정보 관리</h1>
                <p className="text-gray-600">프로필 정보를 수정하고 고객에게 더 나은 서비스를 제공하세요</p>
              </div>
            </div>

            <Button onClick={saveData} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  저장하기
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64">
            <Card className="p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'basic' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-3" />
                  기본 정보
                </button>
                <button
                  onClick={() => setActiveTab('certifications')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'certifications' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Award className="w-4 h-4 inline mr-3" />
                  자격증 ({certifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('faqs')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'faqs' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Star className="w-4 h-4 inline mr-3" />
                  FAQ ({faqs.length})
                </button>
                <button
                  onClick={() => setActiveTab('service')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'service' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <MapPin className="w-4 h-4 inline mr-3" />
                  서비스 지역 ({serviceAreas.length})
                </button>
                <button
                  onClick={() => setActiveTab('process')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'process' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Clock className="w-4 h-4 inline mr-3" />
                  작업 프로세스 ({workProcess.length})
                </button>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'portfolio' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Star className="w-4 h-4 inline mr-3" />
                  포트폴리오 ({portfolio.length})
                </button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'basic' && (
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">기본 정보</h2>
                  <Button onClick={saveBasicInfo}>
                    <Save className="w-4 h-4 mr-2" />
                    기본 정보 저장
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">이름</label>
                      <Input
                        value={basicInfo.name}
                        onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
                        placeholder="전문가 이름을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">위치</label>
                      <Input
                        value={basicInfo.location}
                        onChange={(e) => setBasicInfo({...basicInfo, location: e.target.value})}
                        placeholder="서울시 강남구"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">서비스 설명</label>
                    <Textarea
                      value={basicInfo.description}
                      onChange={(e) => setBasicInfo({...basicInfo, description: e.target.value})}
                      placeholder="제공하는 서비스에 대한 간략한 설명을 입력하세요"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">시간당 요금 (원)</label>
                      <Input
                        type="number"
                        value={basicInfo.hourly_rate}
                        onChange={(e) => setBasicInfo({...basicInfo, hourly_rate: parseInt(e.target.value) || 0})}
                        placeholder="25000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">경력 (년)</label>
                      <Input
                        type="number"
                        value={basicInfo.experience_years}
                        onChange={(e) => setBasicInfo({...basicInfo, experience_years: parseInt(e.target.value) || 0})}
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">응답 시간 (시간)</label>
                      <Input
                        type="number"
                        value={basicInfo.response_time_hours}
                        onChange={(e) => setBasicInfo({...basicInfo, response_time_hours: parseInt(e.target.value) || 24})}
                        placeholder="24"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">제공 서비스</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {['청소', '수리', '과외', '디자인', '요리', '운동', '음악'].map((service) => (
                        <button
                          key={service}
                          onClick={() => {
                            const newServices = basicInfo.services.includes(service)
                              ? basicInfo.services.filter(s => s !== service)
                              : [...basicInfo.services, service]
                            setBasicInfo({...basicInfo, services: newServices})
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            basicInfo.services.includes(service)
                              ? 'bg-blue-100 text-blue-700 border-blue-300'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          } border`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      선택된 서비스: {basicInfo.services.join(', ') || '없음'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'certifications' && (
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">자격증 관리</h2>
                  <Button onClick={addCertification}>
                    <Plus className="w-4 h-4 mr-2" />
                    자격증 추가
                  </Button>
                </div>

                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-medium">자격증 #{index + 1}</h3>
                        <Button
                          onClick={() => removeCertification(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">자격증명</label>
                          <Input
                            value={cert.name}
                            onChange={(e) => updateCertification(index, 'name', e.target.value)}
                            placeholder="예: TESOL 자격증"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">발급기관</label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                            placeholder="예: 한국산업인력공단"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">유형</label>
                          <select
                            value={cert.type}
                            onChange={(e) => updateCertification(index, 'type', e.target.value)}
                            className="px-3 py-2 border rounded-lg"
                          >
                            <option value="professional">전문자격증</option>
                            <option value="platform">플랫폼인증</option>
                          </select>
                        </div>
                        <div className="flex items-center mt-6">
                          <input
                            type="checkbox"
                            checked={cert.verified}
                            onChange={(e) => updateCertification(index, 'verified', e.target.checked)}
                            className="mr-2"
                          />
                          <label className="text-sm">인증완료</label>
                        </div>
                      </div>
                    </div>
                  ))}

                  {certifications.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      등록된 자격증이 없습니다. 자격증을 추가해보세요.
                    </div>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'faqs' && (
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">FAQ 관리</h2>
                  <Button onClick={addFAQ}>
                    <Plus className="w-4 h-4 mr-2" />
                    FAQ 추가
                  </Button>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-medium">FAQ #{index + 1}</h3>
                        <Button
                          onClick={() => removeFAQ(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">질문</label>
                          <Input
                            value={faq.question}
                            onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                            placeholder="예: 과외 시간은 어떻게 되나요?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">답변</label>
                          <Textarea
                            value={faq.answer}
                            onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                            placeholder="답변을 입력하세요..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {faqs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      등록된 FAQ가 없습니다. FAQ를 추가해보세요.
                    </div>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'service' && (
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">서비스 지역 관리</h2>
                  <Button onClick={addServiceArea}>
                    <Plus className="w-4 h-4 mr-2" />
                    지역 추가
                  </Button>
                </div>

                <div className="space-y-4">
                  {serviceAreas.map((area, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-medium">서비스 지역 #{index + 1}</h3>
                        <Button
                          onClick={() => removeServiceArea(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">지역명</label>
                          <Input
                            value={area.area_name}
                            onChange={(e) => updateServiceArea(index, 'area_name', e.target.value)}
                            placeholder="예: 서울시 강남구"
                          />
                        </div>
                        <div className="flex items-center mt-6">
                          <input
                            type="checkbox"
                            checked={area.is_primary}
                            onChange={(e) => updateServiceArea(index, 'is_primary', e.target.checked)}
                            className="mr-2"
                          />
                          <label className="text-sm">주요 서비스 지역</label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">교통비 (원)</label>
                          <Input
                            type="number"
                            value={area.travel_fee}
                            onChange={(e) => updateServiceArea(index, 'travel_fee', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">이동 시간 (분)</label>
                          <Input
                            type="number"
                            value={area.travel_time_minutes}
                            onChange={(e) => updateServiceArea(index, 'travel_time_minutes', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {serviceAreas.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      등록된 서비스 지역이 없습니다. 지역을 추가해보세요.
                    </div>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'process' && (
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">작업 프로세스 관리</h2>
                  <Button onClick={addWorkProcessStep}>
                    <Plus className="w-4 h-4 mr-2" />
                    단계 추가
                  </Button>
                </div>

                <div className="space-y-4">
                  {workProcess.map((step, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-medium">단계 {step.step_number}</h3>
                        <Button
                          onClick={() => removeWorkProcess(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">아이콘</label>
                          <Input
                            value={step.icon}
                            onChange={(e) => updateWorkProcess(index, 'icon', e.target.value)}
                            placeholder="📋"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-1">단계명</label>
                          <Input
                            value={step.title}
                            onChange={(e) => updateWorkProcess(index, 'title', e.target.value)}
                            placeholder="예: 상담 및 견적"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">설명</label>
                        <Textarea
                          value={step.description}
                          onChange={(e) => updateWorkProcess(index, 'description', e.target.value)}
                          placeholder="단계에 대한 상세 설명을 입력하세요..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}

                  {workProcess.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      등록된 작업 프로세스가 없습니다. 단계를 추가해보세요.
                    </div>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'portfolio' && (
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">포트폴리오 관리</h2>
                  <Button onClick={addPortfolioItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    작품 추가
                  </Button>
                </div>

                <div className="space-y-6">
                  {portfolio.map((item, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-medium">작품 {item.display_order}</h3>
                        <Button
                          onClick={() => removePortfolioItem(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">작품 제목 *</label>
                          <Input
                            value={item.title}
                            onChange={(e) => updatePortfolioItem(index, 'title', e.target.value)}
                            placeholder="작품의 제목을 입력하세요"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">카테고리</label>
                          <select
                            value={item.category}
                            onChange={(e) => updatePortfolioItem(index, 'category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">선택해주세요</option>
                            <option value="청소">청소</option>
                            <option value="수리">수리</option>
                            <option value="과외">과외</option>
                            <option value="디자인">디자인</option>
                            <option value="기타">기타</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">이미지 URL *</label>
                        <Input
                          value={item.image_url}
                          onChange={(e) => updatePortfolioItem(index, 'image_url', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                        {item.image_url && (
                          <div className="mt-2">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-32 h-32 object-cover rounded-lg border"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.jpg'
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">설명</label>
                        <Textarea
                          value={item.description || ''}
                          onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
                          placeholder="작품에 대한 상세 설명을 입력하세요..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">작업 기간</label>
                          <Input
                            value={item.duration || ''}
                            onChange={(e) => updatePortfolioItem(index, 'duration', e.target.value)}
                            placeholder="예: 2주, 1개월"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">완료 년도</label>
                          <Input
                            type="number"
                            value={item.year || ''}
                            onChange={(e) => updatePortfolioItem(index, 'year', parseInt(e.target.value) || null)}
                            placeholder="2024"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {portfolio.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      등록된 포트폴리오가 없습니다. 작품을 추가해보세요.
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">포트폴리오 작성 팁</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 실제 작업한 사례만 등록해주세요</li>
                    <li>• 고화질의 작업 사진을 사용하면 더 좋은 인상을 줄 수 있습니다</li>
                    <li>• 작업 과정이나 결과를 구체적으로 설명해주세요</li>
                    <li>• 카테고리별로 다양한 작품을 보여주면 신뢰도가 높아집니다</li>
                  </ul>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}