-- TrashThat Supabase Schema
-- Run this in the Supabase SQL Editor to set up all tables.
-- Go to: Supabase Dashboard -> SQL Editor -> New Query -> paste and run.

-- ============================================================
-- TABLES
-- ============================================================

-- customers: identity and repeat-customer matching
CREATE TABLE IF NOT EXISTS customers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS customers_email_idx ON customers (LOWER(email));

-- leads: one record per booking request
CREATE TABLE IF NOT EXISTS leads (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id         UUID REFERENCES customers(id) ON DELETE SET NULL,
  status              TEXT NOT NULL DEFAULT 'new',
  -- address
  address             TEXT NOT NULL,
  unit                TEXT,
  postal_code         TEXT NOT NULL,
  buzzer_note         TEXT,
  -- junk details
  what_needs_removal  TEXT NOT NULL,
  item_categories     TEXT[] DEFAULT '{}',
  job_type            TEXT,
  special_items       TEXT[] DEFAULT '{}',
  junk_notes          TEXT,
  -- access
  has_stairs          BOOLEAN DEFAULT FALSE,
  has_elevator        BOOLEAN DEFAULT FALSE,
  long_carry          BOOLEAN DEFAULT FALSE,
  parking_notes       TEXT,
  -- timing
  preferred_date      DATE,
  preferred_time_window TEXT,
  -- internal
  internal_notes      TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- lead_photos: uploaded image URLs tied to a lead
CREATE TABLE IF NOT EXISTS lead_photos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id     UUID REFERENCES leads(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  filename    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- bookings: requested and confirmed schedule details
CREATE TABLE IF NOT EXISTS bookings (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id               UUID REFERENCES leads(id) ON DELETE CASCADE,
  requested_date        DATE,
  requested_time_window TEXT,
  confirmed_date        DATE,
  confirmed_time        TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- payments: deposit or saved-card state and Stripe references
CREATE TABLE IF NOT EXISTS payments (
  id                       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id                  UUID REFERENCES leads(id) ON DELETE CASCADE,
  stripe_session_id        TEXT,
  stripe_payment_intent_id TEXT,
  stripe_setup_intent_id   TEXT,
  amount_cents             INTEGER,
  status                   TEXT DEFAULT 'pending',
  mode                     TEXT, -- 'deposit' | 'save_card'
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

-- settings: business rules the owner can change without code changes
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  description TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- admin_users: role management on top of Supabase Auth
CREATE TABLE IF NOT EXISTS admin_users (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email      TEXT NOT NULL,
  role       TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEFAULT SETTINGS
-- ============================================================

INSERT INTO settings (key, value, description) VALUES
  ('payment_mode',    '"off"',             'Payment mode: off | deposit | save_card')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('ai_mode',         'false',             'Enable AI quote assistance (not yet active)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('photo_min',       '4',                 'Minimum number of photos required per booking')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('photo_max',       '8',                 'Maximum number of photos allowed per booking')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('minimum_charge',  'null',              'Minimum job charge in dollars (null = not set)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('deposit_amount',  'null',              'Deposit amount in dollars (null = not set)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('load_pricing',              '{}',    'Load tier pricing object (legacy — use individual tier keys below)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('load_quarter_price',        'null',  'Quarter load price in dollars (null = not set)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('load_half_price',           'null',  'Half load price in dollars (null = not set)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('load_three_quarter_price',  'null',  'Three-quarter load price in dollars (null = not set)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('load_full_price',           'null',  'Full load price in dollars (null = not set)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('manual_review_rules',       'null',  'Notes for when office should manually review a lead before quoting')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('stairs_fee',      'null',              'Extra fee for stairs in dollars (null = not set)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('heavy_item_fee',  'null',              'Extra fee for heavy items in dollars (null = not set)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('rush_fee',        'null',              'Rush job fee in dollars (null = not set)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('service_zones',   '[]',               'Array of postal code prefixes in the service area')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('blocked_items',   '[]',               'Array of items that cannot be removed')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('office_email',    '"office@trashthat.ca"', 'Email address for office notification emails')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('from_email',      '"noreply@trashthat.ca"', 'Sender address for outgoing emails')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE customers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads        ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_photos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users  ENABLE ROW LEVEL SECURITY;

-- Helper: checks whether the calling user is in admin_users
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
$$;

-- Admins can do everything; public has no access via RLS
-- (Service-role key bypasses RLS entirely for server-side code)

DROP POLICY IF EXISTS "Admins full access on customers"   ON customers;
DROP POLICY IF EXISTS "Admins full access on leads"       ON leads;
DROP POLICY IF EXISTS "Admins full access on lead_photos" ON lead_photos;
DROP POLICY IF EXISTS "Admins full access on bookings"    ON bookings;
DROP POLICY IF EXISTS "Admins full access on payments"    ON payments;
DROP POLICY IF EXISTS "Admins full access on settings"    ON settings;
DROP POLICY IF EXISTS "Admins full access on admin_users" ON admin_users;

CREATE POLICY "Admins full access on customers"
  ON customers FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins full access on leads"
  ON leads FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins full access on lead_photos"
  ON lead_photos FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins full access on bookings"
  ON bookings FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins full access on payments"
  ON payments FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins full access on settings"
  ON settings FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins full access on admin_users"
  ON admin_users FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- HOW TO ADD AN ADMIN USER
-- ============================================================
-- 1. Create the user in Supabase Auth (Dashboard -> Authentication -> Users -> Invite user)
-- 2. Copy the user UUID from the Auth users list
-- 3. Run this query (replace the UUID and email):
--
--    INSERT INTO admin_users (id, email) VALUES
--      ('paste-user-uuid-here', 'owner@trashthat.ca');