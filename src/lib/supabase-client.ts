import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// 단일 Supabase 클라이언트 인스턴스 (전역 공유)
export const supabaseClient = createClient<Database>(
  'https://jqqwiokellbkyzhqrqls.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXdpb2tlbGxia3l6aHFycWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDI3ODksImV4cCI6MjA3NDI3ODc4OX0.DjVi6aL2dCvwkUNViLx08M8tUwWWIZ_eO0CAGOeE-m4'
)