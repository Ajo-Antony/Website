-- ─────────────────────────────────────────────────────────────
-- GALLERY & BLOG ENHANCEMENTS: LIKES, COMMENTS, MEDIA TYPE & HOME SHOWCASE
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

-- 1. Alter gallery_images & comments to support video, home-page toggling, and moderation
ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image',
ADD COLUMN IF NOT EXISTS show_on_home boolean NOT NULL DEFAULT false;

ALTER TABLE blog_comments 
ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false;

ALTER TABLE gallery_comments 
ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false;

-- 2. Blog Likes Table
CREATE TABLE IF NOT EXISTS blog_likes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id     uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id  text NOT NULL, -- To track unique guest likes
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_blog_user_like UNIQUE (blog_id, user_id),
  CONSTRAINT unique_blog_session_like UNIQUE (blog_id, session_id)
);

-- 3. Blog Comments Table
CREATE TABLE IF NOT EXISTS blog_comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id     uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  content     text NOT NULL,
  approved    boolean NOT NULL DEFAULT true,
  hidden      boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 4. Gallery Likes Table
CREATE TABLE IF NOT EXISTS gallery_likes (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_image_id uuid NOT NULL REFERENCES gallery_images(id) ON DELETE CASCADE,
  user_id          uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id       text NOT NULL, -- To track unique guest likes
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_gallery_user_like UNIQUE (gallery_image_id, user_id),
  CONSTRAINT unique_gallery_session_like UNIQUE (gallery_image_id, session_id)
);

-- 5. Gallery Comments Table
CREATE TABLE IF NOT EXISTS gallery_comments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_image_id uuid NOT NULL REFERENCES gallery_images(id) ON DELETE CASCADE,
  user_id          uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name      text NOT NULL,
  content          text NOT NULL,
  approved         boolean NOT NULL DEFAULT true,
  hidden           boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ── ROW LEVEL SECURITY & POLICIES ──

ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_comments ENABLE ROW LEVEL SECURITY;

-- Blog Likes Policies
CREATE POLICY "Anyone can view blog likes" ON blog_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert blog likes" ON blog_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete own blog likes" ON blog_likes FOR DELETE USING (true);

-- Blog Comments Policies
CREATE POLICY "Anyone can view blog comments" ON blog_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert blog comments" ON blog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update any blog comments" ON blog_comments FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete any blog comments" ON blog_comments FOR DELETE USING (auth.role() = 'authenticated');

-- Gallery Likes Policies
CREATE POLICY "Anyone can view gallery likes" ON gallery_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert gallery likes" ON gallery_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete own gallery likes" ON gallery_likes FOR DELETE USING (true);

-- Gallery Comments Policies
CREATE POLICY "Anyone can view gallery comments" ON gallery_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert gallery comments" ON gallery_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update any gallery comments" ON gallery_comments FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete any gallery comments" ON gallery_comments FOR DELETE USING (auth.role() = 'authenticated');

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS blog_likes_blog_id_idx ON blog_likes (blog_id);
CREATE INDEX IF NOT EXISTS blog_comments_blog_id_idx ON blog_comments (blog_id);
CREATE INDEX IF NOT EXISTS gallery_likes_gallery_image_id_idx ON gallery_likes (gallery_image_id);
CREATE INDEX IF NOT EXISTS gallery_comments_gallery_image_id_idx ON gallery_comments (gallery_image_id);
