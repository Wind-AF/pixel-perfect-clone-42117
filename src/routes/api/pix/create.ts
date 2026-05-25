import { createFileRoute } from "@tanstack/react-router";

const ENDPOINT = "https://api.escalecyber.com/v1/payments/transactions";

type Body = {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDocument: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

export const Route = createFileRoute("/api/pix/create")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.CYBERHUB_API_KEY;
        if (!apiKey) {
          return Response.json({ error: "missing CYBERHUB_API_KEY" }, { status: 500 });
        }

        const body = (await request.json().catch(() => null)) as Body | null;
        if (!body || typeof body.amount !== "number" || body.amount <= 0) {
          return Response.json({ error: "invalid body" }, { status: 400 });
        }

        const payload = {
          amount: Number(body.amount.toFixed(2)),
          customerName: String(body.customerName || "").slice(0, 120),
          customerEmail: String(body.customerEmail || "").slice(0, 255),
          customerPhone: String(body.customerPhone || "").replace(/\D/g, ""),
          customerDocument: String(body.customerDocument || "").replace(/\D/g, ""),
          customerDocumentType:
            String(body.customerDocument || "").replace(/\D/g, "").length === 14 ? "cnpj" : "cpf",
          description: body.description?.slice(0, 200) ?? "Pedido",
          metadata: body.metadata ?? {},
        };

        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        return new Response(text, {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
