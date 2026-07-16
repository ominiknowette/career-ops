import { readServerEnv } from "@/lib/server-env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROVIDERS = {
  openai: {
    label: "OpenAI / Codex",
    env: "OPENAI_API_KEY",
    use: "Use this for Codex-style OpenAI gateway calls.",
  },
  anthropic: {
    label: "Anthropic (Claude)",
    env: "ANTHROPIC_API_KEY",
    use: "Use this for Claude-backed gateway calls.",
  },
  google: {
    label: "Google (Gemini)",
    env: "GEMINI_API_KEY",
    use: "Use this for Gemini-backed gateway calls.",
  },
  openrouter: {
    label: "OpenRouter",
    env: "OPENROUTER_API_KEY",
    use: "Use this to route requests through OpenRouter.",
  },
} as const;

export async function GET() {
  const providers = Object.fromEntries(
    Object.entries(PROVIDERS).map(([id, meta]) => [
      id,
      {
        ...meta,
        configured: Boolean(readServerEnv(meta.env)),
      },
    ]),
  );

  return Response.json({
    ok: true,
    mode: "gateway",
    providers,
  });
}
