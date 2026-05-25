import { useState, useEffect, useCallback } from 'react';
import { newsAPI } from '../services/api';
import NewsCard from '../components/NewsCard';

export default function Home() {
  const [news, setNews] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeKat, setActiveKat] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (activeKat) params.kategori = activeKat;
      const res = await newsAPI.getAll(params);
      setNews(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeKat]);

  useEffect(() => { newsAPI.getKategori().then(r => setKategori(r.data.data)).catch(() => {}); }, []);
  useEffect(() => { fetchNews(); }, [fetchNews]);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleKat = (nama) => { setActiveKat(prev => prev === nama ? '' : nama); setPage(1); };

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Berita <span className="gradient-text">Terkini</span> &<br />Terpercaya
          </h1>
          <p className="hero-subtitle">Temukan informasi terbaru seputar teknologi, politik, olahraga, dan banyak lagi disajikan dengan cepat dan akurat.</p>
        </div>
      </section>

      {/* ── Filter & Search ── */}
      <div className="container">
        <div className="filter-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input className="form-input search-input" placeholder="Cari berita..."
              value={search} onChange={handleSearch} />
          </div>
          <button className={`filter-chip ${activeKat === '' ? 'active' : ''}`} onClick={() => handleKat('')}>
            Semua
          </button>
          {kategori.map(k => (
            <button key={k.id} className={`filter-chip ${activeKat === k.nama ? 'active' : ''}`}
              onClick={() => handleKat(k.nama)}>
              {k.nama}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48 }}>📭</div>
            <p style={{ marginTop: 16, fontSize: 16 }}>Tidak ada berita ditemukan.</p>
          </div>
        ) : (
          <div className="news-grid">
            {news.map(n => <NewsCard key={n.id} news={n} />)}
          </div>
        )}

        {/* ── Pagination ── */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>© 2026 NaraTara. Portal Berita Terpercaya Indonesia.</p>
      </footer>
    </div>
  );
}
