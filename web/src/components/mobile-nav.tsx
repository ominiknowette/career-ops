"use client";

import { type MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { CareerOpsLogo } from "@/components/career-ops-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DOC_NAV_GROUPS,
  WORKSPACE_NAV_ITEMS,
  isWorkspaceActive,
} from "@/lib/nav-items";

const STYLE = `
.co-mnav{position:sticky;top:0;z-index:30;background:var(--bg);padding-top:calc(env(safe-area-inset-top) + .8rem)}
.co-mscrim{position:fixed;inset:0;z-index:60;background:rgba(8,8,12,.45);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:opacity .3s ease}
.co-mscrim.open{opacity:1;pointer-events:auto}
.co-mdrawer{position:fixed;top:0;right:0;bottom:0;z-index:61;width:min(22rem,88vw);display:flex;flex-direction:column;overflow-y:auto;overscroll-behavior:contain;transform:translateX(102%);transition:transform .34s cubic-bezier(.32,.72,0,1);will-change:transform;box-shadow:-16px 0 48px -16px rgba(0,0,0,.4);padding-top:calc(env(safe-area-inset-top) + .25rem)}
.co-mdrawer.open{transform:translateX(0)}
.co-msafe{padding-bottom:calc(1rem + env(safe-area-inset-bottom))}
@media(min-width:768px){.co-mnav,.co-mscrim,.co-mdrawer{display:none!important}}
@media(prefers-reduced-motion:reduce){.co-mdrawer,.co-mscrim{transition:none}}
`;

export function MobileNav({
  activeSection,
  onDocNavigate,
}: {
  activeSection: string;
  onDocNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggleGroup(title: string) {
    setCollapsed((current) => ({ ...current, [title]: !current[title] }));
  }

  return (
    <>
      <style>{STYLE}</style>
      <header className="co-mnav flex items-center gap-2 border-b border-border px-4 pb-3 md:hidden">
        <Link href="/dashboard#overview" className="flex items-center gap-2" aria-label="Career-Ops documentation home">
          <CareerOpsLogo size="mobile" />
          <span className="text-sm font-semibold tracking-tight text-foreground">Career-Ops</span>
        </Link>
        <div className="ml-auto flex items-center gap-0.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      <div className={cn("co-mscrim md:hidden", open && "open")} onClick={() => setOpen(false)} aria-hidden />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        inert={!open}
        className={cn("co-mdrawer border-l border-border bg-surface md:hidden", open && "open")}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <CareerOpsLogo size="mobile" />
            <span className="text-sm font-semibold tracking-tight text-foreground">Career-Ops</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex min-w-0 flex-col gap-5 px-3" aria-label="Documentation">
          {DOC_NAV_GROUPS.map((group) => {
            const isCollapsed = Boolean(collapsed[group.title]);
            return (
              <div key={group.title}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  className="doc-sidebar-label flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition-colors hover:bg-surface-hover hover:text-muted"
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
                          onClick={(event) => {
                            onDocNavigate(event, id);
                            setOpen(false);
                          }}
                          aria-current={active ? "location" : undefined}
                          className={cn(
                            "doc-sidebar-link flex items-center gap-3 rounded-lg border-l-2 px-3 py-3 transition-colors",
                            active
                              ? "border-brand bg-brand-soft text-brand"
                              : "border-transparent text-muted hover:bg-surface-hover hover:text-foreground",
                          )}
                        >
                          <Icon className="size-5 shrink-0" />
                          <span className="min-w-0 truncate">{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div>
            <p className="doc-sidebar-label px-2">Workspace</p>
            <div className="mt-1 flex min-w-0 flex-col gap-0.5">
              {WORKSPACE_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isWorkspaceActive(href, pathname);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "doc-sidebar-link flex items-center gap-3 rounded-lg border-l-2 px-3 py-3 transition-colors",
                      active
                        ? "border-brand bg-brand-soft text-brand"
                        : "border-transparent text-muted hover:bg-surface-hover hover:text-foreground",
                    )}
                  >
                    <Icon className="size-5 shrink-0" />
                    <span className="min-w-0 truncate">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="co-msafe mt-auto flex items-center justify-between border-t border-border px-4 pt-4">
          <span className="text-sm font-medium text-faint">Documentation</span>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
