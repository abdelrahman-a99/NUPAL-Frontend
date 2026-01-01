'use client';

import { useEffect } from 'react';

import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import AboutIntroSection from '@/components/home/AboutIntroSection';
import ContactSection from '@/components/home/ContactSection';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function Home() {
  const { scrollToId } = useSmoothScroll(100);

  useEffect(() => {
    const handleInitialScroll = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Small delay to ensure content is rendered
        setTimeout(() => scrollToId(hash), 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    handleInitialScroll();

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        scrollToId(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [scrollToId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white">
      <Hero />
      <ServicesSection />
      <FeaturesSection />
      <AboutIntroSection />
      <ContactSection />
    </div>
  );
}
