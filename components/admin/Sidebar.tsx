'use client';

import { useSearchParams, useRouter } from 'next/navigation';

const navItems = [
  {
    key: 'restaurantes',
    label: 'Restaurantes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 16V2H16V16H2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 7H16" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 7V16" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    key: 'configuracion',
    label: 'Configuración',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 1V3M9 15V17M1 9H3M15 9H17M3.34 3.34L4.76 4.76M13.24 13.24L14.66 14.66M14.66 3.34L13.24 4.76M4.76 13.24L3.34 14.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'eventos',
    label: 'Eventos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 7H16" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 1V4M12 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'restaurantes';

  const handleNav = (key: string) => {
    router.push(`/admin?tab=${key}`);
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.reload();
  };

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: '240px',
        backgroundColor: '#0D0D0D',
        borderRight: '1px solid #1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
      }}
    >
      {/* Header */}
      <div style={{ padding: '28px 24px' }}>
        <div
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 700,
            fontSize: '20px',
          }}
        >
          <span style={{ color: 'var(--color-accent)' }}>[</span>
          <span style={{ color: '#F5F5F3' }}>EVNT</span>
          <span style={{ color: 'var(--color-accent)' }}>]</span>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.15em',
            marginTop: '4px',
          }}
        >
          Admin
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: '1px', backgroundColor: '#1A1A1A' }} />

      {/* Navigation */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: isActive ? '10px 10px 10px 10px' : '10px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isActive ? '#141414' : 'transparent',
                borderLeft: isActive
                  ? '2px solid var(--color-accent)'
                  : '2px solid transparent',
                color: isActive ? '#F5F5F3' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                marginBottom: '4px',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#141414';
                  e.currentTarget.style.color = '#F5F5F3';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer — Logout */}
      <div style={{ padding: '24px', borderTop: '1px solid #1A1A1A' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'color 0.15s',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#F5F5F3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-muted)';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 1H2.5C1.67 1 1 1.67 1 2.5V11.5C1 12.33 1.67 13 2.5 13H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M9.5 10L13 7L9.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
