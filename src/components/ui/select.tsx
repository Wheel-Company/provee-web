import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "korean-text flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-provee-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-provee-blue",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "korean-text relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("korean-text py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "korean-text relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Provee 특화 셀렉트 컴포넌트들

// 서비스 카테고리 선택
interface ServiceCategorySelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

const ServiceCategorySelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  ServiceCategorySelectProps
>(({ value, onValueChange, placeholder = "서비스 카테고리 선택", className }, ref) => {
  const categories = [
    { value: "cleaning", label: "🧹 청소 서비스", color: "blue" },
    { value: "repair", label: "🔧 수리 서비스", color: "orange" },
    { value: "delivery", label: "🚚 배송 서비스", color: "green" },
    { value: "beauty", label: "💄 뷰티 서비스", color: "pink" },
    { value: "education", label: "📚 교육 서비스", color: "purple" },
    { value: "pet", label: "🐕 펫 서비스", color: "yellow" },
    { value: "health", label: "💊 건강 서비스", color: "red" },
    { value: "design", label: "🎨 디자인 서비스", color: "indigo" },
    { value: "tech", label: "💻 IT 서비스", color: "gray" },
    { value: "consulting", label: "💼 컨설팅 서비스", color: "slate" },
  ]

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger ref={ref} className={cn("korean-text", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})
ServiceCategorySelect.displayName = "ServiceCategorySelect"

// 지역 선택
interface LocationSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

const LocationSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  LocationSelectProps
>(({ value, onValueChange, placeholder = "지역 선택", className }, ref) => {
  const locations = [
    { group: "서울특별시", items: [
      { value: "seoul-gangnam", label: "강남구" },
      { value: "seoul-gangdong", label: "강동구" },
      { value: "seoul-gangbuk", label: "강북구" },
      { value: "seoul-gangseo", label: "강서구" },
      { value: "seoul-gwanak", label: "관악구" },
      { value: "seoul-gwangjin", label: "광진구" },
    ]},
    { group: "경기도", items: [
      { value: "gyeonggi-suwon", label: "수원시" },
      { value: "gyeonggi-goyang", label: "고양시" },
      { value: "gyeonggi-yongin", label: "용인시" },
      { value: "gyeonggi-seongnam", label: "성남시" },
      { value: "gyeonggi-bucheon", label: "부천시" },
    ]},
    { group: "인천광역시", items: [
      { value: "incheon-yeonsu", label: "연수구" },
      { value: "incheon-namdong", label: "남동구" },
      { value: "incheon-bupyeong", label: "부평구" },
    ]},
  ]

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger ref={ref} className={cn("korean-text", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {locations.map((location) => (
          <SelectGroup key={location.group}>
            <SelectLabel>{location.group}</SelectLabel>
            {location.items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
            <SelectSeparator />
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
})
LocationSelect.displayName = "LocationSelect"

// 가격 범위 선택
interface PriceRangeSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

const PriceRangeSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  PriceRangeSelectProps
>(({ value, onValueChange, placeholder = "가격대 선택", className }, ref) => {
  const priceRanges = [
    { value: "0-50000", label: "5만원 이하" },
    { value: "50000-100000", label: "5만원 ~ 10만원" },
    { value: "100000-200000", label: "10만원 ~ 20만원" },
    { value: "200000-500000", label: "20만원 ~ 50만원" },
    { value: "500000-1000000", label: "50만원 ~ 100만원" },
    { value: "1000000+", label: "100만원 이상" },
  ]

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger ref={ref} className={cn("korean-text", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {priceRanges.map((range) => (
          <SelectItem key={range.value} value={range.value}>
            {range.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})
PriceRangeSelect.displayName = "PriceRangeSelect"

// 정렬 옵션 선택
interface SortSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

const SortSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SortSelectProps
>(({ value, onValueChange, className }, ref) => {
  const sortOptions = [
    { value: "match", label: "📊 매칭률 순" },
    { value: "rating", label: "⭐ 평점 높은 순" },
    { value: "price-low", label: "💰 가격 낮은 순" },
    { value: "price-high", label: "💎 가격 높은 순" },
    { value: "recent", label: "🕒 최신 순" },
    { value: "review", label: "💬 리뷰 많은 순" },
  ]

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger ref={ref} className={cn("korean-text w-[140px]", className)}>
        <SelectValue placeholder="정렬" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})
SortSelect.displayName = "SortSelect"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  ServiceCategorySelect,
  LocationSelect,
  PriceRangeSelect,
  SortSelect,
}