-- Sample data for experts table to show in search results
-- Insert sample profiles first (these would normally be created via Supabase Auth)

INSERT INTO profiles (id, username, email, name, phone, user_type, district) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'expert_cleaner1', 'cleaner1@example.com', '김청소', '010-1234-5678', 'expert', '강남구'),
('550e8400-e29b-41d4-a716-446655440021', 'expert_cleaner2', 'cleaner2@example.com', '박깨끗', '010-2234-5679', 'expert', '서초구'),
('550e8400-e29b-41d4-a716-446655440022', 'expert_repair1', 'repair1@example.com', '이수리', '010-3234-5680', 'expert', '송파구'),
('550e8400-e29b-41d4-a716-446655440023', 'expert_tutor1', 'tutor1@example.com', '최과외', '010-4234-5681', 'expert', '마포구'),
('550e8400-e29b-41d4-a716-446655440024', 'expert_designer1', 'designer1@example.com', '정디자인', '010-5234-5682', 'expert', '용산구')
ON CONFLICT (id) DO NOTHING;

-- Insert sample experts data
INSERT INTO experts (
    id,
    category,
    services,
    location,
    description,
    price_min,
    price_max,
    rating,
    review_count,
    completed_projects,
    experience_years,
    response_time_hours,
    hourly_rate,
    is_available,
    verified
) VALUES
(
    '550e8400-e29b-41d4-a716-446655440020',
    ARRAY['청소'::service_category],
    ARRAY['홈클리닝', '사무실청소', '입주청소', '이사청소'],
    '서울시 강남구',
    '10년 경력의 전문 홈클리닝 서비스를 제공합니다. 꼼꼼하고 깨끗한 청소로 고객만족도 98%를 자랑합니다.',
    15000,
    30000,
    4.8,
    127,
    234,
    10,
    2,
    20000,
    true,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440021',
    ARRAY['청소'::service_category],
    ARRAY['홈클리닝', '정리정돈', '화장실청소', '주방청소'],
    '서울시 서초구',
    '친환경 세제를 사용한 안전한 청소 서비스입니다. 아이가 있는 집도 안심하고 맡기세요.',
    12000,
    25000,
    4.7,
    89,
    156,
    7,
    1,
    18000,
    true,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440022',
    ARRAY['수리'::service_category],
    ARRAY['가전수리', '가구수리', '도배', '페인팅', '배관수리'],
    '서울시 송파구',
    '20년 경력의 종합 수리 전문가입니다. 정확한 진단과 합리적인 가격으로 서비스를 제공합니다.',
    20000,
    80000,
    4.6,
    145,
    278,
    20,
    3,
    35000,
    true,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440023',
    ARRAY['과외'::service_category],
    ARRAY['영어과외', '수학과외', '토익', '토플', '회화'],
    '서울시 마포구',
    '서울대 영어교육과 출신으로 체계적인 영어 교육을 제공합니다. 학생별 맞춤 커리큘럼으로 목표 달성률 95%!',
    40000,
    60000,
    4.9,
    198,
    156,
    8,
    4,
    50000,
    true,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440024',
    ARRAY['디자인'::service_category],
    ARRAY['로고디자인', '브랜딩', '웹디자인', '인쇄물디자인', 'UI/UX'],
    '서울시 용산구',
    '감각적이고 트렌디한 디자인으로 브랜드 가치를 높여드립니다. 다양한 포트폴리오와 빠른 작업이 강점입니다.',
    50000,
    200000,
    4.8,
    76,
    89,
    12,
    6,
    80000,
    true,
    true
),
-- Additional experts for better search results
(
    '550e8400-e29b-41d4-a716-446655440025',
    ARRAY['청소'::service_category],
    ARRAY['카펫청소', '쇼파청소', '매트리스청소'],
    '서울시 강동구',
    '전문 장비를 이용한 카펫, 쇼파 전문 청소업체입니다. 진드기 제거와 세균 박멸까지!',
    25000,
    50000,
    4.5,
    67,
    123,
    6,
    2,
    30000,
    true,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440026',
    ARRAY['수리'::service_category],
    ARRAY['에어컨수리', '세탁기수리', '냉장고수리', '전자제품수리'],
    '서울시 영등포구',
    '모든 브랜드 가전제품 수리 가능합니다. A/S센터 출신 기사가 직접 방문하여 정확한 진단과 수리를 해드립니다.',
    15000,
    100000,
    4.7,
    234,
    456,
    15,
    1,
    40000,
    true,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440027',
    ARRAY['과외'::service_category],
    ARRAY['수학과외', '물리과외', '화학과외', '입시상담'],
    '서울시 노원구',
    '연세대 의대생이 직접 지도하는 이과 전문 과외입니다. 내신부터 수능까지 완벽 대비!',
    35000,
    55000,
    4.8,
    112,
    89,
    5,
    2,
    45000,
    true,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Add corresponding profiles for the additional experts
INSERT INTO profiles (id, username, email, name, phone, user_type, district) VALUES
('550e8400-e29b-41d4-a716-446655440025', 'expert_cleaner3', 'carpet@example.com', '홍카펫', '010-6234-5683', 'expert', '강동구'),
('550e8400-e29b-41d4-a716-446655440026', 'expert_repair2', 'appliance@example.com', '신가전', '010-7234-5684', 'expert', '영등포구'),
('550e8400-e29b-41d4-a716-446655440027', 'expert_tutor2', 'math@example.com', '김수학', '010-8234-5685', 'expert', '노원구')
ON CONFLICT (id) DO NOTHING;