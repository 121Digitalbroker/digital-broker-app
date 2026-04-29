"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  initiallyHidden: boolean;
};

export default function DashboardVisibilityButton({ id, initiallyHidden }: Props) {
  const router = useRouter();
  const [hidden, setHidden] = useState(initiallyHidden);
  const [saving, setSaving] = useState(false);

  const onToggle = async () => {
    setSaving(true);
    try {
      const nextHidden = !hidden;
      const res = await fetch("/api/portfolio/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, hidden: nextHidden }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        window.alert(data.error || "Could not update visibility.");
        return;
      }
      setHidden(nextHidden);
      router.refresh();
    } catch {
      window.alert("Something went wrong while updating visibility.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-[#0a1628]">
        {hidden ? "Hidden on dashboard" : "Shown on dashboard"}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={!hidden}
        aria-label="Toggle dashboard visibility"
        onClick={onToggle}
        disabled={saving}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-60 ${
          hidden ? "bg-gray-300" : "bg-emerald-500"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            hidden ? "translate-x-1" : "translate-x-5"
          }`}
        />
      </button>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        {saving ? "Saving..." : hidden ? "Off" : "On"}
      </span>
    </div>
  );
}

