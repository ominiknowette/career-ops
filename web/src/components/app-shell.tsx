"use client";

import { type MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { CareerOpsLogo } from "@/components/career-ops-logo";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { JobsProvider } from "@/components/jobs/job-store";
import { PipelineProvider } from "@/components/pipeline/pipeline-provider";
import { ApplyProvider } from "@/components/apply/apply-provider";
import { ExploreProvider } from "@/components/explore/explore-provider";
import { UserBadge } from "@/components/user-badge";
import {
  DOC_NAV_GROUPS,
  DOC_SECTION_IDS,
  WORKSPACE_NAV_ITEMS,
  isWorkspaceActive,
} from "@/lib/nav-items";
import { clearStoredUser } from "@/lib/browser-user";
import { getFirebaseAuth } from "@/lib/firebase/client";

function getDocScrollRoot(): HTMLElement | null {
  const main = document.querySelector<HTMLElement>("[data-shell-main]");
  if (!main || !window.matchMedia("(min-width: 768px)").matches) return null;
  return main;
}

function currentSectionFromPosition(sections: HTMLElement[], root: HTMLElement | null) {
  if (!sections.length) return "";
  const rootTop = root ? root.getBoundingClientRect().top : 0;
  const activationLine = rootTop + (root ? root.clientHeight : window.innerHeight) * 0.22;

  let current = sections[0].id;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= activationLine) current = section.id;
  }
  return current;
}

function scrollToDocSection(id: string, behavior: ScrollBehavior = "smooth") {
  const section = document.getElementById(id);
  if (!section) return;

  const root = getDocScrollRoot();
  if (root) {
    const rootTop = root.getBoundingClientRect().top;
    const sectionTop = section.getBoundingClientRect().top;
    const headerOffset = 72;
    root.scrollTo({
      top: root.scrollTop + sectionTop - rootTop - headerOffset,
      behavior,
    });
    return;
  }

  section.scrollIntoView({ behavior, block: "start" });
}

