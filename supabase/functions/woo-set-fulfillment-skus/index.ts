import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MAPPINGS: Array<[string, string]> = [
  ["HA39.Y211", "YPB.211"],
  ["HA39.Y212", "YPB.212"],
  ["HA39.Y213", "YPB.213"],
  ["HA39.Y214", "YPB.214"],
  ["HA39.Y215", "YPB.215"],
  ["HA39.Y216", "YPB.216"],
  ["HA39.Y217", "YPB.217"],
  ["HA39.Y218", "YPB.218"],
  ["HA39.Y219", "YPB.219"],
  ["HA39.Y220", "YPB.220"],
  ["HA39.Y221", "YPB.221"],
  ["HA39.Y222", "YPB.222"],
  ["HA39.Y223", "YPB.223"],
  ["HA39.Y224", "YPB.224"],
  ["HA39.Y227", "YPB.227"],
  ["HA39.Y228", "YPB.228"],
  ["HA39.Y229", "YPB.229"],
  ["HA39.Y230", "YPB.230"],
  ["HA39.Y231", "YPB.231"],
  ["HA39.Y232", "YPB.232"],
  ["HA39.Y233", "YPB.233"],
  ["HA39.Y237", "YPB.237"],
  ["HA39.Y338", "YPB.238"],
  ["HA39.Y241", "YPB.241"],
  ["HA39.Y242", "YPB.242"],
  ["HA39.Y243", "YPB.243"],
  ["HA39.Y244", "YPB.244"],
  ["HA39.Y245", "YPB.245"],
  ["HA39.Y246", "YPB.246"],
  ["HA39.Y247", "YPB.247"],
  ["HA39.Y248", "YPB.248"],
  ["HA39.Y249", "YPB.249"],
  ["HA39.Y250", "YPB.250"],
  ["HA39.Y251", "YPB.251"],
  ["HA39.Y252", "YPB.252"],
  ["HA39.Y253", "YPB.253"],
  ["HA39.Y254", "YPB.254"],
  ["HA39.Y255", "YPB.255"],
  ["HA39.Y256", "YPB.256"],
  ["HA39.Y257", "YPB.257"],
  ["HA39.Y258", "YPB.258"],
  ["HA39.Y259", "YPB.259"],
  ["HA39.Y261", "YPB.261"],
  ["HA39.Y262", "YPB.262"],
  ["HA39.Y263", "YPB.263"],
  ["HA39.Y264", "YPB.264"],
  ["HA39.Y265", "YPB.265"],
  ["HA39.Y266", "YPB.266"],
  ["HA39.Y267", "YPB.267"],
  ["HA39.Y268", "YPB.268"],
  ["HA39.Y269", "YPB.269"],
  ["HA39.Y270", "YPB.270"],
  ["HA39.Y271", "YPB.271"],
  ["HA39.Y272", "YPB.272"],
  ["HA39.Y273", "YPB.273"],
  ["HA39.Y274", "YPB.274"],
  ["HA39.Y275", "YPB.275"],
  ["HA39.Y277", "YPB.277"],
  ["HA39.Y278", "YPB.278"],
  ["HA39.Y279", "YPB.279"],
  ["HA39.Y280", "YPB.280"],
  ["HA39.Y281", "YPB.281"],
  ["HA39.Y282", "YPB.282"],
  ["HA39.Y283", "YPB.283"],
  ["HA39.Y285", "YPB.285"],
  ["HA39.Y286", "YPB.286"],
  ["HA39.Y287", "YPB.287"],
  ["HA39.Y288", "YPB.288"],
  ["HA39.Y200", "YPB.200"],
  ["HA39.Y201", "YPB.201"],
  ["HA39.Y202", "YPB.202"],
  ["HA39.Y203", "YPB.203"],
  ["HA39.Y204", "YPB.204"],
  ["HA39.Y205", "YPB.205"],
  ["HA39.Y206", "YPB.206"],
  ["HA39.Y207", "YPB.207"],
  ["HA39.Y208", "YPB.208"],
  ["HA39.Y209", "YPB.209"],
  ["HA39.Y210", "YPB.210"],
  ["HA39.Y234", "YPB.234"],
  ["HA39.Y235", "YPB.235"],
  ["HA39.Y236", "YPB.236"],
  ["HA39.Y239", "YPB.239"],
  ["HA39.Y240", "YPB.240"],
];

interface UpdateResult {
  helix_sku: string;
  ypb_sku: string;
  woo_id: number | null;
  status: "updated" | "missing_mapping" | "error";
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

    const helixSkus = MAPPINGS.map(([h]) => h);
    const { data: mapRows, error: mapErr } = await supabase
      .from("woo_product_map")
      .select("sku, woo_id")
      .in("sku", helixSkus);
    if (mapErr) throw mapErr;

    const skuToId = new Map<string, number>();
    for (const row of mapRows ?? []) skuToId.set(row.sku, row.woo_id);

    const results: UpdateResult[] = [];

    for (const [helix, ypb] of MAPPINGS) {
      const wooId = skuToId.get(helix);
      if (!wooId) {
        results.push({ helix_sku: helix, ypb_sku: ypb, woo_id: null, status: "missing_mapping" });
        continue;
      }

      try {
        const res = await fetch(`${base}/products/${wooId}`, {
          method: "PUT",
          headers: {
            Authorization: auth,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meta_data: [{ key: "fulfillment_sku", value: ypb }],
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          results.push({
            helix_sku: helix,
            ypb_sku: ypb,
            woo_id: wooId,
            status: "error",
            error: `${res.status} ${text.slice(0, 200)}`,
          });
          continue;
        }

        results.push({ helix_sku: helix, ypb_sku: ypb, woo_id: wooId, status: "updated" });
      } catch (e) {
        results.push({
          helix_sku: helix,
          ypb_sku: ypb,
          woo_id: wooId,
          status: "error",
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    const summary = {
      total: results.length,
      updated: results.filter((r) => r.status === "updated").length,
      missing_mapping: results.filter((r) => r.status === "missing_mapping").length,
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
