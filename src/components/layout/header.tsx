'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Bell,
  Menu,
  User,
  LogOut,
  Settings,
  Shield,
  ChevronDown,
  RefreshCw,
  UserPlus
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useUser } from '@/hooks/useUser'

interface HeaderProps {
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

const UserMenu: React.FC = () => {
  const { profile, signOut, switchRole, becomeExpert } = useUser()
  const router = useRouter()
  const [notificationCount] = useState(3)
  const [isRoleSwitching, setIsRoleSwitching] = useState(false)

  if (!profile) return null

  // 디버깅을 위한 로그
  console.log('UserMenu render - profile:', profile)
  console.log('UserMenu - user_type:', profile?.user_type)
  console.log('UserMenu - is_expert:', profile?.is_expert)
  console.log('UserMenu - available_roles:', profile?.available_roles)

  const handleRoleSwitch = async (newRole: 'customer' | 'expert') => {
    setIsRoleSwitching(true)
    try {
      const result = await switchRole(newRole)
      if (!result.success && result.error === 'Expert registration required') {
        // 전문가 가입 플로우로 리다이렉트됨
        return
      }
      if (!result.success) {
        alert(`역할 전환 중 오류가 발생했습니다: ${result.error}`)
      } else {
        // 역할 전환 성공 시 헤더 메뉴 업데이트를 위해 새로고침
        console.log('Role switched successfully, reloading page...')
        setTimeout(() => {
          window.location.reload()
        }, 500) // 약간의 딜레이 후 새로고침
      }
    } catch (error) {
      console.error('Role switch error:', error)
      alert('역할 전환 중 오류가 발생했습니다.')
    } finally {
      setIsRoleSwitching(false)
    }
  }

  const handleBecomeExpert = async () => {
    setIsRoleSwitching(true)
    try {
      const result = await becomeExpert()
      if (result.success) {
        alert('전문가 등록이 완료되었습니다!')
      } else {
        alert(`전문가 등록 중 오류가 발생했습니다: ${result.error}`)
      }
    } catch (error) {
      console.error('Become expert error:', error)
      alert('전문가 등록 중 오류가 발생했습니다.')
    } finally {
      setIsRoleSwitching(false)
    }
  }

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

      {/* 역할 배지 */}
      <Badge variant={profile.active_role === 'expert' ? 'default' : 'secondary'}>
        {profile.active_role === 'expert' ? '전문가' : '고객'}
      </Badge>

      {/* 프로필 드롭다운 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 p-1">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{profile.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-sm font-medium">
              {profile.name || profile.username}
            </span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <Link href="/profile">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              프로필
            </DropdownMenuItem>
          </Link>
          <Link href="/profile/settings">
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              설정
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          {/* 역할 전환 섹션 */}
          <div className="px-2 py-1.5">
            <p className="text-xs font-medium text-gray-500 mb-2">역할 전환</p>

            {/* 사용 가능한 역할 표시 */}
            {profile.available_roles && profile.available_roles.length > 1 && (
              <div className="mb-2">
                <p className="text-xs text-gray-400">사용 가능한 역할:</p>
                <div className="flex gap-1 mt-1">
                  {profile.available_roles.map((role) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className="text-xs"
                    >
                      {role === 'expert' ? '전문가' : '고객'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 고객으로 전환 - expert 등록된 사용자가 현재 expert 역할인 경우 */}
            {profile.is_expert && profile.active_role === 'expert' && (
              <DropdownMenuItem
                onClick={() => handleRoleSwitch('customer')}
                disabled={isRoleSwitching}
                className="text-sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRoleSwitching ? 'animate-spin' : ''}`} />
                고객으로 전환
              </DropdownMenuItem>
            )}

            {/* 전문가로 전환 - expert 등록된 사용자가 현재 customer 역할인 경우 */}
            {profile.is_expert && profile.active_role === 'customer' && (
              <DropdownMenuItem
                onClick={() => handleRoleSwitch('expert')}
                disabled={isRoleSwitching}
                className="text-sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRoleSwitching ? 'animate-spin' : ''}`} />
                전문가로 전환
              </DropdownMenuItem>
            )}

            {/* 전문가 등록하기 (전문가 역할이 없는 경우만) */}
            {!profile.is_expert && (
              <Link href="/expert/join/onboarding">
                <DropdownMenuItem
                  className="text-sm text-blue-600"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  전문가 등록하기
                </DropdownMenuItem>
              </Link>
            )}
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
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
      <Link href="/expert/join">
        <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
          전문가 등록
        </Button>
      </Link>
      <Link href="/auth/login">
        <Button variant="ghost" size="sm">
          로그인
        </Button>
      </Link>
      <Link href="/auth/register">
        <Button size="sm">회원가입</Button>
      </Link>
    </div>
  )
}

const Navigation: React.FC = () => {
  const { profile } = useUser()
  const userRole = profile?.active_role || profile?.user_type
  return (
    <nav className="hidden lg:flex items-center space-x-8">
      <Link href="/search">
        <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
          서비스 찾기
        </Button>
      </Link>
      {userRole === 'customer' && (
        <>
          <Link href="/request">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              서비스 요청
            </Button>
          </Link>
          <Link href="/matching">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              제안 현황
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              내 정보
            </Button>
          </Link>
        </>
      )}
      {userRole === 'expert' && (
        <>
          <Link href="/expert">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              요청서 보기
            </Button>
          </Link>
          <Link href="/expert/matching">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              내 제안
            </Button>
          </Link>
          <Link href="/expert/manage">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              프로필 관리
            </Button>
          </Link>
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
  onMenuToggle,
  variant = 'default'
}) => {
  const { user, profile, loading } = useUser()

  if (variant === 'simple') {
    return <SimpleHeader />
  }

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <ProveeLogoIcon size="md" showText />
            <div className="animate-pulse">로딩 중...</div>
          </div>
        </div>
      </header>
    )
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

            <Link href="/">
              <ProveeLogoIcon size="md" showText />
            </Link>

            <div className="ml-8">
              <Navigation />
            </div>
          </div>

          {/* 가운데: 검색바 */}
          <SearchBar />

          {/* 오른쪽: 사용자 정보 또는 로그인 버튼 */}
          <div className="flex items-center">
            {user ? (
              <UserMenu />
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