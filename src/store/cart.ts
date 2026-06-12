import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    variantId?: string,
    selectedDimension?: string,
    priceAtPurchase?: number
  ) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const syncCart = async (items: any[]) => {
  try {
    // Attempt to sync. API will return 401 if user is not logged in, which we ignore.
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
  } catch (err) {
    // Silently ignore sync errors (e.g. offline, not authenticated)
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variantId, selectedDimension, priceAtPurchase) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && i.variantId === variantId
          );
          let newItems;
          if (existing) {
            newItems = state.items.map((i) =>
              i.product.id === product.id && i.variantId === variantId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
          } else {
            newItems = [
              ...state.items,
              {
                product,
                quantity,
                variantId,
                selectedDimension,
                priceAtPurchase,
              },
            ];
          }
          syncCart(newItems);
          return { items: newItems };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => {
          const newItems = state.items.filter(
            (i) => !(i.product.id === productId && i.variantId === variantId)
          );
          syncCart(newItems);
          return { items: newItems };
        });
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity < 1) return get().removeItem(productId, variantId);
        set((state) => {
          const newItems = state.items.map((i) =>
            i.product.id === productId && i.variantId === variantId
              ? { ...i, quantity }
              : i
          );
          syncCart(newItems);
          return { items: newItems };
        });
      },

      clearCart: () => {
        set({ items: [] });
        syncCart([]);
      },

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + (i.priceAtPurchase ?? i.product.price) * i.quantity,
          0
        ),
    }),
    {
      name: "daddyprince-cart",
    }
  )
);
