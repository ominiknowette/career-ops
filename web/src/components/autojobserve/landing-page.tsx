"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleCheck,
  ClipboardList,
  Heart,
  Home,
  Menu,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  SquareDot,
  Upload,
  Users,
  X,
  BarChart3,
} from "lucide-react";
import { BrandLogo, BriefcaseMark } from "@/components/autojobserve/brand";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Find Jobs", href: "#find-jobs" },
  { label: "Auto Apply", href: "#auto-apply" },
  { label: "For Employers", href: "#for-employers" },
  { label: "Resources", href: "#resources", hasChevron: true },
  { label: "Pricing", href: "#pricing" },
];

const featurePills = [
  { label: "AI Job Matching", icon: Sparkles },
  { label: "Auto Apply", icon: Send },
  { label: "Application Tracking", icon: SquareDot },
  { label: "Smart Insights", icon: BadgeCheck },
];

const metricCards = [
  {
    title: "Profile Strength",
    value: "85%",
    caption: "Strong",
    note: "Complete your profile to unlock more opportunities",
    kind: "progress",
  },
  {
    title: "Matches for You",
    value: "24",
    caption: "high match jobs",
    note: "+ 12 new today",
    kind: "number",
  },
  {
    title: "Auto Applied",
    value: "132",
    caption: "applications",
    note: "this month",
    kind: "number",
  },
];

const recentApplications = [
  { company: "Stripe", mark: "S", role: "Frontend Developer", location: "Remote", status: "Interview", time: "2h ago" },
  { company: "Google", mark: "G", role: "Junior Software Engineer", location: "Lagos, Nigeria", status: "Applied", time: "1d ago" },
  { company: "Paystack", mark: "A", role: "React Developer", location: "Remote", status: "Auto Applied", time: "2d ago" },
];

const companies = ["Google", "Microsoft", "paystack", "stripe", "interswitch", "Flutterwave"];

const stats = [
  { value: "25,000+", label: "Job Seekers", caption: "Trust AutoJobServe", icon: Users },
  { value: "15,000+", label: "Jobs Available", caption: "Updated Daily", icon: BriefcaseBusiness },
  { value: "132,000+", label: "Applications Sent", caption: "Through Auto Apply", icon: Send },
  { value: "8,500+", label: "Interviews Secured", caption: "and Counting", icon: BadgeCheck },
];

const sidebarIcons = [Settings, Home, Search, Send, CalendarDays, Heart, Bell, BarChart3, Settings];

