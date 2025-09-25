import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Calculator,
  Zap,
  Gift,
  Info,
  TrendingDown,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { formatKRW, cn } from '@/lib/utils'

interface PriceBreakdown {
  baseService: number
  additionalServices?: { name: string; price: number }[]
  platformFee: number // 항상 0 (무료 강조)
  total: number
}

interface PriceDisplayProps {
  priceBreakdown: PriceBreakdown
  showComparison?: boolean
  marketAverage?: number
  className?: string
  highlight?: 'savings' | 'total' | 'none'
}

interface PriceComparisonProps {
  ourPrice: number
  marketAverage: number
  className?: string
}

// 가격 비교 컴포넌트
function PriceComparison({ ourPrice, marketAverage, className }: PriceComparisonProps) {
  const savings = marketAverage - ourPrice
  const savingsPercentage = Math.round((savings / marketAverage) * 100)

  return (
    <div className={cn("bg-green-50 p-4 rounded-lg border border-green-200", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-green-800">시장 대비 절약</span>
        <TrendingDown className="h-4 w-4 text-green-600" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-green-700">시장 평균 가격</span>
          <span className="line-through text-gray-500">{formatKRW(marketAverage)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-green-700">Provee 가격</span>
          <span className="font-semibold text-green-800">{formatKRW(ourPrice)}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium text-green-800">절약 금액</span>
          <div className="text-right">
            <div className="font-bold text-green-600">{formatKRW(savings)}</div>
            <div className="text-xs text-green-700">({savingsPercentage}% 절약)</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PriceDisplay({
  priceBreakdown,
  showComparison = false,
  marketAverage,
  className,
  highlight = 'none'
}: PriceDisplayProps) {
  const { baseService, additionalServices = [], platformFee, total } = priceBreakdown

  const getHighlightStyle = (type: string) => {
    if (highlight !== type) return ""

    switch (type) {
      case 'savings':
        return "ring-2 ring-green-500 bg-green-50"
      case 'total':
        return "ring-2 ring-blue-500 bg-blue-50"
      default:
        return ""
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>투명한 가격 정보</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 기본 서비스 비용 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">기본 서비스</span>
              <div className="text-xs text-gray-500">요청하신 핵심 서비스 비용</div>
            </div>
            <div className="text-lg font-semibold">{formatKRW(baseService)}</div>
          </div>

          {/* 추가 서비스 */}
          {additionalServices.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">추가 서비스</div>
              {additionalServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center text-sm pl-4">
                  <span className="text-gray-600">• {service.name}</span>
                  <span className="font-medium">{formatKRW(service.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* 플랫폼 수수료 (무료 강조) */}
        <div className={cn(
          "flex justify-between items-center p-3 rounded-lg",
          getHighlightStyle('savings')
        )}>
          <div className="flex items-center space-x-2">
            <Gift className="h-4 w-4 text-green-600" />
            <div>
              <span className="font-medium">플랫폼 수수료</span>
              <div className="flex items-center space-x-1">
                <Badge className="bg-green-100 text-green-700 text-xs">무료</Badge>
                <span className="text-xs text-gray-500">다른 플랫폼은 5-20% 수수료</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold line-through text-gray-400">
              {formatKRW(platformFee)}
            </div>
            <div className="text-sm font-bold text-green-600">FREE</div>
          </div>
        </div>

        <Separator />

        {/* 총 비용 */}
        <div className={cn(
          "flex justify-between items-center p-4 rounded-lg border-2",
          getHighlightStyle('total'),
          highlight === 'total' ? 'border-blue-500' : 'border-gray-200'
        )}>
          <div>
            <span className="text-lg font-semibold">총 비용</span>
            <div className="flex items-center space-x-1 mt-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-700">추가 수수료 없음</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{formatKRW(total)}</div>
            <div className="text-sm text-gray-500">부가세 포함</div>
          </div>
        </div>

        {/* 시장 가격 비교 */}
        {showComparison && marketAverage && (
          <PriceComparison ourPrice={total} marketAverage={marketAverage} />
        )}

        {/* 가격 투명성 안내 */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">Provee의 투명한 가격 정책</div>
              <ul className="space-y-1 text-xs">
                <li>• 플랫폼 수수료 0원 (영구 무료)</li>
                <li>• 숨겨진 비용 없음</li>
                <li>• 서비스 완료 후 결제</li>
                <li>• 100% 만족 보장</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 결제 안내 */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">결제 방법</span>
            <Zap className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>💳 카드 결제 (무이자 할부 가능)</div>
            <div>🏦 계좌 이체</div>
            <div>📱 간편 결제 (카카오페이, 토스 등)</div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-yellow-800">
            <span className="font-medium">참고사항:</span>
            <span className="ml-1">
              실제 비용은 서비스 범위와 난이도에 따라 달라질 수 있습니다.
              정확한 견적은 전문가와 상담 후 확정됩니다.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 간단한 가격 표시 컴포넌트
interface SimplePriceProps {
  amount: number
  label?: string
  showFree?: boolean
  className?: string
}

export function SimplePrice({
  amount,
  label = "총 비용",
  showFree = true,
  className
}: SimplePriceProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="text-2xl font-bold text-blue-600">{formatKRW(amount)}</div>
      <div className="text-sm text-gray-600">{label}</div>
      {showFree && (
        <div className="text-xs text-green-600 font-medium mt-1">
          플랫폼 수수료 무료
        </div>
      )}
    </div>
  )
}