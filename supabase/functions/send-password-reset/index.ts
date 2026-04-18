// Shared edge function: used by both Order Manager and Management Hub.
// Each caller MUST pass { email, redirectTo } where redirectTo is the
// app-specific /reset-password URL (e.g. https://daze-order-manager.vercel.app/reset-password).
//
// ROOT CAUSE FIX (April 17, 2026):
// The Supabase JS client's admin.generateLink() sends the Supabase default email
// in addition to our custom Resend email. Because the project Site URL is set to
// https://daze-management-hub.vercel.app, Supabase's email redirected users to
// Management Hub instead of the correct app. Fix: use the raw GoTrue Admin REST API
// with send_email: false — only our Resend email gets sent, with the correct URL.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectTo } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const appBase = redirectTo || "https://daze-order-manager.vercel.app/reset-password";

    // Use raw GoTrue Admin API with send_email: false so Supabase does NOT send its
    // own recovery email (which would use the project Site URL, not the app-specific URL).
    // We send the only email below via Resend, with the correct redirectTo per app.
    const genRes = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        type: "recovery",
        email,
        redirect_to: appBase,
        send_email: false,
      }),
    });

    if (!genRes.ok) {
      const errText = await genRes.text();
      console.error("generateLink API error:", errText);
      // Don't reveal if the email exists or not — always return success to caller
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const linkResp = await genRes.json();
    const hashedToken = linkResp.hashed_token;

    if (!hashedToken) {
      console.error("No hashed_token in generateLink response");
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Build reset URL using token_hash — works across any browser/device (no PKCE needed)
    const resetUrl = `${appBase}?token_hash=${hashedToken}&type=recovery`;

    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

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
      <p class="greeting">Reset your password</p>
      <p class="text">We received a request to reset the password for your Daze account (<strong>${email}</strong>). Click the button below to set a new password.</p>
      <div class="btn-wrap"><a href="${resetUrl}" class="btn">Reset Password</a></div>
      <p class="note">This link expires in 1 hour and can only be used once. If you did not request a password reset, you can safely ignore this email — your password will not change.</p>
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
        subject: "Reset your Daze password",
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const resendErr = await resendRes.text();
      console.error("Resend error:", resendErr);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
