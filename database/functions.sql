-- Database Functions for Provee Platform
-- These functions provide business logic and API endpoints

-- 1. AI Matching Algorithm Function
CREATE OR REPLACE FUNCTION calculate_matching_score(
  request_uuid UUID,
  expert_uuid UUID
) RETURNS TABLE (
  compatibility_score INTEGER,
  service_compatibility INTEGER,
  price_compatibility INTEGER,
  location_time_compatibility INTEGER,
  reputation_index INTEGER,
  matching_reason TEXT
) AS $$
DECLARE
  req service_requests%ROWTYPE;
  expert expert_profiles%ROWTYPE;
  expert_prof profiles%ROWTYPE;
  service_score INTEGER := 0;
  price_score INTEGER := 0;
  location_score INTEGER := 0;
  reputation_score INTEGER := 0;
  final_score INTEGER := 0;
  reason_text TEXT := '';
BEGIN
  -- Get request details
  SELECT * INTO req FROM service_requests WHERE id = request_uuid;

  -- Get expert details
  SELECT * INTO expert FROM expert_profiles WHERE profile_id = expert_uuid;
  SELECT * INTO expert_prof FROM profiles WHERE id = expert_uuid;

  -- Calculate Service Compatibility (50% weight)
  -- Check if expert specializations match request category
  IF req.category_id IS NOT NULL THEN
    SELECT name INTO reason_text FROM service_categories WHERE id = req.category_id;

    -- Simple keyword matching for now (can be enhanced with ML)
    IF reason_text = ANY(expert.specializations) THEN
      service_score := 90 + (expert.experience_years * 2); -- Max 100
    ELSE
      service_score := 70 - (5 * ABS(expert.experience_years - 3)); -- Penalty for mismatch
    END IF;

    service_score := LEAST(100, GREATEST(0, service_score));
  ELSE
    service_score := 75; -- Default if no category
  END IF;

  -- Calculate Price Compatibility (20% weight)
  IF req.budget_min IS NOT NULL AND req.budget_max IS NOT NULL THEN
    IF expert.price_min IS NOT NULL AND expert.price_max IS NOT NULL THEN
      -- Check price overlap
      IF expert.price_min <= req.budget_max AND expert.price_max >= req.budget_min THEN
        -- Calculate how well prices align
        price_score := 100 - ABS(((expert.price_min + expert.price_max) / 2) - ((req.budget_min + req.budget_max) / 2)) * 100 / ((req.budget_min + req.budget_max) / 2);
      ELSE
        price_score := 30; -- Some score for negotiable cases
      END IF;
    ELSE
      price_score := 60; -- Unknown pricing
    END IF;
  ELSE
    price_score := 80; -- No budget specified
  END IF;

  price_score := LEAST(100, GREATEST(0, price_score));

  -- Calculate Location/Time Compatibility (15% weight)
  -- Simplified location matching using JSON data
  IF req.location IS NOT NULL AND expert_prof.address IS NOT NULL THEN
    -- Check if same city/district (simplified)
    IF req.location->>'city' = expert_prof.address->>'city' THEN
      location_score := 90;
      IF req.location->>'district' = expert_prof.address->>'district' THEN
        location_score := 95;
      END IF;
    ELSE
      location_score := 60; -- Different city
    END IF;
  ELSE
    location_score := 70; -- Unknown location
  END IF;

  -- Calculate Reputation Index (15% weight)
  reputation_score := LEAST(100,
    GREATEST(0,
      (expert.rating * 20)::INTEGER + -- Rating contribution
      LEAST(30, expert.review_count * 2) + -- Review count contribution (max 30)
      CASE WHEN expert_prof.identity_verified THEN 10 ELSE 0 END + -- Verification bonus
      CASE WHEN expert_prof.business_verified THEN 10 ELSE 0 END
    )
  );

  -- Calculate final weighted score
  final_score := (
    service_score * 50 +
    price_score * 20 +
    location_score * 15 +
    reputation_score * 15
  ) / 100;

  -- Build matching reason
  reason_text := format(
    'Service: %s%%, Price: %s%%, Location: %s%%, Reputation: %s%%',
    service_score, price_score, location_score, reputation_score
  );

  RETURN QUERY SELECT
    final_score,
    service_score,
    price_score,
    location_score,
    reputation_score,
    reason_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Execute AI Matching Function
