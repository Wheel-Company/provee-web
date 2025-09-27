-- experts 테이블에 사용자 레코드 생성 (필수 필드 포함)
-- 사용자 ID: e3255922-8838-41cb-832d-cb33c925b388

-- 1. 현재 experts 레코드 확인
SELECT * FROM experts WHERE id = 'e3255922-8838-41cb-832d-cb33c925b388';

-- 2. experts 테이블에 필수 필드 포함하여 레코드 생성
INSERT INTO experts (
  id,
  location,
  is_available,
  created_at,
  updated_at
) VALUES (
  'e3255922-8838-41cb-832d-cb33c925b388',
  '서울시',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  location = COALESCE(experts.location, '서울시'),
  is_available = true,
  updated_at = NOW();

-- 3. 결과 확인
SELECT * FROM experts WHERE id = 'e3255922-8838-41cb-832d-cb33c925b388';