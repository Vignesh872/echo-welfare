import {
  HeartPulse, Wallet, Scale, GraduationCap, Brain, Building2, Award, Bus,
  type LucideIcon,
} from "lucide-react";

export type DimensionId =
  | "health" | "financial" | "balance" | "learning"
  | "mental" | "facilities" | "recognition" | "transport";

export type Category = "Statutory & safety" | "Economic" | "Personal growth" | "Social & environment";

export interface Dimension {
  id: DimensionId;
  name: string;
  short: string;
  icon: LucideIcon;
  category: Category;
  meaning: string;
  examples: string[];
  benefits: string[];
  challenges: string[];
  metric: string;
  surveyQuestion: string;
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "health", name: "Health and safety", short: "Health", icon: HeartPulse, category: "Statutory & safety",
    meaning: "Measures that protect employees' physical health and keep the workplace free from avoidable hazards — many of which are also legal obligations.",
    examples: ["Periodic medical check-ups", "First-aid rooms and trained first-aiders", "Protective equipment and safety training", "Group health insurance"],
    benefits: ["Fewer workplace injuries", "Lower absenteeism", "Greater sense of security"],
    challenges: ["Cost of insurance and equipment", "Ensuring consistent compliance across sites", "Low participation in voluntary health programmes"],
    metric: "Recorded incidents per 100 employees per year",
    surveyQuestion: "How satisfied are you with health and safety provisions at your workplace?",
  },
  {
    id: "financial", name: "Financial wellbeing", short: "Financial", icon: Wallet, category: "Economic",
    meaning: "Support that helps employees manage money, meet emergencies and plan for the future beyond basic wages.",
    examples: ["Provident fund and gratuity", "Salary advances or emergency loans", "Financial literacy workshops", "Subsidised canteen meals"],
    benefits: ["Reduced financial stress", "Improved retention", "Stronger employer trust"],
    challenges: ["Budget constraints", "Fair eligibility rules", "Awareness of available schemes"],
    metric: "Scheme uptake rate (% of eligible employees using at least one benefit)",
    surveyQuestion: "How satisfied are you with financial support and benefits offered?",
  },
  {
    id: "balance", name: "Work–life balance", short: "Balance", icon: Scale, category: "Personal growth",
    meaning: "Arrangements that allow employees to meet work responsibilities without sacrificing personal and family life.",
    examples: ["Flexible working hours", "Paid leave and parental leave", "Limits on overtime", "Hybrid or remote options where feasible"],
    benefits: ["Lower burnout", "Higher job satisfaction", "Better attraction of talent"],
    challenges: ["Coverage for operational roles", "Perceived unfairness between roles", "Measuring output rather than hours"],
    metric: "Average overtime hours per employee per month",
    surveyQuestion: "How satisfied are you with your ability to balance work and personal life?",
  },
  {
    id: "learning", name: "Learning and development", short: "Learning", icon: GraduationCap, category: "Personal growth",
    meaning: "Opportunities for employees to build skills, gain qualifications and progress in their careers.",
    examples: ["On-the-job training", "Sponsored certifications", "Mentoring programmes", "Internal job postings"],
    benefits: ["Skilled and adaptable workforce", "Career motivation", "Internal promotion pipeline"],
    challenges: ["Time away from work", "Linking training to real needs", "Retaining staff after training"],
    metric: "Average training hours per employee per year",
    surveyQuestion: "How satisfied are you with learning and career development opportunities?",
  },
  {
    id: "mental", name: "Mental wellbeing", short: "Mental", icon: Brain, category: "Personal growth",
    meaning: "Support for emotional and psychological health, including stress management and access to confidential help.",
    examples: ["Employee assistance / counselling programmes", "Stress-management sessions", "Manager training on wellbeing", "Quiet rooms"],
    benefits: ["Earlier support for stress", "Healthier team climate", "Reduced stigma"],
    challenges: ["Confidentiality concerns", "Stigma limiting use", "Hard-to-measure outcomes"],
    metric: "Confidential counselling usage rate (anonymised)",
    surveyQuestion: "How satisfied are you with support for your mental and emotional wellbeing?",
  },
  {
    id: "facilities", name: "Workplace facilities", short: "Facilities", icon: Building2, category: "Social & environment",
    meaning: "The physical amenities that make the working environment comfortable, hygienic and usable.",
    examples: ["Clean drinking water and restrooms", "Canteen and rest areas", "Adequate lighting and ventilation", "Crèche facilities"],
    benefits: ["Comfort and dignity at work", "Improved concentration", "Positive employer image"],
    challenges: ["Capital expenditure", "Maintenance over time", "Space limitations"],
    metric: "Facility maintenance requests resolved within 7 days (%)",
    surveyQuestion: "How satisfied are you with workplace facilities such as canteen, restrooms and rest areas?",
  },
  {
    id: "recognition", name: "Recognition and belonging", short: "Recognition", icon: Award, category: "Social & environment",
    meaning: "Practices that make employees feel valued, included and part of a respectful community.",
    examples: ["Employee-of-the-month and appreciation schemes", "Inclusive cultural celebrations", "Grievance-redressal mechanisms", "Team-building activities"],
    benefits: ["Higher morale", "Stronger commitment", "Healthier relationships"],
    challenges: ["Perceived favouritism", "Recognition becoming routine", "Including remote and shift workers"],
    metric: "Share of employees recognised at least once per quarter",
    surveyQuestion: "How satisfied are you with how your work is recognised and how included you feel?",
  },
  {
    id: "transport", name: "Transport and accessibility", short: "Transport", icon: Bus, category: "Economic",
    meaning: "Support that helps employees reach work safely and ensures the workplace is accessible to people with disabilities.",
    examples: ["Company buses or travel allowance", "Safe late-shift transport", "Ramps, lifts and accessible restrooms", "Parking facilities"],
    benefits: ["Punctuality and reduced travel stress", "Safety for late-shift staff", "Inclusion of employees with disabilities"],
    challenges: ["Route planning and cost", "Retrofitting older buildings", "Serving dispersed locations"],
    metric: "Average commute time reported by employees",
    surveyQuestion: "How satisfied are you with transport support and workplace accessibility?",
  },
];

