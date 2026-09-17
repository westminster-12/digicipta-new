import { useState, useEffect, useCallback } from 'react';
import { Search, Image as ImageIcon, Loader2, ZoomIn, X } from 'lucide-react';
import './Portfolio.css';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

const PAGE_SIZE = 30;

const Portfolio = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  // Timer for search debounce
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Debounce search input
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
        // Full text search in caption
        query = query.ilike('caption', `%${debouncedSearch}%`);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      if (data) {
        if (isLoadMore) {
          setPortfolioData(prev => [...prev, ...data]);
        } else {
          setPortfolioData(data);
          setTotalCount(count || 0);
        }
        setPage(currentPage);
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, page]);

  // Fetch when search changes
  useEffect(() => {
    fetchPortfolio(false);
  }, [debouncedSearch]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPortfolio(true);
    }
  };

  return (
    <div className="page-layout">
      <SEO
        title="Portofolio Pencarian"
        description="Jelajahi karya-karya terbaik dari Versa Design Studio."
        canonicalUrl="/portfolio"
      />
      <div className="page-header bg-gradient-tosca">
        <div className="container text-center">
          <h1 className="text-white">Our Portfolio</h1>
          <p className="text-white opacity-90 mt-4">Menampilkan {totalCount.toLocaleString('id-ID')} foto hasil karya kami.</p>

          <div className="search-container mt-5">
            <div className="search-box glass-effect">
              <Search className="search-icon-glass" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Coba cari neon box, undangan, wedding plate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {loading && <Loader2 className="search-loading-icon spin-animation" size={20} />}
            </div>
          </div>
        </div>
      </div>

      <section className="section portfolio-section bg-light">
        <div className="container" style={{ position: 'relative' }}>
          {portfolioData.length === 0 && !loading ? (
            <div className="empty-state text-center py-5">
              <Search size={48} className="text-muted mb-3 mx-auto" />
              <h3 className="text-primary">Tidak Ada Hasil</h3>
              <p className="text-muted">
                Maaf, kami tidak dapat menemukan gambar {debouncedSearch ? `untuk "${debouncedSearch}"` : ''}.
              </p>
            </div>
          ) : (
            <>
              <div className="masonry-grid" style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s' }}>
                {portfolioData.map((item) => (
                  <div key={item.id} className="portfolio-item group" onClick={() => setSelectedImage(item)}>
                    <img src={item.image_url} alt={item.caption ? item.caption.substring(0, 30) : 'Portfolio Versa'} loading="lazy" />
                    <div className="portfolio-overlay">
                      <div className="portfolio-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        <ZoomIn size={48} color="white" className="opacity-90" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {loading && portfolioData.length === 0 && (
                <div className="text-center py-5" style={{ position: 'absolute', top: '100px', left: 0, right: 0 }}>
                  <Loader2 size={48} className="text-primary mx-auto mb-3 spin-animation" />
                  <p className="text-muted">Memuat portofolio...</p>
                </div>
              )}

              {hasMore && (
                <div className="text-center mt-5">
                  <button
                    className="btn btn-primary px-5 py-2 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    style={{ fontWeight: 600 }}
                  >
                    {loadingMore ? <Loader2 size={18} className="spin-animation" /> : null}
                    {loadingMore ? 'Memuat...' : `Muat Lebih Banyak`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="portfolio-lightbox-backdrop" onClick={() => setSelectedImage(null)}>
          <div className="portfolio-lightbox-modal" onClick={e => e.stopPropagation()}>
            <button className="portfolio-lightbox-close" onClick={() => setSelectedImage(null)}>
              <X size={20} />
            </button>
            <div className="portfolio-lightbox-gallery">
              <img src={selectedImage.image_url} alt="Enlarged" className="portfolio-lightbox-main-img" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
