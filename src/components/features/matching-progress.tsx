import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Brain,
  Users,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight
} from 'lucide-react'
import { ServiceRequest } from '@/types'
import { cn } from '@/lib/utils'

interface MatchingProgressProps {
  currentStep: 1 | 2 | 3 | 4
  request?: ServiceRequest
  className?: string
  showSimple?: boolean
}

interface SimpleProgressProps {
  progress: number
  label: string
  className?: string
}

// 간단한 진행률 컴포넌트
export function SimpleProgress({ progress, label, className }: SimpleProgressProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-gray-600">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}

const MATCHING_STEPS = [
  {
    step: 1,
    title: '요청서 작성',
    description: '서비스 요청 내용을 상세히 작성합니다',
    icon: FileText,
    estimatedTime: '5분'
  },
  {
    step: 2,
    title: 'AI 분석',
    description: 'AI가 요청사항을 분석하고 최적 매칭을 준비합니다',
    icon: Brain,
    estimatedTime: '1-2분'
  },
  {
    step: 3,
    title: '전문가 매칭',
    description: '조건에 맞는 전문가들을 찾아 매칭합니다',
    icon: Users,
    estimatedTime: '5-10분'
  },
  {
    step: 4,
    title: '최종 확정',
    description: '매칭 결과를 확인하고 전문가와 연결합니다',
    icon: CheckCircle2,
    estimatedTime: '즉시'
  }
] as const

export function MatchingProgress({
  currentStep,
  request,
  className,
  showSimple = false
}: MatchingProgressProps) {
  const progressPercentage = (currentStep / 4) * 100

  // 간단한 버전
  if (showSimple) {
    const getProgressLabel = (step: number) => {
      switch (step) {
        case 1: return '요청서 작성 중...'
        case 2: return 'AI 분석 중...'
        case 3: return '전문가 매칭 중...'
        case 4: return '매칭 완료!'
        default: return '매칭 진행 중...'
      }
    }

    return (
      <SimpleProgress
        progress={progressPercentage}
        label={getProgressLabel(currentStep)}
        className={className}
      />
    )
  }

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed'
    if (step === currentStep) return 'current'
    return 'pending'
  }

  const getStatusIcon = (step: number, IconComponent: any) => {
    const status = getStepStatus(step)

    if (status === 'completed') {
      return <CheckCircle2 className="h-6 w-6 text-green-600" />
    }

    if (status === 'current') {
      return (
        <div className="relative">
          <Circle className="h-6 w-6 text-blue-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse" />
          </div>
        </div>
      )
    }

    return <IconComponent className="h-6 w-6 text-gray-400" />
  }

  const getStatusColor = (step: number) => {
    const status = getStepStatus(step)
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'current': return 'text-blue-600'
      default: return 'text-gray-400'
    }
  }

  const getStatusBadge = (step: number) => {
    const status = getStepStatus(step)
    const stepInfo = MATCHING_STEPS[step - 1]

    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">완료</Badge>
      case 'current':
        return (
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-700">진행중</Badge>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {stepInfo.estimatedTime}
            </div>
          </div>
        )
      default:
        return <Badge variant="outline">대기</Badge>
    }
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        {/* 전체 진행률 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">매칭 진행 상황</h3>
            <span className="text-sm text-gray-600">
              {currentStep}/4 단계 ({Math.round(progressPercentage)}%)
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* 단계별 상세 정보 */}
        <div className="space-y-4">
          {MATCHING_STEPS.map((stepInfo, index) => {
            const isLast = index === MATCHING_STEPS.length - 1
            const status = getStepStatus(stepInfo.step)

            return (
              <div key={stepInfo.step} className="relative">
                {/* 연결선 */}
                {!isLast && (
                  <div className="absolute left-3 top-8 w-0.5 h-12 bg-gray-200" />
                )}

                <div className="flex items-start space-x-4">
                  {/* 아이콘 */}
                  <div className="flex-shrink-0">
                    {getStatusIcon(stepInfo.step, stepInfo.icon)}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={cn(
                        "font-medium",
                        getStatusColor(stepInfo.step)
                      )}>
                        {stepInfo.title}
                      </h4>
                      {getStatusBadge(stepInfo.step)}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {stepInfo.description}
                    </p>

                    {/* 현재 단계 상세 정보 */}
                    {status === 'current' && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 text-sm text-blue-700">
                          <div className="flex items-center space-x-1">
                            <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
                            <span>
                              {stepInfo.step === 1 && '요청사항을 분석하고 있습니다...'}
                              {stepInfo.step === 2 && 'AI가 최적의 매칭 조건을 계산하고 있습니다...'}
                              {stepInfo.step === 3 && '조건에 맞는 전문가들을 검색하고 있습니다...'}
                              {stepInfo.step === 4 && '매칭 결과를 준비하고 있습니다...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 완료된 단계 정보 */}
                    {status === 'completed' && stepInfo.step === 1 && request && (
                      <div className="bg-green-50 p-3 rounded-lg text-sm">
                        <div className="text-green-700">
                          ✓ 요청서 작성 완료: "{request.title}"
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 다음 단계 화살표 */}
                  {!isLast && status === 'completed' && (
                    <ArrowRight className="h-4 w-4 text-gray-400 mt-1" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 완료 메시지 */}
        {currentStep === 4 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">매칭이 완료되었습니다!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              조건에 맞는 전문가들을 찾았습니다. 매칭 결과를 확인해보세요.
            </p>
          </div>
        )}

        {/* 예상 소요 시간 */}
        {currentStep < 4 && (
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">예상 완료 시간</span>
              <span className="font-medium">
                약 {15 - (currentStep - 1) * 3}분 남음
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}