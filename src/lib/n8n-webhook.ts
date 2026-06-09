// Shared n8n webhook client. All key user actions POST here.
export const N8N_WEBHOOK_URL =
  "https://chloe-gf-19.app.n8n.cloud/webhook/5b8600e2-8295-4804-a0c1-529aaabba92d";

export type N8nActionType =
  | "signup"
  | "cv_analysis"
  | "referral"
  | "interview_start"
  | "interview_complete"
  | "linkedin_import"
  | "linkedin_job_import"
  | "linkedin_paste";

export interface N8nPayload {
  userId?: string | null;
  email?: string | null;
  fullName?: string | null;
  actionType: N8nActionType;
  plan?: string | null;
  timestamp?: string;
  data?: unknown;
}

function readUser(): { email?: string; fullName?: string } {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("hirely.user");
    if (!raw) return {};
    const p = JSON.parse(raw) as { email?: string; fullName?: string };
    return { email: p.email, fullName: p.fullName };
  } catch {
    return {};
  }
}

function readPlan(): string {
  if (typeof window === "undefined") return "free";
  return localStorage.getItem("hirely.plan") || "free";
}

/** Fire-and-forget POST to n8n. Never throws — webhook failures don't block UX. */
export async function postToN8n(
  payload: Omit<N8nPayload, "timestamp"> & { timestamp?: string },
): Promise<{ ok: boolean; response?: unknown; error?: string }> {
  const user = readUser();
  const body: N8nPayload = {
    userId: user.email ?? null,
    email: payload.email ?? user.email ?? null,
    fullName: payload.fullName ?? user.fullName ?? null,
    plan: payload.plan ?? readPlan(),
    timestamp: payload.timestamp ?? new Date().toISOString(),
    actionType: payload.actionType,
    data: payload.data ?? null,
  };
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let parsed: unknown = text;
    try { parsed = text ? JSON.parse(text) : null; } catch { /* keep text */ }
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}`, response: parsed };
    return { ok: true, response: parsed };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}