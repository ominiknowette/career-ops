export const WEB_USER_STORAGE_KEY = "career-ops:web-user";

export type StoredWebUser = {
  signedIn: boolean;
  name?: string;
  firstName?: string;
  email?: string;
};

export type StoredUserCv = {
  content: string;
  exists: boolean;
  bytes: number;
  updatedAt?: string;
};

function hasBrowserStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizedEmail(email?: string | null): string {
  return (email || "").trim().toLowerCase();
}

function cvKey(email?: string | null): string {
  const identity = normalizedEmail(email) || "anonymous";
  return `career-ops:cv:v1:${encodeURIComponent(identity)}`;
}

function byteLength(value: string): number {
  if (typeof Blob !== "undefined") return new Blob([value]).size;
  return value.length;
}

export function readStoredUser(): StoredWebUser | null {
  if (!hasBrowserStorage()) return null;
  try {
    const raw = window.localStorage.getItem(WEB_USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredWebUser>;
    if (!parsed.signedIn) return null;
    return {
      signedIn: true,
      name: parsed.name || "",
      firstName: parsed.firstName || "",
      email: parsed.email || "",
    };
  } catch {
    return null;
  }
}

export function writeStoredUser(user: StoredWebUser): void {
  if (!hasBrowserStorage()) return;
  window.localStorage.setItem(WEB_USER_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("career-ops:user-updated"));
}

export function clearStoredUser(): void {
  if (!hasBrowserStorage()) return;
  window.localStorage.removeItem(WEB_USER_STORAGE_KEY);
  window.dispatchEvent(new Event("career-ops:user-updated"));
}

export function readUserCv(email?: string | null): StoredUserCv {
  if (!hasBrowserStorage()) return { content: "", exists: false, bytes: 0 };
  const raw = window.localStorage.getItem(cvKey(email));
  if (!raw) return { content: "", exists: false, bytes: 0 };

  try {
    const parsed = JSON.parse(raw) as Partial<StoredUserCv>;
    const content = typeof parsed.content === "string" ? parsed.content : "";
    return {
      content,
      exists: content.trim().length > 0,
      bytes: typeof parsed.bytes === "number" ? parsed.bytes : byteLength(content),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : undefined,
    };
  } catch {
    return {
      content: raw,
      exists: raw.trim().length > 0,
      bytes: byteLength(raw),
    };
  }
}

export function writeUserCv(email: string | undefined, content: string): StoredUserCv {
  const record: StoredUserCv = {
    content,
    exists: content.trim().length > 0,
    bytes: byteLength(content),
    updatedAt: new Date().toISOString(),
  };
  if (hasBrowserStorage()) {
    window.localStorage.setItem(cvKey(email), JSON.stringify(record));
  }
  return record;
}
