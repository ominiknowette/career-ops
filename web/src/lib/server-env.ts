import fs from "node:fs";
import path from "node:path";
import { careerOpsRoot } from "@/lib/career-ops";

const CACHE = new Map<string, Record<string, string>>();

function parseEnvFile(file: string): Record<string, string> {
  const cached = CACHE.get(file);
  if (cached) return cached;

  const env: Record<string, string> = {};
  try {
    const text = fs.readFileSync(file, "utf8");
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  } catch {
    // Optional local env files are allowed to be absent.
  }

  CACHE.set(file, env);
  return env;
}

export function readServerEnv(name: string): string {
  const runtimeValue = process.env[name]?.trim();
  if (runtimeValue) return runtimeValue;

  const candidates = [
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env"),
    path.join(careerOpsRoot(), ".env.local"),
    path.join(careerOpsRoot(), ".env"),
  ];

  for (const file of candidates) {
    const value = parseEnvFile(file)[name]?.trim();
    if (value) return value;
  }

  return "";
}
