import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck, Lock, Truck, X, Ticket, Gift } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

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

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, updateQty, removeItem } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const timer = useCountdown(5 * 60 * 60 - 7);

  const oldTotal = items.reduce((s, i) => s + parsePrice(i.price) * 8 * i.qty, 0);
  const oldRealistic = items.reduce((s, i) => {
    const old = parsePrice((i as any).old || "");
    return s + (old || parsePrice(i.price) * 8) * i.qty;
  }, 0);
  const descontos = Math.max(0, oldRealistic - total);
  const frete = 25.5;
  const totalFinal = total + frete;

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <button
            onClick={() => (step === 2 ? setStep(1) : navigate({ to: "/carrinho" }))}
            className="text-gray-800"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-base font-bold text-gray-900">Resumo do Pedido</h1>
            <div className="flex items-center justify-center gap-1 text-xs mt-0.5">
              {step === 1 ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Compra garantida</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Dados criptografados</span>
                </>
              )}
            </div>
          </div>
          <div className="w-5" />
        </div>
        {/* dashed bar */}
        <div className="h-1.5 flex">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className={`flex-1 mx-[1px] ${i % 2 === 0 ? "bg-rose-400" : "bg-sky-400"}`} />
          ))}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-3 pt-3">
        {step === 1 ? (
          <Step1
            items={items}
            total={total}
            descontos={descontos}
            frete={frete}
            totalFinal={totalFinal}
            updateQty={updateQty}
            removeItem={removeItem}
          />
        ) : (
          <Step2 />
        )}
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
          <span className="text-sm text-gray-500">Total ({items.length} {items.length === 1 ? "item" : "itens"})</span>
          <span className="text-lg font-bold text-gray-900">R$ {fmt(totalFinal)}</span>
        </div>
        {step === 1 ? (
          <button
            onClick={() => setStep(2)}
            disabled={items.length === 0}
            className="block w-full bg-rose-500 text-white font-bold py-3.5 text-sm disabled:opacity-50"
          >
            O cupom expira em {timer}
          </button>
        ) : (
          <div className="bg-rose-500 text-white font-bold py-3.5 text-sm text-center">
            O cupom expira em {timer}
          </div>
        )}
      </footer>
    </div>
  );
}

function Step1({
  items,
  total,
  descontos,
  frete,
  totalFinal,
  updateQty,
  removeItem,
}: {
  items: ReturnType<typeof useCart>["items"];
  total: number;
  descontos: number;
  frete: number;
  totalFinal: number;
  updateQty: (id: string, q: number) => void;
  removeItem: (id: string) => void;
}) {
  return (
    <>
      <div className="text-sm font-medium text-gray-700 px-1 py-2">Loja ({items.length} {items.length === 1 ? "item" : "itens"})</div>

      {/* Frete grátis banner */}
      <div className="bg-sky-50 rounded-xl flex items-center gap-3 px-4 py-3 mb-3">
        <Truck className="w-6 h-6 text-sky-800" />
        <span className="text-sky-900 font-bold text-base">Você ganhou frete grátis!</span>
      </div>

      {/* Resumo do carrinho */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <h3 className="px-4 pt-4 pb-2 font-bold text-gray-900">Resumo do carrinho ({items.length} {items.length === 1 ? "item" : "itens"})</h3>
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

      {/* Descontos aplicados */}
      <div className="bg-white border-t border-b border-gray-100 mt-3 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-rose-500" />
          <span className="text-sm font-medium text-gray-800">Descontos aplicados</span>
        </div>
        <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">R$ {fmt(descontos)}</span>
      </div>

      {/* Resumo financeiro */}
      <div className="bg-white px-4 py-4 mt-3 rounded-xl border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-3">Resumo financeiro</h4>
        <div className="space-y-2 text-sm">
          <Row label="Subtotal" value={`R$ ${fmt(total)}`} />
          <Row label={<span className="text-rose-600 font-semibold">Descontos</span>} value={<span className="text-rose-600 font-semibold">R$ {fmt(descontos)}</span>} />
          <Row label="Frete" value={`JadLog (R$ ${fmt(frete)})`} />
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

function Step2() {
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
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!emailOk) return setError("E-mail inválido");
    if (form.phone.replace(/\D/g, "").length < 10) return setError("Telefone inválido");
    if (form.name.trim().split(" ").length < 2) return setError("Informe nome e sobrenome");
    if (form.cpf.replace(/\D/g, "").length !== 11) return setError("CPF inválido");
    setError(null);
    alert("Próximo passo: entrega (a implementar)");
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 px-4 py-5 space-y-4 mt-2">
      <Field label="E-mail">
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          maxLength={255}
          className="w-full h-12 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:border-gray-900"
        />
      </Field>
      <Field label="Telefone">
        <input
          inputMode="numeric"
          placeholder="(99) 99999-9999"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
          className="w-full h-12 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:border-gray-900"
        />
      </Field>
      <Field label="Nome completo">
        <input
          placeholder="Nome e Sobrenome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          maxLength={120}
          className="w-full h-12 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:border-gray-900"
        />
      </Field>
      <Field label="CPF/CNPJ">
        <input
          inputMode="numeric"
          placeholder="000.000.000-00"
          value={form.cpf}
          onChange={(e) => setForm({ ...form, cpf: maskCpf(e.target.value) })}
          className="w-full h-12 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:border-gray-900"
        />
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

      <button
        type="submit"
        className="w-full h-12 rounded-lg bg-slate-900 text-white font-bold text-base"
      >
        Ir para entrega
      </button>
    </form>
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
