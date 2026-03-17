'use client';

import { Configuracion } from '@/lib/types';

interface FooterProps {
  config: Configuracion | null;
}

export default function Footer({ config }: FooterProps) {
  const whatsappNumber = config?.whatsapp || '';
  const prefilledMessage = encodeURIComponent('Hola, quiero organizar un evento corporativo');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefilledMessage}`;
  const tiktokUrl = config?.tiktok_url || '';
  const instagramUrl = config?.instagram_url || '';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-bg border-t border-border-subtle" style={{ paddingTop: '64px', paddingBottom: '40px' }}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Col 1 — Identity */}
          <div>
            <div className="font-heading font-bold text-2xl tracking-tighter text-text-primary">
              <span className="text-accent">[</span>EVNT<span className="text-accent">]</span>
            </div>
            <p className="font-sans text-text-secondary mt-4" style={{ fontSize: '14px' }}>
              Plataforma de eventos corporativos.
            </p>
            <p className="font-sans text-text-muted mt-2" style={{ fontSize: '13px' }}>
              Ciudad de México y Estado de México.
            </p>
          </div>

          {/* Col 2 — Links */}
          <div className="md:text-center">
            <h4
              className="font-sans text-text-muted uppercase mb-5"
              style={{ fontSize: '11px', letterSpacing: '0.2em' }}
            >
              Plataforma
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollTo('como-funciona')}
                  className="font-sans text-text-secondary hover:text-text-primary transition-colors duration-200"
                  style={{ fontSize: '14px' }}
                >
                  ¿Cómo funciona?
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('restaurantes')}
                  className="font-sans text-text-secondary hover:text-text-primary transition-colors duration-200"
                  style={{ fontSize: '14px' }}
                >
                  Restaurantes aliados
                </button>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-text-secondary hover:text-text-primary transition-colors duration-200"
                  style={{ fontSize: '14px' }}
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 — Social */}
          <div className="md:text-right">
            <h4
              className="font-sans text-text-muted uppercase mb-5"
              style={{ fontSize: '11px', letterSpacing: '0.2em' }}
            >
              Síguenos
            </h4>
            <div className="space-y-3">
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 md:justify-end text-text-secondary hover:text-text-primary transition-colors duration-200"
                  style={{ fontSize: '14px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.52V6.83a4.85 4.85 0 0 1-1-.14z"/>
                  </svg>
                  TikTok
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 md:justify-end text-text-secondary hover:text-text-primary transition-colors duration-200"
                  style={{ fontSize: '14px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-border-subtle mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="font-sans text-text-muted" style={{ fontSize: '13px' }}>
              © 2026 EVNT · Nexora Automatizaciones
            </span>
            <span className="font-sans text-text-muted" style={{ fontSize: '13px' }}>
              Hecho en México
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
