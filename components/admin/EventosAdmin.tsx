'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Evento } from '@/lib/types';
import { useToast } from './Toast';

const ESTADOS = ['Nuevo', 'En proceso', 'Confirmado', 'Cancelado'] as const;

const estadoColors: Record<string, { bg: string; text: string }> = {
  Nuevo: { bg: 'rgba(200,169,110,0.1)', text: 'var(--color-accent)' },
  'En proceso': { bg: 'rgba(59,130,246,0.1)', text: '#60A5FA' },
  Confirmado: { bg: 'rgba(34,197,94,0.1)', text: '#4ADE80' },
  Cancelado: { bg: 'rgba(224,85,85,0.1)', text: '#E05555' },
};

function formatFecha(fecha: string): string {
  if (!fecha) return '—';
  try {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return fecha;
  }
}

export default function EventosAdmin() {
  const { showToast } = useToast();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>('Todos');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [notasModal, setNotasModal] = useState<Evento | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchEventos = useCallback(async () => {
    try {
      const res = await fetch('/api/eventos');
      if (res.ok) {
        const data = await res.json();
        setEventos(data);
      }
    } catch {
      showToast('Error al cargar eventos', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleChangeEstado = async (evento: Evento, nuevoEstado: string) => {
    setOpenDropdown(null);
    // Optimistic update
    setEventos((prev) =>
      prev.map((ev) => (ev.id === evento.id ? { ...ev, estado: nuevoEstado } : ev))
    );

    try {
      const res = await fetch('/api/eventos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: evento.id, estado: nuevoEstado }),
      });
      if (res.ok) {
        showToast('Estado actualizado');
      } else {
        setEventos((prev) =>
          prev.map((ev) => (ev.id === evento.id ? { ...ev, estado: evento.estado } : ev))
        );
        showToast('Error al actualizar', 'error');
      }
    } catch {
      setEventos((prev) =>
        prev.map((ev) => (ev.id === evento.id ? { ...ev, estado: evento.estado } : ev))
      );
      showToast('Error de conexión', 'error');
    }
  };

  const filtered = filtro === 'Todos' ? eventos : eventos.filter((ev) => ev.estado === filtro);

  // Stats
  const countNuevo = eventos.filter((ev) => ev.estado === 'Nuevo').length;
  const countEnProceso = eventos.filter((ev) => ev.estado === 'En proceso').length;
  const now = new Date();
  const countConfirmadosMes = eventos.filter((ev) => {
    if (ev.estado !== 'Confirmado') return false;
    try {
      const d = new Date(ev.fecha_entrada || ev.fecha_evento);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    } catch {
      return false;
    }
  }).length;

  const pills = ['Todos', ...ESTADOS];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '100px',
                backgroundColor: '#0D0D0D',
                borderRadius: '8px',
                animation: 'pulse 1s ease-in-out infinite alternate',
              }}
            />
          ))}
        </div>
        <div
          style={{
            height: '300px',
            backgroundColor: '#0D0D0D',
            borderRadius: '8px',
            animation: 'pulse 1s ease-in-out infinite alternate',
          }}
        />
        <style>{`@keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {pills.map((p) => (
          <button
            key={p}
            onClick={() => setFiltro(p)}
            style={{
              padding: '6px 16px',
              borderRadius: '4px',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '13px',
              border: filtro === p ? 'none' : '1px solid #1A1A1A',
              backgroundColor: filtro === p ? 'var(--color-accent)' : '#141414',
              color: filtro === p ? '#050505' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (filtro !== p) e.currentTarget.style.borderColor = '#F5F5F3';
            }}
            onMouseLeave={(e) => {
              if (filtro !== p) e.currentTarget.style.borderColor = '#1A1A1A';
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Eventos nuevos" count={countNuevo} color="var(--color-accent)" />
        <StatCard label="En proceso" count={countEnProceso} color="#60A5FA" />
        <StatCard label="Confirmados este mes" count={countConfirmadosMes} color="#4ADE80" />
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: '#0D0D0D',
          border: '1px solid #1A1A1A',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '64px 20px',
              gap: '12px',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="3" width="14" height="13" rx="1.5" stroke="var(--color-text-muted)" strokeWidth="1.5" />
              <path d="M2 7H16" stroke="var(--color-text-muted)" strokeWidth="1.5" />
              <path d="M6 1V4M12 1V4" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '16px',
                color: 'var(--color-text-secondary)',
              }}
            >
              No hay eventos aún
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '14px',
                color: 'var(--color-text-muted)',
                textAlign: 'center',
              }}
            >
              {filtro === 'Todos'
                ? 'Los eventos llegarán automáticamente desde WhatsApp vía n8n'
                : 'No hay eventos con este estado'}
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: '#111111',
                    borderBottom: '1px solid #1A1A1A',
                  }}
                >
                  {['EMPRESA', 'CONTACTO', 'PERSONAS', 'FECHA', 'PRESUPUESTO', 'ESTADO', 'ACCIONES'].map(
                    (col) => (
                      <th
                        key={col}
                        style={{
                          padding: '12px 20px',
                          textAlign: 'left',
                          fontFamily: 'var(--font-dm-sans), sans-serif',
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                          letterSpacing: '0.1em',
                          fontWeight: 400,
                        }}
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((ev, idx) => (
                  <tr
                    key={ev.id}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? '1px solid #111111' : 'none',
                      transition: 'background-color 0.1s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* EMPRESA */}
                    <td style={{ padding: '16px 20px' }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-dm-sans), sans-serif',
                          fontSize: '14px',
                          color: '#F5F5F3',
                          fontWeight: 700,
                        }}
                      >
                        {ev.nombre_empresa || '—'}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-dm-sans), sans-serif',
                          fontSize: '12px',
                          color: 'var(--color-text-muted)',
                          marginTop: '2px',
                        }}
                      >
                        {ev.telefono || ''}
                      </div>
                    </td>

                    {/* CONTACTO */}
                    <td
                      style={{
                        padding: '16px 20px',
                        fontFamily: 'var(--font-dm-sans), sans-serif',
                        fontSize: '14px',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {ev.contacto || '—'}
                    </td>

                    {/* PERSONAS */}
                    <td
                      style={{
                        padding: '16px 20px',
                        fontFamily: 'var(--font-dm-sans), sans-serif',
                        fontSize: '14px',
                        color: '#F5F5F3',
                        textAlign: 'center',
                      }}
                    >
                      {ev.personas ? `${ev.personas} personas` : '—'}
                    </td>

                    {/* FECHA */}
                    <td
                      style={{
                        padding: '16px 20px',
                        fontFamily: 'var(--font-dm-sans), sans-serif',
                        fontSize: '14px',
                        color: ev.fecha_evento ? '#F5F5F3' : 'var(--color-text-muted)',
                      }}
                    >
                      {formatFecha(ev.fecha_evento)}
                    </td>

                    {/* PRESUPUESTO */}
                    <td
                      style={{
                        padding: '16px 20px',
                        fontFamily: 'var(--font-dm-sans), sans-serif',
                        fontSize: '14px',
                        color: ev.presupuesto ? '#F5F5F3' : 'var(--color-text-muted)',
                      }}
                    >
                      {ev.presupuesto || '—'}
                    </td>

                    {/* ESTADO */}
                    <td style={{ padding: '16px 20px', position: 'relative' }}>
                      <div ref={openDropdown === ev.id ? dropdownRef : null}>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === ev.id ? null : ev.id)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontFamily: 'var(--font-dm-sans), sans-serif',
                            fontSize: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: (estadoColors[ev.estado] || estadoColors.Nuevo).bg,
                            color: (estadoColors[ev.estado] || estadoColors.Nuevo).text,
                          }}
                        >
                          {ev.estado || 'Nuevo'}
                        </button>

                        {openDropdown === ev.id && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: '20px',
                              backgroundColor: '#141414',
                              border: '1px solid #1A1A1A',
                              borderRadius: '6px',
                              padding: '4px',
                              zIndex: 50,
                              minWidth: '140px',
                            }}
                          >
                            {ESTADOS.map((estado) => (
                              <button
                                key={estado}
                                onClick={() => handleChangeEstado(ev, estado)}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '8px 12px',
                                  textAlign: 'left',
                                  fontFamily: 'var(--font-dm-sans), sans-serif',
                                  fontSize: '13px',
                                  color: estadoColors[estado].text,
                                  background: 'none',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.1s',
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor = '#1A1A1A')
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor = 'transparent')
                                }
                              >
                                {estado}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ACCIONES */}
                    <td style={{ padding: '16px 20px' }}>
                      <button
                        onClick={() => setNotasModal(ev)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontFamily: 'var(--font-dm-sans), sans-serif',
                          fontSize: '13px',
                          color: 'var(--color-text-secondary)',
                          cursor: 'pointer',
                          transition: 'color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F3')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = 'var(--color-text-secondary)')
                        }
                      >
                        Ver notas
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {notasModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setNotasModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#0D0D0D',
              border: '1px solid #1A1A1A',
              borderRadius: '8px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setNotasModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '20px',
                cursor: 'pointer',
                lineHeight: 1,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F3')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            >
              ✕
            </button>
            <h3
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                color: '#F5F5F3',
                margin: '0 0 20px 0',
              }}
            >
              {notasModal.nombre_empresa}
            </h3>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '14px',
                color: notasModal.notas ? '#F5F5F3' : 'var(--color-text-muted)',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              {notasModal.notas || 'Sin notas'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stat Card ──
function StatCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div
      style={{
        backgroundColor: '#0D0D0D',
        border: '1px solid #1A1A1A',
        borderRadius: '8px',
        padding: '20px 24px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontWeight: 700,
          fontSize: '32px',
          color,
        }}
      >
        {count}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--color-text-muted)',
          marginTop: '4px',
        }}
      >
        {label}
      </div>
    </div>
  );
}
