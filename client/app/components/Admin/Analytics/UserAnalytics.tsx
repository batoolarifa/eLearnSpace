
"use client";

import React, { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  Users,
  UserPlus,
  TrendingUp,
  TrendingDown,
  BarChart3,
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
} from "recharts";

import { useGetUserAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";
import Loader from "../../../components/Loader/Loader";

type AnalyticsItem = {
  month: string;
  count: number;
};

export default function UserAnalytics() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, isLoading } = useGetUserAnalyticsQuery({});

  const monthlyData = useMemo(() => {
    const apiData: AnalyticsItem[] =
      data?.users?.last12Months ?? [];

    return apiData.map((item) => ({
      month: item.month,
      users: item.count,
    }));
  }, [data]);

  /*
   * KPI calculations
   */

  const totalUsers = useMemo(() => {
    return monthlyData.reduce(
      (sum, item) => sum + item.users,
      0
    );
  }, [monthlyData]);

  const thisMonth = monthlyData.length
    ? monthlyData[monthlyData.length - 1].users
    : 0;

  const previousMonth =
    monthlyData.length > 1
      ? monthlyData[monthlyData.length - 2].users
      : 0;

  const monthlyAverage = monthlyData.length
    ? Math.round(totalUsers / monthlyData.length)
    : 0;

  const growth =
    previousMonth === 0
      ? thisMonth > 0
        ? 100
        : 0
      : Math.round(
          ((thisMonth - previousMonth) /
            previousMonth) *
            100
        );

  const isGrowthPositive = growth > 0;
  const isGrowthNegative = growth < 0;

  /*
   * Chart styling
   */

  const gridColor = isDark
    ? "rgba(255,255,255,0.06)"
    : "#e2e8f0";

  const axisColor = isDark
    ? "#64748b"
    : "#94a3b8";

  const tooltipStyle = {
    backgroundColor: isDark
      ? "#1e293b"
      : "#ffffff",

    border: isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid #e2e8f0",

    borderRadius: "10px",

    color: isDark
      ? "#ffffff"
      : "#0f172a",

    fontSize: "12px",
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] overflow-hidden px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 sm:mb-8">

        <div className="flex items-start gap-3">

          <div className="shrink-0 rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500">
            <Users size={20} />
          </div>

          <div className="min-w-0">

            <h1 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl lg:text-[28px]">
              User Analytics
            </h1>

            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-sm">
              Overview of user registrations and growth
              across the last 12 months.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

        {/* TOTAL USERS */}

        <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:rounded-2xl sm:p-5">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">

              <p className="truncate text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-xs">
                Total Users
              </p>

              <p className="mt-1.5 text-xl font-semibold text-slate-900 dark:text-white sm:mt-2 sm:text-2xl">
                {totalUsers.toLocaleString()}
              </p>

              <p className="mt-1 hidden text-xs text-gray-400 dark:text-gray-500 sm:block">
                Last 12 months
              </p>

            </div>

            <div className="shrink-0 rounded-lg bg-emerald-500/10 p-2 text-emerald-500 sm:rounded-xl sm:p-2.5">
              <Users size={16} />
            </div>

          </div>

        </div>


        {/* THIS MONTH */}

        <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:rounded-2xl sm:p-5">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">

              <p className="truncate text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-xs">
                This Month
              </p>

              <p className="mt-1.5 text-xl font-semibold text-slate-900 dark:text-white sm:mt-2 sm:text-2xl">
                {thisMonth.toLocaleString()}
              </p>

              <p className="mt-1 hidden text-xs text-gray-400 dark:text-gray-500 sm:block">
                New registrations
              </p>

            </div>

            <div className="shrink-0 rounded-lg bg-blue-500/10 p-2 text-blue-500 sm:rounded-xl sm:p-2.5">
              <UserPlus size={16} />
            </div>

          </div>

        </div>


        {/* MONTHLY AVERAGE */}

        <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:rounded-2xl sm:p-5">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">

              <p className="truncate text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-xs">
                Monthly Average
              </p>

              <p className="mt-1.5 text-xl font-semibold text-slate-900 dark:text-white sm:mt-2 sm:text-2xl">
                {monthlyAverage.toLocaleString()}
              </p>

              <p className="mt-1 hidden text-xs text-gray-400 dark:text-gray-500 sm:block">
                Average registrations
              </p>

            </div>

            <div className="shrink-0 rounded-lg bg-purple-500/10 p-2 text-purple-500 sm:rounded-xl sm:p-2.5">
              <BarChart3 size={16} />
            </div>

          </div>

        </div>


        {/* GROWTH */}

        <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:rounded-2xl sm:p-5">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">

              <p className="truncate text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-xs">
                Monthly Growth
              </p>

              <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2">

                {isGrowthPositive && (
                  <TrendingUp
                    size={17}
                    className="shrink-0 text-emerald-500"
                  />
                )}

                {isGrowthNegative && (
                  <TrendingDown
                    size={17}
                    className="shrink-0 text-rose-500"
                  />
                )}

                {!isGrowthPositive &&
                  !isGrowthNegative && (
                    <span className="text-gray-400">
                      —
                    </span>
                  )}

                <p
                  className={`text-xl font-semibold sm:text-2xl ${
                    isGrowthPositive
                      ? "text-emerald-500"
                      : isGrowthNegative
                      ? "text-rose-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {growth > 0 ? "+" : ""}
                  {growth}%
                </p>

              </div>

              <p className="mt-1 hidden text-xs text-gray-400 dark:text-gray-500 sm:block">
                Compared with last month
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SIGNUP TREND
      ===================================================== */}

      <div className="mb-5 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:mb-6 sm:rounded-2xl sm:p-6">

        <div className="mb-5 flex items-start justify-between gap-3">

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <TrendingUp
                size={17}
                className="shrink-0 text-emerald-500"
              />

              <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                User Signup Trend
              </h2>

            </div>

            <p className="mt-1 text-[11px] leading-4 text-gray-500 dark:text-gray-400 sm:text-xs">
              New user registrations over the last 12
              months
            </p>

          </div>

          <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-500 sm:px-3 sm:text-xs">
            12 Months
          </span>

        </div>


        <div className="h-[230px] w-full sm:h-[300px]">

          {monthlyData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 5,
                  left: -25,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="userSignupGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#10b981"
                      stopOpacity={0.3}
                    />

                    <stop
                      offset="100%"
                      stopColor="#10b981"
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
                  dataKey="month"
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
                  contentStyle={tooltipStyle}
                  formatter={(value) => [
                    `${value} users`,
                    "Registrations",
                  ]}
                />


                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#userSignupGradient)"
                  activeDot={{
                    r: 4,
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          ) : (

            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              No user registration data available yet.
            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          MONTHLY BREAKDOWN
      ===================================================== */}

      <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:rounded-2xl sm:p-6">

        <div className="mb-5">

          <div className="flex items-center gap-2">

            <BarChart3
              size={17}
              className="text-emerald-500"
            />

            <h2 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
              Monthly User Registrations
            </h2>

          </div>

          <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs">
            Number of new users registered each month
          </p>

        </div>


        <div className="h-[230px] w-full sm:h-[300px]">

          {monthlyData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={monthlyData}
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
                  dataKey="month"
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
                  contentStyle={tooltipStyle}
                  formatter={(value) => [
                    `${value} users`,
                    "Registrations",
                  ]}
                />


                <Bar
                  dataKey="users"
                  fill="#10b981"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={40}
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              No user registration data available yet.
            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {monthlyData.length === 0 && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-white/[0.08] dark:bg-[#111827]">

          <Users
            size={30}
            className="mx-auto text-gray-400"
          />

          <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            No user data available
          </h3>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            User analytics will appear once registrations
            start coming in.
          </p>

        </div>
      )}

    </div>
  );
}
