'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const pathname = usePathname() || '';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check hash on mount and when it changes
    const checkHash = () => {
      setActiveHash(window.location.hash);
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  if (pathname === '/login') {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-sm transition-colors duration-300 ${
        isScrolled
          ? "border-slate-200 bg-white/20 text-slate-900 shadow-md"
          : "border-slate-100 bg-white/20 text-slate-900 shadow-sm"
      }`}
    >
      <div className="relative flex w-full items-center justify-between px-20 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-slate-900">NU PAL</span>
        </div>

        <nav
          className={`absolute left-1/2 flex -translate-x-1/2 items-center gap-10 text-sm font-semibold text-slate-600`}
        >
          {navLinks.map((link) => {
            // For Services link on home page - scroll to section
            if (link.path === '/services' && pathname === '/') {
              const isActive = activeHash === '#services';
              return (
                <a
                  key={link.path}
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    const servicesSection = document.getElementById('services');
                    if (servicesSection) {
                      const offset = 100;
                      const elementPosition = servicesSection.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                      
                      // Trigger hash change to open accordion
                      setTimeout(() => {
                        window.location.hash = '#services';
                      }, 100);
                    }
                  }}
                  className={`transition-colors duration-200 hover:text-indigo-600 ${
                    isActive ? "text-indigo-600" : ""
                  }`}
                >
                  {link.name}
                </a>
              );
            }
            // For Home link on home page
            if (link.path === '/' && pathname === '/') {
              const isActive = !activeHash || (activeHash !== '#services' && activeHash !== '#contact' && activeHash !== '#about');
              return (
                <a
                  key={link.path}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`transition-colors duration-200 hover:text-indigo-600 ${
                    isActive ? "text-indigo-600" : ""
                  }`}
                >
                  {link.name}
                </a>
              );
            }
            // For all other links, use Link component to navigate to separate pages
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`transition-colors duration-200 hover:text-indigo-600 ${
                  pathname === link.path ? "text-indigo-600" : ""
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/login"
          className="rounded-lg bg-blue-400 px-6 py-2 text-sm font-semibold uppercase text-white transition-colors duration-200 hover:bg-blue-500"
        >
          LOGIN
        </Link>
      </div>
    </header>
  );
}

