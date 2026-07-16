import { NextResponse } from "next/server";

function inspect(name: string, raw: string | undefined) {
  if (raw === undefined) {
    return { name, present: false };
  }
  const trimmed = raw.trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1).trim()
      : trimmed;

  return {
    name,
    present: true,
    length: raw.length,
    startsWithMongo:
      unquoted.startsWith("mongodb://") || unquoted.startsWith("mongodb+srv://"),
    // Safe preview only — never return password/full URI
    preview: unquoted.slice(0, 14),
  };
}

/**
 * Safe env check for Coolify debugging. Does not expose secrets.
 * Open: https://dbasset.digitalbroker.in/api/portfolio/health
 */
export async function GET() {
  const portfolio = inspect(
    "MONGODB_URI_PORTFOLIO",
    process.env.MONGODB_URI_PORTFOLIO
  );
  const legacy = inspect("MONGODB_URI", process.env.MONGODB_URI);

  const ok =
    (portfolio.present && portfolio.startsWithMongo) ||
    (legacy.present && legacy.startsWithMongo);

  return NextResponse.json({
    ok,
    message: ok
      ? "Mongo URI looks valid."
      : "Mongo URI missing or invalid. In Coolify set MONGODB_URI_PORTFOLIO to a full mongodb+srv://... string with NO quotes.",
    env: { portfolio, legacy },
  });
}
