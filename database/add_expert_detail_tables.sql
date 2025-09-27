-- Additional tables for expert detail page features

-- Expert certifications table
CREATE TABLE IF NOT EXISTS expert_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT,
    type TEXT CHECK (type IN ('professional', 'platform')) DEFAULT 'professional',
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expert FAQs table
CREATE TABLE IF NOT EXISTS expert_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expert portfolio images table
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

-- Expert service areas table
CREATE TABLE IF NOT EXISTS expert_service_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    area_name TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    travel_fee INTEGER DEFAULT 0, -- in KRW
    travel_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table (replacing mock data)
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

-- Work process steps table
CREATE TABLE IF NOT EXISTS expert_work_process (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE expert_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_work_process ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expert_certifications_expert_id ON expert_certifications(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_faqs_expert_id ON expert_faqs(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_portfolio_expert_id ON expert_portfolio(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_service_areas_expert_id ON expert_service_areas(expert_id);
CREATE INDEX IF NOT EXISTS idx_reviews_expert_id ON reviews(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_work_process_expert_id ON expert_work_process(expert_id);