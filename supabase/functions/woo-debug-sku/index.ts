import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  const siteUrl = Deno.env.get("WOO_SITE_URL")!;
  const ck = Deno.env.get("WOO_CONSUMER_KEY")!;
  const cs = Deno.env.get("WOO_CONSUMER_SECRET")!;
  const auth = "Basic " + btoa(`${ck}:${cs}`);
  const base = siteUrl.replace(/\/$/, "") + "/wp-json/wc/v3";

  const all: Array<{ id: number; name: string; sku: string }> = [];
  for (let page = 1; page < 30; page++) {
    const r = await fetch(`${base}/products?per_page=100&page=${page}&_fields=id,name,sku&status=any`, { headers: { Authorization: auth } });
    if (!r.ok) break;
    const data = await r.json() as Array<{ id: number; name: string; sku: string }>;
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    if (data.length < 100) break;
  }

  const ypb = all.filter((p) => /^YPB\.\d{3}$/.test(p.sku));
  const slug = all.filter((p) => p.sku && !/^YPB\.\d{3}$/.test(p.sku));
  const empty = all.filter((p) => !p.sku);

  return new Response(JSON.stringify({
    total: all.length,
    ypb: ypb.length,
    slug_style: slug.length,
    empty: empty.length,
    slug_products: slug.map((p) => ({ id: p.id, name: p.name, sku: p.sku })),
  }, null, 2), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
