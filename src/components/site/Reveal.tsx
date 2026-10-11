import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("is-visible"); return; }
    const io = new IntersectionObserver(([e]) => { if (!e) return;
      if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={cn("reveal", className)}>{children}</Tag>;
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: ReactNode }) {
  return (
    <header className="border-b border-border bg-muted/50">
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl text-primary md:text-6xl">{title}</h1>
        {intro && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</div>}
      </div>
    </header>
  );
}

export function Notice({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "sage" }) {
  return (
    <div role="note" className={cn("rounded-lg border-l-4 px-4 py-3 text-sm leading-relaxed",
      tone === "gold" ? "border-gold bg-gold-soft/50 text-foreground" : "border-sage bg-accent text-accent-foreground")}>
      {children}
    </div>
  );
}
