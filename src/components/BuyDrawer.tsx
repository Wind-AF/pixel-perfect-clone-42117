import { useState } from "react";
import { X, Maximize2, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/data/products";

export function BuyDrawer({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!open) return null;

  const handleBuy = () => {
    addItem({ id: product.id, name: product.name, img: product.img, price: product.price }, qty);
    toast.success("Adicionado ao carrinho", {
      icon: <Check className="w-4 h-4 text-emerald-500" />,
      duration: 1800,
    });
    setQty(1);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] bg-white rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* top: image + price */}
        <div className="p-4 flex items-start gap-3 relative">
          <div className="w-24 h-24 rounded-lg border border-gray-200 bg-white flex items-center justify-center shrink-0 shadow-sm">
            <img src={product.img} alt={product.name} className="w-full h-full object-contain p-1" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">-87%</span>
              <span className="text-rose-500 font-bold text-lg">{product.price}</span>
            </div>
            <h3 className="font-semibold text-sm mt-1 leading-tight">{product.name}</h3>
            <div className="text-gray-400 text-xs line-through mt-0.5">{product.old}</div>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-gray-400 absolute right-3 top-3">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Variações */}
        <div className="px-4 pt-2">
          <h4 className="font-bold text-base">Variações</h4>
          <div className="text-gray-700 text-sm mt-3">Cor</div>
          <div className="mt-2">
            <div className="inline-block border-2 border-rose-300 rounded-xl p-2 w-[160px]">
              <div className="relative bg-gray-50 rounded-lg aspect-square flex items-center justify-center">
                <button
                  aria-label="Ampliar"
                  className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-gray-500"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
                <img src={product.img} alt={product.name} className="w-full h-full object-contain p-2" />
              </div>
              <div className="text-center font-semibold text-sm mt-2 leading-tight px-1">
                {product.name}
              </div>
            </div>
          </div>
        </div>

        {/* Quantidade */}
        <div className="px-4 pt-5 pb-4 flex items-center justify-between">
          <span className="font-semibold text-sm uppercase tracking-wide">Quantidade</span>
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 text-lg text-gray-700"
              aria-label="Diminuir"
            >
              −
            </button>
            <span className="w-10 text-center text-sm">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 text-lg text-gray-700"
              aria-label="Aumentar"
            >
              +
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-gray-100 px-4 py-3 pb-6">
          <button
            onClick={handleBuy}
            className="w-full h-12 rounded-full bg-rose-500 text-white text-base font-bold tracking-wide"
          >
            COMPRAR AGORA
          </button>
        </div>
      </div>
    </div>
  );
}
