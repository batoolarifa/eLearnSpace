import React from "react";
import { TrendingUp, TrendingDown, Users, ShoppingCart,  LucideIcon, BookOpen } from "lucide-react";
import { AnalyticsPoint } from "./analytics";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  up: boolean;
  delta: string;
}

interface StatCardProps {
  stat: Stat;
}

interface StatsGridProps {
  users: AnalyticsPoint[];
  courses: AnalyticsPoint[];
  orders: AnalyticsPoint[];
}

function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon;
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-white/[0.08] dark:bg-[#111827] dark:shadow-none">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {stat.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {stat.value}
          </p>
        </div>
        <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500">
          <Icon size={18} />
        </div>
      </div>
      <div
        className={`mt-4 inline-flex items-center gap-1 text-xs font-medium ${
          stat.up ? "text-emerald-500" : "text-red-500"
        }`}
      >
        {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {stat.delta}
      </div>
    </div>
  );
}


export default function StatsGrid({
  users,
  courses,
  orders,
}: StatsGridProps) {

  const stats = [
    {
      label: "Total Users",
      value: users.reduce((sum, item) => sum + item.count, 0),
      icon: Users,
      up: true,
      delta: "",
    },
    {
      label: "Published Courses",
      value: courses.reduce((sum, item) => sum + item.count, 0),
      icon: BookOpen,
      up: true,
      delta: "",
    },
    {
      label: "Total Orders",
      value: orders.reduce((sum, item) => sum + item.count, 0),
      icon: ShoppingCart,
      up: true,
      delta: "",
    },

    {
    label: "New Users This Month",
    value: users.at(-1)?.count ?? 0,
    icon: Users,
    up: true,
    delta: "",
    }


    

    
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}