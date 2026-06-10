"use client";

import { useState } from "react";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";

import type { ProductVariant } from "@/types";

interface Product {
  id: string; slug: string; name: string; artist: string;
  price: number; compareAt?: number; images: string[];
  category: string; subcategory: string; origin: string;
  stock: number; description: string;
  dimensions: string; medium: string; year: string;
}

interface Props {
  product: Product;
  related: Product[];
  variants?: ProductVariant[];
}

export default function ProductClient({ product, related, variants = [] }: Props) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: "var(--bg)" }}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <p className="font-body text-xs tracking-wider" style={{ color: "var(--text-faint)" }}>
          <a href="/" className="hover:text-gold-theme transition-colors">Home</a>
          <span className="mx-2">·</span>
          <a href={`/shop/${product.category}`} className="hover:text-gold-theme transition-colors capitalize">
            {product.category.replace("-", " ")}
          </a>
          <span className="mx-2">·</span>
          <span style={{ color: "var(--text-muted)" }}>{product.name}</span>
        </p>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          <ImageGallery
            images={product.images}
            name={product.name}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
          />
          <ProductInfo product={product} variants={variants} />
        </div>

        {/* Tabs — description, details, shipping */}
        <div className="mt-20">
          <ProductTabs product={product} />
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <RelatedProducts products={related} />
      )}
    </div>
  );
}
