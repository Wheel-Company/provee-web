'use client'

import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react'
import { Header, SimpleHeader } from './header'
import { Footer, SimpleFooter } from './footer'
import { Sidebar, MobileSidebar } from './sidebar'
import { PageHeader, type BreadcrumbItem } from './navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User } from '@/types'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  RefreshCw,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react'

// 레이아웃 타입 정의
interface LayoutConfig {
  showHeader?: boolean
  showFooter?: boolean
  showSidebar?: boolean
  headerVariant?: 'default' | 'simple'
  footerVariant?: 'default' | 'simple'
  sidebarCollapsible?: boolean
  fullWidth?: boolean
  backgroundColor?: string
}

interface LayoutWrapperProps {
  children: ReactNode
  user?: User | null
  title?: string
  breadcrumbItems?: BreadcrumbItem[]
  showPageHeader?: boolean
  backButtonProps?: any
  layout?: LayoutConfig
  loading?: boolean
  error?: Error | null
  className?: string
  currentPath?: string
}

// 에러 바운더리 컴포넌트
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Layout Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

// 기본 에러 폴백 컴포넌트
const DefaultErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">문제가 발생했습니다</h1>
          <p className="text-gray-600">
            페이지를 로드하는 중 오류가 발생했습니다.
          </p>
        </div>

        {error && (
          <Alert className="text-left">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription className="text-sm text-gray-700">
              {error.message || '알 수 없는 오류가 발생했습니다.'}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Button onClick={handleReload} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            페이지 새로고침
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="w-full"
          >
            이전 페이지로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}

// 로딩 컴포넌트
const LoadingOverlay: React.FC<{ message?: string }> = ({
  message = '로딩 중...'
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">{message}</p>
          <Progress value={undefined} className="w-48" />
        </div>
      </div>
    </div>
  )
}

// 네트워크 상태 컴포넌트
const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineAlert(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineAlert(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showOfflineAlert) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Alert className="rounded-none border-l-0 border-r-0 border-t-0 bg-orange-50 border-orange-200">
        <WifiOff className="w-4 h-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          인터넷 연결이 끊어졌습니다. 연결을 확인해 주세요.
        </AlertDescription>
      </Alert>
    </div>
  )
}

// 메인 레이아웃 래퍼 컴포넌트
const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  children,
  user,
  title,
  breadcrumbItems,
  showPageHeader = false,
  backButtonProps,
  layout = {},
  loading = false,
  error = null,
  className,
  currentPath = '/'
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // 기본 레이아웃 설정
  const defaultLayout: LayoutConfig = {
    showHeader: true,
    showFooter: true,
    showSidebar: !!user,
    headerVariant: 'default',
    footerVariant: 'default',
    sidebarCollapsible: true,
    fullWidth: false,
    backgroundColor: 'bg-gray-50'
  }

  const finalLayout = { ...defaultLayout, ...layout }

  // 사이드바 토글 핸들러
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  // 에러가 있으면 에러 화면 표시
  if (error) {
    return <DefaultErrorFallback error={error} />
  }

  return (
    <ErrorBoundary>
      <div className={cn('min-h-screen flex flex-col', finalLayout.backgroundColor)}>
        {/* 네트워크 상태 알림 */}
        <NetworkStatus />

        {/* 로딩 오버레이 */}
        {loading && <LoadingOverlay />}

        {/* 헤더 */}
        {finalLayout.showHeader && (
          <>
            {finalLayout.headerVariant === 'simple' ? (
              <SimpleHeader />
            ) : (
              <Header
                onMenuToggle={handleMobileSidebarToggle}
                variant={finalLayout.headerVariant}
              />
            )}
          </>
        )}

        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-1">
          {/* 데스크톱 사이드바 */}
          {finalLayout.showSidebar && user && (
            <div className="hidden lg:block">
              <Sidebar
                user={user}
                currentPath={currentPath}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={
                  finalLayout.sidebarCollapsible ? handleSidebarToggle : undefined
                }
                variant="desktop"
              />
            </div>
          )}

          {/* 모바일 사이드바 */}
          {finalLayout.showSidebar && user && isMobileSidebarOpen && (
            <MobileSidebar
              user={user}
              currentPath={currentPath}
              onClose={() => setIsMobileSidebarOpen(false)}
              variant="mobile"
            />
          )}

          {/* 메인 콘텐츠 */}
          <main
            className={cn(
              'flex-1 flex flex-col',
              finalLayout.showSidebar && user
                ? isSidebarCollapsed
                  ? 'lg:ml-0'
                  : 'lg:ml-0'
                : '',
              className
            )}
          >
            {/* 페이지 헤더 */}
            {showPageHeader && title && (
              <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
                <div
                  className={cn(
                    'mx-auto',
                    finalLayout.fullWidth ? 'max-w-none' : 'max-w-7xl'
                  )}
                >
                  <PageHeader
                    title={title}
                    breadcrumbItems={breadcrumbItems}
                    backButtonProps={backButtonProps}
                  />
                </div>
              </div>
            )}

            {/* 콘텐츠 영역 */}
            <div className="flex-1">
              <div
                className={cn(
                  'h-full',
                  finalLayout.fullWidth
                    ? 'px-0'
                    : 'px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full'
                )}
              >
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* 푸터 */}
        {finalLayout.showFooter && (
          <>
            {finalLayout.footerVariant === 'simple' ? (
              <SimpleFooter />
            ) : (
              <Footer variant={finalLayout.footerVariant} />
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  )
}

// 특별한 레이아웃 변형들
const AuthLayout: React.FC<{ children: ReactNode; title?: string }> = ({
  children,
  title
}) => {
  return (
    <LayoutWrapper
      layout={{
        showSidebar: false,
        headerVariant: 'simple',
        footerVariant: 'simple',
        backgroundColor: 'bg-gray-50'
      }}
      title={title}
    >
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </LayoutWrapper>
  )
}

const DashboardLayout: React.FC<{
  children: ReactNode
  user: User
  title?: string
  breadcrumbItems?: BreadcrumbItem[]
}> = ({ children, user, title, breadcrumbItems }) => {
  return (
    <LayoutWrapper
      user={user}
      title={title}
      breadcrumbItems={breadcrumbItems}
      showPageHeader={!!title}
      layout={{
        showSidebar: true,
        sidebarCollapsible: true,
        backgroundColor: 'bg-gray-50'
      }}
    >
      {children}
    </LayoutWrapper>
  )
}

const LandingLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <LayoutWrapper
      layout={{
        showSidebar: false,
        fullWidth: true,
        backgroundColor: 'bg-white'
      }}
    >
      {children}
    </LayoutWrapper>
  )
}

export {
  LayoutWrapper,
  AuthLayout,
  DashboardLayout,
  LandingLayout,
  ErrorBoundary,
  type LayoutConfig,
  type LayoutWrapperProps
}