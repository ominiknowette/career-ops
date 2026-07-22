"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChartNoAxesColumn,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Search,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { BrandLogo } from "@/components/autojobserve/brand";
import { cn } from "@/lib/cn";

type AuthMode = "login" | "signup";
type FormErrors = Record<string, string>;

const benefits = [
  {
    icon: Search,
    title: "Find Better Opportunities",
    description: "AI matches you with jobs that fit your skills and career goals.",
  },
  {
    icon: Send,
    title: "Apply Smarter, Save Time",
    description: "Auto Apply to matching jobs while you focus on preparing for interviews.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "Track Everything",
    description: "Manage and track all your applications from one beautiful dashboard.",
  },
  {
    icon: Bell,
    title: "Get Notified",
    description: "Instant alerts for new job matches and application updates.",
  },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Help Center", href: "/help" },
];

type AuthPageProps = {
  defaultMode?: AuthMode;
};

export function AutoJobServeAuthPage({ defaultMode = "login" }: AuthPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modeFromUrl = searchParams.get("mode");
  const [mode, setMode] = useState<AuthMode>(modeFromUrl === "signup" ? "signup" : modeFromUrl === "login" ? "login" : defaultMode);

  useEffect(() => {
    const nextMode = modeFromUrl === "signup" ? "signup" : modeFromUrl === "login" ? "login" : defaultMode;
    setMode(nextMode);
  }, [defaultMode, modeFromUrl]);

  function setAuthMode(nextMode: AuthMode) {
    setMode(nextMode);
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", nextMode);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_58%_35%,rgba(125,82,255,0.10),transparent_42%),linear-gradient(180deg,#FCFBFF_0%,#F8F4FF_100%)] text-[#0D1530]">
      <div className="grid min-h-screen lg:grid-cols-[49%_51%]">
        <AuthBrandPanel />
        <section className="flex min-w-0 flex-col items-center px-5 py-8 sm:px-8 lg:justify-start lg:px-10 lg:py-11">
          <AuthCard mode={mode} onModeChange={setAuthMode} />
          <AuthSecurityFooter />
        </section>
      </div>
    </main>
  );
}

function AuthBrandPanel() {
  return (
    <section className="relative min-w-0 overflow-hidden px-5 pb-6 pt-8 sm:px-10 lg:min-h-screen lg:px-[58px] lg:pb-[50px] lg:pt-[47px]">
      <div className="block">
        <BrandLogo variant="monogram" size="md" />
      </div>

      <div className="mt-12 inline-flex h-[30px] items-center rounded-full bg-[#EEE7FF] px-[13px] text-[13px] font-semibold text-[#6F3BE8] lg:mt-[62px]">
        Your Career. Our Intelligence.
      </div>

      <h1 className="mt-6 max-w-[470px] text-[42px] font-[780] leading-[1.14] tracking-[-1.7px] text-[#0C142B] sm:text-5xl lg:mt-7">
        Your career journey
        <br />
        <span className="bg-[linear-gradient(90deg,#6D3BF5_0%,#9345F4_100%)] bg-clip-text text-transparent">starts here.</span>
      </h1>

      <p className="mt-5 max-w-[410px] text-base leading-[1.6] text-[#59627A]">
        AutoJobServe helps you discover the right opportunities, apply smarter, and manage your job search effortlessly.
      </p>

      <div className="mt-10 grid max-w-[460px] gap-5 sm:grid-cols-2 lg:mt-9 lg:block lg:space-y-[25px]">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-4">
            <span className="grid size-[54px] shrink-0 place-items-center rounded-full bg-[#F0E9FF] text-[#7541EE]">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-0.5">
              <h2 className="text-sm font-bold text-[#11182D]">{title}</h2>
              <p className="mt-1 max-w-[330px] text-[13px] leading-[1.45] text-[#59627A]">{description}</p>
            </div>
          </div>
        ))}
      </div>

      <AuthDashboardPreview />
    </section>
  );
}

