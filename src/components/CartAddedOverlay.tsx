import { useEffect, useState } from "react";
import { Check } from "lucide-react";

export function CartAddedOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handler = () => {
      setVisible(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), 1500);
    };
    window.addEventListener("cart-added", handler);
    return () => {
      window.removeEventListener("cart-added", handler);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 bg-black/85 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-150">
        <span className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </span>
        <span className="text-sm font-semibold tracking-wide">Adicionado ao carrinho</span>
      </div>
    </div>
  );
}
