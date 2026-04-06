import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FadeIn, ScaleIn } from "@/components/ui/animated-container";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();


  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    );
  }

  const handleDemoLogin = () => {
    setEmail("manuel@innisfree-test.daze.com");
    setPassword("DazeDemo2026!");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    // Use edge function — sends token_hash via Resend (no PKCE code_verifier needed,
    // works across any browser/device including email-to-mobile flows)
    const { error } = await supabase.functions.invoke("send-password-reset", {
      body: { email: forgotEmail, redirectTo: "https://daze-management-hub.vercel.app/reset-password" },
    });
    setForgotLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setForgotSent(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all fields",
      });
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError || !data.session) {
        const errorMessage = authError?.message || "Invalid email or password.";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: errorMessage,
        });
        return;
      }

      // onAuthStateChange handles the rest: sets isAuthenticated, fetches profile with tenantId
      toast({
        variant: "success",
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (err) {
      const errorMessage = "An error occurred. Please try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Demo Welcome Banner */}
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-accent to-primary py-3 px-4 text-center shadow-lg"
        >
          <p className="text-sm md:text-base font-medium text-white">
            Welcome to Daze Management Hub
          </p>
        </motion.div>
      )}

      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-tr from-accent/20 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <FadeIn className="w-full max-w-md relative z-10">
        <Card className="glass shadow-glass-lg border-border/50">
          <CardHeader className="text-center pb-4">
            <ScaleIn delay={0.1}>
              <motion.div
                className="mx-auto mb-4 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="/daze-logo.png"
                  alt="Daze Logo"
                  className="h-16 w-auto object-contain drop-shadow-md"
                />
              </motion.div>
            </ScaleIn>
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Management Hub · Powered by Daze
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label
                  htmlFor="email"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    focusedField === "email"
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="h-12 bg-background/50 border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
                  required
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label
                  htmlFor="password"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    focusedField === "password"
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="h-12 pr-12 bg-background/50 border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(true); setForgotEmail(email); setForgotSent(false); }}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                >
                  <Alert
                    variant="destructive"
                    className="bg-destructive/10 border-destructive/30"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium gradient-primary hover:opacity-90 transition-opacity shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              className="mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 mt-5 border-dashed border-2 hover:bg-accent/5 hover:border-accent transition-colors"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Try Demo Login
              </Button>
            </motion.div>

            <motion.p
              className="mt-5 text-center text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              You'll stay logged in for 30 days
            </motion.p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowForgotPassword(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm"
          >
            <Card className="glass shadow-glass-lg border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Reset Password</CardTitle>
                <CardDescription>
                  Enter your email and we'll send a reset link.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {forgotSent ? (
                  <div className="text-center py-4 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Check your inbox at <span className="font-medium text-foreground">{forgotEmail}</span> for the reset link.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="h-11 bg-background/50"
                        required
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowForgotPassword(false)}
                        disabled={forgotLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 gradient-primary"
                        disabled={forgotLoading}
                      >
                        {forgotLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Send Link"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
