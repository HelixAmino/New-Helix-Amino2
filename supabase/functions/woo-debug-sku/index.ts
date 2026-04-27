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

  const probes: Array<{ url: string; status: number; bodyStart: string }> = [];
  const urls = [
    `${siteUrl.replace(/\/$/, "")}/wp-json/`,
    `${base}/products?per_page=1&page=1`,
    `${base}/products?per_page=5&page=1&status=publish`,
    `${base}/products?per_page=5&page=1&status=any`,
    `${base}/products/25?_fields=id,name,sku`,
  ];
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: { Authorization: auth } });
      const t = await r.text();
      probes.push({ url: u, status: r.status, bodyStart: t.slice(0, 300) });
    } catch (e) {
      probes.push({ url: u, status: -1, bodyStart: e instanceof Error ? e.message : String(e) });
    }
  }

  return new Response(JSON.stringify({ probes }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
