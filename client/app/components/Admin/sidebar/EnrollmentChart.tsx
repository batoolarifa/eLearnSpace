import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { AnalyticsPoint } from "./analytics";


interface EnrollmentChartProps {
    theme: string;
    data: AnalyticsPoint[];
}

export default function EnrollmentChart({
    theme,
    data,
}: EnrollmentChartProps) {

  
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.06)" : "#e2e8f0";
  const axisColor = theme === "dark" ? "#64748b" : "#94a3b8";

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] dark:shadow-none xl:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Enrollment Trends
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Monthly course enrollments
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ left: -20, right: 10 }}>
          <defs>
            <linearGradient id="enrollGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false}   />
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: theme === "dark" ? "#1e293b" : "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "12px",
              color: theme === "dark" ? "#fff" : "#0f172a",
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#enrollGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
