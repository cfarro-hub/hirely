import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
const appCss = "/assets/styles-v9vYiB1-.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$6 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hirely — Your AI Career Copilot" },
      { name: "description", content: "Tailor your CV to every job, prepare for interviews with AI, and land jobs faster with Hirely." },
      { name: "author", content: "Hirely" },
      { property: "og:title", content: "Hirely — Your AI Career Copilot" },
      { property: "og:description", content: "Tailor your CV to every job, prepare for interviews with AI, and land jobs faster with Hirely." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Hirely — Your AI Career Copilot" },
      { name: "twitter:description", content: "Tailor your CV to every job, prepare for interviews with AI, and land jobs faster with Hirely." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b9209ebf-c0c3-4233-9f7b-e36a2088108e/id-preview-86164719--a2943f82-51cd-4cac-88bb-cdf25069dbb4.lovable.app-1780833338567.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b9209ebf-c0c3-4233-9f7b-e36a2088108e/id-preview-86164719--a2943f82-51cd-4cac-88bb-cdf25069dbb4.lovable.app-1780833338567.png" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" },
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$6.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const $$splitComponentImporter$5 = () => import("./_app-De4VY_cc.js");
const Route$5 = createFileRoute("/_app")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-CDRpjDCS.js");
const Route$4 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
  head: () => ({
    meta: [{
      title: "Hirely — Your AI Career Copilot"
    }, {
      name: "description",
      content: "Tailor your CV, ace interviews, and land jobs faster with Hirely."
    }, {
      property: "og:title",
      content: "Hirely — Your AI Career Copilot"
    }, {
      property: "og:description",
      content: "Tailor your CV, ace interviews, and land jobs faster."
    }],
    links: [{
      rel: "canonical",
      href: "/"
    }]
  })
});
const $$splitComponentImporter$3 = () => import("./_app.linkedin-DUuRb-fb.js");
const Route$3 = createFileRoute("/_app/linkedin")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
  head: () => ({
    meta: [{
      title: "LinkedIn Analyzer — Hirely"
    }, {
      name: "description",
      content: "AI-powered LinkedIn profile analyzer. Get recruiter-grade feedback in seconds."
    }]
  })
});
const $$splitComponentImporter$2 = () => import("./_app.interview-fwuHQl0p.js");
const Route$2 = createFileRoute("/_app/interview")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  head: () => ({
    meta: [{
      title: "AI Interview Coach — Hirely"
    }, {
      name: "description",
      content: "Build your candidate profile and practice tailored interview questions with real-time AI feedback."
    }]
  })
});
const $$splitComponentImporter$1 = () => import("./_app.demo-35wAR1Ig.js");
const Route$1 = createFileRoute("/_app/demo")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  head: () => ({
    meta: [{
      title: "AI CV Analyzer — Hirely"
    }, {
      name: "description",
      content: "Upload your CV and get real ATS, HR, and consulting-grade feedback."
    }]
  })
});
const $$splitComponentImporter = () => import("./_app.account-BH0JWOWu.js");
const Route = createFileRoute("/_app/account")({
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  head: () => ({
    meta: [{
      title: "Account — Hirely"
    }]
  })
});
const AppRoute = Route$5.update({
  id: "/_app",
  getParentRoute: () => Route$6
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$6
});
const AppLinkedinRoute = Route$3.update({
  id: "/linkedin",
  path: "/linkedin",
  getParentRoute: () => AppRoute
});
const AppInterviewRoute = Route$2.update({
  id: "/interview",
  path: "/interview",
  getParentRoute: () => AppRoute
});
const AppDemoRoute = Route$1.update({
  id: "/demo",
  path: "/demo",
  getParentRoute: () => AppRoute
});
const AppAccountRoute = Route.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => AppRoute
});
const AppRouteChildren = {
  AppAccountRoute,
  AppDemoRoute,
  AppInterviewRoute,
  AppLinkedinRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AppRoute: AppRouteWithChildren
};
const routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
