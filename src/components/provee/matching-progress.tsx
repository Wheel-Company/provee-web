import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Circle, Clock, Zap } from 'lucide-react'

interface MatchingProgressProps {
  step: number
  totalSteps: number
  title: string
  description: string
  estimatedTime?: string
  className?: string
}

export function MatchingProgress({
  step,
  totalSteps,
  title,
  description,
  estimatedTime,
  className
}: MatchingProgressProps) {
  const progress = (step / totalSteps) * 100

  const steps = [
    { label: '요구사항 분석', icon: CheckCircle },
    { label: 'AI 매칭 진행', icon: step >= 2 ? CheckCircle : Circle },
    { label: '전문가 검증', icon: step >= 3 ? CheckCircle : Circle },
    { label: '매칭 완료', icon: step >= 4 ? CheckCircle : Circle },
  ]

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < step) return 'completed'
    if (stepIndex === step) return 'current'
    return 'pending'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'current':
        return 'text-blue-600'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold korean-text mb-2">{title}</h3>
          <p className="text-gray-600 korean-text">{description}</p>
          {estimatedTime && (
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span className="korean-text">{estimatedTime}</span>
            </div>
          )}
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Zap className="h-3 w-3 mr-1" />
          진행중
        </Badge>
      </div>

      {/* 프로그레스 바 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium korean-text">진행률</span>
          <span className="text-gray-600">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* 단계별 상태 */}
      <div className="space-y-3">
        {steps.slice(0, totalSteps).map((stepInfo, index) => {
          const status = getStepStatus(index + 1)
          const Icon = stepInfo.icon

          return (
            <div
              key={index}
              className="flex items-center space-x-3"
            >
              <div className={`flex-shrink-0 ${getStatusColor(status)}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium korean-text ${
                  status === 'completed' ? 'text-green-700' :
                  status === 'current' ? 'text-blue-700' :
                  'text-gray-500'
                }`}>
                  {stepInfo.label}
                </div>
                {status === 'current' && (
                  <div className="text-xs text-blue-600 mt-1">
                    현재 진행중...
                  </div>
                )}
              </div>
              {status === 'completed' && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  완료
                </Badge>
              )}
              {status === 'current' && (
                <Badge className="bg-blue-100 text-blue-700 text-xs">
                  진행중
                </Badge>
              )}
            </div>
          )
        })}
      </div>

      {/* 예상 완료 시간 */}
      {step < totalSteps && estimatedTime && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900 korean-text">
              예상 완료 시간
            </span>
            <span className="text-sm text-blue-700 korean-text">
              {estimatedTime}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}