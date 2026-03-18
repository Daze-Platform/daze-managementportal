import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [linkExpired, setLinkExpired] = useState(false);
  const [error, setError] = useState("");
  const readyRef = useRef(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Only PASSWORD_RECOVERY event is valid for this page.
    // Do NOT use getSession() — it returns any existing session, not the recovery one.
    // Do NOT accept SIGNED_IN — that fires for regular logins and causes updateUser to hang.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        readyRef.current = true;
        setSessionReady(true);
      }
    });

    // Handle PKCE flow: Supabase v2 default sends a `?code=` param in the URL.
    // We must explicitly exchange it — Supabase only auto-exchanges on initial page load,
    // not when navigated client-side via React Router.
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const hashType = hashParams.get("type");

    if (code) {
      // PKCE flow
      supabase.auth.exchangeCodeForSession(code).catch(() => {
        if (!readyRef.current) setLinkExpired(true);
      });
    } else if (accessToken && hashType === "recovery") {
      // Legacy implicit flow
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || "",
      }).then(({ error: sessionError }) => {
        if (sessionError && !readyRef.current) setLinkExpired(true);
      });
    } else {
      // No recovery params in URL — this isn't a valid reset link
      setLinkExpired(true);
    }

    // Timeout: if PASSWORD_RECOVERY hasn't fired in 15s, the link is expired/invalid
    const timeout = setTimeout(() => {
      if (!readyRef.current) setLinkExpired(true);
    }, 15000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message || "Failed to update password. Please request a new reset link.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Something went wrong. Please request a new reset link.");
      setLoading(false);
      return;
    }

    toast({ title: "Password updated", description: "You can now sign in with your new password." });
    // Sign out the recovery session before going to login
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Expired or invalid link
  if (linkExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <img src="/daze-logo.png" alt="Daze" className="h-10" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link expired</h1>
          <p className="text-sm text-gray-500 mb-6">This reset link has expired or already been used. Request a new one from the login page.</p>
          <Button onClick={() => navigate("/login")} className="w-full h-11">Back to sign in</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <img src="/daze-logo.png" alt="Daze" className="h-10" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Set new password</h1>
          <p className="text-sm text-gray-500 text-center mb-6">Enter your new password below.</p>

          {!sessionReady ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Verifying reset link…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9 h-11"
                    required
                    autoFocus
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 h-11"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Updating…" : "Update password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
