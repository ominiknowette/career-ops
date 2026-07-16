"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleUser, LogIn } from "lucide-react";
import { cn } from "@/lib/cn";
import { readStoredUser } from "@/lib/browser-user";

type User = {
  signedIn: boolean;
  firstName: string | null;
  email: string;
};

export function UserBadge({ compact = false }: { compact?: boolean }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const load = () => {
      const stored = readStoredUser();
      setUser({
        signedIn: Boolean(stored?.signedIn),
        firstName: stored?.firstName || null,
        email: stored?.email || "",
      });
    };
    load();
    window.addEventListener("career-ops:user-updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("career-ops:user-updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  if (!user) return null;

  if (!user.signedIn) {
    return (
      <Link
        href="/login"
        className={cn(
          "inline-flex items-center gap-2 rounded-md border border-border bg-surface/50 px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground",
          compact && "px-2 py-1.5 text-xs",
        )}
      >
        <LogIn className="size-4" />
        Sign in
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className={cn(
        "flex items-center gap-3 rounded-md border border-border bg-surface/50 px-3 py-2 text-left transition-colors hover:bg-surface-hover",
        compact && "gap-2 px-2 py-1.5",
      )}
    >
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
        <CircleUser className="size-4" />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">
            Hey {user.firstName || "there"}
          </span>
          <span className="block truncate text-xs text-faint">
            {user.email || "Profile connected"}
          </span>
        </span>
      )}
    </Link>
  );
}
