import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
const INDUSTRIES = [
  "Business",
  "Finance",
  "Investment Banking",
  "Consulting",
  "Data & Analytics",
  "Technology",
  "Cybersecurity",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Customer Success",
  "Human Resources",
  "Operations",
  "Legal",
  "Healthcare",
  "Engineering",
  "Architecture",
  "Construction",
  "Real Estate",
  "Media",
  "Education",
  "Executive",
  "Hospitality",
  "Manufacturing",
  "Energy",
  "Non-profit",
  "Government",
  "General"
];
const ROLES = [
  // Finance / Business
  { role: "Accountant", industry: "Business" },
  { role: "Auditor", industry: "Finance" },
  { role: "Financial Analyst", industry: "Finance" },
  { role: "Investment Banker", industry: "Investment Banking" },
  { role: "Private Equity Analyst", industry: "Finance" },
  { role: "Venture Capital Analyst", industry: "Finance" },
  { role: "Risk Analyst", industry: "Finance" },
  { role: "Tax Advisor", industry: "Finance" },
  // Consulting
  { role: "Management Consultant", industry: "Consulting" },
  { role: "Strategy Consultant", industry: "Consulting" },
  { role: "Business Analyst", industry: "Consulting" },
  // Data
  { role: "Data Analyst", industry: "Data & Analytics" },
  { role: "Data Scientist", industry: "Data & Analytics" },
  { role: "Data Engineer", industry: "Data & Analytics" },
  { role: "Machine Learning Engineer", industry: "Technology" },
  { role: "AI Engineer", industry: "Technology" },
  // Tech
  { role: "Software Engineer", industry: "Technology" },
  { role: "Frontend Engineer", industry: "Technology" },
  { role: "Backend Engineer", industry: "Technology" },
  { role: "Full Stack Developer", industry: "Technology" },
  { role: "Mobile Developer", industry: "Technology" },
  { role: "DevOps Engineer", industry: "Technology" },
  { role: "Site Reliability Engineer", industry: "Technology" },
  { role: "Cloud Architect", industry: "Technology" },
  { role: "Security Engineer", industry: "Cybersecurity" },
  // Product / Design
  { role: "Product Manager", industry: "Product" },
  { role: "Technical Product Manager", industry: "Product" },
  { role: "Product Designer", industry: "Design" },
  { role: "UX Designer", industry: "Design" },
  { role: "UI Designer", industry: "Design" },
  { role: "Graphic Designer", industry: "Design" },
  // Marketing
  { role: "Marketing Manager", industry: "Marketing" },
  { role: "Growth Marketer", industry: "Marketing" },
  { role: "Brand Manager", industry: "Marketing" },
  { role: "Content Marketer", industry: "Marketing" },
  { role: "SEO Specialist", industry: "Marketing" },
  { role: "Performance Marketer", industry: "Marketing" },
  // Sales / CS
  { role: "Sales Representative", industry: "Sales" },
  { role: "Account Executive", industry: "Sales" },
  { role: "Sales Manager", industry: "Sales" },
  { role: "Customer Success Manager", industry: "Customer Success" },
  // HR / Ops
  { role: "HR Manager", industry: "Human Resources" },
  { role: "Recruiter", industry: "Human Resources" },
  { role: "Talent Acquisition Specialist", industry: "Human Resources" },
  { role: "Operations Manager", industry: "Operations" },
  { role: "Project Manager", industry: "Operations" },
  { role: "Program Manager", industry: "Operations" },
  { role: "Supply Chain Manager", industry: "Operations" },
  // Legal
  { role: "Lawyer", industry: "Legal" },
  { role: "Paralegal", industry: "Legal" },
  { role: "Compliance Officer", industry: "Legal" },
  // Healthcare
  { role: "Doctor", industry: "Healthcare" },
  { role: "Nurse", industry: "Healthcare" },
  { role: "Pharmacist", industry: "Healthcare" },
  { role: "Medical Researcher", industry: "Healthcare" },
  // Engineering (non-software)
  { role: "Mechanical Engineer", industry: "Engineering" },
  { role: "Civil Engineer", industry: "Engineering" },
  { role: "Electrical Engineer", industry: "Engineering" },
  { role: "Chemical Engineer", industry: "Engineering" },
  { role: "Industrial Engineer", industry: "Engineering" },
  // Architecture / Real Estate
  { role: "Architect", industry: "Architecture" },
  { role: "Real Estate Agent", industry: "Real Estate" },
  { role: "Interior Designer", industry: "Architecture" },
  { role: "Construction Manager", industry: "Construction" },
  { role: "Site Engineer", industry: "Construction" },
  { role: "Quantity Surveyor", industry: "Construction" },
  // Media / Education
  { role: "Journalist", industry: "Media" },
  { role: "Content Writer", industry: "Media" },
  { role: "Copywriter", industry: "Media" },
  { role: "Teacher", industry: "Education" },
  { role: "Professor", industry: "Education" },
  // Executive
  { role: "CEO", industry: "Executive" },
  { role: "CTO", industry: "Executive" },
  { role: "CFO", industry: "Executive" },
  { role: "COO", industry: "Executive" },
  // Hospitality / Manufacturing / Energy / Public
  { role: "Hotel Manager", industry: "Hospitality" },
  { role: "Chef", industry: "Hospitality" },
  { role: "Production Manager", industry: "Manufacturing" },
  { role: "Quality Engineer", industry: "Manufacturing" },
  { role: "Energy Analyst", industry: "Energy" },
  { role: "Renewable Energy Engineer", industry: "Energy" },
  { role: "Policy Analyst", industry: "Government" },
  { role: "Program Officer", industry: "Non-profit" }
];
const KEYWORD_INDUSTRY = [
  { match: /\b(accountant|bookkeep|controller)\b/i, industry: "Business" },
  { match: /\b(audit|tax)\b/i, industry: "Finance" },
  { match: /\b(invest(ment)?\s*bank|m&a|ib analyst)\b/i, industry: "Investment Banking" },
  { match: /\b(private equity|pe analyst|hedge fund|venture capital|vc)\b/i, industry: "Finance" },
  { match: /\b(financ|treasur|wealth|fp&a)\b/i, industry: "Finance" },
  { match: /\b(consult|strategist)\b/i, industry: "Consulting" },
  { match: /\b(data scien|machine learn|ml |ai engineer|nlp)\b/i, industry: "Data & Analytics" },
  { match: /\b(data (analyst|engineer)|analytics)\b/i, industry: "Data & Analytics" },
  { match: /\b(software|frontend|backend|fullstack|full[\s-]stack|developer|programmer|swe|sde|devops|sre|cloud)\b/i, industry: "Technology" },
  { match: /\b(cyber|security engineer|infosec|appsec)\b/i, industry: "Cybersecurity" },
  { match: /\b(product manager|pm |product owner)\b/i, industry: "Product" },
  { match: /\b(ux|ui|product designer|graphic designer|design)\b/i, industry: "Design" },
  { match: /\b(market|growth|brand|seo|copywriter|content)\b/i, industry: "Marketing" },
  { match: /\b(sales|account executive|bdr|sdr)\b/i, industry: "Sales" },
  { match: /\b(customer success|csm)\b/i, industry: "Customer Success" },
  { match: /\b(recruit|talent|human resources|hr )\b/i, industry: "Human Resources" },
  { match: /\b(operations|project manager|program manager|supply chain|logistics)\b/i, industry: "Operations" },
  { match: /\b(lawyer|attorney|paralegal|legal|compliance)\b/i, industry: "Legal" },
  { match: /\b(doctor|nurse|pharmac|medical|clinical|surgeon)\b/i, industry: "Healthcare" },
  { match: /\b(mechanical|civil|electrical|chemical|industrial)\s*engineer/i, industry: "Engineering" },
  { match: /\barchitect\b/i, industry: "Architecture" },
  { match: /\b(construction|site engineer|quantity surveyor|civil works)\b/i, industry: "Construction" },
  { match: /\b(hotel|hospitality|chef|restaurant|f&b)\b/i, industry: "Hospitality" },
  { match: /\b(manufactur|production|quality engineer|plant manager)\b/i, industry: "Manufacturing" },
  { match: /\b(energy|renewable|solar|wind|oil and gas|utilities)\b/i, industry: "Energy" },
  { match: /\b(policy|government|public sector|civil service)\b/i, industry: "Government" },
  { match: /\b(non[- ]?profit|ngo|charity)\b/i, industry: "Non-profit" },
  { match: /\b(real estate|broker)\b/i, industry: "Real Estate" },
  { match: /\b(journalist|editor|reporter|writer)\b/i, industry: "Media" },
  { match: /\b(teacher|professor|tutor|lecturer|educator)\b/i, industry: "Education" },
  { match: /\b(ceo|cto|cfo|coo|founder|chief)\b/i, industry: "Executive" }
];
function inferIndustryDetail(role) {
  const r = role.trim();
  if (!r) return { industry: "", confidence: "none" };
  const exact = ROLES.find((o) => o.role.toLowerCase() === r.toLowerCase());
  if (exact) return { industry: exact.industry, confidence: "high" };
  const sub = ROLES.find((o) => r.toLowerCase().includes(o.role.toLowerCase()));
  if (sub) return { industry: sub.industry, confidence: "high" };
  for (const k of KEYWORD_INDUSTRY) if (k.match.test(r)) return { industry: k.industry, confidence: "medium" };
  return { industry: "", confidence: "low" };
}
function inferIndustry(role) {
  return inferIndustryDetail(role).industry;
}
function searchRoles(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return ROLES.slice(0, limit);
  const starts = ROLES.filter((o) => o.role.toLowerCase().startsWith(q));
  const contains = ROLES.filter(
    (o) => !o.role.toLowerCase().startsWith(q) && o.role.toLowerCase().includes(q)
  );
  return [...starts, ...contains].slice(0, limit);
}
function RoleSelect({ value, onChange, placeholder, className }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlight, setHighlight] = useState(0);
  const boxRef = useRef(null);
  useEffect(() => setQuery(value), [value]);
  useEffect(() => {
    function onDocClick(e) {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  const results = searchRoles(query, 8);
  const pick = (r) => {
    onChange(r.role, r.industry);
    setQuery(r.role);
    setOpen(false);
  };
  const handleType = (v) => {
    setQuery(v);
    setOpen(true);
    setHighlight(0);
    onChange(v, inferIndustry(v));
  };
  return /* @__PURE__ */ jsxs("div", { ref: boxRef, className: `relative ${className ?? ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: query,
          onChange: (e) => handleType(e.target.value),
          onFocus: () => setOpen(true),
          onKeyDown: (e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setHighlight((h) => Math.min(h + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, 0));
            } else if (e.key === "Enter" && open && results[highlight]) {
              e.preventDefault();
              pick(results[highlight]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          },
          placeholder: placeholder ?? "Search or type a role…",
          className: "w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-400"
        }
      )
    ] }),
    open && results.length > 0 && /* @__PURE__ */ jsxs("div", { className: "absolute z-30 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-border bg-popover shadow-elegant", children: [
      results.map((r, i) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onMouseEnter: () => setHighlight(i),
          onMouseDown: (e) => {
            e.preventDefault();
            pick(r);
          },
          className: `w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm ${i === highlight ? "bg-secondary" : "hover:bg-secondary"}`,
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: r.role }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: r.industry })
          ]
        },
        r.role
      )),
      query.trim() && !results.some((r) => r.role.toLowerCase() === query.trim().toLowerCase()) && /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 text-[11px] text-muted-foreground border-t border-border", children: [
        'Press Enter to use "',
        /* @__PURE__ */ jsx("span", { className: "text-foreground", children: query.trim() }),
        '"'
      ] })
    ] })
  ] });
}
function IndustryField({ role, value, onChange, className }) {
  const auto = inferIndustryDetail(role);
  const hasRole = role.trim().length > 0;
  const matchesAuto = !!auto.industry && value.trim().toLowerCase() === auto.industry.toLowerCase();
  const overridden = hasRole && !!auto.industry && !matchesAuto && value.trim().length > 0;
  const state = !hasRole ? "none" : overridden ? "manual" : auto.confidence;
  const tone = {
    high: "bg-emerald-500/15 text-emerald-300 border border-emerald-400/25",
    medium: "bg-amber-500/15 text-amber-300 border border-amber-400/25",
    low: "bg-rose-500/15 text-rose-300 border border-rose-400/25",
    manual: "bg-violet-500/15 text-violet-300 border border-violet-400/25",
    none: "bg-secondary text-muted-foreground border border-border"
  };
  const label = {
    high: "Auto · High confidence",
    medium: "Auto · Medium confidence",
    low: "Needs review",
    manual: "Manual override",
    none: "Auto"
  };
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsxs("label", { className: "text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2", children: [
      "Industry",
      /* @__PURE__ */ jsx("span", { className: `text-[10px] rounded-full px-2 py-0.5 ${tone[state]}`, children: label[state] })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        list: "hirely-industries",
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder: hasRole ? "Set automatically from role — editable" : "e.g. Consulting",
        className: "mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-violet-400"
      }
    ),
    /* @__PURE__ */ jsx("datalist", { id: "hirely-industries", children: INDUSTRIES.map((i) => /* @__PURE__ */ jsx("option", { value: i }, i)) }),
    hasRole && state === "low" && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[11px] text-amber-300", children: "Couldn't infer the industry confidently — pick one from the list or type your own." }),
    hasRole && state === "medium" && auto.industry && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-[11px] text-muted-foreground", children: [
      'Suggested from "',
      role,
      `" — double-check it's right.`
    ] }),
    hasRole && state === "high" && auto.industry && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-[11px] text-muted-foreground", children: [
      'Derived from "',
      role,
      '".'
    ] }),
    overridden && auto.industry && /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => onChange(auto.industry),
        className: "mt-1 text-[11px] text-violet-300 hover:underline",
        children: [
          "Reset to suggested: ",
          auto.industry
        ]
      }
    )
  ] });
}
export {
  IndustryField as I,
  RoleSelect as R
};
