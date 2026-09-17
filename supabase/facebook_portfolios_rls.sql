-- Mengizinkan Admin untuk menghapus data di tabel facebook_portfolios
-- Pastikan tabel ini sudah memiliki ekstensi RLS yang diaktifkan (sudah dilakukan sebelumnya)
CREATE POLICY "Admin can delete facebook portfolios" 
ON public.facebook_portfolios FOR DELETE 
USING (user_has_role('admin'));
