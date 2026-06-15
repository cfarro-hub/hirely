import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { u as useServerFn } from "./createSsrRpc-DSJIU2Sn.js";
import { u as useAuth, g as getMyProfile, a as getMyTransactions } from "./account.functions-BfzPSEeM.js";
import "react";
import "@tanstack/react-router";
import "./server-2xF5ZQvo.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./client-BHmQHd0X.js";
import "@supabase/supabase-js";
import "zod";
import "./auth-middleware-CaKyJUqS.js";
function AccountPage() {
  const {
    isAuthenticated,
    user
  } = useAuth();
  const fetchProfile = useServerFn(getMyProfile);
  const fetchTxns = useServerFn(getMyTransactions);
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(),
    enabled: isAuthenticated
  });
  const {
    data: txns
  } = useQuery({
    queryKey: ["txns", user?.id],
    queryFn: () => fetchTxns(),
    enabled: isAuthenticated
  });
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground", children: "Sign in to view your account." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4 py-10 space-y-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold font-display", children: "Account" }),
    profile && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold", children: profile.full_name || profile.email }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: profile.email }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-3 gap-4 text-center", children: [
        /* @__PURE__ */ jsx(Stat, { label: "Plan", value: profile.plan }),
        /* @__PURE__ */ jsx(Stat, { label: "CV credits", value: profile.plan === "unlimited" ? "∞" : String(profile.cv_credits) }),
        /* @__PURE__ */ jsx(Stat, { label: "Interview credits", value: profile.plan === "unlimited" ? "∞" : String(profile.interview_credits) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-semibold mb-3", children: "Credit history" }),
      (txns ?? []).length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No transactions yet." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: txns.map((t) => /* @__PURE__ */ jsxs("li", { className: "flex justify-between py-2 text-sm", children: [
        /* @__PURE__ */ jsx("span", { children: t.reason }),
        /* @__PURE__ */ jsx("span", { className: t.delta > 0 ? "text-primary" : "text-muted-foreground", children: t.delta > 0 ? `+${t.delta}` : t.delta })
      ] }, t.id)) })
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold font-display", children: value }),
    /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: label })
  ] });
}
export {
  AccountPage as component
};
