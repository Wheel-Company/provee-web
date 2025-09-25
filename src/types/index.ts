// Provee 플랫폼 타입 정의

export interface User {
  id: string
  email: string
  phone: string
  name: string
  role: 'customer' | 'provider'
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Customer extends User {
  role: 'customer'
  depositPaid: boolean // 1만원 보증금
  depositAmount: number
}

export interface ServiceProvider extends User {
  role: 'provider'
  depositPaid: boolean // 5-10만원 보증금
  depositAmount: number
  verification: {
    phone: boolean
    identity: boolean
    business?: boolean
  }
  profile: ProviderProfile
}

export interface ProviderProfile {
  id: string
  providerId: string
  title: string
  description: string
  specializations: string[]
  experience: number // 년
  portfolio: Portfolio[]
  rating: number // 1-5
  reviewCount: number
  avatar?: string
  priceRange: {
    min: number
    max: number
  }
  location: {
    city: string
    district: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  availableHours: string[]
  responseTime: number // 평균 응답시간 (시간)
}

export interface Portfolio {
  id: string
  title: string
  description: string
  images: string[]
  completedAt: Date
  category: string
}

export interface ServiceRequest {
  id: string
  customerId: string
  title: string
  description: string
  category: string
  budget: {
    min: number
    max: number
  }
  location: {
    city: string
    district: string
    address?: string
  }
  preferredSchedule: {
    startDate: Date
    endDate?: Date
    timeSlots: string[]
  }
  attachments: string[]
  status: 'draft' | 'submitted' | 'matching' | 'matched' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface MatchingResult {
  id: string
  requestId: string
  providerId: string
  compatibilityScore: number
  breakdown: {
    serviceCompatibility: number    // 50%
    priceCompatibility: number      // 20%
    locationTimeCompatibility: number // 15%
    reputationIndex: number         // 15%
  }
  aiAnalysis: string
  status: 'pending' | 'accepted' | 'declined' | 'completed'
  createdAt: Date
}

export interface Subscription {
  id: string
  userId: string
  plan: 'customer' | 'provider' // 9,900원 vs 19,900원
  status: 'active' | 'cancelled' | 'expired'
  startDate: Date
  endDate: Date
  autoRenewal: boolean
}

export interface TrustIndicators {
  depositStatus: 'paid' | 'pending' | 'none'
  verificationLevel: 'phone' | 'identity' | 'business'
  platformRating: number
  successRate: number // 매칭 성공률
}

export interface AIMatchingParams {
  requestId: string
  maxResults: number
  minCompatibilityScore: number // 70% 이상만
  filters?: {
    priceRange?: { min: number; max: number }
    location?: { maxDistance: number }
    rating?: { min: number }
  }
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 페이지네이션
export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

// 한국 특화 타입
export interface KoreanAddress {
  roadAddress: string    // 도로명주소
  jibunAddress: string   // 지번주소
  zipCode: string        // 우편번호
  city: string          // 시/도
  district: string      // 시/구/군
  neighborhood: string  // 동/면/리
}