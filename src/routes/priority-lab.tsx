import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { DEFAULT_INITIATIVES } from "@/lib/welfare-data";
import { PageHeader, Notice } from "@/components/site/Reveal";
import { useLocalState, KEYS } from "@/lib/storage";

export const Route = createFileRoute("/priority-lab")({
  head: () => ({
    meta: [
      { title: "Welfare Priority Lab — Welfare360" },
      { name: "description", content: "A classroom planning exercise to rank welfare initiatives by need, usefulness and feasibility." },
      { property: "og:title", content: "Welfare Priority Lab — Welfare360" },
      { property: "og:description", content: "Score welfare initiatives and see a transparent priority ranking update instantly." },
    ],
  }),
  component: Lab,
});

type Init = (typeof DEFAULT_INITIATIVES)[number];
const CRITERIA = [["need", "Employee need"], ["usefulness", "Expected usefulness"], ["feasibility", "Feasibility"]] as const;
const score = (i: Init) => i.need * 0.4 + i.usefulness * 0.35 + i.feasibility * 0.25;

function Lab() {
  const [items, setItems] = useLocalState<Init[]>(KEYS.initiatives, DEFAULT_INITIATIVES);
  const [name, setName] = useState("");
  const ranked = [...items].sort((a, b) => score(b) - score(a));
  const set = (id: string, k: string, v: number) => setItems((p) => p.map((x) => (x.id === id ? { ...x, [k]: v } : x)));

  return (
    <>
      <PageHeader eyebrow="Welfare priority lab" title="Which initiative first?" intro="Score each proposed initiative from 1 (low) to 5 (high). The ranking updates as you adjust." />
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Notice><strong>Classroom planning exercise.</strong> This is not a validated prediction model. It does not estimate financial returns or productivity gains — it simply makes your own judgements transparent and comparable.</Notice>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl text-primary">{it.name}</h2>
                  <button onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} aria-label={`Remove ${it.name}`} className="rounded p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {CRITERIA.map(([k, label]) => (
                    <div key={k}>
                      <label htmlFor={`${it.id}-${k}`} className="flex justify-between text-sm"><span>{label}</span><span className="font-semibold text-primary">{it[k]}</span></label>
                      <input id={`${it.id}-${k}`} type="range" min={1} max={5} step={1} value={it[k]} onChange={(e) => set(it.id, k, +e.target.value)} className="mt-2 w-full accent-[var(--primary)]" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; setItems((p) => [...p, { id: `c${Date.now()}`, name: name.trim().slice(0, 80), need: 3, usefulness: 3, feasibility: 3 }]); setName(""); }}>
              <label htmlFor="new-init" className="sr-only">New initiative name</label>
              <input id="new-init" value={name} onChange={(e) => setName(e.target.value)} placeholder="Add an initiative…" className="flex-1 rounded-full border border-input bg-card px-4 py-2.5" />
              <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 font-semibold text-primary-foreground"><Plus className="h-4 w-4" aria-hidden />Add</button>
            </form>
            <button onClick={() => setItems(DEFAULT_INITIATIVES)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><RotateCcw className="h-3.5 w-3.5" aria-hidden />Reset to examples</button>
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-emerald-gradient p-6 text-primary-foreground shadow-lift">
              <h2 className="text-2xl">Priority ranking</h2>
              {ranked.length === 0 ? <p className="mt-4 opacity-80">Add an initiative to begin.</p> : (
                <ol className="mt-5 space-y-3" aria-live="polite">
                  {ranked.map((it, i) => (
                    <li key={it.id}>
                      <div className="flex justify-between gap-3 text-sm"><span><span className="font-display text-gold">{i + 1}.</span> {it.name}</span><span className="font-semibold">{score(it).toFixed(2)}</span></div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-primary-foreground/15"><div className="h-full rounded-full bg-gold transition-all" style={{ width: `${(score(it) / 5) * 100}%` }} /></div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <div className="mt-5 rounded-xl bg-muted/60 p-5 text-sm leading-relaxed">
              <p className="font-semibold text-primary">Scoring method</p>
              <p className="mt-1">Priority = Need × 0.40 + Usefulness × 0.35 + Feasibility × 0.25. Need is weighted highest because welfare should respond to employee needs first. Maximum score is 5.00.</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
