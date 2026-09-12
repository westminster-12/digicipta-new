import { useEffect, useState } from 'react';
import { Plus, Edit2, ShieldCheck, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import InviteUserModal from './InviteUserModal';
import EditUserModal from './EditUserModal';
import '../../../components/admin/AdminLayout.css';

const ROLE_LABELS = { admin: 'Admin', author: 'Author', hrd: 'HRD' };
const ROLE_COLORS = { admin: 'adm-badge-teal', author: 'adm-badge-blue', hrd: 'adm-badge-yellow' };

export default function UserList() {
  const { profile: currentProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
    setUsers(data ?? []);
    setLoading(false);
  }

  async function toggleActive(user) {
    if (user.id === currentProfile?.id) return;
    await supabase.from('user_profiles').update({ is_active: !user.is_active }).eq('id', user.id);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
  }

  function handleUserSaved(updatedUser) {
    setUsers(prev => {
      const exists = prev.find(u => u.id === updatedUser.id);
      if (exists) return prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      return [updatedUser, ...prev];
    });
  }

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">Manajemen User</h1>
          <p className="admin-page-subtitle">{users.length} user terdaftar</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => setShowInvite(true)}>
          <Plus size={15} /> Undang User
        </button>
      </div>

      <div className="adm-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Memuat...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {['User', 'Role', 'Status', 'Bergabung', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', opacity: user.is_active ? 1 : 0.5 }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#0d9488,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.875rem', flexShrink: 0 }}>
                        {(user.full_name || user.email || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '0.875rem', color: '#0f172a' }}>
                          {user.full_name || '(Tanpa nama)'}
                          {user.id === currentProfile?.id && (
                            <span style={{ marginLeft: '0.375rem', fontSize: '0.6875rem', color: '#0d9488', fontWeight: '700' }}>Kamu</span>
                          )}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {(user.roles ?? []).length === 0
                        ? <span className="adm-badge adm-badge-gray">No role</span>
                        : user.roles.map(r => (
                          <span key={r} className={`adm-badge ${ROLE_COLORS[r] || 'adm-badge-gray'}`}>{ROLE_LABELS[r] || r}</span>
                        ))
                      }
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className={`adm-badge ${user.is_active ? 'adm-badge-green' : 'adm-badge-red'}`}>
                      {user.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                      {new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button
                        onClick={() => setEditUser(user)}
                        className="adm-btn adm-btn-ghost"
                        style={{ padding: '0.375rem 0.625rem' }}
                        title="Edit user & role"
                      >
                        <Edit2 size={14} />
                      </button>
                      {user.id !== currentProfile?.id && (
                        <button
                          onClick={() => toggleActive(user)}
                          className={`adm-btn ${user.is_active ? 'adm-btn-danger' : 'adm-btn-secondary'}`}
                          style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
                          title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
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

      {showInvite && (
        <InviteUserModal onClose={() => setShowInvite(false)} onSaved={handleUserSaved} />
      )}
      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSaved={handleUserSaved} />
      )}
    </div>
  );
}
