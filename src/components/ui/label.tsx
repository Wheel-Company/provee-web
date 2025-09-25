import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

const labelVariants = cva(
  "korean-text text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

// Provee 특화 라벨 컴포넌트들

// 필수 입력 라벨 (빨간 별표 포함)
interface RequiredLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  required?: boolean
}

const RequiredLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  RequiredLabelProps
>(({ children, required = false, className, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn("korean-text flex items-center gap-1", className)}
    {...props}
  >
    {children}
    {required && (
      <span className="text-red-500 text-sm" aria-label="필수 입력">
        *
      </span>
    )}
  </Label>
))
RequiredLabel.displayName = "RequiredLabel"

// 도움말 포함 라벨
interface HelpLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  helpText?: string
  required?: boolean
}

const HelpLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  HelpLabelProps
>(({ children, helpText, required = false, className, ...props }, ref) => (
  <div className="korean-text space-y-1">
    <Label
      ref={ref}
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {children}
      {required && (
        <span className="text-red-500 text-sm" aria-label="필수 입력">
          *
        </span>
      )}
    </Label>
    {helpText && (
      <p className="korean-text text-xs text-slate-500 dark:text-slate-400">
        {helpText}
      </p>
    )}
  </div>
))
HelpLabel.displayName = "HelpLabel"

// 폼 라벨 (에러 표시 포함)
interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  required?: boolean
  error?: string
  helpText?: string
}

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  FormLabelProps
>(({ children, required = false, error, helpText, className, ...props }, ref) => (
  <div className="korean-text space-y-1">
    <Label
      ref={ref}
      className={cn(
        "flex items-center gap-1",
        error && "text-red-600 dark:text-red-400",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-red-500 text-sm" aria-label="필수 입력">
          *
        </span>
      )}
    </Label>

    {helpText && !error && (
      <p className="korean-text text-xs text-slate-500 dark:text-slate-400">
        {helpText}
      </p>
    )}

    {error && (
      <p className="korean-text text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {error}
      </p>
    )}
  </div>
))
FormLabel.displayName = "FormLabel"

// 카테고리 라벨 (Provee 서비스 카테고리용)
interface CategoryLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'gray'
}

const CategoryLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  CategoryLabelProps
>(({ children, icon, color = 'blue', className, ...props }, ref) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    green: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
    orange: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
    gray: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800',
  }

  return (
    <Label
      ref={ref}
      className={cn(
        "korean-text inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium",
        colorClasses[color],
        className
      )}
      {...props}
    >
      {icon && (
        <span className="text-sm">
          {icon}
        </span>
      )}
      {children}
    </Label>
  )
})
CategoryLabel.displayName = "CategoryLabel"

// 상태 라벨 (서비스 상태 표시용)
interface StatusLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  status: 'active' | 'pending' | 'inactive' | 'completed'
}

const StatusLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  StatusLabelProps
>(({ children, status, className, ...props }, ref) => {
  const statusConfig = {
    active: {
      className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      text: '진행 중'
    },
    pending: {
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
      text: '대기 중'
    },
    inactive: {
      className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800',
      text: '중단됨'
    },
    completed: {
      className: 'bg-provee-green/10 text-provee-green border-provee-green/20 dark:bg-provee-green/20 dark:text-provee-green dark:border-provee-green/30',
      text: '완료됨'
    }
  }

  const config = statusConfig[status]

  return (
    <Label
      ref={ref}
      className={cn(
        "korean-text inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium",
        config.className,
        className
      )}
      {...props}
    >
      {children || config.text}
    </Label>
  )
})
StatusLabel.displayName = "StatusLabel"

export {
  Label,
  labelVariants,
  RequiredLabel,
  HelpLabel,
  FormLabel,
  CategoryLabel,
  StatusLabel
}