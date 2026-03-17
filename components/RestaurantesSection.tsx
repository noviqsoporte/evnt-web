'use client';

import { useEffect, useRef, useState } from 'react';
import { Restaurante } from '@/lib/types';

const placeholderRestaurantes: Restaurante[] = [
  {
    id: 'placeholder-1',
    nombre: 'El Pulpo Negro',
    descripcion: 'Restaurante de mariscos con salón privado para eventos corporativos. Ambiente elegante y cocina de autor en el corazón de Cuautitlán Izcalli.',
    ciudad: 'Cuautitlán Izcalli, Edo. Méx.',
    tipo_cocina: 'Mariscos y cocina de autor',
    capacidad_max: 40,
    foto_url: '',
    activo: true,
    orden: 1,
  },
  {
    id: 'placeholder-2',
    nombre: 'El Mesón del Molino',
    descripcion: 'Hacienda histórica convertida en restaurante. Espacios únicos para cenas y comidas de equipo con capacidad para grupos medianos.',
    ciudad: 'Tepotzotlán, Edo. Méx.',
    tipo_cocina: 'Cocina mexicana tradicional',
    capacidad_max: 80,
    foto_url: '',
    activo: true,
    orden: 2,
  },
  {
    id: 'placeholder-3',
    nombre: 'Los Virreyes',
    descripcion: 'Cocina tradicional mexicana en un entorno colonial. Ideal para cierres de año, posadas corporativas y comidas de equipo.',
    ciudad: 'Tepotzotlán, Edo. Méx.',
    tipo_cocina: 'Cocina tradicional mexicana',
    capacidad_max: 60,
    foto_url: '',
    activo: true,
    orden: 3,
  },
];

interface RestaurantesSectionProps {
  restaurantes: Restaurante[];
}

export default function RestaurantesSection({ restaurantes }: RestaurantesSectionProps) {
  const data = restaurantes.length > 0 ? restaurantes : placeholderRestaurantes;
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    if (index < 0 || index >= data.length || index === current || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTimeout(() => setTransitioning(false), 50);
    }, 200);
  };

  const r = data[current];
  const slideNum = String(current + 1).padStart(2, '0');

  return (
    <section ref={sectionRef} id="restaurantes" className="bg-bg" style={{ padding: '120px 0' }}>
      <style jsx>{`
        @media (max-width: 767px) {
          .resto-section-pad { padding-top: 64px !important; padding-bottom: 64px !important; }
        }
      `}</style>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 resto-section-pad">

        {/* Header */}
        <div
          className={`text-center flex flex-col items-center mb-16 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
          }`}
          style={{
            transitionProperty: 'opacity, transform',
            transitionDuration: '700ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span
            className="text-accent font-heading font-semibold uppercase mb-6 inline-block"
            style={{ fontSize: '11px', letterSpacing: '0.2em' }}
          >
            [ RESTAURANTES ALIADOS ]
          </span>

          <h2
            className="font-heading font-bold text-text-primary mb-4"
            style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Espacios que ya confían en nosotros
          </h2>

          <p className="font-sans text-text-secondary" style={{ fontSize: '17px' }}>
            Restaurantes seleccionados con espacios reales para eventos corporativos.
          </p>
        </div>

        {/* Carousel */}
        <div
          className={`${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
          }`}
          style={{
            transitionProperty: 'opacity, transform',
            transitionDuration: '700ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '200ms',
          }}
        >
          {/* Slide */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 items-center">

            {/* Photo — 60% = 3/5 */}
            <div className="md:col-span-3 overflow-hidden rounded-lg" style={{ aspectRatio: '4/3' }}>
              {r.foto_url ? (
                <img
                  src={r.foto_url}
                  alt={r.nombre}
                  className="w-full h-full object-cover transition-opacity duration-[400ms]"
                  style={{ opacity: transitioning ? 0 : 1 }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center transition-opacity duration-[400ms]"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    opacity: transitioning ? 0 : 1,
                  }}
                >
                  <span className="text-text-muted font-heading text-2xl">{r.nombre}</span>
                </div>
              )}
            </div>

            {/* Info — 40% = 2/5 */}
            <div
              className="md:col-span-2 pt-8 md:pt-0 md:pl-14"
              style={{
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? 'translateX(16px)' : 'translateX(0)',
                transition: 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Slide Number */}
              <div
                className="font-heading font-bold text-text-muted leading-none select-none"
                style={{ fontSize: '72px' }}
              >
                {slideNum}
              </div>

              {/* Name */}
              <h3
                className="font-heading font-bold text-text-primary"
                style={{
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  marginTop: '-8px',
                }}
              >
                {r.nombre}
              </h3>

              {/* Accent Line */}
              <div
                className="bg-accent"
                style={{ width: 40, height: 1, margin: '20px 0' }}
              />

              {/* Description */}
              <p
                className="font-sans text-text-secondary"
                style={{
                  fontSize: '16px',
                  lineHeight: 1.75,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {r.descripcion}
              </p>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mt-5">
                {r.ciudad && (
                  <span className="font-sans text-text-secondary border border-border rounded bg-surface-2 px-3 py-1.5" style={{ fontSize: '13px' }}>
                    {r.ciudad}
                  </span>
                )}
                {r.tipo_cocina && (
                  <span className="font-sans text-text-secondary border border-border rounded bg-surface-2 px-3 py-1.5" style={{ fontSize: '13px' }}>
                    {r.tipo_cocina}
                  </span>
                )}
                {r.capacidad_max > 0 && (
                  <span className="font-sans text-text-secondary border border-border rounded bg-surface-2 px-3 py-1.5" style={{ fontSize: '13px' }}>
                    Hasta {r.capacidad_max} personas
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-10">

            {/* Position indicators */}
            <div className="flex items-center gap-1.5">
              {data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir al restaurante ${i + 1}`}
                  className="h-0.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 48 : 24,
                    backgroundColor: i === current ? 'var(--color-accent)' : 'var(--color-border)',
                  }}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              {/* Prev */}
              <button
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                aria-label="Anterior"
                className="w-12 h-12 flex items-center justify-center border border-border rounded transition-colors duration-200 hover:border-accent group disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-text-primary group-hover:text-accent group-disabled:group-hover:text-text-primary transition-colors">
                  <line x1="15" y1="10" x2="5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <polyline points="9,6 5,10 9,14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Next */}
              <button
                onClick={() => goTo(current + 1)}
                disabled={current === data.length - 1}
                aria-label="Siguiente"
                className="w-12 h-12 flex items-center justify-center border border-border rounded transition-colors duration-200 hover:border-accent group disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-text-primary group-hover:text-accent group-disabled:group-hover:text-text-primary transition-colors">
                  <line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <polyline points="11,6 15,10 11,14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
