-- =============================================================================
-- Migration 001: Initial PostgreSQL Schema for Aqar Exit Platform
-- =============================================================================
-- Compliant with:
-- 1. PRD requirements and domain model
-- 2. Strict Row Level Security (RLS)
-- 3. Immutable audit logging (protected from UPDATE/DELETE via triggers)
-- 4. Public safe view (public_verified_listings_view) with security_barrier
-- 5. No financial storage in float - numeric(14,2) for Egyptian Pounds
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Custom Types & Enums
-- -----------------------------------------------------------------------------

CREATE TYPE user_role AS ENUM (
    'buyer',
    'seller',
    'operations',
    'finance_reviewer',
    'legal_reviewer',
    'publisher',
    'admin',
    'system_admin'
);

CREATE TYPE case_status AS ENUM (
    'draft',
    'submitted',
    'screening',
    'documents_pending',
    'in_review',
    'ready_for_approval',
    'approved',
    'published',
    'paused',
    'closed',
    'rejected'
);

CREATE TYPE case_nature AS ENUM (
    'standard_assignment',
    'distress_exit'
);

CREATE TYPE legal_verdict AS ENUM (
    'not_started',
    'in_progress',
    'eligible',
    'eligible_with_conditions',
    'not_eligible'
);

CREATE TYPE developer_assignment_status AS ENUM (
    'confirmed',
    'pending_letter',
    'forbidden_until_full_payment',
    'not_required',
    'unknown'
);

CREATE TYPE deal_status AS ENUM (
    'lead',
    'buyer_qualified',
    'viewing_or_discussion',
    'offer_made',
    'offer_accepted',
    'developer_approval_pending',
    'transfer_in_progress',
    'completed',
    'cancelled',
    'failed'
);

CREATE TYPE document_type AS ENUM (
    'unit_contract',
    'payment_receipts',
    'statement_of_account',
    'national_id',
    'developer_policy',
    'other'
);

CREATE TYPE verification_status AS ENUM (
    'pending',
    'verified',
    'rejected'
);

CREATE TYPE unit_type AS ENUM (
    'apartment',
    'duplex',
    'villa',
    'townhouse',
    'penthouse',
    'studio',
    'commercial',
    'administrative',
    'medical',
    'other'
);

CREATE TYPE delivery_status AS ENUM (
    'delivered',
    'under_construction',
    'finishing'
);

CREATE TYPE installment_frequency AS ENUM (
    'monthly',
    'quarterly',
    'semi_annual',
    'annual'
);

CREATE TYPE fee_bearer_type AS ENUM (
    'seller',
    'buyer',
    'split',
    'to_be_determined'
);

CREATE TYPE amount_confidence AS ENUM (
    'confirmed_by_documents',
    'seller_declared',
    'estimated',
    'requires_verification'
);

-- -----------------------------------------------------------------------------
-- 2. Core Tables
-- -----------------------------------------------------------------------------

-- Profiles (linked to auth.users if Supabase Auth is enabled)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255),
    national_id_hash VARCHAR(64), -- Hashed for deduplication/verification without storing plain
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Roles (Separated from profiles for clean RBAC & audit)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by UUID REFERENCES profiles(id),
    CONSTRAINT uk_user_role UNIQUE (user_id, role)
);

-- Physical Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    governorate VARCHAR(100) NOT NULL,
    city_district VARCHAR(150) NOT NULL,
    developer_name VARCHAR(150) NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    unit_type unit_type NOT NULL,
    area_sqm NUMERIC(8,2) CHECK (area_sqm > 0),
    floor_number INTEGER,
    delivery_status delivery_status NOT NULL DEFAULT 'under_construction',
    expected_delivery_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Financial Contracts
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    total_contract_price NUMERIC(14,2) NOT NULL CHECK (total_contract_price >= 0),
    deposit_paid NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (deposit_paid >= 0),
    installments_paid NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (installments_paid >= 0),
    remaining_balance NUMERIC(14,2) NOT NULL CHECK (remaining_balance >= 0),
    installment_value NUMERIC(14,2) CHECK (installment_value >= 0),
    installment_frequency installment_frequency DEFAULT 'quarterly',
    maintenance_fee NUMERIC(14,2) CHECK (maintenance_fee >= 0),
    contract_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_contract_math CHECK (total_contract_price >= (deposit_paid + installments_paid))
);

