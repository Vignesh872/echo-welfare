import { createFileRoute } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { DIMENSIONS, MGMT_FUNCTIONS, SCALE } from "@/lib/welfare-data";
import { Notice } from "@/components/site/Reveal";
import { useLocalState, KEYS } from "@/lib/storage";
import { DETAIL_FIELDS, EMPTY_DETAILS, type Details } from "./about";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report Centre — Welfare360" },
      { name: "description", content: "The academic report framework for A Study on Employee Welfare Measures, printable as PDF." },
      { property: "og:title", content: "Report Centre — Welfare360" },
      { property: "og:description", content: "Abstract, methodology, analysis framework, recommendations and questionnaire appendix." },
    ],
  }),
  component: Report,
});

const CHAPTERS = [
  ["abstract", "Abstract"], ["introduction", "Introduction"], ["objectives", "Objectives"], ["scope", "Scope"],
  ["framework", "Management framework"], ["methodology", "Proposed methodology"], ["analysis", "Analysis"],
  ["recommendations", "Recommendations"], ["conclusion", "Conclusion"], ["appendix", "Questionnaire appendix"], ["references", "References & source notes"],
] as const;

function Report() {
  const [details] = useLocalState<Details>(KEYS.details, EMPTY_DETAILS);
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[14rem_1fr]">
      <nav aria-label="Chapters" className="no-print lg:sticky lg:top-24 lg:self-start">
        <p className="eyebrow">Chapters</p>
        <ol className="mt-3 space-y-1 border-l border-border text-sm">
          {CHAPTERS.map(([id, t], i) => <li key={id}><a href={`#${id}`} className="-ml-px block border-l-2 border-transparent py-1 pl-3 text-muted-foreground hover:border-gold hover:text-primary">{i + 1}. {t}</a></li>)}
        </ol>
        <button onClick={() => window.print()} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Printer className="h-4 w-4" aria-hidden />Print / Save as PDF</button>
      </nav>

      <article className="print-full prose-academic max-w-3xl">
        <header className="border-b border-border pb-8">
          <p className="eyebrow">Principles of Management · Project Report</p>
          <h1 className="mt-3 text-4xl text-primary md:text-5xl">A Study on Employee Welfare Measures</h1>
          <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            {DETAIL_FIELDS.map(([k, l]) => <div key={k} className="flex gap-2"><dt className="text-muted-foreground">{l}:</dt><dd className={details[k] ? "" : "italic text-muted-foreground"}>{details[k] || "To be added"}</dd></div>)}
          </dl>
          <div className="mt-6"><Notice><strong>Status: study framework.</strong> Primary data has not yet been collected. Before submission, complete: organisation and sample details, actual survey results in Chapter 7, and verified references in Chapter 11.</Notice></div>
        </header>

        <section id="abstract"><h2>1. Abstract</h2><p>This study examines employee welfare measures across eight dimensions and links them to the functions of management. A structured five-point questionnaire is proposed to assess employee satisfaction. The report presents the conceptual framework, methodology and an analysis plan; findings will be added once data is collected.</p></section>
        <section id="introduction"><h2>2. Introduction</h2><p>Employee welfare includes the services, facilities and benefits provided to employees beyond wages to improve their working life. Welfare measures may be statutory — required under labour legislation — or voluntary. They are a practical expression of how an organisation treats its people.</p></section>
        <section id="objectives"><h2>3. Objectives</h2><ol><li>To understand the concept and types of employee welfare measures.</li><li>To identify welfare measures commonly provided.</li><li>To assess employee satisfaction across eight dimensions.</li><li>To relate welfare to the functions of management.</li><li>To suggest improvements.</li></ol></section>
        <section id="scope"><h2>4. Scope</h2><p>The study covers: {DIMENSIONS.map((d) => d.name.toLowerCase()).join(", ")}. It focuses on employee perceptions rather than financial outcomes.</p></section>
        <section id="framework"><h2>5. Management framework</h2>{MGMT_FUNCTIONS.map((m) => <p key={m.id}><strong>{m.name}.</strong> {m.explanation}</p>)}<p>Maslow's hierarchy of needs and Herzberg's two-factor theory are used as interpretive lenses, recognising their limitations.</p></section>
        <section id="methodology"><h2>6. Proposed methodology</h2><ul><li>Design: descriptive research.</li><li>Primary data: structured questionnaire (Appendix).</li><li>Secondary data: textbooks, journals, organisational records.</li><li>Sampling: convenience sampling — organisation and sample size <em>to be added</em>.</li><li>Analysis: percentages, mean scores, charts. "Not applicable" excluded from denominators.</li></ul></section>
        <section id="analysis"><h2>7. Analysis</h2><Notice>Illustrative only. The Insights Dashboard currently shows fictional demonstration data. Replace this chapter with actual results after data collection.</Notice><p>The analysis will report, for each dimension: the mean score, the share of ratings of 4 or 5, and the number of valid responses. Dimensions with the lowest means will be flagged for further investigation, and differences between departments described where sample sizes permit. No causal claims will be made.</p></section>
        <section id="recommendations"><h2>8. Recommendations</h2><ul><li>Conduct a welfare satisfaction survey at regular intervals.</li><li>Form a welfare committee with employee representation.</li><li>Prioritise low-scoring dimensions using a transparent scoring method.</li><li>Communicate available schemes clearly to improve awareness and uptake.</li><li>Track a defined metric for each dimension and review it periodically.</li></ul><p><em>Final recommendations should be revised to reflect actual findings.</em></p></section>
        <section id="conclusion"><h2>9. Conclusion</h2><p>Employee welfare is an integral part of the management process. This framework provides a structured way to understand what employees value and where improvement is needed. Its usefulness will depend on careful data collection and honest interpretation.</p></section>
        <section id="appendix"><h2>10. Questionnaire appendix</h2><p>Participation is voluntary and anonymous. Department (optional): {"Operations / Administration / Finance / HR / Sales & Marketing / IT / Other / Prefer not to say"}.</p><p>Scale: {SCALE.map((s) => `${s.value} = ${s.label}`).join("; ")}; or Not applicable.</p><ol>{DIMENSIONS.map((d) => <li key={d.id}>{d.surveyQuestion}</li>)}</ol></section>
        <section id="references"><h2>11. References & source notes</h2><Notice>References have not been added. List only sources you have actually consulted, in your college's required citation style.</Notice><p>Suggested source types to consult: your prescribed Principles of Management textbook; texts on human resource management covering welfare; the original works of A. H. Maslow (1943) and F. Herzberg (1959); and relevant national labour legislation on employee welfare and social security.</p></section>
      </article>
    </div>
  );
}
