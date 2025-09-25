"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="korean-text toaster group"
      toastOptions={{
        classNames: {
          toast:
            "korean-text group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-slate-950 dark:group-[.toaster]:text-slate-50 dark:group-[.toaster]:border-slate-800",
          description: "korean-text group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400",
          actionButton:
            "korean-text group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50 dark:group-[.toast]:bg-slate-50 dark:group-[.toast]:text-slate-900",
          cancelButton:
            "korean-text group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 dark:group-[.toast]:bg-slate-800 dark:group-[.toast]:text-slate-400",
        },
      }}
      {...props}
    />
  )
}

// Provee 특화 toast 함수들
const proveeToast = {
  // 기본 성공 토스트
  success: (message: string, description?: string) =>
    toast.success(message, {
      description,
      className: "korean-text",
      style: {
        background: "#10B981",
        color: "white",
        border: "none",
      },
    }),

  // 기본 에러 토스트
  error: (message: string, description?: string) =>
    toast.error(message, {
      description,
      className: "korean-text",
      style: {
        background: "#EF4444",
        color: "white",
        border: "none",
      },
    }),

  // 기본 경고 토스트
  warning: (message: string, description?: string) =>
    toast.warning(message, {
      description,
      className: "korean-text",
      style: {
        background: "#F59E0B",
        color: "white",
        border: "none",
      },
    }),

  // 기본 정보 토스트
  info: (message: string, description?: string) =>
    toast.info(message, {
      description,
      className: "korean-text",
      style: {
        background: "#3B82F6",
        color: "white",
        border: "none",
      },
    }),

  // 매칭 성공 토스트
  matchingSuccess: (count: number, matchingScore: number) =>
    toast.success("🎯 매칭 완료!", {
      description: `${count}개의 서비스가 발견되었습니다 (최고 매칭률: ${matchingScore}%)`,
      className: "korean-text",
      duration: 5000,
      style: {
        background: "linear-gradient(135deg, #3B82F6 0%, #10B981 100%)",
        color: "white",
        border: "none",
      },
    }),

  // 결제 성공 토스트
  paymentSuccess: (amount: number, serviceName: string) =>
    toast.success("💳 결제 완료!", {
      description: `${serviceName} 서비스 예약이 완료되었습니다 (${amount.toLocaleString()}원)`,
      className: "korean-text",
      duration: 5000,
      style: {
        background: "#10B981",
        color: "white",
        border: "none",
      },
      action: {
        label: "예약 확인",
        onClick: () => console.log("예약 확인 클릭됨"),
      },
    }),

  // 예약 확인 토스트
  bookingConfirm: (providerName: string, date: string) =>
    toast.success("📅 예약 확정!", {
      description: `${providerName}님과의 서비스가 ${date}에 예약되었습니다`,
      className: "korean-text",
      duration: 6000,
      style: {
        background: "#10B981",
        color: "white",
        border: "none",
      },
    }),

  // 리뷰 작성 완료 토스트
  reviewSubmitted: (rating: number) =>
    toast.success("⭐ 리뷰 등록 완료!", {
      description: `${rating}점 리뷰가 성공적으로 등록되었습니다`,
      className: "korean-text",
      duration: 4000,
      style: {
        background: "#F59E0B",
        color: "white",
        border: "none",
      },
    }),

  // 보증금 환불 토스트
  depositRefund: (amount: number) =>
    toast.success("💰 보증금 환불!", {
      description: `서비스 완료로 보증금 ${amount.toLocaleString()}원이 환불되었습니다`,
      className: "korean-text",
      duration: 5000,
      style: {
        background: "#10B981",
        color: "white",
        border: "none",
      },
    }),

  // 인증 완료 토스트
  verificationComplete: (type: string) =>
    toast.success("✅ 인증 완료!", {
      description: `${type} 인증이 성공적으로 완료되었습니다`,
      className: "korean-text",
      duration: 4000,
      style: {
        background: "#3B82F6",
        color: "white",
        border: "none",
      },
    }),

  // 연결 실패 토스트
  connectionError: () =>
    toast.error("🌐 연결 오류", {
      description: "네트워크 연결을 확인하고 다시 시도해주세요",
      className: "korean-text",
      duration: 4000,
      style: {
        background: "#EF4444",
        color: "white",
        border: "none",
      },
      action: {
        label: "재시도",
        onClick: () => window.location.reload(),
      },
    }),

  // 로그인 필요 토스트
  loginRequired: () =>
    toast.warning("🔒 로그인 필요", {
      description: "이 기능을 사용하려면 먼저 로그인해주세요",
      className: "korean-text",
      duration: 4000,
      style: {
        background: "#F59E0B",
        color: "white",
        border: "none",
      },
      action: {
        label: "로그인",
        onClick: () => console.log("로그인 페이지로 이동"),
      },
    }),

  // 권한 부족 토스트
  unauthorized: () =>
    toast.error("🚫 권한 부족", {
      description: "이 작업을 수행할 권한이 없습니다",
      className: "korean-text",
      duration: 4000,
      style: {
        background: "#EF4444",
        color: "white",
        border: "none",
      },
    }),

  // 파일 업로드 성공 토스트
  uploadSuccess: (fileName: string) =>
    toast.success("📁 업로드 완료!", {
      description: `${fileName} 파일이 성공적으로 업로드되었습니다`,
      className: "korean-text",
      duration: 3000,
      style: {
        background: "#10B981",
        color: "white",
        border: "none",
      },
    }),

  // 파일 업로드 실패 토스트
  uploadError: (error: string) =>
    toast.error("📁 업로드 실패", {
      description: error || "파일 업로드 중 오류가 발생했습니다",
      className: "korean-text",
      duration: 4000,
      style: {
        background: "#EF4444",
        color: "white",
        border: "none",
      },
    }),

  // 즐겨찾기 추가 토스트
  bookmarkAdded: (serviceName: string) =>
    toast.success("🔖 북마크 추가!", {
      description: `${serviceName} 서비스가 즐겨찾기에 추가되었습니다`,
      className: "korean-text",
      duration: 3000,
      style: {
        background: "#8B5CF6",
        color: "white",
        border: "none",
      },
    }),

  // 복사 완료 토스트
  copySuccess: (text: string) =>
    toast.success("📋 복사 완료!", {
      description: `${text}가 클립보드에 복사되었습니다`,
      className: "korean-text",
      duration: 2000,
      style: {
        background: "#6B7280",
        color: "white",
        border: "none",
      },
    }),

  // 로딩 토스트 (promise 기반)
  loading: (message: string, promise: Promise<any>) =>
    toast.promise(promise, {
      loading: message,
      success: (data) => "작업이 완료되었습니다!",
      error: (error) => `오류 발생: ${error.message}`,
      className: "korean-text",
    }),

  // 사용자 정의 토스트
  custom: (message: string, options?: {
    description?: string
    duration?: number
    style?: React.CSSProperties
    action?: {
      label: string
      onClick: () => void
    }
  }) =>
    toast(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      className: "korean-text",
      style: options?.style,
      action: options?.action,
    }),
}

export { Toaster, proveeToast, toast }