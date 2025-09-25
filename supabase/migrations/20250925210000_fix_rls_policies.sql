-- RLS 정책 수정: 회원가입 시 필요한 정책 설정

-- 기존 모든 RLS 정책 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can check username" ON profiles;
DROP POLICY IF EXISTS "Anyone can check username existence" ON profiles;

-- 새로운 RLS 정책 생성
-- 1. 사용자는 자신의 프로필을 볼 수 있음
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- 2. 회원가입을 위해 모든 사용자가 profiles 조회 가능 (임시)
CREATE POLICY "Public read for registration" ON profiles
FOR SELECT USING (true);

-- 3. 사용자는 자신의 프로필만 수정할 수 있음
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- 4. 새 사용자는 프로필을 생성할 수 있음
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);