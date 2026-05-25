import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShieldCheck, Lock, Gift, Check, ChevronDown } from "lucide-react";
import { useCart, type CartItem } from "@/hooks/use-cart";
import bumpNeymar from "@/assets/bump-neymar.jpg";
import bumpLegend from "@/assets/bump-legend.jpg";
import bumpCaixinha from "@/assets/bump-caixinha.jpg";
import bumpCoca from "@/assets/bump-coca.jpg";
import bumpAdesivo from "@/assets/bump-adesivo-neymar.jpg";
import pixLogo from "@/assets/pix-logo.png";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Resumo do Pedido — Panini Copa 2026" }],
  }),
  component: CheckoutPage,
});

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const parsePrice = (p: string) =>
  Number(p.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".")) || 0;

function useCountdown(seconds: number) {
  const [s, setS] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function useRotatingSubtitle() {
  const labels = [
    { icon: ShieldCheck, text: "Pagamento 100% seguro" },
    { icon: Lock, text: "Dados criptografados" },
    { icon: Check, text: "Compra garantida" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % labels.length), 2800);
    return () => clearInterval(id);
  }, [labels.length]);
  const Cur = labels[i];
  const Icon = Cur.icon;
  return (
    <>
      <Icon className="w-3.5 h-3.5 text-emerald-600" />
      <span className="text-emerald-600 font-medium">{Cur.text}</span>
    </>
  );
}

type Step = 1 | 2 | 3 | 4;
export type Customer = { email: string; phone: string; name: string; cpf: string };

type Bump = {
  id: string;
  name: string;
  img: string;
  price: number;
  old: number;
  note?: string;
  variantLabel: string;
  variants: string[];
};

const BUMPS: Bump[] = [
  {
    id: "bump-legend",
    name: "Aumente suas chances para garantir Figurinhas Raras✨",
    img: bumpLegend,
    price: 12.7,
    old: 39.58,
    variantLabel: "Tamanho",
    variants: ["Único"],
  },
  {
    id: "bump-caixinha",
    name: "Caixinha Temática Copa do Mundo 2026 - Capacidade até 500 Figurinhas",
    img: bumpCaixinha,
    price: 8.98,
    old: 37.58,
    variantLabel: "Cor",
    variants: ["Preto", "Dourado"],
  },
  {
    id: "bump-adesivo-neymar",
    name: "Adesivo Autocolante Neymar Jr. & Mercado Livre",
    img: bumpAdesivo,
    price: 19.99,
    old: 59.99,
    variantLabel: "Tamanho",
    variants: ["Único"],
  },
  {
    id: "bump-neymar-lote",
    name: "[Lançamento] Novo Lote Neymar Edition chance de 12%. aumente sua chance ao adicionar mais!",
    img: bumpNeymar,
    price: 4.9,
    old: 31.9,
    note: "Após adicionar 1x: 12% de sorte",
    variantLabel: "Cor",
    variants: ["Único"],
  },
  {
    id: "bump-coca",
    name: "Kit 6 Garrafas Coca-cola 600ml Copa 2026 Panini Figurinhas",
    img: bumpCoca,
    price: 29.9,
    old: 79.9,
    variantLabel: "Tamanho",
    variants: ["Único"],
  },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, addItem, updateQty, total } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [customer, setCustomer] = useState<Customer>({ email: "", phone: "", name: "", cpf: "" });
  const [variantModal, setVariantModal] = useState<Bump | null>(null);
  const timer = useCountdown(5 * 60 * 60 - 7);
  const subtitle = useRotatingSubtitle();

  const totalFinal = total;
  const oldRealistic = items.reduce((s, i) => {
    const old = parsePrice((i as { old?: string }).old || "");
    return s + (old || parsePrice(i.price) * 8) * i.qty;
  }, 0);
  const descontos = Math.max(0, oldRealistic - total);

  const goBack = () => {
    if (step === 1) navigate({ to: "/carrinho" });
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else setStep(3);
  };

  const addBump = (b: Bump, variant: string) => {
    const suffix = `-${variant}`;
    addItem(
      {
        id: `${b.id}${suffix}`,
        name: `${b.name} — ${variant}`,
        img: b.img,
        price: `R$ ${fmt(b.price)}`,
      },
      1,
    );
  };

  const handleBumpClick = (b: Bump) => {
    setVariantModal(b);
  };

  const cartItems = items;
  const bumpsToShow = BUMPS.filter(
    (b) => !items.some((i) => i.id === b.id || i.id.startsWith(b.id + "-")),
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-44">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <button onClick={goBack} className="text-gray-800" aria-label="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-base font-bold text-gray-900">Resumo do Pedido</h1>
            <div className="flex items-center justify-center gap-1 text-xs mt-0.5">
              {step === 2 ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Dados criptografados</span>
                </>
              ) : (
                subtitle
              )}
            </div>
          </div>
          <div className="w-5" />
        </div>
        {step >= 2 && step <= 4 && (
          <div className="max-w-3xl mx-auto px-6 pb-3">
            <StepIndicator current={step as 2 | 3 | 4} />
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-3 pt-3">
        {step === 1 && (
          <Step1
            cartItems={cartItems}
            updateQty={updateQty}
          />
        )}
        {step === 2 && (
          <Step2
            initial={customer}
            onNext={(c) => {
              setCustomer(c);
              setStep(3);
            }}
          />
        )}
        {step === 3 && (
          <Step3
            bumpsToShow={bumpsToShow}
            onBumpClick={handleBumpClick}
            getBumpCount={(b) =>
              items
                .filter((i) => i.id === b.id || i.id.startsWith(b.id + "-"))
                .reduce((s, i) => s + i.qty, 0)
            }
            onContinue={() => setStep(4)}
            totalFinal={totalFinal}
            descontos={descontos}
            itemsCount={items.length}
          />
        )}
        {step === 4 && <Step4 customer={customer} totalFinal={totalFinal} />}
      </main>

      {step === 1 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
          {descontos > 0 && (
            <div className="bg-rose-50 text-rose-600 text-[13px] text-center py-2 px-3 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
              <Gift className="w-4 h-4 shrink-0" />
              <span>
                Você está economizando <strong>R$ {fmt(descontos)}</strong> neste pedido.
              </span>
            </div>
          )}
          <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Total ({items.length} {items.length === 1 ? "item" : "itens"})
            </span>
            <span className="text-lg font-bold text-gray-900">R$ {fmt(totalFinal)}</span>
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={items.length === 0}
            className="block w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 text-sm disabled:opacity-50 uppercase tracking-wide"
          >
            Finalizar Compra
          </button>
          <div className="bg-rose-500 text-white font-semibold py-2 text-xs text-center">
            O cupom expira em {timer}
          </div>
        </footer>
      )}

      {variantModal && (
        <VariantModal
          bump={variantModal}
          onClose={() => setVariantModal(null)}
          onConfirm={(variant) => {
            addBump(variantModal, variant);
            setVariantModal(null);
          }}
        />
      )}
    </div>
  );
}

