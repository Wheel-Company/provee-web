-- ==========================================
-- Provee 전문가 상세 정보 테이블 생성 스크립트
-- Supabase SQL Editor에서 실행하세요
-- ==========================================

-- 1. Expert certifications table (자격증/인증)
CREATE TABLE IF NOT EXISTS expert_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT,
    type TEXT CHECK (type IN ('professional', 'platform')) DEFAULT 'professional',
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Expert FAQs table (자주 묻는 질문)
CREATE TABLE IF NOT EXISTS expert_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Expert portfolio images table (포트폴리오)
CREATE TABLE IF NOT EXISTS expert_portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    category TEXT, -- 'before', 'after', 'work', 'design' etc
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Expert service areas table (서비스 지역)
CREATE TABLE IF NOT EXISTS expert_service_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    area_name TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    travel_fee INTEGER DEFAULT 0, -- in KRW
    travel_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Reviews table (리뷰)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    service_type TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Work process steps table (작업 프로세스)
CREATE TABLE IF NOT EXISTS expert_work_process (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- RLS (Row Level Security) 활성화
-- ==========================================

ALTER TABLE expert_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_work_process ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 공개 읽기 정책 생성
-- ==========================================

CREATE POLICY "Expert certifications are viewable by everyone" ON expert_certifications
    FOR SELECT USING (true);

CREATE POLICY "Expert FAQs are viewable by everyone" ON expert_faqs
    FOR SELECT USING (true);

CREATE POLICY "Expert portfolio is viewable by everyone" ON expert_portfolio
    FOR SELECT USING (true);

CREATE POLICY "Expert service areas are viewable by everyone" ON expert_service_areas
    FOR SELECT USING (true);

CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Expert work process is viewable by everyone" ON expert_work_process
    FOR SELECT USING (true);

-- ==========================================
-- 전문가 본인만 수정 가능 정책 생성
-- ==========================================

-- 자격증 수정 정책
CREATE POLICY "Experts can insert their own certifications" ON expert_certifications
    FOR INSERT WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Experts can update their own certifications" ON expert_certifications
    FOR UPDATE USING (auth.uid() = expert_id);

CREATE POLICY "Experts can delete their own certifications" ON expert_certifications
    FOR DELETE USING (auth.uid() = expert_id);

-- FAQ 수정 정책
CREATE POLICY "Experts can insert their own FAQs" ON expert_faqs
    FOR INSERT WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Experts can update their own FAQs" ON expert_faqs
    FOR UPDATE USING (auth.uid() = expert_id);

CREATE POLICY "Experts can delete their own FAQs" ON expert_faqs
    FOR DELETE USING (auth.uid() = expert_id);

-- 포트폴리오 수정 정책
CREATE POLICY "Experts can insert their own portfolio" ON expert_portfolio
    FOR INSERT WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Experts can update their own portfolio" ON expert_portfolio
    FOR UPDATE USING (auth.uid() = expert_id);

CREATE POLICY "Experts can delete their own portfolio" ON expert_portfolio
    FOR DELETE USING (auth.uid() = expert_id);

-- 서비스 지역 수정 정책
CREATE POLICY "Experts can insert their own service areas" ON expert_service_areas
    FOR INSERT WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Experts can update their own service areas" ON expert_service_areas
    FOR UPDATE USING (auth.uid() = expert_id);

CREATE POLICY "Experts can delete their own service areas" ON expert_service_areas
    FOR DELETE USING (auth.uid() = expert_id);

-- 작업 프로세스 수정 정책
CREATE POLICY "Experts can insert their own work process" ON expert_work_process
    FOR INSERT WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Experts can update their own work process" ON expert_work_process
    FOR UPDATE USING (auth.uid() = expert_id);

CREATE POLICY "Experts can delete their own work process" ON expert_work_process
    FOR DELETE USING (auth.uid() = expert_id);

-- 리뷰는 고객만 작성 가능 (전문가는 읽기만)
CREATE POLICY "Customers can insert reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = customer_id);

-- ==========================================
-- 성능을 위한 인덱스 생성
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_expert_certifications_expert_id ON expert_certifications(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_faqs_expert_id ON expert_faqs(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_portfolio_expert_id ON expert_portfolio(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_service_areas_expert_id ON expert_service_areas(expert_id);
CREATE INDEX IF NOT EXISTS idx_reviews_expert_id ON reviews(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_work_process_expert_id ON expert_work_process(expert_id);

-- FAQ 정렬용 인덱스
CREATE INDEX IF NOT EXISTS idx_expert_faqs_display_order ON expert_faqs(expert_id, display_order);

-- 포트폴리오 정렬용 인덱스
CREATE INDEX IF NOT EXISTS idx_expert_portfolio_display_order ON expert_portfolio(expert_id, display_order);

-- 작업 프로세스 정렬용 인덱스
CREATE INDEX IF NOT EXISTS idx_expert_work_process_step ON expert_work_process(expert_id, step_number);

-- 리뷰 정렬용 인덱스
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(expert_id, created_at DESC);

-- ==========================================
-- 완료 메시지
-- ==========================================

-- 이 스크립트 실행이 완료되면 다음 단계로 진행하세요:
-- 1. 샘플 데이터 삽입 스크립트 실행
-- 2. API에서 실제 DB 테이블 사용하도록 수정
-- 3. 전문가 등록/수정 페이지 구현