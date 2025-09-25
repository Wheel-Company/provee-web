"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "korean-text flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-provee-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-provee-blue",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Provee 특화 입력 컴포넌트들

// 한국 휴대폰 번호 입력
const PhoneInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, '') // 숫자만 남기기

      // 한국 휴대폰 번호 형식 (010-0000-0000)
      if (value.length <= 3) {
        value = value
      } else if (value.length <= 7) {
        value = `${value.slice(0, 3)}-${value.slice(3)}`
      } else if (value.length <= 11) {
        value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`
      } else {
        value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`
      }

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: value
        }
      }

      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
    }

    return (
      <Input
        ref={ref}
        type="tel"
        placeholder="010-0000-0000"
        value={value}
        onChange={handlePhoneChange}
        maxLength={13}
        className={cn("korean-text", className)}
        {...props}
      />
    )
  }
)
PhoneInput.displayName = "PhoneInput"

// 한국 원화 입력 (가격/금액)
const PriceInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'onChange' | 'value'> & {
  value?: number
  onChange?: (value: number) => void
}>(
  ({ className, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('')

    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(value.toLocaleString('ko-KR'))
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^\d]/g, '') // 숫자만 추출
      const numericValue = rawValue ? parseInt(rawValue, 10) : 0

      setDisplayValue(numericValue.toLocaleString('ko-KR'))
      onChange?.(numericValue)
    }

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          className={cn("korean-text pr-8", className)}
          placeholder="0"
          {...props}
        />
        <span className="korean-text absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400">
          원
        </span>
      </div>
    )
  }
)
PriceInput.displayName = "PriceInput"

// 검색 입력
const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="search"
          className={cn("korean-text pl-10", className)}
          placeholder="검색어를 입력하세요"
          {...props}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        </div>
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

// 평점 입력 (별점)
interface RatingInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number
  onChange?: (rating: number) => void
  max?: number
  readonly?: boolean
}

const RatingInput = React.forwardRef<HTMLDivElement, RatingInputProps>(
  ({ className, value = 0, onChange, max = 5, readonly = false, ...props }, ref) => {
    const [hoverValue, setHoverValue] = React.useState<number>(0)

    const handleClick = (rating: number) => {
      if (!readonly) {
        onChange?.(rating)
      }
    }

    const handleMouseEnter = (rating: number) => {
      if (!readonly) {
        setHoverValue(rating)
      }
    }

    const handleMouseLeave = () => {
      if (!readonly) {
        setHoverValue(0)
      }
    }

    return (
      <div
        ref={ref}
        className={cn("korean-text flex items-center space-x-1", className)}
        {...props}
      >
        {Array.from({ length: max }, (_, index) => {
          const rating = index + 1
          const isActive = rating <= (hoverValue || value)

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={cn(
                "text-2xl transition-colors duration-200",
                isActive ? "text-yellow-400" : "text-slate-300 dark:text-slate-600",
                !readonly && "hover:text-yellow-400 cursor-pointer",
                readonly && "cursor-default"
              )}
            >
              ★
            </button>
          )
        })}
        <span className="korean-text ml-2 text-sm text-slate-600 dark:text-slate-400">
          ({value.toFixed(1)})
        </span>
      </div>
    )
  }
)
RatingInput.displayName = "RatingInput"

export { Input, PhoneInput, PriceInput, SearchInput, RatingInput }