import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UpdateResult {
  woo_id: number;
  sku: string | null;
  status: "updated" | "error";
  error?: string;
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

    const { data: rows, error } = await supabase
      .from("woo_product_map")
      .select("sku, woo_id");
    if (error) throw error;

    const results: UpdateResult[] = [];

    for (const row of rows ?? []) {
      try {
        const res = await fetch(`${base}/products/${row.woo_id}`, {
          method: "PUT",
          headers: {
            Authorization: auth,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ weight: "1" }),
        });

        if (!res.ok) {
          const text = await res.text();
          results.push({
            woo_id: row.woo_id,
            sku: row.sku,
            status: "error",
            error: `${res.status} ${text.slice(0, 200)}`,
          });
          continue;
        }

        results.push({ woo_id: row.woo_id, sku: row.sku, status: "updated" });
      } catch (e) {
        results.push({
          woo_id: row.woo_id,
          sku: row.sku,
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
