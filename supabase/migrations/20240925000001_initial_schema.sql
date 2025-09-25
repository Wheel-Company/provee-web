-- Provee 플랫폼 초기 데이터베이스 스키마
-- 사용자, 서비스, 매칭 관련 기본 테이블들

-- 사용자 역할 enum
CREATE TYPE user_role AS ENUM ('customer', 'provider');

-- 서비스 카테고리 enum
CREATE TYPE service_category AS ENUM (
  'development',    -- 개발
  'design',        -- 디자인
  'marketing',     -- 마케팅
  'writing',       -- 문서작성
  'photo',         -- 영상/사진
  'consulting',    -- 컨설팅
  'other'          -- 기타
);

-- 매칭 상태 enum
CREATE TYPE match_status AS ENUM (
  'pending',       -- 대기중
  'matched',       -- 매칭됨
  'accepted',      -- 수락됨
  'rejected',      -- 거절됨
  'completed',     -- 완료됨
  'cancelled'      -- 취소됨
);

-- 사용자 프로필 확장 테이블
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  location_city TEXT,
  location_district TEXT,
  bio TEXT,
  website TEXT,

  -- 전문가 전용 필드
  specializations TEXT[], -- 전문 분야 배열
  hourly_rate INTEGER, -- 시간당 요금
  experience_years INTEGER,
  portfolio_urls TEXT[],

  -- 신뢰도 관련
  verification_phone BOOLEAN DEFAULT FALSE,
  verification_identity BOOLEAN DEFAULT FALSE,
  verification_business BOOLEAN DEFAULT FALSE,
  deposit_paid BOOLEAN DEFAULT FALSE,
  deposit_amount INTEGER DEFAULT 0,

  -- 평점 관련
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  total_matches INTEGER DEFAULT 0,

  -- 응답 시간 (시간 단위)
  avg_response_time DECIMAL(4,2) DEFAULT 24,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  PRIMARY KEY (id)
);

-- 서비스 등록 테이블
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category service_category NOT NULL,
  price_min INTEGER NOT NULL, -- 최소 가격 (원)
  price_max INTEGER NOT NULL, -- 최대 가격 (원)
  duration_days INTEGER, -- 예상 소요 기간 (일)
  requirements TEXT[], -- 요구사항
  deliverables TEXT[], -- 제공물
  portfolio_images TEXT[], -- 포트폴리오 이미지 URLs

  -- 지역 제한
  location_required BOOLEAN DEFAULT FALSE,
  target_cities TEXT[],

  -- 서비스 상태
  active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 서비스 매칭 요청 테이블
CREATE TABLE service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category service_category NOT NULL,
  budget_min INTEGER NOT NULL,
  budget_max INTEGER NOT NULL,
  deadline DATE,

  -- 위치 정보
  location_city TEXT,
  location_district TEXT,
  remote_work_allowed BOOLEAN DEFAULT TRUE,

  -- 요구사항
  requirements TEXT[],
  additional_info JSONB, -- 추가 정보 (유연한 구조)

  -- 상태
  status match_status DEFAULT 'pending',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AI 매칭 결과 테이블
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,

  -- 매칭 점수 (0-100)
  compatibility_score INTEGER NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),

  -- 세부 점수들
  service_compatibility INTEGER NOT NULL,
  price_compatibility INTEGER NOT NULL,
  location_compatibility INTEGER NOT NULL,
  reputation_score INTEGER NOT NULL,

  -- 매칭 상세 정보
  match_reasoning JSONB, -- AI 매칭 이유
  estimated_price INTEGER,
  estimated_duration INTEGER,

  -- 상태
  status match_status DEFAULT 'matched',
  customer_viewed_at TIMESTAMP WITH TIME ZONE,
  provider_viewed_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 리뷰 테이블
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,

  -- 세부 평가
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),

  -- 추천 여부
  would_recommend BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 알림 테이블
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  type TEXT NOT NULL, -- 'match_found', 'request_accepted', 'review_received' 등
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- 추가 데이터

  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 인덱스 생성
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_verification ON profiles(verification_phone, verification_identity, verification_business);
CREATE INDEX idx_profiles_rating ON profiles(rating DESC);

CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(active);

CREATE INDEX idx_service_requests_customer ON service_requests(customer_id);
CREATE INDEX idx_service_requests_category ON service_requests(category);
CREATE INDEX idx_service_requests_status ON service_requests(status);

CREATE INDEX idx_matches_request ON matches(request_id);
CREATE INDEX idx_matches_provider ON matches(provider_id);
CREATE INDEX idx_matches_score ON matches(compatibility_score DESC);

CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- RLS (Row Level Security) 정책 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 기본 RLS 정책들
-- 사용자는 자신의 프로필만 수정 가능, 다른 사람 프로필은 읽기만 가능
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 서비스는 모든 사람이 볼 수 있지만, 등록자만 수정 가능
CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT USING (active = true);

CREATE POLICY "Providers can insert their own services" ON services
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update their own services" ON services
  FOR UPDATE USING (auth.uid() = provider_id);

-- 서비스 요청은 요청자만 볼 수 있고, 매칭된 제공자도 볼 수 있음
CREATE POLICY "Users can view their own requests" ON service_requests
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert their own requests" ON service_requests
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own requests" ON service_requests
  FOR UPDATE USING (auth.uid() = customer_id);

-- 매칭은 관련 당사자들만 볼 수 있음
CREATE POLICY "Users can view their matches" ON matches
  FOR SELECT USING (
    auth.uid() = provider_id OR
    auth.uid() = (SELECT customer_id FROM service_requests WHERE id = request_id)
  );

-- 리뷰는 모든 사람이 볼 수 있지만, 작성자만 수정 가능
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews for their matches" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- 알림은 해당 사용자만 볼 수 있음
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);