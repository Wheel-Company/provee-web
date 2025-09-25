import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Star, MapPin, Clock, Phone, Shield, Award, TrendingUp } from 'lucide-react'
import { MatchingResult, ServiceProvider } from '@/types'
import { formatKRW, cn } from '@/lib/utils'

interface ServiceMatchCardProps {
  matchingResult: MatchingResult
  provider: ServiceProvider
  onViewDetails: () => void
  onContact: () => void
  className?: string
}

export function ServiceMatchCard({
  matchingResult,
  provider,
  onViewDetails,
  onContact,
  className
}: ServiceMatchCardProps) {
  const { compatibilityScore, breakdown } = matchingResult
  const { profile, verification } = provider

  // 매칭률에 따른 스타일 결정
  const getMatchingStyle = (score: number) => {
    if (score >= 85) return {
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      label: 'SUCCESS'
    }
    if (score >= 70) return {
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      label: 'MATCHING'
    }
    return {
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      label: 'LOW'
    }
  }

  const matchStyle = getMatchingStyle(compatibilityScore)

  // 신뢰도 레벨 계산
  const getTrustLevel = () => {
    let level = 0
    if (verification.phone) level += 1
    if (verification.identity) level += 1
    if (verification.business) level += 1
    if (provider.depositPaid) level += 2
    return level
  }

  const trustLevel = getTrustLevel()
  const maxTrust = 5

  return (
    <Card className={cn(
      "w-full transition-all duration-200 hover:shadow-lg",
      matchStyle.border,
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar} alt={provider.name} />
              <AvatarFallback>{provider.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{provider.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{profile.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({profile.reviewCount})</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{profile.title}</p>
            </div>
          </div>

          {/* 매칭률 표시 */}
          <div className={cn(
            "flex flex-col items-end",
            matchStyle.bg,
            "px-3 py-2 rounded-lg"
          )}>
            <div className={cn("text-2xl font-bold", matchStyle.color)}>
              {compatibilityScore}%
            </div>
            <Badge variant="outline" className={cn("text-xs", matchStyle.color)}>
              {matchStyle.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 신뢰도 표시기 */}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">신뢰도</span>
            <Progress value={(trustLevel / maxTrust) * 100} className="w-16 h-2" />
            <span className="text-sm text-gray-600">{trustLevel}/{maxTrust}</span>
          </div>

          <div className="flex items-center space-x-1">
            {provider.depositPaid && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                보증금 완료
              </Badge>
            )}
            {verification.phone && (
              <Phone className="h-3 w-3 text-blue-600" />
            )}
            {verification.business && (
              <Award className="h-3 w-3 text-purple-600" />
            )}
          </div>
        </div>

        {/* 전문 분야 배지 */}
        <div className="flex flex-wrap gap-1">
          {profile.specializations.slice(0, 3).map((spec, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {spec}
            </Badge>
          ))}
          {profile.specializations.length > 3 && (
            <Badge variant="outline" className="text-xs text-gray-500">
              +{profile.specializations.length - 3}개 더
            </Badge>
          )}
        </div>

        {/* 위치 및 응답시간 */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{profile.location.city} {profile.location.district}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>평균 {profile.responseTime}시간 내 응답</span>
          </div>
        </div>

        {/* 예상 비용 */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">예상 비용</span>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                {formatKRW(profile.priceRange.min)} ~ {formatKRW(profile.priceRange.max)}
              </div>
              <div className="text-xs text-blue-700">플랫폼 수수료 없음</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* 매칭 세부 점수 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">매칭 세부 점수</span>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span>서비스 적합성 (50%)</span>
              <div className="flex items-center space-x-2">
                <Progress value={breakdown.serviceCompatibility} className="w-20 h-1" />
                <span className="w-8 text-right">{breakdown.serviceCompatibility}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>가격 적합성 (20%)</span>
              <div className="flex items-center space-x-2">
                <Progress value={breakdown.priceCompatibility} className="w-20 h-1" />
                <span className="w-8 text-right">{breakdown.priceCompatibility}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>위치/시간 적합성 (15%)</span>
              <div className="flex items-center space-x-2">
                <Progress value={breakdown.locationTimeCompatibility} className="w-20 h-1" />
                <span className="w-8 text-right">{breakdown.locationTimeCompatibility}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>평판 점수 (15%)</span>
              <div className="flex items-center space-x-2">
                <Progress value={breakdown.reputationIndex} className="w-20 h-1" />
                <span className="w-8 text-right">{breakdown.reputationIndex}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex space-x-2 pt-4">
        <Button variant="outline" onClick={onViewDetails} className="flex-1">
          상세 보기
        </Button>
        <Button onClick={onContact} className="flex-1 bg-blue-600 hover:bg-blue-700">
          문의하기
        </Button>
      </CardFooter>
    </Card>
  )
}