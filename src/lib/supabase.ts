import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 기본 클라이언트
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 타입이 적용된 Supabase 클라이언트
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

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