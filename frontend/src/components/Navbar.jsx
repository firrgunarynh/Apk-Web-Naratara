import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">📰</div>
          <span className="gradient-text">NaraTara</span>
        </Link>

        {/* Nav Links */}
        <div className="navbar-nav">
          <Link to="/" className={`navbar-link ${isActive('/')}`}>Beranda</Link>

          {isAdmin && (
            <Link to="/admin/dashboard" className={`navbar-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
              ⚙️ Admin
            </Link>
          )}

          {user ? (
            <div className="navbar-user">
              <div className="user-avatar">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{user.username}</span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Keluar
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Masuk</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
