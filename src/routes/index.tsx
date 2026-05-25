import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronLeft, Search, ChevronRight, List, ArrowDownAZ, X } from "lucide-react";
import logo from "@/assets/logo.webp";
import bilhete from "@/assets/bilhete.png";
import carrinho from "@/assets/carrinho.png";
import compartilhar from "@/assets/compartilhar.png";
import { products } from "@/data/products";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/")({
  component: Index,
});

const tabs = ["Página inicial", "Produtos", "Categorias"] as const;
const filters = ["Recomendado", "Mais vendidos", "Lançamentos"] as const;

function Index() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Produtos");
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Recomendado");
  const [following, setFollowing] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [countdown, setCountdown] = useState({ h: 23, m: 59, s: 58 });
  const { count: cartCount } = useCart();

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((c) => {
        let { h, m, s } = c;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="min-h-screen bg-white text-gray-800 text-sm max-w-[500px] mx-auto shadow-sm">
      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={() => setShowPopup(false)}>
          <div className="relative w-full max-w-[340px]" onClick={(e) => e.stopPropagation()}>
            <button
              aria-label="Fechar"
              onClick={() => setShowPopup(false)}
              className="absolute -top-10 right-0 text-rose-500"
            >
              <X className="w-7 h-7" strokeWidth={3} />
            </button>
            <h2 className="text-center text-yellow-400 font-extrabold text-xl tracking-wide mb-3" style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.15)" }}>
              COMECE COLECIONANDO
            </h2>
            <div className="bg-rose-500 rounded-2xl p-1.5 shadow-xl">
              <div className="bg-white rounded-xl px-6 pt-7 pb-6 text-center">
                <div className="text-5xl font-extrabold text-gray-900 leading-none">70% OFF</div>
                <div className="text-rose-500 font-semibold mt-3 text-base">no seu pedido!</div>
                <p className="text-gray-700 text-sm mt-5 leading-snug">
                  Você pode começar o ano<br />com um novo hobby.
                </p>
                <p className="text-gray-700 text-sm mt-3 leading-snug">
                  Aproveita: Albuns estão com 70% OFF.
                </p>
              </div>
              <div className="text-center text-white font-bold py-3 text-sm">
                Termina em {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full bg-white text-rose-500 font-bold py-3 rounded-b-xl text-base"
              >
                Resgatar agora
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2 flex-1">
            <button aria-label="Voltar" className="text-gray-700">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="relative flex-1 max-w-[240px] ml-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Pesquisar"
                className="bg-gray-100 rounded pl-8 pr-3 py-1.5 w-full outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mr-1">
            <button aria-label="Compartilhar">
              <img src={compartilhar} alt="Compartilhar" width={22} height={22} />
            </button>
            <button aria-label="Carrinho" className="relative">
              <img src={carrinho} alt="Carrinho" width={22} height={22} />
              <span className="absolute -top-2 -right-3 flex w-5 h-5 bg-rose-600 text-white items-center justify-center rounded-full text-[10px] font-bold">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Store info */}
      <section className="bg-white">
        <div className="flex justify-between items-center px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Panini" width={64} height={64} className="w-16 h-16 rounded-full object-cover border-2 border-transparent" />
            <div className="flex flex-col leading-tight">
              <h1 className="font-semibold text-base">Album 2026</h1>
              <span className="text-[12px] text-gray-600">99.176 vendido(s)</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => setFollowing((v) => !v)}
              className={`w-[92px] px-4 py-1.5 text-xs font-semibold rounded-md shadow-sm transition-colors ${
                following
                  ? "bg-gray-100 text-gray-700 border border-gray-200"
                  : "bg-rose-600 text-white"
              }`}
            >
              {following ? "Seguindo" : "Seguir"}
            </button>
            <button className="w-[92px] px-4 py-1.5 border border-gray-200 text-xs font-semibold rounded-md">Mensagem</button>
          </div>
        </div>

        {/* Frete promo */}
        <div className="px-4 pb-2">
          <div className="rounded-2xl p-3 border border-gray-100 shadow-sm" style={{ background: "linear-gradient(180deg,#fff,#fff5f7)" }}>
            <div className="flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-wide text-gray-900">
              <span>Oferta termina em</span>
              <strong className="bg-gray-900 text-white px-2.5 py-1 rounded-full text-[12px]">17:35</strong>
            </div>
            <div className="mt-2 text-[12px] font-semibold text-gray-700">
              Faltam R$ 120,00 para liberar o frete grátis.
            </div>
            <div className="mt-2 h-1.5 bg-rose-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500" style={{ width: "0%" }} />
            </div>
            <div className="mt-1 text-[11px] text-gray-500">R$ 0,00 / R$ 120,00</div>
            <button disabled className="mt-2 w-full bg-gray-100 text-gray-400 text-xs font-semibold py-2 rounded-md cursor-not-allowed">
              Resgatar frete grátis
            </button>
          </div>
        </div>

        {/* Coupons */}
        <div className="px-4 pb-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-between gap-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-lg border border-cyan-100 min-w-[260px] flex-shrink-0">
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-xs">Cupom de frete grátis</span>
                <span className="text-[11px] text-cyan-600">Sem gasto mínimo</span>
              </div>
              <button disabled className="px-3 py-1 text-[11px] font-bold rounded-md bg-gray-200 text-gray-500">Resgatar</button>
            </div>
            <div className="flex items-center justify-between gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-lg border border-rose-100 min-w-[260px] flex-shrink-0">
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-xs">Até 85% OFF</span>
                <span className="text-[11px] text-rose-500">Em produtos selecionados</span>
              </div>
              <button className="px-3 py-1 text-[11px] font-bold rounded-md bg-rose-600 text-white">Resgatar</button>
            </div>
          </div>
        </div>

        <div className="h-[5px] bg-gray-100 w-full" />
      </section>

      {/* Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="flex text-center">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition ${
                activeTab === t ? "border-gray-900 text-gray-900 font-semibold" : "border-transparent text-gray-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </nav>

      {/* Filter bar */}
      <div className="flex items-center px-3 py-2 text-sm border-b border-gray-100">
        <div className="flex flex-1 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-3 border-r border-gray-200 ${
                activeFilter === f ? "text-black font-semibold" : "text-gray-500"
              }`}
            >
              {f}
            </button>
          ))}
          <button className="px-3 text-gray-500 whitespace-nowrap flex items-center gap-1">
            Preço <ArrowDownAZ className="w-3.5 h-3.5" />
          </button>
        </div>
        <button aria-label="Alterar visualização" className="pl-2 text-gray-900">
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* Product list */}
      <main className="p-3 space-y-4 bg-white">
        {products.map((p) => (
          <article key={p.id} className="w-full bg-white flex flex-row rounded-lg">
            <Link to="/produto/$id" params={{ id: p.id }} className="flex-shrink-0 mr-3 w-[110px] h-[120px]">
              <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-contain" />
            </Link>
            <div className="flex flex-col justify-between flex-1 min-w-0 pb-2 min-h-[120px]">
              <div className="flex flex-col gap-1">
                <Link to="/produto/$id" params={{ id: p.id }} className="text-gray-900 text-xs font-semibold truncate">{p.name}</Link>
                <div className="flex flex-row gap-1 items-center flex-wrap">
                  <span className="bg-rose-100 text-rose-600 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <img src={bilhete} alt="" width={12} height={12} style={{ filter: "brightness(0) saturate(100%) invert(28%) sepia(94%) saturate(2913%) hue-rotate(330deg) brightness(95%) contrast(101%)" }} />
                    {p.discount}
                  </span>
                  <span className="bg-cyan-100 text-cyan-600 text-[11px] font-bold px-2 py-0.5 rounded">
                    Frete grátis
                  </span>
                </div>
                <div className="flex flex-row gap-1 items-center">
                  <span className="text-yellow-400 text-xs">★</span>
                  <span className="text-gray-700 text-[11px]">{p.rating} | {p.sold}</span>
                </div>
              </div>
              <div className="flex items-end justify-between mt-1">
                <div className="flex flex-col">
                  <span className="text-rose-500 text-base font-bold leading-tight">{p.price}</span>
                  <span className="text-gray-400 text-xs line-through">{p.old}</span>
                </div>
                <div className="flex items-center ml-2">
                  <Link to="/produto/$id" params={{ id: p.id }} aria-label="Adicionar" className="bg-rose-100 text-rose-600 h-8 px-3 flex items-center justify-center rounded-l-md">
                    <img src={carrinho} alt="" width={14} height={14} style={{ filter: "brightness(0) saturate(100%) invert(28%) sepia(94%) saturate(2913%) hue-rotate(330deg) brightness(95%) contrast(101%)" }} />
                  </Link>
                  <Link to="/produto/$id" params={{ id: p.id }} className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold h-8 px-3 flex items-center rounded-r-md">
                    Comprar
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
        <div className="text-center text-xs text-gray-400 py-4 flex items-center justify-center gap-1">
          Ver mais produtos <ChevronRight className="w-3 h-3" />
        </div>
      </main>
    </div>
  );
}
