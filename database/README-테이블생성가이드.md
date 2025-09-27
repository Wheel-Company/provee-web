# 🗄️ Supabase DB 테이블 생성 가이드

## 📋 실행 단계

### 1단계: Supabase 대시보드 접속
1. [Supabase 대시보드](https://app.supabase.com) 접속
2. Provee 프로젝트 선택
3. 좌측 메뉴에서 **SQL Editor** 클릭

### 2단계: 테이블 생성 스크립트 실행
1. **New query** 버튼 클릭
2. `/database/create-tables-manual.sql` 파일의 내용을 복사해서 붙여넣기
3. **RUN** 버튼 클릭하여 실행
4. ✅ 성공 메시지 확인

### 3단계: 샘플 데이터 삽입
1. 새로운 SQL 쿼리 생성
2. `/database/insert-sample-data.sql` 파일의 내용을 복사해서 붙여넣기
3. **RUN** 버튼 클릭하여 실행
4. ✅ 샘플 데이터 삽입 완료 확인

### 4단계: 테이블 확인
생성된 테이블들을 **Table Editor**에서 확인:
- `expert_certifications` (자격증)
- `expert_faqs` (FAQ)
- `expert_portfolio` (포트폴리오)
- `expert_service_areas` (서비스지역)
- `reviews` (리뷰)
- `expert_work_process` (작업프로세스)

## 🔐 보안 설정

### RLS (Row Level Security) 정책
- ✅ **공개 읽기**: 모든 사용자가 전문가 정보 조회 가능
- ✅ **전문가 수정**: 본인 데이터만 수정 가능
- ✅ **고객 리뷰**: 고객만 리뷰 작성/수정 가능

### 성능 최적화
- ✅ 인덱스 생성으로 조회 성능 향상
- ✅ 외래키 제약조건으로 데이터 무결성 보장

## 🎯 다음 단계

테이블 생성이 완료되면:
1. **API 수정**: Mock 데이터 대신 실제 DB 데이터 사용
2. **전문가 등록 페이지** 구현
3. **포트폴리오 업로드** 기능 추가
4. **리뷰 시스템** 구현

---

## 🚨 문제 해결

### 권한 오류 발생 시
```sql
-- 정책이 제대로 생성되지 않은 경우 다시 실행
DROP POLICY IF EXISTS "정책명" ON 테이블명;
-- 그 후 정책 다시 생성
```

### 테이블 삭제 시 (주의!)
```sql
DROP TABLE IF EXISTS expert_certifications CASCADE;
DROP TABLE IF EXISTS expert_faqs CASCADE;
-- ... (다른 테이블들)
```

---

**💡 팁**: SQL Editor에서 한 번에 모든 명령을 실행하지 말고, 섹션별로 나누어 실행하는 것을 권장합니다.