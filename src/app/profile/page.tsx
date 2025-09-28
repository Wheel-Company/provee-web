'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { useUser } from '@/hooks/useUser'
import { EnhancedProveeAPI } from '@/lib/api-enhanced'
import CustomerProfile from '@/components/profile/CustomerProfile'
import ExpertProfile from '@/components/profile/ExpertProfile'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, loading } = useUser()
  const [profileStats, setProfileStats] = useState({
    activeRequests: 3,
    completedRequests: 12,
    totalReviews: 8,
    favoriteExperts: 5,
    totalEarnings: 1250000
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Load profile statistics
  useEffect(() => {
    const loadProfileStats = async () => {
      if (!user || !profile) return

      try {
        const response = await EnhancedProveeAPI.getCustomerProfile(user.id)
        if (response.success && response.data) {
          setProfileStats({
            activeRequests: response.data.active_requests || 3,
            completedRequests: response.data.completed_requests || 12,
            totalReviews: response.data.total_reviews || 8,
            favoriteExperts: response.data.favorite_experts || 5,
            totalEarnings: response.data.total_earnings || 1250000
          })
        }
      } catch (error) {
        console.error('프로필 통계 로딩 오류:', error)
      }
    }

    loadProfileStats()
  }, [user, profile])

  // 역할 변경 감지 및 자동 리렌더링
  useEffect(() => {
    console.log('Profile or role changed, current role:', profile?.active_role || profile?.user_type)
  }, [profile?.active_role, profile?.user_type, profile?.available_roles])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">프로필을 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // 현재 활성 역할 확인
  const currentRole = profile?.active_role || profile?.user_type

  // 디버깅을 위한 로그
  console.log('Profile page render:', {
    profile,
    currentRole,
    active_role: profile?.active_role,
    user_type: profile?.user_type,
    available_roles: profile?.available_roles,
    is_expert: profile?.is_expert
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* 역할별로 다른 프로필 컴포넌트 렌더링 */}
      {currentRole === 'expert' ? (
        <ExpertProfile user={user} profile={profile} profileStats={profileStats} />
      ) : (
        <CustomerProfile user={user} profile={profile} profileStats={profileStats} />
      )}
    </div>
  )
}