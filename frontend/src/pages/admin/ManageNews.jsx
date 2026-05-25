import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import NewsForm from '../../components/NewsForm';
import { newsAPI } from '../../services/api';

export default function ManageNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const res = await newsAPI.getAll(params);
      setNews(res.data.data);
      setPagination(res.data.pagination);
    } catch { setNews([]); }
    finally { setLoading(false); }
  }, [page, search, filterStatus]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await newsAPI.create(form);
      showToast('✅ Berita berhasil ditambahkan!');
      setModal(null);
      fetchNews();
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Gagal menyimpan berita'));
    } finally { setSaving(false); }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await newsAPI.update(selected.id, form);
      showToast('✅ Berita berhasil diperbarui!');
      setModal(null); setSelected(null);
      fetchNews();
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Gagal memperbarui berita'));
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await newsAPI.delete(deleteId);
      showToast('✅ Berita berhasil dihapus!');
      setDeleteId(null);
      fetchNews();
    } catch { showToast('❌ Gagal menghapus berita'); }
  };

  const openEdit = (item) => { setSelected(item); setModal('edit'); };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 999, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 20px', fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'modalIn 0.2s ease' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="admin-page-title">📰 Kelola Berita</h1>
          <p className="admin-page-sub">Tambah, edit, dan hapus berita portal</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setSelected(null); setModal('create'); }}>
          ➕ Tambah Berita
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input className="form-input" style={{ maxWidth: 280 }} placeholder="🔍 Cari berita..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <select className="form-input form-select" style={{ maxWidth: 160 }}
          value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
          <option value="">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrap">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Status</th>
                <th>Views</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {news.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Tidak ada berita ditemukan</td></tr>
              ) : news.map(n => (
                <tr key={n.id}>
                  <td>
                    <img src={n.thumbnail_url || 'https://via.placeholder.com/60x40'} alt=""
                      style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 6 }}
                      onError={e => e.target.style.display = 'none'} />
                  </td>
                  <td style={{ maxWidth: 220 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.judul}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>oleh {n.penulis}</div>
                  </td>
                  <td>
                    {n.kategori ? <span className="badge" style={{ background: `${n.kategori_warna}22`, color: n.kategori_warna }}>{n.kategori}</span> : '—'}
                  </td>
                  <td>
                    <span className={`badge ${n.status === 'published' ? 'status-published' : 'status-draft'}`}>
                      {n.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--accent-cyan)' }}>{n.views}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatDate(n.created_at)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(n)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(n.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination" style={{ justifyContent: 'flex-start', marginTop: 20 }}>
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="page-btn" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}

      {/* Modal Form */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'create' ? '➕ Tambah Berita Baru' : '✏️ Edit Berita'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <NewsForm
                initial={modal === 'edit' ? selected : null}
                onSubmit={modal === 'create' ? handleCreate : handleUpdate}
                onCancel={() => setModal(null)}
                loading={saving}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2 className="modal-title">🗑️ Hapus Berita</h2>
              <button className="modal-close" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Apakah kamu yakin ingin menghapus berita ini? Tindakan ini <strong style={{ color: 'var(--accent-red)' }}>tidak bisa dibatalkan</strong>.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Batal</button>
                <button className="btn btn-danger" onClick={handleDelete}>Ya, Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
