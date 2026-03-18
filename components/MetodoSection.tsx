'use client';

import { useEffect, useRef, useState } from 'react';
import { Configuracion } from '@/lib/types';

interface MetodoSectionProps {
  config: Configuracion | null;
}

export default function MetodoSection({ config }: MetodoSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const numeroLimpio = (config?.whatsapp || '').replace(/\+/g, '').replace(/\s/g, '').replace(/-/g, '');
  const prefilledMessage = encodeURIComponent('Hola, quiero organizar un evento corporativo con EVNT');
  const whatsappUrl = `https://wa.me/${numeroLimpio}?text=${prefilledMessage}`;

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

  const steps = [
    {
      number: '01',
      title: 'Nos escribes por WhatsApp',
      description: 'Cuéntanos cuántas personas, qué fecha tienes en mente y cuál es tu presupuesto aproximado. Sin formularios.'
    },
    {
      number: '02',
      title: 'Buscamos el restaurante ideal',
      description: 'Seleccionamos opciones reales con espacio para tu grupo, en la zona que necesitas y dentro de tu presupuesto.'
    },
    {
      number: '03',
      title: 'Te presentamos las opciones',
      description: 'En menos de 5 minutos tienes opciones concretas con precios, capacidad y disponibilidad confirmada. Tú decides.'
    },
    {
      number: '04',
      title: 'Tú confirmas, nosotros coordinamos',
      description: 'Cerramos el restaurante, confirmamos los detalles y el día del evento tu equipo solo tiene que llegar.'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="bg-bg"
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-[120px]">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center mb-16 lg:mb-24">
          <div className="mb-6 inline-block">
            <span className="text-accent text-sm font-semibold tracking-widest font-heading uppercase">
              [ CÓMO LO HACEMOS ]
            </span>
          </div>
          
          <h2 
            className="font-heading font-bold text-text-primary mb-6 leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
          >
            Un método simple. Un resultado garantizado.
          </h2>
          
          <p className="font-sans text-text-secondary text-lg leading-relaxed max-w-[680px] mx-auto">
            Desde que nos escribes hasta que tu equipo está sentado en el restaurante.
          </p>
        </div>

        {/* Timeline */}
        <div 
          ref={timelineRef}
          className="relative"
        >
          {/* Timeline Line Grid (Desktop Horizontal, Mobile Vertical) */}
          <div className="absolute top-0 bottom-0 left-5 md:left-0 md:top-5 md:bottom-auto md:w-full w-px md:h-px bg-transparent md:border-t border-l md:border-l-0 border-border border-dashed z-0" />
            
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="flex flex-row md:flex-col gap-6 md:gap-8 group opacity-0 translate-y-7"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animationDuration: '700ms',
                  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  animationName: isVisible ? 'fadeUp' : 'none',
                  animationFillMode: 'forwards',
                }}
              >
                <style jsx>{`
                  @keyframes fadeUp {
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>
                
                {/* Circle Number */}
                <div className="w-[40px] h-[40px] shrink-0 rounded-full border border-accent bg-bg flex items-center justify-center text-accent font-heading font-bold text-lg transition-colors duration-300 group-hover:bg-accent group-hover:text-black">
                  {step.number}
                </div>
                
                {/* Content */}
                <div className="pt-1 md:pt-0">
                  <h3 className="text-text-primary font-heading font-medium text-[18px] mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="font-sans text-text-secondary text-[15px] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div className="w-full bg-surface border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 text-center md:text-left">
            <h3 className="font-heading font-medium text-[28px] text-text-primary m-0">
              ¿Cuándo es tu próximo evento?
            </h3>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-black font-semibold rounded-md px-8 py-4 transition-colors duration-300 whitespace-nowrap"
            >
              Escríbenos ahora <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
