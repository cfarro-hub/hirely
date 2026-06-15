import { c as createServerRpc } from "./createServerRpc-DAKQrgTG.js";
import { a as createServerFn } from "./server-2xF5ZQvo.js";
import { z } from "zod";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
const InputSchema = z.object({
  cvText: z.string().min(50).max(5e4),
  jobDescription: z.string().max(2e4).optional().default(""),
  industry: z.string().max(100).optional().default("General"),
  mode: z.enum(["Consulting", "Finance", "Data Analyst", "Investment Banking", "General"]).default("General")
});
const SYSTEM_PROMPT = `You are a senior HR consultant and ATS expert who has reviewed 10,000+ CVs for top firms (McKinsey, BCG, Goldman Sachs, Big 4, FAANG).
You give brutally honest, detailed, actionable feedback — never generic.
You think like a recruiter scanning a CV in 7 seconds AND like a hiring partner deciding on a final round.
You respond ONLY in valid JSON matching the schema provided. No prose outside JSON.`;
function buildPrompt(cvText, jd, industry, mode) {
  return `Analyze the following CV for a ${mode} role in ${industry}.

${jd ? `JOB DESCRIPTION:
"""
${jd}
"""
` : "No job description provided — analyze for general consulting/finance/analytics readiness.\n"}
CV CONTENT:
"""
${cvText}
"""

Return a JSON object with this EXACT shape (no extra keys, no markdown):
{
  "scores": {
    "atsCompatibility": number 0-100,
    "consultingReadiness": number 0-100,
    "technicalSkills": number 0-100,
    "businessAcumen": number 0-100,
    "communicationStrength": number 0-100,
    "jdMatch": number 0-100
  },
  "strengths": [{ "title": string, "detail": string }],   // 4-6 items, specific to THIS CV
  "weaknesses": [{ "title": string, "detail": string }],  // 4-6 items, specific to THIS CV
  "sections": [                                            // analyze 3-4 sections found in the CV
    {
      "name": "Professional Summary" | "Experience" | "Education" | "Skills" | string,
      "current": string,        // quote actual content from CV (1-3 lines)
      "feedback": string,       // specific HR feedback
      "rewrite": string         // optimized version
    }
  ],
  "bulletOptimizer": [                                     // 3 real bullets from the CV
    {
      "before": string,         // actual bullet from CV
      "variants": {
        "strategic": string,
        "metrics": string,
        "consulting": string,
        "executive": string
      }
    }
  ],
  "keywords": {
    "found": string[],          // keywords from JD that ARE in CV
    "missing": string[],        // keywords from JD that are NOT in CV (or generic must-haves for the mode if no JD)
    "suggestions": string[]     // 3-5 phrases the user could add
  },
  "recommendations": string[],  // 5-7 concrete HR recommendations
  "recruiterVerdict": string,   // 3-5 sentences, how a senior recruiter would describe this candidate
  "heatmap": [                  // every CV section + sentiment
    { "section": string, "strength": "strong" | "medium" | "weak", "note": string }
  ],
  "optimizedCv": {              // the FINAL, ready-to-send CV — same person, sharpened wording
    "fullName": string,         // extracted from the CV
    "title": string,            // target role / professional title
    "contact": { "email": string, "phone": string, "location": string, "linkedin": string },
    "summary": string,          // 2-4 sentence professional summary, rewritten
    "experience": [             // ALL work experiences from the CV, in original order
      {
        "role": string,
        "company": string,
        "location": string,
        "startDate": string,
        "endDate": string,      // or "Present"
        "bullets": string[]     // 3-6 optimized bullets per role: action verb + quantified impact
      }
    ],
    "education": [
      { "degree": string, "institution": string, "location": string, "startDate": string, "endDate": string, "details": string }
    ],
    "skills": { "technical": string[], "tools": string[], "languages": string[], "soft": string[] },
    "certifications": string[],
    "projects": [ { "name": string, "description": string, "bullets": string[] } ]
  }
}

CRITICAL RULES:
- Quote real content from the CV. Never invent experiences.
- If something is missing, say so explicitly in feedback.
- Be specific: instead of "add metrics", say "quantify the Q3 reporting project — by how much did processing time drop?"
- Bullet rewrites must keep the candidate's actual experience, only sharpen the wording.
- "optimizedCv" MUST contain every real role, project, education entry from the CV — never drop any.
- Use the candidate's REAL name, dates, companies. If a field truly isn't in the CV, return an empty string or empty array.
- Bullets in optimizedCv.experience must be the polished final versions (action verb + scope + measurable impact when possible).`;
}
const analyzeCv_createServerFn_handler = createServerRpc({
  id: "232aca3569d755c72d73562ebea57919c26e8db879ab8fd07bb1c3a2713fac4a",
  name: "analyzeCv",
  filename: "src/lib/cv-analyzer.functions.ts"
}, (opts) => analyzeCv.__executeServer(opts));
const analyzeCv = createServerFn({
  method: "POST"
}).inputValidator((data) => InputSchema.parse(data)).handler(analyzeCv_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    throw new Error("AI service is not configured. Please contact support.");
  }
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{
        role: "system",
        content: SYSTEM_PROMPT
      }, {
        role: "user",
        content: buildPrompt(data.cvText, data.jobDescription, data.industry, data.mode)
      }],
      response_format: {
        type: "json_object"
      }
    })
  });
  if (res.status === 429) {
    throw new Error("Too many requests — please wait a moment and try again.");
  }
  if (res.status === 402) {
    throw new Error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
  }
  if (!res.ok) {
    const errText = await res.text();
    console.error("AI gateway error", res.status, errText);
    throw new Error("AI analysis failed. Please try again.");
  }
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content ?? "{}";
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("AI returned malformed output. Try again.");
  }
  return parsed;
});
export {
  analyzeCv_createServerFn_handler
};
