-- Auth 테이블의 사용자들 삭제 (개발용)

-- 특정 이메일의 사용자 삭제
-- DELETE FROM auth.users WHERE email = 'your-email@example.com';

-- 또는 모든 테스트 사용자 삭제 (주의: 실제 사용자도 삭제될 수 있음)
-- DELETE FROM auth.users;

-- 안전한 방법: 특정 패턴의 이메일만 삭제
DELETE FROM auth.users WHERE email LIKE '%@test.com';
DELETE FROM auth.users WHERE email LIKE '%@example.com';

-- profiles 테이블의 연결되지 않은 데이터도 정리
DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);