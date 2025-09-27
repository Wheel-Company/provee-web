'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Settings,
  FileText,
  Heart,
  MessageSquare,
  CreditCard,
  ShoppingBag,
  HelpCircle,
  ChevronRight,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Plus
} from 'lucide-react'

interface CustomerProfileProps {
  user: any
  profile: any
  profileStats: any
}

export default function CustomerProfile({ user, profile, profileStats }: CustomerProfileProps) {
  const router = useRouter()

  const customerMenuItems = [
    {
      title: '견적 관리',
      items: [
        {
          id: 'my-requests',
          icon: FileText,
          title: '내 견적 요청',
          description: '요청한 견적 내역을 확인하세요',
          badge: profileStats.activeRequests.toString(),
          href: '/profile/requests'
        },
        {
          id: 'request-new',
          icon: Plus,
          title: '새 견적 요청',
          description: '새로운 서비스 견적을 요청하세요',
          href: '/request'
        },
        {
          id: 'favorites',
          icon: Heart,
          title: '관심 전문가',
          description: '찜한 전문가들을 관리하세요',
          badge: profileStats.favoriteExperts.toString(),
          href: '/profile/favorites'
        }
      ]
    },
    {
      title: '서비스 이용 내역',
      items: [
        {
          id: 'reviews',
          icon: Star,
          title: '내 리뷰',
          description: '작성한 리뷰를 확인하고 관리하세요',
          badge: profileStats.totalReviews.toString(),
          href: '/profile/reviews'
        },
        {
          id: 'chat',
          icon: MessageSquare,
          title: '채팅 내역',
          description: '전문가와의 대화 내역',
          href: '/profile/chat'
        },
        {
          id: 'completed-services',
          icon: ShoppingBag,
          title: '완료된 서비스',
          description: '이용한 서비스 내역을 확인하세요',
          href: '/profile/services'
        }
      ]
    },
    {
      title: '결제 관리',
      items: [
        {
          id: 'payment',
          icon: CreditCard,
          title: '결제 내역',
          description: '결제 및 환불 내역을 확인하세요',
          href: '/profile/payment'
        }
      ]
    },
    {
      title: '계정 관리',
      items: [
        {
          id: 'settings',
          icon: Settings,
          title: '계정 설정',
          description: '개인정보 및 보안 설정',
          href: '/profile/settings'
        },
        {
          id: 'help',
          icon: HelpCircle,
          title: '고객센터',
          description: '자주 묻는 질문 및 문의하기',
          href: '/profile/help'
        }
      ]
    }
  ]

  const handleMenuClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Customer Profile Header */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.name || user.user_metadata?.display_name || user.email?.split('@')[0] || '사용자'}님
              </h1>
              <p className="text-gray-600 flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2" />
                {profile?.email || user.email}
              </p>
              {profile?.phone && (
                <p className="text-gray-600 flex items-center mt-1">
                  <Phone className="w-4 h-4 mr-2" />
                  {profile.phone}
                </p>
              )}
              <div className="flex items-center mt-3 space-x-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  고객 회원
                </Badge>
                <span className="text-sm text-gray-500">
                  <Clock className="w-4 h-4 inline mr-1" />
                  가입일: {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push('/profile/settings')}>
            <Edit3 className="w-4 h-4 mr-2" />
            프로필 편집
          </Button>
        </div>
      </Card>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{profileStats.activeRequests}</div>
          <div className="text-sm text-gray-600">진행 중인 요청</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{profileStats.completedRequests}</div>
          <div className="text-sm text-gray-600">완료된 서비스</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{profileStats.totalReviews}</div>
          <div className="text-sm text-gray-600">작성한 리뷰</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{profileStats.favoriteExperts}</div>
          <div className="text-sm text-gray-600">관심 전문가</div>
        </Card>
      </div>

      {/* Customer Menu Sections */}
      <div className="space-y-6">
        {customerMenuItems.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={item.id}
                    onClick={() => handleMenuClick(item.href)}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions for Customers */}
      <Card className="p-6 mt-8 bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 실행</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => router.push('/search')}
            className="h-12 bg-green-600 hover:bg-green-700"
          >
            <User className="w-5 h-5 mr-2" />
            전문가 찾기
          </Button>
          <Button
            onClick={() => router.push('/request')}
            variant="outline"
            className="h-12"
          >
            <Plus className="w-5 h-5 mr-2" />
            견적 요청하기
          </Button>
        </div>
      </Card>
    </div>
  )
}