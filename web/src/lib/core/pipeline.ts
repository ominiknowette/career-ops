import fs from "node:fs";
import path from "node:path";
import { careerOpsRoot } from "@/lib/career-ops";
import { atomicWriteWithBackup } from "@/lib/core/safe-write";
import type { DiscoveredOffer } from "@/lib/explore";

export type AddResult = { added: number; error?: string };

const PIPELINE_SKELETON = `# Pipeline -- Pending URLs

Paste job URLs below as \`- [ ] {url}\` then run \`/career-ops pipeline\`.

## Pending

## Processed
`;

const PENDING_MARKERS = ["## Pending", "## Pendientes"];
const PROCESSED_MARKERS = ["## Processed", "## Procesadas"];

type CleanOffer = {
  url: string;
  company: string;
  title: string;
  location: string;
  source: string;
};

function cleanField(value: unknown): string {
  return String(value ?? "")
    .replace(/[\r\n\t|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanUrl(value: unknown): string {
  return String(value ?? "").trim();
}

function formatPipelineOffer(offer: CleanOffer): string {
  const base = `- [ ] ${offer.url} | ${offer.company} | ${offer.title}`;
  return offer.location ? `${base} | ${offer.location}` : base;
}

function scanHistoryRow(offer: CleanOffer, date: string): string {
  return [
    offer.url,
    date,
    offer.source || "site-intake",
    offer.title,
    offer.company,
    "added",
    offer.location,
  ]
    .map(cleanField)
    .join("\t");
}

function insertIntoPending(text: string, lines: string[]): string {
  const marker = PENDING_MARKERS.find((m) => text.includes(m)) ?? null;
  const block = `\n${lines.join("\n")}\n`;

  if (!marker) {
    const processedAt = PROCESSED_MARKERS.reduce((found, m) => {
      const i = text.indexOf(m);
      return found === -1 || (i !== -1 && i < found) ? i : found;
    }, -1);
    const insertAt = processedAt === -1 ? text.length : processedAt;
    return `${text.slice(0, insertAt).trimEnd()}\n\n## Pending${block}\n${text.slice(insertAt).trimStart()}`;
  }

  const afterMarker = text.indexOf(marker) + marker.length;
  const nextSection = text.indexOf("\n## ", afterMarker);
  const insertAt = nextSection === -1 ? text.length : nextSection;
  return text.slice(0, insertAt).trimEnd() + block + text.slice(insertAt);
}

function existingPipelineUrls(text: string): Set<string> {
  const urls = new Set<string>();
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*-\s*\[[ xX]\]\s*([^|]+)/);
    if (match?.[1]) urls.add(match[1].trim());
  }
  return urls;
}

export async function addOffersToPipeline(offers: DiscoveredOffer[]): Promise<AddResult> {
  const clean: CleanOffer[] = offers
    .map((offer) => ({
      url: cleanUrl(offer.url),
      company: cleanField(offer.company),
      title: cleanField(offer.title),
      location: cleanField(offer.location),
      source: cleanField(offer.source || offer.ats || "site-intake"),
    }))
    .filter((offer) => /^https?:\/\//i.test(offer.url));

  if (clean.length === 0) return { added: 0, error: "No valid URLs to add." };

  const root = careerOpsRoot();
  const dataDir = path.join(root, "data");
  const pipelinePath = path.join(dataDir, "pipeline.md");
  const historyPath = path.join(dataDir, "scan-history.tsv");
  fs.mkdirSync(dataDir, { recursive: true });

  let pipelineText = fs.existsSync(pipelinePath)
    ? fs.readFileSync(pipelinePath, "utf8")
    : PIPELINE_SKELETON;

  const existing = existingPipelineUrls(pipelineText);
  const fresh = clean.filter((offer) => !existing.has(offer.url));
  if (fresh.length === 0) return { added: 0 };

  pipelineText = insertIntoPending(pipelineText, fresh.map(formatPipelineOffer));
  atomicWriteWithBackup(pipelinePath, pipelineText);

  const date = new Date().toISOString().slice(0, 10);
  const currentHistory = fs.existsSync(historyPath)
    ? fs.readFileSync(historyPath, "utf8")
    : "url\tfirst_seen\tportal\ttitle\tcompany\tstatus\tlocation\n";
  const historyBlock = fresh.map((offer) => scanHistoryRow(offer, date)).join("\n");
  atomicWriteWithBackup(historyPath, `${currentHistory.trimEnd()}\n${historyBlock}\n`);

  return { added: fresh.length };
}
