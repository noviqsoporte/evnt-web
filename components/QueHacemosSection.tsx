'use client';

import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

export default function QueHacemosSection() {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section 
      id="como-funciona" 
      ref={sectionRef}
      className={`py-24 lg:py-32 bg-bg overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
      }`}
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: '700ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div>
            <div className="mb-6 inline-block">
              <span className="text-accent text-sm font-semibold tracking-widest font-heading uppercase">
                [ QUÉ HACEMOS ]
              </span>
            </div>
            
            <h2 
              className="font-heading font-bold text-text-primary mb-6 leading-[1.1] tracking-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
            >
              Eliminamos las horas perdidas organizando eventos
            </h2>
            
            <p className="font-sans text-text-secondary text-lg mb-12 leading-relaxed">
              Cualquier empresa organiza 2 a 4 cenas o comidas de equipo al año. La persona responsable pierde entre 3 y 6 horas por evento buscando opciones, cotizando y coordinando. Nosotros resolvemos eso en minutos.
            </p>

            <div className="space-y-8">
              {/* Point 1 */}
              <div className="flex gap-6">
                <div className="text-accent font-heading font-bold text-3xl shrink-0">
                  01
                </div>
                <div>
                  <h3 className="text-text-primary font-bold text-xl mb-2">Cuéntanos qué necesitas</h3>
                  <p className="text-text-secondary">Grupo, fecha aproximada y presupuesto. Sin formularios largos.</p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex gap-6">
                <div className="text-accent font-heading font-bold text-3xl shrink-0">
                  02
                </div>
                <div>
                  <h3 className="text-text-primary font-bold text-xl mb-2">Nosotros buscamos el lugar ideal</h3>
                  <p className="text-text-secondary">Seleccionamos el restaurante perfecto para tu equipo y tu presupuesto.</p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex gap-6">
                <div className="text-accent font-heading font-bold text-3xl shrink-0">
                  03
                </div>
                <div>
                  <h3 className="text-text-primary font-bold text-xl mb-2">Tú solo confirmas y disfrutas</h3>
                  <p className="text-text-secondary">Coordinamos todo. Tú llegas al evento.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative">
            {/* Main Floating Card */}
            <div className="bg-surface border border-border rounded-xl p-8 shadow-2xl relative z-10">
              <div className="text-center md:text-left flex flex-col items-center md:items-start justify-center h-full">
                <div 
                  className="font-heading font-bold text-accent mb-4 leading-none"
                  style={{ fontSize: '64px' }}
                >
                  3-6 hrs
                </div>
                <p className="text-text-secondary text-lg">
                  que pierde RR.HH. por evento buscando opciones
                </p>
              </div>
            </div>

            {/* Sub Card */}
            <div className="mt-6 bg-surface border rounded-xl p-5 border-accent/30 flex items-center gap-4 relative z-0">
              <div className="bg-accent/10 rounded-full p-1.5 shrink-0">
                <Check className="text-accent" size={20} strokeWidth={3} />
              </div>
              <p className="font-medium text-text-primary text-[15px]">
                Para la empresa, el servicio es <span className="text-accent font-bold">gratuito.</span>
              </p>
            </div>
            
            {/* Decorative element behind */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 w-64 h-64 bg-accent opacity-5 rounded-full blur-3xl -z-10 hidden lg:block" />
          </div>

        </div>
      </div>
    </section>
  );
}
