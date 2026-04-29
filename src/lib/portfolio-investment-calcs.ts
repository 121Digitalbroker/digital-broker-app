export type PortfolioCategory =
  | "residential"
  | "commercial";

export function num(v: unknown): number {
  if (v === "" || v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Annual NOI for commercial ready: Rent – Maintenance – Property Tax – Insurance (all annualized where needed). */
export function annualNOICommercialReady(input: {
  monthlyRent: number;
  monthlyMaintenance: number;
  annualPropertyTax: number;
  insuranceAnnual: number;
}): number {
  const rent = input.monthlyRent * 12;
  const maint = input.monthlyMaintenance * 12;
  return rent - maint - input.annualPropertyTax - input.insuranceAnnual;
}

/** Annual NOI for residential ready when rented (no insurance in spec). */
export function annualNOIResidentialRented(input: {
  monthlyRent: number;
  monthlyMaintenance: number;
  annualPropertyTax: number;
}): number {
  const rent = input.monthlyRent * 12;
  const maint = input.monthlyMaintenance * 12;
  return rent - maint - input.annualPropertyTax;
}

export function monthlyCashflowResidentialReady(input: {
  monthlyRent: number;
  monthlyMaintenance: number;
  annualPropertyTax: number;
  emiAmount: number;
  occupancyStatus: "self_occupied" | "rented" | "";
}): number {
  if (input.occupancyStatus !== "rented") return -input.emiAmount;
  const taxMonthly = input.annualPropertyTax / 12;
  return (
    input.monthlyRent -
    input.monthlyMaintenance -
    taxMonthly -
    input.emiAmount
  );
}

export function monthlyCashflowCommercialReady(input: {
  monthlyRent: number;
  monthlyMaintenance: number;
  annualPropertyTax: number;
  insuranceAnnual: number;
  emiAmount: number;
}): number {
  const taxM = input.annualPropertyTax / 12;
  const insM = input.insuranceAnnual / 12;
  return (
    input.monthlyRent -
    input.monthlyMaintenance -
    taxM -
    insM -
    input.emiAmount
  );
}

export function rentalYieldPercent(input: {
  annualNOI: number;
  totalInvestment: number;
}): number {
  if (input.totalInvestment <= 0) return 0;
  return (input.annualNOI / input.totalInvestment) * 100;
}
