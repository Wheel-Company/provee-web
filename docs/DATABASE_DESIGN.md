# Provee 백엔드 데이터베이스 설계 (Supabase)

## 프론트엔드 분석 결과

### 현재 사용 중인 데이터 구조
1. **UserProfile** (useUser 훅): `id`, `username`, `email`, `name`, `phone`, `user_type`
2. **Expert** (검색 페이지): 전문가 프로필 정보
3. **QuoteRequest** (요청 페이지): 서비스 요청 정보
4. **MatchingResult**: AI 매칭 결과
5. **TrustIndicators**: 신뢰도 지표

## Supabase 데이터베이스 스키마 설계

### 1. 핵심 테이블 구조

#### `profiles` 테이블 (현재 존재, 확장 필요)
```sql
CREATE TABLE profiles (
  -- 기본 정보
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  avatar_url TEXT,

  -- 역할 및 상태
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'expert')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),

  -- 인증 상태
  phone_verified BOOLEAN DEFAULT FALSE,
  identity_verified BOOLEAN DEFAULT FALSE,
  business_verified BOOLEAN DEFAULT FALSE,

  -- 보증금 시스템
  deposit_paid BOOLEAN DEFAULT FALSE,
  deposit_amount INTEGER DEFAULT 0,
  deposit_paid_at TIMESTAMPTZ,

  -- 한국 주소 정보
  address JSONB, -- {roadAddress, jibunAddress, zipCode, city, district, neighborhood}
  coordinates POINT, -- PostGIS 좌표

  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_coordinates ON profiles USING GIST(coordinates);
```

#### `expert_profiles` 테이블 (전문가 상세 정보)
```sql
CREATE TABLE expert_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 전문가 정보
  title VARCHAR(200) NOT NULL,
  description TEXT,
  specializations TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,

  -- 가격 정보
  price_min INTEGER,
  price_max INTEGER,
  price_unit VARCHAR(20) DEFAULT 'hour' CHECK (price_unit IN ('hour', 'project', 'day')),

  -- 평점 및 리뷰
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,

  -- 가용성
  available_hours JSONB DEFAULT '[]', -- ["09:00-18:00"] 형태
  response_time_avg INTEGER DEFAULT 24, -- 평균 응답시간 (시간)

  -- 상태
  is_active BOOLEAN DEFAULT TRUE,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (
    verification_status IN ('pending', 'verified', 'rejected')
  ),

  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_expert_profiles_profile_id ON expert_profiles(profile_id);
CREATE INDEX idx_expert_profiles_rating ON expert_profiles(rating DESC);
CREATE INDEX idx_expert_profiles_specializations ON expert_profiles USING GIN(specializations);
```

#### `service_categories` 테이블
```sql
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  parent_id UUID REFERENCES service_categories(id),
  icon VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 카테고리 데이터
INSERT INTO service_categories (name, icon) VALUES
('이사/청소', 'home'),
('인테리어', 'paintbrush'),
('이벤트/파티', 'calendar'),
('과외', 'graduation-cap'),
('자동차', 'car'),
('설치/수리', 'settings'),
('외주', 'zap'),
('취업/직무', 'briefcase'),
('법률/금융', 'scale'),
('취미/자기계발', 'heart');
```

#### `service_requests` 테이블
```sql
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES service_categories(id),

  -- 요청 내용
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}', -- S3 URL 배열

  -- 예산 정보
  budget_min INTEGER,
  budget_max INTEGER,
  budget_negotiable BOOLEAN DEFAULT TRUE,

  -- 위치 정보
  location JSONB NOT NULL, -- {city, district, address, coordinates}

  -- 일정 정보
  preferred_start_date DATE,
  preferred_end_date DATE,
  time_slots TEXT[] DEFAULT '{}', -- ["morning", "afternoon", "evening"]
  is_urgent BOOLEAN DEFAULT FALSE,

  -- 연락 선호도
  contact_preference VARCHAR(20) DEFAULT 'phone' CHECK (
    contact_preference IN ('phone', 'message', 'both')
  ),

  -- 상태 관리
  status VARCHAR(20) DEFAULT 'draft' CHECK (
    status IN ('draft', 'submitted', 'matching', 'matched', 'completed', 'cancelled')
  ),

  -- AI 매칭 정보
  matching_score_threshold INTEGER DEFAULT 70,
  max_matches INTEGER DEFAULT 5,

  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- 인덱스
CREATE INDEX idx_service_requests_customer_id ON service_requests(customer_id);
CREATE INDEX idx_service_requests_category_id ON service_requests(category_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_location ON service_requests USING GIN(location);
```

