import { useState, useEffect } from "react";
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
  const [verifying, setVerifying] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [linkExpired, setLinkExpired] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href);
      const tokenHash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type");

      // Primary path: hash-based token from our send-password-reset edge function.
      // Works across any browser/device — no PKCE code_verifier needed.
      // This is the correct path for mobile email → browser flows.
      if (tokenHash && type === "recovery") {
        const { error: otpError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        if (otpError) {
          console.error("verifyOtp error:", otpError.message);
          setLinkExpired(true);
        } else {
          setSessionReady(true);
        }
        setVerifying(false);
        return;
      }

      // Fallback: implicit hash fragment (legacy or non-PKCE flows)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get("type") === "recovery" && hashParams.has("access_token")) {
        setSessionReady(true);
        setVerifying(false);
        return;
      }

      // No valid params — link is missing or malformed
      setLinkExpired(true);
      setVerifying(false);
    };

    run();
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

    // Timeout guard — if updateUser hangs >12s, surface an error instead of staying stuck
    const timeout = setTimeout(() => {
      setLoading(false);
      setError("Request timed out. Please try again or request a new reset link.");
    }, 12000);

    try {
      const { error: updateErr } = await supabase.auth.updateUser({ password });
      clearTimeout(timeout);

      if (updateErr) {
        const msg = updateErr.message || "";
        if (
          msg.toLowerCase().includes("reauth") ||
          msg.toLowerCase().includes("expired") ||
          msg.toLowerCase().includes("invalid") ||
          msg.toLowerCase().includes("session")
        ) {
          setError("This reset link has expired. Please request a new one from the login page.");
        } else {
          setError(msg || "Failed to update password. Please request a new reset link.");
        }
        return;
      }

      toast({
        title: "Password updated!",
        description: "You can now sign in with your new password.",
      });
      await supabase.auth.signOut();
      navigate("/login");
    } catch {
      clearTimeout(timeout);
      setError("Something went wrong. Please request a new reset link.");
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const DazeLogo = () => (
    <img
      src="/daze-logo.png"
      alt="Daze"
      className="h-10"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6"><DazeLogo /></div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Verifying reset link…</p>
        </div>
      </div>
    );
  }

  if (linkExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6"><DazeLogo /></div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link expired or already used</h1>
          <p className="text-sm text-gray-500 mb-6">
            Reset links are single-use and expire after 1 hour. Request a fresh one from the login page.
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
          <div className="flex justify-center mb-6"><DazeLogo /></div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Set new password
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Lock className="absolute left-3 inset-y-0 flex items-center h-full w-4 text-gray-400 pointer-events-none" />
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
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <div className="relative">
                <Lock className="absolute left-3 inset-y-0 flex items-center h-full w-4 text-gray-400 pointer-events-none" />
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
        </div>
      </div>
    </div>
  );
}
