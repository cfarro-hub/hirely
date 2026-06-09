import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, createContext, useContext } from "react";
import {
  Sparkles, FileText, Target, Mic, ArrowRight, Check, Upload,
  ClipboardList, Wand2, Trophy, Star, ShieldCheck, Zap, LineChart, Linkedin, User,
} from "lucide-react";
import { SignupDialog } from "@/components/SignupDialog";

const SignupCtx = createContext<() => void>(() => {});
const useOpenSignup = () => useContext(SignupCtx);

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Hirely — Your AI Career Copilot" },
      { name: "description", content: "Tailor your CV, ace interviews, and land jobs faster with Hirely." },
      { property: "og:title", content: "Hirely — Your AI Career Copilot" },
      { property: "og:description", content: "Tailor your CV, ace interviews, and land jobs faster." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-hero grid place-items-center text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display font-bold text-lg">Hirely</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <Link to="/linkedin" className="hover:text-foreground transition">LinkedIn</Link>
          <Link to="/interview" className="hover:text-foreground transition">Interview Coach</Link>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
        </nav>
        <StartFreeButton className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition">
          Start Free <ArrowRight className="h-3.5 w-3.5" />
        </StartFreeButton>
      </div>
    </header>
  );
}

function StartFreeButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const open = useOpenSignup();
  return <button type="button" onClick={open} className={className}>{children}</button>;
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-soft -z-10" />
      <div className="absolute top-20 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl -z-10" />
      <div className="absolute top-40 -right-32 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Career Platform
          </div>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-[1.05]">
            Land better jobs with your{" "}
            <span className="text-gradient">AI Career Copilot</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Automatically tailor your CV to every job description, prepare for interviews with AI, and increase your chances of getting hired.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <StartFreeButton className="inline-flex items-center gap-2 rounded-full bg-gradient-hero text-primary-foreground px-6 py-3 font-medium shadow-elegant hover:opacity-95 transition">
              Start Free <ArrowRight className="h-4 w-4" />
            </StartFreeButton>
            <a href="#how" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 font-medium hover:bg-secondary transition">
              See How It Works
            </a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            {[
              { v: "92%", l: "ATS Match Rate" },
              { v: "10k+", l: "Students Helped" },
              { v: "3×", l: "More Interviews" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold font-display">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <div className="relative rounded-3xl bg-card border border-border shadow-elegant p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">CV Optimization</div>
              <div className="text-xs text-muted-foreground">Product Analyst Internship</div>
            </div>
          </div>
          <div className="rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1">ATS 92%</div>
        </div>

        <div className="mt-6 space-y-4">
          {[
            { l: "Keyword Match", v: 95 },
            { l: "Recruiter Readability", v: 88 },
            { l: "Interview Readiness", v: 90 },
          ].map((b) => (
            <div key={b.l}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">{b.l}</span>
                <span className="font-semibold">{b.v}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-gradient-hero" style={{ width: `${b.v}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-surface border border-border p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Mic className="h-3.5 w-3.5" /> AI Interview Coach
          </div>
          <p className="mt-2 text-sm text-foreground">"Tell me about a time you solved a complex problem under pressure."</p>
          <div className="mt-3 flex gap-1.5">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-1 rounded-full bg-primary/60" style={{ height: `${8 + Math.sin(i) * 8 + 12}px` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -top-4 -right-4 rounded-2xl bg-card border border-border shadow-card p-3 hidden md:block">
        <div className="text-xs text-muted-foreground">Recruiter Match</div>
        <div className="font-bold text-sm">Top 5%</div>
      </div>
      <div className="absolute -bottom-4 -left-4 rounded-2xl bg-card border border-border shadow-card p-3 hidden md:block">
        <div className="text-xs text-muted-foreground">Applications</div>
        <div className="font-bold text-sm">24 sent</div>
      </div>
    </div>
  );
}

function Problem() {
  const pains = [
    { t: "Generic CVs get rejected", d: "ATS systems automatically filter out resumes that don't match." },
    { t: "Interview anxiety wins", d: "Fresh graduates rarely know what recruiters actually expect." },
    { t: "Tailoring takes hours", d: "Manually rewriting your CV for every job is exhausting." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold">Applying to jobs shouldn't feel like guesswork.</h2>
        <p className="mt-4 text-lg text-muted-foreground">Most candidates are filtered out before a human ever reads their CV.</p>
      </div>
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {pains.map((p) => (
          <div key={p.t} className="rounded-2xl border border-border bg-card p-6">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 grid place-items-center text-destructive font-bold">✕</div>
            <h3 className="mt-5 font-semibold text-lg">{p.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { I: FileText, t: "AI CV Tailoring", d: "Upload once. AI adapts your resume for every job description." },
    { I: Target, t: "ATS Optimization", d: "Detect missing keywords recruiters actually search for." },
    { I: Mic, t: "AI Interview Coach", d: "Practice realistic interviews with voice-driven AI." },
    { I: LineChart, t: "Job Match Analysis", d: "Instantly understand how well you fit a role." },
    { I: Zap, t: "LinkedIn Optimization", d: "Improve your headline, summary, and recruiter visibility." },
    { I: ShieldCheck, t: "Real-Time Feedback", d: "Receive recruiter-style suggestions as you write." },
  ];
  return (
    <section id="features" className="bg-surface border-y border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">Everything you need to get hired</h2>
          <p className="mt-4 text-lg text-muted-foreground">One platform built for students and young professionals entering the market.</p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(({ I, t, d }) => (
            <div key={t} className="group rounded-2xl border border-border bg-card p-6 hover:shadow-card transition">
              <div className="h-11 w-11 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground">
                <I className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-semibold text-lg">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { I: Upload, t: "Upload your CV", d: "Import your existing resume in seconds." },
    { I: ClipboardList, t: "Paste the job", d: "AI analyzes recruiter requirements instantly." },
    { I: Wand2, t: "Optimize automatically", d: "Tailor your CV for maximum recruiter impact." },
    { I: Trophy, t: "Ace interviews", d: "Practice with realistic AI simulations." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold">How it works</h2>
        <p className="mt-4 text-lg text-muted-foreground">From upload to offer in four simple steps.</p>
      </div>
      <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((s, i) => (
          <div key={s.t} className="relative rounded-2xl border border-border bg-card p-6">
            <div className="text-xs font-semibold text-primary">STEP {i + 1}</div>
            <div className="mt-3 h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <s.I className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{s.t}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const tts = [
    { q: "I landed 3 interviews in one week after tailoring my CV with Hirely.", n: "Sara M.", r: "CS Graduate" },
    { q: "The interview simulations made me way more confident on the real call.", n: "Daniel K.", r: "Marketing Intern" },
    { q: "Finally a tool that explains why my CV wasn't getting responses.", n: "Aisha R.", r: "Finance Grad" },
  ];
  return (
    <section className="bg-surface border-y border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">Helping students start their careers faster</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {tts.map((t) => (
            <div key={t.n} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-0.5 text-primary">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-foreground">"{t.q}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-hero" />
                <div>
                  <div className="text-sm font-semibold">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free", price: "€0", per: "", desc: "Try the platform with no card.", cta: "Get Started", featured: false, href: "signup",
      features: ["3 CV optimizations", "1 AI interview", "Basic ATS analysis", "LinkedIn quick scan"],
    },
    {
      name: "Starter", price: "€9.99", per: "/month", desc: "For active job seekers.", cta: "Choose Starter", featured: false,
      href: "https://buy.stripe.com/eVqaEYdeT6fpfGM8Y40VO00",
      features: ["5 CV optimizations", "3 AI interviews", "Full ATS report", "LinkedIn analyzer", ".docx export"],
    },
    {
      name: "Pro", price: "€19.99", per: "/month", desc: "Best for serious applicants.", cta: "Choose Pro", featured: true,
      href: "https://buy.stripe.com/4gM5kE8YDgU31PWgqw0VO02",
      features: ["15 CV optimizations", "10 AI interviews", "Consulting & Finance modes", "JD matching", "Priority AI model"],
    },
    {
      name: "Unlimited", price: "€99.99", per: "/month", desc: "For coaches & power users.", cta: "Go Unlimited", featured: false,
      href: "https://buy.stripe.com/14AaEY7UzeLVfGMeio0VO01",
      features: ["Unlimited CVs", "50 AI interviews", "All industries & modes", "LinkedIn rewrites", "Personal candidate profile"],
    },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold">Simple pricing</h2>
        <p className="mt-4 text-lg text-muted-foreground">Start free. Upgrade as you go.</p>
      </div>
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((p) => (
          <div key={p.name} className={`relative rounded-3xl p-8 border ${p.featured ? "bg-foreground text-background border-foreground shadow-elegant" : "bg-card border-border"}`}>
            {p.featured && (
              <div className="absolute -top-3 left-8 rounded-full bg-gradient-hero text-primary-foreground text-xs font-semibold px-3 py-1">MOST POPULAR</div>
            )}
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p className={`mt-1 text-sm ${p.featured ? "text-background/70" : "text-muted-foreground"}`}>{p.desc}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold font-display">{p.price}</span>
              {p.per && <span className={p.featured ? "text-background/70" : "text-muted-foreground"}>{p.per}</span>}
            </div>
            <ul className="mt-8 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className={`h-4 w-4 mt-0.5 shrink-0 ${p.featured ? "text-primary-glow" : "text-primary"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {p.href === "signup" ? (
              <StartFreeButton
                className={`mt-8 block text-center w-full rounded-full py-3 font-medium transition ${p.featured ? "bg-background text-foreground hover:opacity-90" : "bg-foreground text-background hover:opacity-90"}`}
              >
                {p.cta}
              </StartFreeButton>
            ) : (
              <a
                href={p.href}
                target={p.href.startsWith("http") ? "_blank" : undefined}
                rel={p.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`mt-8 block text-center w-full rounded-full py-3 font-medium transition ${p.featured ? "bg-background text-foreground hover:opacity-90" : "bg-foreground text-background hover:opacity-90"}`}
              >
                {p.cta}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const qs = [
    { q: "Is this only for tech jobs?", a: "No — Hirely works across every industry, from finance to design." },
    { q: "Can I upload my existing CV?", a: "Yes. Upload your PDF or DOCX and we'll structure it instantly." },
    { q: "Is the interview coach realistic?", a: "Yes — powered by AI simulations trained on real recruiter questions." },
    { q: "Does it work for internships?", a: "Absolutely. Most of our users are students applying for their first roles." },
  ];
  return (
    <section id="faq" className="bg-surface border-y border-border">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-bold text-center">Frequently asked questions</h2>
        <div className="mt-12 space-y-3">
          {qs.map((q) => (
            <details key={q.q} className="group rounded-2xl border border-border bg-card p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex justify-between items-center cursor-pointer font-semibold">
                {q.q}
                <span className="text-primary text-xl transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground text-sm">{q.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="cta" className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 md:p-20 text-center shadow-elegant">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">Your dream job starts with a better application.</h2>
          <p className="mt-4 text-lg text-primary-foreground/90 max-w-xl mx-auto">Join thousands of students using AI to land better opportunities.</p>
          <StartFreeButton className="mt-8 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-7 py-3.5 font-medium hover:opacity-90 transition">
            Start Free Today <ArrowRight className="h-4 w-4" />
          </StartFreeButton>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-hero grid place-items-center text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="font-display font-bold">Hirely</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 Hirely. All rights reserved.</p>
      </div>
    </footer>
  );
}

function LandingPage() {
  const [signupOpen, setSignupOpen] = useState(false);
  return (
    <SignupCtx.Provider value={() => setSignupOpen(true)}>
      <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Problem />
      <Features />
      <NextSteps />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
      <SignupDialog open={signupOpen} onOpenChange={setSignupOpen} />
      </div>
    </SignupCtx.Provider>
  );
}

function NextSteps() {
  const cards = [
    {
      I: Linkedin, t: "LinkedIn Analyzer",
      d: "Paste your LinkedIn profile and get an AI audit — headline rewrites, keyword gaps, and a content plan recruiters actually search for.",
      to: "/linkedin" as const, cta: "Analyze my LinkedIn",
    },
    {
      I: User, t: "AI Interview Coach",
      d: "Build your candidate profile, get a tailored 6-question interview, and receive instant STAR-based feedback with a model answer.",
      to: "/interview" as const, cta: "Start mock interview",
    },
  ];
  return (
    <section id="next" className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Next Steps
        </div>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold">Beyond the CV</h2>
        <p className="mt-4 text-lg text-muted-foreground">Your CV is just step one. Hirely also rebuilds your LinkedIn and trains you for the interview.</p>
      </div>
      <div className="mt-12 grid md:grid-cols-2 gap-5">
        {cards.map((c) => (
          <Link key={c.t} to={c.to} className="group relative rounded-3xl border border-border bg-card p-8 hover:shadow-elegant transition overflow-hidden">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition" />
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-gradient-hero grid place-items-center text-primary-foreground shadow-elegant">
                <c.I className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">{c.t}</h3>
              <p className="mt-2 text-muted-foreground">{c.d}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                {c.cta} <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}