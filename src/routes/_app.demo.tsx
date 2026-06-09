import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  Upload, FileText, Sparkles, Check, ArrowRight, Loader2, Target,
  CheckCircle2, AlertTriangle, ChevronRight, Brain, Briefcase, Wand2,
  TrendingUp, Quote, RotateCcw, ChevronDown, Download, Linkedin,
} from "lucide-react";
import { extractCvText } from "@/lib/cv-extract";
import { analyzeCv, type CvAnalysis } from "@/lib/cv-analyzer.functions";
import { downloadOptimizedCvDocx } from "@/lib/cv-docx";
import { PricingLimitDialog, isPaidPlan, getCvTries, bumpCvTries, FREE_CV_LIMIT } from "@/components/PricingLimitDialog";
import { postToN8n } from "@/lib/n8n-webhook";
import { RoleSelect } from "@/components/RoleSelect";
import { IndustryField } from "@/components/IndustryField";

export const Route = createFileRoute("/_app/demo")({
  component: DemoFlow,
  head: () => ({
    meta: [
      { title: "AI CV Analyzer — Hirely" },
      { name: "description", content: "Upload your CV and get real ATS, HR, and consulting-grade feedback." },
    ],
  }),
});

type Step = "upload" | "jd" | "analyzing" | "results";
const MODES = ["General", "Consulting", "Finance", "Data Analyst", "Investment Banking"] as const;
type Mode = (typeof MODES)[number];

const FREE_LIMIT = FREE_CV_LIMIT;

