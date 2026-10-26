'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Building2,
  FolderOpen,
  CheckSquare,
  Handshake,
  ShieldCheck,
  History,
  Bookmark,
  SlidersHorizontal,
  PlusCircle,
  Menu,
  X,
  Search,
  Bell,
  User,
  ArrowRightLeft,
} from 'lucide-react';

export type UserRoleContext = 'seller' | 'buyer' | 'admin';

export interface AppShellProps {
  children: React.ReactNode;
  activeRole: UserRoleContext;
  pageTitle: string;
  pageSubtitle?: string;
  primaryAction?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
}

export function AppShell({
  children,
  activeRole,
  pageTitle,
  pageSubtitle,
  primaryAction,
}: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation configurations per role
  const navigationByRole = {
    seller: [
      { label: 'نظرة عامة', href: '/seller/dashboard', icon: LayoutDashboard },
      { label: 'وحداتي المعروضة', href: '/seller/dashboard', icon: Building2 },
      { label: 'طلب تنازل جديد', href: '/seller/new-case', icon: PlusCircle },
      { label: 'الكتالوج العام', href: '/units', icon: Search },
    ],
    buyer: [
      { label: 'نظرة عامة', href: '/buyer/dashboard', icon: LayoutDashboard },
      { label: 'الوحدات المحفوظة', href: '/buyer/dashboard#saved', icon: Bookmark },
      { label: 'طلبات الاهتمام', href: '/buyer/dashboard#leads', icon: FileText },
      { label: 'الصفقات الجارية', href: '/buyer/dashboard#deals', icon: Handshake },
      { label: 'تفضيلات الميزانية', href: '/buyer/dashboard#preferences', icon: SlidersHorizontal },
      { label: 'تصفح الكتالوج', href: '/units', icon: Search },
    ],
    admin: [
      { label: 'نظرة عامة والفرز', href: '/admin/cases', icon: LayoutDashboard },
      { label: 'جدول الحالات', href: '/admin/cases', icon: FolderOpen },
      { label: 'متابعة الصفقات', href: '/admin/deals', icon: Handshake },
      { label: 'سجل التدقيق', href: '/admin/audit-logs', icon: History },
      { label: 'الكتالوج العام', href: '/units', icon: Search },
    ],
  };

  const navItems = navigationByRole[activeRole] || navigationByRole.seller;

  // Active role badge labels
  const roleBadges: Record<UserRoleContext, { name: string; userDesc: string }> = {
    seller: { name: 'بوابة البائع', userDesc: 'أحمد محمد (مالك وحدة)' },
    buyer: { name: 'بوابة المشتري', userDesc: 'عمر فاروق (مشتري معتمد)' },
    admin: { name: 'إدارة العمليات', userDesc: 'فريق الفحص والتدقيق' },
  };

  return (
    <div className="min-h-screen flex bg-surface-50 font-sans" dir="rtl">
      {/* Desktop Sidebar (RTL: right side) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-l border-surface-200 shrink-0 sticky top-0 h-screen z-30">
        {/* Brand Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-surface-100">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white font-black text-lg shadow-xs group-hover:scale-105 transition-transform">
              ع
            </div>
            <div>
              <span className="text-xl font-black text-surface-900 block leading-none">عقار إكزت</span>
              <span className="text-[10px] text-surface-400 font-bold mt-1 block">Aqar Exit Platform</span>
            </div>
          </Link>
        </div>

        {/* Current Active Role Card */}
        <div className="p-4 mx-4 mt-4 bg-surface-50 rounded-2xl border border-surface-200/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-brand-800 bg-brand-100 px-2.5 py-0.5 rounded-full">
              {roleBadges[activeRole].name}
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-xs font-bold text-surface-800 truncate">
            {roleBadges[activeRole].userDesc}
          </div>

          {/* Quick Role Switcher (Simulator for testing all portals) */}
          <div className="mt-3 pt-2.5 border-t border-surface-200/60 flex items-center justify-between text-[11px]">
            <span className="text-surface-400">تبديل الواجهة:</span>
            <div className="flex gap-1">
              <Link
                href="/seller/dashboard"
                className={`px-1.5 py-0.5 rounded-md font-bold ${
                  activeRole === 'seller' ? 'bg-brand-700 text-white' : 'text-surface-600 hover:bg-surface-200'
                }`}
                title="لوحة البائع"
              >
                بائع
              </Link>
              <Link
                href="/buyer/dashboard"
                className={`px-1.5 py-0.5 rounded-md font-bold ${
                  activeRole === 'buyer' ? 'bg-brand-700 text-white' : 'text-surface-600 hover:bg-surface-200'
                }`}
                title="لوحة المشتري"
              >
                مشتري
              </Link>
              <Link
                href="/admin/cases"
                className={`px-1.5 py-0.5 rounded-md font-bold ${
                  activeRole === 'admin' ? 'bg-brand-700 text-white' : 'text-surface-600 hover:bg-surface-200'
                }`}
                title="لوحة العمليات"
              >
                إدارة
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-800 border border-brand-200/80 shadow-2xs'
                    : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-700' : 'text-surface-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Utility */}
        <div className="p-4 border-t border-surface-100 text-xs">
          <Link
            href="/"
            className="flex items-center justify-between text-surface-500 hover:text-brand-800 py-2 px-3 rounded-xl hover:bg-surface-50 transition-colors"
          >
            <span>الصفحة الرئيسية للموقع</span>
            <span>↗</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-surface-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-surface-600 hover:bg-surface-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <h1 className="text-lg sm:text-xl font-black text-surface-900 leading-tight">
                {pageTitle}
              </h1>
              {pageSubtitle && (
                <p className="text-xs text-surface-400 hidden sm:block mt-0.5">{pageSubtitle}</p>
              )}
            </div>
          </div>

          {/* Right side search and actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search input with shortcut hint */}
            <div className="relative hidden md:block w-64">
              <Search className="w-4 h-4 text-surface-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="بحث سريع برقم القيد أو المشروع..."
                className="w-full text-xs pr-9 pl-10 py-2 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:outline-hidden focus:border-brand-500 transition-colors"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-surface-400 bg-surface-200/60 px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </div>

            {/* Notification bell */}
            <button
              type="button"
              className="p-2 rounded-xl text-surface-500 hover:bg-surface-50 border border-surface-200 relative"
              title="الإشعارات"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-brand-600 absolute top-1.5 right-1.5" />
            </button>

            {/* Primary Action Button */}
            {primaryAction && (
              <Link
                href={primaryAction.href}
                className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
              >
                {primaryAction.icon || <PlusCircle className="w-4 h-4" />}
                <span>{primaryAction.label}</span>
              </Link>
            )}
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-surface-200 p-4 space-y-2">
            <div className="text-xs font-bold text-surface-400 px-3 pb-1 border-b border-surface-100">
              قائمة التنقل ({roleBadges[activeRole].name})
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-surface-700 hover:bg-surface-50"
                >
                  <Icon className="w-4 h-4 text-surface-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-surface-100 flex gap-2">
              <Link
                href="/seller/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-1.5 bg-surface-100 rounded-lg text-xs font-bold text-surface-700"
              >
                لوحة البائع
              </Link>
              <Link
                href="/buyer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-1.5 bg-surface-100 rounded-lg text-xs font-bold text-surface-700"
              >
                لوحة المشتري
              </Link>
              <Link
                href="/admin/cases"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-1.5 bg-surface-100 rounded-lg text-xs font-bold text-surface-700"
              >
                لوحة الإدارة
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard Page Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
