import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const fallbackArticles = [
  {
    id: 1,
    slug: 'cetak-kemasan-custom-manado',
    title: 'Cetak Kemasan Custom Manado: Rahasia Biar Produkmu Nggak Punya "Kembaran"!',
    date: '31 Agustus 2026',
    image: 'https://placehold.co/600x400/0d9488/ffffff?text=Kemasan+Custom',
    excerpt: 'Pernah nggak sih kamu beli jajanan lokal di bazar, rasanya enak banget, tapi stiker kemasannya persis merek sebelah?',
    category: 'Bisnis',
  }
];

function stripHtml(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

const ITEMS_PER_PAGE = 9;

const Article = () => {
  const [articlesList, setArticlesList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for features
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch unique categories once
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('category')
          .neq('category', '')
          .not('category', 'is', null);
        if (!error && data) {
          const uniqueCats = [...new Set(data.map(item => item.category))].filter(Boolean);
          setCategories(uniqueCats.sort());
        }
      } catch (err) {
        console.warn('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch articles when page, search, or category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let isMounted = true;

    async function fetchArticles() {
      setLoading(true);
      try {
        let query = supabase
          .from('articles')
          .select('id, title, slug, excerpt, content, cover_image, category, published_at, created_at, author_name', { count: 'exact' })
          .eq('status', 'published')
          .order('published_at', { ascending: false, nullsFirst: false });

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }

        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        if (isMounted) {
          if (data && data.length > 0) {
            const mapped = data.map((item) => {
              // Fix excerpt if it's broken like [object Object] or empty
              let cleanExcerpt = item.excerpt;
              if (!cleanExcerpt || String(cleanExcerpt) === '[object Object]') {
                cleanExcerpt = stripHtml(item.content).substring(0, 150) + '...';
              } else {
                 // Check if it's still containing HTML or JSON
                 if (typeof cleanExcerpt === 'string' && cleanExcerpt.includes('[object Object]')) {
                    cleanExcerpt = stripHtml(item.content).substring(0, 150) + '...';
                 } else {
                    cleanExcerpt = stripHtml(cleanExcerpt);
                 }
              }

              // Fix category stringification
              let cleanCategory = item.category;
              if (String(cleanCategory) === '[object Object]') cleanCategory = 'Berita';

              return {
                id: item.id,
                slug: item.slug,
                title: item.title,
                category: cleanCategory,
                date: item.published_at
                  ? new Date(item.published_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }),
                image: item.cover_image || 'https://placehold.co/600x400/0d9488/ffffff?text=Versa+Article',
                excerpt: cleanExcerpt,
                author: item.author_name,
              };
            });
            setArticlesList(mapped);
            setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
          } else {
            setArticlesList(fallbackArticles);
            setTotalPages(1);
          }
        }
      } catch (err) {
        console.warn('Using fallback articles:', err);
        if (isMounted) {
           setArticlesList(fallbackArticles);
           setTotalPages(1);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchArticles();
    return () => { isMounted = false; };
  }, [currentPage, searchQuery, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 on new search
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat === selectedCategory ? '' : cat); // toggle off if same
    setCurrentPage(1);
  };

  return (
    <div className="page-layout">
      <div className="page-header bg-gradient-tosca">
        <div className="container text-center">
          <h1 className="text-white">Articles & Insights</h1>
          <p className="text-white opacity-90 mt-4">Berita terbaru, tips, dan wawasan seputar dunia desain dan percetakan.</p>
        </div>
      </div>

      <section className="section bg-white">
        <div className="container">
          <div className="article-layout-container">
            {/* Sidebar / Top Filter */}
            <aside className="article-sidebar">
              <div className="sidebar-widget">
                <form onSubmit={handleSearch} className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Cari artikel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              <div className="sidebar-widget">
                <h4>Kategori</h4>
                <div className="category-list">
                  <span 
                    className={`category-badge ${selectedCategory === '' ? 'active' : ''}`}
                    onClick={() => handleCategoryClick('')}
                  >
                    Semua
                  </span>
                  {categories.map((cat, i) => (
                    <span 
                      key={i} 
                      className={`category-badge ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(cat)}
                    >
                      {String(cat).replace('[object Object]', 'Berita')}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="article-main">
              {loading ? (
                <div className="text-center py-12 text-gray-500">Memuat artikel...</div>
              ) : (
                <>
                  <div className="article-grid">
                    {articlesList.map((article) => (
                      <Link
                        to={`/article/${article.slug}`}
                        key={article.id}
                        className="card article-card"
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="article-image-wrapper">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="article-image"
                          />
                        </div>
                        <div className="article-content">
                          <div className="flex justify-between items-center mb-2 text-sm">
                             <div className="flex flex-col gap-1 text-gray-500">
                               <span className="article-date">
                                 <Calendar size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                                 {article.date}
                               </span>
                               {article.author && (
                                 <span className="article-author text-xs">Oleh: {article.author}</span>
                               )}
                             </div>
                             {article.category && (
                                <span className="text-primary text-xs font-semibold self-start">{article.category}</span>
                             )}
                          </div>
                          <h3 className="text-primary">{article.title}</h3>
                          <p className="article-excerpt">{article.excerpt}</p>
                          <span className="read-more text-accent">
                            Read More <ArrowRight size={16} className="ml-2" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button 
                        className="page-btn" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      
                      {Array.from({ length: totalPages }).map((_, idx) => {
                         const page = idx + 1;
                         // Show max 5 pages around current page
                         if (page === 1 || page === totalPages || Math.abs(currentPage - page) <= 1) {
                           return (
                             <button
                               key={page}
                               className={`page-btn ${currentPage === page ? 'active' : ''}`}
                               onClick={() => setCurrentPage(page)}
                             >
                               {page}
                             </button>
                           );
                         } else if (Math.abs(currentPage - page) === 2) {
                           return <span key={page} className="text-gray-400">...</span>;
                         }
                         return null;
                      })}

                      <button 
                        className="page-btn" 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}

                  {!loading && articlesList.length === 0 && (
                     <div className="text-center py-12 text-gray-500">
                        Tidak ada artikel yang ditemukan.
                     </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Article;
