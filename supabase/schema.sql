-- ============================================================
-- VERSA DESIGN STUDIO — Supabase Schema
-- Jalankan seluruh file ini di Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  roles TEXT[] NOT NULL DEFAULT '{}',  -- ['admin','author','hrd'] multi-role
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 2. ARTICLES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',  -- HTML dari Tiptap
  excerpt TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',       -- Supabase Storage URL
  category TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  -- SEO
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  focus_keyword TEXT DEFAULT '',
  og_image TEXT DEFAULT '',
  -- Meta
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);

CREATE TRIGGER set_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 3. PORTFOLIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT '',
  client TEXT DEFAULT '',
  description TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',        -- Supabase Storage URLs
  tags TEXT[] DEFAULT '{}',
  year INTEGER,
  url TEXT DEFAULT '',               -- Link live/behance/dll (opsional)
  sort_order INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolios_status ON public.portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_category ON public.portfolios(category);

CREATE TRIGGER set_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 4. JOB APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,            -- Posisi dari dropdown
  cv_url TEXT NOT NULL,              -- Supabase Storage URL (PDF)
  portfolio_url TEXT DEFAULT '',     -- URL atau Supabase Storage URL (PDF)
  portfolio_type TEXT DEFAULT 'url' CHECK (portfolio_type IN ('url', 'file')),
  why_versa TEXT DEFAULT '',         -- Alasan melamar di Versa
  -- Admin managed
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewed','shortlisted','rejected')),
  admin_notes TEXT DEFAULT '',
  reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_position ON public.job_applications(position);
CREATE INDEX IF NOT EXISTS idx_applications_created ON public.job_applications(created_at DESC);

CREATE TRIGGER set_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Helper: cek apakah user punya role tertentu
CREATE OR REPLACE FUNCTION public.user_has_role(required_role TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
    AND required_role = ANY(roles)
    AND is_active = TRUE
  );
$$;

-- Helper: cek apakah user punya salah satu dari beberapa role
CREATE OR REPLACE FUNCTION public.user_has_any_role(required_roles TEXT[])
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
    AND roles && required_roles
    AND is_active = TRUE
  );
$$;

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- USER PROFILES policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id OR user_has_role('admin'));

CREATE POLICY "Admin can manage all profiles"
  ON public.user_profiles FOR ALL
  USING (user_has_role('admin'));

CREATE POLICY "User can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ARTICLES policies
CREATE POLICY "Public can read published articles"
  ON public.articles FOR SELECT
  USING (status = 'published' OR user_has_any_role(ARRAY['admin','author']));

CREATE POLICY "Admin can manage all articles"
  ON public.articles FOR ALL
  USING (user_has_role('admin'));

CREATE POLICY "Author can manage own articles"
  ON public.articles FOR ALL
  USING (user_has_role('author') AND (author_id = auth.uid() OR author_id IS NULL));

-- PORTFOLIOS policies
CREATE POLICY "Public can read published portfolios"
  ON public.portfolios FOR SELECT
  USING (status = 'published' OR user_has_role('admin'));

CREATE POLICY "Admin can manage all portfolios"
  ON public.portfolios FOR ALL
  USING (user_has_role('admin'));

-- JOB APPLICATIONS policies
CREATE POLICY "Public can insert applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admin and HRD can view applications"
  ON public.job_applications FOR SELECT
  USING (user_has_any_role(ARRAY['admin','hrd']));

CREATE POLICY "Admin and HRD can update application status"
  ON public.job_applications FOR UPDATE
  USING (user_has_any_role(ARRAY['admin','hrd']));

-- ============================================================
-- 6. STORAGE BUCKETS & POLICIES
-- ============================================================

-- NOTE: Storage bucket creation lewat SQL hanya di self-hosted.
-- Di Supabase Cloud, buat manual di Dashboard > Storage:
--   1. Bucket: "article-images"  — Public: true
--   2. Bucket: "portfolio-images" — Public: true
--   3. Bucket: "cv-uploads"       — Public: true (Agar admin bisa klik link download)
--   4. Bucket: "portfolio-uploads" — Public: true (Agar admin bisa klik link download)

-- PENTING: Anda HARUS menambahkan Storage Policies agar form lamaran bisa mengupload file!
-- Jalankan query berikut ini untuk mengatur Storage Policies (Upload & Read):

INSERT INTO storage.buckets (id, name, public) VALUES 
  ('article-images', 'article-images', true),
  ('portfolio-images', 'portfolio-images', true),
  ('cv-uploads', 'cv-uploads', true),
  ('portfolio-uploads', 'portfolio-uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Upload CV" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cv-uploads');
CREATE POLICY "Public Read CV" ON storage.objects FOR SELECT USING (bucket_id = 'cv-uploads');

CREATE POLICY "Public Upload Portfolio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-uploads');
CREATE POLICY "Public Read Portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-uploads');

CREATE POLICY "Public Upload Article Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'article-images');
CREATE POLICY "Public Read Article Images" ON storage.objects FOR SELECT USING (bucket_id = 'article-images');

CREATE POLICY "Public Upload Portfolio Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images');
CREATE POLICY "Public Read Portfolio Images" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');

-- ============================================================
-- 7. MAKE FIRST ADMIN
-- Setelah sign up pertama kali lewat /admin/login:
-- Jalankan query ini dengan email admin kamu:
-- ============================================================
-- UPDATE public.user_profiles
-- SET roles = ARRAY['admin']
-- WHERE email = 'admin@digicipta.com';
