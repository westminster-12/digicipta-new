import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import '../../../components/admin/AdminLayout.css';

const STATUS_LABELS = { new: 'Baru', reviewed: 'Direview', shortlisted: 'Shortlist', rejected: 'Ditolak' };
const STATUS_BADGE = {
  new: 'adm-badge adm-badge-blue',
  reviewed: 'adm-badge adm-badge-yellow',
  shortlisted: 'adm-badge adm-badge-teal',
  rejected: 'adm-badge adm-badge-red',
};

export default function ApplicationList() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchApps(); }, []);

  async function fetchApps() {
    setLoading(true);
    const { data } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });
    setApps(data ?? []);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    await supabase.from('job_applications').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  const filtered = apps.filter(a => {
    const matchSearch =
      a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.position?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = { all: apps.length, new: 0, reviewed: 0, shortlisted: 0, rejected: 0 };
  apps.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">Loker & Lamaran</h1>
          <p className="admin-page-subtitle">{apps.length} total lamaran masuk</p>
        </div>
      </div>

      {/* Status tab filter */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {Object.entries({ all: 'Semua', new: 'Baru', reviewed: 'Direview', shortlisted: 'Shortlist', rejected: 'Ditolak' }).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.5rem 0.875rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '0.8125rem', fontWeight: '600', fontFamily: 'inherit',
              background: statusFilter === key ? '#0d9488' : '#ffffff',
              color: statusFilter === key ? 'white' : '#64748b',
              border: `1px solid ${statusFilter === key ? '#0d9488' : '#e2e8f0'}`,
              transition: 'all 0.15s'
            }}
          >
            {label}
            <span style={{ background: statusFilter === key ? 'rgba(255,255,255,0.25)' : '#f1f5f9', color: statusFilter === key ? 'white' : '#64748b', borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.6875rem', fontWeight: '700' }}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="adm-card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Cari nama, email, atau posisi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '0.875rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="adm-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>Memuat...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
            Tidak ada lamaran ditemukan.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {['Pelamar', 'Posisi', 'Tanggal', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <p style={{ fontWeight: '600', fontSize: '0.875rem', color: '#0f172a' }}>{app.full_name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{app.email}</p>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>{app.position}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {new Date(app.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <select
                      value={app.status}
                      onChange={e => updateStatus(app.id, e.target.value)}
                      style={{ border: 'none', background: 'transparent', fontSize: '0.8125rem', fontFamily: 'inherit', cursor: 'pointer', outline: 'none' }}
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                    <br />
                    <span className={STATUS_BADGE[app.status]} style={{ fontSize: '0.6875rem', marginTop: '2px' }}>{STATUS_LABELS[app.status]}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <Link
                      to={`/admin/careers/${app.id}`}
                      className="adm-btn adm-btn-ghost"
                      style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                    >
                      Detail
                    </Link>
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
