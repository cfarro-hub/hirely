import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles, Mic, ArrowRight, Loader2, AlertTriangle, User, Briefcase, Target, ChevronRight, ChevronLeft, Brain, CheckCircle2, Lightbulb, RotateCcw, Upload, Wand2,
} from "lucide-react";
import {
  generateInterview, scoreAnswer, extractInterviewProfile,
  type InterviewPlan, type InterviewQuestion, type AnswerFeedback,
} from "@/lib/interview.functions";
import { SignupDialog } from "@/components/SignupDialog";
import { postToN8n } from "@/lib/n8n-webhook";
import { RoleSelect } from "@/components/RoleSelect";
import { IndustryField } from "@/components/IndustryField";
import { extractCvText } from "@/lib/cv-extract";

export const Route = createFileRoute("/_app/interview")({
  component: InterviewPage,
  head: () => ({
    meta: [
      { title: "AI Interview Coach — Hirely" },
      { name: "description", content: "Build your candidate profile and practice tailored interview questions with real-time AI feedback." },
    ],
  }),
});

type Profile = {
  name: string; targetRole: string; targetCompany: string; industry: string;
  yearsExperience: number; skills: string; interviewType: "Behavioral" | "Case" | "Technical" | "Mixed";
};
const EMPTY: Profile = {
  name: "", targetRole: "", targetCompany: "", industry: "Consulting",
  yearsExperience: 0, skills: "", interviewType: "Mixed",
};

type Stage = "profile" | "interview" | "summary";

function InterviewPage() {
  const [authed, setAuthed] = useState<boolean>(true);
  const [showSignup, setShowSignup] = useState(false);
  useEffect(() => {
    try { setAuthed(!!localStorage.getItem("hirely.user")); } catch { setAuthed(false); }
  }, []);

  const [stage, setStage] = useState<Stage>("profile");
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [plan, setPlan] = useState<InterviewPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, { answer: string; feedback?: AnswerFeedback }>>({});
  const [active, setActive] = useState(0);

  const generate = useServerFn(generateInterview);
  const score = useServerFn(scoreAnswer);

  const genM = useMutation<InterviewPlan>({
    mutationFn: async () =>
      (await generate({
        data: { ...profile, yearsExperience: String(profile.yearsExperience) },
      })) as InterviewPlan,
    onSuccess: (d) => {
      setPlan(d); setStage("interview"); setActive(0);
      postToN8n({
        actionType: "interview_start",
        data: { profile, questionCount: d.questions?.length ?? 0 },
      });
    },
    onError: (e: Error) => setError(e.message),
  });

  const scoreM = useMutation<AnswerFeedback, Error, { q: InterviewQuestion; answer: string }>({
    mutationFn: async ({ q, answer }) =>
      (await score({ data: { question: q.question, answer, role: profile.targetRole } })) as AnswerFeedback,
    onSuccess: (fb, vars) => {
      setAnswers((a) => ({ ...a, [vars.q.id]: { answer: vars.answer, feedback: fb } }));
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SignupDialog open={showSignup} onOpenChange={(v) => {
        setShowSignup(v);
        if (!v) { try { setAuthed(!!localStorage.getItem("hirely.user")); } catch {} }
      }} />
      <header className="border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero grid place-items-center"><Sparkles className="h-4 w-4 text-foreground" /></div>
            <span className="font-display font-bold">Hirely</span>
          </Link>
          <StageBar stage={stage} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {!authed && <AuthGate onSignup={() => setShowSignup(true)} />}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" /> <span>{error}</span>
          </div>
        )}

        {authed && stage === "profile" && (
          <ProfileStep
            profile={profile} setProfile={setProfile}
            loading={genM.isPending}
            onSubmit={() => { setError(null); genM.mutate(); }}
          />
        )}

        {authed && stage === "interview" && plan && (
          <InterviewStep
            plan={plan}
            active={active} setActive={setActive}
            answers={answers}
            setAnswerText={(id, v) => setAnswers((a) => ({ ...a, [id]: { ...a[id], answer: v, feedback: a[id]?.feedback } }))}
            onScore={(q) => { const a = answers[q.id]?.answer ?? ""; if (a.length < 5) { setError("Type a longer answer first."); return; } setError(null); scoreM.mutate({ q, answer: a }); }}
            scoring={scoreM.isPending}
            onFinish={() => {
              setStage("summary");
              postToN8n({
                actionType: "interview_complete",
                data: {
                  profile,
                  answered: Object.values(answers).filter((a) => a.feedback).length,
                  total: plan.questions.length,
                },
              });
            }}
          />
        )}

        {authed && stage === "summary" && plan && (
          <SummaryStep
            plan={plan} answers={answers} profile={profile}
            onRestart={() => { setStage("profile"); setPlan(null); setAnswers({}); setActive(0); genM.reset(); scoreM.reset(); }}
          />
        )}
      </main>
    </div>
  );
}