CREATE OR REPLACE FUNCTION execute_ai_matching(request_uuid UUID)
RETURNS TABLE (
  expert_id UUID,
  compatibility_score INTEGER,
  service_compatibility INTEGER,
  price_compatibility INTEGER,
  location_time_compatibility INTEGER,
  reputation_index INTEGER,
  matching_reason TEXT
) AS $$
DECLARE
  req service_requests%ROWTYPE;
  expert_record RECORD;
BEGIN
  -- Get request details
  SELECT * INTO req FROM service_requests WHERE id = request_uuid;

  -- Only process submitted requests
  IF req.status != 'submitted' THEN
    RAISE EXCEPTION 'Request must be in submitted status for matching';
  END IF;

  -- Find eligible experts
  FOR expert_record IN
    SELECT p.id as expert_id
    FROM profiles p
    JOIN expert_profiles ep ON ep.profile_id = p.id
    WHERE p.user_type = 'expert'
      AND p.status = 'active'
      AND ep.is_active = TRUE
      AND ep.verification_status = 'verified'
    ORDER BY ep.rating DESC, ep.review_count DESC
    LIMIT req.max_matches
  LOOP
    -- Calculate matching score for each expert
    RETURN QUERY
    SELECT
      expert_record.expert_id,
      calc.compatibility_score,
      calc.service_compatibility,
      calc.price_compatibility,
      calc.location_time_compatibility,
      calc.reputation_index,
      calc.matching_reason
    FROM calculate_matching_score(request_uuid, expert_record.expert_id) calc
    WHERE calc.compatibility_score >= req.matching_score_threshold;
  END LOOP;

  -- Update request status
  UPDATE service_requests
  SET status = 'matching', updated_at = NOW()
  WHERE id = request_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Service Request Function
CREATE OR REPLACE FUNCTION create_service_request(
  title_param VARCHAR(200),
  description_param TEXT,
  category_id_param UUID,
  budget_min_param INTEGER,
  budget_max_param INTEGER,
  location_param JSONB,
  preferred_start_date_param DATE DEFAULT NULL,
  preferred_end_date_param DATE DEFAULT NULL,
  time_slots_param TEXT[] DEFAULT '{}',
  contact_preference_param VARCHAR(20) DEFAULT 'phone'
) RETURNS UUID AS $$
DECLARE
  new_request_id UUID;
  user_profile profiles%ROWTYPE;
BEGIN
  -- Get current user profile
  SELECT * INTO user_profile FROM profiles WHERE id = auth.uid();

  -- Verify user is a customer
  IF user_profile.user_type != 'customer' THEN
    RAISE EXCEPTION 'Only customers can create service requests';
  END IF;

  -- Create the request
  INSERT INTO service_requests (
    customer_id, category_id, title, description,
    budget_min, budget_max, location,
    preferred_start_date, preferred_end_date, time_slots,
    contact_preference, status
  ) VALUES (
    auth.uid(), category_id_param, title_param, description_param,
    budget_min_param, budget_max_param, location_param,
    preferred_start_date_param, preferred_end_date_param, time_slots_param,
    contact_preference_param, 'draft'
  ) RETURNING id INTO new_request_id;

  RETURN new_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Submit Service Request Function
