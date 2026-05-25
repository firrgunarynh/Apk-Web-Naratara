import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsAPI } from '../services/api';

const FALLBACK = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    newsAPI.getById(id)
      .then(r => setNews(r.data.data))
      .catch(() => setError('Berita tidak ditemukan.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: 60 }}>😕</div>
      <h2 style={{ margin: '16px 0 8px' }}>{error}</h2>
      <button className="btn btn-primary" onClick={() => navigate('/')}>← Kembali ke Beranda</button>
    </div>
  );

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <article className="news-detail">
      {/* Back */}
      <button className="btn btn-secondary btn-sm" style={{ marginBottom: 24 }} onClick={() => navigate(-1)}>
        ← Kembali
      </button>

      {/* Category & Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {news.kategori && (
          <span className="badge" style={{ background: `${news.kategori_warna}22`, color: news.kategori_warna }}>
            {news.kategori}
          </span>
        )}
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>📅 {formatDate(news.created_at)}</span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>✍️ {news.penulis}</span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>👁 {news.views} pembaca</span>
      </div>

      {/* Title */}
      <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 24 }}>
        {news.judul}
      </h1>

      {/* Ringkasan */}
      {news.ringkasan && (
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent-blue)', paddingLeft: 16, marginBottom: 28, fontStyle: 'italic' }}>
          {news.ringkasan}
        </p>
      )}

      {/* Thumbnail */}
      <img
        src={news.thumbnail_url || FALLBACK}
        alt={news.judul}
        className="news-detail-img"
        onError={(e) => { e.target.src = FALLBACK; }}
      />

      {/* Konten */}
      <div className="news-detail-content"
        dangerouslySetInnerHTML={{ __html: news.konten }} />

      {/* Footer */}
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Terakhir diperbarui: {formatDate(news.updated_at)}
        </span>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>← Semua Berita</button>
      </div>
    </article>
  );
}
