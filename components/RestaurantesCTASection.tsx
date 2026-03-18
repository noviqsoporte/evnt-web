'use client';

import { useEffect, useRef, useState } from 'react';

interface RestaurantesCTASectionProps {
  whatsapp: string;
}

interface FormData {
  nombreRestaurante: string;
  nombre: string;
  whatsapp: string;
  ciudad: string;
  capacidad: string;
  mensaje: string;
}

interface FormErrors {
  nombreRestaurante?: string;
  nombre?: string;
  whatsapp?: string;
  ciudad?: string;
}

export default function RestaurantesCTASection({ whatsapp }: RestaurantesCTASectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    nombreRestaurante: '',
    nombre: '',
    whatsapp: '',
    ciudad: '',
    capacidad: '',
    mensaje: '',
  });

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const numeroLimpio = whatsapp.replace(/\+/g, '').replace(/\s/g, '').replace(/-/g, '');

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FormErrors];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nombreRestaurante.trim()) newErrors.nombreRestaurante = 'Campo requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'Campo requerido';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'Campo requerido';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'Campo requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);

    const msg = `Hola, quiero unir mi restaurante a EVNT.

🏠 Restaurante: ${formData.nombreRestaurante}
👤 Nombre: ${formData.nombre}
📱 WhatsApp: ${formData.whatsapp}
📍 Ciudad: ${formData.ciudad}
👥 Capacidad: ${formData.capacidad || 'No especificada'}
💬 Mensaje: ${formData.mensaje || 'Sin mensaje adicional'}`;

    const url = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 600);
  };

  const resetForm = () => {
    setFormData({
      nombreRestaurante: '',
      nombre: '',
      whatsapp: '',
      ciudad: '',
      capacidad: '',
      mensaje: '',
    });
    setErrors({});
    setSubmitted(false);
  };

  const curve = 'cubic-bezier(0.16, 1, 0.3, 1)';

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#111111',
    border: '1px solid #1A1A1A',
    borderRadius: '4px',
    padding: '14px 16px',
    color: '#F5F5F3',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const inputErrorStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: '#E05555',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    letterSpacing: '0.08em',
    marginBottom: '6px',
    display: 'block',
  };

  const valuePoints = [
    {
      number: '$3,000',
      title: 'Setup único',
      description: 'Creamos tu página de catálogo dentro de la plataforma EVNT, optimizada para empresas que buscan espacios.',
    },
    {
      number: '5–12%',
      title: 'Comisión por evento',
      description: 'El porcentaje varía según el tamaño del evento. Solo se cobra después de que el evento se realiza. Sin riesgos.',
    },
    {
      number: '1 mes',
      title: 'Selección premium incluida',
      description: 'Tu restaurante aparece primero en las opciones que presentamos a las empresas durante el primer mes. Sin costo adicional.',
    },
  ];

  return (
    <section
      id="restaurantes-cta"
      ref={sectionRef}
      style={{
        backgroundColor: '#0D0D0D',
        borderTop: '1px solid #1A1A1A',
      }}
    >
      <style jsx>{`
        @keyframes fadeUpResto {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .resto-section-inner {
          padding: 120px 0;
        }
        @media (max-width: 767px) {
          .resto-section-inner {
            padding: 72px 0 !important;
          }
        }
      `}</style>

      <div className="resto-section-inner">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* ——— Header ——— */}
          <div
            className="text-center flex flex-col items-center"
            style={{
              maxWidth: '700px',
              margin: '0 auto',
              opacity: 0,
              transform: 'translateY(28px)',
              ...(isVisible
                ? {
                    animation: `fadeUpResto 700ms ${curve} forwards`,
                  }
                : {}),
            }}
          >
            <span
              className="font-heading uppercase inline-block"
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: 'var(--color-accent)',
                fontWeight: 600,
              }}
            >
              [ PARA RESTAURANTES ]
            </span>

            <h2
              className="font-heading font-bold"
              style={{
                color: '#F5F5F3',
                fontSize: 'clamp(32px, 4vw, 52px)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                marginTop: '16px',
              }}
            >
              ¿Tienes un espacio para eventos corporativos?
            </h2>

            <p
              className="font-sans"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '18px',
                lineHeight: 1.7,
                maxWidth: '560px',
                marginTop: '20px',
              }}
            >
              Conéctate con empresas que ya están buscando un lugar como el tuyo. Sin inversión en publicidad, sin vendedores, sin complicaciones.
            </p>
          </div>

          {/* ——— Value Points ——— */}
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{
              gap: '16px',
              marginTop: '56px',
              maxWidth: '900px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {valuePoints.map((point, index) => (
              <div
                key={index}
                className="text-center"
                style={{
                  border: '1px solid #1A1A1A',
                  borderRadius: '8px',
                  padding: '24px',
                  opacity: 0,
                  transform: 'translateY(28px)',
                  ...(isVisible
                    ? {
                        animation: `fadeUpResto 700ms ${curve} ${index * 150}ms forwards`,
                      }
                    : {}),
                }}
              >
                <div
                  className="font-heading font-bold"
                  style={{
                    color: 'var(--color-accent)',
                    fontSize: '32px',
                  }}
                >
                  {point.number}
                </div>
                <div
                  className="font-heading font-bold"
                  style={{
                    color: '#F5F5F3',
                    fontSize: '15px',
                    marginTop: '8px',
                  }}
                >
                  {point.title}
                </div>
                <p
                  className="font-sans"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    marginTop: '6px',
                  }}
                >
                  {point.description}
                </p>
              </div>
            ))}
          </div>

          {/* ——— Form / Success ——— */}
          <div
            style={{
              maxWidth: '560px',
              margin: '64px auto 0',
              opacity: 0,
              transform: 'translateY(28px)',
              ...(isVisible
                ? {
                    animation: `fadeUpResto 700ms ${curve} 300ms forwards`,
                  }
                : {}),
            }}
          >
            {submitted ? (
              /* ——— Success State ——— */
              <div className="text-center flex flex-col items-center" style={{ padding: '40px 0' }}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12l3 3 5-5" />
                </svg>

                <h3
                  className="font-heading font-bold"
                  style={{
                    color: '#F5F5F3',
                    fontSize: '20px',
                    marginTop: '16px',
                  }}
                >
                  ¡Listo! Abrimos WhatsApp para ti.
                </h3>

                <p
                  className="font-sans"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '15px',
                    marginTop: '12px',
                    lineHeight: 1.6,
                  }}
                >
                  Completa el mensaje en WhatsApp y te contactamos en menos de 24 horas.
                </p>

                <button
                  onClick={resetForm}
                  className="font-sans"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '13px',
                    marginTop: '24px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#F5F5F3';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
                  }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              /* ——— Form ——— */
              <form onSubmit={handleSubmit} noValidate>
                <h3
                  className="font-heading font-bold text-center"
                  style={{
                    color: '#F5F5F3',
                    fontSize: '22px',
                    marginBottom: '8px',
                  }}
                >
                  Agenda una llamada con nuestro equipo
                </h3>

                <p
                  className="font-sans text-center"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '15px',
                    marginBottom: '32px',
                  }}
                >
                  Cuéntanos sobre tu restaurante y te explicamos cómo funciona la plataforma.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Campo 1 — Nombre del restaurante */}
                  <div>
                    <label style={labelStyle}>Nombre del restaurante *</label>
                    <input
                      type="text"
                      placeholder="Ej. El Pulpo Negro"
                      value={formData.nombreRestaurante}
                      onChange={(e) => handleChange('nombreRestaurante', e.target.value)}
                      style={errors.nombreRestaurante ? inputErrorStyle : inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                      }}
                      onBlur={(e) => {
                        if (!errors.nombreRestaurante) e.currentTarget.style.borderColor = '#1A1A1A';
                      }}
                    />
                    {errors.nombreRestaurante && (
                      <span className="font-sans" style={{ fontSize: '12px', color: '#E05555', marginTop: '4px', display: 'block' }}>
                        {errors.nombreRestaurante}
                      </span>
                    )}
                  </div>

                  {/* Campo 2 — Tu nombre */}
                  <div>
                    <label style={labelStyle}>Tu nombre *</label>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={formData.nombre}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      style={errors.nombre ? inputErrorStyle : inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                      }}
                      onBlur={(e) => {
                        if (!errors.nombre) e.currentTarget.style.borderColor = '#1A1A1A';
                      }}
                    />
                    {errors.nombre && (
                      <span className="font-sans" style={{ fontSize: '12px', color: '#E05555', marginTop: '4px', display: 'block' }}>
                        {errors.nombre}
                      </span>
                    )}
                  </div>

                  {/* Campo 3 — WhatsApp */}
                  <div>
                    <label style={labelStyle}>WhatsApp *</label>
                    <input
                      type="tel"
                      placeholder="55 1234 5678"
                      value={formData.whatsapp}
                      onChange={(e) => handleChange('whatsapp', e.target.value)}
                      style={errors.whatsapp ? inputErrorStyle : inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                      }}
                      onBlur={(e) => {
                        if (!errors.whatsapp) e.currentTarget.style.borderColor = '#1A1A1A';
                      }}
                    />
                    {errors.whatsapp && (
                      <span className="font-sans" style={{ fontSize: '12px', color: '#E05555', marginTop: '4px', display: 'block' }}>
                        {errors.whatsapp}
                      </span>
                    )}
                  </div>

                  {/* Campo 4 — Ciudad */}
                  <div>
                    <label style={labelStyle}>Ciudad *</label>
                    <input
                      type="text"
                      placeholder="Ej. Cuautitlán Izcalli, Edo. Méx."
                      value={formData.ciudad}
                      onChange={(e) => handleChange('ciudad', e.target.value)}
                      style={errors.ciudad ? inputErrorStyle : inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                      }}
                      onBlur={(e) => {
                        if (!errors.ciudad) e.currentTarget.style.borderColor = '#1A1A1A';
                      }}
                    />
                    {errors.ciudad && (
                      <span className="font-sans" style={{ fontSize: '12px', color: '#E05555', marginTop: '4px', display: 'block' }}>
                        {errors.ciudad}
                      </span>
                    )}
                  </div>

                  {/* Campo 5 — Capacidad */}
                  <div>
                    <label style={labelStyle}>Capacidad aproximada</label>
                    <input
                      type="text"
                      placeholder="Ej. 40 personas"
                      value={formData.capacidad}
                      onChange={(e) => handleChange('capacidad', e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#1A1A1A';
                      }}
                    />
                  </div>

                  {/* Campo 6 — Mensaje */}
                  <div>
                    <label style={labelStyle}>Mensaje (opcional)</label>
                    <textarea
                      rows={3}
                      placeholder="Cuéntanos brevemente sobre tu espacio para eventos..."
                      value={formData.mensaje}
                      onChange={(e) => handleChange('mensaje', e.target.value)}
                      style={{
                        ...inputStyle,
                        resize: 'vertical' as const,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#1A1A1A';
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={sending}
                  className="font-sans"
                  style={{
                    width: '100%',
                    marginTop: '24px',
                    padding: '16px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-accent)',
                    borderRadius: '4px',
                    color: 'var(--color-accent)',
                    fontWeight: 500,
                    fontSize: '15px',
                    cursor: sending ? 'not-allowed' : 'pointer',
                    opacity: sending ? 0.7 : 1,
                    transition: 'background-color 0.25s ease, color 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!sending) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent)';
                      (e.currentTarget as HTMLElement).style.color = '#050505';
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)';
                  }}
                >
                  {sending ? 'Enviando...' : 'Quiero conocer más →'}
                </button>

                {/* Note */}
                <p
                  className="font-sans text-center"
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    marginTop: '12px',
                  }}
                >
                  Nos pondremos en contacto contigo por WhatsApp en menos de 24 horas.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
