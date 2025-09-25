import { typedSupabase } from './supabase'
import type { Database } from '@/types/supabase'

type ServiceCategory = Database['public']['Enums']['service_category']
type Expert = Database['public']['Tables']['experts']['Row']
type ServiceRequest = Database['public']['Tables']['service_requests']['Row']

// MVP 매칭 알고리즘 - 규칙 기반 (PRD 요구사항)
export interface MatchingRequest {
  category: ServiceCategory
  location: string
  budgetMin: number
  budgetMax: number
  description: string
}

export interface MatchedExpert extends Expert {
  matchScore: number
  serviceScore: number
  locationScore: number
  priceScore: number
  profile: {
    name: string
    district: string | null
  }
}

class MatchingService {
  // 서비스 매칭 점수 계산 (60점 만점)
  private calculateServiceScore(
    requestCategory: ServiceCategory,
    expertCategories: ServiceCategory[] | null
  ): number {
    if (!expertCategories || expertCategories.length === 0) return 0

    // 완전 일치
    if (expertCategories.includes(requestCategory)) {
      return 60
    }

    // 유사 분야 (현재는 구현하지 않음)
    return 0
  }

  // 지역 매칭 점수 계산 (25점 만점)
  private calculateLocationScore(
    requestLocation: string,
    expertLocation: string
  ): number {
    // 정확한 매칭을 위해 구/군 단위로 비교
    const requestDistrict = this.extractDistrict(requestLocation)
    const expertDistrict = this.extractDistrict(expertLocation)

    // 같은 구/군
    if (requestDistrict === expertDistrict) {
      return 25
    }

    // 같은 시/도 (서울 내)
    if (requestLocation.includes('서울') && expertLocation.includes('서울')) {
      return 15
    }

    // 인접 지역 판단 (추후 구현)
    return 0
  }

  // 지역에서 구/군 추출
  private extractDistrict(location: string): string {
    const districts = ['강남구', '강북구', '서초구', '송파구', '영등포구', '마포구', '종로구', '중구', '용산구']
    for (const district of districts) {
      if (location.includes(district)) {
        return district
      }
    }
    return location
  }

  // 가격 매칭 점수 계산 (15점 만점)
  private calculatePriceScore(
    requestBudgetMin: number,
    requestBudgetMax: number,
    expertPriceMin: number,
    expertPriceMax: number
  ): number {
    // 예산 범위와 전문가 가격대가 겹치는지 확인
    const budgetOverlap = Math.max(0,
      Math.min(requestBudgetMax, expertPriceMax) - Math.max(requestBudgetMin, expertPriceMin)
    )

    if (budgetOverlap > 0) {
      // 완전히 범위 내
      if (expertPriceMin >= requestBudgetMin && expertPriceMax <= requestBudgetMax) {
        return 15
      }
      // 부분적으로 겹침
      return 15
    }

    // 20% 이내 초과
    if (expertPriceMin <= requestBudgetMax * 1.2) {
      return 7
    }

    return 0
  }

  // 전체 매칭 점수 계산
  private calculateTotalScore(
    serviceScore: number,
    locationScore: number,
    priceScore: number
  ): number {
    return serviceScore + locationScore + priceScore
  }

  // 전문가 매칭 수행
  async findMatches(request: MatchingRequest): Promise<MatchedExpert[]> {
    try {
      // 활성 전문가 조회 (verified = true, is_available = true)
      const { data: experts, error } = await typedSupabase
        .from('experts')
        .select(`
          *,
          profiles!inner (
            name,
            district
          )
        `)
        .eq('verified', true)
        .eq('is_available', true)

      if (error) {
        console.error('Error fetching experts:', error)
        return []
      }

      if (!experts || experts.length === 0) {
        return []
      }

      // 각 전문가에 대해 매칭 점수 계산
      const scoredExperts = experts
        .map((expert) => {
          const serviceScore = this.calculateServiceScore(
            request.category,
            expert.category
          )

          const locationScore = this.calculateLocationScore(
            request.location,
            expert.location
          )

          const priceScore = this.calculatePriceScore(
            request.budgetMin,
            request.budgetMax,
            expert.price_min,
            expert.price_max
          )

          const totalScore = this.calculateTotalScore(
            serviceScore,
            locationScore,
            priceScore
          )

          return {
            ...expert,
            matchScore: totalScore,
            serviceScore,
            locationScore,
            priceScore,
            profile: expert.profiles
          }
        })
        .filter(expert => expert.matchScore >= 50) // 50점 이상만
        .sort((a, b) => b.matchScore - a.matchScore) // 점수 높은 순 정렬
        .slice(0, 5) // 최대 5명만

      return scoredExperts as MatchedExpert[]

    } catch (error) {
      console.error('Matching service error:', error)
      return []
    }
  }

  // 서비스 요청 저장 (Supabase에 저장하고 자동 매칭 트리거)
  async createServiceRequest(
    customerId: string,
    request: MatchingRequest
  ): Promise<string | null> {
    try {
      const { data, error } = await typedSupabase
        .from('service_requests')
        .insert({
          customer_id: customerId,
          title: `${request.category} 서비스 요청`,
          description: request.description,
          category: request.category,
          location: request.location,
          budget_min: request.budgetMin,
          budget_max: request.budgetMax,
          status: 'pending'
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error creating service request:', error)
        return null
      }

      return data.id
    } catch (error) {
      console.error('Service request creation error:', error)
      return null
    }
  }

  // 매칭 결과 조회 (요청 ID로)
  async getMatchesByRequestId(requestId: string): Promise<MatchedExpert[]> {
    try {
      const { data: matches, error } = await typedSupabase
        .from('matches')
        .select(`
          *,
          experts!inner (
            *,
            profiles!inner (
              name,
              district
            )
          )
        `)
        .eq('request_id', requestId)
        .gte('match_score', 50)
        .order('match_score', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Error fetching matches:', error)
        return []
      }

      if (!matches) return []

      return matches.map(match => ({
        ...match.experts,
        matchScore: match.match_score,
        serviceScore: match.service_score || 0,
        locationScore: match.location_score || 0,
        priceScore: match.price_score || 0,
        profile: match.experts.profiles
      }))

    } catch (error) {
      console.error('Error fetching matches:', error)
      return []
    }
  }
}

export const matchingService = new MatchingService()