import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database 타입 정의 (Supabase에서 자동 생성 가능)
export type Database = {
  public: {
    Tables: {
      // 추후 Supabase 스키마에 맞게 업데이트
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'customer' | 'provider'
          avatar?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'customer' | 'provider'
          avatar?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'customer' | 'provider'
          avatar?: string
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          price_min: number
          price_max: number
          provider_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          price_min: number
          price_max: number
          provider_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          price_min?: number
          price_max?: number
          provider_id?: string
          created_at?: string
          updated_at?: string
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
      service_category: 'development' | 'design' | 'marketing' | 'writing' | 'photo' | 'other'
    }
  }
}

// 타입이 적용된 Supabase 클라이언트
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey)