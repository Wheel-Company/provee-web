"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "korean-text fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "korean-text fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-slate-800 dark:bg-slate-950",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-provee-blue focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-provee-blue dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400">
        <X className="h-4 w-4" />
        <span className="sr-only">닫기</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "korean-text flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "korean-text flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "korean-text text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("korean-text text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// Provee 특화 다이얼로그 컴포넌트들

// 확인 다이얼로그
interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  onConfirm?: () => void
  onCancel?: () => void
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="korean-text sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <button
            onClick={handleCancel}
            className="korean-text px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "korean-text px-4 py-2 rounded-md text-sm font-medium transition-colors",
              variant === "destructive"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-provee-blue text-white hover:bg-provee-blue/90"
            )}
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 서비스 상세 다이얼로그
interface ServiceDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: {
    id: string
    title: string
    description: string
    provider: string
    price: number
    rating: number
    category: string
  }
  onContact?: () => void
  onBookmark?: () => void
}

const ServiceDetailDialog = ({
  open,
  onOpenChange,
  service,
  onContact,
  onBookmark,
}: ServiceDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="korean-text sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{service.title}</DialogTitle>
          <DialogDescription>
            {service.provider} • {service.category}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="korean-text font-medium mb-2">서비스 설명</h4>
            <p className="korean-text text-sm text-slate-600 dark:text-slate-400">
              {service.description}
            </p>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-slate-200 dark:border-slate-800">
            <div className="korean-text">
              <div className="text-2xl font-bold text-provee-blue">
                {service.price.toLocaleString()}원
              </div>
              <div className="text-sm text-slate-500">평점 {service.rating}/5.0</div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <button
            onClick={onBookmark}
            className="korean-text px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            북마크
          </button>
          <button
            onClick={onContact}
            className="korean-text px-6 py-2 bg-provee-blue text-white rounded-md text-sm font-medium hover:bg-provee-blue/90 transition-colors"
          >
            문의하기
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 매칭 결과 다이얼로그
interface MatchingResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  matches: Array<{
    id: string
    provider: string
    service: string
    matchingScore: number
    price: number
    rating: number
  }>
  onSelectMatch?: (matchId: string) => void
}

const MatchingResultDialog = ({
  open,
  onOpenChange,
  matches,
  onSelectMatch,
}: MatchingResultDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="korean-text sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            AI 매칭 결과
          </DialogTitle>
          <DialogDescription>
            총 {matches.length}개의 매칭 결과를 찾았습니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {matches.map((match, index) => (
            <div
              key={match.id}
              className="korean-text p-4 border border-slate-200 rounded-lg hover:border-provee-blue/50 transition-colors cursor-pointer dark:border-slate-800"
              onClick={() => onSelectMatch?.(match.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">{match.provider}</span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    match.matchingScore >= 80
                      ? "bg-green-100 text-green-800"
                      : match.matchingScore >= 60
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  )}>
                    매칭률 {match.matchingScore}%
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-provee-blue">
                    {match.price.toLocaleString()}원
                  </div>
                  <div className="text-sm text-slate-500">
                    ⭐ {match.rating}
                  </div>
                </div>
              </div>
              <p className="korean-text text-sm text-slate-600 dark:text-slate-400">
                {match.service}
              </p>
            </div>
          ))}
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="korean-text px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            나중에 보기
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 결제 확인 다이얼로그
interface PaymentConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: {
    title: string
    provider: string
    price: number
    deposit?: number
  }
  onConfirm?: () => void
}

const PaymentConfirmDialog = ({
  open,
  onOpenChange,
  service,
  onConfirm,
}: PaymentConfirmDialogProps) => {
  const totalAmount = service.price + (service.deposit || 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="korean-text sm:max-w-md">
        <DialogHeader>
          <DialogTitle>결제 확인</DialogTitle>
          <DialogDescription>
            서비스 예약을 위한 결제 정보를 확인해주세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="korean-text p-4 bg-slate-50 rounded-lg dark:bg-slate-900">
            <h4 className="font-medium mb-2">{service.title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              제공자: {service.provider}
            </p>
          </div>

          <div className="korean-text space-y-2">
            <div className="flex justify-between">
              <span>서비스 비용</span>
              <span>{service.price.toLocaleString()}원</span>
            </div>
            {service.deposit && (
              <div className="flex justify-between">
                <span>보증금</span>
                <span>{service.deposit.toLocaleString()}원</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>총 결제 금액</span>
                <span className="text-provee-blue">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="korean-text px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            취소
          </button>
          <button
            onClick={() => {
              onConfirm?.()
              onOpenChange(false)
            }}
            className="korean-text px-6 py-2 bg-provee-blue text-white rounded-md text-sm font-medium hover:bg-provee-blue/90 transition-colors"
          >
            결제하기
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  ConfirmDialog,
  ServiceDetailDialog,
  MatchingResultDialog,
  PaymentConfirmDialog,
}