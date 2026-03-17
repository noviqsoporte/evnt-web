'use client';

import { useState, FormEvent } from 'react';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        setError('Contraseña incorrecta');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#050505',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#0D0D0D',
          border: '1px solid #1A1A1A',
          borderRadius: '8px',
          padding: '48px',
          maxWidth: '400px',
          width: '100%',
          margin: '0 16px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 700,
            fontSize: '28px',
            marginBottom: '8px',
          }}
        >
          <span style={{ color: 'var(--color-accent)' }}>[</span>
          <span style={{ color: '#F5F5F3' }}>EVNT</span>
          <span style={{ color: 'var(--color-accent)' }}>]</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.05em',
            marginBottom: '40px',
          }}
        >
          Panel de administración
        </div>

        {/* Label */}
        <label
          htmlFor="admin-password"
          style={{
            display: 'block',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.1em',
            marginBottom: '8px',
          }}
        >
          Contraseña
        </label>

        {/* Input */}
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: '#111111',
            border: '1px solid #1A1A1A',
            borderRadius: '4px',
            padding: '14px 16px',
            color: '#F5F5F3',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '15px',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box',
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = 'var(--color-accent)')
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = '#1A1A1A')
          }
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: loading
              ? 'var(--color-accent)'
              : 'var(--color-accent)',
            color: '#050505',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontWeight: 500,
            fontSize: '15px',
            padding: '14px',
            borderRadius: '4px',
            border: 'none',
            marginTop: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background-color 0.2s, opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!loading)
              e.currentTarget.style.backgroundColor =
                'var(--color-accent-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              'var(--color-accent)';
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        {/* Error */}
        {error && (
          <div
            style={{
              color: '#E05555',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '13px',
              marginTop: '12px',
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease-in',
            }}
          >
            {error}
          </div>
        )}

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </form>
    </div>
  );
}
