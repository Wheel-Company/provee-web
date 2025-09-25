import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("korean-text w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("korean-text [&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("korean-text [&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "korean-text border-t bg-slate-100/50 font-medium [&>tr]:last:border-b-0 dark:bg-slate-800/50",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "korean-text border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "korean-text h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("korean-text p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("korean-text mt-4 text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

// Provee 특화 테이블 컴포넌트들

// 서비스 목록 테이블
interface ServiceTableProps {
  services: Array<{
    id: string
    title: string
    provider: string
    category: string
    price: number
    rating: number
    matchingScore?: number
    status: 'active' | 'pending' | 'inactive'
  }>
  onServiceClick?: (serviceId: string) => void
  className?: string
}

const ServiceTable = React.forwardRef<
  HTMLTableElement,
  ServiceTableProps
>(({ services, onServiceClick, className }, ref) => {
  const getStatusBadge = (status: 'active' | 'pending' | 'inactive') => {
    const statusConfig = {
      active: { text: '활성', className: 'bg-green-100 text-green-800' },
      pending: { text: '대기', className: 'bg-yellow-100 text-yellow-800' },
      inactive: { text: '비활성', className: 'bg-gray-100 text-gray-800' },
    }

    const config = statusConfig[status]
    return (
      <span className={cn('korean-text px-2 py-1 rounded-full text-xs font-medium', config.className)}>
        {config.text}
      </span>
    )
  }

  return (
    <Table ref={ref} className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>서비스명</TableHead>
          <TableHead>제공자</TableHead>
          <TableHead>카테고리</TableHead>
          <TableHead>가격</TableHead>
          <TableHead>평점</TableHead>
          <TableHead>매칭률</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="w-[100px]">액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow
            key={service.id}
            className="cursor-pointer"
            onClick={() => onServiceClick?.(service.id)}
          >
            <TableCell className="font-medium">{service.title}</TableCell>
            <TableCell>{service.provider}</TableCell>
            <TableCell>{service.category}</TableCell>
            <TableCell className="font-medium text-provee-blue">
              {service.price.toLocaleString()}원
            </TableCell>
            <TableCell>
              <div className="korean-text flex items-center space-x-1">
                <span>⭐</span>
                <span>{service.rating}/5.0</span>
              </div>
            </TableCell>
            <TableCell>
              {service.matchingScore && (
                <div className="korean-text flex items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all",
                        service.matchingScore >= 80 ? "bg-green-500" :
                        service.matchingScore >= 60 ? "bg-yellow-500" :
                        "bg-red-500"
                      )}
                      style={{ width: `${service.matchingScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium min-w-[35px]">
                    {service.matchingScore}%
                  </span>
                </div>
              )}
            </TableCell>
            <TableCell>{getStatusBadge(service.status)}</TableCell>
            <TableCell>
              <button className="korean-text text-provee-blue hover:text-provee-blue/80 text-sm font-medium">
                상세보기
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
})
ServiceTable.displayName = "ServiceTable"

// 예약 내역 테이블
interface BookingTableProps {
  bookings: Array<{
    id: string
    serviceName: string
    provider: string
    date: string
    time: string
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
    amount: number
  }>
  onBookingClick?: (bookingId: string) => void
  className?: string
}

const BookingTable = React.forwardRef<
  HTMLTableElement,
  BookingTableProps
>(({ bookings, onBookingClick, className }, ref) => {
  const getStatusBadge = (status: 'confirmed' | 'pending' | 'completed' | 'cancelled') => {
    const statusConfig = {
      confirmed: { text: '확정', className: 'bg-blue-100 text-blue-800' },
      pending: { text: '대기중', className: 'bg-yellow-100 text-yellow-800' },
      completed: { text: '완료', className: 'bg-green-100 text-green-800' },
      cancelled: { text: '취소', className: 'bg-red-100 text-red-800' },
    }

    const config = statusConfig[status]
    return (
      <span className={cn('korean-text px-2 py-1 rounded-full text-xs font-medium', config.className)}>
        {config.text}
      </span>
    )
  }

  return (
    <Table ref={ref} className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>서비스명</TableHead>
          <TableHead>제공자</TableHead>
          <TableHead>예약일시</TableHead>
          <TableHead>금액</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="w-[100px]">액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow
            key={booking.id}
            className="cursor-pointer"
            onClick={() => onBookingClick?.(booking.id)}
          >
            <TableCell className="font-medium">{booking.serviceName}</TableCell>
            <TableCell>{booking.provider}</TableCell>
            <TableCell>
              <div className="korean-text">
                <div className="font-medium">{booking.date}</div>
                <div className="text-sm text-slate-500">{booking.time}</div>
              </div>
            </TableCell>
            <TableCell className="font-medium text-provee-blue">
              {booking.amount.toLocaleString()}원
            </TableCell>
            <TableCell>{getStatusBadge(booking.status)}</TableCell>
            <TableCell>
              <button className="korean-text text-provee-blue hover:text-provee-blue/80 text-sm font-medium">
                관리
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
})
BookingTable.displayName = "BookingTable"

// 리뷰 목록 테이블
interface ReviewTableProps {
  reviews: Array<{
    id: string
    serviceName: string
    reviewer: string
    rating: number
    content: string
    date: string
    verified: boolean
  }>
  onReviewClick?: (reviewId: string) => void
  className?: string
}

const ReviewTable = React.forwardRef<
  HTMLTableElement,
  ReviewTableProps
>(({ reviews, onReviewClick, className }, ref) => {
  return (
    <Table ref={ref} className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>서비스명</TableHead>
          <TableHead>리뷰어</TableHead>
          <TableHead>평점</TableHead>
          <TableHead>리뷰 내용</TableHead>
          <TableHead>작성일</TableHead>
          <TableHead className="w-[100px]">인증</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow
            key={review.id}
            className="cursor-pointer"
            onClick={() => onReviewClick?.(review.id)}
          >
            <TableCell className="font-medium">{review.serviceName}</TableCell>
            <TableCell>{review.reviewer}</TableCell>
            <TableCell>
              <div className="korean-text flex items-center space-x-1">
                <span>⭐</span>
                <span className="font-medium">{review.rating}/5.0</span>
              </div>
            </TableCell>
            <TableCell className="max-w-xs">
              <p className="korean-text truncate text-sm">{review.content}</p>
            </TableCell>
            <TableCell className="text-sm text-slate-500">{review.date}</TableCell>
            <TableCell>
              {review.verified ? (
                <span className="korean-text text-green-600 text-sm font-medium">✓ 인증</span>
              ) : (
                <span className="korean-text text-slate-400 text-sm">미인증</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
})
ReviewTable.displayName = "ReviewTable"

// 매출 통계 테이블
interface EarningsTableProps {
  earnings: Array<{
    period: string
    totalEarnings: number
    serviceCount: number
    avgRating: number
    commissionFee: number
    netEarnings: number
  }>
  className?: string
}

const EarningsTable = React.forwardRef<
  HTMLTableElement,
  EarningsTableProps
>(({ earnings, className }, ref) => {
  const calculateTotal = (field: keyof typeof earnings[0]) => {
    if (field === 'avgRating') {
      const total = earnings.reduce((sum, item) => sum + item[field], 0)
      return (total / earnings.length).toFixed(1)
    }
    return earnings.reduce((sum, item) => sum + (item[field] as number), 0)
  }

  return (
    <Table ref={ref} className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>기간</TableHead>
          <TableHead>총 매출</TableHead>
          <TableHead>서비스 건수</TableHead>
          <TableHead>평균 평점</TableHead>
          <TableHead>수수료</TableHead>
          <TableHead>순 수익</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {earnings.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{item.period}</TableCell>
            <TableCell className="font-medium text-provee-blue">
              {item.totalEarnings.toLocaleString()}원
            </TableCell>
            <TableCell>{item.serviceCount}건</TableCell>
            <TableCell>
              <div className="korean-text flex items-center space-x-1">
                <span>⭐</span>
                <span>{item.avgRating}</span>
              </div>
            </TableCell>
            <TableCell className="text-red-600">
              -{item.commissionFee.toLocaleString()}원
            </TableCell>
            <TableCell className="font-bold text-green-600">
              {item.netEarnings.toLocaleString()}원
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-bold">합계</TableCell>
          <TableCell className="font-bold text-provee-blue">
            {calculateTotal('totalEarnings').toLocaleString()}원
          </TableCell>
          <TableCell className="font-bold">
            {calculateTotal('serviceCount')}건
          </TableCell>
          <TableCell className="font-bold">
            ⭐ {calculateTotal('avgRating')}
          </TableCell>
          <TableCell className="font-bold text-red-600">
            -{calculateTotal('commissionFee').toLocaleString()}원
          </TableCell>
          <TableCell className="font-bold text-green-600">
            {calculateTotal('netEarnings').toLocaleString()}원
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
})
EarningsTable.displayName = "EarningsTable"

// 반응형 테이블 래퍼
interface ResponsiveTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  minWidth?: number
}

const ResponsiveTable = React.forwardRef<
  HTMLDivElement,
  ResponsiveTableProps
>(({ children, minWidth = 600, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("korean-text w-full overflow-auto rounded-md border", className)}
    style={{ minWidth: `${minWidth}px` }}
    {...props}
  >
    {children}
  </div>
))
ResponsiveTable.displayName = "ResponsiveTable"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  ServiceTable,
  BookingTable,
  ReviewTable,
  EarningsTable,
  ResponsiveTable,
}