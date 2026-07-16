"use client";

import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getRedirectResult, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { CheckCircle2, CircleUser, Eye, EyeOff, FileText, Loader2, LockKeyhole, Mail } from "lucide-react";
import { CareerOpsLogo } from "@/components/career-ops-logo";
import { cn } from "@/lib/cn";
import { writeStoredUser, writeUserCv } from "@/lib/browser-user";
import { getFirebaseAuth, googleProvider } from "@/lib/firebase/client";

const GOOGLE_AUTH_MODE_KEY = "career-ops:google-auth-mode";

function firstNameFromName(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

function firstNameFromEmail(email: string): string {
  const local = email.split("@")[0] || "there";
  return (
    local
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "there"
  );
}

function friendlyAuthError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err || "");
  const host = typeof window !== "undefined" ? window.location.hostname : "this domain";
  if (message.includes("auth/unauthorized-domain")) return `Google sign-in is blocked because ${host} is not an authorized Firebase domain. Add it in Firebase Authentication -> Settings -> Authorized domains.`;
  if (message.includes("auth/popup-blocked")) return "Your browser blocked the Google sign-in popup. Allow popups for this site and try again.";
  if (message.includes("auth/invalid-credential")) return "Email or password is incorrect.";
  if (message.includes("auth/email-already-in-use")) return "An account already exists with this email. Try signing in.";
  if (message.includes("auth/weak-password")) return "Use a stronger password with at least 6 characters.";
  if (message.includes("auth/popup-closed-by-user")) return "Google sign-in was closed before it finished.";
  if (message.includes("auth/operation-not-allowed")) return "This Firebase sign-in method is not enabled yet.";
  if (message.includes("auth/api-key-not-valid") || message.includes("auth/invalid-api-key")) return "Firebase API key is not valid. Check the values in web/.env.local or Vercel environment variables.";
  if (message.includes("auth/invalid-app-credential") || message.includes("auth/invalid-app-id")) return "Firebase app details look incorrect. Re-copy the web app config from Firebase project settings.";
  if (message.includes("auth/network-request-failed")) return "Network error while contacting Firebase. Check your connection and try again.";
  if (message.includes("Firebase client config is missing")) return message;
  return "Authentication failed. Check Firebase setup and try again.";
}

function goToDashboard() {
  window.location.assign("/dashboard");
}