function AuthDashboardPreview() {
  return (
    <div className="pointer-events-none absolute bottom-[72px] left-[87px] hidden h-[345px] w-[478px] lg:block">
      <div className="absolute -bottom-16 -left-24 h-64 w-[680px] rounded-[100%] bg-[#E9DAFF]/60 blur-xl" />
      <div className="absolute right-0 top-[-70px] grid size-16 place-items-center rounded-full bg-white text-[#7541EE] shadow-[0_20px_55px_rgba(35,23,79,0.09)]">
        <BriefcaseBusiness className="size-7" />
      </div>
      <div className="absolute -right-8 bottom-[88px] grid size-16 place-items-center rounded-full bg-white text-[#7541EE] shadow-[0_20px_55px_rgba(35,23,79,0.09)]">
        <BarChart3 className="size-7" />
      </div>

      <div className="relative grid h-full overflow-hidden rounded-[18px] border border-[#E3E5EE] bg-white shadow-[0_20px_55px_rgba(35,23,79,0.09),0_3px_12px_rgba(35,23,79,0.05)]">
        <div className="grid grid-cols-[50px_minmax(0,1fr)]">
          <aside className="bg-[#F7F3FF]">
            <div className="grid h-[58px] place-items-center bg-[linear-gradient(180deg,#8A35F5,#6D3BF5)] text-white">
              <span className="text-2xl font-black">A</span>
            </div>
            <div className="flex flex-col items-center gap-4 py-6 text-[#9CA1BC]">
              <BriefcaseBusiness className="size-4" />
              <Search className="size-4" />
              <BarChart3 className="size-4" />
              <Bell className="size-4" />
            </div>
          </aside>
          <div className="min-w-0 p-5">
            <p className="text-xs font-bold text-[#11182D]">Dashboard</p>
            <div className="mt-5 rounded-xl border border-[#E9E7F2] bg-white p-4">
              <p className="text-xs font-semibold text-[#0D1530]">Welcome back, David</p>
              <p className="mt-1 text-[10px] text-[#7C849B]">Let us achieve your career goals today.</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  ["Applications", "24"],
                  ["Interviews", "5"],
                  ["Shortlisted", "3"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-[#FAF8FF] p-3">
                    <p className="text-[9px] text-[#7C849B]">{label}</p>
                    <p className="mt-1 text-lg font-bold text-[#11182D]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E9E7F2] bg-white p-4">
                <p className="text-[10px] font-bold text-[#11182D]">Recommended Jobs</p>
                <div className="mt-3 rounded-lg bg-[#FAF8FF] p-3">
                  <p className="text-[10px] font-semibold">Senior Frontend Developer</p>
                  <p className="mt-1 text-[9px] text-[#7C849B]">94% Match</p>
                </div>
              </div>
              <div className="rounded-xl border border-[#E9E7F2] bg-white p-4">
                <p className="text-[10px] font-bold text-[#11182D]">Recent Activity</p>
                <p className="mt-3 text-[9px] leading-5 text-[#7C849B]">Applied to Google<br />Interview with Microsoft<br />Profile viewed by Acme Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthCard({ mode, onModeChange }: { mode: AuthMode; onModeChange: (mode: AuthMode) => void }) {
  return (
    <div className="w-full max-w-[592px] rounded-[20px] border border-[rgba(218,220,230,0.92)] bg-white/90 px-5 py-8 shadow-[0_20px_55px_rgba(35,23,79,0.09),0_3px_12px_rgba(35,23,79,0.05)] backdrop-blur-md sm:px-10 sm:py-12 lg:min-h-[986px] lg:px-14 lg:py-[65px]">
      <div className="text-center">
        <h2 className="text-[27px] font-[780] tracking-[-0.04em] text-[#0D1530]">
          {mode === "login" ? "Welcome back!" : "Create your account"}
        </h2>
        <p className="mt-3 text-base text-[#5E667E]">
          {mode === "login" ? "Sign in to continue your job search journey" : "Start building a smarter job search today"}
        </p>
      </div>

      <div role="tablist" aria-label="Authentication mode" className="mt-12 grid h-[55px] grid-cols-2 border-b border-[#E2E4EC]">
        <AuthTab active={mode === "login"} onClick={() => onModeChange("login")}>
          Sign In
        </AuthTab>
        <AuthTab active={mode === "signup"} onClick={() => onModeChange("signup")}>
          Create Account
        </AuthTab>
      </div>

      {mode === "login" ? <LoginForm onModeChange={onModeChange} /> : <SignupForm onModeChange={onModeChange} />}
    </div>
  );
}

function AuthTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative text-base font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7545F5]",
        active ? "text-[#6E39EC]" : "text-[#646C82]",
      )}
    >
      {children}
      {active && <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-[#6E39EC]" />}
    </button>
  );
}

function LoginForm({ onModeChange }: { onModeChange: (mode: AuthMode) => void }) {
  const [values, setValues] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [notice, setNotice] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    handleSupabaseLogin(values, setNotice);
  }

  return (
    <form onSubmit={submit} noValidate className="mt-9">
      <div className="space-y-7">
        <TextField
          id="login-email"
          label="Email Address"
          type="email"
          icon={Mail}
          value={values.email}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
          onChange={(email) => setValues((current) => ({ ...current, email }))}
        />
        <TextField
          id="login-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          value={values.password}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password}
          onChange={(password) => setValues((current) => ({ ...current, password }))}
          trailing={
            <PasswordToggle
              visible={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
              label={showPassword ? "Hide password" : "Show password"}
            />
          }
        />
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <label className="flex min-w-0 items-center gap-3 text-sm font-semibold text-[#11182D]">
          <input
            type="checkbox"
            checked={values.remember}
            onChange={(event) => setValues((current) => ({ ...current, remember: event.target.checked }))}
            className="size-5 rounded border-[#D9DDE8] accent-[#6D3BF5]"
          />
          Remember me
        </label>
        <button type="button" className="text-sm font-semibold text-[#6F37ED] transition hover:text-[#5826DA]">
          Forgot password?
        </button>
      </div>

      {notice && <p className="mt-5 rounded-lg bg-[#F7F3FF] px-3 py-2 text-sm text-[#6D3BF5]">{notice}</p>}

      <button
        type="submit"
        className="mt-8 h-[54px] w-full rounded-md bg-[linear-gradient(105deg,#6236E8_0%,#6D3BF5_48%,#8D34F2_100%)] text-base font-bold text-white shadow-[0_10px_24px_rgba(101,53,226,0.20)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7545F5]"
      >
        Sign In
      </button>

      <SocialAuthGroup modeLabel="continue" onNotice={setNotice} />

      <p className="mt-7 text-center text-base text-[#687087]">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={() => onModeChange("signup")} className="font-semibold text-[#7039ED] hover:text-[#5826DA]">
          Create Account
        </button>
      </p>
    </form>
  );
}

function SignupForm({ onModeChange }: { onModeChange: (mode: AuthMode) => void }) {
  const [values, setValues] = useState({ fullName: "", email: "", password: "", confirmPassword: "", consent: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [notice, setNotice] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    const nextErrors = validateSignup(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    handleSupabaseSignup(values, setNotice);
  }

  return (
    <form onSubmit={submit} noValidate className="mt-8">
      <div className="space-y-5">
        <TextField
          id="signup-full-name"
          label="Full Name"
          type="text"
          icon={User}
          value={values.fullName}
          placeholder="Enter your full name"
          autoComplete="name"
          error={errors.fullName}
          onChange={(fullName) => setValues((current) => ({ ...current, fullName }))}
        />
        <TextField
          id="signup-email"
          label="Email Address"
          type="email"
          icon={Mail}
          value={values.email}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
          onChange={(email) => setValues((current) => ({ ...current, email }))}
        />
        <TextField
          id="signup-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          value={values.password}
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password}
          onChange={(password) => setValues((current) => ({ ...current, password }))}
          trailing={
            <PasswordToggle
              visible={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
              label={showPassword ? "Hide password" : "Show password"}
            />
          }
        />
        <TextField
          id="signup-confirm-password"
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          icon={Lock}
          value={values.confirmPassword}
          placeholder="Confirm your password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          onChange={(confirmPassword) => setValues((current) => ({ ...current, confirmPassword }))}
          trailing={
            <PasswordToggle
              visible={showConfirm}
              onClick={() => setShowConfirm((visible) => !visible)}
              label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            />
          }
        />
      </div>

      <div className="mt-5">
        <label className="flex items-start gap-3 text-sm leading-6 text-[#59627A]">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(event) => setValues((current) => ({ ...current, consent: event.target.checked }))}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "signup-consent-error" : undefined}
            className="mt-0.5 size-5 rounded border-[#D9DDE8] accent-[#6D3BF5]"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="font-semibold text-[#7039ED]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-[#7039ED]">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.consent && (
          <p id="signup-consent-error" className="mt-2 text-sm text-red-600">
            {errors.consent}
          </p>
        )}
      </div>

      {notice && <p className="mt-5 rounded-lg bg-[#F7F3FF] px-3 py-2 text-sm text-[#6D3BF5]">{notice}</p>}

      <button
        type="submit"
        className="mt-7 h-[54px] w-full rounded-md bg-[linear-gradient(105deg,#6236E8_0%,#6D3BF5_48%,#8D34F2_100%)] text-base font-bold text-white shadow-[0_10px_24px_rgba(101,53,226,0.20)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7545F5]"
      >
        Create Account
      </button>

      <SocialAuthGroup modeLabel="continue" onNotice={setNotice} />

      <p className="mt-7 text-center text-base text-[#687087]">
        Already have an account?{" "}
        <button type="button" onClick={() => onModeChange("login")} className="font-semibold text-[#7039ED] hover:text-[#5826DA]">
          Sign In
        </button>
      </p>
    </form>
  );
}