/* ---------- Step Indicator ---------- */

function StepIndicator({ current }: { current: 2 | 3 | 4 }) {
  const steps = [
    { n: 1, label: "Identificação" },
    { n: 2, label: "Ofertas" },
    { n: 3, label: "Pagamento" },
  ];
  const activeIdx = current === 2 ? 1 : current === 3 ? 2 : 3;
  return (
    <div className="flex items-center justify-between">
      {steps.map((s, i) => {
        const done = s.n < activeIdx;
        const active = s.n === activeIdx;
        return (
          <div key={s.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : s.n}
              </div>
              <span
                className={`text-[11px] font-semibold ${active || done ? "text-gray-900" : "text-gray-400"}`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 -mt-4 ${done ? "bg-emerald-500" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Step 1: Cart summary ---------- */

function Step1({
  cartItems,
  updateQty,
}: {
  cartItems: CartItem[];
  updateQty: (id: string, q: number) => void;
}) {
  return (
    <div className="space-y-3 pt-1">
      {cartItems.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
          Carrinho vazio.{" "}
          <Link to="/" className="text-rose-600 font-semibold">
            Ver ofertas
          </Link>
        </div>
      )}

      {cartItems.map((item) => {
        const price = parsePrice(item.price);
        const oldP = parsePrice((item as { old?: string }).old || "") || price * 8;
        const off = Math.max(0, oldP - price);
        return (
          <section
            key={item.id}
            className="bg-white shadow-sm border border-slate-200 rounded-xl px-4 py-4"
          >
            <div className="flex gap-3">
              <div className="w-[90px] h-[90px] flex-shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-contain p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[15px] text-gray-900 leading-snug">{item.name}</h3>
                <div className="text-xs text-gray-400 line-through mt-1">R$ {fmt(oldP)}</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-emerald-600 font-bold text-lg">R$ {fmt(price)}</span>
                  <span className="text-emerald-600 text-sm font-semibold">
                    (R$ {fmt(off)} OFF)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <QtyStepper qty={item.qty} onChange={(n) => updateQty(item.id, n)} />
              <span className="text-sm text-gray-500">{item.qty} no carrinho</span>
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ---------- Step 3: Order bumps (penultimate) ---------- */

function Step3({
  bumpsToShow,
  onBumpClick,
  getBumpCount,
  onContinue,
  totalFinal,
  descontos,
  itemsCount,
}: {
  bumpsToShow: Bump[];
  onBumpClick: (b: Bump) => void;
  getBumpCount: (b: Bump) => number;
  onContinue: () => void;
  totalFinal: number;
  descontos: number;
  itemsCount: number;
}) {
  return (
    <div className="space-y-3 pt-1 pb-32">
      <h2 className="text-center font-bold text-gray-900 text-base pt-2">
        Acho que você vai gostar destas ofertas ;)
      </h2>

      {bumpsToShow.map((b) => {
        const count = getBumpCount(b);
        const off = Math.max(0, b.old - b.price);
        return (
          <div key={b.id} className="space-y-2">
            <section className="bg-white shadow-sm border border-dashed border-slate-300 rounded-xl px-4 py-4">
              <div className="flex gap-3">
                <div className="w-[90px] h-[90px] flex-shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                  <img src={b.img} alt={b.name} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[15px] text-gray-900 leading-snug">{b.name}</h3>
                  <div className="text-xs text-gray-400 line-through mt-1">R$ {fmt(b.old)}</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-emerald-600 font-bold text-lg">R$ {fmt(b.price)}</span>
                    <span className="text-emerald-600 text-sm font-semibold">
                      (R$ {fmt(off)} OFF)
                    </span>
                  </div>
                  {b.note && (
                    <div className="text-emerald-700 text-sm font-semibold mt-1">{b.note}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <QtyStepper qty={1} onChange={() => {}} disabled />
                <span className="text-sm text-gray-500">
                  {count > 0 ? `${count} no carrinho` : "Nenhum no carrinho"}
                </span>
              </div>
            </section>
            <button
              onClick={() => onBumpClick(b)}
              className="w-full bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 rounded-lg text-sm"
            >
              Adicionar item
            </button>
          </div>
        );
      })}

      {bumpsToShow.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
          Você já adicionou todas as ofertas disponíveis.
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
        {descontos > 0 && (
          <div className="bg-rose-50 text-rose-600 text-[13px] text-center py-2 px-3 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
            <Gift className="w-4 h-4 shrink-0" />
            <span>
              Você está economizando <strong>R$ {fmt(descontos)}</strong> neste pedido.
            </span>
          </div>
        )}
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Total ({itemsCount} {itemsCount === 1 ? "item" : "itens"})
          </span>
          <span className="text-lg font-bold text-gray-900">R$ {fmt(totalFinal)}</span>
        </div>
        <button
          onClick={onContinue}
          className="block w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 text-sm uppercase tracking-wide"
        >
          Ir para pagamento
        </button>
      </footer>
    </div>
  );
}



function QtyStepper({
  qty,
  onChange,
  disabled,
}: {
  qty: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
      <button
        onClick={() => !disabled && onChange(qty - 1)}
        disabled={disabled}
        className="w-9 h-9 text-gray-600 disabled:text-gray-300"
        aria-label="Diminuir"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold">{qty}</span>
      <button
        onClick={() => !disabled && onChange(qty + 1)}
        disabled={disabled}
        className="w-9 h-9 text-gray-600 disabled:text-gray-300"
        aria-label="Aumentar"
      >
        +
      </button>
    </div>
  );
}

/* ---------- Variant modal (for caixinha) ---------- */

function VariantModal({
  bump,
  onClose,
  onConfirm,
}: {
  bump: Bump;
  onClose: () => void;
  onConfirm: (variant: string) => void;
}) {
  const [variant, setVariant] = useState("");
  return (
    <div
      className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-3 items-start">
          <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
            <img src={bump.img} alt={bump.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[15px] text-gray-900 leading-tight">{bump.name}</h4>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-emerald-600 font-bold text-lg">R$ {fmt(bump.price)}</span>
              <span className="text-gray-400 line-through text-sm">R$ {fmt(bump.old)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-semibold text-gray-900 text-sm mb-2">{bump.variantLabel}</label>
          <div className="relative">
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              className="w-full h-12 rounded-lg border-2 border-blue-500 bg-blue-50/30 px-3 text-sm appearance-none focus:outline-none"
            >
              <option value="">Selecione {bump.variantLabel === "Cor" ? "a cor" : "o tamanho"}...</option>
              {bump.variants.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 h-11 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={() => variant && onConfirm(variant)}
            disabled={!variant}
            className="px-5 h-11 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-sm"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 2: Identificação ---------- */

function Step2({ initial, onNext }: { initial: Customer; onNext: (c: Customer) => void }) {
  const [form, setForm] = useState<Customer>(initial);
  const [error, setError] = useState<string | null>(null);

  const maskPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };
  const maskCpf = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError("E-mail inválido");
    if (form.phone.replace(/\D/g, "").length < 10) return setError("Telefone inválido");
    if (form.name.trim().split(" ").length < 2) return setError("Informe nome e sobrenome");
    if (form.cpf.replace(/\D/g, "").length !== 11) return setError("CPF inválido");
    setError(null);
    onNext(form);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 mt-2 p-4">
      <h2 className="font-bold text-gray-900 text-lg mb-4">Identificação</h2>
      <form onSubmit={submit} className="space-y-4">
        <Field label="E-mail">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            maxLength={255}
            className={inputCls}
          />
        </Field>
        <Field label="Telefone">
          <input
            inputMode="numeric"
            placeholder="(99) 99999-9999"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <Field label="Nome completo">
          <input
            placeholder="Nome e Sobrenome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            maxLength={120}
            className={inputCls}
          />
        </Field>
        <Field label="CPF/CNPJ">
          <input
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: maskCpf(e.target.value) })}
            className={inputCls}
          />
        </Field>

        {error && <div className="text-sm text-rose-600 text-center">{error}</div>}

        <button
          type="submit"
          className="w-full h-12 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-base uppercase tracking-wide"
        >
          Continuar
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-bold text-gray-900 mb-2 text-sm">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full h-12 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:border-gray-900";

/* ---------- Step 4: PIX ---------- */

type PixData = {
  id: string;
  amount: number;
  pix: { qrCode: { emv: string; image?: string }; expirationDate?: number };
};

function Step4({ customer, totalFinal }: { customer: Customer; totalFinal: number }) {
  const { items, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [pix, setPix] = useState<PixData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setError(null);
      setLoading(true);
      const eventId = (crypto as Crypto & { randomUUID: () => string }).randomUUID();
      const value = totalFinal;
      const contents = items.map((i) => ({
        content_id: i.id,
        content_name: i.name,
        quantity: i.qty,
        price: parsePrice(i.price),
      }));
      try {
        const res = await fetch("/api/pix/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: value,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            customerDocument: customer.cpf,
            description: `Pedido Panini Copa 2026 (${items.length} itens)`,
            metadata: { event_id: eventId },
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json?.data?.pix?.qrCode?.emv) {
          throw new Error(json?.message || json?.error || "Falha ao gerar PIX");
        }
        if (cancelled) return;
        const ttq = (window as unknown as {
          ttq?: { track: (e: string, p?: unknown, o?: unknown) => void };
        }).ttq;
        ttq?.track(
          "CompletePayment",
          { value, currency: "BRL", contents, content_type: "product" },
          { event_id: eventId },
        );
        fetch("/api/tiktok-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "CompletePayment",
            event_id: eventId,
            url: window.location.href,
            value,
            currency: "BRL",
            email: customer.email,
            phone: customer.phone,
            contents,
          }),
        }).catch(() => {});
        setPix(json.data as PixData);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erro ao gerar PIX");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyEmv = async () => {
    if (!pix) return;
    try {
      await navigator.clipboard.writeText(pix.pix.qrCode.emv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 mt-2 p-8 text-center">
        <p className="text-gray-700 font-semibold">Gerando seu PIX...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 mt-2 p-6 text-center space-y-3">
        <p className="text-rose-600 font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 h-11 rounded-lg bg-rose-600 text-white font-bold text-sm"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!pix) return null;

  const emv = pix.pix.qrCode.emv;
  const img = pix.pix.qrCode.image
    ? pix.pix.qrCode.image.startsWith("data:")
      ? pix.pix.qrCode.image
      : `data:image/png;base64,${pix.pix.qrCode.image}`
    : `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(emv)}`;

  return (
    <div className="bg-white rounded-xl border border-gray-100 mt-2">
      <div className="px-4 pt-5 pb-5 space-y-4 text-center">
        <h3 className="font-bold text-gray-900 text-lg">Pague com PIX para concluir</h3>
        <p className="text-sm text-gray-600">
          Escaneie o QR Code ou copie o código abaixo. Valor:{" "}
          <strong>R$ {fmt(pix.amount)}</strong>
        </p>
        <div className="flex justify-center">
          <img src={img} alt="QR Code PIX" className="w-64 h-64 border border-gray-200 rounded-lg" />
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-left">
          <div className="text-xs font-semibold text-gray-500 mb-1">PIX Copia e Cola</div>
          <div className="text-xs text-gray-800 break-all font-mono">{emv}</div>
        </div>
        <button
          onClick={copyEmv}
          className="w-full h-12 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
        >
          {copied ? "Código copiado!" : "Copiar código PIX"}
        </button>
        <p className="text-xs text-gray-500">
          Após o pagamento, você receberá a confirmação por e-mail em{" "}
          <strong>{customer.email}</strong>.
        </p>
        <button
          onClick={() => {
            clear();
            navigate({ to: "/" });
          }}
          className="text-sm text-gray-500 underline"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
