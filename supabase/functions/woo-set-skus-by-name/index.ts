import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MAPPINGS: Array<{ ypb: string; name: string }> = [
  { ypb: "YPB.211", name: "Sermorelin (10mg)" },
  { ypb: "YPB.212", name: "BPC-157 (5mg)" },
  { ypb: "YPB.213", name: "BPC-157 (10mg)" },
  { ypb: "YPB.214", name: "Thymosin Beta 4 (TB500) (5mg)" },
  { ypb: "YPB.215", name: "Thymosin Beta 4 (TB500) (10mg)" },
  { ypb: "YPB.216", name: "Wolverine Blend - BPC-157 (5mg) / TB500 (5mg)" },
  { ypb: "YPB.217", name: "Wolverine Blend - BPC-157 (10mg) / TB500 (10mg)" },
  { ypb: "YPB.218", name: "GLOW GHK-Cu (50mg) / BPC-157 (10mg) / TB500 (10mg)" },
  { ypb: "YPB.219", name: "CJC-1295 Without DAC (10mg)" },
  { ypb: "YPB.220", name: "CJC-1295 With DAC (5mg)" },
  { ypb: "YPB.221", name: "GHK-Cu (50mg)" },
  { ypb: "YPB.222", name: "GHK-Cu (100mg)" },
  { ypb: "YPB.223", name: "NAD+ (500mg)" },
  { ypb: "YPB.224", name: "NAD+ (1000mg)" },
  { ypb: "YPB.227", name: "MOTS-c (10mg)" },
  { ypb: "YPB.228", name: "Selank (10mg)" },
  { ypb: "YPB.229", name: "Semax (10mg)" },
  { ypb: "YPB.230", name: "DSIP (15mg)" },
  { ypb: "YPB.231", name: "Thymosin Alpha 1 (TA1) (10mg)" },
  { ypb: "YPB.232", name: "N-Acetyl Epitalon Amidate (5mg)" },
  { ypb: "YPB.233", name: "GDF-8 (1mg)" },
  { ypb: "YPB.237", name: "BPC-157 (20mg)" },
  { ypb: "YPB.238", name: "2X Blend - CJC-1295 Without DAC (5mg) / Ipamorelin (5mg)" },
  { ypb: "YPB.241", name: "Cagrilintide (10mg)" },
  { ypb: "YPB.242", name: "5-Amino-1MQ (5mg)" },
  { ypb: "YPB.243", name: "SLU-PP-332 (5mg)" },
  { ypb: "YPB.244", name: "LL37 (5mg)" },
  { ypb: "YPB.245", name: "SS-31 (10mg)" },
  { ypb: "YPB.246", name: "SS-31 (50mg)" },
  { ypb: "YPB.247", name: "5-Amino-1MQ (50mg)" },
  { ypb: "YPB.248", name: "AOD9604 (5mg)" },
  { ypb: "YPB.249", name: "ACE-031 (1mg)" },
  { ypb: "YPB.250", name: "AICAR (50mg)" },
  { ypb: "YPB.251", name: "B12 (10ml)" },
  { ypb: "YPB.252", name: "DSIP (5mg)" },
  { ypb: "YPB.253", name: "Epitalon (10mg)" },
  { ypb: "YPB.254", name: "Epitalon (50mg)" },
  { ypb: "YPB.255", name: "FOXO4 (10mg)" },
  { ypb: "YPB.256", name: "HCG (10000iu)" },
  { ypb: "YPB.257", name: "GHRP-6 Acetate (10mg)" },
  { ypb: "YPB.258", name: "HMG (75iu)" },
  { ypb: "YPB.259", name: "Glutathione (1500mg)" },
  { ypb: "YPB.261", name: "Hexarelin Acetate (5mg)" },
  { ypb: "YPB.262", name: "IGF-1LR3 (1mg)" },
  { ypb: "YPB.263", name: "Ipamorelin (10mg)" },
  { ypb: "YPB.264", name: "KLOW - GHK-Cu (50mg) / KPV (10mg) / BPC-157 (10mg) / TB500 (10mg)" },
  { ypb: "YPB.265", name: "LYSINE-PROLINE-VALINE (10mg)" },
  { ypb: "YPB.266", name: "KissPeptin (10mg)" },
  { ypb: "YPB.267", name: "8X Blend - L-Carnitine / L-Arginine / Methionine / Inositol / Choline / B6 / B5 / B12" },
  { ypb: "YPB.268", name: "4X Blend - Methionine / Choline Chloride / Carnitine / Dexpanthenol" },
  { ypb: "YPB.269", name: "Mazdutide (100mg)" },
  { ypb: "YPB.270", name: "Melanotan 2 (10mg)" },
  { ypb: "YPB.271", name: "MOTS-c (40mg)" },
  { ypb: "YPB.272", name: "Snap-8 (10mg)" },
  { ypb: "YPB.273", name: "Pinealon (20mg)" },
  { ypb: "YPB.274", name: "PT-141 (10mg)" },
  { ypb: "YPB.275", name: "PNC-27 (10mg)" },
  { ypb: "YPB.277", name: "ARA-290 (10mg)" },
  { ypb: "YPB.278", name: "Survodutide (10mg)" },
  { ypb: "YPB.279", name: "Tesamorelin (10mg)" },
  { ypb: "YPB.280", name: "Thymalin (10mg)" },
  { ypb: "YPB.281", name: "VIP10 (10mg)" },
  { ypb: "YPB.282", name: "GHRP-6 Acetate (5mg)" },
  { ypb: "YPB.283", name: "Glutathione (600mg)" },
  { ypb: "YPB.285", name: "IGF-1LR3 (0.1mg)" },
  { ypb: "YPB.286", name: "IGF-DES (0.1mg)" },
  { ypb: "YPB.287", name: "Retatrutide (60mg)" },
  { ypb: "YPB.288", name: "Tesamorelin (20mg)" },
  { ypb: "YPB.200", name: "Semaglutide (10mg)" },
  { ypb: "YPB.201", name: "Semaglutide (20mg)" },
  { ypb: "YPB.202", name: "Semaglutide (30mg)" },
  { ypb: "YPB.203", name: "Tirzepatide (10mg)" },
  { ypb: "YPB.204", name: "Tirzepatide (20mg)" },
  { ypb: "YPB.205", name: "Tirzepatide (30mg)" },
  { ypb: "YPB.206", name: "Tirzepatide (40mg)" },
  { ypb: "YPB.207", name: "Tirzepatide (50mg)" },
  { ypb: "YPB.208", name: "Tirzepatide (60mg)" },
  { ypb: "YPB.209", name: "Retatrutide (10mg)" },
  { ypb: "YPB.210", name: "Retatrutide (20mg)" },
  { ypb: "YPB.234", name: "Retatrutide (30mg)" },
  { ypb: "YPB.235", name: "Retatrutide (40mg)" },
  { ypb: "YPB.236", name: "Retatrutide (50mg)" },
  { ypb: "YPB.239", name: "Cagrilintide 5mg + Semaglutide 5mg" },
  { ypb: "YPB.240", name: "Cagrilintide 2.5mg + Semaglutide 2.5mg" },
];

