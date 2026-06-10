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

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variantId, selectedDimension, priceAtPurchase) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && i.variantId === variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id && i.variantId === variantId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                product,
                quantity,
                variantId,
                selectedDimension,
                priceAtPurchase,
              },
            ],
          };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity < 1) return get().removeItem(productId, variantId);
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.variantId === variantId
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

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
