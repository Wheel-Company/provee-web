import React, { useState, forwardRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MapPin, Search, CheckCircle, AlertCircle } from 'lucide-react'
import { KoreanAddress } from '@/types'
import { formatKRW, formatPhoneNumber, cn } from '@/lib/utils'

interface KoreanPhoneInputProps {
  value: string
  onChange: (value: string) => void
  onVerify?: (phone: string) => Promise<boolean>
  label?: string
  placeholder?: string
  required?: boolean
  className?: string
}

interface KoreanAddressInputProps {
  value: Partial<KoreanAddress>
  onChange: (address: Partial<KoreanAddress>) => void
  label?: string
  required?: boolean
  className?: string
}

interface BusinessNumberInputProps {
  value: string
  onChange: (value: string) => void
  onVerify?: (number: string) => Promise<boolean>
  label?: string
  required?: boolean
  className?: string
}

interface KoreanCurrencyInputProps {
  value: number
  onChange: (value: number) => void
  label?: string
  min?: number
  max?: number
  step?: number
  placeholder?: string
  required?: boolean
  className?: string
}

// 한국 휴대폰 번호 입력 (010-0000-0000)
export const KoreanPhoneInput = forwardRef<HTMLInputElement, KoreanPhoneInputProps>(
  ({ value, onChange, onVerify, label = "휴대폰 번호", placeholder = "010-0000-0000", required, className, ...props }, ref) => {
    const [isVerifying, setIsVerifying] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [verificationError, setVerificationError] = useState<string | null>(null)

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/\D/g, '')
      const formatted = formatPhoneNumber(input)
      onChange(formatted)
      setIsVerified(false)
      setVerificationError(null)
    }

    const handleVerification = async () => {
      if (!onVerify || !value) return

      setIsVerifying(true)
      setVerificationError(null)

      try {
        const result = await onVerify(value)
        setIsVerified(result)
        if (!result) {
          setVerificationError('인증에 실패했습니다. 번호를 확인해주세요.')
        }
      } catch (error) {
        setVerificationError('인증 중 오류가 발생했습니다.')
      } finally {
        setIsVerifying(false)
      }
    }

    const isValidPhone = /^010-\d{4}-\d{4}$/.test(value)

    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor="phone-input">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>

        <div className="flex space-x-2">
          <Input
            id="phone-input"
            ref={ref}
            type="tel"
            value={value}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            maxLength={13}
            className={cn(
              "flex-1",
              isVerified && "border-green-500",
              verificationError && "border-red-500"
            )}
            {...props}
          />

          {onVerify && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleVerification}
              disabled={!isValidPhone || isVerifying || isVerified}
              className="px-3"
            >
              {isVerifying ? '인증 중...' : isVerified ? '완료' : '인증'}
            </Button>
          )}
        </div>

        {isVerified && (
          <div className="flex items-center space-x-1 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>휴대폰 인증 완료</span>
          </div>
        )}

        {verificationError && (
          <div className="flex items-center space-x-1 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{verificationError}</span>
          </div>
        )}

        <div className="text-xs text-gray-500">
          SMS 인증을 통해 본인 확인을 진행합니다.
        </div>
      </div>
    )
  }
)

KoreanPhoneInput.displayName = "KoreanPhoneInput"

// 한국 주소 입력 (도로명, 지번)
export function KoreanAddressInput({
  value,
  onChange,
  label = "주소",
  required,
  className
}: KoreanAddressInputProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // 주소 검색 모의 데이터 (실제로는 API 연동)
  const mockAddressSearch = (query: string): KoreanAddress[] => {
    if (!query) return []

    return [
      {
        roadAddress: `${query} 도로명 123`,
        jibunAddress: `${query} 지번 45-6`,
        zipCode: '12345',
        city: '서울특별시',
        district: '강남구',
        neighborhood: '역삼동'
      },
      {
        roadAddress: `${query} 대로 456`,
        jibunAddress: `${query} 번지 78-9`,
        zipCode: '12346',
        city: '서울특별시',
        district: '서초구',
        neighborhood: '서초동'
      }
    ]
  }

  const searchResults = mockAddressSearch(searchQuery)

  const handleAddressSelect = (address: KoreanAddress) => {
    onChange(address)
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <MapPin className="h-4 w-4 mr-2" />
            {value.roadAddress ? value.roadAddress : '주소를 검색해주세요'}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>주소 검색</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="동명, 도로명, 건물명 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {searchResults.map((address, index) => (
                <div
                  key={index}
                  onClick={() => handleAddressSelect(address)}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className="font-medium text-sm">{address.roadAddress}</div>
                  <div className="text-xs text-gray-600">{address.jibunAddress}</div>
                  <div className="text-xs text-gray-500">
                    {address.city} {address.district} {address.neighborhood}
                  </div>
                </div>
              ))}

              {searchQuery && searchResults.length === 0 && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {value.roadAddress && (
        <div className="p-3 bg-gray-50 rounded-lg text-sm">
          <div className="font-medium">{value.roadAddress}</div>
          <div className="text-gray-600">{value.jibunAddress}</div>
          <div className="text-gray-500">
            {value.city} {value.district} {value.neighborhood} ({value.zipCode})
          </div>
        </div>
      )}

      <Input
        placeholder="상세주소 (동, 호수 등)"
        className="text-sm"
      />
    </div>
  )
}

