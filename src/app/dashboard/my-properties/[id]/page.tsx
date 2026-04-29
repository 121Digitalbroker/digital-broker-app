import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPortfolioPropertyModel } from "@/models/portfolio/PortfolioProperty";
import DeletePropertyButton from "./DeletePropertyButton";
import DashboardVisibilityButton from "./DashboardVisibilityButton";
import {
  type CsvSummaryDetails,
  findSeedRowByProjectUnit,
} from "@/lib/portfolio-summary-seed";

type KV = Record<string, unknown>;

type PropertyDetails = {
  _id: unknown;
  ownerId: string;
  projectName?: string;
  developerName?: string;
  propertyCategory?: string;
  includeInDashboard?: boolean;
  constructionStatus?: string;
  description?: string;
  city?: string;
  sector?: string;
  location?: {
    cityMicroMarket?: string;
    sector?: string;
  };
  financials?: KV;
  residentialReady?: KV;
  residentialUnderConstruction?: KV;
  commercialReady?: KV;
  commercialUnderConstruction?: KV;
  csvSummary?: CsvSummaryDetails;
  createdAt?: Date;
  updatedAt?: Date;
};

function labelFromCategory(v?: string): string {
  const value = String(v ?? "");
  if (value === "residential_ready") return "Residential • Ready";
  if (value === "residential_under_construction") return "Residential • Under Construction";
  if (value === "commercial_ready") return "Commercial • Ready";
  if (value === "commercial_under_construction") return "Commercial • Under Construction";
  return value || "—";
}

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

function formatDate(v: unknown): string {
  if (!v) return "—";
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString("en-IN");
}

function formatCurrency(v: unknown): string {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatNumeric(v: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(v);
}

function formatAny(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "number") return new Intl.NumberFormat("en-IN").format(v);
  if (typeof v === "string") {
    if (v.includes("date") || /^\d{4}-\d{2}-\d{2}/.test(v)) {
      return formatDate(v);
    }
    return v;
  }
  if (v instanceof Date) return formatDate(v.toISOString());
  return String(v);
}

function asNumber(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function pct(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, (value / total) * 100));
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#0a1628]">{value || "—"}</p>
    </div>
  );
}

