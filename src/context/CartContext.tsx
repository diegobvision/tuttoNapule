"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Cart } from "@/lib/shopify/types";
import { trackViewCart } from "@/lib/analytics";

const CART_ID_KEY = "tuttonapule_cart_id";

interface CartContextValue {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  totalQuantity: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<boolean>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

async function cartRequest(body: Record<string, unknown>): Promise<Cart | null> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Cart request failed: ${res.status}`);
  const data = (await res.json()) as { cart: Cart | null };
  return data.cart;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cartId = useRef<string | null>(null);

  const persist = useCallback((next: Cart | null) => {
    setCart(next);
    if (next?.id) {
      cartId.current = next.id;
      localStorage.setItem(CART_ID_KEY, next.id);
    } else {
      cartId.current = null;
      localStorage.removeItem(CART_ID_KEY);
    }
  }, []);

  // Hydrate an existing cart on first mount.
  useEffect(() => {
    const stored = localStorage.getItem(CART_ID_KEY);
    if (!stored) return;
    cartId.current = stored;
    (async () => {
      try {
        const res = await fetch(`/api/cart?cartId=${encodeURIComponent(stored)}`);
        const data = (await res.json()) as { cart: Cart | null };
        if (data.cart) setCart(data.cart);
        else persist(null); // expired
      } catch {
        /* ignore — keep empty cart */
      }
    })();
  }, [persist]);

  const openCart = useCallback(() => {
    setIsOpen(true);
    if (cart && cart.totalQuantity > 0) trackViewCart(cart);
  }, [cart]);

  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    async (merchandiseId: string, quantity = 1): Promise<boolean> => {
      setIsLoading(true);
      try {
        const next = await cartRequest({
          action: "add",
          cartId: cartId.current ?? undefined,
          merchandiseId,
          quantity,
        });
        persist(next);
        setIsOpen(true);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [persist]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cartId.current) return;
      setIsLoading(true);
      try {
        const next = await cartRequest({
          action: quantity <= 0 ? "remove" : "update",
          cartId: cartId.current,
          lineId,
          quantity,
        });
        persist(next);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [persist]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cartId.current) return;
      setIsLoading(true);
      try {
        const next = await cartRequest({ action: "remove", cartId: cartId.current, lineId });
        persist(next);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [persist]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isOpen,
      isLoading,
      totalQuantity: cart?.totalQuantity ?? 0,
      openCart,
      closeCart,
      addItem,
      updateItem,
      removeItem,
    }),
    [cart, isOpen, isLoading, openCart, closeCart, addItem, updateItem, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>.");
  return ctx;
}
