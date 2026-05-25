import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/berita', icon: '📰', label: 'Kelola Berita' },
  { to: '/admin/users', icon: '👥', label: 'Kelola User' },
  { to: '/', icon: '🌐', label: 'Lihat Website' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div className="user-avatar" style={{ width: 40, height: 40, fontSize: 16 }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.username}</div>
            <div style={{ fontSize: 12, color: 'var(--accent-blue)' }}>Administrator</div>
          </div>
        </div>

        <div className="admin-sidebar-title">Menu</div>
        {links.map(l => (
          <Link key={l.to} to={l.to}
            className={`admin-sidebar-link ${location.pathname === l.to ? 'active' : ''}`}>
            <span>{l.icon}</span> {l.label}
          </Link>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border)', marginTop: 32 }}>
          <button className="btn btn-danger btn-sm btn-full" onClick={logout}>🚪 Keluar</button>
        </div>
      </aside>

      {/* Content */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
