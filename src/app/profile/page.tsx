'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/hooks/useUser'
import {
  User,
  Settings,
  FileText,
  Heart,
  MessageSquare,
  Bell,
  HelpCircle,
  ChevronRight,
  Star,
  Clock,
  CreditCard,
  ShoppingBag,
  Users,
  Edit3
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading } = useUser()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const menuItems = [
    {
      title: '견적 관리',
      items: [
        {
          id: 'my-requests',
          icon: FileText,
          title: '내 견적 요청',
          description: '요청한 견적 내역을 확인하세요',
          badge: '3',
          href: '/profile/requests'
        },
        {
          id: 'favorites',
          icon: Heart,
          title: '관심 전문가',
          description: '찜한 전문가들을 관리하세요',
          href: '/profile/favorites'
        }
      ]
    },
    {
      title: '서비스 관리',
      items: [
        {
          id: 'reviews',
          icon: Star,
          title: '내 리뷰',
          description: '작성한 리뷰를 확인하고 관리하세요',
          href: '/profile/reviews'
        },
        {
          id: 'chat',
          icon: MessageSquare,
          title: '채팅 내역',
          description: '전문가와의 대화 내역',
          href: '/profile/chat'
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
          href: '/profile/payments'
        },
        {
          id: 'subscription',
          icon: ShoppingBag,
          title: '구독 관리',
          description: 'Provee 프리미엄 구독을 관리하세요',
          badge: 'NEW',
          href: '/profile/subscription'
        }
      ]
    },
    {
      title: '설정',
      items: [
        {
          id: 'notifications',
          icon: Bell,
          title: '알림 설정',
          description: '푸시 알림 및 이메일 설정',
          href: '/profile/notifications'
        },
        {
          id: 'account',
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.user_metadata?.display_name || user.email?.split('@')[0] || '사용자'}님
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    일반 회원
                  </Badge>
                  <span className="text-sm text-gray-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    가입일: {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => handleMenuClick('/profile/settings')}
              className="flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>계정설정</span>
            </Button>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
            <div className="text-sm text-gray-600">진행 중인 요청</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">12</div>
            <div className="text-sm text-gray-600">완료된 프로젝트</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">4.8</div>
            <div className="text-sm text-gray-600">평균 만족도</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">8</div>
            <div className="text-sm text-gray-600">관심 전문가</div>
          </Card>
        </div>

        {/* Menu Sections */}
        <div className="space-y-6">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {section.title}
              </h2>
              <Card className="divide-y divide-gray-200">
                {section.items.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleMenuClick(item.href)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">
                                {item.title}
                              </h3>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${
                                    item.badge === 'NEW'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  )
                })}
              </Card>
            </div>
          ))}
        </div>

        {/* Customer Support */}
        <Card className="mt-8 p-6 text-center bg-blue-50">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              도움이 필요하신가요?
            </h3>
            <p className="text-gray-600 mb-4">
              궁금한 점이 있으시면 언제든 문의해주세요.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div>고객센터: 1599-5319</div>
              <div>평일 09:00 - 18:00</div>
              <div>토요일 09:00 - 15:00 (일요일, 공휴일 휴무)</div>
            </div>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleMenuClick('/profile/help')}
            >
              고객센터 바로가기
            </Button>
          </div>
        </Card>

        {/* Expert Registration CTA */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  전문가로 활동해보세요
                </h3>
                <p className="text-gray-600 text-sm">
                  당신의 전문성을 나누고 수익을 올려보세요
                </p>
              </div>
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push('/expert/join')}
            >
              전문가 등록
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}