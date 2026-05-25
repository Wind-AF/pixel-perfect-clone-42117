import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Truck, Star, Video } from "lucide-react";
import iconBack from "@/assets/icon-back.png";
import iconSave from "@/assets/icon-save.png";
import iconRaio from "@/assets/icon-raio.png";
import iconCheck from "@/assets/icon-check.png";
import iconWhats from "@/assets/icon-whatsapp.png";
import iconTelegram from "@/assets/icon-telegram.png";
import iconLink from "@/assets/icon-link.png";
import iconDots from "@/assets/icon-dots.png";
import iconEscudoFill from "@/assets/icon-escudo-fill.png";
import iconGrid from "@/assets/icon-grid.png";
import iconFacebook from "@/assets/icon-facebook.png";
import iconInstagram from "@/assets/icon-instagram.png";
import creatorNandy from "@/assets/creator-nandy.jpg";
import creatorMateus from "@/assets/creator-mateus.jpg";
import reviewerJose from "@/assets/reviewer-jose.jpg";
import reviewerJoyce from "@/assets/reviewer-joyce.jpg";
import reviewerJuan from "@/assets/reviewer-juan.jpg";
import reviewerJuliaRafael from "@/assets/reviewer-juliaerafael.jpg";
import { getProduct, products } from "@/data/products";
import carrinho from "@/assets/carrinho.png";
import carrinho2 from "@/assets/carrinho-2.png";
import compartilhar from "@/assets/compartilhar.png";
import bilhete from "@/assets/bilhete.png";
import bilhete2 from "@/assets/bilhete-2.png";
import setaCima from "@/assets/seta-cima.png";
import creatorAndre from "@/assets/creator-andre.jpg";
import creatorCarla from "@/assets/creator-carla.jpg";
import creatorCalifornices from "@/assets/creator-californices.jpg";
import reviewFoto1 from "@/assets/review-foto-1.png";
import reviewFoto2 from "@/assets/review-foto-2.png";
import reviewFoto3 from "@/assets/review-foto-3.jpg";
import reviewFoto4 from "@/assets/review-foto-4.jpg";
import reviewFoto5 from "@/assets/review-foto-5.jpg";
import reviewFoto6 from "@/assets/review-foto-6.jpg";
import reviewFoto7 from "@/assets/review-foto-7.jpg";
import reviewFoto8 from "@/assets/review-foto-8.jpg";
import reviewFoto9 from "@/assets/review-foto-9.jpg";
import reviewFoto10 from "@/assets/review-foto-10.jpg";
import reviewFoto11 from "@/assets/review-foto-11.jpg";
import reviewFoto12 from "@/assets/review-foto-12.jpg";
import reviewFoto13 from "@/assets/review-foto-13.jpg";
import reviewFoto14 from "@/assets/review-foto-14.jpg";
import reviewFoto15 from "@/assets/review-foto-15.jpg";
import reviewFoto16 from "@/assets/review-foto-16.jpg";
import reviewFoto17 from "@/assets/review-foto-17.jpg";
import reviewFoto18 from "@/assets/review-foto-18.jpg";
import reviewFoto19 from "@/assets/review-foto-19.jpg";
import reviewFoto20 from "@/assets/review-foto-20.jpg";
import reviewFoto21 from "@/assets/review-foto-21.jpg";
import reviewFoto22 from "@/assets/review-foto-22.jpg";
import reviewFoto23 from "@/assets/review-foto-23.jpg";
import reviewFoto24 from "@/assets/review-foto-24.jpg";
import reviewFoto25 from "@/assets/review-foto-25.jpg";
import reviewFoto26 from "@/assets/review-foto-26.jpg";
import reviewFoto27 from "@/assets/review-foto-27.jpg";
import reviewFoto28 from "@/assets/review-foto-28.jpg";
import reviewFoto29 from "@/assets/review-foto-29.jpg";
import reviewFoto30 from "@/assets/review-foto-30.png";
import reviewFoto31 from "@/assets/review-foto-31.jpg";
import reviewFoto32 from "@/assets/review-foto-32.jpg";
import reviewFoto33 from "@/assets/review-foto-33.jpg";
import reviewFoto34 from "@/assets/review-foto-34.jpg";
import reviewFoto35 from "@/assets/review-foto-35.jpg";
import reviewFoto36 from "@/assets/review-foto-36.jpg";
import reviewFoto37 from "@/assets/review-foto-37.jpg";
import reviewFoto38 from "@/assets/review-foto-38.jpg";
import reviewFoto39 from "@/assets/review-foto-39.jpg";
import reviewFoto40 from "@/assets/review-foto-40.jpg";
import reviewFoto41 from "@/assets/review-foto-41.jpg";
import reviewFoto42 from "@/assets/review-foto-42.jpg";
import reviewFoto43 from "@/assets/review-foto-43.jpg";
import reviewFoto44 from "@/assets/review-foto-44.jpg";
import reviewFoto45 from "@/assets/review-foto-45.jpg";
import reviewerLucas from "@/assets/reviewer-lucas.jpg";
import reviewerCamila from "@/assets/reviewer-camila.jpg";
import reviewerBia from "@/assets/reviewer-bia.jpg";
import reviewerPedro from "@/assets/reviewer-pedro.jpg";
import reviewerThiago from "@/assets/reviewer-thiago.jpg";
import reviewerMarcos from "@/assets/reviewer-marcos.jpg";

