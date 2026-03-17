'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Restaurante } from '@/lib/types';
import { useToast } from './Toast';
import ImageUploader from './ImageUploader';

// ── Styles ──
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

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = 'var(--color-accent)';
};
const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = '#1A1A1A';
};

// ── Empty form data ──
const emptyForm = {
  nombre: '',
  descripcion: '',
  ciudad: '',
  tipo_cocina: '',
  capacidad_max: 0,
  foto_url: '',
  orden: 0,
  activo: true,
};

export default function RestaurantesAdmin() {
  const { showToast } = useToast();
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Restaurante | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Restaurante | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ──
  const fetchRestaurantes = async () => {
    try {
      const res = await fetch('/api/restaurantes');
      if (res.ok) {
        const data = await res.json();
        setRestaurantes(data);
      }
    } catch {
      showToast('Error al cargar restaurantes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Open modal ──
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (r: Restaurante) => {
    setEditing(r);
    setForm({
      nombre: r.nombre,
      descripcion: r.descripcion,
      ciudad: r.ciudad,
      tipo_cocina: r.tipo_cocina,
      capacidad_max: r.capacidad_max,
      foto_url: r.foto_url,
      orden: r.orden,
      activo: r.activo,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  // ── Submit ──
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editing) {
        const res = await fetch('/api/restaurantes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...form }),
        });
        if (res.ok) {
          showToast('Restaurante actualizado');
          closeModal();
          fetchRestaurantes();
        } else {
          showToast('Error al actualizar', 'error');
        }
      } else {
        const res = await fetch('/api/restaurantes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          showToast('Restaurante creado correctamente');
          closeModal();
          fetchRestaurantes();
        } else {
          showToast('Error al crear', 'error');
        }
      }
    } catch {
      showToast('Error de conexión', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle ──
  const handleToggle = async (r: Restaurante) => {
    const newActivo = !r.activo;
    setRestaurantes((prev) =>
      prev.map((item) => (item.id === r.id ? { ...item, activo: newActivo } : item))
    );

    try {
      const res = await fetch('/api/restaurantes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: r.id, activo: newActivo }),
      });
      if (res.ok) {
        showToast('Actualizado');
      } else {
        setRestaurantes((prev) =>
          prev.map((item) => (item.id === r.id ? { ...item, activo: r.activo } : item))
        );
        showToast('Error al actualizar', 'error');
      }
    } catch {
      setRestaurantes((prev) =>
        prev.map((item) => (item.id === r.id ? { ...item, activo: r.activo } : item))
      );
      showToast('Error de conexión', 'error');
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch('/api/restaurantes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (res.ok) {
        showToast('Restaurante eliminado');
        setDeleteTarget(null);
        fetchRestaurantes();
      } else {
        showToast('Error al eliminar', 'error');
      }
    } catch {
      showToast('Error de conexión', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // ── Skeleton ──
  if (loading) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ width: '180px', height: '40px', backgroundColor: '#0D0D0D', borderRadius: '4px' }} />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#0D0D0D',
                borderRadius: '8px',
                height: '340px',
                animation: 'pulse 1s ease-in-out infinite alternate',
              }}
            />
          ))}
        </div>
        <style>{`@keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Header action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button
          onClick={openCreate}
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#050505',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontWeight: 500,
            fontSize: '14px',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
        >
          + Nuevo Restaurante
        </button>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {restaurantes.map((r) => (
          <div
            key={r.id}
            style={{
              backgroundColor: '#0D0D0D',
              border: '1px solid #1A1A1A',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {/* Photo */}
            <div style={{ position: 'relative', aspectRatio: '16/9' }}>
              {r.foto_url ? (
                <img
                  src={r.foto_url}
                  alt={r.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#141414',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: '13px',
                  }}
                >
                  Sin foto
                </div>
              )}
              {/* Badge */}
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: '12px',
                  backgroundColor: r.activo ? 'rgba(200,169,110,0.15)' : 'rgba(255,255,255,0.05)',
                  color: r.activo ? 'var(--color-accent)' : 'var(--color-text-muted)',
                }}
              >
                {r.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {/* Info */}
            <div style={{ padding: '20px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#F5F5F3',
                }}
              >
                {r.nombre}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                  marginTop: '4px',
                }}
              >
                {r.ciudad}
              </div>
              {r.tipo_cocina && (
                <div
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    marginTop: '4px',
                  }}
                >
                  {r.tipo_cocina}
                </div>
              )}
              {r.capacidad_max > 0 && (
                <div
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    marginTop: '2px',
                  }}
                >
                  Hasta {r.capacidad_max} personas
                </div>
              )}

              {/* Separator */}
              <div style={{ height: '1px', backgroundColor: '#1A1A1A', margin: '16px 0' }} />

              {/* Actions */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <ActionButton
                  label={r.activo ? 'Desactivar' : 'Activar'}
                  color={r.activo ? 'var(--color-text-secondary)' : 'var(--color-accent)'}
                  hoverColor="#F5F5F3"
                  onClick={() => handleToggle(r)}
                />
                <ActionButton
                  label="Editar"
                  color="var(--color-text-secondary)"
                  hoverColor="#F5F5F3"
                  onClick={() => openEdit(r)}
                />
                <ActionButton
                  label="Eliminar"
                  color="var(--color-text-muted)"
                  hoverColor="#E05555"
                  onClick={() => setDeleteTarget(r)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Create / Edit Modal ── */}
      {modalOpen && (
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
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#0D0D0D',
              border: '1px solid #1A1A1A',
              borderRadius: '8px',
              padding: '40px',
              maxWidth: '560px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
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

            <h2
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: '20px',
                color: '#F5F5F3',
                margin: '0 0 32px 0',
              }}
            >
              {editing ? 'Editar Restaurante' : 'Nuevo Restaurante'}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Nombre */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Nombre *</label>
                <input
                  required
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej. El Pulpo Negro"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Descripción */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Descripción *</label>
                <textarea
                  required
                  rows={4}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Descripción breve del restaurante..."
                  style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Ciudad */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Ciudad *</label>
                <input
                  required
                  type="text"
                  value={form.ciudad}
                  onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                  placeholder="Ej. Cuautitlán Izcalli, Edo. Méx."
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Tipo de cocina */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Tipo de Cocina</label>
                <input
                  type="text"
                  value={form.tipo_cocina}
                  onChange={(e) => setForm({ ...form, tipo_cocina: e.target.value })}
                  placeholder="Ej. Mariscos y cocina de autor"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Capacidad */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Capacidad Máxima</label>
                <input
                  type="number"
                  min={1}
                  value={form.capacidad_max || ''}
                  onChange={(e) => setForm({ ...form, capacidad_max: parseInt(e.target.value) || 0 })}
                  placeholder="Ej. 40"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Foto */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Foto</label>
                <ImageUploader
                  value={form.foto_url}
                  onChange={(url) => setForm({ ...form, foto_url: url })}
                />
              </div>

              {/* Orden */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Orden</label>
                <input
                  type="number"
                  min={1}
                  value={form.orden || ''}
                  onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) || 0 })}
                  placeholder="Ej. 1"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <div
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    marginTop: '4px',
                  }}
                >
                  Define el orden en el carrusel
                </div>
              </div>

              {/* Activo toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <label
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: '14px',
                    color: '#F5F5F3',
                  }}
                >
                  Visible en la landing
                </label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, activo: !form.activo })}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: form.activo ? 'var(--color-accent)' : '#1A1A1A',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      position: 'absolute',
                      top: '3px',
                      left: form.activo ? '23px' : '3px',
                      transition: 'left 0.2s',
                    }}
                  />
                </button>
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '32px',
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #1A1A1A',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: '14px',
                    padding: '10px 24px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#F5F5F3';
                    e.currentTarget.style.color = '#F5F5F3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1A1A1A';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: '#050505',
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    padding: '10px 24px',
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
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteTarget && (
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
          onClick={() => setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#0D0D0D',
              border: '1px solid #1A1A1A',
              borderRadius: '8px',
              padding: '40px',
              maxWidth: '420px',
              width: '90%',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                color: '#F5F5F3',
                margin: '0 0 8px 0',
              }}
            >
              ¿Eliminar {deleteTarget.nombre}?
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                margin: '0 0 32px 0',
              }}
            >
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #1A1A1A',
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: '14px',
                  padding: '10px 24px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#F5F5F3';
                  e.currentTarget.style.color = '#F5F5F3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1A1A1A';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  backgroundColor: '#E05555',
                  color: '#fff',
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  padding: '10px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Action button sub-component ──
function ActionButton({
  label,
  color,
  hoverColor,
  onClick,
}: {
  label: string;
  color: string;
  hoverColor: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        fontFamily: 'var(--font-dm-sans), sans-serif',
        fontSize: '13px',
        color,
        cursor: 'pointer',
        padding: '4px 8px',
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
      onMouseLeave={(e) => (e.currentTarget.style.color = color)}
    >
      {label}
    </button>
  );
}
