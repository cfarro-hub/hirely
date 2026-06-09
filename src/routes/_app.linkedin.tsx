import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Sparkles, Linkedin, ArrowRight, Loader2, AlertTriangle, Brain, Target, Quote, TrendingUp, CheckCircle2, Wand2, Link as LinkIcon, ClipboardPaste,
} from "lucide-react";
import { analyzeLinkedinUrl, analyzeLinkedin, type LinkedinAnalysis } from "@/lib/linkedin-analyzer.functions";
import { postToN8n } from "@/lib/n8n-webhook";
import { RoleSelect } from "@/components/RoleSelect";
import { IndustryField } from "@/components/IndustryField";
import { validateLinkedinPaste, sanitizePaste } from "@/lib/paste-sanitize";

// Accept https?://, www., or bare linkedin.com/in/<username>; allow unicode
// letters (accents, umlauts), numbers, hyphens, dots, underscores, %.
const LINKEDIN_URL_RE =
  /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\p{L}\p{N}_\-%.]+\/?$/u;

export const Route = createFileRoute("/_app/linkedin")({
  component: LinkedinPage,
  head: () => ({
    meta: [
      { title: "LinkedIn Analyzer — Hirely" },
      { name: "description", content: "AI-powered LinkedIn profile analyzer. Get recruiter-grade feedback in seconds." },
    ],
  }),
});

