import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { CATEGORIES, DIMENSIONS, type Category } from "@/lib/welfare-data";
import { PageHeader } from "@/components/site/Reveal";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, Gauge, Lightbulb } from "lucide-react";

const searchSchema = z.object({ d: z.string().optional() });

export const Route = createFileRoute("/explorer")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Welfare Explorer — Welfare360" },
      { name: "description", content: "Interactive guide to eight employee welfare dimensions with examples, benefits, challenges and metrics." },
      { property: "og:title", content: "Welfare Explorer — Welfare360" },
      { property: "og:description", content: "Filter and explore eight dimensions of employee welfare." },
    ],
  }),
  component: Explorer,
});

function Explorer() {
  const { d } = Route.useSearch();
  const navigate = useNavigate({ from: "/explorer" });
  const [filter, setFilter] = useState<Category | "All">("All");
  const selected = DIMENSIONS.find((x) => x.id === d);
  const list = filter === "All" ? DIMENSIONS : DIMENSIONS.filter((x) => x.category === filter);

  return (
    <>
      <PageHeader eyebrow="Welfare explorer" title="Eight dimensions, examined" intro="Filter by category, then open any dimension for its meaning, examples, benefits, challenges and a suggested metric." />
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button key={c} onClick={() => setFilter(c)} aria-pressed={filter === c}
              className={cn("rounded-full border px-4 py-2 text-sm font-medium transition",
                filter === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary hover:text-primary")}>
              {c}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">Showing {list.length} of {DIMENSIONS.length} dimensions</p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((x, i) => (
            <li key={x.id} className={i === 0 && filter === "All" ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
              <button onClick={() => navigate({ search: { d: x.id } })}
                className={cn("group flex h-full w-full flex-col rounded-2xl border border-border bg-card p-6 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-lift",
                  i === 0 && filter === "All" && "bg-emerald-gradient text-primary-foreground")}>
                <x.icon className="h-8 w-8 text-gold" aria-hidden />
                <span className={cn("mt-5 text-xs font-semibold uppercase tracking-wider", i === 0 && filter === "All" ? "opacity-70" : "text-muted-foreground")}>{x.category}</span>
                <span className="mt-1 font-display text-2xl">{x.name}</span>
                <span className={cn("mt-3 text-sm leading-relaxed", i === 0 && filter === "All" ? "opacity-85" : "text-muted-foreground")}>{x.meaning}</span>
                <span className="mt-auto pt-5 text-sm font-semibold text-gold">Open details →</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && navigate({ search: {} })}>
        <SheetContent className="w-full overflow-y-auto bg-background sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <selected.icon className="h-9 w-9 text-gold" aria-hidden />
                <p className="eyebrow">{selected.category}</p>
                <SheetTitle className="font-display text-3xl text-primary">{selected.name}</SheetTitle>
                <SheetDescription className="text-base leading-relaxed">{selected.meaning}</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 px-4 pb-8">
                <Block icon={Lightbulb} title="Practical examples" items={selected.examples} />
                <Block icon={CheckCircle2} title="Potential benefits" items={selected.benefits} />
                <Block icon={AlertTriangle} title="Implementation challenges" items={selected.challenges} />
                <div className="rounded-xl bg-accent p-4">
                  <p className="flex items-center gap-2 font-semibold text-accent-foreground"><Gauge className="h-4 w-4" aria-hidden /> Suggested evaluation metric</p>
                  <p className="mt-1 text-sm">{selected.metric}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function Block({ icon: Icon, title, items }: { icon: typeof Lightbulb; title: string; items: string[] }) {
  return (
    <section>
      <h3 className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wider text-primary"><Icon className="h-4 w-4 text-gold" aria-hidden />{title}</h3>
      <ul className="mt-2 space-y-1.5 text-sm">{items.map((t) => <li key={t} className="border-l-2 border-sage pl-3">{t}</li>)}</ul>
    </section>
  );
}
