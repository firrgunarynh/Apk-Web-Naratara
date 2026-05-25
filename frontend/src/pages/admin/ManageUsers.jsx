import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { authAPI } from '../../services/api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteData, setDeleteData] = useState(null); // { id, username }
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchUsers = () => {
    setLoading(true);
    authAPI.getAllUsers()
      .then(r => setUsers(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (id, newRole) => {
    setUpdatingId(id);
    try {
      await authAPI.updateRole(id, newRole);
      showToast(`✅ Role berhasil diubah menjadi ${newRole}`);
      fetchUsers();
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Gagal mengubah role'));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await authAPI.deleteUser(deleteData.id);
      showToast(`✅ User "${deleteData.username}" berhasil dihapus.`);
      setDeleteData(null);
      fetchUsers();
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Gagal menghapus user'));
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <AdminLayout>
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 999, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 20px', fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'modalIn 0.2s ease' }}>
          {toast}
        </div>
      )}

      <h1 className="admin-page-title">👥 Kelola User</h1>
      <p className="admin-page-sub">Daftar semua pengguna terdaftar</p>

      <div className="table-wrap">
        {loading && users.length === 0 ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Bergabung</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
                        {u.username?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.username}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <span className="badge" style={
                      u.role === 'admin'
                        ? { background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }
                        : { background: 'rgba(59,130,246,0.12)', color: 'var(--accent-blue)' }
                    }>
                      {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(u.created_at)}</td>
                  <td>
                    <div className="table-actions" style={{ flexWrap: 'wrap' }}>
                      {u.role === 'user' ? (
                        <button 
                          className="btn btn-sm btn-primary" 
                          onClick={() => handleUpdateRole(u.id, 'admin')}
                          disabled={updatingId === u.id}
                        >
                          {updatingId === u.id ? '...' : '⬆️ Jadikan Admin'}
                        </button>
                      ) : (
                        <button 
                          className="btn btn-sm btn-secondary" 
                          onClick={() => handleUpdateRole(u.id, 'user')}
                          disabled={updatingId === u.id}
                        >
                          {updatingId === u.id ? '...' : '⬇️ Jadikan User'}
                        </button>
                      )}
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => setDeleteData({ id: u.id, username: u.username })}
                        title="Hapus User"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteData && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2 className="modal-title">🗑️ Hapus User</h2>
              <button className="modal-close" onClick={() => setDeleteData(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Apakah kamu yakin ingin menghapus user <strong>{deleteData.username}</strong>? Semua berita yang ditulis oleh user ini (jika ada) juga akan terhapus. Tindakan ini <strong style={{ color: 'var(--accent-red)' }}>tidak bisa dibatalkan</strong>.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setDeleteData(null)}>Batal</button>
                <button className="btn btn-danger" onClick={handleDeleteUser}>Ya, Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