function LinkedinPage() {
  const [mode, setMode] = useState<"url" | "paste">("url");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [profileText, setProfileText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("Consulting");
  const [error, setError] = useState<string | null>(null);
  const [pasteHint, setPasteHint] = useState<string | null>(null);
  const analyzeUrl = useServerFn(analyzeLinkedinUrl);
  const analyzePaste = useServerFn(analyzeLinkedin);
  const m = useMutation<LinkedinAnalysis>({
    mutationFn: async () => {
      if (mode === "url") {
        return (await analyzeUrl({ data: { url, targetRole, industry } })) as LinkedinAnalysis;
      }
      const { clean } = validateLinkedinPaste(profileText);
      return (await analyzePaste({
        data: { profileText: clean, targetRole, industry },
      })) as LinkedinAnalysis;
    },
    onError: (e: Error) => setError(e.message),
  });

  const onUrlChange = (v: string) => {
    setUrl(v);
    if (!v) setUrlError(null);
    else if (!LINKEDIN_URL_RE.test(v.trim())) setUrlError("Please enter a valid LinkedIn URL");
    else setUrlError(null);
  };

  const onAnalyze = () => {
    setError(null);
    if (mode === "url") {
      const trimmed = url.trim();
      if (!LINKEDIN_URL_RE.test(trimmed)) {
        setUrlError("Please enter a valid LinkedIn URL");
        return;
      }
      postToN8n({ actionType: "linkedin_import", data: { url: trimmed, targetRole, industry } });
    } else {
      const v = validateLinkedinPaste(profileText);
      if (v.error) {
        setError(v.error);
        return;
      }
      postToN8n({ actionType: "linkedin_paste", data: { length: v.clean.length, targetRole, industry } });
    }
    m.mutate();
  };

  const onPasteChange = (v: string) => {
    setProfileText(v);
    const cleanedLen = sanitizePaste(v).length;
    if (!v.trim()) { setPasteHint(null); return; }
    if (cleanedLen < 200) {
      setPasteHint(`Add more — ${cleanedLen}/200 characters of usable text so far.`);
    } else {
      const issue = validateLinkedinPaste(v).error;
      setPasteHint(issue ?? `Looks good — ${cleanedLen} characters of profile text detected.`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero grid place-items-center">
              <Sparkles className="h-4 w-4 text-foreground" />
            </div>
            <span className="font-display font-bold">Hirely</span>
          </Link>
          <div className="text-xs text-muted-foreground hidden md:flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-violet-400" /> LinkedIn Profile Analyzer
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 space-y-8">
        {!m.data && (
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-foreground/80">
              <Linkedin className="h-3.5 w-3.5 text-violet-400" /> Beta
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold font-display">LinkedIn Analyzer</h1>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
              Paste your public LinkedIn profile URL and get a recruiter-grade audit with rewrites, keywords, and a content strategy.
            </p>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" /> <span>{error}</span>
              </div>
            )}

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Target role</label>
                <div className="mt-2">
                  <RoleSelect
                    value={targetRole}
                    onChange={(role, ind) => {
                      setTargetRole(role);
                      if (ind) setIndustry(ind);
                    }}
                    placeholder="Search or type a role (e.g. Strategy Consultant)"
                  />
                </div>
              </div>
              <IndustryField role={targetRole} value={industry} onChange={setIndustry} />
            </div>

            <div className="mt-8 inline-flex rounded-full border border-border bg-card p-1 text-xs">
              <button
                type="button"
                onClick={() => setMode("url")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition ${mode === "url" ? "bg-gradient-hero text-primary-foreground shadow-elegant" : "text-foreground/70 hover:text-foreground"}`}
              >
                <LinkIcon className="h-3.5 w-3.5" /> Profile URL
              </button>
              <button
                type="button"
                onClick={() => setMode("paste")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition ${mode === "paste" ? "bg-gradient-hero text-primary-foreground shadow-elegant" : "text-foreground/70 hover:text-foreground"}`}
              >
                <ClipboardPaste className="h-3.5 w-3.5" /> Paste profile
              </button>
            </div>

            {mode === "url" ? (
              <>
                <label className="block mt-4 text-xs uppercase tracking-wider text-muted-foreground">LinkedIn profile URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => onUrlChange(e.target.value)}
                  placeholder="https://www.linkedin.com/in/username"
                  aria-invalid={!!urlError}
                  className={`mt-2 w-full rounded-xl border bg-card px-4 py-3 text-sm focus:outline-none ${urlError ? "border-destructive focus:border-destructive" : "border-border focus:border-violet-400"}`}
                />
                {urlError && <p className="mt-2 text-xs text-destructive">{urlError}</p>}
                <p className="mt-2 text-xs text-muted-foreground">Format: https://www.linkedin.com/in/username</p>
              </>
            ) : (
              <>
                <label className="block mt-4 text-xs uppercase tracking-wider text-muted-foreground">Paste your LinkedIn profile</label>
                <textarea
                  value={profileText}
                  onChange={(e) => onPasteChange(e.target.value)}
                  placeholder={"Copy/paste from LinkedIn — include your headline, About section, and Experience entries.\n\nTip: open your profile → triple-click and copy each section."}
                  className="mt-2 w-full min-h-[260px] rounded-xl border border-border bg-card p-4 text-sm focus:outline-none focus:border-violet-400"
                />
                <p className={`mt-2 text-xs ${pasteHint && /Add more|Couldn't/.test(pasteHint) ? "text-amber-300" : "text-muted-foreground"}`}>
                  {pasteHint ?? `${profileText.length} characters · paste your headline, About, and Experience`}
                </p>
              </>
            )}

            <div className="mt-8 flex justify-end">
              <button
                disabled={m.isPending || (mode === "url" ? !url || !!urlError : sanitizePaste(profileText).length < 200)}
                onClick={onAnalyze}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-hero text-primary-foreground px-8 py-3.5 font-medium shadow-elegant hover:opacity-95 transition disabled:opacity-50"
              >
                {m.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Brain className="h-4 w-4" /> Analyze Profile <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>
          </section>
        )}

        {m.data && <LinkedinReport data={m.data} onRestart={() => m.reset()} />}
      </main>
    </div>
  );
}

function LinkedinReport({ data, onRestart }: { data: LinkedinAnalysis; onRestart: () => void }) {
  const scores = [
    { l: "Overall", v: data.scores.overall },
    { l: "Headline Impact", v: data.scores.headlineImpact },
    { l: "Summary Quality", v: data.scores.summaryQuality },
    { l: "Experience Depth", v: data.scores.experienceDepth },
    { l: "Keyword SEO", v: data.scores.keywordSeo },
    { l: "Social Proof", v: data.scores.socialProof },
    { l: "Recruiter Discoverability", v: data.scores.recruiterDiscoverability },
  ];
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-3xl font-bold font-display">LinkedIn Audit</h1>
        <button onClick={onRestart} className="rounded-full border border-border bg-secondary px-5 py-2 text-sm hover:bg-muted">Analyze another</button>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
        {scores.map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="mt-1 text-2xl font-bold font-display">{s.v}<span className="text-sm text-muted-foreground/70">/100</span></div>
            <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-gradient-hero" style={{ width: `${s.v}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-violet-300"><Quote className="h-4 w-4" /> Recruiter Verdict</div>
        <p className="mt-3 text-lg leading-relaxed text-foreground">{data.recruiterVerdict}</p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Headline</div>
        <div className="text-sm italic text-foreground/80">"{data.headline.current}"</div>
        <p className="mt-3 text-sm text-foreground/80">{data.headline.feedback}</p>
        <div className="mt-4 space-y-2">
          {data.headline.rewrites.map((r, i) => (
            <div key={i} className="rounded-xl border border-violet-400/25 bg-violet-400/[0.06] p-3 text-sm flex gap-2">
              <Wand2 className="h-4 w-4 text-violet-300 shrink-0 mt-0.5" /> <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">About — Optimized</div>
        <p className="text-sm text-foreground/80 italic">{data.about.feedback}</p>
        <div className="mt-4 whitespace-pre-line text-sm text-foreground rounded-xl border border-violet-400/20 bg-violet-400/[0.05] p-4">
          {data.about.rewrite}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Experience tips</div>
        <div className="space-y-3">
          {data.experienceTips.map((t, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="text-sm font-semibold">{t.role}</div>
              <div className="mt-1 text-xs text-amber-300">{t.issue}</div>
              <div className="mt-2 text-sm text-foreground">{t.rewrite}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3"><Target className="h-4 w-4" /> Keywords</div>
        <div className="grid md:grid-cols-2 gap-4">
          <KwChips title="Found" items={data.keywords.found} tone="emerald" />
          <KwChips title="Missing" items={data.keywords.missing} tone="rose" />
        </div>
        {data.keywords.suggested?.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground">Suggested: {data.keywords.suggested.join(" • ")}</div>
        )}
      </div>

      {data.skillsToAdd?.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Skills to add</div>
          <div className="flex flex-wrap gap-2">
            {data.skillsToAdd.map((s, i) => <span key={i} className="rounded-full bg-secondary border border-border px-3 py-1 text-xs">{s}</span>)}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3"><TrendingUp className="h-4 w-4" /> Content strategy</div>
          <ul className="space-y-2 text-sm">
            {data.contentStrategy.map((c, i) => <li key={i} className="flex gap-2"><Sparkles className="h-3.5 w-3.5 text-violet-300 mt-1 shrink-0" />{c}</li>)}
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Quick wins</div>
          <ol className="space-y-2 text-sm">
            {data.quickWins.map((q, i) => (
              <li key={i} className="flex gap-3"><span className="h-5 w-5 rounded-full bg-gradient-hero grid place-items-center text-[10px] font-bold shrink-0">{i + 1}</span>{q}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function KwChips({ title, items, tone }: { title: string; items: string[]; tone: "emerald" | "rose" }) {
  const c = tone === "emerald" ? "border-emerald-400/25 bg-emerald-400/5 text-emerald-200" : "border-rose-400/25 bg-rose-400/5 text-rose-200";
  return (
    <div>
      <div className="text-xs font-semibold text-foreground/80 mb-2">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 && <span className="text-xs text-muted-foreground/70">None.</span>}
        {items.map((k, i) => <span key={i} className={`rounded-full border px-3 py-1 text-xs ${c}`}>{k}</span>)}
      </div>
    </div>
  );
}