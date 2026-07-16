import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Code2,
  FileText,
  GitBranch,
  KeyRound,
  Layers3,
  Search,
  ShieldCheck,
  SquareTerminal,
} from "lucide-react";
import { CopyableCommand } from "@/components/copyable-command";
import { detectClis } from "@/lib/clis";
import { doctorState } from "@/lib/career-ops";
import { readServerEnv } from "@/lib/server-env";

const PROVIDERS = [
  { label: "Gemini", env: "GEMINI_API_KEY", note: "Gemini API and gateway-backed experiments." },
  { label: "OpenRouter", env: "OPENROUTER_API_KEY", note: "Model routing through OpenRouter." },
  { label: "OpenAI / Codex", env: "OPENAI_API_KEY", note: "OpenAI gateway calls and Codex-style providers." },
  { label: "Anthropic", env: "ANTHROPIC_API_KEY", note: "Claude-backed gateway calls." },
];

export function SetupDocs() {
  const doctor = doctorState();
  const clis = detectClis();
  const installed = clis.filter((cli) => cli.installed);
  const providers = PROVIDERS.map((provider) => ({
    ...provider,
    configured: Boolean(readServerEnv(provider.env)),
  }));

  return (
    <main className="doc-shell min-h-screen overflow-x-hidden bg-background">
      <section id="overview" className="scroll-mt-24 border-b border-border">
        <div className="doc-container py-12 lg:py-16">
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:items-end">
            <div className="min-w-0">
              <h1 className="doc-page-title max-w-3xl">
                Turn an AI coding agent into a job search command center.
              </h1>
              <p className="doc-subtitle mt-6 max-w-2xl text-base">
                Career-Ops is not a traditional hosted SaaS dashboard. The web app helps users sign in,
                add their CV, read setup instructions, and understand what to run next. The actual
                evaluation, scanning, CV tailoring, and report writing happen inside an AI agent or CLI.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#installation"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition hover:bg-brand-200"
                >
                  Start installation <ArrowRight className="size-4" />
                </a>
                <Link
                  href="/cv"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-brand/40 hover:text-brand"
                >
                  Open CV Profile <FileText className="size-4" />
                </Link>
              </div>
            </div>

            <div className="min-w-0 rounded-xl border border-border bg-surface/40 p-4 shadow-sm">
              <div className="rounded-lg border border-border bg-background/70 p-4">
                <p className="doc-label mb-3 text-muted">Quick install</p>
                <CopyableCommand command="npx @santifer/career-ops init" />
                <CopyableCommand command="cd career-ops" className="mt-2" />
                <CopyableCommand command="claude" className="mt-2" />
              </div>
              <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2">
                <MiniStatus ok={doctor.hasCv} label={doctor.hasCv ? "CV saved" : "CV needed"} />
                <MiniStatus ok={installed.length > 0} label={installed.length ? `${installed.length} agent tool(s)` : "Agent needed"} />
              </div>
            </div>
          </div>

          <div className="mt-12 grid min-w-0 gap-4 lg:grid-cols-3">
            <Principle icon={SquareTerminal} title="Agent-first" body="The browser explains and orchestrates. Claude Code, Codex, Gemini, OpenCode, or another CLI performs the real work." />
            <Principle icon={ShieldCheck} title="Local-first" body="For agent runs, the canonical data lives in the checkout: cv.md, config/profile.yml, modes/_profile.md, data, reports, and output." />
            <Principle icon={BarChart3} title="Decision-focused" body="Career-Ops ranks jobs against the user's CV and preferences, then recommends where time is worth spending." />
          </div>
        </div>
      </section>

      <div className="doc-container py-8">
        <DocSection
          id="installation"
          eyebrow="Getting Started"
          title="Installation"
          body="Install Career-Ops into a local project folder, then open that folder in the AI agent you want to use."
        >
          <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-2">
            <CommandCard
              title="Recommended installer"
              body="The fastest setup path for new users. It clones the latest release and installs dependencies."
              commands={["npx @santifer/career-ops init", "cd career-ops"]}
            />
            <CommandCard
              title="Manual source setup"
              body="Use this path when you are working from source or preparing the project for deployment work."
              commands={[
                "git clone https://github.com/santifer/career-ops.git",
                "cd career-ops && npm install",
                "npx playwright install chromium",
              ]}
            />
          </div>
        </DocSection>

        <DocSection
          id="environment-setup"
          eyebrow="Getting Started"
          title="Environment Setup"
          body="The core agent workflow expects a small set of local files. The web app reads the same project root so the docs, CV page, and agent workflow stay aligned."
        >
          <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <InfoCard
              icon={FileText}
              title="Required local files"
              items={[
                "cv.md - canonical CV used for evaluation and tailored PDF generation.",
                "config/profile.yml - name, location, targets, salary, and preferences.",
                "modes/_profile.md - user-specific scoring, narrative, and agent notes.",
                "portals.yml - role keywords, exclusions, and scanner sources.",
              ]}
            />
            <div className="min-w-0 rounded-xl border border-border bg-surface/40 p-5">
              <h3 className="doc-card-title">Current setup check</h3>
              <div className="mt-4 grid gap-2">
                <MiniStatus ok={doctor.hasCv} label={doctor.hasCv ? "cv.md is present" : "cv.md is missing"} />
                <MiniStatus ok={!doctor.onboardingNeeded} label={doctor.onboardingNeeded ? `Missing: ${doctor.missing.join(", ")}` : "Core setup files are present"} />
              </div>
              <p className="doc-body mt-4">
                The backend uses the Career-Ops root, not random browser state. In development, set
                CAREER_OPS_ROOT when the web app needs to point at a different checkout.
              </p>
            </div>
          </div>
        </DocSection>

        <DocSection
          id="connect-your-agent"
          eyebrow="Getting Started"
          title="Connect Your Agent"
          body="Open the Career-Ops folder inside your AI coding agent. Slash commands may work in some agents; plain-language prompts work across the supported CLIs."
        >
          <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <SetupCard
              icon={SquareTerminal}
              title="Claude Code"
              status={installed.some((cli) => cli.id === "claude") ? "Detected" : "Recommended"}
              commands={["claude", "Run career-ops scan mode"]}
            />
            <SetupCard
              icon={Code2}
              title="Codex"
              status={installed.some((cli) => cli.id === "codex") ? "Detected" : "Prompt mode"}
              commands={["codex", 'codex exec "Run career-ops pipeline mode"']}
            />
            <SetupCard
              icon={Layers3}
              title="OpenCode / Gemini"
              status={installed.some((cli) => cli.id === "opencode" || cli.id === "gemini") ? "Detected" : "Optional"}
              commands={['opencode run "Evaluate this job with career-ops"', 'gemini -p "Run career-ops scan mode"']}
            />
          </div>
        </DocSection>

        <DocSection
          id="find-roles"
          eyebrow="Using Career-Ops"
          title="Find Roles"
          body="The scanner is a zero-token discovery path. It checks configured ATS and job-board sources, filters by portals.yml, and writes new links into data/pipeline.md."
        >
          <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <CommandCard
              title="Agent prompt"
              body="Use this in Claude Code, Codex, Gemini CLI, OpenCode, or a supported agent."
              commands={["Run career-ops scan mode for junior mobile/frontend roles"]}
            />
            <CommandCard
              title="Direct script"
              body="Useful for local testing when you want to verify scanner behavior without a full agent run."
              commands={["node scan.mjs", "node scan.mjs --verify"]}
            />
          </div>
        </DocSection>

        <DocSection
          id="evaluate-a-job"
          eyebrow="Using Career-Ops"
          title="Evaluate a Job"
          body="A job URL or pasted JD triggers the auto-pipeline: read the posting, compare it with cv.md and profile files, write a report, and update the tracker."
        >
          <div className="grid min-w-0 items-stretch gap-4 xl:grid-cols-2">
            <Workflow title="URL evaluation" command="Evaluate this JD with career-ops auto-pipeline: https://company.com/jobs/123" />
            <Workflow title="Queued links" command="Run career-ops pipeline mode for data/pipeline.md" />
          </div>
          <Callout>
            Career-Ops never submits applications for the user. It evaluates, drafts, generates files, and stops before any final send or apply action.
          </Callout>
        </DocSection>

        <DocSection
          id="compare-jobs"
          eyebrow="Using Career-Ops"
          title="Compare Jobs"
          body="Use comparison mode when several evaluated or pasted roles need a decision. The agent can rank tradeoffs using the same profile and scoring context."
        >
          <div className="grid min-w-0 items-stretch gap-4 xl:grid-cols-2">
            <Workflow title="Compare evaluated offers" command="Run career-ops ofertas mode and compare the current evaluated roles" />
            <Workflow title="Rank a shortlist" command="Compare these job descriptions with career-ops and recommend the strongest match" />
          </div>
        </DocSection>

        <DocSection
          id="understand-job-scores"
          eyebrow="Using Career-Ops"
          title="Understand Job Scores"
          body="Scores are recommendations, not truth. The evaluation mode uses structured blocks, CV fit, preferences, compensation context, risks, and posting legitimacy."
        >
          <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-3">
            <Metric title="4.0-5.0" body="Strong fit. Usually worth applying if the role is active and aligns with deal-breakers." />
            <Metric title="3.0-3.9" body="Mixed fit. Review gaps, seniority, location, and compensation before spending time." />
            <Metric title="< 3.0" body="Usually skip. Career-Ops is built for quality targeting, not mass applications." />
          </div>
          <InfoCard
            icon={BarChart3}
            title="What a report usually contains"
            items={[
              "A-F evaluation blocks covering match, level, compensation, personalization, and interview prep.",
              "A posting-legitimacy check so scams, stale roles, and weak signals are called out.",
              "A machine summary used by downstream tracker and PDF workflows.",
            ]}
          />
        </DocSection>

        <DocSection
          id="common-workflows"
          eyebrow="Using Career-Ops"
          title="Common Workflows"
          body="These are the workflows users should run from their agent after setup."
        >
          <div className="grid min-w-0 gap-3">
            <Workflow title="Discover roles" command="Run career-ops scan mode and summarize new matches" />
            <Workflow title="Evaluate one job" command="Evaluate this JD with career-ops auto-pipeline: https://company.com/jobs/123" />
            <Workflow title="Process pipeline" command="Run career-ops pipeline mode for data/pipeline.md" />
            <Workflow title="Generate tailored CV" command="Run career-ops pdf mode for the latest evaluated role" />
            <Workflow title="Application email" command="Run career-ops email mode for the latest evaluated role" />
          </div>
        </DocSection>

        <DocSection
          id="api-keys"
          eyebrow="Configuration"
          title="API Keys"
          body="API keys belong in environment variables. The web app checks the same names the gateway status endpoint reads; production deployments should store them in the host's secret manager."
        >
          <div className="grid min-w-0 gap-3">
            {providers.map((provider) => (
              <ProviderRow key={provider.env} {...provider} />
            ))}
          </div>
          <Callout>
            Local env lookup checks web/.env.local, web/.env, project .env.local, and project .env. On Vercel or Render, use project environment variables instead of committing keys.
          </Callout>
        </DocSection>

        <DocSection
          id="cv-md-configuration"
          eyebrow="Configuration"
          title="CV.md Configuration"
          body="For local agent runs, cv.md is the canonical user profile for scoring and CV generation. Signed-in web users keep their onboarding CV separate so one account never sees another account's profile."
        >
          <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <InfoCard
              icon={FileText}
              title="What to include"
              items={[
                "Summary, experience, projects, education, and skills.",
                "Real proof points only. The agent can rephrase keywords, but should not invent claims.",
                "Mobile, frontend, internship, and junior role targeting should live in profile/config files too.",
              ]}
            />
            <CommandCard
              title="Open CV editor"
              body="The web app keeps this as a workspace page because users need a simple place to paste, review, and update their markdown CV."
              commands={["Open the CV Profile page from the sidebar", "Save your account CV"]}
            />
          </div>
        </DocSection>

        <DocSection
          id="agent-instructions"
          eyebrow="Configuration"
          title="Agent Instructions"
          body="Career-Ops is driven by project instructions and mode files. The agent reads AGENTS.md, the CLI wrappers, and the relevant mode file for the requested workflow."
        >
          <InfoCard
            icon={BookOpen}
            title="Instruction files"
            items={[
              "AGENTS.md contains the canonical rules and data contract.",
              "CODEX.md, CLAUDE.md, OPENCODE.md, and related wrappers point supported agents at the same rules.",
              ".agents/skills/career-ops/SKILL.md routes prompts such as scan, pipeline, pdf, tracker, and auto-pipeline.",
              "modes/*.md contain the detailed workflow instructions for evaluation, PDF, scan, email, cover, and more.",
            ]}
          />
        </DocSection>

        <DocSection
          id="supported-agents"
          eyebrow="Configuration"
          title="Supported Agents"
          body="The web app detects common CLI binaries and can delegate headless runs to them. Claude Code is the strongest path for write-heavy evaluation flows."
        >
          <div className="grid min-w-0 gap-3">
            {clis.map((cli) => (
              <div key={cli.id} className="flex min-w-0 flex-col gap-2 overflow-hidden rounded-xl border border-border bg-surface/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="doc-card-title">{cli.name}</h3>
                  <p className="doc-code mt-1 truncate whitespace-nowrap text-muted" title={cli.run}>{cli.run}</p>
                </div>
                <span className={`inline-flex w-fit items-center rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${cli.installed ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-border bg-background/60 text-faint"}`}>
                  {cli.installed ? "Detected" : "Not detected"}
                </span>
              </div>
            ))}
          </div>
        </DocSection>

        <DocSection
          id="troubleshooting"
          eyebrow="Reference"
          title="Troubleshooting"
          body="Most issues come from missing local files, unauthenticated CLIs, misplaced environment variables, or expecting the web app to replace the agent."
        >
          <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-2">
            <Trouble title="The app says no CLI is connected" body="Install or sign in to Claude Code, Codex, Gemini CLI, OpenCode, or another supported agent. The web app detects binaries on PATH and common Windows install folders." />
            <Trouble title="Evaluation exits with an error" body="A full evaluation needs cv.md, a complete checkout, and an authenticated agent with file-write permission. Claude Code is the verified write-heavy path." />
            <Trouble title="API key still shows missing" body="Put the key in web/.env.local, web/.env, project .env.local, project .env, or the deployment platform environment variables. Restart the server after changing env files." />
            <Trouble title="PDF generation fails" body="Install Chromium for Playwright with npx playwright install chromium, then retry the pdf workflow from the project root." />
          </div>
        </DocSection>

        <DocSection
          id="about-career-ops"
          eyebrow="Reference"
          title="About Career-Ops"
          body="Career-Ops is an open-source, local-first job search system. It was designed to evaluate fewer jobs more carefully, tailor CVs, and keep the user in control."
        >
          <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-3">
            <Principle icon={ShieldCheck} title="Human in the loop" body="The system drafts and recommends. The user reviews every application decision." />
            <Principle icon={Search} title="Quality over volume" body="Low-fit roles should be skipped. The point is not to spam employers." />
            <Principle icon={GitBranch} title="One source of truth" body="The CLI, scripts, reports, tracker, and web app all read from the same local project files." />
          </div>
        </DocSection>

        <footer className="mt-14 border-t border-border py-6 text-sm text-muted">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Career-Ops documentation</span>
            <div className="flex flex-wrap gap-3">
              <a href="#overview" className="hover:text-brand">Overview</a>
              <a href="#installation" className="hover:text-brand">Installation</a>
              <a href="#connect-your-agent" className="hover:text-brand">Agents</a>
              <a href="#troubleshooting" className="hover:text-brand">Troubleshooting</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function DocSection({
  id,
  eyebrow,
  title,
  body,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border py-12 last:border-b-0 lg:py-14">
      <p className="doc-label text-brand">{eyebrow}</p>
      <h2 className="doc-section-title mt-3">{title}</h2>
      <p className="doc-subtitle mt-4 max-w-3xl">{body}</p>
      <div className="mt-7 min-w-0">{children}</div>
    </section>
  );
}

function MiniStatus({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-muted">
      {ok ? <CheckCircle2 className="size-4 text-emerald-500" /> : <CircleAlert className="size-4 text-amber-500" />}
      <span className="min-w-0 truncate">{label}</span>
    </div>
  );
}

function CommandCard({ title, body, commands }: { title: string; body: string; commands: string[] }) {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface/40 p-5">
      <h3 className="doc-card-title">{title}</h3>
      <p className="doc-body mt-2">{body}</p>
      <div className="mt-5 space-y-2">
        {commands.map((command) => (
          <CopyableCommand key={command} command={command} />
        ))}
      </div>
    </div>
  );
}

function SetupCard({
  icon: Icon,
  title,
  status,
  commands,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  status: string;
  commands: string[];
}) {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface/40 p-5">
      <div className="flex items-center justify-between gap-3">
        <Icon className="size-5 text-brand" />
        <span className="rounded-full border border-border bg-background/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
          {status}
        </span>
      </div>
      <h3 className="doc-card-title mt-4">{title}</h3>
      <div className="mt-5 space-y-2">
        {commands.map((command) => (
          <CopyableCommand key={command} command={command} />
        ))}
      </div>
    </div>
  );
}

