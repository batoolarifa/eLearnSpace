"use client";

import React, { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  BookOpen,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import { useGetCoursesAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";
import { useGetAllCoursesQuery } from "../../../../redux/features/courses/coursesApi";
import Loader from "../../../components/Loader/Loader";

type MonthlyAnalytics = {
  month: string;
  count: number;
};

type Course = {
  _id: string;
  name: string;
  price?: number;
  purchased?: number;
  ratings?: number;
  categories?: string;
  level?: string;
};

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
];

const CourseAnalytics = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
  } = useGetCoursesAnalyticsQuery({});

  const {
    data: coursesResponse,
    isLoading: coursesLoading,
  } = useGetAllCoursesQuery({});

  const isLoading = analyticsLoading || coursesLoading;

  const monthlyData: MonthlyAnalytics[] = useMemo(() => {
    return analyticsData?.courses?.last12Months ?? [];
  }, [analyticsData]);

  const courses: Course[] = useMemo(() => {
    return coursesResponse?.courses ?? [];
  }, [coursesResponse]);

  const totalCourses = courses.length;

  const totalEnrollments = courses.reduce(
    (sum, course) => sum + (course.purchased || 0),
    0
  );

  const averageRating =
    courses.length > 0
      ? courses.reduce(
          (sum, course) => sum + (course.ratings || 0),
          0
        ) / courses.length
      : 0;

  const averagePrice =
    courses.length > 0
      ? courses.reduce(
          (sum, course) => sum + (course.price || 0),
          0
        ) / courses.length
      : 0;

  const topCourses = useMemo(() => {
    return [...courses]
      .sort(
        (a, b) =>
          (b.purchased || 0) - (a.purchased || 0)
      )
      .slice(0, 6)
      .map((course) => ({
        name:
          course.name.length > 16
            ? `${course.name.slice(0, 16)}...`
            : course.name,
        enrollments: course.purchased || 0,
      }));
  }, [courses]);

  const categoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    courses.forEach((course) => {
      const category =
        course.categories?.trim() || "Other";

      categoryMap[category] =
        (categoryMap[category] || 0) + 1;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [courses]);

  const monthlyTrend = useMemo(() => {
    return monthlyData.map((item) => ({
      month: item.month,
      courses: item.count,
    }));
  }, [monthlyData]);

  const tooltipStyle = {
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    border: isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid #e2e8f0",
    borderRadius: "10px",
    color: isDark ? "#ffffff" : "#0f172a",
    fontSize: "12px",
  };

  const gridColor = isDark
    ? "rgba(255,255,255,0.06)"
    : "#e2e8f0";

  const axisColor = isDark
    ? "#64748b"
    : "#94a3b8";

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] overflow-hidden px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">

      {/* HEADER */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start gap-3">

          <div className="shrink-0 rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500">
            <BarChart3 size={20} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl lg:text-[28px]">
              Course Analytics
            </h1>

            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-sm">
              Overview of course performance, enrollments and
              publishing activity.
            </p>
          </div>

        </div>
      </div>

      {/* KPI CARDS */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

        {/* COURSES */}
        <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:rounded-2xl sm:p-5">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-xs">
                Total Courses
              </p>

              <p className="mt-1.5 text-xl font-semibold text-slate-900 dark:text-white sm:mt-2 sm:text-2xl">
                {totalCourses.toLocaleString()}
              </p>

              <p className="mt-1 hidden text-xs text-gray-400 dark:text-gray-500 sm:block">
                Available on platform
              </p>
            </div>

            <div className="shrink-0 rounded-lg bg-emerald-500/10 p-2 text-emerald-500 sm:rounded-xl sm:p-2.5">
              <BookOpen size={16} />
            </div>

          </div>
        </div>

        {/* ENROLLMENTS */}
        <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:rounded-2xl sm:p-5">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-xs">
                Enrollments
              </p>

              <p className="mt-1.5 text-xl font-semibold text-slate-900 dark:text-white sm:mt-2 sm:text-2xl">
                {totalEnrollments.toLocaleString()}
              </p>

              <p className="mt-1 hidden text-xs text-gray-400 dark:text-gray-500 sm:block">
                Across all courses
              </p>
            </div>

            <div className="shrink-0 rounded-lg bg-blue-500/10 p-2 text-blue-500 sm:rounded-xl sm:p-2.5">
              <Users size={16} />
            </div>

          </div>
        </div>

        {/* RATING */}
        <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:rounded-2xl sm:p-5">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-xs">
                Avg Rating
              </p>

              <p className="mt-1.5 flex items-center gap-1 text-xl font-semibold text-slate-900 dark:text-white sm:mt-2 sm:text-2xl">
                {averageRating.toFixed(1)}
                <Star
                  size={15}
                  className="fill-amber-400 text-amber-400"
                />
              </p>

              <p className="mt-1 hidden text-xs text-gray-400 dark:text-gray-500 sm:block">
                Across all courses
              </p>
            </div>

            <div className="shrink-0 rounded-lg bg-amber-500/10 p-2 text-amber-500 sm:rounded-xl sm:p-2.5">
              <Star size={16} />
            </div>

          </div>
        </div>

        {/* PRICE */}
        <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:rounded-2xl sm:p-5">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-xs">
                Avg Price
              </p>

              <p className="mt-1.5 truncate text-xl font-semibold text-slate-900 dark:text-white sm:mt-2 sm:text-2xl">
                ${averagePrice.toFixed(2)}
              </p>

              <p className="mt-1 hidden text-xs text-gray-400 dark:text-gray-500 sm:block">
                Current pricing
              </p>
            </div>

            <div className="shrink-0 rounded-lg bg-purple-500/10 p-2 text-purple-500 sm:rounded-xl sm:p-2.5">
              <DollarSign size={16} />
            </div>

          </div>
        </div>

      </div>

      {/* PUBLISHING TREND */}
      <div className="mb-5 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:mb-6 sm:rounded-2xl sm:p-6">

        <div className="mb-5 flex items-start justify-between gap-3">

          <div className="min-w-0">
            <div className="flex items-center gap-2">

              <TrendingUp
                size={17}
                className="shrink-0 text-emerald-500"
              />

              <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                Course Publishing Trend
              </h2>

            </div>

            <p className="mt-1 text-[11px] leading-4 text-gray-500 dark:text-gray-400 sm:text-xs">
              Courses published over the last 12 months
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-500 sm:px-3 sm:text-xs">
            12 Months
          </span>

        </div>

        <div className="h-[230px] w-full sm:h-[300px]">

          {monthlyTrend.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={monthlyTrend}
                margin={{
                  top: 5,
                  right: 5,
                  left: -25,
                  bottom: 0,
                }}
              >

                <defs>
                  <linearGradient
                    id="courseTrendGradient"
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
                />

                <Area
                  type="monotone"
                  dataKey="courses"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#courseTrendGradient)"
                  activeDot={{
                    r: 4,
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          ) : (

            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              No publishing data available yet.
            </div>

          )}

        </div>

      </div>

      {/* SECOND ROW */}
      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">

        {/* TOP COURSES */}
        <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:rounded-2xl sm:p-6">

          <div className="mb-5">

            <div className="flex items-center gap-2">

              <Users
                size={17}
                className="text-blue-500"
              />

              <h2 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                Top Courses
              </h2>

            </div>

            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs">
              Highest number of enrollments
            </p>

          </div>

          <div className="h-[270px] w-full min-w-0 sm:h-[300px]">

            {topCourses.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={topCourses}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 5,
                    left: -5,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    horizontal={false}
                    stroke={gridColor}
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{
                      fill: axisColor,
                      fontSize: 9,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={95}
                    tick={{
                      fill: axisColor,
                      fontSize: 9,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                  />

                  <Bar
                    dataKey="enrollments"
                    fill="#10b981"
                    radius={[
                      0,
                      5,
                      5,
                      0,
                    ]}
                    maxBarSize={22}
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                No course data available yet.
              </div>

            )}

          </div>

        </div>

        {/* CATEGORIES */}
        <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:rounded-2xl sm:p-6">

          <div className="mb-5">

            <div className="flex items-center gap-2">

              <PieChartIcon
                size={17}
                className="text-purple-500"
              />

              <h2 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                Course Categories
              </h2>

            </div>

            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs">
              Distribution by category
            </p>

          </div>

          <div className="h-[270px] w-full min-w-0 sm:h-[300px]">

            {categoryData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="43%"
                    innerRadius="28%"
                    outerRadius="48%"
                    paddingAngle={3}
                    dataKey="value"
                  >

                    {categoryData.map(
                      (_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    contentStyle={tooltipStyle}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={55}
                    wrapperStyle={{
                      fontSize: "10px",
                      color: isDark
                        ? "#94a3b8"
                        : "#64748b",
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                No category data available yet.
              </div>

            )}

          </div>

        </div>

      </div>

      {/* EMPTY STATE */}
      {courses.length === 0 && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-white/[0.08] dark:bg-[#111827]">

          <BookOpen
            size={30}
            className="mx-auto text-gray-400"
          />

          <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            No courses available
          </h3>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Course analytics will appear once courses are added.
          </p>

        </div>
      )}

    </div>
  );
};

export default CourseAnalytics;
