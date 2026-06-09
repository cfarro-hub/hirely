import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Mic, Linkedin, Gift, CreditCard, User as UserIcon, Menu, X, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile } from "@/lib/account.functions";

const TABS = [
  { to: "/demo", label: "CV Review", icon: FileText },
  { to: "/interview", label: "Interview Prep", icon: Mic },
  { to: "/linkedin", label: "LinkedIn Import", icon: Linkedin },
  { to: "/referrals", label: "Referrals", icon: Gift },
  { to: "/pricing", label: "Pricing", icon: CreditCard },
  { to: "/account", label: "Account", icon: UserIcon },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const fetchProfile = useServerFn(getMyProfile);
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id ?? "anon"],
    queryFn: () => fetchProfile(),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-hero text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            Hirely
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {TABS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                preload="intent"
                activeProps={{ className: "bg-foreground text-background" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-secondary" }}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && profile && (
              <span className="text-xs text-muted-foreground hidden lg:inline">
                {profile.plan === "unlimited" ? "Unlimited" : `${profile.cv_credits} CV credits`}
              </span>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Avatar user={user} />
                <button
                  onClick={handleSignOut}
                  className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden rounded-md p-2 hover:bg-secondary"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="mx-auto max-w-7xl px-4 py-3 grid gap-1">
              {TABS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  activeProps={{ className: "bg-foreground text-background" }}
                  inactiveProps={{ className: "text-foreground hover:bg-secondary" }}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              {isAuthenticated && (
                <button onClick={handleSignOut} className="mt-2 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>
    </div>
  );
}

function Avatar({ user }: { user: { email?: string; user_metadata?: { avatar_url?: string; full_name?: string } } | undefined }) {
  const url = user?.user_metadata?.avatar_url;
  const initial = (user?.user_metadata?.full_name || user?.email || "?").trim().charAt(0).toUpperCase();
  if (url) {
    return <img src={url} alt="" className="h-7 w-7 rounded-full object-cover" />;
  }
  return (
    <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-hero text-xs font-semibold text-primary-foreground">
      {initial}
    </div>
  );
}