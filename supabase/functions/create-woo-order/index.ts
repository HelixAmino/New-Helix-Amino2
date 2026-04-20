import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LineItemIn {
  productId: string;
  wooId?: number;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface Payload {
  items: LineItemIn[];
  subtotal: number;
  total: number;
  userId: string | null;
  customerName?: string;
  customerEmail?: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const WOO_SITE_URL = Deno.env.get("WOO_SITE_URL") ?? "https://backend.helixamino.com";
    const WOO_CONSUMER_KEY = Deno.env.get("WOO_CONSUMER_KEY") ?? "";
    const WOO_CONSUMER_SECRET = Deno.env.get("WOO_CONSUMER_SECRET") ?? "";

    const payload = (await req.json()) as Payload;

    if (!payload?.items?.length) {
      return json({ error: "No items in order" }, 400);
    }

    const [firstName, ...rest] = (payload.customerName ?? "").trim().split(/\s+/);
    const lastName = rest.join(" ");

    const wooBody = {
      payment_method: "venmo_zelle",
      payment_method_title: "Venmo / Zelle (off-platform)",
      set_paid: false,
      status: "pending",
      billing: {
        first_name: firstName || "",
        last_name: lastName || "",
        email: payload.customerEmail ?? "",
      },
      line_items: payload.items.map((i) => ({
        product_id: i.wooId ?? undefined,
        name: i.name,
        quantity: i.quantity,
        price: i.unitPrice,
        subtotal: String(i.lineTotal.toFixed(2)),
        total: String(i.lineTotal.toFixed(2)),
      })),
      meta_data: [
        { key: "_helix_user_id", value: payload.userId ?? "" },
      ],
    };

    let wooOrderId: number | null = null;
    let wooOrderNumber: string | null = null;

    if (WOO_CONSUMER_KEY && WOO_CONSUMER_SECRET) {
      const auth = btoa(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`);
      const wooRes = await fetch(
        `${WOO_SITE_URL.replace(/\/$/, "")}/wp-json/wc/v3/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify(wooBody),
        }
      );

      const wooJson = await wooRes.json().catch(() => null);

      if (!wooRes.ok) {
        const msg =
          (wooJson && (wooJson.message || wooJson?.data?.message)) ??
          `WooCommerce order failed (${wooRes.status})`;
        return json({ error: msg }, 502);
      }

      wooOrderId = wooJson?.id ?? null;
      wooOrderNumber = wooJson?.number ? String(wooJson.number) : null;
    }

    const orderNumber =
      wooOrderNumber ??
      `HA-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.random()
        .toString(36)
        .toUpperCase()
        .slice(2, 6)}`;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const { data, error } = await admin
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: payload.userId,
        cart_key: wooOrderId ? String(wooOrderId) : "",
        items: payload.items,
        subtotal: payload.subtotal,
        total: payload.total,
        currency: "USD",
        payment_method: "unpaid",
        payment_status: "pending",
        customer_name: payload.customerName ?? "",
        customer_email: payload.customerEmail ?? "",
      })
      .select()
      .maybeSingle();

    if (error) {
      return json({ error: error.message }, 500);
    }

    return json({ order: data });
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      500
    );
  }
});
