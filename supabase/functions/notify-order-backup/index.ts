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
  unitPrice: number;
  lineTotal: number;
}

interface OrderPayload {
  order_number: string;
  subtotal: number;
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function money(n: number, currency = "USD"): string {
  if (!Number.isFinite(n)) return `${currency} 0.00`;
  return `${currency} ${n.toFixed(2)}`;
}

Deno.serve(async (req: Request) => {
  console.log("[notify-order-backup] request", req.method, req.url);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const order = (await req.json()) as OrderPayload;
    console.log("[notify-order-backup] payload received", {
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

    const currency = order.currency ?? "USD";
    const submittedAt = order.submitted_at
      ? new Date(order.submitted_at)
      : new Date();

    const mailgunDomain = Deno.env.get("MAILGUN_DOMAIN") ?? "mg.helixamino.com";
    const mailgunApiKey = Deno.env.get("MAILGUN_API_KEY") ?? "";
    const backupRecipientEnv = Deno.env.get("ORDER_BACKUP_EMAIL");
    const fromEmailEnv = Deno.env.get("ORDER_BACKUP_FROM");
    const backupRecipient = backupRecipientEnv ?? "orderbackups@helixamino.com";
    const fromEmail = fromEmailEnv ?? `info@${mailgunDomain}`;

    console.log("[notify-order-backup] config", {
      mailgunDomain,
      hasMailgunKey: Boolean(mailgunApiKey),
      backupRecipient,
      backupRecipientFromSecret: Boolean(backupRecipientEnv),
      fromEmail,
      fromEmailFromSecret: Boolean(fromEmailEnv),
    });

    if (!mailgunApiKey) {
      console.error("[notify-order-backup] MAILGUN_API_KEY missing");
      return new Response(
        JSON.stringify({ error: "Mailgun API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const textLines: string[] = [];
    textLines.push(`Order Backup - ${order.order_number}`);
    textLines.push("");
    textLines.push(`Submitted: ${submittedAt.toISOString()}`);
    textLines.push(`Payment method: ${order.payment_method ?? "unpaid"}`);
    textLines.push("");
    textLines.push(`Customer name: ${order.customer_name || "(not provided)"}`);
    textLines.push(`Customer email: ${order.customer_email || "(not provided)"}`);
    if (order.cart_key) textLines.push(`Cart key: ${order.cart_key}`);
    if (order.notes) textLines.push(`Notes: ${order.notes}`);
    textLines.push("");
    textLines.push("Items:");
    for (const it of order.items) {
      const sku = it.sku ?? (it.wooId != null ? String(it.wooId) : it.productId ?? "");
      textLines.push(
        `  - ${it.name} | SKU ${sku || "n/a"} | qty ${it.quantity} x ${money(it.unitPrice, currency)} = ${money(it.lineTotal, currency)}`
      );
    }
    textLines.push("");
    textLines.push(`Subtotal: ${money(order.subtotal, currency)}`);
    textLines.push(`Total:    ${money(order.total, currency)}`);

    const rowsHtml = order.items
      .map((it) => {
        const sku = it.sku ?? (it.wooId != null ? String(it.wooId) : it.productId ?? "");
        return `
          <tr style="border-top:1px solid #1e3a4a;">
            <td style="padding:10px 8px;color:#f1f5f9;font-size:13px;">${escapeHtml(it.name)}</td>
            <td style="padding:10px 8px;color:#94a3b8;font-size:13px;font-family:ui-monospace,monospace;">${escapeHtml(String(sku || "n/a"))}</td>
            <td style="padding:10px 8px;color:#f1f5f9;font-size:13px;text-align:center;">${it.quantity}</td>
            <td style="padding:10px 8px;color:#94a3b8;font-size:13px;text-align:right;">${escapeHtml(money(it.unitPrice, currency))}</td>
            <td style="padding:10px 8px;color:#f1f5f9;font-size:13px;font-weight:600;text-align:right;">${escapeHtml(money(it.lineTotal, currency))}</td>
          </tr>`;
      })
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;background:#07111d;color:#e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:#0a1825;padding:24px 32px;border-bottom:1px solid #164e63;">
          <h1 style="margin:0;font-size:20px;color:#2dd4bf;">Helix Amino</h1>
          <p style="margin:4px 0 0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Order Backup - Payment Submitted</p>
        </div>
        <div style="padding:28px 32px;">
          <h2 style="margin:0 0 8px;font-size:18px;color:#f1f5f9;">Order ${escapeHtml(order.order_number)}</h2>
          <p style="margin:0 0 24px;font-size:12px;color:#64748b;">Submitted ${escapeHtml(submittedAt.toISOString())}</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:6px 0;color:#94a3b8;font-size:13px;width:160px;">Payment method</td>
              <td style="padding:6px 0;color:#f1f5f9;font-size:13px;font-weight:600;">${escapeHtml(order.payment_method ?? "unpaid")}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#94a3b8;font-size:13px;">Customer name</td>
              <td style="padding:6px 0;color:#f1f5f9;font-size:13px;">${escapeHtml(order.customer_name || "(not provided)")}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#94a3b8;font-size:13px;">Customer email</td>
              <td style="padding:6px 0;color:#2dd4bf;font-size:13px;">${escapeHtml(order.customer_email || "(not provided)")}</td>
            </tr>
            ${order.notes ? `<tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Notes</td><td style="padding:6px 0;color:#f1f5f9;font-size:13px;">${escapeHtml(order.notes)}</td></tr>` : ""}
          </table>

          <table style="width:100%;border-collapse:collapse;background:#050d14;border-radius:8px;overflow:hidden;">
            <thead>
              <tr style="background:#0a1825;">
                <th style="padding:10px 8px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;text-align:left;">Item</th>
                <th style="padding:10px 8px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;text-align:left;">SKU</th>
                <th style="padding:10px 8px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;text-align:center;">Qty</th>
                <th style="padding:10px 8px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;text-align:right;">Unit</th>
                <th style="padding:10px 8px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;text-align:right;">Line</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>

          <table style="width:100%;border-collapse:collapse;margin-top:18px;">
            <tr>
              <td style="padding:6px 0;color:#94a3b8;font-size:13px;text-align:right;">Subtotal</td>
              <td style="padding:6px 0 6px 24px;color:#f1f5f9;font-size:13px;text-align:right;width:140px;">${escapeHtml(money(order.subtotal, currency))}</td>
            </tr>
            <tr style="border-top:1px solid #1e3a4a;">
              <td style="padding:10px 0;color:#f1f5f9;font-size:15px;font-weight:700;text-align:right;">Total</td>
              <td style="padding:10px 0 10px 24px;color:#2dd4bf;font-size:18px;font-weight:800;text-align:right;">${escapeHtml(money(order.total, currency))}</td>
            </tr>
          </table>
        </div>
        <div style="padding:16px 32px;background:#0a1825;border-top:1px solid #164e63;font-size:11px;color:#475569;text-align:center;">
          Automated backup - Helix Amino - helixamino.com
        </div>
      </div>`;

    const formData = new FormData();
    formData.append("from", `Helix Amino Orders <${fromEmail}>`);
    formData.append("to", backupRecipient);
    formData.append("subject", `Order ${order.order_number} - ${money(order.total, currency)} - ${order.payment_method ?? "unpaid"}`);
    formData.append("text", textLines.join("\n"));
    formData.append("html", html);
    if (order.customer_email) {
      formData.append("h:Reply-To", order.customer_email);
    }

    const response = await fetch(
      `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${mailgunApiKey}`)}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error("[notify-order-backup] Mailgun error", response.status, detail);
      return new Response(
        JSON.stringify({ error: "Mailgun error", status: response.status, detail }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const mgBody = await response.text().catch(() => "");
    console.log("[notify-order-backup] Mailgun ok", mgBody);

    return new Response(JSON.stringify({ success: true, recipient: backupRecipient }), {
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
