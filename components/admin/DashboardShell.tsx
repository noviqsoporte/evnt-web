'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from './Sidebar';
import { ToastProvider } from './Toast';
import RestaurantesAdmin from './RestaurantesAdmin';
import ConfiguracionAdmin from './ConfiguracionAdmin';
import EventosAdmin from './EventosAdmin';

const tabTitles: Record<string, string> = {
  restaurantes: 'Restaurantes',
  configuracion: 'Configuración',
  eventos: 'Eventos',
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'restaurantes';
  const title = tabTitles[activeTab] || 'Restaurantes';

  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main
        style={{
          marginLeft: '240px',
          flex: 1,
          minHeight: '100vh',
          backgroundColor: '#050505',
          padding: '48px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 700,
              fontSize: '28px',
              color: '#F5F5F3',
              margin: 0,
            }}
          >
            {title}
          </h1>
          <span
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              textTransform: 'capitalize',
            }}
          >
            {today}
          </span>
        </div>

        {/* Tab Content */}
        {activeTab === 'restaurantes' && <RestaurantesAdmin />}
        {activeTab === 'configuracion' && <ConfiguracionAdmin />}
        {activeTab === 'eventos' && <EventosAdmin />}
      </main>
    </div>
  );
}

export default function DashboardShell() {
  return (
    <ToastProvider>
      <Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              backgroundColor: '#050505',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-dm-sans), sans-serif',
            }}
          >
            Cargando...
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </ToastProvider>
  );
}
