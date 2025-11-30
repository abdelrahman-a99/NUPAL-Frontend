'use client';

import { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturesSection from '@/components/ui/FeaturesSection';
import AboutIntroSection from '@/components/home/AboutIntroSection';
import ContactSection from '@/components/home/ContactSection';

/**
 * Home Page Component
 * Displays hero section with background image and services section with interactive tabs and accordion
 */
export default function Home() {
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#services') {
        setTimeout(() => {
          const servicesSection = document.getElementById('services');
          if (servicesSection) {
            const offset = 100;
            const elementPosition = servicesSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 100);
      } else if (!window.location.hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white">
      {/* Hero Section */}
      <Hero />

      <ServicesSection />

      <FeaturesSection />

      <AboutIntroSection />
      <ContactSection />
    </div>
  );
}
