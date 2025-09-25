import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// 환경변수 검증 및 정리
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// 안전한 Supabase 클라이언트 생성
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// 레거시 호환성을 위한 별칭
export const typedSupabase = supabase

// 편의를 위한 타입 내보내기
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// 자주 사용할 타입들 (현재 스키마 기준)
export type Profile = Tables<'profiles'>
export type Expert = Tables<'experts'>
export type ServiceRequest = Tables<'service_requests'>
export type Match = Tables<'matches'>

export type UserType = Enums<'user_type'>
export type MatchStatus = Enums<'match_status'>
export type RequestStatus = Enums<'request_status'>