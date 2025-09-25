-- 전화번호 중복 방지를 위한 UNIQUE 제약조건 추가

-- phone 필드에 UNIQUE 제약조건 추가 (NULL 값 허용)
ALTER TABLE profiles
ADD CONSTRAINT unique_phone UNIQUE (phone);