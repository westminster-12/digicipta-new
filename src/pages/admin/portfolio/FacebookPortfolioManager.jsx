import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Trash2, CheckSquare, Square } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const PAGE_SIZE = 30;

export default function FacebookPortfolioManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPortfolio = useCallback(async (isLoadMore = false) => {
    try {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        const currentPage = isLoadMore ? page + 1 : 0;
        const from = currentPage * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let query = supabase
            .from('facebook_portfolios')
            .select('*', { count: 'exact' })
            .order('created_time', { ascending: false })
            .range(from, to);

        if (debouncedSearch.trim()) {
            query = query.ilike('caption', `%${debouncedSearch}%`);
        }

        const { data, count, error } = await query;

        if (error) throw error;

        if (data) {
            if (isLoadMore) {
                setItems(prev => [...prev, ...data]);
            } else {
                setItems(data);
                setTotalCount(count || 0);
            }
            setPage(currentPage);
            setHasMore(data.length === PAGE_SIZE);
        }
    } catch (err) {
        console.error("Error fetching FB portfolio:", err);
    } finally {
        setLoading(false);
        setLoadingMore(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
      fetchPortfolio(false);
      setSelectedIds(new Set()); // Reset selection on search change
  }, [debouncedSearch]);

  const handleLoadMore = () => {
      if (!loadingMore && hasMore) {
          fetchPortfolio(true);
      }
  };

  const toggleSelection = (id) => {
      setSelectedIds(prev => {
          const next = new Set(prev);
          if (next.has(id)) {
              next.delete(id);
          } else {
              next.add(id);
          }
          return next;
      });
  };

  const selectAll = () => {
      if (selectedIds.size === items.length) {
          setSelectedIds(new Set()); // deselect all
      } else {
          setSelectedIds(new Set(items.map(i => i.id))); // select all currently visible
      }
  };

  const deleteSelected = async () => {
      if (selectedIds.size === 0) return;
      if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.size} foto terpilih? (Tindakan ini tidak dapat dibatalkan)`)) return;

      setIsDeleting(true);
      try {
          const idsToDelete = Array.from(selectedIds);
          const { error } = await supabase
            .from('facebook_portfolios')
            .delete()
            .in('id', idsToDelete);

          if (error) throw error;

          // Remove from local state
          setItems(prev => prev.filter(item => !selectedIds.has(item.id)));
          setTotalCount(prev => Math.max(0, prev - selectedIds.size));
          setSelectedIds(new Set());
          alert('Foto berhasil dihapus.');
      } catch (err) {
          console.error("Error deleting items:", err);
          alert('Gagal menghapus foto. Pastikan Admin RLS Policy sudah dijalankan.');
      } finally {
          setIsDeleting(false);
      }
  };

  return (
    <div>
      {/* Controls */}
      <div className="adm-card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '180px', maxWidth: '400px' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                    type="text"
                    placeholder="Cari foto dari Facebook..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '0.875rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none' }}
                />
            </div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Total: <strong>{totalCount}</strong> foto
            </span>
        </div>

        {selectedIds.size > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fee2e2', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: '#991b1b', fontWeight: '600' }}>
                    {selectedIds.size} terpilih
                </span>
                <button 
                    onClick={deleteSelected}
                    disabled={isDeleting}
                    className="adm-btn adm-btn-danger" 
                    style={{ padding: '0.375rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {isDeleting ? <Loader2 size={14} className="spin-animation" /> : <Trash2 size={14} />}
                    Hapus
                </button>
            </div>
        )}
      </div>

      {/* Select All Bar */}
      {items.length > 0 && (
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={selectAll} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.875rem', fontWeight: '500' }}
              >
                  {selectedIds.size === items.length && items.length > 0 ? (
                      <CheckSquare size={18} color="#0d9488" />
                  ) : (
                      <Square size={18} />
                  )}
                  Pilih Semua di Halaman Ini
              </button>
          </div>
      )}

      {/* Grid */}
      {loading && items.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
            <Loader2 size={24} className="spin-animation" style={{ margin: '0 auto 0.5rem' }} />
            Memuat dari Supabase...
        </div>
      ) : items.length === 0 ? (
        <div className="adm-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
          Tidak ada hasil ditemukan.
        </div>
      ) : (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
            {items.map(item => {
                const isSelected = selectedIds.has(item.id);
                return (
                <div 
                    key={item.id} 
                    className="adm-card" 
                    style={{ 
                        padding: 0, 
                        overflow: 'hidden', 
                        cursor: 'pointer',
                        border: isSelected ? '2px solid #0d9488' : '1px solid #e2e8f0',
                        boxShadow: isSelected ? '0 0 0 2px rgba(13, 148, 136, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
                        position: 'relative'
                    }}
                    onClick={() => toggleSelection(item.id)}
                >
                    {/* Checkbox overlay */}
                    <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', zIndex: 2, background: isSelected ? '#0d9488' : 'rgba(255,255,255,0.8)', borderRadius: '4px', padding: '0.125rem' }}>
                        {isSelected ? <CheckSquare size={20} color="white" /> : <Square size={20} color="#64748b" />}
                    </div>

                    {/* Thumbnail */}
                    <div style={{ aspectRatio: '1/1', background: '#f1f5f9', overflow: 'hidden' }}>
                        <img src={item.image_url} alt="FB Portfolio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    </div>

                    {/* Info */}
                    <div style={{ padding: '0.75rem' }}>
                        <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '3.375rem' }}>
                            {item.caption || '(Tanpa caption)'}
                        </p>
                    </div>
                </div>
                );
            })}
            </div>

            {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button 
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="adm-btn"
                        style={{ padding: '0.5rem 1.5rem', background: '#f1f5f9', color: '#0f172a', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {loadingMore ? <Loader2 size={16} className="spin-animation" /> : null}
                        Muat Lebih Banyak
                    </button>
                </div>
            )}
        </>
      )}

      {/* Global CSS animation for spinner if not already present in admin */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-animation { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}
