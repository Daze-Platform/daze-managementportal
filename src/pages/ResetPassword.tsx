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
  const navigate = useNavigate();
  const { toast } = useToast();
  const settled = useRef(false);

  useEffect(() => {
    const settle = (ready: boolean) => {
      if (settled.current) return;
      settled.current = true;
      if (ready) setSessionReady(true);
      else setLinkExpired(true);
    };

    // Listen for PASSWORD_RECOVERY event from Supabase auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
          settle(true);
        }
      }
    );

    // The Supabase JS client auto-exchanges the PKCE ?code= param on init
    // and strips it from the URL via history.replaceState BEFORE this component
    // mounts. So we cannot rely on checking for ?code= in the URL.
    //
    // Instead, we poll getSession() to detect whether the code was already
    // exchanged successfully. We also check for the implicit hash flow.
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasRecoveryHash =
      hashParams.get("type") === "recovery" && hashParams.has("access_token");

    if (hasRecoveryHash) {
      settle(true);
    } else {
      // Poll getSession() at increasing intervals to catch the session
      // that was established by the auto-exchange.
      const pollSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) settle(true);
      };

      pollSession();
      const t1 = setTimeout(pollSession, 300);
      const t2 = setTimeout(pollSession, 800);
      const t3 = setTimeout(pollSession, 2000);
      const t4 = setTimeout(pollSession, 4000);

      // Hard timeout â if no session found after 15s, the link is truly expired
      // or the user navigated here directly without a valid reset link.
      const timeout = setTimeout(() => settle(false), 15000);

      return () => {
        subscription.unsubscribe();
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(timeout);
      };
    }

    return () => {
      subscription.unsubscribe();
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
      const { error: updateErr } = await Promise.race([
        supabase.auth.updateUser({ password }),
        new Promise<{ error: Error }>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 15000)
        ),
      ]);

      if (updateErr) {
        const msg = updateErr.message || "";
        if (
          msg.toLowerCase().includes("reauth") ||
          msg.toLowerCase().includes("expired") ||
          msg.toLowerCase().includes("invalid") ||
          msg.toLowerCase().includes("session")
        ) {
          setError(
            "This reset link has expired. Please request a new one from the login page."
          );
        } else {
          setError(msg || "Failed to update password. Please request a new reset link.");
        }
        setLoading(false);
        return;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg === "timeout"
          ? "Request timed out. Please request a new reset link."
          : "Something went wrong. Please request a new reset link."
      );
      setLoading(false);
      return;
    }

    toast({
      title: "Password updated!",
      description: "You can now sign in with your new password.",
    });
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (linkExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/daze-logo.png"
              alt="Daze"
              className="h-10"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link expired</h1>
          <p className="text-sm text-gray-500 mb-6">
            This reset link has expired or already been used. Request a new one
            from the login page.
          </p>
          <Button onClick={() => navigate("/login")} className="w-full h-11">
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <img
              src="/daze-logo.png"
              alt="Daze"
              className="h-10"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Set new password
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your new password below.
          </p>

          {!sessionReady ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Verifying reset linkâ¦</p>
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
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

              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading}
              >
                {loading ? "Updatingâ¦" : "Update password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
