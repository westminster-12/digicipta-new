import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Image, Briefcase, Users,
  LogOut, ChevronLeft, Menu, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../lib/auth';
import './AdminLayout.css';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true, roles: [] },
  { to: '/admin/articles', label: 'Artikel', icon: FileText, roles: ['admin', 'author'] },
  { to: '/admin/portfolio', label: 'Portfolio', icon: Image, roles: ['admin'] },
  { to: '/admin/careers', label: 'Loker & Lamaran', icon: Briefcase, roles: ['admin', 'hrd'] },
  { to: '/admin/users', label: 'Manajemen User', icon: Users, roles: ['admin'] },
];

export default function AdminLayout({ children }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await signOut();
    navigate('/admin/login');
  }

  const userRoles = profile?.roles ?? [];
  const visibleNav = navItems.filter(item =>
    item.roles.length === 0 || item.roles.some(r => userRoles.includes(r))
  );

  const roleLabels = {
    admin: 'Admin',
    author: 'Author',
    hrd: 'HRD',
  };

  const displayRoles = userRoles.map(r => roleLabels[r] || r).join(', ');

  return (
    <div className={`admin-shell ${collapsed ? 'admin-shell--collapsed' : ''} ${mobileOpen ? 'admin-shell--mobile-open' : ''}`}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="admin-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-brand">
            <span className="admin-brand-mark">V</span>
            {!collapsed && <span className="admin-brand-text">Versa Admin</span>}
          </div>
          <button
            className="admin-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft size={16} className={collapsed ? 'rotate-180' : ''} />
          </button>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {visibleNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="admin-nav-icon" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {(profile?.full_name || profile?.email || 'U')[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className="admin-user-meta">
                <span className="admin-user-name">{profile?.full_name || profile?.email || 'User'}</span>
                <span className="admin-user-role">{displayRoles || 'No role'}</span>
              </div>
            )}
          </div>
          <button
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="admin-topbar-right">
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-view-site">
              Lihat Website ↗
            </a>
          </div>
        </header>

        <div className="admin-content">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
}
