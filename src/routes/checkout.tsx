import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShieldCheck, Lock, Truck, X, Ticket, Gift, Check, ChevronDown } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import bumpNeymar from "@/assets/bump-neymar.jpg";
import bumpLegend from "@/assets/bump-legend.jpg";
import bumpCaixinha from "@/assets/bump-caixinha.jpg";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Resumo do Pedido — Panini Copa 2026" }],
  }),
  component: CheckoutPage,
});

const FREE_SHIPPING_MIN = 120;

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const parsePrice = (p: string) =>
  Number(p.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".")) || 0;

type ShippingOption = { id: string; name: string; days: string; price: number };

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

type Step = 1 | 2 | 3 | 4;

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, updateQty, removeItem } = useCart();
  const [step, setStep] = useState<Step>(1);
  const timer = useCountdown(5 * 60 * 60 - 7);

  const freeShipping = total >= FREE_SHIPPING_MIN;

  const shippingOptions: ShippingOption[] = useMemo(
    () => [
      { id: "jadlog", name: "JadLog", days: "Receba em até 2 dias úteis", price: freeShipping ? 0 : 25.5 },
      { id: "sedex", name: "Sedex-Express", days: "Receba em até 4 dias úteis", price: freeShipping ? 0 : 17.5 },
      { id: "correio", name: "Correio", days: "Receba em até 7 dias úteis", price: 0 },
    ],
    [freeShipping],
  );
  const [shippingId, setShippingId] = useState("jadlog");
  const shipping = shippingOptions.find((o) => o.id === shippingId) || shippingOptions[0];

  const oldRealistic = items.reduce((s, i) => {
    const old = parsePrice((i as any).old || "");
    return s + (old || parsePrice(i.price) * 8) * i.qty;
  }, 0);
  const descontos = Math.max(0, oldRealistic - total);
  const totalFinal = total + shipping.price;

  const goBack = () => {
    if (step === 1) navigate({ to: "/carrinho" });
    else setStep((step - 1) as Step);
  };

  const subtitle =
    step === 2 ? (
      <>
        <Lock className="w-3.5 h-3.5 text-emerald-600" />
        <span className="text-emerald-600 font-medium">Dados criptografados</span>
      </>
    ) : (
      <>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span className="text-emerald-600 font-medium">Pagamento 100% seguro</span>
      </>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <button onClick={goBack} className="text-gray-800" aria-label="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-base font-bold text-gray-900">Resumo do Pedido</h1>
            <div className="flex items-center justify-center gap-1 text-xs mt-0.5">{subtitle}</div>
          </div>
          <div className="w-5" />
        </div>
        {step === 1 && (
          <div className="h-1.5 flex">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className={`flex-1 mx-[1px] ${i % 2 === 0 ? "bg-rose-400" : "bg-sky-400"}`} />
            ))}
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-3 pt-3">
        {step === 1 && (
          <Step1
            items={items}
            total={total}
            descontos={descontos}
            frete={shipping.price}
            shippingName={shipping.name}
            totalFinal={totalFinal}
            updateQty={updateQty}
            removeItem={removeItem}
            freeShipping={freeShipping}
          />
        )}
        {step === 2 && <Step2 onNext={() => setStep(3)} />}
        {step === 3 && (
          <Step3
            options={shippingOptions}
            value={shippingId}
            onChange={setShippingId}
            freeShipping={freeShipping}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && <Step4 />}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
        {descontos > 0 && (
          <div className="bg-rose-50 text-rose-600 text-[13px] text-center py-2 flex items-center justify-center gap-1.5">
            <Gift className="w-4 h-4" />
            Você está economizando <strong>R$ {fmt(descontos)}</strong> neste pedido.
          </div>
        )}
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Total ({items.length} {items.length === 1 ? "item" : "itens"})
          </span>
          <span className="text-lg font-bold text-gray-900">R$ {fmt(totalFinal)}</span>
        </div>
        {step === 1 ? (
          <>
            <div className="bg-rose-500/10 text-rose-600 font-semibold py-2 text-xs text-center">
              O cupom expira em {timer}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={items.length === 0}
              className="block w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 text-sm disabled:opacity-50 uppercase tracking-wide"
            >
              Finalizar Compra
            </button>
          </>
        ) : (
          <div className="bg-rose-500 text-white font-bold py-3.5 text-sm text-center">
            O cupom expira em {timer}
          </div>
        )}
      </footer>
    </div>
  );
}

/* ---------- Stepper ---------- */

