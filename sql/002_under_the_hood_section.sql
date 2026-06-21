-- ─────────────────────────────────────────────────────────────
-- 002_under_the_hood_section.sql
-- Run this in your Supabase SQL Editor (safe to run multiple times)
--
-- Your live database already has a row for the old "Workflow / How
-- It Works" section (section_key = 'home.workflow'). The homepage
-- code now renders 'home.underTheHood' in that slot instead, so the
-- old row no longer matches anything and the new key has no row yet.
--
-- This renames the existing row in place (keeps its sort_order and
-- any custom design/visibility settings you'd already configured in
-- the admin Section Designer), and falls back to inserting a fresh
-- row if the old one doesn't exist.
-- ─────────────────────────────────────────────────────────────

UPDATE section_designs
SET section_key = 'home.underTheHood',
    label       = 'Under the Hood',
    updated_at  = now()
WHERE section_key = 'home.workflow';

INSERT INTO section_designs (section_key, page, label, sort_order, is_visible, design)
SELECT 'home.underTheHood', 'home', 'Under the Hood', 5, true, '{}'
WHERE NOT EXISTS (
  SELECT 1 FROM section_designs WHERE section_key = 'home.underTheHood'
);

-- Also drop the now-unused Pricing row from the admin Section Designer
-- list, since the Pricing section was removed from the homepage.
DELETE FROM section_designs WHERE section_key = 'home.pricing';
