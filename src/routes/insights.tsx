import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, Inbox } from "lucide-react";
import { computeStats, DEPARTMENTS, makeDemoData, toCSV, type SurveyResponse } from "@/lib/welfare-data";
import { PageHeader, Notice } from "@/components/site/Reveal";
import { useLocalState, KEYS } from "@/lib/storage";
import { cn } from "@/lib/utils";

const searchSchema = z.object({ mode: z.enum(["demo", "local"]).optional() });

export const Route = createFileRoute("/insights")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Insights Dashboard — Welfare360" },
      { name: "description", content: "Interactive charts of welfare satisfaction: fictional demonstration data or your own locally saved survey responses." },
      { property: "og:title", content: "Insights Dashboard — Welfare360" },
      { property: "og:description", content: "Average scores, rating distribution, department filters and CSV export." },
    ],
  }),
  component: Insights,
});

const DEMO = makeDemoData();
const fmt = (n: number | null, d = 2) => (n == null ? "—" : n.toFixed(d));

function Insights() {
  const { mode = "demo" } = Route.useSearch();
  const navigate = useNavigate({ from: "/insights" });
  const [local, , { ready }] = useLocalState<SurveyResponse[]>(KEYS.responses, []);
  const [dept, setDept] = useState("All");
  const [view, setView] = useState<"chart" | "table">("chart");

  const source = mode === "demo" ? DEMO : local;
  const rows = useMemo(() => (dept === "All" ? source : source.filter((r) => r.department === dept)), [source, dept]);
  const stats = useMemo(() => computeStats(rows), [rows]);
  const ranked = stats.byDimension.filter((d) => d.average != null).sort((a, b) => a.average! - b.average!);

  const exportCSV = () => {
    const blob = new Blob([toCSV(rows)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `welfare360-${mode === "demo" ? "fictional-demo" : "local"}-${dept.replace(/\W+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageHeader eyebrow="Insights dashboard" title="What the responses show" intro="Switch between fictional demonstration data and real responses saved on this device. The two are never mixed." />
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div role="tablist" aria-label="Dataset" className="inline-flex rounded-full border border-border bg-card p-1">
            {(["demo", "local"] as const).map((m) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => { setDept("All"); navigate({ search: { mode: m } }); }}
                className={cn("rounded-full px-5 py-2 text-sm font-semibold transition", mode === m ? "bg-primary text-primary-foreground" : "hover:text-primary")}>
                {m === "demo" ? "Fictional demo data" : "My local responses"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="dept-filter" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</label>
              <select id="dept-filter" value={dept} onChange={(e) => setDept(e.target.value)} className="mt-1 rounded-md border border-input bg-card px-3 py-2 text-sm">
                <option>All</option>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <button onClick={exportCSV} disabled={rows.length === 0} className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-accent disabled:opacity-40">
              <Download className="h-4 w-4" aria-hidden /> Export CSV
            </button>
          </div>
        </div>

        <div className="mt-5">
          {mode === "demo"
            ? <Notice><strong>Fictional demonstration data.</strong> These 60 responses are generated for illustration only. They do not describe any real organisation or person.</Notice>
            : <Notice tone="sage"><strong>Local responses only.</strong> Data comes from surveys submitted in this browser on this device.</Notice>}
        </div>

        {mode === "local" && !ready ? (
          <p className="mt-10 text-muted-foreground" role="status">Loading local responses…</p>
        ) : rows.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
            <Inbox className="mx-auto h-10 w-10 text-sage" aria-hidden />
            <h2 className="mt-3 text-2xl text-primary">No responses {dept !== "All" ? `for ${dept}` : "yet"}</h2>
            <p className="mt-2 text-muted-foreground">{source.length === 0 ? "Complete the survey on this device to see your own results here." : "Try a different department filter."}</p>
            {source.length === 0 && <Link to="/survey" className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground">Take the survey</Link>}
          </div>
        ) : (
          <>
            <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
              <Stat label="Responses" value={String(stats.count)} />
              <Stat label="Average satisfaction" value={`${fmt(stats.average)} / 5`} />
              <Stat label="Ratings of 4 or 5" value={stats.favourablePct == null ? "—" : `${stats.favourablePct.toFixed(1)}%`} />
            </dl>

            <div className="mt-8 flex justify-end">
              <div className="inline-flex rounded-full border border-border p-1 text-sm" role="group" aria-label="Display">
                {(["chart", "table"] as const).map((v) => (
                  <button key={v} aria-pressed={view === v} onClick={() => setView(v)} className={cn("rounded-full px-4 py-1.5 font-medium", view === v && "bg-accent text-primary")}>{v === "chart" ? "Charts" : "Table"}</button>
                ))}
              </div>
            </div>

            {view === "chart" ? (
              <div className="mt-4 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <ChartCard title="Average score by dimension" note="Scale 1–5. Not applicable answers excluded.">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={stats.byDimension.map((d) => ({ ...d, average: d.average == null ? 0 : +d.average.toFixed(2) }))} margin={{ left: -20, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} angle={-35} textAnchor="end" interval={0} />
                      <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <Tooltip cursor={{ fill: "var(--accent)" }} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                        formatter={(v: number, _n, p) => [`${v} (n=${p.payload.n})`, "Average"]} />
                      <Bar dataKey="average" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Rating distribution" note="All valid ratings across dimensions.">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={stats.distribution} layout="vertical" margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <Tooltip cursor={{ fill: "var(--accent)" }} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v: number) => [v, "Ratings"]} />
                      <Bar dataKey="count" fill="var(--gold)" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            ) : (
              <div className="mt-4 grid gap-6 lg:grid-cols-2">
                <table className="w-full overflow-hidden rounded-xl border border-border bg-card text-sm">
                  <caption className="p-3 text-left font-semibold">Average score by dimension</caption>
                  <thead className="bg-muted"><tr><th className="p-3 text-left">Dimension</th><th className="p-3 text-right">Average</th><th className="p-3 text-right">Valid n</th><th className="p-3 text-right">N/A</th></tr></thead>
                  <tbody>{stats.byDimension.map((d) => <tr key={d.id} className="border-t border-border"><td className="p-3">{d.name}</td><td className="p-3 text-right">{fmt(d.average)}</td><td className="p-3 text-right">{d.n}</td><td className="p-3 text-right">{d.na}</td></tr>)}</tbody>
                </table>
                <table className="w-full self-start overflow-hidden rounded-xl border border-border bg-card text-sm">
                  <caption className="p-3 text-left font-semibold">Rating distribution</caption>
                  <thead className="bg-muted"><tr><th className="p-3 text-left">Rating</th><th className="p-3 text-right">Count</th></tr></thead>
                  <tbody>{stats.distribution.map((d) => <tr key={d.rating} className="border-t border-border"><td className="p-3">{d.rating} — {d.label}</td><td className="p-3 text-right">{d.count}</td></tr>)}</tbody>
                </table>
              </div>
            )}

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <section>
                <h2 className="text-2xl text-primary">Areas for further investigation</h2>
                <p className="mt-2 text-sm text-muted-foreground">The lowest-scoring dimensions in this view. Low scores indicate where to ask more questions — not proof of a cause.</p>
                <ol className="mt-4 space-y-2">
                  {ranked.slice(0, 3).map((d, i) => (
                    <li key={d.id} className="flex items-center justify-between rounded-lg border-l-4 border-gold bg-card px-4 py-3 shadow-soft">
                      <span><span className="font-display text-gold">{i + 1}.</span> {d.name}</span><span className="font-semibold">{fmt(d.average)}</span>
                    </li>
                  ))}
                </ol>
                {stats.count < 30 && <p className="mt-3 text-xs text-muted-foreground">Small sample ({stats.count}). Interpret with caution.</p>}
              </section>
              <section className="rounded-2xl bg-muted/60 p-6 text-sm leading-relaxed">
                <h2 className="text-xl text-primary">How these numbers are calculated</h2>
                <ul className="mt-3 list-disc space-y-1.5 pl-5">
                  <li><strong>Average satisfaction</strong> = sum of all valid ratings ÷ number of valid ratings.</li>
                  <li><strong>Ratings of 4 or 5</strong> = valid ratings of 4 or 5 ÷ all valid ratings × 100.</li>
                  <li><strong>Dimension average</strong> = sum of ratings for that dimension ÷ valid ratings for it.</li>
                  <li>"Not applicable" answers are <strong>excluded</strong> from every denominator.</li>
                  <li>Currently {stats.validRatings} valid ratings from {stats.count} responses.</li>
                </ul>
              </section>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="bg-card p-6"><dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt><dd className="mt-2 font-display text-4xl text-primary">{value}</dd></div>;
}
function ChartCard({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return <figure className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-soft"><figcaption><p className="font-display text-xl text-primary">{title}</p><p className="text-xs text-muted-foreground">{note}</p></figcaption><div className="mt-4">{children}</div></figure>;
}
