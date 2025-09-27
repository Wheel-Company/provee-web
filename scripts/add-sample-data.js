// Script to add sample data to Supabase for testing
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jqqwiokellbkyzhqrqls.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXdpb2tlbGxia3l6aHFycWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDI3ODksImV4cCI6MjA3NDI3ODc4OX0.DjVi6aL2dCvwkUNViLx08M8tUwWWIZ_eO0CAGOeE-m4'

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function addSampleData() {
  console.log('Adding sample data to Supabase...')

  try {
    // Add sample profiles first
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440020',
          username: 'expert_cleaner1',
          email: 'cleaner1@example.com',
          name: '김청소',
          phone: '010-1234-5678',
          user_type: 'expert',
          district: '강남구'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440021',
          username: 'expert_cleaner2',
          email: 'cleaner2@example.com',
          name: '박깨끗',
          phone: '010-2234-5679',
          user_type: 'expert',
          district: '서초구'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440022',
          username: 'expert_repair1',
          email: 'repair1@example.com',
          name: '이수리',
          phone: '010-3234-5680',
          user_type: 'expert',
          district: '송파구'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440023',
          username: 'expert_tutor1',
          email: 'tutor1@example.com',
          name: '최과외',
          phone: '010-4234-5681',
          user_type: 'expert',
          district: '마포구'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440024',
          username: 'expert_designer1',
          email: 'designer1@example.com',
          name: '정디자인',
          phone: '010-5234-5682',
          user_type: 'expert',
          district: '용산구'
        }
      ])

    if (profilesError) {
      console.error('Error adding profiles:', profilesError)
    } else {
      console.log('✅ Profiles added successfully')
    }

    // Add sample experts
    const { data: expertsData, error: expertsError } = await supabase
      .from('experts')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440020',
          category: ['청소'],
          services: ['홈클리닝', '사무실청소', '입주청소', '이사청소'],
          location: '서울시 강남구',
          description: '10년 경력의 전문 홈클리닝 서비스를 제공합니다. 꼼꼼하고 깨끗한 청소로 고객만족도 98%를 자랑합니다.',
          price_min: 15000,
          price_max: 30000,
          rating: 4.8,
          review_count: 127,
          completed_projects: 234,
          experience_years: 10,
          response_time_hours: 2,
          hourly_rate: 20000,
          is_available: true,
          verified: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440021',
          category: ['청소'],
          services: ['홈클리닝', '정리정돈', '화장실청소', '주방청소'],
          location: '서울시 서초구',
          description: '친환경 세제를 사용한 안전한 청소 서비스입니다. 아이가 있는 집도 안심하고 맡기세요.',
          price_min: 12000,
          price_max: 25000,
          rating: 4.7,
          review_count: 89,
          completed_projects: 156,
          experience_years: 7,
          response_time_hours: 1,
          hourly_rate: 18000,
          is_available: true,
          verified: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440022',
          category: ['수리'],
          services: ['가전수리', '가구수리', '도배', '페인팅', '배관수리'],
          location: '서울시 송파구',
          description: '20년 경력의 종합 수리 전문가입니다. 정확한 진단과 합리적인 가격으로 서비스를 제공합니다.',
          price_min: 20000,
          price_max: 80000,
          rating: 4.6,
          review_count: 145,
          completed_projects: 278,
          experience_years: 20,
          response_time_hours: 3,
          hourly_rate: 35000,
          is_available: true,
          verified: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440023',
          category: ['과외'],
          services: ['영어과외', '수학과외', '토익', '토플', '회화'],
          location: '서울시 마포구',
          description: '서울대 영어교육과 출신으로 체계적인 영어 교육을 제공합니다. 학생별 맞춤 커리큘럼으로 목표 달성률 95%!',
          price_min: 40000,
          price_max: 60000,
          rating: 4.9,
          review_count: 198,
          completed_projects: 156,
          experience_years: 8,
          response_time_hours: 4,
          hourly_rate: 50000,
          is_available: true,
          verified: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440024',
          category: ['디자인'],
          services: ['로고디자인', '브랜딩', '웹디자인', '인쇄물디자인', 'UI/UX'],
          location: '서울시 용산구',
          description: '감각적이고 트렌디한 디자인으로 브랜드 가치를 높여드립니다. 다양한 포트폴리오와 빠른 작업이 강점입니다.',
          price_min: 50000,
          price_max: 200000,
          rating: 4.8,
          review_count: 76,
          completed_projects: 89,
          experience_years: 12,
          response_time_hours: 6,
          hourly_rate: 80000,
          is_available: true,
          verified: true
        }
      ])

    if (expertsError) {
      console.error('Error adding experts:', expertsError)
    } else {
      console.log('✅ Experts added successfully')
    }

    console.log('🎉 Sample data has been added successfully!')
    console.log('You can now visit http://localhost:3010/search to see the results')

  } catch (error) {
    console.error('Error adding sample data:', error)
  }
}

addSampleData()