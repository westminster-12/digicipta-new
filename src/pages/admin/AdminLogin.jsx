import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../lib/auth';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-root">
      <div className="admin-login-bg" aria-hidden="true">
        <div className="admin-login-orb admin-login-orb-1" />
        <div className="admin-login-orb admin-login-orb-2" />
      </div>

      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-login-brand-mark">V</span>
          <span className="admin-login-brand-name">Versa Admin</span>
        </div>

        <h1 className="admin-login-title">Masuk ke Panel Admin</h1>
        <p className="admin-login-sub">Akses terbatas untuk tim internal Versa.</p>

        <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
          <div className="afl-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@digicipta.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="afl-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="admin-login-error" role="alert">{error}</p>}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
