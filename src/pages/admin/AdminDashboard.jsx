import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Image, Briefcase, Users, Plus, ArrowRight, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import '../../components/admin/AdminLayout.css';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ articles: 0, portfolios: 0, applications: 0, users: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.roles?.includes('admin');
  const isAuthor = profile?.roles?.includes('author');
  const isHrd = profile?.roles?.includes('hrd');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const promises = [];

      if (isAdmin || isAuthor) {
        promises.push(
          supabase.from('articles').select('id', { count: 'exact', head: true }),
          supabase.from('articles').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(5)
        );
      }
      if (isAdmin) {
        promises.push(
          supabase.from('portfolios').select('id', { count: 'exact', head: true }),
          supabase.from('user_profiles').select('id', { count: 'exact', head: true })
        );
      }
      if (isAdmin || isHrd) {
        promises.push(
          supabase.from('job_applications').select('id', { count: 'exact', head: true }),
          supabase.from('job_applications').select('id, full_name, position, status, created_at').order('created_at', { ascending: false }).limit(5)
        );
      }

      const results = await Promise.all(promises);

      let idx = 0;
      const newStats = { ...stats };

      if (isAdmin || isAuthor) {
        newStats.articles = results[idx]?.count ?? 0; idx++;
        setRecentArticles(results[idx]?.data ?? []); idx++;
      }
      if (isAdmin) {
        newStats.portfolios = results[idx]?.count ?? 0; idx++;
        newStats.users = results[idx]?.count ?? 0; idx++;
      }
      if (isAdmin || isHrd) {
        newStats.applications = results[idx]?.count ?? 0; idx++;
        setRecentApps(results[idx]?.data ?? []); idx++;
      }

      setStats(newStats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    isAdmin || isAuthor ? { label: 'Total Artikel', value: stats.articles, icon: FileText, color: '#0d9488', link: '/admin/articles' } : null,
    isAdmin ? { label: 'Total Portfolio', value: stats.portfolios, icon: Image, color: '#6366f1', link: '/admin/portfolio' } : null,
    isAdmin || isHrd ? { label: 'Lamaran Masuk', value: stats.applications, icon: Briefcase, color: '#f59e0b', link: '/admin/careers' } : null,
    isAdmin ? { label: 'Total User', value: stats.users, icon: Users, color: '#ec4899', link: '/admin/users' } : null,
  ].filter(Boolean);

  function statusBadge(status) {
    const map = {
      published: 'adm-badge adm-badge-green',
      draft: 'adm-badge adm-badge-gray',
      new: 'adm-badge adm-badge-blue',
      reviewed: 'adm-badge adm-badge-yellow',
      shortlisted: 'adm-badge adm-badge-teal',
      rejected: 'adm-badge adm-badge-red',
    };
    return map[status] || 'adm-badge adm-badge-gray';
  }

  const statusLabel = {
    published: 'Published', draft: 'Draft',
    new: 'Baru', reviewed: 'Direview', shortlisted: 'Shortlist', rejected: 'Ditolak'
  };

  const firstName = profile?.full_name?.split(' ')[0] || 'Admin';

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Selamat datang, {firstName} 👋</h1>
        <p className="admin-page-subtitle">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="dash-stats">
        {statCards.map(card => (
          <Link key={card.label} to={card.link} className="dash-stat-card adm-card">
            <div className="dash-stat-icon" style={{ background: card.color + '18', color: card.color }}>
              <card.icon size={20} />
            </div>
            <div className="dash-stat-body">
              <span className="dash-stat-value">{loading ? '—' : card.value}</span>
              <span className="dash-stat-label">{card.label}</span>
            </div>
            <ArrowRight size={14} className="dash-stat-arrow" />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dash-quick-actions adm-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <p className="dash-section-label">Aksi Cepat</p>
        <div className="dash-actions-row">
          {(isAdmin || isAuthor) && (
            <Link to="/admin/articles/new" className="adm-btn adm-btn-primary">
              <Plus size={15} /> Tulis Artikel
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin/portfolio/new" className="adm-btn adm-btn-secondary">
              <Plus size={15} /> Tambah Portfolio
            </Link>
          )}
          {(isAdmin || isHrd) && (
            <Link to="/admin/careers" className="adm-btn adm-btn-secondary">
              <Briefcase size={15} /> Lihat Lamaran
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin/users/invite" className="adm-btn adm-btn-secondary">
              <Users size={15} /> Undang User
            </Link>
          )}
        </div>
      </div>

      <div className="dash-two-col">
        {/* Recent Applications */}
        {(isAdmin || isHrd) && (
          <div className="adm-card dash-table-card">
            <div className="dash-card-header">
              <span className="dash-section-label">Lamaran Terbaru</span>
              <Link to="/admin/careers" className="dash-see-all">Lihat semua <ArrowRight size={13} /></Link>
            </div>
            <div className="dash-list">
              {recentApps.length === 0 && !loading && (
                <p className="dash-empty">Belum ada lamaran masuk.</p>
              )}
              {recentApps.map(app => (
                <Link key={app.id} to={`/admin/careers/${app.id}`} className="dash-list-item">
                  <div className="dash-list-icon">
                    <Briefcase size={14} />
                  </div>
                  <div className="dash-list-body">
                    <span className="dash-list-title">{app.full_name}</span>
                    <span className="dash-list-sub">{app.position}</span>
                  </div>
                  <div className="dash-list-right">
                    <span className={statusBadge(app.status)}>{statusLabel[app.status]}</span>
                    <span className="dash-list-time">
                      <Clock size={11} />
                      {new Date(app.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Articles */}
        {(isAdmin || isAuthor) && (
          <div className="adm-card dash-table-card">
            <div className="dash-card-header">
              <span className="dash-section-label">Artikel Terbaru</span>
              <Link to="/admin/articles" className="dash-see-all">Lihat semua <ArrowRight size={13} /></Link>
            </div>
            <div className="dash-list">
              {recentArticles.length === 0 && !loading && (
                <p className="dash-empty">Belum ada artikel.</p>
              )}
              {recentArticles.map(art => (
                <Link key={art.id} to={`/admin/articles/${art.id}`} className="dash-list-item">
                  <div className="dash-list-icon">
                    <FileText size={14} />
                  </div>
                  <div className="dash-list-body">
                    <span className="dash-list-title">{art.title || '(Tanpa judul)'}</span>
                    <span className="dash-list-sub">
                      {new Date(art.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <span className={statusBadge(art.status)}>{statusLabel[art.status]}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .dash-stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.375rem;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .dash-stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .dash-stat-icon {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .dash-stat-body { flex: 1; display: flex; flex-direction: column; gap: 1px; }
        .dash-stat-value { font-size: 1.75rem; font-weight: 700; color: #0f172a; line-height: 1; }
        .dash-stat-label { font-size: 0.8125rem; color: #64748b; font-weight: 500; }
        .dash-stat-arrow { color: #cbd5e1; flex-shrink: 0; }
        .dash-section-label { font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; }
        .dash-actions-row { display: flex; flex-wrap: wrap; gap: 0.625rem; margin-top: 0.875rem; }
        .dash-two-col { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
        .dash-table-card { overflow: hidden; }
        .dash-card-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .dash-see-all { display: flex; align-items: center; gap: 0.25rem; font-size: 0.8125rem; color: #0d9488; font-weight: 500; text-decoration: none; }
        .dash-see-all:hover { color: #0f766e; }
        .dash-list { display: flex; flex-direction: column; }
        .dash-empty { padding: 1.5rem 1.25rem; color: #94a3b8; font-size: 0.875rem; }
        .dash-list-item {
          display: flex; align-items: center; gap: 0.875rem;
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          text-decoration: none; color: inherit;
          transition: background 0.15s;
        }
        .dash-list-item:last-child { border-bottom: none; }
        .dash-list-item:hover { background: #f8fafc; }
        .dash-list-icon { width: 30px; height: 30px; border-radius: 7px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #64748b; flex-shrink: 0; }
        .dash-list-body { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .dash-list-title { font-size: 0.875rem; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dash-list-sub { font-size: 0.75rem; color: #94a3b8; }
        .dash-list-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
        .dash-list-time { display: flex; align-items: center; gap: 3px; font-size: 0.6875rem; color: #94a3b8; }
      `}</style>
    </div>
  );
}
