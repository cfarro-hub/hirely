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
  profileText: z.string().min(50).max(4e4),
  targetRole: z.string().max(200).optional().default(""),
  industry: z.string().max(100).optional().default("General")
});
const UrlInputSchema = z.object({
  url: z.string().min(1).max(500).refine((u) => /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\p{L}\p{N}_\-%.]+\/?/u.test(u), "Please enter a valid LinkedIn URL"),
  targetRole: z.string().max(200).optional().default(""),
  industry: z.string().max(100).optional().default("General")
});
const SYSTEM = `You are a senior LinkedIn brand strategist and recruiter who has reviewed
10,000+ LinkedIn profiles for top employers (McKinsey, BCG, Goldman Sachs, FAANG).
You optimize profiles for recruiter search visibility, SSI, and inbound opportunities.
Reply ONLY with valid JSON matching the schema. No prose.`;
function buildPrompt(profile, role, industry) {
  return `Analyze this LinkedIn profile for a ${role || "target role aligned with the candidate"} in ${industry}.

PROFILE CONTENT (copy/paste from LinkedIn):
"""
${profile}
"""

Return JSON with EXACTLY this shape:
{
  "scores": {
    "overall": number 0-100,
    "headlineImpact": number 0-100,
    "summaryQuality": number 0-100,
    "experienceDepth": number 0-100,
    "keywordSeo": number 0-100,
    "socialProof": number 0-100,
    "recruiterDiscoverability": number 0-100
  },
  "headline": {
    "current": string,
    "feedback": string,
    "rewrites": string[]   // 3 punchy alternatives, <= 220 chars each
  },
  "about": {
    "current": string,
    "feedback": string,
    "rewrite": string      // full optimized About section, 3-5 short paragraphs
  },
  "experienceTips": [{ "role": string, "issue": string, "rewrite": string }], // 3-5 items
  "keywords": {
    "found": string[],
    "missing": string[],   // recruiter search terms missing for the target role
    "suggested": string[]
  },
  "skillsToAdd": string[],  // EXACTLY 5 short skill labels only (e.g. "JavaScript", "SQL"). NO sentences, NO years of experience, NO descriptions.
  "contentStrategy": string[], // 4-6 post ideas tailored to the candidate
  "recruiterVerdict": string,  // 3-5 sentences, blunt
  "quickWins": string[]        // 5-7 immediate actions
}

RULES:
- Quote real content from the profile (no inventions).
- Be specific. Avoid generic LinkedIn advice.
- Headlines must be hook-driven, not job-title lists.
- skillsToAdd: EXACTLY 5 items, each ≤ 30 characters, plain skill names only (no descriptions, no years, no commentary).`;
}
const analyzeLinkedin_createServerFn_handler = createServerRpc({
  id: "46015bd4db1c2f46c938c7ad7b7c5776656cc1e6a3578e90dfb8438d27bd97ae",
  name: "analyzeLinkedin",
  filename: "src/lib/linkedin-analyzer.functions.ts"
}, (opts) => analyzeLinkedin.__executeServer(opts));
const analyzeLinkedin = createServerFn({
  method: "POST"
}).inputValidator((d) => InputSchema.parse(d)).handler(analyzeLinkedin_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI service not configured.");
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
        content: SYSTEM
      }, {
        role: "user",
        content: buildPrompt(data.profileText, data.targetRole, data.industry)
      }],
      response_format: {
        type: "json_object"
      }
    })
  });
  if (res.status === 429) throw new Error("Too many requests — try again shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted.");
  if (!res.ok) throw new Error("AI analysis failed.");
  const j = await res.json();
  const parsed = JSON.parse(j.choices?.[0]?.message?.content ?? "{}");
  return normalizeSkills(parsed);
});
async function fetchLinkedinPublic(url) {
  const fcKey = process.env.FIRECRAWL_API_KEY;
  if (fcKey) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${fcKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url,
          formats: ["markdown", "summary"],
          onlyMainContent: true,
          waitFor: 2500
        })
      });
      if (res.ok) {
        const j = await res.json();
        const md = j.data?.markdown ?? j.markdown ?? "";
        const sum = j.data?.summary ?? j.summary ?? "";
        const meta = j.data?.metadata ?? j.metadata ?? {};
        const parts = [meta.title && `Title: ${meta.title}`, meta.description && `Description: ${meta.description}`, sum && `Summary: ${sum}`, md && `Profile content:
${md.slice(0, 12e3)}`].filter(Boolean);
        if (parts.length) return parts.join("\n\n");
      } else {
        console.warn("[firecrawl] scrape failed", res.status, await res.text().catch(() => ""));
      }
    } catch (e) {
      console.warn("[firecrawl] error", e);
    }
  }
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9"
      },
      redirect: "follow"
    });
    if (!res.ok) return "";
    const html = await res.text();
    const grab = (re) => (html.match(re)?.[1] ?? "").trim();
    const title = grab(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
    const desc = grab(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
    const pageTitle = grab(/<title[^>]*>([^<]+)<\/title>/i);
    const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 8e3);
    const parts = [title && `Headline / Title: ${title}`, desc && `Snippet / About: ${desc}`, pageTitle && `Page title: ${pageTitle}`, `Public page text (truncated): ${stripped}`].filter(Boolean);
    return parts.join("\n\n");
  } catch {
    return "";
  }
}
const analyzeLinkedinUrl_createServerFn_handler = createServerRpc({
  id: "ab9a484502726f547fcaf20dafab25a294aed5db7afd72d22ea2658e2adf5b5c",
  name: "analyzeLinkedinUrl",
  filename: "src/lib/linkedin-analyzer.functions.ts"
}, (opts) => analyzeLinkedinUrl.__executeServer(opts));
const analyzeLinkedinUrl = createServerFn({
  method: "POST"
}).inputValidator((d) => UrlInputSchema.parse(d)).handler(analyzeLinkedinUrl_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI service not configured.");
  const scraped = await fetchLinkedinPublic(data.url);
  const username = data.url.match(/\/in\/([A-Za-z0-9_\-%.]+)/)?.[1] ?? "candidate";
  const profileText = `LinkedIn URL: ${data.url}
Username: ${username}

` + (scraped || "NOTE: LinkedIn blocked public scraping for this profile. Produce a recruiter-grade audit framework for this candidate based on the username and target role. Be explicit when assumptions are made and recommend what to add. Never fabricate specific achievements.");
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
        content: SYSTEM
      }, {
        role: "user",
        content: buildPrompt(profileText, data.targetRole, data.industry)
      }],
      response_format: {
        type: "json_object"
      }
    })
  });
  if (res.status === 429) throw new Error("Too many requests — try again shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted.");
  if (!res.ok) throw new Error("AI analysis failed.");
  const j = await res.json();
  const parsed = JSON.parse(j.choices?.[0]?.message?.content ?? "{}");
  return normalizeSkills(parsed);
});
function normalizeSkills(a) {
  const cleaned = (a.skillsToAdd ?? []).map((s) => String(s).split(/[—:\-(,]/)[0].trim()).filter((s) => s.length > 0 && s.length <= 30 && s.split(/\s+/).length <= 4).slice(0, 5);
  return {
    ...a,
    skillsToAdd: cleaned
  };
}
export {
  analyzeLinkedinUrl_createServerFn_handler,
  analyzeLinkedin_createServerFn_handler
};
