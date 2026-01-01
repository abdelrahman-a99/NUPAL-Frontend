import { useCallback, useMemo } from 'react';

export const useSmoothScroll = (offset: number = 100) => {
  const scrollToId = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Update URL hash without jumping
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, '', `/#${id}`);
    }
  }, [offset]);

  return useMemo(() => ({ scrollToId }), [scrollToId]);
};
