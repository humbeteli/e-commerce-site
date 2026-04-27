import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/product";

type CartItem = Product & {
  quantity: number;
};

type Store = {
  cart: CartItem[];
  favorites: number[];

  allProducts: Product[];
  loading: boolean;

  setProducts: (products: Product[]) => void;

  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;

  toggleFavorite: (id: number) => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      cart: [],
      favorites: [],

      allProducts: [],
      loading: true,

      setProducts: (products) =>
        set({
          allProducts: products,
          loading: false,
        }),

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((p) => p.id === product.id);

          if (existing) {
            return {
              cart: state.cart.map((p) =>
                p.id === product.id
                  ? { ...p, quantity: p.quantity + 1 }
                  : p
              ),
            };
          }

          return {
            cart: [...state.cart, { ...product, quantity: 1 }],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((p) => p.id !== id),
        })),

      increaseQty: (id) =>
        set((state) => ({
          cart: state.cart.map((p) =>
            p.id === id ? { ...p, quantity: p.quantity + 1 } : p
          ),
        })),

      decreaseQty: (id) =>
        set((state) => ({
          cart: state.cart
            .map((p) =>
              p.id === id ? { ...p, quantity: p.quantity - 1 } : p
            )
            .filter((p) => p.quantity > 0),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),
    }),
    {
      name: "vendo-store",
    }
  )
);
