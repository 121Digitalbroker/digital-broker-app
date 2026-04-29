"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dashInput, dashLabel, dashTextarea } from "@/lib/dashboard-ui";

export type PortfolioProfileInitial = {
  fullName: string;
  phone: string;
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateOrRegion: string;
  postalCode: string;
  country: string;
  notes: string;
};

type Props = {
  initial: PortfolioProfileInitial;
  nextPath: string;
};

export default function PortfolioProfileForm({ initial, nextPath }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<PortfolioProfileInitial>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/portfolio/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save profile.");
        return;
      }
      if (!data.complete) {
        setError("Please fill all required fields.");
        return;
      }
      router.push(nextPath.startsWith("/") ? nextPath : "/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="text-sm text-gray-500 leading-relaxed border-l-4 border-[#F56A22] pl-4">
        Required fields are saved to your <strong className="text-[#0a1628]">portfolio profile</strong>{" "}
        in our system. Use the legal or billing contact you want on file for this account.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <div className="md:col-span-2">
          <label className={dashLabel}>
            Full name <span className="text-[#F56A22]">*</span>
          </label>
          <input
            required
            className={dashInput}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
        <div>
          <label className={dashLabel}>
            Phone <span className="text-[#F56A22]">*</span>
          </label>
          <input
            required
            className={dashInput}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className={dashLabel}>Company</label>
          <input
            className={dashInput}
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className={dashLabel}>
            Address line 1 <span className="text-[#F56A22]">*</span>
          </label>
          <input
            required
            className={dashInput}
            value={form.addressLine1}
            onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className={dashLabel}>Address line 2</label>
          <input
            className={dashInput}
            value={form.addressLine2}
            onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
          />
        </div>
        <div>
          <label className={dashLabel}>
            City <span className="text-[#F56A22]">*</span>
          </label>
          <input
            required
            className={dashInput}
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
        <div>
          <label className={dashLabel}>
            State / region <span className="text-[#F56A22]">*</span>
          </label>
          <input
            required
            className={dashInput}
            value={form.stateOrRegion}
            onChange={(e) => setForm({ ...form, stateOrRegion: e.target.value })}
          />
        </div>
        <div>
          <label className={dashLabel}>
            Postal code <span className="text-[#F56A22]">*</span>
          </label>
          <input
            required
            className={dashInput}
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          />
        </div>
        <div>
          <label className={dashLabel}>
            Country <span className="text-[#F56A22]">*</span>
          </label>
          <input
            required
            className={dashInput}
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className={dashLabel}>Notes</label>
          <textarea
            rows={3}
            className={dashTextarea}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-[#0a1628] px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-[#162845] disabled:opacity-50 transition-all shadow-lg shadow-[#0a1628]/20"
        >
          {saving ? "Saving…" : "Save & continue"}
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-2xl border-2 border-gray-200 px-8 py-4 text-sm font-black uppercase tracking-widest text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