function MiniStat({
  title,
  value,
  accent = "text-[#0a1628]",
}: {
  title: string;
  value: string;
  accent?: string;
}) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">{title}</p>
      <p className={`mt-2 text-3xl font-black leading-none ${accent}`}>{value}</p>
    </article>
  );
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/dashboard/my-properties");

  const { id } = await params;
  const PortfolioProperty = await getPortfolioPropertyModel();
  const property = (await PortfolioProperty.findOne({ _id: id, ownerId: userId }).lean()) as PropertyDetails | null;

  if (!property) notFound();

  const financials = property.financials ?? {};
  const acquisitionCost = asNumber(financials.acquisitionCost);
  const paidAmountRaw = asNumber(financials.selfFundedPaidAmount);
  const remainingLoan = asNumber(financials.balanceLoanRemaining);
  const perSqftCost = asNumber(financials.perSqftCost);
  const monthlyEmi = asNumber(financials.emiAmount);
  const interestRate = asNumber(financials.interestRate);
  const carpetArea = asNumber(financials.totalAreaCarpetSqft);
  const superBuiltArea = asNumber(financials.totalAreaSuperBuiltUpSqft);
  const areaBasis = String(financials.areaBasis ?? "—");
  const fundingType = String(financials.fundingType ?? "—");
  const bankName = String(financials.bankName ?? "—");
  const purchaseDate = formatDate(financials.purchaseDate);

  const paidAmount =
    fundingType === "self_funded" && paidAmountRaw <= 0 ? acquisitionCost : paidAmountRaw;
  const loanCapital = Math.max(0, acquisitionCost - paidAmount);
  const equityPct = pct(paidAmount, acquisitionCost);
  const loanPct = pct(loanCapital, acquisitionCost);
  const chartBars = [
    Math.max(10, pct(acquisitionCost * 0.18, acquisitionCost)),
    Math.max(10, pct(acquisitionCost * 0.25, acquisitionCost)),
    Math.max(10, pct(acquisitionCost * 0.48, acquisitionCost)),
    Math.max(10, pct(acquisitionCost * 0.38, acquisitionCost)),
    Math.max(10, pct(acquisitionCost * 0.72, acquisitionCost)),
  ];

  const locationLabel = `${property.location?.cityMicroMarket || property.city || "—"}${
    property.location?.sector || property.sector ? `, ${property.location?.sector || property.sector}` : ""
  }`;
  const csvSummary =
    property.csvSummary ??
    findSeedRowByProjectUnit(
      String(property.projectName ?? ""),
      String(property.location?.sector ?? property.sector ?? "")
    )?.csvSummary;
  const statusLabel = String(property.constructionStatus || "").toLowerCase() === "ready" ? "Ready" : "Under Construction";
  const statusDot = String(property.constructionStatus || "").toLowerCase() === "ready" ? "bg-emerald-500" : "bg-amber-500";

  return (
    <>
      <div className="mb-8">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#F56A22] mb-2">Portfolio hub</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-black text-[#0a1628] tracking-tight">
            {property.projectName || "Untitled property"}
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
            <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
            {statusLabel}
          </span>
        </div>
        <p className="mt-2 text-gray-500 text-sm">
          {locationLabel} &nbsp; • &nbsp; {labelFromCategory(property.propertyCategory)} &nbsp; • &nbsp; Added on{" "}
          {formatDate(property.createdAt)}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2.5">
        <Link
          href="/dashboard/my-properties"
          className="inline-flex rounded-xl border border-gray-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#0a1628] hover:border-gray-300 transition-colors"
        >
          Back to listings
        </Link>
        <Link
          href={`/dashboard/create?edit=${String(property._id)}`}
          className="inline-flex rounded-xl bg-[#F56A22] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-600 transition-colors"
        >
          Edit property
        </Link>
        <DashboardVisibilityButton
          id={String(property._id)}
          initiallyHidden={property.includeInDashboard === false}
        />
        <DeletePropertyButton id={String(property._id)} />
      </div>

      <section className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MiniStat title="Total Investment" value={formatCurrency(acquisitionCost)} />
          <MiniStat title="Loan Remaining" value={formatCurrency(remainingLoan)} accent="text-[#ef4444]" />
          <MiniStat title="Self Funded Amount" value={formatCurrency(paidAmount)} accent="text-[#14b8a6]" />
          <MiniStat title="Price per Sqft" value={formatCurrency(perSqftCost)} />
        </div>

        {csvSummary ? (
          <>
            <article className="rounded-2xl border border-[#F56A22]/20 bg-[#fff7f2] p-5 shadow-sm">
              <h3 className="mb-4 text-xl font-black text-[#0a1628]">Summary</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoPair label="1st Installment" value={csvSummary.monthOfFirstInstallment} />
                <InfoPair label="Unit Type" value={csvSummary.type} />
                <InfoPair label="Product" value={csvSummary.product} />
                <InfoPair label="Nature" value={csvSummary.natureOfProperty} />
                <InfoPair label="Payment Plan" value={csvSummary.paymentPlan} />
                <InfoPair label="Next Demand Due" value={csvSummary.nextDemandDue} />
                <InfoPair
                  label="Next Demand Amount"
                  value={
                    csvSummary.nextDemandAmount === null
                      ? "NA"
                      : formatCurrency(csvSummary.nextDemandAmount)
                  }
                />
                <InfoPair label="Other Charges Payable" value={csvSummary.otherChargesPayableOn} />
              </div>
            </article>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-xl font-black text-[#0a1628]">Price & Appreciation</h3>
                <div className="space-y-2 text-sm">
                  <InfoPair label="Final BSP" value={formatCurrency(csvSummary.finalBsp)} />
                  <InfoPair label="Paid BSP" value={formatCurrency(csvSummary.paidBsp)} />
                  <InfoPair label="Present Basic Cost" value={formatCurrency(csvSummary.presentBasicCost)} />
                  <InfoPair label="Actual Exit Price" value={formatCurrency(csvSummary.actualExitPriceApprox)} />
                  <InfoPair
                    label="Value Appreciation"
                    value={`${formatCurrency(csvSummary.valueAppreciation)} (${csvSummary.valueAppreciationPercent})`}
                  />
                  <InfoPair
                    label="Actual Appreciation"
                    value={`${formatCurrency(csvSummary.actualAppreciation)} (${csvSummary.actualAppreciationPercent})`}
                  />
                  <InfoPair
                    label="Capital ROI"
                    value={csvSummary.returnOnInvestmentCapital}
                  />
                </div>
              </article>

              <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-xl font-black text-[#0a1628]">Rental Values</h3>
                <div className="space-y-3 text-sm">
                  <InfoPair
                    label="Present Rental"
                    value={`${formatNumeric(csvSummary.presentRentalValuePsqft)} / sqft | ${formatCurrency(
                      csvSummary.presentRentalValueMonthly
                    )}/m | ${formatCurrency(csvSummary.presentRentalValueAnnual)}/y`}
                  />
                  <InfoPair label="Present Rental ROI" value={csvSummary.presentRentalRoi} />
                  <InfoPair
                    label="Committed Rental"
                    value={`${formatNumeric(csvSummary.committedRentalValuePsqft)} / sqft | ${formatCurrency(
                      csvSummary.committedRentalValueMonthly
                    )}/m | ${formatCurrency(csvSummary.committedRentalValueAnnual)}/y`}
                  />
                  <InfoPair label="Committed Rental ROI" value={csvSummary.committedRentalRoi} />
                  <InfoPair
                    label="Expected Rental"
                    value={`${formatNumeric(csvSummary.expectedRentalValuePsqft)} / sqft | ${formatCurrency(
                      csvSummary.expectedRentalValueMonthly
                    )}/m | ${formatCurrency(csvSummary.expectedRentalValueAnnual)}/y`}
                  />
                  <InfoPair label="Expected Rental ROI" value={csvSummary.expectedRentalRoi} />
                </div>
              </article>

              <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-xl font-black text-[#0a1628]">Combined ROI</h3>
                <div className="space-y-2 text-sm">
                  <InfoPair label="Present Combined ROI" value={csvSummary.presentCombinedRoi} />
                  <InfoPair label="Committed Combined ROI" value={csvSummary.committedCombinedRoi} />
                  <InfoPair label="Expected Combined ROI" value={csvSummary.expectedCombinedRoi} />
                  <InfoPair label="ROI Calculated Annually" value={csvSummary.roiCalculatedAnnually} />
                  <InfoPair label="Present Date" value={csvSummary.presentDate} />
                  <InfoPair label="Duration (Months)" value={formatNumeric(csvSummary.durationMonths)} />
                </div>
              </article>
            </div>
          </>
        ) : null}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-[#0a1628]">Investment Timeline</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">Loan vs self funded</p>
            </div>
            <div className="grid h-44 grid-cols-5 items-end gap-3">
              {chartBars.map((h, idx) => (
                <div key={`bar-${idx}`} className="flex h-full items-end">
                  <div className="w-full rounded-t-lg bg-gray-100">
                    <div className="rounded-t-lg bg-[#99d5d1]" style={{ height: `${h}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-5 text-center text-[10px] font-black uppercase tracking-wider text-gray-300">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </article>

          <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-[#0a1628]">Funding Structure</h2>
            <div className="mx-auto mt-4 h-40 w-40 rounded-full" style={{ background: `conic-gradient(#f55d3d 0 ${loanPct}%, #2bb5ab ${loanPct}% 100%)` }}>
              <div className="flex h-full w-full items-center justify-center rounded-full border-[14px] border-white bg-white">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#0a1628]">{Math.round(loanPct)}/{Math.round(equityPct)}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">Ratio</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-semibold text-gray-600">Loan Capital</span>
                <span className="font-black text-[#f55d3d]">{loanPct.toFixed(0)}%</span>
              </p>
              <p className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-semibold text-gray-600">Equity</span>
                <span className="font-black text-[#2bb5ab]">{equityPct.toFixed(0)}%</span>
              </p>
            </div>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xl font-black text-[#0a1628]">Project Info</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoPair label="Project Name" value={String(property.projectName ?? "—")} />
              <InfoPair label="Developer" value={String(property.developerName ?? "—")} />
              <InfoPair label="Category" value={labelFromCategory(property.propertyCategory)} />
              <InfoPair label="Area Size" value={`${new Intl.NumberFormat("en-IN").format(superBuiltArea || carpetArea)} sqft`} />
              <InfoPair label="Address" value={locationLabel} />
              <InfoPair label="Purchase Date" value={purchaseDate} />
            </div>
            {property.description ? (
              <p className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">{property.description}</p>
            ) : null}
          </article>

          <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xl font-black text-[#0a1628]">Funding Info</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoPair label="Bank Name" value={bankName} />
              <InfoPair label="Interest Rate" value={interestRate > 0 ? `${interestRate}%` : "—"} />
              <InfoPair label="Monthly EMI" value={monthlyEmi > 0 ? formatCurrency(monthlyEmi) : "—"} />
              <InfoPair label="Remaining Principal" value={formatCurrency(remainingLoan)} />
              <InfoPair label="Funding Type" value={humanizeKey(fundingType)} />
              <InfoPair label="Balance Updated" value={formatDate(property.updatedAt)} />
            </div>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">Carpet Area</p>
            <p className="mt-2 text-2xl font-black text-[#0a1628]">
              {new Intl.NumberFormat("en-IN").format(carpetArea)} sqft
            </p>
          </article>
          <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">Super Built-up</p>
            <p className="mt-2 text-2xl font-black text-[#0a1628]">
              {new Intl.NumberFormat("en-IN").format(superBuiltArea)} sqft
            </p>
          </article>
          <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">Area Basis</p>
            <p className="mt-2 text-2xl font-black text-[#0a1628]">{humanizeKey(areaBasis)}</p>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#0a1628]">Documents</h3>
              <span className="text-xs font-bold text-[#F56A22]">View all</span>
            </div>
            <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
              Upload Agreement (PDF/DOC)
            </p>
          </article>

          <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xl font-black text-[#0a1628]">Notes</h3>
            <p className="rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-600">
              {property.description || "Add private notes for this property, follow-ups, and reminders."}
            </p>
          </article>

          <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xl font-black text-[#0a1628]">Activity Timeline</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-gray-600">Property added on {formatDate(property.createdAt)}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-orange-400" />
                <span className="text-gray-600">Funding details updated {formatDate(property.updatedAt)}</span>
              </li>
            </ul>
          </article>
        </div>

        <article className="rounded-2xl border border-gray-100 bg-gradient-to-r from-[#1f3f36] via-[#2f6f5b] to-[#306a55] p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/80">Location Highlight</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-2xl font-black text-white">{locationLabel}</p>
            <a
              className="inline-flex rounded-xl bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-[#0a1628]"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLabel)}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in maps
            </a>
          </div>
        </article>
      </section>
    </>
  );
}
