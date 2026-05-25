import { createFileRoute } from "@tanstack/react-router";

const PIXEL_CODE = "D81OUNRC77UDUGTVF3LG";
const ENDPOINT = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const Route = createFileRoute("/api/tiktok-event")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env.TIKTOK_PIXEL_ACCESS_TOKEN;
        if (!token) {
          return new Response(JSON.stringify({ error: "missing token" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const body = (await request.json().catch(() => ({}))) as {
          event?: string;
          event_id?: string;
          url?: string;
          email?: string;
          phone?: string;
          value?: number;
          currency?: string;
          contents?: Array<{
            content_id?: string;
            content_name?: string;
            quantity?: number;
            price?: number;
          }>;
        };

        if (!body.event) {
          return new Response(JSON.stringify({ error: "missing event" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
          "";
        const ua = request.headers.get("user-agent") ?? "";

        const user: Record<string, string> = {};
        if (body.email) user.email = await sha256(body.email);
        if (body.phone) user.phone = await sha256(body.phone);
        if (ip) user.ip = ip;
        if (ua) user.user_agent = ua;

        const payload = {
          event_source: "web",
          event_source_id: PIXEL_CODE,
          data: [
            {
              event: body.event,
              event_time: Math.floor(Date.now() / 1000),
              event_id: body.event_id ?? crypto.randomUUID(),
              user,
              page: { url: body.url ?? "" },
              properties: {
                currency: body.currency ?? "BRL",
                value: body.value ?? 0,
                contents: body.contents ?? [],
              },
            },
          ],
        };

        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Token": token,
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
