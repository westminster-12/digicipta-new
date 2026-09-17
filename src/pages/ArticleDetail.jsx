import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Share2, Check, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ArticleDetail.css';
import SEO from '../components/SEO';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchArticle() {
      try {
        setLoading(true);
        // Fetch current article
        const { data, error } = await supabase
          .from('articles')
          .select('*, author:user_profiles(full_name)')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setArticle(data);

        // Fetch recommended articles
        const { data: recData } = await supabase
          .from('articles')
          .select('id, title, slug, cover_image, published_at, created_at')
          .eq('status', 'published')
          .neq('slug', slug)
          .order('published_at', { ascending: false })
          .limit(4);

        if (recData) {
          setRecommended(recData);
        }

        // Update document title & meta tags for SEO
        if (data) {
          document.title = data.seo_title || data.title ? `${data.seo_title || data.title} | Versa Design Studio` : 'Versa Design Studio';
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc && (data.seo_description || data.excerpt)) {
            metaDesc.setAttribute('content', data.seo_description || data.excerpt);
          }
        }
      } catch (err) {
        console.error('Error loading article:', err);
        setError(err.message || 'Artikel tidak ditemukan.');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="article-detail-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: '#0d9488', fontWeight: 600 }}>Memuat artikel...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-page" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h2>Artikel Tidak Ditemukan</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Artikel yang kamu cari mungkin sudah dihapus atau dipindahkan.</p>
        <Link to="/article" className="article-detail-nav-back" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Kembali ke Artikel
        </Link>
      </div>
    );
  }

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date(article.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  return (
    <div className="article-detail-page bg-light">
      <SEO 
        title={article.title} 
        description={article.excerpt || `Membaca artikel ${article.title} di Versa Design Studio`}
        canonicalUrl={`/article/${article.slug}`}
      />
      <div className="article-detail-hero">
        <div className="container">
          <Link to="/article" className="article-detail-nav-back">
            <ArrowLeft size={16} /> Kembali ke Artikel
          </Link>

          {article.category && (
            <div>
              <span className="article-detail-badge">{article.category}</span>
            </div>
          )}

          <h1 className="article-detail-title">{article.title}</h1>

          <div className="article-detail-meta">
            <div className="article-detail-meta-item">
              <Calendar size={15} />
              <span>{formattedDate}</span>
            </div>
            {(article.author_name || article.author?.full_name) && (
              <div className="article-detail-meta-item">
                <User size={15} />
                <span>{article.author_name || article.author.full_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container article-layout-wrapper">
        <div className="article-main-content">
          {article.cover_image && (
            <div className="article-detail-cover-container">
              <img src={article.cover_image} alt={article.title} className="article-detail-cover" />
            </div>
          )}

          <div className="article-detail-body">
            <div
              className="article-rich-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <div className="article-actions-row">
              {article.tags && article.tags.length > 0 ? (
                <div className="article-tags-row">
                  <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={14} /> Tagar:
                  </span>
                  {article.tags.map((tag, i) => (
                    <span key={i} className="article-tag-chip">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : <div />}

              <button className="share-btn" onClick={handleShare}>
                {copied ? <><Check size={18} /> Tersalin!</> : <><Share2 size={18} /> Bagikan / Copy Link</>}
              </button>
            </div>

            <div className="article-bottom-nav">
               <Link to="/article" className="btn btn-outline">
                 <ArrowLeft size={16} /> Kembali ke Daftar Artikel
               </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Rekomendasi */}
        <aside className="article-recommendation-sidebar">
          <h3 className="recommendation-title">Baca Artikel Lainnya</h3>
          <div className="recommendation-list">
            {recommended.map(rec => (
              <Link to={`/article/${rec.slug}`} key={rec.id} className="recommendation-card">
                <div className="rec-img-wrapper">
                   <img src={rec.cover_image || 'https://placehold.co/600x400/0d9488/ffffff?text=Versa'} alt={rec.title} />
                </div>
                <div className="rec-content">
                  <h4>{rec.title}</h4>
                  <span className="rec-date">
                    {new Date(rec.published_at || rec.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