function DemoFlow() {
  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState("");
  const [cvText, setCvText] = useState("");
  const [jd, setJd] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("Consulting");
  const [mode, setMode] = useState<Mode>("Consulting");
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState(0);
  const [showLimit, setShowLimit] = useState(false);
  useEffect(() => {
    setUsage(getCvTries());
    if (!isPaidPlan() && getCvTries() >= FREE_LIMIT) setShowLimit(true);
  }, []);
  const analyze = useServerFn(analyzeCv);

  const mutation = useMutation<CvAnalysis>({
    mutationFn: async () => (await analyze({ data: { cvText, jobDescription: jd, industry, mode } })) as CvAnalysis,
    onSuccess: () => {
      const n = bumpCvTries();
      setUsage(n);
      setStep("results");
      postToN8n({
        actionType: "cv_analysis",
        data: { fileName, industry, mode, jdLength: jd.length, tryCount: n },
      });
      if (!isPaidPlan() && n >= FREE_LIMIT) setShowLimit(true);
    },
    onError: (e: Error) => {
      setError(e.message);
      setStep("jd");
    },
  });

  async function handleFile(file: File) {
    setError(null);
    setFileName(file.name);
    try {
      const text = await extractCvText(file);
      if (text.length < 100) {
        throw new Error("We couldn't read enough text from this file. Try a different CV.");
      }
      setCvText(text);
      setStep("jd");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function runAnalysis() {
    if (!isPaidPlan() && getCvTries() >= FREE_LIMIT) {
      setShowLimit(true);
      setStep("jd");
      return;
    }
    setError(null);
    setStep("analyzing");
    mutation.mutate();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showLimit && !isPaidPlan() && <PricingLimitDialog onClose={() => setShowLimit(false)} />}
      <div className="absolute inset-0 -z-10 bg-gradient-soft" />
      <header className="border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero grid place-items-center">
              <Sparkles className="h-4 w-4 text-foreground" />
            </div>
            <span className="font-display font-bold">Hirely</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{Math.min(usage, FREE_LIMIT)}</span>/<span>{FREE_LIMIT}</span>
              <span className="ml-1">free CVs</span>
            </div>
            <Stepper step={step} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 text-foreground">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {step === "upload" && <UploadStep onFile={handleFile} />}
        {step === "jd" && (
          <JdStep
            fileName={fileName}
            jd={jd} setJd={setJd}
            targetRole={targetRole} setTargetRole={setTargetRole}
            industry={industry} setIndustry={setIndustry}
            mode={mode} setMode={setMode}
            onRun={runAnalysis}
            onBack={() => setStep("upload")}
          />
        )}
        {step === "analyzing" && <AnalyzingStep />}
        {step === "results" && mutation.data && (
          <Results data={mutation.data} fileName={fileName} onRestart={() => {
            setStep("upload"); setCvText(""); setJd(""); setFileName("");
            mutation.reset();
          }} />
        )}
      </main>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const order: Step[] = ["upload", "jd", "analyzing", "results"];
  const labels = ["Upload CV", "Job Description", "AI Analysis", "Report"];
  const i = order.indexOf(step);
  return (
    <div className="hidden md:flex items-center gap-2 text-xs text-foreground/80">
      {labels.map((l, idx) => (
        <div key={l} className="flex items-center gap-2">
          <span className={`h-6 w-6 rounded-full grid place-items-center font-semibold ${idx <= i ? "bg-gradient-hero text-primary-foreground" : "bg-muted"}`}>{idx + 1}</span>
          <span className={idx <= i ? "text-foreground font-medium" : ""}>{l}</span>
          {idx < labels.length - 1 && <ChevronRight className="h-3.5 w-3.5 opacity-40" />}
        </div>
      ))}
    </div>
  );
}

/* ---------------- UPLOAD ---------------- */
function UploadStep({ onFile }: { onFile: (f: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-bold font-display">Upload your CV</h1>
      <p className="mt-3 text-muted-foreground text-lg">Get a real, recruiter-grade analysis in under 30 seconds. PDF or DOCX.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        className={`mt-8 rounded-3xl border-2 border-dashed p-14 text-center cursor-pointer transition ${dragging ? "border-violet-400 bg-violet-500/10" : "border-border bg-card hover:bg-secondary"}`}
      >
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-hero grid place-items-center shadow-elegant">
          <Upload className="h-7 w-7 text-foreground" />
        </div>
        <p className="mt-6 font-semibold text-lg">Drag & drop your CV here</p>
        <p className="mt-1 text-sm text-muted-foreground">or click to browse — PDF, DOCX (max 20 pages)</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
        />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
        {["100% private", "Real AI analysis", "ATS + HR scoring"].map((t) => (
          <div key={t} className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-violet-400" /> {t}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- JD ---------------- */
function JdStep(props: {
  fileName: string; jd: string; setJd: (v: string) => void;
  targetRole: string; setTargetRole: (v: string) => void;
  industry: string; setIndustry: (v: string) => void;
  mode: Mode; setMode: (v: Mode) => void;
  onRun: () => void; onBack: () => void;
}) {
  const [jobUrl, setJobUrl] = useState("");
  const [jobUrlErr, setJobUrlErr] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importNote, setImportNote] = useState<string | null>(null);

  const importFromUrl = async () => {
    const url = jobUrl.trim();
    if (!/^(https?:\/\/)?(www\.)?linkedin\.com\/jobs\/(view\/)?[A-Za-z0-9_\-?=&/.%]+/i.test(url)) {
      setJobUrlErr("Please enter a valid LinkedIn job URL (linkedin.com/jobs/...)");
      return;
    }
    setJobUrlErr(null); setImporting(true); setImportNote(null);
    try {
      const res = await postToN8n({
        actionType: "linkedin_job_import",
        data: { url },
      });
      const resp = res.response as
        | { jobTitle?: string; company?: string; description?: string; requiredSkills?: string[]; industry?: string }
        | null
        | undefined;
      if (res.ok && resp && (resp.description || resp.jobTitle)) {
        const block = [
          resp.jobTitle && `Job title: ${resp.jobTitle}`,
          resp.company && `Company: ${resp.company}`,
          resp.requiredSkills?.length && `Required skills: ${resp.requiredSkills.join(", ")}`,
          resp.description && `\n${resp.description}`,
        ].filter(Boolean).join("\n");
        props.setJd(block);
        if (resp.industry) props.setIndustry(resp.industry);
        setImportNote("Job details imported from LinkedIn.");
      } else {
        setImportNote("Couldn't auto-extract — paste the description below as a fallback.");
      }
    } catch {
      setImportNote("Import failed — paste the description below as a fallback.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 text-sm text-foreground/80">
        <FileText className="h-4 w-4 text-violet-400" /> {props.fileName}
        <button onClick={props.onBack} className="ml-auto text-xs underline-offset-4 hover:underline">Change file</button>
      </div>
      <h1 className="mt-6 text-4xl md:text-5xl font-bold font-display">Paste the job description</h1>
      <p className="mt-3 text-muted-foreground text-lg">Optional, but recommended — we'll match keywords and tailor feedback.</p>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Linkedin className="h-3.5 w-3.5 text-violet-400" /> Paste LinkedIn Job URL
        </label>
        <div className="mt-2 flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => { setJobUrl(e.target.value); setJobUrlErr(null); }}
            placeholder="https://www.linkedin.com/jobs/view/4123456789"
            className={`flex-1 rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none ${jobUrlErr ? "border-destructive focus:border-destructive" : "border-border focus:border-violet-400"}`}
          />
          <button
            type="button"
            onClick={importFromUrl}
            disabled={importing || !jobUrl}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-5 py-3 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {importing ? <><Loader2 className="h-4 w-4 animate-spin" /> Importing...</> : "Import"}
          </button>
        </div>
        {jobUrlErr && <p className="mt-2 text-xs text-destructive">{jobUrlErr}</p>}
        {importNote && <p className="mt-2 text-xs text-muted-foreground">{importNote}</p>}
        <p className="mt-2 text-[11px] text-muted-foreground/80">Or paste the description manually below.</p>
      </div>

      <textarea
        value={props.jd}
        onChange={(e) => props.setJd(e.target.value)}
        placeholder="Paste the full job description here — responsibilities, requirements, nice-to-haves..."
        className="mt-6 w-full min-h-[220px] rounded-2xl border border-border bg-card p-5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-400 transition"
      />

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Target role</label>
          <div className="mt-2">
            <RoleSelect
              value={props.targetRole}
              onChange={(role, ind) => {
                props.setTargetRole(role);
                if (ind) props.setIndustry(ind);
              }}
              placeholder="Search or type (e.g. Accountant, Data Analyst)"
            />
          </div>
          <div className="mt-3">
            <IndustryField role={props.targetRole} value={props.industry} onChange={props.setIndustry} />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Analysis Mode</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => props.setMode(m)}
                className={`rounded-full px-3.5 py-2 text-xs font-medium transition ${props.mode === m ? "bg-gradient-hero text-primary-foreground shadow-elegant" : "bg-secondary text-foreground/80 hover:bg-muted"}`}
              >{m}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-between items-center">
        <button onClick={() => props.setJd("")} className="text-sm text-muted-foreground hover:text-foreground">Skip — analyze CV only</button>
        <button
          onClick={props.onRun}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-hero text-primary-foreground px-8 py-3.5 font-medium shadow-elegant hover:opacity-95 transition"
        >
          <Brain className="h-4 w-4" /> Run AI Analysis <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------------- ANALYZING ---------------- */
function AnalyzingStep() {
  const tasks = [
    "Parsing CV structure...",
    "Running ATS compatibility scan...",
    "Matching against job description...",
    "Evaluating consulting & strategic positioning...",
    "Generating recruiter-grade recommendations...",
  ];
  return (
    <div className="rounded-3xl border border-border bg-card p-10 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-hero grid place-items-center">
          <Brain className="h-5 w-5 text-foreground animate-pulse" />
        </div>
        <div>
          <div className="font-semibold">AI is analyzing your CV</div>
          <div className="text-xs text-muted-foreground">This usually takes 10–20 seconds</div>
        </div>
      </div>
      <div className="mt-8 space-y-3">
        {tasks.map((t, i) => (
          <div key={t} className="flex items-center gap-3 text-sm text-foreground/80" style={{ animation: `pulseIn 1.6s ease ${i * 0.4}s both` }}>
            <Loader2 className="h-4 w-4 text-violet-400 animate-spin" /> {t}
          </div>
        ))}
      </div>
      <style>{`@keyframes pulseIn { from { opacity: .25; transform: translateX(-4px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}

/* ---------------- RESULTS ---------------- */
function Results({ data, fileName, onRestart }: { data: CvAnalysis; fileName: string; onRestart: () => void }) {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Analysis report</div>
          <h1 className="mt-1 text-3xl font-bold font-display">{fileName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadOptimizedCvDocx(data, fileName)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-hero text-primary-foreground px-5 py-2.5 text-sm font-medium shadow-elegant hover:opacity-95"
          >
            <Download className="h-4 w-4" /> Download Optimized CV (.docx)
          </button>
          <button onClick={onRestart} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2.5 text-sm hover:bg-muted">
            <RotateCcw className="h-4 w-4" /> Analyze another
          </button>
        </div>
      </div>

      {/* SCORES */}
      <ScoresPanel scores={data.scores} />

      {/* RECRUITER VERDICT */}
      <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-8 backdrop-blur">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-violet-300">
          <Quote className="h-4 w-4" /> Recruiter Simulation
        </div>
        <p className="mt-3 text-lg leading-relaxed text-foreground">{data.recruiterVerdict}</p>
      </div>

      {/* STRENGTHS + WEAKNESSES */}
      <div className="grid md:grid-cols-2 gap-5">
        <Panel title="Strengths" icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />} accent="emerald">
          {data.strengths.map((s, i) => (
            <div key={i} className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4">
              <div className="text-sm font-semibold text-emerald-300">{s.title}</div>
              <div className="mt-1 text-xs text-foreground/80">{s.detail}</div>
            </div>
          ))}
        </Panel>
        <Panel title="Weaknesses" icon={<AlertTriangle className="h-4 w-4 text-amber-400" />} accent="amber">
          {data.weaknesses.map((s, i) => (
            <div key={i} className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
              <div className="text-sm font-semibold text-amber-300">{s.title}</div>
              <div className="mt-1 text-xs text-foreground/80">{s.detail}</div>
            </div>
          ))}
        </Panel>
      </div>

      {/* HEATMAP */}
      {data.heatmap?.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">CV Heatmap</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.heatmap.map((h, i) => (
              <div key={i} className={`rounded-xl border p-4 ${
                h.strength === "strong" ? "border-emerald-400/30 bg-emerald-400/5" :
                h.strength === "medium" ? "border-amber-400/30 bg-amber-400/5" :
                "border-red-400/30 bg-red-400/5"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{h.section}</span>
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${
                    h.strength === "strong" ? "text-emerald-300" :
                    h.strength === "medium" ? "text-amber-300" : "text-red-300"
                  }`}>{h.strength}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{h.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTIONS */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4">
          <Briefcase className="h-4 w-4" /> Section-by-Section Analysis
        </div>
        <div className="space-y-3">
          {data.sections.map((s, i) => <SectionCard key={i} s={s} />)}
        </div>
      </div>

      {/* BULLET OPTIMIZER */}
      {data.bulletOptimizer?.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4">
            <Wand2 className="h-4 w-4" /> Bullet Point Optimizer
          </div>
          <div className="space-y-4">
            {data.bulletOptimizer.map((b, i) => <BulletCard key={i} b={b} />)}
          </div>
        </div>
      )}

      {/* KEYWORDS */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4">
          <Target className="h-4 w-4" /> Keyword Gap Analysis
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <KwBlock title="Found in your CV" items={data.keywords.found} tone="emerald" />
          <KwBlock title="Missing — add these" items={data.keywords.missing} tone="rose" />
        </div>
        {data.keywords.suggestions?.length > 0 && (
          <div className="mt-5 rounded-xl border border-violet-400/20 bg-violet-400/5 p-4">
            <div className="text-xs font-semibold text-violet-300">Suggested phrases to add</div>
            <ul className="mt-2 space-y-1.5 text-sm">
              {data.keywords.suggestions.map((s, i) => (
                <li key={i} className="flex gap-2"><Sparkles className="h-3.5 w-3.5 text-violet-300 mt-1 shrink-0" /> <span className="text-foreground/80">{s}</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* RECOMMENDATIONS */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4">
          <TrendingUp className="h-4 w-4" /> AI Recommendations
        </div>
        <ol className="space-y-3">
          {data.recommendations.map((r, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <span className="h-6 w-6 rounded-full bg-gradient-hero grid place-items-center text-xs font-bold shrink-0">{i + 1}</span>
              <span className="text-sm text-foreground">{r}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function ScoresPanel({ scores }: { scores: CvAnalysis["scores"] }) {
  const items = [
    { l: "ATS Compatibility", v: scores.atsCompatibility },
    { l: "Consulting Readiness", v: scores.consultingReadiness },
    { l: "Technical Skills", v: scores.technicalSkills },
    { l: "Business Acumen", v: scores.businessAcumen },
    { l: "Communication", v: scores.communicationStrength },
    { l: "JD Match", v: scores.jdMatch },
  ];
  const overall = Math.round(items.reduce((a, x) => a + x.v, 0) / items.length);
  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8">
      <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
        <RadialScore value={overall} />
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((s) => <ScoreBar key={s.l} label={s.l} value={s.v} />)}
        </div>
      </div>
    </div>
  );
}

function RadialScore({ value }: { value: number }) {
  const r = 56, c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative h-40 w-40 mx-auto">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={r} stroke="oklch(0 0 0 / 0.08)" strokeWidth="10" fill="none" />
        <circle cx="70" cy="70" r={r} stroke="url(#g)" strokeWidth="10" fill="none"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round" />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.7 0.22 285)" />
            <stop offset="100%" stopColor="oklch(0.55 0.22 275)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-4xl font-bold font-display">{value}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Overall</div>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-card border border-border/60 p-3">
      <div className="flex justify-between text-xs">
        <span className="text-foreground/80">{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full bg-gradient-hero transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4">
        {icon} {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SectionCard({ s }: { s: CvAnalysis["sections"][number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/60">
        <span className="font-semibold">{s.name}</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-5 grid md:grid-cols-2 gap-4 border-t border-border/60 pt-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Current</div>
            <div className="rounded-lg bg-secondary/60 p-3 text-xs text-foreground/80 italic">"{s.current}"</div>
            <div className="mt-3 text-[10px] uppercase tracking-wider text-amber-300 mb-1">AI Feedback</div>
            <p className="text-xs text-foreground/80">{s.feedback}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-violet-300 mb-1">Optimized Rewrite</div>
            <div className="rounded-lg border border-violet-400/20 bg-violet-400/5 p-3 text-xs text-foreground">{s.rewrite}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function BulletCard({ b }: { b: CvAnalysis["bulletOptimizer"][number] }) {
  const tones = [
    { k: "strategic", label: "More Strategic" },
    { k: "metrics", label: "Add Metrics" },
    { k: "consulting", label: "Consulting Style" },
    { k: "executive", label: "Executive Tone" },
  ] as const;
  const [active, setActive] = useState<typeof tones[number]["k"]>("strategic");
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Before</div>
      <div className="text-sm text-foreground/80 italic">"{b.before}"</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tones.map((t) => (
          <button key={t.k} onClick={() => setActive(t.k)}
            className={`text-xs rounded-full px-3 py-1.5 transition ${active === t.k ? "bg-gradient-hero text-primary-foreground" : "bg-secondary text-foreground/80 hover:bg-muted"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-violet-400/25 bg-violet-400/[0.06] p-4 text-sm text-foreground">
        {b.variants[active]}
      </div>
    </div>
  );
}

function KwBlock({ title, items, tone }: { title: string; items: string[]; tone: "emerald" | "rose" }) {
  const color = tone === "emerald"
    ? "border-emerald-400/25 bg-emerald-400/5 text-emerald-200"
    : "border-rose-400/25 bg-rose-400/5 text-rose-200";
  return (
    <div>
      <div className="text-xs font-semibold text-foreground/80 mb-3">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 && <span className="text-xs text-muted-foreground/70">None detected.</span>}
        {items.map((k, i) => (
          <span key={i} className={`rounded-full border px-3 py-1 text-xs ${color}`}>{k}</span>
        ))}
      </div>
    </div>
  );
}

