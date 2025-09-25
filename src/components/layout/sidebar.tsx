'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ProveeLogoIcon } from './header'
import {
  Home,
  Search,
  FileText,
  Users,
  MessageSquare,
  CreditCard,
  Shield,
  Bell,
  Settings,
  HelpCircle,
  BarChart3,
  UserCheck,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Crown,
  Zap
} from 'lucide-react'
import { User } from '@/types'
import { cn } from '@/lib/utils'

interface SidebarProps {
  user: User
  currentPath?: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
  variant?: 'desktop' | 'mobile'
  onClose?: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  href: string
  badge?: string | number
  isNew?: boolean
  roles?: ('customer' | 'provider')[]
}

const customerMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    icon: Home,
    href: '/dashboard',
    roles: ['customer']
  },
  {
    id: 'find-services',
    label: '서비스 찾기',
    icon: Search,
    href: '/services',
    roles: ['customer']
  },
  {
    id: 'my-requests',
    label: '내 요청서',
    icon: FileText,
    href: '/requests',
    badge: 3,
    roles: ['customer']
  },
  {
    id: 'matching-status',
    label: '매칭 현황',
    icon: Users,
    href: '/matching',
    badge: 'NEW',
    isNew: true,
    roles: ['customer']
  },
  {
    id: 'messages',
    label: '메시지',
    icon: MessageSquare,
    href: '/messages',
    badge: 2,
    roles: ['customer']
  },
  {
    id: 'payments',
    label: '결제 관리',
    icon: CreditCard,
    href: '/payments',
    roles: ['customer']
  }
]

const providerMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    icon: Home,
    href: '/provider/dashboard',
    roles: ['provider']
  },
  {
    id: 'request-management',
    label: '요청서 관리',
    icon: FileText,
    href: '/provider/requests',
    badge: 5,
    roles: ['provider']
  },
  {
    id: 'matching-management',
    label: '매칭 관리',
    icon: Users,
    href: '/provider/matching',
    badge: 2,
    roles: ['provider']
  },
  {
    id: 'profile-management',
    label: '프로필 관리',
    icon: UserCheck,
    href: '/provider/profile',
    roles: ['provider']
  },
  {
    id: 'schedule',
    label: '일정 관리',
    icon: Calendar,
    href: '/provider/schedule',
    roles: ['provider']
  },
  {
    id: 'performance',
    label: '성과 분석',
    icon: BarChart3,
    href: '/provider/analytics',
    isNew: true,
    roles: ['provider']
  },
  {
    id: 'messages',
    label: '메시지',
    icon: MessageSquare,
    href: '/provider/messages',
    badge: 4,
    roles: ['provider']
  }
]

const commonMenuItems: MenuItem[] = [
  {
    id: 'trust-management',
    label: '신뢰 관리',
    icon: Shield,
    href: '/trust'
  },
  {
    id: 'notifications',
    label: '알림 설정',
    icon: Bell,
    href: '/notifications'
  },
  {
    id: 'settings',
    label: '설정',
    icon: Settings,
    href: '/settings'
  },
  {
    id: 'help',
    label: '도움말',
    icon: HelpCircle,
    href: '/help'
  }
]

