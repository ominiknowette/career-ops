import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { careerOpsRoot } from "@/lib/career-ops";
import { atomicWriteWithBackup } from "@/lib/core/safe-write";

function cvPath() {
  return path.join(careerOpsRoot(), "cv.md");
}

const MAX_CV_BYTES = 200_000;

export async function GET() {
  try {
    const file = cvPath();
    const content = fs.readFileSync(file, "utf8");
    const stat = fs.statSync(file);
    return NextResponse.json({
      content,
      exists: true,
      bytes: stat.size,
      updatedAt: stat.mtime.toISOString(),
    });
  } catch {
    return NextResponse.json({ content: "", exists: false });
  }
}

export async function POST(req: Request) {
  let body: { content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (typeof body.content !== "string") {
    return NextResponse.json({ error: "content required" }, { status: 400 });
  }

  if (Buffer.byteLength(body.content, "utf8") > MAX_CV_BYTES) {
    return NextResponse.json({ error: "CV is too large (over 200KB)" }, { status: 413 });
  }

  try {
    const file = cvPath();
    const bak = atomicWriteWithBackup(file, body.content);
    const saved = fs.readFileSync(file, "utf8");
    if (saved !== body.content) {
      return NextResponse.json({ error: "write verification failed" }, { status: 500 });
    }
    const stat = fs.statSync(file);
    return NextResponse.json({
      ok: true,
      backedUp: Boolean(bak),
      bytes: stat.size,
      updatedAt: stat.mtime.toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "write failed" },
      { status: 500 },
    );
  }
}
