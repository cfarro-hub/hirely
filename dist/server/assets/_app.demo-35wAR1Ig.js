import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DSJIU2Sn.js";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Lock, Check, Sparkles, AlertTriangle, ChevronRight, Upload, FileText, Linkedin, Loader2, Brain, ArrowRight, Download, RotateCcw, Quote, CheckCircle2, Briefcase, Wand2, Target, TrendingUp, ChevronDown } from "lucide-react";
import { e as extractCvText } from "./cv-extract-DO3L7UbX.js";
import { a as createServerFn } from "./server-2xF5ZQvo.js";
import { z } from "zod";
import { Paragraph, TextRun, Document, AlignmentType, LevelFormat, Packer, BorderStyle, TabStopType } from "docx";
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
  cvText: z.string().min(50).max(5e4),
  jobDescription: z.string().max(2e4).optional().default(""),
  industry: z.string().max(100).optional().default("General"),
  mode: z.enum(["Consulting", "Finance", "Data Analyst", "Investment Banking", "General"]).default("General")
});
const analyzeCv = createServerFn({
  method: "POST"
}).inputValidator((data) => InputSchema.parse(data)).handler(createSsrRpc("232aca3569d755c72d73562ebea57919c26e8db879ab8fd07bb1c3a2713fac4a"));
const FONT = "Calibri";
function name(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text, bold: true, size: 44, font: FONT })]
  });
}
function role(text) {
  if (!text) return null;
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 24, font: FONT, color: "555555" })]
  });
}
function contactLine(text) {
  if (!text) return null;
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, size: 20, font: FONT, color: "555555" })]
  });
}
function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333", space: 2 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, font: FONT, characterSpacing: 30 })]
  });
}
function roleHeader(left, right) {
  return new Paragraph({
    spacing: { before: 120, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: 9e3 }],
    children: [
      new TextRun({ text: left, bold: true, size: 22, font: FONT }),
      new TextRun({ text: `	${right}`, size: 22, font: FONT, color: "555555" })
    ]
  });
}
function subHeader(text) {
  if (!text) return null;
  return new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text, italics: true, size: 22, font: FONT, color: "555555" })]
  });
}
function para(text) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22, font: FONT })]
  });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 40 },
    children: [new TextRun({ text, size: 22, font: FONT })]
  });
}
async function buildOptimizedDocx(data, fileName) {
  const cv = data.optimizedCv;
  const children = [];
  const fullName = cv?.fullName || "Your Name";
  children.push(name(fullName));
  if (cv?.title) children.push(role(cv.title));
  if (cv?.contact) {
    const c = cv.contact;
    const parts = [c.email, c.phone, c.location, c.linkedin].filter(Boolean);
    if (parts.length) children.push(contactLine(parts.join("  •  ")));
  }
  if (cv?.summary) {
    children.push(sectionHeading("Professional Summary"));
    children.push(para(cv.summary));
  } else if (data.sections?.find((s) => /summary/i.test(s.name))) {
    const s = data.sections.find((x) => /summary/i.test(x.name));
    children.push(sectionHeading("Professional Summary"));
    children.push(para(s.rewrite));
  }
  if (cv?.experience?.length) {
    children.push(sectionHeading("Professional Experience"));
    cv.experience.forEach((e) => {
      const dates = [e.startDate, e.endDate].filter(Boolean).join(" — ");
      children.push(roleHeader(`${e.role}${e.company ? ` · ${e.company}` : ""}`, dates));
      if (e.location) children.push(subHeader(e.location));
      (e.bullets || []).forEach((b) => children.push(bullet(b)));
    });
  }
  if (cv?.projects?.length) {
    children.push(sectionHeading("Projects"));
    cv.projects.forEach((p) => {
      children.push(roleHeader(p.name, ""));
      if (p.description) children.push(para(p.description));
      (p.bullets || []).forEach((b) => children.push(bullet(b)));
    });
  }
  if (cv?.education?.length) {
    children.push(sectionHeading("Education"));
    cv.education.forEach((e) => {
      const dates = [e.startDate, e.endDate].filter(Boolean).join(" — ");
      children.push(roleHeader(`${e.degree}${e.institution ? ` · ${e.institution}` : ""}`, dates));
      if (e.location) children.push(subHeader(e.location));
      if (e.details) children.push(para(e.details));
    });
  }
  if (cv?.skills) {
    const s = cv.skills;
    const groups = [
      ["Technical", s.technical || []],
      ["Tools", s.tools || []],
      ["Languages", s.languages || []],
      ["Soft Skills", s.soft || []]
    ].filter(([, v]) => v.length > 0);
    if (groups.length) {
      children.push(sectionHeading("Skills"));
      groups.forEach(([label, items]) => {
        children.push(new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `${label}: `, bold: true, size: 22, font: FONT }),
            new TextRun({ text: items.join(", "), size: 22, font: FONT })
          ]
        }));
      });
    }
  }
  if (cv?.certifications?.length) {
    children.push(sectionHeading("Certifications"));
    cv.certifications.forEach((c) => children.push(bullet(c)));
  }
  const doc = new Document({
    creator: "Hirely",
    title: `${fileName} — Optimized`,
    numbering: {
      config: [{
        reference: "bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }]
    },
    sections: [{
      properties: { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
      children: children.filter((c) => c !== null)
    }]
  });
  const blob = await Packer.toBlob(doc);
  return blob;
}
async function downloadOptimizedCvDocx(data, fileName) {
  const base = fileName.replace(/\.[^.]+$/, "") || "cv";
  const blob = await buildOptimizedDocx(data, base);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${base}-optimized-hirely.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
const PLANS = [
  {
    name: "Starter",
    price: "€9.99",
    per: "/mo",
    href: "https://buy.stripe.com/eVqaEYdeT6fpfGM8Y40VO00",
    features: ["5 CV optimizations", "3 AI interviews", "Full ATS report"],
    featured: false
  },
  {
    name: "Pro",
    price: "€19.99",
    per: "/mo",
    href: "https://buy.stripe.com/4gM5kE8YDgU31PWgqw0VO02",
    features: ["15 CV optimizations", "10 AI interviews", "Consulting & Finance modes"],
    featured: true
  },
  {
    name: "Unlimited",
    price: "€99.99",
    per: "/mo",
    href: "https://buy.stripe.com/14AaEY7UzeLVfGMeio0VO01",
    features: ["Unlimited CVs", "50 AI interviews", "All industries"],
    featured: false
  }
];
function PricingLimitDialog({ onClose }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-[100] grid place-items-center bg-foreground/40 backdrop-blur-sm p-4",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          className: "relative max-w-4xl w-full rounded-3xl border border-border bg-background p-8 shadow-elegant",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "mx-auto h-14 w-14 rounded-2xl bg-gradient-hero grid place-items-center mb-4", children: /* @__PURE__ */ jsx(Lock, { className: "h-6 w-6 text-primary-foreground" }) }),
              /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold font-display", children: "You've used all 3 free CV optimizations." }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Upgrade to keep going." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-8 grid md:grid-cols-3 gap-4", children: PLANS.map((p) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: `rounded-2xl border p-6 flex flex-col ${p.featured ? "border-foreground bg-foreground text-background" : "border-border bg-card"}`,
                children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: p.name }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-baseline gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold font-display", children: p.price }),
                    /* @__PURE__ */ jsx("span", { className: p.featured ? "text-background/70 text-sm" : "text-muted-foreground text-sm", children: p.per })
                  ] }),
                  /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2 text-sm flex-1", children: p.features.map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsx(
                      Check,
                      {
                        className: `h-4 w-4 mt-0.5 shrink-0 ${p.featured ? "text-primary-glow" : "text-primary"}`
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: f })
                  ] }, f)) }),
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: p.href,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: `mt-6 block text-center rounded-full py-2.5 text-sm font-medium transition ${p.featured ? "bg-background text-foreground hover:opacity-90" : "bg-foreground text-background hover:opacity-90"}`,
                      children: [
                        "Choose ",
                        p.name
                      ]
                    }
                  )
                ]
              },
              p.name
            )) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "mt-6 mx-auto block text-xs text-muted-foreground hover:text-foreground",
                children: "Maybe later"
              }
            )
          ]
        }
      )
    }
  );
}
const PAID_KEY = "hirely.plan";
const TRIES_KEY = "cv_tries";
function isPaidPlan() {
  if (typeof window === "undefined") return false;
  const v = localStorage.getItem(PAID_KEY);
  return !!v && v !== "free";
}
function getCvTries() {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(TRIES_KEY) || "0");
}
function bumpCvTries() {
  const n = getCvTries() + 1;
  localStorage.setItem(TRIES_KEY, String(n));
  return n;
}
const FREE_CV_LIMIT = 9999;
const MODES = ["General", "Consulting", "Finance", "Data Analyst", "Investment Banking"];
const FREE_LIMIT = FREE_CV_LIMIT;
function DemoFlow() {
  const [step, setStep] = useState("upload");
  const [fileName, setFileName] = useState("");
  const [cvText, setCvText] = useState("");
  const [jd, setJd] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("Consulting");
  const [mode, setMode] = useState("Consulting");
  const [error, setError] = useState(null);
  const [usage, setUsage] = useState(0);
  const [showLimit, setShowLimit] = useState(false);
  useEffect(() => {
    setUsage(getCvTries());
    if (!isPaidPlan() && getCvTries() >= FREE_LIMIT) setShowLimit(true);
  }, []);
  const analyze = useServerFn(analyzeCv);
  const mutation = useMutation({
    mutationFn: async () => await analyze({
      data: {
        cvText,
        jobDescription: jd,
        industry,
        mode
      }
    }),
    onSuccess: () => {
      const n = bumpCvTries();
      setUsage(n);
      setStep("results");
      postToN8n({
        actionType: "cv_analysis",
        data: {
          fileName,
          industry,
          mode,
          jdLength: jd.length,
          tryCount: n
        }
      });
      if (!isPaidPlan() && n >= FREE_LIMIT) setShowLimit(true);
    },
    onError: (e) => {
      setError(e.message);
      setStep("jd");
    }
  });
  async function handleFile(file) {
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
      setError(e.message);
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
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    showLimit && !isPaidPlan() && /* @__PURE__ */ jsx(PricingLimitDialog, { onClose: () => setShowLimit(false) }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-soft" }),
    /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-50", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-6 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 text-foreground", children: [
        /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg bg-gradient-hero grid place-items-center", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-foreground" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-display font-bold", children: "Hirely" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: Math.min(usage, FREE_LIMIT) }),
          "/",
          /* @__PURE__ */ jsx("span", { children: FREE_LIMIT }),
          /* @__PURE__ */ jsx("span", { className: "ml-1", children: "free CVs" })
        ] }),
        /* @__PURE__ */ jsx(Stepper, { step })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-6 py-12 text-foreground", children: [
      error && /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-red-400 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsx("span", { children: error })
      ] }),
      step === "upload" && /* @__PURE__ */ jsx(UploadStep, { onFile: handleFile }),
      step === "jd" && /* @__PURE__ */ jsx(JdStep, { fileName, jd, setJd, targetRole, setTargetRole, industry, setIndustry, mode, setMode, onRun: runAnalysis, onBack: () => setStep("upload") }),
      step === "analyzing" && /* @__PURE__ */ jsx(AnalyzingStep, {}),
      step === "results" && mutation.data && /* @__PURE__ */ jsx(Results, { data: mutation.data, fileName, onRestart: () => {
        setStep("upload");
        setCvText("");
        setJd("");
        setFileName("");
        mutation.reset();
      } })
    ] })
  ] });
}
function Stepper({
  step
}) {
  const order = ["upload", "jd", "analyzing", "results"];
  const labels = ["Upload CV", "Job Description", "AI Analysis", "Report"];
  const i = order.indexOf(step);
  return /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-2 text-xs text-foreground/80", children: labels.map((l, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsx("span", { className: `h-6 w-6 rounded-full grid place-items-center font-semibold ${idx <= i ? "bg-gradient-hero text-primary-foreground" : "bg-muted"}`, children: idx + 1 }),
    /* @__PURE__ */ jsx("span", { className: idx <= i ? "text-foreground font-medium" : "", children: l }),
    idx < labels.length - 1 && /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5 opacity-40" })
  ] }, l)) });
}
function UploadStep({
  onFile
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold font-display", children: "Upload your CV" }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground text-lg", children: "Get a real, recruiter-grade analysis in under 30 seconds. PDF or DOCX." }),
    /* @__PURE__ */ jsxs("div", { onDragOver: (e) => {
      e.preventDefault();
      setDragging(true);
    }, onDragLeave: () => setDragging(false), onDrop: (e) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) onFile(f);
    }, onClick: () => inputRef.current?.click(), className: `mt-8 rounded-3xl border-2 border-dashed p-14 text-center cursor-pointer transition ${dragging ? "border-violet-400 bg-violet-500/10" : "border-border bg-card hover:bg-secondary"}`, children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto h-16 w-16 rounded-2xl bg-gradient-hero grid place-items-center shadow-elegant", children: /* @__PURE__ */ jsx(Upload, { className: "h-7 w-7 text-foreground" }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 font-semibold text-lg", children: "Drag & drop your CV here" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "or click to browse — PDF, DOCX (max 20 pages)" }),
      /* @__PURE__ */ jsx("input", { ref: inputRef, type: "file", accept: ".pdf,.docx,.txt", className: "hidden", onChange: (e) => {
        const f = e.target.files?.[0];
        if (f) onFile(f);
      } })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-3 gap-3 text-xs text-muted-foreground", children: ["100% private", "Real AI analysis", "ATS + HR scoring"].map((t) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 text-violet-400" }),
      " ",
      t
    ] }, t)) })
  ] });
}
function JdStep(props) {
  const [jobUrl, setJobUrl] = useState("");
  const [jobUrlErr, setJobUrlErr] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importNote, setImportNote] = useState(null);
  const importFromUrl = async () => {
    const url = jobUrl.trim();
    if (!/^(https?:\/\/)?(www\.)?linkedin\.com\/jobs\/(view\/)?[A-Za-z0-9_\-?=&/.%]+/i.test(url)) {
      setJobUrlErr("Please enter a valid LinkedIn job URL (linkedin.com/jobs/...)");
      return;
    }
    setJobUrlErr(null);
    setImporting(true);
    setImportNote(null);
    try {
      const res = await postToN8n({
        actionType: "linkedin_job_import",
        data: {
          url
        }
      });
      const resp = res.response;
      if (res.ok && resp && (resp.description || resp.jobTitle)) {
        const block = [resp.jobTitle && `Job title: ${resp.jobTitle}`, resp.company && `Company: ${resp.company}`, resp.requiredSkills?.length && `Required skills: ${resp.requiredSkills.join(", ")}`, resp.description && `
${resp.description}`].filter(Boolean).join("\n");
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
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-foreground/80", children: [
      /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-violet-400" }),
      " ",
      props.fileName,
      /* @__PURE__ */ jsx("button", { onClick: props.onBack, className: "ml-auto text-xs underline-offset-4 hover:underline", children: "Change file" })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "mt-6 text-4xl md:text-5xl font-bold font-display", children: "Paste the job description" }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground text-lg", children: "Optional, but recommended — we'll match keywords and tailor feedback." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxs("label", { className: "text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Linkedin, { className: "h-3.5 w-3.5 text-violet-400" }),
        " Paste LinkedIn Job URL"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-col sm:flex-row gap-2", children: [
        /* @__PURE__ */ jsx("input", { type: "url", value: jobUrl, onChange: (e) => {
          setJobUrl(e.target.value);
          setJobUrlErr(null);
        }, placeholder: "https://www.linkedin.com/jobs/view/4123456789", className: `flex-1 rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none ${jobUrlErr ? "border-destructive focus:border-destructive" : "border-border focus:border-violet-400"}` }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: importFromUrl, disabled: importing || !jobUrl, className: "inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-5 py-3 text-sm font-medium hover:opacity-90 disabled:opacity-50", children: importing ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
          " Importing..."
        ] }) : "Import" })
      ] }),
      jobUrlErr && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-destructive", children: jobUrlErr }),
      importNote && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: importNote }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-[11px] text-muted-foreground/80", children: "Or paste the description manually below." })
    ] }),
    /* @__PURE__ */ jsx("textarea", { value: props.jd, onChange: (e) => props.setJd(e.target.value), placeholder: "Paste the full job description here — responsibilities, requirements, nice-to-haves...", className: "mt-6 w-full min-h-[220px] rounded-2xl border border-border bg-card p-5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-400 transition" }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Target role" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(RoleSelect, { value: props.targetRole, onChange: (role2, ind) => {
          props.setTargetRole(role2);
          if (ind) props.setIndustry(ind);
        }, placeholder: "Search or type (e.g. Accountant, Data Analyst)" }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(IndustryField, { role: props.targetRole, value: props.industry, onChange: props.setIndustry }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Analysis Mode" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: MODES.map((m) => /* @__PURE__ */ jsx("button", { onClick: () => props.setMode(m), className: `rounded-full px-3.5 py-2 text-xs font-medium transition ${props.mode === m ? "bg-gradient-hero text-primary-foreground shadow-elegant" : "bg-secondary text-foreground/80 hover:bg-muted"}`, children: m }, m)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => props.setJd(""), className: "text-sm text-muted-foreground hover:text-foreground", children: "Skip — analyze CV only" }),
      /* @__PURE__ */ jsxs("button", { onClick: props.onRun, className: "inline-flex items-center gap-2 rounded-full bg-gradient-hero text-primary-foreground px-8 py-3.5 font-medium shadow-elegant hover:opacity-95 transition", children: [
        /* @__PURE__ */ jsx(Brain, { className: "h-4 w-4" }),
        " Run AI Analysis ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] })
  ] });
}
function AnalyzingStep() {
  const tasks = ["Parsing CV structure...", "Running ATS compatibility scan...", "Matching against job description...", "Evaluating consulting & strategic positioning...", "Generating recruiter-grade recommendations..."];
  return /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-10 backdrop-blur", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-hero grid place-items-center", children: /* @__PURE__ */ jsx(Brain, { className: "h-5 w-5 text-foreground animate-pulse" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "AI is analyzing your CV" }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "This usually takes 10–20 seconds" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-3", children: tasks.map((t, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-foreground/80", style: {
      animation: `pulseIn 1.6s ease ${i * 0.4}s both`
    }, children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 text-violet-400 animate-spin" }),
      " ",
      t
    ] }, t)) }),
    /* @__PURE__ */ jsx("style", { children: `@keyframes pulseIn { from { opacity: .25; transform: translateX(-4px); } to { opacity: 1; transform: translateX(0); } }` })
  ] });
}
function Results({
  data,
  fileName,
  onRestart
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Analysis report" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-bold font-display", children: fileName })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => downloadOptimizedCvDocx(data, fileName), className: "inline-flex items-center gap-2 rounded-full bg-gradient-hero text-primary-foreground px-5 py-2.5 text-sm font-medium shadow-elegant hover:opacity-95", children: [
          /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
          " Download Optimized CV (.docx)"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: onRestart, className: "inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2.5 text-sm hover:bg-muted", children: [
          /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" }),
          " Analyze another"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ScoresPanel, { scores: data.scores }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-8 backdrop-blur", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-violet-300", children: [
        /* @__PURE__ */ jsx(Quote, { className: "h-4 w-4" }),
        " Recruiter Simulation"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-lg leading-relaxed text-foreground", children: data.recruiterVerdict })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsx(Panel, { title: "Strengths", icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-400" }), accent: "emerald", children: data.strengths.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-emerald-300", children: s.title }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-foreground/80", children: s.detail })
      ] }, i)) }),
      /* @__PURE__ */ jsx(Panel, { title: "Weaknesses", icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-amber-400" }), accent: "amber", children: data.weaknesses.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-amber-300", children: s.title }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-foreground/80", children: s.detail })
      ] }, i)) })
    ] }),
    data.heatmap?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-4", children: "CV Heatmap" }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: data.heatmap.map((h, i) => /* @__PURE__ */ jsxs("div", { className: `rounded-xl border p-4 ${h.strength === "strong" ? "border-emerald-400/30 bg-emerald-400/5" : h.strength === "medium" ? "border-amber-400/30 bg-amber-400/5" : "border-red-400/30 bg-red-400/5"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: h.section }),
          /* @__PURE__ */ jsx("span", { className: `text-[10px] uppercase tracking-wider font-bold ${h.strength === "strong" ? "text-emerald-300" : h.strength === "medium" ? "text-amber-300" : "text-red-300"}`, children: h.strength })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs text-muted-foreground", children: h.note })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4", children: [
        /* @__PURE__ */ jsx(Briefcase, { className: "h-4 w-4" }),
        " Section-by-Section Analysis"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: data.sections.map((s, i) => /* @__PURE__ */ jsx(SectionCard, { s }, i)) })
    ] }),
    data.bulletOptimizer?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4", children: [
        /* @__PURE__ */ jsx(Wand2, { className: "h-4 w-4" }),
        " Bullet Point Optimizer"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: data.bulletOptimizer.map((b, i) => /* @__PURE__ */ jsx(BulletCard, { b }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4", children: [
        /* @__PURE__ */ jsx(Target, { className: "h-4 w-4" }),
        " Keyword Gap Analysis"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsx(KwBlock, { title: "Found in your CV", items: data.keywords.found, tone: "emerald" }),
        /* @__PURE__ */ jsx(KwBlock, { title: "Missing — add these", items: data.keywords.missing, tone: "rose" })
      ] }),
      data.keywords.suggestions?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-5 rounded-xl border border-violet-400/20 bg-violet-400/5 p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-violet-300", children: "Suggested phrases to add" }),
        /* @__PURE__ */ jsx("ul", { className: "mt-2 space-y-1.5 text-sm", children: data.keywords.suggestions.map((s, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-violet-300 mt-1 shrink-0" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-foreground/80", children: s })
        ] }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4", children: [
        /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" }),
        " AI Recommendations"
      ] }),
      /* @__PURE__ */ jsx("ol", { className: "space-y-3", children: data.recommendations.map((r, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3 rounded-xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsx("span", { className: "h-6 w-6 rounded-full bg-gradient-hero grid place-items-center text-xs font-bold shrink-0", children: i + 1 }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: r })
      ] }, i)) })
    ] })
  ] });
}
function ScoresPanel({
  scores
}) {
  const items = [{
    l: "ATS Compatibility",
    v: scores.atsCompatibility
  }, {
    l: "Consulting Readiness",
    v: scores.consultingReadiness
  }, {
    l: "Technical Skills",
    v: scores.technicalSkills
  }, {
    l: "Business Acumen",
    v: scores.businessAcumen
  }, {
    l: "Communication",
    v: scores.communicationStrength
  }, {
    l: "JD Match",
    v: scores.jdMatch
  }];
  const overall = Math.round(items.reduce((a, x) => a + x.v, 0) / items.length);
  return /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-border bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-[auto_1fr] gap-8 items-center", children: [
    /* @__PURE__ */ jsx(RadialScore, { value: overall }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-3", children: items.map((s) => /* @__PURE__ */ jsx(ScoreBar, { label: s.l, value: s.v }, s.l)) })
  ] }) });
}
function RadialScore({
  value
}) {
  const r = 56, c = 2 * Math.PI * r;
  const dash = value / 100 * c;
  return /* @__PURE__ */ jsxs("div", { className: "relative h-40 w-40 mx-auto", children: [
    /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 140 140", className: "h-full w-full -rotate-90", children: [
      /* @__PURE__ */ jsx("circle", { cx: "70", cy: "70", r, stroke: "oklch(0 0 0 / 0.08)", strokeWidth: "10", fill: "none" }),
      /* @__PURE__ */ jsx("circle", { cx: "70", cy: "70", r, stroke: "url(#g)", strokeWidth: "10", fill: "none", strokeDasharray: `${dash} ${c}`, strokeLinecap: "round" }),
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "g", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "oklch(0.7 0.22 285)" }),
        /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "oklch(0.55 0.22 275)" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold font-display", children: value }),
      /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Overall" })
    ] }) })
  ] });
}
function ScoreBar({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-card border border-border/60 p-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs", children: [
      /* @__PURE__ */ jsx("span", { className: "text-foreground/80", children: label }),
      /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
        value,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 h-1.5 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-hero transition-all", style: {
      width: `${value}%`
    } }) })
  ] });
}
function Panel({
  title,
  icon,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4", children: [
      icon,
      " ",
      title
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children })
  ] });
}
function SectionCard({
  s
}) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxs("button", { onClick: () => setOpen(!open), className: "w-full flex items-center justify-between p-4 text-left hover:bg-secondary/60", children: [
      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: s.name }),
      /* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 transition ${open ? "rotate-180" : ""}` })
    ] }),
    open && /* @__PURE__ */ jsxs("div", { className: "px-4 pb-5 grid md:grid-cols-2 gap-4 border-t border-border/60 pt-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-1", children: "Current" }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-secondary/60 p-3 text-xs text-foreground/80 italic", children: [
          '"',
          s.current,
          '"'
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 text-[10px] uppercase tracking-wider text-amber-300 mb-1", children: "AI Feedback" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-foreground/80", children: s.feedback })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-violet-300 mb-1", children: "Optimized Rewrite" }),
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-violet-400/20 bg-violet-400/5 p-3 text-xs text-foreground", children: s.rewrite })
      ] })
    ] })
  ] });
}
function BulletCard({
  b
}) {
  const tones = [{
    k: "strategic",
    label: "More Strategic"
  }, {
    k: "metrics",
    label: "Add Metrics"
  }, {
    k: "consulting",
    label: "Consulting Style"
  }, {
    k: "executive",
    label: "Executive Tone"
  }];
  const [active, setActive] = useState("strategic");
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-1", children: "Before" }),
    /* @__PURE__ */ jsxs("div", { className: "text-sm text-foreground/80 italic", children: [
      '"',
      b.before,
      '"'
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: tones.map((t) => /* @__PURE__ */ jsx("button", { onClick: () => setActive(t.k), className: `text-xs rounded-full px-3 py-1.5 transition ${active === t.k ? "bg-gradient-hero text-primary-foreground" : "bg-secondary text-foreground/80 hover:bg-muted"}`, children: t.label }, t.k)) }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-xl border border-violet-400/25 bg-violet-400/[0.06] p-4 text-sm text-foreground", children: b.variants[active] })
  ] });
}
function KwBlock({
  title,
  items,
  tone
}) {
  const color = tone === "emerald" ? "border-emerald-400/25 bg-emerald-400/5 text-emerald-200" : "border-rose-400/25 bg-rose-400/5 text-rose-200";
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-foreground/80 mb-3", children: title }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
      items.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground/70", children: "None detected." }),
      items.map((k, i) => /* @__PURE__ */ jsx("span", { className: `rounded-full border px-3 py-1 text-xs ${color}`, children: k }, i))
    ] })
  ] });
}
export {
  DemoFlow as component
};