export const Route = createFileRoute("/produto/$id")({
  component: ProdutoPage,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      Produto não encontrado.{" "}
      <Link to="/" className="text-rose-600 underline">Voltar</Link>
    </div>
  ),
});

const creators = [
  { name: "Carla Maria", img: creatorCarla, video: "/videos/shop.mp4" },
  { name: "Nandy zorzan", img: creatorNandy, video: "/videos/shop-1.mp4" },
  { name: "Califórnices", img: creatorCalifornices, video: "/videos/shop-2.mp4" },
  { name: "Matheus Alberto", img: creatorMateus, video: "/videos/shop-3.mp4" },
  { name: "Andre Arthur", img: creatorAndre, video: "/videos/shop-4.mp4" },
  { name: "Bruna Lopes", img: creatorCarla, video: "/videos/shop-5.mp4" },
  { name: "Leticia Rocha", img: creatorNandy, video: "/videos/shop-6.mp4" },
  { name: "Paula Sant'", img: creatorCalifornices, video: "/videos/shop-7.mp4" },
  { name: "Diego Ramos", img: creatorMateus, video: "/videos/shop-8.mp4" },
];

const reviewPhotos = [reviewFoto1, reviewFoto2, reviewFoto3, reviewFoto4, reviewFoto5, reviewFoto6, reviewFoto7, reviewFoto8, reviewFoto9, reviewFoto10, reviewFoto11, reviewFoto12, reviewFoto13, reviewFoto14, reviewFoto15, reviewFoto16, reviewFoto17, reviewFoto18, reviewFoto19, reviewFoto20, reviewFoto21, reviewFoto22, reviewFoto23, reviewFoto24, reviewFoto25, reviewFoto26, reviewFoto27, reviewFoto28, reviewFoto29, reviewFoto30, reviewFoto31, reviewFoto32, reviewFoto33, reviewFoto34, reviewFoto35, reviewFoto36, reviewFoto37, reviewFoto38, reviewFoto39, reviewFoto40, reviewFoto41];

