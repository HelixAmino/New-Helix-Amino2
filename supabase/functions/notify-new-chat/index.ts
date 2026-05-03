import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PushSubscriptionRow {
  endpoint: string;
  p256dh: string;
  auth_key: string;
}

async function buildJwt(vapidPublicKey: string, vapidPrivateKey: string, audience: string): Promise<string> {
  const header = { alg: "ES256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: audience,
    exp: now + 3600,
    sub: "mailto:support@helixamino.com",
  };

  function base64url(data: ArrayBuffer | Uint8Array) {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    let str = "";
    for (const b of bytes) str += String.fromCharCode(b);
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  const enc = new TextEncoder();
  const headerB64 = base64url(enc.encode(JSON.stringify(header)));
  const payloadB64 = base64url(enc.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const keyBytes = Uint8Array.from(atob(vapidPrivateKey.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBytes,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, cryptoKey, enc.encode(signingInput));
  return `${signingInput}.${base64url(sig)}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");

    if (!vapidPublicKey || !vapidPrivateKey) {
      return new Response(JSON.stringify({ message: "VAPID keys not configured" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json().catch(() => ({}));
    const sessionId = body.session_id as string | undefined;

    const notifTitle = "New Chat";
    const notifBody = sessionId
      ? `A visitor is waiting for support (session ${sessionId.slice(0, 8)})`
      : "A visitor is waiting for support.";

    // Email alert via Mailgun (always attempt, independent of push).
    const mailgunDomain = Deno.env.get("MAILGUN_DOMAIN");
    const mailgunApiKey = Deno.env.get("MAILGUN_API_KEY");
    if (mailgunDomain && mailgunApiKey) {
      try {
        const formData = new FormData();
        formData.append("from", `Helix Amino Alerts <no-reply@${mailgunDomain}>`);
        formData.append("to", "info@helixamino.com");
        formData.append("subject", "New Live Chat - Helix Amino");
        formData.append(
          "text",
          `A visitor has started a live chat.\n\nSession: ${sessionId ?? "unknown"}\nTime: ${new Date().toISOString()}\n\nOpen the admin chat page to respond.`,
        );
        formData.append(
          "html",
          `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#07111d;color:#e2e8f0;border-radius:12px;overflow:hidden;">
            <div style="background:#0a1825;padding:24px 32px;border-bottom:1px solid #164e63;">
              <h1 style="margin:0;font-size:20px;color:#2dd4bf;">Helix Amino</h1>
              <p style="margin:4px 0 0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">New Live Chat</p>
            </div>
            <div style="padding:32px;">
              <h2 style="margin:0 0 16px;font-size:18px;color:#f1f5f9;">A visitor is waiting for support</h2>
              <p style="margin:0 0 8px;color:#94a3b8;font-size:14px;">Session ID: <span style="color:#f1f5f9;font-family:monospace;">${sessionId ?? "unknown"}</span></p>
              <p style="margin:0;color:#94a3b8;font-size:14px;">Time: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "long", timeStyle: "short" })} ET</p>
            </div>
            <div style="padding:20px 32px;background:#0a1825;border-top:1px solid #164e63;font-size:12px;color:#475569;text-align:center;">
              Helix Amino &mdash; Admin Chat &mdash; helixamino.com
            </div>
          </div>`,
        );
        await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
          method: "POST",
          headers: { Authorization: `Basic ${btoa(`api:${mailgunApiKey}`)}` },
          body: formData,
        });
      } catch {
        /* best effort */
      }
    }

    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth_key");

    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let sent = 0;
    for (const sub of subs as PushSubscriptionRow[]) {
      try {
        const origin = new URL(sub.endpoint).origin;
        const jwt = await buildJwt(vapidPublicKey, vapidPrivateKey, origin);
        const authHeader = `vapid t=${jwt},k=${vapidPublicKey}`;

        const payload = JSON.stringify({ title: notifTitle, body: notifBody });

        const response = await fetch(sub.endpoint, {
          method: "POST",
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/json",
            "Content-Encoding": "aes128gcm",
            "TTL": "60",
          },
          body: payload,
        });

        if (response.ok || response.status === 201) sent++;
        if (response.status === 410 || response.status === 404) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        }
      } catch {}
    }

    return new Response(JSON.stringify({ sent }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
