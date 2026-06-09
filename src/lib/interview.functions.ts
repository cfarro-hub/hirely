import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string().min(1).max(120),
  targetRole: z.string().min(1).max(200),
  targetCompany: z.string().max(200).optional().default(""),
  industry: z.string().max(100).optional().default("General"),
  yearsExperience: z.string().max(50).optional().default("0"),
  skills: z.string().max(2000).optional().default(""),
  interviewType: z.enum(["Behavioral", "Case", "Technical", "Mixed"]).default("Mixed"),
});

const QSystem = `You are a senior interviewer at top firms (McKinsey, BCG, Goldman Sachs, FAANG).
You design realistic interview questions tailored to the candidate's profile and target role.
Return ONLY valid JSON.`;

export const generateInterview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ProfileSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI service not configured.");
    const prompt = `Create a personalized mock interview for this candidate.

Candidate: ${data.name}
Target role: ${data.targetRole}
Target company: ${data.targetCompany || "Not specified"}
Industry: ${data.industry}
Years of experience: ${data.yearsExperience}
Key skills: ${data.skills}
Interview type: ${data.interviewType}

Return JSON:
{
  "questions": [
    {
      "id": number,
      "type": "Behavioral" | "Case" | "Technical" | "Motivation",
      "question": string,
      "whyAsked": string,              // why this question for THIS candidate
      "starHints": { "situation": string, "task": string, "action": string, "result": string },
      "evaluationCriteria": string[]   // 3-5 what the interviewer scores
    }
  ]   // exactly 6 questions, progressively harder, tailored to the role
}`;
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: QSystem },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) throw new Error("Failed to generate interview.");
    const j = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return JSON.parse(j.choices?.[0]?.message?.content ?? "{}") as InterviewPlan;
  });

const AnswerSchema = z.object({
  question: z.string().min(5).max(2000),
  answer: z.string().min(5).max(8000),
  role: z.string().max(200).optional().default(""),
});

export const scoreAnswer = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => AnswerSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI service not configured.");
    const prompt = `You are a senior interviewer scoring this answer for a ${data.role || "professional"} role.

QUESTION: ${data.question}
ANSWER: ${data.answer}

Return JSON:
{
  "scores": {
    "structure": number 0-100,
    "specificity": number 0-100,
    "impact": number 0-100,
    "communication": number 0-100,
    "overall": number 0-100
  },
  "strengths": string[],            // 2-4 items
  "improvements": string[],         // 2-4 concrete fixes
  "modelAnswer": string,            // a polished STAR rewrite
  "followUpQuestion": string        // what a real interviewer would probe next
}`;
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a tough but fair interviewer. JSON only." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) throw new Error("Failed to score answer.");
    const j = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return JSON.parse(j.choices?.[0]?.message?.content ?? "{}") as AnswerFeedback;
  });

export type InterviewQuestion = {
  id: number;
  type: "Behavioral" | "Case" | "Technical" | "Motivation";
  question: string;
  whyAsked: string;
  starHints: { situation: string; task: string; action: string; result: string };
  evaluationCriteria: string[];
};
export type InterviewPlan = { questions: InterviewQuestion[] };
export type AnswerFeedback = {
  scores: { structure: number; specificity: number; impact: number; communication: number; overall: number };
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
  followUpQuestion: string;
};

const CvExtractSchema = z.object({
  cvText: z.string().min(100).max(40000),
});

export type ExtractedProfile = {
  name: string;
  targetRole: string;
  industry: string;
  yearsExperience: number;
  skills: string;
};

export const extractInterviewProfile = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CvExtractSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI service not configured.");
    const prompt = `Extract a candidate profile from this CV. Be conservative — never invent data.

CV:
"""
${data.cvText.slice(0, 18000)}
"""

Return JSON with EXACTLY this shape:
{
  "name": string,            // full name; "" if unclear
  "targetRole": string,      // most likely next role they're targeting based on latest experience
  "industry": string,        // single industry label, e.g. "Consulting", "Technology", "Finance"
  "yearsExperience": number, // integer 0-50, estimated from work history
  "skills": string            // comma-separated list of top 8-12 skills
}`;
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You extract structured candidate profiles from CV text. JSON only." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (res.status === 429) throw new Error("Too many requests — try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted.");
    if (!res.ok) throw new Error("Failed to read CV.");
    const j = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = JSON.parse(j.choices?.[0]?.message?.content ?? "{}") as Partial<ExtractedProfile>;
    const years = Math.max(0, Math.min(50, Math.floor(Number(raw.yearsExperience ?? 0)) || 0));
    return {
      name: String(raw.name ?? "").slice(0, 120),
      targetRole: String(raw.targetRole ?? "").slice(0, 200),
      industry: String(raw.industry ?? "").slice(0, 100),
      yearsExperience: years,
      skills: String(raw.skills ?? "").slice(0, 2000),
    } as ExtractedProfile;
  });