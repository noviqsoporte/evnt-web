'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock, Star } from 'lucide-react';

export default function PorQueSection() {
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
      ref={sectionRef}
      className={`py-24 lg:py-32 bg-surface ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
      }`}
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: '700ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '100ms',
      }}
    >
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center mb-16">
          <div className="mb-6 inline-block">
            <span className="text-accent text-sm font-semibold tracking-widest font-heading uppercase">
              [ POR QUÉ LO HACEMOS ]
            </span>
          </div>
          
          <h2 
            className="font-heading font-bold text-text-primary mb-6 leading-[1.1] tracking-tight max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}
          >
            El tiempo de tu equipo vale más que buscar restaurantes
          </h2>
          
          <p className="font-sans text-text-secondary text-lg leading-relaxed max-w-[680px] mx-auto">
            En México, miles de empresas medianas organizan eventos internos sin ninguna herramienta pensada para ellas. Nadie había resuelto el segmento de 10 a 30 personas en zonas industriales y ciudades medianas. Eso es exactamente lo que hacemos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="group bg-bg border border-border rounded-xl p-7 transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_-15px_rgba(200,169,110,0.3)]">
            <div className="w-12 h-12 bg-surface border border-border rounded flex items-center justify-center mb-6 group-hover:border-accent/50 transition-colors">
              <Clock className="text-accent" size={24} />
            </div>
            <h3 className="text-text-primary font-bold text-xl mb-3">Sin perder tiempo</h3>
            <p className="text-text-secondary leading-relaxed">
              La fricción no es encontrar restaurantes. Es el proceso completo de cotizar, comparar y coordinar.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-bg border border-border rounded-xl p-7 transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_-15px_rgba(200,169,110,0.3)] flex flex-col">
            <div className="w-12 h-12 bg-surface border border-border rounded flex items-center justify-center mb-6 group-hover:border-accent/50 transition-colors font-heading text-xl font-bold text-accent">
              $0
            </div>
            <h3 className="text-text-primary font-bold text-xl mb-3">Gratis para la empresa</h3>
            <p className="text-text-secondary leading-relaxed">
              La comisión la paga el restaurante. La empresa no desembolsa nada por usar el servicio.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-bg border border-border rounded-xl p-7 transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_-15px_rgba(200,169,110,0.3)]">
            <div className="w-12 h-12 bg-surface border border-border rounded flex items-center justify-center mb-6 group-hover:border-accent/50 transition-colors text-accent">
              <Star size={24} fill="currentColor" />
            </div>
            <h3 className="text-text-primary font-bold text-xl mb-3">Opciones reales, no genéricas</h3>
            <p className="text-text-secondary leading-relaxed">
              Restaurantes con espacios reales para eventos corporativos, seleccionados y verificados por nosotros.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
