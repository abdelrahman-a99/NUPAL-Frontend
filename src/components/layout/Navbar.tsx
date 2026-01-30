'use client';

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { getToken, parseJwt, removeToken } from "@/lib/auth";
import { User, Settings, LogOut, Menu, X, Home, Briefcase, MessageSquare, Info, Mail, LayoutDashboard, ChevronRight } from "lucide-react";
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
  { name: "Dashboard", path: "/dashboard", id: "dashboard" },
  { name: "Chatbot", path: "/chat", id: "chat" },
  { name: "Career Hub", path: "/career-hub", id: "career-hub" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
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
    if (pathname !== '/') {
      setActiveSection('home');
      return;
    }

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

    let observer: IntersectionObserver | null = null;
    let timeoutId: NodeJS.Timeout;

    const setupObserver = () => {
      const sections = navLinks
        .filter(link => !!link.id)
        .map(link => document.getElementById(link.id!))
        .filter(Boolean);

      if (sections.length > 0) {
        observer = new IntersectionObserver(handleIntersect, options);
        sections.forEach(section => observer?.observe(section!));
      } else {
        // If sections not found (e.g. during loading), try again after a delay
        timeoutId = setTimeout(setupObserver, 500);
      }
    };

    setupObserver();

    return () => {
      observer?.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pathname]);

  // Click outside listener for profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
                setMobileMenuOpen(false);
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
                const isActive = link.path.includes('#')
                  ? (pathname === '/' && activeSection === link.id)
                  : (pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path)));

                return (
                  <Link
                    key={link.path}
                    href={link.path}
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {(pathname.startsWith('/dashboard') || pathname === '/chat' || pathname === '/career-hub' || pathname === '/404') ? (
            <div className="hidden lg:block relative" ref={menuRef}>
              <Button
                variant="none"
                size="none"
                onClick={() => setProfileMenuOpen((v: boolean) => !v)}
                ariaLabel="Open profile menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow"
              >
                <span className="text-sm font-semibold">{initial}</span>
              </Button>

              {profileMenuOpen && (
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
                    onClick={() => {
                      setProfileMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <User size={16} aria-hidden="true" />
                    <span>Profile</span>
                  </Button>

                  <Button
                    variant="none"
                    size="none"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-slate-50 justify-start"
                    onClick={() => setProfileMenuOpen(false)}
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

      {/* Mobile Menu Overlay - Solid Full Screen Re-design */}
      <div
        className={`lg:hidden fixed inset-0 z-[9999] bg-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex flex-col h-full bg-white">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <Image src="/logo.svg" alt="NUPal" width={90} height={30} priority />
            <button
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors border border-slate-100 shadow-sm"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col pt-4 overflow-y-auto">
            <div className="flex flex-col">
              {links.map((link, index) => {
                const isActive = link.path.includes('#')
                  ? (pathname === '/' && activeSection === link.id)
                  : (pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path)));

                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={(e) => {
                      const id = link.id;
                      if (id && pathname === '/') {
                        handleNavClick(e, link.path, id);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-6 py-5 border-b border-dashed border-slate-100 transition-colors duration-200 ${isActive ? "text-blue-500" : "text-slate-800"
                      }`}
                  >
                    <span className="font-bold text-lg">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile-Native Account Section */}
            <div className="mt-auto px-4 py-4 bg-slate-50/50 border-t border-slate-100">
              {(pathname.startsWith('/dashboard') || pathname === '/chat' || pathname === '/career-hub' || pathname === '/404') ? (
                <div className="space-y-3">
                  {/* User Info - Horizontal Layout */}
                  <div className="flex items-center gap-3 px-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <span className="text-base font-bold">{initial}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-slate-900">{userName ?? 'NUPal User'}</div>
                      <div className="truncate text-xs text-slate-500">My Account</div>
                    </div>
                  </div>

                  {/* Action Buttons - Side by Side */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      href="/dashboard"
                      variant="none"
                      className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-200 px-4 py-3 text-center transition-all duration-200 hover:bg-slate-50 hover:border-blue-300 active:scale-95 shadow-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={20} className="text-blue-500" />
                      <span className="text-xs font-semibold text-slate-700">Profile</span>
                    </Button>

                    <Button
                      variant="none"
                      className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-200 px-4 py-3 text-center transition-all duration-200 hover:bg-red-50 hover:border-red-300 active:scale-95 shadow-sm"
                      onClick={() => {
                        removeToken();
                        window.location.href = '/';
                      }}
                    >
                      <LogOut size={20} className="text-red-500" />
                      <span className="text-xs font-semibold text-slate-700">Logout</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <Button
                    href="/login"
                    variant="primary"
                    className="w-full py-4 rounded-xl font-bold text-sm bg-blue-400 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
