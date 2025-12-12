'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getToken, parseJwt, removeToken } from "@/lib/auth";
import { User, Settings, LogOut } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const dashboardLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Chatbot", path: "/chat" },
  { name: "Career Hub", path: "/career-hub" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
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

  useEffect(() => {
    try {
      const token = getToken();
      const name = token ? (parseJwt(token)?.name ?? null) : null;
      setUserName(name);
    } catch {
      setUserName(null);
    }
  }, []);

  if (pathname === '/login') {
    return null;
  }

  const initial = (userName?.trim()?.charAt(0)?.toUpperCase() ?? 'N');

  const links = (pathname.startsWith('/dashboard') || pathname === '/chat' || pathname === '/career-hub') ? dashboardLinks : navLinks;

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-sm transition-colors duration-300 ${isScrolled
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
          {links.map((link) => {
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
                  className={`transition-colors duration-200 hover:text-blue-400 ${isActive ? "text-blue-400" : ""
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
                  className={`transition-colors duration-200 hover:text-blue-400 ${isActive ? "text-blue-400" : ""
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
                className={`transition-colors duration-200 hover:text-blue-400 ${pathname === link.path ? "text-blue-400" : ""
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {(pathname.startsWith('/dashboard') || pathname === '/chat' || pathname === '/career-hub') ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open profile menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow"
            >
              <span className="text-sm font-semibold">{initial}</span>
            </button>
            {menuOpen && (
              <div role="menu" aria-label="Profile menu" className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 rounded-lg bg-slate-50/70 px-3 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <span className="text-sm font-semibold">{initial}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">{userName ?? 'NU Pal User'}</div>
                    <div className="truncate text-xs text-slate-500">Account</div>
                  </div>
                </div>
                <div className="my-2 h-px bg-slate-200" />
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 transition-all duration-200 hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                  role="menuitem"
                >
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                  role="menuitem"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="my-2 h-px bg-slate-200" />
                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50"
                  onClick={() => {
                    removeToken();
                    window.location.href = '/';
                  }}
                  role="menuitem"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-blue-400 px-6 py-2 text-sm font-semibold uppercase text-white transition-colors duration-200 hover:bg-blue-500"
          >
            LOGIN
          </Link>
        )}
      </div>
    </header>
  );
}
