-- ============================================================
--  Ulloa Construction — Lead Nurture System
--  Run this in your Supabase SQL editor
-- ============================================================

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  service_type    TEXT,
  message         TEXT,
  source          TEXT DEFAULT 'website',
  status          TEXT DEFAULT 'active'
                    CHECK (status IN ('active', 'completed', 'unqualified')),
  owner_takeover  BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Nurture log (tracks every SMS/email sent)
CREATE TABLE IF NOT EXISTS nurture_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID REFERENCES leads(id) ON DELETE CASCADE,
  day_number  INTEGER NOT NULL CHECK (day_number IN (1, 3, 7, 14)),
  channel     TEXT NOT NULL CHECK (channel IN ('sms', 'email')),
  content     TEXT,
  status      TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  sent_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Inbound messages (lead replies via SMS)
CREATE TABLE IF NOT EXISTS inbound_messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id       UUID REFERENCES leads(id) ON DELETE CASCADE,
  from_number   TEXT NOT NULL,
  body          TEXT NOT NULL,
  received_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on leads
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON leads;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_status         ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_owner_takeover ON leads(owner_takeover);
CREATE INDEX IF NOT EXISTS idx_leads_phone          ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_nurture_log_lead_id  ON nurture_log(lead_id);
