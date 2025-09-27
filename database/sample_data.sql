-- Sample Data for Provee Platform Testing
-- This file creates test data for development and testing purposes

-- Note: This assumes Supabase Auth users have already been created
-- You would need to create users through Supabase Auth first, then run this script

-- 1. Sample Profiles (these IDs should match actual Supabase Auth user IDs)
-- In a real setup, these would be created after users sign up through Supabase Auth

-- For testing, let's insert some sample profiles
-- (In production, these would be created through the registration process)

INSERT INTO profiles (
  id, username, email, name, phone, user_type,
  phone_verified, identity_verified, address, status
) VALUES
-- Customers
(
  '550e8400-e29b-41d4-a716-446655440000',
  'customer1', 'customer1@test.com', '김고객', '010-1234-5678', 'customer',
  true, true,
  '{"city": "서울시", "district": "강남구", "roadAddress": "테헤란로 123", "zipCode": "06142"}',
  'active'
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'customer2', 'customer2@test.com', '이고객', '010-2345-6789', 'customer',
  true, false,
  '{"city": "서울시", "district": "서초구", "roadAddress": "서초대로 456", "zipCode": "06543"}',
  'active'
),
-- Experts
(
  '550e8400-e29b-41d4-a716-446655440010',
  'expert1', 'expert1@test.com', '박전문가', '010-3456-7890', 'expert',
  true, true,
  '{"city": "서울시", "district": "강남구", "roadAddress": "역삼로 789", "zipCode": "06234"}',
  'active'
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  'expert2', 'expert2@test.com', '최전문가', '010-4567-8901', 'expert',
  true, true,
  '{"city": "서울시", "district": "송파구", "roadAddress": "올림픽로 321", "zipCode": "05551"}',
  'active'
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  'expert3', 'expert3@test.com', '정전문가', '010-5678-9012', 'expert',
  true, true,
  '{"city": "서울시", "district": "마포구", "roadAddress": "월드컵로 654", "zipCode": "03923"}',
  'active'
);

-- 2. Expert Profiles
INSERT INTO expert_profiles (
  profile_id, title, description, specializations,
  experience_years, price_min, price_max, rating, review_count,
  is_active, verification_status
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440010',
  '프리미엄 홈클리닝 전문가',
  '10년 경력의 홈클리닝 전문가입니다. 꼼꼼하고 신뢰할 수 있는 서비스를 제공합니다.',
  ARRAY['이사/청소', '홈클리닝', '정리정돈'],
  10, 50000, 150000, 4.8, 127,
  true, 'verified'
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  '인테리어 디자이너 & 시공 전문가',
  '주거공간 인테리어 설계부터 시공까지 원스톱 서비스를 제공합니다.',
  ARRAY['인테리어', '리모델링', '설계'],
  8, 100000, 500000, 4.6, 89,
  true, 'verified'
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  '수학/영어 전문 과외 선생님',
  '서울대 출신으로 중고등학생 수학, 영어 과외를 전문으로 합니다.',
  ARRAY['과외', '수학', '영어'],
  5, 40000, 80000, 4.9, 156,
  true, 'verified'
);

-- 3. Sample Portfolios
INSERT INTO portfolios (
  expert_id, title, description, category,
  completed_at, project_value, is_featured, is_public
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440010',
  '강남 아파트 전체 청소',
  '3룸 아파트 이사 후 전체 청소 작업을 완료했습니다.',
  '이사/청소',
  '2024-01-15', 120000, true, true
),
(
  '550e8400-e29b-41d4-a716-446655440010',
  '사무실 정기 청소 서비스',
  '50평 규모 사무실 주간 정기 청소 서비스를 제공했습니다.',
  '이사/청소',
  '2024-02-20', 200000, false, true
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  '아파트 리모델링 프로젝트',
  '30평 아파트 전체 리모델링 작업을 성공적으로 완료했습니다.',
  '인테리어',
  '2024-01-30', 15000000, true, true
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  '고3 학생 수학 성적 향상',
  '모의고사 3등급에서 1등급으로 성적 향상시킨 사례입니다.',
  '과외',
  '2024-03-01', 2400000, true, true
);

