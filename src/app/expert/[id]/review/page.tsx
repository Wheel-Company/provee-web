'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/hooks/useUser'
import { EnhancedProveeAPI } from '@/lib/api-enhanced'
import {
  Star,
  ArrowLeft,
  Send,
  AlertCircle
} from 'lucide-react'

export default function WriteReviewPage() {
  const params = useParams()
  const router = useRouter()
  const expertId = params.id as string
  const { user, loading: userLoading } = useUser()

  const [expert, setExpert] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Review form state
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  useEffect(() => {
    if (userLoading) return

    if (!user) {
      router.push('/auth/login')
      return
    }

    if (user.user_type !== 'customer') {
      alert('고객만 리뷰를 작성할 수 있습니다.')
      router.push(`/expert/${expertId}`)
      return
    }

    loadExpertData()
  }, [user, userLoading, expertId, router])

  const loadExpertData = async () => {
    try {
      setLoading(true)
      const response = await EnhancedProveeAPI.getExpertDetails(expertId)

      if (response.success && response.data) {
        setExpert(response.data)

        // Set default service type based on expert's category
        if (response.data.category && response.data.category.length > 0) {
          const category = response.data.category[0]
          const serviceTypeMap: Record<string, string> = {
            '청소': '홈클리닝',
            '수리': '가전수리',
            '과외': '개인과외',
            '디자인': '로고디자인'
          }
          setServiceType(serviceTypeMap[category] || category)
        }
      } else {
        alert('전문가 정보를 불러올 수 없습니다.')
        router.back()
      }
    } catch (error) {
      console.error('Error loading expert data:', error)
      alert('전문가 정보를 불러오는 중 오류가 발생했습니다.')
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async () => {
    if (!user?.id || !expert?.id) return

    if (rating === 0) {
      alert('별점을 선택해주세요.')
      return
    }

    if (!comment.trim()) {
      alert('리뷰 내용을 입력해주세요.')
      return
    }

    if (!serviceType.trim()) {
      alert('서비스 종류를 입력해주세요.')
      return
    }

    try {
      setSubmitting(true)

      const response = await EnhancedProveeAPI.submitReview(expert.id, {
        customer_id: user.id,
        rating,
        comment: comment.trim(),
        service_type: serviceType.trim(),
        is_anonymous: isAnonymous
      })

      if (response.success) {
        alert('리뷰가 성공적으로 작성되었습니다!')
        router.push(`/expert/${expertId}`)
      } else {
        alert(response.error || '리뷰 작성 중 오류가 발생했습니다.')
      }

    } catch (error) {
      console.error('Error submitting review:', error)
      alert('리뷰 작성 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">전문가 정보를 불러올 수 없습니다.</p>
            <Button onClick={() => router.back()} className="mt-4">
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

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button onClick={() => router.back()} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
            <div>
              <h1 className="text-2xl font-bold">리뷰 작성</h1>
              <p className="text-gray-600">{expert.name || `전문가 #${expertId.slice(-4)}`}에 대한 리뷰를 작성하세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Expert Info */}
        <Card className="p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {expert.name?.charAt(0) || '전'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{expert.name || `전문가 #${expertId.slice(-4)}`}</h2>
              <div className="flex items-center space-x-2 mt-1">
                {expert.category?.map((cat: string, index: number) => (
                  <Badge key={index} variant="secondary">{cat}</Badge>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-1">{expert.location}</p>
            </div>
          </div>
        </Card>

        {/* Review Form */}
        <Card className="p-8">
          <h3 className="text-xl font-semibold mb-6">서비스 경험을 평가해주세요</h3>

          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-3">별점 평가 *</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-3 text-sm text-gray-600">
                    {rating === 1 && '매우 불만족'}
                    {rating === 2 && '불만족'}
                    {rating === 3 && '보통'}
                    {rating === 4 && '만족'}
                    {rating === 5 && '매우 만족'}
                  </span>
                )}
              </div>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium mb-2">서비스 종류 *</label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="예: 홈클리닝, 가전수리, 수학과외 등"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">리뷰 내용 *</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="서비스에 대한 솔직한 후기를 작성해주세요. 다른 고객들에게 도움이 되는 구체적인 내용을 포함해주세요."
                rows={6}
                maxLength={1000}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {comment.length}/1000
              </div>
            </div>

            {/* Anonymous Option */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-1"
              />
              <div>
                <label htmlFor="anonymous" className="text-sm font-medium">
                  익명으로 작성하기
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  체크하면 리뷰가 익명으로 표시됩니다. (기본: 실명 첫글자 + ** 형태)
                </p>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800 mb-2">리뷰 작성 안내</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• 실제 서비스를 이용한 후 솔직한 후기를 작성해주세요</li>
                    <li>• 욕설, 비방, 개인정보 등은 포함하지 마세요</li>
                    <li>• 구체적이고 도움이 되는 내용을 작성해주세요</li>
                    <li>• 작성된 리뷰는 수정할 수 있으나 삭제는 관리자 문의가 필요합니다</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                onClick={submitReview}
                disabled={submitting || rating === 0 || !comment.trim() || !serviceType.trim()}
                className="w-full h-12 text-base"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    리뷰 작성 중...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    리뷰 작성하기
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}