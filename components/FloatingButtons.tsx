'use client';

import { useState, useEffect } from 'react';
import { Configuracion } from '@/lib/types';

interface FloatingButtonsProps {
  config: Configuracion | null;
}

export default function FloatingButtons({ config }: FloatingButtonsProps) {
  const [appeared, setAppeared] = useState(false);
  const [hoveredTiktok, setHoveredTiktok] = useState(false);
  const [hoveredInstagram, setHoveredInstagram] = useState(false);

  const tiktokUrl = config?.tiktok_url || '';
  const instagramUrl = config?.instagram_url || '';

  console.log('FloatingButtons props:', { tiktok_url: tiktokUrl, instagram_url: instagramUrl });

  useEffect(() => {
    const timer = setTimeout(() => setAppeared(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed z-50 flex flex-col gap-2.5"
      style={{ bottom: '32px', right: '32px' }}
    >
        <div className="relative">
          {/* Tooltip */}
          <div
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              opacity: hoveredTiktok ? 1 : 0,
              transition: 'opacity 0.15s ease',
            }}
          >
            <div className="relative flex items-center">
              <div
                className="font-sans text-text-primary whitespace-nowrap border border-border rounded px-3 py-1.5"
                style={{ fontSize: '13px', backgroundColor: 'var(--color-surface-2)' }}
              >
                TikTok
              </div>
              {/* Arrow */}
              <div
                className="w-0 h-0 ml-[-1px]"
                style={{
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                  borderLeft: '5px solid var(--color-border)',
                }}
              />
            </div>
          </div>

          {/* Button */}
          <a
            href={tiktokUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredTiktok(true)}
            onMouseLeave={() => setHoveredTiktok(false)}
            className="flex items-center justify-center w-12 h-12 rounded-lg border border-border transition-all duration-200 ease hover:border-accent group"
            style={{
              backgroundColor: hoveredTiktok ? 'var(--color-border)' : 'var(--color-surface-2)',
              transform: appeared ? 'translateX(0) scale(1)' : 'translateX(16px) scale(1)',
              opacity: appeared ? 1 : 0,
              transition: 'opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1), background-color 0.2s ease, border-color 0.2s ease',
            }}
          >
            <svg
              width="20" height="20" viewBox="0 0 24 24"
              className="text-text-primary group-hover:text-accent transition-colors duration-200"
              fill="currentColor"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.52V6.83a4.85 4.85 0 0 1-1-.14z"/>
            </svg>
          </a>
        </div>


        <div className="relative">
          {/* Tooltip */}
          <div
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              opacity: hoveredInstagram ? 1 : 0,
              transition: 'opacity 0.15s ease',
            }}
          >
            <div className="relative flex items-center">
              <div
                className="font-sans text-text-primary whitespace-nowrap border border-border rounded px-3 py-1.5"
                style={{ fontSize: '13px', backgroundColor: 'var(--color-surface-2)' }}
              >
                Instagram
              </div>
              <div
                className="w-0 h-0 ml-[-1px]"
                style={{
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                  borderLeft: '5px solid var(--color-border)',
                }}
              />
            </div>
          </div>

          {/* Button */}
          <a
            href={instagramUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredInstagram(true)}
            onMouseLeave={() => setHoveredInstagram(false)}
            className="flex items-center justify-center w-12 h-12 rounded-lg border border-border transition-all duration-200 ease hover:border-accent group"
            style={{
              backgroundColor: hoveredInstagram ? 'var(--color-border)' : 'var(--color-surface-2)',
              transform: appeared ? 'translateX(0) scale(1)' : 'translateX(16px) scale(1)',
              opacity: appeared ? 1 : 0,
              transition: 'opacity 600ms cubic-bezier(0.16,1,0.3,1) 100ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 100ms, background-color 0.2s ease, border-color 0.2s ease',
            }}
          >
            <svg
              width="20" height="20" viewBox="0 0 24 24"
              className="text-text-primary group-hover:text-accent transition-colors duration-200"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
        </div>
    </div>
  );
}