function AuthGate({ onSignup }: { onSignup: () => void }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-10 text-center max-w-xl mx-auto">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-hero grid place-items-center">
        <Brain className="h-6 w-6 text-primary-foreground" />
      </div>
      <h2 className="mt-5 text-2xl font-bold font-display">Create a free account to start your interview preparation.</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Build your candidate profile and practice tailored questions with AI feedback.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button onClick={onSignup} className="rounded-full bg-gradient-hero text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-elegant hover:opacity-95">Sign Up</button>
        <button onClick={onSignup} className="rounded-full border border-border bg-secondary px-6 py-2.5 text-sm hover:bg-muted">Log In</button>
      </div>
    </div>
  );
}

function StageBar({ stage }: { stage: Stage }) {
  const items: { k: Stage; l: string }[] = [
    { k: "profile", l: "Profile" },
    { k: "interview", l: "Interview" },
    { k: "summary", l: "Report" },
  ];
  const i = items.findIndex((x) => x.k === stage);
  return (
    <div className="hidden md:flex items-center gap-2 text-xs text-foreground/80">
      {items.map((it, idx) => (
        <div key={it.k} className="flex items-center gap-2">
          <span className={`h-6 w-6 rounded-full grid place-items-center font-semibold ${idx <= i ? "bg-gradient-hero text-primary-foreground" : "bg-muted"}`}>{idx + 1}</span>
          <span className={idx <= i ? "text-foreground font-medium" : ""}>{it.l}</span>
          {idx < items.length - 1 && <ChevronRight className="h-3.5 w-3.5 opacity-40" />}
        </div>
      ))}
    </div>
  );
}

