-- 이중 역할 시스템을 위한 데이터베이스 스키마 추가

-- profiles 테이블에 active_role 컬럼 추가
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS active_role VARCHAR(20) DEFAULT 'customer' CHECK (active_role IN ('customer', 'expert'));

-- 기존 expert로 등록된 사용자들의 active_role을 expert로 설정
UPDATE profiles
SET active_role = 'expert'
WHERE id IN (
  SELECT profile_id
  FROM expert_profiles
  WHERE is_active = true
);

-- 사용자 역할 뷰 생성 (이중 역할 시스템 지원)
CREATE OR REPLACE VIEW user_roles_view AS
SELECT
  p.id,
  p.username,
  p.email,
  p.name,
  p.phone,
  p.user_type,
  p.active_role,
  CASE
    WHEN ep.profile_id IS NOT NULL THEN ARRAY['customer', 'expert']
    ELSE ARRAY['customer']
  END as available_roles,
  (ep.profile_id IS NOT NULL) as is_expert,
  true as is_customer,
  ep.is_active as expert_active,
  ep.verification_status as expert_verification_status
FROM profiles p
LEFT JOIN expert_profiles ep ON p.id = ep.profile_id;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_profiles_active_role ON profiles(active_role);

-- 설명 추가
COMMENT ON COLUMN profiles.active_role IS '현재 활성화된 역할 (customer 또는 expert)';
COMMENT ON VIEW user_roles_view IS '사용자의 모든 역할 정보를 통합한 뷰';