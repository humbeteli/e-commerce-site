import { useState } from "react";
import type { Product, CartItem } from "../types/product";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  const addToCart = (product: Product) => {
    const existing = cart.find((p) => p.id === product.id);

    let updated: CartItem[];

    if (existing) {
      updated = cart.map((p) =>
        p.id === product.id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      );
    } else {
      updated = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return { cart, addToCart };
};