-- Assignment Cases (The core request)
CREATE TABLE assignment_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(30) NOT NULL UNIQUE,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE RESTRICT,
    case_nature case_nature NOT NULL DEFAULT 'standard_assignment',
    status case_status NOT NULL DEFAULT 'draft',
    is_private_listing BOOLEAN NOT NULL DEFAULT FALSE,
    requested_cash_amount NUMERIC(14,2) CHECK (requested_cash_amount >= 0),
    distress_details JSONB, -- Private: overdue installments, legal warnings, etc.
    seller_notes TEXT,
    submitted_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Financial Snapshots & Verified Amounts Trail
CREATE TABLE case_financial_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES assignment_cases(id) ON DELETE CASCADE,
    amount_name VARCHAR(100) NOT NULL, -- 'paid_amount', 'remaining_balance', 'overdue', 'transfer_fee'
    amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
    confidence amount_confidence NOT NULL DEFAULT 'seller_declared',
    source_description TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Case Private Documents (Stored in Private Storage Bucket)
CREATE TABLE case_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES assignment_cases(id) ON DELETE CASCADE,
    doc_type document_type NOT NULL,
    storage_path VARCHAR(500) NOT NULL, -- Storage bucket object path, NEVER exposed to public
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes INTEGER NOT NULL CHECK (file_size_bytes > 0 AND file_size_bytes <= 15728640), -- Max 15MB
    mime_type VARCHAR(100) NOT NULL,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verified_by UUID REFERENCES profiles(id),
    rejection_reason TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Financial Reviews
CREATE TABLE financial_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES assignment_cases(id) ON DELETE CASCADE,
    verified_paid_amount NUMERIC(14,2) NOT NULL CHECK (verified_paid_amount >= 0),
    verified_remaining_amount NUMERIC(14,2) NOT NULL CHECK (verified_remaining_amount >= 0),
    verified_overdue_amount NUMERIC(14,2) DEFAULT 0 CHECK (verified_overdue_amount >= 0),
    developer_transfer_fee NUMERIC(14,2) DEFAULT 0 CHECK (developer_transfer_fee >= 0),
    fee_bearer fee_bearer_type NOT NULL DEFAULT 'seller',
    verification_source TEXT NOT NULL,
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    reviewer_notes TEXT,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_financial_review_case UNIQUE (case_id)
);

-- Legal Reviews
CREATE TABLE legal_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES assignment_cases(id) ON DELETE CASCADE,
    legal_verdict legal_verdict NOT NULL DEFAULT 'not_started',
    developer_assignment_status developer_assignment_status NOT NULL DEFAULT 'unknown',
    conditions_checklist TEXT[] DEFAULT '{}',
    legal_notes TEXT,
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_legal_review_case UNIQUE (case_id)
);

-- Publication Gates Validation
CREATE TABLE publication_gates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES assignment_cases(id) ON DELETE CASCADE,
    gate_1_complete_unit_data BOOLEAN NOT NULL DEFAULT FALSE,
    gate_2_seller_identity_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    gate_3_mandatory_docs_verified BOOLEAN NOT NULL DEFAULT FALSE,
    gate_4_financial_review_approved BOOLEAN NOT NULL DEFAULT FALSE,
    gate_5_legal_review_approved BOOLEAN NOT NULL DEFAULT FALSE,
    gate_6_developer_transfer_clear BOOLEAN NOT NULL DEFAULT FALSE,
    gate_7_publisher_authorized BOOLEAN NOT NULL DEFAULT FALSE,
    gate_8_pii_sanitized_for_public BOOLEAN NOT NULL DEFAULT FALSE,
    gate_9_disclaimers_and_timestamp_ready BOOLEAN NOT NULL DEFAULT FALSE,
    published_by UUID REFERENCES profiles(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_publication_gates_case UNIQUE (case_id)
);

