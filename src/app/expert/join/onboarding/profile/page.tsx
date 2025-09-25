'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    email: '',
    password: '',
    phone: '',
    verificationCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [agreements, setAgreements] = useState({
    all: false,
    age: false,
    terms: false,
    privacy: false,
    finance: false,
    marketing: false,
    sms: false
  })

  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGenderSelect = (gender: string) => {
    setFormData(prev => ({ ...prev, gender }))
  }

  const handleSendCode = () => {
    if (!formData.phone) {
      alert('휴대전화 번호를 입력해주세요.')
      return
    }
    setIsCodeSent(true)
    // TODO: 실제 인증번호 발송 로직
    console.log('Sending verification code to:', formData.phone)
  }

  const handleAgreementChange = (key: string, checked: boolean) => {
    if (key === 'all') {
      const newAgreements = {
        all: checked,
        age: checked,
        terms: checked,
        privacy: checked,
        finance: checked,
        marketing: checked,
        sms: checked
      }
      setAgreements(newAgreements)
    } else {
      const newAgreements = { ...agreements, [key]: checked }
      // 전체 동의 체크 상태 업데이트
      const requiredKeys = ['age', 'terms', 'privacy', 'finance']
      const optionalKeys = ['marketing', 'sms']
      const allRequired = requiredKeys.every(k => newAgreements[k as keyof typeof newAgreements])
      const allOptional = optionalKeys.every(k => newAgreements[k as keyof typeof newAgreements])
      newAgreements.all = allRequired && allOptional

      setAgreements(newAgreements)
    }
  }

  const handleSubmit = () => {
    // 필수 약관 체크
    const requiredAgreements = ['age', 'terms', 'privacy', 'finance']
    const hasRequiredAgreements = requiredAgreements.every(key => agreements[key as keyof typeof agreements])

    if (!hasRequiredAgreements) {
      alert('필수 약관에 동의해주세요.')
      return
    }

    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      alert('필수 정보를 모두 입력해주세요.')
      return
    }

    if (!isCodeSent || !formData.verificationCode) {
      alert('휴대전화 인증을 완료해주세요.')
      return
    }

    // TODO: 전문가 등록 완료 처리
    console.log('Expert registration completed:', formData, agreements)
    router.push('/expert/join/onboarding/complete')
  }

  const handleBack = () => {
    router.push('/expert/join/onboarding/auth')
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
            <div className="text-sm text-gray-500">4/5</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: '80%'}}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            마지막으로 필수 정보를<br />
            입력해주세요.
          </h1>
        </div>

        <div className="space-y-6">
          {/* 이름 */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-900">
              이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 h-12"
              required
            />
            {!formData.name && (
              <p className="text-sm text-red-500 mt-1">이름을 입력해주세요</p>
            )}
          </div>

          {/* 성별 */}
          <div>
            <Label className="text-sm font-medium text-gray-900">
              성별 <span className="text-red-500">*</span>
            </Label>
            <div className="flex mt-2 space-x-4">
              <Button
                variant={formData.gender === 'male' ? 'default' : 'outline'}
                onClick={() => handleGenderSelect('male')}
                className="flex-1 h-12"
              >
                남자
              </Button>
              <Button
                variant={formData.gender === 'female' ? 'default' : 'outline'}
                onClick={() => handleGenderSelect('female')}
                className="flex-1 h-12"
              >
                여자
              </Button>
            </div>
          </div>

          {/* 이메일 */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-900">
              이메일 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="id@provee.com"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 h-12"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-900">
              비밀번호 <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해 주세요"
                value={formData.password}
                onChange={handleInputChange}
                className="h-12 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* 휴대전화 번호 */}
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
              휴대전화 번호 인증 <span className="text-red-500">*</span>
            </Label>
            <div className="flex mt-1 space-x-2">
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="예) 010-1234-5678"
                value={formData.phone}
                onChange={handleInputChange}
                className="flex-1 h-12"
                required
              />
              <Button
                onClick={handleSendCode}
                variant="outline"
                className="h-12 px-6 whitespace-nowrap"
                disabled={isCodeSent}
              >
                {isCodeSent ? '발송완료' : '인증'}
              </Button>
            </div>
          </div>

          {/* 인증번호 입력 */}
          {isCodeSent && (
            <div>
              <Input
                name="verificationCode"
                type="text"
                placeholder="인증번호를 입력하세요"
                value={formData.verificationCode}
                onChange={handleInputChange}
                className="h-12"
                maxLength={6}
              />
            </div>
          )}

          {/* 약관 동의 */}
          <Card className="p-4">
            <div className="space-y-3">
              {/* 전체 동의 */}
              <div className="flex items-center space-x-3 pb-3 border-b">
                <input
                  type="checkbox"
                  id="all"
                  checked={agreements.all}
                  onChange={(e) => handleAgreementChange('all', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <Label htmlFor="all" className="font-semibold">약관 전체 동의</Label>
              </div>

              {/* 개별 약관 */}
              {[
                { key: 'age', label: '만 14세 이상입니다', required: true },
                { key: 'terms', label: '이용약관 동의', required: true },
                { key: 'privacy', label: '개인정보 수집 및 이용 동의', required: true },
                { key: 'finance', label: '전자금융 수집 및 이용 동의', required: true },
                { key: 'marketing', label: '개인정보의 마케팅 활용 동의', required: false },
                { key: 'sms', label: '마케팅 정보 수신 동의', required: false }
              ].map(({ key, label, required }) => (
                <div key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={key}
                    checked={agreements[key as keyof typeof agreements] as boolean}
                    onChange={(e) => handleAgreementChange(key, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor={key} className={`text-sm ${required ? '' : 'text-gray-600'}`}>
                    {label} {required && <span className="text-red-500">(필수)</span>}
                    {!required && <span className="text-gray-500">(선택)</span>}
                  </Label>
                </div>
              ))}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={handleBack}>
              이전
            </Button>
            <Button onClick={handleSubmit} className="px-8">
              가입 완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}