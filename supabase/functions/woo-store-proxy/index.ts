import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, Cart-Token, Nonce",
  "Access-Control-Expose-Headers": "Cart-Token, Nonce",
};

const DEFAULT_BACKEND = "https://backend.helixamino.com";
const BACKEND_ORIGIN = (Deno.env.get("WOO_SITE_URL") ?? DEFAULT_BACKEND).replace(/\/$/, "");
const STORE_BASE = `${BACKEND_ORIGIN}/wp-json/wc/store/v1`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    // Strip /functions/v1/woo-store-proxy prefix; keep remainder as the Store path.
    const prefixMatch = url.pathname.match(/\/woo-store-proxy(\/.*)?$/);
    const subPath = prefixMatch?.[1] ?? "/";
    const target = `${STORE_BASE}${subPath}${url.search}`;

    const forwardHeaders: Record<string, string> = {
      Accept: "application/json",
    };
    const contentType = req.headers.get("content-type");
    if (contentType) forwardHeaders["Content-Type"] = contentType;
    const cartToken = req.headers.get("cart-token");
    if (cartToken) forwardHeaders["Cart-Token"] = cartToken;
    const nonce = req.headers.get("nonce");
    if (nonce) forwardHeaders["Nonce"] = nonce;

    const body =
      req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer();

    const upstream = await fetch(target, {
      method: req.method,
      headers: forwardHeaders,
      body,
    });

    const responseHeaders: Record<string, string> = { ...corsHeaders };
    const upstreamContentType = upstream.headers.get("content-type");
    if (upstreamContentType) responseHeaders["Content-Type"] = upstreamContentType;
    const upstreamToken = upstream.headers.get("cart-token");
    if (upstreamToken) responseHeaders["Cart-Token"] = upstreamToken;
    const upstreamNonce = upstream.headers.get("nonce");
    if (upstreamNonce) responseHeaders["Nonce"] = upstreamNonce;

    const payload = await upstream.arrayBuffer();
    return new Response(payload, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
