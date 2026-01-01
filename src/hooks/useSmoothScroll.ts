'use client';

import { useCallback } from 'react';

export const useSmoothScroll = (offset: number = 100) => {
  const scrollToId = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Update URL hash without jumping
    window.history.pushState(null, '', `/#${id}`);
  }, [offset]);

  return { scrollToId };
};
