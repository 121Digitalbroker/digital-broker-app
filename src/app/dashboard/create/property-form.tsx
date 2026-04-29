"use client";

import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  dashInput,
  dashLabel,
  dashSelect,
  dashTextarea,
} from "@/lib/dashboard-ui";
import {
  annualNOICommercialReady,
  annualNOIResidentialRented,
  monthlyCashflowCommercialReady,
  monthlyCashflowResidentialReady,
  num,
  rentalYieldPercent,
} from "@/lib/portfolio-investment-calcs";
import {
  emptyPayload,
  parsePortfolioPropertyBody,
  validatePortfolioPayload,
  type PortfolioPropertyPayload,
} from "@/lib/portfolio-property-payload";

const DRAFT_KEY = "portfolio-property-form-draft-v1";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50/80 transition-colors"
      >
        <span className="text-sm font-black text-[#0a1628] tracking-tight">
          {title}
        </span>
        <span
          className={`text-gray-400 text-xs font-bold transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▼
        </span>
      </button>
      {open ? (
        <div className="border-t border-gray-100 px-5 py-6 space-y-5">
          {children}
        </div>
      ) : null}
    </div>
  );
}

const RES_CONFIG = ["3", "3+", "4", "4H", "5"] as const;
const COM_READY_TYPE = [
  "Retail Shop",
  "Office Space",
  "Warehouse",
  "Showroom",
] as const;
const TENANT_TYPES = ["MNC", "Bank", "Local Brand", "Startup"] as const;
const CITIES = ["Noida", "Delhi", "Gurugram", "Ghaziabad"] as const;

// Micro-markets per city
const MICRO_MARKETS: Record<string, string[]> = {
  "Noida": [
    "Central Noida",
    "Greater Noida",
    "Greater Noida West (Noida Extension)",
    "Yamuna Expressway",
  ],
  "Delhi": ["South Delhi", "West Delhi", "East Delhi", "North Delhi", "Central Delhi"],
  "Gurugram": ["Golf Course Road", "Dwarka Expressway", "Sohna Road", "NH-48", "SPR"],
  "Ghaziabad": ["Indirapuram", "Raj Nagar Extension", "NH-9 Corridor", "NH-58 Corridor"],
};

// Sectors per micro-market
const SECTORS: Record<string, string[]> = {
  "Central Noida": [
    "Sector 1", "Sector 15", "Sector 16", "Sector 18", "Sector 22",
    "Sector 25", "Sector 27", "Sector 29", "Sector 30", "Sector 32",
    "Sector 34", "Sector 36", "Sector 37", "Sector 39", "Sector 41",
    "Sector 43", "Sector 44", "Sector 45", "Sector 46", "Sector 47",
    "Sector 48", "Sector 49", "Sector 50", "Sector 51", "Sector 52",
    "Sector 55", "Sector 56", "Sector 57", "Sector 58", "Sector 61",
    "Sector 62", "Sector 63", "Sector 65", "Sector 66", "Sector 70",
    "Sector 71", "Sector 72", "Sector 73", "Sector 74", "Sector 75",
    "Sector 76", "Sector 77", "Sector 78", "Sector 79", "Sector 82",
    "Sector 93", "Sector 93A", "Sector 93B", "Sector 94", "Sector 96",
    "Sector 100", "Sector 104", "Sector 107", "Sector 108", "Sector 110",
    "Sector 113", "Sector 117", "Sector 118", "Sector 119", "Sector 120",
    "Sector 121", "Sector 122", "Sector 123", "Sector 124", "Sector 125",
    "Sector 126", "Sector 127", "Sector 128", "Sector 129", "Sector 130",
    "Sector 131", "Sector 132", "Sector 133", "Sector 134", "Sector 135",
    "Sector 136", "Sector 137", "Sector 138", "Sector 140", "Sector 140A",
    "Sector 142", "Sector 143", "Sector 143B", "Sector 144", "Sector 145",
    "Sector 146", "Sector 147", "Sector 148", "Sector 149", "Sector 150",
    "Sector 151", "Sector 152", "Sector 153", "Sector 154", "Sector 155",
    "Sector 156", "Sector 157", "Sector 158", "Sector 159", "Sector 160",
    "Sector 161", "Sector 162", "Sector 163", "Sector 164", "Sector 165",
    "Sector 166", "Sector 167", "Sector 168",
  ],
  "Greater Noida": [
    "Alpha I", "Alpha II", "Beta I", "Beta II", "Gamma I", "Gamma II",
    "Delta I", "Delta II", "Zeta I", "Zeta II", "Eta I", "Eta II",
    "Mu I", "Mu II", "Omega I", "Omega II", "Pi I", "Pi II",
    "Sigma I", "Sigma II", "Chi I", "Chi II", "Phi I", "Phi II",
    "Knowledge Park I", "Knowledge Park II", "Knowledge Park III",
    "Knowledge Park IV", "Knowledge Park V",
    "Tech Zone I", "Tech Zone II", "Tech Zone III", "Tech Zone IV",
    "Ecotech I", "Ecotech II", "Ecotech III",
    "Surajpur", "Kasna", "Rabupura", "Dadri",
  ],
  "Greater Noida West (Noida Extension)": [
    "Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 10",
    "Sector 12", "Sector 16B", "Sector 16C", "Sector 16D",
    "Gaur City 1", "Gaur City 2", "Gaur Chowk",
    "Tech Zone IV", "Crossing Republik", "Raj Nagar Extension",
  ],
  "Yamuna Expressway": [
    "Sector 17A", "Sector 18", "Sector 19", "Sector 19A",
    "Sector 20", "Sector 22A", "Sector 22B", "Sector 22C", "Sector 22D",
    "Sector 24", "Sector 25", "Sector 28", "Sector 29",
    "Sector 32", "Sector 33", "Sector 34",
    "Sports City", "Film City", "YEIDA Plot Scheme",
    "Tappal", "Mathura Road Belt",
  ],
  "South Delhi": [
    "Vasant Kunj", "Vasant Vihar", "Saket", "Malviya Nagar",
    "Greater Kailash I", "Greater Kailash II", "Hauz Khas",
    "South Extension I", "South Extension II", "Lajpat Nagar",
    "Defence Colony", "Jangpura", "Nizamuddin",
  ],
  "West Delhi": [
    "Dwarka", "Janakpuri", "Vikaspuri", "Paschim Vihar",
    "Punjabi Bagh", "Rajouri Garden", "Patel Nagar",
  ],
  "East Delhi": [
    "Shahdara", "Preet Vihar", "Mayur Vihar Phase 1",
    "Mayur Vihar Phase 2", "Mayur Vihar Phase 3",
    "Patparganj", "IP Extension",
  ],
  "North Delhi": ["Rohini", "Pitampura"],
  "Central Delhi": ["Connaught Place", "Karol Bagh"],
  "Golf Course Road": [
    "DLF Phase 1", "DLF Phase 2", "DLF Phase 3", "DLF Phase 4", "DLF Phase 5",
    "Sector 42", "Sector 43", "Sector 53", "Sector 54", "Sector 55", "Sector 56",
  ],
  "Dwarka Expressway": [
    "Sector 37", "Sector 37C", "Sector 37D", "Sector 76", "Sector 77",
    "Sector 78", "Sector 79", "Sector 80", "Sector 81", "Sector 82",
    "Sector 83", "Sector 84", "Sector 85", "Sector 86", "Sector 88",
    "Sector 89", "Sector 90", "Sector 91", "Sector 92", "Sector 93",
  ],
  "Sohna Road": [
    "Sector 47", "Sector 48", "Sector 49", "Sector 50", "Sector 66",
    "Sector 67", "Sector 68", "Sector 69", "Sector 70", "Sector 71",
    "Sector 72", "Sector 73", "Sector 74", "Sector 75",
  ],
  "NH-48": [
    "Sector 14", "Sector 15", "Sector 17", "Sector 21", "Sector 22",
    "Sector 23", "Sector 27", "Sector 28", "Sector 29", "Sector 31",
    "MG Road", "Udyog Vihar",
  ],
  "SPR": [
    "Sector 57", "Sector 58", "Sector 59", "Sector 60", "Sector 61",
    "Sector 62", "Sector 63", "Sector 65",
  ],
  "Indirapuram": ["Indirapuram", "Vaishali", "Vasundhara", "Kaushambi"],
  "Raj Nagar Extension": ["Raj Nagar Extension", "Siddharth Vihar", "Crossings Republik"],
  "NH-9 Corridor": ["Govindpuram", "Mohan Nagar", "Sahibabad"],
  "NH-58 Corridor": ["Loni", "Dasna", "Muradnagar"],
};

export default function CreateDashboardPropertyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);
  const [form, setForm] = useState<PortfolioPropertyPayload>(() =>
    emptyPayload()
  );
  const [propertyType, setPropertyType] = useState<"residential" | "commercial">(
    "residential"
  );
  const [constructionStatus, setConstructionStatus] = useState<
    "ready" | "under_construction"
  >("ready");
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapSearch, setMapSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [importingSummary, setImportingSummary] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [error, setError] = useState("");
  const [draftNotice, setDraftNotice] = useState("");
  const [importNotice, setImportNotice] = useState("");

  useEffect(() => {
    if (isEditMode) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const restored = parsePortfolioPropertyBody(JSON.parse(raw));
      setForm(restored);
      setPropertyType(restored.propertyType);
      setConstructionStatus(restored.constructionStatus);
      setDraftNotice("Restored draft from this device.");
    } catch {
      /* ignore */
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode || !editId) return;
    let isCancelled = false;
    (async () => {
      setLoadingEdit(true);
      try {
        const res = await fetch("/api/portfolio");
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          if (!isCancelled) setError("Unable to load property for editing.");
          return;
        }
        const row = data.find((item: { _id?: string }) => item?._id === editId);
        if (!row) {
          if (!isCancelled) setError("Property not found.");
          return;
        }
        const parsed = parsePortfolioPropertyBody({
          ...row,
          propertyType:
            typeof row.propertyCategory === "string" &&
            row.propertyCategory.includes("commercial")
              ? "commercial"
              : "residential",
          constructionStatus:
            typeof row.propertyCategory === "string" &&
            row.propertyCategory.includes("under_construction")
              ? "under_construction"
              : "ready",
        });
        if (!isCancelled) {
          setForm(parsed);
          setPropertyType(parsed.propertyType);
          setConstructionStatus(parsed.constructionStatus);
        }
      } catch {
        if (!isCancelled) setError("Unable to load property for editing.");
      } finally {
        if (!isCancelled) setLoadingEdit(false);
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [isEditMode, editId]);

  const metrics = useMemo(() => {
    const totalInvestment = num(form.financials.acquisitionCost);
    const loanRemaining = num(form.financials.balanceLoanRemaining);
    const emi = num(form.financials.emiAmount);
    let annualNOI: number | null = null;
    let monthlyCashflow: number | null = null;

    if (form.propertyType === "residential" && form.constructionStatus === "ready") {
      const rr = form.residentialReady;
      monthlyCashflow = monthlyCashflowResidentialReady({
        monthlyRent: num(rr.monthlyRent),
        monthlyMaintenance: num(rr.monthlyMaintenance),
        annualPropertyTax: num(rr.annualPropertyTax),
        emiAmount: emi,
        occupancyStatus: rr.occupancyStatus,
      });
      if (rr.occupancyStatus === "rented") {
        annualNOI = annualNOIResidentialRented({
          monthlyRent: num(rr.monthlyRent),
          monthlyMaintenance: num(rr.monthlyMaintenance),
          annualPropertyTax: num(rr.annualPropertyTax),
        });
      }
    } else if (form.propertyType === "commercial" && form.constructionStatus === "ready") {
      const cr = form.commercialReady;
      annualNOI = annualNOICommercialReady({
        monthlyRent: num(cr.monthlyRent),
        monthlyMaintenance: num(cr.monthlyMaintenance),
        annualPropertyTax: num(cr.annualPropertyTax),
        insuranceAnnual: num(cr.insuranceAnnual),
      });
      monthlyCashflow = monthlyCashflowCommercialReady({
        monthlyRent: num(cr.monthlyRent),
        monthlyMaintenance: num(cr.monthlyMaintenance),
        annualPropertyTax: num(cr.annualPropertyTax),
        insuranceAnnual: num(cr.insuranceAnnual),
        emiAmount: emi,
      });
    }

    const yieldPct =
      annualNOI !== null && totalInvestment > 0
        ? rentalYieldPercent({ annualNOI, totalInvestment })
        : null;

    return {
      totalInvestment,
      loanRemaining,
      monthlyCashflow,
      annualNOI,
      yieldPct,
    };
  }, [form]);

  const saveDraftLocal = useCallback(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...form, isDraft: true }));
    setDraftNotice("Draft saved on this device.");
    setError("");
  }, [form]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setForm(emptyPayload());
    setDraftNotice("Draft cleared.");
    setError("");
  }, []);

  const importSummaryData = useCallback(async () => {
    setImportingSummary(true);
    setError("");
    setImportNotice("");
    try {
      const res = await fetch("/api/portfolio/import-summary", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "PROFILE_INCOMPLETE") {
          setError("Please complete your portfolio profile first.");
          window.location.href = "/dashboard/profile?next=/dashboard/create";
          return;
        }
        setError(data.error || "Could not import summary data.");
        return;
      }
      setImportNotice(
        `Imported ${Number(data.imported ?? 0)} listing(s), skipped ${Number(
          data.skipped ?? 0
        )} duplicate(s).`
      );
      router.push("/dashboard");
    } catch {
      setError("Something went wrong while importing summary data.");
    } finally {
      setImportingSummary(false);
    }
  }, [router]);

  const submitFinal = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      isDraft: false,
      financials: {
        ...form.financials,
        selfFundedRemainingAmount: selfFundedRemaining,
      },
    };
    const errs = validatePortfolioPayload(payload, false);
    if (errs.length) {
      setError(errs.join(" "));
      setSaving(false);
      return;
    }
    try {
      const res = await fetch("/api/portfolio", {
        method: isEditMode ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditMode ? { ...payload, id: editId } : payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "PROFILE_INCOMPLETE") {
          setError("Please complete your portfolio profile first.");
          window.location.href = "/dashboard/profile?next=/dashboard/create";
          return;
        }
        setError(data.error || "Could not create property.");
        return;
      }
      if (!isEditMode) localStorage.removeItem(DRAFT_KEY);
      router.push("/dashboard/my-properties");
    } catch {
      setError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const cat = `${form.propertyType}_${form.constructionStatus}`;
  const loanAmount = num(form.financials.balanceLoanRemaining);
  const interestRate = num(form.financials.interestRate);
  const totalLoanWithInterest = loanAmount + (loanAmount * interestRate) / 100;
  const loanLeftWithInterest = Math.max(
    0,
    totalLoanWithInterest - num(form.financials.emiAmount)
  );
  const selfFundedRemaining = Math.max(
    0,
    num(form.financials.acquisitionCost) -
      num(form.financials.selfFundedPaidAmount) -
      (form.financials.fundingType === "loan" ? loanAmount : 0)
  );
  const mapQuery = useMemo(() => {
    const bits = [mapSearch.trim(), form.location.cityMicroMarket.trim()].filter(
      Boolean
    );
    return bits.join(", ");
  }, [mapSearch, form.location.cityMicroMarket]);
  const mapIframeSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    mapQuery || "Noida"
  )}&output=embed`;
  const mapOpenHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery || "Noida"
  )}`;

  useEffect(() => {
    if (form.financials.areaBasis !== "super_built") return;
    const autoCost =
      num(form.financials.perSqftCost) * num(form.financials.totalAreaSuperBuiltUpSqft);
    setForm((f) => {
      if (num(f.financials.acquisitionCost) === autoCost) return f;
      return {
        ...f,
        financials: {
          ...f.financials,
          acquisitionCost: autoCost,
        },
      };
    });
  }, [
    form.financials.areaBasis,
    form.financials.perSqftCost,
    form.financials.totalAreaSuperBuiltUpSqft,
  ]);

  return (
    <form
      onSubmit={submitFinal}
      className="space-y-6 pb-40 md:pb-36"
    >
      {loadingEdit ? (
        <p className="text-sm font-semibold text-[#0a1628] bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
          Loading property details...
        </p>
      ) : null}
      {!isEditMode ? (
        <div className="rounded-2xl border border-[#F56A22]/20 bg-[#fff7f2] px-4 py-4">
          <p className="text-xs font-bold text-[#0a1628]">
            Import your shared portfolio summary directly into listings.
          </p>
          <button
            type="button"
            onClick={importSummaryData}
            disabled={importingSummary}
            className="mt-3 rounded-xl bg-[#0a1628] px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-[#12223a] disabled:opacity-50 transition-colors"
          >
            {importingSummary ? "Importing..." : "Import CSV summary listings"}
          </button>
        </div>
      ) : null}
      <div className="space-y-4">
        <CollapsibleSection title="Property category & identity" defaultOpen>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={dashLabel}>Property type</label>
              <div className="flex items-center gap-2 bg-muted p-1 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => {
                    setPropertyType("residential");
                    setForm((f) => ({ ...f, propertyType: "residential" }));
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    propertyType === "residential"
                      ? "bg-white shadow text-slate-900"
                      : "text-muted-foreground hover:text-slate-900"
                  }`}
                >
                  Residential
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPropertyType("commercial");
                    setForm((f) => ({ ...f, propertyType: "commercial" }));
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    propertyType === "commercial"
                      ? "bg-white shadow text-slate-900"
                      : "text-muted-foreground hover:text-slate-900"
                  }`}
                >
                  Commercial
                </button>
              </div>
              <div className="flex items-center gap-2 bg-muted p-1 rounded-lg w-fit mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setConstructionStatus("ready");
                    setForm((f) => ({ ...f, constructionStatus: "ready" }));
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    constructionStatus === "ready"
                      ? "bg-white shadow text-slate-900"
                      : "text-muted-foreground hover:text-slate-900"
                  }`}
                >
                  Ready to Move
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConstructionStatus("under_construction");
                    setForm((f) => ({
                      ...f,
                      constructionStatus: "under_construction",
                    }));
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    constructionStatus === "under_construction"
                      ? "bg-white shadow text-slate-900"
                      : "text-muted-foreground hover:text-slate-900"
                  }`}
                >
                  Under Construction
                </button>
              </div>
            </div>
            <div>
              <label className={dashLabel}>
                Developer name <span className="text-[#F56A22]">*</span>
              </label>
              <input
                type="text"
                className={dashInput}
                value={form.developerName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, developerName: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={dashLabel}>
                Project name <span className="text-[#F56A22]">*</span>
              </label>
              <input
                type="text"
                className={dashInput}
                value={form.projectName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, projectName: e.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className={dashLabel}>Description</label>
              <textarea
                rows={3}
                className={dashTextarea}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={dashLabel}>
                City <span className="text-[#F56A22]">*</span>
              </label>
              <select
                className={dashSelect}
                value={form.location.city}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    location: { ...f.location, city: e.target.value, cityMicroMarket: "", sector: "" },
                  }))
                }
              >
                <option value="">Select city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={dashLabel}>
                Micro-market <span className="text-[#F56A22]">*</span>
              </label>
              <select
                className={dashSelect}
                value={form.location.cityMicroMarket}
                disabled={!form.location.city}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    location: { ...f.location, cityMicroMarket: e.target.value, sector: "" },
                  }))
                }
              >
                <option value="">
                  {form.location.city ? "Select micro-market" : "Select city first"}
                </option>
                {(MICRO_MARKETS[form.location.city] ?? []).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <label className={`${dashLabel} mb-0`}>Sector / area</label>
                <button
                  type="button"
                  onClick={() => setShowMapPicker((v) => !v)}
                  className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0a1628] border border-gray-200 rounded-md px-3 py-1.5 hover:border-[#F56A22]/40 transition-colors"
                >
                  {showMapPicker ? "Hide map" : "Select on map"}
                </button>
              </div>
              {form.location.cityMicroMarket && SECTORS[form.location.cityMicroMarket] ? (
                <select
                  className={dashSelect}
                  value={form.location.sector}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      location: { ...f.location, sector: e.target.value },
                    }))
                  }
                >
                  <option value="">Select sector / area</option>
                  {SECTORS[form.location.cityMicroMarket].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className={dashInput}
                  placeholder={form.location.cityMicroMarket ? "Enter sector or area" : "Select micro-market first"}
                  disabled={!form.location.cityMicroMarket}
                  value={form.location.sector}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      location: { ...f.location, sector: e.target.value },
                    }))
                  }
                />
              )}
            </div>
            {showMapPicker ? (
              <div className="md:col-span-2 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Search & pick area
                </p>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    className={dashInput}
                    placeholder="Search locality, sector, landmark..."
                    value={mapSearch}
                    onChange={(e) => setMapSearch(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        location: { ...f.location, sector: mapSearch.trim() },
                      }))
                    }
                    className="rounded-xl bg-[#0a1628] px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#12223a] transition-colors"
                  >
                    Use searched area
                  </button>
                  <a
                    href={mapOpenHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-[#0a1628] hover:border-[#F56A22]/40 transition-colors text-center"
                  >
                    Open full map
                  </a>
                </div>
                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <iframe
                    title="Area map search"
                    src={mapIframeSrc}
                    className="h-[260px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Property details" defaultOpen>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={dashLabel}>
                Purchase date <span className="text-[#F56A22]">*</span>
              </label>
              <input
                type="date"
                className={dashInput}
                value={form.financials.purchaseDate}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    financials: {
                      ...f.financials,
                      purchaseDate: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label className={dashLabel}>
                Property cost (₹) <span className="text-[#F56A22]">*</span>
              </label>
              <input
                type="number"
                min={0}
                step="any"
                className={`${dashInput} ${
                  form.financials.areaBasis === "super_built" ? "bg-gray-50" : ""
                }`}
                value={form.financials.acquisitionCost || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    financials: {
                      ...f.financials,
                      acquisitionCost: Number(e.target.value) || 0,
                    },
                  }))
                }
                readOnly={form.financials.areaBasis === "super_built"}
              />
            </div>
            {form.financials.areaBasis !== "super_built" ? (
              <div>
                <label className={dashLabel}>Total area — carpet (sq ft)</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className={dashInput}
                  value={form.financials.totalAreaCarpetSqft || ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      financials: {
                        ...f.financials,
                        totalAreaCarpetSqft: Number(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
            ) : null}
            <div className={form.financials.areaBasis === "super_built" ? "md:col-span-2" : ""}>
              <label className={dashLabel}>Total area — built-up (sq ft)</label>
              <input
                type="number"
                min={0}
                step="any"
                className={dashInput}
                value={form.financials.totalAreaSuperBuiltUpSqft || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    financials: {
                      ...f.financials,
                      totalAreaSuperBuiltUpSqft: Number(e.target.value) || 0,
                    },
                  }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className={dashLabel}>Area basis</label>
              <select
                className={dashSelect}
                value={form.financials.areaBasis}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    financials: {
                      ...f.financials,
                      areaBasis: e.target.value as PortfolioPropertyPayload["financials"]["areaBasis"],
                    },
                  }))
                }
              >
                <option value="carpet">Carpet</option>
                <option value="super_built">Built-up</option>
                <option value="both">Both (enter both)</option>
              </select>
            </div>
            <div>
              <label className={dashLabel}>Is there any loan on this property?</label>
              <div className="flex items-center gap-2 bg-muted p-1 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      financials: { ...f.financials, fundingType: "loan" },
                    }))
                  }
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    form.financials.fundingType === "loan"
                      ? "bg-white shadow text-slate-900"
                      : "text-muted-foreground hover:text-slate-900"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      financials: { ...f.financials, fundingType: "self_funded" },
                    }))
                  }
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    form.financials.fundingType === "self_funded"
                      ? "bg-white shadow text-slate-900"
                      : "text-muted-foreground hover:text-slate-900"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            <div>
              <label className={dashLabel}>Per sq ft cost (₹)</label>
              <input
                type="number"
                min={0}
                step="any"
                className={dashInput}
                value={form.financials.perSqftCost || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    financials: {
                      ...f.financials,
                      perSqftCost: Number(e.target.value) || 0,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label className={dashLabel}>Other charges (₹)</label>
              <input
                type="number"
                min={0}
                step="any"
                className={dashInput}
                value={form.financials.otherCharges || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    financials: {
                      ...f.financials,
                      otherCharges: Number(e.target.value) || 0,
                    },
                  }))
                }
              />
            </div>
            {form.financials.fundingType === "loan" ? (
              <>
                <div>
                  <label className={dashLabel}>
                    Bank name <span className="text-[#F56A22]">*</span>
                  </label>
                  <input
                    type="text"
                    className={dashInput}
                    value={form.financials.bankName}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        financials: { ...f.financials, bankName: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>EMI amount (₹ / month)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={dashInput}
                    value={form.financials.emiAmount || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        financials: {
                          ...f.financials,
                          emiAmount: Number(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>Loan amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={dashInput}
                    value={form.financials.balanceLoanRemaining || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        financials: {
                          ...f.financials,
                          balanceLoanRemaining: Number(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>Interest rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={dashInput}
                    value={form.financials.interestRate || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        financials: {
                          ...f.financials,
                          interestRate: Number(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>Total loan with interest (₹)</label>
                  <input
                    type="number"
                    className={`${dashInput} bg-gray-50`}
                    value={totalLoanWithInterest || 0}
                    readOnly
                  />
                </div>
                <div>
                  <label className={dashLabel}>Loan left with interest (₹)</label>
                  <input
                    type="number"
                    className={`${dashInput} bg-gray-50`}
                    value={loanLeftWithInterest || 0}
                    readOnly
                  />
                </div>
                <div>
                  <label className={dashLabel}>Self funding amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={dashInput}
                    value={form.financials.selfFundedPaidAmount || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        financials: {
                          ...f.financials,
                          selfFundedPaidAmount: Number(e.target.value) || 0,
                          selfFundedRemainingAmount: Math.max(
                            0,
                            Number(f.financials.acquisitionCost || 0) -
                              (Number(e.target.value) || 0) -
                              Number(f.financials.balanceLoanRemaining || 0)
                          ),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>Remaining amount (₹)</label>
                  <input
                    type="number"
                    className={`${dashInput} bg-gray-50`}
                    value={selfFundedRemaining || 0}
                    readOnly
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={dashLabel}>Self funding amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={dashInput}
                    value={form.financials.selfFundedPaidAmount || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        financials: {
                          ...f.financials,
                          selfFundedPaidAmount: Number(e.target.value) || 0,
                          selfFundedRemainingAmount: Math.max(
                            0,
                            Number(f.financials.acquisitionCost || 0) -
                              (Number(e.target.value) || 0)
                          ),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>Remaining amount (₹)</label>
                  <input
                    type="number"
                    className={`${dashInput} bg-gray-50`}
                    value={selfFundedRemaining || 0}
                    readOnly
                  />
                </div>
              </>
            )}
          </div>
        </CollapsibleSection>

        {cat === "residential_ready" ? (
          <CollapsibleSection title="Unit details" defaultOpen>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(
                [
                  ["tower", "Tower"],
                  ["phase", "Phase"],
                  ["floor", "Floor"],
                  ["flatNo", "Unit no."],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className={dashLabel}>{label}</label>
                  <input
                    type="text"
                    className={dashInput}
                    value={form.residentialReady[key]}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        residentialReady: {
                          ...f.residentialReady,
                          [key]: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              ))}
              <div>
                <label className={dashLabel}>Type / Series</label>
                <select
                  className={dashSelect}
                  value={form.residentialReady.configuration}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      residentialReady: {
                        ...f.residentialReady,
                        configuration: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="">Select</option>
                  {RES_CONFIG.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={dashLabel}>Occupancy status</label>
                <select
                  className={dashSelect}
                  value={form.residentialReady.occupancyStatus}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      residentialReady: {
                        ...f.residentialReady,
                        occupancyStatus: e.target.value as PortfolioPropertyPayload["residentialReady"]["occupancyStatus"],
                      },
                    }))
                  }
                >
                  <option value="">Select</option>
                  <option value="self_occupied">Self-occupied</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
              {form.residentialReady.occupancyStatus === "rented" ? (
                <>
                  <div>
                    <label className={dashLabel}>Monthly rent (₹)</label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      className={dashInput}
                      value={form.residentialReady.monthlyRent || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          residentialReady: {
                            ...f.residentialReady,
                            monthlyRent: Number(e.target.value) || 0,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={dashLabel}>Security deposit (₹)</label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      className={dashInput}
                      value={form.residentialReady.securityDeposit || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          residentialReady: {
                            ...f.residentialReady,
                            securityDeposit: Number(e.target.value) || 0,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={dashLabel}>Lease expiry date</label>
                    <input
                      type="date"
                      className={dashInput}
                      value={form.residentialReady.leaseExpiryDate}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          residentialReady: {
                            ...f.residentialReady,
                            leaseExpiryDate: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </>
              ) : null}
              <div>
                <label className={dashLabel}>Monthly maintenance (₹)</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className={dashInput}
                  value={form.residentialReady.monthlyMaintenance || ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      residentialReady: {
                        ...f.residentialReady,
                        monthlyMaintenance: Number(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <label className={dashLabel}>Annual property tax (₹)</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className={dashInput}
                  value={form.residentialReady.annualPropertyTax || ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      residentialReady: {
                        ...f.residentialReady,
                        annualPropertyTax: Number(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </CollapsibleSection>
        ) : null}

        {cat === "commercial_ready" ? (
          <>
            <CollapsibleSection title="Commercial — ready to move" defaultOpen>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={dashLabel}>Property type</label>
                  <select
                    className={dashSelect}
                    value={form.commercialReady.commercialPropertyType}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        commercialReady: {
                          ...f.commercialReady,
                          commercialPropertyType: e.target.value,
                        },
                      }))
                    }
                  >
                    <option value="">Select</option>
                    {COM_READY_TYPE.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={dashLabel}>Lease status</label>
                  <select
                    className={dashSelect}
                    value={form.commercialReady.leaseStatus}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        commercialReady: {
                          ...f.commercialReady,
                          leaseStatus: e.target.value as PortfolioPropertyPayload["commercialReady"]["leaseStatus"],
                        },
                      }))
                    }
                  >
                    <option value="">Select</option>
                    <option value="vacant">Vacant</option>
                    <option value="pre_leased">Pre-leased</option>
                  </select>
                </div>
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="Tenant details" defaultOpen>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={dashLabel}>Tenant type</label>
                  <select
                    className={dashSelect}
                    value={form.commercialReady.tenantDetails.tenantType}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        commercialReady: {
                          ...f.commercialReady,
                          tenantDetails: {
                            tenantType: e.target.value,
                          },
                        },
                      }))
                    }
                  >
                    <option value="">Select</option>
                    {TENANT_TYPES.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="Lease structure" defaultOpen>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={dashLabel}>Lock-in period (months)</label>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    className={dashInput}
                    value={form.commercialReady.leaseTerms.lockInPeriodMonths || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        commercialReady: {
                          ...f.commercialReady,
                          leaseTerms: {
                            ...f.commercialReady.leaseTerms,
                            lockInPeriodMonths: Number(e.target.value) || 0,
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>Lease start date</label>
                  <input
                    type="date"
                    className={dashInput}
                    value={form.commercialReady.leaseTerms.leaseStartDate}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        commercialReady: {
                          ...f.commercialReady,
                          leaseTerms: {
                            ...f.commercialReady.leaseTerms,
                            leaseStartDate: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>Lease end date</label>
                  <input
                    type="date"
                    className={dashInput}
                    value={form.commercialReady.leaseTerms.leaseEndDate}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        commercialReady: {
                          ...f.commercialReady,
                          leaseTerms: {
                            ...f.commercialReady.leaseTerms,
                            leaseEndDate: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>Escalation (% per period)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={dashInput}
                    placeholder="%"
                    value={form.commercialReady.leaseTerms.escalationPercent || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        commercialReady: {
                          ...f.commercialReady,
                          leaseTerms: {
                            ...f.commercialReady.leaseTerms,
                            escalationPercent: Number(e.target.value) || 0,
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>Escalation every (years)</label>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    className={dashInput}
                    value={form.commercialReady.leaseTerms.escalationEveryYears || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        commercialReady: {
                          ...f.commercialReady,
                          leaseTerms: {
                            ...f.commercialReady.leaseTerms,
                            escalationEveryYears: Number(e.target.value) || 0,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="Financial performance (NOI)" defaultOpen>
              <p className="text-sm text-gray-500 mb-4">
                NOI is computed as: annual rent minus maintenance, property tax, and
                insurance (commercial).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={dashLabel}>Monthly rent (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={dashInput}
                    value={form.commercialReady.monthlyRent || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        commercialReady: {
                          ...f.commercialReady,
                          monthlyRent: Number(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>Monthly maintenance (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={dashInput}
                    value={form.commercialReady.monthlyMaintenance || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        commercialReady: {
                          ...f.commercialReady,
                          monthlyMaintenance: Number(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>Annual property tax (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={dashInput}
                    value={form.commercialReady.annualPropertyTax || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        commercialReady: {
                          ...f.commercialReady,
                          annualPropertyTax: Number(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={dashLabel}>Annual insurance (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={dashInput}
                    value={form.commercialReady.insuranceAnnual || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        commercialReady: {
                          ...f.commercialReady,
                          insuranceAnnual: Number(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2 rounded-2xl bg-[#0a1628] text-white px-5 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">
                    Calculated NOI (annual)
                  </p>
                  <p className="text-2xl font-black tabular-nums">
                    {formatINR(
                      annualNOICommercialReady({
                        monthlyRent: num(form.commercialReady.monthlyRent),
                        monthlyMaintenance: num(
                          form.commercialReady.monthlyMaintenance
                        ),
                        annualPropertyTax: num(
                          form.commercialReady.annualPropertyTax
                        ),
                        insuranceAnnual: num(form.commercialReady.insuranceAnnual),
                      })
                    )}
                  </p>
                </div>
              </div>
            </CollapsibleSection>
          </>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
          {error}
        </p>
      ) : null}
      {draftNotice ? (
        <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
          {draftNotice}
        </p>
      ) : null}
      {importNotice ? (
        <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
          {importNotice}
        </p>
      ) : null}

      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <button
          type="button"
          onClick={saveDraftLocal}
          className="rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-[#0a1628] hover:border-[#F56A22]/40 transition-all"
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={clearDraft}
          className="rounded-2xl border border-transparent px-6 py-4 text-sm font-bold text-gray-500 hover:text-[#0a1628] transition-colors"
        >
          Clear draft
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-[#F56A22] px-10 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-orange-600 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/25 sm:ml-auto"
        >
          {saving ? "Saving…" : isEditMode ? "Update property" : "Save to portfolio"}
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-6xl px-4 py-4 md:py-5">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#F56A22] mb-3">
            Investment summary (live)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">
                Total investment
              </p>
              <p className="text-sm md:text-base font-black text-[#0a1628] tabular-nums truncate">
                {formatINR(metrics.totalInvestment)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">
                On loan
              </p>
              <p className="text-sm md:text-base font-black text-[#0a1628] tabular-nums truncate">
                {formatINR(metrics.loanRemaining)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">
                Monthly cashflow
              </p>
              <p className="text-sm md:text-base font-black text-[#0a1628] tabular-nums truncate">
                {metrics.monthlyCashflow === null
                  ? "—"
                  : formatINR(metrics.monthlyCashflow)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">
                NOI (annual)
              </p>
              <p className="text-sm md:text-base font-black text-[#0a1628] tabular-nums truncate">
                {metrics.annualNOI === null ? "—" : formatINR(metrics.annualNOI)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-3 col-span-2 sm:col-span-1">
              <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">
                Rental yield (NOI / cost)
              </p>
              <p className="text-sm md:text-base font-black text-[#0a1628] tabular-nums">
                {metrics.yieldPct === null
                  ? "—"
                  : `${metrics.yieldPct.toFixed(2)}%`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
