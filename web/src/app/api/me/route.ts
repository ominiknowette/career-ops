import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { careerOpsRoot } from "@/lib/career-ops";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Profile = {
  candidate?: {
    full_name?: string;
    email?: string;
  };
};

function firstName(name?: string): string | null {
  const clean = name?.trim();
  if (!clean) return null;
  return clean.split(/\s+/)[0] || null;
}

export async function GET() {
  try {
    const file = path.join(careerOpsRoot(), "config", "profile.yml");
    const parsed = yaml.load(fs.readFileSync(file, "utf8")) as Profile | null;
    const fullName = parsed?.candidate?.full_name?.trim() || "";
    return Response.json({
      signedIn: Boolean(fullName),
      name: fullName,
      firstName: firstName(fullName),
      email: parsed?.candidate?.email?.trim() || "",
    });
  } catch {
    return Response.json({ signedIn: false, name: "", firstName: null, email: "" });
  }
}
