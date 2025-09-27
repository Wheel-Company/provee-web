-- experts 테이블에 사용자 레코드 생성
-- 사용자 ID: e3255922-8838-41cb-832d-cb33c925b388

-- 1. 먼저 experts 테이블 구조 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'experts'
ORDER BY ordinal_position;

-- 2. 현재 experts 레코드 확인
SELECT * FROM experts WHERE id = 'e3255922-8838-41cb-832d-cb33c925b388';

-- 3. experts 테이블에 기본 레코드 생성 (테이블 구조에 맞춰서)
INSERT INTO experts (
  id,
  is_available,
  created_at,
  updated_at
) VALUES (
  'e3255922-8838-41cb-832d-cb33c925b388',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  is_available = true,
  updated_at = NOW();

-- 4. 결과 확인
SELECT * FROM experts WHERE id = 'e3255922-8838-41cb-832d-cb33c925b388';