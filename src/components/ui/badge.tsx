import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "korean-text inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        destructive:
          "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80",
        outline: "text-slate-950 dark:text-slate-50",
        // Provee 특화 변형
        success:
          "border-transparent bg-provee-green text-white hover:bg-provee-green/80 shadow-sm",
        matching:
          "border-transparent bg-gradient-to-r from-provee-blue to-provee-green text-white shadow-sm",
        verified:
          "border-provee-blue bg-provee-blue/10 text-provee-blue hover:bg-provee-blue/20",
        deposit:
          "border-orange-500 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-400 dark:bg-orange-900/20 dark:text-orange-300",
        "matching-high":
          "border-transparent bg-emerald-500 text-white hover:bg-emerald-500/80 shadow-sm",
        "matching-medium":
          "border-transparent bg-amber-500 text-white hover:bg-amber-500/80 shadow-sm",
        "matching-low":
          "border-transparent bg-gray-400 text-white hover:bg-gray-400/80 shadow-sm",
        "status-active":
          "border-transparent bg-green-500 text-white hover:bg-green-500/80",
        "status-pending":
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80",
        "status-inactive":
          "border-transparent bg-gray-400 text-white hover:bg-gray-400/80",
        "price-budget":
          "border-provee-green bg-provee-green/10 text-provee-green hover:bg-provee-green/20",
        "price-premium":
          "border-purple-500 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-400 dark:bg-purple-900/20 dark:text-purple-300",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

// Provee 특화 매칭률 배지 컴포넌트
interface MatchingScoreBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  score: number
}

function MatchingScoreBadge({ score, className, ...props }: MatchingScoreBadgeProps) {
  const getVariantByScore = (score: number) => {
    if (score >= 80) return "matching-high"
    if (score >= 60) return "matching-medium"
    return "matching-low"
  }

  const getScoreText = (score: number) => `매칭률 ${score}%`

  return (
    <Badge
      variant={getVariantByScore(score)}
      className={cn("font-medium", className)}
      {...props}
    >
      {getScoreText(score)}
    </Badge>
  )
}

// Provee 서비스 상태 배지
interface ServiceStatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  status: 'active' | 'pending' | 'inactive'
}

function ServiceStatusBadge({ status, className, ...props }: ServiceStatusBadgeProps) {
  const statusConfig = {
    active: { variant: "status-active" as const, text: "서비스 중" },
    pending: { variant: "status-pending" as const, text: "승인 대기" },
    inactive: { variant: "status-inactive" as const, text: "중단" },
  }

  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      className={className}
      {...props}
    >
      {config.text}
    </Badge>
  )
}

// Provee 인증 배지
interface VerificationBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  type: 'phone' | 'identity' | 'business' | 'portfolio'
  verified?: boolean
}

function VerificationBadge({ type, verified = true, className, ...props }: VerificationBadgeProps) {
  const verificationConfig = {
    phone: { text: "휴대폰 인증", icon: "📱" },
    identity: { text: "신분증 인증", icon: "🆔" },
    business: { text: "사업자 인증", icon: "🏢" },
    portfolio: { text: "포트폴리오 인증", icon: "📋" },
  }

  const config = verificationConfig[type]

  return (
    <Badge
      variant={verified ? "verified" : "outline"}
      className={cn("gap-1", className)}
      {...props}
    >
      <span>{config.icon}</span>
      <span>{config.text}</span>
      {verified && <span className="text-provee-blue">✓</span>}
    </Badge>
  )
}

export { Badge, badgeVariants, MatchingScoreBadge, ServiceStatusBadge, VerificationBadge }