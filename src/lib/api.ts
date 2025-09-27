// Provee API Client
// Supabase-based API functions for the Provee platform

import { supabaseClient } from './supabase-client'
import type { Database } from '@/types/supabase'

type Tables = Database['public']['Tables']
type ServiceRequest = Tables['service_requests']['Row']
type ServiceRequestInsert = Tables['service_requests']['Insert']
type ExpertProfile = Tables['experts']['Row'] // Updated to match actual table
type MatchingResult = Tables['matches']['Row'] // Updated to match actual table
type Profile = Tables['profiles']['Row']

// Types for API responses
interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

interface PaginatedResponse<T> {
  data: T[]
  count: number | null
  error: string | null
  success: boolean
}

// Expert search filters
interface ExpertSearchFilters {
  category?: string
  location?: {
    city?: string
    district?: string
  }
  priceRange?: {
    min?: number
    max?: number
  }
  rating?: {
    min?: number
  }
  query?: string
}

// Expert with joined profile data
interface ExpertWithProfile extends ExpertProfile {
  // profiles data is embedded in experts table
}

// Service request with category info
interface ServiceRequestWithCategory extends ServiceRequest {
  // category is an enum field
}

// Matching result with expert info
interface MatchingResultWithExpert extends MatchingResult {
  expert?: ExpertProfile
  request?: ServiceRequest
}

export class ProveeAPI {

