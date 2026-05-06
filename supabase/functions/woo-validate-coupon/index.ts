import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BACKEND = (Deno.env.get("WOO_SITE_URL") ?? "https://backend.helixamino.com").replace(/\/$/, "");
const CK = Deno.env.get("WOO_CONSUMER_KEY") ?? "";
const CS = Deno.env.get("WOO_CONSUMER_SECRET") ?? "";

interface CouponResult {
  valid: boolean;
  code: string;
  discountType?: "percent" | "fixed_cart" | "fixed_product";
  amount?: number;
  description?: string;
  minimumAmount?: number;
  maximumAmount?: number;
  expiresAt?: string | null;
  reason?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!CK || !CS) {
      return json({ valid: false, code: "", reason: "Server is not configured to validate coupons." }, 500);
    }

    const { code } = (await req.json().catch(() => ({}))) as { code?: string };
    const trimmed = typeof code === "string" ? code.trim() : "";
    if (!trimmed) {
      return json({ valid: false, code: "", reason: "Please enter a coupon code." }, 400);
    }

    const url = new URL(`${BACKEND}/wp-json/wc/v3/coupons`);
    url.searchParams.set("code", trimmed);
    url.searchParams.set("consumer_key", CK);
    url.searchParams.set("consumer_secret", CS);

    const upstream = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    if (!upstream.ok) {
      return json({ valid: false, code: trimmed, reason: "Could not check coupon. Please try again." }, 502);
    }

    const rows = (await upstream.json()) as Array<{
      code: string;
      discount_type: "percent" | "fixed_cart" | "fixed_product";
      amount: string;
      description?: string;
      date_expires_gmt?: string | null;
      usage_limit?: number | null;
      usage_count?: number;
      minimum_amount?: string;
      maximum_amount?: string;
    }>;

    const match = rows.find((r) => r.code.toLowerCase() === trimmed.toLowerCase());
    if (!match) {
      return json({ valid: false, code: trimmed, reason: "This coupon does not exist." });
    }

    if (match.date_expires_gmt) {
      const expires = new Date(`${match.date_expires_gmt}Z`);
      if (Number.isFinite(expires.getTime()) && expires.getTime() < Date.now()) {
        return json({ valid: false, code: match.code, reason: "This coupon has expired." });
      }
    }

    if (
      typeof match.usage_limit === "number" &&
      match.usage_limit > 0 &&
      typeof match.usage_count === "number" &&
      match.usage_count >= match.usage_limit
    ) {
      return json({ valid: false, code: match.code, reason: "This coupon has reached its usage limit." });
    }

    const result: CouponResult = {
      valid: true,
      code: match.code,
      discountType: match.discount_type,
      amount: Number(match.amount) || 0,
      description: match.description ?? "",
      minimumAmount: Number(match.minimum_amount) || 0,
      maximumAmount: Number(match.maximum_amount) || 0,
      expiresAt: match.date_expires_gmt ?? null,
    };
    return json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ valid: false, code: "", reason: message }, 500);
  }
});

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
