'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, Search, Menu, X, ShieldCheck, User } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'الوحدات المعتمدة', href: '/units' },
    { label: 'حاسبة التنازل', href: '/calculator' },
    { label: 'كيف تعمل المنصة', href: '/how-it-works' },
    { label: 'الأسئلة الشائعة', href: '/faq' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Right side in RTL: Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
                ع
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-surface-900 tracking-tight">عقار إكزت</span>
                <span className="text-[10px] text-surface-500 font-bold -mt-0.5">منصة التنازل العقاري بدون أوفر</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-surface-700">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-1 transition-colors ${
                      isActive ? 'text-brand-700 border-b-2 border-brand-700 font-extrabold' : 'hover:text-brand-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Left side in RTL: Action Buttons & Dashboards */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Portal Switcher Pills */}
            <div className="flex items-center bg-surface-100 p-1 rounded-xl text-[11px] font-bold text-surface-700 border border-surface-200/80">
              <Link
                href="/seller/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname.startsWith('/seller') ? 'bg-white text-surface-900 shadow-2xs font-extrabold' : 'hover:text-surface-900'
                }`}
              >
                بوابة البائع
              </Link>
              <Link
                href="/buyer/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname.startsWith('/buyer') ? 'bg-white text-surface-900 shadow-2xs font-extrabold' : 'hover:text-surface-900'
                }`}
              >
                بوابة المشتري
              </Link>
              <Link
                href="/admin/cases"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname.startsWith('/admin') ? 'bg-white text-surface-900 shadow-2xs font-extrabold' : 'hover:text-surface-900'
                }`}
              >
                الإدارة
              </Link>
            </div>

            {/* Primary CTA (matching Image 1 'أضف عقارك') */}
            <Link
              href="/seller/new-case"
              className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>اعرض وحدتك للتخارج</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-surface-600 hover:bg-surface-100"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-surface-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-surface-200 px-4 py-5 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-surface-700 hover:bg-surface-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-surface-100 space-y-2">
            <Link
              href="/seller/new-case"
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-700 text-white text-xs font-bold py-3 rounded-xl shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>اعرض وحدتك للتخارج (مجاناً)</span>
            </Link>

            <div className="grid grid-cols-3 gap-1 pt-1 text-center text-[11px] font-bold">
              <Link
                href="/seller/dashboard"
                onClick={() => setMobileOpen(false)}
                className="py-2 bg-surface-100 rounded-lg text-surface-700"
              >
                لوحة البائع
              </Link>
              <Link
                href="/buyer/dashboard"
                onClick={() => setMobileOpen(false)}
                className="py-2 bg-surface-100 rounded-lg text-surface-700"
              >
                لوحة المشتري
              </Link>
              <Link
                href="/admin/cases"
                onClick={() => setMobileOpen(false)}
                className="py-2 bg-surface-100 rounded-lg text-surface-700"
              >
                لوحة الإدارة
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
