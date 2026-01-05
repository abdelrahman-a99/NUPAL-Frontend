'use client';

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { getToken, parseJwt, removeToken } from "@/lib/auth";
import { User, Settings, LogOut, Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

interface NavLinkItem {
  name: string;
  path: string;
  id?: string;
}

const navLinks: NavLinkItem[] = [
  { name: "Home", path: "/#home", id: "home" },
  { name: "Services", path: "/#services", id: "services" },
  { name: "About", path: "/#about", id: "about" },
  { name: "Contact", path: "/#contact", id: "contact" },
];

const dashboardLinks: NavLinkItem[] = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Chatbot", path: "/chat" },
  { name: "Career Hub", path: "/career-hub" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || '';
  const router = useRouter();
  const { scrollToId, scrollToTop } = useSmoothScroll(70);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for Scroll Spy
  useEffect(() => {
    if (pathname !== '/') return;

    const options = {
      root: null,
      rootMargin: '-100px 0px -40% 0px',
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    const sections = navLinks
      .filter(link => !!link.id)
      .map(link => document.getElementById(link.id!))
      .filter(Boolean);
    sections.forEach(section => observer.observe(section!));

    return () => observer.disconnect();
  }, [pathname]);

  // Click outside listener for profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string, id?: string) => {
    if (pathname === '/' && id) {
      e.preventDefault();
      scrollToId(id);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-sm transition-colors duration-300 ${isScrolled
          ? "border-slate-200 bg-white/80 text-slate-900 shadow-md"
          : "border-slate-100 bg-white/20 text-slate-900 shadow-sm"
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
            >
              <Image src="/logo.svg" alt="NUPal" width={100} height={34} priority />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <nav
              className="hidden lg:flex items-center gap-10 text-sm font-semibold text-slate-600"
            >
              {links.map((link) => {
                const isActive = link.id
                  ? (pathname === '/' && activeSection === link.id)
                  : pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    scroll={false}
                    onClick={(e) => {
                      const id = link.id;
                      if (id) {
                        handleNavClick(e, link.path, id);
                      }
                    }}
                    className={`transition-colors duration-200 hover:text-blue-400 ${isActive ? "text-blue-400" : ""}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <button
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {(pathname.startsWith('/dashboard') || pathname === '/chat' || pathname === '/career-hub' || pathname === '/404') ? (
            <div className="hidden lg:block relative" ref={menuRef}>
              <Button
                variant="none"
                size="none"
                onClick={() => setMenuOpen((v) => !v)}
                ariaLabel="Open profile menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow"
              >
                <span className="text-sm font-semibold">{initial}</span>
              </Button>

              {menuOpen && (
                <div role="menu" aria-label="Profile menu" className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 rounded-lg bg-slate-50/70 px-3 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <span className="text-sm font-semibold">{initial}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">{userName ?? 'NUPal User'}</div>
                      <div className="truncate text-xs text-slate-500">Account</div>
                    </div>
                  </div>

                  <div className="my-2 h-px bg-slate-200" />
                  <Button
                    href="/dashboard"
                    variant="none"
                    size="none"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-slate-50 justify-start"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                  >
                    <User size={16} aria-hidden="true" />
                    <span>Profile</span>
                  </Button>

                  <Button
                    variant="none"
                    size="none"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-slate-50 justify-start"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                  >
                    <Settings size={16} aria-hidden="true" />
                    <span>Settings</span>
                  </Button>

                  <div className="my-2 h-px bg-slate-200" />

                  <Button
                    variant="none"
                    size="none"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 justify-start"
                    onClick={() => {
                      removeToken();
                      window.location.href = '/';
                    }}
                    role="menuitem"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    <span>Logout</span>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:block">
              <Button
                href="/login"
                size="md"
                className="px-6"
              >
                LOGIN
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay - Move out of header to ensure it's on top and opaque */}
      <div
        className={`lg:hidden fixed inset-0 z-[9999] bg-white transition-all duration-300 transform ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex flex-col h-full bg-white">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-white">
            <Image src="/logo.svg" alt="NUPal" width={100} height={34} priority />
            <button
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto bg-white">
            {links.map((link) => {
              const isActive = link.id
                ? (pathname === '/' && activeSection === link.id)
                : pathname === link.path;

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  scroll={false}
                  onClick={(e) => {
                    setMenuOpen(false);
                    const id = link.id;
                    if (id) {
                      handleNavClick(e, link.path, id);
                    }
                  }}
                  className={`text-lg font-semibold transition-colors duration-200 ${isActive ? "text-blue-400" : "text-slate-600"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
              {(pathname.startsWith('/dashboard') || pathname === '/chat' || pathname === '/career-hub' || pathname === '/404') ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                      <span className="text-lg font-semibold">{initial}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">{userName ?? 'NUPal User'}</div>
                      <div className="truncate text-xs text-slate-500">Account</div>
                    </div>
                  </div>
                  <Button href="/dashboard" variant="outline" className="w-full justify-start gap-3" onClick={() => setMenuOpen(false)}>
                    <User size={18} /> Profile
                  </Button>
                  <Button
                    variant="none"
                    className="w-full justify-start gap-3 text-red-600 bg-red-50 hover:bg-red-100 p-3 rounded-xl"
                    onClick={() => {
                      removeToken();
                      window.location.href = '/';
                    }}
                  >
                    <LogOut size={18} /> Logout
                  </Button>
                </div>
              ) : (
                <Button href="/login" className="w-full" onClick={() => setMenuOpen(false)}>
                  LOGIN
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
