import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronDown, Check, ChevronUp, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import * as SelectPrimitive from "@radix-ui/react-select";
import { p as postToN8n } from "./n8n-webhook-C4tEkPnc.js";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = LabelPrimitive.Root.displayName;
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function SignupDialog({
  open,
  onOpenChange
}) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [refEmail, setRefEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [refEmailError, setRefEmailError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState(null);
  const onEmailChange = (v) => {
    setEmail(v);
    if (!v) setEmailError(null);
    else if (!EMAIL_RE.test(v)) setEmailError("Invalid email");
    else setEmailError(null);
  };
  const onRefChange = (v) => {
    setRefEmail(v);
    if (!v) setRefEmailError(null);
    else if (!EMAIL_RE.test(v)) setRefEmailError("Invalid email");
    else setRefEmailError(null);
  };
  const reset = () => {
    setFullName("");
    setEmail("");
    setSource("");
    setRefEmail("");
    setEmailError(null);
    setRefEmailError(null);
    setFormError(null);
    setSuccess(false);
    setSubmitting(false);
  };
  const handleClose = (v) => {
    if (!v) setTimeout(reset, 200);
    onOpenChange(v);
  };
  const continueToApp = () => {
    handleClose(false);
    navigate({ to: "/demo" });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!fullName.trim()) return setFormError("Please enter your name");
    if (!email || !EMAIL_RE.test(email)) return setEmailError("Invalid email");
    if (!source) return setFormError("Please tell us how you found us");
    if (source === "Friend/Referral") {
      if (!refEmail || !EMAIL_RE.test(refEmail)) return setRefEmailError("Invalid email");
    }
    setSubmitting(true);
    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        source,
        referrerEmail: source === "Friend/Referral" ? refEmail.trim().toLowerCase() : null,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      try {
        localStorage.setItem("hirely.user", JSON.stringify(payload));
      } catch {
      }
      const signupRes = await postToN8n({
        actionType: "signup",
        email: payload.email,
        fullName: payload.fullName,
        data: { source }
      });
      const respData = signupRes.response;
      if (respData?.error === "already_registered") {
        setEmailError("This email is already registered");
        setSubmitting(false);
        return;
      }
      if (respData?.error === "invalid_email") {
        setEmailError("Invalid email address");
        setSubmitting(false);
        return;
      }
      if (payload.referrerEmail) {
        await postToN8n({
          actionType: "referral",
          email: payload.email,
          fullName: payload.fullName,
          data: {
            referrerEmail: payload.referrerEmail,
            reward: "+1 free CV credit"
          }
        });
      }
      setSuccess(true);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleGoogle = () => {
    setFormError("Google sign-in isn't connected yet. Use the form to continue.");
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-md", children: success ? /* @__PURE__ */ jsxs("div", { className: "py-6 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto h-14 w-14 rounded-full bg-primary/10 grid place-items-center", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-7 w-7 text-primary" }) }),
    /* @__PURE__ */ jsx("h3", { className: "mt-4 text-xl font-semibold", children: "Welcome to Hirely 🎉" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Your free account is ready. Let's optimize your first CV." }),
    source === "Friend/Referral" && /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-primary", children: "Your referrer will receive +1 free CV credit by email." }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: continueToApp,
        className: "mt-6 w-full rounded-full bg-foreground text-background py-2.5 font-medium hover:opacity-90 transition",
        children: "Start optimizing"
      }
    )
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
        " Create your free account"
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "3 free CV optimizations & 1 mock interview. No credit card." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-4 mt-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Full name" }),
        /* @__PURE__ */ jsx(Input, { id: "name", value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "Jane Doe", required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            value: email,
            onChange: (e) => onEmailChange(e.target.value),
            placeholder: "jane@example.com",
            "aria-invalid": !!emailError,
            className: emailError ? "border-destructive focus-visible:ring-destructive" : "",
            required: true
          }
        ),
        emailError && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: emailError })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { children: "How did you find us?" }),
        /* @__PURE__ */ jsxs(Select, { value: source, onValueChange: (v) => setSource(v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select an option" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "Google", children: "Google" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Friend/Referral", children: "Friend / Referral" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Social Media", children: "Social Media" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Other", children: "Other" })
          ] })
        ] })
      ] }),
      source === "Friend/Referral" && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "ref", children: "Enter their email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "ref",
            type: "email",
            value: refEmail,
            onChange: (e) => onRefChange(e.target.value),
            placeholder: "friend@example.com",
            "aria-invalid": !!refEmailError,
            className: refEmailError ? "border-destructive focus-visible:ring-destructive" : ""
          }
        ),
        refEmailError && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: refEmailError }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "They'll get +1 free CV credit as a thank-you." })
      ] }),
      formError && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: formError }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: submitting,
          className: "w-full rounded-full bg-gradient-hero text-primary-foreground py-2.5 font-medium shadow-elegant hover:opacity-95 transition disabled:opacity-60 inline-flex items-center justify-center gap-2",
          children: [
            submitting && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
            "Create free account"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative my-2", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("div", { className: "w-full border-t border-border" }) }),
        /* @__PURE__ */ jsx("div", { className: "relative flex justify-center", children: /* @__PURE__ */ jsx("span", { className: "bg-background px-2 text-xs text-muted-foreground", children: "or" }) })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: handleGoogle,
          className: "w-full rounded-full border border-border bg-background py-2.5 font-medium hover:bg-secondary transition inline-flex items-center justify-center gap-2",
          children: [
            /* @__PURE__ */ jsx(GoogleIcon, {}),
            " Continue with Google"
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground text-center", children: "By signing up you agree to our Terms & Privacy Policy." })
    ] })
  ] }) }) });
}
function GoogleIcon() {
  return /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 48 48", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("path", { fill: "#FFC107", d: "M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z" }),
    /* @__PURE__ */ jsx("path", { fill: "#FF3D00", d: "M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z" }),
    /* @__PURE__ */ jsx("path", { fill: "#4CAF50", d: "M24 43.5c5 0 9.5-1.7 13-4.6l-6-5.1c-2 1.4-4.4 2.2-7 2.2-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.1 16.2 43.5 24 43.5z" }),
    /* @__PURE__ */ jsx("path", { fill: "#1976D2", d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.3 5.3l6 5.1c-.4.4 6.5-4.7 6.5-14.4 0-1.2-.1-2.3-.4-3.5z" })
  ] });
}
export {
  SignupDialog as S
};
