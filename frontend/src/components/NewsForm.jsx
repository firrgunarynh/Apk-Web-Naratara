import { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';

const EMPTY = { judul: '', konten: '', ringkasan: '', kategori_id: '', thumbnail_url: '', status: 'draft' };

export default function NewsForm({ onSubmit, onCancel, initial = null, loading = false }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [kategoriList, setKategoriList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    newsAPI.getKategori().then(r => setKategoriList(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setForm(initial || EMPTY);
  }, [initial]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.judul.trim() || !form.konten.trim()) {
      setError('Judul dan konten wajib diisi!');
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">Judul Berita *</label>
        <input name="judul" value={form.judul} onChange={handleChange}
          className="form-input" placeholder="Masukkan judul berita..." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Kategori</label>
          <select name="kategori_id" value={form.kategori_id} onChange={handleChange}
            className="form-input form-select">
            <option value="">-- Pilih Kategori --</option>
            {kategoriList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select name="status" value={form.status} onChange={handleChange}
            className="form-input form-select">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">URL Thumbnail</label>
        <input name="thumbnail_url" value={form.thumbnail_url} onChange={handleChange}
          className="form-input" placeholder="https://..." />
      </div>

      <div className="form-group">
        <label className="form-label">Ringkasan</label>
        <textarea name="ringkasan" value={form.ringkasan} onChange={handleChange}
          className="form-input form-textarea" style={{ minHeight: 80 }}
          placeholder="Ringkasan singkat berita..." />
      </div>

      <div className="form-group">
        <label className="form-label">Konten Berita *</label>
        <textarea name="konten" value={form.konten} onChange={handleChange}
          className="form-input form-textarea" style={{ minHeight: 240 }}
          placeholder="Tulis konten berita di sini..." />
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Batal</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><span className="spinner spinner-sm" /> Menyimpan...</> : '💾 Simpan Berita'}
        </button>
      </div>
    </form>
  );
}
