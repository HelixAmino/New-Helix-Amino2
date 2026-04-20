import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OrderLineItemPayload {
  productId?: string;
  wooId?: number | string;
  sku?: string;
  name: string;
  quantity: number;
  unitPrice?: number;
  lineTotal: number;
}

interface OrderPayload {
  order_id?: string;
  order_number: string;
  subtotal?: number;
  total: number;
  currency?: string;
  payment_method?: string;
  customer_name?: string;
  customer_email?: string;
  notes?: string;
  items: OrderLineItemPayload[];
  cart_key?: string;
  submitted_at?: string;
}

Deno.serve(async (req: Request) => {
  console.log("[notify-order-backup] request", req.method, req.url);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const order = (await req.json()) as OrderPayload;
    console.log("[notify-order-backup] payload", {
      order_id: order?.order_id,
      order_number: order?.order_number,
      items: Array.isArray(order?.items) ? order.items.length : "n/a",
      total: order?.total,
    });

    if (!order?.order_number || !Array.isArray(order.items)) {
      console.error("[notify-order-backup] invalid payload");
      return new Response(
        JSON.stringify({ error: "Invalid payload: order_number and items are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const phpUrl = Deno.env.get("ORDER_BACKUP_PHP_URL") ?? "";
    const phpSecret = Deno.env.get("ORDER_BACKUP_PHP_SECRET") ?? "";
    const fromEmail = Deno.env.get("ORDER_BACKUP_FROM") ?? "no-reply@helixamino.com";

    console.log("[notify-order-backup] config", {
      hasPhpUrl: Boolean(phpUrl),
      phpUrl,
      hasPhpSecret: Boolean(phpSecret),
      fromEmail,
    });

    if (!phpUrl) {
      console.error("[notify-order-backup] ORDER_BACKUP_PHP_URL missing");
      return new Response(
        JSON.stringify({ error: "ORDER_BACKUP_PHP_URL not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const items = order.items.map((i) => ({
      name: i.name,
      sku: i.sku ?? (i.wooId != null ? String(i.wooId) : i.productId ?? ""),
      quantity: i.quantity,
      lineTotal: i.lineTotal,
    }));

    const body = {
      from: fromEmail,
      order_id: order.order_id ?? "",
      order_number: order.order_number,
      total: order.total,
      currency: order.currency ?? "USD",
      payment_method: order.payment_method ?? "unpaid",
      customer_name: order.customer_name ?? "",
      customer_email: order.customer_email ?? "",
      notes: order.notes ?? "",
      items,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (phpSecret) headers["X-Backup-Secret"] = phpSecret;

    const res = await fetch(phpUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const text = await res.text().catch(() => "");
    console.log("[notify-order-backup] php response", res.status, text);

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "PHP endpoint error", status: res.status, detail: text }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[notify-order-backup] exception", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
