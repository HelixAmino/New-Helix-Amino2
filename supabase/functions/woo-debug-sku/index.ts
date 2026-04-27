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

  const probes: Array<{ url: string; status: number; ct: string; len: number; bodyStart: string }> = [];
  const urls = [
    `${siteUrl.replace(/\/$/, "")}/wp-json/`,
    `${base}/products?per_page=1&page=1`,
    `${base}/products/25`,
  ];
  for (const u of urls) {
    try {
      const r = await fetch(u, {
        headers: {
          Authorization: auth,
          "User-Agent": "Mozilla/5.0 (compatible; HelixAmino-Sync/1.0)",
          Accept: "application/json",
        },
      });
      const t = await r.text();
      probes.push({
        url: u,
        status: r.status,
        ct: r.headers.get("content-type") ?? "",
        len: t.length,
        bodyStart: t.slice(0, 400),
      });
    } catch (e) {
      probes.push({ url: u, status: -1, ct: "", len: 0, bodyStart: e instanceof Error ? e.message : String(e) });
    }
  }

  return new Response(JSON.stringify({ probes }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