export const CATEGORIES: Category[] = ["Statutory & safety", "Economic", "Personal growth", "Social & environment"];

export const MGMT_FUNCTIONS = [
  { id: "planning", name: "Planning", explanation: "Deciding in advance which welfare needs to address, setting objectives and allocating a welfare budget.", example: "HR reviews last year's survey and plans a health camp and a revised leave policy for the coming year." },
  { id: "organising", name: "Organising", explanation: "Creating structures, roles and resources to deliver welfare measures — e.g. a welfare committee or designated welfare officer.", example: "A cross-department welfare committee is formed with representatives from operations, HR and finance." },
  { id: "staffing", name: "Staffing", explanation: "Welfare supports attracting, retaining and developing the right people; staffing also ensures trained personnel run welfare programmes.", example: "Transport and crèche facilities are highlighted in recruitment to attract experienced candidates." },
  { id: "leading", name: "Leading", explanation: "Managers motivate and communicate; welfare signals care and supports a positive leadership climate.", example: "Supervisors are trained to notice signs of stress and refer employees to confidential counselling." },
  { id: "controlling", name: "Controlling", explanation: "Measuring welfare outcomes against objectives and taking corrective action.", example: "Quarterly review of incident rates and survey scores, with action points for low-scoring areas." },
] as const;

export const SCALE = [
  { value: 1, label: "Very dissatisfied" },
  { value: 2, label: "Dissatisfied" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Satisfied" },
  { value: 5, label: "Very satisfied" },
] as const;

export const DEPARTMENTS = ["Operations", "Administration", "Finance", "Human Resources", "Sales & Marketing", "IT", "Other", "Prefer not to say"];

export type Rating = 1 | 2 | 3 | 4 | 5 | "na";
export interface SurveyResponse {
  id: string;
  createdAt: string;
  department: string;
  answers: Record<DimensionId, Rating>;
}

/** Deterministic pseudo-random demo responses (clearly fictional). */
export function makeDemoData(): SurveyResponse[] {
  let seed = 42;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const bias: Record<DimensionId, number> = { health: 3.9, financial: 3.1, balance: 2.9, learning: 3.4, mental: 2.7, facilities: 3.7, recognition: 3.2, transport: 3.0 };
  const depts = DEPARTMENTS.slice(0, 6).concat("Prefer not to say");
  return Array.from({ length: 60 }, (_, i) => {
    const answers = {} as Record<DimensionId, Rating>;
    for (const d of DIMENSIONS) {
      if (rand() < 0.06) { answers[d.id] = "na"; continue; }
      const v = Math.round(bias[d.id] + (rand() - 0.5) * 2.6);
      answers[d.id] = Math.min(5, Math.max(1, v)) as Rating;
    }
    return { id: `demo-${i}`, createdAt: "2026-01-01T00:00:00.000Z", department: depts[Math.floor(rand() * depts.length)], answers };
  });
}

export interface Stats {
  count: number;
  average: number | null;
  favourablePct: number | null;
  validRatings: number;
  byDimension: { id: DimensionId; name: string; average: number | null; n: number; na: number }[];
  distribution: { rating: number; label: string; count: number }[];
}

export function computeStats(rows: SurveyResponse[]): Stats {
  let sum = 0, valid = 0, fav = 0;
  const dist = [0, 0, 0, 0, 0];
  const byDimension = DIMENSIONS.map((d) => {
    let s = 0, n = 0, na = 0;
    for (const r of rows) {
      const v = r.answers[d.id];
      if (v === "na" || v == null) { na++; continue; }
      s += v; n++; sum += v; valid++; dist[v - 1]++; if (v >= 4) fav++;
    }
    return { id: d.id, name: d.short, average: n ? s / n : null, n, na };
  });
  return {
    count: rows.length,
    average: valid ? sum / valid : null,
    favourablePct: valid ? (fav / valid) * 100 : null,
    validRatings: valid,
    byDimension,
    distribution: SCALE.map((s, i) => ({ rating: s.value, label: s.label, count: dist[i] })),
  };
}

export function toCSV(rows: SurveyResponse[]): string {
  const header = ["response_id", "department", ...DIMENSIONS.map((d) => d.id)];
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const lines = rows.map((r) => [r.id, r.department, ...DIMENSIONS.map((d) => String(r.answers[d.id] ?? ""))].map(esc).join(","));
  return [header.join(","), ...lines].join("\n");
}

export const DEFAULT_INITIATIVES = [
  { id: "i1", name: "Confidential counselling programme", need: 4, usefulness: 4, feasibility: 3 },
  { id: "i2", name: "Flexible start times", need: 4, usefulness: 3, feasibility: 4 },
  { id: "i3", name: "Annual health check-up camp", need: 3, usefulness: 4, feasibility: 4 },
  { id: "i4", name: "Skill certification sponsorship", need: 3, usefulness: 4, feasibility: 2 },
  { id: "i5", name: "Late-shift safe transport", need: 3, usefulness: 3, feasibility: 3 },
];
