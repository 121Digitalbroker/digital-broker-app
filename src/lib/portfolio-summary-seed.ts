export type CsvSummaryDetails = {
  monthOfFirstInstallment: string;
  type: string;
  product: string;
  natureOfProperty: string;
  finalBsp: number;
  paidBsp: number;
  paymentPlan: string;
  nextDemandDue: string;
  nextDemandAmount: number | null;
  otherChargesPayableOn: string;
  presentBasicCost: number;
  actualExitPriceApprox: number;
  valueAppreciation: number;
  valueAppreciationPercent: string;
  actualAppreciation: number;
  actualAppreciationPercent: string;
  returnOnInvestmentCapital: string;
  presentRentalValuePsqft: number;
  presentRentalValueMonthly: number;
  presentRentalValueAnnual: number;
  presentRentalRoi: string;
  committedRentalValuePsqft: number;
  committedRentalValueMonthly: number;
  committedRentalValueAnnual: number;
  committedRentalRoi: string;
  expectedRentalValuePsqft: number;
  expectedRentalValueMonthly: number;
  expectedRentalValueAnnual: number;
  expectedRentalRoi: string;
  presentCombinedRoi: string;
  committedCombinedRoi: string;
  expectedCombinedRoi: string;
  presentDate: string;
  durationMonths: number;
  roiCalculatedAnnually: string;
};

export type SeedPortfolioRow = {
  developerName: string;
  projectName: string;
  unitDetails: string;
  sizeSqft: number;
  acquisitionCost: number;
  paidAmount: number;
  balanceAmount: number;
  otherCharges: number;
  purchaseDate: string;
  expectedMonthlyRent: number;
  csvSummary: CsvSummaryDetails;
};

