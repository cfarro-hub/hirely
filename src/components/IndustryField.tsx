import { inferIndustryDetail, INDUSTRIES, type Confidence } from "@/lib/roles";

type Props = {
  role: string;
  value: string;
  onChange: (industry: string) => void;
  className?: string;
};

/**
 * Shared industry input used by LinkedIn Analyzer, CV Optimizer and Interview.
 * Shows the auto-detected industry with a confidence indicator and lets the
 * user override it freely (or pick one from the curated list).
 */
export function IndustryField({ role, value, onChange, className }: Props) {
  const auto = inferIndustryDetail(role);
  const hasRole = role.trim().length > 0;
  const matchesAuto = !!auto.industry && value.trim().toLowerCase() === auto.industry.toLowerCase();
  const overridden = hasRole && !!auto.industry && !matchesAuto && value.trim().length > 0;

  const state: Confidence | "manual" = !hasRole
    ? "none"
    : overridden
      ? "manual"
      : auto.confidence;

  const tone: Record<typeof state, string> = {
    high: "bg-emerald-500/15 text-emerald-300 border border-emerald-400/25",
    medium: "bg-amber-500/15 text-amber-300 border border-amber-400/25",
    low: "bg-rose-500/15 text-rose-300 border border-rose-400/25",
    manual: "bg-violet-500/15 text-violet-300 border border-violet-400/25",
    none: "bg-secondary text-muted-foreground border border-border",
  };
  const label: Record<typeof state, string> = {
    high: "Auto · High confidence",
    medium: "Auto · Medium confidence",
    low: "Needs review",
    manual: "Manual override",
    none: "Auto",
  };

  return (
    <div className={className}>
      <label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        Industry
        <span className={`text-[10px] rounded-full px-2 py-0.5 ${tone[state]}`}>{label[state]}</span>
      </label>
      <input
        list="hirely-industries"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={hasRole ? "Set automatically from role — editable" : "e.g. Consulting"}
        className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-violet-400"
      />
      <datalist id="hirely-industries">
        {INDUSTRIES.map((i) => <option key={i} value={i} />)}
      </datalist>

      {hasRole && state === "low" && (
        <p className="mt-1 text-[11px] text-amber-300">
          Couldn't infer the industry confidently — pick one from the list or type your own.
        </p>
      )}
      {hasRole && state === "medium" && auto.industry && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          Suggested from "{role}" — double-check it's right.
        </p>
      )}
      {hasRole && state === "high" && auto.industry && (
        <p className="mt-1 text-[11px] text-muted-foreground">Derived from "{role}".</p>
      )}
      {overridden && auto.industry && (
        <button
          type="button"
          onClick={() => onChange(auto.industry)}
          className="mt-1 text-[11px] text-violet-300 hover:underline"
        >
          Reset to suggested: {auto.industry}
        </button>
      )}
    </div>
  );
}