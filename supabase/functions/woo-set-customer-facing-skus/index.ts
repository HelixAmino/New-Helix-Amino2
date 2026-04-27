import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TARGET_KEYS = [
  "customer_facing_sku",
  "fulfillment_sku",
  "inventory_sku",
  "_inventory_sku",
];

interface MetaEntry {
  id?: number;
  key: string;
  value: unknown;
}

interface UpdateResult {
  sku: string;
  woo_id: number;
  status: "updated" | "error" | "skipped";
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  error?: string;
}

async function fetchProduct(base: string, auth: string, id: number) {
  const r = await fetch(`${base}/products/${id}`, {
    headers: { Authorization: auth, Accept: "application/json" },
  });
  if (!r.ok) throw new Error(`GET ${id} ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return await r.json();
}

function pickMeta(meta: MetaEntry[] | undefined, keys: string[]) {
  const out: Record<string, { id?: number; value: unknown }> = {};
  for (const m of meta ?? []) {
    if (keys.includes(m.key)) out[m.key] = { id: m.id, value: m.value };
  }
  return out;
}

async function updateProduct(
  base: string,
  auth: string,
  woo_id: number,
  helixSku: string,
  existing: Record<string, { id?: number; value: unknown }>,
) {
  const meta_data: MetaEntry[] = TARGET_KEYS.map((key) => {
    const ex = existing[key];
    return ex?.id
      ? { id: ex.id, key, value: helixSku }
      : { key, value: helixSku };
  });

  const res = await fetch(`${base}/products/${woo_id}`, {
    method: "PUT",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({ meta_data }),
  });
  if (!res.ok) {
    throw new Error(`PUT ${woo_id} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  return await res.json();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const siteUrl = Deno.env.get("WOO_SITE_URL")!;
    const ck = Deno.env.get("WOO_CONSUMER_KEY")!;
    const cs = Deno.env.get("WOO_CONSUMER_SECRET")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const auth = "Basic " + btoa(`${ck}:${cs}`);
    const base = siteUrl.replace(/\/$/, "") + "/wp-json/wc/v3";

    const url = new URL(req.url);
    const prefix = url.searchParams.get("prefix") ?? "HA39.";
    const debugSku = url.searchParams.get("debug");
    const singleSku = url.searchParams.get("sku");

    if (debugSku) {
      const { data: row, error: dErr } = await supabase
        .from("woo_product_map")
        .select("sku, woo_id")
        .eq("sku", debugSku)
        .maybeSingle();
      if (dErr) throw dErr;
      if (!row) {
        return new Response(
          JSON.stringify({ error: `SKU not found: ${debugSku}` }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const product = await fetchProduct(base, auth, row.woo_id);
      return new Response(
        JSON.stringify(
          {
            mapping_row: row,
            woo_product: {
              id: product?.id,
              name: product?.name,
              sku: product?.sku,
              meta_data: product?.meta_data,
            },
          },
          null,
          2,
        ),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let rows: { sku: string; woo_id: number }[] = [];
    if (singleSku) {
      const { data, error } = await supabase
        .from("woo_product_map")
        .select("sku, woo_id")
        .eq("sku", singleSku);
      if (error) throw error;
      rows = data ?? [];
    } else {
      const { data, error } = await supabase
        .from("woo_product_map")
        .select("sku, woo_id")
        .like("sku", `${prefix}%`);
      if (error) throw error;
      rows = data ?? [];
    }

    const results: UpdateResult[] = [];

    for (const row of rows) {
      try {
        const product = await fetchProduct(base, auth, row.woo_id);
        const before = pickMeta(product?.meta_data, TARGET_KEYS);
        const updated = await updateProduct(base, auth, row.woo_id, row.sku, before);
        const after = pickMeta(updated?.meta_data, TARGET_KEYS);
        results.push({
          sku: row.sku,
          woo_id: row.woo_id,
          status: "updated",
          before: Object.fromEntries(Object.entries(before).map(([k, v]) => [k, v.value])),
          after: Object.fromEntries(Object.entries(after).map(([k, v]) => [k, v.value])),
        });
      } catch (e) {
        results.push({
          sku: row.sku,
          woo_id: row.woo_id,
          status: "error",
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    const summary = {
      total: results.length,
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