function Stepper({ active }: { active: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Identificação" },
    { n: 2, label: "Entrega" },
    { n: 3, label: "Pagamento" },
  ];
  return (
    <div className="flex items-center justify-between px-2 py-4">
      {steps.map((s, i) => {
        const done = active > s.n;
        const current = active === s.n;
        return (
          <div key={s.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  done
                    ? "bg-emerald-500 text-white"
                    : current
                    ? "bg-slate-900 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {done ? <Check className="w-5 h-5" /> : s.n}
              </div>
              <span
                className={`text-xs mt-1 font-semibold ${
                  current ? "text-slate-900" : done ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px flex-1 mx-2 ${done ? "bg-emerald-500" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Step 1: Resumo ---------- */

function Step1({
  items,
  total,
  descontos,
  frete,
  shippingName,
  totalFinal,
  updateQty,
  removeItem,
  freeShipping,
}: {
  items: ReturnType<typeof useCart>["items"];
  total: number;
  descontos: number;
  frete: number;
  shippingName: string;
  totalFinal: number;
  updateQty: (id: string, q: number) => void;
  removeItem: (id: string) => void;
  freeShipping: boolean;
}) {
  return (
    <>
      <div className="text-sm font-medium text-gray-700 px-1 py-2">
        Loja ({items.length} {items.length === 1 ? "item" : "itens"})
      </div>

      <div className="bg-sky-50 rounded-xl flex items-center gap-3 px-4 py-3 mb-3">
        <Truck className="w-6 h-6 text-sky-800" />
        <span className="text-sky-900 font-bold text-base">
          {freeShipping
            ? "Você ganhou frete grátis!"
            : `Faltam R$ ${fmt(FREE_SHIPPING_MIN - total)} para o frete grátis`}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <h3 className="px-4 pt-4 pb-2 font-bold text-gray-900">
          Resumo do carrinho ({items.length} {items.length === 1 ? "item" : "itens"})
        </h3>
        <div className="px-3 pb-3 space-y-3">
          {items.map((item) => {
            const price = parsePrice(item.price);
            const oldP = parsePrice((item as any).old || "") || price * 8;
            const subtotal = price * item.qty;
            return (
              <div key={item.id} className="border border-gray-200 rounded-xl p-3">
                <div className="flex gap-3">
                  <div className="w-[88px] h-[88px] flex-shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-[15px] text-gray-900 leading-tight">{item.name}</h4>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400" aria-label="Remover">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded">- 87%</span>
                      <span className="bg-emerald-50 text-emerald-600 text-xs font-semibold px-2 py-0.5 rounded">Frete grátis</span>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <div className="leading-tight">
                        <div className="text-lg font-bold text-gray-900">R$ {fmt(price)}</div>
                        <div className="text-xs text-gray-400 line-through">R$ {fmt(oldP)}</div>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 text-gray-600" aria-label="Diminuir">−</button>
                        <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 text-gray-600" aria-label="Aumentar">+</button>
                      </div>
                    </div>
                    <div className="text-right text-sm font-bold text-gray-900 mt-2">
                      Subtotal: R$ {fmt(subtotal)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-6">
              Carrinho vazio. <Link to="/" className="text-rose-600 font-semibold">Ver ofertas</Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t border-b border-gray-100 mt-3 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-rose-500" />
          <span className="text-sm font-medium text-gray-800">Descontos aplicados</span>
        </div>
        <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">R$ {fmt(descontos)}</span>
      </div>

      <div className="bg-white px-4 py-4 mt-3 rounded-xl border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-3">Resumo financeiro</h4>
        <div className="space-y-2 text-sm">
          <Row label="Subtotal" value={`R$ ${fmt(total)}`} />
          <Row
            label={<span className="text-rose-600 font-semibold">Descontos</span>}
            value={<span className="text-rose-600 font-semibold">R$ {fmt(descontos)}</span>}
          />
          <Row
            label="Frete"
            value={frete === 0 ? <span className="text-emerald-600 font-semibold">Grátis</span> : `${shippingName} (R$ ${fmt(frete)})`}
          />
        </div>
        <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-gray-900 text-lg">R$ {fmt(totalFinal)}</span>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-gray-700">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* ---------- Step 2: Identificação ---------- */

function Step2({ onNext }: { onNext: () => void }) {
  const [form, setForm] = useState({ email: "", phone: "", name: "", cpf: "" });
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
    onNext();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 mt-2">
      <Stepper active={1} />
      <form onSubmit={submit} className="px-4 pb-5 space-y-4">
        <Field label="E-mail">
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} className={inputCls} />
        </Field>
        <Field label="Telefone">
          <input inputMode="numeric" placeholder="(99) 99999-9999" value={form.phone} onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })} className={inputCls} />
        </Field>
        <Field label="Nome completo">
          <input placeholder="Nome e Sobrenome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} className={inputCls} />
        </Field>
        <Field label="CPF/CNPJ">
          <input inputMode="numeric" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: maskCpf(e.target.value) })} className={inputCls} />
        </Field>

        <div className="border border-dashed border-gray-300 rounded-lg p-4">
          <h4 className="font-bold text-gray-900 text-sm mb-2">Por que precisamos desses dados?</h4>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Enviar o comprovante de compra;</li>
            <li>Garantir a devolução caso necessário;</li>
            <li>Acompanhar o andamento do pedido.</li>
          </ul>
        </div>

        {error && <div className="text-sm text-rose-600 text-center">{error}</div>}

        <button type="submit" className="w-full h-12 rounded-lg bg-slate-900 text-white font-bold text-base">
          Ir para entrega
        </button>
      </form>
    </div>
  );
}

/* ---------- Step 3: Entrega ---------- */

function Step3({
  options,
  value,
  onChange,
  freeShipping,
  onNext,
}: {
  options: ShippingOption[];
  value: string;
  onChange: (id: string) => void;
  freeShipping: boolean;
  onNext: () => void;
}) {
  const [form, setForm] = useState({
    cep: "",
    address: "",
    number: "",
    district: "",
    city: "",
    state: "",
    complement: "",
  });
  const [error, setError] = useState<string | null>(null);

  const maskCep = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.cep.replace(/\D/g, "").length !== 8) return setError("CEP inválido");
    if (!form.address.trim()) return setError("Informe o endereço");
    if (!form.number.trim()) return setError("Informe o número");
    if (!form.district.trim()) return setError("Informe o bairro");
    if (!form.city.trim()) return setError("Informe a cidade");
    if (!form.state.trim()) return setError("Informe o estado");
    setError(null);
    onNext();
  };

  const selected = options.find((o) => o.id === value) || options[0];

  return (
    <div className="bg-white rounded-xl border border-gray-100 mt-2">
      <Stepper active={2} />
      <form onSubmit={submit} className="px-4 pb-5 space-y-4">
        <Field label="CEP">
          <input inputMode="numeric" placeholder="00000-000" value={form.cep} onChange={(e) => setForm({ ...form, cep: maskCep(e.target.value) })} className={inputCls} />
        </Field>
        <Field label="Endereço">
          <input placeholder="Rua / Avenida" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} maxLength={200} className={inputCls} />
        </Field>
        <Field label="Número">
          <input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} maxLength={10} className={inputCls} />
        </Field>
        <Field label="Bairro">
          <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} maxLength={100} className={inputCls} />
        </Field>
        <Field label="Cidade">
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} maxLength={100} className={inputCls} />
        </Field>
        <Field label="Estado">
          <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} maxLength={2} className={inputCls} />
        </Field>
        <Field label="Complemento">
          <input placeholder="Apartamento, bloco, referência (opcional)" value={form.complement} onChange={(e) => setForm({ ...form, complement: e.target.value })} maxLength={120} className={inputCls} />
        </Field>

        {freeShipping && (
          <div className="bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg px-3 py-2 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Você atingiu o mínimo de R$ {fmt(FREE_SHIPPING_MIN)} — frete grátis aplicado!
          </div>
        )}

        <div className="space-y-2">
          {options.map((o) => {
            const active = o.id === value;
            return (
              <label
                key={o.id}
                className={`flex items-center gap-3 border rounded-lg px-3 py-3 cursor-pointer ${
                  active ? "border-blue-500 bg-blue-50/30" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={active}
                  onChange={() => onChange(o.id)}
                  className="accent-blue-600 w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-sm">{o.name}</div>
                  <div className="text-xs text-gray-500">{o.days}</div>
                </div>
                <div className="font-bold text-gray-900 text-sm">
                  {o.price === 0 ? "Grátis" : `R$ ${fmt(o.price)}`}
                </div>
              </label>
            );
          })}
        </div>

        <div className="text-sm text-gray-700">
          Frete selecionado: <strong>{selected.name}</strong> ({selected.price === 0 ? "Grátis" : `R$ ${fmt(selected.price)}`})
        </div>

        {error && <div className="text-sm text-rose-600 text-center">{error}</div>}

        <button type="submit" className="w-full h-12 rounded-lg bg-slate-900 text-white font-bold text-base">
          Ir para pagamento
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

/* ---------- Step 4: Pagamento + Order Bumps ---------- */

type Bump = {
  id: string;
  name: string;
  img: string;
  price: number;
  old: number;
  off: number;
  note?: string;
  variants: string[];
};

const BUMPS: Bump[] = [
  {
    id: "bump-neymar",
    name: "[Lançamento] Novo Lote Neymar Edition chance de 12%. aumente sua chance ao adicionar mais!",
    img: bumpNeymar,
    price: 11.9,
    old: 31.9,
    off: 20,
    note: "Após adicionar 1x: 12% de sorte",
    variants: ["Padrão"],
  },
  {
    id: "bump-legend",
    name: "Aumente suas chances para garantir Figurinhas Raras✨",
    img: bumpLegend,
    price: 19.7,
    old: 39.58,
    off: 19.88,
    variants: ["Padrão"],
  },
  {
    id: "bump-caixinha",
    name: "Caixinha Temática Copa do Mundo 2026 - Capacidade até 500 Figurinhas",
    img: bumpCaixinha,
    price: 15.98,
    old: 37.58,
    off: 21.6,
    variants: ["Preto", "Dourado"],
  },
];

function Step4() {
  const { addItem, items } = useCart();
  const [modal, setModal] = useState<Bump | null>(null);
  const [variant, setVariant] = useState("");
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  const getQty = (id: string) => qtys[id] ?? 1;
  const setQty = (id: string, n: number) => setQtys((q) => ({ ...q, [id]: Math.max(1, n) }));

  const openAdd = (b: Bump) => {
    setVariant("");
    setModal(b);
  };

  const confirmAdd = () => {
    if (!modal || !variant) return;
    addItem(
      {
        id: `${modal.id}-${variant}`,
        name: `${modal.name} — ${variant}`,
        img: modal.img,
        price: `R$ ${fmt(modal.price)}`,
      },
      getQty(modal.id),
    );
    setModal(null);
  };

  const finalize = () => {
    alert("Compra finalizada! 🎉");
    navigate({ to: "/" });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 mt-2">
      <Stepper active={3} />
      <div className="px-4 pb-5 space-y-4">
        <h3 className="text-center font-bold text-gray-900">Acho que você vai gostar destas ofertas ;)</h3>

        {BUMPS.map((b) => {
          const inCart = items
            .filter((i) => i.id.startsWith(b.id + "-"))
            .reduce((s, i) => s + i.qty, 0);
          return (
            <div key={b.id} className="space-y-2">
              <div className="border border-dashed border-gray-300 rounded-xl p-3">
                <div className="flex gap-3">
                  <div className="w-[88px] h-[88px] flex-shrink-0 rounded-lg border border-gray-200 bg-white overflow-hidden">
                    <img src={b.img} alt={b.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[15px] text-gray-900 leading-tight">{b.name}</h4>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-gray-400 line-through text-sm">R$ {fmt(b.old)}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-emerald-600 font-bold text-lg">R$ {fmt(b.price)}</span>
                      <span className="text-emerald-600 text-sm font-semibold">(R$ {fmt(b.off)} OFF)</span>
                    </div>
                    {b.note && <div className="text-emerald-700 text-sm font-semibold mt-1">{b.note}</div>}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                    <button onClick={() => setQty(b.id, getQty(b.id) - 1)} className="w-7 h-7 text-gray-600">−</button>
                    <span className="w-6 text-center text-sm font-semibold">{getQty(b.id)}</span>
                    <button onClick={() => setQty(b.id, getQty(b.id) + 1)} className="w-7 h-7 text-gray-600">+</button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {inCart > 0 ? `${inCart} no carrinho` : "Nenhum no carrinho"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => openAdd(b)}
                className="w-full bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 rounded-lg text-sm"
              >
                Adicionar item
              </button>
            </div>
          );
        })}

        <div className="border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-900 mb-3">Forma de pagamento</h4>
          <label className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-3">
            <div className="w-9 h-9 rounded-md bg-teal-100 flex items-center justify-center text-teal-500 font-bold">
              PIX
            </div>
            <span className="flex-1 font-semibold text-gray-900">PIX à vista</span>
            <input type="radio" defaultChecked className="accent-blue-600 w-4 h-4" />
          </label>
        </div>

        <button
          onClick={finalize}
          className="w-full h-12 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-base tracking-wide"
        >
          FINALIZAR COMPRA
        </button>
      </div>

      {/* Modal de variação */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-md p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-3 items-start">
              <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                <img src={modal.img} alt={modal.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[15px] text-gray-900 leading-tight">{modal.name}</h4>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-emerald-600 font-bold text-lg">R$ {fmt(modal.price)}</span>
                  <span className="text-gray-400 line-through text-sm">R$ {fmt(modal.old)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-semibold text-gray-900 text-sm mb-2">Cor</label>
              <div className="relative">
                <select
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full h-12 rounded-lg border-2 border-blue-500 bg-blue-50/30 px-3 text-sm appearance-none focus:outline-none"
                >
                  <option value="">Selecione a cor...</option>
                  {modal.variants.map((v) => (
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
                onClick={() => setModal(null)}
                className="px-4 h-11 rounded-lg border border-gray-300 text-gray-700 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAdd}
                disabled={!variant}
                className="px-5 h-11 rounded-lg bg-teal-400 hover:bg-teal-500 text-white font-bold disabled:opacity-60"
              >
                Quero esse item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
