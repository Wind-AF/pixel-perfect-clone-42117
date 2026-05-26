import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  img: string;
  price: string;
  qty: number;
};

const KEY = "cart-v2";
const EVT = "cart-updated";
const ADD_EVT = "cart-added";

const read = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

const write = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVT));
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addItem = (item: Omit<CartItem, "qty">, qty = 1) => {
    const current = read();
    const idx = current.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      current[idx].qty += qty;
    } else {
      current.push({ ...item, qty });
    }
    write(current);
  };

  const removeItem = (id: string) => {
    write(read().filter((i) => i.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    const current = read();
    const idx = current.findIndex((i) => i.id === id);
    if (idx >= 0) {
      current[idx].qty = qty;
      write(current);
    }
  };

  const clear = () => write([]);

  const parsePrice = (p: string) =>
    Number(p.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".")) || 0;

  const total = items.reduce((s, i) => s + parsePrice(i.price) * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { items, count, total, addItem, removeItem, updateQty, clear };
}
