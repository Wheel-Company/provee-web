-- Provee Platform Database Schema
-- Supabase PostgreSQL with PostGIS for location data

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS matching_results CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS expert_profiles CASCADE;
DROP TABLE IF EXISTS service_categories CASCADE;
-- Note: profiles table is managed by Supabase Auth, we'll extend it

-- 1. Service Categories Table
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  parent_id UUID REFERENCES service_categories(id),
  icon VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories (matching frontend homepage)
INSERT INTO service_categories (name, icon, sort_order) VALUES
('이사/청소', 'home', 1),
('인테리어', 'brush', 2),
('이벤트/파티', 'calendar', 3),
('과외', 'graduation-cap', 4),
('자동차', 'car', 5),
('설치/수리', 'settings', 6),
('외주', 'zap', 7),
('취업/직무', 'briefcase', 8),
('법률/금융', 'scale', 9),
('취미/자기계발', 'heart', 10);

-- 2. Extend profiles table (assumes it exists from Supabase Auth)
-- Add columns to existing profiles table
DO $$
BEGIN
    -- Add new columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'status') THEN
        ALTER TABLE profiles
        ADD COLUMN status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
        ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE,
        ADD COLUMN identity_verified BOOLEAN DEFAULT FALSE,
        ADD COLUMN business_verified BOOLEAN DEFAULT FALSE,
        ADD COLUMN deposit_paid BOOLEAN DEFAULT FALSE,
        ADD COLUMN deposit_amount INTEGER DEFAULT 0,
        ADD COLUMN deposit_paid_at TIMESTAMPTZ,
        ADD COLUMN address JSONB,
        ADD COLUMN coordinates GEOGRAPHY(POINT);
    END IF;
END $$;

-- Create indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_coordinates ON profiles USING GIST(coordinates);

-- 3. Expert Profiles Table
CREATE TABLE expert_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Expert information
  title VARCHAR(200) NOT NULL,
  description TEXT,
  specializations TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,

  -- Pricing information
  price_min INTEGER,
  price_max INTEGER,
  price_unit VARCHAR(20) DEFAULT 'hour' CHECK (price_unit IN ('hour', 'project', 'day')),

  -- Ratings and reviews
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,

  -- Availability
  available_hours JSONB DEFAULT '[]',
  response_time_avg INTEGER DEFAULT 24, -- Average response time in hours

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (
    verification_status IN ('pending', 'verified', 'rejected')
  ),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for expert_profiles
CREATE INDEX idx_expert_profiles_profile_id ON expert_profiles(profile_id);
CREATE INDEX idx_expert_profiles_rating ON expert_profiles(rating DESC);
CREATE INDEX idx_expert_profiles_specializations ON expert_profiles USING GIN(specializations);
CREATE INDEX idx_expert_profiles_is_active ON expert_profiles(is_active);

-- 4. Service Requests Table
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES service_categories(id),

  -- Request content
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',

  -- Budget information
  budget_min INTEGER,
  budget_max INTEGER,
  budget_negotiable BOOLEAN DEFAULT TRUE,

  -- Location information (Korean address format)
  location JSONB NOT NULL, -- {city, district, address, roadAddress, jibunAddress, zipCode}
  coordinates GEOGRAPHY(POINT), -- PostGIS coordinates

  -- Schedule information
  preferred_start_date DATE,
  preferred_end_date DATE,
  time_slots TEXT[] DEFAULT '{}', -- ["morning", "afternoon", "evening"]
  is_urgent BOOLEAN DEFAULT FALSE,

  -- Contact preferences
  contact_preference VARCHAR(20) DEFAULT 'phone' CHECK (
    contact_preference IN ('phone', 'message', 'both')
  ),

  -- Status management
  status VARCHAR(20) DEFAULT 'draft' CHECK (
    status IN ('draft', 'submitted', 'matching', 'matched', 'completed', 'cancelled')
  ),

  -- AI matching configuration
  matching_score_threshold INTEGER DEFAULT 70,
  max_matches INTEGER DEFAULT 5,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- Indexes for service_requests