-- Buyer Leads / Inquiries
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES assignment_cases(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    buyer_message TEXT,
    budget_cash NUMERIC(14,2) CHECK (budget_cash >= 0),
    comfortable_installment NUMERIC(14,2) CHECK (comfortable_installment >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deals Pipeline
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES assignment_cases(id) ON DELETE RESTRICT,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    status deal_status NOT NULL DEFAULT 'lead',
    agreed_cash_amount NUMERIC(14,2) CHECK (agreed_cash_amount >= 0),
    developer_meeting_date DATE,
    closing_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Immutable Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_name VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    actor_id UUID REFERENCES profiles(id),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. Triggers & Constraints
-- -----------------------------------------------------------------------------

-- Trigger 1: Protect audit_logs from any UPDATE or DELETE
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are immutable and cannot be updated or deleted by any application user.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_logs_immutable
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

-- Trigger 2: Automatic updated_at
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_profiles_timestamp BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_update_properties_timestamp BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_update_contracts_timestamp BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_update_cases_timestamp BEFORE UPDATE ON assignment_cases FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_update_publication_gates_timestamp BEFORE UPDATE ON publication_gates FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_update_deals_timestamp BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- -----------------------------------------------------------------------------
-- 4. Public Safe View (Zero PII, Security Barrier)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE VIEW public_verified_listings_view
WITH (security_barrier = true) AS
SELECT
    c.id AS case_id,
    c.case_number,
    c.case_nature,
    c.published_at,
    p.governorate,
    p.city_district,
    p.developer_name,
    p.project_name,
    p.unit_type,
    p.area_sqm,
    p.floor_number,
    p.delivery_status,
    p.expected_delivery_date,
    ct.total_contract_price,
    COALESCE(fr.verified_paid_amount, ct.deposit_paid + ct.installments_paid) AS total_paid_amount,
    COALESCE(fr.verified_remaining_amount, ct.remaining_balance) AS remaining_balance_amount,
    ct.installment_value,
    ct.installment_frequency,
    fr.developer_transfer_fee,
    fr.fee_bearer,
    fr.reviewed_at AS last_verified_at
FROM assignment_cases c
JOIN properties p ON c.property_id = p.id
JOIN contracts ct ON c.contract_id = ct.id
LEFT JOIN financial_reviews fr ON c.id = fr.case_id
JOIN publication_gates pg ON c.id = pg.case_id
WHERE c.status = 'published'
  AND c.is_private_listing = FALSE
  AND pg.gate_1_complete_unit_data = TRUE
  AND pg.gate_2_seller_identity_confirmed = TRUE
  AND pg.gate_3_mandatory_docs_verified = TRUE
  AND pg.gate_4_financial_review_approved = TRUE
  AND pg.gate_5_legal_review_approved = TRUE
  AND pg.gate_6_developer_transfer_clear = TRUE
  AND pg.gate_7_publisher_authorized = TRUE
  AND pg.gate_8_pii_sanitized_for_public = TRUE
  AND pg.gate_9_disclaimers_and_timestamp_ready = TRUE;

-- -----------------------------------------------------------------------------
-- 5. Row Level Security (RLS) Policies
-- -----------------------------------------------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_financial_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read and update their own profile; staff can read all
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Assignment Cases:
-- 1. Seller can view and edit their own cases
CREATE POLICY "Sellers manage own cases" ON assignment_cases
    FOR ALL USING (auth.uid() = seller_id);

-- 2. Staff roles (operations, finance, legal, publisher, admin) can read all cases
CREATE POLICY "Staff can view all cases" ON assignment_cases
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
              AND role IN ('operations', 'finance_reviewer', 'legal_reviewer', 'publisher', 'admin', 'system_admin')
        )
    );

-- Case Documents:
-- 1. Seller can only view and upload docs for their own case
CREATE POLICY "Sellers can view own case documents" ON case_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM assignment_cases
            WHERE assignment_cases.id = case_documents.case_id
              AND assignment_cases.seller_id = auth.uid()
        )
    );

CREATE POLICY "Sellers can upload own case documents" ON case_documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM assignment_cases
            WHERE assignment_cases.id = case_documents.case_id
              AND assignment_cases.seller_id = auth.uid()
        )
    );

-- 2. Staff reviewers can read documents
CREATE POLICY "Reviewers can view case documents" ON case_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
              AND role IN ('operations', 'finance_reviewer', 'legal_reviewer', 'admin', 'system_admin')
        )
    );

-- Audit Logs: Only admins can view audit logs; no direct inserts/updates from clients
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
              AND role IN ('admin', 'system_admin')
        )
    );

-- Public access to verified listings view:
GRANT SELECT ON public_verified_listings_view TO anon, authenticated;
