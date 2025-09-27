-- 사용자 프로필 확인 및 수정
-- 현재 사용자 ID: e3255922-8838-41cb-832d-cb33c925b388

-- 1. 현재 프로필 확인
SELECT * FROM profiles WHERE id = 'e3255922-8838-41cb-832d-cb33c925b388';

-- 2. 프로필이 없으면 생성
INSERT INTO profiles (
  id,
  username,
  email,
  name,
  user_type
) VALUES (
  'e3255922-8838-41cb-832d-cb33c925b388',
  'expert_user',
  'wheelcompany8@gmail.com',
  '전문가 사용자',
  'expert'
) ON CONFLICT (id) DO UPDATE SET
  user_type = 'expert',
  name = COALESCE(profiles.name, '전문가 사용자');

-- 3. experts 테이블에도 레코드 생성
INSERT INTO experts (
  id,
  name,
  category,
  location,
  phone,
  description,
  rating,
  review_count,
  years_experience,
  hourly_rate,
  response_time_minutes,
  availability_hours,
  languages,
  background_check,
  created_at
) VALUES (
  'e3255922-8838-41cb-832d-cb33c925b388',
  '전문가 사용자',
  ARRAY['청소'],
  '서울시 강남구',
  '010-1234-5678',
  '안녕하세요! 전문적인 서비스를 제공하는 전문가입니다.',
  4.5,
  0,
  3,
  25000,
  30,
  '평일 09:00-18:00',
  ARRAY['한국어'],
  true,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = COALESCE(experts.name, '전문가 사용자'),
  category = COALESCE(experts.category, ARRAY['청소']);

-- 4. 결과 확인
SELECT
  p.id,
  p.username,
  p.email,
  p.name,
  p.user_type,
  e.name as expert_name,
  e.category
FROM profiles p
LEFT JOIN experts e ON p.id = e.id
WHERE p.id = 'e3255922-8838-41cb-832d-cb33c925b388';