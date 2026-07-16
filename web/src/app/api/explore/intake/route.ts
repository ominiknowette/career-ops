import { NextRequest } from "next/server";
import { addOffersToPipeline } from "@/lib/core/pipeline";
import type { DiscoveredOffer } from "@/lib/explore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function titleFromUrl(url: URL) {
  const path = url.pathname
    .split("/")
    .filter(Boolean)
    .slice(-2)
    .join(" ")
    .replace(/[-_]+/g, " ")
    .trim();
  return path || "Site intake";
}

function parseSubmittedUrl(value: string): URL {
  const clean = value
    .trim()
    .replace(/^<|>$/g, "")
    .split(/\s+/)
    .find(Boolean);
  if (!clean) throw new Error("missing url");
  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(clean) ? clean : `https://${clean}`;
  const parsed = new URL(withProtocol);
  if (!/^https?:$/.test(parsed.protocol)) throw new Error("unsupported protocol");
  return parsed;
}

function companyFromUrl(url: URL) {
  const host = url.hostname.replace(/^www\./, "");
  if (host === "linkedin.com" || host.endsWith(".linkedin.com")) return "LinkedIn";
  return host;
}

export async function POST(req: NextRequest) {
  let rawUrl = "";
  try {
    const body = (await req.json()) as { url?: unknown };
    rawUrl = typeof body.url === "string" ? body.url.trim() : "";
  } catch {
    return Response.json({ added: 0, error: "bad request" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = parseSubmittedUrl(rawUrl);
  } catch {
    return Response.json(
      { added: 0, error: "Paste a valid job or careers URL, for example https://www.linkedin.com/jobs/view/..." },
      { status: 400 },
    );
  }

  const company = companyFromUrl(parsed);
  const offer: DiscoveredOffer = {
    url: parsed.toString(),
    company,
    title: titleFromUrl(parsed),
    location: "",
    postedAt: "",
    ats: "site-intake",
    source: "site-intake",
    note: "User-submitted site. Evaluate directly, or expand with the API gateway crawler.",
  };

  const result = await addOffersToPipeline([offer]);
  return Response.json(result, { status: result.error ? 500 : 200 });
}
