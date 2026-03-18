'use client';

import { useEffect, useRef, useState } from 'react';
import { Configuracion } from '@/lib/types';

interface HeroSectionProps {
  config: Configuracion | null;
}

export default function HeroSection({ config }: HeroSectionProps) {
  const numeroLimpio = (config?.whatsapp || '').replace(/\+/g, '').replace(/\s/g, '').replace(/-/g, '');
  const prefilledMessage = encodeURIComponent('Hola, quiero organizar un evento corporativo con EVNT');
  const whatsappUrl = `https://wa.me/${numeroLimpio}?text=${prefilledMessage}`;

  const [taglineVisible, setTaglineVisible] = useState(false);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTaglineVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (taglineRef.current) {
      observer.observe(taglineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ===== Section 1 — Logo Screen ===== */}
      <section className="relative h-screen w-full flex items-center justify-center bg-bg">
        {/* Logo */}
        <div
          className="font-heading font-bold tracking-[0.15em] select-none"
          style={{ fontSize: 'clamp(72px, 12vw, 160px)' }}
        >
          <style jsx>{`
            @keyframes bracketFade {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            @keyframes letterIn {
              from { opacity: 0; transform: translateY(8px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes lineGrow {
              0%   { transform: scaleY(0); }
              50%  { transform: scaleY(1); }
              100% { transform: scaleY(0); }
            }
            @keyframes scrollReveal {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
          `}</style>

          {/* Left bracket */}
          <span
            className="text-accent inline-block"
            style={{
              opacity: 0,
              animation: 'bracketFade 600ms ease-out forwards',
            }}
          >
            [
          </span>

          {/* Letters E V N T */}
          {['E', 'V', 'N', 'T'].map((letter, i) => (
            <span
              key={letter}
              className="text-text-primary inline-block"
              style={{
                opacity: 0,
                animation: `letterIn 500ms ease-out ${300 + i * 150}ms forwards`,
              }}
            >
              {letter}
            </span>
          ))}

          {/* Right bracket */}
          <span
            className="text-accent inline-block"
            style={{
              opacity: 0,
              animation: 'bracketFade 600ms ease-out forwards',
            }}
          >
            ]
          </span>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{
            opacity: 0,
            animation: 'scrollReveal 600ms ease-out 2s forwards',
          }}
        >
          <span
            className="text-text-muted uppercase font-sans font-medium mb-3"
            style={{ fontSize: '11px', letterSpacing: '0.3em' }}
          >
            scroll
          </span>
          <div className="w-px h-[40px] bg-border origin-top" style={{
            animation: 'lineGrow 1.5s ease-in-out infinite',
          }} />
        </div>
      </section>

      {/* ===== Section 2 — Tagline ===== */}
      <section className="bg-bg" style={{ paddingTop: '120px', paddingBottom: '160px' }}>
        <div
          ref={taglineRef}
          className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center"
        >
          {/* Title */}
          <h1
            className={`font-heading font-bold text-text-primary transition-all duration-[800ms] ${
              taglineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Tu próximo evento de equipo, resuelto.
          </h1>

          {/* Subtitle */}
          <p
            className={`font-sans text-text-secondary mt-6 transition-all duration-[800ms] delay-150 ${
              taglineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              maxWidth: '560px',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            La plataforma de eventos corporativos para PyMes. Sin llamadas. Sin cotizaciones. Sin perder tiempo.
          </p>

          {/* CTA Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-12 inline-flex items-center justify-center font-sans font-medium transition-all duration-[800ms] delay-300 ${
              taglineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-bg)',
              fontSize: '16px',
              padding: '18px 40px',
              borderRadius: '4px',
              letterSpacing: '0.02em',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
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
            Escríbenos ahora <span className="ml-2">→</span>
          </a>
        </div>
      </section>
    </>
  );
}
