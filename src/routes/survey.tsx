import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DEPARTMENTS, DIMENSIONS, SCALE, type DimensionId, type Rating, type SurveyResponse } from "@/lib/welfare-data";
import { PageHeader, Notice } from "@/components/site/Reveal";
import { useLocalState, KEYS } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/survey")({
  head: () => ({
    meta: [
      { title: "Employee Survey — Welfare360" },
      { name: "description", content: "An anonymous eight-question welfare satisfaction survey, saved only on your device." },
      { property: "og:title", content: "Employee Survey — Welfare360" },
      { property: "og:description", content: "Rate satisfaction with eight welfare dimensions. Anonymous and stored locally." },
    ],
  }),
  component: Survey,
});

function Survey() {
  const [responses, setResponses, { ready, available }] = useLocalState<SurveyResponse[]>(KEYS.responses, []);
  const [dept, setDept] = useState("");
  const [answers, setAnswers] = useState<Partial<Record<DimensionId, Rating>>>({});
  const [errors, setErrors] = useState(false);
  const [done, setDone] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const answered = DIMENSIONS.filter((d) => answers[d.id] != null).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = DIMENSIONS.find((d) => answers[d.id] == null);
    if (missing) {
      setErrors(true);
      document.getElementById(`q-${missing.id}`)?.focus();
      return;
    }
    const r: SurveyResponse = {
      id: `r-${Date.now().toString(36)}`, createdAt: new Date().toISOString(),
      department: dept || "Prefer not to say", answers: answers as Record<DimensionId, Rating>,
    };
    setResponses((p) => [...p, r]);
    setAnswers({}); setDept(""); setErrors(false); setDone(true);
    setTimeout(() => doneRef.current?.focus(), 50);
  };

  return (
    <>
      <PageHeader eyebrow="Employee survey" title="How satisfied are you?" intro="Eight short questions, one per welfare dimension. It takes about two minutes." />
      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="space-y-3">
          <Notice><strong>Voluntary and anonymous.</strong> Participation is optional. We never ask for your name, phone, email or other personal details.</Notice>
          <Notice tone="sage"><strong>Saved only on this device.</strong> Responses are stored in this browser's local storage. They are not sent to any server and are not combined with other visitors' responses.</Notice>
          {ready && !available && <Notice>Browser storage is unavailable here, so responses cannot be saved. Try a different browser or disable private mode.</Notice>}
        </div>

        {done ? (
          <div ref={doneRef} tabIndex={-1} role="status" className="mt-10 rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden />
            <h2 className="mt-4 text-3xl text-primary">Thank you — response saved</h2>
            <p className="mt-2 text-muted-foreground">Your response is stored on this device. {responses.length} local response{responses.length === 1 ? "" : "s"} in total.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/insights" search={{ mode: "local" }} className="rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground">See local insights</Link>
              <button onClick={() => setDone(false)} className="rounded-full border border-border px-5 py-2.5 font-semibold hover:bg-accent">Add another response</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-10">
            <div className="sticky top-16 z-10 -mx-5 border-b border-border bg-background/95 px-5 py-3 backdrop-blur">
              <div className="flex justify-between text-sm font-medium"><span>Progress</span><span>{answered} of 8 answered</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={8} aria-valuenow={answered} aria-label="Survey progress">
                <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${(answered / 8) * 100}%` }} />
              </div>
            </div>

            <div className="mt-8">
              <label htmlFor="dept" className="font-semibold">Department <span className="font-normal text-muted-foreground">(optional)</span></label>
              <select id="dept" value={dept} onChange={(e) => setDept(e.target.value)} className="mt-2 w-full rounded-md border border-input bg-card px-3 py-2.5">
                <option value="">Select…</option>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            {errors && <p role="alert" className="mt-6 rounded-md bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">Please answer all eight questions (you may choose "Not applicable").</p>}

            <ol className="mt-8 space-y-6">
              {DIMENSIONS.map((d, i) => {
                const missing = errors && answers[d.id] == null;
                return (
                  <li key={d.id}>
                    <fieldset id={`q-${d.id}`} tabIndex={-1} aria-describedby={missing ? `err-${d.id}` : undefined}
                      className={cn("rounded-xl border bg-card p-5", missing ? "border-destructive" : "border-border")}>
                      <legend className="sr-only">{d.surveyQuestion}</legend>
                      <p className="flex items-start gap-3 font-medium" aria-hidden>
                        <span className="font-display text-gold">{i + 1}.</span>
                        <span>{d.surveyQuestion} <span className="text-destructive">*</span></span>
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-6">
                        {[...SCALE, { value: "na" as const, label: "Not applicable" }].map((s) => {
                          const checked = answers[d.id] === s.value;
                          return (
                            <label key={String(s.value)} className={cn("flex cursor-pointer flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-center text-xs transition focus-within:ring-2 focus-within:ring-ring",
                              checked ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary")}>
                              <input type="radio" name={d.id} value={String(s.value)} checked={checked} className="sr-only"
                                onChange={() => setAnswers((a) => ({ ...a, [d.id]: s.value }))} />
                              {s.value !== "na" && <span className="font-display text-lg">{s.value}</span>}
                              <span>{s.label}</span>
                            </label>
                          );
                        })}
                      </div>
                      {missing && <p id={`err-${d.id}`} className="mt-2 text-sm text-destructive">This question is required.</p>}
                    </fieldset>
                  </li>
                );
              })}
            </ol>
            <button type="submit" className="mt-8 w-full rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-soft transition hover:bg-emerald-deep">Submit response</button>
          </form>
        )}

        <section className="mt-14 rounded-2xl border border-dashed border-border p-6">
          <h2 className="text-xl text-primary">Your local responses</h2>
          <p className="mt-1 text-sm text-muted-foreground">{ready ? `${responses.length} saved on this device.` : "Loading…"}</p>
          {responses.length > 0 && (
            <button onClick={() => { if (confirm("Delete all survey responses saved on this device? This cannot be undone.")) { setResponses([]); toast.success("Local responses deleted"); } }}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-destructive px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" aria-hidden /> Delete all local responses
            </button>
          )}
        </section>
      </div>
    </>
  );
}
