-- RLS 정책 정리 및 재생성

-- 모든 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can check username" ON profiles;
DROP POLICY IF EXISTS "Anyone can check username existence" ON profiles;
DROP POLICY IF EXISTS "Public read for registration" ON profiles;

-- 단순하고 명확한 정책들 재생성
-- 1. 인증된 사용자는 자신의 프로필만 조회
CREATE POLICY "users_select_own" ON profiles
FOR SELECT USING (auth.uid() = id);

-- 2. 회원가입을 위해 profiles 테이블 공개 읽기 허용 (전화번호/이메일 중복 체크용)
CREATE POLICY "public_select_for_signup" ON profiles
FOR SELECT USING (true);

-- 3. 인증된 사용자는 자신의 프로필만 수정
CREATE POLICY "users_update_own" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- 4. 회원가입 시 프로필 생성 허용
CREATE POLICY "users_insert_own" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);