/* ---------------- PROFILE STEP ---------------- */
function ProfileStep({ profile, setProfile, onSubmit, loading }: {
  profile: Profile; setProfile: (p: Profile) => void; onSubmit: () => void; loading: boolean;
}) {
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setProfile({ ...profile, [k]: v });
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const extract = useServerFn(extractInterviewProfile);

  const importFromCv = async (file: File) => {
    setImportMsg(null);
    setImporting(true);
    try {
      const text = await extractCvText(file);
      if (text.length < 100) throw new Error("Couldn't read enough text from this CV.");
      const p = (await extract({ data: { cvText: text } })) as {
        name: string; targetRole: string; industry: string; yearsExperience: number; skills: string;
      };
      setProfile({
        ...profile,
        name: p.name || profile.name,
        targetRole: p.targetRole || profile.targetRole,
        industry: p.industry || profile.industry,
        yearsExperience: Number.isFinite(p.yearsExperience) ? p.yearsExperience : profile.yearsExperience,
        skills: p.skills || profile.skills,
      });
      setImportMsg(`Imported from ${file.name} — review and edit before starting.`);
    } catch (e) {
      setImportMsg((e as Error).message || "Couldn't import this CV.");
    } finally {
      setImporting(false);
    }
  };

  const yearsValid =
    Number.isFinite(profile.yearsExperience) &&
    profile.yearsExperience >= 0 &&
    profile.yearsExperience <= 50;
  const ready =
    profile.name.trim().length > 1 &&
    profile.targetRole.trim().length > 1 &&
    yearsValid;
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-foreground/80">
        <User className="h-3.5 w-3.5 text-violet-400" /> Step 1 — Build your candidate profile
      </div>
      <h1 className="mt-4 text-4xl md:text-5xl font-bold font-display">Tell us who you are</h1>
      <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
        We tailor every interview question to your role, industry, and experience. The more specific you are, the sharper the simulation.
      </p>

      <div className="mt-6 rounded-2xl border border-violet-400/25 bg-violet-400/[0.06] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="h-10 w-10 rounded-xl bg-gradient-hero grid place-items-center shrink-0">
            <Wand2 className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold">Skip the form — import from your CV</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Upload a PDF or DOCX and we'll pre-fill your name, target role, industry, years and skills.
            </div>
            {importMsg && <div className="mt-2 text-xs text-foreground/80">{importMsg}</div>}
          </div>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) importFromCv(f); }}
          />
          <button
            type="button"
            disabled={importing}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {importing ? <><Loader2 className="h-4 w-4 animate-spin" /> Reading CV...</> : <><Upload className="h-4 w-4" /> Import from CV</>}
          </button>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <Field label="Full name" icon={<User className="h-3.5 w-3.5" />}>
          <input value={profile.name} onChange={(e) => set("name", e.target.value)} placeholder="Sara Mansour" className={inputCls} />
        </Field>
        <Field label="Target role" icon={<Target className="h-3.5 w-3.5" />}>
          <RoleSelect
            value={profile.targetRole}
            onChange={(role, ind) => {
              const next = { ...profile, targetRole: role };
              if (ind) next.industry = ind;
              setProfile(next);
            }}
            placeholder="Search or type (e.g. Strategy Consultant)"
          />
        </Field>
        <Field label="Target company (optional)" icon={<Briefcase className="h-3.5 w-3.5" />}>
          <input value={profile.targetCompany} onChange={(e) => set("targetCompany", e.target.value)} placeholder="BCG, McKinsey, Google..." className={inputCls} />
        </Field>
        <IndustryField
          role={profile.targetRole}
          value={profile.industry}
          onChange={(v) => set("industry", v)}
        />
        <Field label="Years of experience (0–50)">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={50}
            step={1}
            value={Number.isFinite(profile.yearsExperience) ? profile.yearsExperience : 0}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") { set("yearsExperience", 0); return; }
              const n = Math.floor(Number(raw));
              if (!Number.isFinite(n)) return;
              set("yearsExperience", Math.max(0, Math.min(50, n)));
            }}
            className={inputCls}
          />
          {!yearsValid && (
            <p className="mt-1.5 text-xs text-destructive">Enter a number between 0 and 50.</p>
          )}
        </Field>
        <Field label="Interview type">
          <div className="flex flex-wrap gap-2">
            {(["Behavioral", "Case", "Technical", "Mixed"] as const).map((t) => (
              <button key={t} onClick={() => set("interviewType", t)}
                className={`rounded-full px-3.5 py-2 text-xs font-medium transition ${profile.interviewType === t ? "bg-gradient-hero text-primary-foreground shadow-elegant" : "bg-secondary text-foreground/80 hover:bg-muted"}`}>
                {t}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Key skills & experience (free text)">
          <textarea value={profile.skills} onChange={(e) => set("skills", e.target.value)}
            placeholder="e.g. SQL, financial modeling, led a 4-person team for a market entry study..."
            className={`${inputCls} min-h-[120px]`} />
        </Field>
      </div>

      <div className="mt-8 flex justify-end">
        <button disabled={!ready || loading} onClick={onSubmit}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-hero text-primary-foreground px-8 py-3.5 font-medium shadow-elegant hover:opacity-95 transition disabled:opacity-50">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Building interview...</> : <><Brain className="h-4 w-4" /> Start AI Interview <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-violet-400 transition";

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-2">{icon}{label}</span>
      {children}
    </label>
  );
}

/* ---------------- INTERVIEW STEP ---------------- */
function InterviewStep({
  plan, active, setActive, answers, setAnswerText, onScore, scoring, onFinish,
}: {
  plan: InterviewPlan;
  active: number; setActive: (n: number) => void;
  answers: Record<number, { answer: string; feedback?: AnswerFeedback }>;
  setAnswerText: (id: number, v: string) => void;
  onScore: (q: InterviewQuestion) => void;
  scoring: boolean;
  onFinish: () => void;
}) {
  const q = plan.questions[active];
  if (!q) return null;
  const a = answers[q.id];
  const total = plan.questions.length;
  const isLast = active === total - 1;

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      {/* Sidebar */}
      <aside className="rounded-3xl border border-border bg-card p-4 h-fit lg:sticky lg:top-24">
        <div className="text-xs uppercase tracking-wider text-muted-foreground px-2 mb-3">Questions</div>
        <ul className="space-y-1">
          {plan.questions.map((qq, i) => {
            const done = !!answers[qq.id]?.feedback;
            return (
              <li key={qq.id}>
                <button onClick={() => setActive(i)}
                  className={`w-full text-left rounded-xl px-3 py-2.5 text-sm flex items-center gap-3 transition ${i === active ? "bg-gradient-hero text-primary-foreground" : "hover:bg-secondary text-foreground/80"}`}>
                  <span className={`h-6 w-6 rounded-full grid place-items-center text-[11px] font-bold ${done ? "bg-emerald-400/20 text-emerald-300" : i === active ? "bg-white/20" : "bg-muted"}`}>
                    {done ? "✓" : i + 1}
                  </span>
                  <span className="truncate">{qq.type}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main */}
      <section className="space-y-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Question {active + 1} of {total}</span>
          <span className="rounded-full bg-secondary border border-border px-2.5 py-1">{q.type}</span>
        </div>

        <div className="rounded-3xl border border-border bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-7">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-hero grid place-items-center shrink-0">
              <Mic className="h-5 w-5 text-foreground" />
            </div>
            <h2 className="text-2xl font-semibold leading-snug">{q.question}</h2>
          </div>
          <p className="mt-4 text-xs text-violet-300/90"><span className="uppercase tracking-wider mr-2">Why asked</span>{q.whyAsked}</p>
        </div>

        <details className="rounded-2xl border border-border bg-card p-5">
          <summary className="cursor-pointer flex items-center gap-2 text-sm text-foreground/80">
            <Lightbulb className="h-4 w-4 text-amber-300" /> STAR hints (peek if stuck)
          </summary>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-xs text-foreground/80">
            <div className="rounded-lg bg-secondary p-3"><b className="text-amber-300">S</b> — {q.starHints.situation}</div>
            <div className="rounded-lg bg-secondary p-3"><b className="text-amber-300">T</b> — {q.starHints.task}</div>
            <div className="rounded-lg bg-secondary p-3"><b className="text-amber-300">A</b> — {q.starHints.action}</div>
            <div className="rounded-lg bg-secondary p-3"><b className="text-amber-300">R</b> — {q.starHints.result}</div>
          </div>
        </details>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Your answer</label>
          <textarea value={a?.answer ?? ""} onChange={(e) => setAnswerText(q.id, e.target.value)}
            placeholder="Type your answer here. Aim for a structured STAR response — 4-8 sentences."
            className="mt-2 w-full min-h-[180px] rounded-2xl border border-border bg-card p-5 text-sm focus:outline-none focus:border-violet-400" />
          <div className="mt-2 text-xs text-muted-foreground/70">{(a?.answer ?? "").length} characters</div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => onScore(q)} disabled={scoring}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-hero text-primary-foreground px-6 py-3 font-medium shadow-elegant hover:opacity-95 transition disabled:opacity-50">
            {scoring ? <><Loader2 className="h-4 w-4 animate-spin" /> Scoring...</> : <><Brain className="h-4 w-4" /> Score my answer</>}
          </button>
          <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm hover:bg-muted disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          {isLast ? (
            <button onClick={onFinish}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-violet-400/40 bg-violet-400/10 px-4 py-2.5 text-sm hover:bg-violet-400/20">
              Finish & view report <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={() => setActive(Math.min(total - 1, active + 1))}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm hover:bg-muted">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {a?.feedback && <Feedback fb={a.feedback} criteria={q.evaluationCriteria} />}
      </section>
    </div>
  );
}

function Feedback({ fb, criteria }: { fb: AnswerFeedback; criteria: string[] }) {
  const items = [
    { l: "Structure", v: fb.scores.structure },
    { l: "Specificity", v: fb.scores.specificity },
    { l: "Impact", v: fb.scores.impact },
    { l: "Communication", v: fb.scores.communication },
  ];
  return (
    <div className="rounded-3xl border border-violet-400/25 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-violet-300">
          <CheckCircle2 className="h-4 w-4" /> AI Feedback
        </div>
        <div className="text-sm">Overall <b className="text-2xl font-display ml-1">{fb.scores.overall}</b><span className="text-muted-foreground">/100</span></div>
      </div>
      <div className="grid sm:grid-cols-4 gap-3">
        {items.map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-card p-3">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="mt-1 text-lg font-bold">{s.v}<span className="text-xs text-muted-foreground/70">/100</span></div>
            <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-gradient-hero" style={{ width: `${s.v}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-emerald-300 mb-2">Strengths</div>
          <ul className="space-y-1.5 text-sm text-foreground">{fb.strengths.map((s, i) => <li key={i}>• {s}</li>)}</ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-amber-300 mb-2">Improvements</div>
          <ul className="space-y-1.5 text-sm text-foreground">{fb.improvements.map((s, i) => <li key={i}>• {s}</li>)}</ul>
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-violet-300 mb-2">Model answer</div>
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-foreground whitespace-pre-line">{fb.modelAnswer}</div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Likely follow-up</div>
        <div className="mt-1 text-sm text-foreground">{fb.followUpQuestion}</div>
      </div>
      <div className="text-xs text-muted-foreground/70">Evaluator looked for: {criteria.join(" • ")}</div>
    </div>
  );
}

/* ---------------- SUMMARY ---------------- */
function SummaryStep({ plan, answers, profile, onRestart }: {
  plan: InterviewPlan; answers: Record<number, { answer: string; feedback?: AnswerFeedback }>; profile: Profile; onRestart: () => void;
}) {
  const scored = plan.questions.map((q) => answers[q.id]?.feedback?.scores.overall).filter((v): v is number => typeof v === "number");
  const avg = scored.length ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : 0;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Interview report</div>
          <h1 className="mt-1 text-3xl font-bold font-display">{profile.name || "Candidate"} — {profile.targetRole}</h1>
        </div>
        <button onClick={onRestart} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2.5 text-sm hover:bg-muted">
          <RotateCcw className="h-4 w-4" /> New interview
        </button>
      </div>

      <div className="rounded-3xl border border-violet-400/25 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-8 flex items-center gap-6">
        <div className="text-6xl font-bold font-display">{avg}<span className="text-2xl text-muted-foreground">/100</span></div>
        <div>
          <div className="text-xs uppercase tracking-wider text-violet-300">Average score</div>
          <div className="text-sm text-foreground/80 mt-1">Across {scored.length} of {plan.questions.length} answered questions.</div>
        </div>
      </div>

      <div className="space-y-3">
        {plan.questions.map((q, i) => {
          const a = answers[q.id];
          return (
            <div key={q.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="text-sm font-semibold">{i + 1}. {q.question}</div>
                <div className="text-xs text-muted-foreground">{a?.feedback ? `${a.feedback.scores.overall}/100` : "Not answered"}</div>
              </div>
              {a?.answer && <div className="mt-3 text-xs text-foreground/80 italic">"{a.answer}"</div>}
              {a?.feedback && (
                <div className="mt-3 text-xs text-foreground/80">
                  <b className="text-emerald-300">Strengths:</b> {a.feedback.strengths.join("; ")}<br />
                  <b className="text-amber-300">Fix:</b> {a.feedback.improvements.join("; ")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}