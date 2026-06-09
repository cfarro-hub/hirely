import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { searchRoles, inferIndustry, type RoleOption } from "@/lib/roles";

type Props = {
  value: string;
  onChange: (role: string, industry: string) => void;
  placeholder?: string;
  className?: string;
};

/**
 * Combobox: lets the user either pick a curated role or type a custom one.
 * On every change it computes the matching industry and bubbles both up.
 */
export function RoleSelect({ value, onChange, placeholder, className }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlight, setHighlight] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const results = searchRoles(query, 8);

  const pick = (r: RoleOption) => {
    onChange(r.role, r.industry);
    setQuery(r.role);
    setOpen(false);
  };

  const handleType = (v: string) => {
    setQuery(v);
    setOpen(true);
    setHighlight(0);
    onChange(v, inferIndustry(v));
  };

  return (
    <div ref={boxRef} className={`relative ${className ?? ""}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => handleType(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setHighlight((h) => Math.min(h + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, 0));
            } else if (e.key === "Enter" && open && results[highlight]) {
              e.preventDefault();
              pick(results[highlight]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder ?? "Search or type a role…"}
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-400"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-30 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-border bg-popover shadow-elegant">
          {results.map((r, i) => (
            <button
              key={r.role}
              type="button"
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => { e.preventDefault(); pick(r); }}
              className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm ${i === highlight ? "bg-secondary" : "hover:bg-secondary"}`}
            >
              <span className="text-foreground">{r.role}</span>
              <span className="text-[11px] text-muted-foreground">{r.industry}</span>
            </button>
          ))}
          {query.trim() && !results.some((r) => r.role.toLowerCase() === query.trim().toLowerCase()) && (
            <div className="px-4 py-2 text-[11px] text-muted-foreground border-t border-border">
              Press Enter to use "<span className="text-foreground">{query.trim()}</span>"
            </div>
          )}
        </div>
      )}
    </div>
  );
}