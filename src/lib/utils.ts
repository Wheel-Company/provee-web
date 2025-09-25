import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 한국 통화 포맷
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

// 한국 날짜 포맷
export function formatKoreanDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    separator: '.'
  }).format(date).replace(/\//g, '.')
}

// 휴대폰 번호 포맷
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/)
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }
  return phone
}

// 매칭률 계산 (PRD 기반)
export function calculateMatchingScore(
  serviceCompatibility: number,  // 50%
  priceCompatibility: number,    // 20%
  locationTimeCompatibility: number, // 15%
  reputationIndex: number        // 15%
): number {
  return Math.round(
    serviceCompatibility * 0.5 +
    priceCompatibility * 0.2 +
    locationTimeCompatibility * 0.15 +
    reputationIndex * 0.15
  )
}