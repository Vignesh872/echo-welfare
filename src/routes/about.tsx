import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Notice, Reveal } from "@/components/site/Reveal";
import { useLocalState, KEYS } from "@/lib/storage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Study — Welfare360" },
      { name: "description", content: "Problem statement, objectives, scope, methodology and limitations of the employee welfare study." },
      { property: "og:title", content: "About the Study — Welfare360" },
      { property: "og:description", content: "Objectives, scope, methodology and limitations of the study." },
    ],
  }),
  component: About,
});

export const DETAIL_FIELDS = [
  ["student", "Student name"], ["register", "Register number"], ["college", "College"],
  ["department", "Department"], ["guide", "Project guide"], ["year", "Academic year"],
] as const;
export type Details = Record<(typeof DETAIL_FIELDS)[number][0], string>;
export const EMPTY_DETAILS: Details = { student: "", register: "", college: "", department: "", guide: "", year: "" };

const OBJECTIVES = [
  "To understand the concept and types of employee welfare measures.",
  "To identify the welfare measures commonly provided in organisations.",
  "To assess employee satisfaction with selected welfare dimensions.",
  "To examine how welfare relates to the functions of management.",
  "To suggest measures for improving employee welfare.",
];

function About() {
  const [details, setDetails, { ready, available }] = useLocalState<Details>(KEYS.details, EMPTY_DETAILS);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Details>(EMPTY_DETAILS);

  return (
    <>
      <PageHeader eyebrow="About the study" title="Framing the research" intro="What this study asks, why it matters, and how it proposes to find answers." />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.6fr_1fr]">
        <article className="prose-academic">
          <Reveal>
            <h2 className="!mt-0">Introduction</h2>
            <p>Employee welfare refers to efforts made by employers to improve the working and living conditions of employees, in addition to wages. Welfare may be statutory (required by labour law) or voluntary (offered at the employer's discretion).</p>
          </Reveal>
          <Reveal>
            <h2>Statement of the problem</h2>
            <p>Organisations often provide welfare measures without systematically checking whether employees find them useful or adequate. Without feedback, resources may be spent on low-value measures while important needs remain unaddressed. This study proposes a structured way to examine employee perceptions of welfare across eight dimensions.</p>
          </Reveal>
          <Reveal>
            <h2>Objectives</h2>
            <ol>{OBJECTIVES.map((o) => <li key={o}>{o}</li>)}</ol>
          </Reveal>
          <Reveal>
            <h2>Scope</h2>
            <p>The study covers eight welfare dimensions — health and safety, financial wellbeing, work–life balance, learning and development, mental wellbeing, workplace facilities, recognition and belonging, and transport and accessibility — viewed from the employee's perspective and linked to management functions.</p>
            <h2>Significance</h2>
            <p>The findings can help management prioritise welfare spending, help employees voice their needs, and help students understand how management theory applies to people practices.</p>
          </Reveal>
          <Reveal>
            <h2>Proposed methodology</h2>
            <ul>
              <li><strong>Research design:</strong> Descriptive.</li>
              <li><strong>Data sources:</strong> Primary data via a structured questionnaire; secondary data from textbooks, journals and organisational documents.</li>
              <li><strong>Sampling:</strong> Convenience sampling of employees (organisation and sample size to be added).</li>
              <li><strong>Instrument:</strong> Five-point satisfaction scale across eight dimensions, with an optional "Not applicable".</li>
              <li><strong>Tools of analysis:</strong> Percentages, mean scores and simple charts.</li>
            </ul>
          </Reveal>
          <Reveal>
            <h2>Limitations</h2>
            <ul>
              <li>Responses are self-reported and may reflect personal bias.</li>
              <li>Convenience sampling limits how far results can be generalised.</li>
              <li>Time and resource constraints of an academic project.</li>
              <li>Satisfaction scores show perceptions, not cause-and-effect relationships.</li>
            </ul>
          </Reveal>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-primary">Project details</h2>
              {!editing && (
                <button onClick={() => { setDraft(details); setEditing(true); }} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent">
                  <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
                </button>
              )}
            </div>
            {!available && <div className="mt-4"><Notice>Browser storage is unavailable, so edits will not be saved after you leave.</Notice></div>}
            {editing ? (
              <form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); setDetails(draft); setEditing(false); toast.success("Project details saved on this device"); }}>
                {DETAIL_FIELDS.map(([k, label]) => (
                  <div key={k}>
                    <label htmlFor={`f-${k}`} className="text-sm font-medium">{label}</label>
                    <input id={`f-${k}`} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} maxLength={120}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2" />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button type="submit" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Save className="h-4 w-4" aria-hidden /> Save</button>
                  <button type="button" onClick={() => setEditing(false)} className="rounded-full px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
                </div>
              </form>
            ) : (
              <dl className="mt-5 divide-y divide-border">
                {DETAIL_FIELDS.map(([k, label]) => (
                  <div key={k} className="grid grid-cols-[8rem_1fr] gap-2 py-3 text-sm">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className={details[k] ? "font-medium" : "italic text-muted-foreground"}>{ready ? details[k] || "To be added" : "…"}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
