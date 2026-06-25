/**
 * Google Analytics 4 (GA4) Ecommerce Tracking Library
 * Following GA4 Ecommerce and standard event guidelines.
 */

// Helper to convert paise to standard currency units (Rupees)
const toRupees = (paise: number): number => {
  return paise / 100;
};

// 1. View Item (Product detail page view)
export const trackViewItem = (product: any, selectedVariant?: any) => {
  if (typeof window === "undefined" || !window.gtag) return;
  const price = toRupees(selectedVariant?.sale_price ?? selectedVariant?.price ?? product.price);
  window.gtag("event", "view_item", {
    currency: "INR",
    value: price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: price,
        item_brand: product.artist || "Daddy Prince",
        item_category: product.category || (product.categories?.[0]) || "Catalog",
        item_subcategory: product.subcategory || "",
        item_variant: selectedVariant?.dimension || selectedVariant?.color || undefined,
        quantity: 1
      }
    ]
  });
};

// 2. View Item List (Product grids / list views)
export const trackViewItemList = (products: any[], listName: string = "Product List") => {
  if (typeof window === "undefined" || !window.gtag || !products || products.length === 0) return;
  window.gtag("event", "view_item_list", {
    item_list_name: listName,
    items: products.slice(0, 10).map((p, idx) => ({
      item_id: p.id,
      item_name: p.name,
      price: toRupees(p.price),
      item_brand: p.artist || "Daddy Prince",
      item_category: p.category || (p.categories?.[0]) || "Catalog",
      item_subcategory: p.subcategory || "",
      index: idx + 1
    }))
  });
};

// 3. Add To Cart
export const trackAddToCart = (product: any, quantity: number = 1, selectedVariant?: any) => {
  if (typeof window === "undefined" || !window.gtag) return;
  const price = toRupees(selectedVariant?.sale_price ?? selectedVariant?.price ?? product.price);
  window.gtag("event", "add_to_cart", {
    currency: "INR",
    value: price * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: price,
        item_brand: product.artist || "Daddy Prince",
        item_category: product.category || (product.categories?.[0]) || "Catalog",
        item_subcategory: product.subcategory || "",
        item_variant: selectedVariant?.dimension || selectedVariant?.color || undefined,
        quantity: quantity
      }
    ]
  });
};

// 4. Begin Checkout
export const trackBeginCheckout = (cartItems: any[]) => {
  if (typeof window === "undefined" || !window.gtag || !cartItems || cartItems.length === 0) return;
  
  const totalValue = cartItems.reduce((sum, item) => {
    const itemPrice = item.priceAtPurchase ?? item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  window.gtag("event", "begin_checkout", {
    currency: "INR",
    value: toRupees(totalValue),
    items: cartItems.map((item) => {
      const p = item.product;
      const price = toRupees(item.priceAtPurchase ?? p.price);
      return {
        item_id: p.id,
        item_name: p.name,
        price: price,
        item_brand: p.artist || "Daddy Prince",
        item_category: p.categories?.[0] || "Catalog",
        item_subcategory: p.subcategory || "",
        item_variant: item.selectedDimension || undefined,
        quantity: item.quantity
      };
    })
  });
};

// 5. Purchase (Order confirmation)
export const trackPurchase = (order: any) => {
  if (typeof window === "undefined" || !window.gtag || !order) return;
  
  window.gtag("event", "purchase", {
    transaction_id: order.id,
    value: toRupees(order.total),
    tax: 0,
    shipping: toRupees(order.shipping || 0),
    currency: "INR",
    items: order.items.map((item: any) => ({
      item_id: item.product_id,
      item_name: item.product_name,
      price: toRupees(item.price),
      item_brand: "Daddy Prince",
      quantity: item.quantity,
      item_variant: item.selected_dimension || undefined
    }))
  });
};

// 6. Search
export const trackSearch = (searchTerm: string) => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "search", {
    search_term: searchTerm
  });
};

// 7. Sign Up
export const trackSignUp = (method: string = "email") => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "sign_up", {
    method: method
  });
};

// 8. Login
export const trackLogin = (method: string = "email") => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "login", {
    method: method
  });
};
