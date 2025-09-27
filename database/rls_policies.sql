-- Row Level Security (RLS) Policies for Provee Platform
-- These policies ensure data security and proper access control

-- 1. Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 2. Profiles table policies
-- Users can view and update their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR ALL
USING (auth.uid() = id);

-- Public can view expert profiles (for search functionality)
CREATE POLICY "Public can view expert profiles"
ON profiles FOR SELECT
USING (user_type = 'expert' AND status = 'active');

-- 3. Expert Profiles table policies
-- Experts can manage their own profiles
CREATE POLICY "Experts can manage their own profile"
ON expert_profiles FOR ALL
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE auth.uid() = id AND user_type = 'expert'
  )
);

-- Public can view active expert profiles
CREATE POLICY "Public can view active expert profiles"
ON expert_profiles FOR SELECT
USING (is_active = TRUE AND verification_status = 'verified');

-- 4. Service Categories policies
-- Everyone can read categories
CREATE POLICY "Everyone can read service categories"
ON service_categories FOR SELECT
USING (is_active = TRUE);

-- 5. Service Requests policies
-- Customers can manage their own requests
CREATE POLICY "Customers can manage their own requests"
ON service_requests FOR ALL
USING (
  customer_id IN (
    SELECT id FROM profiles WHERE auth.uid() = id AND user_type = 'customer'
  )
);

-- Experts can view submitted requests for matching
CREATE POLICY "Experts can view submitted requests"
ON service_requests FOR SELECT
USING (
  status IN ('submitted', 'matching') AND
  auth.uid() IN (
    SELECT id FROM profiles WHERE user_type = 'expert' AND status = 'active'
  )
);

-- 6. Matching Results policies
-- Customers can view matching results for their requests
CREATE POLICY "Customers can view their matching results"
ON matching_results FOR SELECT
USING (
  request_id IN (
    SELECT id FROM service_requests WHERE customer_id = auth.uid()
  )
);

-- Experts can view and respond to their matching results
CREATE POLICY "Experts can manage their matching results"
ON matching_results FOR ALL
USING (expert_id = auth.uid());

-- 7. Portfolios policies
-- Experts can manage their own portfolios
CREATE POLICY "Experts can manage their own portfolios"
ON portfolios FOR ALL
USING (
  expert_id IN (
    SELECT id FROM profiles WHERE auth.uid() = id AND user_type = 'expert'
  )
);

-- Public can view public portfolios
CREATE POLICY "Public can view public portfolios"
ON portfolios FOR SELECT
USING (is_public = TRUE);

-- 8. Subscriptions policies
-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON subscriptions FOR SELECT
USING (profile_id = auth.uid());

-- Only system can manage subscriptions (through functions)
CREATE POLICY "System can manage subscriptions"
ON subscriptions FOR INSERT, UPDATE, DELETE
USING (FALSE); -- Will be handled by security definer functions