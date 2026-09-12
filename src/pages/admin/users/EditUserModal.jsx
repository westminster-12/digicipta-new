import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import '../../../components/admin/AdminLayout.css';

const ALL_ROLES = [
  { value: 'admin', label: 'Admin', desc: 'Akses penuh ke semua fitur' },
  { value: 'author', label: 'Author', desc: 'Hanya bisa membuat & mengelola artikel sendiri' },
  { value: 'hrd', label: 'HRD', desc: 'Hanya bisa melihat & mengelola lamaran loker' },
];

export default function EditUserModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    full_name: user.full_name ?? '',
    roles: user.roles ?? [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function toggleRole(role) {
    setForm(f => ({
      ...f,
      roles: f.roles.includes(role)
        ? f.roles.filter(r => r !== role)
        : [...f.roles, role]
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.roles.length === 0) return setError('Pilih minimal satu role.');
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ full_name: form.full_name, roles: form.roles })
        .eq('id', user.id);
      if (updateError) throw updateError;
      onSaved({ ...user, full_name: form.full_name, roles: form.roles });
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a' }}>Edit User</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '0.875rem', marginBottom: '1.25rem' }}>
          <p style={{ fontWeight: '600', fontSize: '0.875rem', color: '#0f172a' }}>{user.full_name || '(Tanpa nama)'}</p>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="adm-form-field">
            <label>Nama Lengkap</label>
            <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Nama user" />
          </div>

          <div>
            <p style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.625rem' }}>
              Role <span style={{ color: '#94a3b8', fontWeight: 400 }}>(bisa lebih dari satu)</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {ALL_ROLES.map(r => (
                <label key={r.value} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer',
                  padding: '0.75rem', borderRadius: '10px',
                  border: `1.5px solid ${form.roles.includes(r.value) ? '#0d9488' : '#e2e8f0'}`,
                  background: form.roles.includes(r.value) ? '#f0fdfa' : '#fff',
                  transition: 'all 0.15s'
                }}>
                  <input
                    type="checkbox"
                    checked={form.roles.includes(r.value)}
                    onChange={() => toggleRole(r.value)}
                    style={{ accentColor: '#0d9488', marginTop: '2px', width: '16px', height: '16px', flexShrink: 0 }}
                  />
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.875rem', color: form.roles.includes(r.value) ? '#0f766e' : '#0f172a' }}>{r.label}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1px' }}>{r.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.625rem 0.875rem', fontSize: '0.8125rem', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.625rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="adm-btn adm-btn-ghost" style={{ flex: 1 }}>Batal</button>
            <button type="submit" className="adm-btn adm-btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
