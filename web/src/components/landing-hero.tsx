"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  CircleCheck,
  FileText,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import { CareerOpsLogo } from "@/components/career-ops-logo";

const LOGIN_ROUTE = "/login";

const navItems = ["How it works", "Features", "Workflows", "Documentation"];

const flow = [
  { title: "Your CV", subtitle: "cv.md", icon: FileText },
  { title: "AI Agent Analysis", subtitle: "Claude Code, Codex, Gemini", icon: Sparkles },
  { title: "Job Evaluation", subtitle: "Match and score", icon: ChartNoAxesCombined },
  { title: "Match Insights", subtitle: "Strengths, gaps, fit", icon: SearchCheck },
];

const strengths = ["React", "AI tooling", "System design"];
const gaps = ["Kubernetes", "Cloud infrastructure"];

export function LandingHero() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050403] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(242,140,40,0.14),transparent_34%),radial-gradient(circle_at_50%_88%,rgba(242,140,40,0.28),transparent_34%),linear-gradient(180deg,#050403_0%,#0b0704_58%,#120804_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[54rem] h-[22rem] w-[82rem] -translate-x-1/2 rounded-[100%] border border-orange-500/30 bg-orange-500/10 blur-sm" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="flex items-center gap-4 py-5 sm:py-7">
          <Link href={LOGIN_ROUTE} className="flex min-w-0 items-center gap-3" aria-label="Career-Ops sign in">
            <CareerOpsLogo size="sidebar" />
            <span className="text-lg font-semibold tracking-tight text-[#f5efe7] sm:text-xl">Career-Ops</span>
          </Link>

          <nav className="mx-auto hidden items-center gap-8 text-sm font-medium text-white/72 lg:flex">
            {navItems.map((item) => (
              <Link key={item} href={LOGIN_ROUTE} className="transition hover:text-white">
                {item}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              href={LOGIN_ROUTE}
              className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/88 transition hover:border-orange-300/60 hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href={LOGIN_ROUTE}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(242,140,40,0.26)] transition hover:bg-brand-200 sm:px-5"
            >
              Get Started <ArrowRight className="size-4" />
            </Link>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center pt-10 text-center sm:pt-14 lg:pt-20">
          <h1 className="max-w-[900px] font-display text-[40px] leading-[0.96] tracking-normal text-[#eee7db] sm:text-[52px] lg:text-[68px] 2xl:text-[76px]">
            Turn your AI coding agent into a{" "}
            <span className="text-brand">career search command center.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
            Career-Ops connects your CV, preferences, and AI tools to evaluate opportunities, rank roles,
            and help you focus your job search.
          </p>

          <div className="mt-8 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={LOGIN_ROUTE}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_70px_rgba(242,140,40,0.32)] transition hover:-translate-y-0.5 hover:bg-brand-200"
            >
              Start Building Your Career Pipeline <ArrowRight className="size-4" />
            </Link>
            <Link
              href={LOGIN_ROUTE}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/18 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/88 backdrop-blur transition hover:-translate-y-0.5 hover:border-orange-300/60 hover:text-white"
            >
              Explore Documentation <BookOpen className="size-4" />
            </Link>
          </div>

          <ProductPreview />
        </section>
      </div>
    </main>
  );
}

function ProductPreview() {
  return (
    <div className="relative mt-16 w-full pb-16 sm:mt-20 lg:pb-20">
      <div className="pointer-events-none absolute -inset-x-10 top-8 h-40 rounded-[100%] border-t border-orange-400/30 bg-[radial-gradient(ellipse_at_center,rgba(242,140,40,0.24),transparent_68%)]" />
      <div className="relative mx-auto grid min-h-[34rem] max-w-6xl overflow-hidden rounded-[28px] border border-orange-400/22 bg-[#090806]/88 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_120px_rgba(0,0,0,0.6)] backdrop-blur lg:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/8 bg-white/[0.025] p-5 lg:flex lg:flex-col">
          <CareerOpsLogo size="sidebar" />
          <nav className="mt-8 space-y-1 text-sm">
            {["Overview", "Find Roles", "Evaluate a Job", "Compare Jobs", "Job Scores", "Workflows"].map((item, index) => (
              <div
                key={item}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  index === 0 ? "bg-orange-500/13 text-white" : "text-white/58"
                }`}
              >
                {index === 0 ? <Sparkles className="size-4 text-brand" /> : <CircleCheck className="size-4 text-white/34" />}
                {item}
              </div>
            ))}
          </nav>
          <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.035] p-3">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-brand text-xs font-bold text-white">O</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Okaforo253</p>
                <p className="truncate text-xs text-white/42">okaforo253@gmail.com</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="grid min-w-0 gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:p-7">
          <div className="flex min-w-0 flex-col justify-center gap-4">
            {flow.map(({ title, subtitle, icon: Icon }, index) => (
              <div key={title} className="relative">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-orange-300/30 hover:bg-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <Icon className="size-5 text-brand" />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white">{title}</h3>
                      <p className="mt-1 truncate font-mono text-xs text-white/42">{subtitle}</p>
                    </div>
                  </div>
                </div>
                {index < flow.length - 1 && (
                  <div className="mx-auto h-7 w-px bg-gradient-to-b from-orange-300/30 to-white/12" />
                )}
              </div>
            ))}
          </div>

          <section className="min-w-0 rounded-2xl border border-white/10 bg-[#11100d]/92 p-5 shadow-2xl shadow-black/30 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#9fc56f]/20 bg-[#9fc56f]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fc56f]">
                  <CircleCheck className="size-3" /> Top match
                </span>
                <h2 className="mt-5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Senior Frontend Engineer
                </h2>
                <p className="mt-1 text-sm text-white/48">Remote · Full-time</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="font-mono text-4xl font-semibold text-[#9fc56f]">
                  4.8 <span className="text-lg text-white/55">/ 5</span>
                </div>
                <p className="mt-1 text-xs text-white/46">Match score</p>
                <div className="mt-3 h-2 w-28 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[88%] rounded-full bg-[#9fc56f]" />
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <InsightCard title="Strengths" items={strengths} tone="green" />
              <InsightCard title="Gaps" items={gaps} tone="orange" />
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white">Why it is a good match</h3>
              <p className="mt-2 text-sm leading-6 text-white/56">
                Strong alignment with frontend depth, developer tooling, and systems thinking. The gaps are clear enough
                to target during preparation instead of guessing.
              </p>
            </div>

            <Link
              href={LOGIN_ROUTE}
              className="mt-6 flex min-h-12 items-center justify-between rounded-xl border border-white/8 bg-white/[0.04] px-4 text-sm font-semibold text-white/86 transition hover:border-orange-300/35 hover:bg-white/[0.07]"
            >
              View Full Evaluation <ArrowRight className="size-4" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, items, tone }: { title: string; items: string[]; tone: "green" | "orange" }) {
  const color = tone === "green" ? "text-[#9fc56f]" : "text-brand";
  return (
    <div className="min-w-0 rounded-xl border border-white/8 bg-white/[0.025] p-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex min-w-0 items-center gap-2 text-sm text-white/64">
            <CircleCheck className={`size-4 shrink-0 ${color}`} />
            <span className="min-w-0 truncate">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