-- 4. Sample Service Requests
INSERT INTO service_requests (
  id, customer_id, category_id, title, description,
  budget_min, budget_max, location,
  preferred_start_date, preferred_end_date,
  time_slots, contact_preference, status
) VALUES
(
  '660e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440000',
  (SELECT id FROM service_categories WHERE name = '이사/청소'),
  '신축 아파트 입주 청소',
  '새로 지은 아파트에 입주 예정입니다. 전체적인 청소가 필요합니다. 4룸이고 화장실 3개, 베란다 2개 있습니다.',
  80000, 150000,
  '{"city": "서울시", "district": "강남구", "address": "테헤란로 123번길 45", "coordinates": {"lat": 37.5665, "lng": 126.9780}}',
  '2024-09-30', '2024-10-05',
  ARRAY['morning', 'afternoon'], 'both', 'submitted'
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM service_categories WHERE name = '인테리어'),
  '원룸 인테리어 컨설팅',
  '15평 원룸 인테리어 컨설팅을 원합니다. 공간 활용과 가구 배치에 대한 조언이 필요합니다.',
  300000, 500000,
  '{"city": "서울시", "district": "서초구", "address": "서초대로 456번길 78"}',
  '2024-10-01', '2024-10-10',
  ARRAY['weekend'], 'phone', 'submitted'
);

-- 5. Sample Matching Results (AI matching results)
-- First, let's create matching results using our AI function
WITH matching_data AS (
  SELECT
    '660e8400-e29b-41d4-a716-446655440000'::UUID as request_id,
    '550e8400-e29b-41d4-a716-446655440010'::UUID as expert_id
)
INSERT INTO matching_results (
  request_id, expert_id, compatibility_score,
  service_compatibility, price_compatibility,
  location_time_compatibility, reputation_index,
  ai_analysis, status
)
SELECT
  md.request_id, md.expert_id, 87,
  90, 85, 80, 88,
  'High compatibility match - Expert specializes in home cleaning with excellent ratings in Gangnam area.',
  'pending'
FROM matching_data md;

-- Add another matching result
INSERT INTO matching_results (
  request_id, expert_id, compatibility_score,
  service_compatibility, price_compatibility,
  location_time_compatibility, reputation_index,
  ai_analysis, status
) VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440011',
  82, 95, 75, 70, 85,
  'Good match for interior consultation - Expert has strong portfolio in apartment remodeling.',
  'interested'
);

-- 6. Sample Subscriptions
INSERT INTO subscriptions (
  profile_id, plan_type, monthly_fee,
  start_date, end_date, status
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440000',
  'customer', 9900,
  '2024-09-01', '2024-12-01', 'active'
),
(
  '550e8400-e29b-41d4-a716-446655440010',
  'expert', 19900,
  '2024-08-15', '2024-11-15', 'active'
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  'expert', 19900,
  '2024-09-01', '2024-12-01', 'active'
);

-- 7. Add some additional service categories for completeness
INSERT INTO service_categories (name, icon, sort_order) VALUES
('마사지/헬스케어', 'heart-pulse', 11),
('반려동물', 'dog', 12),
('요리/케이터링', 'chef-hat', 13)
ON CONFLICT (name) DO NOTHING;

-- Update some coordinates for better testing
UPDATE profiles SET
  coordinates = ST_SetSRID(ST_MakePoint(126.9780, 37.5665), 4326)
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE profiles SET
  coordinates = ST_SetSRID(ST_MakePoint(127.0276, 37.4979), 4326)
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE profiles SET
  coordinates = ST_SetSRID(ST_MakePoint(127.0374, 37.5665), 4326)
WHERE id = '550e8400-e29b-41d4-a716-446655440010';

-- Add some deposit information
UPDATE profiles SET
  deposit_paid = true,
  deposit_amount = 10000,
  deposit_paid_at = NOW() - INTERVAL '30 days'
WHERE user_type = 'customer';

UPDATE profiles SET
  deposit_paid = true,
  deposit_amount = 50000,
  deposit_paid_at = NOW() - INTERVAL '45 days'
WHERE user_type = 'expert';

COMMENT ON EXTENSION "uuid-ossp" IS 'Sample data for Provee platform testing';
COMMENT ON EXTENSION "postgis" IS 'PostGIS extension for location-based features';

-- Create a view for easy expert searching (used by frontend)
CREATE OR REPLACE VIEW expert_search_view AS
SELECT
  p.id,
  p.name,
  p.avatar_url,
  ep.title,
  ep.description,
  ep.specializations,
  ep.rating,
  ep.review_count,
  ep.price_min,
  ep.price_max,
  ep.experience_years,
  ep.response_time_avg,
  p.address as location,
  p.coordinates,
  ep.verification_status,
  ep.is_active
FROM profiles p
JOIN expert_profiles ep ON ep.profile_id = p.id
WHERE p.user_type = 'expert'
  AND p.status = 'active'
  AND ep.is_active = true
  AND ep.verification_status = 'verified';

COMMENT ON VIEW expert_search_view IS 'Optimized view for expert search functionality';