export const PORTFOLIO_SUMMARY_SEED_ROWS: SeedPortfolioRow[] = [
  {
    developerName: "Splendor",
    projectName: "Onyx",
    unitDetails: "G-29D",
    sizeSqft: 358,
    acquisitionCost: 8860500,
    paidAmount: 3848500,
    balanceAmount: 5012000,
    otherCharges: 179000,
    purchaseDate: "2024-03-01",
    expectedMonthlyRent: 64440,
    csvSummary: {
      monthOfFirstInstallment: "3/1/2024",
      type: "Retail",
      product: "Ground floor Retail",
      natureOfProperty: "Lockable/Leasable",
      finalBsp: 24750,
      paidBsp: 12375,
      paymentPlan: "50:25:25",
      nextDemandDue: "Dec'2026",
      nextDemandAmount: 2506000,
      otherChargesPayableOn: "Possession",
      presentBasicCost: 33500,
      actualExitPriceApprox: 29000,
      valueAppreciation: 8750,
      valueAppreciationPercent: "35.35%",
      actualAppreciation: 4250,
      actualAppreciationPercent: "17.17%",
      returnOnInvestmentCapital: "34.34%",
      presentRentalValuePsqft: 0,
      presentRentalValueMonthly: 0,
      presentRentalValueAnnual: 0,
      presentRentalRoi: "0.00%",
      committedRentalValuePsqft: 0,
      committedRentalValueMonthly: 0,
      committedRentalValueAnnual: 0,
      committedRentalRoi: "0.00%",
      expectedRentalValuePsqft: 180,
      expectedRentalValueMonthly: 64440,
      expectedRentalValueAnnual: 773280,
      expectedRentalRoi: "8.73%",
      presentCombinedRoi: "34.34%",
      committedCombinedRoi: "34.34%",
      expectedCombinedRoi: "43.07%",
      presentDate: "4/28/2026",
      durationMonths: 25.42,
      roiCalculatedAnnually: "16.21%",
    },
  },
  {
    developerName: "M3M",
    projectName: "The Line",
    unitDetails: "FR1/81",
    sizeSqft: 217,
    acquisitionCost: 6007211,
    paidAmount: 1444017,
    balanceAmount: 4572722,
    otherCharges: 292950,
    purchaseDate: "2024-10-01",
    expectedMonthlyRent: 39060,
    csvSummary: {
      monthOfFirstInstallment: "10/1/2024",
      type: "Gaming Zone",
      product: "FEC",
      natureOfProperty: "Leasable",
      finalBsp: 27683,
      paidBsp: 6643.92,
      paymentPlan: "24:76:",
      nextDemandDue: "Sept'2026",
      nextDemandAmount: 4572722,
      otherChargesPayableOn: "Possession",
      presentBasicCost: 31500,
      actualExitPriceApprox: 30000,
      valueAppreciation: 3817,
      valueAppreciationPercent: "13.79%",
      actualAppreciation: 2317,
      actualAppreciationPercent: "8.37%",
      returnOnInvestmentCapital: "34.87%",
      presentRentalValuePsqft: 0,
      presentRentalValueMonthly: 0,
      presentRentalValueAnnual: 0,
      presentRentalRoi: "0.00%",
      committedRentalValuePsqft: 135,
      committedRentalValueMonthly: 29295,
      committedRentalValueAnnual: 351540,
      committedRentalRoi: "5.85%",
      expectedRentalValuePsqft: 180,
      expectedRentalValueMonthly: 39060,
      expectedRentalValueAnnual: 468720,
      expectedRentalRoi: "7.80%",
      presentCombinedRoi: "34.87%",
      committedCombinedRoi: "40.73%",
      expectedCombinedRoi: "42.68%",
      presentDate: "4/28/2026",
      durationMonths: 18.52,
      roiCalculatedAnnually: "22.60%",
    },
  },
  {
    developerName: "M3M",
    projectName: "The Line",
    unitDetails: "FR1/32",
    sizeSqft: 228,
    acquisitionCost: 6311724,
    paidAmount: 1514813,
    balanceAmount: 4796910,
    otherCharges: 307800,
    purchaseDate: "2024-11-01",
    expectedMonthlyRent: 41040,
    csvSummary: {
      monthOfFirstInstallment: "11/1/2024",
      type: "Gaming Zone",
      product: "FEC",
      natureOfProperty: "Leasable",
      finalBsp: 27683,
      paidBsp: 6643.92,
      paymentPlan: "24:76:",
      nextDemandDue: "Sept'2026",
      nextDemandAmount: 4796910,
      otherChargesPayableOn: "Possession",
      presentBasicCost: 31500,
      actualExitPriceApprox: 30000,
      valueAppreciation: 3817,
      valueAppreciationPercent: "13.79%",
      actualAppreciation: 2317,
      actualAppreciationPercent: "8.37%",
      returnOnInvestmentCapital: "34.87%",
      presentRentalValuePsqft: 0,
      presentRentalValueMonthly: 0,
      presentRentalValueAnnual: 0,
      presentRentalRoi: "0.00%",
      committedRentalValuePsqft: 135,
      committedRentalValueMonthly: 30780,
      committedRentalValueAnnual: 369360,
      committedRentalRoi: "5.85%",
      expectedRentalValuePsqft: 180,
      expectedRentalValueMonthly: 41040,
      expectedRentalValueAnnual: 492480,
      expectedRentalRoi: "7.80%",
      presentCombinedRoi: "34.87%",
      committedCombinedRoi: "40.73%",
      expectedCombinedRoi: "42.68%",
      presentDate: "4/28/2026",
      durationMonths: 17.52,
      roiCalculatedAnnually: "23.89%",
    },
  },
  {
    developerName: "CRC",
    projectName: "The Flagship",
    unitDetails: "Anchor No. 11",
    sizeSqft: 640,
    acquisitionCost: 10304000,
    paidAmount: 5152000,
    balanceAmount: 5152000,
    otherCharges: 640000,
    purchaseDate: "2024-11-01",
    expectedMonthlyRent: 86400,
    csvSummary: {
      monthOfFirstInstallment: "11/1/2024",
      type: "Retail",
      product: "LGF Retail",
      natureOfProperty: "Lockable/Leasable",
      finalBsp: 16100,
      paidBsp: 8050,
      paymentPlan: "50:20:20:10",
      nextDemandDue: "Mar'2025",
      nextDemandAmount: 2060800,
      otherChargesPayableOn: "Possession",
      presentBasicCost: 20000,
      actualExitPriceApprox: 18500,
      valueAppreciation: 3900,
      valueAppreciationPercent: "24.22%",
      actualAppreciation: 2400,
      actualAppreciationPercent: "14.91%",
      returnOnInvestmentCapital: "29.81%",
      presentRentalValuePsqft: 0,
      presentRentalValueMonthly: 0,
      presentRentalValueAnnual: 0,
      presentRentalRoi: "0.00%",
      committedRentalValuePsqft: 112,
      committedRentalValueMonthly: 71680,
      committedRentalValueAnnual: 860160,
      committedRentalRoi: "8.35%",
      expectedRentalValuePsqft: 135,
      expectedRentalValueMonthly: 86400,
      expectedRentalValueAnnual: 1036800,
      expectedRentalRoi: "10.06%",
      presentCombinedRoi: "29.81%",
      committedCombinedRoi: "38.16%",
      expectedCombinedRoi: "39.88%",
      presentDate: "4/28/2026",
      durationMonths: 17.52,
      roiCalculatedAnnually: "20.42%",
    },
  },
  {
    developerName: "Group 108",
    projectName: "One FNG",
    unitDetails: "F1-06",
    sizeSqft: 760,
    acquisitionCost: 18962000,
    paidAmount: 8532900,
    balanceAmount: 10429100,
    otherCharges: 950000,
    purchaseDate: "2025-07-01",
    expectedMonthlyRent: 152000,
    csvSummary: {
      monthOfFirstInstallment: "7/1/2025",
      type: "Retail",
      product: "Ground Floor Retail",
      natureOfProperty: "Lockable/Leasable",
      finalBsp: 24950,
      paidBsp: 12475,
      paymentPlan: "50:50:",
      nextDemandDue: "Dec'2025",
      nextDemandAmount: 10429100,
      otherChargesPayableOn: "Possession",
      presentBasicCost: 33500,
      actualExitPriceApprox: 29000,
      valueAppreciation: 8550,
      valueAppreciationPercent: "34.27%",
      actualAppreciation: 4050,
      actualAppreciationPercent: "16.23%",
      returnOnInvestmentCapital: "32.46%",
      presentRentalValuePsqft: 0,
      presentRentalValueMonthly: 0,
      presentRentalValueAnnual: 0,
      presentRentalRoi: "0.00%",
      committedRentalValuePsqft: 0,
      committedRentalValueMonthly: 0,
      committedRentalValueAnnual: 0,
      committedRentalRoi: "0.00%",
      expectedRentalValuePsqft: 200,
      expectedRentalValueMonthly: 152000,
      expectedRentalValueAnnual: 1824000,
      expectedRentalRoi: "9.62%",
      presentCombinedRoi: "32.46%",
      committedCombinedRoi: "32.46%",
      expectedCombinedRoi: "42.08%",
      presentDate: "4/28/2026",
      durationMonths: 9.71,
      roiCalculatedAnnually: "40.12%",
    },
  },
  {
    developerName: "Fusion",
    projectName: "Ufairia",
    unitDetails: "RF-904",
    sizeSqft: 670,
    acquisitionCost: 6083600,
    paidAmount: 6083600,
    balanceAmount: 0,
    otherCharges: 532792,
    purchaseDate: "2025-10-01",
    expectedMonthlyRent: 50250,
    csvSummary: {
      monthOfFirstInstallment: "10/1/2025",
      type: "Studio",
      product: "Studio",
      natureOfProperty: "Lockable",
      finalBsp: 9080,
      paidBsp: 9080,
      paymentPlan: "100",
      nextDemandDue: "NA",
      nextDemandAmount: null,
      otherChargesPayableOn: "Paid",
      presentBasicCost: 11999,
      actualExitPriceApprox: 10000,
      valueAppreciation: 2919,
      valueAppreciationPercent: "32.15%",
      actualAppreciation: 920,
      actualAppreciationPercent: "10.13%",
      returnOnInvestmentCapital: "10.13%",
      presentRentalValuePsqft: 55.52,
      presentRentalValueMonthly: 37198.4,
      presentRentalValueAnnual: 446380.8,
      presentRentalRoi: "7.34%",
      committedRentalValuePsqft: 60,
      committedRentalValueMonthly: 40200,
      committedRentalValueAnnual: 482400,
      committedRentalRoi: "7.93%",
      expectedRentalValuePsqft: 75,
      expectedRentalValueMonthly: 50250,
      expectedRentalValueAnnual: 603000,
      expectedRentalRoi: "9.91%",
      presentCombinedRoi: "17.47%",
      committedCombinedRoi: "18.06%",
      expectedCombinedRoi: "20.04%",
      presentDate: "4/28/2026",
      durationMonths: 6.74,
      roiCalculatedAnnually: "31.09%",
    },
  },
];

export function findSeedRowByProjectUnit(
  projectName: string,
  unitDetails: string
): SeedPortfolioRow | undefined {
  const project = projectName.trim().toLowerCase();
  const unit = unitDetails.trim().toLowerCase();
  return PORTFOLIO_SUMMARY_SEED_ROWS.find(
    (row) =>
      row.projectName.trim().toLowerCase() === project &&
      row.unitDetails.trim().toLowerCase() === unit
  );
}

