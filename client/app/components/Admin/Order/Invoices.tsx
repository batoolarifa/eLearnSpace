"use client";

import React, { useMemo } from "react";
import { FileText, DollarSign, ShoppingCart } from "lucide-react";
import { useGetAllOrdersQuery } from "../../../../redux/features/orders/orderApi";
import { useGetAllUsersQuery } from "../../../../redux/features/user/userApi";
import { useGetAllCoursesQuery } from "../../../../redux/features/courses/coursesApi";
import { format } from "timeago.js";
import Loader from "../../Loader/Loader";
import StatusPill from "../sidebar/StatusPill";

function Invoices() {
  const {
    isLoading: ordersLoading,
    data: ordersResponse,
  } = useGetAllOrdersQuery({});

  const {
    isLoading: usersLoading,
    data: userData,
  } = useGetAllUsersQuery({});

  const {
    isLoading: coursesLoading,
    data: courseData,
  } = useGetAllCoursesQuery({});

  const isLoading =
    ordersLoading || usersLoading || coursesLoading;

  const orders = ordersResponse?.orders ?? [];
  const users = userData?.users ?? [];
  const courses = courseData?.courses ?? [];

  const invoices = useMemo(() => {
    return orders.map((item: any) => {
      const user = users.find(
        (user: any) => user._id === item.userId
      );

      const course = courses.find(
        (course: any) => course._id === item.courseId
      );

      return {
        id: item._id,
        userName: user?.name || "Unknown User",
        userEmail: user?.email || "N/A",
        course: course?.name || "Unknown Course",
        amount: (item.payment_info?.amount || 0) / 100,
        status:
          item.payment_info?.status === "succeeded"
            ? "Paid"
            : "Pending",
        date: item.createdAt
          ? format(item.createdAt)
          : "N/A",
      };
    });
  }, [orders, users, courses]);

  const totalRevenue = invoices.reduce(
    (sum: number, invoice: any) => sum + invoice.amount,
    0
  );

  const paidInvoices = invoices.filter(
    (invoice: any) => invoice.status === "Paid"
  ).length;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-[1250px] p-5 lg:p-8">

      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white lg:text-[28px]">
          Invoices
        </h1>

        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          View all transactions and payment records.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111827]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Total Invoices
              </p>

              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {invoices.length}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500">
              <FileText size={18} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111827]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Paid
              </p>

              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {paidInvoices}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500">
              <ShoppingCart size={18} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111827]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Revenue
              </p>

              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500">
              <DollarSign size={18} />
            </div>
          </div>
        </div>

      </div>

      {/* Invoice Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#111827]">

        <div className="border-b border-slate-200/80 px-6 py-5 dark:border-white/[0.08]">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            All Invoices
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Latest payment transactions across the platform
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-left text-sm">

            <thead>
              <tr className="border-b border-slate-200/80 text-xs uppercase tracking-wider text-gray-400 dark:border-white/[0.08] dark:text-gray-500">

                <th className="px-6 py-3.5 font-medium">
                  Invoice
                </th>

                <th className="px-6 py-3.5 font-medium">
                  User
                </th>

                <th className="px-6 py-3.5 font-medium">
                  Course
                </th>

                <th className="px-6 py-3.5 font-medium">
                  Amount
                </th>

                <th className="px-6 py-3.5 font-medium">
                  Status
                </th>

                <th className="px-6 py-3.5 font-medium">
                  Date
                </th>

              </tr>
            </thead>

            <tbody>

              {invoices.length === 0 ? (

                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No invoices found.
                  </td>
                </tr>

              ) : (

                invoices.map((invoice: any) => (

                  <tr
                    key={invoice.id}
                    className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50 dark:border-white/[0.05] dark:hover:bg-[#1e293b]/40"
                  >

                    {/* Invoice */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900 dark:text-white">
                        #{invoice.id.slice(-6)}
                      </span>
                    </td>

                    {/* User */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-gray-200">
                          {invoice.userName}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                          {invoice.userEmail}
                        </p>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="max-w-[250px] px-6 py-4">
                      <p className="truncate text-gray-600 dark:text-gray-300">
                        {invoice.course}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-gray-200">
                      ${invoice.amount.toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusPill status={invoice.status} />
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {invoice.date}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        <div className="h-3" />

      </div>

    </div>
  );
}

export default Invoices;
