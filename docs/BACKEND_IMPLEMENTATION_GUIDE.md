# Provee 백엔드 구현 가이드

## 완성된 설계 개요

프론트엔드 기반으로 Supabase 백엔드의 완전한 설계와 구현이 완료되었습니다.

### 🏗️ 완성된 구성요소

1. **데이터베이스 스키마** (`database/init.sql`)
2. **RLS 보안 정책** (`database/rls_policies.sql`)
3. **비즈니스 로직 함수** (`database/functions.sql`)
4. **테스트 데이터** (`database/sample_data.sql`)
5. **TypeScript API 클라이언트** (`src/lib/api.ts`)

## 🚀 구현 단계

### Phase 1: Supabase 프로젝트 설정
1. **Supabase 프로젝트 생성**
   ```bash
   # Supabase CLI 설치
   npm install -g supabase

   # 프로젝트 초기화
   supabase init

   # 로컬 개발 환경 시작
   supabase start
   ```

2. **데이터베이스 스키마 적용**
   ```bash
   # Supabase 대시보드에서 SQL 편집기를 통해 실행하거나
   # CLI를 통해 마이그레이션 실행

   cd web/database

   # 1. 기본 테이블 생성
   supabase db reset --with-seed

   # 또는 각 파일을 순서대로 실행:
   # init.sql -> rls_policies.sql -> functions.sql -> sample_data.sql
   ```

### Phase 2: 환경 변수 설정
```bash
# .env.local 파일 업데이트
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### Phase 3: 프론트엔드 연동
기존 Mock 데이터를 실제 API 호출로 교체합니다.

## 📊 데이터베이스 구조

### 핵심 테이블
- **profiles**: 사용자 기본 정보 (Supabase Auth 확장)
- **expert_profiles**: 전문가 상세 정보
- **service_categories**: 서비스 카테고리
- **service_requests**: 서비스 요청
- **matching_results**: AI 매칭 결과
- **portfolios**: 전문가 포트폴리오
- **subscriptions**: 구독 관리

### 주요 관계
```
profiles (1) -> expert_profiles (1)
profiles (1) -> service_requests (N)
service_requests (1) -> matching_results (N)
profiles (1) -> portfolios (N)
```

## 🔐 보안 및 권한

### RLS (Row Level Security) 정책
- **profiles**: 본인 프로필만 수정 가능, 전문가 프로필은 공개
- **service_requests**: 고객은 본인 요청만 관리, 전문가는 제출된 요청 조회 가능
- **matching_results**: 관련 고객/전문가만 조회 가능
- **portfolios**: 전문가는 본인 포트폴리오만 관리, 공개 포트폴리오는 누구나 조회

### 데이터 접근 패턴
```typescript
// 예시: 전문가 검색
const { data } = await ProveeAPI.searchExperts({
  category: '이사/청소',
  location: { city: '서울시', district: '강남구' },
  priceRange: { max: 100000 }
});

// 예시: 서비스 요청 생성
const requestId = await ProveeAPI.createServiceRequest({
  title: '홈클리닝 서비스 요청',
  description: '3룸 아파트 전체 청소',
  category_id: categoryId,
  budget_min: 50000,
  budget_max: 100000,
  location: koreanAddress
});
```

## 🧠 AI 매칭 알고리즘

### 매칭 점수 계산 (calculate_matching_score 함수)
- **서비스 호환성** (50%): 전문가 전문분야와 요청 카테고리 일치도
- **가격 호환성** (20%): 예산과 전문가 요금의 적합성
- **위치/시간 호환성** (15%): 지리적 근접성과 시간 가용성
- **신뢰도 지수** (15%): 평점, 리뷰 수, 인증 상태

### 매칭 프로세스
1. 고객이 서비스 요청 제출
2. `execute_ai_matching()` 함수 호출
3. 적합한 전문가들을 찾아 점수 계산
4. 임계값(기본 70%) 이상인 매칭만 반환
5. 전문가에게 알림 및 응답 대기

## 📱 프론트엔드 통합 예시

### useUser 훅 업데이트
```typescript
// 기존 Mock 데이터 대신 실제 API 사용
const { profile } = await ProveeAPI.getCurrentUserProfile();
```

### 검색 페이지 업데이트
```typescript
// src/app/search/page.tsx
const handleSearch = async () => {
  const { data, error } = await ProveeAPI.searchExperts({
    category: selectedCategory,
    query: searchQuery,
    location: { city: selectedCity }
  });

  if (data) {
    setExperts(data);
  }
};
```

### 서비스 요청 페이지 업데이트
```typescript
// src/app/request/page.tsx
const handleSubmitRequest = async () => {
  const requestId = await ProveeAPI.createServiceRequest(requestData);
  if (requestId) {
    await ProveeAPI.submitServiceRequest(requestId);
    // AI 매칭 실행
    await ProveeAPI.executeMatching(requestId);
  }
};
```

## 🧪 테스트 데이터

### 샘플 사용자
- **고객**: customer1@test.com, customer2@test.com
- **전문가**: expert1@test.com (홈클리닝), expert2@test.com (인테리어), expert3@test.com (과외)

### 샘플 서비스 요청
- 신축 아파트 입주 청소 (강남구)
- 원룸 인테리어 컨설팅 (서초구)

## 🔄 다음 단계

### 즉시 구현 가능
1. **Category Selection**: 홈페이지 카테고리를 실제 DB에서 로드
2. **Expert Search**: 필터링과 검색 기능 실제 API 연동
3. **Service Request**: 다단계 폼을 실제 데이터베이스와 연동
4. **User Profile**: 프로필 관리 기능 실제 데이터 사용

### 향후 개선사항
1. **실시간 알림**: Supabase Realtime으로 매칭 결과 즉시 알림
2. **파일 업로드**: Supabase Storage로 이미지/첨부파일 관리
3. **결제 시스템**: 토스페이먼츠 API 연동
4. **고급 매칭**: 머신러닝 기반 매칭 알고리즘 개선

## 🚨 주의사항

### 데이터 마이그레이션
- 기존 Mock 데이터에서 실제 DB 구조로 점진적 전환
- 타입 안정성을 위해 TypeScript 인터페이스 업데이트 필요

### 성능 최적화
- 인덱스 최적화: 검색 쿼리 성능 모니터링
- 캐싱 전략: React Query나 SWR로 API 응답 캐싱
- 이미지 최적화: Next.js Image 컴포넌트와 Supabase Storage 연동

### 보안 검토
- RLS 정책 테스트: 권한이 없는 데이터 접근 방지 확인
- SQL 인젝션 방지: parameterized queries 사용
- 민감 정보 보호: 개인정보 암호화 및 접근 제한

이 설계를 기반으로 단계별 구현을 진행하면 완전한 Soomgo 스타일의 서비스 매칭 플랫폼을 구축할 수 있습니다.