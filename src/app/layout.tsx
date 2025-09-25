import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Provee - AI 기반 서비스 매칭 플랫폼',
  description: '전문가와 고객 모두가 신뢰할 수 있는 AI 기반 서비스 매칭 플랫폼',
  keywords: ['서비스 매칭', 'AI 매칭', '전문가', '서비스 플랫폼', '한국'],
  authors: [{ name: 'Provee Team' }],
  creator: 'Provee',
  publisher: 'Provee',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://provee.co.kr'),
  openGraph: {
    title: 'Provee - AI 기반 서비스 매칭 플랫폼',
    description: '전문가와 고객 모두가 신뢰할 수 있는 AI 기반 서비스 매칭 플랫폼',
    url: 'https://provee.co.kr',
    siteName: 'Provee',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Provee 플랫폼',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Provee - AI 기반 서비스 매칭 플랫폼',
    description: '전문가와 고객 모두가 신뢰할 수 있는 AI 기반 서비스 매칭 플랫폼',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    // 추후 추가할 수 있는 다른 검증 코드들
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={inter.className}>
      <head>
        {/* Pretendard 폰트 로드 */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css"
        />
        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="korean-text">
        {children}
      </body>
    </html>
  )
}