import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile, getMyTransactions } from "@/lib/account.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Account — Hirely" }] }),
});

function AccountPage() {
  const { isAuthenticated, user } = useAuth();
  const fetchProfile = useServerFn(getMyProfile);
  const fetchTxns = useServerFn(getMyTransactions);
  const { data: profile } = useQuery({ queryKey: ["profile", user?.id], queryFn: () => fetchProfile(), enabled: isAuthenticated });
  const { data: txns } = useQuery({ queryKey: ["txns", user?.id], queryFn: () => fetchTxns(), enabled: isAuthenticated });

  if (!isAuthenticated) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">Sign in to view your account.</div>;
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold font-display">Account</h1>
      {profile && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="font-semibold">{profile.full_name || profile.email}</p>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <Stat label="Plan" value={profile.plan} />
            <Stat label="CV credits" value={profile.plan === "unlimited" ? "∞" : String(profile.cv_credits)} />
            <Stat label="Interview credits" value={profile.plan === "unlimited" ? "∞" : String(profile.interview_credits)} />
          </div>
        </div>
      )}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold mb-3">Credit history</h2>
        {(txns ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {txns!.map((t) => (
              <li key={t.id} className="flex justify-between py-2 text-sm">
                <span>{t.reason}</span>
                <span className={t.delta > 0 ? "text-primary" : "text-muted-foreground"}>{t.delta > 0 ? `+${t.delta}` : t.delta}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold font-display">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}