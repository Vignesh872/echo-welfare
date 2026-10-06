import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MGMT_FUNCTIONS } from "@/lib/welfare-data";
import { PageHeader, Notice, Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management")({
  head: () => ({
    meta: [
      { title: "Management Connection — Welfare360" },
      { name: "description", content: "How employee welfare links to planning, organising, staffing, leading and controlling, with Maslow and Herzberg." },
      { property: "og:title", content: "Management Connection — Welfare360" },
      { property: "og:description", content: "Welfare through the lens of management functions and motivation theory." },
    ],
  }),
  component: Management,
});

const MASLOW = [
  { level: "Self-actualisation", w: "Learning, career growth" },
  { level: "Esteem", w: "Recognition schemes" },
  { level: "Belonging", w: "Inclusion, team activities" },
  { level: "Safety", w: "Health & safety, job security" },
  { level: "Physiological", w: "Canteen, water, rest areas" },
];

function Management() {
  const [active, setActive] = useState(0);
  const f = MGMT_FUNCTIONS[active];
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % 5); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a + 4) % 5); }
  };
  return (
    <>
      <PageHeader eyebrow="Management connection" title="Welfare across the management process" intro="Select a function to see how welfare fits into it, with a practical workplace example." />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-[22%] flex items-center justify-center rounded-full bg-emerald-gradient text-center text-primary-foreground shadow-lift">
            <span className="font-display text-xl leading-tight">Employee<br />Welfare</span>
          </div>
          <div role="tablist" aria-label="Management functions" onKeyDown={onKey}>
            {MGMT_FUNCTIONS.map((m, i) => {
              const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
              return (
                <button key={m.id} role="tab" id={`tab-${m.id}`} aria-selected={active === i} aria-controls="mgmt-panel" tabIndex={active === i ? 0 : -1}
                  onClick={() => setActive(i)}
                  style={{ left: `${50 + 40 * Math.cos(angle)}%`, top: `${50 + 40 * Math.sin(angle)}%` }}
                  className={cn("absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold shadow-soft transition",
                    active === i ? "scale-110 border-gold bg-gold text-emerald-deep" : "border-border bg-card text-primary hover:border-gold")}>
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
        <div id="mgmt-panel" role="tabpanel" aria-labelledby={`tab-${f.id}`} aria-live="polite" key={f.id} className="animate-page">
          <p className="eyebrow">Function {active + 1} of 5</p>
          <h2 className="mt-2 text-5xl text-primary">{f.name}</h2>
          <p className="mt-5 text-lg leading-relaxed">{f.explanation}</p>
          <div className="mt-6 rounded-xl border-l-4 border-gold bg-card p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Workplace example</p>
            <p className="mt-2">{f.example}</p>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Tip: use arrow keys to move between functions.</p>
        </div>
      </section>

      <section className="bg-muted/60">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-20 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Theory 1</p>
            <h2 className="mt-2 text-3xl text-primary">Maslow's hierarchy of needs</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Maslow proposed that people are motivated by needs arranged from basic to higher-order. Welfare measures can be mapped to these levels as a way of thinking about what they address.</p>
            <div className="mt-6 space-y-1.5">
              {MASLOW.map((m, i) => (
                <div key={m.level} className="mx-auto flex items-center justify-between rounded-md bg-primary px-4 py-2.5 text-primary-foreground"
                  style={{ width: `${55 + i * 11}%`, opacity: 0.7 + i * 0.075 }}>
                  <span className="text-sm font-semibold">{m.level}</span>
                  <span className="hidden text-xs opacity-80 sm:inline">{m.w}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <p className="eyebrow">Theory 2</p>
            <h2 className="mt-2 text-3xl text-primary">Herzberg's two-factor theory</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Herzberg distinguished <strong>hygiene factors</strong>, whose absence causes dissatisfaction, from <strong>motivators</strong>, which can create satisfaction.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="font-display text-lg text-primary">Hygiene factors</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground"><li>Facilities & working conditions</li><li>Safety provisions</li><li>Pay-related benefits</li><li>Transport</li></ul>
              </div>
              <div className="rounded-xl border border-gold bg-gold-soft/40 p-5">
                <p className="font-display text-lg text-primary">Motivators</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground"><li>Recognition</li><li>Growth & learning</li><li>Responsibility</li><li>Achievement</li></ul>
              </div>
            </div>
          </Reveal>
          <div className="lg:col-span-2">
            <Notice>These theories are useful lenses for discussion, not universal proof. Both have been criticised — for example, needs do not always follow a fixed order, and Herzberg's findings depend on how people were asked. This study uses them to frame questions, not to predict outcomes.</Notice>
          </div>
        </div>
      </section>
    </>
  );
}
