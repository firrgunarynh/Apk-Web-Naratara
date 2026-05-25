import { useNavigate } from 'react-router-dom';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80';

export default function NewsCard({ news }) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  const formatViews = (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v;

  return (
    <div className="card news-card" onClick={() => navigate(`/berita/${news.id}`)}>
      <div className="news-card-img-wrap">
        <img
          src={news.thumbnail_url || FALLBACK_IMG}
          alt={news.judul}
          className="news-card-img"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />
      </div>
      <div className="news-card-body">
        {news.kategori && (
          <span className="badge" style={{ background: `${news.kategori_warna}22`, color: news.kategori_warna }}>
            {news.kategori}
          </span>
        )}
        <h3 className="news-card-title">{news.judul}</h3>
        <p className="news-card-excerpt">{news.ringkasan}</p>
        <div className="news-card-meta">
          <span>✍️ {news.penulis}</span>
          <span>📅 {formatDate(news.created_at)}</span>
          <span>👁 {formatViews(news.views)}</span>
        </div>
      </div>
    </div>
  );
}
