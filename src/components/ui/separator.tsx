import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "korean-text shrink-0 bg-slate-200 dark:bg-slate-800",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

// Provee 특화 구분선 컴포넌트들

// 텍스트가 포함된 구분선
interface TextSeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  children: React.ReactNode
}

const TextSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  TextSeparatorProps
>(({ children, className, ...props }, ref) => (
  <div className={cn("korean-text relative flex items-center", className)}>
    <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
    <span className="flex-shrink mx-4 text-slate-500 dark:text-slate-400 text-sm">
      {children}
    </span>
    <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
  </div>
))
TextSeparator.displayName = "TextSeparator"

// 아이콘이 포함된 구분선
interface IconSeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  icon: React.ReactNode
}

const IconSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  IconSeparatorProps
>(({ icon, className, ...props }, ref) => (
  <div className={cn("korean-text relative flex items-center", className)}>
    <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
    <div className="flex-shrink mx-4 p-1 bg-white dark:bg-slate-950 text-slate-400">
      {icon}
    </div>
    <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
  </div>
))
IconSeparator.displayName = "IconSeparator"

// 그라디언트 구분선 (Provee 브랜드)
const ProveeGradientSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "korean-text h-[1px] w-full bg-gradient-to-r from-transparent via-provee-blue to-transparent",
      className
    )}
    {...props}
  />
))
ProveeGradientSeparator.displayName = "ProveeGradientSeparator"

// 점선 구분선
interface DashedSeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  dashLength?: number
}

const DashedSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  DashedSeparatorProps
>(({ className, orientation = "horizontal", dashLength, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn(
      "korean-text shrink-0 border-slate-200 dark:border-slate-800",
      orientation === "horizontal"
        ? "h-0 w-full border-t border-dashed"
        : "h-full w-0 border-l border-dashed",
      className
    )}
    style={dashLength ? { borderStyle: `dashed` } : undefined}
    {...props}
  />
))
DashedSeparator.displayName = "DashedSeparator"

// 섹션 구분선 (카테고리별 구분)
interface SectionSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  color?: 'blue' | 'green' | 'gray'
}

const SectionSeparator = React.forwardRef<
  HTMLDivElement,
  SectionSeparatorProps
>(({ title, subtitle, color = 'blue', className, ...props }, ref) => {
  const colorClasses = {
    blue: 'border-provee-blue text-provee-blue',
    green: 'border-provee-green text-provee-green',
    gray: 'border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400',
  }

  return (
    <div
      ref={ref}
      className={cn("korean-text flex items-center py-4", className)}
      {...props}
    >
      <div className={cn("w-12 h-[2px]", colorClasses[color].split(' ')[0])} />
      <div className="mx-4 space-y-1">
        {title && (
          <h3 className={cn("text-lg font-semibold", colorClasses[color].split(' ')[1])}>
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      <div className={cn("flex-grow h-[1px]", colorClasses[color].split(' ')[0])} />
    </div>
  )
})
SectionSeparator.displayName = "SectionSeparator"

// 매칭 결과 구분선
const MatchingSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("korean-text relative flex items-center py-6", className)}
    {...props}
  >
    <div className="flex-grow h-[1px] bg-gradient-to-r from-transparent via-provee-blue/30 to-provee-green/30" />
    <div className="mx-6 px-4 py-2 bg-gradient-to-r from-provee-blue/10 to-provee-green/10 rounded-full border border-provee-blue/20">
      <span className="text-sm font-medium text-provee-blue flex items-center space-x-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>AI 매칭 결과</span>
      </span>
    </div>
    <div className="flex-grow h-[1px] bg-gradient-to-r from-provee-green/30 via-provee-blue/30 to-transparent" />
  </div>
))
MatchingSeparator.displayName = "MatchingSeparator"

// 시간대별 구분선 (대화 내역 등)
interface TimeSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date | string
}

const TimeSeparator = React.forwardRef<
  HTMLDivElement,
  TimeSeparatorProps
>(({ date, className, ...props }, ref) => {
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) {
      return '오늘'
    } else if (d.toDateString() === yesterday.toDateString()) {
      return '어제'
    } else {
      return d.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      })
    }
  }

  return (
    <div
      ref={ref}
      className={cn("korean-text relative flex items-center justify-center py-4", className)}
      {...props}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
      </div>
      <div className="relative bg-white dark:bg-slate-950 px-4 text-xs text-slate-500 dark:text-slate-400">
        {formatDate(date)}
      </div>
    </div>
  )
})
TimeSeparator.displayName = "TimeSeparator"

export {
  Separator,
  TextSeparator,
  IconSeparator,
  ProveeGradientSeparator,
  DashedSeparator,
  SectionSeparator,
  MatchingSeparator,
  TimeSeparator,
}