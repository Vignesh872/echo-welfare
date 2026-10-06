import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, BookOpen, Compass } from "lucide-react";
import hero from "@/assets/hero-workplace.jpg";
import { DIMENSIONS } from "@/lib/welfare-data";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welfare360 — Better Welfare. Better Workplaces." },
      { name: "description", content: "A Study on Employee Welfare Measures: an interactive Principles of Management project exploring eight welfare dimensions." },
      { property: "og:title", content: "Welfare360 — A Study on Employee Welfare Measures" },
      { property: "og:description", content: "Explore welfare dimensions, management links, a survey, insights and a full report framework." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const PATH = [
  { to: "/about", step: "01", title: "Understand the study", text: "Problem, objectives, scope and method." },
  { to: "/explorer", step: "02", title: "Explore the dimensions", text: "Eight areas of welfare in depth." },
  { to: "/management", step: "03", title: "Connect to management", text: "POSDC functions and motivation theory." },
  { to: "/survey", step: "04", title: "Take the survey", text: "Anonymous, saved on this device only." },
  { to: "/insights", step: "05", title: "Read the insights", text: "Charts, filters and CSV export." },
  { to: "/priority-lab", step: "06", title: "Prioritise initiatives", text: "A transparent classroom exercise." },
  { to: "/report", step: "07", title: "Read the report", text: "The full academic framework." },
] as const;

function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="eyebrow">Principles of Management · College Project</p>
          <h1 className="mt-4 text-5xl leading-[1.05] text-primary md:text-7xl">
            Better Welfare.<br /><em className="text-gold not-italic md:italic">Better Workplaces.</em>
          </h1>
          <p className="mt-6 font-display text-xl text-foreground md:text-2xl">A Study on Employee Welfare Measures</p>
          <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
            Employee welfare covers the facilities, services and benefits an organisation provides — beyond wages — to support the
            health, security and quality of working life of its people.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/explorer" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              <Compass className="h-4 w-4" aria-hidden /> Explore the Study
            </Link>
            <Link to="/insights" className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-accent">
              <BarChart3 className="h-4 w-4" aria-hidden /> View Insights
            </Link>
            <Link to="/report" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-primary underline-offset-4 hover:underline">
              <BookOpen className="h-4 w-4" aria-hidden /> Read the Report
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gold-soft/60 rotate-2" aria-hidden />
          <img src={hero} width={1024} height={1152} alt="Illustration of employees collaborating in a bright, plant-filled workplace"
            className="w-full rounded-[1.75rem] object-cover shadow-lift" />
        </div>
      </section>

      <section className="bg-emerald-gradient text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <p className="eyebrow">The welfare wheel</p>
            <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">Eight dimensions of employee welfare</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-primary-foreground/15 md:grid-cols-4">
            {DIMENSIONS.map((d, i) => (
              <Link key={d.id} to="/explorer" search={{ d: d.id }}
                className="group bg-emerald-deep p-6 transition-colors hover:bg-primary">
                <span className="font-display text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
                <d.icon className="mt-4 h-7 w-7 text-gold transition-transform group-hover:scale-110" aria-hidden />
                <p className="mt-4 font-display text-lg leading-snug">{d.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <p className="eyebrow">Why it matters</p>
          <h2 className="mt-3 text-4xl text-primary">Welfare is a management choice, not an afterthought.</h2>
        </Reveal>
        <Reveal className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>Welfare measures shape how secure, healthy and valued employees feel. Some are required by law — such as safety provisions and social security — while others are voluntary choices that reflect an organisation's values.</p>
          <p>For managers, welfare connects to every core function: it must be <strong className="text-foreground">planned</strong>, <strong className="text-foreground">organised</strong>, supported through <strong className="text-foreground">staffing</strong>, communicated through <strong className="text-foreground">leadership</strong> and reviewed through <strong className="text-foreground">control</strong>.</p>
          <p>This study builds a framework to examine which measures employees value and where improvement may be needed — without assuming that welfare alone causes business results.</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5">
        <Reveal><p className="eyebrow">Your pathway</p><h2 className="mt-3 text-4xl text-primary">Move through the project</h2></Reveal>
        <ol className="mt-10 border-t border-border">
          {PATH.map((p) => (
            <li key={p.to}>
              <Link to={p.to} className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-border py-5 transition-colors hover:bg-muted/60 md:grid-cols-[4rem_1fr_1.4fr_auto] md:px-2">
                <span className="font-display text-2xl text-gold">{p.step}</span>
                <span className="font-display text-xl text-primary">{p.title}</span>
                <span className="hidden text-muted-foreground md:block">{p.text}</span>
                <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
