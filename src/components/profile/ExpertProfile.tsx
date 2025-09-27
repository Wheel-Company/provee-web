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
  MessageSquare,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Star,
  Clock,
  Users,
  TrendingUp,
  Award,
  Briefcase,
  Target,
  DollarSign,
  BarChart3,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Edit3
} from 'lucide-react'

interface ExpertProfileProps {
  user: any
  profile: any
  profileStats: any
}

export default function ExpertProfile({ user, profile, profileStats }: ExpertProfileProps) {
  const router = useRouter()

  const expertMenuItems = [
    {
      title: '전문가 관리',
      items: [
        {
          id: 'expert-manage',
          icon: Settings,
          title: '전문가 정보 관리',
          description: '프로필, 포트폴리오, 자격증 등을 관리하세요',
          href: '/expert/manage'
        },
        {
          id: 'expert-requests',
          icon: FileText,
          title: '요청서 관리',
          description: '받은 견적 요청을 확인하고 관리하세요',
          badge: profileStats.activeRequests.toString(),
          href: '/expert/requests'
        },
        {
          id: 'expert-matching',
          icon: Users,
          title: '매칭 관리',
          description: '고객과의 매칭 현황을 확인하세요',
          href: '/expert/matching'
        },
        {
          id: 'portfolio',
          icon: Briefcase,
          title: '포트폴리오 관리',
          description: '작업 사례와 포트폴리오를 관리하세요',
          href: '/expert/portfolio'
        }
      ]
    },
    {
      title: '비즈니스 현황',
      items: [
        {
          id: 'analytics',
          icon: BarChart3,
          title: '성과 분석',
          description: '매칭률, 응답률, 완료율 등을 분석하세요',
          href: '/expert/analytics'
        },
        {
          id: 'calendar',
          icon: Calendar,
          title: '일정 관리',
          description: '프로젝트 일정과 스케줄을 관리하세요',
          href: '/expert/calendar'
        },
        {
          id: 'chat',
          icon: MessageSquare,
          title: '고객 채팅',
          description: '고객과의 대화 내역 및 상담',
          href: '/expert/chat'
        }
      ]
    },
    {
      title: '수익 관리',
      items: [
        {
          id: 'earnings',
          icon: CreditCard,
          title: '수익 내역',
          description: '총 수익 및 정산 내역을 확인하세요',
          href: '/expert/earnings'
        },
        {
          id: 'reviews-received',
          icon: Star,
          title: '받은 리뷰',
          description: '고객들이 작성한 리뷰를 확인하세요',
          badge: profileStats.totalReviews.toString(),
          href: '/expert/reviews'
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
          title: '전문가 지원센터',
          description: '전문가 가이드 및 문의하기',
          href: '/expert/help'
        }
      ]
    }
  ]

  const handleMenuClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Expert Profile Header */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile?.name || user.user_metadata?.display_name || user.email?.split('@')[0] || '사용자'}
              </h1>
              <p className="text-lg text-blue-600 font-medium mt-1">전문가</p>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-gray-600 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {profile?.email || user.email}
                </p>
                {profile?.phone && (
                  <p className="text-gray-600 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {profile.phone}
                  </p>
                )}
              </div>
              <div className="flex items-center mt-3 space-x-4">
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  전문가 회원
                </Badge>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">4.8</span>
                  <span className="text-sm text-gray-500">평점</span>
                </div>
                <span className="text-sm text-gray-500">
                  <Clock className="w-4 h-4 inline mr-1" />
                  전문가 등록일: {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" onClick={() => router.push('/expert/manage')}>
              <Edit3 className="w-4 h-4 mr-2" />
              프로필 편집
            </Button>
            <Button onClick={() => router.push('/expert/analytics')} className="bg-blue-600 hover:bg-blue-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              성과 보기
            </Button>
          </div>
        </div>
      </Card>

      {/* Expert Performance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-2xl font-bold text-blue-600">{profileStats.activeRequests}</div>
          <div className="text-sm text-gray-600">진행 중인 프로젝트</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-2xl font-bold text-green-600">{profileStats.completedRequests}</div>
          <div className="text-sm text-gray-600">완료한 프로젝트</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="text-2xl font-bold text-yellow-600">₩{(profileStats.totalEarnings || 0).toLocaleString()}</div>
          <div className="text-sm text-gray-600">총 수익</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-2xl font-bold text-purple-600">4.8</div>
          <div className="text-sm text-gray-600">평균 평점</div>
        </Card>
      </div>

      {/* Monthly Performance Chart */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          이번 달 성과
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
            <div className="text-sm text-gray-600">새로운 견적 요청</div>
            <div className="text-xs text-green-600 mt-1">↑ 전월 대비 +25%</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">8</div>
            <div className="text-sm text-gray-600">매칭 성공</div>
            <div className="text-xs text-green-600 mt-1">↑ 전월 대비 +12%</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-sm text-gray-600">응답률</div>
            <div className="text-xs text-blue-600 mt-1">목표 달성!</div>
          </div>
        </div>
      </Card>

      {/* Expert Menu Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {expertMenuItems.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={item.id}
                    onClick={() => handleMenuClick(item.href)}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions for Experts */}
      <Card className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 실행</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => router.push('/expert/requests')}
            className="h-12 bg-blue-600 hover:bg-blue-700"
          >
            <Target className="w-5 h-5 mr-2" />
            새 요청 확인
          </Button>
          <Button
            onClick={() => router.push('/expert/manage')}
            variant="outline"
            className="h-12"
          >
            <Edit3 className="w-5 h-5 mr-2" />
            프로필 업데이트
          </Button>
          <Button
            onClick={() => router.push('/expert/earnings')}
            variant="outline"
            className="h-12"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            수익 확인
          </Button>
        </div>
      </Card>
    </div>
  )
}