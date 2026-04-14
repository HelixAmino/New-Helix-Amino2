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

  try {
    const payload = await req.json();

    const record = payload?.record;
    if (!record) {
      return new Response(JSON.stringify({ error: "No record in payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { full_name, email, created_at } = record;

    const mailgunDomain = Deno.env.get("MAILGUN_DOMAIN") ?? "mg.helixamino.com";
    const mailgunApiKey = Deno.env.get("MAILGUN_API_KEY") ?? "";

    const formData = new FormData();
    formData.append("from", `Helix Amino Alerts <no-reply@${mailgunDomain}>`);
    formData.append("to", "info@helixamino.com");
    formData.append("subject", "New Member Registration - Helix Amino");
    formData.append(
      "text",
      `A new member has registered on Helix Amino.\n\nName: ${full_name || "Not provided"}\nEmail: ${email}\nSigned up: ${created_at}\n\nLog in to your Supabase dashboard to view all members.`
    );
    formData.append(
      "html",
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#07111d;color:#e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:#0a1825;padding:24px 32px;border-bottom:1px solid #164e63;">
          <h1 style="margin:0;font-size:20px;color:#2dd4bf;">Helix Amino</h1>
          <p style="margin:4px 0 0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">New Member Alert</p>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 20px;font-size:18px;color:#f1f5f9;">A new researcher just joined</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;color:#94a3b8;font-size:14px;width:120px;">Name</td>
              <td style="padding:10px 0;color:#f1f5f9;font-size:14px;font-weight:600;">${full_name || "Not provided"}</td>
            </tr>
            <tr style="border-top:1px solid #1e3a4a;">
              <td style="padding:10px 0;color:#94a3b8;font-size:14px;">Email</td>
              <td style="padding:10px 0;color:#2dd4bf;font-size:14px;font-weight:600;">${email}</td>
            </tr>
            <tr style="border-top:1px solid #1e3a4a;">
              <td style="padding:10px 0;color:#94a3b8;font-size:14px;">Signed up</td>
              <td style="padding:10px 0;color:#f1f5f9;font-size:14px;">${new Date(created_at).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "long", timeStyle: "short" })} ET</td>
            </tr>
          </table>
        </div>
        <div style="padding:20px 32px;background:#0a1825;border-top:1px solid #164e63;font-size:12px;color:#475569;text-align:center;">
          Helix Amino &mdash; Researcher Portal &mdash; helixamino.com
        </div>
      </div>`
    );

    const response = await fetch(
      `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${mailgunApiKey}`)}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return new Response(JSON.stringify({ error: "Mailgun error", detail: text }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
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
