import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import '../../../components/admin/AdminLayout.css';

export default function PortfolioList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const { data } = await supabase
      .from('portfolios')
      .select('id, title, category, images, status, sort_order, created_at')
      .order('sort_order', { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  }

  async function toggleStatus(item) {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    await supabase.from('portfolios').update({ status: newStatus }).eq('id', item.id);
    setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: newStatus } : p));
  }

  async function deleteItem(id) {
    if (!confirm('Hapus item portfolio ini?')) return;
    await supabase.from('portfolios').delete().eq('id', id);
    setItems(prev => prev.filter(p => p.id !== id));
  }

  const categories = ['all', ...new Set(items.map(i => i.category).filter(Boolean))];

  const filtered = items.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">Portfolio / Galeri Produk</h1>
          <p className="admin-page-subtitle">Showcase produk cetak & layanan Versa</p>
        </div>
        <Link to="/admin/portfolio/new" className="adm-btn adm-btn-primary">
          <Plus size={15} /> Tambah Item
        </Link>
      </div>

      {/* Filters */}
      <div className="adm-card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '0.875rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{
              padding: '0.375rem 0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '0.8125rem', fontWeight: '600', fontFamily: 'inherit',
              background: catFilter === c ? '#0d9488' : '#f1f5f9',
              color: catFilter === c ? 'white' : '#64748b', transition: 'all 0.15s'
            }}>
              {c === 'all' ? 'Semua' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>Memuat...</div>
      ) : filtered.length === 0 ? (
        <div className="adm-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
          Belum ada item. <Link to="/admin/portfolio/new" style={{ color: '#0d9488', fontWeight: '600' }}>Tambah sekarang →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {filtered.map(item => (
            <div key={item.id} className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Thumbnail */}
              <div style={{ position: 'relative', aspectRatio: '4/3', background: '#f1f5f9', overflow: 'hidden' }}>
                {item.images?.[0]
                  ? <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: '0.75rem' }}>No image</div>
                }
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                  <span className={`adm-badge ${item.status === 'published' ? 'adm-badge-green' : 'adm-badge-gray'}`} style={{ fontSize: '0.6875rem' }}>
                    {item.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '0.875rem' }}>
                <p style={{ fontWeight: '700', fontSize: '0.875rem', color: '#0f172a', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title || '(Tanpa judul)'}
                </p>
                {item.category && (
                  <span style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: '500' }}>{item.category}</span>
                )}
                <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.75rem' }}>
                  <button onClick={() => navigate(`/admin/portfolio/${item.id}`)} className="adm-btn adm-btn-ghost" style={{ flex: 1, padding: '0.375rem' }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => toggleStatus(item)} className="adm-btn adm-btn-ghost" style={{ padding: '0.375rem 0.5rem' }} title={item.status === 'published' ? 'Unpublish' : 'Publish'}>
                    {item.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="adm-btn adm-btn-danger" style={{ padding: '0.375rem 0.5rem' }} title="Hapus">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
