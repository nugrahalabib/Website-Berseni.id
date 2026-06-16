'use client';

import { useState } from 'react';
import styles from '@/styles/Admin.module.css';

export default function AccountEditor({ showToast }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok!');
      return;
    }

    if (newPassword.length < 4) {
      setError('Password baru minimal 4 karakter!');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      if (res.ok) {
        showToast('Password admin berhasil diubah!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal merubah password.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.editorCard} style={{ maxWidth: '600px' }}>
      <h2 className={styles.editorTitle}>Pengamanan Akun Portal</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '2rem', marginTop: '-1rem' }}>
        Perbarui password akses masuk Admin Portal Berseni secara berkala agar keamanan data website tetap terjaga dengan baik.
      </p>

      {error && (
        <div className={styles.loginError} style={{ margin: '0 0 1.5rem 0', textAlign: 'left' }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className={styles.adminLabel}>Password Lama</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan password saat ini..."
              className={styles.adminInput}
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password baru..."
              className={styles.adminInput}
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Konfirmasi Password Baru</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru..."
              className={styles.adminInput}
              required
            />
          </div>
        </div>

        <div className={styles.formActions} style={{ marginTop: '2.5rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ minWidth: '180px' }}
          >
            {submitting ? 'Memproses...' : 'Ubah Sandi Akses'}
          </button>
        </div>
      </form>
    </div>
  );
}
