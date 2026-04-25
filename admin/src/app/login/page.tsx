'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('locksy_token', data.access_token);
        router.push('/');
      } else {
        setError(data.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setError('Server bilan bog\'lanishda xatolik');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#0a0e17', 
      fontFamily: 'Inter, sans-serif' 
    }}>
      <div style={{ 
        width: 400, 
        padding: 40, 
        background: '#131a28', 
        borderRadius: 24, 
        border: '1px solid #1e2d45',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ 
            fontSize: 32, 
            fontWeight: 800, 
            color: '#00e676', 
            letterSpacing: 2,
            marginBottom: 8
          }}>LOCKSY X</div>
          <div style={{ color: '#64748b', fontSize: 14 }}>Boshqaruv paneliga kirish</div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>ADMIN PAROL</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                background: '#0d1424', 
                border: '1px solid #1e2d45', 
                borderRadius: 12, 
                color: '#fff',
                fontSize: 16,
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          {error && <div style={{ color: '#ef5350', fontSize: 13, marginBottom: 20, textAlign: 'center' }}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: '#00e676', 
              color: '#000', 
              border: 'none', 
              borderRadius: 12, 
              fontSize: 16, 
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Kirilmoqda...' : 'Tizimga kirish'}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: 'center', color: '#64748b', fontSize: 12 }}>
          © 2026 Locksy X Security. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </div>
  );
}
