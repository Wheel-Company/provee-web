-- MVP용 테이블 생성
-- PRD 요구사항에 따른 기본 테이블 구조

-- 서비스 카테고리 enum 추가
CREATE TYPE service_category AS ENUM (
  '청소',
  '수리',
  '과외',
  '디자인'
);

-- 서비스 요청 테이블 수정 (MVP 요구사항에 맞춤)
-- 기존 데이터 정리 (영어 -> 한글 매핑)
UPDATE service_requests SET category =
  CASE
    WHEN category = 'cleaning' THEN '청소'
    WHEN category = 'repair' THEN '수리'
    WHEN category = 'tutoring' THEN '과외'
    WHEN category = 'design' THEN '디자인'
    ELSE '청소'
  END;

-- 기존 컬럼을 임시 컬럼으로 변경하고 새 컬럼 추가
ALTER TABLE service_requests RENAME COLUMN category TO category_old;
ALTER TABLE service_requests ADD COLUMN category service_category DEFAULT '청소';

-- 데이터 복사
UPDATE service_requests SET category =
  CASE
    WHEN category_old = 'cleaning' THEN '청소'
    WHEN category_old = 'repair' THEN '수리'
    WHEN category_old = 'tutoring' THEN '과외'
    WHEN category_old = 'design' THEN '디자인'
    ELSE '청소'
  END::service_category;

-- 기존 컬럼 삭제 후 NOT NULL 제약조건 추가
ALTER TABLE service_requests DROP COLUMN category_old;
ALTER TABLE service_requests ALTER COLUMN category SET NOT NULL;