export function AutoJobServeLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FCFBFF] text-[#0D1530]">
      <BackgroundTexture />
      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 sm:px-6">
        <header className="flex h-[92px] items-center gap-5" aria-label="Site header">
          <Link href="/" className="shrink-0" aria-label="AutoJobServe home">
            <BrandLogo />
          </Link>

          <nav className="mx-auto hidden items-center gap-10 text-sm font-semibold text-[#111522] lg:flex" aria-label="Primary">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="inline-flex items-center gap-1.5 transition hover:text-[#6D3BF5]">
                {item.label}
                {item.hasChevron && <ChevronDown className="size-3.5" aria-hidden="true" />}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-4 lg:flex">
            <Link
              href="/auth?mode=login"
              className="inline-flex h-[42px] items-center justify-center rounded-xl border border-[#E4DDF8] bg-white/45 px-5 text-sm font-semibold text-[#111522] transition hover:border-[#CDBAFB] hover:text-[#6D3BF5]"
            >
              Log in
            </Link>
            <Link
              href="/auth?mode=signup"
              className="inline-flex h-[42px] min-w-[142px] items-center justify-center rounded-[11px] bg-[linear-gradient(105deg,#6236E8_0%,#6D3BF5_48%,#8D34F2_100%)] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(101,53,226,0.20)] transition hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="ml-auto inline-flex size-11 items-center justify-center rounded-xl border border-[#E4DDF8] bg-white/70 text-[#10162A] shadow-sm lg:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </header>

        {menuOpen && (
          <div className="mb-6 rounded-[18px] border border-[#E4DDF8] bg-white/90 p-3 shadow-[0_20px_55px_rgba(35,23,79,0.09)] lg:hidden">
            <nav className="grid gap-1" aria-label="Mobile primary">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-[#59627A] transition hover:bg-[#F7F3FF] hover:text-[#6D3BF5]"
                >
                  {item.label}
                  {item.hasChevron && <ChevronDown className="size-4" aria-hidden="true" />}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid gap-2 border-t border-[#E3E5EE] pt-3 sm:grid-cols-2">
              <Link href="/auth?mode=login" className="rounded-xl border border-[#E4DDF8] bg-white px-4 py-3 text-center text-sm font-semibold">
                Log in
              </Link>
              <Link href="/auth?mode=signup" className="rounded-xl bg-[#6D3BF5] px-4 py-3 text-center text-sm font-bold text-white">
                Get Started Free
              </Link>
            </div>
          </div>
        )}

        <section id="find-jobs" className="grid min-h-[660px] items-center gap-10 py-10 lg:grid-cols-[47%_53%] lg:gap-7 lg:py-14">
          <div className="min-w-0">
            <div className="inline-flex h-8 items-center gap-2 rounded-full bg-[#F0E9FF] px-[13px] text-[13px] font-semibold text-[#6836E7]">
              <Sparkles className="size-3.5" aria-hidden="true" />
              AI-Powered Job Search & Auto Apply
            </div>

            <h1 className="mt-6 max-w-[550px] text-[43px] font-[790] leading-[1.08] tracking-[-1.8px] text-[#0C1327] sm:text-[54px] lg:text-[61px] lg:tracking-[-2.8px]">
              Stop Searching.
              <br />
              Start Getting
              <br />
              <span className="bg-[linear-gradient(90deg,#6D3BF5_0%,#9345F4_100%)] bg-clip-text text-transparent">Interviews.</span>
            </h1>

            <p className="mt-6 max-w-[525px] text-base font-[450] leading-[1.65] text-[#59627A]">
              AutoJobServe uses AI to match you with the right opportunities, apply on your behalf, and help you get hired faster.
            </p>

            <div id="auto-apply" className="mt-8 flex flex-wrap gap-3">
              {featurePills.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex h-[37px] items-center gap-2 rounded-full border border-[rgba(231,225,248,0.65)] bg-[rgba(249,247,255,0.9)] px-[13px] text-xs font-medium text-[#4E5570]"
                >
                  <Icon className="size-3.5 text-[#7143EC]" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-11 grid gap-4 sm:flex sm:items-center sm:gap-[26px]">
              <Link
                href="/auth?mode=signup"
                className="inline-flex h-[61px] items-center justify-center gap-3 rounded-[11px] bg-[linear-gradient(105deg,#6236E8_0%,#6D3BF5_48%,#8D34F2_100%)] px-8 text-base font-semibold text-white shadow-[0_10px_24px_rgba(101,53,226,0.20)] transition hover:-translate-y-0.5 sm:w-[221px]"
              >
                Get Started Free <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/auth?mode=signup&intent=cv-upload"
                className="inline-flex h-[61px] items-center justify-center gap-3 rounded-[11px] border border-[#D8DBE8] bg-white px-8 text-base font-semibold text-[#141A2D] transition hover:-translate-y-0.5 hover:border-[#CBBDF8] hover:text-[#6D3BF5] sm:w-[220px]"
              >
                Upload Your CV <Upload className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <SocialProof />
          </div>

          <DashboardShowcase />
        </section>

        <CompanyTrustRow />
        <StatisticsBar />
      </div>
    </main>
  );
}

function BackgroundTexture() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-20 -top-20 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(116,68,244,0.20)_0%,rgba(116,68,244,0.08)_38%,rgba(116,68,244,0)_72%)] blur-2xl" />
      <div className="absolute right-0 top-32 h-[640px] w-[720px] opacity-[0.16] [background-image:repeating-radial-gradient(ellipse_at_center,rgba(109,59,245,0.24)_0_1px,transparent_1px_22px)]" />
      <Sparkles className="absolute right-[8%] top-[13%] size-5 text-[#C7B6FF]" />
      <Sparkles className="absolute right-[13%] top-[21%] size-3 text-[#D9CBFF]" />
    </div>
  );
}

