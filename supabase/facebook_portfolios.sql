-- Tabel khusus untuk menampung gambar otomatis dari Facebook
CREATE TABLE IF NOT EXISTS public.facebook_portfolios (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  ai_tags TEXT DEFAULT '',
  created_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agar website bisa mencari gambar berdasarkan caption (Full-Text Search)
CREATE INDEX IF NOT EXISTS idx_facebook_portfolios_caption ON public.facebook_portfolios(caption);
CREATE INDEX IF NOT EXISTS idx_facebook_portfolios_created_time ON public.facebook_portfolios(created_time DESC);

-- Enable RLS
ALTER TABLE public.facebook_portfolios ENABLE ROW LEVEL SECURITY;

-- Policy: Semua orang (Public) bisa membaca (melihat gambar di website)
CREATE POLICY "Public can view facebook portfolios" 
ON public.facebook_portfolios FOR SELECT 
USING (true);

-- Policy: Hanya user dengan Service Role Key (Script backend kita) yang bisa Insert/Update
-- Secara default, Service Role Key mem-bypass RLS, jadi tidak perlu policy khusus untuk insert.