const NAME_ALIASES: Array<[string, string]> = [
  ["GLP-1 S", "Semaglutide"],
  ["GLP-2 TZ", "Tirzepatide"],
  ["GLP-3 RT", "Retatrutide"],
  ["GLP-3 RZ", "Retatrutide"],
];

const DELETE_ID_THRESHOLD = 110;

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, " ");
}

function normalize(s: string): string {
  let out = decodeEntities(s).toLowerCase();
  out = out.replace(/[\u2010-\u2015]/g, "-");
  for (const [from, to] of NAME_ALIASES) {
    out = out.replace(new RegExp(from.toLowerCase(), "g"), to.toLowerCase());
  }
  out = out
    .replace(/\s*\/\s*/g, " ")
    .replace(/\s*\+\s*/g, " ")
    .replace(/\s*-\s*/g, " ")
    .replace(/[(),]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return out;
}

interface Product { id: number; name: string; sku: string; }

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const siteUrl = Deno.env.get("WOO_SITE_URL")!;
    const ck = Deno.env.get("WOO_CONSUMER_KEY")!;
    const cs = Deno.env.get("WOO_CONSUMER_SECRET")!;
    const auth = "Basic " + btoa(`${ck}:${cs}`);
    const base = siteUrl.replace(/\/$/, "") + "/wp-json/wc/v3";

    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") ?? "all";

    const all: Product[] = [];
    const perPage = 100;
    for (let page = 1; page < 30; page++) {
      let lastErr = "";
      let data: Product[] | null = null;
      for (let attempt = 0; attempt < 4; attempt++) {
        const r = await fetch(
          `${base}/products?per_page=${perPage}&page=${page}&_fields=id,name,sku&status=any&orderby=id&order=asc`,
          { headers: { Authorization: auth } },
        );
        if (r.ok) {
          data = await r.json() as Product[];
          break;
        }
        lastErr = `${r.status}`;
        await new Promise((res) => setTimeout(res, 1000 * (attempt + 1)));
      }
      if (data === null) throw new Error(`list ${lastErr}`);
      if (!Array.isArray(data) || data.length === 0) break;
      all.push(...data);
      if (data.length < perPage) break;
    }

    async function runConcurrent<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
      const results: R[] = new Array(items.length);
      let i = 0;
      const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (true) {
          const idx = i++;
          if (idx >= items.length) return;
          results[idx] = await fn(items[idx]);
        }
      });
      await Promise.all(workers);
      return results;
    }

    const toDelete = mode === "assign" ? [] : all.filter((p) => p.id >= DELETE_ID_THRESHOLD);
    const deleted = await runConcurrent(toDelete, 6, async (p) => {
      try {
        await fetch(`${base}/products/${p.id}`, {
          method: "PUT",
          headers: { Authorization: auth, "Content-Type": "application/json" },
          body: JSON.stringify({ sku: "" }),
        });
        const r = await fetch(`${base}/products/${p.id}?force=true`, {
          method: "DELETE",
          headers: { Authorization: auth },
        });
        if (!r.ok) {
          const t = await r.text();
          return { id: p.id, ok: false, status: r.status, error: t.slice(0, 200) } as { id: number; ok: boolean; status?: number; error?: string };
        }
        return { id: p.id, ok: true } as { id: number; ok: boolean; status?: number; error?: string };
      } catch (e) {
        return { id: p.id, ok: false, error: e instanceof Error ? e.message : String(e) } as { id: number; ok: boolean; status?: number; error?: string };
      }
    });

    const remaining = all.filter((p) => p.id < DELETE_ID_THRESHOLD);
    const byNorm = new Map<string, Product[]>();
    for (const p of remaining) {
      const k = normalize(p.name);
      const arr = byNorm.get(k) ?? [];
      arr.push(p);
      byNorm.set(k, arr);
    }

    const mappingsNoMatch: Array<{ ypb: string; name: string }> = [];
    const targetByWooId = new Map<number, string>();
    for (const m of MAPPINGS) {
      const k = normalize(m.name);
      const candidates = byNorm.get(k) ?? [];
      if (candidates.length === 0) {
        mappingsNoMatch.push({ ypb: m.ypb, name: m.name });
        continue;
      }
      const chosen = candidates.reduce((a, b) => (a.id < b.id ? a : b));
      targetByWooId.set(chosen.id, m.ypb);
    }

    const toAssign = mode === "delete" ? [] : remaining.filter((p) => targetByWooId.has(p.id));
    type Action = { id: number; name: string; before: string; after: string; status: string; error?: string };
    const skuActions = await runConcurrent<Product, Action>(toAssign, 6, async (p) => {
      const target = targetByWooId.get(p.id)!;
      if (p.sku === target) {
        return { id: p.id, name: p.name, before: p.sku, after: p.sku, status: "skip-already-set" };
      }
      try {
        const r = await fetch(`${base}/products/${p.id}`, {
          method: "PUT",
          headers: { Authorization: auth, "Content-Type": "application/json" },
          body: JSON.stringify({ sku: target }),
        });
        if (!r.ok) {
          const t = await r.text();
          return { id: p.id, name: p.name, before: p.sku, after: p.sku, status: "error", error: `${r.status} ${t.slice(0, 200)}` };
        }
        return { id: p.id, name: p.name, before: p.sku, after: target, status: "set" };
      } catch (e) {
        return { id: p.id, name: p.name, before: p.sku, after: p.sku, status: "error", error: e instanceof Error ? e.message : String(e) };
      }
    });

    return new Response(JSON.stringify({
      summary: {
        total_before: all.length,
        deleted_count: deleted.filter((d) => d.ok).length,
        delete_errors: deleted.filter((d) => !d.ok).length,
        sku_set: skuActions.filter((a) => a.status === "set").length,
        sku_skip: skuActions.filter((a) => a.status === "skip-already-set").length,
        sku_errors: skuActions.filter((a) => a.status === "error").length,
        mappings_no_match: mappingsNoMatch.length,
      },
      mappings_no_match: mappingsNoMatch,
      delete_errors: deleted.filter((d) => !d.ok),
      sku_errors: skuActions.filter((a) => a.status === "error"),
    }, null, 2), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