#### `matching_results` 테이블
```sql
CREATE TABLE matching_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 매칭 스코어
  compatibility_score INTEGER NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),

  -- 세부 점수 (프론트엔드 breakdown에 맞춤)
  service_compatibility INTEGER NOT NULL, -- 50%
  price_compatibility INTEGER NOT NULL,   -- 20%
  location_time_compatibility INTEGER NOT NULL, -- 15%
  reputation_index INTEGER NOT NULL,      -- 15%

  -- AI 분석 결과
  ai_analysis TEXT,
  matching_reason TEXT,

  -- 상태
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'interested', 'declined', 'selected', 'completed')
  ),

  -- 전문가 응답 정보
  expert_response_at TIMESTAMPTZ,
  expert_message TEXT,

  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_matching_results_request_id ON matching_results(request_id);
CREATE INDEX idx_matching_results_expert_id ON matching_results(expert_id);
CREATE INDEX idx_matching_results_compatibility_score ON matching_results(compatibility_score DESC);
```

#### `portfolios` 테이블
```sql
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 포트폴리오 정보
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),

  -- 이미지 및 첨부파일
  images TEXT[] DEFAULT '{}', -- S3 URL 배열
  attachments TEXT[] DEFAULT '{}',

  -- 프로젝트 정보
  completed_at DATE,
  duration_days INTEGER,
  project_value INTEGER, -- 프로젝트 금액

  -- 상태
  is_featured BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,

  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_portfolios_expert_id ON portfolios(expert_id);
CREATE INDEX idx_portfolios_category ON portfolios(category);
```

#### `subscriptions` 테이블
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 구독 정보
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('customer', 'expert')),
  monthly_fee INTEGER NOT NULL, -- 9,900원 or 19,900원

  -- 상태
  status VARCHAR(20) DEFAULT 'active' CHECK (
    status IN ('active', 'cancelled', 'expired', 'suspended')
  ),

  -- 기간
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  auto_renewal BOOLEAN DEFAULT TRUE,

  -- 결제 정보
  payment_method VARCHAR(20),
  last_payment_at TIMESTAMPTZ,
  next_payment_at TIMESTAMPTZ,

  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. RLS (Row Level Security) 정책

```sql
-- profiles 테이블
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON profiles FOR ALL
USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (user_type = 'expert');

-- service_requests 테이블
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can manage their own requests"
ON service_requests FOR ALL
USING (auth.uid() = customer_id);

CREATE POLICY "Experts can view submitted requests"
ON service_requests FOR SELECT
USING (status IN ('submitted', 'matching') AND auth.uid() IN (
  SELECT id FROM profiles WHERE user_type = 'expert'
));

-- matching_results 테이블
ALTER TABLE matching_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own matching results"
ON matching_results FOR SELECT
USING (
  auth.uid() IN (
    SELECT customer_id FROM service_requests WHERE id = request_id
    UNION
    SELECT expert_id
  )
);
```

### 3. Database Functions

#### AI 매칭 함수
```sql
CREATE OR REPLACE FUNCTION calculate_matching_score(
  request_uuid UUID,
  expert_uuid UUID
) RETURNS TABLE (
  compatibility_score INTEGER,
  service_compatibility INTEGER,
  price_compatibility INTEGER,
  location_time_compatibility INTEGER,
  reputation_index INTEGER
) AS $$
DECLARE
  -- 변수 선언
BEGIN
  -- AI 매칭 로직 구현
  -- 임시로 랜덤 점수 반환 (실제로는 복잡한 알고리즘)
  RETURN QUERY
  SELECT
    85 as compatibility_score,
    90 as service_compatibility,
    80 as price_compatibility,
    75 as location_time_compatibility,
    90 as reputation_index;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4. API 엔드포인트 설계

#### REST API 엔드포인트
```
POST /api/service-requests          # 서비스 요청 생성
GET  /api/service-requests/:id      # 서비스 요청 조회
PUT  /api/service-requests/:id      # 서비스 요청 수정

GET  /api/experts                   # 전문가 목록 (필터링, 검색)
GET  /api/experts/:id               # 전문가 상세 정보
POST /api/experts/:id/contact       # 전문가 연락하기

POST /api/matching/request/:id      # AI 매칭 실행
GET  /api/matching/results/:id      # 매칭 결과 조회
POST /api/matching/results/:id/respond # 전문가 응답

GET  /api/categories               # 서비스 카테고리 목록
GET  /api/portfolios/:expertId     # 전문가 포트폴리오
```

## 구현 단계별 계획

### Phase 1: 기본 구조 (1주)
1. 기본 테이블 생성 및 데이터 마이그레이션
2. RLS 정책 설정
3. 기본 API 함수 구현

### Phase 2: 핵심 기능 (1주)
1. 서비스 요청 CRUD
2. 전문가 검색 및 필터링
3. 기본 매칭 시스템

### Phase 3: 고급 기능 (1주)
1. AI 매칭 알고리즘 구현
2. 실시간 알림 시스템
3. 파일 업로드 (포트폴리오, 첨부파일)

### Phase 4: 최적화 (1주)
1. 성능 최적화
2. 모니터링 및 로깅
3. 백업 및 보안 강화