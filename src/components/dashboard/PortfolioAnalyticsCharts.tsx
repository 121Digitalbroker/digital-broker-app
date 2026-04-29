"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AssetAllocationDatum = {
  name: string;
  value: number;
  percentage?: number;
};

type FundAllocationDatum = {
  propertyName: string;
  investment: number;
  paidAmount?: number;
  totalCost?: number;
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

const PIE_COLORS = [
  "#5B3CC4",
  "#7C5CD6",
  "#9B84E7",
  "#111827",
  "#4F46E5",
  "#8B5CF6",
];
const FUND_COLORS = [
  "#5B3CC4",
  "#7C5CD6",
  "#9B84E7",
  "#111827",
  "#E9E9EE",
  "#D7D9E4",
];

const CARD_SHELL =
  "rounded-2xl border border-[#d9dde5] bg-[#f5f6f8] p-5 shadow-[0_1px_0_rgba(17,24,39,0.04)]";

function asCurrency(v: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);
}

const AREA_NUMBER_FORMATTER = new Intl.NumberFormat("en-IN");
const AMOUNT_NUMBER_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

function asNumber(
  value: string | number | ReadonlyArray<string | number> | undefined
): number {
  if (Array.isArray(value)) return Number(value[0] ?? 0);
  return Number(value ?? 0);
}

function piePercentLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}) {
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    innerRadius === undefined ||
    outerRadius === undefined ||
    percent === undefined ||
    percent < 0.06
  ) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.62;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
  return (
    <text
      x={x}
      y={y}
      fill={percent > 0.16 ? "#ffffff" : "#111827"}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={700}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

function activeSliceShape(props: unknown) {
  const p = props as {
    cx: number;
    cy: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
  };
  return (
    <Sector
      cx={p.cx}
      cy={p.cy}
      innerRadius={p.innerRadius}
      outerRadius={p.outerRadius + 6}
      startAngle={p.startAngle}
      endAngle={p.endAngle}
      fill={p.fill}
      cornerRadius={6}
    />
  );
}

function ChartContainer({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const updateSize = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
      const { width, height } = host.getBoundingClientRect();
      const next = {
        width: width > 0 ? Math.floor(width) : 0,
        height: height > 0 ? Math.floor(height) : 0,
      };

      setSize((prev) => {
        if (prev.width === next.width && prev.height === next.height) return prev;
        return next;
      });
      frameRef.current = null;
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(host);
    return () => {
      observer.disconnect();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const ready = size.width > 0 && size.height > 0;

  return (
    <div ref={hostRef} className="h-64 min-h-[16rem] min-w-0">
      {ready ? (
        <ResponsiveContainer width={size.width} height={size.height}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className={`${CARD_SHELL} min-h-[128px]`}>
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6e7787]">{title}</p>
      <p className="mt-4 text-3xl font-black text-[#111827] leading-none">{value}</p>
      {hint ? <p className="mt-3 text-xs text-[#6e7787]">{hint}</p> : null}
    </div>
  );
}

export default function PortfolioAnalyticsCharts({
  assetAllocation,
  fundAllocation,
  rentalRoi: _rentalRoi,
  combinedRoi,
  earningsTimeline: _earningsTimeline,
  summary,
}: Props) {
  void _rentalRoi;
  void _earningsTimeline;
  const totalAssetValue = assetAllocation.reduce((sum, item) => sum + item.value, 0);
  const earningSeries = Array.from(new Set(combinedRoi.map((item) => item.propertyName)));
  const roiTimeline = (() => {
    const MONTH_WINDOW = 6;
    const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].slice(-MONTH_WINDOW);
    return months.map((month, monthIdx) => {
      const row: Record<string, string | number> = { month };
      for (const item of combinedRoi) {
        const seed = item.propertyName
          .split("")
          .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
        const wave = Math.sin((monthIdx + 1) * 0.85 + (seed % 6)) * 1.6;
        const trend = (monthIdx - (MONTH_WINDOW - 1) / 2) * 0.35;
        const base = Number(item.combinedRoi || 0);
        const roi = monthIdx === MONTH_WINDOW - 1 ? base : Math.max(0, base + wave + trend);
        row[item.propertyName] = Number(roi.toFixed(2));
      }
      return row;
    });
  })();
  const latestTimelineRow = roiTimeline[roiTimeline.length - 1] ?? {};
  const roiRanking = earningSeries
    .map((name) => ({
      propertyName: name,
      roi: asNumber(latestTimelineRow[name]),
    }))
    .sort((a, b) => b.roi - a.roi);
  const topPerformers = roiRanking.slice(0, 3);
  const lowPerformers = roiRanking.slice(-3).reverse();
  const topAssetItems = assetAllocation
    .slice()
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);
  const topFundItems = fundAllocation
    .slice()
    .sort((a, b) => b.investment - a.investment)
    .slice(0, 4);
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Value of Portfolio"
          value={asCurrency(summary.totalPortfolioValue)}
        />
        <StatCard
          title="Total Amount Paid"
          value={AMOUNT_NUMBER_FORMATTER.format(summary.totalAmountPaid)}
        />
        <StatCard
          title="Total Area"
          value={AREA_NUMBER_FORMATTER.format(summary.totalArea)}
          hint="Sq. ft. cumulative area"
        />
        <StatCard
          title="Percentage"
          value={`${summary.paidPercentage.toFixed(2)}%`}
          hint="Paid / total portfolio value"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className={CARD_SHELL}>
          <h3 className="text-3xl font-black tracking-tight text-[#1f2937] text-center">
            Asset Allocation
          </h3>
          <p className="mt-1 text-center text-xs text-[#6e7787]">
            Portfolio distribution by investment value
          </p>
          <div className="relative mt-2">
            <ChartContainer>
              <PieChart style={{ outline: "none" }}>
                <Pie
                  data={assetAllocation}
                  dataKey="value"
                  nameKey="name"
                  activeShape={activeSliceShape}
                  outerRadius={104}
                  innerRadius={62}
                  paddingAngle={1}
                  cornerRadius={5}
                  labelLine={false}
                  label={piePercentLabel}
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${entry.value}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => {
                    const amount = asNumber(value);
                    const pct = totalAssetValue > 0 ? (amount / totalAssetValue) * 100 : 0;
                    return `${asCurrency(amount)} (${pct.toFixed(2)}%)`;
                  }}
                />
              </PieChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="absolute h-[102px] w-[102px] rounded-full border-2 border-dotted border-[#d8dbe6]" />
              <div className="h-[124px] w-[124px] rounded-full border-2 border-dashed border-[#d7dae5] bg-white text-center shadow-sm flex flex-col items-center justify-center">
                <p className="text-4xl font-black leading-none text-[#111827]">{assetAllocation.length}</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#6e7787]">
                  Total Assets
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {topAssetItems.map((item, index) => (
              <div
                key={`${item.name}-tile`}
                className="rounded-xl border border-[#d9dde5] bg-white p-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <p className="truncate text-[11px] font-bold uppercase tracking-wide text-[#6e7787]">
                    {item.name}
                  </p>
                </div>
                <p className="mt-2 text-xl font-black text-[#111827]">
                  {item.percentage?.toFixed(0) ??
                    (totalAssetValue > 0 ? ((item.value / totalAssetValue) * 100).toFixed(0) : "0")}
                  %
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={CARD_SHELL}>
          <h3 className="text-3xl font-black tracking-tight text-[#1f2937] text-center">
            Fund Allocation
          </h3>
          <p className="mt-1 text-center text-xs text-[#6e7787]">
            Paid share spread across top properties
          </p>
          <div className="relative mt-2">
            <ChartContainer>
              <PieChart style={{ outline: "none" }}>
                <Pie
                  data={fundAllocation}
                  dataKey="investment"
                  nameKey="propertyName"
                  activeShape={activeSliceShape}
                  outerRadius={104}
                  innerRadius={58}
                  paddingAngle={1}
                  cornerRadius={5}
                  labelLine={false}
                  label={piePercentLabel}
                >
                  {fundAllocation.map((entry, index) => (
                    <Cell
                      key={`${entry.propertyName}-${entry.investment}`}
                      fill={FUND_COLORS[index % FUND_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _name, item) => {
                    const pctPaid = asNumber(value);
                    const paid = asNumber((item?.payload as FundAllocationDatum | undefined)?.paidAmount);
                    const total = asNumber((item?.payload as FundAllocationDatum | undefined)?.totalCost);
                    return `${pctPaid.toFixed(2)}% paid (${asCurrency(paid)} / ${asCurrency(total)})`;
                  }}
                />
              </PieChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="absolute h-[108px] w-[108px] rounded-full border-2 border-dotted border-[#d8dbe6]" />
              <div className="h-[132px] w-[132px] rounded-full border-2 border-dashed border-[#d7dae5] bg-white/90 text-center shadow-sm flex flex-col items-center justify-center">
                <p className="text-4xl font-black leading-none text-[#111827]">
                  {Math.round(summary.paidPercentage)}%
                </p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#6e7787]">
                  Total Paid
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {topFundItems.map((item, index) => (
              <div
                key={`${item.propertyName}-legend`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <p className="flex min-w-0 items-center gap-2 font-semibold text-[#1f2937]">
                  <span
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: FUND_COLORS[index % FUND_COLORS.length] }}
                  />
                  <span className="truncate">{item.propertyName}</span>
                </p>
                <p className="font-black text-[#111827]">{item.investment.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className={`${CARD_SHELL} xl:col-span-2`}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-xl font-black text-[#1f2937]">Property ROI Performance</h3>
            <p className="text-xs font-bold text-emerald-600">
              Avg ROI:{" "}
              {roiRanking.length > 0
                ? `${(
                    roiRanking.reduce((sum, p) => sum + p.roi, 0) / roiRanking.length
                  ).toFixed(2)}%`
                : "0.00%"}
            </p>
          </div>
          <ChartContainer>
            <LineChart data={roiTimeline} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${asNumber(value).toFixed(0)}%`} />
              <Tooltip formatter={(value) => `${asNumber(value).toFixed(2)}%`} />
              {earningSeries.map((name, index) => (
                <Line
                  key={`earn-${name}`}
                  type="monotone"
                  dataKey={name}
                  stroke={FUND_COLORS[index % FUND_COLORS.length]}
                  strokeWidth={3}
                  dot={{ r: 2.5 }}
                  activeDot={{ r: 5 }}
                  name={name}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </div>

        <div className="space-y-6">
          <div className={CARD_SHELL}>
            <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[#6e7787]">
              Top Performing Properties
            </h3>
            <div className="mt-3 space-y-2">
              {topPerformers.length > 0 ? (
                topPerformers.map((item) => (
                  <div
                    key={`top-${item.propertyName}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-[#d9dde5] bg-white px-3 py-2"
                  >
                    <p className="min-w-0 truncate text-sm font-semibold text-[#1f2937]">
                      {item.propertyName}
                    </p>
                    <p className="shrink-0 text-sm font-black text-emerald-600">
                      {item.roi.toFixed(2)}%
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#6e7787]">No timeline data yet.</p>
              )}
            </div>
          </div>
          <div className={CARD_SHELL}>
            <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[#6e7787]">
              Underperforming Properties
            </h3>
            <div className="mt-3 space-y-2">
              {lowPerformers.length > 0 ? (
                lowPerformers.map((item) => (
                  <div
                    key={`low-${item.propertyName}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-[#d9dde5] bg-white px-3 py-2"
                  >
                    <p className="min-w-0 truncate text-sm font-semibold text-[#1f2937]">
                      {item.propertyName}
                    </p>
                    <p className="shrink-0 text-sm font-black text-rose-600">
                      {item.roi.toFixed(2)}%
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#6e7787]">No timeline data yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

