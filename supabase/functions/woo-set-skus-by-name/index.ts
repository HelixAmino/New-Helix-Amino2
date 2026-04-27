import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MAPPINGS: Array<{ helix: string; ypb: string; name: string }> = [
  { helix: "HA39.Y211", ypb: "YPB.211", name: "Sermorelin (10mg)" },
  { helix: "HA39.Y212", ypb: "YPB.212", name: "BPC-157 (5mg)" },
  { helix: "HA39.Y213", ypb: "YPB.213", name: "BPC-157 (10mg)" },
  { helix: "HA39.Y214", ypb: "YPB.214", name: "Thymosin Beta 4 (TB500) (5mg)" },
  { helix: "HA39.Y215", ypb: "YPB.215", name: "Thymosin Beta 4 (TB500) (10mg)" },
  { helix: "HA39.Y216", ypb: "YPB.216", name: "Wolverine Blend - BPC-157 (5mg) / TB500 (5mg)" },
  { helix: "HA39.Y217", ypb: "YPB.217", name: "Wolverine Blend - BPC-157 (10mg) / TB500 (10mg)" },
  { helix: "HA39.Y218", ypb: "YPB.218", name: "GLOW GHK-Cu (50mg) / BPC-157 (10mg) / TB500 (10mg)" },
  { helix: "HA39.Y219", ypb: "YPB.219", name: "CJC-1295 Without DAC (10mg)" },
  { helix: "HA39.Y220", ypb: "YPB.220", name: "CJC-1295 With DAC (5mg)" },
  { helix: "HA39.Y221", ypb: "YPB.221", name: "GHK-Cu (50mg)" },
  { helix: "HA39.Y222", ypb: "YPB.222", name: "GHK-Cu (100mg)" },
  { helix: "HA39.Y223", ypb: "YPB.223", name: "NAD+ (500mg)" },
  { helix: "HA39.Y224", ypb: "YPB.224", name: "NAD+ (1000mg)" },
  { helix: "HA39.Y227", ypb: "YPB.227", name: "MOTS-c (10mg)" },
  { helix: "HA39.Y228", ypb: "YPB.228", name: "Selank (10mg)" },
  { helix: "HA39.Y229", ypb: "YPB.229", name: "Semax (10mg)" },
  { helix: "HA39.Y230", ypb: "YPB.230", name: "DSIP (15mg)" },
  { helix: "HA39.Y231", ypb: "YPB.231", name: "Thymosin Alpha 1 (TA1) (10mg)" },
  { helix: "HA39.Y232", ypb: "YPB.232", name: "N-Acetyl Epitalon Amidate (5 mg)" },
  { helix: "HA39.Y233", ypb: "YPB.233", name: "GDF-8 (1mg)" },
  { helix: "HA39.Y237", ypb: "YPB.237", name: "BPC 157 (20mg)" },
  { helix: "HA39.Y338", ypb: "YPB.238", name: "2X Blend CJC-1295 Without DAC (5mg) / Ipamorelin (5mg)" },
  { helix: "HA39.Y241", ypb: "YPB.241", name: "Cagrilintide (10mg)" },
  { helix: "HA39.Y242", ypb: "YPB.242", name: "5-amino-1mq (5mg)" },
  { helix: "HA39.Y243", ypb: "YPB.243", name: "SLU-PP-332 (5mg)" },
  { helix: "HA39.Y244", ypb: "YPB.244", name: "LL37 (5mg)" },
  { helix: "HA39.Y245", ypb: "YPB.245", name: "SS-31 (10mg)" },
  { helix: "HA39.Y246", ypb: "YPB.246", name: "SS-31 (50mg)" },
  { helix: "HA39.Y247", ypb: "YPB.247", name: "5-amino-1mq (50mg)" },
  { helix: "HA39.Y248", ypb: "YPB.248", name: "AOD9604 (5mg)" },
  { helix: "HA39.Y249", ypb: "YPB.249", name: "ACE-031 (1mg)" },
  { helix: "HA39.Y250", ypb: "YPB.250", name: "AICAR (50mg)" },
  { helix: "HA39.Y251", ypb: "YPB.251", name: "B12 (10ml)" },
  { helix: "HA39.Y252", ypb: "YPB.252", name: "DSIP (5mg)" },
  { helix: "HA39.Y253", ypb: "YPB.253", name: "Epitalon (10mg)" },
  { helix: "HA39.Y254", ypb: "YPB.254", name: "Epitalon (50mg)" },
  { helix: "HA39.Y255", ypb: "YPB.255", name: "FOXO4 (10mg)" },
  { helix: "HA39.Y256", ypb: "YPB.256", name: "HCG (10000iu)" },
  { helix: "HA39.Y257", ypb: "YPB.257", name: "GHRP-6 Acetate (10mg)" },
  { helix: "HA39.Y258", ypb: "YPB.258", name: "HMG (75iu)" },
  { helix: "HA39.Y259", ypb: "YPB.259", name: "Glutathione (1500mg)" },
  { helix: "HA39.Y261", ypb: "YPB.261", name: "Hexarelin Acetate (5mg)" },
  { helix: "HA39.Y262", ypb: "YPB.262", name: "IGF-1LR3 (1mg)" },
  { helix: "HA39.Y263", ypb: "YPB.263", name: "Ipamorelin (10mg)" },
  { helix: "HA39.Y264", ypb: "YPB.264", name: "KLOW" },
  { helix: "HA39.Y265", ypb: "YPB.265", name: "LYSINE-PROLINE-VALINE (10mg)" },
  { helix: "HA39.Y266", ypb: "YPB.266", name: "KissPeptin (10mg)" },
  { helix: "HA39.Y267", ypb: "YPB.267", name: "8X Blend" },
  { helix: "HA39.Y268", ypb: "YPB.268", name: "4X Blend" },
  { helix: "HA39.Y269", ypb: "YPB.269", name: "Mazdutide (100mg)" },
  { helix: "HA39.Y270", ypb: "YPB.270", name: "Melanotan 2 (10mg)" },
  { helix: "HA39.Y271", ypb: "YPB.271", name: "MOTS-c (40mg)" },
  { helix: "HA39.Y272", ypb: "YPB.272", name: "Snap-8 (10mg)" },
  { helix: "HA39.Y273", ypb: "YPB.273", name: "Pinealon (20mg)" },
  { helix: "HA39.Y274", ypb: "YPB.274", name: "PT-141 (10mg)" },
  { helix: "HA39.Y275", ypb: "YPB.275", name: "PNC-27 (10mg)" },
  { helix: "HA39.Y277", ypb: "YPB.277", name: "ARA-290 (10mg)" },
  { helix: "HA39.Y278", ypb: "YPB.278", name: "Survodutide (10mg)" },
  { helix: "HA39.Y279", ypb: "YPB.279", name: "Tesamorelin (10mg)" },
  { helix: "HA39.Y280", ypb: "YPB.280", name: "Thymalin (10mg)" },
  { helix: "HA39.Y281", ypb: "YPB.281", name: "VIP10 (10mg)" },
  { helix: "HA39.Y282", ypb: "YPB.282", name: "GHRP-6 Acetate (5mg)" },
  { helix: "HA39.Y283", ypb: "YPB.283", name: "Glutathione (600mg)" },
  { helix: "HA39.Y285", ypb: "YPB.285", name: "IGF-1LR3 (0.1mg)" },
  { helix: "HA39.Y286", ypb: "YPB.286", name: "IGF-DES (0.1mg)" },
  { helix: "HA39.Y287", ypb: "YPB.287", name: "GLP-3 RZ (60mg)" },
  { helix: "HA39.Y288", ypb: "YPB.288", name: "Tesamorelin (20mg)" },
  { helix: "HA39.Y200", ypb: "YPB.200", name: "GLP-1 S (10mg)" },
  { helix: "HA39.Y201", ypb: "YPB.201", name: "GLP-1 S (20mg)" },
  { helix: "HA39.Y202", ypb: "YPB.202", name: "GLP-1 S (30mg)" },
  { helix: "HA39.Y203", ypb: "YPB.203", name: "GLP-2 TZ (10mg)" },
  { helix: "HA39.Y204", ypb: "YPB.204", name: "GLP-2 TZ (20mg)" },
  { helix: "HA39.Y205", ypb: "YPB.205", name: "GLP-2 TZ (30mg)" },
  { helix: "HA39.Y206", ypb: "YPB.206", name: "GLP-2 TZ (40mg)" },
  { helix: "HA39.Y207", ypb: "YPB.207", name: "GLP-2 TZ (50mg)" },
  { helix: "HA39.Y208", ypb: "YPB.208", name: "GLP-2 TZ (60mg)" },
  { helix: "HA39.Y209", ypb: "YPB.209", name: "GLP-3 RT (10mg)" },
  { helix: "HA39.Y210", ypb: "YPB.210", name: "GLP-3 RT (20mg)" },
  { helix: "HA39.Y234", ypb: "YPB.234", name: "GLP-3 RT (30mg)" },
  { helix: "HA39.Y235", ypb: "YPB.235", name: "GLP-3 RT (40mg)" },
  { helix: "HA39.Y236", ypb: "YPB.236", name: "GLP-3 RT (50mg)" },
  { helix: "HA39.Y239", ypb: "YPB.239", name: "Cagrilintide (5mg) / GLP-1 S (5mg)" },
  { helix: "HA39.Y240", ypb: "YPB.240", name: "Cagrilintide (2.5mg) / GLP-1 S (2.5mg)" },
];

