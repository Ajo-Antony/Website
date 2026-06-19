-- ─────────────────────────────────────────────────────────────
-- SECTION DESIGNER — Database Migration
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

-- Stores per-section design settings and visibility
CREATE TABLE IF NOT EXISTS section_designs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key   text UNIQUE NOT NULL,           -- e.g. "home.hero", "home.services"
  page          text NOT NULL DEFAULT 'home',   -- "home", "about", "services", etc.
  label         text NOT NULL,                  -- human readable: "Hero Section"
  sort_order    integer NOT NULL DEFAULT 0,     -- drag-and-drop order
  is_visible    boolean NOT NULL DEFAULT true,  -- hide/show toggle

  -- Design settings (stored as jsonb)
  design        jsonb NOT NULL DEFAULT '{}',    -- see DesignSettings type

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Index for fast page-level queries
CREATE INDEX IF NOT EXISTS idx_section_designs_page ON section_designs(page, sort_order);

-- RLS: allow all reads, auth-only writes (matches your existing pattern)
ALTER TABLE section_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read"  ON section_designs FOR SELECT USING (true);
CREATE POLICY "Auth write"   ON section_designs FOR ALL   USING (auth.role() = 'authenticated');

-- ─── Seed initial section order for the home page ──────────────────────────
INSERT INTO section_designs (section_key, page, label, sort_order, is_visible, design)
VALUES
  ('home.hero',         'home', 'Hero',               1,  true, '{}'),
  ('home.trustedBy',    'home', 'Trusted By Strip',   2,  true, '{}'),
  ('home.services',     'home', 'Services',           3,  true, '{}'),
  ('home.whyUs',        'home', 'Feature Services',   4,  true, '{}'),
  ('home.workflow',     'home', 'Workflow',           5,  true, '{}'),
  ('home.mission',      'home', 'About / Mission',    6,  true, '{}'),
  ('home.testimonials', 'home', 'Testimonials',       7,  true, '{}'),
  ('home.pricing',      'home', 'Pricing',            8,  true, '{}'),
  ('home.team',         'home', 'Team',               9,  true, '{}'),
  ('home.brand',        'home', 'Brand Identity',     10, true, '{}'),
  ('home.faq',          'home', 'FAQ',                11, true, '{}'),
  ('home.cta',          'home', 'CTA Banner',         12, true, '{}'),
  ('home.contact',      'home', 'Contact',            13, true, '{}'),
  -- About page
  ('about.hero',        'about','Hero',                1, true, '{}'),
  ('about.story',       'about','Our Story',           2, true, '{}'),
  ('about.values',      'about','Values',              3, true, '{}'),
  ('about.team',        'about','Team',                4, true, '{}'),
  -- Services page
  ('services.hero',     'services','Hero',             1, true, '{}'),
  ('services.list',     'services','Services List',    2, true, '{}'),
  ('services.cta',      'services','CTA',              3, true, '{}')
ON CONFLICT (section_key) DO NOTHING;
