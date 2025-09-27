'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function ExpertDetailPageSimple() {
  const params = useParams()
  const router = useRouter()
  const expertId = params.id as string

  const [expert, setExpert] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setExpert({ id: expertId, name: '테스트 전문가' })
      setLoading(false)
    }, 1000)
  }, [expertId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">전문가 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !expert) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">전문가: {expert.name}</h1>
          <p>ID: {expert.id}</p>
        </div>
      </div>
    </div>
  )
}