function ProdutoPage() {
  const [shareOpen, setShareOpen] = useState(false);
  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    }
  };
  const { id } = Route.useParams();
  const router = useRouter();
  const product = getProduct(id);
  const [imgIdx, setImgIdx] = useState(0);
  const [saved, setSaved] = useState(false);

  if (!product) {
    return (
      <div className="p-8 text-center">
        Produto não encontrado.{" "}
        <Link to="/" className="text-rose-600 underline">Voltar</Link>
      </div>
    );
  }

  // For now only one image per product; placeholder array prepared for when user adds more.
  const images = [product.img];

  return (
    <div className="min-h-screen bg-white text-gray-800 text-sm max-w-[500px] mx-auto shadow-sm pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-3">
          <button onClick={() => router.history.back()} aria-label="Voltar" className="text-gray-700">
            <img src={iconBack} alt="" width={18} height={18} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4 mr-1">
            <button aria-label="Compartilhar" onClick={() => setShareOpen(true)}>
              <img src={compartilhar} alt="" width={20} height={20} />
            </button>
            <button aria-label="Carrinho" className="relative">
              <img src={carrinho} alt="" width={20} height={20} />
              <span className="absolute -top-2 -right-3 flex w-4 h-4 bg-rose-500 text-white items-center justify-center rounded-full text-[9px] font-bold">0</span>
            </button>
            <button aria-label="Mais" className="text-gray-700"><img src={iconDots} alt="" width={18} height={18} /></button>
          </div>
        </div>
      </header>

      {/* Product image carousel */}
      <section className="relative bg-white">
        <div className="aspect-square w-full bg-white overflow-hidden relative">
          <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-contain" />
          <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded-full">
            {imgIdx + 1}/{images.length}
          </span>
          {images.length > 1 && (
            <>
              <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 text-xl bg-white/60 rounded-full w-7 h-7 flex items-center justify-center">←</button>
              <button onClick={() => setImgIdx((i) => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xl bg-white/60 rounded-full w-7 h-7 flex items-center justify-center">→</button>
            </>
          )}
        </div>
        <div className="flex justify-center gap-1.5 py-2">
          {images.map((_, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${i === imgIdx ? "bg-rose-500" : "bg-gray-300"}`} />
          ))}
        </div>
      </section>

      {/* Price banner */}
      <section className="px-4 py-2.5" style={{ background: "linear-gradient(90deg,#ff2d55,#ff5e7c)" }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="bg-white text-rose-500 text-[11px] font-bold px-1.5 py-0.5 rounded">-{60}.00%</span>
              <span className="text-white font-bold text-lg leading-none">{product.price}</span>
              <img src={bilhete} alt="" width={18} height={18} style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <span className="text-white/70 text-xs line-through mt-1">{product.old}</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-white text-[11px] font-semibold">
              <img src={iconRaio} alt="" width={11} height={11} style={{ filter: "brightness(0) invert(1)" }} />
              Oferta Relâmpago
            </div>
            <span className="text-white/90 text-xs font-semibold mt-0.5">Termina em 04:43</span>
          </div>
        </div>
      </section>

      {/* Coupons */}
      <section className="px-2 py-1.5 bg-white">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide items-center">
          <img src={bilhete} alt="" width={14} height={14} style={{ filter: "brightness(0) saturate(100%) invert(28%) sepia(94%) saturate(2913%) hue-rotate(330deg) brightness(95%) contrast(101%)" }} />
          <span className="bg-rose-50 text-rose-500 text-[11px] font-bold px-2.5 py-1 rounded whitespace-nowrap">Desconto de 15%, máximo de R$35</span>
          <span className="bg-rose-50 text-rose-500 text-[11px] font-bold px-2.5 py-1 rounded whitespace-nowrap">Cupom válido p/ compras acima R$100</span>
          <span className="bg-rose-50 text-rose-500 text-[11px] font-bold px-2.5 py-1 rounded whitespace-nowrap flex items-center gap-1">Economize 6% <ChevronRight className="w-3 h-3" /></span>
        </div>
      </section>

      {/* Product info */}
      <section className="px-4 pt-2 pb-1">
        <div className="flex justify-between items-start gap-3">
          <h1 className="flex-1 text-base font-semibold leading-tight">{product.name}</h1>
          <button onClick={() => setSaved((v) => !v)} aria-label="Salvar" className="p-1">
            <img src={iconSave} alt="" width={22} height={22} className={saved ? "opacity-100" : "opacity-60"} style={saved ? { filter: "invert(57%) sepia(95%) saturate(2493%) hue-rotate(326deg) brightness(96%) contrast(101%)" } : undefined} />
          </button>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-500">
            5.0 <span className="text-blue-500 font-semibold">(6)</span> {product.sold}
          </span>
        </div>
      </section>

      {/* Shipping */}
      <section className="py-2">
        <div className="px-4 py-2 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-cyan-600" />
            <span className="bg-cyan-50 text-cyan-600 text-[11px] font-semibold px-1.5 rounded">frete grátis</span>
            <span className="text-xs">Receba até 01/06</span>
          </div>
          <span className="text-[11px] text-gray-400 line-through ml-6">Taxa de envio: R$ 20,90</span>
        </div>
        <div className="h-px bg-gray-100 mx-4" />
        <div className="px-4 py-2 flex items-center gap-2">
          <img src={iconCheck} alt="" width={14} height={14} className="opacity-70" />
          <span className="text-xs">Devoluções gratuitas em 30 dias • Cancelamento fácil</span>
        </div>

        {/* Variações */}
        <div className="px-4 py-3 flex items-center gap-3 border-t border-gray-100">
          <img src={iconGrid} alt="" className="w-10 h-10 object-contain p-2 rounded-lg bg-gray-50" />
          <span className="text-gray-500 text-sm flex-1">1 opções disponíveis</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </section>

      {/* Proteção do cliente */}
      <section className="bg-amber-50/60 mx-3 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold">
            <img src={iconEscudoFill} alt="" width={14} height={14} style={{ filter: "invert(54%) sepia(89%) saturate(575%) hue-rotate(2deg) brightness(96%) contrast(94%)" }} />
            Proteção do cliente
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
        </div>
        <ul className="grid grid-cols-2 gap-y-1 text-[11px] text-gray-800">
          {["Devolução gratuita", "Reembolso automático por danos", "Pagamento seguro", "Cupom por atraso na coleta"].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <img src={iconCheck} alt="" width={10} height={10} /> {t}
            </li>
          ))}
        </ul>
      </section>

      {/* Vídeos dos criadores */}
      <section className="px-4 pt-4">
        <div className="flex items-center gap-2 mb-1">
          <Video className="w-4 h-4" />
          <span className="font-semibold text-sm">Vídeos dos criadores</span>
        </div>
        <p className="text-[11px] text-gray-500 mb-2">Conteúdo enviado por quem testou</p>
        <div className="grid grid-cols-3 gap-2">
          {creators.map((c) => (
            <div key={c.name} className="aspect-[3/4] rounded-lg bg-gray-100 relative overflow-hidden">
              <video
                src={c.video}
                poster={c.img}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-1.5">
                <img src={c.img} alt="" className="w-5 h-5 rounded-full border border-white object-cover" />
                <span className="text-white text-[10px] font-semibold truncate drop-shadow">{c.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Avaliações */}
      <section className="px-4 pt-5">
        <div className="text-xs text-gray-600 font-semibold mb-1">Avaliações dos clientes (207)</div>
        <div className="flex items-center gap-1 mb-3">
          <span className="text-lg font-bold">4.7</span>
          <span className="text-xs text-gray-400">/5</span>
          <span className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            ))}
          </span>
        </div>

        {[
          { name: "Gabriel Ferreira", avatar: null, initial: "G", date: "2026-05-17 23:32:27", text: "Gostei demais da compra, qualidade excelente e quantidade certinha. Pra quem curte coleção vale muito a pena 🔥", photos: reviewPhotos },
          { name: "Juan Pablo", avatar: reviewerJuan, date: "2026-05-14 18:05:11", text: "Chegou rapidinho e bem embalado. Recomendo demais, qualidade muito boa!" },
          { name: "Joyce Almeida", avatar: reviewerJoyce, date: "2026-05-10 09:22:48", text: "Amei! Superou minhas expectativas, virei cliente fiel da loja ❤️" },
          { name: "José Henrique", avatar: reviewerJose, date: "2026-05-06 14:47:02", text: "Produto top, valor justo e entrega antes do prazo. Já comprei de novo!" },
          { name: "Júlia & Rafael", avatar: reviewerJuliaRafael, date: "2026-05-02 21:13:55", text: "A gente comprou pra usar junto e amamos! Qualidade impecável, vale cada centavo." },
          { name: "Lucas Oliveira", avatar: reviewerLucas, date: "2026-04-28 16:08:14", text: "Álbum lindo demais, capa firme e impressão de qualidade. Já comprei os pacotinhos pra começar a colar 🔥⚽", photos: [reviewFoto42, reviewFoto43, reviewFoto44, reviewFoto45] },
          { name: "Camila Souza", avatar: reviewerCamila, date: "2026-04-24 12:31:50", text: "Chegou rapidinho, embalagem caprichada. Meu filho amou de presente, recomendo muito!" },
          { name: "Beatriz Lima", avatar: reviewerBia, date: "2026-04-20 19:42:07", text: "Atendimento ótimo e produto exatamente como nas fotos. Voltarei a comprar com certeza ✨" },
          { name: "Pedro Henrique", avatar: reviewerPedro, date: "2026-04-16 08:55:33", text: "Muito bom, valeu cada centavo. Recebi antes do prazo e veio tudo certinho." },
          { name: "Thiago Martins", avatar: reviewerThiago, date: "2026-04-12 21:17:22", text: "Top demais! Qualidade impressionante pelo preço. Recomendo de olhos fechados." },
          { name: "Marcos Vinícius", avatar: reviewerMarcos, date: "2026-04-08 14:03:46", text: "Comprei pra colecionar e amei. Loja confiável, entrega rápida e produto original." },
        ].map((r, idx) => (
          <div key={r.name} className={`pt-3 ${idx === 0 ? "border-t border-gray-100" : "border-t border-gray-100 mt-3"}`}>
            <div className="flex items-center gap-2 mb-1">
              {r.avatar ? (
                <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold">{r.initial}</div>
              )}
              <div className="flex flex-col">
                <span className="text-xs font-semibold">{r.name}</span>
                <span className="text-[10px] text-teal-500">{r.date}</span>
              </div>
            </div>
            <div className="flex mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-xs leading-relaxed">{r.text}</p>
            {r.photos && (
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                {r.photos.map((src, i) => (
                  <img key={i} src={src} alt={`Foto ${i + 1}`} className="aspect-square w-full object-cover rounded-md" />
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Mais desta loja */}
      <section className="px-4 pt-6">
        <h2 className="font-semibold text-sm mb-2">Mais desta loja</h2>
        <div className="grid grid-cols-2 gap-3">
          {products.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
            <Link to="/produto/$id" params={{ id: p.id }} key={p.id} className="block">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-contain" />
              </div>
              <div className="mt-1.5">
                <div className="text-rose-500 font-bold text-sm">{p.price}</div>
                <div className="text-[11px] text-gray-400 line-through">{p.old}</div>
                <div className="text-[11px] text-gray-700 truncate">{p.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer Políticas */}
      <footer className="mt-5 px-4 py-4 border-t border-gray-200 bg-white text-center text-[12px] text-gray-500 leading-relaxed">
        <strong className="block text-gray-800 text-[12px] mb-1.5">Políticas e Privacidade</strong>
        <a href="#" className="text-blue-600 underline font-semibold">Política de Privacidade</a>
        <span className="block mt-1.5">Seus dados são tratados conforme a legislação vigente e usados apenas para processar pedidos e atendimento.</span>
      </footer>


      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2 z-40">
        <button className="flex flex-col items-center justify-center text-[10px] text-gray-600 w-12">
          <img src={carrinho2} alt="" width={22} height={22} />
        </button>
        <button className="flex-1 h-11 rounded-l-full bg-amber-400 text-white text-sm font-bold flex items-center justify-center gap-1">
          <img src={bilhete2} alt="" width={16} height={16} style={{ filter: "brightness(0) invert(1)" }} />
          Adicionar ao carrinho
        </button>
        <button className="flex-1 h-11 rounded-r-full bg-rose-500 text-white text-sm font-bold">
          Comprar agora
        </button>
      </div>

      {/* Share drawer */}
      {shareOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50" onClick={() => setShareOpen(false)}>
          <div className="w-full max-w-[500px] bg-white rounded-t-2xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm">Compartilhar</span>
              <button onClick={() => setShareOpen(false)} className="text-gray-500 text-xl leading-none">×</button>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-2">
              {[
                { img: iconLink, label: "Copiar Link", onClick: copyLink },
                { img: iconWhats, label: "WhatsApp", onClick: copyLink },
                { img: iconTelegram, label: "Telegram", onClick: copyLink },
                { img: iconFacebook, label: "Facebook", onClick: copyLink },
                { img: iconInstagram, label: "Instagram", onClick: copyLink },
              ].map((s) => (
                <button key={s.label} onClick={s.onClick} className="flex flex-col items-center gap-1 min-w-[64px]">
                  <span className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-50">
                    <img src={s.img} alt="" className="w-9 h-9 object-contain" />
                  </span>
                  <span className="text-[11px] text-gray-700">{s.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShareOpen(false)} className="mt-3 w-full h-10 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
