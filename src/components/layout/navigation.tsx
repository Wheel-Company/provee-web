'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Home,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 브레드크럼 타입 정의
interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
  maxItems?: number
}

// 탭 네비게이션 타입 정의
interface TabItem {
  id: string
  label: string
  href?: string
  isActive?: boolean
  disabled?: boolean
  badge?: string | number
}

interface TabNavigationProps {
  items: TabItem[]
  onTabChange?: (tabId: string) => void
  className?: string
  variant?: 'default' | 'pills' | 'underline'
}

// 페이지네이션 타입 정의
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showPrevNext?: boolean
  siblingCount?: number
  className?: string
}

// 뒤로 가기 버튼 타입 정의
interface BackButtonProps {
  onClick?: () => void
  href?: string
  label?: string
  className?: string
  variant?: 'default' | 'ghost'
}

// 브레드크럼 컴포넌트
const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  className,
  maxItems = 5
}) => {
  // 아이템이 많을 경우 중간 부분을 생략
  const displayItems = items.length > maxItems
    ? [
        ...items.slice(0, 1),
        { label: '...', href: undefined },
        ...items.slice(-(maxItems - 2))
      ]
    : items

  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="p-1 h-auto text-gray-500 hover:text-blue-600"
      >
        <Home className="w-4 h-4" />
      </Button>

      {displayItems.map((item, index) => (
        <React.Fragment key={index}>
          <div className="text-gray-400">
            {separator}
          </div>

          {item.href && !item.isActive ? (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-gray-600 hover:text-blue-600 font-normal"
            >
              {item.label}
            </Button>
          ) : (
            <span
              className={cn(
                'px-1 py-1',
                item.isActive
                  ? 'text-blue-600 font-medium'
                  : item.label === '...'
                  ? 'text-gray-400'
                  : 'text-gray-700'
              )}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// 탭 네비게이션 컴포넌트
const TabNavigation: React.FC<TabNavigationProps> = ({
  items,
  onTabChange,
  className,
  variant = 'default'
}) => {
  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (disabled) return
    onTabChange?.(tabId)
  }

  const getVariantClasses = (variant: string, isActive: boolean, disabled?: boolean) => {
    const baseClasses = 'px-4 py-2 text-sm font-medium transition-colors duration-200'

    switch (variant) {
      case 'pills':
        return cn(
          baseClasses,
          'rounded-full',
          isActive
            ? 'bg-blue-600 text-white'
            : disabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        )

      case 'underline':
        return cn(
          baseClasses,
          'border-b-2 pb-3 mb-[-2px]',
          isActive
            ? 'border-blue-600 text-blue-600'
            : disabled
            ? 'border-transparent text-gray-400 cursor-not-allowed'
            : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-gray-300'
        )

      default:
        return cn(
          baseClasses,
          'rounded-lg',
          isActive
            ? 'bg-blue-50 text-blue-600'
            : disabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
        )
    }
  }

  return (
    <div className={cn('flex items-center', className)}>
      <div
        className={cn(
          'flex',
          variant === 'underline' ? 'border-b border-gray-200' : 'space-x-1'
        )}
      >
        {items.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={getVariantClasses(variant, !!item.isActive, item.disabled)}
            onClick={() => handleTabClick(item.id, item.disabled)}
            disabled={item.disabled}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  'ml-2 px-2 py-0.5 text-xs rounded-full',
                  item.isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                )}
              >
                {item.badge}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

// 페이지네이션 컴포넌트
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  siblingCount = 1,
  className
}) => {
  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const delta = siblingCount
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const pageNumbers = getPageNumbers()

  const PaginationButton: React.FC<{
    page: number | string
    isActive?: boolean
    disabled?: boolean
    onClick?: () => void
    children: React.ReactNode
  }> = ({ isActive, disabled, onClick, children }) => (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      className={cn(
        'w-10 h-10 p-0',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  )

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      {showFirstLast && (
        <PaginationButton
          page="first"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          처음
        </PaginationButton>
      )}

      {showPrevNext && (
        <PaginationButton
          page="prev"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </PaginationButton>
      )}

      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-gray-500">
              <MoreHorizontal className="w-4 h-4" />
            </span>
          ) : (
            <PaginationButton
              page={page}
              isActive={currentPage === page}
              onClick={() => typeof page === 'number' && onPageChange(page)}
            >
              {page}
            </PaginationButton>
          )}
        </React.Fragment>
      ))}

      {showPrevNext && (
        <PaginationButton
          page="next"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </PaginationButton>
      )}

      {showFirstLast && (
        <PaginationButton
          page="last"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          마지막
        </PaginationButton>
      )}
    </div>
  )
}

// 뒤로 가기 버튼 컴포넌트
const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  href,
  label = '뒤로 가기',
  className,
  variant = 'ghost'
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      // 라우터를 사용한 네비게이션 (실제 프로젝트에서는 Next.js router 등을 사용)
      console.log('Navigate to:', href)
    } else {
      // 브라우저의 뒤로 가기
      window.history.back()
    }
  }

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleClick}
      className={cn('flex items-center space-x-2', className)}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  )
}

// 페이지 헤더 컴포넌트 (브레드크럼 + 뒤로 가기 버튼 조합)
interface PageHeaderProps {
  title: string
  breadcrumbItems?: BreadcrumbItem[]
  showBackButton?: boolean
  backButtonProps?: Omit<BackButtonProps, 'className'>
  className?: string
  children?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbItems,
  showBackButton = false,
  backButtonProps,
  className,
  children
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* 브레드크럼 또는 뒤로 가기 버튼 */}
      {(breadcrumbItems || showBackButton) && (
        <div className="flex items-center justify-between">
          {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
          {showBackButton && <BackButton {...backButtonProps} />}
        </div>
      )}

      {/* 제목과 추가 액션들 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {children}
      </div>

      <Separator />
    </div>
  )
}

export {
  Breadcrumb,
  TabNavigation,
  Pagination,
  BackButton,
  PageHeader,
  type BreadcrumbItem,
  type TabItem,
  type PaginationProps,
  type BackButtonProps,
  type PageHeaderProps
}