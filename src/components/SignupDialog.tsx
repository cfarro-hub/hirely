import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { postToN8n } from "@/lib/n8n-webhook";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Source = "" | "Google" | "Friend/Referral" | "Social Media" | "Other";

export function SignupDialog({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState<Source>("");
  const [refEmail, setRefEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [refEmailError, setRefEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onEmailChange = (v: string) => {
    setEmail(v);
    if (!v) setEmailError(null);
    else if (!EMAIL_RE.test(v)) setEmailError("Invalid email");
    else setEmailError(null);
  };

  const onRefChange = (v: string) => {
    setRefEmail(v);
    if (!v) setRefEmailError(null);
    else if (!EMAIL_RE.test(v)) setRefEmailError("Invalid email");
    else setRefEmailError(null);
  };

  const reset = () => {
    setFullName(""); setEmail(""); setSource(""); setRefEmail("");
    setEmailError(null); setRefEmailError(null); setFormError(null);
    setSuccess(false); setSubmitting(false);
  };

  const handleClose = (v: boolean) => {
    if (!v) setTimeout(reset, 200);
    onOpenChange(v);
  };

  const continueToApp = () => {
    handleClose(false);
    navigate({ to: "/demo" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!fullName.trim()) return setFormError("Please enter your name");
    if (!email || !EMAIL_RE.test(email)) return setEmailError("Invalid email");
    if (!source) return setFormError("Please tell us how you found us");
    if (source === "Friend/Referral") {
      if (!refEmail || !EMAIL_RE.test(refEmail)) return setRefEmailError("Invalid email");
    }

    setSubmitting(true);
    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        source,
        referrerEmail: source === "Friend/Referral" ? refEmail.trim().toLowerCase() : null,
        createdAt: new Date().toISOString(),
      };

      // Persist locally up-front so downstream pages see the session.
      try { localStorage.setItem("hirely.user", JSON.stringify(payload)); } catch {}

      // Signup event
      const signupRes = await postToN8n({
        actionType: "signup",
        email: payload.email,
        fullName: payload.fullName,
        data: { source },
      });
      const respData = signupRes.response as { error?: string } | undefined;
      if (respData?.error === "already_registered") {
        setEmailError("This email is already registered");
        setSubmitting(false); return;
      }
      if (respData?.error === "invalid_email") {
        setEmailError("Invalid email address");
        setSubmitting(false); return;
      }

      // Referral event triggers reward email workflow in n8n
      if (payload.referrerEmail) {
        await postToN8n({
          actionType: "referral",
          email: payload.email,
          fullName: payload.fullName,
          data: {
            referrerEmail: payload.referrerEmail,
            reward: "+1 free CV credit",
          },
        });
      }

      setSuccess(true);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = () => {
    setFormError("Google sign-in isn't connected yet. Use the form to continue.");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="py-6 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 grid place-items-center">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Welcome to Hirely 🎉</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your free account is ready. Let's optimize your first CV.
            </p>
            {source === "Friend/Referral" && (
              <p className="mt-3 text-xs text-primary">
                Your referrer will receive +1 free CV credit by email.
              </p>
            )}
            <button
              onClick={continueToApp}
              className="mt-6 w-full rounded-full bg-foreground text-background py-2.5 font-medium hover:opacity-90 transition"
            >
              Start optimizing
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Create your free account
              </DialogTitle>
              <DialogDescription>
                3 free CV optimizations & 1 mock interview. No credit card.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email" type="email" value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="jane@example.com"
                  aria-invalid={!!emailError}
                  className={emailError ? "border-destructive focus-visible:ring-destructive" : ""}
                  required
                />
                {emailError && <p className="text-xs text-destructive">{emailError}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>How did you find us?</Label>
                <Select value={source} onValueChange={(v) => setSource(v as Source)}>
                  <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Friend/Referral">Friend / Referral</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {source === "Friend/Referral" && (
                <div className="space-y-1.5">
                  <Label htmlFor="ref">Enter their email</Label>
                  <Input
                    id="ref" type="email" value={refEmail}
                    onChange={(e) => onRefChange(e.target.value)}
                    placeholder="friend@example.com"
                    aria-invalid={!!refEmailError}
                    className={refEmailError ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {refEmailError && <p className="text-xs text-destructive">{refEmailError}</p>}
                  <p className="text-xs text-muted-foreground">They'll get +1 free CV credit as a thank-you.</p>
                </div>
              )}

              {formError && <p className="text-sm text-destructive">{formError}</p>}

              <button
                type="submit" disabled={submitting}
                className="w-full rounded-full bg-gradient-hero text-primary-foreground py-2.5 font-medium shadow-elegant hover:opacity-95 transition disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Create free account
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center"><span className="bg-background px-2 text-xs text-muted-foreground">or</span></div>
              </div>

              <button
                type="button" onClick={handleGoogle}
                className="w-full rounded-full border border-border bg-background py-2.5 font-medium hover:bg-secondary transition inline-flex items-center justify-center gap-2"
              >
                <GoogleIcon /> Continue with Google
              </button>

              <p className="text-[11px] text-muted-foreground text-center">
                By signing up you agree to our Terms & Privacy Policy.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.7 13-4.6l-6-5.1c-2 1.4-4.4 2.2-7 2.2-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.1 16.2 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.3 5.3l6 5.1c-.4.4 6.5-4.7 6.5-14.4 0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}