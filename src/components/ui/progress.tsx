import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "korean-text relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-slate-900 transition-all dark:bg-slate-50"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// Provee 특화 프로그레스 컴포넌트들

// 매칭률 프로그레스
interface MatchingProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const MatchingProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  MatchingProgressProps
>(({ className, value, showLabel = true, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  }

  const getMatchingColor = (value: number) => {
    if (value >= 80) return 'bg-provee-green'
    if (value >= 60) return 'bg-yellow-500'
    if (value >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getMatchingLabel = (value: number) => {
    if (value >= 80) return '매우 높음'
    if (value >= 60) return '높음'
    if (value >= 40) return '보통'
    return '낮음'
  }

  return (
    <div className="korean-text w-full space-y-2">
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600 dark:text-slate-400">매칭률</span>
          <span className="font-medium">
            {value}% ({getMatchingLabel(value)})
          </span>
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-in-out",
            getMatchingColor(value)
          )}
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
})
MatchingProgress.displayName = "MatchingProgress"

// 단계별 프로그레스 (서비스 진행 상황)
interface StepProgressProps {
  currentStep: number
  totalSteps: number
  steps?: string[]
  className?: string
}

const StepProgress = React.forwardRef<
  HTMLDivElement,
  StepProgressProps
>(({ currentStep, totalSteps, steps, className, ...props }, ref) => {
  const progress = (currentStep / totalSteps) * 100

  const defaultSteps = Array.from({ length: totalSteps }, (_, i) => `단계 ${i + 1}`)
  const stepLabels = steps || defaultSteps

  return (
    <div ref={ref} className={cn("korean-text w-full space-y-4", className)} {...props}>
      {/* 프로그레스 바 */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            진행 상황
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {currentStep}/{totalSteps}
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2"
        />
      </div>

      {/* 단계 표시 */}
      <div className="flex justify-between">
        {stepLabels.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber <= currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                isCompleted
                  ? "bg-provee-blue text-white"
                  : isCurrent
                  ? "bg-provee-blue/20 text-provee-blue border-2 border-provee-blue"
                  : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
              )}>
                {isCompleted ? "✓" : stepNumber}
              </div>
              <span className={cn(
                "text-xs text-center max-w-[80px] leading-tight",
                isCurrent
                  ? "text-provee-blue font-medium"
                  : isCompleted
                  ? "text-slate-700 dark:text-slate-300"
                  : "text-slate-500 dark:text-slate-400"
              )}>
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
StepProgress.displayName = "StepProgress"

// 원형 프로그레스 (매칭률 표시용)
interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  showValue?: boolean
  className?: string
}

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(({ value, size = 100, strokeWidth = 8, showValue = true, className }, ref) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  const getColor = (value: number) => {
    if (value >= 80) return '#10B981' // provee-green
    if (value >= 60) return '#F59E0B' // yellow
    if (value >= 40) return '#F97316' // orange
    return '#EF4444' // red
  }

  return (
    <div
      ref={ref}
      className={cn("korean-text relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700"
        />
        {/* 진행 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>

      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {value}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              매칭률
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
CircularProgress.displayName = "CircularProgress"

// 멀티 프로그레스 (여러 항목 동시 표시)
interface MultiProgressItem {
  label: string
  value: number
  color: string
}

interface MultiProgressProps {
  items: MultiProgressItem[]
  className?: string
}

const MultiProgress = React.forwardRef<
  HTMLDivElement,
  MultiProgressProps
>(({ items, className }, ref) => {
  const total = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <div ref={ref} className={cn("korean-text w-full space-y-3", className)}>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        {items.map((item, index) => (
          <div
            key={index}
            className="transition-all duration-500 ease-in-out"
            style={{
              width: `${(item.value / total) * 100}%`,
              backgroundColor: item.color,
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-600 dark:text-slate-400 truncate">
              {item.label}
            </span>
            <span className="font-medium">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})
MultiProgress.displayName = "MultiProgress"

export {
  Progress,
  MatchingProgress,
  StepProgress,
  CircularProgress,
  MultiProgress
}