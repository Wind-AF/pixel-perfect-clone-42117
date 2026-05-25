import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  img: string;
  price: string;
  qty: number;
};

const KEY = "cart-v1";
const EVT = "cart-updated";

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

  const count = items.reduce((s, i) => s + i.qty, 0);
  return { items, count, addItem };
}
