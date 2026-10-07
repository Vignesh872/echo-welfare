import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { DIMENSIONS, MGMT_FUNCTIONS, computeStats, makeDemoData } from "@/lib/welfare-data";

export const Route = createFileRoute("/present")({
  head: () => ({
    meta: [
      { title: "Presentation Mode — Welfare360" },
      { name: "description", content: "Distraction-free classroom slides for A Study on Employee Welfare Measures." },
      { property: "og:title", content: "Presentation Mode — Welfare360" },
      { property: "og:description", content: "Slide presentation of the employee welfare study." },
    ],
  }),
  component: Present,
});

const demo = computeStats(makeDemoData());

const SLIDES: { title: string; body: ReactNode }[] = [
  { title: "A Study on Employee Welfare Measures", body: <><p className="text-3xl text-gold">Better Welfare. Better Workplaces.</p><p className="mt-6 text-2xl opacity-80">Principles of Management · Welfare360</p></> },
  { title: "Objectives", body: <ol className="list-decimal space-y-3 pl-8 text-2xl"><li>Understand welfare concepts and types</li><li>Identify common welfare measures</li><li>Assess satisfaction across eight dimensions</li><li>Relate welfare to management functions</li><li>Suggest improvements</li></ol> },
  { title: "Eight welfare dimensions", body: <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{DIMENSIONS.map((d) => <div key={d.id} className="rounded-xl bg-primary-foreground/10 p-5"><d.icon className="h-8 w-8 text-gold" aria-hidden /><p className="mt-3 text-xl">{d.name}</p></div>)}</div> },
  { title: "Management connections", body: <ul className="space-y-4 text-2xl">{MGMT_FUNCTIONS.map((m) => <li key={m.id}><span className="text-gold">{m.name}</span> — {m.explanation.split(";")[0].split(" — ")[0]}</li>)}</ul> },
  { title: "Methodology", body: <ul className="space-y-3 text-2xl"><li>Descriptive research design</li><li>Structured questionnaire, five-point scale</li><li>Convenience sampling (details to be added)</li><li>Mean scores and percentages; N/A excluded</li></ul> },
  { title: "Illustrative insights", body: <><p className="mb-6 inline-block rounded bg-gold px-3 py-1 text-lg font-semibold text-emerald-deep">Fictional demonstration data</p><div className="space-y-3">{demo.byDimension.map((d) => <div key={d.id} className="flex items-center gap-4 text-xl"><span className="w-36 shrink-0">{d.name}</span><div className="h-5 flex-1 rounded bg-primary-foreground/15"><div className="h-full rounded bg-gold" style={{ width: `${((d.average ?? 0) / 5) * 100}%` }} /></div><span className="w-12 text-right">{d.average?.toFixed(1)}</span></div>)}</div></> },
  { title: "Recommendations", body: <ul className="space-y-3 text-2xl"><li>Survey employees regularly</li><li>Form a representative welfare committee</li><li>Prioritise transparently</li><li>Communicate schemes clearly</li><li>Track one metric per dimension</li></ul> },
  { title: "Conclusion", body: <p className="max-w-4xl text-3xl leading-snug">Welfare is part of good management. Listening to employees, then planning, acting and reviewing, turns welfare from a cost line into a shared commitment.</p> },
];

function Present() {
  const [i, setI] = useState(0);
  const go = useCallback((d: number) => setI((x) => Math.min(SLIDES.length - 1, Math.max(0, x + d))), []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(1); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(-1); }
      if (e.key === "Home") setI(0);
      if (e.key === "End") setI(SLIDES.length - 1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go]);
  const s = SLIDES[i];
  return (
    <div className="flex min-h-screen flex-col bg-emerald-gradient text-primary-foreground">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="font-display text-xl">Welfare<span className="text-gold">360</span></span>
        <Link to="/" className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/30 px-4 py-2 text-sm font-semibold hover:bg-primary-foreground/10"><X className="h-4 w-4" aria-hidden />Exit presentation</Link>
      </div>
      <section key={i} aria-roledescription="slide" aria-label={`Slide ${i + 1} of ${SLIDES.length}: ${s.title}`} className="animate-page mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-8 py-8">
        <p className="eyebrow">{String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}</p>
        <h1 className="mb-10 mt-3 text-5xl md:text-7xl">{s.title}</h1>
        <div>{s.body}</div>
      </section>
      <div className="flex items-center gap-4 px-6 pb-6">
        <button onClick={() => go(-1)} disabled={i === 0} aria-label="Previous slide" className="rounded-full border border-primary-foreground/30 p-3 disabled:opacity-30"><ChevronLeft /></button>
        <div className="h-1.5 flex-1 rounded-full bg-primary-foreground/15" role="progressbar" aria-valuemin={1} aria-valuemax={SLIDES.length} aria-valuenow={i + 1} aria-label="Slide progress">
          <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${((i + 1) / SLIDES.length) * 100}%` }} />
        </div>
        <button onClick={() => go(1)} disabled={i === SLIDES.length - 1} aria-label="Next slide" className="rounded-full border border-primary-foreground/30 p-3 disabled:opacity-30"><ChevronRight /></button>
      </div>
    </div>
  );
}
