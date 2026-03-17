import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, role, tenantId } = await req.json();

    if (!email || !tenantId) {
      return new Response(
        JSON.stringify({ error: "email and tenantId are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Generate invite link directly — bypasses Supabase SMTP entirely
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email,
      options: {
        data: { full_name: name, role },
        redirectTo: "https://daze-management-hub.vercel.app",
      },
    });

    if (linkError) {
      return new Response(
        JSON.stringify({ error: linkError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const inviteUrl = linkData.properties?.action_link;
    const userId = linkData.user?.id;

    // Send invite email via Resend directly
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    const firstName = name ? name.split(" ")[0] : "there";

    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #f4f4f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
    .header { background: #0f1724; padding: 32px 40px; text-align: center; }
    .logo-text { color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: .08em; }
    .body { padding: 40px; }
    .greeting { font-size: 22px; font-weight: 600; color: #0f1724; margin: 0 0 16px; }
    .text { font-size: 15px; line-height: 1.6; color: #4a5568; margin: 0 0 24px; }
    .btn-wrap { text-align: left; margin-bottom: 24px; }
    .btn { display: inline-block; background: #0f1724; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; letter-spacing: .02em; }
    .note { font-size: 13px; line-height: 1.5; color: #9ca3af; margin: 0; }
    .footer { padding: 20px 40px; border-top: 1px solid #e8e8e4; text-align: center; font-size: 12px; color: #9ca3af; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><span class="logo-text">DAZE</span></div>
    <div class="body">
      <p class="greeting">Hi ${firstName}, you've been invited!</p>
      <p class="text">You've been invited to join the Daze management platform${role ? ` as a <strong>${role}</strong>` : ""}. Click the button below to accept your invitation and set up your account.</p>
      <div class="btn-wrap"><a href="${inviteUrl}" class="btn">Accept Invitation</a></div>
      <p class="note">This link expires in 24 hours. If you did not expect this invitation, you can safely ignore this email.</p>
    </div>
    <div class="footer">Daze Technologies &nbsp;&bull;&nbsp; Pensacola Beach, FL<br>hello@dazeapp.com</div>
  </div>
</body>
</html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Daze <hello@dazeapp.com>",
        to: [email],
        subject: "You have been invited to Daze",
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const resendErr = await resendRes.text();
      console.error("Resend error:", resendErr);
      // Don't fail the whole request — user was created, just log the email error
    }

    // Best-effort: link user to tenant
    if (userId) {
      await supabaseAdmin
        .from("user_tenants")
        .insert({ user_id: userId, tenant_id: tenantId, role });
    }

    return new Response(
      JSON.stringify({ success: true, userId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
