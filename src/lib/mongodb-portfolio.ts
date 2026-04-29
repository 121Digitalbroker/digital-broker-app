import mongoose from "mongoose";

/**
 * Portfolio / customer listings DB — separate from public `mongodb.ts`.
 * Set `MONGODB_URI_PORTFOLIO` to a different database or cluster URI.
 * If unset, falls back to `MONGODB_URI` (same host, set a different DB name in the URI for isolation).
 */
const MONGODB_URI_PORTFOLIO =
  process.env.MONGODB_URI_PORTFOLIO ||
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/digital-broker-portfolio";

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
  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .createConnection(MONGODB_URI_PORTFOLIO, { bufferCommands: false })
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
