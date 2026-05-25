import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trash2, ShoppingCart, X, ChevronRight, ShieldCheck, Check } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { products } from "@/data/products";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho de Compras — Panini Copa 2026" },
      { name: "description", content: "Itens no seu carrinho." },
    ],
  }),
  component: CartPage,
});

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function CartPage() {
  const { items, total, count, removeItem, updateQty, clear } = useCart();

  const recs = products.filter((p) => !items.some((i) => i.id === p.id)).slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <Link to="/" className="text-gray-700 text-lg" aria-label="Voltar">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-base font-semibold text-gray-900">Carrinho</h1>
            <div className="flex items-center gap-3">
              <button onClick={clear} className="text-gray-600" aria-label="Limpar">
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="relative text-gray-700" aria-label="Carrinho">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                  {count}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-3 pt-16">
        {/* items */}
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => {
              const price = Number(item.price.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".")) || 0;
              return (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                  <div className="flex gap-3">
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                      <img src={item.img} alt={item.name} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{item.name}</h3>
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500" aria-label="Remover">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Frete grátis</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col leading-tight">
                          <span className="text-lg font-bold text-gray-900">R$ {fmt(price)}</span>
                        </div>
                        <div className="ml-auto flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
                          <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 flex items-center justify-center text-gray-600" aria-label="Diminuir">−</button>
                          <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 flex items-center justify-center text-gray-600" aria-label="Aumentar">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-10 gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div className="text-gray-500 text-sm leading-snug">Seu carrinho está vazio</div>
            <Link to="/" className="px-4 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-semibold shadow-sm">
              Ver ofertas
            </Link>
          </div>
        )}

        {/* Proteção do cliente */}
        <section className="mt-6">
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 max-w-[480px]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-[#b58200] font-semibold text-[13px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Proteção do cliente</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8c6c00]" />
            </div>
            <ul className="flex flex-wrap gap-x-3.5 gap-y-1.5 m-0 p-0">
              {["Devolução gratuita", "Reembolso automático por danos", "Pagamento seguro", "Cupom por atraso na coleta"].map((t) => (
                <li key={t} className="text-xs font-medium text-black flex items-center min-w-[140px]">
                  <Check className="w-2.5 h-2.5 mr-1.5 text-[#b58200]" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Recomendações */}
        {recs.length > 0 && (
          <section className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Você também pode gostar</h3>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))" }}>
              {recs.map((p) => (
                <div key={p.id} className="bg-white border border-gray-200 rounded-xl shadow-[0_6px_14px_rgba(0,0,0,0.08)] p-2.5 flex flex-col gap-2">
                  <Link to="/produto/$id" params={{ id: p.id }} className="block w-full h-[120px] border border-gray-100 rounded-lg overflow-hidden bg-white">
                    <img src={p.img} alt={p.name} className="w-full h-full object-contain" loading="lazy" />
                  </Link>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="text-[13px] font-bold text-slate-900 leading-snug line-clamp-2">{p.name}</div>
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-1 rounded bg-rose-100 text-rose-600">{p.discount}</span>
                      <span className="inline-flex items-center text-[11px] font-bold px-1.5 py-1 rounded bg-emerald-100 text-emerald-700">Frete grátis</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-600">
                      <span className="text-amber-500">★</span>
                      <span>4.7 | {p.sold}</span>
                    </div>
                    <div className="flex flex-col mt-auto">
                      <span className="text-base text-rose-600 font-bold">{p.price}</span>
                      <span className="text-gray-400 text-xs line-through">{p.old}</span>
                    </div>
                    <Link
                      to="/produto/$id"
                      params={{ id: p.id }}
                      className="mt-1 self-end inline-flex items-center gap-1.5 h-[34px] px-3.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow"
                    >
                      Comprar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)] p-4 z-40">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Total (itens):</span>
            <span className="text-lg font-bold text-gray-900">R$ {fmt(total)}</span>
          </div>
          {items.length === 0 ? (
            <button
              disabled
              className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold text-sm shadow-sm opacity-50"
            >
              Finalizar Compra
            </button>
          ) : (
            <Link
              to="/checkout"
              className="block text-center w-full bg-rose-600 text-white py-3 rounded-lg font-semibold text-sm shadow-sm"
            >
              Finalizar Compra
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}
