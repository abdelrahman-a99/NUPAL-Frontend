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
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      // Small delay to ensure content is rendered on initial mount
      const timer = setTimeout(() => {
        scrollToId(hash);
      }, 100);
      return () => clearTimeout(timer);
    }
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
