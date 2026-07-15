import mongoose from "mongoose";

/**
 * Portfolio MongoDB connection.
 * Prefers `MONGODB_URI_PORTFOLIO`, then falls back to `MONGODB_URI` (Coolify/legacy).
 */
function cleanMongoUri(raw: string | undefined): string | null {
  if (!raw) return null;
  let uri = raw.trim();
  // Coolify/UI paste sometimes wraps values in quotes
  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'"))
  ) {
    uri = uri.slice(1, -1).trim();
  }
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    return null;
  }
  return uri;
}

function resolveMongoUri(): string {
  const candidates = [
    process.env.MONGODB_URI_PORTFOLIO,
    process.env.MONGODB_URI,
  ];

  for (const candidate of candidates) {
    const cleaned = cleanMongoUri(candidate);
    if (cleaned) return cleaned;
  }

  const invalid = candidates.find((v) => typeof v === "string" && v.trim());
  if (invalid) {
    throw new Error(
      `Invalid MongoDB URI (must start with mongodb:// or mongodb+srv://). Check Coolify env MONGODB_URI_PORTFOLIO / MONGODB_URI. Got: ${invalid.slice(0, 40)}...`
    );
  }

  throw new Error(
    "Missing MongoDB URI. Set MONGODB_URI_PORTFOLIO in Coolify to: mongodb+srv://USER:PASSWORD@cluster0.wajwxbz.mongodb.net/digital-broker"
  );
}

interface PortfolioConnectionCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoosePortfolioCache: PortfolioConnectionCache | undefined;
}

const cached: PortfolioConnectionCache =
  global.mongoosePortfolioCache || { conn: null, promise: null };

if (!global.mongoosePortfolioCache) {
  global.mongoosePortfolioCache = cached;
}

export default async function portfolioDbConnect(): Promise<mongoose.Connection> {
  const uri = resolveMongoUri();

  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .createConnection(uri, { bufferCommands: false })
      .asPromise();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