CREATE OR REPLACE FUNCTION submit_service_request(request_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  req service_requests%ROWTYPE;
BEGIN
  -- Get request details
  SELECT * INTO req FROM service_requests
  WHERE id = request_uuid AND customer_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Service request not found or access denied';
  END IF;

  -- Validate required fields
  IF req.title IS NULL OR req.description IS NULL OR req.location IS NULL THEN
    RAISE EXCEPTION 'Title, description, and location are required';
  END IF;

  -- Update status to submitted
  UPDATE service_requests
  SET status = 'submitted', updated_at = NOW()
  WHERE id = request_uuid;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Expert Response to Matching Function
CREATE OR REPLACE FUNCTION respond_to_matching(
  matching_id_param UUID,
  response_status VARCHAR(20),
  message_param TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  matching matching_results%ROWTYPE;
BEGIN
  -- Get matching result
  SELECT * INTO matching FROM matching_results
  WHERE id = matching_id_param AND expert_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Matching result not found or access denied';
  END IF;

  -- Validate response status
  IF response_status NOT IN ('interested', 'declined') THEN
    RAISE EXCEPTION 'Invalid response status';
  END IF;

  -- Update matching result
  UPDATE matching_results SET
    status = response_status,
    expert_response_at = NOW(),
    expert_message = message_param,
    updated_at = NOW()
  WHERE id = matching_id_param;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Get Expert Dashboard Stats Function
CREATE OR REPLACE FUNCTION get_expert_dashboard_stats(expert_uuid UUID DEFAULT auth.uid())
RETURNS TABLE (
  total_matches INTEGER,
  pending_matches INTEGER,
  success_rate DECIMAL,
  avg_rating DECIMAL,
  total_earnings INTEGER,
  this_month_earnings INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(mr.id)::INTEGER as total_matches,
    COUNT(mr.id) FILTER (WHERE mr.status = 'pending')::INTEGER as pending_matches,
    (COUNT(mr.id) FILTER (WHERE mr.status = 'completed')::DECIMAL /
     NULLIF(COUNT(mr.id), 0) * 100) as success_rate,
    COALESCE(ep.rating, 0) as avg_rating,
    0::INTEGER as total_earnings, -- Placeholder - would calculate from completed projects
    0::INTEGER as this_month_earnings -- Placeholder
  FROM matching_results mr
  RIGHT JOIN expert_profiles ep ON ep.profile_id = expert_uuid
  WHERE mr.expert_id = expert_uuid OR mr.expert_id IS NULL
  GROUP BY ep.rating;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Search Experts Function
CREATE OR REPLACE FUNCTION search_experts(
  category_param VARCHAR(100) DEFAULT NULL,
  location_city VARCHAR(100) DEFAULT NULL,
  location_district VARCHAR(100) DEFAULT NULL,
  min_rating DECIMAL DEFAULT NULL,
  max_price INTEGER DEFAULT NULL,
  search_query TEXT DEFAULT NULL,
  limit_param INTEGER DEFAULT 20,
  offset_param INTEGER DEFAULT 0
) RETURNS TABLE (
  id UUID,
  name VARCHAR(100),
  title VARCHAR(200),
  description TEXT,
  specializations TEXT[],
  rating DECIMAL,
  review_count INTEGER,
  price_min INTEGER,
  price_max INTEGER,
  avatar_url TEXT,
  location JSONB,
  response_time_avg INTEGER,
  verification_status VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    ep.title,
    ep.description,
    ep.specializations,
    ep.rating,
    ep.review_count,
    ep.price_min,
    ep.price_max,
    p.avatar_url,
    p.address as location,
    ep.response_time_avg,
    ep.verification_status
  FROM profiles p
  JOIN expert_profiles ep ON ep.profile_id = p.id
  WHERE p.user_type = 'expert'
    AND p.status = 'active'
    AND ep.is_active = TRUE
    AND ep.verification_status = 'verified'
    AND (category_param IS NULL OR category_param = ANY(ep.specializations))
    AND (location_city IS NULL OR p.address->>'city' = location_city)
    AND (location_district IS NULL OR p.address->>'district' = location_district)
    AND (min_rating IS NULL OR ep.rating >= min_rating)
    AND (max_price IS NULL OR ep.price_max <= max_price)
    AND (search_query IS NULL OR
         ep.title ILIKE '%' || search_query || '%' OR
         ep.description ILIKE '%' || search_query || '%' OR
         p.name ILIKE '%' || search_query || '%')
  ORDER BY ep.rating DESC, ep.review_count DESC
  LIMIT limit_param
  OFFSET offset_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create Expert Profile Function
CREATE OR REPLACE FUNCTION create_expert_profile(
  title_param VARCHAR(200),
  description_param TEXT,
  specializations_param TEXT[],
  price_min_param INTEGER DEFAULT NULL,
  price_max_param INTEGER DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_profile_id UUID;
  user_profile profiles%ROWTYPE;
BEGIN
  -- Get current user profile
  SELECT * INTO user_profile FROM profiles WHERE id = auth.uid();

  -- Verify user is an expert
  IF user_profile.user_type != 'expert' THEN
    RAISE EXCEPTION 'Only experts can create expert profiles';
  END IF;

  -- Check if expert profile already exists
  IF EXISTS (SELECT 1 FROM expert_profiles WHERE profile_id = auth.uid()) THEN
    RAISE EXCEPTION 'Expert profile already exists for this user';
  END IF;

  -- Create the expert profile
  INSERT INTO expert_profiles (
    profile_id, title, description, specializations,
    price_min, price_max
  ) VALUES (
    auth.uid(), title_param, description_param, specializations_param,
    price_min_param, price_max_param
  ) RETURNING id INTO new_profile_id;

  RETURN new_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;