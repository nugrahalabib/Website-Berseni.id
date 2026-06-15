'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Admin.module.css';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redireksi ke dashboard admin
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Password salah!');
      }
    } catch (err) {
      setError('Koneksi internet bermasalah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={`${styles.loginCard} glass-dark`}>
        <div style={{ 
          backgroundColor: 'var(--color-cream-bg)', 
          padding: '12px 20px', 
          borderRadius: '16px', 
          display: 'inline-block', 
          width: 'fit-content', 
          margin: '0 auto 1.5rem auto',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          border: '1px solid rgba(20, 120, 155, 0.15)'
        }}>
          <img 
            src="/logo.png" 
            alt="Berseni Logo" 
            style={{ height: '54px', width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </div>
        <h1 className={styles.loginTitle}>Admin Portal</h1>


        {error && <div className={styles.loginError}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password Portal</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="Masukkan password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem 0', marginTop: '1rem', backgroundColor: 'var(--color-kunyit)', color: 'var(--color-black)' }}
            disabled={loading}
          >
            {loading ? 'Menghubungkan...' : 'Masuk Portal'}
          </button>
        </form>

        <button
          onClick={() => router.push('/')}
          style={{
            marginTop: '2rem',
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            fontSize: '0.85rem',
            textDecoration: 'underline',
          }}
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