export function SignupPanel() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cv, setCv] = useState("");
  const [currentFirstName, setCurrentFirstName] = useState("there");
  const [currentEmail, setCurrentEmail] = useState("");
  const [accountReady, setAccountReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [authLoading, setAuthLoading] = useState<"email" | "google" | "reset" | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const pendingMode = sessionStorage.getItem(GOOGLE_AUTH_MODE_KEY) as "signup" | "signin" | null;
    if (!pendingMode) return;

    let cancelled = false;
    setAuthLoading("google");
    getRedirectResult(getFirebaseAuth())
      .then((credential) => {
        if (cancelled) return;
        sessionStorage.removeItem(GOOGLE_AUTH_MODE_KEY);
        if (!credential?.user) return;
        rememberUser({
          address: credential.user.email || "google-user@example.com",
          name: credential.user.displayName || fullName,
        });
        goToDashboard();
      })
      .catch((err) => {
        if (cancelled) return;
        sessionStorage.removeItem(GOOGLE_AUTH_MODE_KEY);
        setError(friendlyAuthError(err));
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function rememberUser({ address = email, name = fullName }: { address?: string; name?: string } = {}) {
    const cleanEmail = address.trim() || "career-ops-user@example.com";
    const cleanName = name.trim();
    const firstName = cleanName ? firstNameFromName(cleanName) : firstNameFromEmail(cleanEmail);
    setCurrentFirstName(firstName);
    setCurrentEmail(cleanEmail);
    writeStoredUser({
      signedIn: true,
      name: cleanName,
      firstName,
      email: cleanEmail,
    });
  }

  async function continueWithAccount() {
    setError("");
    setNotice("");
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }
    if (mode === "signup" && !fullName.trim()) {
      setError("Enter your full name first.");
      return;
    }
    if (!password.trim() && mode === "signup") {
      setError("Create a password first.");
      return;
    }
    setAuthLoading("email");
    try {
      const auth = getFirebaseAuth();
      const credential =
        mode === "signup"
          ? await createUserWithEmailAndPassword(auth, email.trim(), password)
          : await signInWithEmailAndPassword(auth, email.trim(), password);
      if (mode === "signup") {
        await updateProfile(credential.user, { displayName: fullName.trim() });
      }
      rememberUser({ address: credential.user.email || email, name: credential.user.displayName || fullName });
      if (mode === "signin") goToDashboard();
      else setAccountReady(true);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setAuthLoading(null);
    }
  }

  async function submitCv() {
    setError("");
    if (!cv.trim()) {
      setError("Paste your cv.md content before submitting.");
      return;
    }
    setSaving(true);
    try {
      writeUserCv(currentEmail || email, cv);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save CV.");
    } finally {
      setSaving(false);
    }
  }

  async function googleLogin() {
    setError("");
    setNotice("");
    if (window.location.hostname === "127.0.0.1") {
      setError("Google sign-in needs an authorized Firebase domain. Open this app at http://localhost:3000, or add 127.0.0.1 in Firebase Authentication -> Settings -> Authorized domains.");
      return;
    }
    setAuthLoading("google");
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      sessionStorage.setItem(GOOGLE_AUTH_MODE_KEY, mode);
      const credential = await signInWithPopup(getFirebaseAuth(), googleProvider);
      sessionStorage.removeItem(GOOGLE_AUTH_MODE_KEY);
      rememberUser({
        address: credential.user.email || "google-user@example.com",
        name: credential.user.displayName || fullName,
      });
      goToDashboard();
    } catch (err) {
      sessionStorage.removeItem(GOOGLE_AUTH_MODE_KEY);
      setError(friendlyAuthError(err));
      setAuthLoading(null);
    }
  }

  async function resetPassword() {
    setError("");
    setNotice("");
    if (!email.trim()) {
      setError("Enter your email first, then request a reset link.");
      return;
    }
    setAuthLoading("reset");
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
      setNotice("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setAuthLoading(null);
    }
  }

  if (submitted) {
    return <SubmittedPage firstName={currentFirstName} />;
  }

  if (accountReady) {
    return (
      <CvOnboardingPage
        firstName={currentFirstName}
        cv={cv}
        setCv={setCv}
        error={error}
        saving={saving}
        onSubmit={submitCv}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-6 text-[#111111] sm:px-6 lg:grid lg:place-items-center">
      <div className="absolute left-6 top-5 lg:hidden">
        <CareerOpsLogo size="large" />
      </div>

      <section className="mx-auto mt-14 grid w-full max-w-5xl overflow-hidden rounded-[24px] border border-[#e8ded2] bg-white p-3 shadow-2xl shadow-black/10 sm:rounded-[28px] lg:mt-0 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="relative hidden min-h-[560px] overflow-hidden rounded-[22px] bg-[#080604] p-8 text-white lg:block">
          <div className="relative z-10 max-w-sm">
            <CareerOpsLogo size="large" />
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight">
              Turn your CV into a focused job search pipeline.
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/62">
              Add your markdown CV, connect your preferred agent, then scan, rank and track roles from one workspace.
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(180deg,transparent,#f97316_72%,#fff7ed)] opacity-90 blur-sm" />
          <div className="absolute bottom-0 left-16 h-64 w-16 bg-orange-500 blur-xl" />
          <div className="absolute bottom-0 left-32 h-80 w-20 bg-[#ffb15f] blur-2xl" />
          <div className="absolute bottom-0 left-56 h-48 w-14 bg-white/80 blur-xl" />
        </div>

        <div className="flex min-h-0 flex-col justify-center px-5 py-8 sm:min-h-[560px] sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-7 flex items-center justify-between">
              {!accountReady && (
                <div className="ml-auto rounded-full bg-[#f1e6dc] p-1 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className={cn("rounded-full px-3 py-1.5", mode === "signup" && "bg-white shadow-sm")}
                  >
                    Sign up
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className={cn("rounded-full px-3 py-1.5", mode === "signin" && "bg-white shadow-sm")}
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>

            <>
                <h2 className="text-3xl font-semibold tracking-tight">
                  {mode === "signup" ? "Get Started" : "Welcome back"}
                </h2>
                <p className="mt-2 text-sm text-[#8a8178]">
                  {mode === "signup"
                    ? "Create your account, then paste your cv.md to personalize career-ops."
                    : "Sign in to continue to the setup guide."}
                </p>

                <div className="mt-7 space-y-4 border-t border-[#eadfd5] pt-6">
                  {mode === "signup" && (
                    <Field icon={CircleUser} label="Full name">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="David Okafor"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-[#b3a79d]"
                      />
                    </Field>
                  )}
                  <Field icon={Mail} label="Your email">
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-[#b3a79d]"
                    />
                  </Field>
                  <Field icon={LockKeyhole} label={mode === "signup" ? "Create password" : "Password"}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="********"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-[#b3a79d]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="grid size-7 shrink-0 place-items-center rounded-md text-[#9a9087] transition hover:bg-[#f6eee7] hover:text-orange-600"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </Field>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => void resetPassword()}
                      disabled={authLoading === "reset"}
                      className="text-xs font-medium text-[#6f6259] underline underline-offset-2 transition hover:text-orange-600"
                    >
                      {authLoading === "reset" ? "Sending reset link..." : "Forgot password?"}
                    </button>
                  </div>
                  {notice && <p className="text-sm text-emerald-700">{notice}</p>}
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="button"
                    onClick={() => void continueWithAccount()}
                    disabled={authLoading !== null}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-600 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-500 disabled:opacity-60"
                  >
                    {authLoading === "email" && <Loader2 className="size-4 animate-spin" />}
                    {mode === "signup" ? "Create new account" : "Sign in"}
                  </button>
                </div>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#eadfd5]" />
                  <span className="text-xs text-[#9a9087]">Or sign in with</span>
                  <div className="h-px flex-1 bg-[#eadfd5]" />
                </div>

                <button
                  type="button"
                  onClick={() => void googleLogin()}
                  disabled={authLoading !== null}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#ded8d1] bg-white text-sm font-medium text-[#2a211a] shadow-sm transition hover:border-orange-300 hover:text-orange-600 disabled:opacity-60"
                >
                  {authLoading === "google" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <GoogleMark />
                  )}
                  Sign in with Google
                </button>

                <p className="mt-5 text-center text-xs text-[#8a8178]">
                  {mode === "signup" ? "Already have an account? " : "Need an account? "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                    className="font-semibold text-[#2a211a] underline underline-offset-2"
                  >
                    {mode === "signup" ? "Login" : "Create one"}
                  </button>
                </p>
              </>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[#8a8178]">{label}</span>
      <span className="flex h-12 items-center gap-2 rounded-md border border-[#eadfd5] bg-white px-3 focus-within:border-orange-400">
        <Icon className="size-4 text-[#9a9087]" />
        {children}
      </span>
    </label>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function CvOnboardingPage({
  firstName,
  cv,
  setCv,
  error,
  saving,
  onSubmit,
}: {
  firstName: string;
  cv: string;
  setCv: (value: string) => void;
  error: string;
  saving: boolean;
  onSubmit: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-6 text-[#111111] sm:px-6 lg:grid lg:place-items-center">
      <div className="absolute left-6 top-5">
        <CareerOpsLogo size="large" />
      </div>
      <section className="mx-auto mt-14 w-full max-w-3xl rounded-[24px] border border-[#e8ded2] bg-white p-5 shadow-2xl shadow-black/10 sm:rounded-[28px] sm:p-6 lg:mt-0 lg:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
            <FileText className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Profile setup</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome, {firstName}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#8a8178]">
              Paste your markdown CV so Career-Ops can personalize setup, search filters, and reports for your account.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <CvStep cv={cv} setCv={setCv} error={error} saving={saving} onSubmit={onSubmit} />
        </div>
      </section>
    </main>
  );
}

function CvStep({
  cv,
  setCv,
  error,
  saving,
  onSubmit,
}: {
  cv: string;
  setCv: (value: string) => void;
  error: string;
  saving: boolean;
  onSubmit: () => void;
}) {
  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Paste your cv.md</h2>
      <p className="mt-2 text-sm leading-6 text-[#8a8178]">
        Use the same markdown structure you would put in cv.md. You can edit this later from CV Profile.
      </p>
      <textarea
        value={cv}
        onChange={(event) => setCv(event.target.value)}
        placeholder="# Your Name&#10;&#10;## Summary&#10;..."
        spellCheck={false}
        className="mt-6 min-h-56 w-full resize-none rounded-lg border border-[#eadfd5] bg-white p-4 font-mono text-sm leading-6 outline-none transition focus:border-orange-400 sm:min-h-64"
      />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={onSubmit}
        disabled={saving}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-600 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-500 disabled:opacity-60"
      >
        {saving && <Loader2 className="size-4 animate-spin" />}
        Submit CV
      </button>
    </>
  );
}

function SubmittedPage({ firstName }: { firstName: string }) {
  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-6 text-[#111111] sm:px-6 lg:grid lg:place-items-center">
      <section className="mx-auto mt-16 w-full max-w-md rounded-[28px] border border-[#e8ded2] bg-white p-8 text-center shadow-2xl shadow-black/10 lg:mt-0">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="size-9" />
        </div>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">Submitted</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#8a8178]">
          Nice, {firstName}. Your CV has been saved for this account. You can now continue into the Career-Ops setup guide.
        </p>
        <a
          href="/dashboard"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-orange-600 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-500"
        >
          Open setup guide
        </a>
      </section>
    </main>
  );
}
