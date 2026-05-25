import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card glass auth-card">
        <div className="auth-logo">
          <div style={{ fontSize: 40 }}>📰</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }} className="gradient-text">NaraTara</div>
        </div>
        <h1 className="auth-title">Selamat Datang!</h1>
        <p className="auth-sub">Masuk untuk melanjutkan membaca berita terkini</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="form-input" placeholder="email@contoh.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              className="form-input" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner spinner-sm" /> Masuk...</> : '🚀 Masuk'}
          </button>
        </form>

        <div className="auth-divider">— atau —</div>
        <p className="auth-switch">Belum punya akun? <Link to="/register">Daftar sekarang</Link></p>
      </div>
    </div>
  );
}
