import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DUPLICATE_IDS = [
  110, 111, 113, 114, 115, 116, 119, 120, 121, 122, 123, 124, 126, 127, 128,
  129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 144,
  145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159,
  160, 161, 162, 165, 166, 167, 168, 169, 170, 188, 191, 192,
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  const siteUrl = Deno.env.get("WOO_SITE_URL")!;
  const ck = Deno.env.get("WOO_CONSUMER_KEY")!;
  const cs = Deno.env.get("WOO_CONSUMER_SECRET")!;
  const auth = "Basic " + btoa(`${ck}:${cs}`);
  const base = siteUrl.replace(/\/$/, "") + "/wp-json/wc/v3";

  const results: Array<{ id: number; before: string; after: string; status: string; error?: string }> = [];

  for (const id of DUPLICATE_IDS) {
    try {
      const before = await fetch(`${base}/products/${id}?_fields=sku`, { headers: { Authorization: auth } });
      const beforeData = await before.json() as { sku?: string };

      const r = await fetch(`${base}/products/${id}`, {
        method: "PUT",
        headers: { Authorization: auth, "Content-Type": "application/json" },
        body: JSON.stringify({ sku: "" }),
      });
      if (!r.ok) {
        const text = await r.text();
        results.push({ id, before: beforeData.sku ?? "", after: "", status: "error", error: `${r.status} ${text.slice(0, 200)}` });
        continue;
      }
      const data = await r.json() as { sku?: string };
      results.push({ id, before: beforeData.sku ?? "", after: data.sku ?? "", status: "cleared" });
    } catch (e) {
      results.push({ id, before: "", after: "", status: "error", error: e instanceof Error ? e.message : String(e) });
    }
  }

  const summary = {
    total: results.length,
    cleared: results.filter((r) => r.status === "cleared").length,
    errors: results.filter((r) => r.status === "error").length,
  };
  return new Response(JSON.stringify({ summary, results }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
