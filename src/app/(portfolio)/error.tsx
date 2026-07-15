"use client";

export default function PortfolioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = error.message || "A server error occurred.";
  const looksLikeDb =
    /mongo|MONGODB|authentication failed|ECONNREFUSED|timed out|ENOTFOUND/i.test(
      message
    );

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-black text-[#0a1628] mb-2">
          Dashboard couldn&apos;t load
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          {looksLikeDb
            ? "Database connection failed after login. Check Coolify env: MONGODB_URI_PORTFOLIO (or MONGODB_URI) and MongoDB Atlas Network Access for your server IP."
            : message}
        </p>
        <p className="text-xs text-gray-400 mb-6 break-all font-mono">{message}</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[#F56A22] px-4 py-2 text-xs font-black uppercase tracking-widest text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
