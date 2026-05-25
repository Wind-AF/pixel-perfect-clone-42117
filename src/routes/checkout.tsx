import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Gift,
  Check,
  ChevronDown,
  ChevronUp,
  Ticket,
  Copy,
  Info,
  Clipboard,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
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
export type Address = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  carrier: "jadlog" | "correios";
};

const CARRIERS: { id: Address["carrier"]; name: string; price: number; eta: string }[] = [
  { id: "jadlog", name: "JadLog", price: 25.5, eta: "5 a 8 dias úteis" },
  { id: "correios", name: "Correios PAC", price: 32.9, eta: "7 a 12 dias úteis" },
];

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
  const { items, addItem, updateQty, removeItem, total } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [customer, setCustomer] = useState<Customer>({ email: "", phone: "", name: "", cpf: "" });
  const [address, setAddress] = useState<Address>({
    cep: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
    carrier: "jadlog",
  });
  const [variantModal, setVariantModal] = useState<Bump | null>(null);
  const timer = useCountdown(5 * 60 * 60 - 7);
  const subtitle = useRotatingSubtitle();

  const carrier = CARRIERS.find((c) => c.id === address.carrier) ?? CARRIERS[0];
  const subtotalItems = total;
  const oldRealistic = items.reduce((s, i) => {
    const old = parsePrice((i as { old?: string }).old || "");
    return s + (old || parsePrice(i.price) * 8) * i.qty;
  }, 0);
  const descontos = Math.max(0, oldRealistic - subtotalItems);
  const shipping = step >= 2 ? carrier.price : 0;
  const totalFinal = subtotalItems + shipping;

  const goBack = () => {
    if (step === 1) navigate({ to: "/carrinho" });
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else setStep(3);
  };

  const addBump = (b: Bump, variant: string) => {
    addItem(
      {
        id: `${b.id}-${variant}`,
        name: `${b.name} — ${variant}`,
        img: b.img,
        price: `R$ ${fmt(b.price)}`,
      },
      1,
    );
  };

  const bumpsToShow = BUMPS.filter(
    (b) => !items.some((i) => i.id === b.id || i.id.startsWith(b.id + "-")),
  );

  const summaryNode =
    items.length > 0 ? (
      <OrderSummary
        items={items}
        updateQty={updateQty}
        removeItem={removeItem}
        subtotal={subtotalItems}
        descontos={descontos}
        shipping={shipping}
        showShipping={step >= 2}
        carrierLabel={carrier.name}
        total={totalFinal}
      />
    ) : null;

  const isFinalStep = step === 4;

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <button onClick={goBack} className="text-gray-800" aria-label="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-base font-bold text-gray-900">
              {isFinalStep ? "Realizar pagamento" : "Resumo do Pedido"}
            </h1>
            <div className="flex items-center justify-center gap-1 text-xs mt-0.5">
              {step === 1 ? (
                subtitle
              ) : step === 2 ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Dados criptografados</span>
                </>
              ) : step === 3 ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Compra garantida</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Compra garantida</span>
                </>
              )}
            </div>
          </div>
          <div className="w-5" />
        </div>
        {!isFinalStep && (
          <div className="max-w-3xl mx-auto px-6 pb-3">
            <StepIndicator current={step as 1 | 2 | 3} />
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-3 pt-3 space-y-3">
        {step === 1 && (
          <>
            {summaryNode}
            <StepIdentificacao
              initial={customer}
              onNext={(c) => {
                setCustomer(c);
                setStep(2);
              }}
            />
          </>
        )}

        {step === 2 && (
          <>
            {summaryNode}
            <StepEntrega
              initial={address}
              onNext={(a) => {
                setAddress(a);
                setStep(3);
              }}
            />
          </>
        )}

        {step === 3 && (
          <>
            {summaryNode}
            <StepPagamento
              bumpsToShow={bumpsToShow}
              onBumpClick={(b) => setVariantModal(b)}
              getBumpCount={(b) =>
                items
                  .filter((i) => i.id === b.id || i.id.startsWith(b.id + "-"))
                  .reduce((s, i) => s + i.qty, 0)
              }
              onFinish={() => setStep(4)}
            />
          </>
        )}

        {step === 4 && (
          <StepPix customer={customer} totalFinal={totalFinal} />
        )}
      </main>

      {!isFinalStep && (
        <BottomBar
          descontos={descontos}
          itemsCount={items.length}
          total={totalFinal}
          timer={timer}
          showTimer={step === 1 || step === 3}
        />
      )}
      {isFinalStep && (
        <BottomBar
          descontos={descontos}
          itemsCount={items.length}
          total={totalFinal}
          timer={timer}
          showTimer
          slim
        />
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

/* ---------- Bottom Bar (recap + timer) ---------- */

function BottomBar({
  descontos,
  itemsCount,
  total,
  timer,
  showTimer,
  slim,
}: {
  descontos: number;
  itemsCount: number;
  total: number;
  timer: string;
  showTimer: boolean;
  slim?: boolean;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30">
      {descontos > 0 && (
        <div className="bg-rose-50 text-rose-600 text-[13px] text-center py-2 px-3 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
          <Gift className="w-4 h-4 shrink-0" />
          <span>
            Você está economizando <strong>R$ {fmt(descontos)}</strong> neste pedido.
          </span>
        </div>
      )}
      {!slim && (
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Total ({itemsCount} {itemsCount === 1 ? "item" : "itens"})
          </span>
          <span className="text-lg font-bold text-gray-900">R$ {fmt(total)}</span>
        </div>
      )}
      {slim && (
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Total ({itemsCount} {itemsCount === 1 ? "item" : "itens"})
          </span>
          <span className="text-lg font-bold text-gray-900">R$ {fmt(total)}</span>
        </div>
      )}
      {showTimer && (
        <div className="bg-rose-500 text-white font-semibold py-2 text-xs text-center">
          O cupom expira em {timer}
        </div>
      )}
    </div>
  );
}

/* ---------- Step Indicator ---------- */

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Identificação" },
    { n: 2, label: "Entrega" },
    { n: 3, label: "Pagamento" },
  ];
  return (
    <div className="flex items-center justify-between">
      {steps.map((s, i) => {
        const done = s.n < current;
        const active = s.n === current;
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

/* ---------- Order Summary (collapsible, used on every form step) ---------- */

function OrderSummary({
  items,
  updateQty,
  removeItem,
  subtotal,
  descontos,
  shipping,
  showShipping,
  carrierLabel,
  total,
}: {
  items: CartItem[];
  updateQty: (id: string, q: number) => void;
  removeItem: (id: string) => void;
  subtotal: number;
  descontos: number;
  shipping: number;
  showShipping: boolean;
  carrierLabel: string;
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const itemsCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-sm">Resumo do pedido</span>
          <span className="text-xs text-gray-500">
            ({itemsCount} {itemsCount === 1 ? "item" : "itens"})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">R$ {fmt(total)}</span>
          {open ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-3">
          {items.map((item) => {
            const price = parsePrice(item.price);
            const oldP = parsePrice((item as { old?: string }).old || "") || price * 8;
            const offPct = Math.round(((oldP - price) / oldP) * 100);
            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl p-3 flex gap-3 relative"
              >
                <div className="w-[80px] h-[80px] flex-shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[14px] text-gray-900 leading-snug pr-5">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600">
                      - {offPct}%
                    </span>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      Frete grátis
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <div className="text-base font-bold text-gray-900">R$ {fmt(price)}</div>
                    <div className="text-xs text-gray-400 line-through">R$ {fmt(oldP)}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 text-gray-600"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 text-gray-600"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      Subtotal: R$ {fmt(price * item.qty)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-rose-500"
                  aria-label="Remover"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>
            );
          })}

          {descontos > 0 && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <Ticket className="w-4 h-4 text-rose-500" />
                <span>Descontos aplicados</span>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-rose-50 text-rose-600">
                R$ {fmt(descontos)}
              </span>
            </div>
          )}

          <div className="border-t border-gray-100 pt-3 space-y-1.5">
            <h4 className="font-bold text-gray-900 text-sm mb-2">Resumo financeiro</h4>
            <Row label="Subtotal" value={`R$ ${fmt(subtotal)}`} />
            {descontos > 0 && (
              <Row
                label="Descontos"
                value={`R$ ${fmt(descontos)}`}
                labelClassName="text-rose-600 font-semibold"
                valueClassName="text-rose-600 font-semibold"
              />
            )}
            {showShipping && (
              <Row label="Frete" value={`${carrierLabel} (R$ ${fmt(shipping)})`} />
            )}
            <div className="flex items-center justify-between pt-2">
              <span className="font-bold text-gray-900 text-base">Total</span>
              <span className="font-bold text-gray-900 text-lg">R$ {fmt(total)}</span>
            </div>
            <div className="text-right text-xs text-gray-400">Impostos inclusos</div>
          </div>
        </div>
      )}
    </section>
  );
}

function Row({
  label,
  value,
  labelClassName,
  valueClassName,
}: {
  label: string;
  value: string;
  labelClassName?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={labelClassName ?? "text-gray-600"}>{label}</span>
      <span className={valueClassName ?? "text-gray-800"}>{value}</span>
    </div>
  );
}

/* ---------- Step 1: Identificação ---------- */

function StepIdentificacao({
  initial,
  onNext,
}: {
  initial: Customer;
  onNext: (c: Customer) => void;
}) {
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
    <div className="bg-white rounded-xl border border-gray-100 p-4">
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

        <div className="border border-dashed border-gray-300 rounded-lg p-4">
          <h4 className="font-bold text-gray-900 text-sm mb-2">Por que precisamos desses dados?</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
            <li>Enviar o comprovante de compra;</li>
            <li>Garantir a devolução caso necessário;</li>
            <li>Acompanhar o andamento do pedido.</li>
          </ul>
        </div>

        {error && <div className="text-sm text-rose-600 text-center">{error}</div>}

        <button
          type="submit"
          className="w-full h-12 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-base uppercase tracking-wide"
        >
          Ir para entrega
        </button>
      </form>
    </div>
  );
}

/* ---------- Step 2: Entrega ---------- */

function StepEntrega({
  initial,
  onNext,
}: {
  initial: Address;
  onNext: (a: Address) => void;
}) {
  const [form, setForm] = useState<Address>(initial);
  const [error, setError] = useState<string | null>(null);

  const maskCep = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.cep.replace(/\D/g, "").length !== 8) return setError("CEP inválido");
    if (!form.street.trim()) return setError("Informe o endereço");
    if (!form.number.trim()) return setError("Informe o número");
    if (!form.district.trim()) return setError("Informe o bairro");
    if (!form.city.trim()) return setError("Informe a cidade");
    if (form.state.trim().length !== 2) return setError("Informe o estado (UF)");
    setError(null);
    onNext(form);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h2 className="font-bold text-gray-900 text-lg mb-4">Endereço de entrega</h2>
      <form onSubmit={submit} className="space-y-4">
        <Field label="CEP">
          <input
            inputMode="numeric"
            placeholder="00000-000"
            value={form.cep}
            onChange={(e) => setForm({ ...form, cep: maskCep(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <Field label="Endereço">
          <input
            placeholder="Rua / Avenida"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            maxLength={120}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Número">
            <input
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              maxLength={10}
              className={inputCls}
            />
          </Field>
          <Field label="Complemento (opcional)">
            <input
              value={form.complement}
              onChange={(e) => setForm({ ...form, complement: e.target.value })}
              maxLength={60}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Bairro">
          <input
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            maxLength={80}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-[1fr_80px] gap-3">
          <Field label="Cidade">
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              maxLength={80}
              className={inputCls}
            />
          </Field>
          <Field label="UF">
            <input
              value={form.state}
              onChange={(e) =>
                setForm({ ...form, state: e.target.value.toUpperCase().slice(0, 2) })
              }
              maxLength={2}
              className={inputCls}
            />
          </Field>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-2">Transportadora</h3>
          <div className="space-y-2">
            {CARRIERS.map((c) => {
              const selected = form.carrier === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setForm({ ...form, carrier: c.id })}
                  className={`w-full flex items-center justify-between gap-3 rounded-lg border p-3 text-left ${
                    selected
                      ? "border-rose-500 bg-rose-50/40"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.eta}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">R$ {fmt(c.price)}</span>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selected ? "border-rose-500" : "border-gray-300"
                      }`}
                    >
                      {selected && <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {error && <div className="text-sm text-rose-600 text-center">{error}</div>}

        <button
          type="submit"
          className="w-full h-12 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-base uppercase tracking-wide"
        >
          Ir para pagamento
        </button>
      </form>
    </div>
  );
}

/* ---------- Step 3: Pagamento (bumps + PIX) ---------- */

function StepPagamento({
  bumpsToShow,
  onBumpClick,
  getBumpCount,
  onFinish,
}: {
  bumpsToShow: Bump[];
  onBumpClick: (b: Bump) => void;
  getBumpCount: (b: Bump) => number;
  onFinish: () => void;
}) {
  return (
    <div className="space-y-4">
      {bumpsToShow.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-center font-bold text-gray-900 text-base pt-1">
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
                      <img
                        src={b.img}
                        alt={b.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[15px] text-gray-900 leading-snug">{b.name}</h3>
                      <div className="text-xs text-gray-400 line-through mt-1">
                        R$ {fmt(b.old)}
                      </div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-emerald-600 font-bold text-lg">
                          R$ {fmt(b.price)}
                        </span>
                        <span className="text-emerald-600 text-sm font-semibold">
                          (R$ {fmt(off)} OFF)
                        </span>
                      </div>
                      {b.note && (
                        <div className="text-emerald-700 text-sm font-semibold mt-1">
                          {b.note}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500 mt-2">
                    {count > 0 ? `${count} no carrinho` : "Nenhum no carrinho"}
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
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-3">Método de pagamento</h3>
        <div className="flex items-center justify-between gap-3 rounded-lg border-2 border-rose-500 bg-rose-50/40 p-3">
          <div className="flex items-center gap-3">
            <img src={pixLogo} alt="PIX" className="w-10 h-10 object-contain" />
            <div>
              <div className="font-bold text-gray-900 text-sm">PIX à vista</div>
              <div className="text-xs text-gray-500">Aprovação imediata</div>
            </div>
          </div>
          <span className="w-5 h-5 rounded-full border-2 border-rose-500 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </span>
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full h-12 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-base uppercase tracking-wide"
      >
        Finalizar Compra
      </button>
    </div>
  );
}

/* ---------- Variant modal ---------- */

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
          <label className="block font-semibold text-gray-900 text-sm mb-2">
            {bump.variantLabel}
          </label>
          <div className="relative">
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              className="w-full h-12 rounded-lg border-2 border-blue-500 bg-blue-50/30 px-3 text-sm appearance-none focus:outline-none"
            >
              <option value="">
                Selecione {bump.variantLabel === "Cor" ? "a cor" : "o tamanho"}...
              </option>
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

/* ---------- Field helpers ---------- */

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

/* ---------- Step 4: PIX copia e cola ---------- */

type PixData = {
  id: string;
  amount: number;
  pix: { qrCode: { emv: string; image?: string }; expirationDate?: number };
};

function StepPix({ customer, totalFinal }: { customer: Customer; totalFinal: number }) {
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
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-gray-700 font-semibold">Gerando seu PIX...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center space-y-3">
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

  const steps = [
    {
      n: 1,
      Icon: Copy,
      title: "Copie o código",
      desc: "Use o botão copiar para levar o código Pix.",
    },
    {
      n: 2,
      Icon: Smartphone,
      title: "Abra o app do banco",
      desc: "Entre no aplicativo financeiro onde deseja pagar.",
    },
    {
      n: 3,
      Icon: Clipboard,
      title: "Pix > Copia e cola",
      desc: "Cole o código na opção Pix copia e cola.",
    },
    {
      n: 4,
      Icon: Info,
      title: "Confira os dados",
      desc: "Verifique recebedor e valor antes de confirmar.",
    },
    {
      n: 5,
      Icon: CheckCircle2,
      title: "Conclua o pagamento",
      desc: "Finalize e guarde o comprovante para acompanhamento.",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Aguardando pagamento */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <h3 className="font-bold text-gray-900 text-lg">Já é quase seu...</h3>
        <p className="text-sm text-gray-600 mt-1">
          Pague seu Pix dentro de 30 minutos para garantir sua compra.
        </p>
        <div className="my-6 flex justify-center">
          <div className="w-36 h-36 rounded-full bg-gray-100 flex items-center justify-center">
            <img src={pixLogo} alt="PIX" className="w-16 h-16 object-contain" />
          </div>
        </div>
        <p className="font-bold text-gray-900 text-lg">Aguardando pagamento...</p>
      </section>

      {/* Pagamento via Pix */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-bold text-gray-900 text-lg">Pagamento via Pix</h3>
        <p className="text-sm text-gray-600">Use o QR Code ou copie o código Pix abaixo:</p>
        <div className="rounded-lg border border-gray-200 px-3 py-3 text-xs font-mono text-gray-800 truncate">
          {emv}
        </div>
        <button
          onClick={copyEmv}
          className="w-full h-12 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          {copied ? "Código copiado!" : "Copiar código Pix"}
        </button>
      </section>

      {/* Como pagar */}
      <section className="space-y-3">
        <h3 className="font-bold text-gray-900 text-lg px-1">Como pagar com Pix (copia e cola)</h3>
        {steps.map((s) => {
          const Icon = s.Icon;
          return (
            <div key={s.n} className="relative">
              <div className="absolute -top-2 -left-1 w-9 h-9 rounded-full bg-gray-900 text-white font-bold text-sm flex items-center justify-center z-10">
                {s.n}
              </div>
              <div className="bg-white rounded-xl border border-gray-200 px-4 pt-5 pb-4 ml-4">
                <div className="flex gap-3">
                  <Icon className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-base leading-tight">{s.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <button
        onClick={() => {
          clear();
          navigate({ to: "/" });
        }}
        className="block w-full text-center text-sm text-gray-500 underline py-3"
      >
        Voltar ao início
      </button>
    </div>
  );
}
