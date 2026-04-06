-- ============================================================
-- Ezponda Capital — Supabase Schema
-- Run this in the Supabase SQL editor after creating the project.
-- ============================================================

-- ── profiles ──────────────────────────────────────────────────
-- Extends auth.users. Automatically created via trigger on signup.

CREATE TABLE IF NOT EXISTS profiles (
  id                 UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email              TEXT        NOT NULL,
  full_name          TEXT,
  role               TEXT        NOT NULL DEFAULT 'free'
                                 CHECK (role IN ('superadmin', 'subscriber', 'free')),
  stripe_customer_id TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: create a profile row whenever a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── subscriptions ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subscriptions (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id  TEXT        NOT NULL UNIQUE,
  stripe_price_id         TEXT        NOT NULL,
  status                  TEXT        NOT NULL
                                      CHECK (status IN ('active','canceled','past_due','trialing','incomplete')),
  current_period_start    TIMESTAMPTZ NOT NULL,
  current_period_end      TIMESTAMPTZ NOT NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── email_list ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS email_list (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source        TEXT,
  active        BOOLEAN     NOT NULL DEFAULT TRUE
);

-- ── commodity_prices ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS commodity_prices (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol     TEXT        NOT NULL,
  name       TEXT        NOT NULL,
  price      NUMERIC     NOT NULL,
  change_pct NUMERIC     NOT NULL DEFAULT 0,
  currency   TEXT        NOT NULL DEFAULT 'USD',
  unit       TEXT        NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS commodity_prices_symbol_fetched
  ON commodity_prices (symbol, fetched_at DESC);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_list      ENABLE ROW LEVEL SECURITY;
ALTER TABLE commodity_prices ENABLE ROW LEVEL SECURITY;

-- Helper: check superadmin role
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  );
$$;

-- profiles: users read/update own row; superadmins read all
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_superadmin());

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- subscriptions: users read own; superadmins read all
CREATE POLICY "subscriptions_select_own"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id OR is_superadmin());

-- email_list: anyone can insert; superadmins can read/manage
CREATE POLICY "email_list_insert_public"
  ON email_list FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "email_list_select_superadmin"
  ON email_list FOR SELECT
  USING (is_superadmin());

CREATE POLICY "email_list_update_superadmin"
  ON email_list FOR UPDATE
  USING (is_superadmin());

-- commodity_prices: public read
CREATE POLICY "commodity_prices_select_public"
  ON commodity_prices FOR SELECT
  USING (TRUE);
