"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Film,
  Palette,
  CreditCard,
  Gauge,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create New Video", href: "/dashboard/create", icon: PlusCircle, highlight: true },
    { name: "My Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "Generated Clips", href: "/dashboard/clips", icon: Film },
    { name: "Brand Templates", href: "/dashboard/templates", icon: Palette },
    { name: "Usage & Credits", href: "/dashboard/usage", icon: Gauge },
    { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* ── Desktop Sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-200 bg-white select-none shrink-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-zinc-950">
                Casper<span className="text-blue-600">Shorts</span>
              </span>
              <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-400">
                Studio App
              </span>
            </div>
          </Link>
        </div>

        {/* 100% Free Unlocked Banner */}
        <div className="p-4 border-b border-zinc-100">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 p-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> 100% Free Tier
              </span>
              <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                Unlimited
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-tight">
              No credits needed. Unlimited minutes, clips, 4K export, and zero watermarks.
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                    : item.highlight
                    ? "text-blue-600 bg-blue-50/50 hover:bg-blue-100/60"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : item.highlight ? "text-blue-600" : "text-zinc-400"}`} />
                  <span>{item.name}</span>
                </div>
                {item.highlight && !isActive && (
                  <Badge variant="default" className="bg-blue-600 text-[10px] px-1.5 py-0 h-4">
                    New
                  </Badge>
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-zinc-100">
            <Link
              href="/admin"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === "/admin"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <Shield className="h-4 w-4 text-zinc-400" />
              <span>Admin Console</span>
            </Link>
          </div>
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-zinc-100 bg-white">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-900 truncate">{user?.name || "Alex Rivera"}</p>
                <p className="text-[10px] text-zinc-500 truncate">{user?.email || "alex@creator.io"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Layout ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 border-b border-zinc-200/80 bg-white flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Link href="/dashboard" className="hover:text-zinc-900">Dashboard</Link>
              {pathname !== "/dashboard" && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="font-semibold text-zinc-900 capitalize">
                    {pathname.split("/")[2]?.replace("-", " ") || "Page"}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Create Video
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-200 bg-white p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              <Shield className="h-4 w-4" />
              Admin Console
            </Link>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

