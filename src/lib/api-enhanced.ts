// Enhanced API functions for expert detail features
import { supabaseClient } from './supabase-client'
import type { Database } from '@/types/supabase'

type Tables = Database['public']['Tables']
type ExpertProfile = Tables['experts']['Row']

// Types for API responses
interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

// Enhanced Expert interface with all detail data
interface EnhancedExpert extends ExpertProfile {
  certifications?: any[]
  faqs?: any[]
  portfolio?: any[]
  service_areas?: any[]
  reviews?: any[]
  work_process?: any[]
}

export class EnhancedProveeAPI {
  // Get Expert Details with all related data
  static async getExpertDetails(expertId: string): Promise<ApiResponse<EnhancedExpert>> {
    try {
      // Get basic expert data with profile information
      const { data: expertData, error: expertError } = await supabaseClient
        .from('experts')
        .select(`
          *,
          profiles(
            id,
            username,
            name,
            phone,
            email,
            user_type
          )
        `)
        .eq('id', expertId)
        .single()

      if (expertError || !expertData) {
        return {
          data: null,
          error: expertError?.message || 'Expert not found',
          success: false
        }
      }

      console.log('Expert data from DB:', expertData)

      // Try to get real data first, fall back to mock data
      const certifications = await this.getCertifications(expertId) || this.getMockCertifications(expertData.category?.[0])
      const faqs = await this.getFAQs(expertId) || this.getMockFAQs(expertData.category?.[0])
      const portfolio = await this.getPortfolio(expertId) || (expertData.portfolio_images?.length ? expertData.portfolio_images : this.getMockPortfolio(expertData.category?.[0]))
      const service_areas = await this.getServiceAreas(expertId) || this.getMockServiceAreas(expertData.location)
      const reviews = await this.getReviews(expertId) || this.getMockReviews(expertData.id, expertData.category?.[0])
      const work_process = await this.getWorkProcess(expertId) || this.getMockWorkProcess(expertData.category?.[0])

      // Combine all data
      const enrichedExpert = {
        ...expertData,
        // Add profile name if available
        name: expertData.profiles?.name || expertData.profiles?.username || `전문가 ${expertId.slice(-4)}`,
        certifications,
        faqs,
        portfolio,
        service_areas,
        reviews,
        work_process
      }

      return {
        data: enrichedExpert as EnhancedExpert,
        error: null,
        success: true
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  // Mock data generators for expert details
  private static getMockCertifications(category?: string) {
    const certificationMap: Record<string, any[]> = {
      '청소': [
        { name: '건물청소관리사 자격증', issuer: '한국산업인력공단', type: 'professional', verified: true },
        { name: '환경관리기사', issuer: '한국산업인력공단', type: 'professional', verified: true },
        { name: '신원 인증 완료', issuer: 'Provee', type: 'platform', verified: true }
      ],
      '수리': [
        { name: '전기기능사 자격증', issuer: '한국산업인력공단', type: 'professional', verified: true },
        { name: '가전제품수리기능사', issuer: '한국산업인력공단', type: 'professional', verified: true },
        { name: '신원 인증 완료', issuer: 'Provee', type: 'platform', verified: true }
      ],
      '과외': [
        { name: 'TESOL 자격증', issuer: 'TESOL International', type: 'professional', verified: true },
        { name: 'TOEIC 990점', issuer: 'ETS', type: 'professional', verified: true },
        { name: '신원 인증 완료', issuer: 'Provee', type: 'platform', verified: true }
      ],
      '디자인': [
        { name: '시각디자인기사', issuer: '한국산업인력공단', type: 'professional', verified: true },
        { name: '웹디자인기능사', issuer: '한국산업인력공단', type: 'professional', verified: true },
        { name: '신원 인증 완료', issuer: 'Provee', type: 'platform', verified: true }
      ]
    }
    return certificationMap[category || ''] || []
  }

  private static getMockFAQs(category?: string) {
    const faqMap: Record<string, any[]> = {
      '청소': [
        {
          question: '청소에 사용되는 세제는 어떤 것인가요?',
          answer: '친환경 세제를 사용하며, 아이나 반려동물이 있는 가정에서도 안전하게 사용할 수 있는 제품들입니다.'
        },
        {
          question: '청소 시간은 얼마나 걸리나요?',
          answer: '일반적인 가정집(30평 기준)의 경우 3-4시간 정도 소요되며, 집의 크기와 상태에 따라 달라질 수 있습니다.'
        },
        {
          question: '청소 도구는 누가 준비하나요?',
          answer: '모든 청소 도구와 세제는 제가 직접 준비해서 가져갑니다. 별도로 준비하실 것은 없습니다.'
        }
      ],
      '수리': [
        {
          question: '어떤 브랜드의 제품을 수리할 수 있나요?',
          answer: '삼성, LG, 대우, 위니아 등 국내외 대부분의 브랜드 제품 수리가 가능합니다.'
        },
        {
          question: '수리 후 A/S는 어떻게 되나요?',
          answer: '수리 완료 후 3개월간 무상 A/S를 제공하며, 같은 부위 재고장 시 무료로 재수리해드립니다.'
        },
        {
          question: '부품 교체가 필요한 경우 비용은 어떻게 되나요?',
          answer: '부품비는 별도이며, 수리 전 정확한 견적을 제시하고 고객 동의 후 진행합니다.'
        }
      ],
      '과외': [
        {
          question: '수업은 어떤 방식으로 진행되나요?',
          answer: '학생의 수준과 목표에 맞는 맞춤형 커리큘럼으로 1:1 개인 지도를 진행합니다.'
        },
        {
          question: '교재는 어떤 것을 사용하나요?',
          answer: '학생의 학교 교재를 기본으로 하고, 필요에 따라 추가 교재를 제공합니다.'
        },
        {
          question: '수업 취소는 언제까지 가능한가요?',
          answer: '수업 시작 2시간 전까지 취소 가능하며, 그 이후에는 수업료가 차감됩니다.'
        }
      ],
      '디자인': [
        {
          question: '디자인 수정은 몇 번까지 가능한가요?',
          answer: '초안 제시 후 3회까지 무료 수정이 가능하며, 그 이후에는 추가 비용이 발생합니다.'
        },
        {
          question: '작업 기간은 얼마나 걸리나요?',
          answer: '로고 디자인의 경우 7-10일, 웹디자인은 프로젝트 규모에 따라 2-4주 정도 소요됩니다.'
        },
        {
          question: '완성된 파일은 어떤 형태로 받을 수 있나요?',
          answer: 'AI, PSD, PNG, JPG 등 요청하신 모든 형태의 파일로 제공해드립니다.'
        }
      ]
    }
    return faqMap[category || ''] || []
  }

  private static getMockServiceAreas(location?: string) {
    const areaMap: Record<string, any[]> = {
      '강남구': [
        { area_name: '강남구', is_primary: true, travel_fee: 0, travel_time_minutes: 20 },
        { area_name: '서초구', is_primary: false, travel_fee: 5000, travel_time_minutes: 30 },
        { area_name: '송파구', is_primary: false, travel_fee: 7000, travel_time_minutes: 40 },
        { area_name: '성동구', is_primary: false, travel_fee: 10000, travel_time_minutes: 50 }
      ],
      '서초구': [
        { area_name: '서초구', is_primary: true, travel_fee: 0, travel_time_minutes: 20 },
        { area_name: '강남구', is_primary: false, travel_fee: 5000, travel_time_minutes: 25 },
        { area_name: '동작구', is_primary: false, travel_fee: 3000, travel_time_minutes: 20 },
        { area_name: '관악구', is_primary: false, travel_fee: 8000, travel_time_minutes: 45 }
      ],
      '송파구': [
        { area_name: '송파구', is_primary: true, travel_fee: 0, travel_time_minutes: 20 },
        { area_name: '강동구', is_primary: false, travel_fee: 3000, travel_time_minutes: 15 },
        { area_name: '강남구', is_primary: false, travel_fee: 7000, travel_time_minutes: 35 },
        { area_name: '서초구', is_primary: false, travel_fee: 8000, travel_time_minutes: 40 }
      ],
      '마포구': [
        { area_name: '마포구', is_primary: true, travel_fee: 0, travel_time_minutes: 20 },
        { area_name: '서대문구', is_primary: false, travel_fee: 5000, travel_time_minutes: 25 },
        { area_name: '중구', is_primary: false, travel_fee: 3000, travel_time_minutes: 20 },
        { area_name: '종로구', is_primary: false, travel_fee: 7000, travel_time_minutes: 35 }
      ],
      '용산구': [
        { area_name: '용산구', is_primary: true, travel_fee: 0, travel_time_minutes: 20 },
        { area_name: '서대문구', is_primary: false, travel_fee: 5000, travel_time_minutes: 25 },
        { area_name: '중구', is_primary: false, travel_fee: 3000, travel_time_minutes: 20 },
        { area_name: '종로구', is_primary: false, travel_fee: 7000, travel_time_minutes: 35 }
      ]
    }

    // Extract district from location string
    const district = location?.split(' ').find(part => part.includes('구')) || ''
    return areaMap[district] || [
      { area_name: location || '서울시', is_primary: true, travel_fee: 0, travel_time_minutes: 20 }
    ]
  }

  private static getMockPortfolio(category?: string) {
    const portfolioMap: Record<string, string[]> = {
      '청소': [
        'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800',
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
        'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800'
      ],
      '수리': [
        'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800',
        'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800',
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800'
      ],
      '과외': [
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800'
      ],
      '디자인': [
        'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800',
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800',
        'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800'
      ]
    }
    return portfolioMap[category || ''] || portfolioMap['청소']
  }

  private static getMockReviews(expertId?: string, category?: string) {
    const reviewsByCategory: Record<string, any[]> = {
      '청소': [
        {
          id: '1',
          rating: 5,
          comment: '정말 꼼꼼하게 청소해주셨어요. 깨끗함에 감동했습니다. 다음에도 꼭 부탁드리고 싶어요!',
          service_type: '홈클리닝',
          author: '김**',
          date: '2024-09-20',
          is_anonymous: true,
          created_at: '2024-09-20T00:00:00Z'
        },
        {
          id: '2',
          rating: 5,
          comment: '시간 약속도 잘 지키시고 청소 실력이 정말 뛰어나세요. 추천합니다!',
          service_type: '입주청소',
          author: '이**',
          date: '2024-09-15',
          is_anonymous: true,
          created_at: '2024-09-15T00:00:00Z'
        }
      ],
      '수리': [
        {
          id: '1',
          rating: 5,
          comment: '에어컨 수리 정말 빨리 해주셨어요. 기술력이 뛰어나시네요!',
          service_type: '에어컨 수리',
          author: '박**',
          date: '2024-09-18',
          is_anonymous: true,
          created_at: '2024-09-18T00:00:00Z'
        },
        {
          id: '2',
          rating: 4,
          comment: '친절하시고 설명도 잘 해주셔서 좋았어요. 가격도 합리적입니다.',
          service_type: '세탁기 수리',
          author: '최**',
          date: '2024-09-12',
          is_anonymous: true,
          created_at: '2024-09-12T00:00:00Z'
        }
      ],
      '과외': [
        {
          id: '1',
          rating: 5,
          comment: '아이가 수학을 정말 좋아하게 되었어요. 선생님이 너무 잘 가르쳐주세요!',
          service_type: '초등수학 과외',
          author: '홍**',
          date: '2024-09-22',
          is_anonymous: true,
          created_at: '2024-09-22T00:00:00Z'
        },
        {
          id: '2',
          rating: 5,
          comment: '체계적이고 꼼꼼하게 가르쳐주셔서 성적이 많이 올랐습니다.',
          service_type: '고등영어 과외',
          author: '정**',
          date: '2024-09-10',
          is_anonymous: true,
          created_at: '2024-09-10T00:00:00Z'
        }
      ],
      '디자인': [
        {
          id: '1',
          rating: 5,
          comment: '로고 디자인이 정말 마음에 들어요. 센스가 뛰어나시네요!',
          service_type: '로고 디자인',
          author: '서**',
          date: '2024-09-25',
          is_anonymous: true,
          created_at: '2024-09-25T00:00:00Z'
        }
      ]
    }

    const reviews = reviewsByCategory[category || '청소'] || reviewsByCategory['청소']
    return reviews
  }

  private static getMockWorkProcess(category?: string) {
    const processMap: Record<string, any[]> = {
      '청소': [
        { step: 1, title: '현장 상담 및 견적', description: '방문하여 청소 범위를 확인하고 정확한 견적을 제시합니다.', icon: '📋' },
        { step: 2, title: '청소 도구 준비', description: '전문 청소 도구와 친환경 세제를 준비합니다.', icon: '🧽' },
        { step: 3, title: '체계적 청소 진행', description: '거실→침실→주방→화장실 순서로 체계적으로 청소합니다.', icon: '✨' },
        { step: 4, title: '마무리 점검', description: '고객과 함께 청소 결과를 점검하고 피드백을 받습니다.', icon: '✅' }
      ],
      '수리': [
        { step: 1, title: '고장 진단', description: '정확한 고장 원인을 파악하고 수리 방법을 결정합니다.', icon: '🔍' },
        { step: 2, title: '견적 제시', description: '수리 비용과 부품비를 포함한 상세 견적을 제시합니다.', icon: '💰' },
        { step: 3, title: '수리 진행', description: '전문 장비를 사용하여 안전하고 정확하게 수리합니다.', icon: '🔧' },
        { step: 4, title: 'A/S 안내', description: '수리 후 3개월 무상 A/S 및 사용법을 안내합니다.', icon: '🛡️' }
      ],
      '과외': [
        { step: 1, title: '수준 진단', description: '학습자의 현재 실력과 목표를 파악하여 개인별 커리큘럼을 설계합니다.', icon: '📊' },
        { step: 2, title: '맞춤 교육', description: '학습자의 페이스에 맞춰 개념 설명과 문제 풀이를 진행합니다.', icon: '📚' },
        { step: 3, title: '과제 관리', description: '수업 내용을 바탕으로 한 과제를 제시하고 피드백을 제공합니다.', icon: '✍️' },
        { step: 4, title: '성과 점검', description: '정기적인 모의고사를 통해 학습 진도와 성취도를 확인합니다.', icon: '📈' }
      ],
      '디자인': [
        { step: 1, title: '브리핑 & 기획', description: '클라이언트의 요구사항과 브랜드 콘셉트를 파악합니다.', icon: '💡' },
        { step: 2, title: '초안 제작', description: '2-3개의 디자인 초안을 제작하여 방향성을 제시합니다.', icon: '✏️' },
        { step: 3, title: '수정 보완', description: '피드백을 바탕으로 3회까지 무료 수정을 진행합니다.', icon: '🔄' },
        { step: 4, title: '최종 완성', description: '모든 파일 형태로 최종 완성본을 제공합니다.', icon: '🎨' }
      ]
    }
    return processMap[category || ''] || []
  }

  // Real data fetching methods (will return null if tables don't exist)
  private static async getCertifications(expertId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('expert_certifications')
        .select('*')
        .eq('expert_id', expertId)
        .order('created_at', { ascending: false })

      if (error) {
        console.log('Certifications table not found, using mock data')
        return null
      }
      console.log('✅ Real certifications data loaded:', data?.length || 0, 'items')
      return data
    } catch {
      return null
    }
  }

  private static async getFAQs(expertId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('expert_faqs')
        .select('*')
        .eq('expert_id', expertId)
        .order('display_order', { ascending: true })

      if (error) {
        console.log('FAQs table not found, using mock data')
        return null
      }
      console.log('✅ Real FAQs data loaded:', data?.length || 0, 'items')
      return data
    } catch {
      return null
    }
  }

  private static async getPortfolio(expertId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('expert_portfolio')
        .select('*')
        .eq('expert_id', expertId)
        .order('display_order', { ascending: true })

      if (error) {
        console.log('Portfolio table not found, using mock data')
        return null
      }
      console.log('✅ Real portfolio data loaded:', data?.length || 0, 'items')
      return data?.map(item => item.image_url)
    } catch {
      return null
    }
  }

