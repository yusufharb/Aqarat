-- =============================================================================
-- RLS & Security Verification Tests for Aqar Exit Schema
-- =============================================================================
-- Tests:
-- 1. Immutable Audit Log Trigger: UPDATE/DELETE must FAIL.
-- 2. Seller Isolation: Seller A cannot see or modify Seller B's cases.
-- 3. Anonymous Protection: Anon cannot read unpublished cases or private documents.
-- 4. Safe View Verification: public_verified_listings_view excludes all PII.
-- =============================================================================

DO $$
DECLARE
    v_test_log_id UUID;
    v_error_thrown BOOLEAN := FALSE;
BEGIN
    -- -------------------------------------------------------------------------
    -- TEST 1: Audit Log Immutability
    -- -------------------------------------------------------------------------
    -- Insert a dummy log
    INSERT INTO audit_logs (entity_name, entity_id, action, actor_id, new_values)
    VALUES ('test_entity', uuid_generate_v4(), 'test_create', NULL, '{"test": true}'::jsonb)
    RETURNING id INTO v_test_log_id;

    -- Attempt UPDATE (Should throw exception)
    BEGIN
        UPDATE audit_logs SET action = 'tampered' WHERE id = v_test_log_id;
    EXCEPTION WHEN OTHERS THEN
        v_error_thrown := TRUE;
    END;

    IF NOT v_error_thrown THEN
        RAISE EXCEPTION 'SECURITY TEST FAILED: UPDATE on audit_logs was allowed!';
    END IF;

    -- Attempt DELETE (Should throw exception)
    v_error_thrown := FALSE;
    BEGIN
        DELETE FROM audit_logs WHERE id = v_test_log_id;
    EXCEPTION WHEN OTHERS THEN
        v_error_thrown := TRUE;
    END;

    IF NOT v_error_thrown THEN
        RAISE EXCEPTION 'SECURITY TEST FAILED: DELETE on audit_logs was allowed!';
    END IF;

    RAISE NOTICE 'SUCCESS: Test 1 Passed (Audit Log is strictly immutable).';
END;
$$;
