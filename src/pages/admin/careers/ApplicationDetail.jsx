import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileText, Phone, Mail, Calendar } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import '../../../components/admin/AdminLayout.css';

const STATUS_LABELS = { new: 'Baru', reviewed: 'Direview', shortlisted: 'Shortlist', rejected: 'Ditolak' };
const STATUS_COLORS = { new: '#2563eb', reviewed: '#ca8a04', shortlisted: '#0f766e', rejected: '#dc2626' };

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchApp(); }, [id]);

  async function fetchApp() {
    const { data } = await supabase.from('job_applications').select('*').eq('id', id).single();
    if (data) {
      setApp(data);
      setNotes(data.admin_notes ?? '');
      // Mark as reviewed if still new
      if (data.status === 'new') {
        await supabase.from('job_applications').update({
          status: 'reviewed',
          reviewed_by: profile?.id,
          reviewed_at: new Date().toISOString(),
        }).eq('id', id);
        setApp(prev => ({ ...prev, status: 'reviewed' }));
      }
    }
    setLoading(false);
  }

  async function updateStatus(status) {
    await supabase.from('job_applications').update({ status, reviewed_by: profile?.id, reviewed_at: new Date().toISOString() }).eq('id', id);
    setApp(prev => ({ ...prev, status }));
  }

  async function saveNotes() {
    setSaving(true);
    await supabase.from('job_applications').update({ admin_notes: notes }).eq('id', id);
    setSaving(false);
  }

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Memuat...</div>;
  if (!app) return <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Lamaran tidak ditemukan.</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/admin/careers')} className="adm-btn adm-btn-ghost" style={{ padding: '0.375rem 0.625rem' }}>
          <ArrowLeft size={15} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 className="admin-page-title">{app.full_name}</h1>
          <p className="admin-page-subtitle">Lamar sebagai: {app.position}</p>
        </div>
        <select
          value={app.status}
          onChange={e => updateStatus(e.target.value)}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '8px',
            border: `1px solid ${STATUS_COLORS[app.status]}`,
            color: STATUS_COLORS[app.status],
            fontFamily: 'inherit',
            fontWeight: '700',
            fontSize: '0.875rem',
            cursor: 'pointer',
            outline: 'none',
            background: STATUS_COLORS[app.status] + '10',
          }}
        >
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Contact info */}
          <div className="adm-card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>Informasi Kontak</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={14} color="#64748b" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Email</p>
                  <a href={`mailto:${app.email}`} style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0d9488' }}>{app.email}</a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={14} color="#64748b" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No. HP</p>
                  <a href={`tel:${app.phone}`} style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a' }}>{app.phone}</a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={14} color="#64748b" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tanggal Melamar</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a' }}>
                    {new Date(app.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Versa */}
          {app.why_versa && (
            <div className="adm-card" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.875rem' }}>Alasan Melamar di Versa</p>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{app.why_versa}</p>
            </div>
          )}

          {/* Files */}
          <div className="adm-card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>Dokumen</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <a 
                href={app.cv_url?.startsWith('http') ? app.cv_url : (app.cv_url?.startsWith('file_uploaded:') ? '#' : `https://${app.cv_url}`)} 
                target={app.cv_url?.startsWith('file_uploaded:') ? '_self' : '_blank'} 
                rel="noopener noreferrer" 
                className="adm-btn adm-btn-secondary" 
                style={{ justifyContent: 'flex-start' }}
                onClick={(e) => {
                  if (app.cv_url?.startsWith('file_uploaded:')) {
                    e.preventDefault();
                    alert(`File tidak terupload sempurna ke cloud. Nama file: ${app.cv_url.replace('file_uploaded:', '')}`);
                  }
                }}
              >
                <FileText size={15} /> Lihat / Download CV
                <ExternalLink size={13} style={{ marginLeft: 'auto' }} />
              </a>
              {app.portfolio_url && (
                <a
                  href={app.portfolio_url?.startsWith('http') ? app.portfolio_url : (app.portfolio_url?.startsWith('file_uploaded:') ? '#' : `https://${app.portfolio_url}`)}
                  target={app.portfolio_url?.startsWith('file_uploaded:') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="adm-btn adm-btn-secondary"
                  style={{ justifyContent: 'flex-start' }}
                  onClick={(e) => {
                    if (app.portfolio_url?.startsWith('file_uploaded:')) {
                      e.preventDefault();
                      alert(`File tidak terupload sempurna ke cloud. Nama file: ${app.portfolio_url.replace('file_uploaded:', '')}`);
                    }
                  }}
                >
                  <FileText size={15} />
                  {app.portfolio_type === 'file' ? 'Lihat Portfolio (File)' : 'Lihat Portfolio (Link)'}
                  <ExternalLink size={13} style={{ marginLeft: 'auto' }} />
                </a>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="adm-card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.875rem' }}>Catatan Internal</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Tambahkan catatan untuk tim HR (tidak terlihat oleh pelamar)..."
              style={{ width: '100%', minHeight: '100px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', fontFamily: 'inherit', fontSize: '0.875rem', resize: 'vertical', outline: 'none', color: '#334155' }}
            />
            <button onClick={saveNotes} className="adm-btn adm-btn-primary" style={{ marginTop: '0.625rem' }} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Catatan'}
            </button>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="adm-card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>Update Status</p>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <button
                key={val}
                onClick={() => updateStatus(val)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '0.625rem 0.875rem', borderRadius: '8px',
                  border: `1px solid ${app.status === val ? STATUS_COLORS[val] : '#e2e8f0'}`,
                  background: app.status === val ? STATUS_COLORS[val] + '12' : 'transparent',
                  color: app.status === val ? STATUS_COLORS[val] : '#64748b',
                  fontFamily: 'inherit', fontWeight: '600', fontSize: '0.875rem',
                  cursor: 'pointer', transition: 'all 0.15s',
                  marginBottom: '0.375rem',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
