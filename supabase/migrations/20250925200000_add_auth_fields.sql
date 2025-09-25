-- 회원가입/로그인을 위한 profiles 테이블 필드 추가

-- profiles 테이블에 회원가입 필드 추가
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS user_type VARCHAR(20) DEFAULT 'customer';

-- username에 인덱스 추가 (로그인 성능 향상)
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- user_type check 제약조건 추가
ALTER TABLE profiles
ADD CONSTRAINT chk_user_type
CHECK (user_type IN ('customer', 'expert'));

-- RLS (Row Level Security) 정책 추가
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 프로필만 볼 수 있음
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- 사용자는 자신의 프로필만 수정할 수 있음
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- 새 사용자는 프로필을 생성할 수 있음
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);