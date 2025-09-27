-- 사용자 프로필 간단 수정
-- 현재 사용자 ID: e3255922-8838-41cb-832d-cb33c925b388

-- 1. 현재 프로필 확인
SELECT * FROM profiles WHERE id = 'e3255922-8838-41cb-832d-cb33c925b388';

-- 2. 프로필이 없으면 생성하고 user_type을 expert로 설정
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

-- 3. 결과 확인
SELECT * FROM profiles WHERE id = 'e3255922-8838-41cb-832d-cb33c925b388';