function SocialProof() {
  const avatarClasses = ["bg-[#C78F68]", "bg-[#8B5E4B]", "bg-[#E0B58E]", "bg-[#BA6247]", "bg-[#6B748F]"];
  return (
    <div className="mt-10 flex items-center gap-4">
      <div className="flex">
        {avatarClasses.map((className, index) => (
          <span
            key={className}
            className={cn("grid size-9 place-items-center rounded-full border-2 border-white text-[11px] font-bold text-white", index > 0 && "-ml-2", className)}
            aria-hidden="true"
          >
            {index + 1}
          </span>
        ))}
      </div>
      <p className="text-[13px] leading-normal text-[#4F5870]">
        <strong className="font-semibold text-[#2B334A]">Join 25,000+ job seekers</strong>
        <br />
        who are getting hired faster
      </p>
    </div>
  );
}

function DashboardShowcase() {
  return (
    <div className="relative mx-auto min-w-0 max-w-[660px] lg:ml-0">
      <div className="absolute -right-2 top-8 hidden h-[510px] w-[520px] rotate-[2.5deg] rounded-[18px] border border-white/80 bg-white/40 shadow-[0_30px_80px_rgba(91,50,197,0.10)] lg:block" />
      <div className="absolute -left-5 top-12 hidden h-[500px] w-[510px] -rotate-3 rounded-[18px] border border-white/70 bg-white/35 shadow-[0_30px_80px_rgba(91,50,197,0.08)] lg:block" />

      <div className="relative mx-auto grid w-full max-w-[610px] rotate-0 overflow-visible rounded-[18px] border border-white/90 bg-white/80 p-0 shadow-[0_30px_80px_rgba(91,50,197,0.16)] backdrop-blur-[18px] lg:-rotate-[1.8deg]">
        <div className="grid min-h-[520px] grid-cols-[52px_minmax(0,1fr)] overflow-hidden rounded-[18px] sm:grid-cols-[58px_minmax(0,1fr)]">
          <aside className="flex flex-col items-center gap-4 bg-[rgba(249,247,255,0.88)] py-6">
            {sidebarIcons.map((Icon, index) => (
              <span
                key={`${Icon.displayName ?? Icon.name}-${index}`}
                className={cn(
                  "grid size-8 place-items-center rounded-lg text-[#9CA1BC]",
                  index === 1 && "bg-[#EEE7FF] text-[#7441EF]",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
            ))}
          </aside>

          <div className="min-w-0 p-5 sm:p-7">
            <p className="text-xs font-semibold text-[#7C849B]">Good morning, David</p>
            <h2 className="mt-3 text-xl font-[760] text-[#0D1530]">Dashboard</h2>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {metricCards.map((metric) => (
                <MetricCard key={metric.title} metric={metric} />
              ))}
            </div>

            <div className="mt-8 rounded-[18px] bg-white/75 p-5 shadow-[0_12px_30px_rgba(95,53,210,0.08)]">
              <h3 className="text-xs font-bold text-[#232A42]">Recent Applications</h3>
              <div className="mt-4 space-y-4">
                {recentApplications.map((row) => (
                  <ApplicationRow key={`${row.company}-${row.role}`} row={row} />
                ))}
              </div>
              <Link
                href="/auth?mode=login"
                className="mx-auto mt-5 flex h-9 w-fit items-center justify-center gap-2 rounded-lg border border-[#DED3FF] px-4 text-xs font-semibold text-[#7441EF] transition hover:bg-[#F7F3FF]"
              >
                View All Applications <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <FloatingCards />
    </div>
  );
}

function MetricCard({ metric }: { metric: (typeof metricCards)[number] }) {
  return (
    <div className="min-w-0 rounded-[15px] bg-white/72 p-4 shadow-[0_12px_30px_rgba(95,53,210,0.08)]">
      <p className="text-[11px] font-medium text-[#7C849B]">{metric.title}</p>
      {metric.kind === "progress" ? (
        <div className="mt-4 flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-full bg-[conic-gradient(#7441EF_85%,#E8E1FF_0)]">
            <div className="grid size-10 place-items-center rounded-full bg-white text-xs font-bold text-[#0D1530]">{metric.value}</div>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#303752]">{metric.caption}</p>
            <p className="mt-1 text-[10px] leading-normal text-[#7C849B]">{metric.note}</p>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-4 text-3xl font-[760] tracking-[-0.05em] text-[#0D1530]">{metric.value}</p>
          <p className="mt-1 text-xs text-[#59627A]">{metric.caption}</p>
          <p className={cn("mt-2 text-[10px]", metric.note.startsWith("+") ? "text-[#20B66F]" : "text-[#7C849B]")}>{metric.note}</p>
        </>
      )}
    </div>
  );
}

function ApplicationRow({ row }: { row: (typeof recentApplications)[number] }) {
  const statusClass =
    row.status === "Auto Applied"
      ? "bg-[#E7FAF0] text-[#20B66F]"
      : row.status === "Interview"
        ? "bg-[#F0E9FF] text-[#7441EF]"
        : "bg-[#F7F3FF] text-[#7C849B]";

  return (
    <div className="grid min-w-0 grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3">
      <span className="grid size-8 place-items-center rounded-lg bg-[#7441EF] text-sm font-bold text-white">{row.mark}</span>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-[#1B2239]">{row.role}</p>
        <p className="mt-0.5 truncate text-[11px] text-[#7C849B]">
          {row.company} - {row.location}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={cn("rounded-full px-2 py-1 text-[10px] font-semibold", statusClass)}>{row.status}</span>
        <span className="hidden text-[10px] text-[#8E95AA] sm:inline">{row.time}</span>
      </div>
    </div>
  );
}

function FloatingCards() {
  return (
    <>
      <div className="absolute -right-3 top-[42%] hidden w-[164px] rounded-[15px] border border-white/80 bg-white/90 p-5 shadow-[0_22px_50px_rgba(99,63,199,0.16)] backdrop-blur md:block xl:-right-16">
        <p className="text-xs font-medium text-[#7C849B]">Match Score</p>
        <p className="mt-2 text-3xl font-[790] text-[#0D1530]">92%</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#DED3FF]">
          <div className="h-full w-[92%] rounded-full bg-[#7441EF]" />
        </div>
      </div>
      <div className="absolute -right-4 bottom-6 hidden w-[196px] rounded-2xl border border-white/80 bg-white/92 p-4 shadow-[0_22px_50px_rgba(99,63,199,0.16)] backdrop-blur md:block xl:-right-20">
        <div className="flex items-center justify-between">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D1530]">
            <Sparkles className="size-3.5 text-[#7441EF]" aria-hidden="true" />
            AI Assistant
          </p>
          <span className="text-[#C7B6FF]">+</span>
        </div>
        <p className="mt-3 rounded-xl border border-[#E4DAFF] bg-white px-3 py-3 text-xs leading-5 text-[#59627A]">
          Find me remote frontend jobs with salary $1.5k+
        </p>
        <Link href="/auth?mode=signup" className="mt-3 flex h-9 items-center justify-center gap-2 rounded-lg border border-[#DED3FF] text-xs font-semibold text-[#7441EF]">
          Ask AI Assistant <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}

function CompanyTrustRow() {
  return (
    <section id="resources" className="mx-auto mt-6 max-w-[880px] py-8 text-center">
      <p className="text-sm font-medium text-[#626A82]">Trusted by job seekers and top companies worldwide</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        {companies.map((company, index) => (
          <div key={company} className="flex items-center gap-8">
            <span className="text-xl font-[760] tracking-[-0.04em] text-[#8C78C8]/85">{company}</span>
            {index < companies.length - 1 && <span className="hidden size-1 rounded-full bg-[#B9A9E5] sm:block" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </section>
  );
}

function StatisticsBar() {
  return (
    <section id="pricing" className="pb-14">
      <div className="grid gap-5 rounded-[18px] border border-[rgba(229,224,244,0.80)] bg-white/90 p-6 shadow-[0_10px_30px_rgba(93,63,179,0.12)] sm:grid-cols-2 lg:grid-cols-4 lg:px-10 lg:py-8">
        {stats.map(({ value, label, caption, icon: Icon }) => (
          <div key={label} className="flex min-w-0 items-center gap-5">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#F1EAFF] text-[#7441EF]">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[25px] font-[760] leading-none tracking-[-0.04em] text-[#11182D]">{value}</p>
              <p className="mt-2 text-sm font-bold text-[#11182D]">{label}</p>
              <p className="mt-0.5 text-sm text-[#59627A]">{caption}</p>
            </div>
          </div>
        ))}
      </div>
      <div id="for-employers" className="sr-only" aria-hidden="true" />
    </section>
  );
}
