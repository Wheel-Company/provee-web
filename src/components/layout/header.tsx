'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TrustIndicator } from '@/components/features/trust-indicator'
import {
  Search,
  Bell,
  Menu,
  User,
  LogOut,
  Settings,
  Shield,
  ChevronDown
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { User as UserType } from '@/types'

interface HeaderProps {
  user?: UserType | null
  onMenuToggle?: () => void
  variant?: 'default' | 'simple'
}

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

const ProveeLogoIcon: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-md`}
      >
        <span className="text-white font-bold text-sm">P</span>
      </div>
      {showText && (
        <span className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>
          Provee
        </span>
      )}
    </div>
  )
}

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex-1 max-w-2xl mx-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="어떤 서비스가 필요하세요?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

const UserMenu: React.FC<{ user: UserType }> = ({ user }) => {
  const [notificationCount] = useState(3)

  return (
    <div className="flex items-center space-x-4">
      {/* 알림 */}
      <Button variant="ghost" size="sm" className="relative p-2">
        <Bell className="w-5 h-5" />
        {notificationCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs p-0"
          >
            {notificationCount}
          </Badge>
        )}
      </Button>

      {/* 신뢰도 표시 */}
      <div className="hidden md:block">
        <TrustIndicator
          depositStatus="paid"
          verificationLevel={user.role === 'provider' ? 'business' : 'identity'}
          platformRating={4.8}
          successRate={0.85}
          variant="compact"
        />
      </div>

      {/* 역할 배지 */}
      <Badge variant={user.role === 'provider' ? 'default' : 'secondary'}>
        {user.role === 'provider' ? '전문가' : '고객'}
      </Badge>

      {/* 프로필 드롭다운 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 p-1">
            <Avatar
              src={user.avatar}
              alt={user.name}
              size="sm"
              fallback={user.name.charAt(0)}
            />
            <span className="hidden md:block text-sm font-medium">
              {user.name}
            </span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <User className="w-4 h-4 mr-2" />
            프로필
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Shield className="w-4 h-4 mr-2" />
            신뢰 관리
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            설정
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const GuestActions: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <Button variant="ghost" size="sm">
        로그인
      </Button>
      <Button size="sm">회원가입</Button>
    </div>
  )
}

const Navigation: React.FC<{ userRole?: 'customer' | 'provider' }> = ({ userRole }) => {
  return (
    <nav className="hidden lg:flex items-center space-x-8">
      <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
        서비스 찾기
      </Button>
      {userRole === 'customer' && (
        <>
          <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
            내 요청서
          </Button>
          <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
            매칭 현황
          </Button>
        </>
      )}
      {userRole === 'provider' && (
        <>
          <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
            요청서 관리
          </Button>
          <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
            매칭 관리
          </Button>
        </>
      )}
    </nav>
  )
}

const SimpleHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <ProveeLogoIcon size="md" showText />
        </div>
      </div>
    </header>
  )
}

const Header: React.FC<HeaderProps> = ({
  user,
  onMenuToggle,
  variant = 'default'
}) => {
  if (variant === 'simple') {
    return <SimpleHeader />
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 왼쪽: 메뉴 버튼 + 로고 + 네비게이션 */}
          <div className="flex items-center">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2"
                onClick={onMenuToggle}
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}

            <ProveeLogoIcon size="md" showText />

            <div className="ml-8">
              <Navigation userRole={user?.role} />
            </div>
          </div>

          {/* 가운데: 검색바 */}
          <SearchBar />

          {/* 오른쪽: 사용자 정보 또는 로그인 버튼 */}
          <div className="flex items-center">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <GuestActions />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export { Header, SimpleHeader, ProveeLogoIcon }