function TextField({
  id,
  label,
  type,
  icon: Icon,
  value,
  placeholder,
  autoComplete,
  error,
  onChange,
  trailing,
}: {
  id: string;
  label: string;
  type: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  placeholder: string;
  autoComplete: string;
  error?: string;
  onChange: (value: string) => void;
  trailing?: React.ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-[#11182D]">
        {label}
      </label>
      <div
        className={cn(
          "mt-3 flex h-[54px] items-center gap-3 rounded-md border bg-white px-4 transition focus-within:border-[#7545F5] focus-within:ring-4 focus-within:ring-[rgba(112,60,239,0.12)]",
          error ? "border-red-400" : "border-[#D9DDE8]",
        )}
      >
        <Icon className="size-5 shrink-0 text-[#7F879D]" aria-hidden="true" />
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-[#11182D] outline-none placeholder:text-[#7F879D]"
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordToggle({ visible, onClick, label }: { visible: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-9 shrink-0 place-items-center rounded-md text-[#7F879D] transition hover:bg-[#F7F3FF] hover:text-[#6D3BF5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7545F5]"
    >
      {visible ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
    </button>
  );
}

function SocialAuthGroup({ modeLabel, onNotice }: { modeLabel: string; onNotice: (notice: string) => void }) {
  const providers = useMemo(
    () => [
      { provider: "Google", label: "Continue with Google", mark: <GoogleMark /> },
      { provider: "LinkedIn", label: "Continue with LinkedIn", mark: <span className="text-xl font-bold text-[#0A66C2]">in</span> },
      { provider: "Apple", label: "Continue with Apple", mark: <AppleMark /> },
    ],
    [],
  );

  return (
    <>
      <div className="my-9 flex items-center gap-5">
        <div className="h-px flex-1 bg-[#E0E3EC]" />
        <span className="text-sm font-semibold text-[#687087]">or {modeLabel} with</span>
        <div className="h-px flex-1 bg-[#E0E3EC]" />
      </div>
      <div className="space-y-3">
        {providers.map(({ provider, label, mark }) => (
          <button
            key={provider}
            type="button"
            onClick={() => onNotice(`${provider} authentication is prepared for Supabase in Phase 2.`)}
            className="flex h-[51px] w-full items-center justify-center gap-4 rounded-md border border-[#DDE0E9] bg-white text-[15px] font-semibold text-[#11182D] transition hover:-translate-y-0.5 hover:border-[#CDBAFB] hover:bg-[#FCFBFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7545F5]"
          >
            <span className="grid size-6 place-items-center" aria-hidden="true">
              {mark}
            </span>
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.4 1.9c.1 1.1-.3 2.1-1.1 2.9-.8.9-1.8 1.4-2.9 1.3-.1-1.1.4-2.1 1.1-2.9.8-.8 1.9-1.4 2.9-1.3Zm3.4 15.6c-.5 1.1-.8 1.6-1.5 2.6-1 1.4-2.4 3.1-4.2 3.1-1.5 0-1.9-1-3.9-1-2.1 0-2.5 1-4 1-1.7 0-3.1-1.6-4.1-3C-.7 16.3-1 9.9 1.3 6.8c1.1-1.5 2.8-2.4 4.4-2.4 1.7 0 2.7 1 4.1 1 1.3 0 2.1-1 4.1-1 1.5 0 3.1.8 4.2 2.2-3.7 2-3.1 7.4.7 8.8-.3.8-.5 1.3-1 2.1Z"
      />
    </svg>
  );
}

function AuthSecurityFooter() {
  return (
    <footer className="mt-8 text-center">
      <p className="mx-auto flex max-w-[390px] items-start justify-center gap-3 text-[13px] leading-[1.45] text-[#667087]">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>Your data is secure with us. We never share your information with third parties.</span>
      </p>
      <nav aria-label="Legal links" className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[13px] font-semibold text-[#6F37ED]">
        {legalLinks.map((link, index) => (
          <span key={link.label} className="inline-flex items-center gap-3">
            <Link href={link.href} className="hover:text-[#5826DA]">
              {link.label}
            </Link>
            {index < legalLinks.length - 1 && <span className="text-[#AAB0C2]" aria-hidden="true">•</span>}
          </span>
        ))}
      </nav>
    </footer>
  );
}

function validateLogin(values: { email: string; password: string }) {
  const errors: FormErrors = {};
  if (!values.email.trim()) errors.email = "Email address is required.";
  else if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!values.password.trim()) errors.password = "Password is required.";
  return errors;
}

function validateSignup(values: { fullName: string; email: string; password: string; confirmPassword: string; consent: boolean }) {
  const errors: FormErrors = {};
  if (!values.fullName.trim()) errors.fullName = "Full name is required.";
  if (!values.email.trim()) errors.email = "Email address is required.";
  else if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!values.password.trim()) errors.password = "Password is required.";
  else if (values.password.length < 8) errors.password = "Use at least 8 characters.";
  if (!values.confirmPassword.trim()) errors.confirmPassword = "Confirm your password.";
  else if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match.";
  if (!values.consent) errors.consent = "You must agree before creating an account.";
  return errors;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function handleSupabaseLogin(_values: { email: string; password: string; remember: boolean }, setNotice: (notice: string) => void) {
  setNotice("Validation passed. Supabase sign-in will be connected in Phase 2.");
}

function handleSupabaseSignup(
  _values: { fullName: string; email: string; password: string; confirmPassword: string; consent: boolean },
  setNotice: (notice: string) => void,
) {
  setNotice("Validation passed. Supabase account creation will be connected in Phase 2.");
}
