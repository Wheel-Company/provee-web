"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "korean-text flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-provee-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-provee-blue",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

// Provee 특화 텍스트영역 컴포넌트들

// 글자 수 카운터 포함 텍스트영역
interface TextareaWithCounterProps extends TextareaProps {
  maxLength?: number
  showCounter?: boolean
}

const TextareaWithCounter = React.forwardRef<HTMLTextAreaElement, TextareaWithCounterProps>(
  ({ className, maxLength, showCounter = true, value, onChange, ...props }, ref) => {
    const [currentLength, setCurrentLength] = React.useState(0)

    React.useEffect(() => {
      if (typeof value === 'string') {
        setCurrentLength(value.length)
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setCurrentLength(newValue.length)
      onChange?.(e)
    }

    const isOverLimit = maxLength ? currentLength > maxLength : false

    return (
      <div className="w-full">
        <Textarea
          ref={ref}
          className={cn(
            isOverLimit && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        {showCounter && (
          <div className="korean-text flex justify-end mt-1">
            <span className={cn(
              "text-xs",
              isOverLimit ? "text-red-500" : "text-slate-500 dark:text-slate-400"
            )}>
              {currentLength}{maxLength && `/${maxLength}`}
            </span>
          </div>
        )}
      </div>
    )
  }
)
TextareaWithCounter.displayName = "TextareaWithCounter"

// 자동 크기 조절 텍스트영역
interface AutoResizeTextareaProps extends TextareaProps {
  minRows?: number
  maxRows?: number
}

const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  ({ className, minRows = 3, maxRows = 10, style, ...props }, ref) => {
    const [textareaRef, setTextareaRef] = React.useState<HTMLTextAreaElement | null>(null)

    const adjustHeight = React.useCallback(() => {
      if (textareaRef) {
        textareaRef.style.height = 'auto'
        const scrollHeight = textareaRef.scrollHeight
        const lineHeight = parseInt(window.getComputedStyle(textareaRef).lineHeight, 10)
        const minHeight = lineHeight * minRows
        const maxHeight = lineHeight * maxRows

        textareaRef.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`
      }
    }, [textareaRef, minRows, maxRows])

    React.useEffect(() => {
      adjustHeight()
    }, [adjustHeight, props.value])

    const handleRef = React.useCallback((node: HTMLTextAreaElement) => {
      setTextareaRef(node)
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }, [ref])

    return (
      <textarea
        ref={handleRef}
        className={cn(
          "korean-text flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-provee-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-provee-blue",
          className
        )}
        style={{
          minHeight: `${minRows * 1.5}rem`,
          ...style
        }}
        onInput={adjustHeight}
        {...props}
      />
    )
  }
)
AutoResizeTextarea.displayName = "AutoResizeTextarea"

// 서비스 설명용 텍스트영역 (Provee 특화)
interface ServiceDescriptionTextareaProps extends TextareaProps {
  placeholder?: string
}

const ServiceDescriptionTextarea = React.forwardRef<HTMLTextAreaElement, ServiceDescriptionTextareaProps>(
  ({ className, placeholder = "서비스에 대해 자세히 설명해주세요...", ...props }, ref) => {
    return (
      <TextareaWithCounter
        ref={ref}
        className={cn("korean-text min-h-[120px]", className)}
        placeholder={placeholder}
        maxLength={1000}
        {...props}
      />
    )
  }
)
ServiceDescriptionTextarea.displayName = "ServiceDescriptionTextarea"

// 리뷰 작성용 텍스트영역
interface ReviewTextareaProps extends TextareaProps {
  placeholder?: string
}

const ReviewTextarea = React.forwardRef<HTMLTextAreaElement, ReviewTextareaProps>(
  ({ className, placeholder = "서비스 경험을 자세히 알려주세요...", ...props }, ref) => {
    return (
      <div className="space-y-2">
        <TextareaWithCounter
          ref={ref}
          className={cn("korean-text min-h-[100px]", className)}
          placeholder={placeholder}
          maxLength={500}
          {...props}
        />
        <div className="korean-text text-xs text-slate-500 dark:text-slate-400">
          💡 구체적이고 상세한 후기는 다른 고객들에게 큰 도움이 됩니다
        </div>
      </div>
    )
  }
)
ReviewTextarea.displayName = "ReviewTextarea"

// 문의사항 텍스트영역
interface InquiryTextareaProps extends TextareaProps {
  placeholder?: string
}

const InquiryTextarea = React.forwardRef<HTMLTextAreaElement, InquiryTextareaProps>(
  ({ className, placeholder = "궁금한 사항을 자세히 작성해주세요...", ...props }, ref) => {
    return (
      <AutoResizeTextarea
        ref={ref}
        className={cn("korean-text", className)}
        placeholder={placeholder}
        minRows={4}
        maxRows={8}
        {...props}
      />
    )
  }
)
InquiryTextarea.displayName = "InquiryTextarea"

export {
  Textarea,
  TextareaWithCounter,
  AutoResizeTextarea,
  ServiceDescriptionTextarea,
  ReviewTextarea,
  InquiryTextarea
}