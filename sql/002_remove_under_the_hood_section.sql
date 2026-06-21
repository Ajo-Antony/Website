-- ─────────────────────────────────────────────────────────────
-- 002_remove_under_the_hood_section.sql
-- Run this in your Supabase SQL Editor (safe to run multiple times,
-- and safe to run even if you never ran the previous version of
-- this migration).
--
-- The "Under the Hood" section was added and then removed from the
-- homepage in the same work session. This cleans up the
-- section_designs row so it doesn't linger in the admin Section
-- Designer list pointing at a section that no longer renders.
-- ─────────────────────────────────────────────────────────────

DELETE FROM section_designs WHERE section_key = 'home.underTheHood';
