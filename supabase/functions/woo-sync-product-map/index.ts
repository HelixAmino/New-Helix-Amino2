import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

    const rows: { sku: string; woo_id: number }[] = [];
    for (let page = 1; page < 20; page++) {
      const res = await fetch(`${base}/products?per_page=100&page=${page}&_fields=id,sku`, {
        headers: { Authorization: auth },
      });
      if (!res.ok) throw new Error(`WC list failed: ${res.status}`);
      const data = (await res.json()) as Array<{ id: number; sku: string }>;
      if (!Array.isArray(data) || data.length === 0) break;
      for (const p of data) {
        if (p.sku) rows.push({ sku: p.sku, woo_id: p.id });
      }
      if (data.length < 100) break;
    }

    let removed = 0;
    if (rows.length > 0) {
      const { error } = await supabase.from("woo_product_map").upsert(rows, { onConflict: "sku" });
      if (error) throw error;

      const liveIds = rows.map((r) => r.woo_id);
      const { data: existing, error: selErr } = await supabase
        .from("woo_product_map")
        .select("woo_id");
      if (selErr) throw selErr;
      const stale = (existing ?? [])
        .map((r) => r.woo_id)
        .filter((id) => !liveIds.includes(id));
      if (stale.length > 0) {
        const { error: delErr } = await supabase
          .from("woo_product_map")
          .delete()
          .in("woo_id", stale);
        if (delErr) throw delErr;
        removed = stale.length;
      }
    }

    return new Response(JSON.stringify({ synced: rows.length, removed }), {
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
