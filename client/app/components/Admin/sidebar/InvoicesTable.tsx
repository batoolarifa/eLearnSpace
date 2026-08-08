import React from "react";
import StatusPill from "./StatusPill";
import { useGetAllUsersQuery } from "../../../../redux/features/user/userApi";
import { useGetAllCoursesQuery } from "../../../../redux/features/courses/coursesApi";
import { format } from "timeago.js";
import Link from "next/link";


type Props = {
  orders: any[];
};


export default function InvoicesTable({ orders }: Props) {
  const { data: userData } = useGetAllUsersQuery({});
  const { data: courseData } = useGetAllCoursesQuery({});

  const users = userData?.users ?? [];
  const courses = courseData?.courses ?? [];

  const invoices = orders
    .map((item) => {
      const user = users.find(
        (user: any) => user._id === item.userId
      );

      const course = courses.find(
        (course: any) => course._id === item.courseId
      );

      return {
        id: item._id,
        user: user?.name || "Unknown User",
        course: course?.name || "Unknown Course",
        amount: `$${((item.payment_info?.amount || 0) / 100).toFixed(2)}`,
        status:
          item.payment_info?.status === "succeeded"
            ? "Paid"
            : "Pending",
        date: item.createdAt ? format(item.createdAt) : "N/A",
      };
    })
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#111827] dark:shadow-none">
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Recent Invoices
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Latest transactions across the platform
          </p>
        </div>
        <Link  href="/admin/invoices"  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors duration-200 hover:bg-slate-100 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-[#1e293b]">
          View all
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-t border-slate-200/80 text-xs uppercase tracking-wider text-gray-400 dark:border-white/[0.08] dark:text-gray-500">
              <th className="px-6 py-3 font-medium">Invoice</th>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Course</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Status</th>
               <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr
                key={inv.id}
                className="border-t border-slate-100 transition-colors duration-200 hover:bg-slate-50 dark:border-white/[0.05] dark:hover:bg-[#1e293b]/50"
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{inv.id.slice(-6)}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{inv.user}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{inv.course}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{inv.amount}</td>
                <td className="px-6 py-4">
                  <StatusPill status={inv.status} />
                </td>
                 <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{inv.date}</td>
                   
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-6" />
    </div>
  );
}

