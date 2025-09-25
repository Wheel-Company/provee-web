/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript 설정
  typescript: {
    // 프로덕션 빌드 시 타입 오류가 있어도 빌드를 진행 (개발 중에만)
    ignoreBuildErrors: false,
  },

  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false,
  },

  // 실험적 기능
  experimental: {
    // 서버 컴포넌트 활용
    serverComponentsExternalPackages: [],
  },

  // 이미지 최적화 설정
  images: {
    domains: [
      'localhost',
      'cdn.jsdelivr.net', // Pretendard 폰트용
      'images.unsplash.com', // 데모 이미지용
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // 국제화 설정 (한국어 우선)
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
  },

  // 성능 최적화
  compress: true,

  // PWA 준비 (추후)
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },

  // 환경 변수
  env: {
    CUSTOM_KEY: 'provee-platform',
  },

  // 리다이렉트 설정
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // 헤더 설정 (보안 강화)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig