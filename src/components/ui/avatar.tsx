import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "korean-text relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("korean-text aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "korean-text flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-50",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// Provee 특화 아바타 변형
const ProveeUserAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    verified?: boolean
  }
>(({ className, size = 'md', verified = false, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  return (
    <div className="relative inline-block">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "korean-text relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          verified && "ring-2 ring-provee-green ring-offset-2 dark:ring-offset-slate-950",
          className
        )}
        {...props}
      />
      {verified && (
        <div className={cn(
          "absolute -bottom-0.5 -right-0.5 rounded-full bg-provee-green flex items-center justify-center text-white",
          size === 'sm' && "h-3 w-3 text-[8px]",
          size === 'md' && "h-4 w-4 text-[10px]",
          size === 'lg' && "h-5 w-5 text-xs",
          size === 'xl' && "h-6 w-6 text-sm"
        )}>
          ✓
        </div>
      )}
    </div>
  )
})
ProveeUserAvatar.displayName = "ProveeUserAvatar"

// 서비스 제공자 아바타 (레이팅 포함)
const ProveeProviderAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    rating?: number
    verified?: boolean
  }
>(({ className, size = 'md', rating, verified = false, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-provee-green'
    if (rating >= 4.0) return 'bg-yellow-500'
    if (rating >= 3.5) return 'bg-orange-500'
    return 'bg-gray-400'
  }

  return (
    <div className="relative inline-block">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "korean-text relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          verified && "ring-2 ring-provee-blue ring-offset-2 dark:ring-offset-slate-950",
          className
        )}
        {...props}
      />

      {/* 인증 배지 */}
      {verified && (
        <div className={cn(
          "absolute -top-0.5 -right-0.5 rounded-full bg-provee-blue flex items-center justify-center text-white z-10",
          size === 'sm' && "h-3 w-3 text-[8px]",
          size === 'md' && "h-4 w-4 text-[10px]",
          size === 'lg' && "h-5 w-5 text-xs",
          size === 'xl' && "h-6 w-6 text-sm"
        )}>
          ✓
        </div>
      )}

      {/* 평점 배지 */}
      {rating && (
        <div className={cn(
          "absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center text-white text-[10px] font-medium z-10",
          getRatingColor(rating),
          size === 'sm' && "h-4 w-4 text-[8px]",
          size === 'md' && "h-5 w-5 text-[10px]",
          size === 'lg' && "h-6 w-6 text-xs",
          size === 'xl' && "h-7 w-7 text-sm"
        )}>
          {rating.toFixed(1)}
        </div>
      )}
    </div>
  )
})
ProveeProviderAvatar.displayName = "ProveeProviderAvatar"

// 그룹 아바타 (여러 사용자)
interface ProveeAvatarGroupProps {
  users: Array<{
    src?: string
    alt?: string
    fallback: string
  }>
  max?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const ProveeAvatarGroup = React.forwardRef<
  HTMLDivElement,
  ProveeAvatarGroupProps
>(({ users, max = 3, size = 'md', className, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  const displayUsers = users.slice(0, max)
  const remainingCount = Math.max(0, users.length - max)

  return (
    <div
      ref={ref}
      className={cn("flex items-center -space-x-2", className)}
      {...props}
    >
      {displayUsers.map((user, index) => (
        <Avatar key={index} className={cn(sizeClasses[size], "border-2 border-white dark:border-slate-950")}>
          <AvatarImage src={user.src} alt={user.alt} />
          <AvatarFallback className="korean-text text-xs font-medium">
            {user.fallback}
          </AvatarFallback>
        </Avatar>
      ))}

      {remainingCount > 0 && (
        <div className={cn(
          "korean-text flex items-center justify-center rounded-full bg-slate-100 text-slate-600 border-2 border-white font-medium dark:bg-slate-800 dark:text-slate-300 dark:border-slate-950",
          sizeClasses[size]
        )}>
          +{remainingCount}
        </div>
      )}
    </div>
  )
})
ProveeAvatarGroup.displayName = "ProveeAvatarGroup"

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  ProveeUserAvatar,
  ProveeProviderAvatar,
  ProveeAvatarGroup
}