const SubscriptionInfo: React.FC<{ user: User; isCollapsed: boolean }> = ({
  user,
  isCollapsed
}) => {
  const monthlyLimit = user.role === 'customer' ? 10 : 50
  const currentUsage = user.role === 'customer' ? 3 : 28
  const usagePercent = (currentUsage / monthlyLimit) * 100

  if (isCollapsed) {
    return (
      <div className="p-2">
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Crown className="w-4 h-4 text-white" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Crown className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-900">
            {user.role === 'customer' ? '고객' : '전문가'} 멤버십
          </span>
        </div>
        <Badge variant="default" className="text-xs">
          활성
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>이번 달 매칭</span>
          <span>{currentUsage}/{monthlyLimit}</span>
        </div>
        <Progress value={usagePercent} className="h-2" />
      </div>

      <div className="text-xs text-gray-500">
        다음 갱신: 2024년 10월 25일
      </div>
    </div>
  )
}

const SidebarMenuItem: React.FC<{
  item: MenuItem
  isActive: boolean
  isCollapsed: boolean
  onClick: () => void
}> = ({ item, isActive, isCollapsed, onClick }) => {
  const Icon = item.icon

  return (
    <Button
      variant={isActive ? 'default' : 'ghost'}
      className={cn(
        'w-full justify-start h-12 px-3',
        isCollapsed && 'px-2 justify-center',
        isActive && 'bg-blue-600 hover:bg-blue-700 text-white',
        !isActive && 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 w-full">
        <Icon className={cn('w-5 h-5', isCollapsed ? 'mx-auto' : 'flex-shrink-0')} />

        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>

            <div className="flex items-center space-x-1">
              {item.isNew && (
                <Badge variant="secondary" className="text-xs px-1.5">
                  NEW
                </Badge>
              )}
              {item.badge && typeof item.badge === 'number' && (
                <Badge variant="destructive" className="text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                  {item.badge}
                </Badge>
              )}
              {item.badge && typeof item.badge === 'string' && item.badge !== 'NEW' && (
                <Badge variant="default" className="text-xs px-1.5">
                  {item.badge}
                </Badge>
              )}
            </div>
          </>
        )}
      </div>

      {/* 축소된 상태에서 배지 표시 */}
      {isCollapsed && (item.badge || item.isNew) && (
        <div className="absolute top-1 right-1">
          {item.isNew && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
          {item.badge && typeof item.badge === 'number' && (
            <Badge variant="destructive" className="text-xs min-w-[16px] h-[16px] flex items-center justify-center p-0 text-[10px]">
              {item.badge}
            </Badge>
          )}
        </div>
      )}
    </Button>
  )
}

const DesktopSidebar: React.FC<SidebarProps> = ({
  user,
  currentPath = '/',
  isCollapsed = false,
  onToggleCollapse,
  className
}) => {
  const menuItems = user.role === 'customer' ? customerMenuItems : providerMenuItems
  const allMenuItems = [...menuItems, ...commonMenuItems]

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* 로고 및 토글 버튼 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && <ProveeLogoIcon size="sm" showText />}
          {isCollapsed && <ProveeLogoIcon size="sm" showText={false} />}

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-1 h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {allMenuItems.map((item) => (
          <SidebarMenuItem
            key={item.id}
            item={item}
            isActive={currentPath === item.href}
            isCollapsed={isCollapsed}
            onClick={() => {
              // 네비게이션 로직
              console.log('Navigate to:', item.href)
            }}
          />
        ))}

        {/* 구분선 */}
        <div className="py-2">
          <Separator />
        </div>
      </nav>

      {/* 하단 구독 정보 */}
      <div className="p-2 border-t border-gray-200">
        <SubscriptionInfo user={user} isCollapsed={isCollapsed} />
      </div>
    </aside>
  )
}

const MobileSidebar: React.FC<SidebarProps> = ({
  user,
  currentPath = '/',
  onClose,
  className
}) => {
  const menuItems = user.role === 'customer' ? customerMenuItems : providerMenuItems
  const allMenuItems = [...menuItems, ...commonMenuItems]

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* 사이드바 */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 flex flex-col lg:hidden',
          className
        )}
      >
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <ProveeLogoIcon size="md" showText />
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
          {allMenuItems.map((item) => (
            <SidebarMenuItem
              key={item.id}
              item={item}
              isActive={currentPath === item.href}
              isCollapsed={false}
              onClick={() => {
                // 네비게이션 로직
                console.log('Navigate to:', item.href)
                onClose?.()
              }}
            />
          ))}
        </nav>

        {/* 하단 구독 정보 */}
        <div className="p-4 border-t border-gray-200">
          <SubscriptionInfo user={user} isCollapsed={false} />
        </div>
      </aside>
    </>
  )
}

const Sidebar: React.FC<SidebarProps> = ({ variant = 'desktop', ...props }) => {
  if (variant === 'mobile') {
    return <MobileSidebar {...props} />
  }

  return <DesktopSidebar {...props} />
}

export { Sidebar, DesktopSidebar, MobileSidebar }