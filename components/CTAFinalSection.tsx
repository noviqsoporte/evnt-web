'use client';

import { useEffect, useRef, useState } from 'react';
import { Configuracion } from '@/lib/types';

interface CTAFinalSectionProps {
  config: Configuracion | null;
}

export default function CTAFinalSection({ config }: CTAFinalSectionProps) {
  const numeroLimpio = (config?.whatsapp || '').replace(/\+/g, '').replace(/\s/g, '').replace(/-/g, '');
  const prefilledMessage = encodeURIComponent('Hola, quiero organizar un evento corporativo con EVNT');
  const whatsappUrl = `https://wa.me/${numeroLimpio}?text=${prefilledMessage}`;

  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const base = 'transition-all duration-[700ms]';
  const curve = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const show = 'opacity-100 translate-y-0';
  const hide = 'opacity-0 translate-y-7';

  return (
    <section
      ref={ref}
      className="bg-surface border-t border-border"
      style={{ padding: '160px 0' }}
    >
      <style jsx>{`
        @media (max-width: 767px) {
          .cta-pad { padding-top: 96px !important; padding-bottom: 96px !important; }
        }
      `}</style>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center cta-pad">

        {/* Eyebrow */}
        <span
          className={`${base} ${visible ? show : hide} text-accent font-sans uppercase mb-8 inline-block`}
          style={{ fontSize: '11px', letterSpacing: '0.3em', transitionTimingFunction: curve }}
        >
          ¿LISTO PARA EL SIGUIENTE PASO?
        </span>

        {/* Title */}
        <h2
          className={`${base} ${visible ? show : hide} font-heading font-bold text-text-primary`}
          style={{
            fontSize: 'clamp(36px, 5vw, 68px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            maxWidth: '700px',
            transitionTimingFunction: curve,
          }}
        >
          Organicemos tu próximo evento de equipo.
        </h2>

        {/* Paragraph */}
        <p
          className={`${base} delay-150 ${visible ? show : hide} font-sans text-text-secondary mt-6`}
          style={{
            fontSize: '18px',
            lineHeight: 1.7,
            maxWidth: '520px',
            transitionTimingFunction: curve,
          }}
        >
          Cuéntanos cuántas personas, qué fecha tienes en mente y tu presupuesto aproximado. En menos de 24 horas tienes opciones concretas.
        </p>

        {/* CTA Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} delay-300 ${visible ? show : hide} mt-12 inline-flex items-center justify-center font-sans font-medium`}
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-bg)',
            fontSize: '16px',
            padding: '20px 48px',
            borderRadius: '4px',
            letterSpacing: '0.02em',
            transitionTimingFunction: curve,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent-hover)';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent)';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          Escribirnos por WhatsApp <span className="ml-2">→</span>
        </a>

        {/* Muted note */}
        <span
          className={`${base} ${visible ? show : hide} mt-4 font-sans text-text-muted`}
          style={{
            fontSize: '13px',
            letterSpacing: '0.05em',
            transitionTimingFunction: curve,
            transitionDelay: '400ms',
          }}
        >
          El servicio es gratuito para tu empresa.
        </span>
      </div>
    </section>
  );
}
