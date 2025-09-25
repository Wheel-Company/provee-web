import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MapPin, Clock, Shield } from 'lucide-react'

interface ServiceMatchCardProps {
  title: string
  category: string
  price: string
  duration: string
  matchScore: number
  providerName: string
  providerRating: number
  skills: string[]
  description: string
  className?: string
}

export function ServiceMatchCard({
  title,
  category,
  price,
  duration,
  matchScore,
  providerName,
  providerRating,
  skills,
  description,
  className
}: ServiceMatchCardProps) {
  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
              <div className={`px-3 py-1 rounded-lg text-sm font-bold ${getMatchColor(matchScore)}`}>
                {matchScore}% 매칭
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2 korean-text">{title}</h3>
            <p className="text-sm text-gray-600 mb-3 korean-text">{description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 서비스 제공자 정보 */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={providerName} />
            <AvatarFallback>{providerName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium korean-text">{providerName}</span>
              <div className="flex items-center text-sm">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{providerRating}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-1 text-green-600" />
                <span>인증</span>
              </div>
            </div>
          </div>
        </div>

        {/* 기술/스킬 */}
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs korean-text">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{skills.length - 3}개 더
            </Badge>
          )}
        </div>

        {/* 프로젝트 정보 */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <div className="text-sm text-gray-600">예상 비용</div>
            <div className="font-semibold text-blue-600 korean-text">{price}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">예상 기간</div>
            <div className="font-semibold korean-text">{duration}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex space-x-2 pt-4">
        <Button variant="outline" className="flex-1 korean-text">
          상세 보기
        </Button>
        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 korean-text">
          문의하기
        </Button>
      </CardFooter>
    </Card>
  )
}