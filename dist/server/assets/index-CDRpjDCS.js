import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, createContext, useContext } from "react";
import { Sparkles, ArrowRight, FileText, Target, Mic, LineChart, Zap, ShieldCheck, Linkedin, User, Upload, ClipboardList, Wand2, Trophy, Star, Check } from "lucide-react";
import { S as SignupDialog } from "./SignupDialog-BdF-S04v.js";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-select";
import "./n8n-webhook-C4tEkPnc.js";
const SignupCtx = createContext(() => {
});
const useOpenSignup = () => useContext(SignupCtx);
function Nav() {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 h-16 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("a", { href: "#top", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg bg-gradient-hero grid place-items-center text-primary-foreground", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx("span", { className: "font-display font-bold text-lg", children: "Hirely" })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-8 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx("a", { href: "#features", className: "hover:text-foreground transition", children: "Features" }),
      /* @__PURE__ */ jsx(Link, { to: "/linkedin", className: "hover:text-foreground transition", children: "LinkedIn" }),
      /* @__PURE__ */ jsx(Link, { to: "/interview", className: "hover:text-foreground transition", children: "Interview Coach" }),
      /* @__PURE__ */ jsx("a", { href: "#how", className: "hover:text-foreground transition", children: "How it works" }),
      /* @__PURE__ */ jsx("a", { href: "#pricing", className: "hover:text-foreground transition", children: "Pricing" }),
      /* @__PURE__ */ jsx("a", { href: "#faq", className: "hover:text-foreground transition", children: "FAQ" })
    ] }),
    /* @__PURE__ */ jsxs(StartFreeButton, { className: "inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition", children: [
      "Start Free ",
      /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })
    ] })
  ] }) });
}
function StartFreeButton({
  className,
  children
}) {
  const open = useOpenSignup();
  return /* @__PURE__ */ jsx("button", { type: "button", onClick: open, className, children });
}
function Hero() {
  return /* @__PURE__ */ jsxs("section", { id: "top", className: "relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-soft -z-10" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-20 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl -z-10" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-40 -right-32 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl -z-10" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
          "AI-Powered Career Platform"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-6 text-5xl md:text-6xl font-bold leading-[1.05]", children: [
          "Land better jobs with your",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "AI Career Copilot" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg text-muted-foreground max-w-xl", children: "Automatically tailor your CV to every job description, prepare for interviews with AI, and increase your chances of getting hired." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxs(StartFreeButton, { className: "inline-flex items-center gap-2 rounded-full bg-gradient-hero text-primary-foreground px-6 py-3 font-medium shadow-elegant hover:opacity-95 transition", children: [
            "Start Free ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] }),
          /* @__PURE__ */ jsx("a", { href: "#how", className: "inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 font-medium hover:bg-secondary transition", children: "See How It Works" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-12 grid grid-cols-3 gap-6 max-w-md", children: [{
          v: "92%",
          l: "ATS Match Rate"
        }, {
          v: "10k+",
          l: "Students Helped"
        }, {
          v: "3×",
          l: "More Interviews"
        }].map((s) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold font-display", children: s.v }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-1", children: s.l })
        ] }, s.l)) })
      ] }),
      /* @__PURE__ */ jsx(HeroVisual, {})
    ] })
  ] });
}
function HeroVisual() {
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative rounded-3xl bg-card border border-border shadow-elegant p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground", children: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm", children: "CV Optimization" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Product Analyst Internship" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1", children: "ATS 92%" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4", children: [{
        l: "Keyword Match",
        v: 95
      }, {
        l: "Recruiter Readability",
        v: 88
      }, {
        l: "Interview Readiness",
        v: 90
      }].map((b) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs mb-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: b.l }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            b.v,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-2 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-gradient-hero", style: {
          width: `${b.v}%`
        } }) })
      ] }, b.l)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl bg-surface border border-border p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold text-primary", children: [
          /* @__PURE__ */ jsx(Mic, { className: "h-3.5 w-3.5" }),
          " AI Interview Coach"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-foreground", children: '"Tell me about a time you solved a complex problem under pressure."' }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 flex gap-1.5", children: [...Array(20)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-1 rounded-full bg-primary/60", style: {
          height: `${8 + Math.sin(i) * 8 + 12}px`
        } }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute -top-4 -right-4 rounded-2xl bg-card border border-border shadow-card p-3 hidden md:block", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Recruiter Match" }),
      /* @__PURE__ */ jsx("div", { className: "font-bold text-sm", children: "Top 5%" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute -bottom-4 -left-4 rounded-2xl bg-card border border-border shadow-card p-3 hidden md:block", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Applications" }),
      /* @__PURE__ */ jsx("div", { className: "font-bold text-sm", children: "24 sent" })
    ] })
  ] });
}
function Problem() {
  const pains = [{
    t: "Generic CVs get rejected",
    d: "ATS systems automatically filter out resumes that don't match."
  }, {
    t: "Interview anxiety wins",
    d: "Fresh graduates rarely know what recruiters actually expect."
  }, {
    t: "Tailoring takes hours",
    d: "Manually rewriting your CV for every job is exhausting."
  }];
  return /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-7xl px-6 py-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-bold", children: "Applying to jobs shouldn't feel like guesswork." }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-muted-foreground", children: "Most candidates are filtered out before a human ever reads their CV." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 grid md:grid-cols-3 gap-6", children: pains.map((p) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-destructive/10 grid place-items-center text-destructive font-bold", children: "✕" }),
      /* @__PURE__ */ jsx("h3", { className: "mt-5 font-semibold text-lg", children: p.t }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: p.d })
    ] }, p.t)) })
  ] });
}
function Features() {
  const items = [{
    I: FileText,
    t: "AI CV Tailoring",
    d: "Upload once. AI adapts your resume for every job description."
  }, {
    I: Target,
    t: "ATS Optimization",
    d: "Detect missing keywords recruiters actually search for."
  }, {
    I: Mic,
    t: "AI Interview Coach",
    d: "Practice realistic interviews with voice-driven AI."
  }, {
    I: LineChart,
    t: "Job Match Analysis",
    d: "Instantly understand how well you fit a role."
  }, {
    I: Zap,
    t: "LinkedIn Optimization",
    d: "Improve your headline, summary, and recruiter visibility."
  }, {
    I: ShieldCheck,
    t: "Real-Time Feedback",
    d: "Receive recruiter-style suggestions as you write."
  }];
  return /* @__PURE__ */ jsx("section", { id: "features", className: "bg-surface border-y border-border", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 py-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-bold", children: "Everything you need to get hired" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-muted-foreground", children: "One platform built for students and young professionals entering the market." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5", children: items.map(({
      I,
      t,
      d
    }) => /* @__PURE__ */ jsxs("div", { className: "group rounded-2xl border border-border bg-card p-6 hover:shadow-card transition", children: [
      /* @__PURE__ */ jsx("div", { className: "h-11 w-11 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground", children: /* @__PURE__ */ jsx(I, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx("h3", { className: "mt-5 font-semibold text-lg", children: t }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: d })
    ] }, t)) })
  ] }) });
}
function HowItWorks() {
  const steps = [{
    I: Upload,
    t: "Upload your CV",
    d: "Import your existing resume in seconds."
  }, {
    I: ClipboardList,
    t: "Paste the job",
    d: "AI analyzes recruiter requirements instantly."
  }, {
    I: Wand2,
    t: "Optimize automatically",
    d: "Tailor your CV for maximum recruiter impact."
  }, {
    I: Trophy,
    t: "Ace interviews",
    d: "Practice with realistic AI simulations."
  }];
  return /* @__PURE__ */ jsxs("section", { id: "how", className: "mx-auto max-w-7xl px-6 py-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-bold", children: "How it works" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-muted-foreground", children: "From upload to offer in four simple steps." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5", children: steps.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-xs font-semibold text-primary", children: [
        "STEP ",
        i + 1
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center", children: /* @__PURE__ */ jsx(s.I, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx("h3", { className: "mt-4 font-semibold", children: s.t }),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: s.d })
    ] }, s.t)) })
  ] });
}
function Testimonials() {
  const tts = [{
    q: "I landed 3 interviews in one week after tailoring my CV with Hirely.",
    n: "Sara M.",
    r: "CS Graduate"
  }, {
    q: "The interview simulations made me way more confident on the real call.",
    n: "Daniel K.",
    r: "Marketing Intern"
  }, {
    q: "Finally a tool that explains why my CV wasn't getting responses.",
    n: "Aisha R.",
    r: "Finance Grad"
  }];
  return /* @__PURE__ */ jsx("section", { className: "bg-surface border-y border-border", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 py-24", children: [
    /* @__PURE__ */ jsx("div", { className: "text-center max-w-2xl mx-auto", children: /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-bold", children: "Helping students start their careers faster" }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 grid md:grid-cols-3 gap-5", children: tts.map((t) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex gap-0.5 text-primary", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 fill-current" }, i)) }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-foreground", children: [
        '"',
        t.q,
        '"'
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-9 w-9 rounded-full bg-gradient-hero" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: t.n }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: t.r })
        ] })
      ] })
    ] }, t.n)) })
  ] }) });
}
function Pricing() {
  const plans = [{
    name: "Free",
    price: "€0",
    per: "",
    desc: "Try the platform with no card.",
    cta: "Get Started",
    featured: false,
    href: "signup",
    features: ["3 CV optimizations", "1 AI interview", "Basic ATS analysis", "LinkedIn quick scan"]
  }, {
    name: "Starter",
    price: "€9.99",
    per: "/month",
    desc: "For active job seekers.",
    cta: "Choose Starter",
    featured: false,
    href: "https://buy.stripe.com/eVqaEYdeT6fpfGM8Y40VO00",
    features: ["5 CV optimizations", "3 AI interviews", "Full ATS report", "LinkedIn analyzer", ".docx export"]
  }, {
    name: "Pro",
    price: "€19.99",
    per: "/month",
    desc: "Best for serious applicants.",
    cta: "Choose Pro",
    featured: true,
    href: "https://buy.stripe.com/4gM5kE8YDgU31PWgqw0VO02",
    features: ["15 CV optimizations", "10 AI interviews", "Consulting & Finance modes", "JD matching", "Priority AI model"]
  }, {
    name: "Unlimited",
    price: "€99.99",
    per: "/month",
    desc: "For coaches & power users.",
    cta: "Go Unlimited",
    featured: false,
    href: "https://buy.stripe.com/14AaEY7UzeLVfGMeio0VO01",
    features: ["Unlimited CVs", "50 AI interviews", "All industries & modes", "LinkedIn rewrites", "Personal candidate profile"]
  }];
  return /* @__PURE__ */ jsxs("section", { id: "pricing", className: "mx-auto max-w-7xl px-6 py-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-bold", children: "Simple pricing" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-muted-foreground", children: "Start free. Upgrade as you go." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5", children: plans.map((p) => /* @__PURE__ */ jsxs("div", { className: `relative rounded-3xl p-8 border ${p.featured ? "bg-foreground text-background border-foreground shadow-elegant" : "bg-card border-border"}`, children: [
      p.featured && /* @__PURE__ */ jsx("div", { className: "absolute -top-3 left-8 rounded-full bg-gradient-hero text-primary-foreground text-xs font-semibold px-3 py-1", children: "MOST POPULAR" }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: p.name }),
      /* @__PURE__ */ jsx("p", { className: `mt-1 text-sm ${p.featured ? "text-background/70" : "text-muted-foreground"}`, children: p.desc }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-baseline gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-4xl font-bold font-display", children: p.price }),
        p.per && /* @__PURE__ */ jsx("span", { className: p.featured ? "text-background/70" : "text-muted-foreground", children: p.per })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "mt-8 space-y-3", children: p.features.map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
        /* @__PURE__ */ jsx(Check, { className: `h-4 w-4 mt-0.5 shrink-0 ${p.featured ? "text-primary-glow" : "text-primary"}` }),
        /* @__PURE__ */ jsx("span", { children: f })
      ] }, f)) }),
      p.href === "signup" ? /* @__PURE__ */ jsx(StartFreeButton, { className: `mt-8 block text-center w-full rounded-full py-3 font-medium transition ${p.featured ? "bg-background text-foreground hover:opacity-90" : "bg-foreground text-background hover:opacity-90"}`, children: p.cta }) : /* @__PURE__ */ jsx("a", { href: p.href, target: p.href.startsWith("http") ? "_blank" : void 0, rel: p.href.startsWith("http") ? "noopener noreferrer" : void 0, className: `mt-8 block text-center w-full rounded-full py-3 font-medium transition ${p.featured ? "bg-background text-foreground hover:opacity-90" : "bg-foreground text-background hover:opacity-90"}`, children: p.cta })
    ] }, p.name)) })
  ] });
}
function FAQ() {
  const qs = [{
    q: "Is this only for tech jobs?",
    a: "No — Hirely works across every industry, from finance to design."
  }, {
    q: "Can I upload my existing CV?",
    a: "Yes. Upload your PDF or DOCX and we'll structure it instantly."
  }, {
    q: "Is the interview coach realistic?",
    a: "Yes — powered by AI simulations trained on real recruiter questions."
  }, {
    q: "Does it work for internships?",
    a: "Absolutely. Most of our users are students applying for their first roles."
  }];
  return /* @__PURE__ */ jsx("section", { id: "faq", className: "bg-surface border-y border-border", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-6 py-24", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-bold text-center", children: "Frequently asked questions" }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 space-y-3", children: qs.map((q) => /* @__PURE__ */ jsxs("details", { className: "group rounded-2xl border border-border bg-card p-6 [&_summary::-webkit-details-marker]:hidden", children: [
      /* @__PURE__ */ jsxs("summary", { className: "flex justify-between items-center cursor-pointer font-semibold", children: [
        q.q,
        /* @__PURE__ */ jsx("span", { className: "text-primary text-xl transition group-open:rotate-45", children: "+" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground text-sm", children: q.a })
    ] }, q.q)) })
  ] }) });
}
function FinalCTA() {
  return /* @__PURE__ */ jsx("section", { id: "cta", className: "mx-auto max-w-7xl px-6 py-24", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-gradient-hero p-12 md:p-20 text-center shadow-elegant", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-bold text-primary-foreground", children: "Your dream job starts with a better application." }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-primary-foreground/90 max-w-xl mx-auto", children: "Join thousands of students using AI to land better opportunities." }),
      /* @__PURE__ */ jsxs(StartFreeButton, { className: "mt-8 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-7 py-3.5 font-medium hover:opacity-90 transition", children: [
        "Start Free Today ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-border", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row gap-4 items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "h-7 w-7 rounded-lg bg-gradient-hero grid place-items-center text-primary-foreground", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsx("span", { className: "font-display font-bold", children: "Hirely" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "© 2026 Hirely. All rights reserved." })
  ] }) });
}
function LandingPage() {
  const [signupOpen, setSignupOpen] = useState(false);
  return /* @__PURE__ */ jsx(SignupCtx.Provider, { value: () => setSignupOpen(true), children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(Problem, {}),
    /* @__PURE__ */ jsx(Features, {}),
    /* @__PURE__ */ jsx(NextSteps, {}),
    /* @__PURE__ */ jsx(HowItWorks, {}),
    /* @__PURE__ */ jsx(Testimonials, {}),
    /* @__PURE__ */ jsx(Pricing, {}),
    /* @__PURE__ */ jsx(FAQ, {}),
    /* @__PURE__ */ jsx(FinalCTA, {}),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(SignupDialog, { open: signupOpen, onOpenChange: setSignupOpen })
  ] }) });
}
function NextSteps() {
  const cards = [{
    I: Linkedin,
    t: "LinkedIn Analyzer",
    d: "Paste your LinkedIn profile and get an AI audit — headline rewrites, keyword gaps, and a content plan recruiters actually search for.",
    to: "/linkedin",
    cta: "Analyze my LinkedIn"
  }, {
    I: User,
    t: "AI Interview Coach",
    d: "Build your candidate profile, get a tailored 6-question interview, and receive instant STAR-based feedback with a model answer.",
    to: "/interview",
    cta: "Start mock interview"
  }];
  return /* @__PURE__ */ jsxs("section", { id: "next", className: "mx-auto max-w-7xl px-6 py-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
        " Next Steps"
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mt-4 text-4xl md:text-5xl font-bold", children: "Beyond the CV" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-muted-foreground", children: "Your CV is just step one. Hirely also rebuilds your LinkedIn and trains you for the interview." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 grid md:grid-cols-2 gap-5", children: cards.map((c) => /* @__PURE__ */ jsxs(Link, { to: c.to, className: "group relative rounded-3xl border border-border bg-card p-8 hover:shadow-elegant transition overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-2xl bg-gradient-hero grid place-items-center text-primary-foreground shadow-elegant", children: /* @__PURE__ */ jsx(c.I, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mt-6 text-2xl font-semibold", children: c.t }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: c.d }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary", children: [
          c.cta,
          " ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 group-hover:translate-x-0.5 transition" })
        ] })
      ] })
    ] }, c.t)) })
  ] });
}
export {
  LandingPage as component
};
