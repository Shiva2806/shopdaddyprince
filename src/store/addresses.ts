import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedAddress {
  id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressStore {
  addresses: SavedAddress[];
  addAddress: (address: Omit<SavedAddress, "id">) => void;
  updateAddress: (id: string, address: Partial<Omit<SavedAddress, "id">>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: [],

      addAddress: (address) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newAddress = { ...address, id };
        
        set((state) => {
          let updatedAddresses = [...state.addresses, newAddress];
          // If this is the first address or marked as default, unset other defaults
          if (address.isDefault || state.addresses.length === 0) {
            newAddress.isDefault = true;
            updatedAddresses = updatedAddresses.map((addr) =>
              addr.id === id ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
            );
          }
          return { addresses: updatedAddresses };
        });
      },

      updateAddress: (id, updatedFields) => {
        set((state) => {
          let updatedAddresses = state.addresses.map((addr) =>
            addr.id === id ? { ...addr, ...updatedFields } : addr
          );

          if (updatedFields.isDefault) {
            updatedAddresses = updatedAddresses.map((addr) =>
              addr.id === id ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
            );
          }
          return { addresses: updatedAddresses };
        });
      },

      deleteAddress: (id) => {
        set((state) => {
          const wasDefault = state.addresses.find((addr) => addr.id === id)?.isDefault;
          const filtered = state.addresses.filter((addr) => addr.id !== id);
          
          // If we deleted the default address and have other addresses left, make the first one default
          if (wasDefault && filtered.length > 0) {
            filtered[0].isDefault = true;
          }
          return { addresses: filtered };
        });
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
          ),
        }));
      },
    }),
    {
      name: "daddyprince-addresses",
    }
  )
);
