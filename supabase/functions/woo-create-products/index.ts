import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InputProduct {
  name: string;
  sku: string;
  regular_price: string | number;
  description?: string;
  short_description?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const siteUrl = Deno.env.get("WOO_SITE_URL");
    const ck = Deno.env.get("WOO_CONSUMER_KEY");
    const cs = Deno.env.get("WOO_CONSUMER_SECRET");
    if (!siteUrl || !ck || !cs) throw new Error("Missing WOO_* env vars");

    const body = await req.json().catch(() => ({}));
    const products: InputProduct[] = Array.isArray(body?.products) ? body.products : [];
    if (products.length === 0) throw new Error("No products provided");

    const auth = "Basic " + btoa(`${ck}:${cs}`);
    const base = siteUrl.replace(/\/$/, "") + "/wp-json/wc/v3";

    const results: Array<{ sku: string; status: "created" | "updated" | "error"; id?: number; error?: string }> = [];
    const BATCH = 50;

    for (let i = 0; i < products.length; i += BATCH) {
      const chunk = products.slice(i, i + BATCH).map((p) => ({
        name: p.name,
        sku: p.sku,
        regular_price: String(p.regular_price),
        description: p.description ?? "",
        short_description: p.short_description ?? p.description ?? "",
        status: "publish",
        type: "simple",
      }));

      const res = await fetch(`${base}/products/batch`, {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ create: chunk }),
      });

      const text = await res.text();
      let parsed: { create?: Array<{ id?: number; sku?: string; error?: { message: string } }> } = {};
      try {
        parsed = JSON.parse(text);
      } catch {
        results.push(
          ...chunk.map((c) => ({
            sku: c.sku,
            status: "error" as const,
            error: `Non-JSON response: ${text.slice(0, 200)}`,
          })),
        );
        continue;
      }

      const created = parsed.create ?? [];
      for (let j = 0; j < chunk.length; j++) {
        const input = chunk[j];
        const out = created[j];
        if (out?.error) {
          // If SKU already exists, try update via PUT to /products?sku=
          if (out.error.message?.toLowerCase().includes("sku") || out.error.message?.toLowerCase().includes("invalid or duplicate")) {
            const lookup = await fetch(`${base}/products?sku=${encodeURIComponent(input.sku)}`, {
              headers: { Authorization: auth },
            });
            const existing = (await lookup.json().catch(() => [])) as Array<{ id: number }>;
            if (Array.isArray(existing) && existing[0]?.id) {
              const upd = await fetch(`${base}/products/${existing[0].id}`, {
                method: "PUT",
                headers: { Authorization: auth, "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: input.name,
                  regular_price: input.regular_price,
                  description: input.description,
                  short_description: input.short_description,
                }),
              });
              const updJson = (await upd.json().catch(() => ({}))) as { id?: number; code?: string; message?: string };
              if (updJson.id) {
                results.push({ sku: input.sku, status: "updated", id: updJson.id });
              } else {
                results.push({ sku: input.sku, status: "error", error: updJson.message ?? "update failed" });
              }
              continue;
            }
          }
          results.push({ sku: input.sku, status: "error", error: out.error.message });
        } else if (out?.id) {
          results.push({ sku: input.sku, status: "created", id: out.id });
        } else {
          results.push({ sku: input.sku, status: "error", error: "no id returned" });
        }
      }
    }

    const summary = {
      total: products.length,
      created: results.filter((r) => r.status === "created").length,
      updated: results.filter((r) => r.status === "updated").length,
      errors: results.filter((r) => r.status === "error").length,
    };

    return new Response(JSON.stringify({ summary, results }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