interface UpdateResult {
  ypb_sku: string;
  product_name: string;
  woo_id: number | null;
  status: "updated" | "no_match" | "error";
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
    const auth = "Basic " + btoa(`${ck}:${cs}`);
    const base = siteUrl.replace(/\/$/, "") + "/wp-json/wc/v3";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const helixSkus = MAPPINGS.map((m) => m.helix);
    const { data: mapRows, error: mapErr } = await supabase
      .from("woo_product_map")
      .select("sku, woo_id")
      .in("sku", helixSkus);
    if (mapErr) throw mapErr;

    const skuToId = new Map<string, number>();
    for (const row of mapRows ?? []) skuToId.set(row.sku, row.woo_id);

    const results: UpdateResult[] = [];

    for (const m of MAPPINGS) {
      const wooId = skuToId.get(m.helix);
      if (!wooId) {
        results.push({ ypb_sku: m.ypb, product_name: m.name, woo_id: null, status: "no_match" });
        continue;
      }

      try {
        const res = await fetch(`${base}/products/${wooId}`, {
          method: "PUT",
          headers: { Authorization: auth, "Content-Type": "application/json" },
          body: JSON.stringify({ sku: m.ypb }),
        });
        if (!res.ok) {
          const text = await res.text();
          results.push({
            ypb_sku: m.ypb,
            product_name: m.name,
            woo_id: wooId,
            status: "error",
            error: `${res.status} ${text.slice(0, 200)}`,
          });
          continue;
        }
        results.push({ ypb_sku: m.ypb, product_name: m.name, woo_id: wooId, status: "updated" });
      } catch (e) {
        results.push({
          ypb_sku: m.ypb,
          product_name: m.name,
          woo_id: wooId,
          status: "error",
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    const summary = {
      total: results.length,
      updated: results.filter((r) => r.status === "updated").length,
      no_match: results.filter((r) => r.status === "no_match").length,
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
