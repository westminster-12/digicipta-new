import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function PrivateRoute({ children, requiredRoles = [] }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0f1a',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '0.875rem'
      }}>
        Memuat...
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;

  if (requiredRoles.length > 0) {
    const hasAccess = requiredRoles.some(r => profile?.roles?.includes(r));
    if (!hasAccess) return <Navigate to="/admin" replace />;
  }

  return children || <Outlet />;
}
