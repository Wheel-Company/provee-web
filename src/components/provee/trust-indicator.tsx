import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  Shield,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react'

interface TrustIndicatorProps {
  type: 'verified' | 'portfolio' | 'review' | 'response'
  score: number
  label: string
  className?: string
}

export function TrustIndicator({ type, score, label, className }: TrustIndicatorProps) {
  const getIcon = () => {
    switch (type) {
      case 'verified':
        return <Shield className="h-5 w-5 text-green-600" />
      case 'portfolio':
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      case 'review':
        return <Star className="h-5 w-5 text-yellow-600" />
      case 'response':
        return <Clock className="h-5 w-5 text-purple-600" />
      default:
        return <Shield className="h-5 w-5 text-gray-600" />
    }
  }

  const getColor = () => {
    switch (type) {
      case 'verified':
        return 'text-green-600'
      case 'portfolio':
        return 'text-blue-600'
      case 'review':
        return 'text-yellow-600'
      case 'response':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  const getProgressColor = () => {
    switch (type) {
      case 'verified':
        return 'bg-green-600'
      case 'portfolio':
        return 'bg-blue-600'
      case 'review':
        return 'bg-yellow-600'
      case 'response':
        return 'bg-purple-600'
      default:
        return 'bg-gray-600'
    }
  }

  const formatScore = () => {
    if (type === 'review') {
      return `${score}/5`
    }
    if (type === 'response') {
      return `${score}시간`
    }
    return `${score}%`
  }

  const getProgressValue = () => {
    if (type === 'review') {
      return (score / 5) * 100
    }
    if (type === 'response') {
      // 응답시간은 낮을수록 좋으므로 역계산 (24시간 기준)
      return Math.max(0, (24 - score) / 24 * 100)
    }
    return score
  }

  return (
    <div className={cn("flex flex-col items-center p-4 space-y-3", className)}>
      {getIcon()}
      <div className="text-center">
        <div className={cn("text-2xl font-bold", getColor())}>
          {formatScore()}
        </div>
        <div className="text-sm text-gray-600 korean-text">{label}</div>
      </div>
      <div className="w-full">
        <Progress
          value={getProgressValue()}
          className={cn("h-2")}
        />
      </div>
    </div>
  )
}