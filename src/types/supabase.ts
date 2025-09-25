export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'customer' | 'provider'
          name: string
          avatar_url: string | null
          phone: string | null
          location_city: string | null
          location_district: string | null
          bio: string | null
          website: string | null
          specializations: string[] | null
          hourly_rate: number | null
          experience_years: number | null
          portfolio_urls: string[] | null
          verification_phone: boolean
          verification_identity: boolean
          verification_business: boolean
          deposit_paid: boolean
          deposit_amount: number
          rating: number
          review_count: number
          success_count: number
          total_matches: number
          avg_response_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'customer' | 'provider'
          name: string
          avatar_url?: string | null
          phone?: string | null
          location_city?: string | null
          location_district?: string | null
          bio?: string | null
          website?: string | null
          specializations?: string[] | null
          hourly_rate?: number | null
          experience_years?: number | null
          portfolio_urls?: string[] | null
          verification_phone?: boolean
          verification_identity?: boolean
          verification_business?: boolean
          deposit_paid?: boolean
          deposit_amount?: number
          rating?: number
          review_count?: number
          success_count?: number
          total_matches?: number
          avg_response_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'customer' | 'provider'
          name?: string
          avatar_url?: string | null
          phone?: string | null
          location_city?: string | null
          location_district?: string | null
          bio?: string | null
          website?: string | null
          specializations?: string[] | null
          hourly_rate?: number | null
          experience_years?: number | null
          portfolio_urls?: string[] | null
          verification_phone?: boolean
          verification_identity?: boolean
          verification_business?: boolean
          deposit_paid?: boolean
          deposit_amount?: number
          rating?: number
          review_count?: number
          success_count?: number
          total_matches?: number
          avg_response_time?: number
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          provider_id: string
          title: string
          description: string
          category: 'development' | 'design' | 'marketing' | 'writing' | 'photo' | 'consulting' | 'other'
          price_min: number
          price_max: number
          duration_days: number | null
          requirements: string[] | null
          deliverables: string[] | null
          portfolio_images: string[] | null
          location_required: boolean
          target_cities: string[] | null
          active: boolean
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          title: string
          description: string
          category: 'development' | 'design' | 'marketing' | 'writing' | 'photo' | 'consulting' | 'other'
          price_min: number
          price_max: number
          duration_days?: number | null
          requirements?: string[] | null
          deliverables?: string[] | null
          portfolio_images?: string[] | null
          location_required?: boolean
          target_cities?: string[] | null
          active?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          title?: string
          description?: string
          category?: 'development' | 'design' | 'marketing' | 'writing' | 'photo' | 'consulting' | 'other'
          price_min?: number
          price_max?: number
          duration_days?: number | null
          requirements?: string[] | null
          deliverables?: string[] | null
          portfolio_images?: string[] | null
          location_required?: boolean
          target_cities?: string[] | null
          active?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          customer_id: string
          service_id: string | null
          title: string
          description: string
          category: 'development' | 'design' | 'marketing' | 'writing' | 'photo' | 'consulting' | 'other'
          budget_min: number
          budget_max: number
          deadline: string | null
          location_city: string | null
          location_district: string | null
          remote_work_allowed: boolean
          requirements: string[] | null
          additional_info: Json | null
          status: 'pending' | 'matched' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          service_id?: string | null
          title: string
          description: string
          category: 'development' | 'design' | 'marketing' | 'writing' | 'photo' | 'consulting' | 'other'
          budget_min: number
          budget_max: number
          deadline?: string | null
          location_city?: string | null
          location_district?: string | null
          remote_work_allowed?: boolean
          requirements?: string[] | null
          additional_info?: Json | null
          status?: 'pending' | 'matched' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          service_id?: string | null
          title?: string
          description?: string
          category?: 'development' | 'design' | 'marketing' | 'writing' | 'photo' | 'consulting' | 'other'
          budget_min?: number
          budget_max?: number
          deadline?: string | null
          location_city?: string | null
          location_district?: string | null
          remote_work_allowed?: boolean
          requirements?: string[] | null
          additional_info?: Json | null
          status?: 'pending' | 'matched' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          request_id: string
          provider_id: string
          service_id: string | null
          compatibility_score: number
          service_compatibility: number
          price_compatibility: number
          location_compatibility: number
          reputation_score: number
          match_reasoning: Json | null
          estimated_price: number | null
          estimated_duration: number | null
          status: 'pending' | 'matched' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
          customer_viewed_at: string | null
          provider_viewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          provider_id: string
          service_id?: string | null
          compatibility_score: number
          service_compatibility: number
          price_compatibility: number
          location_compatibility: number
          reputation_score: number
          match_reasoning?: Json | null
          estimated_price?: number | null
          estimated_duration?: number | null
          status?: 'pending' | 'matched' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
          customer_viewed_at?: string | null
          provider_viewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          provider_id?: string
          service_id?: string | null
          compatibility_score?: number
          service_compatibility?: number
          price_compatibility?: number
          location_compatibility?: number
          reputation_score?: number
          match_reasoning?: Json | null
          estimated_price?: number | null
          estimated_duration?: number | null
          status?: 'pending' | 'matched' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
          customer_viewed_at?: string | null
          provider_viewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          match_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          title: string | null
          content: string | null
          communication_rating: number | null
          quality_rating: number | null
          timeliness_rating: number | null
          professionalism_rating: number | null
          would_recommend: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          title?: string | null
          content?: string | null
          communication_rating?: number | null
          quality_rating?: number | null
          timeliness_rating?: number | null
          professionalism_rating?: number | null
          would_recommend?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          title?: string | null
          content?: string | null
          communication_rating?: number | null
          quality_rating?: number | null
          timeliness_rating?: number | null
          professionalism_rating?: number | null
          would_recommend?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json | null
          read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json | null
          read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json | null
          read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'customer' | 'provider'
      service_category: 'development' | 'design' | 'marketing' | 'writing' | 'photo' | 'consulting' | 'other'
      match_status: 'pending' | 'matched' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
    }
  }
}