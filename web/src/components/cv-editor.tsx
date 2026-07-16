"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { readStoredUser, readUserCv, writeUserCv } from "@/lib/browser-user";

export function CvEditor() {
  const [content, setContent] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [exists, setExists] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<{ bytes?: number; updatedAt?: string }>({});
  const [accountEmail, setAccountEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = readStoredUser();
    if (storedUser?.email) {
      const savedCv = readUserCv(storedUser.email);
      setAccountEmail(storedUser.email);
      setContent(savedCv.content);
      setExists(savedCv.exists);
      setMeta({ bytes: savedCv.bytes, updatedAt: savedCv.updatedAt });
      setLoaded(true);
      return;
    }

    fetch("/api/cv")
      .then((r) => r.json())
      .then((d) => {
        setContent(d.content ?? "");
        setExists(d.exists ?? false);
        setMeta({ bytes: d.bytes, updatedAt: d.updatedAt });
      })
      .catch(() => setError("Could not load cv.md."))
      .finally(() => setLoaded(true));
  }, []);

  async function save() {
    setSaving(true);
    setError("");
    try {
      if (accountEmail) {
        const savedCv = writeUserCv(accountEmail, content);
        const verify = readUserCv(accountEmail);
        if (verify.content !== content) {
          setError("Save verification failed. Your browser copy does not match the editor.");
          return;
        }
        setMeta({ bytes: savedCv.bytes, updatedAt: savedCv.updatedAt });
        setDirty(false);
        setExists(savedCv.exists);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        return;
      }

      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        setError(body.error || "Could not save cv.md.");
        return;
      }
      const verify = await fetch("/api/cv").then((r) => r.json());
      if ((verify.content ?? "") !== content) {
        setError("Save verification failed. The file on disk does not match the editor.");
        return;
      }
      setMeta({ bytes: body.bytes, updatedAt: body.updatedAt });
      setDirty(false);
      setExists(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError(accountEmail ? "Could not save your CV in this browser." : "Could not save cv.md. Check the dev server terminal.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-8">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl tracking-tight text-landing">CV Profile</h1>
          <p className="mt-1 text-sm text-muted">
            {accountEmail ? "Edit the CV saved for your account with live preview." : <>Edit <code className="text-foreground">cv.md</code> with live preview.</>}
            {!exists && loaded && <span className="ml-1 text-faint">{accountEmail ? "No CV saved for this account yet." : "No cv.md yet - start typing to create it."}</span>}
          </p>
          {meta.updatedAt && (
            <p className="mt-1 text-xs text-faint">
              Last saved {new Date(meta.updatedAt).toLocaleString()} {typeof meta.bytes === "number" ? `- ${meta.bytes.toLocaleString()} bytes` : ""}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className={cn(
            "inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors",
            dirty
              ? "bg-brand text-brand-foreground hover:bg-brand-200"
              : "border border-border bg-surface text-muted",
          )}
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : saved ? <Check className="size-4" /> : null}
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
          <AlertTriangle className="size-4 shrink-0" /> {error}
        </div>
      )}

      {!loaded ? (
        <div className="mt-6 text-sm text-muted">Loading...</div>
      ) : (
        <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-2">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setDirty(true);
              if (error) setError("");
            }}
            spellCheck={false}
            placeholder="# Your Name&#10;&#10;## Summary&#10;..."
            className="min-h-[52vh] w-full min-w-0 resize-none rounded-xl border border-border bg-surface/50 p-4 font-mono text-sm leading-relaxed outline-none transition-colors placeholder:text-faint focus:border-brand/40 sm:rounded-2xl lg:min-h-[60vh]"
          />
          <article className="report-prose min-h-[52vh] min-w-0 overflow-auto rounded-xl border border-border bg-surface/30 p-4 sm:rounded-2xl sm:p-5 lg:min-h-[60vh]">
            {content.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : (
              <p className="text-muted">Preview appears here.</p>
            )}
          </article>
        </div>
      )}
    </div>
  );
}
