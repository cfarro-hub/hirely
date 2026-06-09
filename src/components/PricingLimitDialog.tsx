import { Lock, Check } from "lucide-react";

const PLANS = [
  {
    name: "Starter", price: "€9.99", per: "/mo",
    href: "https://buy.stripe.com/eVqaEYdeT6fpfGM8Y40VO00",
    features: ["5 CV optimizations", "3 AI interviews", "Full ATS report"],
    featured: false,
  },
  {
    name: "Pro", price: "€19.99", per: "/mo",
    href: "https://buy.stripe.com/4gM5kE8YDgU31PWgqw0VO02",
    features: ["15 CV optimizations", "10 AI interviews", "Consulting & Finance modes"],
    featured: true,
  },
  {
    name: "Unlimited", price: "€99.99", per: "/mo",
    href: "https://buy.stripe.com/14AaEY7UzeLVfGMeio0VO01",
    features: ["Unlimited CVs", "50 AI interviews", "All industries"],
    featured: false,
  },
];

export function PricingLimitDialog({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full rounded-3xl border border-border bg-background p-8 shadow-elegant"
      >
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-hero grid place-items-center mb-4">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display">
            You've used all 3 free CV optimizations.
          </h2>
          <p className="mt-2 text-muted-foreground">Upgrade to keep going.</p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 flex flex-col ${
                p.featured ? "border-foreground bg-foreground text-background" : "border-border bg-card"
              }`}
            >
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold font-display">{p.price}</span>
                <span className={p.featured ? "text-background/70 text-sm" : "text-muted-foreground text-sm"}>
                  {p.per}
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-sm flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      className={`h-4 w-4 mt-0.5 shrink-0 ${p.featured ? "text-primary-glow" : "text-primary"}`}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 block text-center rounded-full py-2.5 text-sm font-medium transition ${
                  p.featured
                    ? "bg-background text-foreground hover:opacity-90"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                Choose {p.name}
              </a>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 mx-auto block text-xs text-muted-foreground hover:text-foreground"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

const PAID_KEY = "hirely.plan";
const TRIES_KEY = "cv_tries";

export function isPaidPlan(): boolean {
  if (typeof window === "undefined") return false;
  const v = localStorage.getItem(PAID_KEY);
  return !!v && v !== "free";
}

export function getCvTries(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(TRIES_KEY) || "0");
}

export function bumpCvTries(): number {
  const n = getCvTries() + 1;
  localStorage.setItem(TRIES_KEY, String(n));
  return n;
}

// Raised for development/testing. Set back to 3 before release.
export const FREE_CV_LIMIT = 9999;