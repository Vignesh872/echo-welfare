import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Presentation } from "lucide-react";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/explorer", label: "Explorer" },
  { to: "/management", label: "Management" },
  { to: "/survey", label: "Survey" },
  { to: "/insights", label: "Insights" },
  { to: "/priority-lab", label: "Priority Lab" },
  { to: "/report", label: "Report" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link to="/" className="flex items-baseline gap-1 font-display text-2xl text-primary">
          Welfare<span className="text-gold">360</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary bg-accent" }}>
              {n.label}
            </Link>
          ))}
          <Link to="/present" className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-emerald-deep">
            <Presentation className="h-4 w-4" aria-hidden /> Present
          </Link>
        </nav>
        <button className="rounded-md p-2 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-border bg-background px-5 py-3 lg:hidden">
          {[...NAV, { to: "/present", label: "Presentation mode" } as const].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: n.to === "/" }}
              className="block rounded-md px-3 py-2.5 font-medium text-foreground" activeProps={{ className: "bg-accent text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print mt-24 bg-emerald-gradient text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Welfare<span className="text-gold">360</span></p>
          <p className="mt-3 text-sm opacity-80">A Study on Employee Welfare Measures — a college project for Principles of Management.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {NAV.map((n) => <Link key={n.to} to={n.to} className="opacity-80 hover:text-gold hover:opacity-100">{n.label}</Link>)}
        </div>
        <p className="text-sm opacity-70">Demonstration data on this site is fictional and clearly labelled. Survey responses are stored only in your own browser.</p>
      </div>
    </footer>
  );
}
