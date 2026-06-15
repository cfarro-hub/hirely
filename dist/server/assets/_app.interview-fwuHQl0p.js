import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DSJIU2Sn.js";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Sparkles, AlertTriangle, ChevronRight, Brain, User, Wand2, Loader2, Upload, Target, Briefcase, ArrowRight, Mic, Lightbulb, ChevronLeft, RotateCcw, CheckCircle2 } from "lucide-react";
import { a as createServerFn } from "./server-2xF5ZQvo.js";
import { z } from "zod";
import { S as SignupDialog } from "./SignupDialog-BdF-S04v.js";
import { p as postToN8n } from "./n8n-webhook-C4tEkPnc.js";
import { R as RoleSelect, I as IndustryField } from "./IndustryField-CwhgtX-c.js";
import { e as extractCvText } from "./cv-extract-DO3L7UbX.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-select";
const ProfileSchema = z.object({
  name: z.string().min(1).max(120),
  targetRole: z.string().min(1).max(200),
  targetCompany: z.string().max(200).optional().default(""),
  industry: z.string().max(100).optional().default("General"),
  yearsExperience: z.string().max(50).optional().default("0"),
  skills: z.string().max(2e3).optional().default(""),
  interviewType: z.enum(["Behavioral", "Case", "Technical", "Mixed"]).default("Mixed")
});
const generateInterview = createServerFn({
  method: "POST"
}).inputValidator((d) => ProfileSchema.parse(d)).handler(createSsrRpc("e8cdf6f5171836eb010d48977c048ae5d6d72baec85e58b486fa7e08580c21d9"));
const AnswerSchema = z.object({
  question: z.string().min(5).max(2e3),
  answer: z.string().min(5).max(8e3),
  role: z.string().max(200).optional().default("")
});
const scoreAnswer = createServerFn({
  method: "POST"
}).inputValidator((d) => AnswerSchema.parse(d)).handler(createSsrRpc("3a8d015226e106abc6b1ce45d0e2071b9fa623cc1038ceffeb8c0afba31ab0bb"));
const CvExtractSchema = z.object({
  cvText: z.string().min(100).max(4e4)
});
const extractInterviewProfile = createServerFn({
  method: "POST"
}).inputValidator((d) => CvExtractSchema.parse(d)).handler(createSsrRpc("41281cb850b0def0586d4099b568abd40edec818a15fb94fd6d1f7cdd19718a7"));
const EMPTY = {
  name: "",
  targetRole: "",
  targetCompany: "",
  industry: "Consulting",
  yearsExperience: 0,
  skills: "",
  interviewType: "Mixed"
};
function InterviewPage() {
  const [authed, setAuthed] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  useEffect(() => {
    try {
      setAuthed(!!localStorage.getItem("hirely.user"));
    } catch {
      setAuthed(false);
    }
  }, []);
  const [stage, setStage] = useState("profile");
  const [profile, setProfile] = useState(EMPTY);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [active, setActive] = useState(0);
  const generate = useServerFn(generateInterview);
  const score = useServerFn(scoreAnswer);
  const genM = useMutation({
    mutationFn: async () => await generate({
      data: {
        ...profile,
        yearsExperience: String(profile.yearsExperience)
      }
    }),
    onSuccess: (d) => {
      setPlan(d);
      setStage("interview");
      setActive(0);
      postToN8n({
        actionType: "interview_start",
        data: {
          profile,
          questionCount: d.questions?.length ?? 0
        }
      });
    },
    onError: (e) => setError(e.message)
  });
  const scoreM = useMutation({
    mutationFn: async ({
      q,
      answer
    }) => await score({
      data: {
        question: q.question,
        answer,
        role: profile.targetRole
      }
    }),
    onSuccess: (fb, vars) => {
      setAnswers((a) => ({
        ...a,
        [vars.q.id]: {
          answer: vars.answer,
          feedback: fb
        }
      }));
    },
    onError: (e) => setError(e.message)
  });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx(SignupDialog, { open: showSignup, onOpenChange: (v) => {
      setShowSignup(v);
      if (!v) {
        try {
          setAuthed(!!localStorage.getItem("hirely.user"));
        } catch {
        }
      }
    } }),
    /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-50", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-6 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg bg-gradient-hero grid place-items-center", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-foreground" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-display font-bold", children: "Hirely" })
      ] }),
      /* @__PURE__ */ jsx(StageBar, { stage })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-6 py-12", children: [
      !authed && /* @__PURE__ */ jsx(AuthGate, { onSignup: () => setShowSignup(true) }),
      error && /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-red-400 shrink-0 mt-0.5" }),
        " ",
        /* @__PURE__ */ jsx("span", { children: error })
      ] }),
      authed && stage === "profile" && /* @__PURE__ */ jsx(ProfileStep, { profile, setProfile, loading: genM.isPending, onSubmit: () => {
        setError(null);
        genM.mutate();
      } }),
      authed && stage === "interview" && plan && /* @__PURE__ */ jsx(InterviewStep, { plan, active, setActive, answers, setAnswerText: (id, v) => setAnswers((a) => ({
        ...a,
        [id]: {
          ...a[id],
          answer: v,
          feedback: a[id]?.feedback
        }
      })), onScore: (q) => {
        const a = answers[q.id]?.answer ?? "";
        if (a.length < 5) {
          setError("Type a longer answer first.");
          return;
        }
        setError(null);
        scoreM.mutate({
          q,
          answer: a
        });
      }, scoring: scoreM.isPending, onFinish: () => {
        setStage("summary");
        postToN8n({
          actionType: "interview_complete",
          data: {
            profile,
            answered: Object.values(answers).filter((a) => a.feedback).length,
            total: plan.questions.length
          }
        });
      } }),
      authed && stage === "summary" && plan && /* @__PURE__ */ jsx(SummaryStep, { plan, answers, profile, onRestart: () => {
        setStage("profile");
        setPlan(null);
        setAnswers({});
        setActive(0);
        genM.reset();
        scoreM.reset();
      } })
    ] })
  ] });
}
function AuthGate({
  onSignup
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-10 text-center max-w-xl mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto h-14 w-14 rounded-2xl bg-gradient-hero grid place-items-center", children: /* @__PURE__ */ jsx(Brain, { className: "h-6 w-6 text-primary-foreground" }) }),
    /* @__PURE__ */ jsx("h2", { className: "mt-5 text-2xl font-bold font-display", children: "Create a free account to start your interview preparation." }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Build your candidate profile and practice tailored questions with AI feedback." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx("button", { onClick: onSignup, className: "rounded-full bg-gradient-hero text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-elegant hover:opacity-95", children: "Sign Up" }),
      /* @__PURE__ */ jsx("button", { onClick: onSignup, className: "rounded-full border border-border bg-secondary px-6 py-2.5 text-sm hover:bg-muted", children: "Log In" })
    ] })
  ] });
}
function StageBar({
  stage
}) {
  const items = [{
    k: "profile",
    l: "Profile"
  }, {
    k: "interview",
    l: "Interview"
  }, {
    k: "summary",
    l: "Report"
  }];
  const i = items.findIndex((x) => x.k === stage);
  return /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-2 text-xs text-foreground/80", children: items.map((it, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsx("span", { className: `h-6 w-6 rounded-full grid place-items-center font-semibold ${idx <= i ? "bg-gradient-hero text-primary-foreground" : "bg-muted"}`, children: idx + 1 }),
    /* @__PURE__ */ jsx("span", { className: idx <= i ? "text-foreground font-medium" : "", children: it.l }),
    idx < items.length - 1 && /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5 opacity-40" })
  ] }, it.k)) });
}
function ProfileStep({
  profile,
  setProfile,
  onSubmit,
  loading
}) {
  const set = (k, v) => setProfile({
    ...profile,
    [k]: v
  });
  const fileRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const extract = useServerFn(extractInterviewProfile);
  const importFromCv = async (file) => {
    setImportMsg(null);
    setImporting(true);
    try {
      const text = await extractCvText(file);
      if (text.length < 100) throw new Error("Couldn't read enough text from this CV.");
      const p = await extract({
        data: {
          cvText: text
        }
      });
      setProfile({
        ...profile,
        name: p.name || profile.name,
        targetRole: p.targetRole || profile.targetRole,
        industry: p.industry || profile.industry,
        yearsExperience: Number.isFinite(p.yearsExperience) ? p.yearsExperience : profile.yearsExperience,
        skills: p.skills || profile.skills
      });
      setImportMsg(`Imported from ${file.name} — review and edit before starting.`);
    } catch (e) {
      setImportMsg(e.message || "Couldn't import this CV.");
    } finally {
      setImporting(false);
    }
  };
  const yearsValid = Number.isFinite(profile.yearsExperience) && profile.yearsExperience >= 0 && profile.yearsExperience <= 50;
  const ready = profile.name.trim().length > 1 && profile.targetRole.trim().length > 1 && yearsValid;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-foreground/80", children: [
      /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5 text-violet-400" }),
      " Step 1 — Build your candidate profile"
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "mt-4 text-4xl md:text-5xl font-bold font-display", children: "Tell us who you are" }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground text-lg max-w-2xl", children: "We tailor every interview question to your role, industry, and experience. The more specific you are, the sharper the simulation." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-violet-400/25 bg-violet-400/[0.06] p-5 flex flex-col sm:flex-row sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-hero grid place-items-center shrink-0", children: /* @__PURE__ */ jsx(Wand2, { className: "h-5 w-5 text-foreground" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: "Skip the form — import from your CV" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "Upload a PDF or DOCX and we'll pre-fill your name, target role, industry, years and skills." }),
          importMsg && /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs text-foreground/80", children: importMsg })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: ".pdf,.docx,.txt", className: "hidden", onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) importFromCv(f);
        } }),
        /* @__PURE__ */ jsx("button", { type: "button", disabled: importing, onClick: () => fileRef.current?.click(), className: "inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50", children: importing ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
          " Reading CV..."
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
          " Import from CV"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsx(Field, { label: "Full name", icon: /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5" }), children: /* @__PURE__ */ jsx("input", { value: profile.name, onChange: (e) => set("name", e.target.value), placeholder: "Sara Mansour", className: inputCls }) }),
      /* @__PURE__ */ jsx(Field, { label: "Target role", icon: /* @__PURE__ */ jsx(Target, { className: "h-3.5 w-3.5" }), children: /* @__PURE__ */ jsx(RoleSelect, { value: profile.targetRole, onChange: (role, ind) => {
        const next = {
          ...profile,
          targetRole: role
        };
        if (ind) next.industry = ind;
        setProfile(next);
      }, placeholder: "Search or type (e.g. Strategy Consultant)" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Target company (optional)", icon: /* @__PURE__ */ jsx(Briefcase, { className: "h-3.5 w-3.5" }), children: /* @__PURE__ */ jsx("input", { value: profile.targetCompany, onChange: (e) => set("targetCompany", e.target.value), placeholder: "BCG, McKinsey, Google...", className: inputCls }) }),
      /* @__PURE__ */ jsx(IndustryField, { role: profile.targetRole, value: profile.industry, onChange: (v) => set("industry", v) }),
      /* @__PURE__ */ jsxs(Field, { label: "Years of experience (0–50)", children: [
        /* @__PURE__ */ jsx("input", { type: "number", inputMode: "numeric", min: 0, max: 50, step: 1, value: Number.isFinite(profile.yearsExperience) ? profile.yearsExperience : 0, onChange: (e) => {
          const raw = e.target.value;
          if (raw === "") {
            set("yearsExperience", 0);
            return;
          }
          const n = Math.floor(Number(raw));
          if (!Number.isFinite(n)) return;
          set("yearsExperience", Math.max(0, Math.min(50, n)));
        }, className: inputCls }),
        !yearsValid && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-destructive", children: "Enter a number between 0 and 50." })
      ] }),
      /* @__PURE__ */ jsx(Field, { label: "Interview type", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: ["Behavioral", "Case", "Technical", "Mixed"].map((t) => /* @__PURE__ */ jsx("button", { onClick: () => set("interviewType", t), className: `rounded-full px-3.5 py-2 text-xs font-medium transition ${profile.interviewType === t ? "bg-gradient-hero text-primary-foreground shadow-elegant" : "bg-secondary text-foreground/80 hover:bg-muted"}`, children: t }, t)) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Field, { label: "Key skills & experience (free text)", children: /* @__PURE__ */ jsx("textarea", { value: profile.skills, onChange: (e) => set("skills", e.target.value), placeholder: "e.g. SQL, financial modeling, led a 4-person team for a market entry study...", className: `${inputCls} min-h-[120px]` }) }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsx("button", { disabled: !ready || loading, onClick: onSubmit, className: "inline-flex items-center gap-2 rounded-full bg-gradient-hero text-primary-foreground px-8 py-3.5 font-medium shadow-elegant hover:opacity-95 transition disabled:opacity-50", children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
      " Building interview..."
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Brain, { className: "h-4 w-4" }),
      " Start AI Interview ",
      /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
    ] }) }) })
  ] });
}
const inputCls = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-violet-400 transition";
function Field({
  label,
  icon,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-2", children: [
      icon,
      label
    ] }),
    children
  ] });
}
function InterviewStep({
  plan,
  active,
  setActive,
  answers,
  setAnswerText,
  onScore,
  scoring,
  onFinish
}) {
  const q = plan.questions[active];
  if (!q) return null;
  const a = answers[q.id];
  const total = plan.questions.length;
  const isLast = active === total - 1;
  return /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[260px_1fr] gap-6", children: [
    /* @__PURE__ */ jsxs("aside", { className: "rounded-3xl border border-border bg-card p-4 h-fit lg:sticky lg:top-24", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground px-2 mb-3", children: "Questions" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: plan.questions.map((qq, i) => {
        const done = !!answers[qq.id]?.feedback;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { onClick: () => setActive(i), className: `w-full text-left rounded-xl px-3 py-2.5 text-sm flex items-center gap-3 transition ${i === active ? "bg-gradient-hero text-primary-foreground" : "hover:bg-secondary text-foreground/80"}`, children: [
          /* @__PURE__ */ jsx("span", { className: `h-6 w-6 rounded-full grid place-items-center text-[11px] font-bold ${done ? "bg-emerald-400/20 text-emerald-300" : i === active ? "bg-white/20" : "bg-muted"}`, children: done ? "✓" : i + 1 }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: qq.type })
        ] }) }, qq.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Question ",
          active + 1,
          " of ",
          total
        ] }),
        /* @__PURE__ */ jsx("span", { className: "rounded-full bg-secondary border border-border px-2.5 py-1", children: q.type })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-7", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-hero grid place-items-center shrink-0", children: /* @__PURE__ */ jsx(Mic, { className: "h-5 w-5 text-foreground" }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold leading-snug", children: q.question })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "mt-4 text-xs text-violet-300/90", children: [
          /* @__PURE__ */ jsx("span", { className: "uppercase tracking-wider mr-2", children: "Why asked" }),
          q.whyAsked
        ] })
      ] }),
      /* @__PURE__ */ jsxs("details", { className: "rounded-2xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxs("summary", { className: "cursor-pointer flex items-center gap-2 text-sm text-foreground/80", children: [
          /* @__PURE__ */ jsx(Lightbulb, { className: "h-4 w-4 text-amber-300" }),
          " STAR hints (peek if stuck)"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid sm:grid-cols-2 gap-3 text-xs text-foreground/80", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-secondary p-3", children: [
            /* @__PURE__ */ jsx("b", { className: "text-amber-300", children: "S" }),
            " — ",
            q.starHints.situation
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-secondary p-3", children: [
            /* @__PURE__ */ jsx("b", { className: "text-amber-300", children: "T" }),
            " — ",
            q.starHints.task
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-secondary p-3", children: [
            /* @__PURE__ */ jsx("b", { className: "text-amber-300", children: "A" }),
            " — ",
            q.starHints.action
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-secondary p-3", children: [
            /* @__PURE__ */ jsx("b", { className: "text-amber-300", children: "R" }),
            " — ",
            q.starHints.result
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Your answer" }),
        /* @__PURE__ */ jsx("textarea", { value: a?.answer ?? "", onChange: (e) => setAnswerText(q.id, e.target.value), placeholder: "Type your answer here. Aim for a structured STAR response — 4-8 sentences.", className: "mt-2 w-full min-h-[180px] rounded-2xl border border-border bg-card p-5 text-sm focus:outline-none focus:border-violet-400" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs text-muted-foreground/70", children: [
          (a?.answer ?? "").length,
          " characters"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => onScore(q), disabled: scoring, className: "inline-flex items-center gap-2 rounded-full bg-gradient-hero text-primary-foreground px-6 py-3 font-medium shadow-elegant hover:opacity-95 transition disabled:opacity-50", children: scoring ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
          " Scoring..."
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Brain, { className: "h-4 w-4" }),
          " Score my answer"
        ] }) }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setActive(Math.max(0, active - 1)), disabled: active === 0, className: "inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm hover:bg-muted disabled:opacity-40", children: [
          /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
          " Prev"
        ] }),
        isLast ? /* @__PURE__ */ jsxs("button", { onClick: onFinish, className: "ml-auto inline-flex items-center gap-1 rounded-full border border-violet-400/40 bg-violet-400/10 px-4 py-2.5 text-sm hover:bg-violet-400/20", children: [
          "Finish & view report ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setActive(Math.min(total - 1, active + 1)), className: "ml-auto inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm hover:bg-muted", children: [
          "Next ",
          /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
        ] })
      ] }),
      a?.feedback && /* @__PURE__ */ jsx(Feedback, { fb: a.feedback, criteria: q.evaluationCriteria })
    ] })
  ] });
}
function Feedback({
  fb,
  criteria
}) {
  const items = [{
    l: "Structure",
    v: fb.scores.structure
  }, {
    l: "Specificity",
    v: fb.scores.specificity
  }, {
    l: "Impact",
    v: fb.scores.impact
  }, {
    l: "Communication",
    v: fb.scores.communication
  }];
  return /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-violet-400/25 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-6 space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-violet-300", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
        " AI Feedback"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
        "Overall ",
        /* @__PURE__ */ jsx("b", { className: "text-2xl font-display ml-1", children: fb.scores.overall }),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "/100" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-4 gap-3", children: items.map((s) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-3", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: s.l }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 text-lg font-bold", children: [
        s.v,
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground/70", children: "/100" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 h-1 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-hero", style: {
        width: `${s.v}%`
      } }) })
    ] }, s.l)) }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-emerald-300 mb-2", children: "Strengths" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-1.5 text-sm text-foreground", children: fb.strengths.map((s, i) => /* @__PURE__ */ jsxs("li", { children: [
          "• ",
          s
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-amber-300 mb-2", children: "Improvements" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-1.5 text-sm text-foreground", children: fb.improvements.map((s, i) => /* @__PURE__ */ jsxs("li", { children: [
          "• ",
          s
        ] }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-violet-300 mb-2", children: "Model answer" }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card p-4 text-sm text-foreground whitespace-pre-line", children: fb.modelAnswer })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Likely follow-up" }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-foreground", children: fb.followUpQuestion })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground/70", children: [
      "Evaluator looked for: ",
      criteria.join(" • ")
    ] })
  ] });
}
function SummaryStep({
  plan,
  answers,
  profile,
  onRestart
}) {
  const scored = plan.questions.map((q) => answers[q.id]?.feedback?.scores.overall).filter((v) => typeof v === "number");
  const avg = scored.length ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Interview report" }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-1 text-3xl font-bold font-display", children: [
          profile.name || "Candidate",
          " — ",
          profile.targetRole
        ] })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: onRestart, className: "inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2.5 text-sm hover:bg-muted", children: [
        /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" }),
        " New interview"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-violet-400/25 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-8 flex items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-6xl font-bold font-display", children: [
        avg,
        /* @__PURE__ */ jsx("span", { className: "text-2xl text-muted-foreground", children: "/100" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-violet-300", children: "Average score" }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-foreground/80 mt-1", children: [
          "Across ",
          scored.length,
          " of ",
          plan.questions.length,
          " answered questions."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: plan.questions.map((q, i) => {
      const a = answers[q.id];
      return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-sm font-semibold", children: [
            i + 1,
            ". ",
            q.question
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: a?.feedback ? `${a.feedback.scores.overall}/100` : "Not answered" })
        ] }),
        a?.answer && /* @__PURE__ */ jsxs("div", { className: "mt-3 text-xs text-foreground/80 italic", children: [
          '"',
          a.answer,
          '"'
        ] }),
        a?.feedback && /* @__PURE__ */ jsxs("div", { className: "mt-3 text-xs text-foreground/80", children: [
          /* @__PURE__ */ jsx("b", { className: "text-emerald-300", children: "Strengths:" }),
          " ",
          a.feedback.strengths.join("; "),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("b", { className: "text-amber-300", children: "Fix:" }),
          " ",
          a.feedback.improvements.join("; ")
        ] })
      ] }, q.id);
    }) })
  ] });
}
export {
  InterviewPage as component
};
