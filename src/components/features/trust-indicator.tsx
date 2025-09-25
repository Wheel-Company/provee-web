import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import {
  Shield,
  Phone,
  IdCard,
  Building2,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { TrustIndicators, ServiceProvider } from '@/types'
import { cn, formatKRW } from '@/lib/utils'

interface TrustIndicatorProps {
  provider: ServiceProvider
  className?: string
  showDetailed?: boolean
}

interface TrustSummaryProps {
  trustLevel: number
  maxTrust: number
  className?: string
}

// 신뢰도 레벨 요약 컴포넌트
export function TrustSummary({ trustLevel, maxTrust, className }: TrustSummaryProps) {
  const percentage = (trustLevel / maxTrust) * 100

  const getTrustColor = (level: number, max: number) => {
    const ratio = level / max
    if (ratio >= 0.8) return 'text-green-600'
    if (ratio >= 0.6) return 'text-blue-600'
    if (ratio >= 0.4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrustLabel = (level: number, max: number) => {
    const ratio = level / max
    if (ratio >= 0.8) return '매우 높음'
    if (ratio >= 0.6) return '높음'
    if (ratio >= 0.4) return '보통'
    return '낮음'
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <Shield className={cn("h-5 w-5", getTrustColor(trustLevel, maxTrust))} />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">신뢰도</span>
          <span className={cn("text-sm font-semibold", getTrustColor(trustLevel, maxTrust))}>
            {getTrustLabel(trustLevel, maxTrust)}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
      <span className="text-sm text-gray-600">{trustLevel}/{maxTrust}</span>
    </div>
  )
}

export function TrustIndicator({ provider, className, showDetailed = false }: TrustIndicatorProps) {
  const { verification, depositPaid, depositAmount, profile } = provider

  // 신뢰도 점수 계산
  const calculateTrustLevel = () => {
    let level = 0
    if (verification.phone) level += 1
    if (verification.identity) level += 1
    if (verification.business) level += 1
    if (depositPaid) level += 2
    return level
  }

  const trustLevel = calculateTrustLevel()
  const maxTrust = 5

  // 보증금 상태 결정
  const getDepositStatus = (): TrustIndicators['depositStatus'] => {
    if (depositPaid) return 'paid'
    if (depositAmount > 0) return 'pending'
    return 'none'
  }

  // 인증 레벨 결정
  const getVerificationLevel = (): TrustIndicators['verificationLevel'] => {
    if (verification.business) return 'business'
    if (verification.identity) return 'identity'
    return 'phone'
  }

  const depositStatus = getDepositStatus()
  const verificationLevel = getVerificationLevel()

  if (!showDetailed) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <TrustSummary trustLevel={trustLevel} maxTrust={maxTrust} />
        <div className="flex items-center space-x-1">
          {depositPaid && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              보증금
            </Badge>
          )}
          {verification.phone && <Phone className="h-3 w-3 text-blue-600" />}
          {verification.identity && <IdCard className="h-3 w-3 text-green-600" />}
          {verification.business && <Building2 className="h-3 w-3 text-purple-600" />}
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4 space-y-4">
        {/* 전체 신뢰도 점수 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">신뢰도 지표</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{trustLevel}/{maxTrust}</div>
            <TrustSummary trustLevel={trustLevel} maxTrust={maxTrust} />
          </div>
        </div>

        {/* 보증금 상태 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">보증금 상태</span>
            <div className="flex items-center space-x-2">
              {depositStatus === 'paid' ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Badge className="bg-green-100 text-green-700">완료</Badge>
                </>
              ) : depositStatus === 'pending' ? (
                <>
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <Badge className="bg-yellow-100 text-yellow-700">대기</Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-gray-400" />
                  <Badge variant="outline">없음</Badge>
                </>
              )}
            </div>
          </div>

          {depositPaid && (
            <div className="text-xs text-gray-600 pl-6">
              보증금 {formatKRW(depositAmount)} 예치 완료
            </div>
          )}
        </div>

        {/* 인증 레벨 */}
        <div className="space-y-3">
          <span className="text-sm font-medium">인증 상태</span>

          <div className="space-y-2">
            {/* 휴대폰 인증 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-sm">휴대폰 인증</span>
              </div>
              {verification.phone ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {/* 신분 인증 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IdCard className="h-4 w-4 text-green-600" />
                <span className="text-sm">신분 인증</span>
              </div>
              {verification.identity ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {/* 사업자 인증 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-purple-600" />
                <span className="text-sm">사업자 인증</span>
              </div>
              {verification.business ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* 평점 및 성공률 */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-bold">{profile.rating.toFixed(1)}</span>
            </div>
            <div className="text-xs text-gray-600">
              플랫폼 평점 ({profile.reviewCount}개 리뷰)
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-lg font-bold text-green-600">
                {Math.round(profile.rating * 20)}%
              </span>
            </div>
            <div className="text-xs text-gray-600">
              예상 성공률
            </div>
          </div>
        </div>

        {/* 신뢰도 설명 */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-start space-x-2">
            <Shield className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <div>
              신뢰도는 보증금 예치(2점), 사업자 인증(1점), 신분 인증(1점), 휴대폰 인증(1점)으로 계산됩니다.
              높은 신뢰도는 안전하고 믿을 수 있는 서비스 제공자임을 의미합니다.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}