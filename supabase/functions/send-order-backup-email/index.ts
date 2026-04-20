import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LineItem {
  productId?: string;
  wooId?: number | string | null;
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
  items: LineItem[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const serviceId = Deno.env.get("VITE_EMAILJS_SERVICE_ID") ?? Deno.env.get("EMAILJS_SERVICE_ID");
    const templateId = Deno.env.get("VITE_EMAILJS_TEMPLATE_ID") ?? Deno.env.get("EMAILJS_TEMPLATE_ID");
    const publicKey = Deno.env.get("VITE_EMAILJS_PUBLIC_KEY") ?? Deno.env.get("EMAILJS_PUBLIC_KEY");
    const privateKey = Deno.env.get("EMAILJS_PRIVATE_KEY");

    if (!serviceId || !templateId || !publicKey) {
      return new Response(
        JSON.stringify({
          error: "EmailJS is not configured",
          missing: {
            serviceId: !serviceId,
            templateId: !templateId,
            publicKey: !publicKey,
          },
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const order = (await req.json()) as OrderPayload;

    const currency = order.currency ?? "USD";
    const itemsText = (order.items ?? [])
      .map((i) => {
        const sku = i.wooId != null ? String(i.wooId) : i.productId ?? "";
        return `- ${i.name} | SKU ${sku} | qty ${i.quantity} | ${currency} ${Number(i.lineTotal).toFixed(2)}`;
      })
      .join("\n");

    const templateParams = {
      to_email: "orderbackups@helixamino.com",
      order_id: order.order_id ?? "",
      order_number: order.order_number,
      payment_method: order.payment_method ?? "unpaid",
      customer_name: order.customer_name ?? "",
      customer_email: order.customer_email ?? "",
      notes: order.notes ?? "",
      currency,
      total: Number(order.total).toFixed(2),
      subtotal: Number(order.subtotal ?? order.total).toFixed(2),
      items_count: (order.items ?? []).reduce((s, i) => s + i.quantity, 0),
      items_text: itemsText,
      submitted_at: new Date().toISOString(),
    };

    const body: Record<string, unknown> = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: templateParams,
    };
    if (privateKey) body.accessToken = privateKey;

    const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "https://helixamino.com",
      },
      body: JSON.stringify(body),
    });

    const emailText = await emailRes.text();

    if (!emailRes.ok) {
      return new Response(
        JSON.stringify({
          error: "EmailJS rejected the request",
          status: emailRes.status,
          detail: emailText,
          hint: emailRes.status === 403
            ? "Enable 'Allow EmailJS API for non-browser applications' in EmailJS Account > Security, or set EMAILJS_PRIVATE_KEY."
            : undefined,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, provider_status: emailRes.status, provider_body: emailText }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: "Edge function threw", detail: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