  // 1. Service Categories API
  static async getServiceCategories(): Promise<ApiResponse<{name: string, value: Database['public']['Enums']['service_category']}[]>> {
    try {
      // Since categories are enum-based, return static list
      const categories = [
        { name: '청소', value: '청소' as Database['public']['Enums']['service_category'] },
        { name: '수리', value: '수리' as Database['public']['Enums']['service_category'] },
        { name: '과외', value: '과외' as Database['public']['Enums']['service_category'] },
        { name: '디자인', value: '디자인' as Database['public']['Enums']['service_category'] }
      ]

      return {
        data: categories,
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

  // 2. Expert Search API
  static async searchExperts(
    filters: ExpertSearchFilters = {},
    limit = 20,
    offset = 0
  ): Promise<PaginatedResponse<ExpertWithProfile>> {
    try {
      let query = supabaseClient
        .from('experts')
        .select('*')
        .eq('is_available', true)
        .eq('verified', true)

      // Apply filters
      if (filters.category) {
        query = query.contains('category', [filters.category as Database['public']['Enums']['service_category']])
      }

      if (filters.priceRange?.max) {
        query = query.lte('price_min', filters.priceRange.max)
      }

      if (filters.rating?.min) {
        query = query.gte('rating', filters.rating.min)
      }

      // Text search
      if (filters.query) {
        query = query.or(`description.ilike.%${filters.query}%,services.cs.{"${filters.query}"}`)
      }

      if (filters.location?.city) {
        query = query.ilike('location', `%${filters.location.city}%`)
      }

      const { data, error, count } = await query
        .order('rating', { ascending: false })
        .order('review_count', { ascending: false })
        .range(offset, offset + limit - 1)

      return {
        data: data as ExpertWithProfile[] || [],
        count,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: [],
        count: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  // 3. Get Expert Details
  static async getExpertDetails(expertId: string): Promise<ApiResponse<ExpertWithProfile>> {
    try {
      const { data, error } = await supabaseClient
        .from('experts')
        .select('*')
        .eq('id', expertId)
        .eq('is_available', true)
        .single()

      return {
        data: data as ExpertWithProfile || null,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  // 4. Service Requests API
  static async createServiceRequest(
    requestData: {
      title: string
      description: string
      category?: Database['public']['Enums']['service_category']
      budget_min: number
      budget_max: number
      location: string
    }
  ): Promise<ApiResponse<string>> {
    try {
      const { data: user } = await supabaseClient.auth.getUser()
      if (!user.user) {
        return {
          data: null,
          error: 'User not authenticated',
          success: false
        }
      }

      const { data, error } = await supabaseClient
        .from('service_requests')
        .insert({
          title: requestData.title,
          description: requestData.description,
          category: requestData.category || 'ì²­ì†Œ' as Database['public']['Enums']['service_category'],
          budget_min: requestData.budget_min,
          budget_max: requestData.budget_max,
          location: requestData.location,
          customer_id: user.user.id
        })
        .select('id')
        .single()

      return {
        data: data?.id || null,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  static async submitServiceRequest(requestId: string): Promise<ApiResponse<boolean>> {
    try {
      // Use the create_matches_for_request function to generate matches
      const { data, error } = await supabaseClient
        .rpc('create_matches_for_request', {
          request_id: requestId
        })

      if (!error) {
        // Update request status to matched
        await supabaseClient
          .from('service_requests')
          .update({ status: 'matched' })
          .eq('id', requestId)
      }

      return {
        data: !error,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  static async getMyServiceRequests(): Promise<PaginatedResponse<ServiceRequestWithCategory>> {
    try {
      const { data, error, count } = await supabaseClient
        .from('service_requests')
        .select(`
          *,
          service_categories (
            name, icon
          )
        `)
        .order('created_at', { ascending: false })

      return {
        data: data as ServiceRequestWithCategory[] || [],
        count,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: [],
        count: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  // 5. AI Matching API
  static async executeMatching(requestId: string): Promise<ApiResponse<MatchingResultWithExpert[]>> {
    try {
      const { data, error } = await supabaseClient
        .rpc('execute_ai_matching', {
          request_uuid: requestId
        })

      // After getting matching results, fetch detailed expert info
      if (data && data.length > 0) {
        const expertIds = data.map((match: any) => match.expert_id)

        const { data: expertData } = await supabaseClient
          .from('expert_profiles')
          .select(`
            *,
            profiles:profile_id (
              id, name, avatar_url, address
            )
          `)
          .in('profile_id', expertIds)

        const enhancedResults = data.map((match: any) => ({
          ...match,
          expert_profile: expertData?.find(expert => expert.profile_id === match.expert_id)
        }))

        return {
          data: enhancedResults,
          error: error?.message || null,
          success: !error
        }
      }

      return {
        data: [],
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  static async getMatchingResults(requestId: string): Promise<PaginatedResponse<MatchingResultWithExpert>> {
    try {
      const { data, error, count } = await supabaseClient
        .from('matching_results')
        .select(`
          *,
          expert_profile:expert_id (
            id, name, avatar_url, address, user_type
          )
        `)
        .eq('request_id', requestId)
        .order('compatibility_score', { ascending: false })

      return {
        data: data as MatchingResultWithExpert[] || [],
        count,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: [],
        count: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  // 6. Expert Response API
  static async respondToMatching(
    matchingId: string,
    status: 'interested' | 'declined',
    message?: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { data, error } = await supabaseClient
        .rpc('respond_to_matching', {
          matching_id_param: matchingId,
          response_status: status,
          message_param: message || null
        })

      return {
        data: data || false,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  // 7. Expert Dashboard API
  static async getExpertDashboardStats(): Promise<ApiResponse<{
    total_matches: number
    pending_matches: number
    success_rate: number
    avg_rating: number
    total_earnings: number
    this_month_earnings: number
  }>> {
    try {
      const { data, error } = await supabaseClient
        .rpc('get_expert_dashboard_stats')
        .single()

      return {
        data: data || null,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  static async getExpertMatchings(): Promise<PaginatedResponse<MatchingResultWithExpert>> {
    try {
      const { data, error, count } = await supabaseClient
        .from('matching_results')
        .select(`
          *,
          service_request:request_id (
            id, title, description, location, budget_min, budget_max,
            created_at, status
          )
        `)
        .order('created_at', { ascending: false })

      return {
        data: data as MatchingResultWithExpert[] || [],
        count,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: [],
        count: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  // 8. Profile Management API
  static async updateProfile(updates: Partial<Profile>): Promise<ApiResponse<Profile>> {
    try {
      const { data: user } = await supabaseClient.auth.getUser()
      if (!user.user) {
        return {
          data: null,
          error: 'User not authenticated',
          success: false
        }
      }

      const { data, error } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', user.user.id)
        .select()
        .single()

      return {
        data: data || null,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  static async createExpertProfile(profileData: {
    description: string
    services: string[]
    category: Database['public']['Enums']['service_category'][]
    location: string
    price_min?: number
    price_max?: number
    experience_years?: number
  }): Promise<ApiResponse<string>> {
    try {
      const { data: user } = await supabaseClient.auth.getUser()
      if (!user.user) {
        return {
          data: null,
          error: 'User not authenticated',
          success: false
        }
      }

      const { data, error } = await supabaseClient
        .from('experts')
        .insert({
          id: user.user.id,
          description: profileData.description,
          services: profileData.services,
          category: profileData.category,
          location: profileData.location,
          price_min: profileData.price_min || 0,
          price_max: profileData.price_max || 0,
          experience_years: profileData.experience_years || 0
        })
        .select('id')
        .single()

      return {
        data: data?.id || null,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  // 9. Utility Functions
  static async getCurrentUserProfile(): Promise<ApiResponse<Profile>> {
    try {
      const { data: user } = await supabaseClient.auth.getUser()

      if (!user.user) {
        return {
          data: null,
          error: 'User not authenticated',
          success: false
        }
      }

      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.user.id)
        .single()

      return {
        data: data || null,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  // 10. Matching API
  static async getMyMatches(): Promise<PaginatedResponse<MatchingResultWithExpert>> {
    try {
      const { data: user } = await supabaseClient.auth.getUser()
      if (!user.user) {
        return {
          data: [],
          count: 0,
          error: 'User not authenticated',
          success: false
        }
      }

      const { data, error, count } = await supabaseClient
        .from('matches')
        .select(`
          *,
          expert:expert_id (
            *
          ),
          request:request_id (
            *
          )
        `)
        .or(`customer_id.eq.${user.user.id},expert_id.eq.${user.user.id}`)
        .order('created_at', { ascending: false })

      return {
        data: data as MatchingResultWithExpert[] || [],
        count,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: [],
        count: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }
}

export default ProveeAPI