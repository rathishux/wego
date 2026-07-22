import { Leaf } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export function LoginPage() {
  const { sendCode, verifyCode } = useAuth();
  const [step, setStep] = React.useState<"email" | "code">("email");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await sendCode(email.trim());
      setStep("code");
      toast.success("Code sent — check your email.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send a code. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await verifyCode(email.trim(), code.trim());
      // AuthProvider's onAuthStateChange picks up the new session automatically.
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "That code didn't work. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-background flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <Leaf className="size-4.5" />
            </div>
            <span className="font-semibold">NivYou</span>
          </div>
          <CardTitle>{step === "email" ? "Sign in" : "Enter your code"}</CardTitle>
          <CardDescription>
            {step === "email"
              ? "No password needed — we'll email you a one-time code."
              : `We sent a one-time code to ${email}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <form onSubmit={handleSendCode} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={busy || !email}>
                {busy ? "Sending…" : "Send code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-code">One-time code</Label>
                <Input
                  id="login-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  maxLength={12}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={busy || code.length < 6}>
                {busy ? "Verifying…" : "Verify & sign in"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStep("email");
                  setCode("");
                }}
              >
                Use a different email
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
