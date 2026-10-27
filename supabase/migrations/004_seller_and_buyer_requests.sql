-- ============================================================================
-- Migration: 004_seller_and_buyer_requests.sql
-- Description: Intake tables for Seller (/sell) and Buyer (/buy) acquisition workflows
-- ============================================================================

-- 1. Seller Requests Table
CREATE TABLE IF NOT EXISTS public.seller_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(32) UNIQUE NOT NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    governorate VARCHAR(100) NOT NULL,
    city_district VARCHAR(100) NOT NULL,
    developer_name VARCHAR(100) NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    unit_type VARCHAR(50) NOT NULL,
    area_sqm NUMERIC(10,2),
    floor_number INTEGER,
    delivery_status VARCHAR(50) DEFAULT 'under_construction',
    total_price NUMERIC(15,2) NOT NULL,
    paid_amount NUMERIC(15,2) NOT NULL,
    remaining_balance NUMERIC(15,2) NOT NULL,
    installment_value NUMERIC(15,2),
    installment_frequency VARCHAR(50) DEFAULT 'quarterly',
    has_overdue BOOLEAN DEFAULT false,
    overdue_amount NUMERIC(15,2),
    requested_cash_amount NUMERIC(15,2),
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    rejection_reason TEXT,
    converted_case_id UUID REFERENCES public.assignment_cases(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT valid_seller_status CHECK (
        status IN ('pending', 'under_review', 'needs_information', 'qualified', 'rejected', 'converted_to_case', 'closed')
    )
);

-- Indexes for Seller Requests
CREATE INDEX IF NOT EXISTS idx_seller_requests_status ON public.seller_requests(status);
CREATE INDEX IF NOT EXISTS idx_seller_requests_seller ON public.seller_requests(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_requests_ref ON public.seller_requests(reference_code);
CREATE INDEX IF NOT EXISTS idx_seller_requests_created ON public.seller_requests(created_at DESC);

-- 2. Buyer Requests Table
CREATE TABLE IF NOT EXISTS public.buyer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(32) UNIQUE NOT NULL,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    budget_cash NUMERIC(15,2) NOT NULL,
    max_installment NUMERIC(15,2) NOT NULL,
    installment_frequency VARCHAR(50) DEFAULT 'quarterly',
    is_budget_flexible BOOLEAN DEFAULT false,
    preferred_governorates TEXT[] DEFAULT '{}',
    preferred_districts TEXT[] DEFAULT '{}',
    preferred_unit_types TEXT[] DEFAULT '{}',
    preferred_developers TEXT[] DEFAULT '{}',
    delivery_preference VARCHAR(50) DEFAULT 'any',
    bedrooms VARCHAR(20),
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    rejection_reason TEXT,
    converted_deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT valid_buyer_status CHECK (
        status IN ('pending', 'under_review', 'needs_information', 'qualified', 'matching', 'contacted', 'converted_to_deal', 'rejected', 'closed')
    )
);

-- Indexes for Buyer Requests
CREATE INDEX IF NOT EXISTS idx_buyer_requests_status ON public.buyer_requests(status);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_buyer ON public.buyer_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_ref ON public.buyer_requests(reference_code);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_created ON public.buyer_requests(created_at DESC);

-- 3. Row Level Security Policies
ALTER TABLE public.seller_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_requests ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is staff
CREATE OR REPLACE FUNCTION public.is_staff_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin', 'system_admin', 'operations', 'finance_reviewer', 'legal_reviewer', 'publisher')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seller Requests RLS
-- Anyone (guest or authenticated) can submit a request
CREATE POLICY "Anyone can insert seller request"
    ON public.seller_requests FOR INSERT
    WITH CHECK (true);

-- Authenticated owner can view their own requests
CREATE POLICY "Owner can view own seller requests"
    ON public.seller_requests FOR SELECT
    USING (seller_id = auth.uid() OR public.is_staff_user());

-- Staff can view all seller requests
CREATE POLICY "Staff can view all seller requests"
    ON public.seller_requests FOR SELECT
    USING (public.is_staff_user());

-- Only staff can update seller requests (status, notes, etc.)
CREATE POLICY "Staff can update seller requests"
    ON public.seller_requests FOR UPDATE
    USING (public.is_staff_user())
    WITH CHECK (public.is_staff_user());

-- Buyer Requests RLS
-- Anyone can insert buyer request
CREATE POLICY "Anyone can insert buyer request"
    ON public.buyer_requests FOR INSERT
    WITH CHECK (true);

-- Authenticated owner can view their own requests
CREATE POLICY "Owner can view own buyer requests"
    ON public.buyer_requests FOR SELECT
    USING (buyer_id = auth.uid() OR public.is_staff_user());

-- Staff can view all buyer requests
CREATE POLICY "Staff can view all buyer requests"
    ON public.buyer_requests FOR SELECT
    USING (public.is_staff_user());

-- Only staff can update buyer requests
CREATE POLICY "Staff can update buyer requests"
    ON public.buyer_requests FOR UPDATE
    USING (public.is_staff_user())
    WITH CHECK (public.is_staff_user());

-- Comments
COMMENT ON TABLE public.seller_requests IS 'Acquisition lead intake table for property sellers via /sell';
COMMENT ON TABLE public.buyer_requests IS 'Acquisition lead intake table for property buyers via /buy';
