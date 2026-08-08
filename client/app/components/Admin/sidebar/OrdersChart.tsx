import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { AnalyticsPoint } from "./analytics";


interface OrdersChartProps {
  theme: string;
  data: AnalyticsPoint[];
}



export default function OrdersChart({
  theme,
  data,
}: OrdersChartProps) {
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.06)" : "#e2e8f0";
  const axisColor = theme === "dark" ? "#64748b" : "#94a3b8";

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] dark:shadow-none">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Monthly Orders</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Last 7 days</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: -20, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month"
            tickFormatter={(value: string) => {
              return new Date(value).toLocaleDateString("en-US", {
                month: "short",
              });
            }}  stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
     
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: theme === "dark" ? "#1e293b" : "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "12px",
              color: theme === "dark" ? "#fff" : "#0f172a",
            }}
            cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.04)" : "#f1f5f9" }}
          />
          <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
