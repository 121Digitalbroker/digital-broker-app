"use client";

import dynamic from "next/dynamic";

type AssetAllocationDatum = {
  name: string;
  value: number;
  percentage?: number;
};

type FundAllocationDatum = {
  propertyName: string;
  investment: number;
};

type RentalRoiDatum = {
  propertyName: string;
  rentalRoi: number;
};

type CombinedRoiDatum = {
  propertyName: string;
  rentalRoi: number;
  capitalRoi: number;
  combinedRoi: number;
};

type Props = {
  assetAllocation: AssetAllocationDatum[];
  fundAllocation: FundAllocationDatum[];
  rentalRoi: RentalRoiDatum[];
  combinedRoi: CombinedRoiDatum[];
  earningsTimeline: Array<Record<string, string | number>>;
  summary: {
    totalPortfolioValue: number;
    totalAmountPaid: number;
    totalArea: number;
    paidPercentage: number;
  };
};

const PortfolioAnalyticsChartsNoSSR = dynamic(
  () => import("./PortfolioAnalyticsCharts"),
  { ssr: false }
);

export default function PortfolioAnalyticsChartsClient(props: Props) {
  return <PortfolioAnalyticsChartsNoSSR {...props} />;
}

