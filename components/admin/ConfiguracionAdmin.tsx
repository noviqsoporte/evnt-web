'use client';

import { useState, useEffect, useCallback } from 'react';
import { Configuracion } from '@/lib/types';
import { useToast } from './Toast';

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-dm-sans), sans-serif',
  fontSize: '12px',
  color: 'var(--color-text-muted)',
  letterSpacing: '0.08em',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#111111',
  border: '1px solid #1A1A1A',
  borderRadius: '4px',
  padding: '12px 16px',
  color: '#F5F5F3',
  fontFamily: 'var(--font-dm-sans), sans-serif',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box' as const,
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = 'var(--color-accent)';
};
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = '#1A1A1A';
};

const helperStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans), sans-serif',
  fontSize: '12px',
  color: 'var(--color-text-muted)',
  marginTop: '4px',
};

export default function ConfiguracionAdmin() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [original, setOriginal] = useState<Configuracion | null>(null);
  const [form, setForm] = useState<Configuracion>({
    whatsapp: '',
    tiktok_url: '',
    instagram_url: '',
    tagline: '',
    email: '',
  });

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/configuracion');
      if (res.ok) {
        const data = await res.json();
        setForm(data);
        setOriginal(data);
      }
    } catch {
      showToast('Error al cargar configuración', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const hasChanges =
    original &&
    (form.whatsapp !== original.whatsapp ||
      form.tiktok_url !== original.tiktok_url ||
      form.instagram_url !== original.instagram_url ||
      form.tagline !== original.tagline ||
      form.email !== original.email);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/configuracion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setOriginal(data);
        setForm(data);
        showToast('Configuración guardada');
      } else {
        showToast('Error al guardar. Intenta de nuevo.', 'error');
      }
    } catch {
      showToast('Error de conexión', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#0D0D0D',
              borderRadius: '8px',
              height: i === 1 ? '400px' : '180px',
              animation: 'pulse 1s ease-in-out infinite alternate',
            }}
          />
        ))}
        <style>{`@keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Section A — Contacto y Redes */}
        <div
          style={{
            backgroundColor: '#0D0D0D',
            border: '1px solid #1A1A1A',
            borderRadius: '8px',
            padding: '32px',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: '#F5F5F3',
              margin: '0 0 24px 0',
            }}
          >
            Contacto y Redes
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* WhatsApp */}
            <div>
              <label style={labelStyle}>NÚMERO DE WHATSAPP</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="5215512345678"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <div style={helperStyle}>
                Solo números, sin +, sin espacios. Ej: 5215512345678
              </div>
            </div>

            {/* TikTok */}
            <div>
              <label style={labelStyle}>PERFIL DE TIKTOK</label>
              <input
                type="url"
                value={form.tiktok_url}
                onChange={(e) => setForm({ ...form, tiktok_url: e.target.value })}
                placeholder="https://www.tiktok.com/@evnt.mx"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Instagram */}
            <div>
              <label style={labelStyle}>PERFIL DE INSTAGRAM</label>
              <input
                type="url"
                value={form.instagram_url}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                placeholder="https://www.instagram.com/evnt.mx"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>EMAIL DE CONTACTO</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="hola@evnt.mx"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Tagline */}
            <div>
              <label style={labelStyle}>TAGLINE DEL HERO</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Tu próximo evento de equipo, resuelto."
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <div style={helperStyle}>
                Frase que aparece en la sección debajo del logo en la landing
              </div>
            </div>
          </div>
        </div>

        {/* Section B — Vista previa */}
        <div
          style={{
            backgroundColor: '#0D0D0D',
            border: '1px solid #1A1A1A',
            borderRadius: '8px',
            padding: '32px',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: '#F5F5F3',
              margin: '0 0 8px 0',
            }}
          >
            Vista previa
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              margin: '0 0 24px 0',
            }}
          >
            Así se verán los botones flotantes con las URLs actuales
          </p>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            {/* TikTok preview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#141414',
                  border: '1px solid #1A1A1A',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M14.5 1.5H12V13.5C12 14.88 10.88 16 9.5 16C8.12 16 7 14.88 7 13.5C7 12.12 8.12 11 9.5 11C9.67 11 9.83 11.02 10 11.05V8.53C9.83 8.51 9.67 8.5 9.5 8.5C6.74 8.5 4.5 10.74 4.5 13.5C4.5 16.26 6.74 18.5 9.5 18.5C12.26 18.5 14.5 16.26 14.5 13.5V7.21C15.59 8.02 16.96 8.5 18.5 8.5V6C16.29 6 14.5 4.21 14.5 2V1.5Z"
                    fill="#F5F5F3"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}
              >
                {form.tiktok_url || 'Sin configurar'}
              </span>
            </div>

            {/* Instagram preview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#141414',
                  border: '1px solid #1A1A1A',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="2" width="16" height="16" rx="4" stroke="#F5F5F3" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="4" stroke="#F5F5F3" strokeWidth="1.5" />
                  <circle cx="14.5" cy="5.5" r="1" fill="#F5F5F3" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}
              >
                {form.instagram_url || 'Sin configurar'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '32px',
        }}
      >
        <div>
          {hasChanges && (
            <span
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '13px',
                color: '#E0A855',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#E0A855',
                  display: 'inline-block',
                }}
              />
              Tienes cambios sin guardar
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#050505',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontWeight: 500,
            fontSize: '14px',
            padding: '12px 28px',
            borderRadius: '4px',
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            transition: 'background-color 0.2s, opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!saving) e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent)';
          }}
        >
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
}
