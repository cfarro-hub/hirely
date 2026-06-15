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
const ProfileSchema = z.object({
  name: z.string().min(1).max(120),
  targetRole: z.string().min(1).max(200),
  targetCompany: z.string().max(200).optional().default(""),
  industry: z.string().max(100).optional().default("General"),
  yearsExperience: z.string().max(50).optional().default("0"),
  skills: z.string().max(2e3).optional().default(""),
  interviewType: z.enum(["Behavioral", "Case", "Technical", "Mixed"]).default("Mixed")
});
const QSystem = `You are a senior interviewer at top firms (McKinsey, BCG, Goldman Sachs, FAANG).
You design realistic interview questions tailored to the candidate's profile and target role.
Return ONLY valid JSON.`;
const generateInterview_createServerFn_handler = createServerRpc({
  id: "e8cdf6f5171836eb010d48977c048ae5d6d72baec85e58b486fa7e08580c21d9",
  name: "generateInterview",
  filename: "src/lib/interview.functions.ts"
}, (opts) => generateInterview.__executeServer(opts));
const generateInterview = createServerFn({
  method: "POST"
}).inputValidator((d) => ProfileSchema.parse(d)).handler(generateInterview_createServerFn_handler, async ({
  data
}) => {
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
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{
        role: "system",
        content: QSystem
      }, {
        role: "user",
        content: prompt
      }],
      response_format: {
        type: "json_object"
      }
    })
  });
  if (!res.ok) throw new Error("Failed to generate interview.");
  const j = await res.json();
  return JSON.parse(j.choices?.[0]?.message?.content ?? "{}");
});
const AnswerSchema = z.object({
  question: z.string().min(5).max(2e3),
  answer: z.string().min(5).max(8e3),
  role: z.string().max(200).optional().default("")
});
const scoreAnswer_createServerFn_handler = createServerRpc({
  id: "3a8d015226e106abc6b1ce45d0e2071b9fa623cc1038ceffeb8c0afba31ab0bb",
  name: "scoreAnswer",
  filename: "src/lib/interview.functions.ts"
}, (opts) => scoreAnswer.__executeServer(opts));
const scoreAnswer = createServerFn({
  method: "POST"
}).inputValidator((d) => AnswerSchema.parse(d)).handler(scoreAnswer_createServerFn_handler, async ({
  data
}) => {
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
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{
        role: "system",
        content: "You are a tough but fair interviewer. JSON only."
      }, {
        role: "user",
        content: prompt
      }],
      response_format: {
        type: "json_object"
      }
    })
  });
  if (!res.ok) throw new Error("Failed to score answer.");
  const j = await res.json();
  return JSON.parse(j.choices?.[0]?.message?.content ?? "{}");
});
const CvExtractSchema = z.object({
  cvText: z.string().min(100).max(4e4)
});
const extractInterviewProfile_createServerFn_handler = createServerRpc({
  id: "41281cb850b0def0586d4099b568abd40edec818a15fb94fd6d1f7cdd19718a7",
  name: "extractInterviewProfile",
  filename: "src/lib/interview.functions.ts"
}, (opts) => extractInterviewProfile.__executeServer(opts));
const extractInterviewProfile = createServerFn({
  method: "POST"
}).inputValidator((d) => CvExtractSchema.parse(d)).handler(extractInterviewProfile_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI service not configured.");
  const prompt = `Extract a candidate profile from this CV. Be conservative — never invent data.

CV:
"""
${data.cvText.slice(0, 18e3)}
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
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{
        role: "system",
        content: "You extract structured candidate profiles from CV text. JSON only."
      }, {
        role: "user",
        content: prompt
      }],
      response_format: {
        type: "json_object"
      }
    })
  });
  if (res.status === 429) throw new Error("Too many requests — try again shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted.");
  if (!res.ok) throw new Error("Failed to read CV.");
  const j = await res.json();
  const raw = JSON.parse(j.choices?.[0]?.message?.content ?? "{}");
  const years = Math.max(0, Math.min(50, Math.floor(Number(raw.yearsExperience ?? 0)) || 0));
  return {
    name: String(raw.name ?? "").slice(0, 120),
    targetRole: String(raw.targetRole ?? "").slice(0, 200),
    industry: String(raw.industry ?? "").slice(0, 100),
    yearsExperience: years,
    skills: String(raw.skills ?? "").slice(0, 2e3)
  };
});
export {
  extractInterviewProfile_createServerFn_handler,
  generateInterview_createServerFn_handler,
  scoreAnswer_createServerFn_handler
};
