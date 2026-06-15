const N8N_WEBHOOK_URL = "https://chloe-gf-19.app.n8n.cloud/webhook/5b8600e2-8295-4804-a0c1-529aaabba92d";
function readUser() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("hirely.user");
    if (!raw) return {};
    const p = JSON.parse(raw);
    return { email: p.email, fullName: p.fullName };
  } catch {
    return {};
  }
}
function readPlan() {
  if (typeof window === "undefined") return "free";
  return localStorage.getItem("hirely.plan") || "free";
}
async function postToN8n(payload) {
  const user = readUser();
  const body = {
    userId: user.email ?? null,
    email: payload.email ?? user.email ?? null,
    fullName: payload.fullName ?? user.fullName ?? null,
    plan: payload.plan ?? readPlan(),
    timestamp: payload.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
    actionType: payload.actionType,
    data: payload.data ?? null
  };
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const text = await res.text();
    let parsed = text;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
    }
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}`, response: parsed };
    return { ok: true, response: parsed };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
export {
  postToN8n as p
};
