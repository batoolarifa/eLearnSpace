import React from "react";
import StatsGrid from "./StatsGrid";
import EnrollmentChart from "./EnrollmentChart";
import OrdersChart from "./OrdersChart";
import InvoicesTable from "./InvoicesTable";
import {
  useGetUserAnalyticsQuery,
  useGetCoursesAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";
import Loader from "../../Loader/Loader";
import { useGetAllOrdersQuery } from "@/redux/features/orders/orderApi";


export default function DashboardContent({ theme }) {

  const { data: usersData, isLoading: usersLoading } =
  useGetUserAnalyticsQuery({});

  const { data: coursesData, isLoading: coursesLoading } =
    useGetCoursesAnalyticsQuery({});

  const { data: ordersData, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery({});

  const { data: ordersInvoicesData, isLoading } = useGetAllOrdersQuery({});




  if (usersLoading || coursesLoading || ordersLoading) {
  return <Loader />;
}
  return (
    <div className="mx-auto max-w-[1400px] p-5 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white lg:text-[28px]">
          Admin Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Manage users, courses, analytics and platform settings.
        </p>
      </div>
      
       <StatsGrid
        users={usersData?.users.last12Months?? []}
        courses={coursesData?.courses.last12Months ?? [] }
        orders={ordersData?.orders.last12Months}
       
      />

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <EnrollmentChart
          theme={theme}
          data={coursesData?.courses.last12Months ?? []}
          
        />

        <OrdersChart
          theme={theme}
          data={ordersData?.orders?.last12Months  ?? []}
               />
      </div>

      {/* <div className="mt-6">
        <InvoicesTable 
         orders={ordersInvoicesData?.orders ?? []}
        />
      </div> */}
    </div>
  );
}
