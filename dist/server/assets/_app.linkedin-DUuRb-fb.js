import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DSJIU2Sn.js";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Sparkles, Linkedin, AlertTriangle, Link as Link$1, ClipboardPaste, Loader2, Brain, ArrowRight, Quote, Wand2, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { a as createServerFn } from "./server-2xF5ZQvo.js";
import { z } from "zod";
import { p as postToN8n } from "./n8n-webhook-C4tEkPnc.js";
import { R as RoleSelect, I as IndustryField } from "./IndustryField-CwhgtX-c.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
const InputSchema = z.object({
  profileText: z.string().min(50).max(4e4),
  targetRole: z.string().max(200).optional().default(""),
  industry: z.string().max(100).optional().default("General")
});
const UrlInputSchema = z.object({
  url: z.string().min(1).max(500).refine((u) => /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\p{L}\p{N}_\-%.]+\/?/u.test(u), "Please enter a valid LinkedIn URL"),
  targetRole: z.string().max(200).optional().default(""),
  industry: z.string().max(100).optional().default("General")
});
const analyzeLinkedin = createServerFn({
  method: "POST"
}).inputValidator((d) => InputSchema.parse(d)).handler(createSsrRpc("46015bd4db1c2f46c938c7ad7b7c5776656cc1e6a3578e90dfb8438d27bd97ae"));
const analyzeLinkedinUrl = createServerFn({
  method: "POST"
}).inputValidator((d) => UrlInputSchema.parse(d)).handler(createSsrRpc("ab9a484502726f547fcaf20dafab25a294aed5db7afd72d22ea2658e2adf5b5c"));
function sanitizePaste(input) {
  return input.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<\/?(p|div|li|br|tr|h\d|section)[^>]*>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&#39;|&apos;/gi, "'").replace(/&quot;/gi, '"').replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}
function validateLinkedinPaste(input) {
  const clean = sanitizePaste(input);
  const words = clean.split(/\s+/).filter(Boolean).length;
  if (clean.length < 200 || words < 40) {
    return {
      clean,
      error: "Paste more of your profile — include your headline, About section, and at least one Experience entry (around 200+ characters)."
    };
  }
  const low = clean.toLowerCase();
  const sectionHints = ["experience", "about", "skills", "education", "headline", "present"];
  const hits = sectionHints.filter((k) => low.includes(k)).length;
  if (hits < 2) {
    return {
      clean,
      error: "Couldn't detect profile sections (Headline / About / Experience). Copy each section from LinkedIn and paste it together."
    };
  }
  return { clean, error: null };
}
const LINKEDIN_URL_RE = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\p{L}\p{N}_\-%.]+\/?$/u;
function LinkedinPage() {
  const [mode, setMode] = useState("url");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState(null);
  const [profileText, setProfileText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("Consulting");
  const [error, setError] = useState(null);
  const [pasteHint, setPasteHint] = useState(null);
  const analyzeUrl = useServerFn(analyzeLinkedinUrl);
  const analyzePaste = useServerFn(analyzeLinkedin);
  const m = useMutation({
    mutationFn: async () => {
      if (mode === "url") {
        return await analyzeUrl({
          data: {
            url,
            targetRole,
            industry
          }
        });
      }
      const {
        clean
      } = validateLinkedinPaste(profileText);
      return await analyzePaste({
        data: {
          profileText: clean,
          targetRole,
          industry
        }
      });
    },
    onError: (e) => setError(e.message)
  });
  const onUrlChange = (v) => {
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
      postToN8n({
        actionType: "linkedin_import",
        data: {
          url: trimmed,
          targetRole,
          industry
        }
      });
    } else {
      const v = validateLinkedinPaste(profileText);
      if (v.error) {
        setError(v.error);
        return;
      }
      postToN8n({
        actionType: "linkedin_paste",
        data: {
          length: v.clean.length,
          targetRole,
          industry
        }
      });
    }
    m.mutate();
  };
  const onPasteChange = (v) => {
    setProfileText(v);
    const cleanedLen = sanitizePaste(v).length;
    if (!v.trim()) {
      setPasteHint(null);
      return;
    }
    if (cleanedLen < 200) {
      setPasteHint(`Add more — ${cleanedLen}/200 characters of usable text so far.`);
    } else {
      const issue = validateLinkedinPaste(v).error;
      setPasteHint(issue ?? `Looks good — ${cleanedLen} characters of profile text detected.`);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-50", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-6 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg bg-gradient-hero grid place-items-center", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-foreground" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-display font-bold", children: "Hirely" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground hidden md:flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Linkedin, { className: "h-4 w-4 text-violet-400" }),
        " LinkedIn Profile Analyzer"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-6 py-12 space-y-8", children: [
      !m.data && /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-foreground/80", children: [
          /* @__PURE__ */ jsx(Linkedin, { className: "h-3.5 w-3.5 text-violet-400" }),
          " Beta"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-4 text-4xl md:text-5xl font-bold font-display", children: "LinkedIn Analyzer" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground text-lg max-w-2xl", children: "Paste your public LinkedIn profile URL and get a recruiter-grade audit with rewrites, keywords, and a content strategy." }),
        error && /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-red-400 shrink-0 mt-0.5" }),
          " ",
          /* @__PURE__ */ jsx("span", { children: error })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 grid md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Target role" }),
            /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(RoleSelect, { value: targetRole, onChange: (role, ind) => {
              setTargetRole(role);
              if (ind) setIndustry(ind);
            }, placeholder: "Search or type a role (e.g. Strategy Consultant)" }) })
          ] }),
          /* @__PURE__ */ jsx(IndustryField, { role: targetRole, value: industry, onChange: setIndustry })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 inline-flex rounded-full border border-border bg-card p-1 text-xs", children: [
          /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setMode("url"), className: `inline-flex items-center gap-2 rounded-full px-4 py-2 transition ${mode === "url" ? "bg-gradient-hero text-primary-foreground shadow-elegant" : "text-foreground/70 hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsx(Link$1, { className: "h-3.5 w-3.5" }),
            " Profile URL"
          ] }),
          /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setMode("paste"), className: `inline-flex items-center gap-2 rounded-full px-4 py-2 transition ${mode === "paste" ? "bg-gradient-hero text-primary-foreground shadow-elegant" : "text-foreground/70 hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsx(ClipboardPaste, { className: "h-3.5 w-3.5" }),
            " Paste profile"
          ] })
        ] }),
        mode === "url" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("label", { className: "block mt-4 text-xs uppercase tracking-wider text-muted-foreground", children: "LinkedIn profile URL" }),
          /* @__PURE__ */ jsx("input", { type: "url", value: url, onChange: (e) => onUrlChange(e.target.value), placeholder: "https://www.linkedin.com/in/username", "aria-invalid": !!urlError, className: `mt-2 w-full rounded-xl border bg-card px-4 py-3 text-sm focus:outline-none ${urlError ? "border-destructive focus:border-destructive" : "border-border focus:border-violet-400"}` }),
          urlError && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-destructive", children: urlError }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Format: https://www.linkedin.com/in/username" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("label", { className: "block mt-4 text-xs uppercase tracking-wider text-muted-foreground", children: "Paste your LinkedIn profile" }),
          /* @__PURE__ */ jsx("textarea", { value: profileText, onChange: (e) => onPasteChange(e.target.value), placeholder: "Copy/paste from LinkedIn — include your headline, About section, and Experience entries.\n\nTip: open your profile → triple-click and copy each section.", className: "mt-2 w-full min-h-[260px] rounded-xl border border-border bg-card p-4 text-sm focus:outline-none focus:border-violet-400" }),
          /* @__PURE__ */ jsx("p", { className: `mt-2 text-xs ${pasteHint && /Add more|Couldn't/.test(pasteHint) ? "text-amber-300" : "text-muted-foreground"}`, children: pasteHint ?? `${profileText.length} characters · paste your headline, About, and Experience` })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsx("button", { disabled: m.isPending || (mode === "url" ? !url || !!urlError : sanitizePaste(profileText).length < 200), onClick: onAnalyze, className: "inline-flex items-center gap-2 rounded-full bg-gradient-hero text-primary-foreground px-8 py-3.5 font-medium shadow-elegant hover:opacity-95 transition disabled:opacity-50", children: m.isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
          " Analyzing..."
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Brain, { className: "h-4 w-4" }),
          " Analyze Profile ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) }) })
      ] }),
      m.data && /* @__PURE__ */ jsx(LinkedinReport, { data: m.data, onRestart: () => m.reset() })
    ] })
  ] });
}
function LinkedinReport({
  data,
  onRestart
}) {
  const scores = [{
    l: "Overall",
    v: data.scores.overall
  }, {
    l: "Headline Impact",
    v: data.scores.headlineImpact
  }, {
    l: "Summary Quality",
    v: data.scores.summaryQuality
  }, {
    l: "Experience Depth",
    v: data.scores.experienceDepth
  }, {
    l: "Keyword SEO",
    v: data.scores.keywordSeo
  }, {
    l: "Social Proof",
    v: data.scores.socialProof
  }, {
    l: "Recruiter Discoverability",
    v: data.scores.recruiterDiscoverability
  }];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center flex-wrap gap-3", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold font-display", children: "LinkedIn Audit" }),
      /* @__PURE__ */ jsx("button", { onClick: onRestart, className: "rounded-full border border-border bg-secondary px-5 py-2 text-sm hover:bg-muted", children: "Analyze another" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 md:grid-cols-4 gap-3", children: scores.map((s) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: s.l }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 text-2xl font-bold font-display", children: [
        s.v,
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground/70", children: "/100" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 h-1.5 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-hero", style: {
        width: `${s.v}%`
      } }) })
    ] }, s.l)) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-violet-300", children: [
        /* @__PURE__ */ jsx(Quote, { className: "h-4 w-4" }),
        " Recruiter Verdict"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-lg leading-relaxed text-foreground", children: data.recruiterVerdict })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-3", children: "Headline" }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm italic text-foreground/80", children: [
        '"',
        data.headline.current,
        '"'
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-foreground/80", children: data.headline.feedback }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: data.headline.rewrites.map((r, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-violet-400/25 bg-violet-400/[0.06] p-3 text-sm flex gap-2", children: [
        /* @__PURE__ */ jsx(Wand2, { className: "h-4 w-4 text-violet-300 shrink-0 mt-0.5" }),
        " ",
        /* @__PURE__ */ jsx("span", { children: r })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-3", children: "About — Optimized" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/80 italic", children: data.about.feedback }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 whitespace-pre-line text-sm text-foreground rounded-xl border border-violet-400/20 bg-violet-400/[0.05] p-4", children: data.about.rewrite })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-3", children: "Experience tips" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: data.experienceTips.map((t, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: t.role }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-amber-300", children: t.issue }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm text-foreground", children: t.rewrite })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3", children: [
        /* @__PURE__ */ jsx(Target, { className: "h-4 w-4" }),
        " Keywords"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(KwChips, { title: "Found", items: data.keywords.found, tone: "emerald" }),
        /* @__PURE__ */ jsx(KwChips, { title: "Missing", items: data.keywords.missing, tone: "rose" })
      ] }),
      data.keywords.suggested?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 text-xs text-muted-foreground", children: [
        "Suggested: ",
        data.keywords.suggested.join(" • ")
      ] })
    ] }),
    data.skillsToAdd?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-3", children: "Skills to add" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: data.skillsToAdd.map((s, i) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-secondary border border-border px-3 py-1 text-xs", children: s }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" }),
          " Content strategy"
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-sm", children: data.contentStrategy.map((c, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-violet-300 mt-1 shrink-0" }),
          c
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-400" }),
          " Quick wins"
        ] }),
        /* @__PURE__ */ jsx("ol", { className: "space-y-2 text-sm", children: data.quickWins.map((q, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "h-5 w-5 rounded-full bg-gradient-hero grid place-items-center text-[10px] font-bold shrink-0", children: i + 1 }),
          q
        ] }, i)) })
      ] })
    ] })
  ] });
}
function KwChips({
  title,
  items,
  tone
}) {
  const c = tone === "emerald" ? "border-emerald-400/25 bg-emerald-400/5 text-emerald-200" : "border-rose-400/25 bg-rose-400/5 text-rose-200";
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-foreground/80 mb-2", children: title }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
      items.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground/70", children: "None." }),
      items.map((k, i) => /* @__PURE__ */ jsx("span", { className: `rounded-full border px-3 py-1 text-xs ${c}`, children: k }, i))
    ] })
  ] });
}
export {
  LinkedinPage as component
};
