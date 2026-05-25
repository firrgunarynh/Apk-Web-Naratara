import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Password dan konfirmasi password tidak cocok!');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
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
        <h1 className="auth-title">Buat Akun Baru</h1>
        <p className="auth-sub">Bergabung dan nikmati berita terkini setiap hari</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input name="username" value={form.username} onChange={handleChange}
              className="form-input" placeholder="Nama pengguna" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="form-input" placeholder="email@contoh.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              className="form-input" placeholder="Min. 6 karakter" required />
          </div>
          <div className="form-group">
            <label className="form-label">Konfirmasi Password</label>
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange}
              className="form-input" placeholder="Ulangi password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner spinner-sm" /> Mendaftar...</> : '✨ Daftar Sekarang'}
          </button>
        </form>

        <p className="auth-switch" style={{ marginTop: 20 }}>Sudah punya akun? <Link to="/login">Masuk di sini</Link></p>
      </div>
    </div>
  );
}
