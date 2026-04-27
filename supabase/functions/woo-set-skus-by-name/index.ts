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

interface Action {
  id: number;
  name: string;
  before: string;
  after: string;
  status: "skip" | "set" | "clear" | "error";
  error?: string;
  reason?: string;
}

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

    const all: Array<{ id: number; name: string; sku: string }> = [];
    for (let page = 1; page < 30; page++) {
      const r = await fetch(
        `${base}/products?per_page=100&page=${page}&_fields=id,name,sku&status=any`,
        { headers: { Authorization: auth } },
      );
      if (!r.ok) throw new Error(`list ${r.status}`);
      const data = await r.json() as Array<{ id: number; name: string; sku: string }>;
      if (!Array.isArray(data) || data.length === 0) break;
      all.push(...data);
      if (data.length < 100) break;
    }

    const byNorm = new Map<string, Array<{ id: number; name: string; sku: string }>>();
    for (const p of all) {
      const k = normalize(p.name);
      const arr = byNorm.get(k) ?? [];
      arr.push(p);
      byNorm.set(k, arr);
    }

    const desiredSkuByWooId = new Map<number, string>();
    const ypbHandled = new Set<string>();

    const planNotes: Array<{ ypb: string; name: string; chosen?: number; candidates: number[] }> = [];

    for (const m of MAPPINGS) {
      const k = normalize(m.name);
      const candidates = byNorm.get(k) ?? [];
      planNotes.push({ ypb: m.ypb, name: m.name, candidates: candidates.map((c) => c.id) });
      if (candidates.length === 0) continue;
      const chosen = candidates.reduce((a, b) => (a.id > b.id ? a : b));
      desiredSkuByWooId.set(chosen.id, m.ypb);
      ypbHandled.add(m.ypb);
      planNotes[planNotes.length - 1].chosen = chosen.id;
    }

    const productsToClearSkuFirst = all.filter((p) => {
      if (!p.sku) return false;
      if (desiredSkuByWooId.get(p.id) === p.sku) return false;
      return true;
    });

    const actions: Action[] = [];

    for (const p of productsToClearSkuFirst) {
      try {
        const r = await fetch(`${base}/products/${p.id}`, {
          method: "PUT",
          headers: { Authorization: auth, "Content-Type": "application/json" },
          body: JSON.stringify({ sku: "" }),
        });
        if (!r.ok) {
          const t = await r.text();
          actions.push({ id: p.id, name: p.name, before: p.sku, after: p.sku, status: "error", error: `clear ${r.status} ${t.slice(0, 150)}` });
          continue;
        }
        actions.push({ id: p.id, name: p.name, before: p.sku, after: "", status: "clear" });
      } catch (e) {
        actions.push({ id: p.id, name: p.name, before: p.sku, after: p.sku, status: "error", error: e instanceof Error ? e.message : String(e) });
      }
    }

    for (const [wooId, ypb] of desiredSkuByWooId) {
      const product = all.find((p) => p.id === wooId)!;
      if (product.sku === ypb) {
        actions.push({ id: wooId, name: product.name, before: ypb, after: ypb, status: "skip", reason: "already set" });
        continue;
      }
      try {
        const r = await fetch(`${base}/products/${wooId}`, {
          method: "PUT",
          headers: { Authorization: auth, "Content-Type": "application/json" },
          body: JSON.stringify({ sku: ypb }),
        });
        if (!r.ok) {
          const t = await r.text();
          actions.push({ id: wooId, name: product.name, before: product.sku, after: product.sku, status: "error", error: `set ${r.status} ${t.slice(0, 150)}` });
          continue;
        }
        actions.push({ id: wooId, name: product.name, before: product.sku, after: ypb, status: "set" });
      } catch (e) {
        actions.push({ id: wooId, name: product.name, before: product.sku, after: product.sku, status: "error", error: e instanceof Error ? e.message : String(e) });
      }
    }

    const summary = {
      total_products: all.length,
      mappings: MAPPINGS.length,
      mappings_no_match: planNotes.filter((p) => !p.chosen).length,
      cleared: actions.filter((a) => a.status === "clear").length,
      set: actions.filter((a) => a.status === "set").length,
      skipped: actions.filter((a) => a.status === "skip").length,
      errors: actions.filter((a) => a.status === "error").length,
    };

    return new Response(
      JSON.stringify({ summary, plan_no_match: planNotes.filter((p) => !p.chosen), actions: actions.filter((a) => a.status !== "skip") }, null, 2),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
