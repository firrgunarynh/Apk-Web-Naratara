import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = () => {
      adminAPI.getStats()
        .then(r => setStats(r.data.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <AdminLayout><div className="loading-center"><div className="spinner" /></div></AdminLayout>;

  const cards = [
    { icon: '[News]', label: 'Total Berita', value: stats?.total_news ?? 0, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { icon: '[User]', label: 'Total User', value: stats?.total_users ?? 0, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    { icon: '[View]', label: 'Total Views', value: (stats?.total_views ?? 0).toLocaleString('id-ID'), color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  ];

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub" style={{ marginBottom: 0 }}>Ringkasan statistik portal berita kamu</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            if (window.confirm('Tarik berita otomatis dari API eksternal?')) {
              adminAPI.fetchExternal().then(r => alert(r.data.message)).catch(() => alert('Gagal menarik berita.'));
            }
          }}
        >
          [+] Fetch Berita Eksternal
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {cards.map(c => (
          <div key={c.label} className="stat-card" style={{ borderColor: `${c.color}33` }}>
            <div className="stat-icon" style={{ background: c.bg }}>
              <span style={{ fontSize: 22 }}>{c.icon}</span>
            </div>
            <div className="stat-value" style={{ color: c.color }}>{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Top Berita */}
      {stats?.popular_news?.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Berita Terpopuler</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Judul</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {stats.popular_news.map((n, i) => (
                  <tr key={n.id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600, maxWidth: 300 }}>{n.title}</td>
                    <td style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>[Views] {n.views.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
