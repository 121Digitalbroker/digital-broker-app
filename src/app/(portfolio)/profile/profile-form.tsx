"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dashInput, dashLabel, dashSelect, dashTextarea } from "@/lib/dashboard-ui";
import { citiesForState, INDIAN_STATES, matchOption } from "@/lib/india-locations";

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
  const [form, setForm] = useState<PortfolioProfileInitial>(() => {
    const stateOrRegion = matchOption(INDIAN_STATES, initial.stateOrRegion);
    const city = matchOption(citiesForState(stateOrRegion), initial.city);
    return { ...initial, stateOrRegion, city };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const cityOptions = useMemo(() => {
    const cities = citiesForState(form.stateOrRegion);
    if (form.city && !cities.includes(form.city)) {
      return [form.city, ...cities];
    }
    return cities;
  }, [form.stateOrRegion, form.city]);

  const stateOptions = useMemo(() => {
    if (form.stateOrRegion && !INDIAN_STATES.includes(form.stateOrRegion as (typeof INDIAN_STATES)[number])) {
      return [form.stateOrRegion, ...INDIAN_STATES];
    }
    return [...INDIAN_STATES];
  }, [form.stateOrRegion]);

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
      router.push(nextPath.startsWith("/") ? nextPath : "/");
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
            State / region <span className="text-[#F56A22]">*</span>
          </label>
          <select
            required
            className={dashSelect}
            value={form.stateOrRegion}
            onChange={(e) =>
              setForm({ ...form, stateOrRegion: e.target.value, city: "" })
            }
          >
            <option value="">Select state</option>
            {stateOptions.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={dashLabel}>
            City <span className="text-[#F56A22]">*</span>
          </label>
          <select
            required
            className={dashSelect}
            value={form.city}
            disabled={!form.stateOrRegion}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          >
            <option value="">
              {form.stateOrRegion ? "Select city" : "Select state first"}
            </option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
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
          href="/"
          className="inline-flex items-center rounded-2xl border-2 border-gray-200 px-8 py-4 text-sm font-black uppercase tracking-widest text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
