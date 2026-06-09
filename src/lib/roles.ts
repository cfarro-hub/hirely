// Curated list of common target roles + the industry/sector they belong to.
// Used by RoleSelect to auto-suggest roles and infer the industry.

export type RoleOption = { role: string; industry: string };
export type Confidence = "high" | "medium" | "low" | "none";

export const INDUSTRIES = [
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
  "General",
] as const;

export const ROLES: RoleOption[] = [
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
  { role: "Program Officer", industry: "Non-profit" },
];

// Lightweight keyword fallback when no exact list match.
const KEYWORD_INDUSTRY: { match: RegExp; industry: string }[] = [
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
  { match: /\b(ceo|cto|cfo|coo|founder|chief)\b/i, industry: "Executive" },
];

export function inferIndustryDetail(role: string): { industry: string; confidence: Confidence } {
  const r = role.trim();
  if (!r) return { industry: "", confidence: "none" };
  const exact = ROLES.find((o) => o.role.toLowerCase() === r.toLowerCase());
  if (exact) return { industry: exact.industry, confidence: "high" };
  const sub = ROLES.find((o) => r.toLowerCase().includes(o.role.toLowerCase()));
  if (sub) return { industry: sub.industry, confidence: "high" };
  for (const k of KEYWORD_INDUSTRY) if (k.match.test(r)) return { industry: k.industry, confidence: "medium" };
  return { industry: "", confidence: "low" };
}

export function inferIndustry(role: string): string {
  return inferIndustryDetail(role).industry;
}

export function searchRoles(query: string, limit = 8): RoleOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return ROLES.slice(0, limit);
  const starts = ROLES.filter((o) => o.role.toLowerCase().startsWith(q));
  const contains = ROLES.filter(
    (o) => !o.role.toLowerCase().startsWith(q) && o.role.toLowerCase().includes(q),
  );
  return [...starts, ...contains].slice(0, limit);
}