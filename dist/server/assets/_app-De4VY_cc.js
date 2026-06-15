import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, FileText, Mic, Linkedin, Gift, CreditCard, User, LogOut, X, Menu } from "lucide-react";
import { u as useAuth, g as getMyProfile } from "./account.functions-BfzPSEeM.js";
import { useQuery } from "@tanstack/react-query";
import { u as useServerFn } from "./createSsrRpc-DSJIU2Sn.js";
import "./client-BHmQHd0X.js";
import "@supabase/supabase-js";
import "./server-2xF5ZQvo.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "zod";
import "./auth-middleware-CaKyJUqS.js";
const TABS = [
  { to: "/demo", label: "CV Review", icon: FileText },
  { to: "/interview", label: "Interview Prep", icon: Mic },
  { to: "/linkedin", label: "LinkedIn Import", icon: Linkedin },
  { to: "/referrals", label: "Referrals", icon: Gift },
  { to: "/pricing", label: "Pricing", icon: CreditCard },
  { to: "/account", label: "Account", icon: User }
];
function AppShell({ children }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const fetchProfile = useServerFn(getMyProfile);
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id ?? "anon"],
    queryFn: () => fetchProfile(),
    enabled: isAuthenticated,
    staleTime: 3e4
  });
  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70", children: [
      /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 font-display text-lg font-bold", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-7 w-7 place-items-center rounded-lg bg-gradient-hero text-primary-foreground", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }) }),
          "Hirely"
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "hidden md:flex items-center gap-1", children: TABS.map(({ to, label, icon: Icon }) => /* @__PURE__ */ jsxs(
          Link,
          {
            to,
            preload: "intent",
            activeProps: { className: "bg-foreground text-background" },
            inactiveProps: { className: "text-muted-foreground hover:text-foreground hover:bg-secondary" },
            className: "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition",
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }),
              label
            ]
          },
          to
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-3", children: [
          isAuthenticated && profile && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground hidden lg:inline", children: profile.plan === "unlimited" ? "Unlimited" : `${profile.cv_credits} CV credits` }),
          isAuthenticated ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Avatar, { user }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleSignOut,
                className: "rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary",
                "aria-label": "Sign out",
                children: /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" })
              }
            )
          ] }) : /* @__PURE__ */ jsx(Link, { to: "/", className: "text-sm font-medium text-muted-foreground hover:text-foreground", children: "Sign in" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setMobileOpen((v) => !v),
            className: "md:hidden rounded-md p-2 hover:bg-secondary",
            "aria-label": "Toggle menu",
            children: mobileOpen ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
          }
        )
      ] }),
      mobileOpen && /* @__PURE__ */ jsx("div", { className: "md:hidden border-t border-border bg-background", children: /* @__PURE__ */ jsxs("nav", { className: "mx-auto max-w-7xl px-4 py-3 grid gap-1", children: [
        TABS.map(({ to, label, icon: Icon }) => /* @__PURE__ */ jsxs(
          Link,
          {
            to,
            onClick: () => setMobileOpen(false),
            activeProps: { className: "bg-foreground text-background" },
            inactiveProps: { className: "text-foreground hover:bg-secondary" },
            className: "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
              label
            ]
          },
          to
        )),
        isAuthenticated && /* @__PURE__ */ jsxs("button", { onClick: handleSignOut, className: "mt-2 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary", children: [
          /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
          " Sign out"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("main", { children })
  ] });
}
function Avatar({ user }) {
  const url = user?.user_metadata?.avatar_url;
  const initial = (user?.user_metadata?.full_name || user?.email || "?").trim().charAt(0).toUpperCase();
  if (url) {
    return /* @__PURE__ */ jsx("img", { src: url, alt: "", className: "h-7 w-7 rounded-full object-cover" });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid h-7 w-7 place-items-center rounded-full bg-gradient-hero text-xs font-semibold text-primary-foreground", children: initial });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsx(Outlet, {}) });
export {
  SplitComponent as component
};
