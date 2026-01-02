'use client';

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { getToken, parseJwt, removeToken } from "@/lib/auth";
import { User, Settings, LogOut } from "lucide-react";
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
  const { scrollToId } = useSmoothScroll(100);

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
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-sm transition-colors duration-300 ${isScrolled
        ? "border-slate-200 bg-white/20 text-slate-900 shadow-md"
        : "border-slate-100 bg-white/20 text-slate-900 shadow-sm"
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/logo.svg" alt="NUPal" width={100} height={34} priority />
          </Link>
        </div>

        <nav
          className={`absolute left-1/2 flex -translate-x-1/2 items-center gap-10 text-sm font-semibold text-slate-600`}
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

        {(pathname.startsWith('/dashboard') || pathname === '/chat' || pathname === '/career-hub' || pathname === '/404') ? (
          <div className="relative" ref={menuRef}>
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
                    <div className="truncate text-sm font-semibold text-slate-900">{userName ?? 'NUPal User'}</div>
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
                  <User size={16} aria-hidden="true" />
                  <span>Profile</span>
                </Link>

                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                  role="menuitem"
                >
                  <Settings size={16} aria-hidden="true" />
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
                  <LogOut size={16} aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button
            href="/login"
            size="md"
            className="px-6"
          >
            LOGIN
          </Button>
        )}
      </div>
    </header>
  );
}

