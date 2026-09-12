import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Eye, EyeOff, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import '../../../components/admin/AdminLayout.css';

const EMPTY_FORM = {
  title: '',
  category: '',
  client: '',
  description: '',
  images: [],
  tags: '',
  year: '',
  url: '',
  sort_order: 0,
  status: 'draft',
};

export default function PortfolioEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (!isNew) loadItem();
  }, [id]);

  async function loadItem() {
    const { data } = await supabase.from('portfolios').select('*').eq('id', id).single();
    if (data) {
      setForm({
        title: data.title ?? '',
        category: data.category ?? '',
        client: data.client ?? '',
        description: data.description ?? '',
        images: data.images ?? [],
        tags: (data.tags ?? []).join(', '),
        year: data.year?.toString() ?? '',
        url: data.url ?? '',
        sort_order: data.sort_order ?? 0,
        status: data.status ?? 'draft',
      });
    }
  }

  async function uploadImages(files) {
    if (!files.length) return;
    setUploading(true);
    const uploaded = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('portfolio-images').upload(path, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }
    setForm(f => ({ ...f, images: [...f.images, ...uploaded] }));
    setUploading(false);
  }

  function removeImage(idx) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  async function save(publishOverride) {
    setSaving(true);
    const status = publishOverride !== undefined ? publishOverride : form.status;
    const payload = {
      title: form.title,
      category: form.category,
      client: form.client,
      description: form.description,
      images: form.images,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      year: form.year ? parseInt(form.year) : null,
      url: form.url,
      sort_order: parseInt(form.sort_order) || 0,
      status,
    };

    let error;
    if (isNew) {
      const res = await supabase.from('portfolios').insert(payload).select().single();
      error = res.error;
      if (!error) navigate(`/admin/portfolio/${res.data.id}`, { replace: true });
    } else {
      const res = await supabase.from('portfolios').update(payload).eq('id', id);
      error = res.error;
    }

    if (!error) {
      setSaveMsg('Tersimpan');
      setForm(f => ({ ...f, status }));
      setTimeout(() => setSaveMsg(''), 2500);
    }
    setSaving(false);
  }

  function field(label, key, type = 'text', placeholder = '', hint = '') {
    return (
      <div className="adm-form-field">
        <label>{label}</label>
        <input
          type={type}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
        />
        {hint && <span className="adm-form-hint">{hint}</span>}
      </div>
    );
  }

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => navigate('/admin/portfolio')} className="adm-btn adm-btn-ghost" style={{ padding: '0.375rem 0.625rem' }}>
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="admin-page-title">{isNew ? 'Tambah Item Portfolio' : 'Edit Item Portfolio'}</h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {saveMsg && <span style={{ fontSize: '0.8125rem', color: '#16a34a', fontWeight: '600', background: '#dcfce7', padding: '0.25rem 0.625rem', borderRadius: '6px' }}>{saveMsg}</span>}
          <button onClick={() => save()} className="adm-btn adm-btn-ghost" disabled={saving}>
            <Save size={15} /> Simpan Draft
          </button>
          {form.status !== 'published'
            ? <button onClick={() => save('published')} className="adm-btn adm-btn-primary" disabled={saving}>
                <Eye size={15} /> Publish
              </button>
            : <button onClick={() => save('draft')} className="adm-btn adm-btn-secondary" disabled={saving}>
                <EyeOff size={15} /> Unpublish
              </button>
          }
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Info */}
          <div className="adm-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Informasi</p>
            {field('Judul Produk / Proyek', 'title', 'text', 'mis: Cetak Baliho 5x3m Full Color')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {field('Kategori', 'category', 'text', 'mis: Baliho, Spanduk, Undangan')}
              {field('Klien', 'client', 'text', 'Nama klien (opsional)')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {field('Tahun', 'year', 'number', '2024')}
              {field('URL Proyek', 'url', 'url', 'https://... (opsional)')}
            </div>
            <div className="adm-form-field">
              <label>Deskripsi</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Ceritakan singkat tentang produk atau proyek ini (opsional)..."
                style={{ minHeight: '100px' }}
              />
            </div>
            {field('Tags', 'tags', 'text', 'pisah dengan koma', 'Contoh: cetak, baliho, outdoor, full color')}
          </div>

          {/* Images */}
          <div className="adm-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Gambar ({form.images.length})
              </p>
              <button
                className="adm-btn adm-btn-secondary"
                style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={13} /> {uploading ? 'Mengupload...' : 'Upload Gambar'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => uploadImages(e.target.files)} />
            </div>

            {form.images.length === 0 ? (
              <button
                className="adm-btn"
                style={{ width: '100%', aspectRatio: '16/7', border: '2px dashed #e2e8f0', borderRadius: '8px', background: '#f8fafc', flexDirection: 'column', color: '#94a3b8', fontSize: '0.875rem', cursor: 'pointer', gap: '0.5rem' }}
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={20} />
                Klik untuk upload gambar produk
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.625rem' }}>
                {form.images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', background: '#f1f5f9' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {idx === 0 && (
                      <span style={{ position: 'absolute', top: '0.375rem', left: '0.375rem', background: '#0d9488', color: 'white', fontSize: '0.625rem', fontWeight: '700', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>Cover</span>
                    )}
                    <button
                      onClick={() => removeImage(idx)}
                      style={{ position: 'absolute', top: '0.375rem', right: '0.375rem', width: '22px', height: '22px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{ aspectRatio: '4/3', border: '2px dashed #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', color: '#94a3b8', fontSize: '0.6875rem', cursor: 'pointer' }}
                >
                  <Plus size={18} />
                  Tambah
                </button>
              </div>
            )}
            <p className="adm-form-hint" style={{ marginTop: '0.5rem' }}>Gambar pertama akan digunakan sebagai cover.</p>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="adm-card" style={{ padding: '1rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.875rem' }}>Status</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['draft', 'published'].map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', background: form.status === s ? (s === 'published' ? '#f0fdf4' : '#f8fafc') : 'transparent', border: `1px solid ${form.status === s ? (s === 'published' ? '#86efac' : '#e2e8f0') : 'transparent'}` }}>
                  <input type="radio" name="port-status" value={s} checked={form.status === s} onChange={() => setForm(f => ({ ...f, status: s }))} style={{ accentColor: '#0d9488' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: form.status === s ? '#0f172a' : '#64748b' }}>
                    {s === 'published' ? '🟢 Published' : '⚫ Draft'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="adm-card" style={{ padding: '1rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.875rem' }}>Urutan Tampil</p>
            <div className="adm-form-field">
              <input
                type="number"
                value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
                placeholder="0"
                min="0"
              />
              <span className="adm-form-hint">Angka lebih kecil = tampil lebih awal</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .port-edit-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
