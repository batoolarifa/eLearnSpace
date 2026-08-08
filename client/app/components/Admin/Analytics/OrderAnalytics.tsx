"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import { useGetOrdersAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";
import Loader from "../../../components/Loader/Loader";

type DataPoint = {
  name: string;
  count: number;
};

export default function OrderAnalytics() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, isLoading } = useGetOrdersAnalyticsQuery({});

  const analyticsData: DataPoint[] =
    data?.orders?.last12Months?.map((item: any) => ({
      name: item.month,
      count: item.count,
    })) ?? [];

  if (isLoading) {
    return <Loader />;
  }

  const hasData =
    analyticsData.length > 0 &&
    analyticsData.some((item) => item.count > 0);

  const totalOrders = analyticsData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const thisMonth =
    analyticsData.length > 0
      ? analyticsData[analyticsData.length - 1].count
      : 0;

  const monthlyAverage =
    analyticsData.length > 0
      ? Math.round(totalOrders / analyticsData.length)
      : 0;
  
  const bestMonthData =
  analyticsData.length > 0
    ? analyticsData.reduce((best, current) =>
        current.count > best.count ? current : best
      )
    : null;

const bestMonth = bestMonthData?.name
  ? new Date(bestMonthData.name).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  : "-";

const bestMonthOrders = bestMonthData?.count ?? 0;

  const primaryColor = "#10b981";

  const gridColor = isDark
    ? "#ffffff14"
    : "#e2e8f0";

  const axisColor = isDark
    ? "#64748b"
    : "#94a3b8";

  const cardClass = isDark
    ? "border-white/[0.08] bg-[#111827]"
    : "border-slate-200/80 bg-white shadow-sm";

  const titleClass = isDark
    ? "text-white"
    : "text-slate-900";

  const mutedClass = isDark
    ? "text-slate-400"
    : "text-slate-500";

  const subMutedClass = isDark
    ? "text-slate-500"
    : "text-slate-400";

  /*
   * EMPTY STATE
   */
  if (!hasData) {
    return (
      <div className="w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-[1400px]">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500">
                <ShoppingCart size={20} />
              </div>

              <div className="min-w-0">
                <h1
                  className={`text-xl font-semibold tracking-tight sm:text-2xl lg:text-[28px] ${titleClass}`}
                >
                  Order Analytics
                </h1>

                <p
                  className={`mt-1 text-xs leading-5 sm:text-sm ${mutedClass}`}
                >
                  Order volume across the last 12 months.
                </p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div
            className={`rounded-2xl border p-8 text-center sm:p-12 ${cardClass}`}
          >
            <ShoppingCart
              size={32}
              className="mx-auto mb-4 text-emerald-500"
            />

            <h2
              className={`text-base font-semibold sm:text-lg ${titleClass}`}
            >
              No orders yet
            </h2>

            <p
              className={`mx-auto mt-2 max-w-md text-xs leading-5 sm:text-sm ${subMutedClass}`}
            >
              Once orders start coming in, your order analytics
              will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-3">
            <div className="shrink-0 rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500 sm:p-3">
              <ShoppingCart
                size={20}
                className="sm:h-6 sm:w-6"
              />
            </div>

            <div className="min-w-0">
              <h1
                className={`text-xl font-semibold tracking-tight sm:text-2xl lg:text-[28px] ${titleClass}`}
              >
                Order Analytics
              </h1>

              <p
                className={`mt-1 text-xs leading-5 sm:text-sm ${mutedClass}`}
              >
                Order volume across the last 12 months.
              </p>
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {/* TOTAL ORDERS */}
          <div
            className={`min-w-0 rounded-xl border p-3 sm:rounded-2xl sm:p-5 ${cardClass}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p
                  className={`truncate text-[10px] font-medium uppercase tracking-wide sm:text-xs ${mutedClass}`}
                >
                  Total Orders
                </p>

                <p
                  className={`mt-1.5 text-xl font-semibold tracking-tight sm:mt-2 sm:text-2xl ${titleClass}`}
                >
                  {totalOrders.toLocaleString()}
                </p>

                <p
                  className={`mt-1 hidden text-xs sm:block ${subMutedClass}`}
                >
                  Last 12 months
                </p>
              </div>

              <div className="shrink-0 rounded-lg bg-emerald-500/10 p-2 text-emerald-500 sm:rounded-xl sm:p-2.5">
                <ShoppingCart size={16} />
              </div>
            </div>
          </div>

          {/* THIS MONTH */}
          <div
            className={`min-w-0 rounded-xl border p-3 sm:rounded-2xl sm:p-5 ${cardClass}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p
                  className={`truncate text-[10px] font-medium uppercase tracking-wide sm:text-xs ${mutedClass}`}
                >
                  This Month
                </p>

                <p
                  className={`mt-1.5 text-xl font-semibold tracking-tight sm:mt-2 sm:text-2xl ${titleClass}`}
                >
                  {thisMonth.toLocaleString()}
                </p>

                <p
                  className={`mt-1 hidden text-xs sm:block ${subMutedClass}`}
                >
                  Current month orders
                </p>
              </div>

              <div className="shrink-0 rounded-lg bg-emerald-500/10 p-2 text-emerald-500 sm:rounded-xl sm:p-2.5">
                <TrendingUp size={16} />
              </div>
            </div>
          </div>

          {/* MONTHLY AVERAGE */}
          <div
            className={`min-w-0 rounded-xl border p-3 sm:rounded-2xl sm:p-5 ${cardClass}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p
                  className={`truncate text-[10px] font-medium uppercase tracking-wide sm:text-xs ${mutedClass}`}
                >
                  Monthly Average
                </p>

                <p
                  className={`mt-1.5 text-xl font-semibold tracking-tight sm:mt-2 sm:text-2xl ${titleClass}`}
                >
                  {monthlyAverage.toLocaleString()}
                </p>

                <p
                  className={`mt-1 hidden text-xs sm:block ${subMutedClass}`}
                >
                  Average per month
                </p>
              </div>

              <div className="shrink-0 rounded-lg bg-emerald-500/10 p-2 text-emerald-500 sm:rounded-xl sm:p-2.5">
                <ShoppingCart size={16} />
              </div>
            </div>
          </div>

          {/* BEST MONTH */}
          <div
            className={`min-w-0 rounded-xl border p-3 sm:rounded-2xl sm:p-5 ${cardClass}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p
                  className={`truncate text-[10px] font-medium uppercase tracking-wide sm:text-xs ${mutedClass}`}
                >
                  Best Month
                </p>

                <p
                  className={`mt-1.5 truncate text-xl font-semibold tracking-tight sm:mt-2 sm:text-2xl ${titleClass}`}
                >
                  {bestMonth}
                </p>

                <p
                  className={`mt-1 truncate text-[11px] sm:text-xs ${subMutedClass}`}
                >
                  {bestMonthOrders.toLocaleString()} orders
                </p>
              </div>

              <div className="shrink-0 rounded-lg bg-emerald-500/10 p-2 text-emerald-500 sm:rounded-xl sm:p-2.5">
                <TrendingUp size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
          {/* ORDER TREND */}
          <div
            className={`min-w-0 overflow-hidden rounded-xl border p-3.5 sm:rounded-2xl sm:p-6 ${cardClass}`}
          >
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp
                  size={17}
                  className="shrink-0 text-emerald-500"
                />

                <h2
                  className={`truncate text-sm font-semibold sm:text-base ${titleClass}`}
                >
                  Order Trend
                </h2>
              </div>

              <p
                className={`mt-1 text-[11px] leading-4 sm:text-xs ${subMutedClass}`}
              >
                Total orders placed over the last 12 months
              </p>
            </div>

            <div className="h-[230px] w-full min-w-0 sm:h-[300px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={analyticsData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -25,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="orderTrendGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={primaryColor}
                        stopOpacity={0.3}
                      />

                      <stop
                        offset="100%"
                        stopColor={primaryColor}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke={gridColor}
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: axisColor,
                      fontSize: 9,
                    }}
                    axisLine={{
                      stroke: gridColor,
                    }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fill: axisColor,
                      fontSize: 9,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />
                  

                  <Tooltip
            contentStyle={{
              backgroundColor: isDark
                ? "#1e293b"
                : "#ffffff",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "12px",
            }}
            labelStyle={{
              color: isDark
                ? "#ffffff"
                : "#0f172a",
            }}
            itemStyle={{
              color: isDark
                ? "#ffffff"
                : "#0f172a",
            }}
            cursor={{
              fill: primaryColor,
              fillOpacity: 0.08,
            }}
          />

                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={primaryColor}
                    strokeWidth={2}
                    fill="url(#orderTrendGradient)"
                    activeDot={{
                      r: 4,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MONTHLY BREAKDOWN */}
          <div
            className={`min-w-0 overflow-hidden rounded-xl border p-3.5 sm:rounded-2xl sm:p-6 ${cardClass}`}
          >
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <ShoppingCart
                  size={17}
                  className="shrink-0 text-emerald-500"
                />

                <h2
                  className={`truncate text-sm font-semibold sm:text-base ${titleClass}`}
                >
                  Monthly Breakdown
                </h2>
              </div>

              <p
                className={`mt-1 text-[11px] leading-4 sm:text-xs ${subMutedClass}`}
              >
                Orders placed per month
              </p>
            </div>

            <div className="h-[230px] w-full min-w-0 sm:h-[300px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={analyticsData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -25,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke={gridColor}
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: axisColor,
                      fontSize: 9,
                    }}
                    axisLine={{
                      stroke: gridColor,
                    }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fill: axisColor,
                      fontSize: 9,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />

                   <Tooltip
              contentStyle={{
                backgroundColor: isDark
                  ? "#1e293b"
                  : "#ffffff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "12px",
              }}
              labelStyle={{
                color: isDark
                  ? "#ffffff"
                  : "#0f172a",
              }}
              itemStyle={{
                color: isDark
                  ? "#ffffff"
                  : "#0f172a",
              }}
              cursor={{
                fill: primaryColor,
                fillOpacity: 0.08,
              }}
            />

                  <Bar
                    dataKey="count"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={38}
                  >
                    {analyticsData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={primaryColor}
                          fillOpacity={
                            entry.count ===
                              Math.max(
                                ...analyticsData.map(
                                  (item) => item.count
                                )
                              ) &&
                            entry.count > 0
                              ? 1
                              : 0.45
                          }
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM SUMMARY */}
        <div
          className={`mt-5 rounded-xl border p-4 sm:rounded-2xl sm:p-5 ${cardClass}`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p
                className={`text-sm font-semibold ${titleClass}`}
              >
                Order Performance
              </p>

              <p
                className={`mt-1 text-[11px] leading-5 sm:text-xs ${subMutedClass}`}
              >
                You received{" "}
                <span className="font-medium">
                  {thisMonth.toLocaleString()}
                </span>{" "}
                orders this month. Your highest-order
                month was{" "}
                <span className="font-medium">
                  {bestMonth}
                </span>{" "}
                with{" "}
                <span className="font-medium">
                  {bestMonthOrders.toLocaleString()}
                </span>{" "}
                orders.
              </p>
            </div>

            <div
              className="shrink-0 rounded-xl px-3 py-2 text-xs font-medium"
              style={{
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
              }}
            >
              Best: {bestMonth}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}