CREATE INDEX idx_service_requests_customer_id ON service_requests(customer_id);
CREATE INDEX idx_service_requests_category_id ON service_requests(category_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_location ON service_requests USING GIN(location);
CREATE INDEX idx_service_requests_coordinates ON service_requests USING GIST(coordinates);
CREATE INDEX idx_service_requests_created_at ON service_requests(created_at DESC);

-- 5. Matching Results Table
CREATE TABLE matching_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Matching scores (following frontend breakdown structure)
  compatibility_score INTEGER NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  service_compatibility INTEGER NOT NULL, -- 50% weight
  price_compatibility INTEGER NOT NULL,   -- 20% weight
  location_time_compatibility INTEGER NOT NULL, -- 15% weight
  reputation_index INTEGER NOT NULL,      -- 15% weight

  -- AI analysis results
  ai_analysis TEXT,
  matching_reason TEXT,

  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'interested', 'declined', 'selected', 'completed')
  ),

  -- Expert response information
  expert_response_at TIMESTAMPTZ,
  expert_message TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for matching_results
CREATE INDEX idx_matching_results_request_id ON matching_results(request_id);
CREATE INDEX idx_matching_results_expert_id ON matching_results(expert_id);
CREATE INDEX idx_matching_results_compatibility_score ON matching_results(compatibility_score DESC);
CREATE INDEX idx_matching_results_status ON matching_results(status);

-- Unique constraint to prevent duplicate matches
CREATE UNIQUE INDEX idx_matching_results_unique ON matching_results(request_id, expert_id);

-- 6. Portfolios Table
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Portfolio information
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),

  -- Media files (S3 URLs)
  images TEXT[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',

  -- Project information
  completed_at DATE,
  duration_days INTEGER,
  project_value INTEGER,

  -- Status
  is_featured BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for portfolios
CREATE INDEX idx_portfolios_expert_id ON portfolios(expert_id);
CREATE INDEX idx_portfolios_category ON portfolios(category);
CREATE INDEX idx_portfolios_is_featured ON portfolios(is_featured);

-- 7. Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Subscription information
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('customer', 'expert')),
  monthly_fee INTEGER NOT NULL, -- 9,900 KRW for customers, 19,900 KRW for experts

  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (
    status IN ('active', 'cancelled', 'expired', 'suspended')
  ),

  -- Duration
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  auto_renewal BOOLEAN DEFAULT TRUE,

  -- Payment information
  payment_method VARCHAR(20),
  last_payment_at TIMESTAMPTZ,
  next_payment_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for subscriptions
CREATE INDEX idx_subscriptions_profile_id ON subscriptions(profile_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_payment ON subscriptions(next_payment_at);

-- 8. Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all relevant tables
CREATE TRIGGER update_expert_profiles_updated_at BEFORE UPDATE ON expert_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matching_results_updated_at BEFORE UPDATE ON matching_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Helper Functions
CREATE OR REPLACE FUNCTION get_expert_stats(expert_uuid UUID)
RETURNS TABLE (
  total_matches INTEGER,
  success_rate DECIMAL,
  avg_rating DECIMAL,
  response_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_matches,
    (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0) * 100) as success_rate,
    COALESCE(ep.rating, 0) as avg_rating,
    95.0::DECIMAL as response_rate -- Placeholder, could be calculated from actual response times
  FROM matching_results mr
  LEFT JOIN expert_profiles ep ON ep.profile_id = expert_uuid
  WHERE mr.expert_id = expert_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Sample Data for Testing
-- Insert test users (these would normally be created through Supabase Auth)
-- We'll add this after auth users are created

COMMENT ON TABLE service_categories IS 'Service categories for the Provee platform, matching frontend categories';
COMMENT ON TABLE expert_profiles IS 'Extended profile information for service providers/experts';
COMMENT ON TABLE service_requests IS 'Customer service requests with Korean address support';
COMMENT ON TABLE matching_results IS 'AI matching results between requests and experts';
COMMENT ON TABLE portfolios IS 'Expert portfolio items and project showcases';
COMMENT ON TABLE subscriptions IS 'User subscription plans (customer: 9,900 KRW, expert: 19,900 KRW)';