function useActiveDocSection(pathname: string) {
  const [activeSection, setActiveSection] = useState(DOC_SECTION_IDS[0] ?? "");
  const isDocsPath = pathname === "/dashboard" || pathname === "/config";

  useEffect(() => {
    if (!isDocsPath) {
      setActiveSection("");
      return;
    }

    const sections = DOC_SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;

    let frame = 0;
    let hashTimer = 0;
    let observer: IntersectionObserver | null = null;

    const syncFromPosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = currentSectionFromPosition(sections, getDocScrollRoot());
        if (current) setActiveSection(current);
      });
    };

    const observe = () => {
      observer?.disconnect();
      const root = getDocScrollRoot();
      observer = new IntersectionObserver(
        () => syncFromPosition(),
        {
          root,
          rootMargin: "-20% 0px -60% 0px",
          threshold: [0, 0.1, 0.25, 0.5, 1],
        },
      );
      sections.forEach((section) => observer?.observe(section));
    };

    observe();
    syncFromPosition();

    const scrollRoot = getDocScrollRoot();
    scrollRoot?.addEventListener("scroll", syncFromPosition, { passive: true });
    window.addEventListener("scroll", syncFromPosition, { passive: true });
    window.addEventListener("resize", observe);
    window.addEventListener("hashchange", syncFromPosition);

    const hash = window.location.hash.replace("#", "");
    if (DOC_SECTION_IDS.includes(hash)) {
      setActiveSection(hash);
      requestAnimationFrame(() => scrollToDocSection(hash, "auto"));
      hashTimer = window.setTimeout(() => {
        scrollToDocSection(hash, "auto");
        setActiveSection(hash);
      }, 150);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hashTimer);
      observer?.disconnect();
      scrollRoot?.removeEventListener("scroll", syncFromPosition);
      window.removeEventListener("scroll", syncFromPosition);
      window.removeEventListener("resize", observe);
      window.removeEventListener("hashchange", syncFromPosition);
    };
  }, [isDocsPath]);

  useEffect(() => {
    if (!isDocsPath) return;

    const hash = window.location.hash.replace("#", "");
    if (!DOC_SECTION_IDS.includes(hash)) return;

    let attempts = 0;
    let timer = 0;

    const settleHashSection = () => {
      const section = document.getElementById(hash);
      if (!section && attempts < 20) {
        attempts += 1;
        timer = window.setTimeout(settleHashSection, 50);
        return;
      }

      if (!section) return;
      scrollToDocSection(hash, "auto");
      setActiveSection(hash);
    };

    timer = window.setTimeout(settleHashSection, 0);

    return () => window.clearTimeout(timer);
  }, [isDocsPath]);

  return [activeSection, setActiveSection] as const;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useActiveDocSection(pathname);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const authPage = pathname === "/" || pathname === "/login";

  const groups = useMemo(() => DOC_NAV_GROUPS, []);

  if (authPage) return <>{children}</>;

  async function logout() {
    try {
      await signOut(getFirebaseAuth());
    } catch {
      /* Local session cleanup still runs if Firebase is unavailable. */
    }
    clearStoredUser();
    router.push("/");
  }

  function toggleGroup(title: string) {
    setCollapsed((current) => ({ ...current, [title]: !current[title] }));
  }

  const handleDocNavigation = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: string) => {
      setActiveSection(id);

      if (pathname !== "/dashboard") return;

      event.preventDefault();
      window.history.pushState(null, "", `/dashboard#${id}`);
      scrollToDocSection(id);
    },
    [pathname, setActiveSection],
  );

  return (
    <JobsProvider>
      <PipelineProvider>
        <ApplyProvider>
          <ExploreProvider>
            <MobileNav activeSection={activeSection} onDocNavigate={handleDocNavigation} />
            <div className="min-h-screen md:flex md:h-screen md:overflow-hidden">
              <aside data-shell-sidebar className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface/30 md:flex xl:w-72">
                <div className="shrink-0 px-4 pb-3 pt-4">
                  <Link href="/dashboard#overview" className="flex w-fit items-center gap-2 px-1" aria-label="Career-Ops documentation home">
                    <CareerOpsLogo size="sidebar" />
                    <span className="text-sm font-semibold tracking-tight text-foreground">Career-Ops</span>
                  </Link>
                </div>

                <nav data-shell-sidebar-nav aria-label="Documentation" className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4">
                  <div className="flex min-w-0 flex-col gap-5">
                    {groups.map((group) => {
                      const isCollapsed = Boolean(collapsed[group.title]);
                      return (
                        <div key={group.title}>
                          <button
                            type="button"
                            onClick={() => toggleGroup(group.title)}
                            className="doc-sidebar-label flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors hover:bg-surface-hover hover:text-muted"
                            aria-expanded={!isCollapsed}
                          >
                            {group.title}
                            <ChevronDown className={cn("size-3.5 transition-transform", isCollapsed && "-rotate-90")} />
                          </button>
                          {!isCollapsed && (
                            <div className="mt-1 flex min-w-0 flex-col gap-0.5">
                              {group.items.map(({ href, id, label, icon: Icon }) => {
                                const active = activeSection === id;
                                return (
                                  <Link
                                    key={href}
                                    href={href}
                                    onClick={(event) => handleDocNavigation(event, id)}
                                    className={cn(
                                      "doc-sidebar-link flex items-center gap-3 rounded-md border-l-2 px-3 py-2 transition-colors",
                                      active
                                        ? "border-brand bg-brand-soft text-brand"
                                        : "border-transparent text-muted hover:bg-surface-hover hover:text-foreground",
                                    )}
                                    aria-current={active ? "location" : undefined}
                                  >
                                    <Icon className="size-4 shrink-0" />
                                    <span className="min-w-0 truncate">{label}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="pt-2">
                      <p className="doc-sidebar-label px-2">Workspace</p>
                      <div className="mt-1 flex min-w-0 flex-col gap-0.5">
                        {WORKSPACE_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                          const active = isWorkspaceActive(href, pathname);
                          return (
                            <Link
                              key={href}
                              href={href}
                              className={cn(
                                "doc-sidebar-link flex items-center gap-3 rounded-md border-l-2 px-3 py-2 transition-colors",
                                active
                                  ? "border-brand bg-brand-soft text-brand"
                                  : "border-transparent text-muted hover:bg-surface-hover hover:text-foreground",
                              )}
                              aria-current={active ? "page" : undefined}
                            >
                              <Icon className="size-4 shrink-0" />
                              <span className="min-w-0 truncate">{label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </nav>

                <footer className="shrink-0 border-t border-border px-4 pb-4 pt-4">
                  <UserBadge />
                  <div className="mt-4 flex items-center justify-between gap-3 px-1">
                    <button
                      type="button"
                      onClick={() => void logout()}
                      className="doc-sidebar-link flex min-h-10 items-center gap-3 rounded-md px-2 py-2 text-left text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                    <ThemeToggle />
                  </div>
                </footer>
              </aside>

              <main data-shell-main className="min-w-0 flex-1 overflow-x-hidden md:h-screen md:overflow-y-auto">
                <div className="sticky top-0 z-30 hidden h-14 items-center justify-between gap-4 border-b border-border bg-background/85 px-4 backdrop-blur md:flex md:px-6">
                  <Link href="/dashboard#overview" className="flex min-w-0 items-center md:hidden" aria-label="Career-Ops documentation home">
                    <CareerOpsLogo size="mobile" />
                  </Link>
                  <div className="hidden min-w-0 items-center gap-2 md:flex">
                    <CareerOpsLogo size="header" />
                    <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
                    <span className="text-sm font-semibold tracking-tight text-foreground">Career-Ops</span>
                    <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
                    <span className="text-sm font-medium text-muted">Documentation</span>
                  </div>
                  <ThemeToggle className="border border-border bg-surface/60 px-2 py-2" />
                </div>
                {children}
              </main>
            </div>
          </ExploreProvider>
        </ApplyProvider>
      </PipelineProvider>
    </JobsProvider>
  );
}