-- experts 테이블에 필요한 컬럼들 추가
ALTER TABLE experts
ADD COLUMN IF NOT EXISTS category service_category[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS hourly_rate INTEGER,
ADD COLUMN IF NOT EXISTS response_time_hours INTEGER DEFAULT 24,
ADD COLUMN IF NOT EXISTS completed_projects INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- 매칭 결과를 위한 추가 컬럼
ALTER TABLE matches
ADD COLUMN IF NOT EXISTS service_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS location_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_score INTEGER DEFAULT 0;

-- profiles 테이블에 위치 정보 추가
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS district VARCHAR(50); -- 구/군 정보

-- 매칭 요청 처리를 위한 함수 생성
CREATE OR REPLACE FUNCTION calculate_match_score(
  request_category service_category,
  request_location VARCHAR,
  request_budget_min INTEGER,
  request_budget_max INTEGER,
  expert_category service_category[],
  expert_location VARCHAR,
  expert_price_min INTEGER,
  expert_price_max INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  service_score INTEGER := 0;
  location_score INTEGER := 0;
  price_score INTEGER := 0;
  total_score INTEGER;
BEGIN
  -- 서비스 매칭 점수 (60점 만점)
  IF request_category = ANY(expert_category) THEN
    service_score := 60;
  END IF;

  -- 지역 매칭 점수 (25점 만점)
  IF request_location = expert_location THEN
    location_score := 25;
  ELSIF POSITION('서울' IN request_location) > 0 AND POSITION('서울' IN expert_location) > 0 THEN
    location_score := 15;  -- 같은 시
  END IF;

  -- 가격 매칭 점수 (15점 만점)
  IF expert_price_min <= request_budget_max AND expert_price_max >= request_budget_min THEN
    price_score := 15;  -- 예산 범위 내
  ELSIF expert_price_min <= request_budget_max * 1.2 THEN
    price_score := 7;   -- 20% 초과
  END IF;

  total_score := service_score + location_score + price_score;

  RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- 매칭 결과 생성 함수
CREATE OR REPLACE FUNCTION create_matches_for_request(request_id UUID)
RETURNS VOID AS $$
DECLARE
  request_row service_requests%ROWTYPE;
  expert_row experts%ROWTYPE;
  expert_profile profiles%ROWTYPE;
  match_score INTEGER;
  match_id UUID;
BEGIN
  -- 요청 정보 가져오기
  SELECT * INTO request_row FROM service_requests WHERE id = request_id;

  -- 모든 활성 전문가에 대해 매칭 점수 계산
  FOR expert_row IN
    SELECT e.* FROM experts e
    WHERE e.verified = true
    AND e.id IN (SELECT id FROM profiles WHERE user_type = 'expert')
  LOOP
    -- 전문가 프로필 정보 가져오기
    SELECT * INTO expert_profile FROM profiles WHERE id = expert_row.id;

    -- 매칭 점수 계산
    match_score := calculate_match_score(
      request_row.category,
      request_row.location,
      request_row.budget_min,
      request_row.budget_max,
      expert_row.category,
      expert_row.location,
      expert_row.price_min,
      expert_row.price_max
    );

    -- 50점 이상일 때만 매칭 생성
    IF match_score >= 50 THEN
      INSERT INTO matches (
        customer_id,
        expert_id,
        request_id,
        match_score,
        service_score,
        location_score,
        price_score,
        status
      ) VALUES (
        request_row.customer_id,
        expert_row.id,
        request_id,
        match_score,
        CASE WHEN request_row.category = ANY(expert_row.category) THEN 60 ELSE 0 END,
        CASE WHEN request_row.location = expert_row.location THEN 25
             WHEN POSITION('서울' IN request_row.location) > 0 AND POSITION('서울' IN expert_row.location) > 0 THEN 15
             ELSE 0 END,
        CASE WHEN expert_row.price_min <= request_row.budget_max AND expert_row.price_max >= request_row.budget_min THEN 15
             WHEN expert_row.price_min <= request_row.budget_max * 1.2 THEN 7
             ELSE 0 END,
        'pending'
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 새 요청이 생성될 때 자동으로 매칭 생성하는 트리거
CREATE OR REPLACE FUNCTION trigger_create_matches()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_matches_for_request(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS auto_create_matches ON service_requests;
CREATE TRIGGER auto_create_matches
  AFTER INSERT ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_matches();

-- MVP 테스트용 샘플 데이터 삽입
INSERT INTO profiles (id, email, name, user_type, phone, district) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'expert1@example.com', '김전문', 'expert', '010-1111-1111', '강남구'),
('550e8400-e29b-41d4-a716-446655440002', 'expert2@example.com', '이전문', 'expert', '010-2222-2222', '강남구'),
('550e8400-e29b-41d4-a716-446655440003', 'expert3@example.com', '박프로', 'expert', '010-3333-3333', '서초구'),
('550e8400-e29b-41d4-a716-446655440004', 'customer1@example.com', '김고객', 'customer', '010-9999-9999', '강남구')
ON CONFLICT (email) DO NOTHING;

INSERT INTO experts (id, location, category, services, price_min, price_max, verified, rating, review_count, experience_years, hourly_rate, response_time_hours, completed_projects) VALUES
('550e8400-e29b-41d4-a716-446655440001', '서울 강남구', '{"청소"}', '{"일반청소", "대청소", "이사청소"}', 300000, 500000, true, 4.8, 24, 5, 30000, 2, 156),
('550e8400-e29b-41d4-a716-446655440002', '서울 강남구', '{"청소"}', '{"홈클리닝", "사무실청소"}', 250000, 450000, true, 4.6, 18, 3, 28000, 4, 89),
('550e8400-e29b-41d4-a716-446655440003', '서울 서초구', '{"청소", "수리"}', '{"청소", "간단수리"}', 400000, 600000, true, 4.9, 36, 7, 35000, 1, 245)
ON CONFLICT (id) DO UPDATE SET
  location = EXCLUDED.location,
  category = EXCLUDED.category,
  services = EXCLUDED.services,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  verified = EXCLUDED.verified,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  experience_years = EXCLUDED.experience_years,
  hourly_rate = EXCLUDED.hourly_rate,
  response_time_hours = EXCLUDED.response_time_hours,
  completed_projects = EXCLUDED.completed_projects;