"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CATEGORIES, type ProductCategory } from "@/types";
import ShopSidebar from "./ShopSidebar";
import ProductGrid from "./ProductGrid";
import ShopHeader from "./ShopHeader";
import { SlidersHorizontal, X } from "lucide-react";

interface UIProduct {
  id: string;
  slug: string;
  name: string;
  artist: string;
  price: number;
  compareAt?: number;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  origin: string;
  stock: number;
  description: string;
  dimensions: string;
  medium: string;
  year: string;
}

interface Props {
  category: ProductCategory;
  initialProducts: UIProduct[];
  activeSub?: string;
  activeSort: string;
}

export default function ShopClient({ category, initialProducts = [], activeSub, activeSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const catInfo = CATEGORIES[category];

  // Filter + sort
  const products = useMemo(() => {
    let list = initialProducts;
    if (activeSub) {
      list = list.filter((p) => p.subcategory.toLowerCase() === activeSub.toLowerCase());
    }
    if (activeSort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (activeSort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [initialProducts, activeSub, activeSort]);

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "var(--bg)" }}>
      {/* Page header */}
      <ShopHeader
        label={catInfo.label}
        count={products.length}
        activeSort={activeSort}
        onSort={(val) => setParam("sort", val)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex gap-8 mt-8">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <ShopSidebar
              category={category}
              subcategories={catInfo.subcategories}
              activeSub={activeSub}
              onSubChange={(sub) => setParam("sub", sub)}
            />
          </aside>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
              <div
                className="relative w-72 h-full overflow-y-auto p-6 shadow-2xl"
                style={{ backgroundColor: "var(--bg-card)" }}
              >
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={20} />
                </button>
                <ShopSidebar
                  category={category}
                  subcategories={catInfo.subcategories}
                  activeSub={activeSub}
                  onSubChange={(sub) => { setParam("sub", sub); setSidebarOpen(false); }}
                />
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
