'use client';

import { useEffect, useState } from "react";

const navLinks = ["Home", "Services", "About", "Contact"];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <span className="text-lg">📘</span>
          </div>
          <span className="text-lg font-semibold text-slate-900">NU PAL</span>
        </div>

        <nav
          className={`absolute left-1/2 flex -translate-x-1/2 items-center gap-10 text-sm font-semibold text-slate-600`}
        >
          {navLinks.map((link) => (
            <a
              key={link}
              className={`transition-colors duration-200 hover:text-indigo-600 ${
                link === "Home" ? "text-indigo-600" : ""
              }`}
              href="#"
            >
              {link}
            </a>
          ))}
        </nav>

        <button className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-1.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-purple-500/40">
          Login
        </button>
      </div>
    </header>
  );
}