  private static async getServiceAreas(expertId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('expert_service_areas')
        .select('*')
        .eq('expert_id', expertId)
        .order('is_primary', { ascending: false })

      if (error) {
        console.log('Service areas table not found, using mock data')
        return null
      }
      console.log('✅ Real service areas data loaded:', data?.length || 0, 'items')
      return data
    } catch {
      return null
    }
  }

  private static async getReviews(expertId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('reviews')
        .select(`
          *,
          profiles(name, username)
        `)
        .eq('expert_id', expertId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.log('Reviews table not found, using mock data')
        return null
      }
      console.log('✅ Real reviews data loaded:', data?.length || 0, 'items')
      return data?.map(review => ({
        ...review,
        author: review.is_anonymous ? '익명' : (review.profiles?.name || review.profiles?.username || '익명'),
        date: new Date(review.created_at).toLocaleDateString('ko-KR')
      }))
    } catch {
      return null
    }
  }

  private static async getWorkProcess(expertId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('expert_work_process')
        .select('*')
        .eq('expert_id', expertId)
        .order('step_number', { ascending: true })

      if (error) {
        console.log('Work process table not found, using mock data')
        return null
      }
      console.log('✅ Real work process data loaded:', data?.length || 0, 'items')
      return data?.map(step => ({
        step: step.step_number,
        title: step.title,
        description: step.description,
        icon: step.icon || '⚡'
      }))
    } catch {
      return null
    }
  }

  // CRUD operations for expert data management
  static async saveCertifications(expertId: string, certifications: any[]): Promise<ApiResponse<any>> {
    try {
      // Delete existing certifications
      await supabaseClient
        .from('expert_certifications')
        .delete()
        .eq('expert_id', expertId)

      // Insert new certifications
      if (certifications.length > 0) {
        const { data, error } = await supabaseClient
          .from('expert_certifications')
          .insert(certifications.map(cert => ({
            expert_id: expertId,
            name: cert.name,
            issuer: cert.issuer,
            type: cert.type,
            verified: cert.verified
          })))

        if (error) throw error
      }

      return { data: null, error: null, success: true }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to save certifications',
        success: false
      }
    }
  }

  static async saveFAQs(expertId: string, faqs: any[]): Promise<ApiResponse<any>> {
    try {
      // Delete existing FAQs
      await supabaseClient
        .from('expert_faqs')
        .delete()
        .eq('expert_id', expertId)

      // Insert new FAQs
      if (faqs.length > 0) {
        const { data, error } = await supabaseClient
          .from('expert_faqs')
          .insert(faqs.map(faq => ({
            expert_id: expertId,
            question: faq.question,
            answer: faq.answer,
            display_order: faq.display_order
          })))

        if (error) throw error
      }

      return { data: null, error: null, success: true }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to save FAQs',
        success: false
      }
    }
  }

  static async saveServiceAreas(expertId: string, serviceAreas: any[]): Promise<ApiResponse<any>> {
    try {
      // Delete existing service areas
      await supabaseClient
        .from('expert_service_areas')
        .delete()
        .eq('expert_id', expertId)

      // Insert new service areas
      if (serviceAreas.length > 0) {
        const { data, error } = await supabaseClient
          .from('expert_service_areas')
          .insert(serviceAreas.map(area => ({
            expert_id: expertId,
            area_name: area.area_name,
            is_primary: area.is_primary,
            travel_fee: area.travel_fee,
            travel_time_minutes: area.travel_time_minutes
          })))

        if (error) throw error
      }

      return { data: null, error: null, success: true }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to save service areas',
        success: false
      }
    }
  }

  static async saveWorkProcess(expertId: string, workProcess: any[]): Promise<ApiResponse<any>> {
    try {
      // Delete existing work process
      await supabaseClient
        .from('expert_work_process')
        .delete()
        .eq('expert_id', expertId)

      // Insert new work process
      if (workProcess.length > 0) {
        const { data, error } = await supabaseClient
          .from('expert_work_process')
          .insert(workProcess.map(step => ({
            expert_id: expertId,
            step_number: step.step_number,
            title: step.title,
            description: step.description,
            icon: step.icon
          })))

        if (error) throw error
      }

      return { data: null, error: null, success: true }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to save work process',
        success: false
      }
    }
  }

  static async savePortfolio(expertId: string, portfolioItems: any[]): Promise<ApiResponse<any>> {
    try {
      // Delete existing portfolio
      await supabaseClient
        .from('expert_portfolio')
        .delete()
        .eq('expert_id', expertId)

      // Insert new portfolio
      if (portfolioItems.length > 0) {
        const { data, error } = await supabaseClient
          .from('expert_portfolio')
          .insert(portfolioItems.map((item, index) => ({
            expert_id: expertId,
            image_url: item.image_url,
            title: item.title || '',
            description: item.description || '',
            category: item.category || 'work',
            display_order: index + 1
          })))

        if (error) throw error
      }

      return { data: null, error: null, success: true }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to save portfolio',
        success: false
      }
    }
  }

  // Review submission
  static async submitReview(expertId: string, reviewData: {
    customer_id: string
    rating: number
    comment: string
    service_type: string
    is_anonymous: boolean
  }): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabaseClient
        .from('reviews')
        .insert({
          expert_id: expertId,
          customer_id: reviewData.customer_id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          service_type: reviewData.service_type,
          is_anonymous: reviewData.is_anonymous
        })

      if (error) throw error

      return { data, error: null, success: true }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to submit review',
        success: false
      }
    }
  }

  // Get reviews for a specific expert (with pagination)
  static async getExpertReviews(expertId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<any>> {
    try {
      const offset = (page - 1) * limit

      const { data, error, count } = await supabaseClient
        .from('reviews')
        .select(`
          *,
          profiles(name, username)
        `, { count: 'exact' })
        .eq('expert_id', expertId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      const reviews = data?.map(review => ({
        ...review,
        author: review.is_anonymous ? '익명' : (review.profiles?.name || review.profiles?.username || '익명'),
        date: new Date(review.created_at).toLocaleDateString('ko-KR')
      }))

      return {
        data: {
          reviews: reviews || [],
          total: count || 0,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        },
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get reviews',
        success: false
      }
    }
  }

  // Update review (customer can edit their own review)
  static async updateReview(reviewId: string, updates: {
    rating?: number
    comment?: string
    service_type?: string
  }): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabaseClient
        .from('reviews')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)

      if (error) throw error

      return { data, error: null, success: true }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update review',
        success: false
      }
    }
  }

  // Search experts with filters
  static async searchExperts(filters: {
    category?: string
    location?: { city?: string }
    query?: string
    page?: number
    limit?: number
  } = {}): Promise<ApiResponse<any[]>> {
    try {
      const page = filters.page || 1
      const limit = filters.limit || 20
      const offset = (page - 1) * limit

      let query = supabaseClient
        .from('experts')
        .select(`
          *,
          profiles(
            id,
            username,
            name,
            phone,
            email,
            user_type
          )
        `)
        .eq('is_available', true)

      // Apply category filter
      if (filters.category && filters.category !== '전체') {
        query = query.contains('category', [filters.category])
      }

      // Apply location filter
      if (filters.location?.city && filters.location.city !== '전국') {
        query = query.ilike('location', `%${filters.location.city}%`)
      }

      // Execute query with pagination
      const { data: experts, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Search experts error:', error)
        throw error
      }

      // Transform data to match search page interface
      const transformedExperts = experts?.map(expert => ({
        id: expert.id,
        name: expert.profiles?.name || expert.profiles?.username || `전문가 ${expert.id.slice(-4)}`,
        category: expert.category || [],
        services: this.extractServicesFromCategory(expert.category),
        rating: expert.rating || 4.0 + Math.random() * 1.0, // Mock rating
        review_count: expert.review_count || Math.floor(Math.random() * 100),
        completed_projects: expert.completed_projects || Math.floor(Math.random() * 50),
        location: expert.location || '서울',
        description: expert.description || '전문적인 서비스를 제공합니다.',
        response_time_hours: expert.response_time_hours || 24,
        verified: expert.verified || true,
        is_available: expert.is_available,
        price_min: expert.hourly_rate ? expert.hourly_rate * 0.8 : 15000,
        price_max: expert.hourly_rate ? expert.hourly_rate * 1.2 : 30000,
        experience_years: expert.experience_years || Math.floor(Math.random() * 10) + 1,
        hourly_rate: expert.hourly_rate || 25000,
        portfolio_images: expert.portfolio_images || []
      })) || []

      // Apply text search filter after transformation
      let filteredExperts = transformedExperts
      if (filters.query?.trim()) {
        const searchTerm = filters.query.toLowerCase()
        filteredExperts = transformedExperts.filter(expert =>
          expert.services.some(service => service.toLowerCase().includes(searchTerm)) ||
          expert.description.toLowerCase().includes(searchTerm) ||
          expert.name.toLowerCase().includes(searchTerm)
        )
      }

      return {
        data: filteredExperts,
        error: null,
        success: true
      }
    } catch (error) {
      console.error('Search experts failed:', error)
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to search experts',
        success: false
      }
    }
  }

  // Helper method to extract services from category
  private static extractServicesFromCategory(categories?: string[]): string[] {
    if (!categories || categories.length === 0) return ['기타 서비스']

    const serviceMap: Record<string, string[]> = {
      '청소': ['홈클리닝', '사무실청소', '입주청소', '이사청소'],
      '수리': ['가전수리', '가구수리', '도배', '타일공사'],
      '과외': ['수학과외', '영어과외', '국어과외', '과학과외'],
      '디자인': ['웹디자인', '그래픽디자인', '로고디자인', '브랜딩'],
      '요리': ['가정요리', '파티요리', '도시락', '케이터링'],
      '운동': ['개인트레이닝', '요가', '필라테스', '홈트레이닝'],
      '음악': ['피아노레슨', '기타레슨', '보컬레슨', '작곡']
    }

    const services: string[] = []
    categories.forEach(category => {
      if (serviceMap[category]) {
        services.push(...serviceMap[category])
      } else {
        services.push(category)
      }
    })

    return services.length > 0 ? services : ['기타 서비스']
  }

  // Request/Quote Management
  static async submitRequest(requestData: {
    customer_id: string
    category: string
    subcategory?: string
    title: string
    description?: string
    location: string
    preferred_date: string
    specific_date?: string
    budget_min?: number
    budget_max?: number
    contact_preference?: string
    details?: any
  }): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabaseClient
        .from('requests')
        .insert({
          customer_id: requestData.customer_id,
          category: requestData.category,
          subcategory: requestData.subcategory,
          title: requestData.title,
          description: requestData.description,
          location: requestData.location,
          preferred_date: requestData.preferred_date,
          specific_date: requestData.specific_date ? new Date(requestData.specific_date).toISOString().split('T')[0] : null,
          budget_min: requestData.budget_min,
          budget_max: requestData.budget_max,
          contact_preference: requestData.contact_preference || 'phone',
          details: requestData.details
        })
        .select()
        .single()

      if (error) throw error

      return {
        data,
        error: null,
        success: true
      }
    } catch (error) {
      console.error('Submit request failed:', error)
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to submit request',
        success: false
      }
    }
  }

  // Get customer requests
  static async getCustomerRequests(customerId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<any>> {
    try {
      const offset = (page - 1) * limit

      const { data, error, count } = await supabaseClient
        .from('requests')
        .select('*', { count: 'exact' })
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return {
        data: {
          requests: data || [],
          total: count || 0,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        },
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get requests',
        success: false
      }
    }
  }

  // Get all requests for experts to browse
  static async getAllRequests(filters: {
    category?: string
    location?: string
    page?: number
    limit?: number
  } = {}): Promise<ApiResponse<any>> {
    try {
      const page = filters.page || 1
      const limit = filters.limit || 20
      const offset = (page - 1) * limit

      let query = supabaseClient
        .from('requests')
        .select(`
          *,
          profiles(
            name,
            username,
            phone
          )
        `, { count: 'exact' })
        .eq('status', 'pending')

      // Apply filters
      if (filters.category && filters.category !== '전체') {
        query = query.eq('category', filters.category)
      }

      if (filters.location && filters.location !== '전국') {
        query = query.ilike('location', `%${filters.location}%`)
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return {
        data: {
          requests: data || [],
          total: count || 0,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        },
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get requests',
        success: false
      }
    }
  }

  // Update request status
  static async updateRequestStatus(requestId: string, status: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabaseClient
        .from('requests')
        .update({ status })
        .eq('id', requestId)
        .select()
        .single()

      if (error) throw error

      return {
        data,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update request status',
        success: false
      }
    }
  }

  // Profile Management
  static async updateProfile(userId: string, updates: {
    name?: string
    username?: string
    phone?: string
    avatar_url?: string
  }): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return {
        data,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update profile',
        success: false
      }
    }
  }

  // Get user profile
  static async getUserProfile(userId: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      return {
        data,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get profile',
        success: false
      }
    }
  }
}