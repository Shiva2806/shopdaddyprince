"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Bot,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/utils/cn";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/agent", label: "AI Agent", icon: Bot },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-brown border-r border-gold/10 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gold/10 flex items-center gap-3">
        <img
          src="/favicon.ico"
          alt="Daddy Prince Logo"
          className="w-8 h-8 object-contain"
        />
        <div>
          <p className="font-display text-xl text-gold tracking-widest uppercase leading-none">
            Daddy Prince
          </p>
          <p className="font-body text-[10px] text-cream/30 tracking-widest uppercase mt-1">
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
                  ? "bg-gold/10 text-gold"
                  : "text-cream/50 hover:text-cream hover:bg-white/5"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-gold/10">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-body text-cream/40 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
