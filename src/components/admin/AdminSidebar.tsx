"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/utils/cn";
import ThemeToggle from "@/components/layout/ThemeToggle";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/agent", label: "AI Agent", icon: Bot },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[var(--border)] flex items-center gap-3">
        <img
          src="/favicon.png"
          alt="Daddy Prince Logo"
          className="w-8 h-8 object-contain"
        />
        <div>
          <p className="font-display text-xl text-[var(--gold)] tracking-widest uppercase leading-none">
            Daddy Prince
          </p>
          <p className="font-body text-[10px] text-[var(--text-faint)] tracking-widest uppercase mt-1">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-body tracking-wide transition-all duration-150",
                active
                  ? "bg-[var(--gold-glow)] text-[var(--gold)] border border-[var(--gold)]/20"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--gold-glow)]/5"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom controls: Sign out & Theme Toggle */}
      <div className="px-3 py-4 border-t border-[var(--border)] flex items-center justify-between gap-2">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-body text-[var(--text-faint)] hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
        <ThemeToggle />
      </div>
    </aside>
  );
}
