'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ProveeLogoIcon } from './header'
import {
  Search,
  UserPlus,
  Brain,
  Shield,
  CreditCard,
  HelpCircle,
  FileText,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink
} from 'lucide-react'

interface FooterProps {
  variant?: 'default' | 'simple'
}

const CompanyInfo: React.FC = () => {
  return (
    <div className="space-y-4">
      <ProveeLogoIcon size="lg" showText />
      <p className="text-gray-600 text-sm leading-relaxed max-w-md">
        AI 매칭 시스템과 보증금 시스템으로 신뢰할 수 있는 서비스 매칭을 제공하는
        프리미엄 서비스 플랫폼입니다.
      </p>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          1588-0000
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          support@provee.kr
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          서울시 강남구 테헤란로 123길 45, 6층
        </div>
      </div>

      {/* Provee 특화 정보 */}
      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
        <div className="text-sm font-medium text-blue-800">
          Provee 서비스 특징
        </div>
        <div className="space-y-1 text-xs text-blue-700">
          <div>✓ AI 매칭 성공률 85%+</div>
          <div>✓ 보증금 시스템으로 안전한 거래</div>
          <div>✓ 매칭 실패 시 100% 환불 보장</div>
        </div>
      </div>
    </div>
  )
}

const ServiceLinks: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">서비스</h3>
      <ul className="space-y-3">
        <li>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            <Search className="w-4 h-4 mr-2" />
            서비스 찾기
          </Button>
        </li>
        <li>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            <UserPlus className="w-4 h-4 mr-2" />
            전문가 등록
          </Button>
        </li>
        <li>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            <Brain className="w-4 h-4 mr-2" />
            AI 매칭 시스템
          </Button>
        </li>
        <li>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            <Shield className="w-4 h-4 mr-2" />
            보증금 시스템
          </Button>
        </li>
        <li>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            <CreditCard className="w-4 h-4 mr-2" />
            구독 요금제
          </Button>
        </li>
      </ul>
    </div>
  )
}

const SupportLinks: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">고객지원</h3>
      <ul className="space-y-3">
        <li>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            <HelpCircle className="w-4 h-4 mr-2" />
            도움말 센터
          </Button>
        </li>
        <li>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            <FileText className="w-4 h-4 mr-2" />
            FAQ
          </Button>
        </li>
        <li>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            <MessageSquare className="w-4 h-4 mr-2" />
            1:1 문의
          </Button>
        </li>
        <li>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            <FileText className="w-4 h-4 mr-2" />
            이용약관
          </Button>
        </li>
        <li>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            <Shield className="w-4 h-4 mr-2" />
            개인정보처리방침
          </Button>
        </li>
      </ul>
    </div>
  )
}

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 뉴스레터 구독 로직
    console.log('뉴스레터 구독:', email)
    setEmail('')
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        소셜 미디어 & 뉴스레터
      </h3>

      {/* 소셜 미디어 */}
      <div className="flex space-x-3">
        <Button variant="outline" size="sm" className="p-2">
          <Facebook className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="p-2">
          <Twitter className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="p-2">
          <Instagram className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="p-2">
          <Youtube className="w-4 h-4" />
        </Button>
      </div>

      {/* 뉴스레터 구독 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            뉴스레터 구독
          </label>
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm">
              구독
            </Button>
          </div>
        </div>
      </form>

      <p className="text-xs text-gray-500">
        Provee의 최신 소식과 매칭 성공 사례를 받아보세요.
      </p>
    </div>
  )
}

const BusinessInfo: React.FC = () => {
  return (
    <div className="pt-8 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 회사 정보 */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="font-medium text-gray-900">㈜프로비</div>
          <div>대표이사: 김프로비</div>
          <div>사업자등록번호: 123-45-67890</div>
          <div>통신판매업신고번호: 제2024-서울강남-12345호</div>
          <div>주소: 서울시 강남구 테헤란로 123길 45, 6층</div>
        </div>

        {/* 약관 링크 */}
        <div className="flex flex-wrap gap-4 text-sm">
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            이용약관
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            개인정보처리방침
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            서비스 이용약관
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
          <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
            분쟁해결 기준
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <div className="mb-4 md:mb-0">
          © 2024 Provee. All rights reserved.
        </div>
        <div className="text-center md:text-right">
          <div>AI 기반 프리미엄 서비스 매칭 플랫폼</div>
          <div className="mt-1 text-xs">
            고객상담: 평일 9:00~18:00 (토·일·공휴일 휴무)
          </div>
        </div>
      </div>
    </div>
  )
}

const SimpleFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <ProveeLogoIcon size="sm" showText />
          <div className="mt-4 md:mt-0 text-sm text-gray-500">
            © 2024 Provee. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
  if (variant === 'simple') {
    return <SimpleFooter />
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CompanyInfo />
          </div>
          <div>
            <ServiceLinks />
          </div>
          <div>
            <SupportLinks />
          </div>
          <div>
            <Newsletter />
          </div>
        </div>

        <BusinessInfo />
      </div>
    </footer>
  )
}

export { Footer, SimpleFooter }