// 사업자 등록번호 입력
export const BusinessNumberInput = forwardRef<HTMLInputElement, BusinessNumberInputProps>(
  ({ value, onChange, onVerify, label = "사업자등록번호", required, className, ...props }, ref) => {
    const [isVerifying, setIsVerifying] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [verificationError, setVerificationError] = useState<string | null>(null)
    const [businessInfo, setBusinessInfo] = useState<any>(null)

    const formatBusinessNumber = (input: string) => {
      const cleaned = input.replace(/\D/g, '')
      const match = cleaned.match(/^(\d{3})(\d{2})(\d{5})$/)
      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`
      }
      return cleaned
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatBusinessNumber(e.target.value)
      onChange(formatted)
      setIsVerified(false)
      setVerificationError(null)
      setBusinessInfo(null)
    }

    const handleVerification = async () => {
      if (!onVerify || !value) return

      setIsVerifying(true)
      setVerificationError(null)

      try {
        const result = await onVerify(value)
        setIsVerified(result)
        if (result) {
          // 모의 사업자 정보 (실제로는 API에서 받아옴)
          setBusinessInfo({
            companyName: '(주)프로비',
            representative: '홍길동',
            businessType: '소프트웨어 개발업'
          })
        } else {
          setVerificationError('올바르지 않은 사업자등록번호입니다.')
        }
      } catch (error) {
        setVerificationError('조회 중 오류가 발생했습니다.')
      } finally {
        setIsVerifying(false)
      }
    }

    const isValidBusinessNumber = /^\d{3}-\d{2}-\d{5}$/.test(value)

    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor="business-number">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>

        <div className="flex space-x-2">
          <Input
            id="business-number"
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="000-00-00000"
            maxLength={12}
            className={cn(
              "flex-1",
              isVerified && "border-green-500",
              verificationError && "border-red-500"
            )}
            {...props}
          />

          {onVerify && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleVerification}
              disabled={!isValidBusinessNumber || isVerifying || isVerified}
              className="px-3"
            >
              {isVerifying ? '조회 중...' : isVerified ? '완료' : '조회'}
            </Button>
          )}
        </div>

        {isVerified && businessInfo && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-1 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">사업자 정보 확인 완료</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <div>상호: {businessInfo.companyName}</div>
              <div>대표자: {businessInfo.representative}</div>
              <div>업종: {businessInfo.businessType}</div>
            </div>
          </div>
        )}

        {verificationError && (
          <div className="flex items-center space-x-1 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{verificationError}</span>
          </div>
        )}
      </div>
    )
  }
)

BusinessNumberInput.displayName = "BusinessNumberInput"

// 원화 금액 입력
export const KoreanCurrencyInput = forwardRef<HTMLInputElement, KoreanCurrencyInputProps>(
  ({ value, onChange, label = "금액", min = 0, max = 100000000, step = 10000, placeholder, required, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(formatKRW(value).replace('₩', '').trim())

    useEffect(() => {
      setDisplayValue(formatKRW(value).replace('₩', '').trim())
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/[^0-9]/g, '')
      const numericValue = parseInt(input) || 0

      if (numericValue <= max && numericValue >= min) {
        onChange(numericValue)
        setDisplayValue(input ? new Intl.NumberFormat('ko-KR').format(numericValue) : '')
      }
    }

    const handlePresetAmount = (amount: number) => {
      if (amount <= max && amount >= min) {
        onChange(amount)
      }
    }

    // 일반적인 금액 프리셋
    const presetAmounts = [
      { label: '10만원', value: 100000 },
      { label: '30만원', value: 300000 },
      { label: '50만원', value: 500000 },
      { label: '100만원', value: 1000000 },
    ].filter(preset => preset.value <= max)

    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor="currency-input">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>

        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            ₩
          </div>
          <Input
            id="currency-input"
            ref={ref}
            type="text"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder || "금액을 입력하세요"}
            className="pl-8"
            {...props}
          />
        </div>

        {presetAmounts.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {presetAmounts.map((preset) => (
              <Badge
                key={preset.value}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handlePresetAmount(preset.value)}
              >
                {preset.label}
              </Badge>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500">
          최소: {formatKRW(min)} ~ 최대: {formatKRW(max)}
        </div>
      </div>
    )
  }
)

KoreanCurrencyInput.displayName = "KoreanCurrencyInput"