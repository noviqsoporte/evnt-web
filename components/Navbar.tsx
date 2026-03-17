'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Offset by navbar height
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-bg border-b border-border shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-heading font-bold text-2xl tracking-tighter text-text-primary">
              <span className="text-accent">[</span>EVNT<span className="text-accent">]</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
            >
              ¿Cómo funciona?
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
            >
              Contacto
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border absolute w-full left-0">
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3 flex flex-col items-center">
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="block px-3 py-4 text-text-secondary hover:text-text-primary font-medium w-full border-b border-border transition-colors"
            >
              ¿Cómo funciona?
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="block px-3 py-4 text-text-secondary hover:text-text-primary font-medium w-full transition-colors"
            >
              Contacto
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
