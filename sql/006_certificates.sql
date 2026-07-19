-- ─────────────────────────────────────────────────────────────
-- CERTIFICATES MANAGEMENT — Database Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ─────────────────────────────────────────────────────────────

-- Table for storing custom certificate templates
CREATE TABLE IF NOT EXISTS certificate_templates (
  key              text PRIMARY KEY DEFAULT 'certificates.template',
  title            text NOT NULL,
  subtitle         text NOT NULL,
  body_template    text NOT NULL,
  signatory_name   text NOT NULL,
  signatory_title  text NOT NULL,
  primary_color    text NOT NULL DEFAULT '#003e8f',
  secondary_color  text NOT NULL DEFAULT '#00d4aa',
  text_color       text NOT NULL DEFAULT '#15140f',
  muted_color      text NOT NULL DEFAULT '#4b5563',
  title_y          integer NOT NULL DEFAULT 150,
  subtitle_y       integer NOT NULL DEFAULT 200,
  student_name_y   integer NOT NULL DEFAULT 250,
  body_y           integer NOT NULL DEFAULT 310,
  footer_y         integer NOT NULL DEFAULT 120,
  qr_y             integer NOT NULL DEFAULT 60,
  qr_size          integer NOT NULL DEFAULT 74,
  border_width     integer NOT NULL DEFAULT 4,
  font_family      text NOT NULL DEFAULT 'sans',
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Table for storing student certificate records
CREATE TABLE IF NOT EXISTS student_certificates (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name     text NOT NULL,
  course_name      text NOT NULL,
  start_date       text NOT NULL,
  end_date         text NOT NULL,
  issue_date       text NOT NULL,
  cert_code        text UNIQUE NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Index for fast code verification
CREATE INDEX IF NOT EXISTS idx_student_certificates_code ON student_certificates(cert_code);

-- Enable Row Level Security (RLS)
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_certificates ENABLE ROW LEVEL SECURITY;

-- ─── Public Read Policies ───
CREATE POLICY "Public read certificate_templates" 
  ON certificate_templates FOR SELECT 
  USING (true);

CREATE POLICY "Public read student_certificates" 
  ON student_certificates FOR SELECT 
  USING (true);

-- ─── Admin Full Control Policies ───
CREATE POLICY "Admin all certificate_templates" 
  ON certificate_templates FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin all student_certificates" 
  ON student_certificates FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

-- ─── Seed initial default template ───
INSERT INTO certificate_templates (
  key, title, subtitle, body_template, signatory_name, signatory_title, 
  primary_color, secondary_color, text_color, muted_color, 
  title_y, subtitle_y, student_name_y, body_y, footer_y, qr_y, qr_size, border_width, font_family
) VALUES (
  'certificates.template',
  'CERTIFICATE OF INTERNSHIP COMPLETION',
  'This is to certify that',
  'has successfully completed the internship program in {courseName} from {startDate} to {endDate}, demonstrating consistent dedication, technical growth, and professional conduct throughout the tenure.',
  'Antony Sebastian',
  'Founder, StrixMind LLP',
  '#003e8f',
  '#00d4aa',
  '#15140f',
  '#4b5563',
  150, 200, 250, 310, 120, 60, 74, 4, 'sans'
) ON CONFLICT (key) DO NOTHING;
