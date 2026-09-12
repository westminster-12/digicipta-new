import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import '../../../components/admin/AdminLayout.css';

const STATUS_LABELS = { published: 'Published', draft: 'Draft' };
const STATUS_BADGE = { published: 'adm-badge adm-badge-green', draft: 'adm-badge adm-badge-gray' };

export default function ArticleList() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const isAdmin = profile?.roles?.includes('admin');

  useEffect(() => { fetchArticles(); }, []);

  async function fetchArticles() {
    setLoading(true);
    let q = supabase
      .from('articles')
      .select('id, title, slug, category, status, author_id, created_at, published_at, user_profiles(full_name, email)')
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      q = q.eq('author_id', profile?.id);
    }

    const { data, error } = await q;
    if (!error) setArticles(data ?? []);
    setLoading(false);
  }

  async function toggleStatus(article) {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    const updates = {
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null
    };
    await supabase.from('articles').update(updates).eq('id', article.id);
    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, ...updates } : a));
  }

  async function deleteArticle(id) {
    if (!confirm('Hapus artikel ini?')) return;
    await supabase.from('articles').delete().eq('id', id);
    setArticles(prev => prev.filter(a => a.id !== id));
  }

  const filtered = articles.filter(a => {
    const matchSearch = a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">Artikel</h1>
          <p className="admin-page-subtitle">{articles.length} artikel total</p>
        </div>
        <Link to="/admin/articles/new" className="adm-btn adm-btn-primary">
          <Plus size={15} /> Tulis Artikel
        </Link>
      </div>

      {/* Filters */}
      <div className="adm-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Cari judul atau kategori..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '0.875rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {['all', 'published', 'draft'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '0.4rem 0.875rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
                fontSize: '0.8125rem', fontWeight: '600', fontFamily: 'inherit',
                background: statusFilter === s ? '#0d9488' : '#f1f5f9',
                color: statusFilter === s ? 'white' : '#64748b',
                transition: 'all 0.15s'
              }}
            >
              {s === 'all' ? 'Semua' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="adm-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>Memuat...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
            {articles.length === 0 ? 'Belum ada artikel. ' : 'Tidak ditemukan. '}
            <Link to="/admin/articles/new" style={{ color: '#0d9488', fontWeight: '600' }}>Tulis artikel pertama →</Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {['Judul', 'Kategori', isAdmin ? 'Author' : null, 'Status', 'Tanggal', 'Aksi'].filter(Boolean).map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(art => (
                <tr key={art.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '0.875rem 1rem', maxWidth: '300px' }}>
                    <span style={{ display: 'block', fontWeight: '600', fontSize: '0.875rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {art.title || '(Tanpa judul)'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/{art.slug || '—'}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>{art.category || '—'}</span>
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                        {art.user_profiles?.full_name || art.user_profiles?.email || '—'}
                      </span>
                    </td>
                  )}
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className={STATUS_BADGE[art.status]}>{STATUS_LABELS[art.status]}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {new Date(art.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button onClick={() => navigate(`/admin/articles/${art.id}`)} className="adm-btn adm-btn-ghost" style={{ padding: '0.375rem 0.625rem' }} title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => toggleStatus(art)} className="adm-btn adm-btn-ghost" style={{ padding: '0.375rem 0.625rem' }} title={art.status === 'published' ? 'Ubah ke Draft' : 'Publish'}>
                        {art.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      {isAdmin && (
                        <button onClick={() => deleteArticle(art.id)} className="adm-btn adm-btn-danger" style={{ padding: '0.375rem 0.625rem' }} title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