function Workflow({ title, command }: { title: string; command: string }) {
  return (
    <div className="grid min-w-0 gap-3 overflow-hidden rounded-xl border border-border bg-surface/40 p-4 md:grid-cols-[minmax(8rem,12rem)_minmax(0,1fr)] md:items-center">
      <div className="doc-card-title min-w-0">{title}</div>
      <div className="min-w-0">
        <CopyableCommand command={command} />
      </div>
    </div>
  );
}

function Principle({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="h-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface/40 p-5">
      <Icon className="size-5 text-brand" />
      <h3 className="doc-card-title mt-4">{title}</h3>
      <p className="doc-body mt-2">{body}</p>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  items,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  items: string[];
}) {
  return (
    <div className="h-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface/40 p-5">
      <Icon className="size-5 text-brand" />
      <h3 className="doc-card-title mt-4">{title}</h3>
      <ul className="doc-body mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex min-w-0 gap-2">
            <CheckCircle2 className="mt-1 size-3.5 shrink-0 text-brand" />
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Metric({ title, body }: { title: string; body: string }) {
  return (
    <div className="h-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface/40 p-5">
      <div className="font-mono text-xl font-semibold text-brand">{title}</div>
      <p className="doc-body mt-2">{body}</p>
    </div>
  );
}

function ProviderRow({
  label,
  env,
  note,
  configured,
}: {
  label: string;
  env: string;
  note: string;
  configured: boolean;
}) {
  return (
    <div className="grid min-w-0 gap-3 overflow-hidden rounded-xl border border-border bg-surface/40 p-4 md:grid-cols-[minmax(8rem,12rem)_minmax(0,1fr)_auto] md:items-center">
      <div className="doc-card-title min-w-0">{label}</div>
      <div className="min-w-0">
        <code className="doc-code inline-block max-w-full truncate rounded-md bg-background/70 px-2 py-1 text-brand" title={env}>{env}</code>
        <p className="doc-body mt-2">{note}</p>
      </div>
      <span className={`inline-flex w-fit items-center rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${configured ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-amber-500/30 bg-amber-500/10 text-amber-500"}`}>
        {configured ? "Configured" : "Missing env"}
      </span>
    </div>
  );
}

function Trouble({ title, body }: { title: string; body: string }) {
  return (
    <div className="h-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface/40 p-5">
      <h3 className="doc-card-title">{title}</h3>
      <p className="doc-body mt-2">{body}</p>
    </div>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="doc-body mt-5 rounded-xl border border-brand/30 bg-brand-soft p-4">
      {children}
    </div>
  );
}
