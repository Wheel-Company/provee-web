'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Camera,
  Smartphone,
  Globe
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import ProveeAPI from '@/lib/api'

interface SettingSection {
  id: string
  title: string
  description: string
  icon: React.ElementType
}

export default function ProfileSettingsPage() {
  const { profile, user } = useUser()
  const [activeSection, setActiveSection] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    name: profile?.name || '',
    username: profile?.username || '',
    email: user?.email || '',
    phone: profile?.phone || ''
  })

  const settingSections: SettingSection[] = [
    {
      id: 'profile',
      title: '기본 정보',
      description: '프로필 사진, 이름, 연락처 등 기본 정보를 관리합니다',
      icon: User
    },
    {
      id: 'notifications',
      title: '알림 설정',
      description: '이메일, SMS, 앱 알림 설정을 관리합니다',
      icon: Bell
    },
    {
      id: 'security',
      title: '보안 설정',
      description: '비밀번호, 2단계 인증 등 보안 설정을 관리합니다',
      icon: Shield
    },
    {
      id: 'payment',
      title: '결제 관리',
      description: '결제 수단, 구독, 거래 내역을 관리합니다',
      icon: CreditCard
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      const updates = {
        name: profileData.name,
        username: profileData.username,
        phone: profileData.phone
      }

      const response = await ProveeAPI.updateProfile(updates)

      if (response.success) {
        alert('설정이 저장되었습니다.')
        // 프로필 다시 로드하기 위해 페이지 새로고침 또는 상태 업데이트
        window.location.reload()
      } else {
        alert(`저장 중 오류가 발생했습니다: ${response.error}`)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  const ProfileSection = () => (
    <div className="space-y-6">
      {/* 프로필 사진 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">프로필 사진</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">
              JPG, PNG 파일만 업로드 가능합니다. (최대 5MB)
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                사진 변경
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600">
                삭제
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 기본 정보 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <Input
              value={profileData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="이름을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사용자명
            </label>
            <Input
              value={profileData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="사용자명을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="이메일을 입력하세요"
                className="pl-10"
                disabled
              />
            </div>
            <Badge variant="secondary" className="mt-1 text-xs">
              인증됨
            </Badge>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="전화번호를 입력하세요"
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const NotificationSection = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">이메일 알림</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">새로운 견적 요청</p>
              <p className="text-sm text-gray-600">새로운 견적 요청이 있을 때 알림을 받습니다</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">매칭 성공</p>
              <p className="text-sm text-gray-600">매칭이 성공했을 때 알림을 받습니다</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">결제 및 정산</p>
              <p className="text-sm text-gray-600">결제 및 정산 관련 알림을 받습니다</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS 알림</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">긴급 알림</p>
              <p className="text-sm text-gray-600">중요한 알림을 SMS로 받습니다</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">마케팅 정보</p>
              <p className="text-sm text-gray-600">프로모션 및 마케팅 정보를 SMS로 받습니다</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </Card>
    </div>
  )

  const SecuritySection = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">비밀번호 변경</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="현재 비밀번호를 입력하세요"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="password"
                placeholder="새 비밀번호를 입력하세요"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 비밀번호 확인
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="password"
                placeholder="새 비밀번호를 다시 입력하세요"
                className="pl-10"
              />
            </div>
          </div>
          <Button>비밀번호 변경</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">2단계 인증</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">2단계 인증 사용</p>
            <p className="text-sm text-gray-600">SMS 또는 앱을 통한 추가 인증으로 계정을 보호합니다</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline">비활성</Badge>
            <Button variant="outline" size="sm">
              <Smartphone className="w-4 h-4 mr-2" />
              설정하기
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )

  const PaymentSection = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">구독 정보</h3>
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">기본 요금제</p>
            <p className="text-sm text-gray-600">월 9,900원 • 다음 결제일: 2024-10-26</p>
          </div>
          <div className="text-right">
            <Badge className="mb-2">활성</Badge>
            <div className="space-x-2">
              <Button variant="outline" size="sm">변경</Button>
              <Button variant="ghost" size="sm" className="text-red-600">해지</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">결제 수단</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
                CARD
              </div>
              <div>
                <p className="font-medium text-gray-900">**** **** **** 1234</p>
                <p className="text-sm text-gray-600">기본 결제 수단</p>
              </div>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm">편집</Button>
              <Button variant="ghost" size="sm" className="text-red-600">삭제</Button>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            + 새 결제 수단 추가
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 거래 내역</h3>
        <div className="space-y-3">
          {[
            { date: '2024-09-26', description: '월 구독료', amount: '-9,900원', status: '완료' },
            { date: '2024-09-15', description: '홈클리닝 서비스', amount: '-45,000원', status: '완료' },
            { date: '2024-09-10', description: '보증금 환불', amount: '+10,000원', status: '완료' }
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-600">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'}`}>
                  {transaction.amount}
                </p>
                <Badge variant="outline" className="text-xs">
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          전체 거래 내역 보기
        </Button>
      </Card>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />
      case 'notifications':
        return <NotificationSection />
      case 'security':
        return <SecuritySection />
      case 'payment':
        return <PaymentSection />
      default:
        return <ProfileSection />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">설정</h1>
          <p className="text-gray-600">계정 정보와 서비스 설정을 관리하세요</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 사이드바 */}
          <div className="lg:w-64">
            <Card className="p-4">
              <nav className="space-y-2">
                {settingSections.map((section) => {
                  const IconComponent = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <div>
                        <p className="font-medium">{section.title}</p>
                        <p className="text-sm text-gray-600 hidden lg:block">
                          {section.description.split(' ').slice(0, 4).join(' ')}...
                        </p>
                      </div>
                    </button>
                  )
                })}
              </nav>
            </Card>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            {renderSection()}

            {/* 저장 버튼 */}
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} className="px-8">
                <Save className="w-4 h-4 mr-2" />
                변경사항 저장
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}