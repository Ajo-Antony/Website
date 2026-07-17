-- ─────────────────────────────────────────────────────────────
-- Add title and tags columns to gallery_images
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
