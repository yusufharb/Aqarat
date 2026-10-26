-- =============================================================================
-- Migration 003: Buyer Preferences, Saved Listings, Role Requests, & Storage
-- =============================================================================
-- Compliant with:
-- 1. Buyer portal features (favorites, preferences, inquiries)
-- 2. User account verification & suspension status
-- 3. Controlled role upgrade requests
-- 4. Private storage isolation for sensitive case documents
-- 5. Strict Row Level Security (RLS)
-- =============================================================================

-- 1. Extend profiles with account status & verification flags
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Buyer Preferences Table
CREATE TABLE IF NOT EXISTS buyer_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    budget_cash NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (budget_cash >= 0),
    max_installment_value NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (max_installment_value >= 0),
    preferred_governorates TEXT[] NOT NULL DEFAULT '{}',
    preferred_districts TEXT[] NOT NULL DEFAULT '{}',
    preferred_unit_types unit_type[] NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_buyer_preferences UNIQUE (buyer_id)
);

-- Trigger for auto-updated timestamp on buyer_preferences
CREATE TRIGGER trg_update_buyer_preferences_timestamp
BEFORE UPDATE ON buyer_preferences
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 3. Saved Listings (Buyer Favorites)
CREATE TABLE IF NOT EXISTS saved_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    case_id UUID NOT NULL REFERENCES assignment_cases(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_buyer_saved_case UNIQUE (buyer_id, case_id)
);

-- 4. Role Change Requests (Controlled workflow - users cannot self-grant admin)
CREATE TABLE IF NOT EXISTS role_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    requested_role user_role NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_non_admin_request CHECK (requested_role NOT IN ('admin', 'system_admin'))
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE buyer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_requests ENABLE ROW LEVEL SECURITY;

-- Policies for buyer_preferences:
CREATE POLICY "Buyers manage own preferences" ON buyer_preferences
    FOR ALL USING (auth.uid() = buyer_id);

CREATE POLICY "Staff can view buyer preferences" ON buyer_preferences
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
              AND role IN ('operations', 'admin', 'system_admin')
        )
    );

-- Policies for saved_listings:
CREATE POLICY "Buyers manage own saved listings" ON saved_listings
    FOR ALL USING (auth.uid() = buyer_id);

-- Policies for role_requests:
CREATE POLICY "Users can create and view own role requests" ON role_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can submit role requests" ON role_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view and review all role requests" ON role_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
              AND role IN ('admin', 'system_admin')
        )
    );

-- Policies for leads (Inquiries):
CREATE POLICY "Buyers manage own leads" ON leads
    FOR ALL USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view leads for their own cases" ON leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM assignment_cases
            WHERE assignment_cases.id = leads.case_id
              AND assignment_cases.seller_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view and manage all leads" ON leads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
              AND role IN ('operations', 'admin', 'system_admin')
        )
    );

-- Policies for deals:
CREATE POLICY "Participants can view their deals" ON deals
    FOR SELECT USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

CREATE POLICY "Staff can manage all deals" ON deals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
              AND role IN ('operations', 'admin', 'system_admin')
        )
    );

-- 6. Storage Buckets Setup & Policies (Supabase Storage schema)
-- Create buckets if storage schema exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES
        ('case-documents', 'case-documents', false, 15728640, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
        ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
        ON CONFLICT (id) DO UPDATE SET
            public = EXCLUDED.public,
            file_size_limit = EXCLUDED.file_size_limit,
            allowed_mime_types = EXCLUDED.allowed_mime_types;
    END IF;
END $$;
