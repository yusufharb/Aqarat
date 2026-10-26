-- =============================================================================
-- Migration 002: Seed Reference Data for Egyptian Real Estate Market
-- =============================================================================
-- Reference tables for Governorates, Districts, and Verified Developers
-- =============================================================================

CREATE TABLE IF NOT EXISTS reference_governorates (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL UNIQUE,
    name_en VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS reference_districts (
    id SERIAL PRIMARY KEY,
    governorate_id INTEGER NOT NULL REFERENCES reference_governorates(id) ON DELETE CASCADE,
    name_ar VARCHAR(150) NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    CONSTRAINT uk_governorate_district UNIQUE (governorate_id, name_ar)
);

CREATE TABLE IF NOT EXISTS reference_developers (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(150) NOT NULL UNIQUE,
    name_en VARCHAR(150) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    transfer_policy_notes TEXT
);

-- Seed Governorates
INSERT INTO reference_governorates (name_ar, name_en) VALUES
('القاهرة', 'Cairo'),
('الجيزة', 'Giza'),
('مطروح (الساحل الشمالي)', 'Matrouh (North Coast)'),
('البحر الأحمر', 'Red Sea'),
('الإسكندرية', 'Alexandria')
ON CONFLICT (name_ar) DO NOTHING;

-- Seed Districts
INSERT INTO reference_districts (governorate_id, name_ar, name_en)
SELECT id, 'القاهرة الجديدة (التجمع الخامس)', 'New Cairo' FROM reference_governorates WHERE name_ar = 'القاهرة'
UNION ALL
SELECT id, 'العاصمة الإدارية الجديدة', 'New Administrative Capital' FROM reference_governorates WHERE name_ar = 'القاهرة'
UNION ALL
SELECT id, 'المستقبل سيتي', 'Mostakbal City' FROM reference_governorates WHERE name_ar = 'القاهرة'
UNION ALL
SELECT id, 'مدينة الشروق', 'El Shorouk' FROM reference_governorates WHERE name_ar = 'القاهرة'
UNION ALL
SELECT id, 'مدينة بدر', 'Badr City' FROM reference_governorates WHERE name_ar = 'القاهرة'
UNION ALL
SELECT id, 'المعادي', 'Maadi' FROM reference_governorates WHERE name_ar = 'القاهرة'
UNION ALL
SELECT id, 'الشيخ زايد', 'Sheikh Zayed' FROM reference_governorates WHERE name_ar = 'الجيزة'
UNION ALL
SELECT id, 'مدينة 6 أكتوبر', '6th of October' FROM reference_governorates WHERE name_ar = 'الجيزة'
UNION ALL
SELECT id, 'الساحل الشمالي (رأس الحكمة وسيدي عبد الرحمن)', 'North Coast' FROM reference_governorates WHERE name_ar = 'مطروح (الساحل الشمالي)'
ON CONFLICT DO NOTHING;

-- Seed Developers
INSERT INTO reference_developers (name_ar, name_en, transfer_policy_notes) VALUES
('مجموعة طلعت مصطفى (TMG)', 'Talaat Moustafa Group', 'يتطلب التنازل سداد نسبة محددة من الأقساط ورسوم تنازل تقريبية تتراوح بين 5% إلى 8%.'),
('شركة إعمار مصر (Emaar Misr)', 'Emaar Misr', 'تسمح بالتنازل وفق الشروط المعتمدة لدى خدمة العملاء بعد سداد رسوم التنازل المقررة.'),
('شركة السادس من أكتوبر للتنمية (SODIC)', 'SODIC', 'يشترط عدم وجود متأخرات واستيفاء شروط موافقة الإدارة العقارية.'),
('شركة بالم هيلز للتعمير (Palm Hills Developments)', 'Palm Hills', 'التنازل يتم بالحضور الشخصي للطرفين أو بتوكيل خاص رسمي محدد للغرض.'),
('شركة ماونتن فيو (Mountain View)', 'Mountain View', 'تتطلب مراجعة موقف الصيانة والأقساط المستحقة قبل إصدار موافقة التنازل.'),
('شركة مصر إيطاليا العقارية (Misr Italia Properties)', 'Misr Italia Properties', 'التنازل متاح بالمقر الرئيسي مع استيفاء إبراء الذمة المالية.'),
('شركة أورا ديفلوبرز (Ora Developers)', 'Ora Developers', 'إجراءات التنازل تتطلب موافقة مجلس الإدارة وسداد رسوم التنازل.'),
('شركة لافيستا للتطوير العقاري (La Vista Developments)', 'La Vista Developments', 'تخضع شروط التنازل للائحة الداخلية لكل مشروع على حدة.'),
('شركة الأهلي صبور للتنمية العقارية (Al Ahly Sabbour)', 'Al Ahly Sabbour', 'تيسير إجراءات التنازل ونقل الملكية بمقر الشركة بالتجمع الخامس.'),
('شركة تطوير مصر (Tatweer Misr)', 'Tatweer Misr', 'التنازل يتم بعد مراجعة العقد الأصلي وجدول سداد الأقساط.')
ON CONFLICT (name_ar) DO NOTHING;
